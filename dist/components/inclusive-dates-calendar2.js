import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((Number(d) - Number(yearStart)) / 86400000 + 1) / 7);
  // return [d.getUTCFullYear(), weekNo];
  return weekNo;
}
function getDaysOfMonth(date, padded, firstDayOfWeek) {
  const days = [];
  const firstOfMonth = getFirstOfMonth(date);
  const firstDayMonth = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay();
  const lastOfMonth = getLastOfMonth(date);
  const lastDayOfMonth = lastOfMonth.getDay() === 0 ? 7 : lastOfMonth.getDay();
  const lastDayOfWeek = firstDayOfWeek === 1 ? 7 : firstDayOfWeek - 1;
  const leftPaddingDays = [];
  const rightPaddingDays = [];
  if (padded) {
    const leftPadding = (7 - firstDayOfWeek + firstDayMonth) % 7;
    let leftPaddingAmount = leftPadding;
    let leftPaddingDay = getPreviousDay(firstOfMonth);
    while (leftPaddingAmount > 0) {
      leftPaddingDays.push(leftPaddingDay);
      leftPaddingDay = getPreviousDay(leftPaddingDay);
      leftPaddingAmount -= 1;
    }
    leftPaddingDays.reverse();
    const rightPadding = (7 - lastDayOfMonth + lastDayOfWeek) % 7;
    let rightPaddingAmount = rightPadding;
    let rightPaddingDay = getNextDay(lastOfMonth);
    while (rightPaddingAmount > 0) {
      rightPaddingDays.push(rightPaddingDay);
      rightPaddingDay = getNextDay(rightPaddingDay);
      rightPaddingAmount -= 1;
    }
  }
  let currentDay = firstOfMonth;
  while (currentDay.getMonth() === date.getMonth()) {
    days.push(currentDay);
    currentDay = getNextDay(currentDay);
  }
  return [...leftPaddingDays, ...days, ...rightPaddingDays];
}
function getFirstOfMonth(date) {
  const firstOfMonth = removeTimezoneOffset(new Date(`${getYear(date)}-${String(getMonth(date)).padStart(2, "0")}-01`));
  return firstOfMonth;
}
function getISODateString(date) {
  if (!(date instanceof Date)) {
    return;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function getLastOfMonth(date) {
  const newDate = getFirstOfMonth(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(newDate.getDate() - 1);
  return newDate;
}
function getMonth(date) {
  return date.getMonth() + 1;
}
function getMonths(locale) {
  return new Array(12).fill(undefined).map((_, month) => {
    const date = removeTimezoneOffset(new Date(`2006-${String(month + 1).padStart(2, "0")}-01`));
    return Intl.DateTimeFormat(locale, {
      month: "long"
    }).format(date);
  });
}
function getNextDay(date) {
  return addDays(date, 1);
}
function getNextMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}
function getNextYear(date) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + 1);
  return newDate;
}
function getPreviousDay(date) {
  return subDays(date, 1);
}
function getPreviousMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
}
function getPreviousYear(date) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() - 1);
  return newDate;
}
function getWeekDays(firstDayOfWeek, locale) {
  return new Array(7)
    .fill(undefined)
    .map((_, index) => ((firstDayOfWeek + index) % 7) + 1)
    .map((day) => {
    const date = new Date(2006, 0, day);
    return [
      Intl.DateTimeFormat(locale, {
        weekday: "short"
      }).format(date),
      Intl.DateTimeFormat(locale, {
        weekday: "long"
      }).format(date)
    ];
  });
}
function getYear(date) {
  return date.getFullYear();
}
function isDateInRange(date, range) {
  if (!date || !range || !range.from || !range.to) {
    return false;
  }
  const earlyDate = range.from < range.to ? range.from : range.to;
  const laterDate = range.from < range.to ? range.to : range.from;
  return date >= earlyDate && date <= laterDate;
}
function isSameDay(date1, date2) {
  if (!date1 || !date2) {
    return false;
  }
  return (date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate());
}
function removeTimezoneOffset(date) {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  return newDate;
}
function subDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}
function dateIsWithinLowerBounds(date, minDate) {
  if (minDate) {
    const min = removeTimezoneOffset(new Date(minDate));
    return date >= min || isSameDay(min, date);
  }
  else
    return true;
}
function dateIsWithinUpperBounds(date, maxDate) {
  if (maxDate) {
    const max = removeTimezoneOffset(new Date(maxDate));
    return date <= max || isSameDay(date, max);
  }
  else
    return true;
}
function dateIsWithinBounds(date, minDate, maxDate) {
  return (dateIsWithinLowerBounds(date, minDate) &&
    dateIsWithinUpperBounds(date, maxDate));
}
function monthIsDisabled(month, year, minDate, maxDate) {
  const firstDate = new Date(year, month, 1);
  firstDate.setDate(firstDate.getDate() - 1);
  const lastDate = new Date(year, month + 1, 0);
  lastDate.setDate(firstDate.getDate() + 1);
  return (!dateIsWithinBounds(firstDate, minDate, maxDate) &&
    !dateIsWithinBounds(lastDate, minDate, maxDate));
}
function isValidISODate(dateString) {
  var isoFormat = /^\d{4}-\d{2}-\d{2}$/;
  if (dateString.match(isoFormat) == null) {
    return false;
  }
  else {
    var d = new Date(dateString);
    return !isNaN(d.getTime());
  }
}
function extractDates(text) {
  var dateRegex = /\d{4}-\d{2}-\d{2}/g;
  var matches = text.match(dateRegex);
  return matches.slice(0, 2);
}

