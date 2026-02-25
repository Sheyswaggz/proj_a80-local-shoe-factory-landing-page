/**
 * Local Shoe Factory Landing Page - Interactive JavaScript
 * Provides enhanced user experience through smooth scrolling, mobile menu,
 * image gallery, form validation, lazy loading, and image optimization.
 */

(function() {
    'use strict';

    // State management
    const state = {
        mobileMenuOpen: false,
        lightboxOpen: false,
        currentImageIndex: 0,
        observers: [],
        loadedImages: new Set()
    };

    // Configuration
    const config = {
        smoothScrollDuration: 800,
        scrollOffset: 80,
        lazyLoadRootMargin: '100px',
        debounceDelay: 250,
        imagePreloadCount: 2
    };

    /**
     * DOM Elements Cache
     */
    const elements = {
        mobileMenuToggle: null,
        navMenu: null,
        navLinks: null,
        contactForm: null,
        formInputs: null,
        productImages: null,
        lazyImages: null,
        header: null,
        productCards: null
    };

    /**
     * Initialize application when DOM is ready
     */
    function init() {
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
            logInfo('Application initialized successfully');
        } catch (error) {
            logError('Initialization failed', error);
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
    }

    /**
     * Setup all event listeners with proper cleanup
     */
    function setupEventListeners() {
        // Mobile menu toggle
        if (elements.mobileMenuToggle) {
            elements.mobileMenuToggle.addEventListener('click', handleMobileMenuToggle);
        }

        // Navigation links smooth scroll
        elements.navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        // Close mobile menu on outside click
        document.addEventListener('click', handleOutsideClick);

        // Close mobile menu on escape key
        document.addEventListener('keydown', handleEscapeKey);

        // Handle window resize
        window.addEventListener('resize', debounce(handleResize, config.debounceDelay));

        // Handle scroll for header shadow
        window.addEventListener('scroll', debounce(handleScroll, 100));

        logInfo('Event listeners attached');
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

                        // Close mobile menu if open
                        if (state.mobileMenuOpen) {
                            closeMobileMenu();
                        }

                        // Update URL without jumping
                        if (history.pushState) {
                            history.pushState(null, null, `#${targetId}`);
                        }
                    }
                });
            }
        });

        logInfo('Smooth scroll initialized');
    }

    /**
     * Smooth scroll to element with offset
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

            // Easing function for smooth animation
            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startPosition + distance * easeInOutCubic);

            if (timeElapsed < config.smoothScrollDuration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenu() {
        if (!elements.mobileMenuToggle || !elements.navMenu) {
            logWarning('Mobile menu elements not found');
            return;
        }

        logInfo('Mobile menu initialized');
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
     * Open mobile menu
     */
    function openMobileMenu() {
        if (!elements.navMenu || !elements.mobileMenuToggle) return;

        elements.navMenu.classList.add('active');
        elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        state.mobileMenuOpen = true;

        // Animate hamburger to X
        const hamburger = elements.mobileMenuToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.style.transform = 'rotate(45deg)';
            hamburger.style.setProperty('--before-transform', 'rotate(90deg) translateX(8px)');
            hamburger.style.setProperty('--after-opacity', '0');
        }

        logInfo('Mobile menu opened');
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        if (!elements.navMenu || !elements.mobileMenuToggle) return;

        elements.navMenu.classList.remove('active');
        elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        state.mobileMenuOpen = false;

        // Reset hamburger animation
        const hamburger = elements.mobileMenuToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.style.transform = '';
            hamburger.style.removeProperty('--before-transform');
            hamburger.style.removeProperty('--after-opacity');
        }

        logInfo('Mobile menu closed');
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
     * Handle window resize
     */
    function handleResize() {
        // Close mobile menu on desktop resize
        if (window.innerWidth > 767 && state.mobileMenuOpen) {
            closeMobileMenu();
        }
    }

    /**
     * Handle scroll for header effects
     */
    function handleScroll() {
        if (!elements.header) return;

        if (window.pageYOffset > 50) {
            elements.header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            elements.header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    }

    /**
     * Initialize header scroll effect
     */
    function initHeaderScroll() {
        handleScroll(); // Initial check
        logInfo('Header scroll effect initialized');
    }

    /**
     * Initialize contact form validation
     */
    function initContactForm() {
        if (!elements.contactForm) {
            logWarning('Contact form not found');
            return;
        }

        // Real-time validation on input
        elements.formInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });

        // Form submission
        elements.contactForm.addEventListener('submit', handleFormSubmit);

        logInfo('Contact form initialized');
    }

    /**
     * Validate individual form field
     * @param {HTMLInputElement} field - Form field to validate
     * @returns {boolean} - Validation result
     */
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        clearFieldError(field);

        // Check required fields
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} is required`;
        }
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Phone validation (optional but must be valid if provided)
        else if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        // Select validation
        else if (field.tagName === 'SELECT' && field.hasAttribute('required')) {
            if (!value || value === '') {
                isValid = false;
                errorMessage = 'Please select an option';
            }
        }
        // Textarea minimum length
        else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
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

        // Add error class
        formGroup.classList.add('has-error');
        field.setAttribute('aria-invalid', 'true');

        // Create or update error message
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;

        // Add error styling to field
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
     * Handle form submission
     * @param {Event} e - Submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        let isFormValid = true;

        // Validate all fields
        elements.formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            logWarning('Form validation failed');
            // Focus first error field
            const firstError = elements.contactForm.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Form is valid - process submission
        submitForm();
    }

    /**
     * Submit form data
     */
    function submitForm() {
        const formData = new FormData(elements.contactForm);
        const submitButton = elements.contactForm.querySelector('button[type="submit"]');

        // Disable submit button
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            logInfo('Form submitted successfully', Object.fromEntries(formData));

            // Show success message
            showFormSuccess();

            // Reset form
            elements.contactForm.reset();

            // Re-enable button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }, 1500);
    }

    /**
     * Show form success message
     */
    function showFormSuccess() {
        const formContainer = elements.contactForm.closest('.contact-form-container');
        if (!formContainer) return;

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.setAttribute('role', 'alert');
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

        // Insert before form
        formContainer.insertBefore(successMessage, elements.contactForm);

        // Remove after 5 seconds
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
        if (!elements.productImages || elements.productImages.length === 0) {
            logWarning('No product images found for gallery');
            return;
        }

        elements.productImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openLightbox(index));

            // Keyboard accessibility
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.setAttribute('aria-label', `View ${img.alt} in full size`);

            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });

        logInfo('Image gallery initialized');
    }

    /**
     * Open lightbox for image viewing
     * @param {number} index - Image index
     */
    function openLightbox(index) {
        state.currentImageIndex = index;
        state.lightboxOpen = true;

        const img = elements.productImages[index];
        if (!img) return;

        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.id = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image viewer');
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

        // Create image container
        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            position: relative;
        `;

        // Create image element
        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 0.5rem;
        `;

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close lightbox');
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
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.transform = 'scale(1.2)';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.transform = 'scale(1)';
        });

        // Assemble lightbox
        imgContainer.appendChild(lightboxImg);
        imgContainer.appendChild(closeButton);
        lightbox.appendChild(imgContainer);
        document.body.appendChild(lightbox);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Fade in
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
        });

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Focus close button for accessibility
        closeButton.focus();

        logInfo('Lightbox opened', { index });
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

            // Return focus to original image
            if (elements.productImages[state.currentImageIndex]) {
                elements.productImages[state.currentImageIndex].focus();
            }

            logInfo('Lightbox closed');
        }, 300);
    }

    /**
     * Initialize lazy loading for images using Intersection Observer
     */
    function initLazyLoading() {
        // Check for Intersection Observer support
        if (!('IntersectionObserver' in window)) {
            logWarning('IntersectionObserver not supported, loading all images immediately');
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
        logInfo('Lazy loading initialized', { imageCount: elements.lazyImages.length });
    }

    /**
     * Load image with error handling and fallback
     * @param {HTMLImageElement} img - Image element to load
     */
    function loadImageWithFallback(img) {
        if (!img || state.loadedImages.has(img)) return;

        const src = img.dataset.src || img.getAttribute('src');
        if (!src) return;

        // Mark as being loaded
        state.loadedImages.add(img);

        // Create temporary image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');

            // Fade in animation
            img.style.opacity = '0';
            requestAnimationFrame(() => {
                img.style.transition = 'opacity 0.4s ease-in-out';
                img.style.opacity = '1';
            });

            logInfo('Image loaded successfully', { src });
        };

        tempImg.onerror = () => {
            logError('Image failed to load', { src });

            // Set fallback placeholder
            img.alt = 'Image unavailable - failed to load';
            img.style.backgroundColor = '#f3f4f6';
            img.classList.add('image-error');

            // Create error indicator
            const errorOverlay = document.createElement('div');
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
        };

        tempImg.src = src;
    }

    /**
     * Initialize image preloading for better user experience
     */
    function initImagePreloading() {
        if (!elements.productImages || elements.productImages.length === 0) {
            return;
        }

        // Preload first few product images
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

        logInfo('Image preloading initialized', { count: preloadCount });
    }

    /**
     * Initialize product card interactions
     */
    function initProductInteractions() {
        if (!elements.productCards || elements.productCards.length === 0) {
            logWarning('No product cards found');
            return;
        }

        elements.productCards.forEach(card => {
            // Add hover effect enhancements
            card.addEventListener('mouseenter', () => {
                card.style.willChange = 'transform, box-shadow';
            });

            card.addEventListener('mouseleave', () => {
                card.style.willChange = 'auto';
            });

            // Add keyboard navigation
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

        logInfo('Product interactions initialized', { cardCount: elements.productCards.length });
    }

    /**
     * Debounce utility function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Logging utilities
     */
    function logInfo(message, data = null) {
        if (console && console.log) {
            const logMessage = `[Local Shoe Factory] ${message}`;
            data ? console.log(logMessage, data) : console.log(logMessage);
        }
    }

    function logWarning(message, data = null) {
        if (console && console.warn) {
            const logMessage = `[Local Shoe Factory] ${message}`;
            data ? console.warn(logMessage, data) : console.warn(logMessage);
        }
    }

    function logError(message, error = null) {
        if (console && console.error) {
            const logMessage = `[Local Shoe Factory] ${message}`;
            error ? console.error(logMessage, error) : console.error(logMessage);
        }
    }

    /**
     * Cleanup function for when page unloads
     */
    function cleanup() {
        // Disconnect all observers
        state.observers.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });

        // Clear loaded images set
        state.loadedImages.clear();

        logInfo('Cleanup completed');
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
