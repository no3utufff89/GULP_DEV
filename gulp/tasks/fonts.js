import fs from 'fs';
import ttf2woff2 from 'gulp-ttf2woff2';

// Эта функция теперь просто конвертирует TTF в WOFF2
export const ttfToWoff2 = () => {
    // Проверяем наличие TTF файлов
    const ttfPath = `${app.path.srcFolder}/fonts/`;

    if (!fs.existsSync(ttfPath)) {
        console.log('Директория с шрифтами не найдена');
        return app.gulp.src('.', { allowEmpty: true });
    }

    const ttfFiles = fs.readdirSync(ttfPath)
        .filter(file => file.endsWith('.ttf'));

    if (ttfFiles.length === 0) {
        console.log('TTF файлы не найдены');
        return app.gulp.src('.', { allowEmpty: true });
    }

    console.log(`Конвертация TTF → WOFF2: ${ttfFiles.length} файлов`);

    // Создаем директорию для сборки если нет
    if (!fs.existsSync(app.path.build.fonts)) {
        fs.mkdirSync(app.path.build.fonts, { recursive: true });
    }

    return app.gulp
        .src(`${app.path.srcFolder}/fonts/*.ttf`)
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: 'FONTS TTF→WOFF2',
                    message: 'Error: <%= error.message %>',
                })
            )
        )
        .pipe(ttf2woff2())
        .pipe(app.gulp.dest(app.path.build.fonts))
        .pipe(app.plugins.browsersync ? app.plugins.browsersync.stream() : app.gulp.dest('.'));
};

// Эта функция копирует только WOFF2 файлы (и другие форматы, если нужно)
export const copyFonts = () => {
    const fontsPath = `${app.path.srcFolder}/fonts/`;

    if (!fs.existsSync(fontsPath)) {
        console.log('Директория с шрифтами не найдена');
        return app.gulp.src('.', { allowEmpty: true });
    }

    // Определяем какие форматы нужны
    const neededFormats = ['.woff2']; // Только WOFF2

    // Можно добавить другие форматы если нужно:
    // const neededFormats = ['.woff2', '.woff']; // WOFF2 + WOFF

    const fontFiles = fs.readdirSync(fontsPath)
        .filter(file => neededFormats.some(ext => file.endsWith(ext)));

    if (fontFiles.length === 0) {
        console.log(`Файлы форматов ${neededFormats.join(', ')} не найдены`);
        return app.gulp.src('.', { allowEmpty: true });
    }

    console.log(`Копирование шрифтов: ${fontFiles.length} файлов`);

    // Создаем директорию для сборки если нет
    if (!fs.existsSync(app.path.build.fonts)) {
        fs.mkdirSync(app.path.build.fonts, { recursive: true });
    }

    // Копируем только нужные форматы
    return app.gulp
        .src(`${app.path.srcFolder}/fonts/*.{woff2}`, {
            allowEmpty: true
        })
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: 'FONTS COPY',
                    message: 'Error: <%= error.message %>',
                })
            )
        )
        .pipe(app.gulp.dest(app.path.build.fonts))
        .pipe(app.plugins.browsersync ? app.plugins.browsersync.stream() : app.gulp.dest('.'));
};

