import {createOverlay, toggleOverflow} from "../helpers.js";

export function locationControl() {
    const locationBtns = document.querySelectorAll('.location-elem');
    const addressPopups = document.querySelectorAll('.location-address');
    const closeBtns = document.querySelectorAll('.location-address__close')
    let overlay = document.querySelector('.overlay');

    if (locationBtns.length === 0) return;
    if (!overlay) overlay = createOverlay();

    function close() {
        locationBtns.forEach(btn => {
            btn.classList.remove('active')
        })

        // Разблокируем скролл
        toggleOverflow(false);

        overlay.classList.remove('active')
        addressPopups.forEach(block => block.classList.remove('show'))
    }

    function open() {
        locationBtns.forEach(btn => {
            btn.classList.add('active')
        })

        // Блокируем скролл
        toggleOverflow(true);

        overlay.classList.add('active')
        addressPopups.forEach(block => block.classList.add('show'))
    }

    locationBtns.forEach(elem => {
        elem.addEventListener('click', open)
    })

    closeBtns.forEach(btn => {
        btn.addEventListener('click', close)
    })

    if (overlay) {
        overlay.addEventListener('click', close)
    }

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            close();
        }
    });
}