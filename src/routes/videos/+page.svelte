<script lang="ts">
	// 影片資料來源：根據 Google Search 找到的青山宮相關 YouTube 連結
	// 備註：在實際應用中，您應使用 SvelteKit 的 load function 從外部 API 或文件載入這些資料。

	
	const heroVideo = {
		title: '艋舺大拜拜：青山王祭典精華',
		description: '萬華年度盛事，台北三大慶典之一！靈安尊王出巡，暗訪抓鬼，三天兩夜的宮廟文化嘉年華，體驗最在地、最震撼的百年傳統。',
		youtubeUrl: 'https://www.youtube.com/watch?v=54QXEWf0GVk', // 範例精華影片連結
		placeholderImageId: 1 // 用於佔位圖的 ID
	};

	const videoCategories = [
		{
			title: '遶境與祭典 (Main Parade & Festival)',
			videos: [
				{ id: 1, title: '2024 艋舺青山王祭  完整記錄', youtubeUrl: 'https://www.youtube.com/watch?v=Pp7EchOzBpQ', type: '繞境', imageId: 2 },
				{ id: 2, title: '靈安尊王  轎班、神將紀錄', youtubeUrl: 'https://www.youtube.com/watch?v=Pp7EchOzBpQ', type: '紀實', imageId: 3 },
				{ id: 3, title: '台北文化盛事：艋舺青山王祭展開｜新聞報導', youtubeUrl: 'https://www.youtube.com/watch?v=54QXEWf0GVk', type: '新聞', imageId: 4 },
				{ id: 4, title: '艋舺大拜拜：震撼鞭炮與陣頭精選', youtubeUrl: 'https://www.youtube.com/watch?v=Pp7EchOzBpQ', type: '精華', imageId: 5 },
			]
		},
		{
			title: '暗訪儀式與花絮內容 (Night Patrol & Featurettes)',
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

	/**
	 * 點擊卡片或播放按鈕時的處理函數。
	 * 將在新視窗中打開 YouTube 連結。
	 */
	function handleVideoClick(youtubeUrl: string) {
		window.open(youtubeUrl, '_blank');
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

		<div class="relative z-10 p-6 md:p-16 lg:p-24 max-w-4xl mb-12">
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
					href="https://www.qingshantemple.org.tw/" 
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
			<div class="mb-12 pl-6 md:pl-16 lg:pl-24">
				<h2 class="text-2xl font-semibold mb-4 hover:text-gray-300 transition cursor-pointer">
					{category.title}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block ml-2 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</h2>

				<div class="flex overflow-x-scroll space-x-4 pb-4 custom-scrollbar">
					{#each category.videos as video}
						<div 
							class="w-40 md:w-56 flex-shrink-0 cursor-pointer group transform hover:scale-110 transition-all duration-300 ease-out z-10 hover:z-30 rounded-md overflow-hidden shadow-lg bg-[#141414]"
							on:click={() => handleVideoClick(video.youtubeUrl)}
							role="button"
							tabindex="0"
						>
							<div class="h-24 md:h-32 w-full overflow-hidden relative">
								<img 
									src="https://picsum.photos/400/250?random={video.imageId}" 
									alt="{video.title} 縮圖"
									class="w-full h-full object-cover transition duration-300 group-hover:scale-[1.05]"
									loading="lazy"
								/>
								<div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
									</svg>
								</div>
							</div>

							<div class="p-3">
								<h3 class="text-sm font-semibold truncate text-white">{video.title}</h3>
								<div class="flex items-center justify-between text-xs mt-1 text-gray-400">
									<span class="border border-gray-500/50 px-1 rounded-sm">{video.type}</span>
									<span>YouTube 影片</span>
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
</style>