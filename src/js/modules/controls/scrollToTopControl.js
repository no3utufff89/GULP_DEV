export function scrollToTopControl() {
    const topScroll = document.querySelector('.top-scroll');

    if (!topScroll) return;

    function checkTopScrollButton() {
        if (window.scrollY > 300) {
            topScroll.classList.add('top-scroll--visible');
        } else {
            topScroll.classList.remove('top-scroll--visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const scrollButton = topScroll.querySelector('.top-scroll__btn');
    if (scrollButton) {
        scrollButton.addEventListener('click', scrollToTop);
    }

    window.addEventListener('scroll', checkTopScrollButton);
    window.addEventListener('resize', checkTopScrollButton);

    checkTopScrollButton();
    window.addEventListener('load', checkTopScrollButton);
}