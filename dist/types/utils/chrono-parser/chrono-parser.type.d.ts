import { ParsingContext } from "chrono-node/dist/chrono";
import { Component } from "chrono-node";
import { ParsingComponents, ParsingResult } from "chrono-node/dist/results";
export declare type supportedChronoLocales = "en" | "ja" | "fr" | "nl" | "ru" | "pt";
export declare type ChronoParsedDate = {
  value?: Date;
  reason?: "invalid" | "minDate" | "maxDate";
};
export declare type ChronoParsedRange = {
  value?: {
    start: Date;
    end: Date;
  };
  reason?: "invalid" | "minDate" | "maxDate" | "rangeOutOfBounds";
};
export declare type ChronoParsedDateString = {
  value?: string;
  reason?: "invalid" | "minDate" | "maxDate";
};
export interface Parser {
  pattern: (context: ParsingContext) => RegExp;
  extract: (context: ParsingContext, match: RegExpMatchArray) => ParsingComponents | ParsingResult | {
    [c in Component]?: number;
  } | null;
}
export interface ChronoOptions {
  referenceDate?: Date;
  useStrict?: boolean;
  locale?: string;
  minDate?: string;
  maxDate?: string;
  chronoSupportedLocale?: boolean;
  customExpressions?: {
    pattern: RegExp;
    match: {
      month: number;
      day: number;
    };
  }[];
}
