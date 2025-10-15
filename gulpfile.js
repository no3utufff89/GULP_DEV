import gulp from 'gulp';
import { path } from './gulp/config/path.js';
import { plugins } from './gulp/config/plugins.js';

global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path: path,
    gulp: gulp,
    plugins: plugins,
};

import { copy, copyJsAssets } from './gulp/tasks/copy.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import { svgSprive } from './gulp/tasks/svgSprite.js';
import { otfToTtf, ttfToWoff, fontsStyle, iconFont } from './gulp/tasks/fonts.js';
import { zip } from './gulp/tasks/zip.js';
import { ftp } from './gulp/tasks/ftp.js';
import { createDocs } from './gulp/tasks/createDocs.js';
import { minify } from './gulp/tasks/minify.js';
function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);

    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.jsFiles, copyJsAssets);
    gulp.watch(path.watch.images, images);
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle, iconFont);
const mainTasks = gulp.series(fonts, gulp.parallel(copy, copyJsAssets, html, scss, js, images));
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const createZip = gulp.series(reset, mainTasks, zip);
const uploadFTP = gulp.series(reset, mainTasks, ftp);

const clear = gulp.series(reset);
const docs = gulp.series(createDocs);
const createMinCss = gulp.series(minify);

export { svgSprive };
export { build };
export { createZip };
export { uploadFTP };
export { clear };
export { docs };
export { createMinCss };
gulp.task('default', dev);
