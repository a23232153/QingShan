<script lang="ts">
    import { onMount } from 'svelte';

    // --- 資料定義區 ---

    const heroVideo = {
        title: '青山｜畢展影音紀錄與精華',
        description: '用影像保存文化現場，用紀錄回應時間在這裡，我們用鏡頭記錄艋舺的重要文化記憶，包含遶境實況、宮廟專訪、傳統儀式與團隊製作過程。',
        youtubeUrl: 'https://www.youtube.com/watch?v=54QXEWf0GVk',
        placeholderImageId: 1
    };

    // 定義內容結構
    type ContentItem = {
        id: number;
        title: string;
        url: string; 
        typeLabel: string; 
        imageUrl: string;
        layout: 'tall' | 'wide' | 'square'; 
        isImageOnly?: boolean; 
    };

    type Category = {
        title: string;
        subtitle?: string;
        items: ContentItem[];
    };

    
    const LAYOUT_CLASSES = {
        
        tall: "w-[160px] h-[280px] sm:w-[200px] sm:h-[350px] md:w-[350px] md:h-[420px]",
       
        wide: "w-[260px] h-[160px] sm:w-[320px] sm:h-[200px] md:w-[400px] md:h-[240px]",
        
        square: "w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px]"
    };

    const CARD_BASE = "flex-shrink-0 cursor-pointer group relative rounded-lg overflow-hidden transition-all duration-300 ease-out bg-zinc-900 shadow-lg hover:shadow-2xl hover:scale-[1.02] md:hover:scale-105 hover:z-20 border border-white/5";

    const contentCategories: Category[] = [
        {
            title: '🎥 校內快閃紀錄',
            subtitle: '精彩瞬間與幕後花絮',
            items: [
                {
                    id: 1,
                    title: '快閃精華 Shorts',
                    url: 'https://www.youtube.com/shorts/8oGEqxDAPyE',
                    typeLabel: 'Shorts',
                    imageUrl: '/images/快閃3.png',
                    layout: 'tall' 
                },
                {
                    id: 2,
                    title: '完整活動紀錄',
                    url: 'https://www.youtube.com/watch?v=x6oaH50xSRs',
                    typeLabel: 'Vlog',
                    imageUrl: '/images/校內快閃.png',
                    layout: 'tall' // 橫式
                },
                
                {
                    id: 3, 
                    title: '快閃活動精選圖片集', 
                    url: 'https://drive.google.com/drive/folders/1uI1VLql64NWNZBBOaQ9VY9_bsbzuM-rZ', 
                    typeLabel: '活動圖集', 
                    imageUrl: '/images/快閃4.jpg', 
                    layout: 'tall', 
                    isImageOnly: true // 標記為圖片模式
                },
                
               
            ]
        },
        {
            title: ' 校內展精華',
            subtitle: '回望過去',
            items: [
                { id: 101, title: '圖片合集', url: 'https://drive.google.com/drive/folders/1Wi6cqMp36W5WebrQ97YbQjJEUwojHccn', 
                typeLabel: '活動圖集', imageUrl: '/images/exhi-cover.jpg', layout: 'wide', isImageOnly: true },

                { id: 102, title: '精華影片', url: '#', typeLabel: '影片', imageUrl: '/images/celebrate (44).jpg',url:"https://youtube.com/shorts/JPzuTYox5gg?feature=share",
                layout: 'square', isImageOnly: false },
               // { id: 103, title: '虔誠信眾', url: '#', typeLabel: '攝影', imageUrl: 'https://picsum.photos/400/400?random=22', layout: 'square', isImageOnly: true },
            ]
        },
        {
            title: '青山王季',
            subtitle: ' ',
            items: [
                { id: 201, title: '特寫', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate1.jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate2.jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (4).jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (13).jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (15).jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (19).jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (21).jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (24).jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (30).jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (33).jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (37).jpg', layout: 'tall', isImageOnly: true },
                { id: 202, title: '', url: '#', typeLabel: '圖片', imageUrl: '/images/celebrate (40).jpg', layout: 'tall', isImageOnly: true },
            ]
        }
    ];

    function handleClick(item: ContentItem) {
        if (item.url && item.url !== '#') {
            window.open(item.url, '_blank');
        } else {
            console.log("View item:", item.title);
        }
    }

    let scrollContainers: HTMLElement[] = []; // 用來存儲每個分類的 DOM 元素

    function scrollContainer(index: number, direction: 'left' | 'right') {
        const container = scrollContainers[index];
        if (container) {
            // 取得容器寬度的一半或是固定數值作為滑動距離
            const scrollAmount = container.clientWidth * 0.75; 
            
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    }
</script>

<main class="bg-[#0a0a0a] min-h-screen text-gray-100 font-sans selection:bg-red-900 selection:text-white pb-20 font-bakudai-md">
    
    <section class="relative h-[85vh] md:h-[95vh] w-full overflow-hidden">
        <div class="absolute inset-0 z-0">31
            <div class="w-full h-full bg-cover bg-center transition-transform duration-[10s] hover:scale-105" 
                 style="background-image: url('/images/celebrate2.jpg');">


            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        <div class="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 z-10 flex flex-col items-start">
            <h1 class="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 leading-tight max-w-4xl drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                {heroVideo.title}
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed drop-shadow-md line-clamp-3 md:line-clamp-none">
                {heroVideo.description}
            </p>
            
        </div>
    </section>

    <div class="relative z-20 space-y-12 md:space-y-20 -mt-10 md:-mt-20 pb-20">
        {#each contentCategories as category, index}
    <section class="pl-4 sm:pl-8 md:pl-16 lg:pl-20 animate-fade-in-up">
        <div class="mb-4 md:mb-6 pr-4 group cursor-pointer inline-block">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 group-hover:text-red-500 transition-colors">
                {category.title}
                <span class="text-xs sm:text-sm font-normal text-gray-500 group-hover:text-red-400/70 transition-colors mt-1 block sm:inline ml-0 sm:ml-2">
                    {category.subtitle}
                </span>
            </h2>
        </div>

        <div class="relative group/slider"> 
            
            <button 
                class="absolute left-0 top-0 bottom-8 z-30 w-12 md:w-16 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 cursor-pointer disabled:hidden"
                on:click={() => scrollContainer(index, 'left')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-12 md:w-12 text-white hover:scale-125 transition-transform drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
            </button>

            <div 
                bind:this={scrollContainers[index]}
                class="flex overflow-x-auto space-x-4 md:space-x-6 pb-8 pr-8 custom-scrollbar scroll-smooth snap-x snap-mandatory items-center"
            >
                {#each category.items as item}
                    <div 
                        class="{LAYOUT_CLASSES[item.layout]} {CARD_BASE} snap-start"
                        on:click={() => handleClick(item)}
                        role="button"
                        tabindex="0"
                    >
                        <div class="w-full h-full relative overflow-hidden">
                            <img src={item.imageUrl} alt={item.title} class="w-full h-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                            
                            {#if !item.isImageOnly}
                                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 ">
                                    <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8 text-white ml-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                                    </div>
                                </div>
                            {/if}
                            {#if item.isImageOnly}
                                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 ]"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                            {/if}

                            <div class="absolute bottom-0 left-0 w-full p-3 md:p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div class="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm {item.isImageOnly ? 'bg-blue-600/80 text-white' : 'bg-red-600/80 text-white'}">{item.typeLabel}</span>
                                </div>
                                <h3 class="text-sm md:text-base font-bold text-white leading-tight drop-shadow-md line-clamp-2">{item.title}</h3>
                            </div>
                        </div>
                    </div>
                {/each}
                <div class="w-8 md:w-16 flex-shrink-0"></div>
            </div>

            <button 
                class="absolute right-0 top-0 bottom-8 z-30 w-12 md:w-16 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 cursor-pointer"
                on:click={() => scrollContainer(index, 'right')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-12 md:w-12 text-white hover:scale-125 transition-transform drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
            </button>

        </div>
    </section>
{/each}
    </div>
</main>

<style>
    .custom-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .custom-scrollbar::-webkit-scrollbar {
        display: none;
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
    }
</style>