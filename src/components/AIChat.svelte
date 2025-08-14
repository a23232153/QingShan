<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  let userInput = '';
  let messages = [
    {
      role: 'system',
      content: `
        You are a helpful assistant for the 數位轉型艋舺青山宮 website.用繁體中文來回應使用者. Answer in Traditional Chinese for Chinese queries. Provide accurate information about 艋舺青山宮 based on the following context:
        - 艋舺青山宮: Built in 1856 in Taipei's Wanhua District, a historic temple dedicated to 靈安尊王, listed as a municipal monument. It is a key center for Quanzhou Hui'an people's faith and hosts the grand "艋舺大拜拜" festival, one of Taipei's three major temple events.
        - 靈安尊王: The main deity, believed to originate from Hui'an, Fujian, with strong protective powers. The annual festival celebrates his birthday, attracting thousands.
        - Historical milestones: Founded in 1854, rebuilt in 1920 with dragon pillars, first festival in 1960, listed as cultural heritage in 1995, digitized in 2020 with online worship and livestreams.
        - 青山季: A major annual festival celebrating 靈安尊王, featuring grand ceremonies and attracting many devotees and tourists.
      `
    }
  ];
  let AIreply = '';
  let isOpen = false;
  let errorMessage = '';

  async function sendMessage() {
    if (!userInput.trim()) return;

    messages = [...messages, { role: 'user', content: userInput }];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      if (!res.ok) {
        throw new Error(`API 回應錯誤: ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error.message || 'API 處理失敗');
      }

      messages = [...messages, data.reply];
      AIreply = data.reply.content;
      userInput = '';
      errorMessage = '';
    } catch (error) {
      console.error('聊天請求失敗:', error);
      errorMessage = '網路錯誤，請稍後重試';
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    if (!isOpen) {
      userInput = '';
      errorMessage = '';
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  onMount(() => {
    // 提醒檢查 API 金鑰
    console.warn('請確認 /api/chat 的 GITHUB_TOKEN 是否有效，若 API 金鑰變更，請更新 +server.ts 中的環境變數');
  });
</script>

<!-- 右下角觸發按鈕 -->
<button
  on:click={toggleChat}
  class="fixed bottom-4 right-4 z-[1000] bg-yellow-500 text-black p-4 rounded-full shadow-lg hover:bg-yellow-600 transition transform hover:scale-105"
  title="開啟客服機器人"
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
  </svg>
</button>

<!-- 聊天視窗 -->
{#if isOpen}
  <div
    transition:fade={{ duration: 300 }}
    class="fixed bottom-16 right-4 z-[1000] w-[300px] h-[400px] bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden"
  >
    <!-- 標題與關閉按鈕 -->
    <div class="bg-yellow-500 text-black p-3 flex justify-between items-center">
      <h3 class="font-bold">青山宮客服</h3>
      <button on:click={toggleChat} class="text-black hover:text-gray-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- 訊息顯示區 -->
    <div class="flex-1 p-4 overflow-y-auto">
      {#each messages.filter(m => m.role !== 'system') as message}
        <div class="{message.role === 'user' ? 'text-right' : 'text-left'} mb-2">
          <span class="inline-block p-2 rounded-lg {message.role === 'user' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'}">
            {message.content}
          </span>
        </div>
      {/each}
      {#if errorMessage}
        <div class="text-red-500 text-center p-2">{errorMessage}</div>
      {/if}
    </div>

    <!-- 輸入區 -->
    <div class="p-4 bg-gray-800 flex gap-2">
      <input
        bind:value={userInput}
        on:keypress={handleKeyPress}
        placeholder="輸入問題..."
        class="flex-1 p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <button
        on:click={sendMessage}
        class="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50"
        disabled={!userInput.trim()}
      >
        發送
      </button>
    </div>
  </div>
{/if}

<style>
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #1f2937;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #f59e0b;
    border-radius: 3px;
  }
  @media (max-width: 768px) {
    .fixed.bottom-16.right-4 {
      width: 90vw;
      height: 60vh;
      bottom: 10px;
      right: 10px;
    }
  }
</style>