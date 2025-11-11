// --- 360° Viewer with Preloading ---
const viewer = document.getElementById('viewer');
const frameImg = document.getElementById('frame');
const total = 50;
const preloadedFrames = [];
let loadedCount = 0;
let isPreloading = true;

// Create loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10';
loadingIndicator.innerHTML = `
    <div class="text-white text-center">
        <div class="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-sm">جاري تحميل العرض 360°</p>
        <p class="text-xs mt-1"><span id="loadProgress">0</span>/${total}</p>
    </div>
`;
viewer.appendChild(loadingIndicator);
viewer.style.position = 'relative';

// Preload all frames
function preloadFrames() {
    for (let i = 1; i <= total; i++) {
        const img = new Image();
        const frameNumber = String(i).padStart(4, '0');
        img.src = `assets/360 viewer/bottle-${frameNumber}.png`;
        
        img.onload = () => {
            loadedCount++;
            document.getElementById('loadProgress').textContent = loadedCount;
            
            // Remove loading indicator when all frames are loaded
            if (loadedCount === total) {
                isPreloading = false;
                loadingIndicator.remove();
                // Enable interaction
                viewer.classList.add('cursor-move');
            }
        };
        
        img.onerror = () => {
            console.error(`Failed to load frame: bottle-${frameNumber}.png`);
            loadedCount++;
            if (loadedCount === total) {
                isPreloading = false;
                loadingIndicator.remove();
            }
        };
        
        preloadedFrames.push(img);
    }
}

// Start preloading immediately
preloadFrames();

// Update frame function using preloaded images
function updateFrame(x) {
    if (isPreloading) return; // Don't update while preloading
    
    const rect = viewer.getBoundingClientRect();
    const pct = Math.min(Math.max((x - rect.left) / rect.width, 0), 1);
    const index = Math.ceil(pct * (total - 1));
    
    // Use preloaded frame if available
    if (preloadedFrames[index] && preloadedFrames[index].complete) {
        frameImg.src = preloadedFrames[index].src;
    } else {
        // Fallback to direct loading if preloaded frame not available
        const frameNumber = String(index + 1).padStart(4, '0');
        frameImg.src = `assets/360 viewer/bottle-${frameNumber}.png`;
    }
}

// Add event listeners
viewer.addEventListener('mousemove', e => updateFrame(e.clientX));
viewer.addEventListener('touchmove', e => {
    e.preventDefault();
    updateFrame(e.touches[0].clientX);
});

// Add mouse drag support for better UX
let isDragging = false;
let startX = 0;

viewer.addEventListener('mousedown', e => {
    if (!isPreloading) {
        isDragging = true;
        startX = e.clientX;
        viewer.style.cursor = 'grabbing';
    }
});

viewer.addEventListener('mouseup', () => {
    isDragging = false;
    viewer.style.cursor = 'move';
});

viewer.addEventListener('mouseleave', () => {
    isDragging = false;
    viewer.style.cursor = 'move';
});

viewer.addEventListener('mousemove', e => {
    if (isDragging && !isPreloading) {
        updateFrame(e.clientX);
    }
});

// --- Get product name from URL ---
const params = new URLSearchParams(window.location.search);
const currentName = params.get('name') || 'عطر فاخر';
document.getElementById('productName').textContent = currentName;

// --- Ingredient Cards with Preloading ---
const noteButtons = document.querySelectorAll('.note-btn');
const hoverCard = document.getElementById('hoverCard');
const hoverImg = document.getElementById('hoverImg');
const hoverDesc = document.getElementById('hoverDesc');

// Preload ingredient images
noteButtons.forEach(btn => {
    const img = new Image();
    img.src = btn.dataset.img;
});

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

if (productGrid) {
    productGrid.innerHTML = '';
    productData.filter(p => p.name !== currentName) // exclude current product
    .forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-gray-900 rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl border border-transparent hover:border-yellow-500';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover" loading="lazy">
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