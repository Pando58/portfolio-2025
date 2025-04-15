<script lang="ts">
	import { beforeNavigate } from "$app/navigation";
	import { rootLayoutKey, type rootLayoutCtx } from "$lib/context";
	import { animate, stagger } from "motion";
	import { getContext, onMount } from "svelte";

	const {
		sectionOutroDelay,
		sectionTransitionActive,
	} = getContext<rootLayoutCtx>(rootLayoutKey);

	let firstNameElement: HTMLSpanElement;
	let lastNameElement: HTMLSpanElement;
	let subtitleElement: HTMLSpanElement;
	let buttonElement: HTMLSpanElement;

	onMount(() => {
		$sectionOutroDelay = 650;

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
			[subtitleElement, {
				y: 0,
			}, {
				at: 0.7,
				duration: 0.3,
				ease: "circOut",
			}],
			[buttonElement, {
				y: 0,
			}, {
				at: 0.9,
				duration: 0.5,
				ease: "circOut",
			}],
			[buttonElement, {
				opacity: 1,
			}, {
				at: 0.9,
				duration: 0.8,
				ease: "easeOut",
			}],
		]);

		const transitionTimeout = setTimeout(() => {
			$sectionTransitionActive = false;
		}, 800);

		return () => {
			clearTimeout(transitionTimeout);
		};
	});

	beforeNavigate(() => {
		animate([
			[firstNameElement.childNodes, {
				y: "-102%",
			}, {
				duration: 0.1,
				delay: stagger(0.035),
				ease: "circIn",
			}],
			[lastNameElement.childNodes, {
				y: "-102%",
			}, {
				at: 0.15,
				duration: 0.1,
				delay: stagger(0.035),
				ease: "circIn",
			}],
			[subtitleElement, {
				y: "-100%",
			}, {
				at: 0.3,
				duration: 0.15,
				ease: "circIn",
			}],
			[buttonElement, {
				opacity: 0,
			}, {
				at: 0.4,
				duration: 0.25,
				ease: "easeOut",
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
					class="block absolute inset-x-0 top-0 -bottom-[min(0.25rem,1.4vw,1.4vh)] text-nowrap overflow-hidden"
				>
					{#each "Enrique" as letter}
						<span
							style="transform: translateY(102%)"
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
					class="block absolute inset-x-0 top-0 -bottom-[min(0.25rem,1.4vw,1.4vh)] text-nowrap overflow-hidden"
				>
					{#each "Pando" as letter}
						<span
							style="transform: translateY(102%)"
							class="inline-block"
						>{letter}</span>
					{/each}
				</span>
				<span class="invisible">
					Pando
				</span>
			</span>
		</h1>
		<h2 class="text-[min(1.9rem,3.6vw,3.5vh)] font-stretch-120% tracking-wider mt-[min(2rem,4vw,4vh)] leading-[1em] text-slate-300 overflow-hidden">
			<span
				bind:this={subtitleElement}
				style:transform="translateY(100%)"
				class="inline-block"
			>SOFTWARE DEVELOPER</span>
		</h2>
		<button
			bind:this={buttonElement}
			style:transform="translateY(50%)"
			class="relative mt-[min(12rem,18vh)] px-3 py-2 text-sm font-bold tracking-wider border-2 border-white/50 rounded-md cursor-pointer opacity-0"
		>
			<span>SEE PROJECTS</span>
			<div class="group absolute -left-0.5 -top-0.5 -right-0.5 -bottom-0.5 rounded-md overflow-hidden">
				<div class="absolute left-0 top-0 right-0 bottom-0 -translate-y-full overflow-hidden group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
					<div class="absolute left-0 top-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out grid place-items-center bg-white text-zinc-900">
						SEE PROJECTS
					</div>
				</div>
			</div>
		</button>
	</div>
</div>
