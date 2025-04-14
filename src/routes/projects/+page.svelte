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

	function getFrameVerticalPosition(i: number) {
		return (
			-scrollProgress
			+ (
				(i + scrollRegionIndex - Math.trunc(frameAmount / 2))
				/ (scrollRegionAmount - 1)
			)
		) * (scrollRegionAmount - 1) * 80;
	}

	const frames = [...Array(frameAmount)].map((_, i) => ({
		left: new Spring(getFrameVerticalPosition(i), { damping: 0.5, stiffness: 0.08 }),
		middle: new Spring(getFrameVerticalPosition(i), { damping: 0.5, stiffness: 0.05 }),
		right: new Spring(getFrameVerticalPosition(i), { damping: 0.5, stiffness: 0.03 }),
	}));

	function getMiddleRegionRect() {
		return scrollContainer.children[scrollRegionAmountOneSide].getBoundingClientRect();
	}

	function snapInstant() {
		scrollContainer.scrollBy(0, getMiddleRegionRect().top);
	}

	function snapSmooth() {
		scrollContainer.scrollBy({
			top: getMiddleRegionRect().top,
			behavior: "smooth",
		});
	}

	onMount(() => {
		scrollContainer.scrollBy(0, getMiddleRegionRect().top);

		scroll((progress: number) => {
			scrollProgress = progress + (scrollRegionIndex / (scrollRegionAmount - 1)) - 0.5;

			if (progress > (scrollRegionAmountOneSide + 0.5) / (scrollRegionAmount - 1)) {
				scrollRegionIndex++;

				const firstFrame = frames[0];
				for (let i = 0; i < frames.length - 1; i++) {
					frames[i] = frames[i + 1];
				}
				frames[frames.length - 1] = firstFrame;

				frames[frames.length - 1].left.set(getFrameVerticalPosition(frames.length - 1), { instant: true });
				frames[frames.length - 1].middle.set(getFrameVerticalPosition(frames.length - 1), { instant: true });
				frames[frames.length - 1].right.set(getFrameVerticalPosition(frames.length - 1), { instant: true });
			}

			if (progress < (scrollRegionAmountOneSide - 0.5) / (scrollRegionAmount - 1)) {
				scrollRegionIndex--;

				const lastFrame = frames[frames.length - 1];
				for (let i = frames.length - 1; i > 0; i--) {
					frames[i] = frames[i - 1];
				}
				frames[0] = lastFrame;

				frames[0].left.set(getFrameVerticalPosition(0), { instant: true });
				frames[0].middle.set(getFrameVerticalPosition(0), { instant: true });
				frames[0].right.set(getFrameVerticalPosition(0), { instant: true });
			}

			for (let i = 0; i < frames.length; i++) {
				frames[i].left.target = getFrameVerticalPosition(i);
				frames[i].middle.target = getFrameVerticalPosition(i);
				frames[i].right.target = getFrameVerticalPosition(i);
			}
		}, {
			container: scrollContainer,
		});

		let timeout: number;

		const snapSmoothDebounce = () => {
			if (scrollbarHandleDown) return;

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

	// Scrollbar

	const scrollbarRatio = 3;
	const scrollbarRatioPercent = 100 / scrollbarRatio;

	let scrollbar: HTMLElement;
	let scrollbarHandle: HTMLElement;
	let scrollbarHandle2: HTMLElement;

	let scrollbarHandleDown = $state(false);

	function scrollbarPointerDown(e: PointerEvent) {
		e.preventDefault();

		const height = scrollbar.getBoundingClientRect().height;
		const clickAreaIndex = Math.trunc((e.offsetY / height) * scrollbarRatio);
		const clickAreaIndexRelative = clickAreaIndex - (Math.round(scrollProgress * (scrollRegionAmount - 1)) % scrollbarRatio);

		scrollContainer.scrollBy(0, height * Math.sign(clickAreaIndexRelative));
	}

	onMount(() => {
		let prevY = 0;

		function onPointerDown(e: PointerEvent) {
			e.preventDefault();
			e.stopPropagation();

			scrollbarHandleDown = true;
			prevY = e.clientY;
		}

		function onPointerUp() {
			if (!scrollbarHandleDown) return;

			scrollbarHandleDown = false;
			snapSmooth();
		}

		function onPointerMove({ clientY }: PointerEvent) {
			if (scrollbarHandleDown) {
				const diffY = clientY - prevY;

				scrollContainer.scrollBy(0, diffY * scrollbarRatio);

				prevY = clientY;
			}
		}

		scrollbarHandle.addEventListener("pointerdown", onPointerDown);
		scrollbarHandle2.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointerup", onPointerUp);
		window.addEventListener("pointermove", onPointerMove);

		return () => {
			scrollbarHandle.removeEventListener("pointerdown", onPointerDown);
			scrollbarHandle2.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointermove", onPointerMove);
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
					style={`
						transform:
						rotateY(${frames[i - scrollRegionIndex].left.current * 0.2}deg)
						translateX(-11.5em)
						translateY(${wave1.current - 1}em)
						rotateX(${frames[i - scrollRegionIndex].left.current * 0.15}deg)
						translateY(${frames[i - scrollRegionIndex].left.current * 0.8}vh)
						translateY(${frames[i - scrollRegionIndex].left.current * 0.2}em);
					`}
					class="transform-3d"
				>
					<ProjectFrame height={7} width={3} />
				</div>
				<div
					style={`
						transform:
						rotateY(${frames[i - scrollRegionIndex].middle.current * 0.2}deg)
						translateY(${wave2.current}em)
						rotateX(${frames[i - scrollRegionIndex].middle.current * 0.15}deg)
						translateY(${frames[i - scrollRegionIndex].middle.current * 0.8}vh)
						translateY(${frames[i - scrollRegionIndex].middle.current * 0.2}em);
					`}
					class="transform-3d"
				>

					<ProjectFrame height={12} width={16} />
				</div>
				<div
					style={`
						transform:
						rotateY(${frames[i - scrollRegionIndex].right.current * 0.2}deg)
						translateX(10.75em)
						translateY(${wave3.current + 1}em)
						rotateX(${frames[i - scrollRegionIndex].right.current * 0.15}deg)
						translateY(${frames[i - scrollRegionIndex].right.current * 0.8}vh)
						translateY(${frames[i - scrollRegionIndex].right.current * 0.2}em);
					`}
					class="transform-3d"
				>
					<ProjectFrame height={4} width={1.5} />
				</div>
			{/each}
		</div>
	</div>
	<div class="absolute inset-0">
		<div bind:this={scrollContainer} class="h-screen overflow-auto no-scrollbar">
			{#each [...Array(scrollRegionAmount)].map((_, i) => scrollRegionIndex + i) as i (i)}
				<div class="h-screen"></div>
			{/each}
		</div>

		<div
			style:--scroll-progress={(scrollProgress * (scrollRegionAmount - 1)).toFixed(3)}
			class={[
				"absolute top-0 bottom-0 left-0 p-0.5 hover:bg-zinc-950/40 transition duration-50",
				{ "bg-zinc-950/40": scrollbarHandleDown },
			]}
		>
			<div
				bind:this={scrollbar}
				class="relative w-2 h-full"
				onpointerdown={scrollbarPointerDown}
			>
				<div
					bind:this={scrollbarHandle}
					style:--top={`mod(var(--scroll-progress) * ${scrollbarRatioPercent}, 100)`}
					style:top={`calc(var(--top) * 1%)`}
					style:bottom={`max(0%, calc((100 - ${scrollbarRatioPercent} - var(--top)) * 1%))`}
					class={[
						"absolute left-0 right-0 hover:bg-zinc-600 rounded-xs transition",
						scrollbarHandleDown
							? "bg-zinc-600"
							: "bg-zinc-700",
					]}
				></div>
				<div
					bind:this={scrollbarHandle2}
					style:--top={`mod(var(--scroll-progress) * ${scrollbarRatioPercent}, 100)`}
					style:top={`max(0%, calc(var(--top) * 1% - 100%))`}
					style:bottom={`calc((100 - ${scrollbarRatioPercent} - var(--top)) * 1% + 100%)`}
					class={[
						"absolute left-0 right-0 hover:bg-zinc-600 rounded-xs transition",
						scrollbarHandleDown
							? "bg-zinc-600"
							: "bg-zinc-700",
					]}
				></div>
			</div>
		</div>
	</div>
</div>
