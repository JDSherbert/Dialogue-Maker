// Copyright (c) 2026 JDSherbert. All rights reserved.

/**
 * Handles theme detection, toggling, and persistence
 */
export class DayNightManager {
    constructor(toggleButton) {
        this.toggleButton = toggleButton;
        this.currentTheme = "light";
    }

    init() {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? "dark" : "light";
        }

        this.applyTheme();
        this.updateIcon();

        this.toggleButton.addEventListener('click', () => this.toggle());

        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (!localStorage.getItem("theme")) {
                    this.currentTheme = e.matches ? "dark" : "light";
                    this.applyTheme();
                    this.updateIcon();
                }
            });
    }

    toggle() {
        this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", this.currentTheme);

        this.applyTheme();
        this.updateIcon();
    }

    applyTheme() {
        document.documentElement.setAttribute("data-theme", this.currentTheme);
    }

    updateIcon() {
        if (!this.toggleButton) return;

        this.toggleButton.textContent =
            this.currentTheme === "light" ? "☀️" : "🌙";
    }

    /**
     * Optional: clear user preference (revert to system)
     */
    resetToSystem() {
        localStorage.removeItem("theme");
        this.init();
    }
}