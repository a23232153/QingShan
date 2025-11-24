<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import Animation from "../../components/Animation.svelte";
  import { onMount } from "svelte";
  import AiChat from '../../components/AIChat.svelte';
  
  // --- 狀態變數 ---
  let firstdraw = false;    
  let drawstreak = 0;       
  let isVisible = false;    
  let drawButton = true;    
  let drawpoem: { id: number; poem: string; explanation: string } | null = null;
  let lotsShow = false;     
  let isSolved = false;     
  let insSen = true;        

  type CupResult = "聖茭" | "笑茭" | "陰茭";
  const options = ["聖茭", "笑茭", "陰茭"] as const;

  let result: "" | CupResult = ""; 
  let animationSrc = "";

  const animations: Record<CupResult, string> = {
    聖茭: "https://lottie.host/60526843-3173-4b77-a85b-596f5173bcc3/Hw2Otbs0Dr.lottie",
    笑茭: "https://lottie.host/326c0933-792d-434a-a91e-f04eb25c96c2/1doaoqO2eQ.lottie",
    陰茭: "https://lottie.host/9f5dc1fd-dda9-4aef-85f7-35e91874b24f/37F9JdRra5.lottie",
  };

  onMount(() => {
    Object.values(animations).forEach((url) => {
      fetch(url).then(() => {}).catch((err) => console.error(` 載入動畫失敗：${url}`, err));
    });
  });

  function draw() {
    const newResult = options[Math.floor(Math.random() * options.length)];
    result = ""; 
    insSen = false; 
    animationSrc = animations[newResult];
    isVisible = true;

    setTimeout(() => {
      result = newResult;
      if (result === "聖茭") {
        drawstreak++;
        if (lotsShow) { 
            isSolved = true;
            drawButton = false; 
        } else {
            firstdraw = true; 
            drawButton = false; 
        }
      } else {
        drawstreak = 0; 
        if (lotsShow) {
            lotsShow = false;   
            drawButton = false; 
        } else {
            drawButton = true; 
        }
      }
      isVisible = false;
    }, 4500);

    return newResult;
  }

  function drawStraws() {
    const lotLibrary = [
      { id: 1, poem: "天道酬勤，事事順遂", explanation: `青山王神靈顯化，威靈鎮守著艋舺。祂長久以來庇佑眾生，使人家家戶戶平安、幸福。\n\n只要心中有信念，不因困難或變故而退縮，神明的庇護自會讓一切安穩平順。這支籤代表「逢凶化吉、安然渡過」。`},
      { id: 2, poem: "雨過天晴，前途光明", explanation: `艋舺昔日商業繁盛，如今運勢再起，象徵時機來臨、萬事興旺。\n\n各行各業都蓬勃發展，交易順利、財源滾滾，如滿海船隻揚帆遠航，收穫豐厚。命運正轉好，將進入順遂與富足階段。` },
      { id: 3, poem: "風波暫歇，靜待良機", explanation: `此籤象徵青山王神威庇佑，行事當守正道，必得福運。\n\n只要心念端正、腳步穩健，即使遇阻也能安然無恙。貴人助力顯著，凡事平順，財運穩定，健康長安。` },
      { id: 4, poem: "山高路遠，行路需謹慎", explanation: `只要守正道、懷善念，不被恐懼與混亂左右，終能轉危為安。\n\n凡事雖經波折，但有貴人與神明庇佑，能逢凶化吉。此籤為中吉之象，意味災厄退散，新機將臨。` },
      { id: 5, poem: "花開富貴，福祿雙全", explanation: `它首先描繪了一個源遠流長、香火鼎盛的安定景象。這代表您過去的努力與積累，是您穩固的根基。\n\n您的「時運」正在轉動，一份新的契機即將到來。感情上若有誤會，能逐漸化解，重新恢復平靜。` },
      { id: 6, poem: "雲開見月，萬象更新", explanation: `畫面彷彿是一場盛大的遶境，有明亮的燈火引路。這代表您的周圍正有一股強大的、積極的能量在匯聚。\n\n這股能量將推動您的事業穩步上升，身心也將迎來安康泰順。` },
      { id: 7, poem: "一帆風順，貴人相助", explanation: `籤詩的主角是七爺八爺。祂們的「巡行」，象徵著一股公正、嚴明的力量，正在檢視您生命中的各種境遇。\n\n那些讓您感到不安的事物，都將被導正。您的命運正如籤文所言，正趨向穩定。` },
      { id: 8, poem: "枯木逢春，生機勃勃", explanation: `這是一支化險為夷、正氣壓邪的籤。籤詩中的「蟾妖」象徵著您目前遇到的阻礙。\n\n然而，關鍵在於「尊王」的出手。這股力量將會果斷地鎮壓住那些混亂。當邪祟被降伏後，一切將回歸「清淨」。` },
      { id: 9, poem: "柳暗花明，絕處逢生", explanation: `籤詩的意象是「硝煙散盡」。它描繪了一幅在經歷了紛擾之後，一切終於塵埃落定的景象。\n\n這支籤的關鍵提醒在於「放下恩怨」。只有當您主動選擇和解，才能迎來真正的「天地定」。` },
      { id: 10, poem: "心想事成，福壽康寧", explanation: `這支籤的意象，是時運的起伏。您目前正處於一個「風雨難測」的階段。\n\n籤詩給予的核心指引是「心若不動堅如石」。面對外在的風雨，您的內心必須保持絕對的穩定，守好自己的本分。` },
    ];

    drawpoem = lotLibrary[Math.floor(Math.random() * lotLibrary.length)]; 
    result = ""; 
    lotsShow = true;      
    drawButton = true; 
  }

  function handleClick(fn: Function) {
    fn();
  }
