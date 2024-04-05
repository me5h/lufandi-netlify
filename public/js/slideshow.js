const Slideshow = (() => {
    let images = [];
    let currentIndex = 0;
    let autoplayInterval = null;

    const container = document.getElementById('slideshow');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const fullscreenButton = document.getElementById('fullscreen');

    const renderImage = () => {
        if (images.length === 0) {
            container.style.backgroundImage = '';
            return;
        }
        container.style.backgroundImage = `url('${images[currentIndex]}')`;
    };

    const nextImage = () => {
        if (images.length > 0) {
            currentIndex = (currentIndex + 1) % images.length;
            renderImage();
        }
    };

    const prevImage = () => {
        if (images.length > 0) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            renderImage();
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const startAutoplay = () => {
        if (autoplayInterval) return;
        autoplayInterval = setInterval(nextImage, 3000); // 3 seconds for each slide
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    };

    nextButton.addEventListener('click', nextImage);
    prevButton.addEventListener('click', prevImage);
    fullscreenButton.addEventListener('click', toggleFullscreen);

    document.addEventListener('new-image', (event) => {
        const imageUrl = event.detail;
        images.push(imageUrl);
        if (images.length === 1) {
            renderImage();
        }
    });

    return {
        addImage: imageUrl => {
            images.push(imageUrl);
            if (images.length === 1) {
                renderImage();
            }
        },
        nextImage,
        prevImage,
        toggleFullscreen,
        startAutoplay,
        stopAutoplay
    };
})();
