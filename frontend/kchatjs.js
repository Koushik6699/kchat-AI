// State Management
let chatActive = false;
let sidebarOpen = false;
let themePopupOpen = false;
let typingElement = null;

// --- CORE CHAT LOGIC ---

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (!message) return;

  // 1. Activate UI (Hide Welcome Screen)
  if (!chatActive) activateChatInterface();

  // 2. Show User Message (Right Side)
  addMessageToChat(message, "sent");
  input.value = "";

  // 3. Backend Call
  try {
    addTypingIndicator();
    const botReply = await sendMessageToBot(message);
    removeTypingIndicator();
    // 4. Show AI Message (Left Side) - Now formatted!
    addMessageToChat(botReply, "received");
  } catch (error) {
    console.error("Backend Error:", error);
    removeTypingIndicator();
    addMessageToChat("Error connecting to server. Please try again.", "received");
  }
}

// 🔥 CONNECTED TO YOUR BACKEND
async function sendMessageToBot(message) {
  // Using the URL you provided
  const response = await fetch("https://kchat-ai.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) throw new Error("Network response was not ok");
  const data = await response.json();
  return data.reply || "No reply from server.";
}

// --- UI HELPERS ---

function activateChatInterface() {
  const welcome = document.getElementById("welcome-screen");
  if (welcome) welcome.classList.add("hidden");
  chatActive = true;
}

function addMessageToChat(text, type) {
  const container = document.getElementById("chat-messages-container");
  const msgDiv = document.createElement("div");
  
  msgDiv.classList.add("message", `message-${type}`);
  
  // 🔥 FORMATTING LOGIC:
  // If it's the AI, we parse the text to look good (Headings, points)
  // If it's the User, we treat it as plain text.
  if (type === "received") {
    msgDiv.innerHTML = parseMarkdown(text);
  } else {
    msgDiv.textContent = text; // Secure for user input
  }

  // Append Time
  msgDiv.innerHTML += `<span class="message-time">${formatTime(new Date())}</span>`;

  container.appendChild(msgDiv);
  // Auto scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// 🧠 CUSTOM FORMATTER (Solves Point 3)
function parseMarkdown(text) {
  if (!text) return "";

  let formatted = text;

  // 1. Headers: ### Title -> <h3>Title</h3>
  formatted = formatted.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  formatted = formatted.replace(/^## (.*$)/gim, '<h2>$1</h2>');

  // 2. Bold: **text** -> <strong>text</strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 3. Bullet Points: * text -> <li>text</li> (Wrapped in basic logic)
  // We split by new lines to handle lists better
  let lines = formatted.split('\n');
  let inList = false;
  let result = "";

  lines.forEach(line => {
    if (line.trim().startsWith('* ')) {
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
      // Preserve normal lines
      if (line.trim().length > 0) result += `<p>${line}</p>`;
    }
  });

  if (inList) result += "</ul>";
  
  return result;
}

function addTypingIndicator() {
  const container = document.getElementById("chat-messages-container");
  removeTypingIndicator();
  typingElement = document.createElement("div");
  typingElement.classList.add("message", "message-received");
  typingElement.style.fontStyle = "italic";
  typingElement.style.opacity = "0.6";
  typingElement.innerText = "KCHATAI is thinking...";
  container.appendChild(typingElement);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  if (typingElement && typingElement.parentNode) {
    typingElement.remove();
    typingElement = null;
  }
}

function formatTime(date) {
  return date.getHours().toString().padStart(2, '0') + ":" + 
         date.getMinutes().toString().padStart(2, '0');
}

// --- TOOLS & THEMES ---

function startNewChat() {
  // Clear chat
  document.getElementById("chat-messages-container").innerHTML = "";
  document.getElementById("welcome-screen").classList.remove("hidden");
  chatActive = false;
  // Close sidebar if open
  document.getElementById("sidebar").classList.remove("active");
  sidebarOpen = false;
}

function showMoreTools() {
  const sidebar = document.getElementById("sidebar");
  sidebarOpen = !sidebarOpen;
  sidebar.classList.toggle("active", sidebarOpen);
}

function setTheme(theme) {
  const body = document.body;
  body.classList.remove("dark-theme", "light-theme");
  
  if (theme === 'system') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add("dark-theme");
    }
  } else {
    body.classList.add(theme + "-theme");
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

// --- FILE UPLOAD MOCKS ---
function showFileUpload() { document.getElementById("file-upload-popup").classList.add("active"); }
function closeFileUpload() { document.getElementById("file-upload-popup").classList.remove("active"); }
function selectFile() { 
  closeFileUpload(); 
  if(!chatActive) activateChatInterface();
  addMessageToChat("📁 File attached", "sent");
}
function selectPhoto() { 
  closeFileUpload(); 
  if(!chatActive) activateChatInterface();
  addMessageToChat("📷 Photo attached", "sent");
}
function startVoiceRecord() { alert("Voice recording logic here"); }
function startVoiceChat() { alert("Voice chat logic here"); }

// Init
document.addEventListener("DOMContentLoaded", () => {
  // Enter key support
  document.getElementById("chat-input").addEventListener("keypress", (e) => {
    if(e.key === "Enter") sendMessage();
  });

  // Close popups on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#theme-popup") && !e.target.closest(".sidebar-option")) {
      document.getElementById("theme-popup").classList.remove("active");
      themePopupOpen = false;
    }
    if (!e.target.closest("#sidebar") && !e.target.closest(".tool-icon") && sidebarOpen) {
      document.getElementById("sidebar").classList.remove("active");
      sidebarOpen = false;
    }
  });

  // Load Theme
  const saved = localStorage.getItem("theme") || "light";
  setTheme(saved);
});