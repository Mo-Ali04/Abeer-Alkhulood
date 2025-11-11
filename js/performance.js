// Performance Optimization Script
// Handles progressive image loading and lazy loading with intersection observer

(function() {
    'use strict';
    
    // Progressive Image Loading
    function loadImage(img) {
        const src = img.dataset.src || img.src;
        if (!src) return;
        
        // Create a new image element to preload
        const newImg = new Image();
        
        newImg.onload = function() {
            img.src = src;
            img.classList.add('loaded');
            // Remove blur effect if applied
            if (img.classList.contains('blur-load')) {
                setTimeout(() => {
                    img.classList.remove('blur-load');
                }, 50);
            }
        };
        
        newImg.onerror = function() {
            console.error(`Failed to load image: ${src}`);
        };
        
        newImg.src = src;
    }
    
    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Load the image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
    });
    
    // Apply lazy loading to all images with data-src attribute
    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
        
        // Also observe dynamically added images
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'IMG' && node.dataset.src) {
                            imageObserver.observe(node);
                        }
                        // Check for images in child nodes
                        const imgs = node.querySelectorAll && node.querySelectorAll('img[data-src]');
                        if (imgs) {
                            imgs.forEach(img => imageObserver.observe(img));
                        }
                    }
                });
            });
        });
        
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
    
    // Optimize video loading
    const videos = document.querySelectorAll('video[data-src]');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.removeAttribute('data-src');
                    video.load();
                }
                videoObserver.unobserve(video);
            }
        });
    });
    
    videos.forEach(video => videoObserver.observe(video));
    
    // Connection speed detection and quality adjustment
    if ('connection' in navigator) {
        const connection = navigator.connection;
        
        function adjustMediaQuality() {
            const effectiveType = connection.effectiveType;
            const saveData = connection.saveData;
            
            if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
                // Load lower quality images
                document.documentElement.classList.add('low-quality');
                console.log('Loading lower quality media due to slow connection');
            } else {
                document.documentElement.classList.remove('low-quality');
            }
        }
        
        adjustMediaQuality();
        connection.addEventListener('change', adjustMediaQuality);
    }
    
    // Preload critical resources
    function preloadResource(url, type) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = type;
        link.href = url;
        document.head.appendChild(link);
    }
    
    // Resource hints for better performance
    function addResourceHint(url, rel) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = url;
        document.head.appendChild(link);
    }
    
    // DNS prefetch for external resources
    const externalDomains = [
        'https://cdn.jsdelivr.net',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];
    
    externalDomains.forEach(domain => {
        addResourceHint(domain, 'dns-prefetch');
        addResourceHint(domain, 'preconnect');
    });
    
    // Export utilities for use in other scripts
    window.PerformanceUtils = {
        loadImage: loadImage,
        preloadResource: preloadResource,
        addResourceHint: addResourceHint
    };
    
})();
