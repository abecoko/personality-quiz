// Configuration
const LINE_URL = 'https://z6q4xhbt.autosns.app/line';
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY'; // Replace with actual Pexels API key

// Quiz Questions
const QUESTIONS = [
    {
        id: 1,
        text: "最近、家族やパートナーと気持ちがすれ違ってモヤッとする？",
        type: "likert",
        options: [
            { text: "😄 全然ない", value: 0 },
            { text: "😊 あまりない", value: 1 },
            { text: "😐 普通", value: 2 },
            { text: "😟 よくある", value: 3 },
            { text: "😫 頻繁にある", value: 4 }
        ]
    },
    {
        id: 2,
        text: "周りの意見に流されて「わたしって何がしたい？」と迷う？",
        type: "multiple",
        options: [
            { text: "全く迷わない", value: 0 },
            { text: "たまに迷う", value: 1 },
            { text: "よく迷う", value: 3 },
            { text: "いつも迷っている", value: 4 }
        ]
    },
    {
        id: 3,
        text: "仕事や家事を頑張っても「評価されてないかも」と感じる？",
        type: "yesno",
        options: [
            { text: "NO", value: 0 },
            { text: "YES", value: 4 }
        ]
    },
    {
        id: 4,
        text: "自分の強みや役割がぼんやりして選択に迷いがち？",
        type: "likert",
        options: [
            { text: "😄 全然迷わない", value: 0 },
            { text: "😊 あまり迷わない", value: 1 },
            { text: "😐 普通", value: 2 },
            { text: "😟 よく迷う", value: 3 },
            { text: "😫 いつも迷う", value: 4 }
        ]
    },
    {
        id: 5,
        text: "つい完璧を求めて疲れ切ってしまう？",
        type: "multiple",
        options: [
            { text: "全然ない", value: 0 },
            { text: "たまにある", value: 1 },
            { text: "よくある", value: 3 },
            { text: "いつもそう", value: 4 }
        ]
    },
    {
        id: 6,
        text: "「私の使命って何だろう…」とふと思う？",
        type: "multiple",
        options: [
            { text: "思わない", value: 0 },
            { text: "たまに思う", value: 2 },
            { text: "よく思う", value: 4 }
        ]
    },
    {
        id: 7,
        text: "感情が爆発してあとで自己嫌悪…最近そんなシーンが？",
        type: "emoji",
        options: [
            { text: "😌", value: 0 },
            { text: "😅", value: 1 },
            { text: "😰", value: 2 },
            { text: "😤", value: 3 },
            { text: "😭", value: 4 },
            { text: "💥", value: 5 }
        ]
    }
];

// Global State
let currentQuestion = 0;
let answers = [];
let totalScore = 0;

// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const progressBar = document.getElementById('progress-bar');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const rankBadge = document.getElementById('rank-badge');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const lineCta = document.getElementById('line-cta');
const restartBtn = document.getElementById('restart-btn');
const shareTwitter = document.getElementById('share-twitter');
const shareInstagram = document.getElementById('share-instagram');
const heroImg = document.getElementById('hero-img');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadHeroImage();
    loadProgress();
    setupEventListeners();
    startReviewCarousel();
});

