// Scroll-based animations for portfolio elements
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollObserver();
        this.setupParallaxEffects();
        this.setupScrollTriggers();
        this.setupJourneyBackgroundChange();
        this.setupNavigationHighlight();
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

    // Background color change based on journey section scroll
    setupJourneyBackgroundChange() {
        const journeySection = document.querySelector('.portfolio-timeline');
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if (!journeySection || timelineItems.length === 0) return;

        const colors = [
            [25, 35, 80],   // Education - vibrant blue [#192350]
            [80, 25, 50],   // Work - deep red/magenta [#501932]
            [25, 80, 70]    // Current - vibrant teal [#195046]
        ];

        // Helper function to interpolate between two colors
        const interpolateColor = (color1, color2, factor) => {
            const result = [];
            for (let i = 0; i < 3; i++) {
                result[i] = Math.round(color1[i] + factor * (color2[i] - color1[i]));
            }
            return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
        };

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const journeyTop = journeySection.offsetTop;
            const journeyBottom = journeyTop + journeySection.offsetHeight;
            
            // Only change background when in or near journey section
            if (scrollY >= journeyTop - 300 && scrollY <= journeyBottom + 300) {
                // Calculate scroll progress through the journey section
                const journeyProgress = Math.max(0, Math.min(1, 
                    (scrollY - journeyTop + 300) / (journeySection.offsetHeight + 600)
                ));
                
                // Calculate which two colors to interpolate between
                const colorIndex = journeyProgress * (colors.length - 1);
                const currentColorIndex = Math.floor(colorIndex);
                const nextColorIndex = Math.min(currentColorIndex + 1, colors.length - 1);
                const factor = colorIndex - currentColorIndex;
                
                // Interpolate between the current and next color
                const interpolatedColor = interpolateColor(
                    colors[currentColorIndex],
                    colors[nextColorIndex],
                    factor
                );
                
                // Apply the interpolated background color
                document.documentElement.style.setProperty('--bg-color', interpolatedColor);
            } else if (scrollY < journeyTop - 300) {
                // Reset to original color before journey section
                document.documentElement.style.setProperty('--bg-color', '#0f172a');
            }
        });
    }

    setupNavigationHighlight() {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        const sections = document.querySelectorAll('section[id]');
        let clickTimeout = null;
        let currentActive = null;
        
        // Helper function to update active state
        const updateActiveState = (targetId) => {
            if (currentActive === targetId) return; // Don't update if already active
            
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                currentActive = targetId;
            }
        };
        
        // Add click handlers for immediate active state update
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                updateActiveState(targetId);
                
                // Prevent observer from overriding for a longer time
                if (clickTimeout) clearTimeout(clickTimeout);
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                }, 2000);
            });
        });
        
        // Use scroll-based approach instead of intersection observer
        let ticking = false;
        
        const checkActiveSection = () => {
            if (clickTimeout) return;
            
            const scrollPosition = window.scrollY + window.innerHeight / 3; // Check 1/3 down from top
            
            let activeSection = null;
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const sectionBottom = sectionTop + rect.height;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    activeSection = section.id;
                }
            });
            
            if (activeSection && activeSection !== currentActive) {
                updateActiveState(activeSection);
            }
            
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(checkActiveSection);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll);
        
        // Initial check
        checkActiveSection();
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
    
    // Add loading animation to body
    document.body.classList.add('loaded');
});
