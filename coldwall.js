/* ==========================================================================
   TEJ_JET COLDWALL v4.0.0 (Cloud Connected)
   The Invisible Airlock | Proprietary Security Protocol
   (c) 2026 Tej Reddy Systems.
   ========================================================================== */

(function(window, document) {

    // --- 1. CLOUD CONFIGURATION (PASTE YOUR KEYS HERE) ---
    const SUPABASE_URL = "https://dsadmqmdwcxcllhnsyga.supabase.co"; 
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzYWRtcW1kd2N4Y2xsaG5zeWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MzI1NzQsImV4cCI6MjA4MzIwODU3NH0.0D8HCsZd5i_NUdYg35ZFmOGNMB5JEbzLA5rFOONOr1U"; 

    // --- 2. LOCAL CONFIGURATION ---
    const CONFIG = {
        productName: "TEJ_JET COLDWALL",
        maxStrikes: 1,
        bypassParam: "pass",
        bypassHash: -1803499192, // Your "tej_master" hash
        storageKey: "tj_cw_security_log"
    };

    // --- 3. CLOUD LOGGING ENGINE ---
    // This sends the "Distress Signal" to your database
    async function logAttackToCloud(reason) {
        if (!SUPABASE_URL || SUPABASE_URL.includes("PASTE_YOUR")) return;

        const logData = {
            trigger_reason: reason,
            url_path: window.location.pathname,
            user_agent: navigator.userAgent,
            screen_resolution: `${window.screen.width}x${window.screen.height}`
        };

        try {
            await fetch(`${SUPABASE_URL}/rest/v1/security_logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                },
                body: JSON.stringify(logData)
            });
            console.log("⚠️ Attack Logged to Cloud.");
        } catch (error) {
            console.error("Cloud Log Failed:", error);
        }
    }

    // --- 4. SYNC HASHING & SETUP WIZARD ---
    function generateSyncHash(str) {
        let hash = 0;
        if (!str || str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return hash;
    }

    // Setup Wizard
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("generate_hash")) {
        const input = urlParams.get("generate_hash");
        const newHash = generateSyncHash(input);
        alert(`[TEJ_JET SETUP]\nPassword: "${input}"\nHash: ${newHash}`);
        throw new Error("Setup Complete.");
    }

    // Instant Bypass
    const inputPass = urlParams.get(CONFIG.bypassParam);
    if (inputPass) {
        if (generateSyncHash(inputPass) === CONFIG.bypassHash) {
            console.warn(`%c ${CONFIG.productName} [BYPASSED BY ADMIN] `, 'background: #00ff00; color: #000; font-weight: bold;');
            localStorage.removeItem(CONFIG.storageKey);
            return; 
        }
    }

    // --- 5. SECURITY SYSTEM ---
    class Coldwall {
        constructor() {
            this.state = this.loadState();
        }

        loadState() {
            try {
                const saved = localStorage.getItem(CONFIG.storageKey);
                return saved ? JSON.parse(saved) : { strikes: 0, banned: false };
            } catch (e) { return { strikes: 0, banned: false }; }
        }

        saveState() {
            try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.state)); } catch (e) {}
        }

        start() {
            if (this.state.banned) {
                this.enforceBan();
            } else {
                console.log(`${CONFIG.productName} [ARMED]`);
                this.armTriggers();
                this.armDebuggerTrap();
            }
        }

        armTriggers() {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.handleViolation("Right Click Source Access");
            });
            
            document.addEventListener('keydown', (e) => {
                if(e.key === 'F12') {
                    e.preventDefault();
                    this.handleViolation("F12 Debugger");
                    return;
                }
                const isCtrlOrCmd = e.ctrlKey || e.metaKey;
                const isShift = e.shiftKey;
                const key = e.key.toUpperCase();
                if ( (isCtrlOrCmd && isShift && ['I','J','C'].includes(key)) ||
                     (isCtrlOrCmd && key === 'U') ) {
                    e.preventDefault();
                    this.handleViolation("DevTools Shortcut Detected");
                }
            });
        }

        armDebuggerTrap() {
            setInterval(() => {
                const start = performance.now();
                debugger; 
                if (performance.now() - start > 100) {
                    this.handleViolation("DevTools Timing Attack");
                }
            }, 1000); 
        }

        handleViolation(reason) {
            this.state.strikes++;
            this.saveState();
            
            // FIRE AND FORGET: Send log to cloud immediately
            logAttackToCloud(reason);

            if (this.state.strikes > CONFIG.maxStrikes) this.triggerBan();
            else this.triggerWarning(reason);
        }

        triggerWarning(reason) {
            const modal = document.createElement('div');
            modal.style = "position: fixed; top: 20px; right: 20px; z-index: 999999; background: #000; border: 1px solid #FFD700; color: #FFD700; padding: 20px; font-family: monospace;";
            modal.innerHTML = `<h3>⚠️ SECURITY ALERT</h3><p>Trigger: ${reason}</p>`;
            document.body.appendChild(modal);
            setTimeout(() => modal.remove(), 4000);
        }

        triggerBan() {
            this.state.banned = true;
            this.saveState();
            this.enforceBan();
        }

        enforceBan() {
            try { window.stop(); } catch(e){}
            document.documentElement.innerHTML = `<h1 style="color:red; text-align:center; margin-top:20%;">🚫 ACCESS DENIED</h1>`;
            setInterval(() => { debugger; }, 100); 
        }
    }

    new Coldwall().start();

})(window, document);