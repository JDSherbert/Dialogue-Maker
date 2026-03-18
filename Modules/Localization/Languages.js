// Copyright (c) 2026 JDSherbert. All rights reserved.

export const Languages = [
    { code: "ENG", name: "English" },
    { code: "JP", name: "Japanese" },
    { code: "FR", name: "French" },
    { code: "DE", name: "German" },
    { code: "ES", name: "Spanish" }
];

export function getLanguageCodes() {
    return Languages.map(l => l.code);
}

export function getLanguageName(code) {
    const lang = Languages.find(l => l.code === code);
    return lang ? lang.name : code;
}
