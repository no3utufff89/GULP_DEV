import * as functions from './modules/functions.js';

import { getPageElements } from './modules/pageElements.js';

const elements = getPageElements();
window.addEventListener('load', function () {
    functions.isWebp();
    // functions.preventClickDefault($('form'));
});
window.addEventListener('DOMContentLoaded', function () {

});
window.addEventListener('resize', function () {
    clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function () {}, 100);
});

let timer;
window.addEventListener(
    'scroll',
    function () {
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            const pageOffset = Math.round(window.pageYOffset);
            pageOffset > 300
                ? document.body.classList.add('scrolled')
                : document.body.classList.remove('scrolled');
            // scroll functions
        }, 100);
    },
    false
);
