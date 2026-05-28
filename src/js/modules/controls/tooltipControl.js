export function tooltipControl() {
    tippy('.product-tooltip-btn', {
        content: (reference) => {
            return reference.getAttribute('data-tippy-content') || 'Нет информации';
        },
        allowHTML: true,
        placement: 'top',
        animation: 'scale',
        duration: [300, 250],
        trigger: 'click',
        interactive: true,
        theme: 'product',
        arrow: true,
        maxWidth: 300,

        // ВАЖНО: добавляем appendTo с правильным значением
        appendTo: () => document.body, // Функция для гарантии

        // Отключаем лишние inline-стили, которые мешают
        popperOptions: {
            strategy: 'absolute', // или 'fixed' если нужно
            modifiers: [
                {
                    name: 'preventOverflow',
                    options: {
                        boundary: 'viewport'
                    }
                },
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: ['bottom', 'top']
                    }
                },
                {
                    name: 'computeStyles',
                    options: {
                        adaptive: false // Отключаем адаптивные стили Popper
                    }
                }
            ]
        },

        onShow(instance) {
            // Принудительно обновляем позицию после показа
            setTimeout(() => {
                instance.popperInstance?.update();
            }, 10);
        }
    });
}