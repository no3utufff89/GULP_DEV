export function footerMenuControl() {
    const footerList = document.querySelector('.footer-list');

    if (!footerList) return;

    const menuItems = footerList.querySelectorAll('.footer-list__item');

    function isMobile() {
        return window.innerWidth < 768;
    }

    function setDesktopState() {
        menuItems.forEach(item => {
            const menu = item.querySelector('.footer-menu');
            const header = item.querySelector('.footer-list__header');

            if (menu) {
                menu.classList.add('footer-menu_active');
                if (header) {
                    header.setAttribute('aria-expanded', 'true');
                }
            }
        });
    }

    function setMobileState() {
        menuItems.forEach(item => {
            const menu = item.querySelector('.footer-menu');
            const header = item.querySelector('.footer-list__header');

            if (menu) {
                menu.classList.remove('footer-menu_active');
                if (header) {
                    header.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // Обработчик клика по всему заголовку
    function handleHeaderClick(header, menu) {
        header.addEventListener('click', (e) => {
            e.preventDefault();

            if (!isMobile()) return;

            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Закрываем все другие меню
            menuItems.forEach(item => {
                const otherMenu = item.querySelector('.footer-menu');
                const otherHeader = item.querySelector('.footer-list__header');

                if (otherMenu && otherMenu !== menu && isMobile()) {
                    otherMenu.classList.remove('footer-menu_active');
                    if (otherHeader) {
                        otherHeader.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            // Переключаем текущее
            if (isExpanded) {
                menu.classList.remove('footer-menu_active');
                header.setAttribute('aria-expanded', 'false');
            } else {
                menu.classList.add('footer-menu_active');
                header.setAttribute('aria-expanded', 'true');
            }
        });

        // Поддержка клавиатуры (Enter и Space)
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    }

    // Инициализация
    menuItems.forEach(item => {
        const header = item.querySelector('.footer-list__header');
        const menu = item.querySelector('.footer-menu');

        if (header && menu) {
            // Добавляем атрибуты для доступности, если их нет
            if (!header.hasAttribute('role')) {
                header.setAttribute('role', 'button');
            }
            if (!header.hasAttribute('tabindex')) {
                header.setAttribute('tabindex', '0');
            }

            handleHeaderClick(header, menu);
        }
    });

    // Устанавливаем начальное состояние
    if (isMobile()) {
        setMobileState();
    } else {
        setDesktopState();
    }

    // Обработчик ресайза
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (isMobile()) {
                setMobileState();
            } else {
                setDesktopState();
            }
        }, 250);
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobile()) {
            menuItems.forEach(item => {
                const menu = item.querySelector('.footer-menu');
                const header = item.querySelector('.footer-list__header');

                if (menu && menu.classList.contains('footer-menu_active')) {
                    menu.classList.remove('footer-menu_active');
                    if (header) {
                        header.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
    });
}