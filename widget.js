(function () {
  'use strict';

  // API_URL will be dynamically set by Vercel deployment or default to relative path
  const API_URL = window.location.origin + '/api/chat'; 

  // ─── Styles ────────────────────────────────────────────────────────────────
  const css = `
    #airene-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
      font-family: 'Georgia', serif;
    }

    #airene-bubble-btn {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a1035 0%, #2d1b5e 100%);
      border: 2px solid #7c5cbf;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(124, 92, 191, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
    }

    #airene-bubble-btn:hover {
      transform: scale(1.07);
      box-shadow: 0 6px 28px rgba(124, 92, 191, 0.65);
    }

    #airene-bubble-btn svg {
      width: 28px;
      height: 28px;
    }

    #airene-label {
      background: linear-gradient(135deg, #1a1035 0%, #2d1b5e 100%);
      color: #c9b8f0;
      font-size: 12px;
      padding: 5px 12px;
      border-radius: 20px;
      border: 1px solid #7c5cbf;
      white-space: nowrap;
      cursor: pointer;
      letter-spacing: 0.03em;
    }

    #airene-window {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: #0f0a1e;
      border: 1px solid #3a2570;
      border-radius: 18px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,92,191,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 99998;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }

    #airene-window.hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
    }

    #airene-header {
      background: linear-gradient(135deg, #1a1035 0%, #2d1b5e 100%);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #3a2570;
      flex-shrink: 0;
    }

    #airene-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c5cbf, #4a2d8a);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    #airene-header-text h3 {
      margin: 0;
      font-size: 15px;
      color: #e8d8ff;
      font-weight: normal;
      letter-spacing: 0.02em;
    }

    #airene-header-text p {
      margin: 2px 0 0;
      font-size: 11px;
      color: #8a7aaa;
      font-family: 'Arial', sans-serif;
    }

    #airene-close {
      margin-left: auto;
      background: none;
      border: none;
      color: #8a7aaa;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      padding: 0 4px;
      transition: color 0.2s;
    }

    #airene-close:hover { color: #c9b8f0; }

    #airene-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: #3a2570 transparent;
    }

    #airene-messages::-webkit-scrollbar { width: 4px; }
    #airene-messages::-webkit-scrollbar-track { background: transparent; }
    #airene-messages::-webkit-scrollbar-thumb { background: #3a2570; border-radius: 2px; }

    .airene-msg {
      max-width: 88%;
      font-size: 14px;
      line-height: 1.55;
      font-family: 'Georgia', serif;
    }

    .airene-msg.bot {
      align-self: flex-start;
      background: #1a1035;
      color: #ddd0ff;
      padding: 11px 14px;
      border-radius: 4px 16px 16px 16px;
      border: 1px solid #3a2570;
    }

    .airene-msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #2d1b5e, #4a2d8a);
      color: #f0e8ff;
      padding: 11px 14px;
      border-radius: 16px 4px 16px 16px;
    }

    .airene-typing {
      align-self: flex-start;
      display: flex;
      gap: 5px;
      padding: 12px 14px;
      background: #1a1035;
      border-radius: 4px 16px 16px 16px;
      border: 1px solid #3a2570;
    }

    .airene-typing span {
      width: 7px;
      height: 7px;
      background: #7c5cbf;
      border-radius: 50%;
      animation: airene-bounce 1.2s infinite;
    }

    .airene-typing span:nth-child(2) { animation-delay: 0.2s; }
    .airene-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes airene-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    .airene-options {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-top: 4px;
    }

    .airene-option-btn {
      background: rgba(124, 92, 191, 0.12);
      border: 1px solid #5a3d9a;
      color: #c9b8f0;
      padding: 9px 14px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 13px;
      font-family: 'Georgia', serif;
      text-align: left;
      transition: background 0.2s, border-color 0.2s;
    }

    .airene-option-btn:hover {
      background: rgba(124, 92, 191, 0.28);
      border-color: #7c5cbf;
    }

    #airene-input-area {
      padding: 12px 14px;
      border-top: 1px solid #3a2570;
      display: flex;
      gap: 8px;
      flex-shrink: 0;
      background: #0f0a1e;
    }

    #airene-input {
      flex: 1;
      background: #1a1035;
      border: 1px solid #3a2570;
      border-radius: 22px;
      padding: 10px 16px;
      color: #e8d8ff;
      font-size: 13px;
      font-family: 'Georgia', serif;
      outline: none;
      resize: none;
      transition: border-color 0.2s;
    }

    #airene-input::placeholder { color: #5a4a7a; }
    #airene-input:focus { border-color: #7c5cbf; }

    #airene-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c5cbf, #4a2d8a);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.15s, box-shadow 0.15s;
      align-self: flex-end;
    }

    #airene-send:hover {
      transform: scale(1.08);
      box-shadow: 0 3px 12px rgba(124,92,191,0.5);
    }

    #airene-send svg { width: 16px; height: 16px; }

    #airene-footer {
      text-align: center;
      font-size: 10px;
      color: #4a3a6a;
      padding: 6px 0 10px;
      font-family: 'Arial', sans-serif;
      letter-spacing: 0.03em;
    }

    @media (max-width: 480px) {
      #airene-window {
        bottom: 0;
        right: 0;
        width: 100vw;
        max-width: 100vw;
        height: 85vh;
        max-height: 85vh;
        border-radius: 18px 18px 0 0;
      }
      #airene-launcher {
        bottom: 16px;
        right: 16px;
      }
    }
  `;

  // ─── HTML ───────────────────────────────────────────────────────────────────
  const html = `
    <div id="airene-launcher">
      <div id="airene-label">3AM Sleep Help 🌙</div>
      <button id="airene-bubble-btn" aria-label="Open Airène sleep support chat">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#c9b8f0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="8" cy="10" r="1" fill="#c9b8f0"/>
          <circle cx="12" cy="10" r="1" fill="#c9b8f0"/>
          <circle cx="16" cy="10" r="1" fill="#c9b8f0"/>
        </svg>
      </button>
    </div>

    <div id="airene-window" class="hidden" role="dialog" aria-label="Airène sleep support chat">
      <div id="airene-header">
        <div id="airene-avatar">🌙</div>
        <div id="airene-header-text">
          <h3>Airène</h3>
          <p>3AM Sleep Support · Here for you</p>
        </div>
        <button id="airene-close" aria-label="Close chat">✕</button>
      </div>

      <div id="airene-messages" role="log" aria-live="polite"></div>

      <div id="airene-input-area">
        <textarea
          id="airene-input"
          rows="1"
          placeholder="Type here, or choose an option above..."
          aria-label="Your message"
        ></textarea>
        <button id="airene-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="#f0e8ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#f0e8ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div id="airene-footer">Airène · Menopause Sleep Support · Not medical advice</div>
    </div>
  `;

  // ─── Init ───────────────────────────────────────────────────────────────────
  function init() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Inject HTML
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    // State
    let isOpen = false;
    let conversationHistory = [];
    let greeted = false;

    const win = document.getElementById('airene-window');
    const btn = document.getElementById('airene-bubble-btn');
    const label = document.getElementById('airene-label');
    const closeBtn = document.getElementById('airene-close');
    const messagesEl = document.getElementById('airene-messages');
    const inputEl = document.getElementById('airene-input');
    const sendBtn = document.getElementById('airene-send');

    function toggleChat() {
      isOpen = !isOpen;
      win.classList.toggle('hidden', !isOpen);
      if (isOpen && !greeted) {
        greeted = true;
        setTimeout(() => sendGreeting(), 400);
      }
      if (isOpen) inputEl.focus();
    }

    btn.addEventListener('click', toggleChat);
    label.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function scrollToBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addMessage(role, text) {
      // Remove typing indicator if present
      const typing = messagesEl.querySelector('.airene-typing');
      if (typing) typing.remove();

      const msgEl = document.createElement('div');
      msgEl.className = `airene-msg ${role}`;

      // Parse numbered options from bot messages
      if (role === 'bot') {
        const lines = text.split('\n');
        const optionRegex = /^\\[(\\d+)\\]\\s*(.+)/;
        let mainText = [];
        let options = [];

        lines.forEach(line => {
          const match = line.match(optionRegex);
          if (match) {
            options.push(match[2].trim());
          } else {
            mainText.push(line);
          }
        });

        const mainStr = mainText.join('\n').trim();
        if (mainStr) {
          const p = document.createElement('p');
          p.style.margin = '0 0 8px 0';
          p.style.whiteSpace = 'pre-wrap';
          p.textContent = mainStr;
          msgEl.appendChild(p);
        }

        if (options.length > 0) {
          const optDiv = document.createElement('div');
          optDiv.className = 'airene-options';
          options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'airene-option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => {
              // Disable all option buttons in this message
              optDiv.querySelectorAll('.airene-option-btn').forEach(b => {
                b.disabled = true;
                b.style.opacity = '0.5';
                b.style.cursor = 'default';
              });
              sendMessage(opt);
            });
            optDiv.appendChild(btn);
          });
          msgEl.appendChild(optDiv);
        }
      } else {
        msgEl.textContent = text;
      }

      messagesEl.appendChild(msgEl);
      scrollToBottom();
    }

    function showTyping() {
      const typingEl = document.createElement('div');
      typingEl.className = 'airene-typing';
      typingEl.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(typingEl);
      scrollToBottom();
    }

    async function sendGreeting() {
      showTyping();
      await delay(900);
      const greeting = "Many women wake between 2–4 AM during menopause and feel wired but exhausted — their mind suddenly switches on and sleep feels impossible.\n\nDoes this sound like what's happening right now?\n[1] Yes exactly\n[2] Mostly yes\n[3] Not really";
      conversationHistory.push({ role: 'assistant', content: greeting });
      addMessage('bot', greeting);
    }

    async function sendMessage(text) {
      if (!text.trim()) return;

      addMessage('user', text);
      conversationHistory.push({ role: 'user', content: text });
      inputEl.value = '';
      inputEl.style.height = 'auto';

      showTyping();

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversationHistory })
        });

        const data = await response.json();
        const reply = data.reply || "I'm here with you. Take a slow breath... 💙";

        conversationHistory.push({ role: 'assistant', content: reply });
        addMessage('bot', reply);
      } catch (err) {
        addMessage('bot', "I'm here with you. Take a slow breath in for 4 counts... and out for 6. You're not alone. 💙");
      }
    }

    sendBtn.addEventListener('click', () => {
      sendMessage(inputEl.value.trim());
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value.trim());
      }
    });

    // Auto-resize textarea
    inputEl.addEventListener('input', () => {
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
    });
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
