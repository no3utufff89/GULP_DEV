import {debounce} from "../helpers.js";

export function initFilter() {
    document.querySelectorAll('.filter-group__content').forEach(content => {
        content.classList.add('initialized');
    });

    // Инициализируем обе версии фильтра
    initFilterDrawer();
    initFilterGroups();

    // Инициализация instant apply и счетчика
    initInstantFilter();

    // Для десктоп версии
    const filterPanelStatic = document.querySelector('.filter-panel--static');
    const handleStickyHeaderChange = debounce((e) => {
        if (e.detail.isVisible && window.innerWidth > 1200) {
            if (!filterPanelStatic) return;
            const headerHeight = e.detail.headerHeight;

            filterPanelStatic.style.top = (headerHeight + 10) + 'px'
        } else {
            if (filterPanelStatic) {
                filterPanelStatic.removeAttribute('style');

            }
        }
    }, 100);

    document.addEventListener('stickyHeaderChanged', handleStickyHeaderChange);
}

// Новая функция для instant apply и счетчика
function initInstantFilter() {
    const filterInputs = document.querySelectorAll('.filter-checkbox input');

    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            applyFilters();
            updateFilterCount();
        });
    });

    // Сброс фильтров
    const resetBtn = document.querySelector('.filter-actions__reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetFilters();
        });
    }

    // Первоначальное обновление счетчика
    updateFilterCount();
}

// Функция применения фильтров
function applyFilters() {
    const checkedInputs = document.querySelectorAll('.filter-checkbox input:checked');
    const selectedFilters = {};

    checkedInputs.forEach(input => {
        const name = input.getAttribute('name');
        const value = input.value;

        if (!selectedFilters[name]) {
            selectedFilters[name] = [];
        }
        selectedFilters[name].push(value);
    });

    console.log('Применяем фильтры:', selectedFilters);
    // Здесь ваша логика фильтрации
}

// Сброс всех фильтров
function resetFilters() {
    const checkedInputs = document.querySelectorAll('.filter-checkbox input:checked');

    checkedInputs.forEach(input => {
        input.checked = false;
    });

    applyFilters();
    updateFilterCount();

    // Закрываем drawer на мобильных
    const drawer = document.querySelector('.filter-drawer');
    if (drawer && drawer.classList.contains('active')) {
        closeDrawer(drawer);
    }
}

// Обновление счетчика фильтров
function updateFilterCount() {
    const filterBtn = document.querySelector('.category-section__filter-btn');
    if (!filterBtn) return;

    const checkedInputs = document.querySelectorAll('.filter-checkbox input:checked');
    const count = checkedInputs.length;

    if (count > 0) {
        filterBtn.classList.add('filter-btn--active');
        filterBtn.setAttribute('data-count', count);

        const btnText = filterBtn.querySelector('.filter-btn__text');
        if (btnText) {
            btnText.textContent = `Фильтры (${count})`;
        }
    } else {
        filterBtn.classList.remove('filter-btn--active');
        filterBtn.removeAttribute('data-count');

        const btnText = filterBtn.querySelector('.filter-btn__text');
        if (btnText) {
            btnText.textContent = 'Фильтры';
        }
    }
}

// Функция для инициализации drawer на мобильных
function initFilterDrawer() {
    const filterBtn = document.querySelector('.category-section__filter-btn');
    const drawer = document.querySelector('.filter-drawer');
    const overlay = document.querySelector('.filter-drawer__overlay');
    const closeBtn = document.querySelector('.filter-drawer__header-close');

    if (!filterBtn || !drawer) {
        console.log('Элементы drawer не найдены');
        return;
    }

    // Открытие drawer
    filterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Клик по кнопке фильтра');
        openDrawer(drawer);
    });

    // Закрытие по оверлею
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeDrawer(drawer);
        });
    }

    // Закрытие по кнопке
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeDrawer(drawer);
        });
    }

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('active')) {
            closeDrawer(drawer);
        }
    });
}

function openDrawer(drawer) {
    drawer.classList.add('active');
    document.body.classList.add('filter-open');

    const filterBtn = document.querySelector('.category-section__filter-btn');
    if (filterBtn) {
        filterBtn.setAttribute('aria-expanded', 'true');
    }
}

