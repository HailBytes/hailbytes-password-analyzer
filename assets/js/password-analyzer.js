class HailBytesPasswordAnalyzer {
    constructor() {
        this.passwordInput = document.getElementById('password-input');
        this.strengthMeter = document.querySelector('.strength-fill');
        this.strengthLabel = document.querySelector('.strength-label');
        this.scoreNumber = document.querySelector('.score-number');
        this.resultsContainer = document.querySelector('.hailbytes-psa-results');
        
        this.initializeEventListeners();
        this.setupTabs();
        this.setupModal();
        
        // Common passwords and patterns
        this.commonPasswords = new Set([
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou',
            'princess', 'rockyou', '12345678', 'sunshine', 'football'
        ]);
        
        this.keyboardPatterns = [
            'qwerty', 'asdf', 'zxcv', '1234', '4321', 'abcd', 'dcba'
        ];
        
        this.dictionaryWords = new Set([
            'password', 'admin', 'user', 'login', 'welcome', 'home', 'test',
            'guest', 'info', 'master', 'root', 'system', 'manager', 'service'
        ]);
    }
    
    initializeEventListeners() {
        if (this.passwordInput) {
            this.passwordInput.addEventListener('input', (e) => {
                this.analyzePassword(e.target.value);
            });
            
            this.passwordInput.addEventListener('paste', (e) => {
                setTimeout(() => {
                    this.analyzePassword(e.target.value);
                }, 10);
            });
        }
        
        // Toggle password visibility
        const toggleBtn = document.querySelector('.toggle-visibility');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const input = this.passwordInput;
                if (input.type === 'password') {
                    input.type = 'text';
                    toggleBtn.innerHTML = '<span class="eye-icon">🙈</span>';
                } else {
                    input.type = 'password';
                    toggleBtn.innerHTML = '<span class="eye-icon">👁️</span>';
                }
            });
        }
    }
    
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                document.querySelector(`[data-tab="${targetTab}"].tab-content`).classList.add('active');
            });
        });
    }
    
    setupModal() {
        const modal = document.getElementById('hailbytes-lead-modal');
        const closeBtn = document.querySelector('.modal-close');
        const form = document.getElementById('hailbytes-lead-form');
        
        // Close modal when clicking X or outside
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Handle form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitLeadForm(form);
            });
        }
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
    
    analyzePassword(password) {
        if (!password) {
            this.resetDisplay();
            return;
        }
        
        const analysis = this.performAnalysis(password);
        this.updateDisplay(analysis);
        this.checkBreachStatus(password);
    }
    
    performAnalysis(password) {
        const length = password.length;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        // Character counts
        const lowerCount = (password.match(/[a-z]/g) || []).length;
        const upperCount = (password.match(/[A-Z]/g) || []).length;
        const numberCount = (password.match(/\d/g) || []).length;
        const symbolCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
        const uniqueChars = new Set(password.toLowerCase()).size;
        
        // Calculate entropy
        let charSpace = 0;
        if (hasLower) charSpace += 26;
        if (hasUpper) charSpace += 26;
        if (hasNumber) charSpace += 10;
        if (hasSymbol) charSpace += 32;
        
        const entropy = length > 0 ? Math.log2(Math.pow(charSpace, length)) : 0;
        
        // Pattern detection
        const patterns = this.detectPatterns(password);
        const dictionaryWords = this.detectDictionaryWords(password);
        
        // Calculate score
        const score = this.calculateScore(password, {
            length, hasLower, hasUpper, hasNumber, hasSymbol,
            patterns, dictionaryWords, entropy, uniqueChars
        });
        
        // Time to crack estimation
        const crackTime = this.estimateCrackTime(entropy);
        
        // Compliance check
        const compliance = this.checkCompliance(password);
        
        // Generate suggestions
        const suggestions = this.generateSuggestions(password, {
            length, hasLower, hasUpper, hasNumber, hasSymbol,
            patterns, dictionaryWords
        });
        
        return {
            score,
            strength: this.getStrengthLevel(score),
            entropy: entropy.toFixed(1),
            crackTime,
            compliance,
            composition: {
                length,
                lowerCount,
                upperCount,
                numberCount,
                symbolCount,
                uniqueChars
            },
            patterns,
            dictionaryWords,
            suggestions
        };
    }
    
    detectPatterns(password) {
        const patterns = [];
        const lower = password.toLowerCase();
        
        // Check for keyboard patterns
        this.keyboardPatterns.forEach(pattern => {
            if (lower.includes(pattern)) {
                patterns.push(`Keyboard pattern: ${pattern}`);
            }
        });
        
        // Check for sequential numbers
        if (/\d{3,}/.test(password)) {
            const numbers = password.match(/\d+/g);
            numbers?.forEach(num => {
                if (num.length >= 3) {
                    const isSequential = this.isSequentialNumbers(num);
                    if (isSequential) {
                        patterns.push(`Sequential numbers: ${num}`);
                    }
                }
            });
        }
        
        // Check for repeated characters
        const repeated = password.match(/(.)\1{2,}/g);
        if (repeated) {
            repeated.forEach(rep => {
                patterns.push(`Repeated character: ${rep}`);
            });
        }
        
        // Check for common substitutions
        const substitutions = {
            '@': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's', '7': 't'
        };
        
        let withoutSubs = password.toLowerCase();
        Object.keys(substitutions).forEach(sub => {
            withoutSubs = withoutSubs.replace(new RegExp(sub, 'g'), substitutions[sub]);
        });
        
        if (this.commonPasswords.has(withoutSubs)) {
            patterns.push('Common password with substitutions');
        }
        
        return patterns;
    }
    
    detectDictionaryWords(password) {
        const words = [];
        const lower = password.toLowerCase();
        
        // Check for exact matches
        this.dictionaryWords.forEach(word => {
            if (lower.includes(word)) {
                words.push(word);
            }
        });
        
        // Check for common passwords
        if (this.commonPasswords.has(lower)) {
            words.push('Common password');
        }
        
        return words;
    }
    
    isSequentialNumbers(numStr) {
        for (let i = 0; i < numStr.length - 1; i++) {
            if (parseInt(numStr[i + 1]) !== parseInt(numStr[i]) + 1) {
                return false;
            }
        }
        return true;
    }
    
    calculateScore(password, analysis) {
        let score = 0;
        
        // Length scoring (0-30 points)
        if (analysis.length >= 12) score += 30;
        else if (analysis.length >= 8) score += 20;
        else if (analysis.length >= 6) score += 10;
        else score += analysis.length * 2;
        
        // Character diversity (0-25 points)
        let diversity = 0;
        if (analysis.hasLower) diversity += 5;
        if (analysis.hasUpper) diversity += 5;
        if (analysis.hasNumber) diversity += 5;
        if (analysis.hasSymbol) diversity += 10;
        score += diversity;
        
        // Entropy bonus (0-20 points)
        if (analysis.entropy > 60) score += 20;
        else if (analysis.entropy > 40) score += 15;
        else if (analysis.entropy > 25) score += 10;
        else score += Math.floor(analysis.entropy / 5);
        
        // Unique character bonus (0-15 points)
        const uniqueRatio = analysis.uniqueChars / analysis.length;
        score += Math.floor(uniqueRatio * 15);
        
        // Pattern penalties
        score -= analysis.patterns.length * 10;
        score -= analysis.dictionaryWords.length * 15;
        
        // Common password penalty
        if (this.commonPasswords.has(password.toLowerCase())) {
            score -= 30;
        }
        
        // Ensure score is within bounds
        return Math.max(0, Math.min(100, score));
    }
    
    getStrengthLevel(score) {
        if (score >= 80) return { level: 5, text: 'Excellent', color: '#1e90ff' };
        if (score >= 60) return { level: 4, text: 'Strong', color: '#2ed573' };
        if (score >= 40) return { level: 3, text: 'Fair', color: '#ffa502' };
        if (score >= 20) return { level: 2, text: 'Weak', color: '#ff6b35' };
        return { level: 1, text: 'Very Weak', color: '#ff4757' };
    }
    
    estimateCrackTime(entropy) {
        if (entropy <= 0) return 'Instant';
        
        // Assume 1 billion guesses per second
        const guessesPerSecond = 1e9;
        const totalCombinations = Math.pow(2, entropy);
        const averageGuesses = totalCombinations / 2;
        const seconds = averageGuesses / guessesPerSecond;
        
        if (seconds < 1) return 'Instant';
        if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
        if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.ceil(seconds / 3600)} hours`;
        if (seconds < 2592000) return `${Math.ceil(seconds / 86400)} days`;
        if (seconds < 31536000) return `${Math.ceil(seconds / 2592000)} months`;
        if (seconds < 31536000000) return `${Math.ceil(seconds / 31536000)} years`;
        
        return 'Centuries';
    }
    
    checkCompliance(password) {
        const compliance = [];
        
        // NIST 800-63B
        if (password.length >= 8) {
            compliance.push('NIST 800-63B: ✓');
        } else {
            compliance.push('NIST 800-63B: ✗ (min 8 chars)');
        }
        
        // Common enterprise requirements
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (password.length >= 8 && hasUpper && hasLower && hasNumber && hasSymbol) {
            compliance.push('Enterprise Standard: ✓');
        } else {
            compliance.push('Enterprise Standard: ✗');
        }
        
        return compliance;
    }
    
    generateSuggestions(password, analysis) {
        const suggestions = [];
        
        if (analysis.length < 8) {
            suggestions.push({
                type: 'length',
                title: 'Increase Length',
                description: 'Add more characters to reach at least 8-12 characters for better security.'
            });
        }
        
        if (!analysis.hasUpper) {
            suggestions.push({
                type: 'uppercase',
                title: 'Add Uppercase Letters',
                description: 'Include at least one uppercase letter (A-Z) to increase complexity.'
            });
        }
        
        if (!analysis.hasLower) {
            suggestions.push({
                type: 'lowercase',
                title: 'Add Lowercase Letters',
                description: 'Include at least one lowercase letter (a-z) for better character diversity.'
            });
        }
        
        if (!analysis.hasNumber) {
            suggestions.push({
                type: 'numbers',
                title: 'Add Numbers',
                description: 'Include at least one number (0-9) to strengthen your password.'
            });
        }
        
        if (!analysis.hasSymbol) {
            suggestions.push({
                type: 'symbols',
                title: 'Add Special Characters',
                description: 'Include symbols like !@#$%^&* to significantly increase password strength.'
            });
        }
        
        if (analysis.patterns.length > 0) {
            suggestions.push({
                type: 'patterns',
                title: 'Avoid Predictable Patterns',
                description: 'Remove keyboard patterns, sequential numbers, and repeated characters.'
            });
        }
        
        if (analysis.dictionaryWords.length > 0) {
            suggestions.push({
                type: 'dictionary',
                title: 'Avoid Common Words',
                description: 'Replace dictionary words and common passwords with random characters or passphrases.'
            });
        }
        
        return suggestions;
    }
    
    updateDisplay(analysis) {
        // Update strength meter
        if (this.strengthMeter) {
            this.strengthMeter.style.width = `${analysis.score}%`;
            this.strengthMeter.setAttribute('data-strength', analysis.strength.level);
        }
        
        // Update strength label
        if (this.strengthLabel) {
            this.strengthLabel.textContent = analysis.strength.text;
            this.strengthLabel.style.color = analysis.strength.color;
        }
        
        // Update score
        if (this.scoreNumber) {
            this.scoreNumber.textContent = analysis.score;
            this.scoreNumber.style.color = analysis.strength.color;
        }
        
        // Show results container
        if (this.resultsContainer) {
            this.resultsContainer.style.display = 'block';
            this.resultsContainer.classList.add('fade-in');
        }
        
        // Update overview tab
        this.updateOverviewTab(analysis);
        
        // Update detailed analysis tab
        this.updateDetailedTab(analysis);
        
        // Update suggestions tab
        this.updateSuggestionsTab(analysis);
    }
    
    updateOverviewTab(analysis) {
        const entropyValue = document.querySelector('.entropy-value');
        const crackTime = document.querySelector('.crack-time');
        const complianceStatus = document.querySelector('.compliance-status');
        
        if (entropyValue) {
            entropyValue.textContent = `${analysis.entropy} bits`;
        }
        
        if (crackTime) {
            crackTime.textContent = analysis.crackTime;
        }
        
        if (complianceStatus) {
            const compliant = analysis.compliance.filter(c => c.includes('✓')).length;
            const total = analysis.compliance.length;
            complianceStatus.textContent = `${compliant}/${total} standards`;
            complianceStatus.style.color = compliant === total ? '#2ed573' : '#ffa502';
        }
    }
    
    updateDetailedTab(analysis) {
        // Update composition values
        const elements = {
            '.length-value': analysis.composition.length,
            '.lowercase-count': analysis.composition.lowerCount,
            '.uppercase-count': analysis.composition.upperCount,
            '.number-count': analysis.composition.numberCount,
            '.symbol-count': analysis.composition.symbolCount,
            '.unique-count': analysis.composition.uniqueChars
        };
        
        Object.entries(elements).forEach(([selector, value]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = value;
            }
        });
        
        // Update patterns
        const patternsContainer = document.querySelector('.patterns-detected');
        if (patternsContainer) {
            if (analysis.patterns.length > 0) {
                patternsContainer.innerHTML = analysis.patterns
                    .map(pattern => `<span class="pattern-item">${pattern}</span>`)
                    .join('');
            } else {
                patternsContainer.innerHTML = '<em style="color: #2ed573;">No problematic patterns detected</em>';
            }
        }
        
        // Update dictionary results
        const dictionaryContainer = document.querySelector('.dictionary-results');
        if (dictionaryContainer) {
            if (analysis.dictionaryWords.length > 0) {
                dictionaryContainer.innerHTML = analysis.dictionaryWords
                    .map(word => `<span class="dictionary-item">${word}</span>`)
                    .join('');
            } else {
                dictionaryContainer.innerHTML = '<em style="color: #2ed573;">No common words detected</em>';
            }
        }
    }
    
    updateSuggestionsTab(analysis) {
        const suggestionsContainer = document.querySelector('.suggestions-list');
        if (suggestionsContainer) {
            if (analysis.suggestions.length > 0) {
                suggestionsContainer.innerHTML = analysis.suggestions
                    .map(suggestion => `
                        <div class="suggestion-item">
                            <div class="suggestion-icon">⚠️</div>
                            <div class="suggestion-content">
                                <h5>${suggestion.title}</h5>
                                <p>${suggestion.description}</p>
                            </div>
                        </div>
                    `).join('');
            } else {
                suggestionsContainer.innerHTML = `
                    <div class="suggestion-item" style="border-left-color: #2ed573;">
                        <div class="suggestion-icon" style="color: #2ed573;">✅</div>
                        <div class="suggestion-content">
                            <h5>Excellent Password!</h5>
                            <p>Your password meets all security best practices. Consider using a password manager to generate and store unique passwords for all your accounts.</p>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    checkBreachStatus(password) {
        const breachStatus = document.querySelector('.breach-status');
        if (!breachStatus) return;
        
        breachStatus.textContent = hailbytes_ajax.strings.checking_breach;
        breachStatus.style.color = '#ffa502';
        
        // Add loading animation
        const breachItem = document.querySelector('.breach-status-item');
        if (breachItem) {
            breachItem.classList.add('loading');
        }
        
        const formData = new FormData();
        formData.append('action', 'check_pwned_password');
        formData.append('password', password);
        formData.append('nonce', hailbytes_ajax.nonce);
        
        fetch(hailbytes_ajax.ajax_url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (breachItem) {
                breachItem.classList.remove('loading');
            }
            
            if (data.success) {
                if (data.data.found) {
                    breachStatus.textContent = `${hailbytes_ajax.strings.found_in_breach} (${data.data.count.toLocaleString()} times)`;
                    breachStatus.style.color = '#ff4757';
                } else {
                    breachStatus.textContent = hailbytes_ajax.strings.not_in_breach;
                    breachStatus.style.color = '#2ed573';
                }
            } else {
                breachStatus.textContent = hailbytes_ajax.strings.breach_check_error;
                breachStatus.style.color = '#666';
            }
        })
        .catch(error => {
            if (breachItem) {
                breachItem.classList.remove('loading');
            }
            breachStatus.textContent = hailbytes_ajax.strings.breach_check_error;
            breachStatus.style.color = '#666';
            console.error('Breach check error:', error);
        });
    }
    
    submitLeadForm(form) {
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        formData.append('action', 'capture_lead');
        formData.append('nonce', hailbytes_ajax.nonce);
        
        fetch(hailbytes_ajax.ajax_url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                form.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 3rem; color: #2ed573;">✅</div>
                        <h3 style="color: #2ed573; margin: 1rem 0;">${hailbytes_ajax.strings.lead_success}</h3>
                        <p>We'll reach out within 24 hours to discuss your security needs.</p>
                    </div>
                `;
                
                setTimeout(() => {
                    document.getElementById('hailbytes-lead-modal').style.display = 'none';
                }, 3000);
            } else {
                alert(hailbytes_ajax.strings.lead_error);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('Lead submission error:', error);
            alert(hailbytes_ajax.strings.lead_error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    resetDisplay() {
        if (this.strengthMeter) {
            this.strengthMeter.style.width = '0%';
            this.strengthMeter.setAttribute('data-strength', '0');
        }
        
        if (this.strengthLabel) {
            this.strengthLabel.textContent = 'Enter a password to begin';
            this.strengthLabel.style.color = '#666';
        }
        
        if (this.scoreNumber) {
            this.scoreNumber.textContent = '0';
            this.scoreNumber.style.color = '#666';
        }
        
        if (this.resultsContainer) {
            this.resultsContainer.style.display = 'none';
        }
    }
}

// Global function to show lead form
function hailbytesShowLeadForm() {
    const modal = document.getElementById('hailbytes-lead-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Focus on first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}