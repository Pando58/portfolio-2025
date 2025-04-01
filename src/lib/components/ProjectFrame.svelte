<script lang="ts">
	let {
		width,
		height,
	}: {
		width: number;
		height: number;
	} = $props();

	let frameSize = 0.25;
	let frameInnerDepth = 0.25;
	let frameOuterDepth = 0.75;
</script>

<div
	style={`width: ${width}em; height: ${height}em; translate: ${-width / 2}em ${-height / 2}em 0;`}
	class="absolute backface-hidden"
>
	<img class="size-full object-cover" alt="" src="https://w.wallhaven.cc/full/ex/wallhaven-exkg7w.jpg" />
</div>

<div
	style={`width: ${width}em; height: ${frameInnerDepth}em; translate: ${-width / 2}em ${-height / 2}em; rotate: x 270deg;`}
	class="absolute backface-hidden origin-bottom-left bottom-0 bg-zinc-500"
></div>
<div
	style={`width: ${width}em; height: ${frameInnerDepth}em; translate: ${-width / 2}em ${height / 2}em; rotate: x 90deg;`}
	class="absolute backface-hidden origin-top-left bg-zinc-100"
></div>
<div
	style={`width: ${frameInnerDepth}em; height: ${height}em; translate: ${-width / 2}em ${-height / 2}em; rotate: y 90deg;`}
	class="absolute backface-hidden origin-top-right right-0 bg-zinc-400"
></div>
<div
	style={`width: ${frameInnerDepth}em; height: ${height}em; translate: ${width / 2}em ${-height / 2}em; rotate: y 270deg;`}
	class="absolute backface-hidden origin-top-left bg-zinc-300"
></div>

<svg
	style={`width: ${width + (frameSize * 2)}em; height: ${height + (frameSize * 2)}em; translate: ${(-width / 2) - frameSize}em ${(-height / 2) - frameSize}em ${frameInnerDepth}em;`}
	class="absolute backface-hidden fill-zinc-200"
	viewBox={`0 0 ${width + (frameSize * 2)} ${height + (frameSize * 2)}`}
>
	<path d={`M 0 0 L 0 ${height + (frameSize * 2)} L ${width + (frameSize * 2)} ${height + (frameSize * 2)} L ${width + (frameSize * 2)} 0 L 0 0 z M ${frameSize} ${frameSize} L ${width + frameSize} ${frameSize} L ${width + frameSize} ${height + frameSize} L ${frameSize} ${height + frameSize} L ${frameSize} ${frameSize} z`} />
</svg>

<div
	style={`width: ${width + (frameSize * 2)}em; height: ${frameInnerDepth + frameOuterDepth}em; translate: ${(-width / 2) - frameSize}em ${(-height / 2) - frameSize}em ${frameInnerDepth}em; rotate: x 90deg;`}
	class="absolute backface-hidden origin-bottom-left bottom-0 bg-zinc-100"
></div>
<div
	style={`width: ${width + (frameSize * 2)}em; height: ${frameInnerDepth + frameOuterDepth}em; translate: ${(-width / 2) - frameSize}em ${(height / 2) + frameSize}em ${frameInnerDepth}em; rotate: x 270deg;`}
	class="absolute backface-hidden origin-top-left bg-zinc-500"
></div>
<div
	style={`width: ${frameInnerDepth + frameOuterDepth}em; height: ${height + (frameSize * 2)}em; translate: ${(-width / 2) - frameSize}em ${(-height / 2) - frameSize}em ${frameInnerDepth}em; rotate: y 270deg;`}
	class="absolute backface-hidden origin-top-right right-0 bg-zinc-300"
></div>
<div
	style={`width: ${frameInnerDepth + frameOuterDepth}em; height: ${height + (frameSize * 2)}em; translate: ${(width / 2) + frameSize}em ${(-height / 2) - frameSize}em ${frameInnerDepth}em; rotate: y 90deg;`}
	class="absolute backface-hidden origin-top-left bg-zinc-400"
></div>
