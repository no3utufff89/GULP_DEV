import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';

import cssnano from 'cssnano';
import autoPrefixer from 'autoprefixer'; // автоматически добавляет префиксы для поддержки старых браузеров
import sortMediaQueries from 'postcss-sort-media-queries'; // группирует стили под общими медиа запросами
import postcssCustomMedia from 'postcss-custom-media'; // позволяет вам определять @custom-media
import postcssImport from 'postcss-import';
import postcssPrettify from 'postcss-prettify';

import willChange from 'postcss-will-change-transition';
import webpcss from 'webp-in-css/plugin.js';

const sass = gulpSass(dartSass);
const postCss = [
    postcssImport(),
    postcssCustomMedia(),
    sortMediaQueries({ sort: 'desktop-first' }),
    autoPrefixer(),

    webpcss({
        webpClass: 'webp',
        noWebpClass: 'no-webp',
    }),
    willChange(),
    postcssPrettify(),
];
export const scss = () => {
    // const clear = comments({ removeAll: true }); // удаление комментариев
    return app.gulp
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
        .pipe(
            sass({
                outputStyle: 'expanded',
            })
        )

        .pipe(app.plugins.replace(/@img\//g, '../img/'))
        .pipe(postcss(postCss))
        .pipe(app.plugins.if(app.isDev, app.plugins.sourcemaps.write()))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browsersync.stream());
};
