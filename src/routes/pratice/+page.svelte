<script>
	let { data } = $props();
</script>

<h1>Home Page</h1>
<p>{data.message}</p>
<p>目前計數: {data.count}</p>
<p> 抽籤結果為:{data.result}</p>
