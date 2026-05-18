document.querySelectorAll('.slideshow').forEach(slideshow => {
    const images = slideshow.querySelectorAll('img');
    let current = 0;
    images[0].classList.add('active');

    setInterval(() => {
        images[current].classList.remove('active');
        current = (current + 1) % images.length;
        images[current].classList.add('active');
    }, 3000);
});