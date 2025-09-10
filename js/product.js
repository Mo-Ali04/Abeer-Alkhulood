// --- 360° Viewer ---
const viewer = document.getElementById('viewer');
const frameImg = document.getElementById('frame');
const total = 50;

function updateFrame(x) {
    const rect = viewer.getBoundingClientRect();
    const pct = Math.min(Math.max((x - rect.left) / rect.width, 0), 1);
    const index = Math.ceil(pct * (total - 1)) + 1;
    frameImg.src = `assets/360 viewer/bottle-${String(index).padStart(4, '0')}.png`;
}
viewer.addEventListener('mousemove', e => updateFrame(e.clientX));
viewer.addEventListener('touchmove', e => updateFrame(e.touches[0].clientX));

// --- Get product name from URL ---
const params = new URLSearchParams(window.location.search);
const currentName = params.get('name') || 'عطر فاخر';
document.getElementById('productName').textContent = currentName;

// --- Ingredient Cards ---
const noteButtons = document.querySelectorAll('.note-btn');
const hoverCard = document.getElementById('hoverCard');
const hoverImg = document.getElementById('hoverImg');
const hoverDesc = document.getElementById('hoverDesc');

noteButtons.forEach(btn => {
    btn.addEventListener('mouseenter', e => {
        hoverImg.src = btn.dataset.img;
        hoverDesc.textContent = btn.dataset.desc;
        hoverCard.classList.remove('hidden');
        positionCard(e);
    });

    btn.addEventListener('mousemove', e => {
        positionCard(e);
    });

    btn.addEventListener('mouseleave', () => {
        hoverCard.classList.add('hidden');
    });
});

function positionCard(e) {
    hoverCard.style.left = `${e.pageX + 15}px`;
    hoverCard.style.top = `${e.pageY + 15}px`;
}

// --- Add to Cart with animation ---
const addBtn = document.getElementById('addCart');
if (addBtn && typeof addToCart === 'function') {
    addBtn.addEventListener('click', () => {
        addToCart(currentName);
        updateCartCount();
        renderCartItems?.();

        const thumb = viewer.cloneNode(true);
        const startRect = addBtn.getBoundingClientRect();
        const endRect = document.getElementById('cartIcon').getBoundingClientRect();
        Object.assign(thumb.style, {
            position: 'fixed',
            left: `${startRect.left}px`,
            top: `${startRect.top}px`,
            width: `${startRect.width}px`,
            height: `${startRect.height}px`,
            transition: 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out',
            zIndex: 1000,
            pointerEvents: 'none',
        });
        document.body.appendChild(thumb);
        requestAnimationFrame(() => {
            const dx = endRect.left - startRect.left;
            const dy = endRect.top - startRect.top;
            thumb.style.transform = `translate(${dx}px, ${dy}px) scale(0.2)`;
            thumb.style.opacity = '0.5';
        });
        thumb.addEventListener('transitionend', () => thumb.remove(), { once: true });
    });
}

// --- Product Data ---
const productData = [
    { name: "عطر وردي", description: "رائحة زهرية ناعمة تناسب النهار والمناسبات الخاصة.", image: "assets/perfume1.jpg" },
    { name: "عطر بخور ناعم", description: "مزيج من الأخشاب والبخور يمنحك إحساساً بالدفء والفخامة.", image: "assets/perfume2.jpg" },
    { name: "عطر فواكه منعشة", description: "رائحة فاكهية مليئة بالحيوية تناسب الأيام الصيفية.", image: "assets/perfume3.jpg" },
    { name: "عطر فواكه استوائية", description: "رائحة فاكهية استوائية تناسب المناسبات الخاصة.", image: "assets/perfume4.jpg" },
    { name: "عطر ياسمين", description: "رائحة زهرية أنثوية تناسب السهرات الليلية.", image: "assets/perfume5.jpg" },
    { name: "عطر خشب الصندل", description: "رائحة خشبية دافئة تناسب السهرات الخاصة.", image: "assets/perfume6.jpg" },
    { name: "عطر مانجو منعش", description: "رائحة فاكهية منعشة تناسب النهار والمناسبات الخاصة.", image: "assets/perfume7.jpg" },
    { name: "عطر العود الملكي", description: "رائحة أخشاب غنية تناسب المناسبات الخاصة.", image: "assets/perfume8.jpg" },
    { name: "عطر زهور ملكي", description: "رائحة زهرية ملكية تناسب المناسبات الخاصة.", image: "assets/perfume9.jpg" }
];

// --- Inject all other products ---
const productGrid = document.getElementById('productGrid');

if ( productGrid ) {
    productGrid.innerHTML = '';
    productData.filter(p => p.name !== currentName) // exclude current product
    .forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-gray-900 rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl border border-transparent hover:border-yellow-500';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
            <div class="p-6 space-y-4">
                <h3 class="text-xl font-semibold text-yellow-300">${product.name}</h3>
                <p class="text-sm text-gray-300">${product.description}</p>
                <div class="flex gap-2">
                    <a href="product.html?name=${encodeURIComponent(product.name)}" class="flex-1 bg-yellow-500 text-black px-4 py-2 rounded-full text-center hover:bg-yellow-600 transition">عرض التفاصيل</a>
                    <button onclick="addToCart('${product.name}')" class="bg-gold text-black px-4 py-2 rounded-full hover:bg-opacity-80 transition">+</button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}