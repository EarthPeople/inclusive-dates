import { EventEmitter } from "../../stencil-public-runtime";
export declare type InclusiveDatesCalendarLabels = {
  clearButton: string;
  monthSelect: string;
  nextMonthButton: string;
  nextYearButton: string;
  picker: string;
  previousMonthButton: string;
  previousYearButton: string;
  todayButton: string;
  yearSelect: string;
  keyboardHint: string;
  selected: string;
  chooseAsStartDate: string;
  chooseAsEndDate: string;
};
export interface MonthChangedEventDetails {
  month: number;
  year: number;
}
export declare class InclusiveDatesCalendar {
  el: HTMLElement;
  clearButtonContent?: string;
  disabled?: boolean;
  modalIsOpen?: boolean;
  disableDate?: (date: Date) => boolean;
  elementClassName?: string;
  firstDayOfWeek?: number;
  range?: boolean;
  labels?: InclusiveDatesCalendarLabels;
  locale?: string;
  nextMonthButtonContent?: string;
  nextYearButtonContent?: string;
  previousMonthButtonContent?: string;
  previousYearButtonContent?: string;
  minDate?: string;
  maxDate?: string;
  inline?: boolean;
  weekNumbers?: boolean;
  showClearButton?: boolean;
  showMonthStepper?: boolean;
  showTodayButton?: boolean;
  showYearStepper?: boolean;
  showKeyboardHint?: boolean;
  showHiddenTitle?: boolean;
  startDate?: string;
  todayButtonContent?: string;
  value?: Date | Date[];
  currentDate: Date;
  hoveredDate: Date;
  weekdays: string[][];
  selectDate: EventEmitter<string | string[] | undefined>;
  changeMonth: EventEmitter<MonthChangedEventDetails>;
  private moveFocusAfterMonthChanged;
  private moveFocusOnModalOpen;
  componentWillLoad(): void;
  watchModalIsOpen(): void;
  watchFirstDayOfWeek(): void;
  watchLocale(): void;
  watchRange(): void;
  watchWeekNumbers(newValue: any): void;
  watchStartDate(): void;
  watchValue(): void;
  watchMinDate(newValue: any): void;
  watchMaxDate(newValue: any): void;
  componentDidRender(): void;
  private init;
  private updateWeekdays;
  private getClassName;
  private getCalendarRows;
  private getTitle;
  private focusDate;
  private updateCurrentDate;
  private onSelectDate;
  private isRangeValue;
  private nextMonth;
  private nextYear;
  private previousMonth;
  private previousYear;
  private showToday;
  private clear;
  private onClick;
  private onMonthSelect;
  private onYearSelect;
  private onKeyDown;
  private onMouseEnter;
  private onMouseLeave;
  render(): any;
}