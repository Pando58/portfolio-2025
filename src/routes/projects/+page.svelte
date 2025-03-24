<script lang="ts">
	import { onNavigate } from "$app/navigation";
	import { rootLayoutKey, type rootLayoutCtx } from "$lib/context";
	import { empty } from "$lib/transitions";
	import { animate } from "motion";
	import { getContext, onMount } from "svelte";

	const {
		sectionTransitionDelay,
		sectionTransitionActive,
	} = getContext<rootLayoutCtx>(rootLayoutKey);

	let element: HTMLElement;

	onMount(async () => {
		$sectionTransitionDelay = 500;

		await animate(element, {
			opacity: 1,
		}, {
			duration: 0.5,
		});

		$sectionTransitionActive = false;
	});

	onNavigate(() => {
		animate(element, {
			opacity: 0,
		}, {
			duration: 0.5,
		});

	// await sleep(500);
	});
</script>

<div class="absolute inset-0 grid place-items-center">
	<span
		bind:this={element}
		style="opacity: 0;"
		class="font-semibold font-stretch-110% text-3xl"
	>Projects</span>
</div>
