// Copyright (c) 2026 JDSherbert. All rights reserved.

export function exportJSON(data, fileName = "dialogue") {
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    // Ensure sanitization and .json extension
    const sanitizedName = sanitizeFileName(fileName);
    const safeName = sanitizedName.endsWith(".json") ? sanitizedName : sanitizedName + ".json";

    a.download = safeName;
    a.click();

    URL.revokeObjectURL(url);
}

function sanitizeFileName(name) {
    return name.replace(/[^a-z0-9_\-]/gi, "_");
}
