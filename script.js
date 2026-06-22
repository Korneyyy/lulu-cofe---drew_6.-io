// ============================================
// LULU Cold Brew — Main JavaScript
// ============================================

// ==========================================
// Mobile Menu
// ==========================================
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');

if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Определяем, на hero мы или нет
        const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
        if (heroBottom > 0) {
            // На hero — матовое меню
            mobileMenu.classList.add('matte');
        } else {
            // За hero — синее меню
            mobileMenu.classList.remove('matte');
        }
    });

    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-menu-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==========================================
// FAQ Accordion
// ==========================================
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const faqItem = btn.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Закрываем все
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Открываем текущий если был закрыт
        if (!isActive) {
            faqItem.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// ==========================================
// Navbar Scroll Effect — три состояния
// ==========================================
const heroSection = document.getElementById('hero') || document.querySelector('.hero');

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar || !heroSection) return;

    const scrollY = window.scrollY;
    const heroBottom = heroSection.getBoundingClientRect().bottom;

    if (scrollY === 0) {
        // Самый верх страницы — прозрачный
        navbar.classList.remove('scrolled', 'matte');
    } else if (heroBottom > 0) {
        // Скроллим по hero-секции — матовый
        navbar.classList.add('matte');
        navbar.classList.remove('scrolled');
    } else {
        // Hero ушла за экран — синий
        navbar.classList.remove('matte');
        navbar.classList.add('scrolled');
    }
}

// Запускаем при скролле
window.addEventListener('scroll', updateNavbar, { passive: true });

// Запускаем при загрузке страницы (на случай, если страница открыта уже не в начале)
document.addEventListener('DOMContentLoaded', updateNavbar);
// И сразу, если DOM уже загружен
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    updateNavbar();
}

// ==========================================
// Smooth Scroll
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Intersection Observer for Animations
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// ==========================================
// Phone Mask
// ==========================================
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }
            
            let formattedValue = '+7';
            
            if (value.length > 0) {
                formattedValue += ' (' + value.substring(0, 3);
            }
            if (value.length >= 3) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length >= 6) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length >= 8) {
                formattedValue += '-' + value.substring(8, 10);
            }
            
            e.target.value = formattedValue;
        }
    });

    phoneInput.addEventListener('keydown', function(e) {
        // Разрешаем: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        
        // Запрещаем всё кроме цифр
        if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

// ==========================================
// Toast Notifications
// ==========================================
function showToast(message, type = 'success') {
    // Удаляем существующие toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    // Анимация появления
    setTimeout(() => toast.classList.add('toast-show'), 10);

    // Автоудаление через 5 секунд
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);

    // Закрытие по клику
    toast.addEventListener('click', () => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    });
}

// ==========================================
// Contact Form
// ==========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const submitBtn = contactForm.querySelector('.form-submit');
    const nameInput = contactForm.querySelector('input[name="name"]');
    const phoneInput = contactForm.querySelector('input[name="phone"]');
    const companyInput = contactForm.querySelector('input[name="company"]');
    const cityInput = contactForm.querySelector('input[name="city"]');
    const commentInput = contactForm.querySelector('textarea[name="comment"]');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Защита от множественной отправки
        if (submitBtn.disabled) return;

        // Собираем данные
        const formData = {
            name: nameInput ? nameInput.value.trim() : '',
            company: companyInput ? companyInput.value.trim() : '',
            city: cityInput ? cityInput.value.trim() : '',
            phone: phoneInput ? phoneInput.value.trim() : '',
            comment: commentInput ? commentInput.value.trim() : ''
        };

        // Валидация
        if (!formData.name) {
            showToast('Пожалуйста, введите имя', 'error');
            nameInput.focus();
            return;
        }

        if (formData.name.length < 2) {
            showToast('Имя должно содержать не менее 2 символов', 'error');
            nameInput.focus();
            return;
        }

        if (!formData.phone) {
            showToast('Пожалуйста, введите телефон', 'error');
            phoneInput.focus();
            return;
        }

        // Валидация телефона (минимум 10 цифр)
        const phoneClean = formData.phone.replace(/\D/g, '');
        if (phoneClean.length < 10) {
            showToast('Пожалуйста, введите корректный номер телефона', 'error');
            phoneInput.focus();
            return;
        }

        // Блокируем кнопку
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';

        try {
            // Для демонстрации - имитация отправки
            // В реальном проекте раскомментируйте fetch:
            
            /*
            const response = await fetch('/api/lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showToast('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
            } else {
                showToast(result.error || 'Произошла ошибка. Попробуйте позже.', 'error');
            }
            */

            // Имитация успешной отправки (удалите в продакшене)
            await new Promise(resolve => setTimeout(resolve, 1500));
            showToast('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.', 'success');
            contactForm.reset();

        } catch (err) {
            console.error('Form submission error:', err);
            showToast('Ошибка соединения. Проверьте подключение к интернету.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    // Валидация в реальном времени
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 2) {
                showToast('Имя должно содержать не менее 2 символов', 'error');
            }
        });
    }
}

