import webp from 'gulp-webp';
import imagemin, {mozjpeg, optipng} from 'gulp-imagemin';

export const images = () => {
    return app.gulp
        .src(app.path.src.images, {encoding: false})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: 'IMAGES',
                message: 'Error: <%= error.message %>',
            })
        ))
        .pipe(app.plugins.newer(app.path.build.images))
        // Оптимизируем только растровые изображения
        .pipe(app.plugins.if(
            file => !file.path.endsWith('.svg'),
            imagemin([
                mozjpeg({quality: 80}),
                optipng({optimizationLevel: 5})
            ])
        ))
        .pipe(app.gulp.dest(app.path.build.images))
        // Создаем WebP только для растровых изображений (не SVG)
        .pipe(app.plugins.if(
            file => !file.path.endsWith('.svg'),
            app.plugins.newer({
                dest: app.path.build.images,
                ext: '.webp'
            })
        ))
        .pipe(app.plugins.if(
            file => !file.path.endsWith('.svg'),
            webp()
        ))
        .pipe(app.plugins.if(
            file => !file.path.endsWith('.svg'),
            app.gulp.dest(app.path.build.images)
        ))
        .pipe(app.plugins.browsersync.stream());
};