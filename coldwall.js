/* ==========================================================================
   TEJ_JET COLDWALL v2.2.0 (Secure Hashing Edition)
   The Invisible Airlock | Proprietary Security Protocol
   (c) 2026 Tej Reddy Systems.
   ========================================================================== */

(function(window, document) {
    
    class Coldwall {
        constructor(config = {}) {
            this.config = {
                productName: "TEJ_JET COLDWALL",
                version: "3.6.9.0",
                maxStrikes: 1,  
                banDuration: 24 * 60 * 60 * 1000, 
                
                // SECURITY UPDATE: We store the HASH, not the password.
                bypassParam: "pass",     
                // This is the SHA-256 Hash of "tej_master"
                bypassHash: "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5", 
                
                ...config
            };

            this.storageKey = "tj_cw_security_log";
            this.state = this.loadState();
            
            // Start the async initialization
            this.init();
        }

        // --- CORE: Async Init for Crypto ---
        async init() {
            // 1. CHECK FOR DEVELOPER BYPASS (Securely)
            const isAuthorized = await this.checkBypass();
            
            if (isAuthorized) {
                console.log(`${this.config.productName} [BYPASSED BY ADMIN]`);
                return; // Stop here. Security is OFF for you.
            }

            // 2. If not authorized, run security checks
            console.log(`${this.config.productName} [ARMED]`);
            
            if (this.state.banned) {
                this.enforceBan();
            } else {
                this.armTriggers();
                this.armDebuggerTrap();
            }
        }

        // --- NEW: Secure Hash Verification ---
        async checkBypass() {
            const urlParams = new URLSearchParams(window.location.search);
            const inputPass = urlParams.get(this.config.bypassParam);

            if (!inputPass) return false;

            // Hash the input and compare it to the stored hash
            const hash = await this.sha256(inputPass);
            
            if (hash === this.config.bypassHash) {
                // Clear previous bans if Admin logs in
                localStorage.removeItem(this.storageKey);
                return true;
            }
            return false;
        }

        // Helper: Generate SHA-256 Hash
        async sha256(message) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // --- STANDARD LOGIC BELOW ---
        loadState() {
            try {
                const saved = localStorage.getItem(this.storageKey);
                return saved ? JSON.parse(saved) : { strikes: 0, banned: false };
            } catch (e) { return { strikes: 0, banned: false }; }
        }

        saveState() {
            try { localStorage.setItem(this.storageKey, JSON.stringify(this.state)); } catch (e) {}
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

            if (this.state.strikes > this.config.maxStrikes) {
                this.triggerBan();
            } else {
                this.triggerWarning(reason);
            }
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
                    <p style="margin: 10px 0 0 0; color: #ff3333;">STRIKE ${this.state.strikes}/${this.config.maxStrikes + 1}</p>
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
                        <p>Your session has been terminated due to hostile activity.</p>
                    </div>
                </body>
                </html>
            `;
            setInterval(() => { debugger; }, 100); 
        }
    }

    window.TejJet = Coldwall;

})(window, document);