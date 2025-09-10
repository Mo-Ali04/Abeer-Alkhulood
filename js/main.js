const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileMenu');
const navbar = document.querySelector('nav');

// Mobile menu toggle
mobileBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
});

// Scroll effect for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        navbar.classList.remove('bg-black/80');
        navbar.classList.add('bg-gray-500/50', 'shadow-lg', 'backdrop-blur-md');
    } else {
        navbar.classList.remove('bg-gray-500/50', 'shadow-lg', 'backdrop-blur-md');
        navbar.classList.add('bg-black/80');
    }
});