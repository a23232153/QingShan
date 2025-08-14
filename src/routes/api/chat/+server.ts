import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GITHUB_TOKEN } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  let messages: any[] | undefined;
  try {
    const { messages: requestMessages } = await request.json();
    messages = requestMessages;

    console.log('GITHUB_TOKEN:', GITHUB_TOKEN ? '已設置' : '未設置');
    

    if (!GITHUB_TOKEN || GITHUB_TOKEN === '') {
      console.error('錯誤: GITHUB_TOKEN 未設置或為空');
      throw error(500, 'GitHub API 金鑰未設置或為空');
    }

    const res = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: "xai/grok-3",
        messages: [
          { role: 'system', content: 'You are a helpful assistant for 艋舺青山宮, providing accurate information about its history and culture.' },
          ...(messages ?? [])
        ],
        stream: false
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('GitHub Models API 錯誤:', {
        status: res.status,
        statusText: res.statusText,
        body: err,
        requestMessages: messages ?? '未解析',
        model: 'xai/grok-3'
      });
      
      // 處理 Rate Limit 錯誤
      if (res.status === 429) {
        throw error(429, '請求過於頻繁，請稍等 5 秒後再試');
      }
      
      throw error(res.status, err.message || `GitHub Models API 請求失敗 (狀態碼: ${res.status})`);
    }

    const data = await res.json();
    console.log('API 回應:', data);
    return json({ reply: data.choices[0].message });
  } catch (err: any) {
    console.error('伺服器錯誤:', {
      message: err.message,
      stack: err.stack,
      requestMessages: messages ?? '未解析'
    });
    throw error(500, err.message || '伺服器錯誤，請稍後重試');
  }
};