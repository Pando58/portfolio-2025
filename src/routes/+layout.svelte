<script lang="ts">
	import "../app.css";
	import { beforeNavigate, onNavigate } from "$app/navigation";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import { setContext } from "svelte";
	import { rootLayoutKey, type rootLayoutCtx } from "$lib/context";
	import { writable } from "svelte/store";
	import { sleep } from "$lib/utils";

	let { children } = $props();

	const sectionTransitionDelay = writable(0);
	const sectionTransitionActive = writable(true);

	setContext<rootLayoutCtx>(rootLayoutKey, {
		sectionTransitionDelay,
		sectionTransitionActive,
	});

	let sectionKey = $state(Symbol());

	beforeNavigate(() => {
		$sectionTransitionActive = true;
	});

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
