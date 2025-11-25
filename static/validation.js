/**
 * Email Validation Script
 * Provides real-time client-side email validation for all forms
 */

// Email validation regex (matches backend EMAIL_REGEX pattern)
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    if (!email || email.length > 254) {
        return false;
    }
    return EMAIL_REGEX.test(email.trim());
}

/**
 * Display validation error message
 * @param {HTMLElement} inputElement - The input field
 * @param {string} message - Error message to display
 */
function showError(inputElement, message) {
    // Remove existing error message if any
    removeError(inputElement);

    // Add Bootstrap invalid class
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');

    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    errorDiv.setAttribute('data-validation-error', 'true');

    // Insert error message after input
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}

/**
 * Remove validation error message
 * @param {HTMLElement} inputElement - The input field
 */
function removeError(inputElement) {
    inputElement.classList.remove('is-invalid');

    // Remove error message
    const errorDiv = inputElement.parentNode.querySelector('[data-validation-error="true"]');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Show success state
 * @param {HTMLElement} inputElement - The input field
 */
function showSuccess(inputElement) {
    removeError(inputElement);
    inputElement.classList.add('is-valid');
    inputElement.classList.remove('is-invalid');
}

/**
 * Validate email input on blur
 * @param {Event} event - Blur event
 */
function validateEmailOnBlur(event) {
    const inputElement = event.target;
    const email = inputElement.value.trim();

    if (!email) {
        removeError(inputElement);
        inputElement.classList.remove('is-valid');
        return;
    }

    if (!isValidEmail(email)) {
        showError(inputElement, 'Please enter a valid email address.');
    } else {
        showSuccess(inputElement);
    }
}

/**
 * Validate email input on input (real-time)
 * @param {Event} event - Input event
 */
function validateEmailOnInput(event) {
    const inputElement = event.target;
    const email = inputElement.value.trim();

    if (!email) {
        removeError(inputElement);
        inputElement.classList.remove('is-valid');
        return;
    }

    // Only validate if user has stopped typing for a moment
    clearTimeout(inputElement.validationTimeout);
    inputElement.validationTimeout = setTimeout(() => {
        if (!isValidEmail(email)) {
            showError(inputElement, 'Please enter a valid email address.');
        } else {
            showSuccess(inputElement);
        }
    }, 500); // Wait 500ms after user stops typing
}

/**
 * Validate form before submission
 * @param {Event} event - Submit event
 */
function validateFormOnSubmit(event) {
    const form = event.target;
    const emailInputs = form.querySelectorAll('input[type="email"]');
    let isValid = true;

    emailInputs.forEach(input => {
        const email = input.value.trim();

        if (email && !isValidEmail(email)) {
            showError(input, 'Please enter a valid email address.');
            isValid = false;
        }
    });

    if (!isValid) {
        event.preventDefault();
        // Focus on first invalid input
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
        }
    }
}

/**
 * Initialize email validation for all forms
 */
function initEmailValidation() {
    // Get all email input fields
    const emailInputs = document.querySelectorAll('input[type="email"]');

    // Add event listeners to each email input
    emailInputs.forEach(input => {
        // Validate on blur (when user leaves the field)
        input.addEventListener('blur', validateEmailOnBlur);

        // Real-time validation on input
        input.addEventListener('input', validateEmailOnInput);
    });

    // Add form submission validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', validateFormOnSubmit);
    });
}

// Initialize validation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailValidation);
} else {
    // DOM already loaded
    initEmailValidation();
}

// Re-initialize validation for dynamically added forms (e.g., modals)
document.addEventListener('shown.bs.modal', function () {
    initEmailValidation();
});