// ==========================================
// Reviews Slider
// ==========================================
const reviewsTrack = document.querySelector('.reviews-track');
const reviewPrev = document.getElementById('reviewPrev');
const reviewNext = document.getElementById('reviewNext');
const reviewDots = document.getElementById('reviewDots');

if (reviewsTrack && reviewPrev && reviewNext) {
    let currentSlide = 0;
    const reviewCards = document.querySelectorAll('.review-card');
    const totalSlides = reviewCards.length;

    // Инициализация точек для отзывов
    if (reviewDots) {
        reviewDots.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = 'review-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateSlider();
            });
            reviewDots.appendChild(dot);
        }
    }

    function updateSlider() {
        const cardWidth = reviewCards[0].offsetWidth + 24; // width + gap
        reviewsTrack.scrollTo({
            left: cardWidth * currentSlide,
            behavior: 'smooth'
        });

        // Обновляем точки
        document.querySelectorAll('.review-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    if (reviewPrev) {
        reviewPrev.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }

    if (reviewNext) {
        reviewNext.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
    }

    // Автопрокрутка
    let autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 6000);

    // Останавливаем автопрокрутку при наведении
    reviewsTrack.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    reviewsTrack.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 6000);
    });
}

// ==========================================
// Side Dots Navigation (Hero)
// ==========================================
/*
const sideDots = document.querySelectorAll('.side-dot');
sideDots.forEach(dot => {
    dot.addEventListener('click', () => {
        // Убираем active у всех точек
        sideDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        
        // Прокручиваем к секции из data-target
        const targetId = dot.getAttribute('data-target');
        if (targetId) {
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});
*/

// ==========================================
// Branding Bottles Animation
// ==========================================
const brandingBottles = document.querySelectorAll('.branding-bottle');
brandingBottles.forEach(bottle => {
    bottle.addEventListener('mouseenter', function() {
        brandingBottles.forEach(b => {
            if (b !== this) {
                b.style.opacity = '0.5';
                b.style.transform = 'scale(0.95)';
            }
        });
    });

    bottle.addEventListener('mouseleave', function() {
        brandingBottles.forEach(b => {
            b.style.opacity = '1';
            b.style.transform = '';
        });
    });
});

// ==========================================
// Initialize on DOM Load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    /* Точки уже имеют active класс в HTML, дополнительно не нужно
    // Восстанавливаем активную точку при загрузке страницы
    if (sideDots.length > 0) {
        const activeDot = document.querySelector('.side-dot[data-target="about"]');
        if (activeDot) {
            sideDots.forEach(d => d.classList.remove('active'));
            activeDot.classList.add('active');
        }
    } */

    // Плавное появление элементов
    const fadeInElements = document.querySelectorAll('.flavor-card, .benefit-card, .doc-card');
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(el);
    });
});

