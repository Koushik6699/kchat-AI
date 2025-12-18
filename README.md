# 🤖 KCHATAI - Simple AI Assistant

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Stack](https://img.shields.io/badge/Full%20Stack-Python%20%2B%20JS-blueviolet?style=for-the-badge)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%202.5-orange?style=for-the-badge)

> **A robust, full-stack AI chatbot built from scratch using Flask and Vanilla JS.**

## 🔴 Live Demo
**Experience the AI here:** 👉 **[https://kchat-ai-front.onrender.com](https://kchat-ai.netlify.app/)**

*(Note: The backend runs on a free tier. If the first message takes ~50 seconds, please be patient while the server wakes up!)*

---

## 📖 About The Project

**KCHATAI** is my first major milestone into Artificial Intelligence and Full Stack Development as a B.Tech CSE (AIML) student.

Unlike simple wrappers, this project implements a complete **Client-Server Architecture**:
1.  **The Frontend** handles the UI, animations, and theme management.
2.  **The Backend** acts as a secure middleware, processing requests and communicating with Google's Gemini API.

### ✨ Key Features
* **🧠 Smart AI:** Powered by Google's latest **Gemini 2.5 Flash** model.
* **🎨 Modern UI:** Glassmorphism effects, smooth typing indicators, and message bubbles.
* **🌗 Theme System:** Fully functional Dark/Light/System mode switcher.
* **📱 Responsive:** Optimized for both Desktop and Mobile experiences.
* **🔒 Secure:** API keys are protected via server-side environment variables.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Python 3, Flask, Gunicorn |
| **AI Engine** | Google Generative AI (Gemini) |
| **Deployment** | Render (Web Service + Static Site) |

---

## 📂 Project Structure

This repository uses a monorepo structure containing both the frontend and backend:

```text
KCHAT-AI/
├── frontend/           # 🎨 The User Interface
│   ├── index.html      # Main entry point
│   ├── style.css       # Styling and animations
│   ├── script.js       # Frontend logic & API calls
│   └── assets/         # Icons and images
│
├── python/             # 🧠 The Backend Server
│   ├── backend.py      # Flask application entry point
│   ├── requirements.txt# Python dependencies
│   └── .env            # (Ignored) Contains API Secrets
│
└── README.md           # Project Documentation
