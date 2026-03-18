// Copyright (c) 2026 JDSherbert. All rights reserved.

import { parseBBCode } from './Modules/Commands/CommandParser.js';
import { renderPreview } from './Modules/Rendering/PreviewRenderer.js';
import { exportJSON } from './Modules/IO/Exporter.js';
import { Languages } from './Modules/Localization/Languages.js';

const input = document.getElementById('dialogueInput');
const preview = document.getElementById('preview');
const exportBtn = document.getElementById('exportBtn');



input.addEventListener('input', () => {
    const rawText = input.value;

    const parsed = parseBBCode(rawText);
    const html = renderPreview(parsed);

    preview.innerHTML = html;
});

function updateLanguageDropdown() {
    languageSelect.innerHTML = "";

    Languages.forEach(lang => {
        const option = document.createElement("option");
        option.value = lang.code;
        option.textContent = `${lang.code} - ${lang.name}`;
        languageSelect.appendChild(option);
    });

    languageSelect.value = currentLanguage;
}

const fileNameInput = document.getElementById('fileNameInput');

exportBtn.addEventListener('click', () => {
    const rawText = input.value;

    const parsed = parseBBCode(rawText);

    const fileName = fileNameInput.value || "dialogue";

    exportJSON({
        character: "Example",
        dialogue: rawText,
        parsed: parsed
    }, fileName);
});
