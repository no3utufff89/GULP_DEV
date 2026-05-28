import svgSprite from 'gulp-svg-sprite';

export const createSvgSprite = () => {
    return app.gulp
        .src(`${app.path.src.svgicons}`, {})
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: 'SVG',
                    message: 'Error: <%= error.message %>',
                })
            )
        )
        .pipe(
            svgSprite({
                mode: {
                    symbol: {
                        sprite: '../icons/sprite.svg',
                        example: app.isDev
                    }
                },
                shape: {
                    id: {
                        generator: 'icon-%s'
                    },
                    transform: [
                        {
                            svgo: {
                                plugins: [
                                    // Удаляем только ненужные атрибуты, но сохраняем fill для внутренних элементов
                                    {
                                        name: 'removeAttrs',
                                        params: {
                                            attrs: ['class', 'data-name', 'stroke'], // Удаляем stroke, но не fill!
                                        },
                                    },
                                    // Преобразуем все fill и stroke в currentColor
                                    {
                                        name: 'convertColors',
                                        params: {
                                            currentColor: true // Это ключевая настройка!
                                        }
                                    },
                                    // Добавляем атрибуты для управления через CSS
                                    {
                                        name: 'addAttributesToSVGElement',
                                        params: {
                                            attributes: [
                                                {'fill': 'currentColor'},
                                                {'stroke': 'currentColor'}
                                            ]
                                        }
                                    },
                                    // Опционально: если нужно сделать stroke однородным
                                    {
                                        name: 'convertShapeToPath',
                                        params: {
                                            convertArcs: true
                                        }
                                    },
                                    'removeTitle',
                                    'removeDesc',
                                    'cleanupIDs',
                                    'removeUselessDefs',
                                    'removeEmptyContainers',
                                    'removeHiddenElems',
                                    'removeEmptyText',
                                    'removeStyleElement',
                                    'removeScriptElement',
                                ],
                            },
                        },
                    ],
                },
                svg: {
                    xmlDeclaration: false,
                    doctypeDeclaration: false,
                    rootAttributes: {
                        style: 'position: absolute; width: 0; height: 0; overflow: hidden;',
                        'aria-hidden': 'true'
                    }
                }
            })
        )
        .pipe(app.gulp.dest(`${app.path.build.images}`));
};