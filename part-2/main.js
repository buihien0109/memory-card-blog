// Truy cập vào các phần tử DOM
const startGameEl = document.querySelector('#start-game');
const gameEl = document.querySelector('#game');
const endGameEl = document.querySelector('#end-game');

const levelOptionEl = document.querySelector('#level-option');
const memoryGameEl = document.querySelector('.memory-game');

const btnStartGame = document.querySelector('#btn-start-game');
const btnPlayAgain = document.querySelector('#btn-play-again');
const btnReload = document.querySelector('#btn-reload');

const timeEl = document.querySelector('#time');
const stepEl = document.querySelector('#step');

// Khai báo biến
let level;
let lockBoard = false; // Khóa không cho ấn
let firstCard = null; // Chứa phần tử DOM CARD khi mở lần 1
let secondCard = null; // Chứa phần tử DOM CARD khi mở lần 2
let score = 0;
let time = 0;
let step = 0;
let interval;

let sizes = {
    2: {
        row: 2,
        col: 2,
    },
    4: {
        row: 2,
        col: 4,
    },
    6: {
        row: 3,
        col: 4,
    },
};

let listCards = [
    {
        url:
            'https://i.pinimg.com/564x/9f/2f/72/9f2f72f1c63e6c62ac0ca3781e270975.jpg',
        name: 'luffy',
    },
    {
        url:
            'https://i.pinimg.com/236x/d3/3f/c0/d33fc0cd1bf76766555436c2307b94d7.jpg',
        name: 'zoro',
    },
    {
        url:
            'https://i.pinimg.com/236x/c2/b4/49/c2b4490285a27881586d3e8c49c4b565.jpg',
        name: 'sanji',
    },
    {
        url:
            'https://i.pinimg.com/236x/fb/a8/ce/fba8cec6aa3a5faa06b0d5f9a21401ed.jpg',
        name: 'ace',
    },
    {
        url:
            'https://i.pinimg.com/236x/74/60/51/7460514fb2e69b574011f4028fc159e3.jpg',
        name: 'rayleigh',
    },
    {
        url:
            'https://i.pinimg.com/236x/22/9c/d0/229cd0ef7f252de6aab514c0fbe5989b.jpg',
        name: 'sabo',
    },
];

let cards;

// Đảo vị trí các phần tử trong array
function shuffle(arr) {
    return arr.sort(function () {
        return 0.5 - Math.random();
    });
}

function renderCards(level) {
    // Đảo vị trí các phần tử trong mảng card
    listCards = shuffle(listCards);

    // Cắt lấy số phần tử = level
    let cardsSlice = listCards.slice(0, level);

    // Nhân đôi mảng card
    cards = [...cardsSlice, ...cardsSlice];

    // Đảo vị trí phần tử trong mảng
    cards = shuffle(cards);

    // Set kích thước cho game board
    let size = sizes[level];
    memoryGameEl.style.gridTemplateColumns = `repeat(${size.col}, 190px)`;
    memoryGameEl.style.gridTemplateRows = `repeat(${size.row}, 250px)`;

    // Hiển thị lên trên giao diện
    memoryGameEl.innerHTML = '';
    for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        memoryGameEl.innerHTML += `
            <div 
                class="memory-card" 
                data-name="${c.name}"
                onclick="flipCard(this)"
            >
                <img src="${c.url}" class="front-face" alt="${c.name}">
                <img src="https://i.pinimg.com/originals/b9/70/33/b97033a8708d2cbaf7d1990020a89a54.jpg"
                    class="back-face" alt="card-back">
            </div>
        `;
    }
}

// Xử lý sự kiện mở card
function flipCard(card) {
    if (lockBoard) {
        return;
    }
    //so we can not click twice on the same card
    if (card === firstCard) {
        return;
    }

    card.classList.toggle('flip');

    // Khi click CARD đầu tiên
    if (!firstCard) {
        firstCard = card;
        return;
    }

    // Khi click CARD thứ 2
    secondCard = card;
    checkForMatch();

    // Update step
    updateStep();
}

function checkForMatch() {
    // Kiểm tra xem NAME của 2 CARD có giống nhau không?
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    // isMatch = true => xóa sự kiện click ở 2 CARD đó
    // isMatch = false => úp CARD xuống
    isMatch ? disableCards() : unflipCards();
}

// it's a match!
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();

    score++;
    checkWin();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

function checkWin() {
    if (score == level) {
        clearInterval(interval);

        setTimeout(() => {
            gameEl.style.display = 'none';
            endGameEl.style.display = 'flex';

            updateEndGame();
        }, 1500);
    }
}

function updateTime() {
    time++;
    timeEl.innerText = convertTime(time);
}

function convertTime(time) {
    let minute = `0${Math.floor(time / 60)}`.slice(-2);
    let second = `0${time % 60}`.slice(-2);
    return `${minute}:${second}s`;
}

function updateStep() {
    step++;
    stepEl.innerText = `${step} bước`;
}

function updateEndGame() {
    document.querySelector('.time-box p').innerText = convertTime(time);
    document.querySelector('.step-box p').innerText = `${step} bước`
}

btnStartGame.addEventListener('click', function () {
    // Lấy giá trị level game
    level = Number(levelOptionEl.value);

    // Ẩn START => show GAME
    startGameEl.style.display = 'none';
    gameEl.style.display = 'flex';

    // Khởi tạo game (render card)
    renderCards(level);

    // Chạy thời gian
    interval = setInterval(updateTime, 1000);
});

btnPlayAgain.addEventListener('click', function () {
    // Reset điểm về 0
    score = 0;
    time = 0;
    step = 0;

    timeEl.innerText = convertTime(time);
    stepEl.innerText = `${step} bước`;

    // Chạy thời gian
    interval = setInterval(updateTime, 1000);

    // Dựa vào level đã có => khởi tạo game
    renderCards(level);

    // Ẩn END => show GAME
    endGameEl.style.display = 'none';
    gameEl.style.display = 'flex';
});

btnReload.addEventListener('click', function () {
    window.location.reload();
});