// Генерация стилей для шрифтов (только для WOFF2)
export const fontsStyle = () => {
    const fontsFile = `${app.path.srcFolder}/scss/base/_fonts.scss`;
    const fontsDest = app.path.build.fonts;

    // Проверяем существование директории со шрифтами
    if (!fs.existsSync(fontsDest)) {
        fs.mkdirSync(fontsDest, { recursive: true });
        console.log(`Создана директория: ${fontsDest}`);
        return;
    }

    fs.readdir(fontsDest, (err, fontsFiles) => {
        if (err) {
            console.error('Ошибка чтения директории шрифтов:', err);
            return;
        }

        if (!fontsFiles || fontsFiles.length === 0) {
            console.log('Шрифты не найдены в build директории');
            return;
        }

        // Фильтруем только woff2 файлы (можно изменить если нужны другие форматы)
        const woff2Files = fontsFiles.filter(file => file.endsWith('.woff2'));

        if (woff2Files.length === 0) {
            console.log('WOFF2 файлы не найдены');
            return;
        }

        // Создаем директорию для SCSS если нет
        const scssDir = `${app.path.srcFolder}/scss/base`;
        if (!fs.existsSync(scssDir)) {
            fs.mkdirSync(scssDir, { recursive: true });
        }

        // Удаляем старый файл если есть
        if (fs.existsSync(fontsFile)) {
            fs.unlinkSync(fontsFile);
        }

        // Создаем новый файл
        fs.writeFileSync(fontsFile, '// Auto-generated fonts file\n// Format: WOFF2 only\n\n');

        const processedFonts = new Set();

        woff2Files.forEach(fontFile => {
            const fontFileName = fontFile.split('.')[0];

            // Пропускаем если уже обработали этот шрифт
            if (processedFonts.has(fontFileName)) return;

            let fontName, fontWeight, fontStyle = 'normal';

            // Парсим имя файла
            const parts = fontFileName.split('-');

            if (parts.length === 1) {
                // Просто имя шрифта
                fontName = parts[0];
                fontWeight = 400;
            } else {
                // Ищем вес в конце имени файла
                const weightPart = parts[parts.length - 1].toLowerCase();

                // Определяем вес шрифта
                switch(weightPart) {
                    case 'thin':
                        fontWeight = 100;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    case 'extralight':
                    case 'ultralight':
                        fontWeight = 200;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    case 'light':
                        fontWeight = 300;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    case 'regular':
                    case 'normal':
                        fontWeight = 400;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    case 'medium':
                        fontWeight = 500;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    case 'semibold':
                    case 'demibold':
                        fontWeight = 600;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    case 'bold':
                        fontWeight = 700;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    case 'extrabold':
                    case 'ultrabold':
                        fontWeight = 800;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    case 'black':
                    case 'heavy':
                        fontWeight = 900;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    case 'italic':
                    case 'oblique':
                        fontStyle = 'italic';
                        fontWeight = 400;
                        fontName = parts.slice(0, -1).join('-');
                        break;
                    default:
                        // Проверяем, является ли последняя часть числом (весом)
                        if (!isNaN(weightPart)) {
                            fontWeight = parseInt(weightPart);
                            fontName = parts.slice(0, -1).join('-');
                        } else {
                            // Не удалось определить вес
                            fontWeight = 400;
                            fontName = parts.join('-');
                        }
                }

                // Проверяем стиль в имени
                if (fontFileName.toLowerCase().includes('italic')) {
                    fontStyle = 'italic';
                }
            }

            // Форматируем имя шрифта для CSS
            const formattedFontName = fontName.includes(' ') ? `"${fontName}"` : fontName;

            // Создаем @font-face только с WOFF2
            const fontFace = `
@font-face {
    font-family: ${formattedFontName};
    font-display: swap;
    src: url("../fonts/${fontFileName}.woff2") format("woff2");
    font-weight: ${fontWeight};
    font-style: ${fontStyle};
}\n`;

            fs.appendFileSync(fontsFile, fontFace);
            processedFonts.add(fontFileName);

            console.log(`Добавлен шрифт: ${formattedFontName} (weight: ${fontWeight}, style: ${fontStyle})`);
        });

        console.log(`Файл ${fontsFile} успешно создан`);
    });

    return app.gulp.src(`${app.path.srcFolder}`);
};

// Если у вас есть готовые WOFF2 файлы и нужно их просто скопировать
export const copyWoff2Fonts = () => {
    const fontsPath = `${app.path.srcFolder}/fonts/`;

    if (!fs.existsSync(fontsPath)) {
        console.log('Директория с шрифтами не найдена');
        return app.gulp.src('.', { allowEmpty: true });
    }

    const woff2Files = fs.readdirSync(fontsPath)
        .filter(file => file.endsWith('.woff2'));

    if (woff2Files.length === 0) {
        console.log('WOFF2 файлы не найдены');
        return app.gulp.src('.', { allowEmpty: true });
    }

    console.log(`Копирование WOFF2 шрифтов: ${woff2Files.length} файлов`);

    // Создаем директорию для сборки если нет
    if (!fs.existsSync(app.path.build.fonts)) {
        fs.mkdirSync(app.path.build.fonts, { recursive: true });
    }

    return app.gulp
        .src(`${app.path.srcFolder}/fonts/*.woff2`)
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: 'FONTS WOFF2 COPY',
                    message: 'Error: <%= error.message %>',
                })
            )
        )
        .pipe(app.gulp.dest(app.path.build.fonts))
        .pipe(app.plugins.browsersync ? app.plugins.browsersync.stream() : app.gulp.dest('.'));
};




// Или если у вас уже есть WOFF2 файлы:
