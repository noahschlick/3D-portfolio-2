// Mobile Navigation Menu
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
}

// Make functions globally available
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

// Also add event listener approach as backup
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Add event listeners to nav links for closing
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('.nav');
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    if (!nav.contains(event.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Close menu when window is resized to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navLinks = document.getElementById('nav-links');
        const hamburger = document.querySelector('.hamburger');
        
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});