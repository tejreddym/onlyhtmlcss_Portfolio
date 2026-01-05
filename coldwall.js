// HASHING ALGORITHM: TJ-Sync32 (Modified DJB2)
// ARCHITECTURE: Synchronous Bitwise One-Way Function
// STATUS: Irreversible

/* ==========================================================================
   TEJ_JET COLDWALL v2.9.0 (Diagnostic Mode)
   The Invisible Airlock | Proprietary Security Protocol
   (c) 2026 Tej Reddy Systems.
   ========================================================================== */

(function(window, document) {

    // 1. CONFIGURATION
    const CONFIG = {
        productName: "TEJ_JET COLDWALL",
        maxStrikes: 1,
        bypassParam: "pass",
        
        // This is the Target Hash we expect for "tej_master"
        bypassHash: -1769641463, 
        
        storageKey: "tj_cw_security_log"
    };

    // 2. SYNC HASHING ENGINE
    function generateSyncHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    // 3. THE DIAGNOSTIC CHECK
    const urlParams = new URLSearchParams(window.location.search);
    const inputPass = urlParams.get(CONFIG.bypassParam);

    if (inputPass) {
        const calculatedHash = generateSyncHash(inputPass);
        
        console.log("TEJ_JET DIAGNOSTIC:", {
            input: inputPass,
            calculated: calculatedHash,
            expected: CONFIG.bypassHash
        });

        // IF MATCH
        if (calculatedHash === CONFIG.bypassHash) {
            console.warn("✅ HASH MATCH. Access Granted.");
            localStorage.removeItem(CONFIG.storageKey);
            return; // Stop Security
        } 
        // IF MISMATCH (This will tell us why it failed)
        else {
             alert(`⚠️ ACCESS DENIED.\n\nInput: "${inputPass}"\nCalculated Hash: ${calculatedHash}\nExpected Hash: ${CONFIG.bypassHash}`);
        }
    }

    // 4. SECURITY SYSTEM
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

                if ( (isCtrlOrCmd && e.shiftKey && ['I','J','C'].includes(key)) ||
                     (isCtrlOrCmd && key === 'U') ) {
                    e.preventDefault();
                    this.handleViolation("DevTools Shortcut Detected");
                }
            });
        }

        handleViolation(reason) {
            this.state.strikes++;
            this.saveState();
            if (this.state.strikes > CONFIG.maxStrikes) this.triggerBan();
            else this.triggerWarning(reason);
        }

        triggerWarning(reason) {
            alert(`⚠️ SECURITY ALERT\nTrigger: ${reason}\nStrike: ${this.state.strikes}/${CONFIG.maxStrikes + 1}`);
        }

        triggerBan() {
            this.state.banned = true;
            this.saveState();
            this.enforceBan();
        }

        enforceBan() {
            try { window.stop(); } catch(e){}
            document.documentElement.innerHTML = `<h1 style="color:red; text-align:center; margin-top:20%;">🚫 ACCESS DENIED</h1>`;
        }
    }

    new Coldwall().start();

})(window, document);