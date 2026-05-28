import gulp from 'gulp';
import {plugins} from "./gulp/config/plugins.js";
import {html} from "./gulp/tasks/html.js";
import {reset} from "./gulp/tasks/reset.js";
import {appPath} from "./gulp/config/path.js";
import {server} from "./gulp/tasks/server.js";
import {scss} from "./gulp/tasks/scss.js";
import {js} from "./gulp/tasks/js.js";
import {images} from "./gulp/tasks/images.js";
import {createSvgSprite} from "./gulp/tasks/svgSprite.js";
import {fonts, fontsStyle} from "./gulp/tasks/fonts.js";
import {copyJsLibs} from "./gulp/tasks/copyJsLibs.js";

global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path: appPath,
    gulp: gulp,
    plugins: plugins,
};

function watcher() {
    gulp.watch(appPath.watch.html, {
        usePolling: true,
        interval: 500,
        events: ['add', 'change', 'unlink']
    }, html);
    gulp.watch(appPath.watch.scss, scss);
    gulp.watch(appPath.watch.js, js);
    gulp.watch(appPath.watch.images, images);
    gulp.watch(appPath.watch.jsLibs, copyJsLibs);
}

// Экспортируем задачи для использования в терминале и npm скриптах
export const clear = reset;
export const fontsTask = gulp.series(fonts, fontsStyle);
export const copyLibs = gulp.series(copyJsLibs);

const mainTasks = gulp.series(fontsTask, gulp.parallel(html, scss, js, images, createSvgSprite));
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));

export default dev;
export {createSvgSprite};