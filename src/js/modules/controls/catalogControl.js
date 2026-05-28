import {getCurrentHeaderHeight} from "../helpers.js";

export function catalogControl() {
    const catalogBtns = document.querySelectorAll('.catalog-btn');
    const menu = document.querySelector('.header__menu');
    const promoBlock = document.querySelector('.promo-block');
    const body = document.body;

    if (!catalogBtns.length || !menu) return;

    // Функция позиционирования меню
    function positionMenu() {
        const headerHeight = getCurrentHeaderHeight();

        if (window.innerWidth < 1200) {
            // На мобильных и планшетах меню открывается на всю высоту под хедером
            menu.style.top = headerHeight + 'px';
            menu.style.height = `calc(100vh - ${headerHeight}px)`;
        } else {
            // На десктопе просто позиционируем под хедером
            menu.style.top = '0px';
            // Сбрасываем высоту, если была задана
            menu.style.height = '';
        }
    }

    // Функция открытия меню
    function openMenu() {
        positionMenu();
        menu.classList.add('active');
        if (promoBlock) promoBlock.classList.add('active');
        menu.scrollTop = 0;
        if (window.innerWidth < 1200) {
            body.style.overflow = 'hidden';
        }
        catalogBtns.forEach(btn => {
            btn.classList.add('active');
        });
        // Добавляем обработчик клика вне меню
        setTimeout(() => {
            document.addEventListener('click', closeMenuOnClickOutside);
        }, 100);
    }

    // Функция закрытия меню
    function closeMenu() {
        menu.classList.remove('active');

        if (promoBlock) promoBlock.classList.remove('active');

        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        body.style.height = '';

        // Сбрасываем inline стили позиционирования
        menu.style.top = '';
        menu.style.height = '';

        catalogBtns.forEach(btn => {
            btn.classList.remove('active');
        });

        document.removeEventListener('click', closeMenuOnClickOutside);
    }

    // Функция закрытия при клике вне меню
    function closeMenuOnClickOutside(e) {
        if (!menu.contains(e.target) && !e.target.closest('.catalog-btn')) {
            closeMenu();
        }
    }

    // Обработчики кнопок каталога
    catalogBtns.forEach((btn) => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();

            if (menu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    });

    // Закрываем меню при клике на любую ссылку внутри меню
    const menuLinks = menu.querySelectorAll('.categories-menu-list__link, .menu-promo__btn');
    menuLinks.forEach((link) => {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Обновляем позицию меню при ресайзе, если оно открыто
    window.addEventListener('resize', function () {
        if (menu.classList.contains('active')) {
            positionMenu();

            // Обновляем состояние body на мобильных
            if (window.innerWidth < 1200) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        }
    });


}