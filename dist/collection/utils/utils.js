export function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
export function getISOWeek(date) {
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
export function getDaysOfMonth(date, padded, firstDayOfWeek) {
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
export function getFirstOfMonth(date) {
  const firstOfMonth = removeTimezoneOffset(new Date(`${getYear(date)}-${String(getMonth(date)).padStart(2, "0")}-01`));
  return firstOfMonth;
}
export function getISODateString(date) {
  if (!(date instanceof Date)) {
    return;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function getLastOfMonth(date) {
  const newDate = getFirstOfMonth(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(newDate.getDate() - 1);
  return newDate;
}
export function getMonth(date) {
  return date.getMonth() + 1;
}
export function getMonths(locale) {
  return new Array(12).fill(undefined).map((_, month) => {
    const date = removeTimezoneOffset(new Date(`2006-${String(month + 1).padStart(2, "0")}-01`));
    return Intl.DateTimeFormat(locale, {
      month: "long"
    }).format(date);
  });
}
export function getNextDay(date) {
  return addDays(date, 1);
}
export function getNextMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}
export function getNextYear(date) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + 1);
  return newDate;
}
export function getPreviousDay(date) {
  return subDays(date, 1);
}
export function getPreviousMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
}
export function getPreviousYear(date) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() - 1);
  return newDate;
}
export function getWeekDays(firstDayOfWeek, locale) {
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
export function getYear(date) {
  return date.getFullYear();
}
export function isDateInRange(date, range) {
  if (!date || !range || !range.from || !range.to) {
    return false;
  }
  const earlyDate = range.from < range.to ? range.from : range.to;
  const laterDate = range.from < range.to ? range.to : range.from;
  return date >= earlyDate && date <= laterDate;
}
export function isSameDay(date1, date2) {
  if (!date1 || !date2) {
    return false;
  }
  return (date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate());
}
export function removeTimezoneOffset(date) {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  return newDate;
}
export function subDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}
export function dateIsWithinLowerBounds(date, minDate) {
  if (minDate) {
    const min = removeTimezoneOffset(new Date(minDate));
    return date >= min || isSameDay(min, date);
  }
  else
    return true;
}
export function dateIsWithinUpperBounds(date, maxDate) {
  if (maxDate) {
    const max = removeTimezoneOffset(new Date(maxDate));
    return date <= max || isSameDay(date, max);
  }
  else
    return true;
}
export function dateIsWithinBounds(date, minDate, maxDate) {
  return (dateIsWithinLowerBounds(date, minDate) &&
    dateIsWithinUpperBounds(date, maxDate));
}
export function monthIsDisabled(month, year, minDate, maxDate) {
  const firstDate = new Date(year, month, 1);
  firstDate.setDate(firstDate.getDate() - 1);
  const lastDate = new Date(year, month + 1, 0);
  lastDate.setDate(firstDate.getDate() + 1);
  return (!dateIsWithinBounds(firstDate, minDate, maxDate) &&
    !dateIsWithinBounds(lastDate, minDate, maxDate));
}
export function isValidISODate(dateString) {
  var isoFormat = /^\d{4}-\d{2}-\d{2}$/;
  if (dateString.match(isoFormat) == null) {
    return false;
  }
  else {
    var d = new Date(dateString);
    return !isNaN(d.getTime());
  }
}
export function extractDates(text) {
  var dateRegex = /\d{4}-\d{2}-\d{2}/g;
  var matches = text.match(dateRegex);
  return matches.slice(0, 2);
}