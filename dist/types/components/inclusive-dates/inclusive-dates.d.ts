import { EventEmitter } from "../../stencil-public-runtime";
import { InclusiveDatesCalendarLabels } from "../inclusive-dates-calendar/inclusive-dates-calendar";
import { ChronoOptions, ChronoParsedDateString } from "../../utils/chrono-parser/chrono-parser.type";
export interface InclusiveDatesLabels {
  selected?: string;
  openCalendar?: string;
  calendar?: string;
  errorMessage?: string;
  invalidDateError?: string;
  maxDateError?: string;
  minDateError?: string;
  rangeOutOfBoundsError?: string;
  disabledDateError?: string;
  to?: string;
  startDate?: string;
}
export declare class InclusiveDates {
  el: HTMLElement;
  id: string;
  value?: string | string[];
  range?: boolean;
  label: string;
  placeholder?: string;
  locale?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  startDate?: string;
  referenceDate?: string;
  useStrictDateParsing?: boolean;
  inclusiveDatesLabels?: InclusiveDatesLabels;
  inclusiveDatesCalendarLabels?: InclusiveDatesCalendarLabels;
  inline?: boolean;
  weekNumbers?: boolean;
  hasError?: boolean;
  nextMonthButtonContent?: string;
  nextYearButtonContent?: string;
  showYearStepper?: boolean;
  showMonthStepper?: boolean;
  showClearButton?: boolean;
  showTodayButton?: boolean;
  formatInputOnAccept?: boolean;
  showKeyboardHint?: boolean;
  disableDate?: HTMLInclusiveDatesCalendarElement["disableDate"];
  elementClassName?: string;
  firstDayOfWeek?: number;
  quickButtons?: string[];
  todayButtonContent?: string;
  showQuickButtons?: boolean;
  weekNumbersSymbol?: string;
  internalValue: string | string[];
  errorState: boolean;
  disabledState: boolean;
  selectDate: EventEmitter<string | string[] | undefined>;
  componentReady: EventEmitter<void>;
  private modalRef?;
  private inputRef?;
  private calendarButtonRef?;
  private pickerRef?;
  private chronoSupportedLocale;
  private errorMessage;
  componentDidLoad(): void;
  parseDate(text: string, shouldSetValue?: boolean, chronoOptions?: ChronoOptions): Promise<ChronoParsedDateString>;
  private isRangeValue;
  private updateValue;
  private handleCalendarButtonClick;
  private handleQuickButtonClick;
  private handleChangedMonths;
  private handleChange;
  private formatInput;
  private handlePickerSelection;
  private announceDateChange;
  watchHasError(newValue: any): void;
  watchLocale(newValue: any): void;
  watchLabel(newValue: any): void;
  watchDisabled(newValue: any): void;
  watchRange(newValue: any): void;
  watchWeekNumbers(newValue: any): void;
  watchMinDate(newValue: any): void;
  watchMaxDate(newValue: any): void;
  watchValue(): void;
  private getClassName;
  render(): any;
}
