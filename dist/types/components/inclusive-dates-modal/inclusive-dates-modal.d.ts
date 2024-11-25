import { EventEmitter } from "../../stencil-public-runtime";
import "@a11y/focus-trap";
/**
 * @slot slot - The dialog content
 */
export declare class InclusiveDatesModal {
  label: string;
  inline?: boolean;
  closing: boolean;
  showing: boolean;
  opened: EventEmitter;
  closed: EventEmitter;
  private triggerElement;
  private el;
  private undo;
  /**
   * Open the dialog.
   */
  open(): Promise<void>;
  /**
   * Close the dialog.
   */
  close(): Promise<void>;
  getState(): Promise<boolean>;
  setTriggerElement(element: HTMLElement): Promise<void>;
  onKeyDown: (event: KeyboardEvent) => void;
  handleClick(event: any): void;
  render(): any;
}
