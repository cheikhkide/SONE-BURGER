// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');
const contactForm = document.querySelector('.contact-form');
const statNumbers = document.querySelectorAll('.stat-number');
const ctaButtons = document.querySelectorAll('.cta-button');

// Carousel Variables
let currentSlide = 0;
const totalSlides = slides.length;
let slideInterval;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCart();
    initSmoothScroll();
    initNavbarScroll();
    initContactForm();
    initStats();
    initCTAButtons();
    initCarousel();
});

// Navigation Mobile
function initNavigation() {
    // Hamburger Menu Toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Carousel Functions
function initCarousel() {
    if (slides.length === 0) return;
    
    showSlide(0);
    startAutoSlide();

    // Previous Button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            changeSlide(-1);
            resetAutoSlide();
        });
    }

    // Next Button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            changeSlide(1);
            resetAutoSlide();
        });
    }

    // Indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            goToSlide(index);
            resetAutoSlide();
        });
    });

    // Keyboard Navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
            resetAutoSlide();
        }
    });

    // Touch/Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                changeSlide(1);
                resetAutoSlide();
            }
            if (touchEndX > touchStartX + 50) {
                changeSlide(-1);
                resetAutoSlide();
            }
        }

        // Pause on hover
        const heroCarousel = document.querySelector('.hero-carousel');
        if (heroCarousel) {
            heroCarousel.addEventListener('mouseenter', stopAutoSlide);
            heroCarousel.addEventListener('mouseleave', startAutoSlide);
        }
    }
}

function showSlide(index) {
    if (slides.length === 0) return;
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Show current slide
    slides[index].classList.add('active');
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }

    // Animate slide content
    const slideContent = slides[index].querySelector('.slide-content');
    if (slideContent) {
        slideContent.style.animation = 'fadeIn 1s ease forwards';
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    
    showSlide(currentSlide);
}

function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
        currentSlide = index;
        showSlide(currentSlide);
    }
}

function startAutoSlide() {
    slideInterval = setInterval(function() {
        changeSlide(1);
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Cart Functions
function initCart() {
    updateCartCount();

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = menuItem.querySelector('.price').textContent;
            const itemImage = menuItem.querySelector('.menu-image img').getAttribute('src');
            
            // Vérifier si l'article existe déjà
            const existingItem = cartItems.find(item => item.name === itemName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    name: itemName,
                    price: itemPrice,
                    image: itemImage,
                    quantity: 1,
                    id: Date.now()
                });
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            updateCartCount();
            showAddedToCartAnimation(this);
        });
    });
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Animate cart count
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

function showAddedToCartAnimation(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 1500);
}

// Smooth Scroll
function initSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // CTA Buttons smooth scroll
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuSection = document.querySelector('#menu');
            if (menuSection) {
                const offsetTop = menuSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Contact Form
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Message envoyé!';
                submitBtn.style.background = '#27ae60';
                
                // Reset form
                this.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
        });
    }
}

// Stats Animation
function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers || statNumbers.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats(statNumbers);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateStats(statNumbers) {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (isNaN(target)) return;
        
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        updateCounter();
    });
}

// CTA Buttons
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    if (!ctaButtons) return;

    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('primary') || this.classList.contains('secondary')) {
                const menuSection = document.querySelector('#menu');
                if (menuSection) {
                    const offsetTop = menuSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.style.opacity = '0';
        observer.observe(item);
    });

    // Observe feature items
    document.querySelectorAll('.feature').forEach(item => {
        item.style.opacity = '0';
        observer.observe(item);
    });

    // Observe contact items
    document.querySelectorAll('.contact-item').forEach(item => {
        item.style.opacity = '0';
        observer.observe(item);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Loading Animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Utility Functions
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

// Resize Handler
const handleResize = debounce(function() {
    // Reset carousel on resize
    if (window.innerWidth <= 768) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
}, 250);

window.addEventListener('resize', handleResize);

// Performance Optimization
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    ticking = false;
}

// Initialize everything when page loads
window.addEventListener('load', function() {
    console.log('SNE BURGER - Site chargé avec succès!');
    
    // Check if cart has items and update count
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems.length > 0) {
        updateCartCount();
    }
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.message || e);
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker enregistré:', registration.scope);
            })
            .catch(function(error) {
                console.log('Erreur Service Worker:', error);
            });
    });
}