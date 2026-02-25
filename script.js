/**
 * Local Shoe Factory Landing Page - Optimized Interactive JavaScript
 * Performance-optimized with debouncing, efficient DOM queries, and performance monitoring
 * Enhanced with accessibility features and cross-browser compatibility
 */

(function() {
    'use strict';

    // Performance monitoring - Track key metrics
    const performanceMetrics = {
        pageLoadStart: performance.now(),
        domContentLoaded: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        timeToInteractive: 0,
        resourceLoadTimes: []
    };

    // State management
    const state = {
        mobileMenuOpen: false,
        lightboxOpen: false,
        currentImageIndex: 0,
        observers: [],
        loadedImages: new Set(),
        isInitialized: false,
        focusedElementBeforeModal: null
    };

    // Configuration with optimized thresholds
    const config = {
        smoothScrollDuration: 800,
        scrollOffset: 80,
        lazyLoadRootMargin: '200px',
        debounceDelay: 250,
        scrollDebounce: 150,
        imagePreloadCount: 2
    };

    // DOM Elements Cache
    const elements = {
        mobileMenuToggle: null,
        navMenu: null,
        navLinks: null,
        contactForm: null,
        formInputs: null,
        productImages: null,
        lazyImages: null,
        header: null,
        productCards: null,
        allFocusableElements: null
    };

    /**
     * Initialize application when DOM is ready
     */
    function init() {
        if (state.isInitialized) return;

        try {
            cacheDOMElements();
            setupEventListeners();
            initLazyLoading();
            initImagePreloading();
            initSmoothScroll();
            initMobileMenu();
            initContactForm();
            initImageGallery();
            initHeaderScroll();
            initProductInteractions();
            initPerformanceMonitoring();
            initAccessibilityFeatures();
            initKeyboardNavigation();

            state.isInitialized = true;
            performanceMetrics.timeToInteractive = performance.now() - performanceMetrics.pageLoadStart;

            // Announce page ready to screen readers
            announceToScreenReader('Page loaded successfully. Use tab to navigate through the page.');
        } catch (error) {
            handleError('Initialization failed', error);
        }
    }

    /**
     * Cache DOM elements for performance
     */
    function cacheDOMElements() {
        elements.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        elements.navMenu = document.querySelector('.nav-menu');
        elements.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        elements.contactForm = document.querySelector('.contact-form');
        elements.formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
        elements.productImages = document.querySelectorAll('.product-image img');
        elements.lazyImages = document.querySelectorAll('img[loading="lazy"]');
        elements.header = document.querySelector('header');
        elements.productCards = document.querySelectorAll('.product-card');
        elements.allFocusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    }

    /**
     * Setup optimized event listeners with proper cleanup
     */
    function setupEventListeners() {
        if (elements.mobileMenuToggle) {
            elements.mobileMenuToggle.addEventListener('click', handleMobileMenuToggle);
            elements.mobileMenuToggle.addEventListener('keydown', handleMobileMenuToggleKeyboard);
        }

        elements.navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
            link.addEventListener('keydown', handleNavLinkKeyboard);
        });

        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscapeKey);
        document.addEventListener('keydown', handleGlobalKeyboardNavigation);

        // Optimized resize handler with debouncing
        window.addEventListener('resize', debounce(handleResize, config.debounceDelay), { passive: true });

        // Optimized scroll handler with debouncing and passive listener
        window.addEventListener('scroll', debounce(handleScroll, config.scrollDebounce), { passive: true });
    }

    /**
     * Initialize accessibility features
     */
    function initAccessibilityFeatures() {
        // Set up live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'sr-live-region';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'visually-hidden';
        document.body.appendChild(liveRegion);

        // Enhance all interactive elements with proper ARIA attributes
        enhanceInteractiveElements();

        // Monitor focus for accessibility
        monitorFocusIndicators();
    }

    /**
     * Enhance interactive elements with ARIA attributes
     */
    function enhanceInteractiveElements() {
        // Enhance buttons with proper roles
        const buttons = document.querySelectorAll('.btn, [role="button"]');
        buttons.forEach(button => {
            if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'Interactive button');
            }
        });

        // Ensure all images have alt text
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', 'Decorative image');
                img.setAttribute('role', 'presentation');
            }
        });

        // Enhance form controls with descriptions
        const formControls = document.querySelectorAll('input, select, textarea');
        formControls.forEach(control => {
            if (control.hasAttribute('required') && !control.hasAttribute('aria-required')) {
                control.setAttribute('aria-required', 'true');
            }
        });
    }

    /**
     * Monitor and maintain focus indicators
     */
    function monitorFocusIndicators() {
        let lastKeyboardFocus = false;

        document.addEventListener('mousedown', () => {
            lastKeyboardFocus = false;
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                lastKeyboardFocus = true;
            }
        });

        document.addEventListener('focus', (e) => {
            if (lastKeyboardFocus && e.target) {
                e.target.classList.add('keyboard-focus');
            }
        }, true);

        document.addEventListener('blur', (e) => {
            if (e.target) {
                e.target.classList.remove('keyboard-focus');
            }
        }, true);
    }

    /**
     * Initialize keyboard navigation support
     */
    function initKeyboardNavigation() {
        // Add keyboard support for product cards
        elements.productCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => handleProductCardKeyboard(e, index));
        });

        // Add keyboard support for all interactive elements
        enhanceKeyboardSupport();
    }

    /**
     * Enhance keyboard support for all interactive elements
     */
    function enhanceKeyboardSupport() {
        // Ensure all clickable elements are keyboard accessible
        const clickableElements = document.querySelectorAll('[onclick], .clickable');
        clickableElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }

            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    /**
     * Handle global keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleGlobalKeyboardNavigation(e) {
        // Home key - go to top
        if (e.key === 'Home' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            announceToScreenReader('Scrolled to top of page');
        }

        // End key - go to bottom
        if (e.key === 'End' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            announceToScreenReader('Scrolled to bottom of page');
        }
    }

    /**
     * Handle product card keyboard interaction
     * @param {KeyboardEvent} e - Keyboard event
     * @param {number} index - Card index
     */
    function handleProductCardKeyboard(e, index) {
        const card = elements.productCards[index];

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const inquireButton = card.querySelector('.btn-small');
            if (inquireButton) {
                inquireButton.click();
                announceToScreenReader('Inquire button activated');
            }
        }
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - Priority level (polite or assertive)
     */
    function announceToScreenReader(message, priority = 'polite') {
        const liveRegion = document.getElementById('sr-live-region');
        if (!liveRegion) return;

        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;

        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }

    /**
     * Initialize smooth scrolling for navigation
     */
    function initSmoothScroll() {
        const allHashLinks = document.querySelectorAll('a[href^="#"]');

        allHashLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        e.preventDefault();
                        smoothScrollTo(targetElement);

                        if (state.mobileMenuOpen) {
                            closeMobileMenu();
                        }

                        if (history.pushState) {
                            history.pushState(null, null, `#${targetId}`);
                        }

                        // Announce navigation to screen readers
                        announceToScreenReader(`Navigated to ${targetElement.getAttribute('aria-labelledby') || targetId} section`);
                    }
                });
            }
        });
    }

    /**
     * Optimized smooth scroll using requestAnimationFrame
     * @param {HTMLElement} element - Target element to scroll to
     */
    function smoothScrollTo(element) {
        if (!element) return;

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - config.scrollOffset;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / config.smoothScrollDuration, 1);

            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startPosition + distance * easeInOutCubic);

            if (timeElapsed < config.smoothScrollDuration) {
                requestAnimationFrame(animation);
            } else {
                // Focus target element for accessibility
                element.focus({ preventScroll: true });
                element.setAttribute('tabindex', '-1');
            }
        }

        requestAnimationFrame(animation);
    }

    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenu() {
        if (!elements.mobileMenuToggle || !elements.navMenu) return;
    }

    /**
     * Handle mobile menu toggle
     * @param {Event} e - Click event
     */
    function handleMobileMenuToggle(e) {
        e.stopPropagation();
        state.mobileMenuOpen ? closeMobileMenu() : openMobileMenu();
    }

    /**
     * Handle mobile menu toggle keyboard interaction
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleMobileMenuToggleKeyboard(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMobileMenuToggle(e);
        }
    }

    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        if (!elements.navMenu || !elements.mobileMenuToggle) return;

        elements.navMenu.classList.add('active');
        elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        state.mobileMenuOpen = true;

        const hamburger = elements.mobileMenuToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.style.transform = 'rotate(45deg)';
            hamburger.style.setProperty('--before-transform', 'rotate(90deg) translateX(8px)');
            hamburger.style.setProperty('--after-opacity', '0');
        }

        // Focus first menu item for accessibility
        const firstMenuItem = elements.navMenu.querySelector('a');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }

        // Announce to screen readers
        announceToScreenReader('Menu opened', 'assertive');

        // Trap focus within menu
        trapFocus(elements.navMenu);
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        if (!elements.navMenu || !elements.mobileMenuToggle) return;

        elements.navMenu.classList.remove('active');
        elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        state.mobileMenuOpen = false;

        const hamburger = elements.mobileMenuToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.style.transform = '';
            hamburger.style.removeProperty('--before-transform');
            hamburger.style.removeProperty('--after-opacity');
        }

        // Return focus to toggle button
        elements.mobileMenuToggle.focus();

        // Announce to screen readers
        announceToScreenReader('Menu closed', 'assertive');

        // Remove focus trap
        removeFocusTrap();
    }

    /**
     * Trap focus within an element
     * @param {HTMLElement} element - Element to trap focus within
     */
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', handleFocusTrap);

        function handleFocusTrap(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }

        element.focusTrapHandler = handleFocusTrap;
    }

    /**
     * Remove focus trap
     */
    function removeFocusTrap() {
        if (elements.navMenu && elements.navMenu.focusTrapHandler) {
            elements.navMenu.removeEventListener('keydown', elements.navMenu.focusTrapHandler);
            delete elements.navMenu.focusTrapHandler;
        }
    }

    /**
     * Handle navigation link clicks
     * @param {Event} e - Click event
     */
    function handleNavLinkClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (!href || href === '#') return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            e.preventDefault();
            smoothScrollTo(targetElement);

            if (state.mobileMenuOpen) {
                closeMobileMenu();
            }
        }
    }

    /**
     * Handle navigation link keyboard interaction
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleNavLinkKeyboard(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleNavLinkClick(e);
        }
    }

    /**
     * Handle clicks outside mobile menu
     * @param {Event} e - Click event
     */
    function handleOutsideClick(e) {
        if (!state.mobileMenuOpen) return;

        const isClickInsideMenu = elements.navMenu && elements.navMenu.contains(e.target);
        const isClickOnToggle = elements.mobileMenuToggle && elements.mobileMenuToggle.contains(e.target);

        if (!isClickInsideMenu && !isClickOnToggle) {
            closeMobileMenu();
        }
    }

    /**
     * Handle escape key press
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleEscapeKey(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (state.mobileMenuOpen) {
                closeMobileMenu();
            }
            if (state.lightboxOpen) {
                closeLightbox();
            }
        }
    }

    /**
     * Handle window resize - Optimized
     */
    function handleResize() {
        if (window.innerWidth > 767 && state.mobileMenuOpen) {
            closeMobileMenu();
        }
    }

    /**
     * Handle scroll for header effects - Optimized with transform
     */
    function handleScroll() {
        if (!elements.header) return;

        const scrollY = window.pageYOffset;

        if (scrollY > 50) {
            elements.header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            elements.header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    }

    /**
     * Initialize header scroll effect
     */
    function initHeaderScroll() {
        handleScroll();
    }

    /**
     * Initialize contact form validation
     */
    function initContactForm() {
        if (!elements.contactForm) return;

        elements.formInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));

            if (input.type === 'tel') {
                input.addEventListener('input', (e) => formatPhoneNumber(e.target));
            }

            // Add keyboard navigation support
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    focusNextFormField(input);
                }
            });
        });

        elements.contactForm.addEventListener('submit', handleFormSubmit);
    }

    /**
     * Focus next form field
     * @param {HTMLElement} currentField - Current form field
     */
    function focusNextFormField(currentField) {
        const formElements = Array.from(elements.formInputs);
        const currentIndex = formElements.indexOf(currentField);

        if (currentIndex >= 0 && currentIndex < formElements.length - 1) {
            formElements[currentIndex + 1].focus();
        } else if (currentIndex === formElements.length - 1) {
            // Focus submit button
            const submitButton = elements.contactForm.querySelector('button[type="submit"]');
            if (submitButton) submitButton.focus();
        }
    }

    /**
     * Validate individual form field
     * @param {HTMLInputElement} field - Form field to validate
     * @returns {boolean} - Validation result
     */
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        clearFieldError(field);

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} is required`;
        }
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        else if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        else if (field.tagName === 'SELECT' && field.hasAttribute('required')) {
            if (!value || value === '') {
                isValid = false;
                errorMessage = 'Please select an option';
            }
        }
        else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
            // Announce error to screen readers
            announceToScreenReader(`Error: ${errorMessage}`, 'assertive');
        }

        return isValid;
    }

    /**
     * Get field label text
     * @param {HTMLInputElement} field - Form field
     * @returns {string} - Label text
     */
    function getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        return field.name.charAt(0).toUpperCase() + field.name.slice(1);
    }

    /**
     * Show field error message
     * @param {HTMLInputElement} field - Form field
     * @param {string} message - Error message
     */
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        formGroup.classList.add('has-error');
        field.setAttribute('aria-invalid', 'true');

        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'assertive');
            errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;

        field.style.borderColor = '#ef4444';
    }

    /**
     * Clear field error message
     * @param {HTMLInputElement} field - Form field
     */
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        formGroup.classList.remove('has-error');
        field.removeAttribute('aria-invalid');
        field.style.borderColor = '';

        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Format phone number with automatic formatting
     * @param {HTMLInputElement} input - Phone input field
     */
    function formatPhoneNumber(input) {
        if (!input) return;

        let value = input.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        let formattedValue = '';

        if (value.length === 0) {
            formattedValue = '';
        } else if (value.length <= 3) {
            formattedValue = value;
        } else if (value.length <= 6) {
            formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else if (value.length <= 10) {
            formattedValue = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
        } else {
            formattedValue = `+${value.slice(0, 1)}-${value.slice(1, 4)}-${value.slice(4, 7)}-${value.slice(7)}`;
        }

        if (input.value !== formattedValue) {
            const cursorPosition = input.selectionStart;
            const oldLength = input.value.length;
            input.value = formattedValue;

            const newLength = formattedValue.length;
            const diff = newLength - oldLength;
            input.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
        }
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        let isFormValid = true;

        elements.formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            const firstError = elements.contactForm.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
                announceToScreenReader('Please correct the errors in the form', 'assertive');
            }
            return;
        }

        announceToScreenReader('Sending message...', 'polite');
        submitForm();
    }

    /**
     * Submit form data
     */
    function submitForm() {
        const formData = new FormData(elements.contactForm);
        const submitButton = elements.contactForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.setAttribute('aria-busy', 'true');
            submitButton.textContent = 'Sending...';
        }

        setTimeout(() => {
            showFormSuccess();

            elements.contactForm.reset();

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.removeAttribute('aria-busy');
                submitButton.textContent = 'Send Message';
            }

            announceToScreenReader('Message sent successfully!', 'assertive');
        }, 1500);
    }

    /**
     * Show form success message
     */
    function showFormSuccess() {
        const formContainer = elements.contactForm.closest('.contact-form-container');
        if (!formContainer) return;

        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.setAttribute('role', 'alert');
        successMessage.setAttribute('aria-live', 'assertive');
        successMessage.style.cssText = `
            background-color: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 600;
        `;
        successMessage.textContent = 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.';

        formContainer.insertBefore(successMessage, elements.contactForm);

        setTimeout(() => {
            successMessage.style.transition = 'opacity 0.3s ease-in-out';
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 300);
        }, 5000);
    }

    /**
     * Initialize image gallery with lightbox
     */
    function initImageGallery() {
        if (!elements.productImages || elements.productImages.length === 0) return;

        elements.productImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openLightbox(index));

            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.setAttribute('aria-label', `View ${img.alt} in full size. Press Enter to open.`);

            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });
    }

    /**
     * Open lightbox for image viewing
     * @param {number} index - Image index
     */
    function openLightbox(index) {
        state.currentImageIndex = index;
        state.lightboxOpen = true;
        state.focusedElementBeforeModal = document.activeElement;

        const img = elements.productImages[index];
        if (!img) return;

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.id = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image viewer - Press Escape to close');
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;

        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            position: relative;
        `;

        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 0.5rem;
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close lightbox - Press Escape or click here');
        closeButton.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: transparent;
            color: white;
            font-size: 40px;
            border: none;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            line-height: 1;
            transition: transform 0.2s ease;
        `;
        closeButton.addEventListener('click', closeLightbox);
        closeButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeLightbox();
            }
        });
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.transform = 'scale(1.2)';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.transform = 'scale(1)';
        });

        imgContainer.appendChild(lightboxImg);
        imgContainer.appendChild(closeButton);
        lightbox.appendChild(imgContainer);
        document.body.appendChild(lightbox);

        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Trap focus in lightbox
        trapFocus(lightbox);

        // Focus close button and announce
        closeButton.focus();
        announceToScreenReader('Image viewer opened. Press Escape to close.', 'assertive');
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        lightbox.style.opacity = '0';

        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
            state.lightboxOpen = false;

            // Return focus to element that opened the lightbox
            if (state.focusedElementBeforeModal) {
                state.focusedElementBeforeModal.focus();
            }

            announceToScreenReader('Image viewer closed', 'assertive');
        }, 300);
    }

    /**
     * Initialize optimized lazy loading using Intersection Observer
     */
    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            elements.lazyImages.forEach(img => {
                loadImageWithFallback(img);
            });
            return;
        }

        const imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImageWithFallback(img);
                        observer.unobserve(img);
                    }
                });
            },
            {
                rootMargin: config.lazyLoadRootMargin,
                threshold: 0.01
            }
        );

        elements.lazyImages.forEach(img => {
            imageObserver.observe(img);
        });

        state.observers.push(imageObserver);
    }

    /**
     * Load image with error handling and fallback
     * @param {HTMLImageElement} img - Image element to load
     */
    function loadImageWithFallback(img) {
        if (!img || state.loadedImages.has(img)) return;

        const src = img.dataset.src || img.getAttribute('src');
        if (!src) return;

        state.loadedImages.add(img);

        const tempImg = new Image();

        tempImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');

            img.style.opacity = '0';
            requestAnimationFrame(() => {
                img.style.transition = 'opacity 0.4s ease-in-out';
                img.style.opacity = '1';
            });
        };

        tempImg.onerror = () => {
            img.alt = 'Image unavailable - failed to load';
            img.setAttribute('aria-label', 'Image could not be loaded');
            img.style.backgroundColor = '#f3f4f6';
            img.classList.add('image-error');

            const errorOverlay = document.createElement('div');
            errorOverlay.setAttribute('role', 'alert');
            errorOverlay.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #6b7280;
                text-align: center;
                font-size: 0.875rem;
                padding: 1rem;
            `;
            errorOverlay.textContent = 'Image unavailable';

            const container = img.parentElement;
            if (container) {
                container.style.position = 'relative';
                container.appendChild(errorOverlay);
            }

            // Announce error to screen readers
            announceToScreenReader('Image failed to load', 'polite');
        };

        tempImg.src = src;
    }

    /**
     * Initialize optimized image preloading
     */
    function initImagePreloading() {
        if (!elements.productImages || elements.productImages.length === 0) return;

        const preloadCount = Math.min(config.imagePreloadCount, elements.productImages.length);

        for (let i = 0; i < preloadCount; i++) {
            const img = elements.productImages[i];
            if (img && !img.hasAttribute('loading')) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = img.src;
                document.head.appendChild(preloadLink);
            }
        }
    }

    /**
     * Initialize optimized product card interactions
     */
    function initProductInteractions() {
        if (!elements.productCards || elements.productCards.length === 0) return;

        elements.productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.willChange = 'transform, box-shadow';
            });

            card.addEventListener('mouseleave', () => {
                card.style.willChange = 'auto';
            });

            const inquireButton = card.querySelector('.btn-small');
            if (inquireButton) {
                inquireButton.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        inquireButton.click();
                    }
                });
            }
        });
    }

    /**
     * Initialize performance monitoring and tracking
     */
    function initPerformanceMonitoring() {
        if (!window.performance || !window.PerformanceObserver) return;

        try {
            // Observe paint timing
            const paintObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-paint') {
                        performanceMetrics.firstPaint = entry.startTime;
                    }
                    if (entry.name === 'first-contentful-paint') {
                        performanceMetrics.firstContentfulPaint = entry.startTime;
                    }
                }
            });
            paintObserver.observe({ entryTypes: ['paint'] });

            // Observe LCP
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                performanceMetrics.largestContentfulPaint = lastEntry.startTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Track resource loading times
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.initiatorType === 'img' || entry.initiatorType === 'css' || entry.initiatorType === 'script') {
                        performanceMetrics.resourceLoadTimes.push({
                            name: entry.name,
                            duration: entry.duration,
                            type: entry.initiatorType
                        });
                    }
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });

            state.observers.push(paintObserver, lcpObserver, resourceObserver);

            // Report metrics after page load
            window.addEventListener('load', () => {
                setTimeout(() => {
                    reportPerformanceMetrics();
                }, 2000);
            });
        } catch (error) {
            handleError('Performance monitoring failed', error);
        }
    }

    /**
     * Report performance metrics
     */
    function reportPerformanceMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];

        if (navigation) {
            performanceMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        }

        // Track page load time
        const pageLoadTime = performance.now() - performanceMetrics.pageLoadStart;

        // Performance report object
        const perfReport = {
            pageLoadTime: Math.round(pageLoadTime),
            domContentLoaded: Math.round(performanceMetrics.domContentLoaded),
            firstPaint: Math.round(performanceMetrics.firstPaint),
            firstContentfulPaint: Math.round(performanceMetrics.firstContentfulPaint),
            largestContentfulPaint: Math.round(performanceMetrics.largestContentfulPaint),
            timeToInteractive: Math.round(performanceMetrics.timeToInteractive),
            resourceCount: performanceMetrics.resourceLoadTimes.length
        };

        // Store in sessionStorage for analytics
        try {
            sessionStorage.setItem('perfMetrics', JSON.stringify(perfReport));
        } catch (e) {
            // Storage quota exceeded or disabled
        }
    }

    /**
     * Optimized debounce utility function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Centralized error handling
     */
    function handleError(message, error) {
        if (typeof error === 'object' && error !== null) {
            // Error occurred but don't expose to console in production
        }
    }

    /**
     * Cleanup function for when page unloads
     */
    function cleanup() {
        state.observers.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });

        state.loadedImages.clear();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

})();
