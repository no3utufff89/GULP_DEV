import path from 'path';

const rootFolder = path.basename(path.resolve());
const buildFolder = 'dist';

const srcFolder = `./src`;
const docsFolder = './docs';

export const appPath = {
    build: {
        js: `${buildFolder}/js/`,
        jsLibs: `${buildFolder}/js/libs`,
        css: `${buildFolder}/css/`,
        html: `${buildFolder}/`,
        images: `${buildFolder}/img/`,
        fonts: `${buildFolder}/fonts/`,
        files: `${buildFolder}/files/`,
    },
    src: {
        fonts: `${srcFolder}/fonts/`,
        html: `${srcFolder}/html/pages/*.{html,pug,php,ico}`,
        svgicons: `${srcFolder}/icons/*.svg`,
        images: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp,svg}`,
        js: `${srcFolder}/js/app.js`,
        jsLibs: `${srcFolder}/js/libs/**/*.js`,
        scss: `${srcFolder}/scss/**/*.scss`,
        files: `${srcFolder}/files/**/*.*`,
    },
    watch: {
        fonts: `${srcFolder}/fonts/`,
        html: `${srcFolder}/html/**/*.{html,pug,php,ico}`,
        svgicons: `${srcFolder}/icons/*.svg`,
        images: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp}`,
        js: `${srcFolder}/js/**/*.js`,
        jsLibs: `${srcFolder}/js/libs/**/*.js`,
        scss: `${srcFolder}/scss/**/*.scss`,
        files: `${srcFolder}/files/**/*.*`,
    },
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
    docsFolder: docsFolder,
    ftp: `httpdocs`,
};
