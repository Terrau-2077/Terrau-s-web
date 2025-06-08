// 自定义光标
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// 暗黑模式切换
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '🌙';
document.body.appendChild(themeToggle);

let isDarkMode = true;
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-mode');
    themeToggle.innerHTML = isDarkMode ? '🌙' : '☀️';
});

// 打字机效果
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if(this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 300;

        if(this.isDeleting) {
            typeSpeed /= 2;
        }

        if(!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// 初始化打字机效果
document.addEventListener('DOMContentLoaded', init);

function init() {
    const txtElement = document.querySelector('.title');
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 返回顶部按钮
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 视差滚动效果
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelector('.hero').style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// 加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ins风格轮播
(function() {
    const slides = document.querySelectorAll('.ins-slide');
    const prevBtn = document.querySelector('.ins-prev');
    const nextBtn = document.querySelector('.ins-next');
    const dots = document.querySelectorAll('.ins-dots .dot');
    let current = 0;
    let timer = null;

    function showSlide(idx) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
            if (dots[i]) dots[i].classList.toggle('active', i === idx);
        });
        current = idx;
    }
    function next() {
        showSlide((current + 1) % slides.length);
    }
    function prev() {
        showSlide((current - 1 + slides.length) % slides.length);
    }
    function autoPlay() {
        timer = setInterval(next, 4000);
    }
    function stopAutoPlay() {
        clearInterval(timer);
    }
    prevBtn.addEventListener('click', () => { prev(); stopAutoPlay(); autoPlay(); });
    nextBtn.addEventListener('click', () => { next(); stopAutoPlay(); autoPlay(); });
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { showSlide(i); stopAutoPlay(); autoPlay(); });
    });
    showSlide(0);
    autoPlay();
})();

// 点赞按钮逻辑
const likeBtn = document.getElementById('likeBtn');
const likeIcon = document.getElementById('likeIcon');
const likeCount = document.getElementById('likeCount');
let liked = false;
let count = parseInt(localStorage.getItem('likeCount') || '0', 10);
likeCount.textContent = count;
likeBtn.addEventListener('click', () => {
    if (!liked) {
        liked = true;
        count++;
        likeBtn.classList.add('liked');
        likeCount.textContent = count;
        localStorage.setItem('likeCount', count);
        likeIcon.classList.remove('like-animate');
        void likeIcon.offsetWidth;
        likeIcon.classList.add('like-animate');
        setTimeout(() => likeBtn.classList.remove('liked'), 600);
    }
}); 