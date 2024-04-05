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

        const channel = ably.channels.get('file-uploads');

        document.getElementById('prevTrigger').addEventListener('click', () => {
            channel.publish('control', { action: 'prev' });
        });

        document.getElementById('nextTrigger').addEventListener('click', () => {
            channel.publish('control', { action: 'next' });
        });

        const autoplayToggle = document.getElementById('autoplayToggle');
        autoplayToggle.addEventListener('change', () => {
            channel.publish('control', { action: 'toggleAutoplay', value: autoplayToggle.checked });
        });

        const clockToggle = document.getElementById("clockToggle");
        clockToggle.addEventListener("change", async () => {
          channel.publish('control', { action: 'toggleClock', value: clockToggle.checked });
        });

    } catch (error) {
        console.error('Error initializing Ably:', error);
    }
});
