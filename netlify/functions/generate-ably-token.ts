import { Handler } from '@netlify/functions';
import Ably from 'ably';

const handler: Handler = async (event) => {
    const ablyRestClient = new Ably.Rest({ key: process.env.ABLY_API_KEY });

    try {
        const tokenDetails = await ablyRestClient.auth.createTokenRequest({ clientId: 'slideshow-client' });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Content-Type": "application/json"  // Ensure this is set correctly
            },
            body: JSON.stringify(tokenDetails),
        };
    } catch (error) {
        console.error('Error generating Ably token:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Content-Type": "application/json"  // Ensure this is set correctly
            },
            body: JSON.stringify({ error: 'Failed to generate Ably token' }),
        };
    }
};

export { handler };
