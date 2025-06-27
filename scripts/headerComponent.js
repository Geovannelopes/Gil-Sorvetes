/**
 * Header Component Loader
 * Gil Sorvetes - Sistema de carregamento do header
 */

class HeaderComponent {
    constructor() {
        this.headerLoaded = false;
        this.loadHeader();
    }

    async loadHeader() {
        try {
            // Check if header is already loaded
            if (document.querySelector('.main-header')) {
                this.headerLoaded = true;
                this.initializeHeader();
                return;
            }

            // Load header HTML
            const response = await fetch('./htmlComponent.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const headerHTML = await response.text();
            
            // Create a temporary container to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = headerHTML;
            
            // Extract only the header and nav elements
            const header = tempDiv.querySelector('header');
            const nav = tempDiv.querySelector('nav');
            
            if (header && nav) {
                // Insert header at the beginning of body
                document.body.insertBefore(header, document.body.firstChild);
                document.body.insertBefore(nav, document.body.children[1]);
                
                this.headerLoaded = true;
                this.initializeHeader();
                
                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('headerLoaded'));
            }
        } catch (error) {
            console.error('Erro ao carregar header:', error);
            this.createFallbackHeader();
        }
    }

    initializeHeader() {
        if (!this.headerLoaded) return;

        // Initialize all header functionality
        this.initMobileMenu();
        this.initSearch();
        this.initCartCounter();
        this.initNavigation();
        this.initAccessibility();
        this.initScrollEffects(); // Add scroll effects
        
        // Mark current page as active
        this.setActivePage();
    }

    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.getElementById('mainNav');
        const body = document.body;
        
        if (!mobileToggle || !mainNav) return;

        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('nav-open');
            body.classList.toggle('nav-open');
            
            // Prevent scroll when menu is open
            body.style.overflow = mainNav.classList.contains('nav-open') ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                if (mainNav.classList.contains('nav-open')) {
                    mobileToggle.click();
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('nav-open')) {
                mobileToggle.click();
            }
        });
    }

    initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.querySelector('.search-clear');
        const searchForm = document.querySelector('.search-form');
        
        if (!searchInput || !searchClear) return;

        // Debounce function for performance
        const debounce = (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };

        const debouncedSearch = debounce((value) => {
            if (window.handleSearch) {
                window.handleSearch(value);
            }
        }, 300);

        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            
            if (value.length > 0) {
                searchClear.style.display = 'block';
                debouncedSearch(value);
            } else {
                searchClear.style.display = 'none';
                if (window.handleSearch) {
                    window.handleSearch('');
                }
            }
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            searchClear.style.display = 'none';
            
            if (window.handleSearch) {
                window.handleSearch('');
            }
        });

        // Handle form submission
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const value = searchInput.value.trim();
                if (value && window.handleSearch) {
                    window.handleSearch(value);
                }
            });
        }
    }

    initCartCounter() {
        const updateCartCounter = () => {
            const cartCounter = document.getElementById('cartCounter');
            if (cartCounter && window.getCartItemCount) {
                const count = window.getCartItemCount();
                cartCounter.textContent = count;
                cartCounter.style.display = count > 0 ? 'flex' : 'none';
                cartCounter.setAttribute('data-count', count);
            }
        };

        // Listen for cart updates
        document.addEventListener('cartUpdated', updateCartCounter);
        
        // Initial update
        setTimeout(updateCartCounter, 100);
        
        // Expose function globally
        window.updateHeaderCartCounter = updateCartCounter;
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const mainNav = document.getElementById('mainNav');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                
                if (mainNav && mainNav.classList.contains('nav-open')) {
                    mobileToggle.click();
                }
            });
        });

        // Add loading state for external navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (!this.classList.contains('active') && !this.href.includes('#')) {
                    this.classList.add('loading');
                }
            });
        });
    }

    initAccessibility() {
        const mainNav = document.getElementById('mainNav');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (!mainNav || !mobileToggle) return;

        const focusableElements = mainNav.querySelectorAll(
            'a, button, input, [tabindex]:not([tabindex="-1"])'
        );

        // Focus management for mobile menu
        mobileToggle.addEventListener('click', () => {
            if (mainNav.classList.contains('nav-open')) {
                setTimeout(() => {
                    if (focusableElements.length > 0) {
                        focusableElements[0].focus();
                    }
                }, 100);
            }
        });

        // Trap focus within mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && mainNav.classList.contains('nav-open')) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    initScrollEffects() {
        const header = document.querySelector('.main-header');
        const body = document.body;
        
        if (!header) return;

        let lastScrollTop = 0;
        let ticking = false;
        let scrollDirection = 'down';

        const updateHeaderOnScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Determine scroll direction
            if (scrollTop > lastScrollTop) {
                scrollDirection = 'down';
            } else {
                scrollDirection = 'up';
            }
            
            // Add/remove scrolled class based on scroll position
            if (scrollTop > 50) {
                header.classList.add('scrolled');
                body.classList.add('header-scrolled');
            } else {
                header.classList.remove('scrolled');
                body.classList.remove('header-scrolled');
            }
            
            // Add scroll direction class for additional styling if needed
            header.setAttribute('data-scroll-direction', scrollDirection);
            
            // Update last scroll position
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeaderOnScroll);
                ticking = true;
            }
        };

        // Add scroll event listener with passive option for better performance
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Initial check
        updateHeaderOnScroll();
        
        // Add resize listener to recalculate on window resize
        const onResize = () => {
            updateHeaderOnScroll();
        };
        
        window.addEventListener('resize', onResize, { passive: true });
        
        // Store cleanup function for potential future use
        this.scrollCleanup = () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }

    setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if ((currentPage === 'index.html' && linkPage === 'home') ||
                (currentPage === '' && linkPage === 'home') ||
                currentPage.includes(linkPage)) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    createFallbackHeader() {
        // Create a simple fallback header if loading fails
        const fallbackHeader = document.createElement('header');
        fallbackHeader.className = 'main-header fallback';
        fallbackHeader.innerHTML = `
            <div class="header-container">
                <div class="logo-section">
                    <a href="index.html" class="logo-link">
                        <img src="./assets/logo/logo.jpg" alt="Gil Sorvetes" class="logo-img">
                    </a>
                </div>
                <nav class="simple-nav">
                    <a href="index.html">Home</a>
                    <a href="catalogo.html">Catálogo</a>
                    <a href="sobre.html">Sobre</a>
                    <a href="contato.html">Contato</a>
                    <a href="carrinho.html">Carrinho</a>
                </nav>
            </div>
        `;
        
        document.body.insertBefore(fallbackHeader, document.body.firstChild);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeaderComponent();
    });
} else {
    new HeaderComponent();
}

// Export for manual initialization if needed
window.HeaderComponent = HeaderComponent;
