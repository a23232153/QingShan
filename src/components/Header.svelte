
<script>
    // 如果你有要傳入 props 或處理互動可以放這裡
    
    export let headerColor="color"
     
  </script>
  
  
  
  
  <!-- Header 結構 -->
  <div class="bg-{headerColor} text-white w-full flex justify-between items-center p-4 h-[7vh] fixed top-0 z-6000 font-bakudai-md">
    <h1 class="list-none"> <a href="/"> 首頁 </a> </h1>
  
    <ul class="flex items-center justify-end gap-4 text-gray-300">
      
      <li><a href="/qingshan">探索青山</a></li>
      <li><a href="/interaction">互動體驗</a></li>
      
      <li><a href="/videos">影音專區 </a></li>      
      <li><a href="/team"> 關於我們 </a></li>
      <li><a href="/divi"> 求籤解籤 </a></li>
      
    </ul>
  </div>
  