// Load hero image from Pexels
async function loadHeroImage() {
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=personality&per_page=1&page=${Math.floor(Math.random() * 10) + 1}`, {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
                heroImg.src = data.photos[0].src.medium;
            } else {
                setFallbackImage();
            }
        } else {
            setFallbackImage();
        }
    } catch (error) {
        setFallbackImage();
    }
}

function setFallbackImage() {
    heroImg.style.background = 'linear-gradient(45deg, #FF8B72, #FFB74D)';
    heroImg.style.display = 'flex';
    heroImg.style.alignItems = 'center';
    heroImg.style.justifyContent = 'center';
    heroImg.innerHTML = '<div style="color: white; font-size: 3rem;">🎯</div>';
}

// Event Listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startQuiz);
    prevBtn.addEventListener('click', previousQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    shareTwitter.addEventListener('click', shareOnTwitter);
    shareInstagram.addEventListener('click', shareOnInstagram);
    lineCta.href = LINE_URL;
    
    // Carousel dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showReview(index));
    });
}

// Progress Management
function saveProgress() {
    const progress = {
        currentQuestion,
        answers,
        totalScore
    };
    localStorage.setItem('quiz-progress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('quiz-progress');
    if (saved) {
        const progress = JSON.parse(saved);
        currentQuestion = progress.currentQuestion || 0;
        answers = progress.answers || [];
        totalScore = progress.totalScore || 0;
        
        if (currentQuestion > 0) {
            showScreen('quiz');
            displayQuestion();
        }
    }
}

function clearProgress() {
    localStorage.removeItem('quiz-progress');
}

// Screen Management
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(`${screenName}-screen`);
    targetScreen.classList.add('active');
    targetScreen.classList.add('fade-in');
}

// Quiz Logic
function startQuiz() {
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    currentQuestion = 0;
    answers = [];
    totalScore = 0;
    showScreen('quiz');
    displayQuestion();
}

function displayQuestion() {
    const question = QUESTIONS[currentQuestion];
    
    // Update progress
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    progressBar.style.width = `${progress}%`;
    questionCounter.textContent = `${currentQuestion + 1} / ${QUESTIONS.length}`;
    
    // Update question text
    questionText.textContent = question.text;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create options based on question type
    createOptions(question);
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Save progress
    saveProgress();
}

function createOptions(question) {
    const container = optionsContainer;
    
    switch (question.type) {
        case 'likert':
            container.className = 'options-container likert-container';
            question.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'option likert-option';
                btn.textContent = option.text;
                btn.dataset.value = option.value;
                btn.addEventListener('click', () => selectOption(index, option.value));
                container.appendChild(btn);
            });
            break;
            
        case 'multiple':
            container.className = 'options-container';
            question.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'option';
                btn.textContent = option.text;
                btn.dataset.value = option.value;
                btn.addEventListener('click', () => selectOption(index, option.value));
                container.appendChild(btn);
            });
            break;
            
        case 'yesno':
            container.className = 'options-container';
            question.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'option';
                btn.textContent = option.text;
                btn.dataset.value = option.value;
                btn.addEventListener('click', () => selectOption(index, option.value));
                container.appendChild(btn);
            });
            break;
            
        case 'emoji':
            container.className = 'options-container emoji-container';
            question.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'emoji-option';
                btn.textContent = option.text;
                btn.dataset.value = option.value;
                btn.addEventListener('click', () => selectOption(index, option.value));
                container.appendChild(btn);
            });
            break;
    }
    
    // Restore previous selection if exists
    if (answers[currentQuestion] !== undefined) {
        const selectedIndex = answers[currentQuestion].selectedIndex;
        const options = container.querySelectorAll('.option, .emoji-option, .likert-option');
        if (options[selectedIndex]) {
            options[selectedIndex].classList.add('selected');
        }
    }
}

function selectOption(selectedIndex, value) {
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    // Clear previous selections
    const options = optionsContainer.querySelectorAll('.option, .emoji-option, .likert-option');
    options.forEach(option => option.classList.remove('selected'));
    
    // Mark selected option
    options[selectedIndex].classList.add('selected');
    
    // Store answer
    answers[currentQuestion] = {
        selectedIndex,
        value
    };
    
    // Enable next button
    nextBtn.classList.remove('disabled');
    
    // Auto-advance for emoji type after a short delay
    if (QUESTIONS[currentQuestion].type === 'emoji') {
        setTimeout(() => {
            if (currentQuestion < QUESTIONS.length - 1) {
                nextQuestion();
            } else {
                finishQuiz();
            }
        }, 800);
    }
    
    saveProgress();
}

function updateNavigationButtons() {
    // Previous button
    if (currentQuestion === 0) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }
    
    // Next button
    if (answers[currentQuestion] !== undefined) {
        nextBtn.classList.remove('disabled');
    } else {
        nextBtn.classList.add('disabled');
    }
    
    // Update next button text
    if (currentQuestion === QUESTIONS.length - 1) {
        nextBtn.textContent = '結果を見る →';
    } else {
        nextBtn.textContent = '次へ →';
    }
}

function nextQuestion() {
    if (answers[currentQuestion] === undefined) return;
    
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    if (currentQuestion < QUESTIONS.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        finishQuiz();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
        currentQuestion--;
        displayQuestion();
    }
}

function finishQuiz() {
    // Calculate total score
    totalScore = answers.reduce((sum, answer) => sum + (answer?.value || 0), 0);
    
    // Show result
    showScreen('result');
    displayResult();
    
    // Clear progress
    clearProgress();
}

function displayResult() {
    let rank, title, message, badgeClass;
    
    if (totalScore >= 22) {
        rank = 'A';
        title = '🔥 今こそ自分を深掘りするタイミング！';
        message = 'あなたは今、自分自身についてもっと深く知りたいと感じている時期です。プロファイリングによって、新しい自分の一面を発見し、人生をより豊かにするヒントが見つかるでしょう。';
        badgeClass = 'rank-a';
    } else if (totalScore >= 12) {
        rank = 'B';
        title = '✨ 一歩進むヒントを手に入れよう';
        message = 'あなたには既に自分なりの価値観がありますが、さらに一歩踏み出すためのヒントが必要な時期です。プロファイリングで新しい可能性を発見してみませんか？';
        badgeClass = 'rank-b';
    } else {
        rank = 'C';
        title = '🌱 まずはライトに相談してみて';
        message = 'あなたは比較的安定した状態にあります。気軽な気持ちで、自分の魅力を再発見する機会として、プロファイリングを楽しんでみてください。';
        badgeClass = 'rank-c';
    }
    
    rankBadge.textContent = rank;
    rankBadge.className = `rank-badge ${badgeClass}`;
    resultTitle.textContent = title;
    resultMessage.textContent = message;
}

function restartQuiz() {
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    currentQuestion = 0;
    answers = [];
    totalScore = 0;
    clearProgress();
    showScreen('splash');
}

// Social Sharing
function shareOnTwitter() {
    const text = `3分でわかる！"わたし診断"で自分の個性を発見しました！あなたも試してみませんか？`;
    const url = encodeURIComponent(window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
    window.open(twitterUrl, '_blank');
}

function shareOnInstagram() {
    // Instagram Stories sharing (requires mobile app)
    const text = `3分でわかる！"わたし診断"で自分の個性を発見しました！`;
    const instagramUrl = `instagram-stories://share?text=${encodeURIComponent(text)}`;
    
    // Fallback to regular Instagram if Stories not available
    try {
        window.open(instagramUrl, '_blank');
    } catch (error) {
        window.open('https://www.instagram.com/', '_blank');
    }
}

