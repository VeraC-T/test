// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFormValidation();
    initializeFormAnimations();
});

// Initialize contact form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmission);
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    
    // Validate all fields
    if (!validateForm(formObject)) {
        return;
    }
    
    // Show loading state
    showFormLoading(true);
    
    try {
        // Simulate API call (replace with actual endpoint)
        await simulateFormSubmission(formObject);
        
        // Show success message
        showFormSuccess();
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormError();
    } finally {
        showFormLoading(false);
    }
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            if (Math.random() > 0.1) { // 90% success rate
                resolve({ success: true, message: 'Form submitted successfully' });
            } else {
                reject(new Error('Submission failed'));
            }
        }, 2000);
    });
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const errors = {};
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
        isValid = false;
    }
    
    // Email validation
    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
        isValid = false;
    }
    
    // Display errors
    displayFormErrors(errors);
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    let error = '';
    
    switch (fieldName) {
        case 'name':
            if (!fieldValue || fieldValue.length < 2) {
                error = 'Name must be at least 2 characters long';
            }
            break;
            
        case 'email':
            if (!fieldValue) {
                error = 'Email address is required';
            } else if (!isValidEmail(fieldValue)) {
                error = 'Please enter a valid email address';
            }
            break;
            
        case 'message':
            if (!fieldValue) {
                error = 'Message is required';
            } else if (fieldValue.length < 10) {
                error = 'Message must be at least 10 characters long';
            } else if (fieldValue.length > 1000) {
                error = 'Message must be less than 1000 characters';
            }
            break;
    }
    
    if (error) {
        showFieldError(field, error);
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Display form errors
function displayFormErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            showFieldError(field, errors[fieldName]);
        }
    });
}

// Show field error
function showFieldError(field, message) {
    const errorElement = document.getElementById(field.name + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    field.classList.add('error');
}

// Clear field error
function clearFieldError(field) {
    const errorElement = document.getElementById(field.name + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    field.classList.remove('error');
}

// Show form loading state
function showFormLoading(isLoading) {
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.classList.add('loading');
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.classList.remove('loading');
    }
}

// Show success message
function showFormSuccess() {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    if (successMessage) {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
}

// Show error message
function showFormError() {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    if (errorMessage) {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}

// Initialize form validation enhancements
function initializeFormValidation() {
    // Character counter for textarea
    const messageField = document.getElementById('message');
    if (messageField) {
        addCharacterCounter(messageField, 1000);
    }
    
    // Format phone number input (if added)
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', formatPhoneNumber);
    }
    
    // Auto-resize textarea
    const textareas = document.querySelectorAll('.form-textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', autoResizeTextarea);
    });
}

// Add character counter to textarea
function addCharacterCounter(textarea, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        font-size: 12px;
        color: var(--text-secondary);
        text-align: right;
        margin-top: 5px;
    `;
    
    textarea.parentNode.appendChild(counter);
    
    function updateCounter() {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${textarea.value.length}/${maxLength}`;
        
        if (remaining < 50) {
            counter.style.color = 'var(--accent-color)';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter();
}

// Auto-resize textarea
function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

// Format phone number (US format)
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d+)/, '($1) $2');
    }
    
    e.target.value = value;
}

// Initialize form animations
function initializeFormAnimations() {
    // Animate form fields on focus
    const formFields = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if field has value on page load
        if (field.value) {
            field.parentNode.classList.add('focused');
        }
    });
    
    // Animate contact items on scroll
    const contactItems = document.querySelectorAll('.contact-item, .faq-item');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// Form data persistence (localStorage)
function initializeFormPersistence() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const storageKey = 'contact-form-data';
    
    // Load saved data
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'checkbox') {
                    field.value = data[key];
                } else if (field && field.type === 'checkbox') {
                    field.checked = data[key];
                }
            });
        } catch (e) {
            console.warn('Failed to load saved form data:', e);
        }
    }
    
    // Save data on input
    form.addEventListener('input', function() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Include checkbox values
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            data[checkbox.name] = checkbox.checked;
        });
        
        localStorage.setItem(storageKey, JSON.stringify(data));
    });
    
    // Clear data on successful submission
    form.addEventListener('submit', function() {
        setTimeout(() => {
            if (document.getElementById('success-message').style.display !== 'none') {
                localStorage.removeItem(storageKey);
            }
        }, 100);
    });
}

// Initialize form persistence
document.addEventListener('DOMContentLoaded', initializeFormPersistence);

// Accessibility enhancements
function initializeAccessibilityFeatures() {
    // Add ARIA labels and descriptions
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Announce form errors to screen readers
    const errorElements = form.querySelectorAll('.form-error');
    errorElements.forEach(error => {
        error.setAttribute('role', 'alert');
        error.setAttribute('aria-live', 'polite');
    });
    
    // Add aria-describedby to form fields
    const formFields = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    formFields.forEach(field => {
        const errorElement = document.getElementById(field.name + '-error');
        if (errorElement) {
            field.setAttribute('aria-describedby', errorElement.id);
        }
    });
    
    // Keyboard navigation for custom elements
    const customCheckboxes = form.querySelectorAll('.checkbox-label');
    customCheckboxes.forEach(label => {
        label.addEventListener('keydown', function(e) {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        
        label.setAttribute('tabindex', '0');
        label.setAttribute('role', 'checkbox');
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibilityFeatures);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        isValidEmail,
        validateField
    };
}