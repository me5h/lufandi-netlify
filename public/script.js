const evtSource = new EventSource('/events');

evtSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const url = data.url;
    const isVideo = url.endsWith('.mp4'); // Check if the URL is for an MP4 video

    if (isVideo) {
        // Create video element and set it as background
        const videoBg = `<video playsinline autoplay muted loop id="bgVideo" style="position:fixed; right:0; bottom:0; min-width:100%; min-height:100%; z-index:-1;"><source src="${url}" type="video/mp4"></video>`;
        document.body.innerHTML = videoBg + document.body.innerHTML;
    } else {
        // Set image as background
        document.body.style.backgroundImage = `url(${url})`;
        // Remove any existing video background
        const existingVideo = document.getElementById('bgVideo');
        if (existingVideo) {
            existingVideo.parentNode.removeChild(existingVideo);
        }
    }
};
