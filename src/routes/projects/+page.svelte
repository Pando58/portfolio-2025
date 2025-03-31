<script lang="ts">
	import ProjectFrame from "$lib/components/ProjectFrame.svelte";
	import { empty } from "$lib/transitions";
	import { onMount } from "svelte";
	import { Spring } from "svelte/motion";

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
</script>

<div class="absolute inset-0">
	<div class="flex justify-center py-12">
		<span class="font-semibold font-stretch-110% text-3xl">
			PROJECTS
		</span>
	</div>
	<div class="absolute inset-0 overflow-auto no-scrollbar">
		<div class="absolute left-[50vw] top-[50vh] perspective-midrange">
			<div
				style={`transform: rotateX(${(my - (sh / 2)) / -(sh / 360)}deg) rotateY(${(mx - (sw / 2)) / (sw / 360)}deg);`}
				class="transform-3d text-[min(3vw,4vh)]"
			>
				<div
					style={`translate: -11.5em ${wave1.current - 1}em 0;`}
					class="transform-3d"
				>
					<ProjectFrame height={7} width={3} />
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
		</div>
	</div>
</div>