// Review Carousel
let currentReview = 0;
const reviewCards = document.querySelectorAll('.review-card');
const reviewDots = document.querySelectorAll('.dot');

function startReviewCarousel() {
    setInterval(() => {
        currentReview = (currentReview + 1) % reviewCards.length;
        showReview(currentReview);
    }, 4000);
}

function showReview(index) {
    // Hide all reviews
    reviewCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Show selected review
    if (reviewCards[index]) {
        reviewCards[index].classList.add('active');
    }
    
    // Update dots
    reviewDots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    currentReview = index;
}

// Touch/Swipe Support for Mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (quizScreen.classList.contains('active')) {
            if (swipeDistance > 0 && currentQuestion > 0) {
                // Swipe right - go to previous question
                previousQuestion();
            } else if (swipeDistance < 0 && currentQuestion < QUESTIONS.length - 1 && answers[currentQuestion] !== undefined) {
                // Swipe left - go to next question
                nextQuestion();
            }
        }
    }
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (quizScreen.classList.contains('active')) {
        if (e.key === 'ArrowLeft' && currentQuestion > 0) {
            previousQuestion();
        } else if (e.key === 'ArrowRight' && answers[currentQuestion] !== undefined) {
            if (currentQuestion < QUESTIONS.length - 1) {
                nextQuestion();
            } else {
                finishQuiz();
            }
        }
    }
    
    if (e.key === 'Escape') {
        if (quizScreen.classList.contains('active') || resultScreen.classList.contains('active')) {
            restartQuiz();
        }
    }
});

// Prevent zoom on double tap (iOS Safari)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Service Worker for PWA support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}