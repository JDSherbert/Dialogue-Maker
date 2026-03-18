// Copyright (c) 2026 JDSherbert. All rights reserved.

export function renderPreview(tokens) {
    let html = "";
    const stack = [];

    tokens.forEach(token => {
        if (token.type === "text") {
            html += token.content;
        }

        if (token.type === "open") {
            switch (token.tag) {
                case "color":
                    html += `<span style="color:${token.value}">`;
                    stack.push("</span>");
                    break;

                case "shake":
                    html += `<span class="shake">`;
                    stack.push("</span>");
                    break;

                default:
                    html += `<span>`;
                    stack.push("</span>");
            }
        }

        if (token.type === "close") {
            html += stack.pop() || "";
        }
    });

    return html;
}
