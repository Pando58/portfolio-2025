import type { Writable } from "svelte/store";

export const rootLayoutKey = Symbol();

export type rootLayoutCtx = {
	sectionTransitionDelay: Writable<number>;
	sectionTransitionActive: Writable<boolean>;
};
