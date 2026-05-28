export const copyJsLibs = () => {
    return app.gulp
        .src(app.path.src.jsLibs)
        .pipe(app.plugins.newer(`${app.path.build.jsLibs}`)) // Копируем только новые файлы
        .pipe(app.gulp.dest(`${app.path.build.jsLibs}`))
        .pipe(app.plugins.browsersync.stream());
}