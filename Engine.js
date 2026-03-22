// Copyright (c) 2026 JDSherbert. All rights reserved.

import { parseBBCode } from './Modules/Commands/CommandParser.js';
import { renderPreview } from './Modules/Rendering/PreviewRenderer.js';
import { exportJSON } from './Modules/IO/Exporter.js';
import { importJSON } from './Modules/IO/Importer.js';
import { Languages } from './Modules/Localization/Languages.js';
import { DayNightManager } from './Modules/Accessibility/DayNight.js';
import { SpeechEngine } from './Modules/Speech/SpeechEngine.js';
import { Typewriter } from './Modules/Rendering/Typewriter.js';

export class Engine {
	constructor({
		inputSelector,
		previewSelector,
		languageSelectSelector,
		fileNameInputSelector,
		exportBtnSelector,
		characterNameSelector,
		portraitInputSelector,
		portraitPreviewSelector,
		refreshPreviewSelector,
		speedInputSelector
	}) {
		// DOM elements
		this.input = document.querySelector(inputSelector);
		this.preview = document.querySelector(previewSelector);
		this.languageSelect = document.querySelector(languageSelectSelector);
		this.fileNameInput = document.querySelector(fileNameInputSelector);
		this.exportBtn = document.querySelector(exportBtnSelector);
		this.characterNameInput = document.querySelector(characterNameSelector);
		this.portraitInput = document.querySelector(portraitInputSelector);
		this.portraitPreview = document.querySelector(portraitPreviewSelector);
		this.refreshPreviewBtn = document.querySelector(refreshPreviewSelector);
		this.speedInput = document.querySelector(speedInputSelector);
		this.themeToggleBtn = document.querySelector('#themeToggleBtn');
		this.portraitSideSelect = document.querySelector('#portraitSideSelect');
		this.portraitSide = "left"; // default
		// ElevenLabs API
		this.apiKeyInput = document.querySelector('#apiKeyInput');
		this.saveApiKeyBtn = document.querySelector('#saveApiKeyBtn');

		// State
		this.languages = Languages;
		this.currentLanguage = this.languages[0].code;
		this.dialogueData = {};
		this.languages.forEach(lang => this.dialogueData[lang.code] = "");
		this.characterName = "";
		this.portrait = "";

		// Init classes
		this.dayNight = new DayNightManager(this.themeToggleBtn);
		this.dayNight.init();

		// Speech
		this.voiceSelect = document.querySelector('#voiceSelect');
		this.voiceRate = document.querySelector('#voiceRate');
		this.playVoiceBtn = document.querySelector('#playVoiceBtn');
		this.stopVoiceBtn = document.querySelector('#stopVoiceBtn');
		this.muteVoiceBtn = document.querySelector('#muteVoiceBtn');
		this.exportVoiceBtn = document.querySelector('#exportVoiceBtn');
		this.speechEngine = new SpeechEngine({
			voiceSelect: this.voiceSelect,
			rateInput: this.voiceRate,
			mute: true
		});

		this.typewriter = null;
		this.heightInput = document.querySelector('#heightInput');

		this.init();
	}

