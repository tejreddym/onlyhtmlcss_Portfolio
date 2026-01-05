/* ==========================================================================
   TEJ_JET COLDWALL v3.1.0 (Commercial + Key Generator)
   The Invisible Airlock | Proprietary Security Protocol
   (c) 2026 Tej Reddy Systems.
   ========================================================================== */

(function(window, document) {

    // 1. CONFIGURATION
    const CONFIG = {
        productName: "TEJ_JET COLDWALL",
        maxStrikes: 1,
        bypassParam: "pass",
        
        // CUSTOMER TODO: Paste your generated hash here.
        // Default (tej_master): -1803499192
        bypassHash: -1803499192, 
        
        storageKey: "tj_cw_security_log"
    };

    // 2. SYNC HASHING ENGINE (The "Product Secret")
    function generateSyncHash(str) {
        let hash = 0;
        if (!str || str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    // 3. KEY GENERATOR (Setup Mode)
    // Helps customers create their own hash easily.
    const urlParams = new URLSearchParams(window.location.search);
    const newPassInput = urlParams.get("generate_hash");

    if (newPassInput) {
        const newHash = generateSyncHash(newPassInput);
        alert(`[TEJ_JET SETUP WIZARD]\n\nPassword: "${newPassInput}"\n\nYOUR HASH CODE: ${newHash}\n\nINSTRUCTIONS: Copy this number and paste it into 'bypassHash' inside coldwall.js.`);
        // Stop execution so they can copy it.
        throw new Error("Setup Complete. Check Alert Box.");
    }

    // 4. INSTANT BYPASS CHECK
    const inputPass = urlParams.get(CONFIG.bypassParam);

    if (inputPass) {
        const calculatedHash = generateSyncHash(inputPass);
        if (calculatedHash === CONFIG.bypassHash) {
            console.warn(`%c ${CONFIG.productName} [BYPASSED BY ADMIN] `, 'background: #00ff00; color: #000; font-weight: bold;');
            localStorage.removeItem(CONFIG.storageKey);
            return; 
        }
    }

    // 5. SECURITY SYSTEM
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

    new Coldwall().start();

})(window, document);