// Copyright (c) 2026 JDSherbert. All rights reserved.

export function parseBBCode(text) {
    const tokens = [];

    const regex = /\[(\/?)(\w+)(?:=(\w+))?\]/g;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const [full, closing, tag, value] = match;

        // Add plain text before tag
        if (match.index > lastIndex) {
            tokens.push({
                type: "text",
                content: text.slice(lastIndex, match.index)
            });
        }

        tokens.push({
            type: closing ? "close" : "open",
            tag: tag,
            value: value || null
        });

        lastIndex = regex.lastIndex;
    }

    // Remaining text
    if (lastIndex < text.length) {
        tokens.push({
            type: "text",
            content: text.slice(lastIndex)
        });
    }

    return tokens;
}
