<script lang="ts">
    let result = ""; // Reactive variable to store the draw result
    import Draw from '../../components/Draw.svelte';
    import { fade } from 'svelte/transition';
    import Animation from '../../components/Animation.svelte';

    let firstdraw=false; // 是否第一次擲茭
    let drawstreak=0; // 擲茭連續次數
    let isVisible = false; // 控制動畫頁面顯示的變數
    let drawButton = true; // 控制擲茭按鈕的變數
    let drawpoem: { id: number; poem: string; explanation: string } | null = null; // 隨機籤詩變數
    let canStartStreak = false; // 控制 draw() 是否進入連續聖杯階段
    let isSolved = false; // 解籤完成狀態
    let showResultText= true; // 控制結果顯示的變數
    let lotsShow = false; // 控制籤詩顯示的變數

  
    function draw() {
  isVisible = false;
  const options = ["聖杯", "笑杯", "無杯"];
  result = options[Math.floor(Math.random() * options.length)];
  isVisible = true;

  setTimeout(() => {
    isVisible = false;
  }, 3500);
  

  if (result === "聖杯") {
    showResultText = false; // 隱藏結果文字
    drawstreak++;
    
    
    if (canStartStreak) {
      drawstreak++;
      if (drawstreak >= 1) {
        isSolved = true;
      }
    } else {
      firstdraw = true;
      drawButton = false; // 暫時隱藏按鈕，等線上求籤
    }
  
  if (drawstreak >=2){
    drawButton= false; // 隱藏擲杯按鈕
    lotsShow = false; // 顯示籤詩

  }
 
  
    
  }

  return result;
}

function drawStraws() {
  const lotLibrary = [
    { id: 1, poem: '天道酬勤，事事順遂', explanation: '努力會有回報，凡事多加油！' },
    { id: 2, poem: '雨過天晴，前途光明', explanation: '困難即將過去，未來值得期待！' },
    { id: 3, poem: '風波暫歇，靜待良機', explanation: '目前需要保持耐心，等待轉機。' },
    { id: 4, poem: '山高路遠，行路需謹慎', explanation: '前方有挑戰，小心應對，穩步前進。' },
    
    
  ];

  drawpoem = lotLibrary[Math.floor(Math.random() * lotLibrary.length)];
  canStartStreak = true; // 現在可以進入連續聖杯階段
  drawButton = true;     // 再次顯示「擲杯」按鈕
  lotsShow = true; 
  
 
}


  
 
  </script>


{#if isVisible}
  <div id="animation-杯"
       class="absolute bg-white top-1/2 left-1/2 w-[80vw] h-[80vh] flex items-center justify-center pt-[7vh] z-5 -translate-x-1/2 -translate-y-1/2"
       class:hidden={!isVisible}
       transition:fade>
    <Animation showAni="https://lottie.host/5c52d7c8-7def-4287-a398-361655323943/iVEVCJUc6y.lottie" />
    
    
  </div>
{/if}
  

<main class="relative bg-blue-300 w-full h-screen flex items-center justify-center pt-[7vh] z-0 ">         <!-- 抽籤主頁面-->

    <div class="absolute top-1/2 left-1/2  w-[80vw] h-[80vh] bg-white rounded-lg shadow-lg items-center flex   justify-center -translate-x-1/2 -translate-y-1/2  pt-16">
      
      
      {#if !isVisible}
      <div class="flex flex-col items-center">
        {#if drawButton}
        <Draw label="擲杯" onClick={draw} />
        {/if}

  <!-- 擲茭結果 -->
  {#if showResultText}
    <h2 class:hidden={!result} class="mt-10">擲茭結果為：{result}</h2>
  {/if}

    <div  class:hidden={!lotsShow}>

    {#if drawpoem}
      <h2 class="mt-10">您已抽到第 {drawpoem.id} 籤，您必須擲出聖杯方能解籤</h2>
    {/if}

    </div>
    <!-- 解籤 -->
  {#if isSolved && drawpoem}
  <div class="mt-10 p-4 bg-yellow-100 rounded">
    <h2 class="text-2xl font-bold">第 {drawpoem.id} 籤</h2>
    <p class="mt-2 italic">{drawpoem.poem}</p>
    <p class="mt-1">{drawpoem.explanation}</p>
  </div>
{/if}

</div>

  <!-- 初次聖杯後顯示 -->
  {#if firstdraw && !canStartStreak}
    
    <Draw label="請求籤" onClick={drawStraws} />
    <br>
    
  {/if}

  <!--解籤結果預告-->
  
  

  

  
{/if}

     
  
  
      
      
     
      
    
    </div>  
</main>
  
 
