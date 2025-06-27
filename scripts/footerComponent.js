/**
 * Footer Component Loader
 * Gil Sorvetes - Sistema de carregamento do footer
 */

class FooterComponent {
    constructor() {
        this.loadFooter();
    }

    async loadFooter() {
        try {
            // Check if footer is already loaded
            if (document.querySelector('footer')) {
                this.initializeFooter();
                return;
            }

            // Find footer placeholder
            const footerPlaceholder = document.getElementById('footer-placeholder') || 
                                    document.getElementById('footerComponent');
            
            if (!footerPlaceholder) {
                console.warn('Footer placeholder não encontrado');
                return;
            }

            // Load footer HTML
            const response = await fetch('./footerComponent.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const footerHTML = await response.text();
            
            // Insert footer HTML
            footerPlaceholder.innerHTML = footerHTML;
            
            this.initializeFooter();
            
            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('footerLoaded'));
            
        } catch (error) {
            console.error('Erro ao carregar footer:', error);
            this.createFallbackFooter();
        }
    }

    initializeFooter() {
        // Add any footer-specific functionality here
        this.addFooterAnimations();
        this.addSmoothScrolling();
    }

    addFooterAnimations() {
        // Add intersection observer for footer animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
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

            const footerSections = document.querySelectorAll('.footer-section');
            footerSections.forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'all 0.6s ease';
                observer.observe(section);
            });
        }
    }

    addSmoothScrolling() {
        // Add smooth scrolling for footer links
        const footerLinks = document.querySelectorAll('footer a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    createFallbackFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder') || 
                                document.getElementById('footerComponent');
        
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = `
                <footer style="background: #740491; color: white; padding: 20px 0; text-align: center;">
                    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                        <p>&copy; 2025 Gil Sorvetes. Todos os direitos reservados.</p>
                        <p>📞 (11) 99999-9999 | ✉️ contato@gilsorvetes.com.br</p>
                    </div>
                </footer>
            `;
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FooterComponent();
    });
} else {
    new FooterComponent();
}

// Export for manual initialization if needed
window.FooterComponent = FooterComponent;
