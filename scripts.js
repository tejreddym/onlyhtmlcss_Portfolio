document.addEventListener("DOMContentLoaded", function() {
    
    // 1. DEFINITIONS
    const bootScreen = document.getElementById('boot-screen');
    const chatScreen = document.getElementById('chat-screen');
    const chatBox = document.getElementById('chat-box');
    
    // The Boot Log Text (Exactly like your screenshot)
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

    // 2. BOOT FUNCTION
    function runBootSequence() {
        if (lineIndex < bootLogs.length) {
            // Create a new line div
            const line = document.createElement('div');
            line.className = 'boot-line';
            
            // Format text to colorize the timestamp
            const logText = bootLogs[lineIndex];
            // Regex to wrap [ 0.000 ] in a span
            line.innerHTML = logText.replace(/(\[.*?\])/, '<span class="timestamp">$1</span>');
            
            bootScreen.appendChild(line);
            lineIndex++;
            
            // Scroll to bottom
            bootScreen.scrollTop = bootScreen.scrollHeight;

            // Random delay between lines for realism (50ms to 400ms)
            const randomDelay = Math.random() * 300 + 100;
            setTimeout(runBootSequence, randomDelay);
        } else {
            // Boot Finished. Wait 1 second, then clear.
            setTimeout(finalizeBoot, 1000);
        }
    }

    // 3. SWITCH TO CHAT
    function finalizeBoot() {
        bootScreen.style.display = 'none'; // Hide Boot
        chatScreen.style.display = 'flex'; // Show Chat (flex to maintain layout)
        chatScreen.style.flexDirection = 'column';
        chatScreen.style.height = '100%';
        
        // Add the initial AI Greeting
        addChatMessage("PEPPERai", "Initializing connection...", "prefix");
        
        setTimeout(() => {
            addChatMessage("PEPPERai", "System Online. I am the AI assistant. Ask me anything about my projects or skills.", "prefix");
        }, 800);
    }

    // Helper to add chat messages
    function addChatMessage(sender, text, styleClass) {
        const div = document.createElement('div');
        div.className = 'output-line';
        div.innerHTML = `<span class="${styleClass}">${sender}:</span> ${text}`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Start the sequence
    runBootSequence();
    // ... (Your existing boot code is above this) ...

    // 4. HANDLE USER INPUT
    const userInput = document.getElementById('user-input');

    userInput.addEventListener('keydown', async function(e) {
        if (e.key === 'Enter') {
            const text = userInput.value.trim();
            if (!text) return;

            // 1. Show User Message immediately
            addChatMessage("visitor@guest", text, "user-prompt");
            userInput.value = ''; // Clear input
            userInput.disabled = true; // Lock input while thinking

            // 2. Show "Thinking..." indicator
            const loadingId = "loading-" + Date.now();
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'output-line';
            loadingDiv.id = loadingId;
            loadingDiv.innerHTML = `<span class="prefix">PEPPERai:</span> <span class="blink">_</span>`;
            chatBox.appendChild(loadingDiv);
            chatBox.scrollTop = chatBox.scrollHeight;

            try {
                // 3. Send to Netlify Function
                const response = await fetch('/.netlify/functions/chat', {
                    method: 'POST',
                    body: JSON.stringify({ message: text }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                
                // 4. Replace "Thinking..." with Real Answer
                document.getElementById(loadingId).remove();
                addChatMessage("PEPPERai", data.reply, "prefix");

            } catch (err) {
                document.getElementById(loadingId).remove();
                addChatMessage("PEPPERai", "Error: Uplink failed. Try again.", "prefix");
            }

            userInput.disabled = false; // Unlock input
            userInput.focus();
        }
    });

    // Simple Blink Animation for the "Thinking" cursor
    const style = document.createElement('style');
    style.innerHTML = `
      .blink { animation: blinker 1s linear infinite; }
      @keyframes blinker { 50% { opacity: 0; } }
    `;
    document.head.appendChild(style);
});