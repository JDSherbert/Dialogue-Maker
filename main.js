// Copyright (c) 2026 JDSherbert. All rights reserved.

import { parseBBCode } from './Modules/Commands/CommandParser.js';
import { renderPreview } from './Modules/Rendering/PreviewRenderer.js';
import { exportJSON } from './Modules/IO/Exporter.js';

const input = document.getElementById('dialogueInput');
const preview = document.getElementById('preview');
const exportBtn = document.getElementById('exportBtn');

input.addEventListener('input', () => {
    const rawText = input.value;

    const parsed = parseBBCode(rawText);
    const html = renderPreview(parsed);

    preview.innerHTML = html;
});

exportBtn.addEventListener('click', () => {
    const rawText = input.value;

    const parsed = parseBBCode(rawText);

    exportJSON({
        character: "Example",
        dialogue: rawText,
        parsed: parsed
    });
});
