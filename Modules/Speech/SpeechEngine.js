// Copyright (c) 2026 JDSherbert. All rights reserved.

/**
 * Handles Speech playback, mute, and audio export
 */
export class SpeechEngine {
    constructor({ voiceSelect = null, rateInput = null, mute = true } = {}) {
        this.synth = window.speechSynthesis;
        this.voiceSelect = voiceSelect;
        this.rateInput = rateInput;
        this.mute = mute;
        this.voices = [];
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

    play(text) {
        if (this.mute || !text) return;

        const utter = new SpeechSynthesisUtterance(text);

        // Voice selection
        if (this.voiceSelect) {
            const idx = parseInt(this.voiceSelect.value);
            if (!isNaN(idx) && this.voices[idx]) {
                utter.voice = this.voices[idx];
            }
        }

        // Rate control
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
     * Export voice line to WAV/OGG using Web Audio API
     * (Browser TTS does not natively export, so we need workaround)
     */
    async exportToWav(text, fileName = "voice") {
        if (!text) return;

        // Use SpeechSynthesisUtterance with Web Audio API capture
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const dest = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(dest.stream);
        const chunks = [];

        mediaRecorder.ondataavailable = e => chunks.push(e.data);
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName + ".wav";
            a.click();
            URL.revokeObjectURL(url);
        };

        mediaRecorder.start();

        const utter = new SpeechSynthesisUtterance(text);

        if (this.voiceSelect) {
            const idx = parseInt(this.voiceSelect.value);
            if (!isNaN(idx) && this.voices[idx]) utter.voice = this.voices[idx];
        }

        if (this.rateInput) {
            const rate = parseFloat(this.rateInput.value);
            if (!isNaN(rate)) utter.rate = rate;
        }

        // Connect utterance to audio context
        const synth = window.speechSynthesis;
        synth.speak(utter);

        // Wait for utterance to finish
        utter.onend = () => {
            mediaRecorder.stop();
            audioContext.close();
        };
    }
}