const inclusiveDatesCalendarCss = ".visually-hidden.sc-inclusive-dates-calendar{position:absolute;overflow:hidden;width:1px;height:1px;white-space:nowrap;clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%)}";

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
const InclusiveDatesCalendar = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.selectDate = createEvent(this, "selectDate", 7);
    this.changeMonth = createEvent(this, "changeMonth", 7);
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
  get el() { return this; }
  static get watchers() { return {
    "modalIsOpen": ["watchModalIsOpen"],
    "firstDayOfWeek": ["watchFirstDayOfWeek"],
    "locale": ["watchLocale"],
    "range": ["watchRange"],
    "weekNumbers": ["watchWeekNumbers"],
    "startDate": ["watchStartDate"],
    "value": ["watchValue"],
    "minDate": ["watchMinDate"],
    "maxDate": ["watchMaxDate"]
  }; }
  static get style() { return inclusiveDatesCalendarCss; }
}, [2, "inclusive-dates-calendar", {
    "clearButtonContent": [1, "clear-button-content"],
    "disabled": [4],
    "modalIsOpen": [4, "modal-is-open"],
    "disableDate": [16],
    "elementClassName": [1, "element-class-name"],
    "firstDayOfWeek": [2, "first-day-of-week"],
    "range": [4],
    "labels": [16],
    "locale": [1],
    "nextMonthButtonContent": [1, "next-month-button-content"],
    "nextYearButtonContent": [1, "next-year-button-content"],
    "previousMonthButtonContent": [1, "previous-month-button-content"],
    "previousYearButtonContent": [1, "previous-year-button-content"],
    "minDate": [1, "min-date"],
    "maxDate": [1, "max-date"],
    "inline": [4],
    "weekNumbers": [4, "week-numbers"],
    "showClearButton": [4, "show-clear-button"],
    "showMonthStepper": [4, "show-month-stepper"],
    "showTodayButton": [4, "show-today-button"],
    "showYearStepper": [4, "show-year-stepper"],
    "showKeyboardHint": [4, "show-keyboard-hint"],
    "showHiddenTitle": [4, "show-hidden-title"],
    "startDate": [1, "start-date"],
    "todayButtonContent": [1, "today-button-content"],
    "value": [1040],
    "weekNumbersSymbol": [1, "week-numbers-symbol"],
    "currentDate": [32],
    "hoveredDate": [32],
    "weekdays": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["inclusive-dates-calendar"];
  components.forEach(tagName => { switch (tagName) {
    case "inclusive-dates-calendar":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, InclusiveDatesCalendar);
      }
      break;
  } });
}

export { InclusiveDatesCalendar as I, dateIsWithinLowerBounds as a, dateIsWithinUpperBounds as b, defineCustomElement as c, dateIsWithinBounds as d, extractDates as e, getISODateString as g, isValidISODate as i, removeTimezoneOffset as r };
