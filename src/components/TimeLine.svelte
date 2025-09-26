<script>
    //@ts-nocheck
    import { onMount } from "svelte";

    let items = [
        {
            year: "1854 緣起",
            month: "",
            text: "艋舺在1854年（咸豐4年）發生瘟疫，惠安縣漁民，於是特地將惠安青山宮的鄉土守護神——青山靈安尊王神像分靈至艋舺，在舊街（今西園路）鬧區處暫立小祠奉祀，想藉此弭平疫情。隨後由於祂靈驗的神蹟廣為流傳，使得善信日增。",
            img: "/images/緣起.jpg"
        },
        {
            year: "1856 重建",
            month: "",
            text: "由於祂靈驗的神蹟廣為流傳，使得善信日增。1856年建築新廟",
            img: "/images/黑白照2.jpg"
        },
        {
            year:"1904",
            text:"鼠疫過後，地方為祈求平安，延續祭典並發展出「迎請青山王遶境」，逐漸形成萬華的重要廟會習俗",
            img: "/images/黑白青山王祭.jpg"
            
        },
        {
            year:"2007",
            text:"首次選出外籍爐主（法國籍），顯示青山宮信仰的國際化與多元性。",
            img: "/images/news.jpg"
        },
        
        {
            year: "2013 祝融之災",
            month: "",
            text: "晚間因電線走火，致使三川殿和左右過水廊的天花、鑿花、雕作等木構件受表層損傷，靈安尊王二祖軟身神像衣袍和鄰近十餘尊神將遭波及",
            img: "/images/火災.jpg"
        },
        {
            year:"2020" ,
            month:"",
            text: "因新冠疫情多數宗教活動停辦，但於青山王祭典前疫情好轉解封，因此決定擴大舉辦，象徵祈安與振興。",
            img: "/images/青山王祭.jpg"
        },
        {
            year:"2021" ,
            month:"",
            text: "臺北燈節將艋舺青山宮納入展區，展現「無圍牆博物館」特色，吸引國內外參觀者",
            img: "/images/燈節.png"
        },
         {
            year:"2023" ,
            month:"",
            text: "受邀前往日本表演，展現青山宮祭典文化的國際交流",
            img: "/images/日本.png"
        },
        {
            year:"2024" ,
            month:"",
            text: "重現百年傳統「詩意閣」，於萬華再度登場，讓青山祭典的文化美學重新展現於世人眼前",
            img: "/images/藝閣.png"
        },
         
    ];

    let currentIndex = 0;
    let track;
    let itemWidth = 0;
    let slidesToShow = 2; // 預設顯示 2 個項目
    let isDragging = false;
    let startX = 0;
    let startTime = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function updateCarousel(animate = true) {
        const offset = -(itemWidth * currentIndex);
        track.style.transition = animate
            ? "transform 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)"
            : "none";
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
    }

    function next() {
        if (currentIndex < items.length - slidesToShow) {
            currentIndex++;
            updateCarousel();
        }
    }

    function prev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    function getPositionX(e) {
        return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    }

    function startDrag(e) {
        isDragging = true;
        startX = getPositionX(e);
        startTime = Date.now();
        prevTranslate = -(currentIndex * itemWidth);
        track.style.transition = "none";
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        const currentX = getPositionX(e);
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;

        // 限制拖曳範圍
        const maxTranslate = 0;
        const minTranslate = -(itemWidth * (items.length - slidesToShow));
        currentTranslate = Math.min(maxTranslate, Math.max(minTranslate, currentTranslate));

        track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
        e.preventDefault();
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;

        const movedBy = currentTranslate - prevTranslate;
        const elapsed = Date.now() - startTime;
        const velocity = movedBy / (elapsed || 1);

        if (movedBy < -itemWidth / 4 || velocity < -0.2) {
            if (currentIndex < items.length - slidesToShow) currentIndex++;
        } else if (movedBy > itemWidth / 4 || velocity > 0.2) {
            if (currentIndex > 0) currentIndex--;
        }

        updateCarousel(true);
    }

    function updateSlidesToShow() {
        const width = window.innerWidth;
        slidesToShow = width <= 800 ? 1 : 2;
        currentIndex = Math.min(currentIndex, items.length - slidesToShow);
        updateCarousel(false);
    }

    onMount(() => {
        const updateLayout = () => {
            itemWidth = track.querySelector(".timeline-item").getBoundingClientRect().width;
            updateSlidesToShow();
        };
        updateLayout();
        window.addEventListener("resize", updateLayout);
        return () => window.removeEventListener("resize", updateLayout);
    });
