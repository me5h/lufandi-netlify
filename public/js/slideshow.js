const Slideshow = (() => {
    let images = [];
    let currentIndex = 0;

    const container = document.getElementById('slideshow-container');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');

    const renderImage = () => {
        if (images.length === 0) {
            container.style.backgroundImage = '';
            return;
        }
        container.style.backgroundImage = `url('${images[currentIndex]}')`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
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

    nextButton.addEventListener('click', nextImage);
    prevButton.addEventListener('click', prevImage);

    // Listen for the custom event and add the received image URL to the slideshow
    document.addEventListener('new-image', (event) => {
        const imageUrl = event.detail;
        Slideshow.addImage(imageUrl);
    });

    return {
        addImage: (imageUrl) => {
            images.push(imageUrl);
            if (images.length === 1) {
                renderImage();
            }
        }
    };
})();
