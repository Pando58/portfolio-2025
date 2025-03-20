<script lang="ts">
	import "../app.css";
	import { onNavigate } from "$app/navigation";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import { setContext } from "svelte";
	import { rootLayoutKey, type rootLayoutCtx } from "$lib/context";
	import { writable } from "svelte/store";
	import { sleep } from "$lib/utils";

	let { children } = $props();

	const sectionTransitionDelay = writable(0);

	setContext<rootLayoutCtx>(rootLayoutKey, {
		sectionTransitionDelay,
	});

	let sectionKey = $state(Symbol());

	onNavigate(async () => {
		await sleep($sectionTransitionDelay);

		sectionKey = Symbol();
	});
</script>

<div class="absolute inset-0">
	{#key sectionKey}
		{@render children()}
	{/key}
	<Sidebar />
</div>
