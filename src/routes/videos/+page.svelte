<script lang="ts">
    // 影片資料來源：根據 Google Search 找到的青山宮相關 YouTube 連結
    // 備註：在實際應用中，您應使用 SvelteKit 的 load function 從外部 API 或文件載入這些資料。

    
    const heroVideo = {
        title: '艋舺青山宮：活動紀錄與精華',
        description: '探索艋舺青山宮的精彩活動與文化，觀看完整的記錄與精華影片。',
        youtubeUrl: 'https://www.youtube.com/watch?v=54QXEWf0GVk', // 範例精華影片連結
        placeholderImageId: 1 // 用於佔位圖的 ID
    };

    // 影片類別數據 (已包含您提供的所有資料)
    const videoCategories = [
        {
            title: '校內快閃 ',
            videos: [
                { id: 1, title: '快閃精華', youtubeUrl: 'https://www.youtube.com/shorts/8oGEqxDAPyE', type: '繞境', imageId: 2 },
				{ id: 4, title: '完整記錄', youtubeUrl: 'https://www.youtube.com/watch?v=x6oaH50xSRs', type: '繞境', imageId: 1 },
                // 為了展示多個橫式項目，我在此處加入一些假數據
                { id: 2, title: '快閃活動精選圖片一', youtubeUrl: '#', type: '活動圖集', imageId: 3 },
                { id: 3, title: '快閃活動精選圖片二', youtubeUrl: '#', type: '活動圖集', imageId: 4 },
                
            ],
            // 由於模板只迭代 videos 陣列，img 陣列在此處暫不使用，但保留其結構。
            img:[ 
                { id:2 , title: '圖片', imageUrl: 'https://picsum.photos/400/250?random=2'},

            ]
        },
        {
            title: '校內展覽',
            videos: [
                { id: 5, title: '艋舺青山王祭 - 台灣重大祭典與暗訪介紹 (紀錄片)', youtubeUrl: 'https://m.youtube.com/watch?v=R804Gn4L6Qc', type: '紀錄片', imageId: 6 },
                { id: 6, title: '青山王夜間出巡：暗訪萬華街道緝捕鬼魅', youtubeUrl: 'https://m.youtube.com/watch?v=R804Gn4L6Qc', type: '暗訪', imageId: 7 },
                { id: 7, title: '神將團幕後花絮：傳承與準備過程', youtubeUrl: 'https://www.youtube.com/watch?v=Pp7EchOzBpQ', type: '花絮', imageId: 8 },
                { id: 8, title: '青山王主題曲 MV 女唱版', youtubeUrl: 'https://www.youtube.com/watch?v=54QXEWf0GVk', type: '花絮', imageId: 9 },
            ]
        },
        {
            title: '校外展覽',
            videos: [
                { id: 5, title: '艋舺青山王祭 - 台灣重大祭典與暗訪介紹 (紀錄片)', youtubeUrl: 'https://m.youtube.com/watch?v=R804Gn4L6Qc', type: '紀錄片', imageId: 6 },
                { id: 6, title: '青山王夜間出巡：暗訪萬華街道緝捕鬼魅', youtubeUrl: 'https://m.youtube.com/watch?v=R804Gn4L6Qc', type: '暗訪', imageId: 7 },
                { id: 7, title: '神將團幕後花絮：傳承與準備過程', youtubeUrl: 'https://www.youtube.com/watch?v=Pp7EchOzBpQ', type: '花絮', imageId: 8 },
                { id: 8, title: '青山王主題曲 MV 女唱版', youtubeUrl: 'https://www.youtube.com/watch?v=54QXEWf0GVk', type: '花絮', imageId: 9 },
            ]
        },
        {
            title: '青山季',
            videos: [
                { id: 5, title: '艋舺青山王祭 - 台灣重大祭典與暗訪介紹 (紀錄片)', youtubeUrl: 'https://m.youtube.com/watch?v=R804Gn4L6Qc', type: '紀錄片', imageId: 6 },
                { id: 6, title: '青山王夜間出巡：暗訪萬華街道緝捕鬼魅', youtubeUrl: 'https://m.youtube.com/watch?v=R804Gn4L6Qc', type: '暗訪', imageId: 7 },
                { id: 7, title: '神將團幕後花絮：傳承與準備過程', youtubeUrl: 'https://www.youtube.com/watch?v=Pp7EchOzBpQ', type: '花絮', imageId: 8 },
                { id: 8, title: '青山王主題曲 MV 女唱版', youtubeUrl: 'https://www.youtube.com/watch?v=54QXEWf0GVk', type: '花絮', imageId: 9 },
            ]
        }
    ];

    // 模擬的 Navbar 導航項目
    const navItems = ['首頁', '青山王祭', '暗訪花絮', '宮廟介紹', '最新消息'];

    // Helper constants for class names for clarity and easier adjustments
    // 直式 (Vertical / Tall) 樣式
    const TALL_CARD_CLASSES = 'w-40 md:w-48 h-72';
    const TALL_IMAGE_CLASSES = 'h-48 md:h-56';
    
    // 橫式 (Horizontal / Wide) 樣式
    const WIDE_CARD_CLASSES = 'w-full md:w-56 h-auto'; // h-auto 讓高度適應內容
    const WIDE_IMAGE_CLASSES = 'h-24 md:h-32';
    

    /**
     * 點擊卡片時的處理函數。
     * 將在新視窗中打開 YouTube 連結（如果是影片）。
     */
    function handleVideoClick(youtubeUrl: string) {
        if (youtubeUrl && youtubeUrl !== '#') {
            window.open(youtubeUrl, '_blank');
        } else {
             // 如果是圖片或文章，可以在此處處理導航到文章頁面或開啟 Modal
             console.log("Clicked on static content: " + youtubeUrl);
        }
    }