</script>

{#if isVisible}
  <div
    id="animation-茭"
    class="absolute bg-black/60 backdrop-blur-sm top-0 left-0 w-full h-full flex items-center justify-center z-[1000]"
    transition:fade
  >
    <div class="w-64 h-64 md:w-[300px] md:h-[300px] bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
        <Animation showAni={animationSrc} />
    </div>
  </div>
{/if}

<main class="relative w-full h-[100vh] flex items-center justify-center pt-[7vh] z-0 font-bakudai-md 
  bg-[url('/images/sketchTemple.png')] bg-cover bg-center 
  text-gray-800 overflow-hidden
">
  
  <div class="absolute inset-0 bg-stone-100/20 backdrop-blur-[2px]"></div>

  <div class="absolute top-1/2 left-1/2 w-[95vw] md:w-[90vw] max-w-4xl h-[85vh] md:h-[80vh] 
    bg-white/60 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl 
    border border-white/40 flex flex-col items-center 
    -translate-x-1/2 -translate-y-1/2 py-6 md:py-10 px-2 md:px-4 transition-all duration-500"
  >

    {#if insSen}
        <div class="absolute inset-x-0 bottom-2 md:bottom-2 z-50 px-4 flex justify-center" transition:fly="{{ y: 20, duration: 500 }}">
            <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-yellow-500/30 w-full md:max-w-2xl p-4 md:p-6 text-center">
                <h1 class="text-sm md:text-lg font-medium text-gray-800 leading-relaxed tracking-wide">
                    <span class="text-red-700 font-bold block mb-1 md:mb-2 text-lg md:text-2xl">🏮 歡迎蒞臨艋舺青山宮</span>
                    請誠心祈求，透過擲茭與求籤，尋找神明的指引與生活中的智慧。
                </h1>
            </div>
        </div>
    {/if}
    
    <div class="flex flex-col items-center w-full h-full overflow-y-auto scrollbar-hide px-2">

      {#if !isSolved}
        <div class="flex flex-col items-center justify-center w-full flex-grow space-y-4 md:space-y-8">
            
          <div class="w-full max-w-lg text-center min-h-[100px] md:min-h-[120px] flex flex-col justify-center items-center">
            
            {#if insSen}
               <div class="animate-pulse text-stone-500 tracking-widest text-lg md:text-xl">
                  請 點 擊 下 方 按 鈕 開 始
               </div>
            
            {:else if result !== ''} 
               <div class="mb-2 md:mb-4">
                  <span class="text-gray-500 text-xs md:text-sm block mb-1">擲茭結果</span>
                  <span class="text-3xl md:text-4xl font-bold drop-shadow-sm" 
                        class:text-red-600={result === '聖茭'} 
                        class:text-stone-600={result !== '聖茭'}>
                    {result}
                  </span>
               </div>
            {/if}

            {#if !insSen}
                {#if firstdraw && !lotsShow && result !== '' && result !== '聖茭' && drawpoem}
                     <div class="bg-red-50 border-l-4 border-red-600 p-3 md:p-4 rounded-r-lg shadow-md w-full flex flex-col items-center" transition:fly="{{ y: 10 }}">
                        <h2 class="font-bold text-lg md:text-xl text-red-800 mb-1 flex items-center">
                             <span class="text-lg mr-2"></span> 此籤未獲應允
                        </h2>
                        <p class="text-red-700 text-xs md:text-sm font-medium text-left">
                            第 <span class="font-bold underline">{drawpoem.id}</span> 籤非神意，請重新求取。
                        </p>
                     </div>

                {:else if !firstdraw && result !== '' && result !== '聖茭'}
                     <h2 class="text-lg md:text-xl text-stone-600 font-medium">
                        心誠則靈，請<span class="text-red-600 font-bold mx-1">重新擲茭</span>直至聖茭。
                     </h2>

                {:else if firstdraw && !lotsShow && (result === '聖茭' || result === '')}
                     <div class="text-center">
                        <div class="text-amber-500 font-bold text-xl md:text-2xl mb-2">獲得允茭</div>
                        <p class="text-stone-600 text-sm md:text-base">請點擊按鈕，抽取您的靈籤。</p>
                     </div>

                {:else if lotsShow}
                     <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 md:p-6 shadow-md w-full relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 text-8xl md:text-9xl text-yellow-100/50 font-serif select-none pointer-events-none">籤</div>
                        
                        <h2 class="text-stone-800 font-medium mb-1 md:mb-2 text-sm md:text-base">您目前求得</h2>
                        <div class="text-3xl md:text-4xl font-bold text-yellow-800 mb-2 md:mb-3 tracking-widest">第 {drawpoem?.id} 籤</div>
                        <div class="h-px w-full bg-yellow-200 my-2"></div>
                        <div class="text-red-600 font-bold animate-bounce mt-2 text-sm md:text-base">
                            ⬇ 必須擲出聖茭，方可解籤 ⬇
                        </div>
                     </div>
                {/if}
            {/if}
          </div>

          <div class="pt-2 md:pt-4">
              {#if drawButton}
                  <button 
                    class="relative overflow-hidden bg-red-500  text-white font-bold text-lg md:text-xl py-3 px-8 md:py-4 md:px-12 rounded-full shadow-lg
                     shadow-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/40 border-2 border-gray-400 group" 
                    on:click={() => handleClick(draw)}
                  >
                      <span class="relative z-10 group-hover:scale-110 transition-transform duration-300 inline-block">
                             誠心擲茭
                      </span>
                      <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
              
              {:else if firstdraw && !lotsShow}
                  <button 
                    class="relative overflow-hidden bg-yellow-500 text-white font-bold text-lg md:text-xl py-3 px-8 md:py-4 md:px-12 rounded-full shadow-lg shadow-yellow-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/40 border-2 border-yellow-400 group" 
                    on:click={() => handleClick(drawStraws)}
                  >
                      <span class="relative z-10 group-hover:scale-110 transition-transform duration-300 inline-block">
                          📜 請求靈籤
                      </span>
                  </button>
              {/if}
            </div>

        </div>
      {/if}

      {#if isSolved && drawpoem}
        <div class="w-full animate-fade-in flex flex-col items-center pb-8">
            
            <div class="text-center mb-4 md:mb-8">
                <h2 class="text-amber-300 font-bold text-2xl md:text-3xl mb-1"> 聖茭確認！</h2>
                <p class="text-stone-500 text-xs md:text-2xl">神明已賜下指引</p>
            </div>

            <div class="flex flex-col md:flex-row items-start w-full max-w-4xl gap-6 md:gap-8"> 
                
                <div class="flex-shrink-0 w-full md:w-1/3 flex justify-center"> 
                    <div class="relative p-2 bg-white shadow-lg rounded-lg w-1/3 md:w-3/7 rotate-1 hover:rotate-0 transition-transform duration-500">
                        <img 
                            src="/images/fortune_poem{drawpoem.id}.png" 
                            alt="籤詩圖片" 
                            class="w-full h-auto rounded border border-stone-100" 
                            loading="lazy" 
                        />
                    </div>
                </div>

                <div class="flex-grow w-full md:w-2/3 bg-[#FFFDF5] rounded-xl shadow-xl border-t-4 border-yellow-600 p-6 md:p-8 relative"> 
                    <div class="hidden md:block absolute top-4 right-6 opacity-10 pointer-events-none">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" class="text-red-800"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                    </div>

                    <h2 class="text-2xl md:text-3xl font-bold text-stone-800 pb-4 mb-4 md:mb-6 border-b-2 border-stone-200 flex items-center">
                        <span class="bg-red-700 text-white text-xs md:text-sm px-2 py-1 rounded mr-3 font-normal tracking-wider">靈籤</span>
                        第 {drawpoem.id} 籤
                    </h2>
                    
                    <div>
                        <h3 class="text-base md:text-lg font-bold text-yellow-700 mb-2 md:mb-4">【 聖意解說 】</h3>
                        <p class="text-base md:text-lg font-medium text-stone-700 leading-loose whitespace-pre-line text-justify tracking-wide">
                            {drawpoem.explanation}
                        </p>
                    </div>
                    
                    <div class="mt-6 md:mt-8 pt-4 border-t border-dashed border-stone-300 text-center">
                        
                         <p class="text-xs md:text-xl text-black mt-2">
                            如想具體了解籤詩含義，歡迎使用下方 AI 聊天功能進行詢問。
                         </p>
                         <p class="text-xs md:text-sm text-stone-400">
                            艋舺青山宮 靈安尊王 庇佑平安 <br/>
                           
                        </p>
                    </div>
                </div>
            </div>
        </div>
      {/if}
    </div>
  </div>
</main>

<AiChat />

<style>
/* 自定義捲軸隱藏 */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* 淡入動畫 */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
}

/* 緩慢彈跳 */
@keyframes bounceSlow {
    0%, 100% { transform: translateY(-5%); }
    50% { transform: translateY(5%); }
}
.animate-bounce-slow {
    animation: bounceSlow 3s infinite ease-in-out;
}
</style>