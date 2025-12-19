<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  let userInput = '';
  let isLoading = false;

  const lotteryDataString = `
[
  // --- 第 1 籤：青山王顯聖 (吉) ---
  {
    id: 1,
    title: "青山王顯聖：逢凶化吉，安然渡過",
    poem: "青山王顯聖\\n青山巍巍鎮艋舺\\n百年庇佑福滿家\\n信心不懼風波起\\n神威護佑定安然",
    explanation: "此籤象徵逢凶化吉、安然渡過。只要心存信念，不因困難退縮，即有貴人與神明護持，終能化險為夷。總結：有信心、有貴人，凡事終能逢凶化吉。"
  },

  // --- 第 2 籤：艋舺風華興 (大吉) ---
  {
    id: 2,
    title: "艋舺風華興：時來運轉，財運亨通",
    poem: "艋舺風華興\\n百業興隆貿易旺\\n千帆過海財祿長\\n時來運轉風帆起\\n富貴榮華世代昌",
    explanation: "此籤核心是運勢興隆、財祿長久。象徵時機成熟，事業旺盛，財運暢通。應順勢而為，努力不懈。總結：時來運轉、風帆正起；財運暢旺、家運昌隆。"
  },

  // --- 第 3 籤：青山齊庇佑 (吉上) ---
  {
    id: 3,
    title: "青山齊庇佑：守正行穩，百事安康",
    poem: "青山齊庇佑\\n青山神力護四方\\n百福齊臨心自昌\\n宜行正道得吉運\\n百事順遂自安康",
    explanation: "此籤象徵青山王神威庇佑，行事當守正道，必得福運。貴人助力顯著，凡事平順，財運穩定。總結：守正行穩，百事安康，福運自來。"
  },

  // --- 第 4 籤：青山王除疫 (中吉) ---
  {
    id: 4,
    title: "青山王除疫：災厄退散，新機將臨",
    poem: "青山王除疫\\n青疫厄橫行亂世驚\\n青山神令護蒼生\\n退災厄，青山王三度顯聖救艋舺\\n正氣長存，祈願安康\\n雷霆法令，妖邪盡滅\\n福佑人間，萬象更新",
    explanation: "此籤意味災難漸退、正氣回歸，能轉危為安、逢凶化吉。事業短期仍不穩，宜靜觀其變。為中吉之象，新機將臨。總結：靜以待變，正以禦邪；風波將止，福運再興。"
  }
  ],
  {
    "id": 5,
    "title": "龍山寺奇傳：貴人相助，時來運轉",
    "poem": "龍山寺外水流長\\n千載香火護艋舺\\n青山護佑迎貴客\\n時來運轉福滿堂",
    "explanation": "此籤象徵時運轉佳，將有貴人來臨。憑藉穩固的基礎與神明護佑，事業財運皆能穩步上升，迎來福氣。總結：貴人助、運轉佳，福氣滿堂。（吉中）"
  },
  // --- 第 6 籤：明燈千安靈 (吉中) ---
  {
    "id": 6,
    "title": "明燈千安靈：掃除陰霾，運勢升起",
    "poem": "前燈萬鼓\\n途火眾聲\\n光輝齊震\\n亮煌心響\\n運添敬遍\\n將福聖城\\n臨祿君身",
    "explanation": "此籤象G徵掃除陰霾、運勢升起。猶如青山王繞境，前有明燈引路，後有萬鼓齊鳴，正氣匯聚，驅散不安。應積極行動，福祿即將降臨。總結：掃陰霾、運漸好，積極行動。（吉中）"
  },
  // --- 第 7 籤：謝范巡陰陽 (吉中) ---
  {
    "id": 7,
    "title": "謝范巡陰陽：撥亂反正，漸入佳境",
    "poem": "黑白雙將步巡行\\n陰陽調和定太平\\n忠義無私除險厄\\n人間福運自天成",
    "explanation": "此籤象徵撥亂反正、秩序重整。七爺八爺巡行，代表公正的力量介入，失衡的狀態將被導正。過去的努力將獲回報，險厄清除。總結：秩序恢復、漸入佳境，福運自來。（吉中）"
  },
  // --- 第 8 籤：尊王收蟾蜍 (吉) ---
  {
    "id": 8,
    "title": "尊王收蟾蜍：化險為夷，正氣壓邪",
    "poem": "瘴氣瀰漫毒遍鄉\\n蟾妖作亂禍蒼生\\n尊王法令鎮邪祟\\n清淨人間福運昌",
    "explanation": "此籤象徵正氣壓邪、化險為夷。雖遇困難或潛藏的阻礙，但有強大的正向力量介入，將鎮壓邪祟、掃除障礙。風波平息後，將迎來清淨與昌盛。總結：先遇難、後呈祥，終能化險為夷。（吉）"
  },
  // --- 第 9 籤：坤乾定鬥械 (吉中) ---
  {
    "id": 9,
    "title": "坤乾定鬥械：以和為貴，萬事皆興",
    "poem": "三邑義勇保鄉土\\n硝煙散盡見光明\\n恩怨放下天地定\\n合和方得萬事興",
    "explanation": "此籤象徵從衝突走向和合。紛擾的階段即將結束，秩序重現。關鍵在於放下恩怨，以和為貴。當時機成熟，選擇和解，萬事自然興旺。總結：放下恩怨、以和為貴，等待時機。（吉中）"
  },
  // --- 第 10 籤：艋舺興衰路 (吉下) ---
  {
    "id": 10,
    "title": "艋舺興衰路：靜待時機，以忍求轉",
    "poem": "商甲雲集水岸邊\\n風雨難測困中行\\n心若不動堅如石\\n待等時機運自生",
    "explanation": "此籤象徵時運起伏，目前處於風雨飄搖的低點。此時應穩住陣腳，心不動搖，以靜制動。保守忍耐，修補關係，等待運勢翻轉的時機到來。總結：穩心忍耐、避險修身，靜待轉機。（吉下）"
  }
`;


  let messages = [
  
    {
      role: 'system',
      content: `
        You are a helpful assistant for the 數位轉型艋舺青山宮 website.用繁體中文來回應使用者. 該網頁開發者為涂凱傑，聯絡信箱為zx23232153zx@gmail.com 
        Answer in Traditional Chinese for Chinese queries. Provide accurate information about 艋舺青山宮 based on the following context:
        - 艋舺青山宮: Built in 1856 in Taipei's Wanhua District, a historic temple dedicated to 靈安尊王, listed as a municipal monument. It is a key center for Quanzhou Hui'an people's faith and hosts the grand "艋舺大拜拜" festival, one of Taipei's three major temple events.
        - 靈安尊王: The main deity, believed to originate from Hui'an, Fujian, with strong protective powers. The annual festival celebrates his birthday, attracting thousands.
        - Historical milestones: Founded in 1854, rebuilt in 1920 with dragon pillars, first festival in 1960, listed as cultural heritage in 1995, digitized in 2020 with online worship and livestreams.
        - 青山季: A major annual festival celebrating 靈安尊王, featuring grand ceremonies and attracting many devotees and tourists.
        以下是艋舺青山宮的籤詩內容與解讀，請參考這些資料來回答與籤詩相關的問題：
        ${lotteryDataString}
      `

      
    }
  ];
  let AIreply = '';
  let isOpen = false;
  let errorMessage = '';
  
  async function sendMessage() {
    if (!userInput.trim()) return;

    messages = [...messages, { role: 'user', content: userInput }];
    userInput = '';
    isLoading = true;

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
      
      errorMessage = '';
      
    } catch (error) {
      console.error('聊天請求失敗:', error);
      errorMessage = '網路錯誤，請稍後重試';
      userInput = '';

    } finally {
      isLoading = false;
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

  
</script>
<main class="font-bakudai-md">

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

          {#if isLoading}
        <div class="text-left mb-2">
          <span class="inline-block p-2 rounded-lg bg-gray-800 text-white opacity-70 italic">
            思考中...
          </span>
        </div>
          {/if}
          
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
</main>

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