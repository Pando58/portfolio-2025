<script lang="ts">
	import Sidebar from "$lib/components/Sidebar.svelte";
	import "../app.css";
	let { children } = $props();
</script>

<div class="absolute inset-0">
	{@render children()}
	<Sidebar />
</div>
