<script lang="ts">
    let result=""; // 儲存抽籤結果
    export let onClick = () => {}; // 允許外部傳入點擊事件
    export let label="draw"; // 允許外部傳入按鈕文字

    function click(){
        onClick(); // 執行傳入的點擊事件
    }
   
    

   
   

   // 籤詩庫
   const lotLibrary = [
    { id: 1, poem: '天道酬勤，事事順遂', explanation: '努力會有回報，凡事多加油！' },
    { id: 2, poem: '雨過天晴，前途光明', explanation: '困難即將過去，未來值得期待！' },
    { id: 3, poem: '風波暫歇，靜待良機', explanation: '目前需要保持耐心，等待轉機。' },
    { id: 4, poem: '山高路遠，行路需謹慎', explanation: '前方有挑戰，小心應對，穩步前進。' },
];

   


</script>

<button class="button pt-20" on:click={click}>
   {label}
</button>




<style>


   button{
    background-color: transparent;
    border: 1px solid #afe6ff;
    box-sizing: border-box;
    color: #00132C;
    font-family: "Avenir Next LT W01 Bold",sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    padding: 16px 23px;
    position: relative;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    
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
