import { Handler } from '@netlify/functions';
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

    try {
        const { fileName } = JSON.parse(event.body);
        console.log('Environment Variable:', process.env.YOUR_VARIABLE_NAME);
        // Use the fileName from the client to generate the presigned URL
        const presignedUrl = await s3Client.getSignedUrlPromise('putObject', {
            Bucket: process.env.STORAGE_BUCKET_NAME,
            Key: `uploads/${fileName}`,
            Expires: 60 * 60 * 24, // 24 hours expiration
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ url: presignedUrl, fileName }),
        };
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
};

export { handler };
