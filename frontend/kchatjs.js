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

  // add user's message
  addMessageToChat(message, "sent");
  addChatToHistory(message);
  input.value = "";

  try {
    addTypingIndicator();
    const botReply = await sendMessageToBot(message);
    removeTypingIndicator();
    addMessageToChat(botReply, "received");
  } catch (error) {
    console.error("Error talking to backend:", error);
    removeTypingIndicator();
    addMessageToChat("Oops, something went wrong. Please try again.", "received");
  }
}

// 🧠 Call Python backend → Gemini
async function sendMessageToBot(message) {
  const response = await fetch("https://kchat-9uau.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
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
  messageElement.classList.add("message", `message-${type}`);

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
  typingElement.classList.add("message", "message-received");
  typingElement.textContent = "KCHATAI is typing...";

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

function startVoiceRecord() {
  console.log("Starting voice recording...");
}

function startVoiceChat() {
  console.log("Starting voice chat...");
}

// File Upload Functions
function showFileUpload() {
  const popup = document.getElementById("file-upload-popup");
  popup.classList.add("active");
}

function closeFileUpload() {
  const popup = document.getElementById("file-upload-popup");
  popup.classList.remove("active");
}

function selectFile() {
  document.getElementById("file-input").click();
}

function selectPhoto() {
  document.getElementById("photo-input").click();
}

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

  if (
    !themePopup.contains(clickedElement) &&
    !clickedElement.closest('.sidebar-option[onclick="showThemeOptions()"]')
  ) {
    themePopup.classList.remove("active");
    themePopupOpen = false;
    document.removeEventListener("click", closeThemePopupOnClickOutside);
  }
}

// Sidebar Toggle
function showMoreTools() {
  const sidebar = document.getElementById("sidebar");

  if (!sidebar) {
    console.error("Sidebar element not found!");
    return;
  }

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

    console.log("New chat started - interface reset");
  } else {
    console.log("Already on fresh chat");
  }
}

// Chat history stub
function addChatToHistory(message) {
  console.log(`Adding to history: ${message}`);
}

// MAIN INIT
document.addEventListener("DOMContentLoaded", () => {
  // Enter key to send
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // File inputs
  const fileInput = document.getElementById("file-input");
  const photoInput = document.getElementById("photo-input");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log("File selected:", file.name);
        closeFileUpload();
        if (!chatActive) activateChatInterface();
        addMessageToChat(`File attached: ${file.name}`, "sent");
      }
    });
  }

  if (photoInput) {
    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log("Photo selected:", file.name);
        closeFileUpload();
        if (!chatActive) activateChatInterface();
        addMessageToChat(`Photo attached: ${file.name}`, "sent");
      }
    });
  }

  // Close file popup when clicking outside
  const popup = document.getElementById("file-upload-popup");
  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        closeFileUpload();
      }
    });
  }

  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="text"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      if (!email || !password) {
        alert("Please fill in all fields");
        return;
      }

      alert("Login successful! Redirecting...");
      showPage("main-page");
    });
  }

  // Signup form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = signupForm.querySelectorAll("input");
      const fullName = inputs[0].value;
      const email = inputs[1].value;
      const password = inputs[2].value;
      const confirmPassword = inputs[3].value;
      const termsAccepted = document.getElementById("terms").checked;

      if (!fullName || !email || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }

      if (!termsAccepted) {
        alert("Please accept the Terms & Conditions");
        return;
      }

      alert("Account created successfully! Please log in.");
      showPage("login-page");
    });
  }

  // Social buttons
  const googleButtons = document.querySelectorAll(".google-login, .google-signup-small");
  googleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Google authentication would be implemented here");
    });
  });

  const facebookButton = document.querySelector(".facebook-signup-small");
  if (facebookButton) {
    facebookButton.addEventListener("click", () => {
      alert("Facebook authentication would be implemented here");
    });
  }

  // Theme load
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  // Start on main page
  showPage("main-page");
});
