document.addEventListener('DOMContentLoaded', async () => {
    console.log('onMessage.js')
    try {
        // Fetch the token details from your Netlify function
        const tokenResponse = await fetch('/.netlify/functions/generate-ably-token');
        if (!tokenResponse.ok) {
            throw new Error(`Failed to fetch Ably token: ${tokenResponse.statusText}`);
        }
        const tokenDetails = await tokenResponse.json();
        console.log(tokenDetails)
        // Initialize the Ably client with the fetched token details
        const ably = new Ably.Realtime({
            authUrl: '/.netlify/functions/generate-ably-token'
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
            console.log('New message received:', message.data);

            // Assuming message.data contains the URL or other data you need
            const event = new CustomEvent('new-image', { detail: message.data.downloadUrl });
            document.dispatchEvent(event);
        });
    } catch (err) {
        console.error('Error setting up Ably:', err);
    }
});
