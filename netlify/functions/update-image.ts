import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const body = JSON.parse(event.body);
  const url = body.url;
  // Process the new image URL as needed

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Image URL updated", url }),
  };
};
