import {debounce, getCurrentHeaderHeight} from "../helpers.js";

export function stickyHeaderControl() {
    const actionsSection = document.getElementById('actions-section');
    const stickyHeader = document.getElementById('stickyHeader');
    const menuWrapper = document.querySelector('.menu-wrapper');
    const cartWrapper = document.querySelector('.cart-wrapper');
    const catalogMenu = document.querySelector('.header__menu');
    const mainHeader = document.querySelector('.header');

    if (!stickyHeader) return;

    // Функция обновления позиции menu-wrapper и cart-wrapper
    function updateMenuPosition() {
        if (stickyHeader.classList.contains('header-sticky--visible')) {
            const currentStickyHeight = getCurrentHeaderHeight();
            if (menuWrapper) menuWrapper.style.top = `${currentStickyHeight}px`;
            if (cartWrapper) cartWrapper.style.top = `${currentStickyHeight}px`;
        }
    }

    // Функция обновления позиции каталог-меню
    function updateCatalogMenuPosition() {
        if (!catalogMenu) return;

        const headerHeight = getCurrentHeaderHeight();

        catalogMenu.style.top = '0px';

        if (window.innerWidth < 1200) {
            catalogMenu.style.top = `${headerHeight}px`;
            catalogMenu.style.height = `calc(100% - ${headerHeight}px)`;
        }
    }

    // Функция проверки позиции скролла
    function checkStickyHeader() {
        const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        let shouldShow = false;

        if (scrollTop > (headerHeight + 40)) {
            shouldShow = true;
        }

        if (shouldShow) {
            // Показываем sticky header
            if (!stickyHeader.classList.contains('header-sticky--visible')) {
                stickyHeader.classList.add('header-sticky--visible');
                stickyHeader.style.width = window.innerWidth + 'px';
            }

            if (menuWrapper && !menuWrapper.classList.contains('menu-wrapper--visible')) {
                menuWrapper.classList.add('menu-wrapper--visible');
            }

            if (cartWrapper && !cartWrapper.classList.contains('cart-wrapper-visible')) {
                cartWrapper.classList.add('cart-wrapper-visible');
            }

            updateMenuPosition();

            if (catalogMenu && catalogMenu.classList.contains('active')) {
                updateCatalogMenuPosition();
            }
            document.dispatchEvent(new CustomEvent('stickyHeaderChanged', {
                detail: {isVisible: true, headerHeight: stickyHeader.offsetHeight}
            }));

        } else {
            // Скрываем sticky header
            if (stickyHeader.classList.contains('header-sticky--visible')) {
                stickyHeader.classList.remove('header-sticky--visible');
            }

            if (menuWrapper) {
                menuWrapper.classList.remove('menu-wrapper--visible');
                menuWrapper.removeAttribute('style');
            }

            if (cartWrapper) {
                cartWrapper.classList.remove('cart-wrapper-visible');
                cartWrapper.removeAttribute('style');
            }

            if (catalogMenu && catalogMenu.classList.contains('active')) {
                updateCatalogMenuPosition();
            }
            document.dispatchEvent(new CustomEvent('stickyHeaderChanged', {
                detail: {isVisible: false}
            }));
        }
    }

    // Обработчик ресайза
    function handleResize() {
        if (stickyHeader.classList.contains('header-sticky--visible')) {
            stickyHeader.style.width = window.innerWidth + 'px';
            updateMenuPosition();
        }
        if (catalogMenu && catalogMenu.classList.contains('active')) {
            updateCatalogMenuPosition();
        }
    }

    // Вешаем обработчики событий
    window.addEventListener('scroll', debounce(checkStickyHeader, 10));
    window.addEventListener('resize', debounce(handleResize, 100));

    // Проверяем при загрузке
    window.addEventListener('load', () => {
        setTimeout(checkStickyHeader, 100);
    });

    // Проверяем сразу
    checkStickyHeader();
}