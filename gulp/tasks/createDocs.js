export const createDocs = () => {
    const source = app.path.buildFolder;
    if (!source) {
        console.log('Нет папки с собранным проектом, запустите сначала сборку');
        return;
    }
    return app.gulp.src(`${source}/**/*.*`).pipe(app.gulp.dest('./docs'));
};
