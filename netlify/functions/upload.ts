import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // You'll typically handle file uploads client-side, directly to a storage service,
  // then just send the URL or metadata to your function if needed
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "File uploaded successfully" }),
  };
};
