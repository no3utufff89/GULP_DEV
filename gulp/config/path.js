import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = process.env.npm_package_name;
// const cleanFolder = [`./dist/{css,js,img}`, `./dist/*.*`];
const srcFolder = `./src`;
const docsFolder = './docs';
export const path = {
    build: {
        js: `${buildFolder}/js/`,
        jsFiles: `${buildFolder}/js/`,
        css: `${buildFolder}/css/`,
        html: `${buildFolder}/`,
        images: `${buildFolder}/img/`,
        fonts: `${buildFolder}/fonts/`,
        files: `${buildFolder}/files/`,
    },
    src: {
        js: `${srcFolder}/js/app.js`,
        jsFiles: `${srcFolder}/js/**/*.js`,
        css: `${srcFolder}/css/style.css`,
        scss: `${srcFolder}/scss/**/*.scss`,
        html: `${srcFolder}/*.{html,pug,php,ico}`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        imagesVariants: `${srcFolder}/img/`,
        svg: `${srcFolder}/img/**/*.svg`,
        svgicons: `${srcFolder}/icons/*.svg`,
        files: `${srcFolder}/files/**/*.*`,
    },
    watch: {
        js: `${srcFolder}/js/**/*.js`,
        jsFiles: `${srcFolder}/js/**/*.js`,
        css: `${srcFolder}/css/**/*.css`,
        html: `${srcFolder}/**/*.{html,pug,php}`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg}`,
        svgicons: `${srcFolder}/icons/*.svg`,
        files: `${srcFolder}/files/**/*.*`,
        scss: `${srcFolder}/scss/**/*.scss`,
    },
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
    docsFolder: docsFolder,
    ftp: `httpdocs`,
};
