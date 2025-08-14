import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from 'dotenv';

// 先載入 .env 檔案
dotenv.config();

// 然後再讀取環境變數
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "xai/grok-3";

export async function main() {
  // 檢查 token 是否存在
  if (!token) {
    console.error('❌ 錯誤：GITHUB_TOKEN 未設置');
    console.log('請確認 .env 檔案中是否有：GITHUB_TOKEN=your_token_here');
    console.log('目前 token 值:', token);
    return;
  }

  console.log('✅ Token 狀態: 已設置');
  console.log('Token 前10個字元:', token.substring(0, 10) + '...');

  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role:"system", content: "You are a helpful assistant." },
        { role:"user", content: "What is the capital of France?" }
      ],
      model: model
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

