import type { Components, JSX } from "../types/components";

interface InclusiveDates extends Components.InclusiveDates, HTMLElement {}
export const InclusiveDates: {
  prototype: InclusiveDates;
  new (): InclusiveDates;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
