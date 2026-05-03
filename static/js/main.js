document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const passwordInput = document.getElementById('password-input');
    const toggleVisBtn = document.getElementById('toggle-visibility');
    
    // Meter elements
    const meterBar = document.getElementById('meter-bar');
    const strengthText = document.getElementById('strength-text');
    const entropyText = document.getElementById('entropy-text');
    const statLength = document.getElementById('stat-length');
    const statPool = document.getElementById('stat-pool');
    const statCrackTime = document.getElementById('stat-crack-time');
    const feedbackList = document.getElementById('feedback-list');
    
    // Generator elements
    const genLength = document.getElementById('gen-length');
    const genLengthVal = document.getElementById('gen-length-val');
    const genUpper = document.getElementById('gen-upper');
    const genNumbers = document.getElementById('gen-numbers');
    const genSymbols = document.getElementById('gen-symbols');
    const btnGenerate = document.getElementById('btn-generate');
    const generatedPassword = document.getElementById('generated-password');
    const btnCopy = document.getElementById('btn-copy');

    // Debounce timer
    let timer;

    // Password visibility toggle
    let isVisible = true; // initially text is shown due to 'type=text' in html
    toggleVisBtn.addEventListener('click', () => {
        isVisible = !isVisible;
        passwordInput.type = isVisible ? 'text' : 'password';
        // Update icon visually (optional based on SVG)
    });

    // Handle Input
    passwordInput.addEventListener('input', (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            evaluatePassword(e.target.value);
        }, 150); // slight debounce for smooth API calls
    });

    // Evaluate Password API Call
    async function evaluatePassword(pwd) {
        if (!pwd) {
            resetUI();
            return;
        }

        try {
            const res = await fetch('/api/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: pwd })
            });
            const data = await res.json();
            updateUI(data);
        } catch (error) {
            console.error('Error evaluating password:', error);
        }
    }

    function resetUI() {
        meterBar.style.width = '0%';
        meterBar.style.backgroundColor = 'var(--color-bg-light)';
        meterBar.style.boxShadow = 'none';
        strengthText.textContent = 'Awaiting input...';
        strengthText.style.color = 'var(--text-dim)';
        entropyText.textContent = '0.00 bits';
        statLength.textContent = '0';
        statPool.textContent = '0';
        statCrackTime.textContent = 'Instantly';
        feedbackList.innerHTML = '';
    }

    function updateUI(data) {
        // Update Meter
        meterBar.style.width = `${data.width}%`;
        meterBar.style.backgroundColor = data.color;
        meterBar.style.color = data.color; // for currentcolor shadow
        meterBar.style.boxShadow = `0 0 10px ${data.color}`;
        
        strengthText.textContent = `[ ${data.strength} ]`;
        strengthText.style.color = data.color;
        
        entropyText.textContent = `${data.entropy} bits`;
        
        // Update Stats
        statLength.textContent = data.length;
        statPool.textContent = data.pool_size;
        statCrackTime.textContent = data.crack_time;
        
        // Update Feedback List
        feedbackList.innerHTML = '';
        data.feedback.forEach(item => {
            const el = document.createElement('div');
            el.className = `feedback-item ${item.match ? 'active' : 'inactive'}`;
            
            el.innerHTML = `
                <div class="feedback-icon"></div>
                <div class="feedback-content">
                    <span class="feedback-pattern">${item.pattern}</span>
                    <span class="feedback-desc">${item.desc}</span>
                </div>
            `;
            feedbackList.appendChild(el);
        });
    }

    // Generator logic
    genLength.addEventListener('input', (e) => {
        genLengthVal.textContent = e.target.value;
    });

    btnGenerate.addEventListener('click', async () => {
        const payload = {
            length: genLength.value,
            use_upper: genUpper.checked,
            use_numbers: genNumbers.checked,
            use_symbols: genSymbols.checked
        };

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            generatedPassword.value = data.password;
            
            // Auto-evaluate the generated password
            passwordInput.value = data.password;
            // set it to text so they can see it easily
            passwordInput.type = 'text';
            isVisible = true;
            evaluatePassword(data.password);
            
        } catch (error) {
            console.error('Error generating password:', error);
        }
    });

    btnCopy.addEventListener('click', () => {
        if (!generatedPassword.value) return;
        
        navigator.clipboard.writeText(generatedPassword.value).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = 'COPIED!';
            btnCopy.style.color = 'var(--color-success)';
            setTimeout(() => {
                btnCopy.textContent = originalText;
                btnCopy.style.color = '';
            }, 2000);
        });
    });

    // Init UI state
    resetUI();
    
    // Initial evaluation for defaults (e.g. if browser remembered a password)
    if (passwordInput.value) {
        evaluatePassword(passwordInput.value);
    }
});
