
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { messages } = await request.json();

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    console.log('GITHUB_TOKEN:', GITHUB_TOKEN ? '已設置' : '未設置'); // 除錯用

    if (!GITHUB_TOKEN) {
      throw error(500, 'GitHub API 金鑰未設置');
    }

    const res = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-5',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...messages
        ],
        stream: false
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('GitHub Models API 錯誤:', {
        status: res.status,
        statusText: res.statusText,
        body: err
      });
      throw error(res.status, err.message || `GitHub Models API 請求失敗 (狀態碼: ${res.status})`);
    }

    const data = await res.json();
    console.log('API 回應:', data); // 除錯用
    return json({ reply: data.choices[0].message });
  } catch (err) {
    console.error('伺服器錯誤:', err);
    throw error(500, err.message || '伺服器錯誤，請稍後重試');
  }
};
