// Contact Form Validation and Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form[role="form"]');
    
    if (!contactForm) return; // Exit if not on contact page
    
    // Form elements
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitButton = contactForm.querySelector('.transmit-btn');
    
    // Validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^[a-zA-Z\s]{2,50}$/;
    
    // Real-time validation
    function validateField(input, pattern, errorMessage) {
        const value = input.value.trim();
        
        // Remove previous error
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        input.classList.remove('input-error', 'input-valid');
        
        if (value === '') {
            return false; // Empty is handled by required attribute
        }
        
        if (pattern && !pattern.test(value)) {
            // Add error styling
            input.classList.add('input-error');
            
            // Create error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ff3333';
            errorDiv.style.fontSize = '0.85rem';
            errorDiv.style.marginTop = '5px';
            errorDiv.textContent = errorMessage;
            input.parentElement.appendChild(errorDiv);
            
            return false;
        }
        
        // Valid input
        input.classList.add('input-valid');
        return true;
    }
    
    // Add event listeners for real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateField(
                nameInput, 
                namePattern, 
                'Name should contain only letters and spaces (2-50 characters)'
            );
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateField(
                emailInput, 
                emailPattern, 
                'Please enter a valid email address'
            );
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', function() {
            const value = messageInput.value.trim();
            if (value.length > 0 && value.length < 10) {
                validateField(
                    messageInput, 
                    /.{10,}/, 
                    'Message should be at least 10 characters long'
                );
            } else if (value.length > 0) {
                messageInput.classList.add('input-valid');
            }
        });
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        
        // Validate all fields
        const isNameValid = validateField(
            nameInput, 
            namePattern, 
            'Name should contain only letters and spaces (2-50 characters)'
        );
        
        const isEmailValid = validateField(
            emailInput, 
            emailPattern, 
            'Please enter a valid email address'
        );
        
        const messageValue = messageInput.value.trim();
        const isMessageValid = messageValue.length >= 10;
        
        if (!isMessageValid) {
            validateField(
                messageInput, 
                /.{10,}/, 
                'Message should be at least 10 characters long'
            );
        }
        
        // Check if all fields are valid
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            // Scroll to first error
            const firstError = document.querySelector('.input-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // All validations passed - submit the form
        submitForm({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        });
    });
    
    // Form submission function
    async function submitForm(formData) {
        // Disable submit button
        submitButton.disabled = true;
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '[ TRANSMITTING... ]';
        
        try {
            // Here you can integrate with your backend or email service
            // For now, we'll simulate a successful submission
            
            // Example: Using FormSubmit.co or similar service
            // const response = await fetch('https://formsubmit.co/your@email.com', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success message
            showMessage('success', 'TRANSMISSION SUCCESSFUL! Message received. I\'ll respond soon.');
            
            // Reset form
            contactForm.reset();
            document.querySelectorAll('.input-valid').forEach(el => el.classList.remove('input-valid'));
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('error', 'TRANSMISSION FAILED! Please try again or email directly.');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }
    
    // Show success/error message
    function showMessage(type, text) {
        // Remove existing messages
        const existingMsg = document.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}-message`;
        messageDiv.style.cssText = `
            padding: 15px;
            margin-top: 15px;
            border-radius: 5px;
            text-align: center;
            font-family: 'Courier Prime', monospace;
            font-weight: bold;
            animation: fadeIn 0.3s ease;
        `;
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
            messageDiv.style.border = '2px solid #00ff00';
            messageDiv.style.color = '#00ff00';
        } else {
            messageDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            messageDiv.style.border = '2px solid #ff3333';
            messageDiv.style.color = '#ff3333';
        }
        
        messageDiv.textContent = text;
        contactForm.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
});

// Add CSS for input validation states
const style = document.createElement('style');
style.textContent = `
    .input-error {
        border-color: #ff3333 !important;
        box-shadow: 0 0 5px rgba(255, 51, 51, 0.5) !important;
    }
    
    .input-valid {
        border-color: #00ff00 !important;
        box-shadow: 0 0 5px rgba(0, 255, 0, 0.3) !important;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);
