<script lang="ts">
  import { fade } from "svelte/transition";
  import Animation from "../../components/Animation.svelte";
  import { DotLottie } from '@lottiefiles/dotlottie-web';
  import { onMount } from "svelte";
  

  let firstdraw = false; // 是否第一次擲茭
  let drawstreak = 0; // 擲茭連續次數
  let isVisible = false; // 動畫顯示

  let drawButton = true; // 是否顯示擲杯按鈕
  let drawpoem: { id: number; poem: string; explanation: string } | null = null;
  let canStartStreak = false; // 是否進入連續聖杯階段
  let isSolved = false; // 是否已經解籤
  let showResultText = true; // 是否顯示「擲茭結果」
  let lotsShow = false; // 是否顯示「已抽到籤」

  type CupResult = "聖杯" | "笑杯" | "陰杯";
  const options = ["聖杯", "笑杯", "陰杯"] as const;

  let result: "" | CupResult = "";
  let animationSrc = "";

  const animations: Record<CupResult, string> = {
    聖杯: "https://lottie.host/60526843-3173-4b77-a85b-596f5173bcc3/Hw2Otbs0Dr.lottie",
    笑杯: "https://lottie.host/326c0933-792d-434a-a91e-f04eb25c96c2/1doaoqO2eQ.lottie",
    陰杯: "https://lottie.host/9f5dc1fd-dda9-4aef-85f7-35e91874b24f/37F9JdRra5.lottie",
  };
  

  onMount(() => {
    
    Object.values(animations).forEach((url) => {
      fetch(url).then(() => {
        
      }).catch((err) => console.error(` 載入動畫失敗：${url}`, err));
    });
  });


  function draw() {
    isVisible = false;
    result = options[Math.floor(Math.random() * options.length)];
    isVisible = true;

    animationSrc = animations[result];

    setTimeout(() => {
      isVisible = false;
    }, 4500);

    if (result === "聖杯") {
      showResultText = false;
      drawstreak++;

      if (canStartStreak) {
        if (drawstreak >= 1) {
          isSolved = true;
        }
      } else {
        firstdraw = true;
        drawButton = false;
      }

      if (drawstreak >= 2) {
        drawButton = false;
        lotsShow = false;
      }
    }

    return result;
  }

  function drawStraws() {
    const lotLibrary = [
      { id: 1, poem: "天道酬勤，事事順遂", explanation: `青山王神靈顯化，威靈鎮守著艋舺,祂長久以來庇佑眾生，使人家家戶戶平安、幸福。

      只要心中有信念，不因困難或變故而退縮，神明的庇護自會讓一切安穩平順。

      這支籤代表「逢凶化吉、安然渡過」的意思。雖然過程中可能會遇到波折或挑戰，但有貴人與神明護持，只要你心態堅定、不退縮，最終都能化險為夷、平安成功`
      },

      { id: 2, poem: "雨過天晴，前途光明", explanation: `艋舺昔日商業繁盛，如今運勢再起，象徵時機來臨、萬事興旺。
        各行各業都蓬勃發展，交易順利、財源滾滾，
        如滿海船隻揚帆遠航，收穫豐厚、一路順風。

        命運正轉好，風勢助行，將進入順遂與富足階段。
        不僅自己事業有成，也能使家族榮耀綿延。

        象徵運勢興隆、財祿長久，時機成熟、事業旺盛、財運暢通。
        只要順勢而為，努力不懈，成果會十分豐碩。` },

      { id: 3, poem: "風波暫歇，靜待良機", explanation: `此籤象徵青山王神威庇佑，行事當守正道，必得福運。
        只要心念端正、腳步穩健，即使遇阻也能安然無恙。
        貴人助力顯著，凡事平順，財運穩定，健康長安。

        此乃吉祥安康之象，宜堅持正道，自能獲福延年。
        守正行穩，百事安康，福運自來。` },

      { id: 4, poem: "山高路遠，行路需謹慎", explanation: `只要守正道、懷善念，不被恐懼與混亂左右，終能轉危為安。
        凡事雖經波折，但有貴人與神明庇佑，能逢凶化吉。
        工作或事業方面，短期仍有不穩，宜靜觀其變，不宜躁進。

        感情上若有誤會，能逐漸化解，重新恢復平靜。
        財運平穩，健康漸佳，心境清明則萬事順。

        此籤為中吉之象，意味災厄退散，新機將臨。
        靜以待變，正以禦邪；風波將止，福運再興。` }
    ];

    drawpoem = lotLibrary[Math.floor(Math.random() * lotLibrary.length)];
    canStartStreak = true;
    drawButton = true;
    lotsShow = true;
  }

  //  按鈕點擊包裝器
  function handleClick(fn: Function) {
    fn();
  }
