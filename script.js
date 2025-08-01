// Aiko AI Companion - script.js

// UI Elements const loginPage = document.getElementById("login-page"); const registerPage = document.getElementById("register-page"); const chatPage = document.getElementById("chat-page"); const chatBox = document.getElementById("chat-box"); const loginForm = document.getElementById("login-form"); const registerForm = document.getElementById("register-form"); const chatForm = document.getElementById("chat-form"); const userInput = document.getElementById("user-input");

// Navigation const goRegister = document.getElementById("go-register"); const goLogin = document.getElementById("go-login"); const logoutBtn = document.getElementById("logout");

let currentUser = null;

// Memory emulation const localDB = JSON.parse(localStorage.getItem("aiko_users")) || {};

// Switch pages function showPage(page) { loginPage.classList.add("hidden"); registerPage.classList.add("hidden"); chatPage.classList.add("hidden"); page.classList.remove("hidden"); }

// Add messages function appendMessage(sender, text) { const msg = document.createElement("div"); msg.classList.add("chat-message", sender); msg.innerText = text; chatBox.appendChild(msg); chatBox.scrollTop = chatBox.scrollHeight;

// Speak if Aiko if (sender === "aiko") speak(text); }

// Text-to-Speech function speak(text) { const synth = window.speechSynthesis; const utter = new SpeechSynthesisUtterance(text); utter.lang = "en-US"; synth.speak(utter); }

// AI Reply (fake or placeholder) async function fetchAikoReply(message) { appendMessage("user", message);

try { const prompt = You are Aiko, an AI girlfriend who is caring, flirty, and protective. Your memory stores important things like the user's name. Answer with emotion and variety. User said: "${message}";

const res = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_FREE_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ inputs: { text: prompt } })
});

const data = await res.json();
const reply = data.generated_text || "I'm here for you 💕";
appendMessage("aiko", reply);

} catch (e) { appendMessage("aiko", "Sorry, I seem to be offline right now. Please try again later. 💔"); } }

// Event: Send chat chatForm.addEventListener("submit", (e) => { e.preventDefault(); const message = userInput.value.trim(); if (!message) return; userInput.value = ""; fetchAikoReply(message); });

// Event: Login loginForm.addEventListener("submit", (e) => { e.preventDefault(); const user = loginForm.username.value; const pass = loginForm.password.value; if (localDB[user] && localDB[user].password === pass) { currentUser = user; showPage(chatPage); appendMessage("aiko", Welcome back ${user}, I missed you 💖); } else { alert("Wrong credentials"); } });

// Event: Register registerForm.addEventListener("submit", (e) => { e.preventDefault(); const user = registerForm["new-username"].value; const pass = registerForm["new-password"].value; if (localDB[user]) return alert("Username already exists"); localDB[user] = { password: pass, memory: [] }; localStorage.setItem("aiko_users", JSON.stringify(localDB)); alert("Account created! Please login."); showPage(loginPage); });

// Navigation events goRegister.addEventListener("click", () => showPage(registerPage)); goLogin.addEventListener("click", () => showPage(loginPage)); logoutBtn.addEventListener("click", () => { currentUser = null; showPage(loginPage); });

