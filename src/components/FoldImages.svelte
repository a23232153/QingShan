<script>
  export let image;
  export let title;
  export let description;
  export let link = "";
  export let showLink = false;
</script>

<div
  class="group relative flex-1 overflow-hidden transition-all duration-500 ease-in-out hover:flex-[3] flex items-center justify-center"
>
  <img
    src={image}
    alt={title}
    class="w-full h-full object-cover bg-no-repeat object-center transition duration-500"
  />
  <div
    class="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  >
    <div class="text-center px-4">
      <h2 class="text-xl font-bold mb-2">{title}</h2>
      {#if showLink}
      <a href={link}> 點擊查看  </a>
      {/if}
      <p class="text-sm">{description}</p>
    </div>
  </div>
</div>
