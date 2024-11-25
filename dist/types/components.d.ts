/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "./stencil-public-runtime";
import { InclusiveDatesLabels } from "./components/inclusive-dates/inclusive-dates";
import { InclusiveDatesCalendarLabels } from "./components/inclusive-dates-calendar/inclusive-dates-calendar";
import { ChronoOptions, ChronoParsedDateString } from "./utils/chrono-parser/chrono-parser.type";
import { InclusiveDatesCalendarLabels as InclusiveDatesCalendarLabels1, MonthChangedEventDetails } from "./components/inclusive-dates-calendar/inclusive-dates-calendar";
export namespace Components {
    interface InclusiveDates {
        "disableDate"?: HTMLInclusiveDatesCalendarElement["disableDate"];
        "disabled"?: boolean;
        "elementClassName"?: string;
        "firstDayOfWeek"?: number;
        "formatInputOnAccept"?: boolean;
        "hasError"?: boolean;
        "id": string;
        "inclusiveDatesCalendarLabels"?: InclusiveDatesCalendarLabels;
        "inclusiveDatesLabels"?: InclusiveDatesLabels;
        "inline"?: boolean;
        "label": string;
        "locale"?: string;
        "maxDate"?: string;
        "minDate"?: string;
        "nextMonthButtonContent"?: string;
        "nextYearButtonContent"?: string;
        "parseDate": (text: string, shouldSetValue?: boolean, chronoOptions?: ChronoOptions) => Promise<ChronoParsedDateString>;
        "placeholder"?: string;
        "quickButtons"?: string[];
        "range"?: boolean;
        "referenceDate"?: string;
        "showClearButton"?: boolean;
        "showKeyboardHint"?: boolean;
        "showMonthStepper"?: boolean;
        "showQuickButtons"?: boolean;
        "showTodayButton"?: boolean;
        "showYearStepper"?: boolean;
        "startDate"?: string;
        "todayButtonContent"?: string;
        "useStrictDateParsing"?: boolean;
        "value"?: string | string[];
        "weekNumbers"?: boolean;
    }
    interface InclusiveDatesCalendar {
        "clearButtonContent"?: string;
        "disableDate"?: (date: Date) => boolean;
        "disabled"?: boolean;
        "elementClassName"?: string;
        "firstDayOfWeek"?: number;
        "inline"?: boolean;
        "labels"?: InclusiveDatesCalendarLabels;
        "locale"?: string;
        "maxDate"?: string;
        "minDate"?: string;
        "modalIsOpen"?: boolean;
        "nextMonthButtonContent"?: string;
        "nextYearButtonContent"?: string;
        "previousMonthButtonContent"?: string;
        "previousYearButtonContent"?: string;
        "range"?: boolean;
        "showClearButton"?: boolean;
        "showHiddenTitle"?: boolean;
        "showKeyboardHint"?: boolean;
        "showMonthStepper"?: boolean;
        "showTodayButton"?: boolean;
        "showYearStepper"?: boolean;
        "startDate"?: string;
        "todayButtonContent"?: string;
        "value"?: Date | Date[];
        "weekNumbers"?: boolean;
    }
    interface InclusiveDatesModal {
        /**
          * Close the dialog.
         */
        "close": () => Promise<void>;
        "getState": () => Promise<boolean>;
        "inline"?: boolean;
        "label": string;
        /**
          * Open the dialog.
         */
        "open": () => Promise<void>;
        "setTriggerElement": (element: HTMLElement) => Promise<void>;
    }
}
export interface InclusiveDatesCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLInclusiveDatesElement;
}
export interface InclusiveDatesCalendarCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLInclusiveDatesCalendarElement;
}
export interface InclusiveDatesModalCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLInclusiveDatesModalElement;
}
declare global {
    interface HTMLInclusiveDatesElement extends Components.InclusiveDates, HTMLStencilElement {
    }
    var HTMLInclusiveDatesElement: {
        prototype: HTMLInclusiveDatesElement;
        new (): HTMLInclusiveDatesElement;
    };
    interface HTMLInclusiveDatesCalendarElement extends Components.InclusiveDatesCalendar, HTMLStencilElement {
    }
    var HTMLInclusiveDatesCalendarElement: {
        prototype: HTMLInclusiveDatesCalendarElement;
        new (): HTMLInclusiveDatesCalendarElement;
    };
    interface HTMLInclusiveDatesModalElement extends Components.InclusiveDatesModal, HTMLStencilElement {
    }
    var HTMLInclusiveDatesModalElement: {
        prototype: HTMLInclusiveDatesModalElement;
        new (): HTMLInclusiveDatesModalElement;
    };
    interface HTMLElementTagNameMap {
        "inclusive-dates": HTMLInclusiveDatesElement;
        "inclusive-dates-calendar": HTMLInclusiveDatesCalendarElement;
        "inclusive-dates-modal": HTMLInclusiveDatesModalElement;
    }
}
declare namespace LocalJSX {
    interface InclusiveDates {
        "disableDate"?: HTMLInclusiveDatesCalendarElement["disableDate"];
        "disabled"?: boolean;
        "elementClassName"?: string;
        "firstDayOfWeek"?: number;
        "formatInputOnAccept"?: boolean;
        "hasError"?: boolean;
        "id"?: string;
        "inclusiveDatesCalendarLabels"?: InclusiveDatesCalendarLabels;
        "inclusiveDatesLabels"?: InclusiveDatesLabels;
        "inline"?: boolean;
        "label"?: string;
        "locale"?: string;
        "maxDate"?: string;
        "minDate"?: string;
        "nextMonthButtonContent"?: string;
        "nextYearButtonContent"?: string;
        "onComponentReady"?: (event: InclusiveDatesCustomEvent<void>) => void;
        "onSelectDate"?: (event: InclusiveDatesCustomEvent<string | string[] | undefined>) => void;
        "placeholder"?: string;
        "quickButtons"?: string[];
        "range"?: boolean;
        "referenceDate"?: string;
        "showClearButton"?: boolean;
        "showKeyboardHint"?: boolean;
        "showMonthStepper"?: boolean;
        "showQuickButtons"?: boolean;
        "showTodayButton"?: boolean;
        "showYearStepper"?: boolean;
        "startDate"?: string;
        "todayButtonContent"?: string;
        "useStrictDateParsing"?: boolean;
        "value"?: string | string[];
        "weekNumbers"?: boolean;
    }
    interface InclusiveDatesCalendar {
        "clearButtonContent"?: string;
        "disableDate"?: (date: Date) => boolean;
        "disabled"?: boolean;
        "elementClassName"?: string;
        "firstDayOfWeek"?: number;
        "inline"?: boolean;
        "labels"?: InclusiveDatesCalendarLabels;
        "locale"?: string;
        "maxDate"?: string;
        "minDate"?: string;
        "modalIsOpen"?: boolean;
        "nextMonthButtonContent"?: string;
        "nextYearButtonContent"?: string;
        "onChangeMonth"?: (event: InclusiveDatesCalendarCustomEvent<MonthChangedEventDetails>) => void;
        "onSelectDate"?: (event: InclusiveDatesCalendarCustomEvent<string | string[] | undefined>) => void;
        "previousMonthButtonContent"?: string;
        "previousYearButtonContent"?: string;
        "range"?: boolean;
        "showClearButton"?: boolean;
        "showHiddenTitle"?: boolean;
        "showKeyboardHint"?: boolean;
        "showMonthStepper"?: boolean;
        "showTodayButton"?: boolean;
        "showYearStepper"?: boolean;
        "startDate"?: string;
        "todayButtonContent"?: string;
        "value"?: Date | Date[];
        "weekNumbers"?: boolean;
    }
    interface InclusiveDatesModal {
        "inline"?: boolean;
        "label": string;
        "onClosed"?: (event: InclusiveDatesModalCustomEvent<any>) => void;
        "onOpened"?: (event: InclusiveDatesModalCustomEvent<any>) => void;
    }
    interface IntrinsicElements {
        "inclusive-dates": InclusiveDates;
        "inclusive-dates-calendar": InclusiveDatesCalendar;
        "inclusive-dates-modal": InclusiveDatesModal;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "inclusive-dates": LocalJSX.InclusiveDates & JSXBase.HTMLAttributes<HTMLInclusiveDatesElement>;
            "inclusive-dates-calendar": LocalJSX.InclusiveDatesCalendar & JSXBase.HTMLAttributes<HTMLInclusiveDatesCalendarElement>;
            "inclusive-dates-modal": LocalJSX.InclusiveDatesModal & JSXBase.HTMLAttributes<HTMLInclusiveDatesModalElement>;
        }
    }
}