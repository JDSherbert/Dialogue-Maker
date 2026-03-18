// Copyright (c) 2026 JDSherbert. All rights reserved.

export function exportJSON(data, fileName = "dialogue") {
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    // Ensure .json extension
    const safeName = fileName.endsWith(".json") ? fileName : fileName + ".json";

    a.download = safeName;
    a.click();

    URL.revokeObjectURL(url);
}
