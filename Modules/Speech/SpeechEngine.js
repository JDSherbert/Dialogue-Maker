// Copyright (c) 2026 JDSherbert. All rights reserved.

/**
 * Handles Speech playback, mute, and audio export using ElevenLabs TTS
 */
export class SpeechEngine {
    constructor({ voiceSelect = null, rateInput = null, mute = true } = {}) {
        this.synth = window.speechSynthesis;
        this.voiceSelect = voiceSelect;
        this.rateInput = rateInput;
        this.mute = mute;
        this.voices = [];
        this.apiKey = null;
        this.elevenLabsVoices = [];
        
        // Populate browser voices for preview
        this.populateVoices();
        this.synth.onvoiceschanged = () => this.populateVoices();
    }

    populateVoices() {
        this.voices = this.synth.getVoices();
        if (this.voiceSelect) {
            this.voiceSelect.innerHTML = "";
            this.voices.forEach((v, i) => {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `${v.name} (${v.lang})`;
                this.voiceSelect.appendChild(option);
            });
        }
    }

    /**
     * Set API key and load available voices
     */
    async setApiKey(key) {
        this.apiKey = key;
        if (key && key.trim()) {
            await this.loadElevenLabsVoices();
        }
    }

    /**
     * Load available ElevenLabs voices
     */
    async loadElevenLabsVoices() {
        try {
            const response = await fetch('https://api.elevenlabs.io/v1/voices', {
                headers: {
                    'xi-api-key': this.apiKey
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.elevenLabsVoices = data.voices;
                console.log(`✓ Loaded ${this.elevenLabsVoices.length} ElevenLabs voices`);
                return true;
            } else {
                const error = await response.json();
                console.error("Failed to load voices:", error);
                return false;
            }
        } catch (err) {
            console.error("Failed to load ElevenLabs voices:", err);
            return false;
        }
    }

    play(text) {
        if (this.mute || !text) return;

        const utter = new SpeechSynthesisUtterance(text);

        if (this.voiceSelect) {
            const idx = parseInt(this.voiceSelect.value);
            if (!isNaN(idx) && this.voices[idx]) {
                utter.voice = this.voices[idx];
            }
        }

        if (this.rateInput) {
            const rate = parseFloat(this.rateInput.value);
            if (!isNaN(rate)) utter.rate = rate;
        }

        this.synth.speak(utter);
    }

    stop() {
        this.synth.cancel();
    }

    toggleMute() {
        this.mute = !this.mute;
    }

    /**
     * Export voice line to audio file
     * Uses ElevenLabs if API key is set, otherwise generates placeholder
     */
    async exportToWav(text, fileName = "voice") {
        if (!text) {
            alert("No text to export!");
            return;
        }

        // Check if API key is set
        if (!this.apiKey || !this.apiKey.trim()) {
            const userWantsKey = confirm(
                "No ElevenLabs API key set.\n\n" +
                "Without an API key, a silent placeholder WAV will be generated.\n\n" +
                "Would you like to add an API key for real TTS audio?\n" +
                "(Get a free key at elevenlabs.io)"
            );
            
            if (userWantsKey) {
                alert("Please enter your API key in the field at the top and click 'Save'.");
                return;
            } else {
                // Generate placeholder
                await this.exportPlaceholderWav(text, fileName);
                return;
            }
        }

        // Export with ElevenLabs
        await this.exportWithElevenLabs(text, fileName);
    }

    /**
     * Export using ElevenLabs TTS API
     */
    async exportWithElevenLabs(text, fileName) {
        try {
            // Show loading message
            console.log("Generating audio with ElevenLabs...");

            // Use first available voice or default Rachel voice
            const voiceId = this.elevenLabsVoices.length > 0 
                ? this.elevenLabsVoices[0].voice_id 
                : "21m00Tcm4TlvDq8ikWAM";

            // Call ElevenLabs API
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                        style: 0.0,
                        use_speaker_boost: true
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail?.message || `API Error: ${response.status}`);
            }

            // Get audio blob (MP3 format)
            const audioBlob = await response.blob();

            // Option 1: Save as MP3 (smaller file size, widely supported)
            const url = URL.createObjectURL(audioBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${fileName}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log("✓ Audio exported successfully");
            alert("Voice exported successfully!");

            // Optional: Convert to WAV if you really need WAV format
            // Uncomment below to convert MP3 to WAV:
            /*
            const wavBlob = await this.mp3ToWav(audioBlob);
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${fileName}.wav`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            */

        } catch (err) {
            console.error("Export failed:", err);
            
            let errorMsg = `Failed to export audio: ${err.message}\n\n`;
            
            if (err.message.includes('401') || err.message.includes('Unauthorized')) {
                errorMsg += "Your API key is invalid. Please check it and try again.";
            } else if (err.message.includes('quota')) {
                errorMsg += "You've exceeded your API quota. Check your ElevenLabs account.";
            } else if (err.message.includes('network') || err.message.includes('Failed to fetch')) {
                errorMsg += "Network error. Check your internet connection.";
            } else {
                errorMsg += "Please check:\n- API key is valid\n- You have credits remaining\n- Internet connection is working";
            }
            
            alert(errorMsg);
        }
    }

    /**
     * Generate a silent placeholder WAV file
     */
    async exportPlaceholderWav(text, fileName) {
        try {
            // Estimate duration based on text length
            const wordCount = text.split(' ').length;
            const duration = Math.max(1, wordCount * 0.4); // ~150 words per minute
            const sampleRate = 44100;
            const numSamples = Math.floor(sampleRate * duration);

            // Create silent audio buffer
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const buffer = audioContext.createBuffer(1, numSamples, sampleRate);

            // Convert to WAV
            const wavBlob = this.audioBufferToWav(buffer);

            // Download
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${fileName}_placeholder.wav`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            await audioContext.close();
            
            alert("Placeholder WAV exported (silent audio).\n\nAdd an ElevenLabs API key for real TTS audio!");

        } catch (err) {
            console.error("Placeholder export failed:", err);
            alert("Failed to export placeholder: " + err.message);
        }
    }

    /**
     * Convert MP3 blob to WAV (optional)
     */
    async mp3ToWav(mp3Blob) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await mp3Blob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const wavBlob = this.audioBufferToWav(audioBuffer);
        await audioContext.close();
        
        return wavBlob;
    }

    /**
     * Convert AudioBuffer to WAV format
     */
    audioBufferToWav(buffer) {
        const length = buffer.length * buffer.numberOfChannels * 2;
        const arrayBuffer = new ArrayBuffer(44 + length);
        const view = new DataView(arrayBuffer);
        const channels = [];
        const sampleRate = buffer.sampleRate;
        const numChannels = buffer.numberOfChannels;
        
        let offset = 0;
        
        const writeString = (str) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset++, str.charCodeAt(i));
            }
        };
        
        // RIFF chunk descriptor
        writeString('RIFF');
        view.setUint32(4, 36 + length, true);
        writeString('WAVE');
        
        // FMT sub-chunk
        writeString('fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true);
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        
        // Data sub-chunk
        writeString('data');
        view.setUint32(40, length, true);
        
        offset = 44;
        
        for (let i = 0; i < numChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }
        
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < numChannels; channel++) {
                let sample = Math.max(-1, Math.min(1, channels[channel][i]));
                sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                view.setInt16(offset, sample, true);
                offset += 2;
            }
        }
        
        return new Blob([arrayBuffer], { type: 'audio/wav' });
    }
}