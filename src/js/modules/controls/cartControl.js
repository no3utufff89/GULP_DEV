import {createOverlay, getCurrentHeaderHeight, isStickyHeader, toggleOverflow} from "../helpers.js";

export function cartControl() {
    const cartBtns = document.querySelectorAll('.cart-btn');
    const cartPopups = document.querySelectorAll('.cart-panel');
    const closeBtns = document.querySelectorAll('.cart-panel__close');
    let overlay = document.querySelector('.overlay');
    if (cartBtns.length === 0) return;
    if (!overlay) overlay = createOverlay();

    function positionCartBlock() {
        const headerHeight = getCurrentHeaderHeight();
        const stickyHeader = isStickyHeader()
        if (window.innerWidth < 768) {
            // Нет стики и меньше 768
            if (!stickyHeader) {
                cartPopups.forEach(el => {
                    el.style.top = headerHeight / 2 + 'px';
                })
            } else {
                cartPopups.forEach(el => {
                    el.style.top = headerHeight + 20 + 'px';
                })
            }
        } else if (window.innerWidth >= 768) {
            if (!stickyHeader) {
                cartPopups.forEach(el => {
                    el.style.top = '-3px';
                    el.style.right = '15px'
                })
            } else {
                cartPopups.forEach(el => {
                    el.style.top = '10px';
                    el.style.right = '15px'
                })
            }

        }
    }

    function close() {
        cartBtns.forEach(btn => {
            btn.classList.remove('active')
        })
        // Разблокируем скролл
        toggleOverflow(false);
        overlay.classList.remove('active')
        cartPopups.forEach(block => block.classList.remove('show'))
    }

    function open() {
        positionCartBlock()
        cartBtns.forEach(btn => {
            btn.classList.add('active')
        })
        // Блокируем скролл
        toggleOverflow(true);
        overlay.classList.add('active')
        cartPopups.forEach(block => block.classList.add('show'))
    }

    cartBtns.forEach(elem => {
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
        if (e.key === 'Escape') {
            close();
        }

    });
    window.addEventListener('resize', function () {
        if (cartPopups[0].classList.contains('show')) {
            positionCartBlock();
        }
    })


}