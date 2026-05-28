import fileInclude from 'gulp-file-include';
import webpHtmlNosvg from 'gulp-webp-html-nosvg';
import versionNumber from 'gulp-version-number';
export const html = done => {
    app.gulp
        .src(app.path.src.html)
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: 'HTML',
                    message: 'Error: <%= error.message %>',
                })
            )
        )
        .pipe(fileInclude())
        //Добавить Replace для картинок
        .pipe(app.plugins.replace(/images\//g, 'img/'))
        .pipe(webpHtmlNosvg())
        .pipe(
            app.plugins.if(
                app.isBuild,
                versionNumber({
                    value: '%DT%',
                    append: {
                        key: '_v',
                        cover: 0,
                        to: ['css', 'js'],
                    },
                    output: {
                        file: 'gulp/version.json',
                    },
                })
            )
        )
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browsersync.stream());
    return done();
}