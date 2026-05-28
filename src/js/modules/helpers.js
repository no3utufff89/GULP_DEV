//Добавление класса для картинок после загрузки
export function loadingControl() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(function (img) {
            // Проверяем, не находится ли изображение в промо-блоке меню
            if (!img.closest('.menu-promo')) {
                imageObserver.observe(img);
            } else {
                // Для промо-блока сразу показываем
                img.classList.add('loaded');
            }
        });
    } else {
        // Fallback для старых браузеров
        lazyImages.forEach(function (img) {
            if (!img.closest('.menu-promo')) {
                img.classList.add('loaded');
            } else {
                img.classList.add('loaded');
            }
        });
    }
}

//Создание overlay
export function createOverlay() {
    const body = document.body;

    // Проверяем, существует ли уже overlay
    let overlay = document.querySelector('.overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';

        // Скрываем от скринридеров
        overlay.setAttribute('aria-hidden', 'true');

        body.appendChild(overlay);
    }

    return overlay;
}

// Debounce функция
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

//Toggle body overflow
export function toggleOverflow(force) {
    const body = document.body;

    // Получаем ширину скролла для компенсации
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (force === true) {
        body.classList.add('overflow-hidden');
        body.style.paddingRight = `${scrollbarWidth}px`;
    } else if (force === false) {
        body.classList.remove('overflow-hidden');
        body.style.paddingRight = '';
    } else {
        // Если force не указан - переключаем
        if (body.classList.contains('overflow-hidden')) {
            body.classList.remove('overflow-hidden');
            body.style.paddingRight = '';
        } else {
            body.classList.add('overflow-hidden');
            body.style.paddingRight = `${scrollbarWidth}px`;
        }
    }
}

// Функция получения текущей высоты хедера
export function getCurrentHeaderHeight() {
    const stickyHeader = document.getElementById('stickyHeader');
    const mainHeader = document.querySelector('.header');
    // Если sticky хедер видим, используем его высоту
    if (stickyHeader && stickyHeader.classList.contains('header-sticky--visible')) {
        return stickyHeader.offsetHeight;
    }
    // Иначе используем высоту основного хедера
    return mainHeader ? mainHeader.offsetHeight : 0;
}

export function isStickyHeader() {
    const stickyHeader = document.getElementById('stickyHeader');
    return stickyHeader && stickyHeader.classList.contains('header-sticky--visible');
}