// ===== 主题管理系统 =====
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggle() {
        this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    }

    bindEvents() {
        const toggle = document.getElementById('theme-toggle');
        toggle.addEventListener('click', () => this.toggle());
    }
}

// ===== 打字机效果 =====
class TypewriterEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.currentIndex = 0;
        this.currentChar = 0;
        this.options = {
            typeSpeed: options.typeSpeed || 50,
            deleteSpeed: options.deleteSpeed || 30,
            delayBetween: options.delayBetween || 2000,
            ...options
        };
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const current = this.texts[this.currentIndex];
        const currentText = this.isDeleting 
            ? current.substring(0, this.currentChar - 1)
            : current.substring(0, this.currentChar + 1);

        this.element.textContent = currentText;
        this.currentChar = this.isDeleting ? this.currentChar - 1 : this.currentChar + 1;

        let typeSpeed = this.options.typeSpeed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.currentChar === current.length) {
            typeSpeed = this.options.delayBetween;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== 粒子背景系统 =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    update() {
        this.particles.forEach(particle => {
            // 鼠标交互
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.01;
                particle.vy -= (dy / distance) * force * 0.01;
            }

            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // 摩擦力
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // 保持粒子在画布内
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // 动态颜色
            const theme = document.documentElement.getAttribute('data-theme');
            const colors = {
                dark: `rgba(0, 119, 255, ${particle.opacity})`,
                light: `rgba(147, 51, 234, ${particle.opacity * 0.6})`
            };
            
            this.ctx.fillStyle = colors[theme] || colors.dark;
            this.ctx.fill();
        });

        // 绘制连接线
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    
                    const opacity = (100 - distance) / 100 * 0.1;
                    const theme = document.documentElement.getAttribute('data-theme');
                    const colors = {
                        dark: `rgba(0, 119, 255, ${opacity})`,
                        light: `rgba(147, 51, 234, ${opacity * 0.6})`
                    };
                    
                    this.ctx.strokeStyle = colors[theme] || colors.dark;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
    }

    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ===== 技能云系统 =====
