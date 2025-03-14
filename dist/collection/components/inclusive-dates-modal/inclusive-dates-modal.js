import { h, Host } from "@stencil/core";
import "@a11y/focus-trap";
import { hideOthers } from "aria-hidden";
/**
 * @slot slot - The dialog content
 */
export class InclusiveDatesModal {
  constructor() {
    this.inline = false;
    this.closing = false;
    this.showing = this.inline || false;
    this.onKeyDown = (event) => {
      if (event.code === "Escape") {
        this.close();
      }
    };
  }
  /**
   * Open the dialog.
   */
  async open() {
    if (this.inline)
      return;
    this.showing = true;
    this.undo = hideOthers(this.el);
    this.opened.emit(undefined);
  }
  /**
   * Close the dialog.
   */
  async close() {
    if (this.inline)
      return;
    this.showing = false;
    this.closed.emit(undefined);
    this.undo();
    if (this.triggerElement)
      this.triggerElement.focus();
  }
  async getState() {
    return this.showing;
  }
  async setTriggerElement(element) {
    this.triggerElement = element;
  }
  handleClick(event) {
    if (this.showing && !this.el.contains(event.target)) {
      this.close();
    }
  }
  render() {
    return (h(Host, { showing: this.showing, ref: (r) => {
        this.el = r;
      } }, !this.inline && this.showing && (h("div", { part: "body", onKeyDown: this.onKeyDown, role: "dialog", tabindex: -1, "aria-hidden": !this.showing, "aria-label": this.label, "aria-modal": this.showing }, h("focus-trap", null, h("div", { part: "content" }, h("slot", null))))), this.inline && (h("div", { part: "content" }, h("slot", null)))));
  }
  static get is() { return "inclusive-dates-modal"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["inclusive-dates-modal.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["inclusive-dates-modal.css"]
    };
  }
  static get properties() {
    return {
      "label": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "label",
        "reflect": false
      },
      "inline": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "inline",
        "reflect": false,
        "defaultValue": "false"
      }
    };
  }
  static get states() {
    return {
      "closing": {},
      "showing": {}
    };
  }
  static get events() {
    return [{
        "method": "opened",
        "name": "opened",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "closed",
        "name": "closed",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }];
  }
  static get methods() {
    return {
      "open": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Open the dialog.",
          "tags": []
        }
      },
      "close": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Close the dialog.",
          "tags": []
        }
      },
      "getState": {
        "complexType": {
          "signature": "() => Promise<boolean>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<boolean>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      },
      "setTriggerElement": {
        "complexType": {
          "signature": "(element: HTMLElement) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "HTMLElement": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      }
    };
  }
  static get listeners() {
    return [{
        "name": "click",
        "method": "handleClick",
        "target": "window",
        "capture": true,
        "passive": false
      }];
  }
}
