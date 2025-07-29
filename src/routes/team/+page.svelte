<script>
import { onMount } from 'svelte';
  const team = [
    {
      name: "Indio Lempira",
      title: "Senior Developer",
      image: "/images/team1.jpg",
      desc: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.",
    },
    {
      name: "Florinda Meza",
      title: "Graphic Designer",
      image: "/images/florinda.jpg",
      desc: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.",
    },
    {
      name: "Chico Morazan",
      title: "Community Manager",
      image: "/images/chico.jpg",
      desc: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.",
    },
    {
      name: "Calamaro Ruiz",
      title: "Community Manager",
      image: "/images/calamaro.jpg",
      desc: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.",
    }
  ];

   const projects = [
    {
      image: '/project1.jpg',
      title: 'Minimal Website',
      description: 'A fast and clean minimal website.'
    },
    {
      image: '/project2.jpg',
      title: 'Creative Landing',
      description: 'A scroll-based interactive landing page.'
    },
    {
      image: '/project3.jpg',
      title: 'Personal Portfolio',
      description: 'Modern and bold portfolio experience.'
    }
  ];

   const imageBlocks = [
    {
      src: 'https://balance.michael-aust.com/media/pages/home/a6db114736-1743182713/apex-home-teaser-1920x.webp',
      alt: 'Apex'
    },
    {
      // @ts-ignore
      src: 'https://balance.michael-aust.com/media/pages/home/fabae3ecf9-1743182713/dionysos-home-teaser-640x.webp',
      alt: 'Creative 2'
    },
    {
      src: 'https://balance.michael-aust.com/media/pages/home/f0c4dfe753-1743182713/copy3-1920x.webp',
      alt: 'Creative 3'
    }
  ];

  let scrollY = 0;

  const handleScroll = () => {
    scrollY = window.scrollY;
  };

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

    // @ts-ignore
    const getOffset = (index) => {
    const sectionTop = index * window.innerHeight;
    const scrollOffset = scrollY - sectionTop;
    const offset = Math.max(0, Math.min(scrollOffset * 0.25, window.innerHeight * 0.25));
    return -offset;
  };

  
</script>




<!-- Hero Section -->
<section class="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">
  <h1 class="text-5xl md:text-7xl font-bold mb-6">Hi, I'm Michael Aust.</h1>
  <p class="text-lg md:text-xl mb-6 max-w-xl">Creative Developer & Designer</p>
  <a href="#projects" class="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition">View Projects</a>
</section>

<!-- About Section -->
<section class="bg-white text-black py-20 px-6">
  <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
    <div>
      <h2 class="text-4xl font-bold mb-4">About Me</h2>
      <p class="text-lg leading-relaxed">
        I’m a creative developer focusing on creating unique, functional and aesthetic digital experiences.
      </p>
    </div>
    <img src="/me.jpg" alt="About Image" class="rounded-lg shadow-lg max-w-full h-auto" />
  </div>
</section>

<!-- Projects Grid -->
<section id="projects" class="bg-gray-100 py-20 px-6">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12">Selected Projects</h2>
    <div class="grid md:grid-cols-3 gap-8">
      {#each projects as project}
        <div class="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden">
          <img src={project.image} alt={project.title} class="w-full h-48 object-cover" />
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">{project.title}</h3>
            <p class="text-sm text-gray-600">{project.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>


<!-- 圖片視差效果-->

<div class="relative h:[100vh] ">
  {#each imageBlocks as block, i}
    <section class="sticky top-0 h-screen z-[{10 - i}] overflow-hidden">
      <div class="relative w-full h-full">
        <img
          src={block.src}
          alt={block.alt}
          class="w-full h-[120%] object-cover object-top transition-transform duration-300 ease-out"
          style="transform: translateY({(scrollY + i * 100) * -0.5}px);"
        />
      </div>
    </section>
  {/each}
</div>

<!-- 橘色標題區塊 -->
<section class="relative bg-[#00416a] text-white py-16">
  <div class="max-w-6xl mx-auto text-center px-4">
    <h2 class="text-5xl font-bold">OUR TEAM</h2>
    <p class="text-yellow-200 mt-2">yes we know, people say we are crazy</p>
  </div>
  <!-- 下切斜角效果 -->
  <div class="absolute bottom-0 left-0 w-full h-8 bg-white [clip-path:polygon(0%_100%,100%_0%,100%_100%)]"></div>
</section>

<!-- 白色內容區塊 -->
<section class="bg-white pt-12 pb-16">
  <div class="max-w-6xl mx-auto px-4">
    <div class="flex flex-wrap justify-between gap-6">
      {#each team as member}
        <div class="flex-1 min-w-[220px] max-w-[240px] text-center">
          <div class="flex justify-center mb-4">
            <img src={member.image} alt={member.name} class="w-24 h-24 rounded-full border-4 border-gray-300 object-cover" />
          </div>
          <h3 class="text-lg font-semibold text-gray-800">{member.name}</h3>
          <p class="text-sm italic text-gray-500">{member.title}</p>
          <p class="text-sm text-gray-600 mt-2">{member.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<footer class="bg-black text-white py-10 text-center">
  <p class="mb-4">© 2025 Michael Aust. All rights reserved.</p>
  <div class="flex justify-center gap-6">
    <a href="mailto:hello@example.com" class="hover:underline">Email</a>
    <a href="https://linkedin.com" target="_blank" class="hover:underline">LinkedIn</a>
    <a href="https://github.com" target="_blank" class="hover:underline">GitHub</a>
  </div>
 </footer>