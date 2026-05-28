import esbuild from 'gulp-esbuild';

export const js = () => {
    return app.gulp
        .src(app.path.src.js)
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: 'JS',
                    message: 'Error: <%= error.message %>',
                })
            )
        )
        .pipe(app.plugins.if(app.isDev, app.plugins.sourcemaps.init()))
        .pipe(esbuild({
            bundle: true,
            format: 'iife',      // чистая обертка без eval
            minify: false,       // не сжимаем (читаемый код)
            sourcemap: app.isDev,
            target: 'es2015',
            platform: 'browser',
            outfile: 'app.js'
        }))
        .pipe(app.plugins.if(app.isDev, app.plugins.sourcemaps.write()))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.plugins.browsersync.stream());
}