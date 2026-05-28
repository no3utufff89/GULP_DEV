import fs from 'fs';
import ttf2woff2 from 'gulp-ttf2woff2';

// Копируем готовые WOFF2 или конвертируем TTF
export const fonts = () => {
    const srcPath = `${app.path.srcFolder}/fonts/`;
    const buildPath = app.path.build.fonts;

    // Проверяем существование папки с исходниками
    if (!fs.existsSync(srcPath)) {
        console.log('⚠️ Папка со шрифтами не найдена, пропускаем...');
        return app.gulp.src('.', { allowEmpty: true });
    }

    // Создаем папку назначения если нет
    if (!fs.existsSync(buildPath)) {
        fs.mkdirSync(buildPath, { recursive: true });
    }

    // Сначала копируем WOFF2 (если есть)
    const woff2Files = fs.readdirSync(srcPath).filter(f => f.endsWith('.woff2'));
    if (woff2Files.length) {
        console.log(`📦 Копируем WOFF2: ${woff2Files.length} файлов`);
        app.gulp.src(`${srcPath}*.woff2`, { allowEmpty: true })
            .pipe(app.gulp.dest(buildPath));
    }

    // Конвертируем TTF в WOFF2 с защитой от ошибок
    const ttfFiles = fs.readdirSync(srcPath).filter(f => f.endsWith('.ttf'));
    if (ttfFiles.length) {
        console.log(`🔄 Конвертируем TTF → WOFF2: ${ttfFiles.length} файлов`);

        return app.gulp.src(`${srcPath}*.ttf`, { allowEmpty: true })
            .pipe(app.plugins.plumber(
                app.plugins.notify.onError({
                    title: 'Шрифты',
                    message: 'Ошибка конвертации TTF: <%= error.message %>',
                })
            ))
            .pipe(ttf2woff2())
            .pipe(app.gulp.dest(buildPath));
    }

    // Если нет ни WOFF2, ни TTF
    if (!woff2Files.length && !ttfFiles.length) {
        console.log('⚠️ Нет файлов шрифтов (.ttf или .woff2) в папке src/fonts/');
    }

    return app.gulp.src('.', { allowEmpty: true });
};

// Генерация _fonts.scss
export const fontsStyle = () => {
    const fontsDir = app.path.build.fonts;
    const scssFile = `${app.path.srcFolder}/scss/base/_fonts.scss`;

    if (!fs.existsSync(fontsDir)) {
        console.log('⚠️ Нет сконвертированных шрифтов, пропускаем создание _fonts.scss');
        return app.gulp.src('.', { allowEmpty: true });
    }

    const fonts = fs.readdirSync(fontsDir).filter(f => f.endsWith('.woff2'));
    if (!fonts.length) {
        console.log('⚠️ Нет WOFF2 файлов для генерации стилей');
        return app.gulp.src('.', { allowEmpty: true });
    }

    let content = '// Auto-generated fonts\n\n';
    fonts.forEach(font => {
        const name = font.replace('.woff2', '');
        content += `@font-face {\n`;
        content += `    font-family: "${name}";\n`;
        content += `    src: url("../fonts/${font}") format("woff2");\n`;
        content += `    font-display: swap;\n`;
        content += `}\n\n`;
    });

    // Создаем папку base если ее нет
    const baseDir = `${app.path.srcFolder}/scss/base`;
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }

    fs.writeFileSync(scssFile, content);
    console.log(`✅ Создан ${scssFile} (${fonts.length} шрифтов)`);

    return app.gulp.src('.', { allowEmpty: true });
};