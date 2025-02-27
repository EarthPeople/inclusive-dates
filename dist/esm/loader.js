import { p as promiseResolve, b as bootstrapLazy } from './index-1da7b675.js';

/*
 Stencil Client Patch Esm v2.18.1 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return bootstrapLazy([["inclusive-dates_3",[[2,"inclusive-dates",{"id":[513],"value":[1025],"range":[4],"label":[1],"placeholder":[1],"locale":[1],"disabled":[4],"minDate":[1,"min-date"],"maxDate":[1,"max-date"],"startDate":[1,"start-date"],"referenceDate":[1,"reference-date"],"useStrictDateParsing":[4,"use-strict-date-parsing"],"inclusiveDatesLabels":[16],"inclusiveDatesCalendarLabels":[16],"inline":[4],"weekNumbers":[4,"week-numbers"],"hasError":[1028,"has-error"],"nextMonthButtonContent":[1,"next-month-button-content"],"nextYearButtonContent":[1,"next-year-button-content"],"showYearStepper":[4,"show-year-stepper"],"showMonthStepper":[4,"show-month-stepper"],"showClearButton":[4,"show-clear-button"],"showTodayButton":[4,"show-today-button"],"formatInputOnAccept":[4,"input-should-format"],"showKeyboardHint":[4,"show-keyboard-hint"],"disableDate":[16],"elementClassName":[1,"element-class-name"],"firstDayOfWeek":[2,"first-day-of-week"],"quickButtons":[16],"todayButtonContent":[1,"today-button-content"],"showQuickButtons":[4,"show-quick-buttons"],"internalValue":[32],"errorState":[32],"disabledState":[32],"parseDate":[64]}],[2,"inclusive-dates-calendar",{"clearButtonContent":[1,"clear-button-content"],"disabled":[4],"modalIsOpen":[4,"modal-is-open"],"disableDate":[16],"elementClassName":[1,"element-class-name"],"firstDayOfWeek":[2,"first-day-of-week"],"range":[4],"labels":[16],"locale":[1],"nextMonthButtonContent":[1,"next-month-button-content"],"nextYearButtonContent":[1,"next-year-button-content"],"previousMonthButtonContent":[1,"previous-month-button-content"],"previousYearButtonContent":[1,"previous-year-button-content"],"minDate":[1,"min-date"],"maxDate":[1,"max-date"],"inline":[4],"weekNumbers":[4,"week-numbers"],"showClearButton":[4,"show-clear-button"],"showMonthStepper":[4,"show-month-stepper"],"showTodayButton":[4,"show-today-button"],"showYearStepper":[4,"show-year-stepper"],"showKeyboardHint":[4,"show-keyboard-hint"],"showHiddenTitle":[4,"show-hidden-title"],"startDate":[1,"start-date"],"todayButtonContent":[1,"today-button-content"],"value":[1040],"weekNumbersSymbol":[1,"week-numbers-symbol"],"currentDate":[32],"hoveredDate":[32],"weekdays":[32]}],[1,"inclusive-dates-modal",{"label":[1],"inline":[4],"closing":[32],"showing":[32],"open":[64],"close":[64],"getState":[64],"setTriggerElement":[64]},[[10,"click","handleClick"]]]]]], options);
  });
};

export { defineCustomElements };
