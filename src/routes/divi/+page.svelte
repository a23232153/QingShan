<script lang="ts">
  import { fade } from "svelte/transition";
  import Animation from "../../components/Animation.svelte";
  import onDestroy from 'svelte';

  let firstdraw = false; // 是否第一次擲茭
  let drawstreak = 0; // 擲茭連續次數
  let isVisible = false; // 動畫顯示
  let drawButton = true; // 是否顯示擲杯按鈕
  let drawpoem: { id: number; poem: string; explanation: string } | null = null;
  let canStartStreak = false; // 是否進入連續聖杯階段
  let isSolved = false; // 是否已經解籤
  let showResultText = true; // 是否顯示「擲茭結果」
  let lotsShow = false; // 是否顯示「已抽到籤」
  let result = ""; // 擲茭結果

  function draw() {
    isVisible = false;
    const options = ["聖杯", "笑杯", "無杯"];
    result = options[Math.floor(Math.random() * options.length)];
    isVisible = true;

    setTimeout(() => {
      isVisible = false;
    }, 1500);

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
      { id: 1, poem: "天道酬勤，事事順遂", explanation: "努力會有回報，凡事多加油！" },
      { id: 2, poem: "雨過天晴，前途光明", explanation: "困難即將過去，未來值得期待！" },
      { id: 3, poem: "風波暫歇，靜待良機", explanation: "目前需要保持耐心，等待轉機。" },
      { id: 4, poem: "山高路遠，行路需謹慎", explanation: "前方有挑戰，小心應對，穩步前進。" }
    ];

    drawpoem = lotLibrary[Math.floor(Math.random() * lotLibrary.length)];
    canStartStreak = true;
    drawButton = true;
    lotsShow = true;
  }

  // 🔘 按鈕點擊包裝器
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
    <Animation showAni="https://lottie.host/5c52d7c8-7def-4287-a398-361655323943/iVEVCJUc6y.lottie" />
  </div>
{/if}

<main class="relative  w-full h-screen flex items-center justify-center pt-[7vh] z-0">
  <div
    class="absolute top-1/2 left-1/2 w-[80vw] h-[80vh] bg-white rounded-lg shadow-lg items-center flex justify-center -translate-x-1/2 -translate-y-1/2 pt-16"
  >
    {#if !isVisible}
      <div class="flex flex-col items-center">
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
        <button class="button" on:click={() => handleClick(drawStraws)}>請求籤</button>
        <br />
      {/if}
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