</script>

<div class="timeline-carousel font-bakudai-lg">
    <h1>歷史時間軸</h1>

    <button class="nav prev" on:click={prev} aria-label="前一個時間軸項目">‹</button>
    <div
        class="carousel-track"
        bind:this={track}
        on:mousedown={startDrag}
        on:mousemove={drag}
        on:mouseup={endDrag}
        on:mouseleave={() => isDragging && endDrag()}
        on:touchstart={startDrag}
        on:touchmove={drag}
        on:touchend={endDrag}
    >
        {#each items as item}
            <div class="timeline-item">
                <div class="image bg-no-repeat" style="background-image: url({item.img});"></div>
                {#if item.year}
                    <span class="year">{item.year}</span>
                {:else}
                    <span class="year placeholder">未知年份</span>
                {/if}
                <span class="month text-3xl">{item.month}</span>
                <p class="text-6xl">{item.text}</p>
                <p class="read-more">回顧過往</p>
            </div>
        {/each}
    </div>
    <button class="nav next" on:click={next} aria-label="下一個時間軸項目">›</button>
</div>

<style>
    .timeline-carousel {
        position: relative;
        overflow: hidden;
        padding: 60px 40px;
        background-color: #1d1d1e;
        
    }
    .timeline-item .image {
    opacity: 1 !important;
}

    h1 {
        font-size: 46px;
        font-weight: 900;
        text-align: center;
        margin-bottom: 40px;
        color: #ffffff;
    }

    .carousel-track {
        display: flex;
        transition: transform 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53);
        will-change: transform;
        cursor: grab;
    }

    .carousel-track:active {
        cursor: grabbing;
    }

    .timeline-item {
        flex: 0 0 calc(100% / var(--slides-to-show, 2)); /* 使用 CSS 變數作為後備 */
        padding: 0 10px;
        box-sizing: border-box;
        opacity: 1 !important; 
    }

    .timeline-item .image {
        height: 200px;
        
        border-radius: 10px;
        background-size: contain;
        background-position: center;
        opacity: 0.85;
        margin-bottom: 15px;
        transition: opacity 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }

    

    .year {
        font-size: 36px;
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
        color: #ffffff;
    }

    .year.placeholder {
        color: rgba(255, 255, 255, 0.6);
    }

    .month {
        font-size: 12px;
        color: #b38c52;
        font-weight: bold;
        margin-bottom: 10px;
        display: block;
        text-transform: uppercase;
    }

    p {
        font-size: 20px;
        line-height: 1.4;
        margin-bottom: 10px;
        color: #ffffff;
    }

    .read-more {
        font-size: 12px;
        color: #b38c52;
        font-weight: bold;
        text-decoration: none;
        position: relative;
    }

    .read-more::after {
        content: "";
        display: block;
        width: 0;
        height: 2px;
        background: #b38c52;
        transition: width 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }

    .read-more:hover::after {
        width: 100%;
    }

    .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 30px;
        background: rgba(0, 0, 0, 0.4);
        border: none;
        color: #ffffff;
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 50%;
        z-index: 5;
        transition: background 0.3s;
    }

    .nav:hover {
        background: rgba(0, 0, 0, 0.6);
    }

    .nav.prev {
        left: 10px;
    }

    .nav.next {
        right: 10px;
    }
</style>