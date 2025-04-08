<script lang="ts">
	import ProjectFrame from "$lib/components/ProjectFrame.svelte";
	import { type rootLayoutCtx, rootLayoutKey } from "$lib/context";
	import { scroll } from "motion";
	import { getContext, onMount } from "svelte";
	import { Spring } from "svelte/motion";

	const {
		sectionTransitionActive,
	} = getContext<rootLayoutCtx>(rootLayoutKey);

	// Section navigation timing

	onMount(() => {
		const transitionTimeout = setTimeout(() => {
			$sectionTransitionActive = false;
		}, 800);

		return () => {
			clearTimeout(transitionTimeout);
		};
	});

	// Waving animation

	let wave1 = new Spring(0, { damping: 0.5, stiffness: 0.05 });
	let wave2 = new Spring(0, { damping: 0.5, stiffness: 0.05 });
	let wave3 = new Spring(0, { damping: 0.5, stiffness: 0.05 });

	onMount(() => {
		let interval = setInterval(() => {
			wave1.target = Math.cos(performance.now() / 500 + 1.5) * 1.2;
			wave2.target = Math.cos(performance.now() / 500 + 0.75) * 0.5;
			wave3.target = Math.cos(performance.now() / 500) * 1.7;
		}, 1000 / 30);

		return () => clearInterval(interval);
	});

	// Mouse

	let mx = $state(0);
	let my = $state(0);

	let sw = $state(0);
	let sh = $state(0);

	onMount(() => {
		const mouseListener = (e: MouseEvent) => {
			mx = e.clientX;
			my = e.clientY;
		};

		const resizeListener = () => {
			sw = window.innerWidth;
			sh = window.innerHeight;

			mx = sw / 2;
			my = sh / 2;
		};

		resizeListener();

		mx = sw / 2;
		my = sh / 2;

		addEventListener("mousemove", mouseListener);
		addEventListener("resize", resizeListener);

		return () => {
			removeEventListener("mousemove", mouseListener);
			removeEventListener("resize", resizeListener);
		};
	});

	// Infinite scroll

	let scrollRegionIndex = $state(0);
	let scrollContainer: HTMLElement;
	let scrollProgress = $state(0);

	const scrollRegionAmount = 7; // 3 is the minimum but a bigger number allows faster scroll
	const scrollRegionAmountOneSide = Math.trunc(scrollRegionAmount / 2);

	const frameAmount = 3;

	const frames = [...Array(frameAmount)].map(() => new Spring(0, { damping: 0.5, stiffness: 0.05 }));

	onMount(() => {
		function getMiddleRegionRect() {
			return scrollContainer.children[scrollRegionAmountOneSide].getBoundingClientRect();
		}

		scrollContainer.scrollBy(0, getMiddleRegionRect().top);

		function getFrameVerticalPosition(i: number) {
			return ((-scrollProgress + 0.5) + ((i + scrollRegionIndex - Math.trunc(frameAmount / 2)) / (scrollRegionAmount - 1))) * 560;
		}

		scroll((progress: number) => {
			scrollProgress = progress + (scrollRegionIndex / (scrollRegionAmount - 1));

			if (progress > (scrollRegionAmountOneSide + 0.5) / (scrollRegionAmount - 1)) {
				scrollRegionIndex++;

				const firstFrame = frames[0];
				for (let i = 0; i < frames.length - 1; i++) {
					frames[i] = frames[i + 1];
				}
				frames[frames.length - 1] = firstFrame;

				frames[frames.length - 1].set(getFrameVerticalPosition(frames.length - 1), { instant: true });
			}

			if (progress < (scrollRegionAmountOneSide - 0.5) / (scrollRegionAmount - 1)) {
				scrollRegionIndex--;

				const lastFrame = frames[frames.length - 1];
				for (let i = frames.length - 1; i > 0; i--) {
					frames[i] = frames[i - 1];
				}
				frames[0] = lastFrame;

				frames[0].set(getFrameVerticalPosition(0), { instant: true });
			}

			for (let i = 0; i < frames.length; i++) {
				frames[i].target = getFrameVerticalPosition(i);
			}
		}, {
			container: scrollContainer,
		});

		const snapInstant = () => {
			scrollContainer.scrollBy(0, getMiddleRegionRect().top);
		};
		const snapSmooth = () => {
			scrollContainer.scrollBy({
				top: getMiddleRegionRect().top,
				behavior: "smooth",
			});
		};

		let timeout: number;

		const snapSmoothDebounce = () => {
			clearTimeout(timeout);
			timeout = setTimeout(snapSmooth, 300);
		};

		scrollContainer.addEventListener("scroll", snapSmoothDebounce);
		window.addEventListener("resize", snapInstant);

		return () => {
			scrollContainer.removeEventListener("scroll", snapSmoothDebounce);
			window.removeEventListener("resize", snapInstant);
		};
	});
</script>

<div class="absolute inset-0">
	<div class="flex justify-center py-12">
		<span class="font-semibold font-stretch-110% text-3xl">
			PROJECTS
		</span>
	</div>
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute left-[50vw] top-[50vh] text-[min(3vw,4vh)] perspective-[26em]">
			{#each [...Array(frameAmount)].map((_, i) => scrollRegionIndex + i) as i (i)}
				<div
					style={`translate: 0 calc(${frames[i - scrollRegionIndex].current}vh);`}
					class="absolute transform-3d"
				>
					<div
						style={`translate: -11.5em ${wave1.current - 1}em 0;`}
						class="transform-3d"
					>
						<ProjectFrame height={7} width={3} />
						<div class="absolute">
							{i}
						</div>
					</div>
					<div
						style={`translate: 0 ${wave2.current}em 0;`}
						class="transform-3d"
					>

						<ProjectFrame height={12} width={16} />
					</div>
					<div
						style={`translate: 10.75em ${wave3.current + 1}em 0;`}
						class="transform-3d"
					>
						<ProjectFrame height={4} width={1.5} />
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="absolute inset-0 z-50">
		<div class="absolute">{scrollRegionIndex}</div>
		<div bind:this={scrollContainer} class="h-screen overflow-auto opacity-20">
			{#each [...Array(scrollRegionAmount)].map((_, i) => scrollRegionIndex + i) as i (i)}
				<div style={`background: hsl(${i * 20}, 50%, 30%);`} class="h-screen grid place-items-center">{i} <br /> {Math.random() * 1000 | 0}</div>
			{/each}
		</div>
	</div>
</div>
