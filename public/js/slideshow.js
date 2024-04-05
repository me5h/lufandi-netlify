const Slideshow = (() => {
    let images = ['/assets/long-exposure.jpg'];
    let currentIndex = 0;
    let autoplayInterval = null;
    let clockInterval = null;
    
    const container = document.getElementById('slideshow');
    const clockElement = document.getElementById('clock');
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

    document.addEventListener('DOMContentLoaded', () => {
        renderImage(); // Render the default image when the document is ready
    });

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

    const updateClock = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        if (clockElement) {
            clockElement.textContent = timeString;
        }
    };

    const startAutoplay = () => {
        if (!autoplayInterval) {
            autoplayInterval = setInterval(nextImage, 3000);
        }
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    };

    const startClock = () => {
        if (!clockInterval) {
            updateClock();
            clockInterval = setInterval(updateClock, 1000);
        }
    };

    const stopClock = () => {
        clearInterval(clockInterval);
        clockInterval = null;
    };

    const toggleClockDisplay = () => {
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.style.display = (clockElement.style.display === 'none') ? 'block' : 'none';
            console.log('Clock display set to:', clockElement.style.display);
        }
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

    startClock();  // Start the clock when the slideshow starts

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
        stopAutoplay,
        toggleClockDisplay,
        startClock,
        stopClock 
    };
})();
