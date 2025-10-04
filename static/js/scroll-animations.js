// Scroll-based animations for portfolio elements
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollObserver();
        this.setupParallaxEffects();
        this.setupScrollTriggers();
    }

    setupScrollObserver() {
        const observerOptions = {
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -5% 0px' // Less aggressive margin for earlier triggering
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const ratio = entry.intersectionRatio;

                if (element.classList.contains('timeline-item')) {
                    this.animateTimelineItem(element, ratio);
                } else if (element.classList.contains('skill-item')) {
                    this.animateSkillItem(element, ratio);
                } else if (element.classList.contains('hero')) {
                    this.animateHero(element, ratio);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.timeline-item, .skill-item, .hero').forEach(el => {
            observer.observe(el);
        });
    }

    animateTimelineItem(element, ratio) {
        const stage3D = element.querySelector('.stage-3d');
        const content = element.querySelector('.timeline-content');
        
        if (ratio > 0.1) { // Trigger much sooner - at 10% visibility
            element.classList.add('visible');
            
            // Only fade in the 3D element - no movement
            if (stage3D) {
                stage3D.style.opacity = Math.min(ratio * 1.5, 1);
            }
            
            // Only fade in the content - no movement
            if (content) {
                content.style.opacity = Math.min(ratio * 1.5, 1);
            }
        } else {
            element.classList.remove('visible');
        }
    }

    animateSkillItem(element, ratio) {
        if (ratio > 0.4) {
            element.classList.add('visible');
            
            const skill3D = element.querySelector('.skill-3d');
            if (skill3D) {
                const scale = Math.min(ratio * 1.2, 1);
                const rotateY = ratio * 360;
                skill3D.style.transform = `scale(${scale}) rotateY(${rotateY}deg)`;
                skill3D.style.opacity = ratio;
            }
        }
    }

    animateHero(element, ratio) {
        const hero3D = element.querySelector('#hero-3d');
        const heroContent = element.querySelector('.hero-content');
        
        if (hero3D) {
            // Parallax effect for 3D scene
            const translateY = (1 - ratio) * 100;
            hero3D.style.transform = `translateY(${translateY}px)`;
        }
        
        if (heroContent) {
            heroContent.style.opacity = ratio;
        }
    }

    setupParallaxEffects() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // Parallax for hero section
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }

            // Update 3D timeline rotations based on scroll
            if (window.portfolio3D) {
                window.portfolio3D.updateTimelineRotations();
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    setupScrollTriggers() {
        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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

        // Add scroll progress indicator
        this.createScrollProgress();
    }

    createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #10b981, #f59e0b);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Method to trigger specific animations
    triggerAnimation(element, animationType) {
        element.classList.add(`animate-${animationType}`);
        
        setTimeout(() => {
            element.classList.remove(`animate-${animationType}`);
        }, 1000);
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
    
    // Add loading animation to body
    document.body.classList.add('loaded');
});
