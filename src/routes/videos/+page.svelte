<script lang="ts">
    import { onMount } from 'svelte';   

    // --- 資料定義區 ---

    const heroVideo = {
        title: '青山｜畢展影音紀錄與精華',
        description: '用影像保存文化現場，用紀錄回應時間在這裡，我們用鏡頭記錄艋舺的重要文化記憶，包含遶境實況、宮廟專訪、傳統儀式與團隊製作過程。',
        youtubeUrl: 'https://www.youtube.com/watch?v=54QXEWf0GVk',
        placeholderImageId: 1
    };

    
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
        // 改動：新增 'multi-row' 模式 (三行橫向滑動)
        displayMode?: 'slider' | 'multi-row'; 
        items: ContentItem[];
    };

    
    const LAYOUT_CLASSES = {
        // [標準單行滑動] 使用的尺寸
        tall: "w-[160px] h-[280px] sm:w-[200px] sm:h-[350px] md:w-[350px] md:h-[420px]",
        wide: "w-[260px] h-[160px] sm:w-[320px] sm:h-[200px] md:w-[400px] md:h-[240px]",
        square: "w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px]"
    };

    
    const MULTI_ROW_CLASSES = {
        tall: "w-[120px] h-[180px] sm:w-[160px] sm:h-[240px] md:w-[250px] md:h-[300px]",
        
        wide: "w-[200px] h-[120px] sm:w-[240px] sm:h-[140px]", 
        square: "w-[120px] h-[120px] sm:w-[160px] sm:h-[160px]"
    };

    const CARD_BASE = "flex-shrink-0 cursor-pointer group relative rounded-lg overflow-hidden transition-all duration-300 ease-out bg-zinc-900 shadow-lg hover:shadow-2xl hover:scale-[1.02] md:hover:scale-105 hover:z-20 border border-white/5";

    // --- 自動生成 44 張遶境圖片資料 ---
    const celebrateImages: ContentItem[] = Array.from({ length: 44 }, (_, i) => ({
        id: 201 + i,
        title: '',
        url: '#',
        typeLabel: '圖片',
        imageUrl: `/images/celebrate (${i + 1}).jpg`,
        layout: 'tall', // 這裡設定 layout，但會被 MULTI_ROW_CLASSES 覆蓋
        isImageOnly: true
    }));

    const pilImages: ContentItem[] = Array.from({ length: 300 }, (_, i) => ({
        id: 301 + i,
        title: '',
        url: '#',
        typeLabel: '圖片',
        imageUrl: `/images/Pilgrimage (${i + 1}).jpg`,
        layout: 'tall', // 這裡設定 layout，但會被 MULTI_ROW_CLASSES 覆蓋
        isImageOnly: true
    }));


    const contentCategories: Category[] = [
        {
            title: '🎥 校內快閃紀錄',
            subtitle: '精彩瞬間與幕後花絮',
            displayMode: 'slider', // 單行滑動
            items: [
                { id: 1, title: '快閃精華 Shorts', url: 'https://www.youtube.com/shorts/8oGEqxDAPyE', typeLabel: 'Shorts', imageUrl: '/images/快閃3.png', layout: 'tall' },
                { id: 2, title: '完整活動紀錄', url: 'https://www.youtube.com/watch?v=x6oaH50xSRs', typeLabel: 'Vlog', imageUrl: '/images/校內快閃.png', layout: 'tall' },
                { id: 3,  title: '快閃活動精選圖片集',  url: 'https://drive.google.com/drive/folders/1uI1VLql64NWNZBBOaQ9VY9_bsbzuM-rZ',  typeLabel: '活動圖集',  imageUrl: '/images/快閃4.jpg',  layout: 'tall',  isImageOnly: true },
            ]
        },
        {
            title: ' 校內展精華',
            subtitle: '回望過去',
            displayMode: 'slider', // 單行滑動
            items: [
                { id: 101, title: '圖片合集', url: 'https://drive.google.com/drive/folders/1Wi6cqMp36W5WebrQ97YbQjJEUwojHccn', typeLabel: '活動圖集', imageUrl: '/images/exhi-cover.jpg', layout: 'wide', isImageOnly: true },
                { id: 102, title: '精華影片',  typeLabel: '影片', imageUrl: '/images/school-cover.jpg', url:"https://youtube.com/shorts/JPzuTYox5gg?feature=share", layout: 'square', isImageOnly: false },
            ]
        },
        {
            title: '2025 艋舺青山宮 恭迎 北港朝天宮糖郊媽蒞臨艋舺賜福遶境',
            subtitle: ' ',
            displayMode: 'multi-row', 
            items: celebrateImages 
        },
        {
            title: '2025 艋舺青山宮 恭祝靈安尊王聖誕暨建宮170周年 正日繞境',
            subtitle: ' ',
            displayMode: 'multi-row', 
            items: pilImages
        }
    ];

    function handleClick(item: ContentItem) {
        if (item.url && item.url !== '#') {
            window.open(item.url, '_blank');
        } else {
            console.log("View item:", item.title);
        }
    }

    let scrollContainers: HTMLElement[] = []; 

    function scrollContainer(index: number, direction: 'left' | 'right') {
        const container = scrollContainers[index];
        if (container) {
            const scrollAmount = container.clientWidth * 0.75; 
            container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    }

    const MIN_IMAGE_NUMBER = 1;        
    const MAX_IMAGE_NUMBER = 44;
    function getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const randomNumber = getRandomNumber(MIN_IMAGE_NUMBER, MAX_IMAGE_NUMBER);
    const randomImagePath = `/images/celebrate (${randomNumber}).jpg`;
</script>

<main class="bg-[#0a0a0a] min-h-screen text-gray-100 font-sans selection:bg-red-900 selection:text-white pb-20 font-bakudai-md">
    
    <section class="relative h-[85vh] md:h-[95vh] w-full overflow-hidden">
        <div class="absolute inset-0 z-0">
            <div class="w-full h-full bg-cover bg-center transition-transform duration-[10s] hover:scale-105" 
                 style="background-image: url('{randomImagePath}');">
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
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                </button>

                <div 
                    bind:this={scrollContainers[index]}
                    class="
                        {category.displayMode === 'multi-row' 
                            ? 'grid grid-rows-3 grid-flow-col gap-4' 
                            : 'flex space-x-4 md:space-x-6'} 
                        overflow-x-auto pb-8 pr-8 custom-scrollbar scroll-smooth snap-x snap-mandatory items-center"
                >
                    {#each category.items as item}
                        <div 
                            class="
                                {category.displayMode === 'multi-row' 
                                    ? MULTI_ROW_CLASSES[item.layout]  // 3行模式用比較小的尺寸
                                    : LAYOUT_CLASSES[item.layout]     // 單行模式用原本的大尺寸
                                } 
                                {CARD_BASE} snap-start"
                            on:click={() => handleClick(item)}
                            role="button"
                            tabindex="0"
                        >
                            <div class="w-full h-full relative overflow-hidden">
                                <img src={item.imageUrl} alt={item.title} class="w-full h-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" decoding="async"/>
                                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                
                                {#if !item.isImageOnly}
                                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 ">
                                        <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8 text-white ml-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                                        </div>
                                    </div>
                                {/if} 
                                {#if item.isImageOnly}
                                     <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                {/if}

                                <div class="absolute bottom-0 left-0 w-full p-3 md:p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <div class="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                        <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm {item.isImageOnly ? 'bg-blue-600/80 text-white' : 'bg-red-600/80 text-white'}">{item.typeLabel}</span>
                                    </div>
                                    {#if item.title}
                                        <h3 class="text-sm md:text-base font-bold text-white leading-tight drop-shadow-md line-clamp-2">{item.title}</h3>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                    <div class="w-8 md:w-16 flex-shrink-0 h-10"></div>
                </div>

                <button 
                    class="absolute right-0 top-0 bottom-8 z-30 w-12 md:w-16 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 cursor-pointer"
                    on:click={() => scrollContainer(index, 'right')}
                >
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
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