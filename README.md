![image]()

# Dialogue Maker

<!-- Header Start -->
<img align="right" alt="Stars Badge" src="https://img.shields.io/github/stars/jdsherbert/Dialogue-Maker?label=%E2%AD%90"/>
<img align="right" alt="Forks Badge" src="https://img.shields.io/github/forks/jdsherbert/Dialogue-Maker?label=%F0%9F%8D%B4"/>
<img align="right" alt="Watchers Badge" src="https://img.shields.io/github/watchers/jdsherbert/Dialogue-Maker?label=%F0%9F%91%81%EF%B8%8F"/>
<img align="right" alt="Issues Badge" src="https://img.shields.io/github/issues/jdsherbert/Dialogue-Maker?label=%E2%9A%A0%EF%B8%8F"/>

<a href = "https://developer.mozilla.org/en-US/docs/Web/JavaScript"> <img height="40" img width="40" src="https://cdn.simpleicons.org/javascript"> </a>
<a href = "https://www.json.org/json-en.html"> <img height="40" img width="40" src="https://cdn.simpleicons.org/json/red"> </a> 
<!-- Header End --> 

-----------------------------------------------------------------------

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"> 
  <img align="left" alt="Web Tool" src="https://img.shields.io/badge/Web%20Tool-blue?style=for-the-badge&logo=javascript&logoColor=white&color=blue&labelColor=blue"> </a>
  
<a href="https://choosealicense.com/licenses/mit/"> 
  <img align="right" alt="License" src="https://img.shields.io/badge/License%20:%20MIT-black?style=for-the-badge&logo=mit&logoColor=white&color=black&labelColor=black"> </a>
  
<br></br>

-----------------------------------------------------------------------

# Dialogue Maker

**Dialogue Maker** is a modular, browser-based dialogue authoring and processing system designed for structured dialogue creation, transformation, and preview.

The system is built around a **pipeline-based architecture** with clearly separated modules responsible for parsing, processing, rendering, and exporting dialogue data.

---

## 🧠 Overview

This project implements a **modular dialogue processing engine** that enables:

- Structured dialogue authoring  
- Real-time preview rendering  
- Command parsing (inline dialogue scripting)  
- Multi-language support  
- Audio / TTS generation and playback  
- Import/export of structured dialogue data  

The architecture follows a **layered and event-driven design**, with a central engine coordinating a set of independent modules.

---

## 🏗️ Architecture

```
[ HTML UI ]
     ↓ (user interaction)
[ Engine.js ]
     ↓
[ Module System ]
     ├── Accessibility
     ├── Commands
     ├── IO
     ├── Localization
     ├── Rendering
     └── Speech
     ↓
[ Processed Data ]
     ↓
[ Preview / Export / Audio Output ]
```

---

## 🧩 Modules

### Accessibility
- `DayNight.js`  
- Handles UI theme and accessibility-related state  

### Commands
- `CommandParser.js`  
- Parses inline command syntax (BBCode-style) within dialogue text  
- Enables embedded formatting and behavioural instructions  

### IO
- `Importer.js`  
- `Exporter.js`  
- Handles structured JSON import/export  
- Enables editing and persistence of dialogue data  

### Localization
- `Languages.js`  
- Provides multi-language support  
- Allows dialogue to be authored and viewed across different locales  

### Rendering
- `PreviewRender.js`  
- `Typewriter.js`  
- Responsible for live preview rendering of dialogue  
- Simulates in-game presentation behaviour  

### Speech
- `SpeechEngine.js`  
- Handles text-to-speech processing  
- Generates and plays audio  
- Supports exporting generated voice assets  

---

## 🔁 Data Flow

```
User Input
    ↓
Engine.js (Orchestration)
    ↓
Modules (Parse → Process → Transform)
    ↓
Structured Data (JSON)
    ↓
Rendering / Speech / Export
```

---

## ⚙️ Design Principles

- **Separation of Concerns**  
- **Modular Architecture**  
- **Pipeline-Based Processing**  
- **Event-Driven Interaction**  
- **Data-Driven Output**  

---

## 🎬 Features

- Dialogue authoring interface  
- Inline command parsing system  
- Character portrait support  
- Live preview rendering  
- Typewriter text effects  
- Multi-language support  
- Voice playback and export (TTS)  
- Import/export of structured dialogue data  
- Theme (light/dark) support  

---

## 📦 Technologies

- JavaScript (ES Modules)  
- HTML5 / CSS3  
- Browser-based architecture  
- Modular system design  

---

## 📁 Project Structure

```
/index.html          → UI layer
/Engine.js           → Orchestration layer
/Modules/            → Modular system components
  /Accessibility/
  /Commands/
  /IO/
  /Localization/
  /Rendering/
  /Speech/
/Style.css           → UI styling
```

---

## 🔮 Future Work

- Backend API integration  
- Real-time collaboration features  
- Advanced dialogue graph system  
- Plugin/module extensibility system  
- Integration with game engines  
- Cloud-based storage and processing  

---

