// Copyright (c) 2026 JDSherbert. All rights reserved.

/**
 * Import a dialogue JSON file and return the parsed data.
 * @param {File} file - The JSON file selected by the user
 * @returns {Promise<Object>} Resolves with the dialogue data
 */
export function importJSON(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file provided");
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (!data.dialogue || typeof data.dialogue !== 'object') {
                    reject("Invalid dialogue JSON structure.");
                    return;
                }

                resolve(data);
            } catch (err) {
                reject("Failed to parse JSON: " + err.message);
            }
        };

        reader.onerror = () => {
            reject("Failed to read file");
        };

        reader.readAsText(file);
    });
}