document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the token details from your Netlify function
        const tokenResponse = await fetch('/.netlify/functions/generate-ably-token');
        if (!tokenResponse.ok) {
            throw new Error(`Failed to fetch Ably token: ${tokenResponse.statusText}`);
        }
        const tokenDetails = await tokenResponse.json();

        // Initialize the Ably client with the fetched token details
        const ably = new Ably.Realtime({
            authUrl: '/.netlify/functions/generate-ably-token'
        });

        const channel = ably.channels.get('file-uploads');

        channel.subscribe('new-file', (message) => {
            // Emit a custom event containing the downloadUrl
            const event = new CustomEvent('new-image', { detail: message.data.downloadUrl });
            document.dispatchEvent(event);
        });
    } catch (err) {
        console.error(err);
    }
});