function closeDrawer(drawer) {
    drawer.classList.remove('active');
    document.body.classList.remove('filter-open');

    const filterBtn = document.querySelector('.category-section__filter-btn');
    if (filterBtn) {
        filterBtn.setAttribute('aria-expanded', 'false');
    }
}

// Переключение групп фильтра
function initFilterGroups() {
    const filterGroups = document.querySelectorAll('.filter-group');
    const showLimit = 3;

    filterGroups.forEach((group) => {
        const header = group.querySelector('.filter-group__header');
        const content = group.querySelector('.filter-group__content');
        const contentList = group.querySelector('.filter-list');

        if (!header || !content) return;

        // Устанавливаем начальное состояние в зависимости от экрана
        if (!header.hasAttribute('aria-expanded')) {
            const isDesktop = window.innerWidth > 1024;
            const expanded = isDesktop ? 'true' : 'false';

            header.setAttribute('aria-expanded', expanded);
            if (expanded === 'true') {
                content.style.height = 'auto';
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
                content.style.height = '0';
            }
        }

        if (!header.hasAttribute('show-all')) {
            header.setAttribute('show-all', 'false');
        }

        // Обработка кнопки "Показать все"
        const items = content.querySelectorAll('.filter-list__item');
        if (items.length > showLimit) {
            if (!content.querySelector('.filter-group__show-all')) {
                const hiddenItemsList = [...items].slice(showLimit);

                hiddenItemsList.forEach(item => {
                    item.classList.add('filter-list__item--hidden');
                });

                contentList.appendChild(createShowAllBtnListElement());

                const showMoreBtn = content.querySelector('.filter-group__show-all');
                if (showMoreBtn) {
                    showMoreBtn.addEventListener('click', (e) => {
                        e.stopPropagation();

                        const isShowingAll = header.getAttribute('show-all') === 'true';

                        hiddenItemsList.forEach(listItem => {
                            if (!isShowingAll) {
                                listItem.classList.remove('filter-list__item--hidden');
                            } else {
                                listItem.classList.add('filter-list__item--hidden');
                            }
                        });

                        header.setAttribute('show-all', !isShowingAll);
                        showMoreBtn.textContent = !isShowingAll ? 'Скрыть' : 'Показать все';

                        // Если группа открыта, обновляем её высоту
                        if (header.getAttribute('aria-expanded') === 'true') {
                            // Сбрасываем фиксированную высоту
                            content.style.height = 'auto';
                            // Получаем новую высоту
                            const newHeight = content.scrollHeight;
                            // Устанавливаем для анимации
                            content.style.height = newHeight + 'px';


                        }
                    });
                }
            }
        }

        // Обработчик клика на заголовок (исправленный)
        header.addEventListener('click', (e) => {
            e.preventDefault();
            const currentHeader = e.currentTarget;
            const currentContent = currentHeader.closest('.filter-group').querySelector('.filter-group__content');

            const isExpanded = currentHeader.getAttribute('aria-expanded') === 'true';

            // Меняем состояние
            currentHeader.setAttribute('aria-expanded', !isExpanded);

            if (isExpanded) {
                // Закрываем
                currentContent.style.height = currentContent.scrollHeight + 'px';
                currentContent.offsetHeight;
                currentContent.style.height = '0';


            } else {
                // Открываем
                currentContent.style.display = 'block';

                // Сбрасываем height чтобы получить актуальную высоту
                currentContent.style.height = 'auto';
                const newHeight = currentContent.scrollHeight;

                // Начинаем анимацию с 0
                currentContent.style.height = '0';
                currentContent.offsetHeight;
                currentContent.style.height = newHeight + 'px';

              
            }
        });
    });
}


function createShowAllBtnListElement() {
    const showAllBtn = document.createElement("button");
    showAllBtn.classList.add('filter-group__show-all');
    showAllBtn.setAttribute('type', 'button');
    showAllBtn.textContent = 'Показать все';

    const listElement = document.createElement('li');
    listElement.classList.add('filter-list__item-button');
    listElement.appendChild(showAllBtn);

    return listElement;
}

// Инициализация всего фильтра
export function initFilterSystem() {
    initFilter();
}