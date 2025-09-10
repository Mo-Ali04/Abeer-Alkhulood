const cartIcon = document.getElementById('cartIcon');
const cartPreview = document.getElementById('cartPreview');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');

// Example price list (match product names exactly)
const productPrices = {
    "عطر وردي": 850,
    "عطر زهر البرتقال": 900,
    "عطر ياسمين": 780,
    "عطر توت بري": 1220,
    "عطر مانجو منعش": 640,
    "عطر فواكه استوائية": 1060,
    "عطر بخور ناعم": 1350,
    "عطر خشب الصندل": 1400,
    "عطر العود الملكي": 2500
};

// Load cart from localStorage
let mainCart = JSON.parse(localStorage.getItem('cartList') || '[]');
updateCartCount();

// Show cart preview
if (cartIcon && cartPreview && cartItems) {
    cartIcon.addEventListener('click', () => {
        cartPreview.classList.toggle('hidden');
        renderCartItems();
    });
}

// Add item to cart (with quantity)
function addToCart(name) {
    const existing = mainCart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        mainCart.push({ name, quantity: 1 });
    }
    localStorage.setItem('cartList', JSON.stringify(mainCart));
    updateCartCount();
}

// Remove item from cart
function removeFromCart(name) {
    mainCart = mainCart.filter(item => item.name !== name);
    localStorage.setItem('cartList', JSON.stringify(mainCart));
    updateCartCount();
    renderCartItems();
    renderCheckoutCart();
}

// Update cart count badge
function updateCartCount() {
    if (cartCount) {
        const total = mainCart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = total;
    }
}

// Render cart preview list with total + checkout
function renderCartItems() {
    cartItems.innerHTML = '';

    if (mainCart.length === 0) {
        cartItems.innerHTML = '<li class="text-gray-500">السلة فارغة</li>';
        updateCartCount();
        return;
    }

    let totalPrice = 0;

    mainCart.forEach(item => {
        const price = productPrices[item.name] || 0;
        totalPrice += price * item.quantity;

        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-gray-100 p-2 rounded text-black';

        li.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span class="text-sm text-gray-700">${price * item.quantity} ج.م</span>
            <button class="text-red-600 hover:text-red-800 text-sm" data-remove="${item.name}">إزالة</button>
        `;

        cartItems.appendChild(li);
    });

    // Attach remove handlers
    cartItems.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.remove;
            removeFromCart(name);
        });
    });

    // Add total + checkout button
    const totalLi = document.createElement('li');
    totalLi.className = 'flex justify-between items-center font-bold text-black mt-2 border-t pt-2';
    totalLi.innerHTML = `<span>الإجمالي</span><span>${totalPrice} ج.م</span>`;
    cartItems.appendChild(totalLi);

    const checkoutLi = document.createElement('li');
    checkoutLi.className = 'mt-3';
    checkoutLi.innerHTML = `
        <a href="checkout.html" class="block w-full bg-yellow-500 text-black text-center py-2 rounded hover:bg-yellow-600 transition">
            إتمام الشراء
        </a>
    `;
    cartItems.appendChild(checkoutLi);

    updateCartCount();
}

// Expose globally
window.addToCart = addToCart;