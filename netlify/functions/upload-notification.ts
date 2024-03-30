import { Handler } from '@netlify/functions';
import * as Ably from 'ably';
import { S3 } from 'aws-sdk';

const s3Client = new S3({
  accessKeyId: process.env.STORAGE_ACCESS_KEY,
  secretAccessKey: process.env.STORAGE_SECRET_KEY,
  endpoint: process.env.STORAGE_ENDPOINT,
  region: process.env.STORAGE_REGION,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
    const channel = ably.channels.get(process.env.ABLY_CHANNEL_NAME!);

    try {
        const { fileName } = JSON.parse(event.body || '{}');

        
        if (!fileName) {
            return { statusCode: 400, body: 'Error: fileName is required' };
        }
        const filePath = `uploads/${fileName}`; // Construct the full file path

        const presignedUrl = await s3Client.getSignedUrlPromise('getObject', {
            Bucket: process.env.STORAGE_BUCKET_NAME,
            Key: filePath,
            Expires: 60 * 60 * 24, // 24 hours expiration
        });
        console.log('filePath for upload:', filePath);

        await channel.publish('new-file', { filePath, downloadUrl: presignedUrl });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File upload notification sent', filePath, downloadUrl: presignedUrl }),
        };
    } catch (error) {
        console.error('Error in upload notification:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
};

export { handler };
