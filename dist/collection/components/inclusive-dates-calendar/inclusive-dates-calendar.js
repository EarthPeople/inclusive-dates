import { h, Host } from "@stencil/core";
import { addDays, dateIsWithinLowerBounds, dateIsWithinUpperBounds, getDaysOfMonth, getFirstOfMonth, getISODateString, getLastOfMonth, getMonth, getMonths, getNextDay, getNextMonth, getNextYear, getPreviousDay, getPreviousMonth, getPreviousYear, getWeekDays, getISOWeek, getYear, isDateInRange, isSameDay, monthIsDisabled, removeTimezoneOffset, subDays } from "../../utils/utils";
import { dateIsWithinBounds } from "../../utils/utils";
const defaultLabels = {
  clearButton: "Clear value",
  monthSelect: "Select month",
  nextMonthButton: "Next month",
  nextYearButton: "Next year",
  picker: "Choose date",
  previousMonthButton: "Previous month",
  previousYearButton: "Previous year",
  todayButton: "Show today",
  yearSelect: "Select year",
  keyboardHint: "Keyboard commands",
  selected: "Selected date",
  chooseAsStartDate: "choose as start date",
  chooseAsEndDate: "choose as end date"
};
export class InclusiveDatesCalendar {
  constructor() {
    this.disabled = false;
    this.modalIsOpen = false;
    this.disableDate = () => false;
    this.elementClassName = "inclusive-dates-calendar";
    this.firstDayOfWeek = 0;
    this.range = false;
    this.labels = defaultLabels;
    this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || "en-US";
    this.inline = false;
    this.weekNumbers = false;
    this.showClearButton = false;
    this.showMonthStepper = true;
    this.showTodayButton = true;
    this.showYearStepper = false;
    this.showKeyboardHint = false;
    this.showHiddenTitle = true;
    this.startDate = getISODateString(new Date());
    this.weekNumbersSymbol = "#";
    this.init = () => {
      this.currentDate = this.startDate
        ? removeTimezoneOffset(new Date(this.startDate))
        : new Date();
      this.updateWeekdays();
    };
    this.nextMonth = () => {
      this.updateCurrentDate(getNextMonth(this.currentDate));
    };
    this.nextYear = () => {
      this.updateCurrentDate(getNextYear(this.currentDate));
    };
    this.previousMonth = () => {
      this.updateCurrentDate(getPreviousMonth(this.currentDate));
    };
    this.previousYear = () => {
      this.updateCurrentDate(getPreviousYear(this.currentDate));
    };
    this.showToday = () => {
      this.updateCurrentDate(new Date(), true);
    };
    this.clear = () => {
      this.value = undefined;
      this.selectDate.emit(undefined);
    };
    this.onClick = (event) => {
      if (this.disabled) {
        return;
      }
      const target = event.target.closest("[data-date]");
      if (!Boolean(target)) {
        return;
      }
      const date = removeTimezoneOffset(new Date(target.dataset.date));
      this.updateCurrentDate(date);
      this.onSelectDate(date);
    };
    this.onMonthSelect = (event) => {
      const month = +event.target.value - 1;
      const date = new Date(this.currentDate);
      if (!dateIsWithinBounds(date, this.minDate, this.maxDate))
        return;
      date.setMonth(month);
      this.updateCurrentDate(date);
    };
    this.onYearSelect = (event) => {
      const year = +event.target.value;
      const date = new Date(this.currentDate);
      if (!dateIsWithinBounds(date, this.minDate, this.maxDate))
        return;
      date.setFullYear(year);
      this.updateCurrentDate(date);
    };
    this.onKeyDown = (event) => {
      if (this.disabled) {
        return;
      }
      if (event.code === "ArrowLeft") {
        event.preventDefault();
        this.updateCurrentDate(getPreviousDay(this.currentDate), true);
      }
      else if (event.code === "ArrowRight") {
        event.preventDefault();
        this.updateCurrentDate(getNextDay(this.currentDate), true);
      }
      else if (event.code === "ArrowUp") {
        event.preventDefault();
        this.updateCurrentDate(subDays(this.currentDate, 7), true);
      }
      else if (event.code === "ArrowDown") {
        event.preventDefault();
        this.updateCurrentDate(addDays(this.currentDate, 7), true);
      }
      else if (event.code === "PageUp") {
        event.preventDefault();
        if (event.shiftKey) {
          this.updateCurrentDate(getPreviousYear(this.currentDate), true);
        }
        else {
          this.updateCurrentDate(getPreviousMonth(this.currentDate), true);
        }
      }
      else if (event.code === "PageDown") {
        event.preventDefault();
        if (event.shiftKey) {
          this.updateCurrentDate(getNextYear(this.currentDate), true);
        }
        else {
          this.updateCurrentDate(getNextMonth(this.currentDate), true);
        }
      }
      else if (event.code === "Home") {
        event.preventDefault();
        this.updateCurrentDate(getFirstOfMonth(this.currentDate), true);
      }
      else if (event.code === "End") {
        event.preventDefault();
        this.updateCurrentDate(getLastOfMonth(this.currentDate), true);
      }
      else if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        this.onSelectDate(this.currentDate);
      }
    };
    this.onMouseEnter = (event) => {
      if (this.disabled) {
        return;
      }
      const date = removeTimezoneOffset(new Date(event.target.closest("td").dataset.date));
      this.hoveredDate = date;
    };
    this.onMouseLeave = () => {
      this.hoveredDate = undefined;
    };
  }
  componentWillLoad() {
    this.init();
  }
  watchModalIsOpen() {
    if (this.modalIsOpen === true) {
      this.moveFocusOnModalOpen = true;
    }
  }
  watchFirstDayOfWeek() {
    this.updateWeekdays();
  }
  watchLocale() {
    if (!Boolean(this.locale)) {
      this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || "en-US";
    }
    this.updateWeekdays();
  }
  watchRange() {
    this.value = undefined;
    this.selectDate.emit(undefined);
  }
  watchWeekNumbers(newValue) {
    console.log(newValue);
    this.weekNumbers = newValue;
  }
  watchStartDate() {
    this.currentDate = this.startDate
      ? removeTimezoneOffset(new Date(this.startDate))
      : new Date();
  }
  watchValue() {
    if (Boolean(this.value)) {
      if (Array.isArray(this.value) && this.value.length >= 1) {
        this.currentDate = this.value[0];
      }
      else if (this.value instanceof Date) {
        this.currentDate = this.value;
      }
    }
  }
  watchMinDate(newValue) {
    this.minDate = newValue;
    // this.updateCurrentDate(this.currentDate);
  }
  watchMaxDate(newValue) {
    this.maxDate = newValue;
    // this.updateCurrentDate(this.currentDate);
  }
  componentDidRender() {
    if (this.moveFocusAfterMonthChanged) {
      this.focusDate(this.currentDate);
      this.moveFocusAfterMonthChanged = false;
    }
    if (this.moveFocusOnModalOpen) {
      // Timeout added to stop VoiceOver from crashing Safari when openin the calendar. TODO: Investigate a neater solution
      setTimeout(() => {
        this.focusDate(this.currentDate);
        this.moveFocusOnModalOpen = false;
      }, 100);
    }
  }
  updateWeekdays() {
    this.weekdays = getWeekDays(this.firstDayOfWeek, this.locale);
  }
  getClassName(element) {
    return Boolean(element)
      ? `${this.elementClassName}__${element}`
      : this.elementClassName;
  }
  getCalendarRows() {
    const daysOfMonth = getDaysOfMonth(this.currentDate, true, this.firstDayOfWeek === 0 ? 7 : this.firstDayOfWeek);
    const calendarRows = [];
    for (let i = 0; i < daysOfMonth.length; i += 7) {
      const row = daysOfMonth.slice(i, i + 7);
      calendarRows.push(row);
    }
    return calendarRows;
  }
  getTitle() {
    if (!Boolean(this.currentDate)) {
      return;
    }
    return Intl.DateTimeFormat(this.locale, {
      month: "long",
      year: "numeric"
    }).format(this.currentDate);
  }
  focusDate(date) {
    var _a;
    (_a = this.el
      .querySelector(`[data-date="${getISODateString(date)}"]`)) === null || _a === void 0 ? void 0 : _a.focus();
  }
  updateCurrentDate(date, moveFocus) {
    const month = date.getMonth();
    const year = date.getFullYear();
    if (!dateIsWithinLowerBounds(date, this.minDate))
      date = new Date(this.minDate);
    if (!dateIsWithinUpperBounds(date, this.maxDate))
      date = new Date(this.maxDate);
    const monthChanged = month !== this.currentDate.getMonth() ||
      year !== this.currentDate.getFullYear();
    if (monthChanged) {
      this.changeMonth.emit({ month: getMonth(date), year: getYear(date) });
      if (moveFocus) {
        this.moveFocusAfterMonthChanged = true;
      }
    }
    this.currentDate = date;
    if (moveFocus) {
      this.focusDate(this.currentDate);
    }
  }
  onSelectDate(date) {
    var _a, _b;
    if (this.disableDate(date) ||
      !dateIsWithinBounds(date, this.minDate, this.maxDate)) {
      return;
    }
    if (this.isRangeValue(this.value)) {
      const newValue = ((_a = this.value) === null || _a === void 0 ? void 0 : _a[0]) === undefined || this.value.length === 2
        ? [date]
        : [this.value[0], date];
      if (newValue.length === 2 && newValue[0] > newValue[1]) {
        newValue.reverse();
      }
      const isoValue = newValue[1] === undefined
        ? [getISODateString(newValue[0])]
        : [getISODateString(newValue[0]), getISODateString(newValue[1])];
      this.value = newValue;
      this.selectDate.emit(isoValue);
    }
    else {
      if (((_b = this.value) === null || _b === void 0 ? void 0 : _b.getTime()) === date.getTime()) {
        return;
      }
      this.value = date;
      this.selectDate.emit(getISODateString(date));
    }
  }
  // @ts-ignore
  isRangeValue(value) {
    return this.range;
  }
  render() {
    const showFooter = this.showTodayButton || this.showClearButton || this.showKeyboardHint;
    return (h(Host, null, h("div", { class: {
        [this.getClassName()]: true,
        [`${this.getClassName()}--disabled`]: this.disabled,
        [this.getClassName("inline")]: this.inline
      } }, h("div", { class: this.getClassName("header") }, this.showHiddenTitle && (h("span", { "aria-atomic": "true", "aria-live": "polite", class: "visually-hidden" }, this.getTitle())), this.showYearStepper && (h("button", { "aria-label": this.labels.previousYearButton, class: this.getClassName("previous-year-button"), "aria-disabled": this.disabled ||
        new Date(this.minDate).getFullYear() >
          getPreviousYear(this.currentDate).getFullYear(), innerHTML: this.previousYearButtonContent || undefined, onClick: this.previousYear, type: "button" }, h("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { points: "11 17 6 12 11 7" }), h("polyline", { points: "18 17 13 12 18 7" })))), this.showMonthStepper && (h("button", { "aria-label": this.labels.previousMonthButton, class: this.getClassName("previous-month-button"), "aria-disabled": this.disabled ||
        monthIsDisabled(getPreviousMonth(this.currentDate).getMonth(), getPreviousMonth(this.currentDate).getFullYear(), this.minDate, this.maxDate), innerHTML: this.previousMonthButtonContent || undefined, onClick: this.previousMonth, type: "button" }, h("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { points: "15 18 9 12 15 6" })))), h("span", { class: this.getClassName("current-month") }, h("select", { "aria-label": this.labels.monthSelect, class: this.getClassName("month-select"), "aria-disabled": this.disabled, name: "month", onChange: this.onMonthSelect }, getMonths(this.locale).map((month, index) => {
      return (h("option", { key: month, selected: this.currentDate.getMonth() === index, value: index + 1, disabled: monthIsDisabled(index, this.currentDate.getFullYear(), this.minDate, this.maxDate) }, month));
    })), h("input", { "aria-label": this.labels.yearSelect, class: this.getClassName("year-select"), "aria-disabled": this.disabled, max: this.maxDate ? this.maxDate.slice(0, 4) : 9999, min: this.minDate ? this.minDate.slice(0, 4) : 1, name: "year", onChange: this.onYearSelect, type: "number", value: this.currentDate.getFullYear() })), this.showMonthStepper && (h("button", { "aria-label": this.labels.nextMonthButton, class: this.getClassName("next-month-button"), "aria-disabled": this.disabled ||
        monthIsDisabled(getNextMonth(this.currentDate).getMonth(), getNextMonth(this.currentDate).getFullYear(), this.minDate, this.maxDate), innerHTML: this.nextMonthButtonContent || undefined, onClick: this.nextMonth, type: "button" }, h("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { points: "9 18 15 12 9 6" })))), this.showYearStepper && (h("button", { "aria-label": this.labels.nextYearButton, class: this.getClassName("next-year-button"), "aria-disabled": this.disabled ||
        new Date(this.maxDate).getFullYear() <
          getNextYear(this.currentDate).getFullYear(), innerHTML: this.nextYearButtonContent || undefined, onClick: this.nextYear, type: "button" }, h("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { points: "13 17 18 12 13 7" }), h("polyline", { points: "6 17 11 12 6 7" }))))), h("div", { class: this.getClassName("body") }, h("table", { class: this.getClassName("calendar"), onKeyDown: this.onKeyDown, role: "grid", "aria-label": this.getTitle() }, h("thead", { class: this.getClassName("calendar-header") }, h("tr", { class: this.getClassName("weekday-row") }, this.weekNumbers ? (h("th", { role: "columnheader", class: this.getClassName("week"), key: "week", scope: "col" }, h("span", { "aria-hidden": "true" }, this.weekNumbersSymbol), h("span", { class: "visually-hidden" }, "Week"))) : null, this.weekdays.map((weekday) => (h("th", { role: "columnheader", abbr: weekday[1], class: this.getClassName("weekday"), key: weekday[0], scope: "col" }, h("span", { "aria-hidden": "true" }, weekday[0]), h("span", { class: "visually-hidden" }, weekday[1])))))), h("tbody", null, this.getCalendarRows().map((calendarRow) => {
      const rowKey = `row-${calendarRow[0].getMonth()}-${calendarRow[0].getDate()}`;
      const weekNumber = this.weekNumbers
        ? getISOWeek(calendarRow[0])
        : "";
      return (h("tr", { class: this.getClassName("calendar-row"), key: rowKey }, this.weekNumbers ? (h("td", { "aria-label": `Week ${weekNumber}`, class: {
          [this.getClassName("date")]: true,
          [this.getClassName("week")]: true
        }, key: `cell-week-${weekNumber}`, role: "gridcell", tabIndex: -1 }, h("span", { "aria-hidden": "true" }, weekNumber), h("span", { class: "visually-hidden" }, "Week ", weekNumber))) : null, calendarRow.map((day) => {
        var _a, _b;
        const isCurrent = isSameDay(day, this.currentDate);
        const isOverflowing = day.getMonth() !== this.currentDate.getMonth();
        const isSelected = Array.isArray(this.value)
          ? isSameDay(day, this.value[0]) ||
            (this.value[1] &&
              dateIsWithinBounds(day, getISODateString(this.value[0]), getISODateString(this.value[1])))
          : isSameDay(day, this.value);
        const isDisabled = this.disableDate(day) ||
          !dateIsWithinBounds(day, this.minDate, this.maxDate);
        const isInRange = !this.isRangeValue
          ? false
          : isDateInRange(day, {
            from: (_a = this.value) === null || _a === void 0 ? void 0 : _a[0],
            to: ((_b = this.value) === null || _b === void 0 ? void 0 : _b[1]) ||
              this.hoveredDate ||
              this.currentDate
          }) && !isDisabled;
        const isToday = isSameDay(day, new Date());
        const cellKey = `cell-${day.getMonth()}-${day.getDate()}`;
        const getScreenReaderText = () => {
          if (this.range) {
            let suffix = !this.value
              ? `, ${this.labels.chooseAsStartDate}.`
              : "";
            if (Array.isArray(this.value)) {
              suffix = {
                1: `, ${this.labels.chooseAsEndDate}.`,
                2: `, ${this.labels.chooseAsStartDate}.`
              }[this.value.length];
            }
            return `${isSelected ? `${this.labels.selected}, ` : ""}${Intl.DateTimeFormat(this.locale, {
              day: "numeric",
              month: "long",
              year: "numeric"
            }).format(day)}${suffix}`;
          }
          else {
            return `${isSelected ? `${this.labels.selected}, ` : ""}${Intl.DateTimeFormat(this.locale, {
              day: "numeric",
              month: "long",
              year: "numeric"
            }).format(day)}`;
          }
        };
        const className = {
          [this.getClassName("date")]: true,
          [this.getClassName("date--current")]: isCurrent,
          [this.getClassName("date--disabled")]: isDisabled,
          [this.getClassName("date--overflowing")]: isOverflowing,
          [this.getClassName("date--today")]: isToday,
          [this.getClassName("date--selected")]: isSelected,
          [this.getClassName("date--in-range")]: isInRange,
          [this.getClassName("date--before-min")]: !dateIsWithinLowerBounds(day, this.minDate),
          [this.getClassName("date--after-max")]: !dateIsWithinUpperBounds(day, this.maxDate)
        };
        const Tag = isSelected
          ? "strong"
          : isToday
            ? "em"
            : "span";
        return (h("td", { "aria-disabled": String(isDisabled), "aria-selected": isSelected ? "true" : undefined, class: className, "data-date": getISODateString(day), key: cellKey, onClick: this.onClick, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, role: "gridcell", tabIndex: isSameDay(day, this.currentDate) && !this.disabled
            ? 0
            : -1 }, h(Tag, { "aria-hidden": "true" }, day.getDate()), h("span", { class: "visually-hidden" }, getScreenReaderText())));
      })));
    })))), showFooter && (h("div", { class: this.getClassName("footer") }, h("div", { class: this.getClassName("footer-buttons") }, this.showTodayButton && (h("button", { class: this.getClassName("today-button"), disabled: this.disabled, innerHTML: this.todayButtonContent || undefined, onClick: this.showToday, type: "button" }, this.labels.todayButton)), this.showClearButton && (h("button", { class: this.getClassName("clear-button"), disabled: this.disabled, innerHTML: this.clearButtonContent || undefined, onClick: this.clear, type: "button" }, this.labels.clearButton))), this.showKeyboardHint &&
      !window.matchMedia("(pointer: coarse)").matches && (h("button", { type: "button", onClick: () => alert("Todo: Add Keyboard helper!"), class: this.getClassName("keyboard-hint") }, h("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", width: "1em", viewBox: "0 0 48 48", fill: "currentColor" }, h("path", { d: "M7 38q-1.2 0-2.1-.925Q4 36.15 4 35V13q0-1.2.9-2.1.9-.9 2.1-.9h34q1.2 0 2.1.9.9.9.9 2.1v22q0 1.15-.9 2.075Q42.2 38 41 38Zm0-3h34V13H7v22Zm8-3.25h18v-3H15Zm-4.85-6.25h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3Zm-24.7-6.25h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3ZM7 35V13v22Z" })), this.labels.keyboardHint)))))));
  }
  static get is() { return "inclusive-dates-calendar"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() {
    return {
      "$": ["inclusive-dates-calendar.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["inclusive-dates-calendar.css"]
    };
  }
  static get properties() {
    return {
      "clearButtonContent": {
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
        "attribute": "clear-button-content",
        "reflect": false
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
      "modalIsOpen": {
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
        "attribute": "modal-is-open",
        "reflect": false,
        "defaultValue": "false"
      },
      "disableDate": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "(date: Date) => boolean",
          "resolved": "(date: Date) => boolean",
          "references": {
            "Date": {
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
        "defaultValue": "() => false"
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
        "defaultValue": "\"inclusive-dates-calendar\""
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
        "defaultValue": "0"
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
      "labels": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "InclusiveDatesCalendarLabels",
          "resolved": "{ clearButton: string; monthSelect: string; nextMonthButton: string; nextYearButton: string; picker: string; previousMonthButton: string; previousYearButton: string; todayButton: string; yearSelect: string; keyboardHint: string; selected: string; chooseAsStartDate: string; chooseAsEndDate: string; }",
          "references": {
            "InclusiveDatesCalendarLabels": {
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
      "previousMonthButtonContent": {
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
        "attribute": "previous-month-button-content",
        "reflect": false
      },
      "previousYearButtonContent": {
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
        "attribute": "previous-year-button-content",
        "reflect": false
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
        "defaultValue": "false"
      },
      "showHiddenTitle": {
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
        "attribute": "show-hidden-title",
        "reflect": false,
        "defaultValue": "true"
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
      "value": {
        "type": "unknown",
        "mutable": true,
        "complexType": {
          "original": "Date | Date[]",
          "resolved": "Date | Date[]",
          "references": {
            "Date": {
              "location": "global"
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
      "currentDate": {},
      "hoveredDate": {},
      "weekdays": {}
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
        "method": "changeMonth",
        "name": "changeMonth",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "MonthChangedEventDetails",
          "resolved": "MonthChangedEventDetails",
          "references": {
            "MonthChangedEventDetails": {
              "location": "local"
            }
          }
        }
      }];
  }
  static get elementRef() { return "el"; }
  static get watchers() {
    return [{
        "propName": "modalIsOpen",
        "methodName": "watchModalIsOpen"
      }, {
        "propName": "firstDayOfWeek",
        "methodName": "watchFirstDayOfWeek"
      }, {
        "propName": "locale",
        "methodName": "watchLocale"
      }, {
        "propName": "range",
        "methodName": "watchRange"
      }, {
        "propName": "weekNumbers",
        "methodName": "watchWeekNumbers"
      }, {
        "propName": "startDate",
        "methodName": "watchStartDate"
      }, {
        "propName": "value",
        "methodName": "watchValue"
      }, {
        "propName": "minDate",
        "methodName": "watchMinDate"
      }, {
        "propName": "maxDate",
        "methodName": "watchMaxDate"
      }];
  }
}
