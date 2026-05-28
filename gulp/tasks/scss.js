import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import autoPrefixer from 'autoprefixer'; // автоматически добавляет префиксы для поддержки старых браузеров
//PostCss
import postcss from 'gulp-postcss';
import sortMediaQueries from 'postcss-sort-media-queries'; // группирует стили под общими медиа запросами
import postcssCustomMedia from 'postcss-custom-media'; // позволяет вам определять @custom-media
import postcssImport from 'postcss-import';
import postcssPrettify from 'postcss-prettify';
import willChange from 'postcss-will-change-transition';
//======
import webpcss from 'webp-in-css/plugin.js';
// Для минификации
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import clone from 'gulp-clone';
import merge from 'merge-stream'; // вместо require используем import

const sass = gulpSass(dartSass);

//Настройка postCss
const postCss = [
    postcssImport(),
    postcssCustomMedia(),
    sortMediaQueries({sort: 'desktop-first'}),
    autoPrefixer(),
    webpcss({
        webpClass: 'webp',
        noWebpClass: 'no-webp',
    }),
    willChange(),
    postcssPrettify(),
];

// Настройка postCss для минифицированной версии (без prettify)
const postCssMin = [
    postcssImport(),
    postcssCustomMedia(),
    sortMediaQueries({sort: 'desktop-first'}),
    autoPrefixer(),
    webpcss({
        webpClass: 'webp',
        noWebpClass: 'no-webp',
    }),
    willChange(),
    cssnano({
        preset: 'default',
    }),
];

export const scss = () => {
    // Создаем поток для основного файла
    const mainStream = app.gulp
        .src(app.path.src.scss)
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: 'SCSS',
                    message: 'Error: <%= error.message %>',
                })
            )
        )
        .pipe(app.plugins.if(app.isDev, app.plugins.sourcemaps.init()))
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(app.plugins.replace(/images\//g, '../../img/'));

    // В режиме разработки делаем два файла
    if (app.isDev) {
        // Создаем два потока из одного
        const mainBranch = mainStream.pipe(clone());
        const minBranch = mainStream.pipe(clone());

        // Обрабатываем основной файл (с sourcemaps и prettify)
        const mainTask = mainBranch
            .pipe(postcss(postCss))
            .pipe(app.plugins.sourcemaps.write())
            .pipe(app.gulp.dest(app.path.build.css));

        // Обрабатываем минифицированный файл (без sourcemaps)
        const minTask = minBranch
            .pipe(postcss(postCssMin))
            .pipe(rename({suffix: '.min'}))
            .pipe(app.gulp.dest(app.path.build.css));

        // Объединяем потоки
        return merge(mainTask, minTask)
            .pipe(app.plugins.browsersync.stream());
    }
    // В продакшене делаем только минифицированный
    else {
        return mainStream
            .pipe(postcss(postCssMin))
            .pipe(rename({suffix: '.min'}))
            .pipe(app.gulp.dest(app.path.build.css))
            .pipe(app.plugins.browsersync.stream());
    }
};