document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the token details from your Netlify function
        const tokenResponse = await fetch('/.netlify/functions/generate-ably-token');
        if (!tokenResponse.ok) {
            throw new Error(`Failed to fetch Ably token: ${tokenResponse.statusText}`);
        }
        const tokenDetails = await tokenResponse.json();
        console.log('Token details:', tokenDetails);

        // Initialize the Ably client with the fetched token details
        const ably = new Ably.Realtime({
            authUrl: '/.netlify/functions/generate-ably-token',
            logLevel: 4 // Set the log level for detailed logging
        });

        ably.connection.on('failed', () => {
            console.log('Connection to Ably failed');
        });
        
        ably.connection.on('error', (error) => {
            console.log('Ably connection error:', error);
        });

        // Check for successful connection
        ably.connection.on('connected', () => {
            console.log('Successfully connected to Ably!');
        });

        // Monitor connection state changes and log them
        ably.connection.on('stateChange', stateChange => {
            console.log('Ably connection state changed:', stateChange.current);
        });

        const channel = ably.channels.get('file-uploads');

        channel.subscribe('new-file', (message) => {
            console.log('New file message received:', message.data);
            const imageUrlEvent = new CustomEvent('new-image', { detail: message.data.downloadUrl });
            document.dispatchEvent(imageUrlEvent);
        });

        channel.subscribe('control', (message) => {
            switch (message.data.action) {
                case 'next':
                    Slideshow.nextImage();
                    break;
                case 'prev':
                    Slideshow.prevImage();
                    break;
                case 'toggleAutoplay':
                    if (message.data.value) {
                        Slideshow.startAutoplay();
                    } else {
                        Slideshow.stopAutoplay();
                    }
                    break;
            }
        });        
        
        function toggleAutoplay(isAutoplayEnabled) {
            console.log('Autoplay toggled:', isAutoplayEnabled);
            // Implement logic to start or stop autoplay based on isAutoplayEnabled
        }        
    } catch (err) {
        console.error('Error setting up Ably:', err);
    }
});
