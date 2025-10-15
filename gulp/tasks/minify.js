import rename from 'gulp-rename';
import cssnano from 'cssnano';
import postcss from 'gulp-postcss';

export const minify = async () => {
    const source = `${app.path.build.css}/style.css`;

    app.gulp
        .src(source)
        .pipe(postcss([cssnano()]))
        .pipe(
            rename({
                extname: '.min.css',
            })
        )
        .pipe(app.gulp.dest(app.path.build.css));
};
