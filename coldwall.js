/* ==========================================================================
   TEJ_JET COLDWALL v2.7.0 (Synchronous Obfuscation | Instant Bypass)
   The Invisible Airlock | Proprietary Security Protocol
   (c) 2026 Tej Reddy Systems.
   ========================================================================== */

(function(window, document) {

    // 1. CONFIGURATION
    const CONFIG = {
        productName: "TEJ_JET COLDWALL",
        maxStrikes: 1,
        bypassParam: "pass",
        
        // SECURITY: Base64 Encoded "tej_master"
        // This looks like random text, but is decoded instantly.
        // To generate new code: btoa("your_password") in console.
        bypassSecret: "dGVqX21hc3Rlcg==", 
        
        storageKey: "tj_cw_security_log"
    };

    // 2. THE INSTANT CHECK (Synchronous)
    // This runs BEFORE any other logic can possibly start.
    const urlParams = new URLSearchParams(window.location.search);
    const inputPass = urlParams.get(CONFIG.bypassParam);

    if (inputPass) {
        // Obfuscate the input and compare it to the stored secret
        // btoa() converts text to Base64 instantly.
        if (btoa(inputPass) === CONFIG.bypassSecret) {
            console.warn(`%c ${CONFIG.productName} [BYPASSED BY ADMIN] `, 'background: #00ff00; color: #000; font-weight: bold;');
            
            // Wipe the ban immediately
            localStorage.removeItem(CONFIG.storageKey);
            
            // STOP EVERYTHING. The security wall dies here.
            return; 
        }
    }

    // 3. THE SECURITY SYSTEM (Only loads if password failed)
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

    // Start
    new Coldwall().start();

})(window, document);