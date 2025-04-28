import { h, Host } from "@stencil/core";
import { announce } from "@react-aria/live-announcer";
import { getISODateString, removeTimezoneOffset } from "../../utils/utils";
import { chronoParseDate, chronoParseRange } from "../../utils/chrono-parser/chrono-parser";
const defaultLabels = {
  selected: "selected",
  openCalendar: "Open calendar",
  calendar: "calendar",
  invalidDateError: "We could not find a matching date",
  minDateError: `Please fill in a date after `,
  maxDateError: `Please fill in a date before `,
  rangeOutOfBoundsError: `Please enter a valid range of dates`,
  disabledDateError: `Please choose an available date`,
  to: "to",
  startDate: "Start date"
};
export class InclusiveDates {
  constructor() {
    // Enable or disable range mode
    this.range = false;
    // A label for the text field
    this.label = this.range
      ? "Choose a date range (any way you like)"
      : "Choose a date (any way you like)";
    // A placeholder for the text field
    this.placeholder = this.range
      ? `Try "June 8 to 12"`
      : `Try "tomorrrow" or "in ten days"`;
    // Locale used for internal translations and date parsing
    this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || "en-US";
    // If the datepicker is disabled
    this.disabled = false;
    // Which date to be displayed when calendar is first opened
    this.startDate = getISODateString(new Date());
    // Reference date used for Chrono date parsing. Equals "today"
    this.referenceDate = getISODateString(new Date());
    // Enable or disable strict Chrono date parsing
    this.useStrictDateParsing = false;
    // Labels used for internal translations
    this.inclusiveDatesLabels = defaultLabels;
    // Prevent hiding the calendar
    this.inline = false;
    // Enable or disable week numbers
    this.weekNumbers = false;
    // Current error state of the input field
    this.hasError = false;
    // Show or hide the next/previous year buttons
    this.showYearStepper = false;
    // Show or hide the next/previous month buttons
    this.showMonthStepper = true;
    // Show or hide the clear button
    this.showClearButton = true;
    // Show or hide the today button
    this.showTodayButton = true;
    // Enable or disable input field formatting for accepted dates (eg. "Tuesday May 2, 2021" instead of "2021-05-02")
    this.formatInputOnAccept = true;
    // Show or hide the keyboard hints
    this.showKeyboardHint = true;
    // Function to disable individual dates
    this.disableDate = () => false;
    // Component name used to generate CSS classes
    this.elementClassName = "inclusive-dates";
    // Which day that should start the week (0 is sunday, 1 is monday)
    this.firstDayOfWeek = 1; // Monday
    // Quick buttons with dates displayed under the text field
    this.quickButtons = this.range
      ? ["Monday to Wednesday", "July 5 to 10"]
      : ["Yesterday", "Today", "Tomorrow", "In 10 days"];
    // Show or hide the quick buttons
    this.showQuickButtons = true;
    // Add this with the other @Prop() declarations
    this.weekNumbersSymbol = "#";
    this.errorState = this.hasError;
    this.disabledState = this.disabled;
    this.chronoSupportedLocale = ["en", "ja", "fr", "nl", "ru", "pt"].includes(this.locale.slice(0, 2));
    this.errorMessage = "";
    this.handleCalendarButtonClick = async () => {
      var _a, _b;
      await customElements.whenDefined("inclusive-dates-modal");
      await this.modalRef.setTriggerElement(this.calendarButtonRef);
      if ((await this.modalRef.getState()) === false)
        await ((_a = this.modalRef) === null || _a === void 0 ? void 0 : _a.open());
      else if ((await this.modalRef.getState()) === true)
        await ((_b = this.modalRef) === null || _b === void 0 ? void 0 : _b.close());
    };
    this.handleQuickButtonClick = async (event) => {
      const parser = this.range ? chronoParseRange : chronoParseDate;
      const parsedDate = await parser(event.target.innerText, {
        locale: this.locale.slice(0, 2),
        minDate: this.minDate,
        maxDate: this.maxDate,
        referenceDate: removeTimezoneOffset(new Date(this.referenceDate))
      });
      if (parsedDate) {
        // Single date
        if (parsedDate.value instanceof Date) {
          this.updateValue(parsedDate.value);
          if (document.activeElement !== this.inputRef) {
            this.formatInput(true, false);
          }
        }
        else {
          // Date range
          const newValue = [];
          if (parsedDate.value.start instanceof Date) {
            newValue.push(parsedDate.value.start);
          }
          if (parsedDate.value && parsedDate.value.end instanceof Date)
            newValue.push(parsedDate.value.end);
          this.updateValue(newValue);
          this.formatInput(true, false);
        }
      }
    };
    this.handleChangedMonths = (newMonth) => {
      const formattedMonth = String(newMonth.month).padStart(2, "0");
      announce(`${Intl.DateTimeFormat(this.locale, {
        month: "long",
        year: "numeric"
      }).format(removeTimezoneOffset(new Date(`${newMonth.year}-${formattedMonth}-01`)))}`, "assertive");
    };
    this.handleChange = async (event) => {
      if (this.range) {
        this.errorState = false;
        if (event.target.value.length === 0) {
          this.internalValue = "";
          this.pickerRef.value = null;
          return this.selectDate.emit(this.internalValue);
        }
        const parsedRange = await chronoParseRange(event.target.value, {
          locale: this.locale.slice(0, 2),
          minDate: this.minDate,
          maxDate: this.maxDate,
          referenceDate: removeTimezoneOffset(new Date(this.referenceDate))
        });
        const newValue = [];
        if (parsedRange.value && parsedRange.value.start instanceof Date)
          newValue.push(parsedRange.value.start);
        if (parsedRange.value && parsedRange.value.end instanceof Date)
          newValue.push(parsedRange.value.end);
        this.updateValue(newValue);
        this.formatInput(true, false);
        if (newValue.length === 0) {
          this.errorState = true;
          this.errorMessage = {
            invalid: this.inclusiveDatesLabels.invalidDateError,
            rangeOutOfBounds: this.inclusiveDatesLabels.rangeOutOfBoundsError
          }[parsedRange.reason];
        }
      }
      else {
        this.errorState = false;
        if (event.target.value.length === 0) {
          this.internalValue = "";
          this.pickerRef.value = null;
          return this.selectDate.emit(this.internalValue);
        }
        const parsedDate = await chronoParseDate(event.target.value, {
          locale: this.locale.slice(0, 2),
          minDate: this.minDate,
          maxDate: this.maxDate,
          referenceDate: removeTimezoneOffset(new Date(this.referenceDate))
        });
        if (parsedDate && parsedDate.value instanceof Date) {
          if (this.disableDate(parsedDate.value)) {
            this.errorState = true;
            this.errorMessage = this.inclusiveDatesLabels.disabledDateError;
          }
          else {
            this.updateValue(parsedDate.value);
            this.formatInput(true, false);
          }
        }
        else if (parsedDate) {
          this.errorState = true;
          this.internalValue = null;
          let maxDate = undefined;
          let minDate = undefined;
          if (this.maxDate) {
            maxDate = this.maxDate
              ? removeTimezoneOffset(new Date(this.maxDate))
              : undefined;
            maxDate.setDate(maxDate.getDate() + 1);
          }
          if (this.minDate) {
            minDate = this.minDate
              ? removeTimezoneOffset(new Date(this.minDate))
              : undefined;
            minDate.setDate(minDate.getDate() - 1);
          }
          this.errorMessage = parsedDate.reason;
          this.errorMessage = {
            // TODO: Add locale date formatting to these messages
            minDate: minDate
              ? `${this.inclusiveDatesLabels.minDateError} ${getISODateString(minDate)}`
              : "",
            maxDate: maxDate
              ? `${this.inclusiveDatesLabels.maxDateError} ${getISODateString(maxDate)}`
              : "",
            invalid: this.inclusiveDatesLabels.invalidDateError
          }[parsedDate.reason];
        }
      }
    };
  }
  componentDidLoad() {
    this.componentReady.emit();
    if (!this.id) {
      console.error('inclusive-dates: The "id" prop is required for accessibility');
    }
    if (!this.chronoSupportedLocale)
      console.warn(`inclusive-dates: The chosen locale "${this.locale}" is not supported by Chrono.js. Date parsing has been disabled`);
  }
  // External method to parse text string using Chrono.js and (optionally) set as value.
  async parseDate(text, shouldSetValue = true, chronoOptions = undefined) {
    const parsedDate = await chronoParseDate(text, Object.assign({ locale: this.locale.slice(0, 2), minDate: this.minDate, maxDate: this.minDate, referenceDate: removeTimezoneOffset(new Date(this.referenceDate)) }, chronoOptions));
    if (shouldSetValue) {
      if (parsedDate && parsedDate.value instanceof Date) {
        this.updateValue(parsedDate.value);
      }
      else
        this.errorState = true;
    }
    return {
      value: parsedDate && parsedDate.value instanceof Date
        ? getISODateString(parsedDate.value)
        : undefined,
      reason: parsedDate && parsedDate.reason ? parsedDate.reason : undefined
    };
  }
  // @ts-ignore
  isRangeValue(value) {
    if (Array.isArray(value) &&
      new Date(value[0]) instanceof Date &&
      new Date(value[1]) instanceof Date)
      return this.range;
  }
  updateValue(newValue) {
    // Range
    if (Array.isArray(newValue)) {
      this.internalValue = newValue.map((date) => getISODateString(date));
    }
    // Single
    else {
      this.internalValue = getISODateString(newValue);
    }
    this.pickerRef.value = newValue;
    this.errorState = false;
    this.selectDate.emit(this.internalValue);
    this.announceDateChange(this.internalValue);
  }
  formatInput(enabled, useInputValue = true) {
    if (this.formatInputOnAccept === false || enabled === false) {
      if (this.internalValue) {
        if (this.internalValue.length === 0)
          return;
        this.inputRef.value = this.internalValue
          .toString()
          .replace(",", ` ${this.inclusiveDatesLabels.to} `);
      }
      return;
    }
    if (this.internalValue &&
      this.formatInputOnAccept === true &&
      this.errorState === false) {
      if (Array.isArray(this.internalValue)) {
        if (this.internalValue.length === 0)
          return; // Range date is invalid, leave the text field as is
        let output = "";
        this.internalValue.forEach((value, index) => {
          return (output += `${index === 1 ? ` ${this.inclusiveDatesLabels.to} ` : ""}${Intl.DateTimeFormat(this.locale, {
            day: "numeric",
            month: "short",
            year: "numeric"
          }).format(removeTimezoneOffset(new Date(useInputValue ? this.inputRef.value : value)))}`);
        });
        this.inputRef.value = output;
      }
      else {
        this.inputRef.value = Intl.DateTimeFormat(this.locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(removeTimezoneOffset(new Date(useInputValue ? this.inputRef.value : this.internalValue)));
      }
    }
    else if (this.internalValue &&
      this.internalValue.length > 0 &&
      this.errorState === false)
      this.inputRef.value = this.internalValue.toString();
  }
  handlePickerSelection(newValue) {
    if (this.isRangeValue(newValue)) {
      if (newValue.length === 2)
        this.modalRef.close();
      this.internalValue = newValue;
      this.errorState = false;
      if (document.activeElement !== this.inputRef) {
        this.formatInput(true, false);
      }
      this.announceDateChange(this.internalValue);
    }
    else {
      this.modalRef.close();
      this.inputRef.value = newValue;
      this.internalValue = newValue;
      this.errorState = false;
      if (document.activeElement !== this.inputRef) {
        this.formatInput(true, false);
      }
      this.announceDateChange(this.internalValue);
    }
  }
  announceDateChange(newValue) {
    let content = "";
    if (Array.isArray(newValue)) {
      if (newValue.length === 1) {
        content += `${this.inclusiveDatesLabels.startDate} `;
      }
      newValue.forEach((value, index) => (content += `${index === 1 ? ` ${this.inclusiveDatesLabels.to} ` : ""}${Intl.DateTimeFormat(this.locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(removeTimezoneOffset(new Date(value)))}`));
    }
    else
      content = Intl.DateTimeFormat(this.locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(removeTimezoneOffset(new Date(newValue)));
    if (content.length === 0)
      return;
    content += ` ${this.inclusiveDatesLabels.selected}`;
    const contentNoCommas = content.replace(/\,/g, "");
    announce(contentNoCommas, "polite");
  }
  watchHasError(newValue) {
    this.hasError = newValue;
  }
  watchLocale(newValue) {
    this.locale = newValue;
  }
  watchLabel(newValue) {
    this.label = newValue;
  }
  watchDisabled(newValue) {
    this.disabledState = newValue;
    this.disabled = newValue;
  }
  watchRange(newValue) {
    this.range = newValue;
  }
  watchWeekNumbers(newValue) {
    this.weekNumbers = newValue;
  }
  watchMinDate(newValue) {
    this.minDate = newValue;
  }
  watchMaxDate(newValue) {
    this.maxDate = newValue;
  }
  watchValue() {
    if (Boolean(this.value) && !this.isRangeValue(this.value)) {
      this.internalValue = this.value;
    }
  }
  getClassName(element) {
    return Boolean(element)
      ? `${this.elementClassName}__${element}`
      : this.elementClassName;
  }
  render() {
    var _a;
    return (h(Host, null, h("label", { htmlFor: this.id ? `${this.id}-input` : undefined, class: this.getClassName("label") }, this.label), h("br", null), h("div", { class: this.getClassName("input-container") }, h("input", { disabled: this.disabledState, id: this.id ? `${this.id}-input` : undefined, type: "text", placeholder: this.placeholder, class: this.getClassName("input"), ref: (r) => (this.inputRef = r), onChange: this.handleChange, onFocus: () => this.formatInput(false), onBlur: () => this.formatInput(true, false), "aria-describedby": this.errorState ? `${this.id}-error` : undefined, "aria-invalid": this.errorState }), !this.inline && (h("button", { type: "button", ref: (r) => (this.calendarButtonRef = r), onClick: this.handleCalendarButtonClick, class: this.getClassName("calendar-button"), disabled: this.disabledState }, this.inclusiveDatesLabels.openCalendar))), h("inclusive-dates-modal", { label: this.inclusiveDatesLabels.calendar, ref: (el) => (this.modalRef = el), onOpened: () => {
        this.pickerRef.modalIsOpen = true;
      }, onClosed: () => {
        this.pickerRef.modalIsOpen = false;
      }, inline: this.inline }, h("inclusive-dates-calendar", { range: this.range, locale: this.locale, onSelectDate: (event) => this.handlePickerSelection(event.detail), onChangeMonth: (event) => this.handleChangedMonths(event.detail), labels: this.inclusiveDatesCalendarLabels
        ? this.inclusiveDatesCalendarLabels
        : undefined, ref: (el) => (this.pickerRef = el), startDate: this.startDate, firstDayOfWeek: this.firstDayOfWeek, showHiddenTitle: true, disabled: this.disabledState, showMonthStepper: this.showMonthStepper, showYearStepper: this.showYearStepper, showClearButton: this.showClearButton, showKeyboardHint: this.showKeyboardHint, disableDate: this.disableDate, minDate: this.minDate, maxDate: this.maxDate, inline: this.inline, weekNumbers: this.weekNumbers, weekNumbersSymbol: this.weekNumbersSymbol })), this.showQuickButtons &&
      ((_a = this.quickButtons) === null || _a === void 0 ? void 0 : _a.length) > 0 &&
      this.chronoSupportedLocale && (h("div", { class: this.getClassName("quick-group"), role: "group", "aria-label": "Quick selection" }, this.quickButtons.map((buttonText) => {
      return (h("button", { class: this.getClassName("quick-button"), onClick: this.handleQuickButtonClick, disabled: this.disabledState, type: "button" }, buttonText));
    }))), this.errorState && (h("div", { class: this.getClassName("input-error"), id: this.id ? `${this.id}-error` : undefined, role: "status" }, this.errorMessage))));
  }
  static get is() { return "inclusive-dates"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() {
    return {
      "$": ["inclusive-dates.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["inclusive-dates.css"]
    };
  }
  static get properties() {
    return {
      "id": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "id",
        "reflect": true
      },
      "value": {
        "type": "string",
        "mutable": true,
        "complexType": {
          "original": "string | string[]",
          "resolved": "string | string[]",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "value",
        "reflect": false
      },
      "range": {
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
        "attribute": "range",
        "reflect": false,
        "defaultValue": "false"
      },
      "label": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "label",
        "reflect": false,
        "defaultValue": "this.range\n    ? \"Choose a date range (any way you like)\"\n    : \"Choose a date (any way you like)\""
      },
      "placeholder": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "placeholder",
        "reflect": false,
        "defaultValue": "this.range\n    ? `Try \"June 8 to 12\"`\n    : `Try \"tomorrrow\" or \"in ten days\"`"
      },
      "locale": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "locale",
        "reflect": false,
        "defaultValue": "navigator?.language || \"en-US\""
      },
      "disabled": {
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
        "attribute": "disabled",
        "reflect": false,
        "defaultValue": "false"
      },
      "minDate": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "min-date",
        "reflect": false
      },
      "maxDate": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "max-date",
        "reflect": false
      },
      "startDate": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "start-date",
        "reflect": false,
        "defaultValue": "getISODateString(new Date())"
      },
      "referenceDate": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "reference-date",
        "reflect": false,
        "defaultValue": "getISODateString(new Date())"
      },
      "useStrictDateParsing": {
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
        "attribute": "use-strict-date-parsing",
        "reflect": false,
        "defaultValue": "false"
      },
      "inclusiveDatesLabels": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "InclusiveDatesLabels",
          "resolved": "InclusiveDatesLabels",
          "references": {
            "InclusiveDatesLabels": {
              "location": "local"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "defaultValue": "defaultLabels"
      },
      "inclusiveDatesCalendarLabels": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "InclusiveDatesCalendarLabels",
          "resolved": "{ clearButton: string; monthSelect: string; nextMonthButton: string; nextYearButton: string; picker: string; previousMonthButton: string; previousYearButton: string; todayButton: string; yearSelect: string; keyboardHint: string; selected: string; chooseAsStartDate: string; chooseAsEndDate: string; }",
          "references": {
            "InclusiveDatesCalendarLabels": {
              "location": "import",
              "path": "../inclusive-dates-calendar/inclusive-dates-calendar"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        }
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
      },
      "weekNumbers": {
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
        "attribute": "week-numbers",
        "reflect": false,
        "defaultValue": "false"
      },
      "hasError": {
        "type": "boolean",
        "mutable": true,
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
        "attribute": "has-error",
        "reflect": false,
        "defaultValue": "false"
      },
      "nextMonthButtonContent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "next-month-button-content",
        "reflect": false
      },
      "nextYearButtonContent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "next-year-button-content",
        "reflect": false
      },
      "showYearStepper": {
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
        "attribute": "show-year-stepper",
        "reflect": false,
        "defaultValue": "false"
      },
      "showMonthStepper": {
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
        "attribute": "show-month-stepper",
        "reflect": false,
        "defaultValue": "true"
      },
      "showClearButton": {
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
        "attribute": "show-clear-button",
        "reflect": false,
        "defaultValue": "true"
      },
      "showTodayButton": {
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
        "attribute": "show-today-button",
        "reflect": false,
        "defaultValue": "true"
      },
      "formatInputOnAccept": {
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
        "attribute": "input-should-format",
        "reflect": false,
        "defaultValue": "true"
      },
      "showKeyboardHint": {
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
        "attribute": "show-keyboard-hint",
        "reflect": false,
        "defaultValue": "true"
      },
      "disableDate": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "HTMLInclusiveDatesCalendarElement[\"disableDate\"]",
          "resolved": "(date: Date) => boolean",
          "references": {
            "HTMLInclusiveDatesCalendarElement": {
              "location": "global"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "defaultValue": "() =>\n    false"
      },
      "elementClassName": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "element-class-name",
        "reflect": false,
        "defaultValue": "\"inclusive-dates\""
      },
      "firstDayOfWeek": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "first-day-of-week",
        "reflect": false,
        "defaultValue": "1"
      },
      "quickButtons": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "string[]",
          "resolved": "string[]",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "defaultValue": "this.range\n    ? [\"Monday to Wednesday\", \"July 5 to 10\"]\n    : [\"Yesterday\", \"Today\", \"Tomorrow\", \"In 10 days\"]"
      },
      "todayButtonContent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "today-button-content",
        "reflect": false
      },
      "showQuickButtons": {
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
        "attribute": "show-quick-buttons",
        "reflect": false,
        "defaultValue": "true"
      },
      "weekNumbersSymbol": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "week-numbers-symbol",
        "reflect": false,
        "defaultValue": "\"#\""
      }
    };
  }
  static get states() {
    return {
      "internalValue": {},
      "errorState": {},
      "disabledState": {}
    };
  }
  static get events() {
    return [{
        "method": "selectDate",
        "name": "selectDate",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "string | string[] | undefined",
          "resolved": "string | string[]",
          "references": {}
        }
      }, {
        "method": "componentReady",
        "name": "componentReady",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }];
  }
  static get methods() {
    return {
      "parseDate": {
        "complexType": {
          "signature": "(text: string, shouldSetValue?: boolean, chronoOptions?: ChronoOptions) => Promise<ChronoParsedDateString>",
          "parameters": [{
              "tags": [],
              "text": ""
            }, {
              "tags": [],
              "text": ""
            }, {
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "ChronoParsedDateString": {
              "location": "import",
              "path": "../../utils/chrono-parser/chrono-parser.type"
            },
            "ChronoOptions": {
              "location": "import",
              "path": "../../utils/chrono-parser/chrono-parser.type"
            }
          },
          "return": "Promise<ChronoParsedDateString>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "el"; }
  static get watchers() {
    return [{
        "propName": "hasError",
        "methodName": "watchHasError"
      }, {
        "propName": "locale",
        "methodName": "watchLocale"
      }, {
        "propName": "label",
        "methodName": "watchLabel"
      }, {
        "propName": "disabled",
        "methodName": "watchDisabled"
      }, {
        "propName": "range",
        "methodName": "watchRange"
      }, {
        "propName": "weekNumbers",
        "methodName": "watchWeekNumbers"
      }, {
        "propName": "minDate",
        "methodName": "watchMinDate"
      }, {
        "propName": "maxDate",
        "methodName": "watchMaxDate"
      }, {
        "propName": "value",
        "methodName": "watchValue"
      }];
  }
}
