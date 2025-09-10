const advisorStep = document.getElementById('advisorStep');
const backgroundContainer = document.getElementById('backgroundContainer');

let userChoice = {
    scent: null,
    time: null
};

function showStep(step) {
    advisorStep.innerHTML = ''; // Clear previous content

    if (step === 1) {
        showBackgroundForStep(1);
        advisorStep.innerHTML = `
            <h1 class="text-3xl font-bold text-yellow-400">إيه الإحساس اللي بتدور عليه النهاردة؟</h1>
            <button class="bg-gold text-gray-500 px-6 py-3 rounded-full hover:scale-105 transition" onclick="showStep(2)">استكشاف العطور</button>
        `;
    }

    if (step === 2) {
        advisorStep.innerHTML = `
            <h2 class="text-yellow-400 text-2xl mb-4">اختار نوع الروائح</h2>
            <div class="flex justify-center gap-4">
                <button onclick="selectScent('flowers')" class="scent-btn bg-gold text-gray-500 px-6 py-3 rounded-full hover:scale-105 transition">زهور</button>
                <button onclick="selectScent('fruits')" class="scent-btn bg-gold text-gray-500 px-6 py-3 rounded-full hover:scale-105 transition">فواكه</button>
                <button onclick="selectScent('woods')" class="scent-btn bg-gold text-gray-500 px-6 py-3 rounded-full hover:scale-105 transition">أخشاب</button>
            </div>
        `;
    }

    if (step === 3) {
        advisorStep.innerHTML = `
            <h2 class="text-yellow-400 text-2xl mb-4">وقت الاستخدام</h2>
            <div class="flex justify-center gap-4">
                <button onclick="selectTime('day')" class="time-btn bg-gold text-gray-500 px-6 py-3 rounded-full hover:scale-105 transition">نهار</button>
                <button onclick="selectTime('night')" class="time-btn bg-gold text-gray-500 px-6 py-3 rounded-full hover:scale-105 transition">ليل</button>
                <button onclick="selectTime('special')" class="time-btn bg-gold text-gray-500 px-6 py-3 rounded-full hover:scale-105 transition">مناسبة خاصة</button>
            </div>
        `;
    }

    if (step === 4) {
        advisorStep.innerHTML = `
            <h2 class="text-2xl mb-6">العطور المُقترحة ليك</h2>
            <div id="suggestions" class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                ${generateSuggestions(userChoice.scent, userChoice.time)}
            </div>
        `;
    }
}

function selectScent(scent) {
    userChoice.scent = scent;
    showBackgroundForStep(2, scent);
    showStep(3);
}

function selectTime(time) {
    userChoice.time = time;
    showBackgroundForStep(4);
    showStep(4);
}

function showBackgroundForStep(step, choice) {
    backgroundContainer.style.opacity = '0';

    setTimeout(() => {
        backgroundContainer.innerHTML = '';

        if (step === 1) {
            backgroundContainer.innerHTML = `
                <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover">
                    <source src="assets/spray-showcase.mp4" type="video/mp4"/>
                </video>
            `;
        } 
        else if (step === 2 && choice) {
            const scentImages = {
                flowers: 'assets/flowers.jpg',
                fruits: 'assets/fruits.jpg',
                woods: 'assets/woods.jpg'
            };
            backgroundContainer.innerHTML = `
                <img src="${scentImages[choice]}" class="absolute inset-0 w-full h-full object-cover" />
            `;
        } 
        else if (step === 4 && userChoice.time) {
            const timeImages = {
                day: 'assets/day.jpg',
                night: 'assets/night.jpg',
                special: 'assets/special.jpg'
            };
            backgroundContainer.innerHTML = `
                <img src="${timeImages[userChoice.time]}" class="absolute inset-0 w-full h-full object-cover" />
            `;
        }

        backgroundContainer.style.opacity = '1';
    }, 300);
}

productData = [
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

function generateSuggestions(scent, time) {
    const suggestions = {
        flowers: ["عطر وردي", "عطر زهور ملكي", "عطر ياسمين"],
        fruits: ["عطر فواكه منعشة", "عطر مانجو منعش", "عطر فواكه استوائية"],
        woods: ["عطر بخور ناعم", "عطر خشب الصندل", "عطر العود الملكي"]
    };

    // Match product name to image from productData
    return suggestions[scent].slice(0, 3).map(name => {
        const product = productData.find(p => p.name === name);
        const image = product?.image || 'assets/default.jpg';

        return `
            <div class="bg-gray-900 rounded-xl shadow-xl overflow-hidden transform transition hover:scale-105 hover:shadow-2xl border border-transparent hover:border-yellow-500">
                <img src="${image}" alt="${name}" class="w-full h-48 object-cover">
                <div class="p-4 space-y-2 text-white">
                    <h3 class="text-lg font-semibold text-yellow-300">${name}</h3>
                    <p class="text-sm text-gray-300">مناسب لـ ${time === 'day' ? 'النهار' : time === 'night' ? 'الليل' : 'المناسبات الخاصة'}.</p>
                    <button onclick="addToCart('${name}')" class="bg-gold text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition">أضف إلى السلة</button>
                </div>
            </div>
        `;
    }).join('');
}

// Start at step 1
showStep(1);