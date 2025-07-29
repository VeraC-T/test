// Portfolio-specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolioFilters();
    initializePortfolioGallery();
    initializeLightbox();
});

// Portfolio filtering functionality
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(galleryItems, filterValue);
        });
    });
}

function filterGalleryItems(items, filterValue) {
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
            // Show item
            item.style.display = 'block';
            setTimeout(() => {
                item.classList.remove('filtered-out');
                item.classList.add('filter-in');
            }, 10);
        } else {
            // Hide item
            item.classList.add('filtered-out');
            item.classList.remove('filter-in');
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Portfolio gallery interactions
function initializePortfolioGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const viewBtn = item.querySelector('.gallery-btn-view');
        const zoomBtn = item.querySelector('.gallery-btn-zoom');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openArtworkDetails(item);
            });
        }
        
        if (zoomBtn) {
            zoomBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openLightboxFromItem(item);
            });
        }
        
        // Click on item to open lightbox
        item.addEventListener('click', function() {
            openLightboxFromItem(item);
        });
        
        // Keyboard navigation
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightboxFromItem(item);
            }
        });
        
        // Make gallery items focusable for accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'View artwork details');
    });
}

function openArtworkDetails(item) {
    // This would typically navigate to a detailed artwork page
    // For now, we'll open the lightbox
    openLightboxFromItem(item);
}

function openLightboxFromItem(item) {
    const image = item.querySelector('.gallery-image');
    const title = item.querySelector('.gallery-title').textContent;
    const category = item.querySelector('.gallery-category').textContent;
    const description = item.querySelector('.gallery-description').textContent;
    
    openLightbox(image.src, title, category, description);
}

// Lightbox functionality
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard events for lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

function openLightbox(imageSrc, title, category, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxDescription = document.getElementById('lightbox-description');
    
    if (!lightbox) return;
    
    // Set content
    if (lightboxImage) lightboxImage.src = imageSrc;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;
    if (lightboxDescription) lightboxDescription.textContent = description;
    
    // Show lightbox
    lightbox.style.display = 'flex';
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const lightboxClose = document.getElementById('lightbox-close');
    if (lightboxClose) {
        lightboxClose.focus();
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    setTimeout(() => {
        lightbox.style.display = 'none';
    }, 300);
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Lazy loading for portfolio images
function initializeLazyLoading() {
    const images = document.querySelectorAll('.gallery-image[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
        });
    }
}

// Portfolio search functionality (optional enhancement)
function initializePortfolioSearch() {
    const searchInput = document.getElementById('portfolio-search');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const title = item.querySelector('.gallery-title').textContent.toLowerCase();
            const description = item.querySelector('.gallery-description').textContent.toLowerCase();
            const category = item.querySelector('.gallery-category').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                category.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.remove('filtered-out');
            } else {
                item.style.display = 'none';
                item.classList.add('filtered-out');
            }
        });
    });
}

// Masonry layout for gallery (optional enhancement)
function initializeMasonryLayout() {
    const gallery = document.querySelector('.gallery-grid');
    
    if (!gallery || typeof Masonry === 'undefined') return;
    
    const masonry = new Masonry(gallery, {
        itemSelector: '.gallery-item',
        columnWidth: '.gallery-item',
        gutter: 24,
        percentPosition: true
    });
    
    // Re-layout after images load
    gallery.addEventListener('load', function() {
        masonry.layout();
    }, true);
}

// Portfolio animations on scroll
function initializeScrollAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Initialize all portfolio features
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializePortfolioSearch();
    initializeScrollAnimations();
    
    // Optional: Initialize masonry if library is available
    if (typeof Masonry !== 'undefined') {
        initializeMasonryLayout();
    }
});

// Performance optimization for gallery
function optimizeGalleryPerformance() {
    // Debounce filter operations
    let filterTimeout;
    const originalFilterFunction = filterGalleryItems;
    
    window.filterGalleryItems = function(items, filterValue) {
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(() => {
            originalFilterFunction(items, filterValue);
        }, 150);
    };
    
    // Throttle scroll events if needed
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            // Perform scroll-related operations here
        }, 16); // ~60fps
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizeGalleryPerformance);

// Touch gestures for mobile (optional enhancement)
function initializeTouchGestures() {
    if (!('ontouchstart' in window)) return;
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        let touchStartY = 0;
        let touchStartX = 0;
        
        item.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        });
        
        item.addEventListener('touchend', function(e) {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;
            
            // Simple tap detection
            if (Math.abs(deltaY) < 10 && Math.abs(deltaX) < 10) {
                openLightboxFromItem(item);
            }
        });
    });
}

// Initialize touch gestures
document.addEventListener('DOMContentLoaded', initializeTouchGestures);