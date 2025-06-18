import type { RequestHandler } from '@sveltejs/kit';
import 'dotenv/config';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

const endpoint = 'https://models.github.ai/inference';
const model = 'openai/gpt-4.1';
const token = process.env.GITHUB_TOKEN;
if (!token) {
  throw new Error('GITHUB_TOKEN environment variable is not set');
}

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json();

  const client = ModelClient(endpoint, new AzureKeyCredential(token));

  const res = await client.path('/chat/completions').post({
    body: {
      messages,
      temperature: 1.0,
      top_p: 1.0,
      model
    }
  });

  if (isUnexpected(res)) {
    return new Response(JSON.stringify({ error: res.body.error }), {
      status: 500
    });
  }

  const reply = res.body.choices[0].message;
  return new Response(JSON.stringify({ reply }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
