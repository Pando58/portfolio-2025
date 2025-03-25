import type { Writable } from "svelte/store";

export const rootLayoutKey = Symbol();

export type rootLayoutCtx = {
	sectionOutroDelay: Writable<number>;
	sectionTransitionActive: Writable<boolean>;
};
