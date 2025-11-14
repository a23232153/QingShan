


<script lang="ts">

  
  import { onMount, onDestroy } from 'svelte';
  import FoldImages from '../../components/FoldImages.svelte';
  

  
 

  
  // 您的資料陣列
  const items = [
    {
      image: "/images/vr3602.png",
      title: "VR360導覽",
      description: "艋舺青山宮-青山會創立推廣艋舺文化，傳承技藝並促進地方繁榮。",
      link: "https://tour.panoee.net/iframe/qingshan"
    },
    {
      image: "/images/青山會神將.jpg",
      title: "青山行傳",
      description: "艋舺青山宮-青山會創立推廣艋舺文化，傳承技藝並促進地方繁榮。",
      link: "https://qingshanics.github.io/qingshanics"
    },
    {
      image: "/images/drawPoem.png",
      title: "求籤解籤",
      description: "艋舺青山宮-青山會創立推廣艋舺文化，傳承技藝並促進地方繁榮。",
      link: "/divi"
    },
  ];
</script>

<main class="w-full h-[100vh]  font-bakudai-md bg-black ">
  
  <div class="border-t border-gray-300 mb-8"></div>

  <section class="flex flex-wrap justify-center gap-6 pt-[20vh]">

    <img 
    src="/images/lantern.jpg" alt="互動體驗" class="w-64 h-auto absolute bottom-10 right-0" 
    />
    
    {#each items as item}
      <div class="w-full sm:w-1/2 md:w-3/10 max-w-sm text-center  ">
        
        <h2 class="
            text-3xl font-extrabold mb-4 
            p-2 rounded-lg 
            bg-white/40                 
            backdrop-blur-md             
                  ">
            {item.title}
        </h2>

        <a href={item.link} 
           class="block relative overflow-hidden rounded-lg shadow-xl group cursor-pointer"
        >
          <img 
            src={item.image} 
            alt={item.title} 
            class="w-full max-h-[30vh] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span class="text-white text-3xl font-bold p-4">
              由此進入
            </span>
          </div>
        </a>
      </div>
    {/each}

  </section>

</main>




  
  