</script>

<header class="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent p-4 transition duration-300">
    <div class="flex justify-between items-center max-w-[1900px] mx-auto">
        <div class="flex items-center space-x-8">
            <a href="/" class="text-red-600 text-3xl font-bold tracking-widest"></a>
            <nav class="hidden md:flex space-x-6 text-sm">
                {#each navItems as item}
                    <a href="#" class="text-white hover:text-gray-300 transition duration-150 font-medium">
                        {item}
                    </a>
                {/each}
            </nav>
        </div>

        <div class="flex items-center space-x-4">
            <button class="text-white hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <div class="h-8 w-8 bg-red-600 rounded cursor-pointer"></div>
        </div>
    </div>
</header>

<main class="bg-black min-h-screen text-white">
    <section class="relative h-[90vh] sm:h-[95vh] flex items-end">
        <div class="absolute inset-0 z-0">
            <div class="w-full h-full bg-cover bg-center" style="background-image: url('https://picsum.photos/1920/1080?random={heroVideo.placeholderImageId}');"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        </div>

        <div class="relative z-10 p-6 md:p-16 lg:p-24 max-w-4xl 
		">
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-lg">
                {heroVideo.title}
            </h1>
            <p class="text-base md:text-lg mb-6 max-w-lg drop-shadow-md">
                {heroVideo.description}
            </p>
            <div class="flex space-x-4">
                <button 
                    class="flex items-center px-6 py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition"
                    on:click={() => handleVideoClick(heroVideo.youtubeUrl)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                    立即觀看
                </button>
                <a 
                    href="https://www.mjcsg.org.tw/" 
                    target="_blank" 
                    class="flex items-center px-6 py-3 bg-gray-500/70 text-white font-bold rounded hover:bg-gray-500/50 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    宮廟官網
                </a>
            </div>
        </div>
    </section>

    <section class="relative z-20 -mt-20">
        {#each videoCategories as category}
            <div class=" pl-6 md:pl-16 lg:pl-24">
                <h2 class="text-2xl font-semibold mb-4 hover:text-gray-300 transition cursor-pointer">
                    {category.title}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block ml-2 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </h2>

                <div class="flex overflow-x-scroll space-x-4 pb-4 custom-scrollbar">
                    {#each category.videos as item, index}
                        
                        {@const isVerticalVideo = index === 0}
                        
                        <div 
                            class="{isVerticalVideo ? TALL_CARD_CLASSES : WIDE_CARD_CLASSES} flex-shrink-0 cursor-pointer group transform hover:scale-110 transition-all duration-300 ease-out z-10 {isVerticalVideo ? 'hover:z-50' : 'hover:z-30'} rounded-md overflow-hidden shadow-lg bg-[#141414]"
                            on:click={() => handleVideoClick(item.youtubeUrl)}
                            role="button"
                            tabindex="0"
                        >
                            <div class="{isVerticalVideo ? TALL_IMAGE_CLASSES : WIDE_IMAGE_CLASSES} w-full overflow-hidden relative">
                                <img 
                                    src="https://picsum.photos/400/250?random={item.imageId}" 
                                    alt="{item.title} 縮圖"
                                    class="w-full h-full object-cover transition duration-300 group-hover:scale-[1.05]"
                                    loading="lazy"
                                />

                                <div class="absolute inset-0 flex items-center justify-center bg-black/30 {isVerticalVideo ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div class="p-3">
                                <h3 class="text-sm font-semibold truncate text-white">{item.title}</h3>
                                <div class="flex items-center justify-between text-xs mt-1 text-gray-400">
                                    <span class="border border-gray-500/50 px-1 rounded-sm">{item.type}</span>
                                    <span>{isVerticalVideo ? 'YouTube 影片' : '站內圖片'}</span>
                                </div>
                            </div>
                        </div>
                    {/each}

                    <div class="w-6 flex-shrink-0"></div>
                </div>
            </div>
        {/each}
    </section>
</main>

<footer class="bg-black h-10" ></footer>

<style>
    /* 自定義滾動條樣式，使其更隱形，類似 Netflix 效果 */
    .custom-scrollbar {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
    }

    .custom-scrollbar::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }

    /* Hero Section 的高度調整，讓內容避開 fixed header */
    main {
        padding-top: 4rem; 
    }

    /* 增加卡片在 hover 時的 Z-Index，讓它能覆蓋旁邊的卡片並增加陰影 */
    .group:hover {
        z-index: 50;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    }
	body {
    background-color: black;
}
</style>