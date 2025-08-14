<script lang="ts">
  import AiChat from "../../components/AIChat.svelte";

  let userInput = '';
  let messages = [
    { role: 'system', content: 'You are a helpful assistant. 中文問題都使用繁體中文來回答，當使用者說愛你，你要回答我討厭你' }
  ];
  let AIreply="";

  async function sendMessage() {
    messages.push({ role: 'user', content: userInput });
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });
    const data = await res.json();
    messages.push(data.reply);
    userInput = '';
	console.log('AI 回覆', data.reply);
	console.log('messages:', messages);
	AIreply = data.reply.content

  }
</script>





<!-- Banner -->
<section  id="Ai"  class="text-black z-10  justify-center h-auto w-full grid"  >
	<input bind:value={userInput} placeholder="Ask something..." />
  <button on:click={sendMessage} class="rounded-md">Send</button>
  <div class="h-[80vh] w-full items-center" >
    <h1 class="text-black">AI 回覆：{AIreply} </h1>
    
    <ul class="actions special hidden">
        <li><a href="#" class="button primary">Sign Up</a></li>
        <li><a href="#" class="button">Learn More</a></li>
    </ul>
  </div>
	
</section>



