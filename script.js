// Portfolio JavaScript - All Interactive Functionality

// Global Variables
let isScrolled = false;
let activeSection = 'home';
let isMobileMenuOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeSkillsAnimation();
    initializeContactForm();
    updateCurrentYear();
    
    // Animate hero content on load
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 300);
});

// Navigation Functions
function initializeNavigation() {
    // Scroll event listener for navbar
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

function handleScroll() {
    const navbar = document.getElementById('navbar');
    const currentScrolled = window.scrollY > 50;
    
    // Update navbar appearance
    if (currentScrolled !== isScrolled) {
        isScrolled = currentScrolled;
        if (navbar) {
            if (isScrolled) {
                navbar.classList.add('scrolled');
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                navbar.style.borderBottom = '1px solid hsl(220, 13%, 91%)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.backgroundColor = 'transparent';
                navbar.style.boxShadow = 'none';
                navbar.style.borderBottom = 'none';
            }
        }
    }
    
    // Update active section
    updateActiveSection();
}

function updateActiveSection() {
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    let current = activeSection;
    
    for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = sectionId;
                break;
            }
        }
    }
    
    if (current !== activeSection) {
        activeSection = current;
        updateNavLinks();
    }
}

function updateNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    [...navLinks, ...mobileNavLinks].forEach(link => {
        const section = link.getAttribute('data-section');
        if (section === activeSection) {
            link.classList.add('active');
            link.style.color = 'var(--primary)';
        } else {
            link.classList.remove('active');
            link.style.color = '';
        }
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (isMobileMenuOpen) {
        mobileMenu.classList.remove('hidden');
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        mobileMenu.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
}

function closeMobileMenu() {
    isMobileMenuOpen = false;
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    
    mobileMenu.classList.add('hidden');
    hamburgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe elements that need animation
    const animatedElements = document.querySelectorAll('.card-hover');
    animatedElements.forEach(el => observer.observe(el));
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}

// Skills Animation
function initializeSkillsAnimation() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(skillsSection);
}

function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
            
            // Animate progress bar
            const skillLevel = parseInt(item.getAttribute('data-skill'));
            const progressFill = item.querySelector('.progress-fill');
            
            if (progressFill) {
                setTimeout(() => {
                    progressFill.style.width = skillLevel + '%';
                }, 300);
            }
        }, index * 100);
    });
}

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const submitText = submitBtn.querySelector('.submit-text');
    const loadingText = submitBtn.querySelector('.loading-text');
    
    // Show loading state
    submitText.classList.add('hidden');
    loadingText.classList.remove('hidden');
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Get form data
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    try {
        // Simulate form submission (replace with actual submission logic)
        const response = await fetch("https://formspree.io/f/mnnblaog", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(e.target)
    });

    if (response.ok) {
        showNotification("Message sent successfully! I'll get back to you soon.", "success");
        e.target.reset();
    } else {
        showNotification("Failed to send message. Please try again.", "error");
    }
        
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitText.classList.remove('hidden');
        loadingText.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 400px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Resume Download
function downloadResume() {
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = 'assets/OmkarResume.pdf';
    link.download = 'OmkarResume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Resume download started!', 'success');
}

// Utility Functions
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Smooth Scroll Polyfill for older browsers
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Performance Optimization - Debounced Scroll Handler
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

// Apply debouncing to scroll handler
window.addEventListener('scroll', debounce(handleScroll, 10));

// Preload Critical Resources
function preloadResources() {
    const criticalImages = [
        'src/assets/hero-background.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Portfolio Error:', e.error);
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        downloadResume,
        showNotification
    };
}