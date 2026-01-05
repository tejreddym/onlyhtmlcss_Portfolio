/* ==========================================================================
   TEJ_JET COLDWALL v2.5.0 (Synchronous "Nuclear" Bypass)
   The Invisible Airlock | Proprietary Security Protocol
   (c) 2026 Tej Reddy Systems.
   ========================================================================== */

(function(window, document) {

    // --- 1. CONFIGURATION ---
    const CONFIG = {
        productName: "TEJ_JET COLDWALL",
        maxStrikes: 1,
        bypassParam: "pass",     // URL parameter (?pass=...)
        bypassKey: "tej_master", // The Password
        storageKey: "tj_cw_security_log"
    };

    // --- 2. THE INSTANT BYPASS CHECK (Synchronous) ---
    // We check this immediately. No waiting. No async.
    const urlParams = new URLSearchParams(window.location.search);
    const inputPass = urlParams.get(CONFIG.bypassParam);

    if (inputPass === CONFIG.bypassKey) {
        // ADMIN DETECTED
        console.warn(`%c ${CONFIG.productName} [BYPASSED BY ADMIN] `, 'background: #00ff00; color: #000; font-weight: bold;');
        
        // NUCLEAR OPTION: Wipe the ban record immediately
        localStorage.removeItem(CONFIG.storageKey);
        
        // STOP SCRIPT EXECUTION HERE.
        // The security system never loads. You are free.
        return; 
    }

    // --- 3. THE SECURITY SYSTEM (Only loads if not Admin) ---
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
            // Check if already banned
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
                // F12
                if(e.key === 'F12') {
                    e.preventDefault();
                    this.handleViolation("F12 Debugger");
                    return;
                }
                // Ctrl+Shift+I/J/C/U
                const isCtrlOrCmd = e.ctrlKey || e.metaKey;
                const isShift = e.shiftKey;
                const isAlt = e.altKey;
                const key = e.key.toUpperCase();

                if ( (isCtrlOrCmd && isShift && ['I','J','C'].includes(key)) ||
                     (isCtrlOrCmd && isAlt && ['I','J','C'].includes(key)) ||
                     (isCtrlOrCmd && key === 'U') ) {
                    e.preventDefault();
                    this.handleViolation("DevTools Shortcut Detected");
                }
            });
        }

        armDebuggerTrap() {
            // The "Annoyance" Loop
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
            if (this.state.strikes > CONFIG.maxStrikes) this.triggerBan();
            else this.triggerWarning(reason);
        }

        triggerWarning(reason) {
            const existing = document.getElementById('tj-warning-modal');
            if (existing) existing.remove();
            const modal = document.createElement('div');
            modal.id = 'tj-warning-modal';
            modal.innerHTML = `
                <div style="position: fixed; top: 20px; right: 20px; z-index: 2147483647; 
                            background: #000; border: 1px solid #FFD700; color: #FFD700; 
                            padding: 20px; border-radius: 4px; font-family: monospace; 
                            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);">
                    <h3 style="margin: 0 0 10px 0; border-bottom: 1px solid #333;">⚠️ SECURITY ALERT</h3>
                    <p style="margin: 0; font-size: 13px;"><strong>Trigger:</strong> ${reason}</p>
                    <p style="margin: 10px 0 0 0; color: #ff3333;">STRIKE ${this.state.strikes}/${CONFIG.maxStrikes + 1}</p>
                </div>`;
            document.body.appendChild(modal);
            setTimeout(() => { if (modal) modal.remove(); }, 4000);
        }

        triggerBan() {
            this.state.banned = true;
            this.saveState();
            this.enforceBan();
        }

        enforceBan() {
            try { window.stop(); } catch(e){}
            document.documentElement.innerHTML = `
                <html style="background: #000; height: 100%;">
                <body style="background: #000; color: #f00; display: flex; align-items: center; justify-content: center; height: 100%; font-family: monospace;">
                    <div style="text-align: center; border: 2px solid #f00; padding: 40px;">
                        <h1 style="font-size: 50px; margin: 0;">🚫 ACCESS DENIED</h1>
                        <p style="color: #fff; margin-top: 20px;">SECURITY PROTOCOL TEJ_JET 3.6.9.0</p>
                    </div>
                </body>
                </html>
            `;
            setInterval(() => { debugger; }, 100); 
        }
    }

    // Start the System
    new Coldwall().start();

})(window, document);