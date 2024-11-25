import type { Components, JSX } from "../types/components";

interface InclusiveDatesCalendar extends Components.InclusiveDatesCalendar, HTMLElement {}
export const InclusiveDatesCalendar: {
  prototype: InclusiveDatesCalendar;
  new (): InclusiveDatesCalendar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
