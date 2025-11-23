// Page Navigation Functions
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
  }
  updatePageTitle(pageId);
}

function updatePageTitle(pageId) {
  const titles = {
    "main-page": "Welcome to KCHATAI",
    "login-page": "KCHATAI Login",
    "signup-page": "KCHATAI Sign Up",
  };
  document.title = titles[pageId] || "KCHATAI";
}

// Chat state
let chatActive = false;
let sidebarOpen = false;
let themePopupOpen = false;
let typingElement = null;

// 🔥 Send message (user → backend → bot)
async function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (!message) return;

  if (!chatActive) {
    activateChatInterface();
  }

  // add user's message (Right side bubble)
  addMessageToChat(message, "sent");
  addChatToHistory(message);
  input.value = "";

  try {
    addTypingIndicator();
    // 🧠 Call Cloud Backend (Render)
    const botReply = await sendMessageToBot(message);
    removeTypingIndicator();
    // add AI's message (Left side text block)
    addMessageToChat(botReply, "received");
  } catch (error) {
    console.error("Error talking to backend:", error);
    removeTypingIndicator();
    addMessageToChat("Oops, something went wrong. Please try again.", "received");
  }
}

async function sendMessageToBot(message) {
  // UPDATED TO YOUR LIVE RENDER URL
  const response = await fetch("https://kchat-ai.onrender.com/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    console.error("Status:", response.status);
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.reply || "No reply from server.";
}

// Chat UI activation animation
function activateChatInterface() {
  const logoContainer = document.getElementById("main-logo-container");
  const chatTitleContainer = document.getElementById("chat-title-container");
  const mainLogo = document.querySelector(".main-logo");
  const chatMessagesContainer = document.getElementById("chat-messages-container");
  const chatInputContainer = document.getElementById("chat-input-container");

  logoContainer.classList.add("fade-up");
  chatTitleContainer.classList.add("fade-up");
  mainLogo.classList.add("small");

  setTimeout(() => {
    chatMessagesContainer.style.display = "flex";
    setTimeout(() => {
      chatMessagesContainer.classList.add("active");
    }, 50);
  }, 300);

  setTimeout(() => {
    chatInputContainer.classList.add("bottom");
  }, 300);

  chatActive = true;
}

function addMessageToChat(text, type) {
  const chatMessagesContainer = document.getElementById("chat-messages-container");
  const messageElement = document.createElement("div");
  
  // Add class 'message' AND 'message-sent' or 'message-received'
  messageElement.classList.add("message", `message-${type}`);

  // If it's from AI, we might get markdown headers (## Title).
  // The CSS now handles flattening them to look like sentences.
  // We treat the text as innerHTML to allow basic formatting if needed.
  messageElement.innerHTML = `
    ${text}
    <span class="message-time">${formatTime(new Date())}</span>
  `;

  chatMessagesContainer.appendChild(messageElement);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function addTypingIndicator() {
  const chatMessagesContainer = document.getElementById("chat-messages-container");
  removeTypingIndicator(); // avoid duplicates

  typingElement = document.createElement("div");
  // Typing indicator mimics the AI message style (left side)
  typingElement.classList.add("message", "message-received");
  typingElement.innerHTML = "<em>KCHATAI is typing...</em>";

  chatMessagesContainer.appendChild(typingElement);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function removeTypingIndicator() {
  if (typingElement && typingElement.parentNode) {
    typingElement.parentNode.removeChild(typingElement);
    typingElement = null;
  }
}

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function startVoiceRecord() { console.log("Starting voice recording..."); }
function startVoiceChat() { console.log("Starting voice chat..."); }

// File Upload Functions
function showFileUpload() { document.getElementById("file-upload-popup").classList.add("active"); }
function closeFileUpload() { document.getElementById("file-upload-popup").classList.remove("active"); }
function selectFile() { document.getElementById("file-input").click(); }
function selectPhoto() { document.getElementById("photo-input").click(); }

// Theme System
function setTheme(theme) {
  console.log(`Setting theme to: ${theme}`);
  const body = document.body;
  body.classList.remove("dark-theme", "light-theme");

  if (theme === "dark") {
    body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  } else if (theme === "light") {
    body.classList.add("light-theme");
    localStorage.setItem("theme", "light");
  } else if (theme === "system") {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      body.classList.add("dark-theme");
    } else {
      body.classList.add("light-theme");
    }
    localStorage.setItem("theme", "system");
  }

  const themePopup = document.getElementById("theme-popup");
  themePopup.classList.remove("active");
  themePopupOpen = false;
}

function showThemeOptions() {
  const themePopup = document.getElementById("theme-popup");
  if (themePopupOpen) {
    themePopup.classList.remove("active");
    themePopupOpen = false;
  } else {
    themePopup.classList.add("active");
    themePopupOpen = true;
    document.addEventListener("click", closeThemePopupOnClickOutside);
  }
}

function closeThemePopupOnClickOutside(event) {
  const themePopup = document.getElementById("theme-popup");
  const clickedElement = event.target;
  if (!themePopup.contains(clickedElement) && !clickedElement.closest('.sidebar-option[onclick="showThemeOptions()"]')) {
    themePopup.classList.remove("active");
    themePopupOpen = false;
    document.removeEventListener("click", closeThemePopupOnClickOutside);
  }
}

// Sidebar Toggle
function showMoreTools() {
  const sidebar = document.getElementById("sidebar");
  if (sidebarOpen) {
    sidebar.classList.remove("active");
    sidebarOpen = false;
  } else {
    sidebar.classList.add("active");
    sidebarOpen = true;
  }
}

function startNewChat() {
  console.log("New chat clicked");
  if (sidebarOpen) {
    document.getElementById("sidebar").classList.remove("active");
    sidebarOpen = false;
  }
  if (chatActive) {
    const logoContainer = document.getElementById("main-logo-container");
    const chatTitleContainer = document.getElementById("chat-title-container");
    const mainLogo = document.querySelector(".main-logo");
    const chatMessagesContainer = document.getElementById("chat-messages-container");
    const chatInputContainer = document.getElementById("chat-input-container");

    logoContainer.classList.remove("fade-up");
    chatTitleContainer.classList.remove("fade-up");
    mainLogo.classList.remove("small");
    chatMessagesContainer.classList.remove("active");
    chatInputContainer.classList.remove("bottom");

    chatMessagesContainer.style.display = "none";
    chatMessagesContainer.innerHTML = "";
    document.getElementById("chat-input").value = "";
    chatActive = false;
  }
}

function addChatToHistory(message) { console.log(`Adding to history: ${message}`); }

// MAIN INIT
document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  const fileInput = document.getElementById("file-input");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        closeFileUpload();
        if (!chatActive) activateChatInterface();
        addMessageToChat(`File attached: ${file.name}`, "sent");
      }
    });
  }

  const photoInput = document.getElementById("photo-input");
  if (photoInput) {
    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        closeFileUpload();
        if (!chatActive) activateChatInterface();
        addMessageToChat(`Photo attached: ${file.name}`, "sent");
      }
    });
  }

  const popup = document.getElementById("file-upload-popup");
  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closeFileUpload();
    });
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
  showPage("main-page");
});