</script>

{#if isVisible}
  <div
    id="animation-杯"
    class="absolute bg-white top-1/2 left-1/2 w-[80vw] h-[80vh] flex items-center justify-center pt-[7vh] z-5 -translate-x-1/2 -translate-y-1/2"
    transition:fade
  >
    <Animation showAni={animationSrc} />
  </div>
{/if}

<main class="relative  w-full h-screen flex items-center justify-center pt-[7vh] z-0 font-bakudai-md">
  <div
    class="absolute top-1/2 left-1/2 w-[80vw] h-[80vh] bg-white rounded-lg shadow-lg items-center flex justify-center -translate-x-1/2 -translate-y-1/2 pt-16"
  >
    {#if !isVisible}
      <div class="flex flex-col items-center w-full">
        {#if drawButton}
          <button class="button" on:click={() => handleClick(draw)}>擲杯</button>
        {/if}

        <!-- 擲茭結果 -->
        {#if showResultText}
          <h2 class:hidden={!result} class="mt-10">擲茭結果為：{result}</h2>
        {/if}

        <!-- 籤詩提示 -->
        <div class:hidden={!lotsShow}>
          {#if drawpoem}
            <h2 class="mt-10">您已抽到第 {drawpoem.id} 籤，您必須擲出聖杯方能解籤</h2>
          {/if}
        </div>

          <!-- 初次聖杯後顯示 -->
        {#if firstdraw && !canStartStreak}
          <button class="button" on:click={() => handleClick(drawStraws)}>請求籤</button>
          <br />
        {/if}

        <!-- 解籤 -->
        {#if isSolved && drawpoem}
          <div class="flex justify-center w-full p-6"> 
            
            <div class="flex flex-row items-start max-w-4xl space-x-6"> 
              
              <div class="flex-shrink-0 "> 
                <img 
                  src="/images/fortune_poem{drawpoem.id}.png" 
                  alt="籤詩圖片" 
                  class="w-32 h-auto pb-30 rounded-lg shadow-xl " 
                  loading="lazy" 
                />
              </div>

              <div class="flex-grow pt-6 mt-10 bg-yellow-50 rounded-xl shadow-lg border border-yellow-200"> 
                <h2 class="text-3xl font-bold text-yellow-800  pb-3 mb-4">
                  第 {drawpoem.id} 籤
                </h2>
                
               
                
                <div>
                  <h3 class="text-xl font-semibold text-gray-700 mt-6 mb-2 border-t pt-4">解說：</h3>
                  <p class="text-lg font-sans text-gray-600 leading-loose">
                    {drawpoem.explanation}
                  </p>
                </div>
              </div>

            </div>
          </div>
        {/if}
      </div>

      
    {/if}
  </div>
</main>

<style>
  .button {
    background-color: transparent;
    border: 1px solid #afe6ff;
    box-sizing: border-box;
    color: #00132C;
    font-family: "Avenir Next LT W01 Bold", sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    padding: 16px 23px;
    position: relative;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    margin: 10px;
  }

  .button:hover,
  .button:active {
    outline: 0;
  }

  .button:hover {
    background-color: transparent;
    cursor: pointer;
  }

  .button:before {
    background-color: #D5EDF6;
    content: "";
    height: calc(100% + 3px);
    position: absolute;
    right: -7px;
    top: -9px;
    transition: background-color 300ms ease-in;
    width: 100%;
    z-index: -1;
  }

  .button:hover:before {
    background-color: rgb(197, 246, 246);
  }

  @media (min-width: 768px) {
    .button {
      padding: 16px 32px;
    }
  }
</style>