	init() {

		// Theme system
		this.dayNight = new DayNightManager(this.themeToggleBtn);
		this.dayNight.init();

		// Localization
		this.updateLanguageDropdown();

		// Load saved API key from localStorage
		const savedApiKey = localStorage.getItem('elevenlabs_api_key') || '';
		if (this.apiKeyInput) {
			this.apiKeyInput.value = savedApiKey;
		}
		// Set API key in speech engine if it exists
		if (savedApiKey) {
			this.speechEngine.setApiKey(savedApiKey);
		}

		// Save API key button handler
		if (this.saveApiKeyBtn) {
			this.saveApiKeyBtn.addEventListener('click', async () => {
				const newKey = this.apiKeyInput.value.trim();

				if (!newKey) {
					localStorage.removeItem('elevenlabs_api_key');
					this.speechEngine.setApiKey(null);
					alert('API key cleared!');
					return;
				}

				// Validate key by trying to load voices
				this.speechEngine.apiKey = newKey;
				const isValid = await this.speechEngine.loadElevenLabsVoices();

				if (isValid) {
					localStorage.setItem('elevenlabs_api_key', newKey);
					alert('✓ API key saved and validated!');
				} else {
					alert('⚠️ Invalid API key. Please check and try again.');
					this.speechEngine.setApiKey(null);
				}
			});
		}

		// Events
		this.languageSelect.addEventListener('change', () => this.switchLanguage());
		this.input.addEventListener('input', () => this.handleInput());
		this.exportBtn.addEventListener('click', () => this.exportDialogue());
		this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
		this.characterNameInput.addEventListener('input', () => {
			this.characterName = this.characterNameInput.value;
			this.renderPreview();
		});

		this.portraitInput.addEventListener('change', (event) => {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					this.portrait = e.target.result;
					this.portraitPreview.src = this.portrait;
					this.renderPreview();
				};
				reader.readAsDataURL(file);
			}
		});

		this.portraitSideSelect.addEventListener('change', () => {
			this.portraitSide = this.portraitSideSelect.value;
			this.renderPreview();
		});

		const importInput = document.querySelector('#importInput');
		importInput.addEventListener('change', (event) => {
			const file = event.target.files[0];
			if (file) {
				this.loadDialogue(file);
				importInput.value = "";
			}
		});

		// Refresh (typewriter only)
		this.refreshPreviewBtn.addEventListener('click', () => {
			if (this.typewriter) this.typewriter.reset();
		});

		// Speech
		this.playVoiceBtn.addEventListener('click', () => {
			const text = this.dialogueData[this.currentLanguage] || "";
			this.speechEngine.play(text);
		});

		this.stopVoiceBtn.addEventListener('click', () => {
			this.speechEngine.stop();
		});

		this.muteVoiceBtn.addEventListener('click', () => {
			this.speechEngine.toggleMute();
			this.muteVoiceBtn.textContent = this.speechEngine.mute ? "🔇" : "🔊";
		});

		this.exportVoiceBtn.addEventListener('click', async () => {
			const text = this.dialogueData[this.currentLanguage] || "";
			await this.speechEngine.exportToWav(text, this.fileNameInput.value || "voice");
		});

		// Speed control
		this.speedInput.addEventListener('input', () => {
			if (this.typewriter) {
				this.typewriter.setSpeed(parseInt(this.speedInput.value));
			}
		});

		// Window height
		this.heightInput.addEventListener('input', () => {
			this.updateDialogueHeight();
		});
		this.updateDialogueHeight();

		this.renderPreview();
	}

	updateLanguageDropdown() {
		this.languageSelect.innerHTML = "";
		this.languages.forEach(lang => {
			const option = document.createElement("option");
			option.value = lang.code;
			option.textContent = `${lang.code} - ${lang.name}`;
			this.languageSelect.appendChild(option);
		});
		this.languageSelect.value = this.currentLanguage;
	}

	switchLanguage() {
		this.dialogueData[this.currentLanguage] = this.input.value;
		this.currentLanguage = this.languageSelect.value;
		this.input.value = this.dialogueData[this.currentLanguage] || "";
		this.renderPreview();
	}

	handleInput() {
		this.dialogueData[this.currentLanguage] = this.input.value;
		this.renderPreview();
	}

	renderPreview() {
		const rawText = this.dialogueData[this.currentLanguage];
		const dialogueHtml = renderPreview(parseBBCode(rawText));

		const previewBox = document.getElementById("previewBox");

		const isLeft = this.portraitSide === "left";

		previewBox.innerHTML = isLeft ? `
    		<div class="preview-portrait">
        		${this.portrait ? `<img src="${this.portrait}">` : ""}
    		</div>
    		<div class="preview-text">
        		<div class="preview-name">${this.characterName}</div>
        		<div id="typewriterText"></div>
    		</div>
		` : `
    		<div class="preview-text">
        		<div class="preview-name">${this.characterName}</div>
        		<div id="typewriterText"></div>
    		</div>
    		<div class="preview-portrait">
        		${this.portrait ? `<img src="${this.portrait}">` : ""}
    		</div>
		`;

		const textElement = document.getElementById("typewriterText");

		this.typewriter = new Typewriter(
			textElement,
			parseInt(this.speedInput.value) || 30
		);

		this.typewriter.start(dialogueHtml);
	}

	updateDialogueHeight() {
		const value = parseInt(this.heightInput.value) || 40;

		// Clamp (extra safety)
		const clamped = Math.max(10, Math.min(100, value));

		document.documentElement.style.setProperty(
			'--dialogue-height',
			clamped + '%'
		);
	}

	exportDialogue() {
		this.dialogueData[this.currentLanguage] = this.input.value;
		const fileName = this.fileNameInput.value || "dialogue";

		exportJSON({
			characterName: this.characterName,
			portrait: this.portrait,
			dialogue: this.dialogueData,
			parsed: parseBBCode(this.dialogueData[this.currentLanguage])
		}, fileName);
	}

	loadDialogue(file) {
		importJSON(file)
			.then((data) => {
				this.languages.forEach(lang => {
					this.dialogueData[lang.code] = data.dialogue[lang.code] || "";
				});
				this.characterName = data.characterName || "";
				this.characterNameInput.value = this.characterName;
				this.portrait = data.portrait || "";
				this.portraitPreview.src = this.portrait;

				this.currentLanguage = this.languages[0].code;
				this.input.value = this.dialogueData[this.currentLanguage];
				this.updateLanguageDropdown();
				this.renderPreview();
			})
			.catch(err => {
				alert(err);
				console.error(err);
			});
	}
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
	new Engine({
		inputSelector: '#dialogueInput',
		previewSelector: '#preview',
		languageSelectSelector: '#languageSelect',
		fileNameInputSelector: '#fileNameInput',
		exportBtnSelector: '#exportBtn',
		characterNameSelector: '#characterNameInput',
		portraitInputSelector: '#portraitInput',
		portraitPreviewSelector: '#portraitPreview',
		refreshPreviewSelector: '#refreshPreviewBtn',
		speedInputSelector: '#speedInput'
	});
});