class SkillsCloud {
    constructor() {
        this.container = document.getElementById('skills-cloud');
        this.skills = [
            { name: 'Python', level: 'Expert', x: 20, y: 20 },
            { name: 'TensorFlow', level: 'Advanced', x: 60, y: 30 },
            { name: 'PyTorch', level: 'Advanced', x: 30, y: 60 },
            { name: 'Machine Learning', level: 'Expert', x: 70, y: 50 },
            { name: 'Deep Learning', level: 'Advanced', x: 15, y: 70 },
            { name: 'Computer Vision', level: 'Intermediate', x: 80, y: 20 },
            { name: 'NLP', level: 'Advanced', x: 45, y: 15 },
            { name: 'Data Science', level: 'Advanced', x: 10, y: 40 },
            { name: 'Statistics', level: 'Intermediate', x: 85, y: 75 },
            { name: 'OpenCV', level: 'Intermediate', x: 55, y: 80 },
            { name: 'Pandas', level: 'Advanced', x: 25, y: 85 },
            { name: 'NumPy', level: 'Advanced', x: 90, y: 45 },
            { name: 'Jupyter', level: 'Expert', x: 5, y: 55 },
            { name: 'Git', level: 'Advanced', x: 75, y: 85 }
        ];
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = '';
        this.skills.forEach((skill, index) => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.textContent = skill.name;
            tag.title = `${skill.name} - ${skill.level}`;
            
            // 位置计算
            const x = (skill.x / 100) * (this.container.offsetWidth - 100);
            const y = (skill.y / 100) * (this.container.offsetHeight - 40);
            
            tag.style.left = x + 'px';
            tag.style.top = y + 'px';
            
            this.container.appendChild(tag);
        });
    }

    bindEvents() {
        let isMouseOver = false;
        
        this.container.addEventListener('mouseenter', () => {
            isMouseOver = true;
        });
        
        this.container.addEventListener('mouseleave', () => {
            isMouseOver = false;
        });

        // 浮动动画
        this.container.addEventListener('mousemove', (e) => {
            if (isMouseOver) {
                const rect = this.container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const tags = this.container.querySelectorAll('.skill-tag');
                tags.forEach((tag, index) => {
                    const skill = this.skills[index];
                    const distance = Math.sqrt(
                        Math.pow(skill.x / 100 - x, 2) + 
                        Math.pow(skill.y / 100 - y, 2)
                    );
                    
                    const intensity = Math.max(0, 1 - distance * 2);
                    const rotateX = (y - 0.5) * 10 * intensity;
                    const rotateY = (x - 0.5) * 10 * intensity;
                    
                    tag.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${1 + intensity * 0.1})`;
                });
            } else {
                const tags = this.container.querySelectorAll('.skill-tag');
                tags.forEach(tag => {
                    tag.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                });
            }
        });
    }
}

// ===== 3D卡片系统 =====
class TiltSystem {
    constructor() {
        this.cards = document.querySelectorAll('[data-tilt]');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.3s ease';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }
}

// ===== 滚动动画系统 =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.createObserver();
        this.animateOnScroll();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);
    }

    animateOnScroll() {
        // 为各个section添加动画类
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.add('scroll-animate');
            this.observer.observe(section);
        });

        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            .scroll-animate {
                opacity: 0;
                transform: translateY(50px);
                transition: all 0.6s ease;
            }
            
            .scroll-animate.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== 表单处理系统 =====
class FormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // 验证必填字段
        if (!data.name || !data.email || !data.message) {
            this.showError('请填写所有必填字段');
            return;
        }
        
        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showError('请输入有效的邮箱地址');
            return;
        }
        
        // 创建邮件内容
        const subject = `网站联系表单 - 来自 ${data.name}`;
        const body = `
姓名: ${data.name}
邮箱: ${data.email}

消息内容:
${data.message}

---
此邮件来自 Terrau 的个人网站联系表单
发送时间: ${new Date().toLocaleString('zh-CN')}
        `.trim();
        
        // 编码邮件内容
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        
        // 创建mailto链接
        const mailtoLink = `mailto:Terrau2077@168.com?subject=${encodedSubject}&body=${encodedBody}`;
        
        // 打开默认邮件客户端
        try {
            window.location.href = mailtoLink;
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            console.error('打开邮件客户端失败:', error);
            this.showError('发送失败，请尝试直接发送邮件到 Terrau2077@168.com');
        }
    }

    showSuccess() {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = '消息已发送！';
        button.style.background = 'var(--accent-2)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
    }

    showError(message) {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        const originalBackground = button.style.background;
        
        button.textContent = message;
        button.style.background = '#dc2626'; // 红色错误提示
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBackground;
        }, 3000);
    }
}

// ===== 平滑滚动系统 =====
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== 性能优化系统 =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.debounceScrollEvents();
    }

    lazyLoadImages() {
        // 图片懒加载（如果将来需要添加图片）
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    debounceScrollEvents() {
        // 防抖滚动事件
        let ticking = false;
        
        const updateScrollPosition = () => {
            // 滚动位置相关的更新逻辑
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate);
    }
}

// ===== 主应用初始化 =====
class App {
    constructor() {
        this.particleSystem = null;
        this.init();
    }

    async init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        try {
            // 初始化各个系统
            this.themeManager = new ThemeManager();
            this.performanceOptimizer = new PerformanceOptimizer();
            this.smoothScroll = new SmoothScroll();
            this.formHandler = new FormHandler();
            this.scrollAnimations = new ScrollAnimations();
            this.tiltSystem = new TiltSystem();
            this.skillsCloud = new SkillsCloud();
            
            // 延迟初始化粒子系统和打字机效果
            setTimeout(() => {
                this.particleSystem = new ParticleSystem();
            }, 500);
            
            // 初始化打字机效果
            setTimeout(() => {
                const heroTitle = document.getElementById('hero-title');
                if (heroTitle) {
                    new TypewriterEffect(heroTitle, [
                        'Hello, I\'m Terrau',
                        'AI Explorer & Innovator',
                        'Welcome to my world'
                    ], {
                        typeSpeed: 100,
                        deleteSpeed: 50,
                        delayBetween: 3000
                    });
                }
            }, 1000);

            console.log('🎉 App initialized successfully!');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }

    destroy() {
        if (this.particleSystem) {
            this.particleSystem.destroy();
        }
    }
}

// ===== 事件监听 =====
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.destroy();
    }
});

// ===== 初始化应用 =====
window.app = new App();

// ===== 错误处理 =====
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// ===== 导出类（供其他脚本使用） =====
window.TerrauApp = {
    ThemeManager,
    ParticleSystem,
    SkillsCloud,
    TiltSystem,
    ScrollAnimations,
    FormHandler
};