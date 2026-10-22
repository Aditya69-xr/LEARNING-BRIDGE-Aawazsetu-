# 🎙️ AawazSetu (आवाज़ सेतु)
### AI-Powered Multilingual Pedagogy & Real-Time Classroom Bridge for Mother-Tongue Primary Education

> **Bridging the gap between children's home languages/dialects and standard school curriculum in Foundational Literacy & Numeracy (FLN / NEP 2020 / NIPUN Bharat).**

---

## 🌟 Overview

**AawazSetu (आवाज़ सेतु)** is a high-performance, voice-first educational platform and backend API engine designed for primary school teachers and young learners across India. It provides real-time dual-channel speech translation between teachers and students supporting **English, हिन्दी (Hindi), भोजपुरी (Bhojpuri), मराठी (Marathi), தமிழ் (Tamil)**, and 140+ regional Indian dialects, AI-generated culturally grounded vernacular stories, phonics scoring coaches, and NCERT-aligned bilingual lesson plans.

---

## 🇮🇳 Multilingual Core Capabilities

AawazSetu features dedicated pedagogical models and datasets for:
1. **🇬🇧 English (Indian / Global)**: Scaffolding foundational English vocabulary and concepts for bilingual classrooms.
2. **🇮🇳 हिन्दी (Standard Hindi)**: Pan-Indian NCERT foundational literacy and numeracy standard.
3. **🌾 भोजपुरी (Bhojpuri - Purvanchal & Bihar)**: Rural agrarian analogies, local vocabulary, and folk dialogues.
4. **🚩 मराठी (Marathi & Varhadi - Maharashtra)**: Nature-connected Vidarbha & Sahyadri regional pedagogy.
5. **🏛️ தமிழ் (Tamil - Tamil Nadu & Puducherry)**: Classical Dravidian FLN roots with rich cultural context.
6. **Additional Regional Dialects**: Maithili, Awadhi, Santali (Ol Chiki), Bengali, Telugu, Gujarati, and Odia.

---

## 🚀 Key Features & Modules

1. **🎙️ सेतु वाणी (Live Classroom Voice Bridge & Dialogue Hub)**:
   - Authentic Indian smart classroom interface: **गुरुजी पटल (Teacher Console)** & **विद्यार्थी पटल (Student Pod)**.
   - Dual-channel microphone input with live canvas audio waveform visualizer.
   - Instant 1-click **5-Language Quick Selector** (English | Hindi | Bhojpuri | Marathi | Tamil).
   - Real-time bilingual transcript cards with phonetic transliteration and **"💡 सेतु सूत्र" (Pedagogical Bridge Analogies)**.
   - One-click Text-to-Speech (TTS) audio playback in authentic regional accents.

2. **📖 कथा सेतु (AI Vernacular Story Studio)**:
   - Generates culturally grounded bilingual stories and rhymes across Grade Levels (Balvatika to Class 5) and Themes.
   - One-click full-story vernacular voice narration and keyword glossaries.

3. **🗣️ बोलो और सीखो (Bolo & Seekho Phonics Coach)**:
   - 3D interactive flip flashcards for foundational literacy in English, Devanagari, and Tamil scripts.
   - Real-time pronunciation scoring, syllable breakdown, pitch modulation hints, and star achievements.

4. **📝 पाठ सेतु (Vernacular Lesson Planner & Worksheet Creator)**:
   - Converts standard textbook chapters into 40-minute culturally-grounded lesson plans.
   - Printable student worksheets and blackboard diagrams.

5. **📊 प्रगति सेतु (FLN Learning Analytics)**:
   - Real-time metrics tracking classroom comprehension rates, vocabulary milestones, and regional reach.

6. **📡 AawazSetu REST API Backend Server (Port 8080)**:
   - Asynchronous, multi-threaded backend server with zero external dependencies.
   - Endpoints:
     - `GET /api/health` - Server health & active model registry.
     - `POST /api/translate` - Real-time multilingual translation & pedagogical bridging.
     - `POST /api/classroom/message` - Classroom dialogue processing & session logging.
     - `POST /api/stories/generate` - AI vernacular story generator.
     - `POST /api/phonics/evaluate` - AI phonics pronunciation scoring.
     - `POST /api/lesson-plans/generate` - 40-min FLN bilingual lesson plans.
     - `GET /api/dialects` - 140+ Indian dialect linguistic registry.

---

## 📂 Project Structure

```
d:\AAWAZSETU\
├── .vscode/
│   ├── tasks.json          # VS Code build and run tasks for backend server
│   ├── launch.json         # F5 debug and browser launch configuration
│   ├── settings.json       # Workspace settings
│   └── extensions.json     # Recommended VS Code extensions
├── backend/
│   ├── server.ps1          # High-performance .NET/PowerShell REST API & static server
│   ├── server.js           # Node.js backend server alternative
│   └── main.py             # Python backend server alternative
├── css/
│   └── styles.css          # Indian classroom palette, Tiranga accents, glassmorphism
├── js/
│   ├── data.js             # 5 core languages + 140 dialects, FLN flashcards, lesson templates
│   ├── speech-engine.js    # Web Speech API (STT/TTS) & canvas audio visualizer
│   ├── mock-ai.js          # REST API client with offline neural fallback
│   └── app.js              # State manager, event listeners, quick switcher, and UI router
├── index.html              # Responsive Smart-Classroom Single-Page Application
├── run-backend.ps1         # One-click full-stack launcher (Server + Browser)
├── server.ps1              # Root server entry point
└── README.md               # Project documentation
```

---

## 🛠️ How to Run in Visual Studio Code

### Method 1: One-Click Run via VS Code (Recommended)
1. Open the `d:\AAWAZSETU` folder in **Visual Studio Code**.
2. Press **`Ctrl+Shift+B`** (or go to **Terminal → Run Build Task...**) and select **"Start AawazSetu Backend Server (Port 8080)"**.
3. Alternatively, press **`F5`** to start the backend server and launch the web app in Chrome/Edge automatically.
4. The server runs at `http://localhost:8080/index.html`.

### Method 2: Using the One-Click PowerShell Launcher
1. Open PowerShell inside the project directory and run:
   ```powershell
   .\run-backend.ps1
   ```
2. This will start the backend server and automatically open `http://localhost:8080/index.html` in your default browser.

### Method 3: Using Node.js or Python (Optional)
- **Node.js**: `node backend/server.js`
- **Python**: `python backend/main.py`

---

## 🇮🇳 Alignment with National Frameworks
- **NEP 2020 (Clause 4.11-4.14)**: Promoting mother-tongue and regional dialect instruction in foundational primary education.
- **NIPUN Bharat Mission**: Attaining universal Foundational Literacy and Numeracy (FLN) by Grade 3.
- **Digital India Bhashini**: Fostering open multilingual AI linguistic tools across India.
