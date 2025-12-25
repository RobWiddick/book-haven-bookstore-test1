// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            const isActive = nav.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
        });
    }
});

// Handle footer newsletter subscriptions
window.subscribeNewsletter = function() {
    const email = document.getElementById('newsletter-email').value;
    if (email) {
        // Save to LocalStorage
        let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        subscriptions.push({
            email: email,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));

        alert('Thank you for subscribing!');
        document.getElementById('newsletter-email').value = '';
    } else {
        alert('Please enter a valid email address.');
    }
};

// Handle contact form submissions
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            reason: document.getElementById('reason').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Save to LocalStorage
        let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

        alert('Thank you for your submission! We will get back to you soon.');
        contactForm.reset();
    });
}

// Shopping cart functionality, global cart
// Load cart from sessionStorage on page load
let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
        const galleryItem = this.closest('.gallery-item');
        const title = galleryItem.querySelector('h3').textContent;
        const description = galleryItem.querySelector('p').textContent;
        const imageSrc = galleryItem.querySelector('img').src;

        const item = {
            id: index,
            title: title,
            description: description,
            image: imageSrc
        };

        cart.push(item);
        // Save cart to sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cart));
        alert('Item added.');
    });
});

// View cart modal functionality
const viewCartBtn = document.getElementById('view-cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotal = document.getElementById('cart-total');
let lastFocusedElement;

// Display cart on View Cart button click
if (viewCartBtn) {
    viewCartBtn.addEventListener('click', function() {
        displayCart();
        lastFocusedElement = document.activeElement;
        cartModal.classList.add('active');
        // Focus on close button when modal opens
        setTimeout(() => closeCartBtn?.focus(), 100);
    });
}

// Close cart when user clicks 'X' in cart modal
if (closeCartBtn) {
    closeCartBtn.addEventListener('click', function() {
        cartModal.classList.remove('active');
        // Return focus to the element that opened the modal
        lastFocusedElement?.focus();
    });
}

// Close modal when clicking outside
cartModal?.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
        lastFocusedElement?.focus();
    }
});

// Trap focus within modal when open
if (cartModal) {
    cartModal.addEventListener('keydown', function(e) {
        if (!cartModal.classList.contains('active')) return;

        const focusableElements = cartModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Handle Tab key
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }

        // Handle Escape key
        if (e.key === 'Escape') {
            cartModal.classList.remove('active');
            lastFocusedElement?.focus();
        }
    });
}

// Display cart as a modal using JS templating
function displayCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
        cartTotal.innerHTML = '';
    } else {
        cartItemsContainer.innerHTML = cart.map((item) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
        cartTotal.innerHTML = `<strong>Total Items: ${cart.length}</strong>`;
    }
}

// Clear cart functionality
const clearCartBtn = document.getElementById('clear-cart-btn');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
        cart = [];
        // Clear cart from sessionStorage
        sessionStorage.removeItem('cart');
        displayCart();
    });
}

// Process order functionality
const processOrderBtn = document.getElementById('process-order-btn');
if (processOrderBtn) {
    processOrderBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            // Save to LocalStorage
            let orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push({
                items: cart,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('orders', JSON.stringify(orders));

            alert('Thank you for your order.');
            cart = [];
            // Clear cart from sessionStorage
            sessionStorage.removeItem('cart');
            displayCart();
            cartModal.classList.remove('active');
        } else {
            alert('Your cart is empty.');
        }
    });
}