document.addEventListener("DOMContentLoaded", function() {
    
    // --- CONFIGURATION ---
    const bootScreen = document.getElementById('boot-screen');
    const chatScreen = document.getElementById('chat-screen');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    
    // State variables for redirection logic
    let pendingRedirect = null; // Stores the URL we might go to

    // The Boot Log Text
    const bootLogs = [
        "[ 0.000000] Initializing TEJ_REDDY_KERNEL v2.5.0",
        "[ 0.852109] MEM: 64GB DDR5 Virtualized pool initialized",
        "[ 1.293021] NET: Establishing secure uplink... OK",
        "[ 1.502932] DRV: Neural_Core.ko loaded",
        "[ 1.821032] DRV: Vision_Guard.ko loaded",
        "[ 2.103921] FS: Mounting /dev/sd_brain... [SUCCESS]",
        "[ 2.400000] LOGIN: Starting TejReddy_Admin_Session..."
    ];

    let lineIndex = 0;

    // --- 1. BOOT SEQUENCE ---
    function runBootSequence() {
        if (lineIndex < bootLogs.length) {
            const line = document.createElement('div');
            line.className = 'boot-line';
            
            const logText = bootLogs[lineIndex];
            line.innerHTML = logText.replace(/(\[.*?\])/, '<span class="timestamp">$1</span>');
            
            bootScreen.appendChild(line);
            lineIndex++;
            bootScreen.scrollTop = bootScreen.scrollHeight;

            const randomDelay = Math.random() * 300 + 100;
            setTimeout(runBootSequence, randomDelay);
        } else {
            setTimeout(finalizeBoot, 1000);
        }
    }

    function finalizeBoot() {
        bootScreen.style.display = 'none';
        chatScreen.style.display = 'flex';
        chatScreen.style.flexDirection = 'column';
        chatScreen.style.height = '100%';
        
        addChatMessage("PEPPERai", "Initializing connection...", "prefix");
        
        setTimeout(() => {
            addChatMessage("PEPPERai", "System Online. Type '/help' for commands or ask me anything.", "prefix");
        }, 800);
    }

    // --- 2. CHAT HELPERS ---
    function addChatMessage(sender, text, styleClass) {
        const div = document.createElement('div');
        div.className = 'output-line';
        // Allow HTML in text for lists/formatting
        div.innerHTML = `<span class="${styleClass}">${sender}:</span> ${text}`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // --- 3. COMMAND HANDLER (Local Logic) ---
    function handleLocalCommand(text) {
        const cmd = text.toLowerCase().trim();

        // A. Handle Confirmation (Y/N)
        if (pendingRedirect) {
            if (cmd === 'y' || cmd === 'yes') {
                addChatMessage("SYSTEM", `Redirecting to ${pendingRedirect}...`, "prefix");
                setTimeout(() => {
                    window.location.href = pendingRedirect;
                }, 1000);
            } else {
                addChatMessage("SYSTEM", "Navigation cancelled.", "prefix");
                pendingRedirect = null; // Reset state
            }
            return true; // Stop here, don't send to AI
        }

        // B. Handle /Slash Commands
        if (cmd.startsWith('/')) {
            switch (cmd) {
                case '/help':
                    addChatMessage("SYSTEM", 
                        "Available Commands:<br>" +
                        "&nbsp; /about &nbsp;&nbsp;&nbsp;&nbsp; -> View Profile<br>" +
                        "&nbsp; /projects &nbsp; -> View Work<br>" +
                        "&nbsp; /interests &nbsp;-> View Hobbies<br>" +
                        "&nbsp; /contact &nbsp;&nbsp; -> Send Signal<br>" +
                        "&nbsp; /clear &nbsp;&nbsp;&nbsp; -> Clear Terminal", 
                        "prefix");
                    break;

                case '/about':
                    initiateRedirect("./about.html");
                    break;
                case '/projects':
                    initiateRedirect("./projects.html");
                    break;
                case '/interests':
                    initiateRedirect("./interests.html");
                    break;
                case '/contact':
                    initiateRedirect("./contact.html");
                    break;
                
                case '/clear':
                    chatBox.innerHTML = '';
                    addChatMessage("PEPPERai", "Console cleared.", "prefix");
                    break;

                default:
                    addChatMessage("SYSTEM", `Command '${cmd}' not found. Type /help.`, "prefix");
            }
            return true; // Handled locally
        }

        return false; // Not a command, send to AI
    }

    function initiateRedirect(url) {
        pendingRedirect = url;
        addChatMessage("SYSTEM", `Initialize navigation to ${url}? [Y/n]`, "prefix");
    }


    // --- 4. INPUT EVENT LISTENER ---
    userInput.addEventListener('keydown', async function(e) {
        if (e.key === 'Enter') {
            const text = userInput.value.trim();
            if (!text) return;

            // 1. Print User's Message
            addChatMessage("visitor@guest", text, "user-prompt");
            userInput.value = ''; 
            userInput.disabled = true; 

            // 2. Check if it's a Command first
            const isCommand = handleLocalCommand(text);

            if (!isCommand) {
                // 3. If not a command, send to AI
                const loadingId = "loading-" + Date.now();
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'output-line';
                loadingDiv.id = loadingId;
                loadingDiv.innerHTML = `<span class="prefix">PEPPERai:</span> <span class="blink">_</span>`;
                chatBox.appendChild(loadingDiv);
                chatBox.scrollTop = chatBox.scrollHeight;

                try {
                    const response = await fetch('/.netlify/functions/chat', {
                        method: 'POST',
                        body: JSON.stringify({ message: text }),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    const data = await response.json();
                    document.getElementById(loadingId).remove();
                    
                    if (data.reply) {
                        addChatMessage("PEPPERai", data.reply, "prefix");
                    } else {
                        addChatMessage("PEPPERai", "Error: No data received.", "prefix");
                    }

                } catch (err) {
                    if (document.getElementById(loadingId)) {
                        document.getElementById(loadingId).remove();
                    }
                    addChatMessage("PEPPERai", "Error: Uplink failed. (Are you offline?)", "prefix");
                }
            }

            userInput.disabled = false;
            userInput.focus();
        }
    });

    // Blink Animation Style
    const style = document.createElement('style');
    style.innerHTML = `
      .blink { animation: blinker 1s linear infinite; }
      @keyframes blinker { 50% { opacity: 0; } }
    `;
    document.head.appendChild(style);

    // Start Boot
    runBootSequence();
});