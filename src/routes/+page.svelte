<script lang="ts">
	import { animate, stagger } from "motion";
	import { onMount } from "svelte";

	let firstNameElement: HTMLSpanElement;
	let lastNameElement: HTMLSpanElement;

	onMount(() => {
		animate([
			[firstNameElement.childNodes, {
				y: 0,
			}, {
				duration: 0.4,
				delay: stagger(0.05),
				ease: "backOut",
			}],
			[lastNameElement.childNodes, {
				y: 0,
			}, {
				at: 0.2,
				duration: 0.4,
				delay: stagger(0.05),
				ease: "backOut",
			}],
		]);
	});
</script>

<div class="absolute inset-0 grid place-items-center">
	<div class="flex flex-col items-center">
		<h1 class="text-center text-[min(10rem,18vw,18vh)] font-bold leading-[1] font-stretch-110%">
			<span class="relative block">
				<span
					bind:this={firstNameElement}
					class="block absolute inset-x-0 -inset-y-1 pt-1 text-nowrap overflow-hidden"
				>
					{#each "Enrique" as letter}
						<span
							style="transform: translateY(100%)"
							class="inline-block"
						>{letter}</span>
					{/each}
				</span>
				<span class="invisible">
					Enrique
				</span>
			</span>
			<span class="relative block">
				<span
					bind:this={lastNameElement}
					class="block absolute inset-x-0 -inset-y-1 pt-1 text-nowrap overflow-hidden"
				>
					{#each "Pando" as letter}
						<span
							style="transform: translateY(100%)"
							class="inline-block"
						>{letter}</span>
					{/each}
				</span>
				<span class="invisible">
					Pando
				</span>
			</span>
		</h1>
		<h2 class="mt-[min(2rem,4vw,4vh)] xt-[min(1.2rem,2vw,2vh)] leading-[0.5]">
			<span class="text-[min(1.9rem,3.6vw,3.5vh)] font-stretch-120% tracking-wider text-slate-300">SOFTWARE DEVELOPER</span>
		</h2>
		<button class="mt-[min(12rem,18vh)] px-3 py-2 border-2 border-white/50 rounded-md cursor-pointer hover:bg-white hover:text-zinc-900 transition">
			<span class="text-sm font-bold tracking-wider">SEE PROJECTS</span>
		</button>
	</div>
</div>
