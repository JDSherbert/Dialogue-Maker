// Copyright (c) 2026 JDSherbert. All rights reserved.

export class Typewriter {
    constructor(targetElement, speed = 30) {
        this.targetElement = targetElement;
        this.speed = speed;
        this.text = "";
        this.index = 0;
        this.timer = null;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    start(text) {
        this.stop();
        this.text = text;
        this.index = 0;
        this.targetElement.innerHTML = "";
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.targetElement.innerHTML += this.text[this.index];
            this.index++;
            this.timer = setTimeout(() => this.type(), this.speed);
        }
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    reset() {
        this.start(this.text);
    }
}