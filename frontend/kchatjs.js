/* ===============================
   GLOBAL STATE
================================ */
let chatActive = false;
let sidebarOpen = false;
let themePopupOpen = false;
let typingElement = null;

/* ===============================
   BACKEND CONFIG
================================ */
const isLocal =
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1";

const API_URL = "https://kchat-ai-euqm.onrender.com/chat";


/* ===============================
   CORE CHAT LOGIC
================================ */
async function sendMessage() {
  const input = document.getElementById("chat-input");
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  if (!chatActive) activateChatInterface();

  addMessageToChat(message, "sent");
  input.value = "";

  try {
    addTypingIndicator();
    const reply = await sendMessageToBot(message);
    removeTypingIndicator();
    addMessageToChat(reply, "received");
  } catch (err) {
    console.error("❌ Backend Error:", err);
    removeTypingIndicator();
    addMessageToChat("Error connecting to server. Please try again.", "received");
  }
}

async function sendMessageToBot(message) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error("Server error");
  }

  const data = await response.json();
  return data.reply || "No reply from server.";
}

/* ===============================
   UI HELPERS
================================ */
function activateChatInterface() {
  const welcome = document.getElementById("welcome-screen");
  if (welcome) welcome.classList.add("hidden");
  chatActive = true;
}

function addMessageToChat(text, type) {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", `message-${type}`);

  if (type === "received") {
    msgDiv.innerHTML = parseMarkdown(text);
  } else {
    msgDiv.textContent = text;
  }

  msgDiv.innerHTML += `<span class="message-time">${formatTime(new Date())}</span>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

/* ===============================
   MARKDOWN PARSER
================================ */
function parseMarkdown(text) {
  if (!text) return "";

  let formatted = text
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  const lines = formatted.split("\n");
  let result = "";
  let inList = false;

  lines.forEach(line => {
    if (line.trim().startsWith("* ")) {
      if (!inList) {
        result += "<ul>";
        inList = true;
      }
      result += `<li>${line.trim().substring(2)}</li>`;
    } else {
      if (inList) {
        result += "</ul>";
        inList = false;
      }
      if (line.trim()) result += `<p>${line}</p>`;
    }
  });

  if (inList) result += "</ul>";
  return result;
}

/* ===============================
   TYPING INDICATOR
================================ */
function addTypingIndicator() {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  removeTypingIndicator();
  typingElement = document.createElement("div");
  typingElement.className = "message message-received";
  typingElement.style.fontStyle = "italic";
  typingElement.style.opacity = "0.6";
  typingElement.textContent = "KCHATAI is thinking...";
  container.appendChild(typingElement);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  if (typingElement) {
    typingElement.remove();
    typingElement = null;
  }
}

function formatTime(date) {
  return (
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0")
  );
}

/* ===============================
   SIDEBAR & CHAT TOOLS
================================ */
function startNewChat() {
  document.getElementById("chat-messages-container").innerHTML = "";
  document.getElementById("welcome-screen").classList.remove("hidden");
  document.getElementById("sidebar").classList.remove("active");
  chatActive = false;
  sidebarOpen = false;
}

function showMoreTools() {
  const sidebar = document.getElementById("sidebar");
  sidebarOpen = !sidebarOpen;
  sidebar.classList.toggle("active", sidebarOpen);
}

/* ===============================
   THEME SYSTEM
================================ */
function setTheme(theme) {
  const body = document.body;
  body.classList.remove("dark-theme", "light-theme");

  if (theme === "system") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      body.classList.add("dark-theme");
    }
  } else {
    body.classList.add(`${theme}-theme`);
  }

  document.getElementById("theme-popup").classList.remove("active");
  themePopupOpen = false;
  localStorage.setItem("theme", theme);
}

function showThemeOptions() {
  const popup = document.getElementById("theme-popup");
  themePopupOpen = !themePopupOpen;
  popup.classList.toggle("active", themePopupOpen);
}

/* ===============================
   FILE / VOICE PLACEHOLDERS
================================ */
function showFileUpload() {
  document.getElementById("file-upload-popup").classList.add("active");
}
function closeFileUpload() {
  document.getElementById("file-upload-popup").classList.remove("active");
}
function selectFile() {
  closeFileUpload();
  if (!chatActive) activateChatInterface();
  addMessageToChat("📁 File attached", "sent");
}
function selectPhoto() {
  closeFileUpload();
  if (!chatActive) activateChatInterface();
  addMessageToChat("📷 Photo attached", "sent");
}
function startVoiceRecord() {
  alert("Voice recording coming soon");
}
function startVoiceChat() {
  alert("Voice chat coming soon");
}

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chat-input");

  if (input) {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") sendMessage();
    });
  }

  document.addEventListener("click", e => {
    if (!e.target.closest("#theme-popup") && !e.target.closest(".sidebar-option")) {
      document.getElementById("theme-popup").classList.remove("active");
      themePopupOpen = false;
    }
    if (!e.target.closest("#sidebar") && !e.target.closest(".tool-icon") && sidebarOpen) {
      document.getElementById("sidebar").classList.remove("active");
      sidebarOpen = false;
    }
  });

  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
});
