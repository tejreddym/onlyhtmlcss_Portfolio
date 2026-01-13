document.addEventListener("DOMContentLoaded", function() {
    
    // --- CONFIGURATION ---
    const bootScreen = document.getElementById('boot-screen');
    const chatScreen = document.getElementById('chat-screen');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const monitorBox = document.querySelector('.monitor-box'); // Select monitor for glow
    
    // State variables
    let pendingRedirect = null; 
    let isAuthorized = false; // <--- THE SECRET STATE
    let conversationHistory = []; // Store chat history
    
    // Load conversation history from localStorage
    function loadConversationHistory() {
        try {
            const saved = localStorage.getItem('pepperai_conversation');
            if (saved) {
                conversationHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.log('Could not load conversation history');
            conversationHistory = [];
        }
    }
    
    // Save conversation history to localStorage
    function saveConversationHistory() {
        try {
            // Keep only last 10 messages to avoid token limits
            const recentHistory = conversationHistory.slice(-10);
            localStorage.setItem('pepperai_conversation', JSON.stringify(recentHistory));
        } catch (e) {
            console.log('Could not save conversation history');
        }
    }
    
    // Clear conversation history
    function clearConversationHistory() {
        conversationHistory = [];
        localStorage.removeItem('pepperai_conversation');
    }

    // The Boot Log Text
    const bootLogs = [
        "[ 0.000000] Initializing TEJ_REDDY_KERNEL v2.5.0",
        "[ 0.852109] MEM: 64GB DDR5 Virtualized pool initialized",
        "[ 1.293021] NET: Establishing secure uplink... OK",
        "[ 1.502932] DRV: Neural_Core.ko loaded",
        "[ 2.103921] FS: Mounting /dev/sd_brain... [SUCCESS]",
        "[ 2.400000] LOGIN: Starting TejReddy_Public_Session..."
    ];

    let lineIndex = 0;

    // --- 1. BOOT SEQUENCE ---
    function runBootSequence() {
        if (!bootScreen) return;
        
        if (lineIndex < bootLogs.length) {
            const line = document.createElement('div');
            line.className = 'boot-line';
            const logText = bootLogs[lineIndex];
            line.innerHTML = logText.replace(/(\[.*?\])/, '<span class="timestamp">$1</span>');
            
            bootScreen.appendChild(line);
            lineIndex++;
            bootScreen.scrollTop = bootScreen.scrollHeight;

            setTimeout(runBootSequence, Math.random() * 300 + 100);
        } else {
            setTimeout(finalizeBoot, 1000);
        }
    }

    function finalizeBoot() {
        if(bootScreen) bootScreen.style.display = 'none';
        if(chatScreen) {
            chatScreen.style.display = 'flex';
            chatScreen.style.flexDirection = 'column';
            chatScreen.style.height = '100%';
        }
        
        // Load previous conversation
        loadConversationHistory();
        
        addChatMessage("PEPPERai", "System Online. RESTRICTED_MODE active.", "prefix");
        setTimeout(() => {
            addChatMessage("PEPPERai", "Type '/help' for commands.", "prefix");
        }, 800);
    }

    // --- 2. CHAT HELPER ---
    function addChatMessage(sender, text, styleClass) {
        if (!chatBox) return;
        const div = document.createElement('div');
        div.className = 'output-line';
        div.innerHTML = `<span class="${styleClass}">${sender}:</span> ${text}`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight; 
    }
    
    // --- 2B. STREAMING CHAT MESSAGE (TYPING EFFECT) ---
    async function addStreamingMessage(sender, text, styleClass) {
        if (!chatBox) return;
        
        const div = document.createElement('div');
        div.className = 'output-line';
        const senderSpan = document.createElement('span');
        senderSpan.className = styleClass;
        senderSpan.textContent = sender + ': ';
        div.appendChild(senderSpan);
        
        const textSpan = document.createElement('span');
        div.appendChild(textSpan);
        chatBox.appendChild(div);
        
        // Stream text character by character
        let index = 0;
        const typingSpeed = 15; // milliseconds per character (lower = faster)
        
        return new Promise((resolve) => {
            function typeNextChar() {
                if (index < text.length) {
                    textSpan.textContent += text[index];
                    index++;
                    chatBox.scrollTop = chatBox.scrollHeight;
                    setTimeout(typeNextChar, typingSpeed);
                } else {
                    resolve();
                }
            }
            typeNextChar();
        });
    }

    // --- 3. COMMAND HANDLER ---
    function handleLocalCommand(text) {
        const cmd = text.toLowerCase().trim();

        // --- SECRET HANDSHAKE LOGIC ---
        if (cmd === "i know you and you know me") {
            isAuthorized = true; // Unlock Admin Mode
            
            // 1. Visual Shift
            monitorBox.classList.add('admin-mode');
            
            // 2. Change Prompt Name visually in future (handled in input listener below)
            const promptLabel = document.querySelector('.user-prompt');
            if(promptLabel) promptLabel.innerText = "root@system:~$";

            // 3. Print Security Message
            addChatMessage("SYSTEM", "<span class='sys-msg'>[SECURITY_BYPASS] CREDENTIALS ACCEPTED.</span>", "prefix");
            setTimeout(() => {
                addChatMessage("PEPPERai", "Welcome back, Architect. Admin privileges restored.", "prefix");
            }, 800);
            
            return true; // Stop processing
        }
        // ------------------------------

        if (pendingRedirect) {
            if (cmd === 'y' || cmd === 'yes') {
                addChatMessage("SYSTEM", `Redirecting...`, "prefix");
                setTimeout(() => window.location.href = pendingRedirect, 1000);
            } else {
                addChatMessage("SYSTEM", "Navigation cancelled.", "prefix");
                pendingRedirect = null;
            }
            return true; 
        }

        if (cmd.startsWith('/')) {
            switch (cmd) {
                case '/help':
                    addChatMessage("SYSTEM", 
                        "Available Commands:<br>" +
                        "&nbsp; /projects &nbsp; -> View Work<br>" +
                        "&nbsp; /about &nbsp;&nbsp;&nbsp;&nbsp; -> View Profile<br>" +
                        "&nbsp; /interests &nbsp;-> View Hobbies<br>" +
                        "&nbsp; /contact &nbsp;&nbsp; -> Send Signal<br>" +
                        "&nbsp; /clear &nbsp;&nbsp;&nbsp; -> Clear Screen", 
                        "prefix");
                    break;
                case '/projects': initiateRedirect("./projects.html"); break;
                case '/about':    initiateRedirect("./about.html"); break;
                case '/interests':initiateRedirect("./interests.html"); break;
                case '/contact':  initiateRedirect("./contact.html"); break;
                case '/clear':
                    chatBox.innerHTML = '';
                    clearConversationHistory();
                    addChatMessage("PEPPERai", "Console and conversation history cleared.", "prefix");
                    break;
                default:
                    addChatMessage("SYSTEM", `Unknown command '${cmd}'. Type /help.`, "prefix");
            }
            return true; 
        }

        return false; 
    }

    function initiateRedirect(url) {
        pendingRedirect = url;
        addChatMessage("SYSTEM", `Initialize navigation to ${url}? [Y/n]`, "prefix");
    }

    // --- 4. INPUT LISTENER ---
    if (userInput) {
        // Character counter
        const maxChars = 250;
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.cssText = 'position: absolute; bottom: 5px; right: 10px; font-size: 0.7rem; color: #666; font-family: monospace;';
        userInput.parentElement.style.position = 'relative';
        userInput.parentElement.appendChild(charCounter);
        
        // Update character count
        userInput.addEventListener('input', function() {
            const remaining = maxChars - userInput.value.length;
            charCounter.textContent = `${remaining}/${maxChars}`;
            charCounter.style.color = remaining < 25 ? '#ff3333' : '#666';
            
            if (userInput.value.length > maxChars) {
                userInput.value = userInput.value.substring(0, maxChars);
            }
        });
        
        userInput.addEventListener('keydown', async function(e) {
            if (e.key === 'Enter') {
                const text = userInput.value.trim();
                if (!text) return;
                
                // Check length
                if (text.length > maxChars) {
                    addChatMessage("SYSTEM", `Message too long. Max ${maxChars} characters.`, "prefix");
                    return;
                }

                // 1. Determine Sender Name based on Auth State
                const senderName = isAuthorized ? "root@system" : "visitor@guest";
                const senderStyle = isAuthorized ? "user-prompt admin-prompt" : "user-prompt";

                addChatMessage(senderName, text, senderStyle);
                userInput.value = ''; 
                userInput.disabled = true; 

                // 2. Local Commands
                const isCommand = handleLocalCommand(text);

                // 3. Network Request
                if (!isCommand) {
                    const loadingId = "loading-" + Date.now();
                    const loadingDiv = document.createElement('div');
                    loadingDiv.className = 'output-line';
                    loadingDiv.id = loadingId;
                    loadingDiv.innerHTML = `<span class="prefix">PEPPERai:</span> <span class="blink">_</span>`;
                    chatBox.appendChild(loadingDiv);
                    chatBox.scrollTop = chatBox.scrollHeight;

                    try {
                        // Add user message to conversation history
                        conversationHistory.push({ role: "user", content: text });
                        
                        const response = await fetch('/.netlify/functions/chat', {
                            method: 'POST',
                            body: JSON.stringify({ 
                                message: text, 
                                isAdmin: isAuthorized,
                                conversationHistory: conversationHistory
                            }),
                            headers: { 'Content-Type': 'application/json' }
                        });

                        // Remove loading indicator
                        const loadingElement = document.getElementById(loadingId);
                        if (loadingElement) loadingElement.remove();

                        // Check HTTP response status
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }

                        const data = await response.json();
                        
                        if (data && data.reply) {
                            // Add assistant response to conversation history
                            conversationHistory.push({ role: "assistant", content: data.reply });
                            saveConversationHistory();
                            
                            // Use streaming animation for response
                            await addStreamingMessage("PEPPERai", data.reply, "prefix");
                        } else if (data && data.error) {
                            addChatMessage("SYSTEM", `Error: ${data.error}`, "prefix");
                        } else {
                            addChatMessage("SYSTEM", "Error: Invalid response format.", "prefix");
                        }

                    } catch (err) {
                        // Ensure loading indicator is removed
                        const loadingElement = document.getElementById(loadingId);
                        if (loadingElement) loadingElement.remove();
                        
                        // Provide specific error message
                        const errorMsg = err.message || 'Connection Failed';
                        addChatMessage("SYSTEM", `<span style="color: #ff0000;">ERROR:</span> ${errorMsg}`, "prefix");
                        console.error('Chat API Error:', err);
                    }
                }

                userInput.disabled = false;
                userInput.focus();
            }
        });
    }

    const style = document.createElement('style');
    style.innerHTML = `.blink { animation: blinker 1s linear infinite; } @keyframes blinker { 50% { opacity: 0; } }`;
    document.head.appendChild(style);

    runBootSequence();
});