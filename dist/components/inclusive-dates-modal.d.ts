import type { Components, JSX } from "../types/components";

interface InclusiveDatesModal extends Components.InclusiveDatesModal, HTMLElement {}
export const InclusiveDatesModal: {
  prototype: InclusiveDatesModal;
  new (): InclusiveDatesModal;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
