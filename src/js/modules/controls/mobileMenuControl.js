import {createOverlay, toggleOverflow} from "../helpers.js";

export function mobileMenuControl() {
    const burgerBtn = document.querySelector('.burger-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    let overlay = document.querySelector('.overlay');
    if (!burgerBtn || !mobileNav) return;
    if (!overlay) overlay = createOverlay();

    function toggleMenu() {
        const isActive = burgerBtn.classList.contains('active');
        !isActive ? toggleOverflow(true) : toggleOverflow(false);
        burgerBtn.classList.toggle('active');
        burgerBtn.setAttribute('aria-expanded', !isActive);
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    function closeMenu() {
        burgerBtn.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
    }

    // Открытие/закрытие по клику на бургер
    if (burgerBtn) {
        burgerBtn.addEventListener('click', toggleMenu);
    }
    // Закрытие при клике на overlay
    if (overlay) {
        overlay.addEventListener('click', closeMenu)
    }
    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
    // Закрытие при клике на ссылки
    if (mobileNav) {
        const menuLinks = mobileNav.querySelectorAll('.mobile-nav-list__link');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    // Обработка ресайза
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 768 && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
}