import { Handler } from '@netlify/functions';
import * as Ably from 'ably';

const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Initialize Ably with your API key
    const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
    const channel = ably.channels.get('file-uploads');

    try {
        // Assuming the file name is sent in the POST request body
        const { fileName } = JSON.parse(event.body || '{}');

        // Publish an event to the Ably channel
        await channel.publish('new-file', { fileName });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File upload notification sent' }),
        };
    } catch (error) {
        console.error('Error sending upload notification:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

export { handler };
