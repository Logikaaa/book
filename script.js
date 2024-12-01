let currentIndex = 0;
const cardsToShow = 3; // Кількість карток, які одночасно видно
const slider = document.querySelector('.slider');
const cards = document.querySelectorAll('.recipe-card');
const totalCards = cards.length;
const maxIndex = totalCards - cardsToShow;


function updateSliderPosition() {
    // Плавно переміщаємо слайдер
    slider.style.transform = `translateX(-${currentIndex * 340}px)`;
}
// Отримання ширини видимої частини слайдера
function getVisibleCardCount() {
    const containerWidth = document.querySelector('.slider-container').offsetWidth;
    const cardWidth = 350; // Ширина картки з відстанню
    return Math.floor(containerWidth / cardWidth);
}

function slideLeft() {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = maxIndex; // Перехід до останньої групи карток
    }
    updateSliderPosition();
}

// Функція для переміщення слайдера вправо
function slideRight() {
    if (currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = 0; // Перехід до першої групи карток
    }
    updateSliderPosition();
}
// Оновлення положення слайдера
function updateSlider(visibleCardCount) {
    const slider = document.querySelector('.slider');
    const cardWidth = 350;
    slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Оновлення слайдера при зміні розміру вікна
window.addEventListener('resize', () => {
    currentIndex = 0; // повертаємося на початок при зміні розміру
    updateSlider();
});

// Додаємо обробники подій для кнопок
document.querySelector('.left-btn').addEventListener('click', slideLeft);
document.querySelector('.right-btn').addEventListener('click', slideRight);



// Кароч колесо фортуни

const colors = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF"];
const recipes1 = ["Борщ червоний", "Стейк", "Хінкалі", "Паста", "Піца", "Суші"];
const wheelCanvas = document.getElementById("wheel");
const wheel = wheelCanvas.getContext("2d");
const wheelRadius = 200; // Радіус колеса
const wheelCenterX = wheelCanvas.width / 2; // Центр X
const wheelCenterY = wheelCanvas.height / 2; // Центр Y
let isSpinning = false;

function drawWheel() {
    const sections = recipes1.length;
    const arcSize = (2 * Math.PI) / sections;
    recipes1.forEach((recipe, i) => {
        const startAngle = i * arcSize;
        const endAngle = startAngle + arcSize;
        wheel.beginPath();
        wheel.arc(wheelCenterX, wheelCenterY, wheelRadius, startAngle, endAngle);
        wheel.lineTo(wheelCenterX, wheelCenterY);
        wheel.fillStyle = colors[i % colors.length];
        wheel.fill();
        wheel.save();
        
        // Центрування тексту у секторі
        wheel.translate(wheelCenterX + Math.cos(startAngle + arcSize / 2) * (wheelRadius - 80), 
                        wheelCenterY + Math.sin(startAngle + arcSize / 2) * (wheelRadius - 80));
        wheel.rotate(startAngle + arcSize / 2 + Math.PI / 2);
        wheel.fillStyle = "#333";
        wheel.font = "16px 'Popins', sans-serif";
        wheel.fillText(recipe, -wheel.measureText(recipe).width / 2, 0);
        wheel.restore();
    });
}



// Функція для обертання колеса
function spinWheel() {
    
    if (isSpinning) return;
    isSpinning = true;
    const spinDuration = 4000;
    const randomAngle = Math.random() * 360 + 2160;
    let startTime = null;

    function rotateWheel(time) {
        if (!startTime) startTime = time;
        const progress = time - startTime;
        const currentAngle = easeOutCubic(progress, 0, randomAngle, spinDuration);
        angle = currentAngle % 360;
        wheel.clearRect(0, 0, 400, 400);
        wheel.save();
        wheel.translate(200, 200);
        wheel.rotate((angle * Math.PI) / 180);
        wheel.translate(-200, -200);
        drawWheel();
        wheel.restore();

        if (progress < spinDuration) {
            requestAnimationFrame(rotateWheel);
        } else {
            isSpinning = false;
            showResult();
        }
    }

    requestAnimationFrame(rotateWheel);
}
const recipes = [
    { name: 'Борщ', link: 'borscht.html' },
    { name: 'Стейк', link: 'steak.html' },
    { name: 'Хінкалі', link: 'dumpling.html' },
    { name: 'Паста', link: 'pasta.html' },
    { name: 'Піца', link: 'pizza.html' },
    { name: 'Суші', link: 'mie.html' }
];

// Функція для показу результату
function showResult() {
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const selectedRecipe = recipes[randomIndex];
    const resultText = document.getElementById('result');

    // Відображаємо текст і посилання для переходу
    resultText.innerHTML = `
        Ви отримали рецепт: 
        <a href="${selectedRecipe.link}" class="result-link">${selectedRecipe.name}</a>
    `;
    resultText.classList.add('animate'); // Додаємо анімацію
}

// Ефект плавного завершення обертання
function easeOutCubic(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
}

// Намалювати колесо при завантаженні сторінки
drawWheel();
// Робота з формою "Пропонуйте свої рецепти"

const form = document.getElementById('recipe-form');
const suggestedRecipes = document.getElementById('suggested-recipes');

// Існуючі коментарі
const initialComments = [
    { name: 'Олена', comment: 'Дуже смачний рецепт пасти!' },
    { name: 'Ігор', comment: 'Додав трохи спецій — вийшло ідеально.' }
];

// Рендеримо існуючі коментарі
initialComments.forEach((item) => {
    const comment = createCommentElement(item.name, item.comment);
    suggestedRecipes.appendChild(comment);
});

// Додаємо новий коментар
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const userName = document.getElementById('user-name').value;
    const userMessage = document.getElementById('user-message').value;

    const newComment = createCommentElement(userName, userMessage);
    suggestedRecipes.appendChild(newComment);

    // Очищаємо форму
    form.reset();
});

function createCommentElement(name, message) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('recipe-comment');
    commentDiv.innerHTML = `<strong>${name}:</strong> ${message}`;
    return commentDiv;
}