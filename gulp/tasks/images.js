import webp from 'gulp-webp';
import imagemin, {mozjpeg, optipng} from 'gulp-imagemin';
import avif from 'gulp-avif';

// Проверка, что файл не SVG
const isRaster = file => !file.path.endsWith('.svg');

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

        // 1. Оптимизация оригиналов
        .pipe(app.plugins.if(isRaster, imagemin([
            mozjpeg({quality: 80, progressive: true}),
            optipng({optimizationLevel: 5})
        ])))
        .pipe(app.gulp.dest(app.path.build.images))

        .pipe(app.plugins.if(isRaster, avif({
            quality: 65,
            speed: 6,
            lossless: false
        })))
        .pipe(app.plugins.if(isRaster, app.gulp.dest(app.path.build.images)))
        .pipe(app.plugins.if(isRaster, avif({
            quality: 65,
            speed: 6,
            lossless: false
        })))
        .pipe(app.plugins.if(isRaster, app.gulp.dest(app.path.build.images)))

        // 3. Конвертация в WebP (fallback формат)
        .pipe(app.plugins.if(isRaster, app.plugins.newer({
            dest: app.path.build.images,
            ext: '.webp'
        })))
        .pipe(app.plugins.if(isRaster, webp({quality: 80})))
        .pipe(app.plugins.if(isRaster, app.gulp.dest(app.path.build.images)))

        .pipe(app.plugins.browsersync.stream());
};