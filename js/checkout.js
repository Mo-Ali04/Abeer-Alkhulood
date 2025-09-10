// --- Form & Validation ---
const form = document.getElementById('checkoutForm');
const thankYou = document.getElementById('thankYou');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const card = document.getElementById('card');
const brand = document.getElementById('cardBrand');

// Live validation
phone.addEventListener('input', () => {
    phone.style.borderColor = /^\d{10,}$/.test(phone.value) ? 'green' : 'red';
});
email.addEventListener('input', () => {
    email.style.borderColor = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? 'green' : 'red';
});

// Card formatting + brand detection
card.addEventListener('input', () => {
    let raw = card.value.replace(/\D/g, '');
    card.value = raw.replace(/(\d{4})(?=\d)/g, '$1 ').trim();

    if (/^4/.test(raw)) brand.textContent = 'Visa';
    else if (/^5[1-5]/.test(raw)) brand.textContent = 'Mastercard';
    else brand.textContent = '';
});

// On submit
form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('opacity-0');
    setTimeout(() => {
        form.style.display = 'none';
        thankYou.classList.remove('hidden');
        thankYou.classList.add('opacity-100');
        // Optionally clear cart after checkout
        mainCart = [];
        localStorage.setItem('cartList', JSON.stringify(mainCart));
        updateCartCount();
    }, 500);
});

// --- Cart Rendering ---
const cartList = document.getElementById('checkoutCart');
const cartTotal = document.getElementById('cartTotal');

function renderCheckoutCart() {
    cartList.innerHTML = '';
    let total = 0;

    if (mainCart.length === 0) {
        cartList.innerHTML = '<li class="text-gray-400">السلة فارغة</li>';
        cartTotal.textContent = 'EGP 0';
        return;
    }

    mainCart.forEach((item, index) => {
        const price = productPrices[item.name] || 0;
        const itemTotal = item.quantity * price;
        total += itemTotal;

        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-gray-800 p-4 rounded text-white';

        li.innerHTML = `
            <div>
                <h3 class="font-semibold">${item.name}</h3>
                <p class="text-sm text-yellow-300">EGP ${price} × ${item.quantity} = EGP ${itemTotal}</p>
            </div>
            <div class="flex items-center gap-2">
                <button class="px-2 py-1 bg-yellow-500 text-black rounded" data-action="decrement" data-index="${index}">−</button>
                <span>${item.quantity}</span>
                <button class="px-2 py-1 bg-yellow-500 text-black rounded" data-action="increment" data-index="${index}">+</button>
                <button class="px-2 py-1 text-red-500 hover:text-red-700" data-action="remove" data-index="${index}">🗑️</button>
            </div>
        `;

        cartList.appendChild(li);
    });

    cartTotal.textContent = `EGP ${total}`;
    localStorage.setItem('cartList', JSON.stringify(mainCart));
    updateCartCount();
}

// Handle quantity changes
cartList.addEventListener('click', e => {
    const btn = e.target;
    const index = parseInt(btn.dataset.index);
    const action = btn.dataset.action;

    if (action === 'increment') {
        mainCart[index].quantity += 1;
    } else if (action === 'decrement') {
        mainCart[index].quantity = Math.max(1, mainCart[index].quantity - 1);
    } else if (action === 'remove') {
        mainCart.splice(index, 1);
    }

    localStorage.setItem('cartList', JSON.stringify(mainCart));
    updateCartCount();
    renderCartItems?.(); // If cart preview exists
    renderCheckoutCart();
});

renderCheckoutCart();