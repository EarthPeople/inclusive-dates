import { r as registerInstance, c as createEvent, h, H as Host, g as getElement } from './index-1da7b675.js';

/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ /*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ /* Inspired by https://github.com/AlmeroSteyn/react-aria-live */ const $319e236875307eab$var$LIVEREGION_TIMEOUT_DELAY = 7000;
let $319e236875307eab$var$liveAnnouncer = null;
function $319e236875307eab$export$a9b970dcc4ae71a9(message, assertiveness = "assertive", timeout = $319e236875307eab$var$LIVEREGION_TIMEOUT_DELAY) {
    if (!$319e236875307eab$var$liveAnnouncer) $319e236875307eab$var$liveAnnouncer = new $319e236875307eab$var$LiveAnnouncer();
    $319e236875307eab$var$liveAnnouncer.announce(message, assertiveness, timeout);
}
// LiveAnnouncer is implemented using vanilla DOM, not React. That's because as of React 18
// ReactDOM.render is deprecated, and the replacement, ReactDOM.createRoot is moved into a
// subpath import `react-dom/client`. That makes it hard for us to support multiple React versions.
// As a global API, we can't use portals without introducing a breaking API change. LiveAnnouncer
// is simple enough to implement without React, so that's what we do here.
// See this discussion for more details: https://github.com/reactwg/react-18/discussions/125#discussioncomment-2382638
class $319e236875307eab$var$LiveAnnouncer {
    createLog(ariaLive) {
        let node = document.createElement("div");
        node.setAttribute("role", "log");
        node.setAttribute("aria-live", ariaLive);
        node.setAttribute("aria-relevant", "additions");
        return node;
    }
    destroy() {
        if (!this.node) return;
        document.body.removeChild(this.node);
        this.node = null;
    }
    announce(message, assertiveness = "assertive", timeout = $319e236875307eab$var$LIVEREGION_TIMEOUT_DELAY) {
        if (!this.node) return;
        let node = document.createElement("div");
        node.textContent = message;
        if (assertiveness === "assertive") this.assertiveLog.appendChild(node);
        else this.politeLog.appendChild(node);
        if (message !== "") setTimeout(()=>{
            node.remove();
        }, timeout);
    }
    clear(assertiveness) {
        if (!this.node) return;
        if (!assertiveness || assertiveness === "assertive") this.assertiveLog.innerHTML = "";
        if (!assertiveness || assertiveness === "polite") this.politeLog.innerHTML = "";
    }
    constructor(){
        this.node = document.createElement("div");
        this.node.dataset.liveAnnouncer = "true";
        // copied from VisuallyHidden
        Object.assign(this.node.style, {
            border: 0,
            clip: "rect(0 0 0 0)",
            clipPath: "inset(50%)",
            height: 1,
            margin: "0 -1px -1px 0",
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            width: 1,
            whiteSpace: "nowrap"
        });
        this.assertiveLog = this.createLog("assertive");
        this.node.appendChild(this.assertiveLog);
        this.politeLog = this.createLog("polite");
        this.node.appendChild(this.politeLog);
        document.body.prepend(this.node);
    }
}

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
  const day = date.getDate();
  const newDate = new Date(date);
  // Set to 1st of current month
  newDate.setDate(1);
  // Move to next month
  newDate.setMonth(newDate.getMonth() + 1);
  // Try to restore original day (will cap at max days in month)
  const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
  newDate.setDate(Math.min(day, lastDayOfNewMonth));
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
  const day = date.getDate();
  const newDate = new Date(date);
  // Set to 1st of current month
  newDate.setDate(1);
  // Move to previous month
  newDate.setMonth(newDate.getMonth() - 1);
  // Try to restore original day (will cap at max days in month)
  const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
  newDate.setDate(Math.min(day, lastDayOfNewMonth));
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire();
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var pattern = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchAnyPattern = exports.extractTerms = exports.repeatedTimeunitPattern = void 0;
function repeatedTimeunitPattern(prefix, singleTimeunitPattern) {
    const singleTimeunitPatternNoCapture = singleTimeunitPattern.replace(/\((?!\?)/g, "(?:");
    return `${prefix}${singleTimeunitPatternNoCapture}\\s{0,5}(?:,?\\s{0,5}${singleTimeunitPatternNoCapture}){0,10}`;
}
exports.repeatedTimeunitPattern = repeatedTimeunitPattern;
function extractTerms(dictionary) {
    let keys;
    if (dictionary instanceof Array) {
        keys = [...dictionary];
    }
    else if (dictionary instanceof Map) {
        keys = Array.from(dictionary.keys());
    }
    else {
        keys = Object.keys(dictionary);
    }
    return keys;
}
exports.extractTerms = extractTerms;
function matchAnyPattern(dictionary) {
    const joinedTerms = extractTerms(dictionary)
        .sort((a, b) => b.length - a.length)
        .join("|")
        .replace(/\./g, "\\.");
    return `(?:${joinedTerms})`;
}
exports.matchAnyPattern = matchAnyPattern;
//# sourceMappingURL=pattern.js.map
});

var dayjs_min = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return "["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(g=i),i||!r&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=v;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===l)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),l=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case c:return r?l(1,0):l(31,11);case f:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,l=this;r=Number(r);var $=O.p(h),y=function(t){var e=w(l);return O.w(e.date(e.date()+Math.round(t*r)),l)};if($===f)return this.set(f,this.$M+r);if($===c)return this.set(c,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||$[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,v=this-M,g=O.m(this,M);return g=($={},$[c]=g/12,$[f]=g,$[h]=g/3,$[o]=(v-m)/6048e5,$[a]=(v-m)/864e5,$[u]=v/n,$[s]=v/e,$[i]=v/t,$)[y]||v,l?g:O.a(g)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[g],w.Ls=D,w.p={},w}));
});

var years = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findYearClosestToRef = exports.findMostLikelyADYear = void 0;
const dayjs_1 = __importDefault(dayjs_min);
function findMostLikelyADYear(yearNumber) {
    if (yearNumber < 100) {
        if (yearNumber > 50) {
            yearNumber = yearNumber + 1900;
        }
        else {
            yearNumber = yearNumber + 2000;
        }
    }
    return yearNumber;
}
exports.findMostLikelyADYear = findMostLikelyADYear;
function findYearClosestToRef(refDate, day, month) {
    const refMoment = dayjs_1.default(refDate);
    let dateMoment = refMoment;
    dateMoment = dateMoment.month(month - 1);
    dateMoment = dateMoment.date(day);
    dateMoment = dateMoment.year(refMoment.year());
    const nextYear = dateMoment.add(1, "y");
    const lastYear = dateMoment.add(-1, "y");
    if (Math.abs(nextYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
        dateMoment = nextYear;
    }
    else if (Math.abs(lastYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
        dateMoment = lastYear;
    }
    return dateMoment.year();
}
exports.findYearClosestToRef = findYearClosestToRef;
//# sourceMappingURL=years.js.map
});

var constants$9 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.FULL_MONTH_NAME_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;


exports.WEEKDAY_DICTIONARY = {
    sunday: 0,
    sun: 0,
    "sun.": 0,
    monday: 1,
    mon: 1,
    "mon.": 1,
    tuesday: 2,
    tue: 2,
    "tue.": 2,
    wednesday: 3,
    wed: 3,
    "wed.": 3,
    thursday: 4,
    thurs: 4,
    "thurs.": 4,
    thur: 4,
    "thur.": 4,
    thu: 4,
    "thu.": 4,
    friday: 5,
    fri: 5,
    "fri.": 5,
    saturday: 6,
    sat: 6,
    "sat.": 6,
};
exports.FULL_MONTH_NAME_DICTIONARY = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
};
exports.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports.FULL_MONTH_NAME_DICTIONARY), { jan: 1, "jan.": 1, feb: 2, "feb.": 2, mar: 3, "mar.": 3, apr: 4, "apr.": 4, jun: 6, "jun.": 6, jul: 7, "jul.": 7, aug: 8, "aug.": 8, sep: 9, "sep.": 9, sept: 9, "sept.": 9, oct: 10, "oct.": 10, nov: 11, "nov.": 11, dec: 12, "dec.": 12 });
exports.INTEGER_WORD_DICTIONARY = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
};
exports.ORDINAL_WORD_DICTIONARY = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    tenth: 10,
    eleventh: 11,
    twelfth: 12,
    thirteenth: 13,
    fourteenth: 14,
    fifteenth: 15,
    sixteenth: 16,
    seventeenth: 17,
    eighteenth: 18,
    nineteenth: 19,
    twentieth: 20,
    "twenty first": 21,
    "twenty-first": 21,
    "twenty second": 22,
    "twenty-second": 22,
    "twenty third": 23,
    "twenty-third": 23,
    "twenty fourth": 24,
    "twenty-fourth": 24,
    "twenty fifth": 25,
    "twenty-fifth": 25,
    "twenty sixth": 26,
    "twenty-sixth": 26,
    "twenty seventh": 27,
    "twenty-seventh": 27,
    "twenty eighth": 28,
    "twenty-eighth": 28,
    "twenty ninth": 29,
    "twenty-ninth": 29,
    "thirtieth": 30,
    "thirty first": 31,
    "thirty-first": 31,
};
exports.TIME_UNIT_DICTIONARY = {
    s: "second",
    sec: "second",
    second: "second",
    seconds: "second",
    m: "minute",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minutes: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    hour: "hour",
    hours: "hour",
    d: "d",
    day: "d",
    days: "d",
    w: "w",
    week: "week",
    weeks: "week",
    mo: "month",
    mos: "month",
    month: "month",
    months: "month",
    qtr: "quarter",
    quarter: "quarter",
    quarters: "quarter",
    y: "year",
    yr: "year",
    year: "year",
    years: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s{0,2}an?)?|an?\\b(?:\\s{0,2}few)?|few|several|a?\\s{0,2}couple\\s{0,2}(?:of)?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "a" || num === "an") {
        return 1;
    }
    else if (num.match(/few/)) {
        return 3;
    }
    else if (num.match(/half/)) {
        return 0.5;
    }
    else if (num.match(/couple/)) {
        return 2;
    }
    else if (num.match(/several/)) {
        return 7;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:st|nd|rd|th)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
        return exports.ORDINAL_WORD_DICTIONARY[num];
    }
    num = num.replace(/(?:st|nd|rd|th)$/i, "");
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s{0,2}(?:BE|AD|BC|BCE|CE)|[1-2][0-9]{3}|[5-9][0-9])`;
function parseYear(match) {
    if (/BE/i.test(match)) {
        match = match.replace(/BE/i, "");
        return parseInt(match) - 543;
    }
    if (/BCE?/i.test(match)) {
        match = match.replace(/BCE?/i, "");
        return -parseInt(match);
    }
    if (/(AD|CE)/i.test(match)) {
        match = match.replace(/(AD|CE)/i, "");
        return parseInt(match);
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,3}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern(`(?:(?:about|around)\\s{0,3})?`, SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length).trim();
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
//# sourceMappingURL=constants.js.map
});

var quarterOfYear = createCommonjsModule(function (module, exports) {
!function(t,n){module.exports=n();}(commonjsGlobal,(function(){var t="month",n="quarter";return function(e,i){var r=i.prototype;r.quarter=function(t){return this.$utils().u(t)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(t-1))};var s=r.add;r.add=function(e,i){return e=Number(e),this.$utils().p(i)===n?this.add(3*e,t):s.bind(this)(e,i)};var u=r.startOf;r.startOf=function(e,i){var r=this.$utils(),s=!!r.u(i)||i;if(r.p(e)===n){var o=this.quarter()-1;return s?this.month(3*o).startOf(t).startOf("day"):this.month(3*o+2).endOf(t).endOf("day")}return u.bind(this)(e,i)};}}));
});

var dayjs = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.implySimilarTime = exports.implySimilarDate = exports.assignSimilarTime = exports.assignSimilarDate = exports.implyTheNextDay = exports.assignTheNextDay = void 0;

function assignTheNextDay(component, targetDayJs) {
    targetDayJs = targetDayJs.add(1, "day");
    assignSimilarDate(component, targetDayJs);
    implySimilarTime(component, targetDayJs);
}
exports.assignTheNextDay = assignTheNextDay;
function implyTheNextDay(component, targetDayJs) {
    targetDayJs = targetDayJs.add(1, "day");
    implySimilarDate(component, targetDayJs);
    implySimilarTime(component, targetDayJs);
}
exports.implyTheNextDay = implyTheNextDay;
function assignSimilarDate(component, targetDayJs) {
    component.assign("day", targetDayJs.date());
    component.assign("month", targetDayJs.month() + 1);
    component.assign("year", targetDayJs.year());
}
exports.assignSimilarDate = assignSimilarDate;
function assignSimilarTime(component, targetDayJs) {
    component.assign("hour", targetDayJs.hour());
    component.assign("minute", targetDayJs.minute());
    component.assign("second", targetDayJs.second());
    component.assign("millisecond", targetDayJs.millisecond());
    if (component.get("hour") < 12) {
        component.assign("meridiem", dist.Meridiem.AM);
    }
    else {
        component.assign("meridiem", dist.Meridiem.PM);
    }
}
exports.assignSimilarTime = assignSimilarTime;
function implySimilarDate(component, targetDayJs) {
    component.imply("day", targetDayJs.date());
    component.imply("month", targetDayJs.month() + 1);
    component.imply("year", targetDayJs.year());
}
exports.implySimilarDate = implySimilarDate;
function implySimilarTime(component, targetDayJs) {
    component.imply("hour", targetDayJs.hour());
    component.imply("minute", targetDayJs.minute());
    component.imply("second", targetDayJs.second());
    component.imply("millisecond", targetDayJs.millisecond());
}
exports.implySimilarTime = implySimilarTime;
//# sourceMappingURL=dayjs.js.map
});

var timezone = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTimezoneOffset = exports.TIMEZONE_ABBR_MAP = void 0;
exports.TIMEZONE_ABBR_MAP = {
    ACDT: 630,
    ACST: 570,
    ADT: -180,
    AEDT: 660,
    AEST: 600,
    AFT: 270,
    AKDT: -480,
    AKST: -540,
    ALMT: 360,
    AMST: -180,
    AMT: -240,
    ANAST: 720,
    ANAT: 720,
    AQTT: 300,
    ART: -180,
    AST: -240,
    AWDT: 540,
    AWST: 480,
    AZOST: 0,
    AZOT: -60,
    AZST: 300,
    AZT: 240,
    BNT: 480,
    BOT: -240,
    BRST: -120,
    BRT: -180,
    BST: 60,
    BTT: 360,
    CAST: 480,
    CAT: 120,
    CCT: 390,
    CDT: -300,
    CEST: 120,
    CET: 60,
    CHADT: 825,
    CHAST: 765,
    CKT: -600,
    CLST: -180,
    CLT: -240,
    COT: -300,
    CST: -360,
    CVT: -60,
    CXT: 420,
    ChST: 600,
    DAVT: 420,
    EASST: -300,
    EAST: -360,
    EAT: 180,
    ECT: -300,
    EDT: -240,
    EEST: 180,
    EET: 120,
    EGST: 0,
    EGT: -60,
    EST: -300,
    ET: -300,
    FJST: 780,
    FJT: 720,
    FKST: -180,
    FKT: -240,
    FNT: -120,
    GALT: -360,
    GAMT: -540,
    GET: 240,
    GFT: -180,
    GILT: 720,
    GMT: 0,
    GST: 240,
    GYT: -240,
    HAA: -180,
    HAC: -300,
    HADT: -540,
    HAE: -240,
    HAP: -420,
    HAR: -360,
    HAST: -600,
    HAT: -90,
    HAY: -480,
    HKT: 480,
    HLV: -210,
    HNA: -240,
    HNC: -360,
    HNE: -300,
    HNP: -480,
    HNR: -420,
    HNT: -150,
    HNY: -540,
    HOVT: 420,
    ICT: 420,
    IDT: 180,
    IOT: 360,
    IRDT: 270,
    IRKST: 540,
    IRKT: 540,
    IRST: 210,
    IST: 330,
    JST: 540,
    KGT: 360,
    KRAST: 480,
    KRAT: 480,
    KST: 540,
    KUYT: 240,
    LHDT: 660,
    LHST: 630,
    LINT: 840,
    MAGST: 720,
    MAGT: 720,
    MART: -510,
    MAWT: 300,
    MDT: -360,
    MESZ: 120,
    MEZ: 60,
    MHT: 720,
    MMT: 390,
    MSD: 240,
    MSK: 180,
    MST: -420,
    MUT: 240,
    MVT: 300,
    MYT: 480,
    NCT: 660,
    NDT: -90,
    NFT: 690,
    NOVST: 420,
    NOVT: 360,
    NPT: 345,
    NST: -150,
    NUT: -660,
    NZDT: 780,
    NZST: 720,
    OMSST: 420,
    OMST: 420,
    PDT: -420,
    PET: -300,
    PETST: 720,
    PETT: 720,
    PGT: 600,
    PHOT: 780,
    PHT: 480,
    PKT: 300,
    PMDT: -120,
    PMST: -180,
    PONT: 660,
    PST: -480,
    PT: -480,
    PWT: 540,
    PYST: -180,
    PYT: -240,
    RET: 240,
    SAMT: 240,
    SAST: 120,
    SBT: 660,
    SCT: 240,
    SGT: 480,
    SRT: -180,
    SST: -660,
    TAHT: -600,
    TFT: 300,
    TJT: 300,
    TKT: 780,
    TLT: 540,
    TMT: 300,
    TVT: 720,
    ULAT: 480,
    UTC: 0,
    UYST: -120,
    UYT: -180,
    UZT: 300,
    VET: -210,
    VLAST: 660,
    VLAT: 660,
    VUT: 660,
    WAST: 120,
    WAT: 60,
    WEST: 60,
    WESZ: 60,
    WET: 0,
    WEZ: 0,
    WFT: 720,
    WGST: -120,
    WGT: -180,
    WIB: 420,
    WIT: 540,
    WITA: 480,
    WST: 780,
    WT: 0,
    YAKST: 600,
    YAKT: 600,
    YAPT: 600,
    YEKST: 360,
    YEKT: 360,
};
function toTimezoneOffset(timezoneInput) {
    var _a;
    if (timezoneInput === null || timezoneInput === undefined) {
        return null;
    }
    if (typeof timezoneInput === "number") {
        return timezoneInput;
    }
    return (_a = exports.TIMEZONE_ABBR_MAP[timezoneInput]) !== null && _a !== void 0 ? _a : null;
}
exports.toTimezoneOffset = toTimezoneOffset;
//# sourceMappingURL=timezone.js.map
});

var results = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingResult = exports.ParsingComponents = exports.ReferenceWithTimezone = void 0;
const quarterOfYear_1 = __importDefault(quarterOfYear);
const dayjs_1 = __importDefault(dayjs_min);


dayjs_1.default.extend(quarterOfYear_1.default);
class ReferenceWithTimezone {
    constructor(input) {
        var _a;
        input = input !== null && input !== void 0 ? input : new Date();
        if (input instanceof Date) {
            this.instant = input;
        }
        else {
            this.instant = (_a = input.instant) !== null && _a !== void 0 ? _a : new Date();
            this.timezoneOffset = timezone.toTimezoneOffset(input.timezone);
        }
    }
    getDateWithAdjustedTimezone() {
        return new Date(this.instant.getTime() + this.getSystemTimezoneAdjustmentMinute(this.instant) * 60000);
    }
    getSystemTimezoneAdjustmentMinute(date, overrideTimezoneOffset) {
        var _a;
        if (!date || date.getTime() < 0) {
            date = new Date();
        }
        const currentTimezoneOffset = -date.getTimezoneOffset();
        const targetTimezoneOffset = (_a = overrideTimezoneOffset !== null && overrideTimezoneOffset !== void 0 ? overrideTimezoneOffset : this.timezoneOffset) !== null && _a !== void 0 ? _a : currentTimezoneOffset;
        return currentTimezoneOffset - targetTimezoneOffset;
    }
}
exports.ReferenceWithTimezone = ReferenceWithTimezone;
class ParsingComponents {
    constructor(reference, knownComponents) {
        this.reference = reference;
        this.knownValues = {};
        this.impliedValues = {};
        if (knownComponents) {
            for (const key in knownComponents) {
                this.knownValues[key] = knownComponents[key];
            }
        }
        const refDayJs = dayjs_1.default(reference.instant);
        this.imply("day", refDayJs.date());
        this.imply("month", refDayJs.month() + 1);
        this.imply("year", refDayJs.year());
        this.imply("hour", 12);
        this.imply("minute", 0);
        this.imply("second", 0);
        this.imply("millisecond", 0);
    }
    get(component) {
        if (component in this.knownValues) {
            return this.knownValues[component];
        }
        if (component in this.impliedValues) {
            return this.impliedValues[component];
        }
        return null;
    }
    isCertain(component) {
        return component in this.knownValues;
    }
    getCertainComponents() {
        return Object.keys(this.knownValues);
    }
    imply(component, value) {
        if (component in this.knownValues) {
            return this;
        }
        this.impliedValues[component] = value;
        return this;
    }
    assign(component, value) {
        this.knownValues[component] = value;
        delete this.impliedValues[component];
        return this;
    }
    delete(component) {
        delete this.knownValues[component];
        delete this.impliedValues[component];
    }
    clone() {
        const component = new ParsingComponents(this.reference);
        component.knownValues = {};
        component.impliedValues = {};
        for (const key in this.knownValues) {
            component.knownValues[key] = this.knownValues[key];
        }
        for (const key in this.impliedValues) {
            component.impliedValues[key] = this.impliedValues[key];
        }
        return component;
    }
    isOnlyDate() {
        return !this.isCertain("hour") && !this.isCertain("minute") && !this.isCertain("second");
    }
    isOnlyTime() {
        return !this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    }
    isOnlyWeekdayComponent() {
        return this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    }
    isOnlyDayMonthComponent() {
        return this.isCertain("day") && this.isCertain("month") && !this.isCertain("year");
    }
    isValidDate() {
        const date = this.dateWithoutTimezoneAdjustment();
        if (date.getFullYear() !== this.get("year"))
            return false;
        if (date.getMonth() !== this.get("month") - 1)
            return false;
        if (date.getDate() !== this.get("day"))
            return false;
        if (this.get("hour") != null && date.getHours() != this.get("hour"))
            return false;
        if (this.get("minute") != null && date.getMinutes() != this.get("minute"))
            return false;
        return true;
    }
    toString() {
        return `[ParsingComponents {knownValues: ${JSON.stringify(this.knownValues)}, impliedValues: ${JSON.stringify(this.impliedValues)}}, reference: ${JSON.stringify(this.reference)}]`;
    }
    dayjs() {
        return dayjs_1.default(this.date());
    }
    date() {
        const date = this.dateWithoutTimezoneAdjustment();
        const timezoneAdjustment = this.reference.getSystemTimezoneAdjustmentMinute(date, this.get("timezoneOffset"));
        return new Date(date.getTime() + timezoneAdjustment * 60000);
    }
    dateWithoutTimezoneAdjustment() {
        const date = new Date(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond"));
        date.setFullYear(this.get("year"));
        return date;
    }
    static createRelativeFromReference(reference, fragments) {
        let date = dayjs_1.default(reference.instant);
        for (const key in fragments) {
            date = date.add(fragments[key], key);
        }
        const components = new ParsingComponents(reference);
        if (fragments["hour"] || fragments["minute"] || fragments["second"]) {
            dayjs.assignSimilarTime(components, date);
            dayjs.assignSimilarDate(components, date);
            if (reference.timezoneOffset !== null) {
                components.assign("timezoneOffset", -reference.instant.getTimezoneOffset());
            }
        }
        else {
            dayjs.implySimilarTime(components, date);
            if (reference.timezoneOffset !== null) {
                components.imply("timezoneOffset", -reference.instant.getTimezoneOffset());
            }
            if (fragments["d"]) {
                components.assign("day", date.date());
                components.assign("month", date.month() + 1);
                components.assign("year", date.year());
            }
            else {
                if (fragments["week"]) {
                    components.imply("weekday", date.day());
                }
                components.imply("day", date.date());
                if (fragments["month"]) {
                    components.assign("month", date.month() + 1);
                    components.assign("year", date.year());
                }
                else {
                    components.imply("month", date.month() + 1);
                    if (fragments["year"]) {
                        components.assign("year", date.year());
                    }
                    else {
                        components.imply("year", date.year());
                    }
                }
            }
        }
        return components;
    }
}
exports.ParsingComponents = ParsingComponents;
class ParsingResult {
    constructor(reference, index, text, start, end) {
        this.reference = reference;
        this.refDate = reference.instant;
        this.index = index;
        this.text = text;
        this.start = start || new ParsingComponents(reference);
        this.end = end;
    }
    clone() {
        const result = new ParsingResult(this.reference, this.index, this.text);
        result.start = this.start ? this.start.clone() : null;
        result.end = this.end ? this.end.clone() : null;
        return result;
    }
    date() {
        return this.start.date();
    }
    toString() {
        return `[ParsingResult {index: ${this.index}, text: '${this.text}', ...}]`;
    }
}
exports.ParsingResult = ParsingResult;
//# sourceMappingURL=results.js.map
});

var AbstractParserWithWordBoundary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractParserWithWordBoundaryChecking = void 0;
class AbstractParserWithWordBoundaryChecking {
    constructor() {
        this.cachedInnerPattern = null;
        this.cachedPattern = null;
    }
    patternLeftBoundary() {
        return `(\\W|^)`;
    }
    pattern(context) {
        const innerPattern = this.innerPattern(context);
        if (innerPattern == this.cachedInnerPattern) {
            return this.cachedPattern;
        }
        this.cachedPattern = new RegExp(`${this.patternLeftBoundary()}${innerPattern.source}`, innerPattern.flags);
        this.cachedInnerPattern = innerPattern;
        return this.cachedPattern;
    }
    extract(context, match) {
        var _a;
        const header = (_a = match[1]) !== null && _a !== void 0 ? _a : "";
        match.index = match.index + header.length;
        match[0] = match[0].substring(header.length);
        for (let i = 2; i < match.length; i++) {
            match[i - 1] = match[i];
        }
        return this.innerExtract(context, match);
    }
}
exports.AbstractParserWithWordBoundaryChecking = AbstractParserWithWordBoundaryChecking;
//# sourceMappingURL=AbstractParserWithWordBoundary.js.map
});

var ENTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN_WITH_PREFIX = new RegExp(`(?:within|in|for)\\s*` +
    `(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants$9.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
const PATTERN_WITHOUT_PREFIX = new RegExp(`(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants$9.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
class ENTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return context.option.forwardDate ? PATTERN_WITHOUT_PREFIX : PATTERN_WITH_PREFIX;
    }
    innerExtract(context, match) {
        const timeUnits = constants$9.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
exports.default = ENTimeUnitWithinFormatParser;
//# sourceMappingURL=ENTimeUnitWithinFormatParser.js.map
});

var ENMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$9;
const constants_3 = constants$9;


const PATTERN = new RegExp(`(?:on\\s{0,3})?` +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    `(?:` +
    `\\s{0,3}(?:to|\\-|\\–|until|through|till)?\\s{0,3}` +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    ")?" +
    `(?:-|/|\\s{0,3}(?:of)?\\s{0,3})` +
    `(${pattern.matchAnyPattern(constants$9.MONTH_DICTIONARY)})` +
    "(?:" +
    `(?:-|/|,?\\s{0,3})` +
    `(${constants_2.YEAR_PATTERN}(?![^\\s]\\d))` +
    ")?" +
    "(?=\\W|$)", "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class ENMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$9.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = ENMonthNameLittleEndianParser;
//# sourceMappingURL=ENMonthNameLittleEndianParser.js.map
});

var ENMonthNameMiddleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$9;
const constants_3 = constants$9;


const PATTERN = new RegExp(`(${pattern.matchAnyPattern(constants$9.MONTH_DICTIONARY)})` +
    "(?:-|/|\\s*,?\\s*)" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})(?!\\s*(?:am|pm))\\s*` +
    "(?:" +
    "(?:to|\\-)\\s*" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})\\s*` +
    ")?" +
    "(?:" +
    "(?:-|/|\\s*,?\\s*)" +
    `(${constants_3.YEAR_PATTERN})` +
    ")?" +
    "(?=\\W|$)(?!\\:\\d)", "i");
const MONTH_NAME_GROUP = 1;
const DATE_GROUP = 2;
const DATE_TO_GROUP = 3;
const YEAR_GROUP = 4;
class ENMonthNameMiddleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = constants$9.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            return null;
        }
        const components = context.createParsingComponents({
            day: day,
            month: month,
        });
        if (match[YEAR_GROUP]) {
            const year = constants_3.parseYear(match[YEAR_GROUP]);
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            components.imply("year", year);
        }
        if (!match[DATE_TO_GROUP]) {
            return components;
        }
        const endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
        const result = context.createParsingResult(match.index, match[0]);
        result.start = components;
        result.end = components.clone();
        result.end.assign("day", endDate);
        return result;
    }
}
exports.default = ENMonthNameMiddleEndianParser;
//# sourceMappingURL=ENMonthNameMiddleEndianParser.js.map
});

var ENMonthNameParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const constants_2 = constants$9;

const PATTERN = new RegExp(`((?:in)\\s*)?` +
    `(${pattern.matchAnyPattern(constants$9.MONTH_DICTIONARY)})` +
    `\\s*` +
    `(?:` +
    `[,-]?\\s*(${constants_2.YEAR_PATTERN})?` +
    ")?" +
    "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
const PREFIX_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const YEAR_GROUP = 3;
class ENMonthNameParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const monthName = match[MONTH_NAME_GROUP].toLowerCase();
        if (match[0].length <= 3 && !constants$9.FULL_MONTH_NAME_DICTIONARY[monthName]) {
            return null;
        }
        const result = context.createParsingResult(match.index + (match[PREFIX_GROUP] || "").length, match.index + match[0].length);
        result.start.imply("day", 1);
        const month = constants$9.MONTH_DICTIONARY[monthName];
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
            const year = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, 1, month);
            result.start.imply("year", year);
        }
        return result;
    }
}
exports.default = ENMonthNameParser;
//# sourceMappingURL=ENMonthNameParser.js.map
});

var ENCasualYearMonthDayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp(`([0-9]{4})[\\.\\/\\s]` +
    `(?:(${pattern.matchAnyPattern(constants$9.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]` +
    `([0-9]{1,2})` +
    "(?=\\W|$)", "i");
const YEAR_NUMBER_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const MONTH_NUMBER_GROUP = 3;
const DATE_NUMBER_GROUP = 4;
class ENCasualYearMonthDayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = match[MONTH_NUMBER_GROUP]
            ? parseInt(match[MONTH_NUMBER_GROUP])
            : constants$9.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        if (month < 1 || month > 12) {
            return null;
        }
        const year = parseInt(match[YEAR_NUMBER_GROUP]);
        const day = parseInt(match[DATE_NUMBER_GROUP]);
        return {
            day: day,
            month: month,
            year: year,
        };
    }
}
exports.default = ENCasualYearMonthDayParser;
//# sourceMappingURL=ENCasualYearMonthDayParser.js.map
});

var ENSlashMonthFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
const MONTH_GROUP = 1;
const YEAR_GROUP = 2;
class ENSlashMonthFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const year = parseInt(match[YEAR_GROUP]);
        const month = parseInt(match[MONTH_GROUP]);
        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
    }
}
exports.default = ENSlashMonthFormatParser;
//# sourceMappingURL=ENSlashMonthFormatParser.js.map
});

var AbstractTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTimeExpressionParser = void 0;

function primaryTimePattern(leftBoundary, primaryPrefix, primarySuffix, flags) {
    return new RegExp(`${leftBoundary}` +
        `${primaryPrefix}` +
        `(\\d{1,4})` +
        `(?:` +
        `(?:\\.|:|：)` +
        `(\\d{1,2})` +
        `(?:` +
        `(?::|：)` +
        `(\\d{2})` +
        `(?:\\.(\\d{1,6}))?` +
        `)?` +
        `)?` +
        `(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?` +
        `${primarySuffix}`, flags);
}
function followingTimePatten(followingPhase, followingSuffix) {
    return new RegExp(`^(${followingPhase})` +
        `(\\d{1,4})` +
        `(?:` +
        `(?:\\.|\\:|\\：)` +
        `(\\d{1,2})` +
        `(?:` +
        `(?:\\.|\\:|\\：)` +
        `(\\d{1,2})(?:\\.(\\d{1,6}))?` +
        `)?` +
        `)?` +
        `(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?` +
        `${followingSuffix}`, "i");
}
const HOUR_GROUP = 2;
const MINUTE_GROUP = 3;
const SECOND_GROUP = 4;
const MILLI_SECOND_GROUP = 5;
const AM_PM_HOUR_GROUP = 6;
class AbstractTimeExpressionParser {
    constructor(strictMode = false) {
        this.cachedPrimaryPrefix = null;
        this.cachedPrimarySuffix = null;
        this.cachedPrimaryTimePattern = null;
        this.cachedFollowingPhase = null;
        this.cachedFollowingSuffix = null;
        this.cachedFollowingTimePatten = null;
        this.strictMode = strictMode;
    }
    patternFlags() {
        return "i";
    }
    primaryPatternLeftBoundary() {
        return `(^|\\s|T|\\b)`;
    }
    primarySuffix() {
        return `(?=\\W|$)`;
    }
    followingSuffix() {
        return `(?=\\W|$)`;
    }
    pattern(context) {
        return this.getPrimaryTimePatternThroughCache();
    }
    extract(context, match) {
        const startComponents = this.extractPrimaryTimeComponents(context, match);
        if (!startComponents) {
            match.index += match[0].length;
            return null;
        }
        const index = match.index + match[1].length;
        const text = match[0].substring(match[1].length);
        const result = context.createParsingResult(index, text, startComponents);
        match.index += match[0].length;
        const remainingText = context.text.substring(match.index);
        const followingPattern = this.getFollowingTimePatternThroughCache();
        const followingMatch = followingPattern.exec(remainingText);
        if (text.match(/^\d{3,4}/) && followingMatch && followingMatch[0].match(/^\s*([+-])\s*\d{2,4}$/)) {
            return null;
        }
        if (!followingMatch ||
            followingMatch[0].match(/^\s*([+-])\s*\d{3,4}$/)) {
            return this.checkAndReturnWithoutFollowingPattern(result);
        }
        result.end = this.extractFollowingTimeComponents(context, followingMatch, result);
        if (result.end) {
            result.text += followingMatch[0];
        }
        return this.checkAndReturnWithFollowingPattern(result);
    }
    extractPrimaryTimeComponents(context, match, strict = false) {
        const components = context.createParsingComponents();
        let minute = 0;
        let meridiem = null;
        let hour = parseInt(match[HOUR_GROUP]);
        if (hour > 100) {
            if (this.strictMode || match[MINUTE_GROUP] != null) {
                return null;
            }
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (hour > 24) {
            return null;
        }
        if (match[MINUTE_GROUP] != null) {
            if (match[MINUTE_GROUP].length == 1 && !match[AM_PM_HOUR_GROUP]) {
                return null;
            }
            minute = parseInt(match[MINUTE_GROUP]);
        }
        if (minute >= 60) {
            return null;
        }
        if (hour > 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12)
                return null;
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                }
            }
            if (ampm == "p") {
                meridiem = dist.Meridiem.PM;
                if (hour != 12) {
                    hour += 12;
                }
            }
        }
        components.assign("hour", hour);
        components.assign("minute", minute);
        if (meridiem !== null) {
            components.assign("meridiem", meridiem);
        }
        else {
            if (hour < 12) {
                components.imply("meridiem", dist.Meridiem.AM);
            }
            else {
                components.imply("meridiem", dist.Meridiem.PM);
            }
        }
        if (match[MILLI_SECOND_GROUP] != null) {
            const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
            if (millisecond >= 1000)
                return null;
            components.assign("millisecond", millisecond);
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            components.assign("second", second);
        }
        return components;
    }
    extractFollowingTimeComponents(context, match, result) {
        const components = context.createParsingComponents();
        if (match[MILLI_SECOND_GROUP] != null) {
            const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
            if (millisecond >= 1000)
                return null;
            components.assign("millisecond", millisecond);
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            components.assign("second", second);
        }
        let hour = parseInt(match[HOUR_GROUP]);
        let minute = 0;
        let meridiem = -1;
        if (match[MINUTE_GROUP] != null) {
            minute = parseInt(match[MINUTE_GROUP]);
        }
        else if (hour > 100) {
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (minute >= 60 || hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12) {
                return null;
            }
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                    if (!components.isCertain("day")) {
                        components.imply("day", components.get("day") + 1);
                    }
                }
            }
            if (ampm == "p") {
                meridiem = dist.Meridiem.PM;
                if (hour != 12)
                    hour += 12;
            }
            if (!result.start.isCertain("meridiem")) {
                if (meridiem == dist.Meridiem.AM) {
                    result.start.imply("meridiem", dist.Meridiem.AM);
                    if (result.start.get("hour") == 12) {
                        result.start.assign("hour", 0);
                    }
                }
                else {
                    result.start.imply("meridiem", dist.Meridiem.PM);
                    if (result.start.get("hour") != 12) {
                        result.start.assign("hour", result.start.get("hour") + 12);
                    }
                }
            }
        }
        components.assign("hour", hour);
        components.assign("minute", minute);
        if (meridiem >= 0) {
            components.assign("meridiem", meridiem);
        }
        else {
            const startAtPM = result.start.isCertain("meridiem") && result.start.get("hour") > 12;
            if (startAtPM) {
                if (result.start.get("hour") - 12 > hour) {
                    components.imply("meridiem", dist.Meridiem.AM);
                }
                else if (hour <= 12) {
                    components.assign("hour", hour + 12);
                    components.assign("meridiem", dist.Meridiem.PM);
                }
            }
            else if (hour > 12) {
                components.imply("meridiem", dist.Meridiem.PM);
            }
            else if (hour <= 12) {
                components.imply("meridiem", dist.Meridiem.AM);
            }
        }
        if (components.date().getTime() < result.start.date().getTime()) {
            components.imply("day", components.get("day") + 1);
        }
        return components;
    }
    checkAndReturnWithoutFollowingPattern(result) {
        if (result.text.match(/^\d$/)) {
            return null;
        }
        if (result.text.match(/^\d\d\d+$/)) {
            return null;
        }
        if (result.text.match(/\d[apAP]$/)) {
            return null;
        }
        const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)$/);
        if (endingWithNumbers) {
            const endingNumbers = endingWithNumbers[1];
            if (this.strictMode) {
                return null;
            }
            if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
                return null;
            }
            const endingNumberVal = parseInt(endingNumbers);
            if (endingNumberVal > 24) {
                return null;
            }
        }
        return result;
    }
    checkAndReturnWithFollowingPattern(result) {
        if (result.text.match(/^\d+-\d+$/)) {
            return null;
        }
        const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)\s*-\s*(\d[\d.]+)$/);
        if (endingWithNumbers) {
            if (this.strictMode) {
                return null;
            }
            const startingNumbers = endingWithNumbers[1];
            const endingNumbers = endingWithNumbers[2];
            if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
                return null;
            }
            const endingNumberVal = parseInt(endingNumbers);
            const startingNumberVal = parseInt(startingNumbers);
            if (endingNumberVal > 24 || startingNumberVal > 24) {
                return null;
            }
        }
        return result;
    }
    getPrimaryTimePatternThroughCache() {
        const primaryPrefix = this.primaryPrefix();
        const primarySuffix = this.primarySuffix();
        if (this.cachedPrimaryPrefix === primaryPrefix && this.cachedPrimarySuffix === primarySuffix) {
            return this.cachedPrimaryTimePattern;
        }
        this.cachedPrimaryTimePattern = primaryTimePattern(this.primaryPatternLeftBoundary(), primaryPrefix, primarySuffix, this.patternFlags());
        this.cachedPrimaryPrefix = primaryPrefix;
        this.cachedPrimarySuffix = primarySuffix;
        return this.cachedPrimaryTimePattern;
    }
    getFollowingTimePatternThroughCache() {
        const followingPhase = this.followingPhase();
        const followingSuffix = this.followingSuffix();
        if (this.cachedFollowingPhase === followingPhase && this.cachedFollowingSuffix === followingSuffix) {
            return this.cachedFollowingTimePatten;
        }
        this.cachedFollowingTimePatten = followingTimePatten(followingPhase, followingSuffix);
        this.cachedFollowingPhase = followingPhase;
        this.cachedFollowingSuffix = followingSuffix;
        return this.cachedFollowingTimePatten;
    }
}
exports.AbstractTimeExpressionParser = AbstractTimeExpressionParser;
//# sourceMappingURL=AbstractTimeExpressionParser.js.map
});

var ENTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class ENTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    constructor(strictMode) {
        super(strictMode);
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|to|\\?)\\s*";
    }
    primaryPrefix() {
        return "(?:(?:at|from)\\s*)??";
    }
    primarySuffix() {
        return "(?:\\s*(?:o\\W*clock|at\\s*night|in\\s*the\\s*(?:morning|afternoon)))?(?!/)(?=\\W|$)";
    }
    extractPrimaryTimeComponents(context, match) {
        const components = super.extractPrimaryTimeComponents(context, match);
        if (components) {
            if (match[0].endsWith("night")) {
                const hour = components.get("hour");
                if (hour >= 6 && hour < 12) {
                    components.assign("hour", components.get("hour") + 12);
                    components.assign("meridiem", dist.Meridiem.PM);
                }
                else if (hour < 6) {
                    components.assign("meridiem", dist.Meridiem.AM);
                }
            }
            if (match[0].endsWith("afternoon")) {
                components.assign("meridiem", dist.Meridiem.PM);
                const hour = components.get("hour");
                if (hour >= 0 && hour <= 6) {
                    components.assign("hour", components.get("hour") + 12);
                }
            }
            if (match[0].endsWith("morning")) {
                components.assign("meridiem", dist.Meridiem.AM);
                const hour = components.get("hour");
                if (hour < 12) {
                    components.assign("hour", components.get("hour"));
                }
            }
        }
        return components;
    }
}
exports.default = ENTimeExpressionParser;
//# sourceMappingURL=ENTimeExpressionParser.js.map
});

var timeunits = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImpliedTimeUnits = exports.reverseTimeUnits = void 0;
function reverseTimeUnits(timeUnits) {
    const reversed = {};
    for (const key in timeUnits) {
        reversed[key] = -timeUnits[key];
    }
    return reversed;
}
exports.reverseTimeUnits = reverseTimeUnits;
function addImpliedTimeUnits(components, timeUnits) {
    const output = components.clone();
    let date = components.dayjs();
    for (const key in timeUnits) {
        date = date.add(timeUnits[key], key);
    }
    if ("day" in timeUnits || "d" in timeUnits || "week" in timeUnits || "month" in timeUnits || "year" in timeUnits) {
        output.imply("day", date.date());
        output.imply("month", date.month() + 1);
        output.imply("year", date.year());
    }
    if ("second" in timeUnits || "minute" in timeUnits || "hour" in timeUnits) {
        output.imply("second", date.second());
        output.imply("minute", date.minute());
        output.imply("hour", date.hour());
    }
    return output;
}
exports.addImpliedTimeUnits = addImpliedTimeUnits;
//# sourceMappingURL=timeunits.js.map
});

var ENTimeUnitAgoFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp(`(${constants$9.TIME_UNITS_PATTERN})\\s{0,5}(?:ago|before|earlier)(?=(?:\\W|$))`, "i");
const STRICT_PATTERN = new RegExp(`(${constants$9.TIME_UNITS_PATTERN})\\s{0,5}ago(?=(?:\\W|$))`, "i");
class ENTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
    }
    innerExtract(context, match) {
        const timeUnits = constants$9.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits.reverseTimeUnits(timeUnits);
        return results.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
    }
}
exports.default = ENTimeUnitAgoFormatParser;
//# sourceMappingURL=ENTimeUnitAgoFormatParser.js.map
});

var ENTimeUnitLaterFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp(`(${constants$9.TIME_UNITS_PATTERN})\\s{0,5}(?:later|after|from now|henceforth|forward|out)` + "(?=(?:\\W|$))", "i");
const STRICT_PATTERN = new RegExp("" + "(" + constants$9.TIME_UNITS_PATTERN + ")" + "(later|from now)" + "(?=(?:\\W|$))", "i");
const GROUP_NUM_TIMEUNITS = 1;
class ENTimeUnitLaterFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
    }
    innerExtract(context, match) {
        const fragments = constants$9.parseTimeUnits(match[GROUP_NUM_TIMEUNITS]);
        return results.ParsingComponents.createRelativeFromReference(context.reference, fragments);
    }
}
exports.default = ENTimeUnitLaterFormatParser;
//# sourceMappingURL=ENTimeUnitLaterFormatParser.js.map
});

var abstractRefiners = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergingRefiner = exports.Filter = void 0;
class Filter {
    refine(context, results) {
        return results.filter((r) => this.isValid(context, r));
    }
}
exports.Filter = Filter;
class MergingRefiner {
    refine(context, results) {
        if (results.length < 2) {
            return results;
        }
        const mergedResults = [];
        let curResult = results[0];
        let nextResult = null;
        for (let i = 1; i < results.length; i++) {
            nextResult = results[i];
            const textBetween = context.text.substring(curResult.index + curResult.text.length, nextResult.index);
            if (!this.shouldMergeResults(textBetween, curResult, nextResult, context)) {
                mergedResults.push(curResult);
                curResult = nextResult;
            }
            else {
                const left = curResult;
                const right = nextResult;
                const mergedResult = this.mergeResults(textBetween, left, right, context);
                context.debug(() => {
                    console.log(`${this.constructor.name} merged ${left} and ${right} into ${mergedResult}`);
                });
                curResult = mergedResult;
            }
        }
        if (curResult != null) {
            mergedResults.push(curResult);
        }
        return mergedResults;
    }
}
exports.MergingRefiner = MergingRefiner;
//# sourceMappingURL=abstractRefiners.js.map
});

var AbstractMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class AbstractMergeDateRangeRefiner extends abstractRefiners.MergingRefiner {
    shouldMergeResults(textBetween, currentResult, nextResult) {
        return !currentResult.end && !nextResult.end && textBetween.match(this.patternBetween()) != null;
    }
    mergeResults(textBetween, fromResult, toResult) {
        if (!fromResult.start.isOnlyWeekdayComponent() && !toResult.start.isOnlyWeekdayComponent()) {
            toResult.start.getCertainComponents().forEach((key) => {
                if (!fromResult.start.isCertain(key)) {
                    fromResult.start.assign(key, toResult.start.get(key));
                }
            });
            fromResult.start.getCertainComponents().forEach((key) => {
                if (!toResult.start.isCertain(key)) {
                    toResult.start.assign(key, fromResult.start.get(key));
                }
            });
        }
        if (fromResult.start.date().getTime() > toResult.start.date().getTime()) {
            let fromMoment = fromResult.start.dayjs();
            let toMoment = toResult.start.dayjs();
            if (fromResult.start.isOnlyWeekdayComponent() && fromMoment.add(-7, "days").isBefore(toMoment)) {
                fromMoment = fromMoment.add(-7, "days");
                fromResult.start.imply("day", fromMoment.date());
                fromResult.start.imply("month", fromMoment.month() + 1);
                fromResult.start.imply("year", fromMoment.year());
            }
            else if (toResult.start.isOnlyWeekdayComponent() && toMoment.add(7, "days").isAfter(fromMoment)) {
                toMoment = toMoment.add(7, "days");
                toResult.start.imply("day", toMoment.date());
                toResult.start.imply("month", toMoment.month() + 1);
                toResult.start.imply("year", toMoment.year());
            }
            else {
                [toResult, fromResult] = [fromResult, toResult];
            }
        }
        const result = fromResult.clone();
        result.start = fromResult.start;
        result.end = toResult.start;
        result.index = Math.min(fromResult.index, toResult.index);
        if (fromResult.index < toResult.index) {
            result.text = fromResult.text + textBetween + toResult.text;
        }
        else {
            result.text = toResult.text + textBetween + fromResult.text;
        }
        return result;
    }
}
exports.default = AbstractMergeDateRangeRefiner;
//# sourceMappingURL=AbstractMergeDateRangeRefiner.js.map
});

var ENMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class ENMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(to|-)\s*$/i;
    }
}
exports.default = ENMergeDateRangeRefiner;
//# sourceMappingURL=ENMergeDateRangeRefiner.js.map
});

var mergingCalculation = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDateTimeComponent = exports.mergeDateTimeResult = void 0;

function mergeDateTimeResult(dateResult, timeResult) {
    const result = dateResult.clone();
    const beginDate = dateResult.start;
    const beginTime = timeResult.start;
    result.start = mergeDateTimeComponent(beginDate, beginTime);
    if (dateResult.end != null || timeResult.end != null) {
        const endDate = dateResult.end == null ? dateResult.start : dateResult.end;
        const endTime = timeResult.end == null ? timeResult.start : timeResult.end;
        const endDateTime = mergeDateTimeComponent(endDate, endTime);
        if (dateResult.end == null && endDateTime.date().getTime() < result.start.date().getTime()) {
            if (endDateTime.isCertain("day")) {
                endDateTime.assign("day", endDateTime.get("day") + 1);
            }
            else {
                endDateTime.imply("day", endDateTime.get("day") + 1);
            }
        }
        result.end = endDateTime;
    }
    return result;
}
exports.mergeDateTimeResult = mergeDateTimeResult;
function mergeDateTimeComponent(dateComponent, timeComponent) {
    const dateTimeComponent = dateComponent.clone();
    if (timeComponent.isCertain("hour")) {
        dateTimeComponent.assign("hour", timeComponent.get("hour"));
        dateTimeComponent.assign("minute", timeComponent.get("minute"));
        if (timeComponent.isCertain("second")) {
            dateTimeComponent.assign("second", timeComponent.get("second"));
            if (timeComponent.isCertain("millisecond")) {
                dateTimeComponent.assign("millisecond", timeComponent.get("millisecond"));
            }
            else {
                dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
            }
        }
        else {
            dateTimeComponent.imply("second", timeComponent.get("second"));
            dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
        }
    }
    else {
        dateTimeComponent.imply("hour", timeComponent.get("hour"));
        dateTimeComponent.imply("minute", timeComponent.get("minute"));
        dateTimeComponent.imply("second", timeComponent.get("second"));
        dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
    }
    if (timeComponent.isCertain("timezoneOffset")) {
        dateTimeComponent.assign("timezoneOffset", timeComponent.get("timezoneOffset"));
    }
    if (timeComponent.isCertain("meridiem")) {
        dateTimeComponent.assign("meridiem", timeComponent.get("meridiem"));
    }
    else if (timeComponent.get("meridiem") != null && dateTimeComponent.get("meridiem") == null) {
        dateTimeComponent.imply("meridiem", timeComponent.get("meridiem"));
    }
    if (dateTimeComponent.get("meridiem") == dist.Meridiem.PM && dateTimeComponent.get("hour") < 12) {
        if (timeComponent.isCertain("hour")) {
            dateTimeComponent.assign("hour", dateTimeComponent.get("hour") + 12);
        }
        else {
            dateTimeComponent.imply("hour", dateTimeComponent.get("hour") + 12);
        }
    }
    return dateTimeComponent;
}
exports.mergeDateTimeComponent = mergeDateTimeComponent;
//# sourceMappingURL=mergingCalculation.js.map
});

var AbstractMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class AbstractMergeDateTimeRefiner extends abstractRefiners.MergingRefiner {
    shouldMergeResults(textBetween, currentResult, nextResult) {
        return (((currentResult.start.isOnlyDate() && nextResult.start.isOnlyTime()) ||
            (nextResult.start.isOnlyDate() && currentResult.start.isOnlyTime())) &&
            textBetween.match(this.patternBetween()) != null);
    }
    mergeResults(textBetween, currentResult, nextResult) {
        const result = currentResult.start.isOnlyDate()
            ? mergingCalculation.mergeDateTimeResult(currentResult, nextResult)
            : mergingCalculation.mergeDateTimeResult(nextResult, currentResult);
        result.index = currentResult.index;
        result.text = currentResult.text + textBetween + nextResult.text;
        return result;
    }
}
exports.default = AbstractMergeDateTimeRefiner;
//# sourceMappingURL=AbstractMergeDateTimeRefiner.js.map
});

var ENMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1$1 = __importDefault(AbstractMergeDateTimeRefiner_1);
class ENMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1$1.default {
    patternBetween() {
        return new RegExp("^\\s*(T|at|after|before|on|of|,|-)?\\s*$");
    }
}
exports.default = ENMergeDateTimeRefiner;
//# sourceMappingURL=ENMergeDateTimeRefiner.js.map
});

var ExtractTimezoneAbbrRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
const TIMEZONE_NAME_PATTERN = new RegExp("^\\s*,?\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)", "i");
const DEFAULT_TIMEZONE_ABBR_MAP = {
    ACDT: 630,
    ACST: 570,
    ADT: -180,
    AEDT: 660,
    AEST: 600,
    AFT: 270,
    AKDT: -480,
    AKST: -540,
    ALMT: 360,
    AMST: -180,
    AMT: -240,
    ANAST: 720,
    ANAT: 720,
    AQTT: 300,
    ART: -180,
    AST: -240,
    AWDT: 540,
    AWST: 480,
    AZOST: 0,
    AZOT: -60,
    AZST: 300,
    AZT: 240,
    BNT: 480,
    BOT: -240,
    BRST: -120,
    BRT: -180,
    BST: 60,
    BTT: 360,
    CAST: 480,
    CAT: 120,
    CCT: 390,
    CDT: -300,
    CEST: 120,
    CET: 60,
    CHADT: 825,
    CHAST: 765,
    CKT: -600,
    CLST: -180,
    CLT: -240,
    COT: -300,
    CST: -360,
    CVT: -60,
    CXT: 420,
    ChST: 600,
    DAVT: 420,
    EASST: -300,
    EAST: -360,
    EAT: 180,
    ECT: -300,
    EDT: -240,
    EEST: 180,
    EET: 120,
    EGST: 0,
    EGT: -60,
    EST: -300,
    ET: -300,
    FJST: 780,
    FJT: 720,
    FKST: -180,
    FKT: -240,
    FNT: -120,
    GALT: -360,
    GAMT: -540,
    GET: 240,
    GFT: -180,
    GILT: 720,
    GMT: 0,
    GST: 240,
    GYT: -240,
    HAA: -180,
    HAC: -300,
    HADT: -540,
    HAE: -240,
    HAP: -420,
    HAR: -360,
    HAST: -600,
    HAT: -90,
    HAY: -480,
    HKT: 480,
    HLV: -210,
    HNA: -240,
    HNC: -360,
    HNE: -300,
    HNP: -480,
    HNR: -420,
    HNT: -150,
    HNY: -540,
    HOVT: 420,
    ICT: 420,
    IDT: 180,
    IOT: 360,
    IRDT: 270,
    IRKST: 540,
    IRKT: 540,
    IRST: 210,
    IST: 330,
    JST: 540,
    KGT: 360,
    KRAST: 480,
    KRAT: 480,
    KST: 540,
    KUYT: 240,
    LHDT: 660,
    LHST: 630,
    LINT: 840,
    MAGST: 720,
    MAGT: 720,
    MART: -510,
    MAWT: 300,
    MDT: -360,
    MESZ: 120,
    MEZ: 60,
    MHT: 720,
    MMT: 390,
    MSD: 240,
    MSK: 240,
    MST: -420,
    MUT: 240,
    MVT: 300,
    MYT: 480,
    NCT: 660,
    NDT: -90,
    NFT: 690,
    NOVST: 420,
    NOVT: 360,
    NPT: 345,
    NST: -150,
    NUT: -660,
    NZDT: 780,
    NZST: 720,
    OMSST: 420,
    OMST: 420,
    PDT: -420,
    PET: -300,
    PETST: 720,
    PETT: 720,
    PGT: 600,
    PHOT: 780,
    PHT: 480,
    PKT: 300,
    PMDT: -120,
    PMST: -180,
    PONT: 660,
    PST: -480,
    PT: -480,
    PWT: 540,
    PYST: -180,
    PYT: -240,
    RET: 240,
    SAMT: 240,
    SAST: 120,
    SBT: 660,
    SCT: 240,
    SGT: 480,
    SRT: -180,
    SST: -660,
    TAHT: -600,
    TFT: 300,
    TJT: 300,
    TKT: 780,
    TLT: 540,
    TMT: 300,
    TVT: 720,
    ULAT: 480,
    UTC: 0,
    UYST: -120,
    UYT: -180,
    UZT: 300,
    VET: -210,
    VLAST: 660,
    VLAT: 660,
    VUT: 660,
    WAST: 120,
    WAT: 60,
    WEST: 60,
    WESZ: 60,
    WET: 0,
    WEZ: 0,
    WFT: 720,
    WGST: -120,
    WGT: -180,
    WIB: 420,
    WIT: 540,
    WITA: 480,
    WST: 780,
    WT: 0,
    YAKST: 600,
    YAKT: 600,
    YAPT: 600,
    YEKST: 360,
    YEKT: 360,
};
class ExtractTimezoneAbbrRefiner {
    constructor(timezoneOverrides) {
        this.timezone = Object.assign(Object.assign({}, DEFAULT_TIMEZONE_ABBR_MAP), timezoneOverrides);
    }
    refine(context, results) {
        var _a;
        const timezoneOverrides = (_a = context.option.timezones) !== null && _a !== void 0 ? _a : {};
        results.forEach((result) => {
            var _a, _b;
            const suffix = context.text.substring(result.index + result.text.length);
            const match = TIMEZONE_NAME_PATTERN.exec(suffix);
            if (!match) {
                return;
            }
            const timezoneAbbr = match[1].toUpperCase();
            const extractedTimezoneOffset = (_b = (_a = timezoneOverrides[timezoneAbbr]) !== null && _a !== void 0 ? _a : this.timezone[timezoneAbbr]) !== null && _b !== void 0 ? _b : null;
            if (extractedTimezoneOffset === null) {
                return;
            }
            context.debug(() => {
                console.log(`Extracting timezone: '${timezoneAbbr}' into: ${extractedTimezoneOffset} for: ${result.start}`);
            });
            const currentTimezoneOffset = result.start.get("timezoneOffset");
            if (currentTimezoneOffset !== null && extractedTimezoneOffset != currentTimezoneOffset) {
                if (result.start.isCertain("timezoneOffset")) {
                    return;
                }
                if (timezoneAbbr != match[1]) {
                    return;
                }
            }
            if (result.start.isOnlyDate()) {
                if (timezoneAbbr != match[1]) {
                    return;
                }
            }
            result.text += match[0];
            if (!result.start.isCertain("timezoneOffset")) {
                result.start.assign("timezoneOffset", extractedTimezoneOffset);
            }
            if (result.end != null && !result.end.isCertain("timezoneOffset")) {
                result.end.assign("timezoneOffset", extractedTimezoneOffset);
            }
        });
        return results;
    }
}
exports.default = ExtractTimezoneAbbrRefiner;
//# sourceMappingURL=ExtractTimezoneAbbrRefiner.js.map
});

var ExtractTimezoneOffsetRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
const TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(?:\\(?(?:GMT|UTC)\\s?)?([+-])(\\d{1,2})(?::?(\\d{2}))?\\)?", "i");
const TIMEZONE_OFFSET_SIGN_GROUP = 1;
const TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 2;
const TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 3;
class ExtractTimezoneOffsetRefiner {
    refine(context, results) {
        results.forEach(function (result) {
            if (result.start.isCertain("timezoneOffset")) {
                return;
            }
            const suffix = context.text.substring(result.index + result.text.length);
            const match = TIMEZONE_OFFSET_PATTERN.exec(suffix);
            if (!match) {
                return;
            }
            context.debug(() => {
                console.log(`Extracting timezone: '${match[0]}' into : ${result}`);
            });
            const hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
            const minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP] || "0");
            let timezoneOffset = hourOffset * 60 + minuteOffset;
            if (timezoneOffset > 14 * 60) {
                return;
            }
            if (match[TIMEZONE_OFFSET_SIGN_GROUP] === "-") {
                timezoneOffset = -timezoneOffset;
            }
            if (result.end != null) {
                result.end.assign("timezoneOffset", timezoneOffset);
            }
            result.start.assign("timezoneOffset", timezoneOffset);
            result.text += match[0];
        });
        return results;
    }
}
exports.default = ExtractTimezoneOffsetRefiner;
//# sourceMappingURL=ExtractTimezoneOffsetRefiner.js.map
});

var OverlapRemovalRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
class OverlapRemovalRefiner {
    refine(context, results) {
        if (results.length < 2) {
            return results;
        }
        const filteredResults = [];
        let prevResult = results[0];
        for (let i = 1; i < results.length; i++) {
            const result = results[i];
            if (result.index < prevResult.index + prevResult.text.length) {
                if (result.text.length > prevResult.text.length) {
                    prevResult = result;
                }
            }
            else {
                filteredResults.push(prevResult);
                prevResult = result;
            }
        }
        if (prevResult != null) {
            filteredResults.push(prevResult);
        }
        return filteredResults;
    }
}
exports.default = OverlapRemovalRefiner;
//# sourceMappingURL=OverlapRemovalRefiner.js.map
});

var ForwardDateRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);

class ForwardDateRefiner {
    refine(context, results) {
        if (!context.option.forwardDate) {
            return results;
        }
        results.forEach(function (result) {
            let refMoment = dayjs_1.default(context.refDate);
            if (result.start.isOnlyTime() && refMoment.isAfter(result.start.dayjs())) {
                refMoment = refMoment.add(1, "day");
                dayjs.implySimilarDate(result.start, refMoment);
                if (result.end && result.end.isOnlyTime()) {
                    dayjs.implySimilarDate(result.end, refMoment);
                    if (result.start.dayjs().isAfter(result.end.dayjs())) {
                        refMoment = refMoment.add(1, "day");
                        dayjs.implySimilarDate(result.end, refMoment);
                    }
                }
            }
            if (result.start.isOnlyDayMonthComponent() && refMoment.isAfter(result.start.dayjs())) {
                for (let i = 0; i < 3 && refMoment.isAfter(result.start.dayjs()); i++) {
                    result.start.imply("year", result.start.get("year") + 1);
                    context.debug(() => {
                        console.log(`Forward yearly adjusted for ${result} (${result.start})`);
                    });
                    if (result.end && !result.end.isCertain("year")) {
                        result.end.imply("year", result.end.get("year") + 1);
                        context.debug(() => {
                            console.log(`Forward yearly adjusted for ${result} (${result.end})`);
                        });
                    }
                }
            }
            if (result.start.isOnlyWeekdayComponent() && refMoment.isAfter(result.start.dayjs())) {
                if (refMoment.day() >= result.start.get("weekday")) {
                    refMoment = refMoment.day(result.start.get("weekday") + 7);
                }
                else {
                    refMoment = refMoment.day(result.start.get("weekday"));
                }
                result.start.imply("day", refMoment.date());
                result.start.imply("month", refMoment.month() + 1);
                result.start.imply("year", refMoment.year());
                context.debug(() => {
                    console.log(`Forward weekly adjusted for ${result} (${result.start})`);
                });
                if (result.end && result.end.isOnlyWeekdayComponent()) {
                    if (refMoment.day() > result.end.get("weekday")) {
                        refMoment = refMoment.day(result.end.get("weekday") + 7);
                    }
                    else {
                        refMoment = refMoment.day(result.end.get("weekday"));
                    }
                    result.end.imply("day", refMoment.date());
                    result.end.imply("month", refMoment.month() + 1);
                    result.end.imply("year", refMoment.year());
                    context.debug(() => {
                        console.log(`Forward weekly adjusted for ${result} (${result.end})`);
                    });
                }
            }
        });
        return results;
    }
}
exports.default = ForwardDateRefiner;
//# sourceMappingURL=ForwardDateRefiner.js.map
});

var UnlikelyFormatFilter_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class UnlikelyFormatFilter extends abstractRefiners.Filter {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    isValid(context, result) {
        if (result.text.replace(" ", "").match(/^\d*(\.\d*)?$/)) {
            context.debug(() => {
                console.log(`Removing unlikely result '${result.text}'`);
            });
            return false;
        }
        if (!result.start.isValidDate()) {
            context.debug(() => {
                console.log(`Removing invalid result: ${result} (${result.start})`);
            });
            return false;
        }
        if (result.end && !result.end.isValidDate()) {
            context.debug(() => {
                console.log(`Removing invalid result: ${result} (${result.end})`);
            });
            return false;
        }
        if (this.strictMode) {
            return this.isStrictModeValid(context, result);
        }
        return true;
    }
    isStrictModeValid(context, result) {
        if (result.start.isOnlyWeekdayComponent()) {
            context.debug(() => {
                console.log(`(Strict) Removing weekday only component: ${result} (${result.end})`);
            });
            return false;
        }
        if (result.start.isOnlyTime() && (!result.start.isCertain("hour") || !result.start.isCertain("minute"))) {
            context.debug(() => {
                console.log(`(Strict) Removing uncertain time component: ${result} (${result.end})`);
            });
            return false;
        }
        return true;
    }
}
exports.default = UnlikelyFormatFilter;
//# sourceMappingURL=UnlikelyFormatFilter.js.map
});

var ISOFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})" +
    "(?:T" +
    "([0-9]{1,2}):([0-9]{1,2})" +
    "(?:" +
    ":([0-9]{1,2})(?:\\.(\\d{1,4}))?" +
    ")?" +
    "(?:" +
    "Z|([+-]\\d{2}):?(\\d{2})?" +
    ")?" +
    ")?" +
    "(?=\\W|$)", "i");
const YEAR_NUMBER_GROUP = 1;
const MONTH_NUMBER_GROUP = 2;
const DATE_NUMBER_GROUP = 3;
const HOUR_NUMBER_GROUP = 4;
const MINUTE_NUMBER_GROUP = 5;
const SECOND_NUMBER_GROUP = 6;
const MILLISECOND_NUMBER_GROUP = 7;
const TZD_HOUR_OFFSET_GROUP = 8;
const TZD_MINUTE_OFFSET_GROUP = 9;
class ISOFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const components = {};
        components["year"] = parseInt(match[YEAR_NUMBER_GROUP]);
        components["month"] = parseInt(match[MONTH_NUMBER_GROUP]);
        components["day"] = parseInt(match[DATE_NUMBER_GROUP]);
        if (match[HOUR_NUMBER_GROUP] != null) {
            components["hour"] = parseInt(match[HOUR_NUMBER_GROUP]);
            components["minute"] = parseInt(match[MINUTE_NUMBER_GROUP]);
            if (match[SECOND_NUMBER_GROUP] != null) {
                components["second"] = parseInt(match[SECOND_NUMBER_GROUP]);
            }
            if (match[MILLISECOND_NUMBER_GROUP] != null) {
                components["millisecond"] = parseInt(match[MILLISECOND_NUMBER_GROUP]);
            }
            if (match[TZD_HOUR_OFFSET_GROUP] == null) {
                components["timezoneOffset"] = 0;
            }
            else {
                const hourOffset = parseInt(match[TZD_HOUR_OFFSET_GROUP]);
                let minuteOffset = 0;
                if (match[TZD_MINUTE_OFFSET_GROUP] != null) {
                    minuteOffset = parseInt(match[TZD_MINUTE_OFFSET_GROUP]);
                }
                let offset = hourOffset * 60;
                if (offset < 0) {
                    offset -= minuteOffset;
                }
                else {
                    offset += minuteOffset;
                }
                components["timezoneOffset"] = offset;
            }
        }
        return components;
    }
}
exports.default = ISOFormatParser;
//# sourceMappingURL=ISOFormatParser.js.map
});

var MergeWeekdayComponentRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class MergeWeekdayComponentRefiner extends abstractRefiners.MergingRefiner {
    mergeResults(textBetween, currentResult, nextResult) {
        const newResult = nextResult.clone();
        newResult.index = currentResult.index;
        newResult.text = currentResult.text + textBetween + newResult.text;
        newResult.start.assign("weekday", currentResult.start.get("weekday"));
        if (newResult.end) {
            newResult.end.assign("weekday", currentResult.start.get("weekday"));
        }
        return newResult;
    }
    shouldMergeResults(textBetween, currentResult, nextResult) {
        const weekdayThenNormalDate = currentResult.start.isOnlyWeekdayComponent() &&
            !currentResult.start.isCertain("hour") &&
            nextResult.start.isCertain("day");
        return weekdayThenNormalDate && textBetween.match(/^,?\s*$/) != null;
    }
}
exports.default = MergeWeekdayComponentRefiner;
//# sourceMappingURL=MergeWeekdayComponentRefiner.js.map
});

var configurations = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeCommonConfiguration = void 0;
const ExtractTimezoneAbbrRefiner_1$1 = __importDefault(ExtractTimezoneAbbrRefiner_1);
const ExtractTimezoneOffsetRefiner_1$1 = __importDefault(ExtractTimezoneOffsetRefiner_1);
const OverlapRemovalRefiner_1$1 = __importDefault(OverlapRemovalRefiner_1);
const ForwardDateRefiner_1$1 = __importDefault(ForwardDateRefiner_1);
const UnlikelyFormatFilter_1$1 = __importDefault(UnlikelyFormatFilter_1);
const ISOFormatParser_1$1 = __importDefault(ISOFormatParser_1);
const MergeWeekdayComponentRefiner_1$1 = __importDefault(MergeWeekdayComponentRefiner_1);
function includeCommonConfiguration(configuration, strictMode = false) {
    configuration.parsers.unshift(new ISOFormatParser_1$1.default());
    configuration.refiners.unshift(new MergeWeekdayComponentRefiner_1$1.default());
    configuration.refiners.unshift(new ExtractTimezoneAbbrRefiner_1$1.default());
    configuration.refiners.unshift(new ExtractTimezoneOffsetRefiner_1$1.default());
    configuration.refiners.unshift(new OverlapRemovalRefiner_1$1.default());
    configuration.refiners.push(new OverlapRemovalRefiner_1$1.default());
    configuration.refiners.push(new ForwardDateRefiner_1$1.default());
    configuration.refiners.push(new UnlikelyFormatFilter_1$1.default(strictMode));
    return configuration;
}
exports.includeCommonConfiguration = includeCommonConfiguration;
//# sourceMappingURL=configurations.js.map
});

var casualReferences = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noon = exports.afternoon = exports.morning = exports.midnight = exports.yesterdayEvening = exports.evening = exports.lastNight = exports.tonight = exports.theDayAfter = exports.tomorrow = exports.theDayBefore = exports.yesterday = exports.today = exports.now = void 0;

const dayjs_1 = __importDefault(dayjs_min);


function now(reference) {
    const targetDate = dayjs_1.default(reference.instant);
    const component = new results.ParsingComponents(reference, {});
    dayjs.assignSimilarDate(component, targetDate);
    dayjs.assignSimilarTime(component, targetDate);
    if (reference.timezoneOffset !== null) {
        component.assign("timezoneOffset", targetDate.utcOffset());
    }
    return component;
}
exports.now = now;
function today(reference) {
    const targetDate = dayjs_1.default(reference.instant);
    const component = new results.ParsingComponents(reference, {});
    dayjs.assignSimilarDate(component, targetDate);
    dayjs.implySimilarTime(component, targetDate);
    return component;
}
exports.today = today;
function yesterday(reference) {
    return theDayBefore(reference, 1);
}
exports.yesterday = yesterday;
function theDayBefore(reference, numDay) {
    return theDayAfter(reference, -numDay);
}
exports.theDayBefore = theDayBefore;
function tomorrow(reference) {
    return theDayAfter(reference, 1);
}
exports.tomorrow = tomorrow;
function theDayAfter(reference, nDays) {
    let targetDate = dayjs_1.default(reference.instant);
    const component = new results.ParsingComponents(reference, {});
    targetDate = targetDate.add(nDays, "day");
    dayjs.assignSimilarDate(component, targetDate);
    dayjs.implySimilarTime(component, targetDate);
    return component;
}
exports.theDayAfter = theDayAfter;
function tonight(reference, implyHour = 22) {
    const targetDate = dayjs_1.default(reference.instant);
    const component = new results.ParsingComponents(reference, {});
    component.imply("hour", implyHour);
    component.imply("meridiem", dist.Meridiem.PM);
    dayjs.assignSimilarDate(component, targetDate);
    return component;
}
exports.tonight = tonight;
function lastNight(reference, implyHour = 0) {
    let targetDate = dayjs_1.default(reference.instant);
    const component = new results.ParsingComponents(reference, {});
    if (targetDate.hour() < 6) {
        targetDate = targetDate.add(-1, "day");
    }
    dayjs.assignSimilarDate(component, targetDate);
    component.imply("hour", implyHour);
    return component;
}
exports.lastNight = lastNight;
function evening(reference, implyHour = 20) {
    const component = new results.ParsingComponents(reference, {});
    component.imply("meridiem", dist.Meridiem.PM);
    component.imply("hour", implyHour);
    return component;
}
exports.evening = evening;
function yesterdayEvening(reference, implyHour = 20) {
    let targetDate = dayjs_1.default(reference.instant);
    const component = new results.ParsingComponents(reference, {});
    targetDate = targetDate.add(-1, "day");
    dayjs.assignSimilarDate(component, targetDate);
    component.imply("hour", implyHour);
    component.imply("meridiem", dist.Meridiem.PM);
    return component;
}
exports.yesterdayEvening = yesterdayEvening;
function midnight(reference) {
    const component = new results.ParsingComponents(reference, {});
    const targetDate = dayjs_1.default(reference.instant);
    if (targetDate.hour() > 2) {
        dayjs.implyTheNextDay(component, targetDate);
    }
    component.assign("hour", 0);
    component.imply("minute", 0);
    component.imply("second", 0);
    component.imply("millisecond", 0);
    return component;
}
exports.midnight = midnight;
function morning(reference, implyHour = 6) {
    const component = new results.ParsingComponents(reference, {});
    component.imply("meridiem", dist.Meridiem.AM);
    component.imply("hour", implyHour);
    component.imply("minute", 0);
    component.imply("second", 0);
    component.imply("millisecond", 0);
    return component;
}
exports.morning = morning;
function afternoon(reference, implyHour = 15) {
    const component = new results.ParsingComponents(reference, {});
    component.imply("meridiem", dist.Meridiem.PM);
    component.imply("hour", implyHour);
    component.imply("minute", 0);
    component.imply("second", 0);
    component.imply("millisecond", 0);
    return component;
}
exports.afternoon = afternoon;
function noon(reference) {
    const component = new results.ParsingComponents(reference, {});
    component.imply("meridiem", dist.Meridiem.AM);
    component.imply("hour", 12);
    component.imply("minute", 0);
    component.imply("second", 0);
    component.imply("millisecond", 0);
    return component;
}
exports.noon = noon;
//# sourceMappingURL=casualReferences.js.map
});

var ENCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const references = __importStar(casualReferences);
const PATTERN = /(now|today|tonight|tomorrow|tmr|tmrw|yesterday|last\s*night)(?=\W|$)/i;
class ENCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return PATTERN;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "now":
                return references.now(context.reference);
            case "today":
                return references.today(context.reference);
            case "yesterday":
                return references.yesterday(context.reference);
            case "tomorrow":
            case "tmr":
            case "tmrw":
                return references.tomorrow(context.reference);
            case "tonight":
                return references.tonight(context.reference);
            default:
                if (lowerText.match(/last\s*night/)) {
                    if (targetDate.hour() > 6) {
                        targetDate = targetDate.add(-1, "day");
                    }
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
                break;
        }
        return component;
    }
}
exports.default = ENCasualDateParser;
//# sourceMappingURL=ENCasualDateParser.js.map
});

var ENCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const casualReferences$1 = __importStar(casualReferences);
const PATTERN = /(?:this)?\s{0,3}(morning|afternoon|evening|night|midnight|midday|noon)(?=\W|$)/i;
class ENCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        switch (match[1].toLowerCase()) {
            case "afternoon":
                return casualReferences$1.afternoon(context.reference);
            case "evening":
            case "night":
                return casualReferences$1.evening(context.reference);
            case "midnight":
                return casualReferences$1.midnight(context.reference);
            case "morning":
                return casualReferences$1.morning(context.reference);
            case "noon":
            case "midday":
                return casualReferences$1.noon(context.reference);
        }
        return null;
    }
}
exports.default = ENCasualTimeParser;
//# sourceMappingURL=ENCasualTimeParser.js.map
});

var weekdays = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackwardDaysToWeekday = exports.getDaysForwardToWeekday = exports.getDaysToWeekdayClosest = exports.getDaysToWeekday = exports.createParsingComponentsAtWeekday = void 0;



function createParsingComponentsAtWeekday(reference, weekday, modifier) {
    const refDate = reference.getDateWithAdjustedTimezone();
    const daysToWeekday = getDaysToWeekday(refDate, weekday, modifier);
    let components = new results.ParsingComponents(reference);
    components = timeunits.addImpliedTimeUnits(components, { "day": daysToWeekday });
    components.assign("weekday", weekday);
    return components;
}
exports.createParsingComponentsAtWeekday = createParsingComponentsAtWeekday;
function getDaysToWeekday(refDate, weekday, modifier) {
    const refWeekday = refDate.getDay();
    switch (modifier) {
        case "this":
            return getDaysForwardToWeekday(refDate, weekday);
        case "last":
            return getBackwardDaysToWeekday(refDate, weekday);
        case "next":
            if (refWeekday == dist.Weekday.SUNDAY) {
                return weekday == dist.Weekday.SUNDAY ? 7 : weekday;
            }
            if (refWeekday == dist.Weekday.SATURDAY) {
                if (weekday == dist.Weekday.SATURDAY)
                    return 7;
                if (weekday == dist.Weekday.SUNDAY)
                    return 8;
                return 1 + weekday;
            }
            if (weekday < refWeekday && weekday != dist.Weekday.SUNDAY) {
                return getDaysForwardToWeekday(refDate, weekday);
            }
            else {
                return getDaysForwardToWeekday(refDate, weekday) + 7;
            }
    }
    return getDaysToWeekdayClosest(refDate, weekday);
}
exports.getDaysToWeekday = getDaysToWeekday;
function getDaysToWeekdayClosest(refDate, weekday) {
    const backward = getBackwardDaysToWeekday(refDate, weekday);
    const forward = getDaysForwardToWeekday(refDate, weekday);
    return forward < -backward ? forward : backward;
}
exports.getDaysToWeekdayClosest = getDaysToWeekdayClosest;
function getDaysForwardToWeekday(refDate, weekday) {
    const refWeekday = refDate.getDay();
    let forwardCount = weekday - refWeekday;
    if (forwardCount < 0) {
        forwardCount += 7;
    }
    return forwardCount;
}
exports.getDaysForwardToWeekday = getDaysForwardToWeekday;
function getBackwardDaysToWeekday(refDate, weekday) {
    const refWeekday = refDate.getDay();
    let backwardCount = weekday - refWeekday;
    if (backwardCount >= 0) {
        backwardCount -= 7;
    }
    return backwardCount;
}
exports.getBackwardDaysToWeekday = getBackwardDaysToWeekday;
//# sourceMappingURL=weekdays.js.map
});

var ENWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:on\\s*?)?" +
    "(?:(this|last|past|next)\\s*)?" +
    `(${pattern.matchAnyPattern(constants$9.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(this|last|past|next)\\s*week)?" +
    "(?=\\W|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class ENWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const weekday = constants$9.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord == "last" || modifierWord == "past") {
            modifier = "last";
        }
        else if (modifierWord == "next") {
            modifier = "next";
        }
        else if (modifierWord == "this") {
            modifier = "this";
        }
        return weekdays.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    }
}
exports.default = ENWeekdayParser;
//# sourceMappingURL=ENWeekdayParser.js.map
});

var ENRelativeDateFormatParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp(`(this|last|past|next|after\\s*this)\\s*(${pattern.matchAnyPattern(constants$9.TIME_UNIT_DICTIONARY)})(?=\\s*)` + "(?=\\W|$)", "i");
const MODIFIER_WORD_GROUP = 1;
const RELATIVE_WORD_GROUP = 2;
class ENRelativeDateFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
        const timeunit = constants$9.TIME_UNIT_DICTIONARY[unitWord];
        if (modifier == "next" || modifier.startsWith("after")) {
            const timeUnits = {};
            timeUnits[timeunit] = 1;
            return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }
        if (modifier == "last" || modifier == "past") {
            const timeUnits = {};
            timeUnits[timeunit] = -1;
            return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }
        const components = context.createParsingComponents();
        let date = dayjs_1.default(context.reference.instant);
        if (unitWord.match(/week/i)) {
            date = date.add(-date.get("d"), "d");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.imply("year", date.year());
        }
        else if (unitWord.match(/month/i)) {
            date = date.add(-date.date() + 1, "d");
            components.imply("day", date.date());
            components.assign("year", date.year());
            components.assign("month", date.month() + 1);
        }
        else if (unitWord.match(/year/i)) {
            date = date.add(-date.date() + 1, "d");
            date = date.add(-date.month(), "month");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.assign("year", date.year());
        }
        return components;
    }
}
exports.default = ENRelativeDateFormatParser;
//# sourceMappingURL=ENRelativeDateFormatParser.js.map
});

var chrono$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingContext = exports.Chrono = void 0;


class Chrono {
    constructor(configuration) {
        configuration = configuration || en.createCasualConfiguration();
        this.parsers = [...configuration.parsers];
        this.refiners = [...configuration.refiners];
    }
    clone() {
        return new Chrono({
            parsers: [...this.parsers],
            refiners: [...this.refiners],
        });
    }
    parseDate(text, referenceDate, option) {
        const results = this.parse(text, referenceDate, option);
        return results.length > 0 ? results[0].start.date() : null;
    }
    parse(text, referenceDate, option) {
        const context = new ParsingContext(text, referenceDate, option);
        let results = [];
        this.parsers.forEach((parser) => {
            const parsedResults = Chrono.executeParser(context, parser);
            results = results.concat(parsedResults);
        });
        results.sort((a, b) => {
            return a.index - b.index;
        });
        this.refiners.forEach(function (refiner) {
            results = refiner.refine(context, results);
        });
        return results;
    }
    static executeParser(context, parser) {
        const results$1 = [];
        const pattern = parser.pattern(context);
        const originalText = context.text;
        let remainingText = context.text;
        let match = pattern.exec(remainingText);
        while (match) {
            const index = match.index + originalText.length - remainingText.length;
            match.index = index;
            const result = parser.extract(context, match);
            if (!result) {
                remainingText = originalText.substring(match.index + 1);
                match = pattern.exec(remainingText);
                continue;
            }
            let parsedResult = null;
            if (result instanceof results.ParsingResult) {
                parsedResult = result;
            }
            else if (result instanceof results.ParsingComponents) {
                parsedResult = context.createParsingResult(match.index, match[0]);
                parsedResult.start = result;
            }
            else {
                parsedResult = context.createParsingResult(match.index, match[0], result);
            }
            context.debug(() => console.log(`${parser.constructor.name} extracted result ${parsedResult}`));
            results$1.push(parsedResult);
            remainingText = originalText.substring(index + parsedResult.text.length);
            match = pattern.exec(remainingText);
        }
        return results$1;
    }
}
exports.Chrono = Chrono;
class ParsingContext {
    constructor(text, refDate, option) {
        this.text = text;
        this.reference = new results.ReferenceWithTimezone(refDate);
        this.option = option !== null && option !== void 0 ? option : {};
        this.refDate = this.reference.instant;
    }
    createParsingComponents(components) {
        if (components instanceof results.ParsingComponents) {
            return components;
        }
        return new results.ParsingComponents(this.reference, components);
    }
    createParsingResult(index, textOrEndIndex, startComponents, endComponents) {
        const text = typeof textOrEndIndex === "string" ? textOrEndIndex : this.text.substring(index, textOrEndIndex);
        const start = startComponents ? this.createParsingComponents(startComponents) : null;
        const end = endComponents ? this.createParsingComponents(endComponents) : null;
        return new results.ParsingResult(this.reference, index, text, start, end);
    }
    debug(block) {
        if (this.option.debug) {
            if (this.option.debug instanceof Function) {
                this.option.debug(block);
            }
            else {
                const handler = this.option.debug;
                handler.debug(block);
            }
        }
    }
}
exports.ParsingContext = ParsingContext;
//# sourceMappingURL=chrono.js.map
});

var SlashDateFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([^\\d]|^)" +
    "([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})" +
    "(?:[\\/\\.\\-]([0-9]{4}|[0-9]{2}))?" +
    "(\\W|$)", "i");
const OPENING_GROUP = 1;
const ENDING_GROUP = 5;
const FIRST_NUMBERS_GROUP = 2;
const SECOND_NUMBERS_GROUP = 3;
const YEAR_GROUP = 4;
class SlashDateFormatParser {
    constructor(littleEndian) {
        this.groupNumberMonth = littleEndian ? SECOND_NUMBERS_GROUP : FIRST_NUMBERS_GROUP;
        this.groupNumberDay = littleEndian ? FIRST_NUMBERS_GROUP : SECOND_NUMBERS_GROUP;
    }
    pattern() {
        return PATTERN;
    }
    extract(context, match) {
        if (match[OPENING_GROUP].length == 0 && match.index > 0 && match.index < context.text.length) {
            const previousChar = context.text[match.index - 1];
            if (previousChar >= "0" && previousChar <= "9") {
                return;
            }
        }
        const index = match.index + match[OPENING_GROUP].length;
        const text = match[0].substr(match[OPENING_GROUP].length, match[0].length - match[OPENING_GROUP].length - match[ENDING_GROUP].length);
        if (text.match(/^\d\.\d$/) || text.match(/^\d\.\d{1,2}\.\d{1,2}\s*$/)) {
            return;
        }
        if (!match[YEAR_GROUP] && match[0].indexOf("/") < 0) {
            return;
        }
        const result = context.createParsingResult(index, text);
        let month = parseInt(match[this.groupNumberMonth]);
        let day = parseInt(match[this.groupNumberDay]);
        if (month < 1 || month > 12) {
            if (month > 12) {
                if (day >= 1 && day <= 12 && month <= 31) {
                    [day, month] = [month, day];
                }
                else {
                    return null;
                }
            }
        }
        if (day < 1 || day > 31) {
            return null;
        }
        result.start.assign("day", day);
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
            const rawYearNumber = parseInt(match[YEAR_GROUP]);
            const year = years.findMostLikelyADYear(rawYearNumber);
            result.start.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        return result;
    }
}
exports.default = SlashDateFormatParser;
//# sourceMappingURL=SlashDateFormatParser.js.map
});

var ENTimeUnitCasualRelativeFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp(`(this|last|past|next|after|\\+|-)\\s*(${constants$9.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
class ENTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const prefix = match[1].toLowerCase();
        let timeUnits = constants$9.parseTimeUnits(match[2]);
        switch (prefix) {
            case "last":
            case "past":
            case "-":
                timeUnits = timeunits.reverseTimeUnits(timeUnits);
                break;
        }
        return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
exports.default = ENTimeUnitCasualRelativeFormatParser;
//# sourceMappingURL=ENTimeUnitCasualRelativeFormatParser.js.map
});

var ENMergeRelativeDateRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




function hasImpliedEarlierReferenceDate(result) {
    return result.text.match(/\s+(before|from)$/i) != null;
}
function hasImpliedLaterReferenceDate(result) {
    return result.text.match(/\s+(after|since)$/i) != null;
}
class ENMergeRelativeDateRefiner extends abstractRefiners.MergingRefiner {
    patternBetween() {
        return /^\s*$/i;
    }
    shouldMergeResults(textBetween, currentResult, nextResult) {
        if (!textBetween.match(this.patternBetween())) {
            return false;
        }
        if (!hasImpliedEarlierReferenceDate(currentResult) && !hasImpliedLaterReferenceDate(currentResult)) {
            return false;
        }
        return !!nextResult.start.get("day") && !!nextResult.start.get("month") && !!nextResult.start.get("year");
    }
    mergeResults(textBetween, currentResult, nextResult) {
        let timeUnits = constants$9.parseTimeUnits(currentResult.text);
        if (hasImpliedEarlierReferenceDate(currentResult)) {
            timeUnits = timeunits.reverseTimeUnits(timeUnits);
        }
        const components = results.ParsingComponents.createRelativeFromReference(new results.ReferenceWithTimezone(nextResult.start.date()), timeUnits);
        return new results.ParsingResult(nextResult.reference, currentResult.index, `${currentResult.text}${textBetween}${nextResult.text}`, components);
    }
}
exports.default = ENMergeRelativeDateRefiner;
//# sourceMappingURL=ENMergeRelativeDateRefiner.js.map
});

var en = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.GB = exports.strict = exports.casual = void 0;
const ENTimeUnitWithinFormatParser_1$1 = __importDefault(ENTimeUnitWithinFormatParser_1);
const ENMonthNameLittleEndianParser_1$1 = __importDefault(ENMonthNameLittleEndianParser_1);
const ENMonthNameMiddleEndianParser_1$1 = __importDefault(ENMonthNameMiddleEndianParser_1);
const ENMonthNameParser_1$1 = __importDefault(ENMonthNameParser_1);
const ENCasualYearMonthDayParser_1$1 = __importDefault(ENCasualYearMonthDayParser_1);
const ENSlashMonthFormatParser_1$1 = __importDefault(ENSlashMonthFormatParser_1);
const ENTimeExpressionParser_1$1 = __importDefault(ENTimeExpressionParser_1);
const ENTimeUnitAgoFormatParser_1$1 = __importDefault(ENTimeUnitAgoFormatParser_1);
const ENTimeUnitLaterFormatParser_1$1 = __importDefault(ENTimeUnitLaterFormatParser_1);
const ENMergeDateRangeRefiner_1$1 = __importDefault(ENMergeDateRangeRefiner_1);
const ENMergeDateTimeRefiner_1$1 = __importDefault(ENMergeDateTimeRefiner_1);

const ENCasualDateParser_1$1 = __importDefault(ENCasualDateParser_1);
const ENCasualTimeParser_1$1 = __importDefault(ENCasualTimeParser_1);
const ENWeekdayParser_1$1 = __importDefault(ENWeekdayParser_1);
const ENRelativeDateFormatParser_1$1 = __importDefault(ENRelativeDateFormatParser_1);

const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const ENTimeUnitCasualRelativeFormatParser_1$1 = __importDefault(ENTimeUnitCasualRelativeFormatParser_1);
const ENMergeRelativeDateRefiner_1$1 = __importDefault(ENMergeRelativeDateRefiner_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration(false));
exports.strict = new chrono$1.Chrono(createConfiguration(true, false));
exports.GB = new chrono$1.Chrono(createConfiguration(false, true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = false) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new ENCasualDateParser_1$1.default());
    option.parsers.unshift(new ENCasualTimeParser_1$1.default());
    option.parsers.unshift(new ENMonthNameParser_1$1.default());
    option.parsers.unshift(new ENRelativeDateFormatParser_1$1.default());
    option.parsers.unshift(new ENTimeUnitCasualRelativeFormatParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = false) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new ENTimeUnitWithinFormatParser_1$1.default(),
            new ENMonthNameLittleEndianParser_1$1.default(),
            new ENMonthNameMiddleEndianParser_1$1.default(),
            new ENWeekdayParser_1$1.default(),
            new ENCasualYearMonthDayParser_1$1.default(),
            new ENSlashMonthFormatParser_1$1.default(),
            new ENTimeExpressionParser_1$1.default(strictMode),
            new ENTimeUnitAgoFormatParser_1$1.default(strictMode),
            new ENTimeUnitLaterFormatParser_1$1.default(strictMode),
        ],
        refiners: [new ENMergeRelativeDateRefiner_1$1.default(), new ENMergeDateTimeRefiner_1$1.default(), new ENMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var DETimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class DETimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:um|von)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|bis)\\s*";
    }
    extractPrimaryTimeComponents(context, match) {
        if (match[0].match(/^\s*\d{4}\s*$/)) {
            return null;
        }
        return super.extractPrimaryTimeComponents(context, match);
    }
}
exports.default = DETimeExpressionParser;
//# sourceMappingURL=DETimeExpressionParser.js.map
});

var constants$8 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;


exports.WEEKDAY_DICTIONARY = {
    "sonntag": 0,
    "so": 0,
    "montag": 1,
    "mo": 1,
    "dienstag": 2,
    "di": 2,
    "mittwoch": 3,
    "mi": 3,
    "donnerstag": 4,
    "do": 4,
    "freitag": 5,
    "fr": 5,
    "samstag": 6,
    "sa": 6,
};
exports.MONTH_DICTIONARY = {
    "januar": 1,
    "jänner": 1,
    "janner": 1,
    "jan": 1,
    "jan.": 1,
    "februar": 2,
    "feber": 2,
    "feb": 2,
    "feb.": 2,
    "märz": 3,
    "maerz": 3,
    "mär": 3,
    "mär.": 3,
    "mrz": 3,
    "mrz.": 3,
    "april": 4,
    "apr": 4,
    "apr.": 4,
    "mai": 5,
    "juni": 6,
    "jun": 6,
    "jun.": 6,
    "juli": 7,
    "jul": 7,
    "jul.": 7,
    "august": 8,
    "aug": 8,
    "aug.": 8,
    "september": 9,
    "sep": 9,
    "sep.": 9,
    "sept": 9,
    "sept.": 9,
    "oktober": 10,
    "okt": 10,
    "okt.": 10,
    "november": 11,
    "nov": 11,
    "nov.": 11,
    "dezember": 12,
    "dez": 12,
    "dez.": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    "eins": 1,
    "eine": 1,
    "einem": 1,
    "einen": 1,
    "einer": 1,
    "zwei": 2,
    "drei": 3,
    "vier": 4,
    "fünf": 5,
    "fuenf": 5,
    "sechs": 6,
    "sieben": 7,
    "acht": 8,
    "neun": 9,
    "zehn": 10,
    "elf": 11,
    "zwölf": 12,
    "zwoelf": 12,
};
exports.TIME_UNIT_DICTIONARY = {
    sek: "second",
    sekunde: "second",
    sekunden: "second",
    min: "minute",
    minute: "minute",
    minuten: "minute",
    h: "hour",
    std: "hour",
    stunde: "hour",
    stunden: "hour",
    tag: "d",
    tage: "d",
    tagen: "d",
    woche: "week",
    wochen: "week",
    monat: "month",
    monate: "month",
    monaten: "month",
    monats: "month",
    quartal: "quarter",
    quartals: "quarter",
    quartale: "quarter",
    quartalen: "quarter",
    a: "year",
    j: "year",
    jr: "year",
    jahr: "year",
    jahre: "year",
    jahren: "year",
    jahres: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?\\b(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "a" || num === "an") {
        return 1;
    }
    else if (num.match(/few/)) {
        return 3;
    }
    else if (num.match(/half/)) {
        return 0.5;
    }
    else if (num.match(/couple/)) {
        return 2;
    }
    else if (num.match(/several/)) {
        return 7;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.YEAR_PATTERN = `(?:[0-9]{1,4}(?:\\s*[vn]\\.?\\s*(?:C(?:hr)?|(?:u\\.?|d\\.?(?:\\s*g\\.?)?)?\\s*Z)\\.?|\\s*(?:u\\.?|d\\.?(?:\\s*g\\.)?)\\s*Z\\.?)?)`;
function parseYear(match) {
    if (/v/i.test(match)) {
        return -parseInt(match.replace(/[^0-9]+/gi, ""));
    }
    if (/n/i.test(match)) {
        return parseInt(match.replace(/[^0-9]+/gi, ""));
    }
    if (/z/i.test(match)) {
        return parseInt(match.replace(/[^0-9]+/gi, ""));
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
//# sourceMappingURL=constants.js.map
});

var DEWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:a[mn]\\s*?)?" +
    "(?:(diese[mn]|letzte[mn]|n(?:ä|ae)chste[mn])\\s*)?" +
    `(${pattern.matchAnyPattern(constants$8.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(diese|letzte|n(?:ä|ae)chste)\\s*woche)?" +
    "(?=\\W|$)", "i");
const PREFIX_GROUP = 1;
const SUFFIX_GROUP = 3;
const WEEKDAY_GROUP = 2;
class DEWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants$8.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[SUFFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord.match(/letzte/)) {
            modifier = "last";
        }
        else if (modifierWord.match(/chste/)) {
            modifier = "next";
        }
        else if (modifierWord.match(/diese/)) {
            modifier = "this";
        }
        return weekdays.createParsingComponentsAtWeekday(context.reference, offset, modifier);
    }
}
exports.default = DEWeekdayParser;
//# sourceMappingURL=DEWeekdayParser.js.map
});

var DESpecificTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" +
    "(?:(?:um|von)\\s*)?" +
    "(\\d{1,2})(?:h|:)?" +
    "(?:(\\d{1,2})(?:m|:)?)?" +
    "(?:(\\d{1,2})(?:s)?)?" +
    "(?:\\s*Uhr)?" +
    "(?:\\s*(morgens|vormittags|nachmittags|abends|nachts|am\\s+(?:Morgen|Vormittag|Nachmittag|Abend)|in\\s+der\\s+Nacht))?" +
    "(?=\\W|$)", "i");
const SECOND_REG_PATTERN = new RegExp("^\\s*(\\-|\\–|\\~|\\〜|bis(?:\\s+um)?|\\?)\\s*" +
    "(\\d{1,2})(?:h|:)?" +
    "(?:(\\d{1,2})(?:m|:)?)?" +
    "(?:(\\d{1,2})(?:s)?)?" +
    "(?:\\s*Uhr)?" +
    "(?:\\s*(morgens|vormittags|nachmittags|abends|nachts|am\\s+(?:Morgen|Vormittag|Nachmittag|Abend)|in\\s+der\\s+Nacht))?" +
    "(?=\\W|$)", "i");
const HOUR_GROUP = 2;
const MINUTE_GROUP = 3;
const SECOND_GROUP = 4;
const AM_PM_HOUR_GROUP = 5;
class DESpecificTimeExpressionParser {
    pattern(context) {
        return FIRST_REG_PATTERN;
    }
    extract(context, match) {
        const result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length));
        if (result.text.match(/^\d{4}$/)) {
            match.index += match[0].length;
            return null;
        }
        result.start = DESpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), match);
        if (!result.start) {
            match.index += match[0].length;
            return null;
        }
        const remainingText = context.text.substring(match.index + match[0].length);
        const secondMatch = SECOND_REG_PATTERN.exec(remainingText);
        if (secondMatch) {
            result.end = DESpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), secondMatch);
            if (result.end) {
                result.text += secondMatch[0];
            }
        }
        return result;
    }
    static extractTimeComponent(extractingComponents, match) {
        let hour = 0;
        let minute = 0;
        let meridiem = null;
        hour = parseInt(match[HOUR_GROUP]);
        if (match[MINUTE_GROUP] != null) {
            minute = parseInt(match[MINUTE_GROUP]);
        }
        if (minute >= 60 || hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12)
                return null;
            const ampm = match[AM_PM_HOUR_GROUP].toLowerCase();
            if (ampm.match(/morgen|vormittag/)) {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                }
            }
            if (ampm.match(/nachmittag|abend/)) {
                meridiem = dist.Meridiem.PM;
                if (hour != 12) {
                    hour += 12;
                }
            }
            if (ampm.match(/nacht/)) {
                if (hour == 12) {
                    meridiem = dist.Meridiem.AM;
                    hour = 0;
                }
                else if (hour < 6) {
                    meridiem = dist.Meridiem.AM;
                }
                else {
                    meridiem = dist.Meridiem.PM;
                    hour += 12;
                }
            }
        }
        extractingComponents.assign("hour", hour);
        extractingComponents.assign("minute", minute);
        if (meridiem !== null) {
            extractingComponents.assign("meridiem", meridiem);
        }
        else {
            if (hour < 12) {
                extractingComponents.imply("meridiem", dist.Meridiem.AM);
            }
            else {
                extractingComponents.imply("meridiem", dist.Meridiem.PM);
            }
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            extractingComponents.assign("second", second);
        }
        return extractingComponents;
    }
}
exports.default = DESpecificTimeExpressionParser;
//# sourceMappingURL=DESpecificTimeExpressionParser.js.map
});

var DEMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class DEMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(bis(?:\s*(?:am|zum))?|-)\s*$/i;
    }
}
exports.default = DEMergeDateRangeRefiner;
//# sourceMappingURL=DEMergeDateRangeRefiner.js.map
});

var DEMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1$1 = __importDefault(AbstractMergeDateTimeRefiner_1);
class DEMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1$1.default {
    patternBetween() {
        return new RegExp("^\\s*(T|um|am|,|-)?\\s*$");
    }
}
exports.default = DEMergeDateTimeRefiner;
//# sourceMappingURL=DEMergeDateTimeRefiner.js.map
});

var DECasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);




class DECasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(diesen)?\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const timeKeywordPattern = match[2].toLowerCase();
        const component = context.createParsingComponents();
        dayjs.implySimilarTime(component, targetDate);
        return DECasualTimeParser.extractTimeComponents(component, timeKeywordPattern);
    }
    static extractTimeComponents(component, timeKeywordPattern) {
        switch (timeKeywordPattern) {
            case "morgen":
                component.imply("hour", 6);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "vormittag":
                component.imply("hour", 9);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "mittag":
            case "mittags":
                component.imply("hour", 12);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "nachmittag":
                component.imply("hour", 15);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "abend":
                component.imply("hour", 18);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "nacht":
                component.imply("hour", 22);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "mitternacht":
                if (component.get("hour") > 1) {
                    component = timeunits.addImpliedTimeUnits(component, { "day": 1 });
                }
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
        }
        return component;
    }
}
exports.default = DECasualTimeParser;
//# sourceMappingURL=DECasualTimeParser.js.map
});

var DECasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const DECasualTimeParser_1$1 = __importDefault(DECasualTimeParser_1);
const references = __importStar(casualReferences);
const PATTERN = new RegExp(`(jetzt|heute|morgen|übermorgen|uebermorgen|gestern|vorgestern|letzte\\s*nacht)` +
    `(?:\\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const TIME_GROUP = 2;
class DECasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return PATTERN;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const dateKeyword = (match[DATE_GROUP] || "").toLowerCase();
        const timeKeyword = (match[TIME_GROUP] || "").toLowerCase();
        let component = context.createParsingComponents();
        switch (dateKeyword) {
            case "jetzt":
                component = references.now(context.reference);
                break;
            case "heute":
                component = references.today(context.reference);
                break;
            case "morgen":
                dayjs.assignTheNextDay(component, targetDate);
                break;
            case "übermorgen":
            case "uebermorgen":
                targetDate = targetDate.add(1, "day");
                dayjs.assignTheNextDay(component, targetDate);
                break;
            case "gestern":
                targetDate = targetDate.add(-1, "day");
                dayjs.assignSimilarDate(component, targetDate);
                dayjs.implySimilarTime(component, targetDate);
                break;
            case "vorgestern":
                targetDate = targetDate.add(-2, "day");
                dayjs.assignSimilarDate(component, targetDate);
                dayjs.implySimilarTime(component, targetDate);
                break;
            default:
                if (dateKeyword.match(/letzte\s*nacht/)) {
                    if (targetDate.hour() > 6) {
                        targetDate = targetDate.add(-1, "day");
                    }
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
                break;
        }
        if (timeKeyword) {
            component = DECasualTimeParser_1$1.default.extractTimeComponents(component, timeKeyword);
        }
        return component;
    }
}
exports.default = DECasualDateParser;
//# sourceMappingURL=DECasualDateParser.js.map
});

var DEMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$8;


const PATTERN = new RegExp("(?:am\\s*?)?" +
    "(?:den\\s*?)?" +
    `([0-9]{1,2})\\.` +
    `(?:\\s*(?:bis(?:\\s*(?:am|zum))?|\\-|\\–|\\s)\\s*([0-9]{1,2})\\.?)?\\s*` +
    `(${pattern.matchAnyPattern(constants$8.MONTH_DICTIONARY)})` +
    `(?:(?:-|/|,?\\s*)(${constants_2.YEAR_PATTERN}(?![^\\s]\\d)))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class DEMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$8.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = parseInt(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = parseInt(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = DEMonthNameLittleEndianParser;
//# sourceMappingURL=DEMonthNameLittleEndianParser.js.map
});

var DETimeUnitRelativeFormatParser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });





class DETimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor() {
        super();
    }
    innerPattern() {
        return new RegExp(`(?:\\s*((?:nächste|kommende|folgende|letzte|vergangene|vorige|vor(?:her|an)gegangene)(?:s|n|m|r)?|vor|in)\\s*)?` +
            `(${constants$8.NUMBER_PATTERN})?` +
            `(?:\\s*(nächste|kommende|folgende|letzte|vergangene|vorige|vor(?:her|an)gegangene)(?:s|n|m|r)?)?` +
            `\\s*(${pattern.matchAnyPattern(constants$8.TIME_UNIT_DICTIONARY)})`, "i");
    }
    innerExtract(context, match) {
        const num = match[2] ? constants$8.parseNumberPattern(match[2]) : 1;
        const unit = constants$8.TIME_UNIT_DICTIONARY[match[4].toLowerCase()];
        let timeUnits = {};
        timeUnits[unit] = num;
        let modifier = match[1] || match[3] || "";
        modifier = modifier.toLowerCase();
        if (!modifier) {
            return;
        }
        if (/vor/.test(modifier) || /letzte/.test(modifier) || /vergangen/.test(modifier)) {
            timeUnits = timeunits.reverseTimeUnits(timeUnits);
        }
        return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
exports.default = DETimeUnitAgoFormatParser;
//# sourceMappingURL=DETimeUnitRelativeFormatParser.js.map
});

var de = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const ISOFormatParser_1$1 = __importDefault(ISOFormatParser_1);
const DETimeExpressionParser_1$1 = __importDefault(DETimeExpressionParser_1);
const DEWeekdayParser_1$1 = __importDefault(DEWeekdayParser_1);
const DESpecificTimeExpressionParser_1$1 = __importDefault(DESpecificTimeExpressionParser_1);
const DEMergeDateRangeRefiner_1$1 = __importDefault(DEMergeDateRangeRefiner_1);
const DEMergeDateTimeRefiner_1$1 = __importDefault(DEMergeDateTimeRefiner_1);
const DECasualDateParser_1$1 = __importDefault(DECasualDateParser_1);
const DECasualTimeParser_1$1 = __importDefault(DECasualTimeParser_1);
const DEMonthNameLittleEndianParser_1$1 = __importDefault(DEMonthNameLittleEndianParser_1);
const DETimeUnitRelativeFormatParser_1 = __importDefault(DETimeUnitRelativeFormatParser);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new DECasualTimeParser_1$1.default());
    option.parsers.unshift(new DECasualDateParser_1$1.default());
    option.parsers.unshift(new DETimeUnitRelativeFormatParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new ISOFormatParser_1$1.default(),
            new SlashDateFormatParser_1$1.default(littleEndian),
            new DETimeExpressionParser_1$1.default(),
            new DESpecificTimeExpressionParser_1$1.default(),
            new DEMonthNameLittleEndianParser_1$1.default(),
            new DEWeekdayParser_1$1.default(),
        ],
        refiners: [new DEMergeDateRangeRefiner_1$1.default(), new DEMergeDateTimeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var FRCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);



const references = __importStar(casualReferences);
class FRCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(maintenant|aujourd'hui|demain|hier|cette\s*nuit|la\s*veille)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "maintenant":
                return references.now(context.reference);
            case "aujourd'hui":
                return references.today(context.reference);
            case "hier":
                return references.yesterday(context.reference);
            case "demain":
                return references.tomorrow(context.reference);
            default:
                if (lowerText.match(/cette\s*nuit/)) {
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 22);
                    component.imply("meridiem", dist.Meridiem.PM);
                }
                else if (lowerText.match(/la\s*veille/)) {
                    targetDate = targetDate.add(-1, "day");
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
        }
        return component;
    }
}
exports.default = FRCasualDateParser;
//# sourceMappingURL=FRCasualDateParser.js.map
});

var FRCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class FRCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(cet?)?\s*(matin|soir|après-midi|aprem|a midi|à minuit)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const suffixLower = match[2].toLowerCase();
        const component = context.createParsingComponents();
        switch (suffixLower) {
            case "après-midi":
            case "aprem":
                component.imply("hour", 14);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "soir":
                component.imply("hour", 18);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "matin":
                component.imply("hour", 8);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "a midi":
                component.imply("hour", 12);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "à minuit":
                component.imply("hour", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
        }
        return component;
    }
}
exports.default = FRCasualTimeParser;
//# sourceMappingURL=FRCasualTimeParser.js.map
});

var FRTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class FRTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:[àa])\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*";
    }
    extractPrimaryTimeComponents(context, match) {
        if (match[0].match(/^\s*\d{4}\s*$/)) {
            return null;
        }
        return super.extractPrimaryTimeComponents(context, match);
    }
}
exports.default = FRTimeExpressionParser;
//# sourceMappingURL=FRTimeExpressionParser.js.map
});

var FRMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1$1 = __importDefault(AbstractMergeDateTimeRefiner_1);
class FRMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1$1.default {
    patternBetween() {
        return new RegExp("^\\s*(T|à|a|vers|de|,|-)?\\s*$");
    }
}
exports.default = FRMergeDateTimeRefiner;
//# sourceMappingURL=FRMergeDateTimeRefiner.js.map
});

var FRMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class FRMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(à|a|-)\s*$/i;
    }
}
exports.default = FRMergeDateRangeRefiner;
//# sourceMappingURL=FRMergeDateRangeRefiner.js.map
});

var constants$7 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;

exports.WEEKDAY_DICTIONARY = {
    "dimanche": 0,
    "dim": 0,
    "lundi": 1,
    "lun": 1,
    "mardi": 2,
    "mar": 2,
    "mercredi": 3,
    "mer": 3,
    "jeudi": 4,
    "jeu": 4,
    "vendredi": 5,
    "ven": 5,
    "samedi": 6,
    "sam": 6,
};
exports.MONTH_DICTIONARY = {
    "janvier": 1,
    "jan": 1,
    "jan.": 1,
    "février": 2,
    "fév": 2,
    "fév.": 2,
    "fevrier": 2,
    "fev": 2,
    "fev.": 2,
    "mars": 3,
    "mar": 3,
    "mar.": 3,
    "avril": 4,
    "avr": 4,
    "avr.": 4,
    "mai": 5,
    "juin": 6,
    "jun": 6,
    "juillet": 7,
    "juil": 7,
    "jul": 7,
    "jul.": 7,
    "août": 8,
    "aout": 8,
    "septembre": 9,
    "sep": 9,
    "sep.": 9,
    "sept": 9,
    "sept.": 9,
    "octobre": 10,
    "oct": 10,
    "oct.": 10,
    "novembre": 11,
    "nov": 11,
    "nov.": 11,
    "décembre": 12,
    "decembre": 12,
    "dec": 12,
    "dec.": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    "un": 1,
    "deux": 2,
    "trois": 3,
    "quatre": 4,
    "cinq": 5,
    "six": 6,
    "sept": 7,
    "huit": 8,
    "neuf": 9,
    "dix": 10,
    "onze": 11,
    "douze": 12,
    "treize": 13,
};
exports.TIME_UNIT_DICTIONARY = {
    "sec": "second",
    "seconde": "second",
    "secondes": "second",
    "min": "minute",
    "mins": "minute",
    "minute": "minute",
    "minutes": "minute",
    "h": "hour",
    "hr": "hour",
    "hrs": "hour",
    "heure": "hour",
    "heures": "hour",
    "jour": "d",
    "jours": "d",
    "semaine": "week",
    "semaines": "week",
    "mois": "month",
    "trimestre": "quarter",
    "trimestres": "quarter",
    "ans": "year",
    "année": "year",
    "années": "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|une?\\b|quelques?|demi-?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "une" || num === "un") {
        return 1;
    }
    else if (num.match(/quelques?/)) {
        return 3;
    }
    else if (num.match(/demi-?/)) {
        return 0.5;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:[0-9]{1,2}(?:er)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    num = num.replace(/(?:er)$/i, "");
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:AC|AD|p\\.\\s*C(?:hr?)?\\.\\s*n\\.)|[1-2][0-9]{3}|[5-9][0-9])`;
function parseYear(match) {
    if (/AC/i.test(match)) {
        match = match.replace(/BC/i, "");
        return -parseInt(match);
    }
    if (/AD/i.test(match) || /C/i.test(match)) {
        match = match.replace(/[^\d]+/i, "");
        return parseInt(match);
    }
    let yearNumber = parseInt(match);
    if (yearNumber < 100) {
        if (yearNumber > 50) {
            yearNumber = yearNumber + 1900;
        }
        else {
            yearNumber = yearNumber + 2000;
        }
    }
    return yearNumber;
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
//# sourceMappingURL=constants.js.map
});

var FRWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:(?:ce)\\s*)?" +
    `(${pattern.matchAnyPattern(constants$7.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(dernier|prochain)\\s*)?" +
    "(?=\\W|\\d|$)", "i");
const WEEKDAY_GROUP = 1;
const POSTFIX_GROUP = 2;
class FRWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const weekday = constants$7.WEEKDAY_DICTIONARY[dayOfWeek];
        if (weekday === undefined) {
            return null;
        }
        let suffix = match[POSTFIX_GROUP];
        suffix = suffix || "";
        suffix = suffix.toLowerCase();
        let modifier = null;
        if (suffix == "dernier") {
            modifier = "last";
        }
        else if (suffix == "prochain") {
            modifier = "next";
        }
        return weekdays.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    }
}
exports.default = FRWeekdayParser;
//# sourceMappingURL=FRWeekdayParser.js.map
});

var FRSpecificTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" +
    "(?:(?:[àa])\\s*)?" +
    "(\\d{1,2})(?:h|:)?" +
    "(?:(\\d{1,2})(?:m|:)?)?" +
    "(?:(\\d{1,2})(?:s|:)?)?" +
    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
    "(?=\\W|$)", "i");
const SECOND_REG_PATTERN = new RegExp("^\\s*(\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*" +
    "(\\d{1,2})(?:h|:)?" +
    "(?:(\\d{1,2})(?:m|:)?)?" +
    "(?:(\\d{1,2})(?:s|:)?)?" +
    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
    "(?=\\W|$)", "i");
const HOUR_GROUP = 2;
const MINUTE_GROUP = 3;
const SECOND_GROUP = 4;
const AM_PM_HOUR_GROUP = 5;
class FRSpecificTimeExpressionParser {
    pattern(context) {
        return FIRST_REG_PATTERN;
    }
    extract(context, match) {
        const result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length));
        if (result.text.match(/^\d{4}$/)) {
            match.index += match[0].length;
            return null;
        }
        result.start = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), match);
        if (!result.start) {
            match.index += match[0].length;
            return null;
        }
        const remainingText = context.text.substring(match.index + match[0].length);
        const secondMatch = SECOND_REG_PATTERN.exec(remainingText);
        if (secondMatch) {
            result.end = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), secondMatch);
            if (result.end) {
                result.text += secondMatch[0];
            }
        }
        return result;
    }
    static extractTimeComponent(extractingComponents, match) {
        let hour = 0;
        let minute = 0;
        let meridiem = null;
        hour = parseInt(match[HOUR_GROUP]);
        if (match[MINUTE_GROUP] != null) {
            minute = parseInt(match[MINUTE_GROUP]);
        }
        if (minute >= 60 || hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12)
                return null;
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                }
            }
            if (ampm == "p") {
                meridiem = dist.Meridiem.PM;
                if (hour != 12) {
                    hour += 12;
                }
            }
        }
        extractingComponents.assign("hour", hour);
        extractingComponents.assign("minute", minute);
        if (meridiem !== null) {
            extractingComponents.assign("meridiem", meridiem);
        }
        else {
            if (hour < 12) {
                extractingComponents.imply("meridiem", dist.Meridiem.AM);
            }
            else {
                extractingComponents.imply("meridiem", dist.Meridiem.PM);
            }
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            extractingComponents.assign("second", second);
        }
        return extractingComponents;
    }
}
exports.default = FRSpecificTimeExpressionParser;
//# sourceMappingURL=FRSpecificTimeExpressionParser.js.map
});

var FRMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$7;
const constants_3 = constants$7;


const PATTERN = new RegExp("(?:on\\s*?)?" +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    `(?:\\s*(?:au|\\-|\\–|jusqu'au?|\\s)\\s*(${constants_3.ORDINAL_NUMBER_PATTERN}))?` +
    `(?:-|/|\\s*(?:de)?\\s*)` +
    `(${pattern.matchAnyPattern(constants$7.MONTH_DICTIONARY)})` +
    `(?:(?:-|/|,?\\s*)(${constants_2.YEAR_PATTERN}(?![^\\s]\\d)))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class FRMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$7.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = FRMonthNameLittleEndianParser;
//# sourceMappingURL=FRMonthNameLittleEndianParser.js.map
});

var FRTimeUnitAgoFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




class FRTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor() {
        super();
    }
    innerPattern() {
        return new RegExp(`il y a\\s*(${constants$7.TIME_UNITS_PATTERN})(?=(?:\\W|$))`, "i");
    }
    innerExtract(context, match) {
        const timeUnits = constants$7.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits.reverseTimeUnits(timeUnits);
        return results.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
    }
}
exports.default = FRTimeUnitAgoFormatParser;
//# sourceMappingURL=FRTimeUnitAgoFormatParser.js.map
});

var FRTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



class FRTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return new RegExp(`(?:dans|en|pour|pendant|de)\\s*(${constants$7.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    }
    innerExtract(context, match) {
        const timeUnits = constants$7.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
exports.default = FRTimeUnitWithinFormatParser;
//# sourceMappingURL=FRTimeUnitWithinFormatParser.js.map
});

var FRTimeUnitRelativeFormatParser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });





class FRTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor() {
        super();
    }
    innerPattern() {
        return new RegExp(`(?:les?|la|l'|du|des?)\\s*` +
            `(${constants$7.NUMBER_PATTERN})?` +
            `(?:\\s*(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?))?` +
            `\\s*(${pattern.matchAnyPattern(constants$7.TIME_UNIT_DICTIONARY)})` +
            `(?:\\s*(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?))?`, "i");
    }
    innerExtract(context, match) {
        const num = match[1] ? constants$7.parseNumberPattern(match[1]) : 1;
        const unit = constants$7.TIME_UNIT_DICTIONARY[match[3].toLowerCase()];
        let timeUnits = {};
        timeUnits[unit] = num;
        let modifier = match[2] || match[4] || "";
        modifier = modifier.toLowerCase();
        if (!modifier) {
            return;
        }
        if (/derni[eè]re?s?/.test(modifier) || /pass[ée]e?s?/.test(modifier) || /pr[ée]c[ée]dents?/.test(modifier)) {
            timeUnits = timeunits.reverseTimeUnits(timeUnits);
        }
        return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
exports.default = FRTimeUnitAgoFormatParser;
//# sourceMappingURL=FRTimeUnitRelativeFormatParser.js.map
});

var fr = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const FRCasualDateParser_1$1 = __importDefault(FRCasualDateParser_1);
const FRCasualTimeParser_1$1 = __importDefault(FRCasualTimeParser_1);
const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const FRTimeExpressionParser_1$1 = __importDefault(FRTimeExpressionParser_1);
const FRMergeDateTimeRefiner_1$1 = __importDefault(FRMergeDateTimeRefiner_1);
const FRMergeDateRangeRefiner_1$1 = __importDefault(FRMergeDateRangeRefiner_1);
const FRWeekdayParser_1$1 = __importDefault(FRWeekdayParser_1);
const FRSpecificTimeExpressionParser_1$1 = __importDefault(FRSpecificTimeExpressionParser_1);
const FRMonthNameLittleEndianParser_1$1 = __importDefault(FRMonthNameLittleEndianParser_1);
const FRTimeUnitAgoFormatParser_1$1 = __importDefault(FRTimeUnitAgoFormatParser_1);
const FRTimeUnitWithinFormatParser_1$1 = __importDefault(FRTimeUnitWithinFormatParser_1);
const FRTimeUnitRelativeFormatParser_1 = __importDefault(FRTimeUnitRelativeFormatParser);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new FRCasualDateParser_1$1.default());
    option.parsers.unshift(new FRCasualTimeParser_1$1.default());
    option.parsers.unshift(new FRTimeUnitRelativeFormatParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new FRMonthNameLittleEndianParser_1$1.default(),
            new FRTimeExpressionParser_1$1.default(),
            new FRSpecificTimeExpressionParser_1$1.default(),
            new FRTimeUnitAgoFormatParser_1$1.default(),
            new FRTimeUnitWithinFormatParser_1$1.default(),
            new FRWeekdayParser_1$1.default(),
        ],
        refiners: [new FRMergeDateTimeRefiner_1$1.default(), new FRMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var constants$6 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHankaku = void 0;
function toHankaku(text) {
    return String(text)
        .replace(/\u2019/g, "\u0027")
        .replace(/\u201D/g, "\u0022")
        .replace(/\u3000/g, "\u0020")
        .replace(/\uFFE5/g, "\u00A5")
        .replace(/[\uFF01\uFF03-\uFF06\uFF08\uFF09\uFF0C-\uFF19\uFF1C-\uFF1F\uFF21-\uFF3B\uFF3D\uFF3F\uFF41-\uFF5B\uFF5D\uFF5E]/g, alphaNum);
}
exports.toHankaku = toHankaku;
function alphaNum(token) {
    return String.fromCharCode(token.charCodeAt(0) - 65248);
}
//# sourceMappingURL=constants.js.map
});

var JPStandardParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);
const PATTERN = /(?:(?:([同今本])|((昭和|平成|令和)?([0-9０-９]{1,4}|元)))年\s*)?([0-9０-９]{1,2})月\s*([0-9０-９]{1,2})日/i;
const SPECIAL_YEAR_GROUP = 1;
const TYPICAL_YEAR_GROUP = 2;
const ERA_GROUP = 3;
const YEAR_NUMBER_GROUP = 4;
const MONTH_GROUP = 5;
const DAY_GROUP = 6;
class JPStandardParser {
    pattern() {
        return PATTERN;
    }
    extract(context, match) {
        const month = parseInt(constants$6.toHankaku(match[MONTH_GROUP]));
        const day = parseInt(constants$6.toHankaku(match[DAY_GROUP]));
        const components = context.createParsingComponents({
            day: day,
            month: month,
        });
        if (match[SPECIAL_YEAR_GROUP] && match[SPECIAL_YEAR_GROUP].match("同|今|本")) {
            const moment = dayjs_1.default(context.refDate);
            components.assign("year", moment.year());
        }
        if (match[TYPICAL_YEAR_GROUP]) {
            const yearNumText = match[YEAR_NUMBER_GROUP];
            let year = yearNumText == "元" ? 1 : parseInt(constants$6.toHankaku(yearNumText));
            if (match[ERA_GROUP] == "令和") {
                year += 2018;
            }
            else if (match[ERA_GROUP] == "平成") {
                year += 1988;
            }
            else if (match[ERA_GROUP] == "昭和") {
                year += 1925;
            }
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            components.imply("year", year);
        }
        return components;
    }
}
exports.default = JPStandardParser;
//# sourceMappingURL=JPStandardParser.js.map
});

var JPMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class JPMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(から|ー|-)\s*$/i;
    }
}
exports.default = JPMergeDateRangeRefiner;
//# sourceMappingURL=JPMergeDateRangeRefiner.js.map
});

var JPCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);

const references = __importStar(casualReferences);
const PATTERN = /今日|当日|昨日|明日|今夜|今夕|今晩|今朝/i;
class JPCasualDateParser {
    pattern() {
        return PATTERN;
    }
    extract(context, match) {
        const text = match[0];
        const date = dayjs_1.default(context.refDate);
        const components = context.createParsingComponents();
        switch (text) {
            case "昨日":
                return references.yesterday(context.reference);
            case "明日":
                return references.tomorrow(context.reference);
            case "今日":
            case "当日":
                return references.today(context.reference);
        }
        if (text == "今夜" || text == "今夕" || text == "今晩") {
            components.imply("hour", 22);
            components.assign("meridiem", dist.Meridiem.PM);
        }
        else if (text.match("今朝")) {
            components.imply("hour", 6);
            components.assign("meridiem", dist.Meridiem.AM);
        }
        components.assign("day", date.date());
        components.assign("month", date.month() + 1);
        components.assign("year", date.year());
        return components;
    }
}
exports.default = JPCasualDateParser;
//# sourceMappingURL=JPCasualDateParser.js.map
});

var ja = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
const JPStandardParser_1$1 = __importDefault(JPStandardParser_1);
const JPMergeDateRangeRefiner_1$1 = __importDefault(JPMergeDateRangeRefiner_1);
const JPCasualDateParser_1$1 = __importDefault(JPCasualDateParser_1);

exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration());
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration() {
    const option = createConfiguration();
    option.parsers.unshift(new JPCasualDateParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration() {
    return {
        parsers: [new JPStandardParser_1$1.default()],
        refiners: [new JPMergeDateRangeRefiner_1$1.default()],
    };
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var constants$5 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYear = exports.YEAR_PATTERN = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
exports.WEEKDAY_DICTIONARY = {
    "domingo": 0,
    "dom": 0,
    "segunda": 1,
    "segunda-feira": 1,
    "seg": 1,
    "terça": 2,
    "terça-feira": 2,
    "ter": 2,
    "quarta": 3,
    "quarta-feira": 3,
    "qua": 3,
    "quinta": 4,
    "quinta-feira": 4,
    "qui": 4,
    "sexta": 5,
    "sexta-feira": 5,
    "sex": 5,
    "sábado": 6,
    "sabado": 6,
    "sab": 6,
};
exports.MONTH_DICTIONARY = {
    "janeiro": 1,
    "jan": 1,
    "jan.": 1,
    "fevereiro": 2,
    "fev": 2,
    "fev.": 2,
    "março": 3,
    "mar": 3,
    "mar.": 3,
    "abril": 4,
    "abr": 4,
    "abr.": 4,
    "maio": 5,
    "mai": 5,
    "mai.": 5,
    "junho": 6,
    "jun": 6,
    "jun.": 6,
    "julho": 7,
    "jul": 7,
    "jul.": 7,
    "agosto": 8,
    "ago": 8,
    "ago.": 8,
    "setembro": 9,
    "set": 9,
    "set.": 9,
    "outubro": 10,
    "out": 10,
    "out.": 10,
    "novembro": 11,
    "nov": 11,
    "nov.": 11,
    "dezembro": 12,
    "dez": 12,
    "dez.": 12,
};
exports.YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
function parseYear(match) {
    if (match.match(/^[0-9]{1,4}$/)) {
        let yearNumber = parseInt(match);
        if (yearNumber < 100) {
            if (yearNumber > 50) {
                yearNumber = yearNumber + 1900;
            }
            else {
                yearNumber = yearNumber + 2000;
            }
        }
        return yearNumber;
    }
    if (match.match(/a\.?\s*c\.?/i)) {
        match = match.replace(/a\.?\s*c\.?/i, "");
        return -parseInt(match);
    }
    return parseInt(match);
}
exports.parseYear = parseYear;
//# sourceMappingURL=constants.js.map
});

var PTWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:(este|esta|passado|pr[oó]ximo)\\s*)?" +
    `(${pattern.matchAnyPattern(constants$5.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(este|esta|passado|pr[óo]ximo)\\s*semana)?" +
    "(?=\\W|\\d|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class PTWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const weekday = constants$5.WEEKDAY_DICTIONARY[dayOfWeek];
        if (weekday === undefined) {
            return null;
        }
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let norm = prefix || postfix || "";
        norm = norm.toLowerCase();
        let modifier = null;
        if (norm == "passado") {
            modifier = "this";
        }
        else if (norm == "próximo" || norm == "proximo") {
            modifier = "next";
        }
        else if (norm == "este") {
            modifier = "this";
        }
        return weekdays.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    }
}
exports.default = PTWeekdayParser;
//# sourceMappingURL=PTWeekdayParser.js.map
});

var PTTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class PTTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:ao?|às?|das|da|de|do)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|a(?:o)?|\\?)\\s*";
    }
}
exports.default = PTTimeExpressionParser;
//# sourceMappingURL=PTTimeExpressionParser.js.map
});

var PTMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1$1 = __importDefault(AbstractMergeDateTimeRefiner_1);
class PTMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1$1.default {
    patternBetween() {
        return new RegExp("^\\s*(?:,|à)?\\s*$");
    }
}
exports.default = PTMergeDateTimeRefiner;
//# sourceMappingURL=PTMergeDateTimeRefiner.js.map
});

var PTMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class PTMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(?:-)\s*$/i;
    }
}
exports.default = PTMergeDateRangeRefiner;
//# sourceMappingURL=PTMergeDateRangeRefiner.js.map
});

var PTMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$5;


const PATTERN = new RegExp(`([0-9]{1,2})(?:º|ª|°)?` +
    "(?:\\s*(?:desde|de|\\-|\\–|ao?|\\s)\\s*([0-9]{1,2})(?:º|ª|°)?)?\\s*(?:de)?\\s*" +
    `(?:-|/|\\s*(?:de|,)?\\s*)` +
    `(${pattern.matchAnyPattern(constants$5.MONTH_DICTIONARY)})` +
    `(?:\\s*(?:de|,)?\\s*(${constants_2.YEAR_PATTERN}))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class PTMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$5.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = parseInt(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = parseInt(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = PTMonthNameLittleEndianParser;
//# sourceMappingURL=PTMonthNameLittleEndianParser.js.map
});

var PTCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const references = __importStar(casualReferences);
class PTCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(agora|hoje|amanha|amanhã|ontem)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "agora":
                return references.now(context.reference);
            case "hoje":
                return references.today(context.reference);
            case "amanha":
            case "amanhã":
                return references.tomorrow(context.reference);
            case "ontem":
                return references.yesterday(context.reference);
        }
        return component;
    }
}
exports.default = PTCasualDateParser;
//# sourceMappingURL=PTCasualDateParser.js.map
});

var PTCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });



const dayjs_2 = __importDefault(dayjs_min);
class PTCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return /(?:esta\s*)?(manha|manhã|tarde|meia-noite|meio-dia|noite)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_2.default(context.refDate);
        const component = context.createParsingComponents();
        switch (match[1].toLowerCase()) {
            case "tarde":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "noite":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 22);
                break;
            case "manha":
            case "manhã":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "meia-noite":
                dayjs.assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;
            case "meio-dia":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
        }
        return component;
    }
}
exports.default = PTCasualTimeParser;
//# sourceMappingURL=PTCasualTimeParser.js.map
});

var pt = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const PTWeekdayParser_1$1 = __importDefault(PTWeekdayParser_1);
const PTTimeExpressionParser_1$1 = __importDefault(PTTimeExpressionParser_1);
const PTMergeDateTimeRefiner_1$1 = __importDefault(PTMergeDateTimeRefiner_1);
const PTMergeDateRangeRefiner_1$1 = __importDefault(PTMergeDateRangeRefiner_1);
const PTMonthNameLittleEndianParser_1$1 = __importDefault(PTMonthNameLittleEndianParser_1);
const PTCasualDateParser_1$1 = __importDefault(PTCasualDateParser_1);
const PTCasualTimeParser_1$1 = __importDefault(PTCasualTimeParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.push(new PTCasualDateParser_1$1.default());
    option.parsers.push(new PTCasualTimeParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new PTWeekdayParser_1$1.default(),
            new PTTimeExpressionParser_1$1.default(),
            new PTMonthNameLittleEndianParser_1$1.default(),
        ],
        refiners: [new PTMergeDateTimeRefiner_1$1.default(), new PTMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var NLMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class NLMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(tot|-)\s*$/i;
    }
}
exports.default = NLMergeDateRangeRefiner;
//# sourceMappingURL=NLMergeDateRangeRefiner.js.map
});

var NLMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1$1 = __importDefault(AbstractMergeDateTimeRefiner_1);
class NLMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1$1.default {
    patternBetween() {
        return new RegExp("^\\s*(om|na|voor|in de|,|-)?\\s*$");
    }
}
exports.default = NLMergeDateTimeRefiner;
//# sourceMappingURL=NLMergeDateTimeRefiner.js.map
});

var NLCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const references = __importStar(casualReferences);
class NLCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(nu|vandaag|morgen|morgend|gisteren)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "nu":
                return references.now(context.reference);
            case "vandaag":
                return references.today(context.reference);
            case "morgen":
            case "morgend":
                return references.tomorrow(context.reference);
            case "gisteren":
                return references.yesterday(context.reference);
        }
        return component;
    }
}
exports.default = NLCasualDateParser;
//# sourceMappingURL=NLCasualDateParser.js.map
});

var NLCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);

const DAY_GROUP = 1;
const MOMENT_GROUP = 2;
class NLCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return /(deze)?\s*(namiddag|avond|middernacht|ochtend|middag|'s middags|'s avonds|'s ochtends)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const component = context.createParsingComponents();
        if (match[DAY_GROUP] === "deze") {
            component.assign("day", context.refDate.getDate());
            component.assign("month", context.refDate.getMonth() + 1);
            component.assign("year", context.refDate.getFullYear());
        }
        switch (match[MOMENT_GROUP].toLowerCase()) {
            case "namiddag":
            case "'s namiddags":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "avond":
            case "'s avonds'":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 20);
                break;
            case "middernacht":
                dayjs.assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;
            case "ochtend":
            case "'s ochtends":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "middag":
            case "'s middags":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
        }
        return component;
    }
}
exports.default = NLCasualTimeParser;
//# sourceMappingURL=NLCasualTimeParser.js.map
});

var constants$4 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;


exports.WEEKDAY_DICTIONARY = {
    zondag: 0,
    zon: 0,
    "zon.": 0,
    zo: 0,
    "zo.": 0,
    maandag: 1,
    ma: 1,
    "ma.": 1,
    dinsdag: 2,
    din: 2,
    "din.": 2,
    di: 2,
    "di.": 2,
    woensdag: 3,
    woe: 3,
    "woe.": 3,
    wo: 3,
    "wo.": 3,
    donderdag: 4,
    dond: 4,
    "dond.": 4,
    do: 4,
    "do.": 4,
    vrijdag: 5,
    vrij: 5,
    "vrij.": 5,
    vr: 5,
    "vr.": 5,
    zaterdag: 6,
    zat: 6,
    "zat.": 6,
    "za": 6,
    "za.": 6,
};
exports.MONTH_DICTIONARY = {
    januari: 1,
    jan: 1,
    "jan.": 1,
    februari: 2,
    feb: 2,
    "feb.": 2,
    maart: 3,
    mar: 3,
    "mar.": 3,
    april: 4,
    apr: 4,
    "apr.": 4,
    mei: 5,
    juni: 6,
    jun: 6,
    "jun.": 6,
    juli: 7,
    jul: 7,
    "jul.": 7,
    augustus: 8,
    aug: 8,
    "aug.": 8,
    september: 9,
    sep: 9,
    "sep.": 9,
    sept: 9,
    "sept.": 9,
    oktober: 10,
    okt: 10,
    "okt.": 10,
    november: 11,
    nov: 11,
    "nov.": 11,
    december: 12,
    dec: 12,
    "dec.": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    een: 1,
    twee: 2,
    drie: 3,
    vier: 4,
    vijf: 5,
    zes: 6,
    zeven: 7,
    acht: 8,
    negen: 9,
    tien: 10,
    elf: 11,
    twaalf: 12,
};
exports.ORDINAL_WORD_DICTIONARY = {
    eerste: 1,
    tweede: 2,
    derde: 3,
    vierde: 4,
    vijfde: 5,
    zesde: 6,
    zevende: 7,
    achtste: 8,
    negende: 9,
    tiende: 10,
    elfde: 11,
    twaalfde: 12,
    dertiende: 13,
    veertiende: 14,
    vijftiende: 15,
    zestiende: 16,
    zeventiende: 17,
    achttiende: 18,
    negentiende: 19,
    twintigste: 20,
    "eenentwintigste": 21,
    "tweeëntwintigste": 22,
    "drieentwintigste": 23,
    "vierentwintigste": 24,
    "vijfentwintigste": 25,
    "zesentwintigste": 26,
    "zevenentwintigste": 27,
    "achtentwintig": 28,
    "negenentwintig": 29,
    "dertigste": 30,
    "eenendertigste": 31,
};
exports.TIME_UNIT_DICTIONARY = {
    sec: "second",
    second: "second",
    seconden: "second",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minuut: "minute",
    minuten: "minute",
    minuutje: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    uur: "hour",
    u: "hour",
    uren: "hour",
    dag: "d",
    dagen: "d",
    week: "week",
    weken: "week",
    maand: "month",
    maanden: "month",
    jaar: "year",
    jr: "year",
    jaren: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+[\\.,][0-9]+|halve?|half|paar)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "paar") {
        return 2;
    }
    else if (num === "half" || num.match(/halve?/)) {
        return 0.5;
    }
    return parseFloat(num.replace(",", "."));
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:ste|de)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
        return exports.ORDINAL_WORD_DICTIONARY[num];
    }
    num = num.replace(/(?:ste|de)$/i, "");
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:voor Christus|na Christus)|[1-2][0-9]{3}|[5-9][0-9])`;
function parseYear(match) {
    if (/voor Christus/i.test(match)) {
        match = match.replace(/voor Christus/i, "");
        return -parseInt(match);
    }
    if (/na Christus/i.test(match)) {
        match = match.replace(/na Christus/i, "");
        return parseInt(match);
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern(`(?:(?:binnen|in)\\s*)?`, SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
//# sourceMappingURL=constants.js.map
});

var NLTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



class NLTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return new RegExp(`(?:binnen|in|binnen de|voor)\\s*` + "(" + constants$4.TIME_UNITS_PATTERN + ")" + `(?=\\W|$)`, "i");
    }
    innerExtract(context, match) {
        const timeUnits = constants$4.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
exports.default = NLTimeUnitWithinFormatParser;
//# sourceMappingURL=NLTimeUnitWithinFormatParser.js.map
});

var NLWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:op\\s*?)?" +
    "(?:(deze|vorige|volgende)\\s*(?:week\\s*)?)?" +
    `(${pattern.matchAnyPattern(constants$4.WEEKDAY_DICTIONARY)})` +
    "(?=\\W|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class NLWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const weekday = constants$4.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord == "vorige") {
            modifier = "last";
        }
        else if (modifierWord == "volgende") {
            modifier = "next";
        }
        else if (modifierWord == "deze") {
            modifier = "this";
        }
        return weekdays.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    }
}
exports.default = NLWeekdayParser;
//# sourceMappingURL=NLWeekdayParser.js.map
});

var NLMonthNameMiddleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$4;
const constants_3 = constants$4;


const PATTERN = new RegExp("(?:on\\s*?)?" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})` +
    "(?:\\s*" +
    "(?:tot|\\-|\\–|until|through|till|\\s)\\s*" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})` +
    ")?" +
    "(?:-|/|\\s*(?:of)?\\s*)" +
    "(" +
    pattern.matchAnyPattern(constants$4.MONTH_DICTIONARY) +
    ")" +
    "(?:" +
    "(?:-|/|,?\\s*)" +
    `(${constants_3.YEAR_PATTERN}(?![^\\s]\\d))` +
    ")?" +
    "(?=\\W|$)", "i");
const MONTH_NAME_GROUP = 3;
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const YEAR_GROUP = 4;
class NLMonthNameMiddleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = constants$4.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        const components = context.createParsingComponents({
            day: day,
            month: month,
        });
        if (match[YEAR_GROUP]) {
            const year = constants_3.parseYear(match[YEAR_GROUP]);
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            components.imply("year", year);
        }
        if (!match[DATE_TO_GROUP]) {
            return components;
        }
        const endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
        const result = context.createParsingResult(match.index, match[0]);
        result.start = components;
        result.end = components.clone();
        result.end.assign("day", endDate);
        return result;
    }
}
exports.default = NLMonthNameMiddleEndianParser;
//# sourceMappingURL=NLMonthNameMiddleEndianParser.js.map
});

var NLMonthNameParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const constants_2 = constants$4;

const PATTERN = new RegExp(`(${pattern.matchAnyPattern(constants$4.MONTH_DICTIONARY)})` +
    `\\s*` +
    `(?:` +
    `[,-]?\\s*(${constants_2.YEAR_PATTERN})?` +
    ")?" +
    "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
const MONTH_NAME_GROUP = 1;
const YEAR_GROUP = 2;
class NLMonthNameParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const components = context.createParsingComponents();
        components.imply("day", 1);
        const monthName = match[MONTH_NAME_GROUP];
        const month = constants$4.MONTH_DICTIONARY[monthName.toLowerCase()];
        components.assign("month", month);
        if (match[YEAR_GROUP]) {
            const year = constants_2.parseYear(match[YEAR_GROUP]);
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, 1, month);
            components.imply("year", year);
        }
        return components;
    }
}
exports.default = NLMonthNameParser;
//# sourceMappingURL=NLMonthNameParser.js.map
});

var NLSlashMonthFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
const MONTH_GROUP = 1;
const YEAR_GROUP = 2;
class NLSlashMonthFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const year = parseInt(match[YEAR_GROUP]);
        const month = parseInt(match[MONTH_GROUP]);
        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
    }
}
exports.default = NLSlashMonthFormatParser;
//# sourceMappingURL=NLSlashMonthFormatParser.js.map
});

var NLTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class NLTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:om)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|om|\\?)\\s*";
    }
    primarySuffix() {
        return "(?:\\s*(?:uur))?(?!/)(?=\\W|$)";
    }
    extractPrimaryTimeComponents(context, match) {
        if (match[0].match(/^\s*\d{4}\s*$/)) {
            return null;
        }
        return super.extractPrimaryTimeComponents(context, match);
    }
}
exports.default = NLTimeExpressionParser;
//# sourceMappingURL=NLTimeExpressionParser.js.map
});

var NLCasualYearMonthDayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp(`([0-9]{4})[\\.\\/\\s]` +
    `(?:(${pattern.matchAnyPattern(constants$4.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]` +
    `([0-9]{1,2})` +
    "(?=\\W|$)", "i");
const YEAR_NUMBER_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const MONTH_NUMBER_GROUP = 3;
const DATE_NUMBER_GROUP = 4;
class NLCasualYearMonthDayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = match[MONTH_NUMBER_GROUP]
            ? parseInt(match[MONTH_NUMBER_GROUP])
            : constants$4.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        if (month < 1 || month > 12) {
            return null;
        }
        const year = parseInt(match[YEAR_NUMBER_GROUP]);
        const day = parseInt(match[DATE_NUMBER_GROUP]);
        return {
            day: day,
            month: month,
            year: year,
        };
    }
}
exports.default = NLCasualYearMonthDayParser;
//# sourceMappingURL=NLCasualYearMonthDayParser.js.map
});

var NLCasualDateTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });



const dayjs_2 = __importDefault(dayjs_min);
const DATE_GROUP = 1;
const TIME_OF_DAY_GROUP = 2;
class NLCasualDateTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(gisteren|morgen|van)(ochtend|middag|namiddag|avond|nacht)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const dateText = match[DATE_GROUP].toLowerCase();
        const timeText = match[TIME_OF_DAY_GROUP].toLowerCase();
        const component = context.createParsingComponents();
        const targetDate = dayjs_2.default(context.refDate);
        switch (dateText) {
            case "gisteren":
                dayjs.assignSimilarDate(component, targetDate.add(-1, "day"));
                break;
            case "van":
                dayjs.assignSimilarDate(component, targetDate);
                break;
            case "morgen":
                dayjs.assignTheNextDay(component, targetDate);
                break;
        }
        switch (timeText) {
            case "ochtend":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "middag":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
            case "namiddag":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "avond":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 20);
                break;
        }
        return component;
    }
}
exports.default = NLCasualDateTimeParser;
//# sourceMappingURL=NLCasualDateTimeParser.js.map
});

var NLTimeUnitCasualRelativeFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp(`(deze|vorige|afgelopen|komende|over|\\+|-)\\s*(${constants$4.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
class NLTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const prefix = match[1].toLowerCase();
        let timeUnits = constants$4.parseTimeUnits(match[2]);
        switch (prefix) {
            case "vorige":
            case "afgelopen":
            case "-":
                timeUnits = timeunits.reverseTimeUnits(timeUnits);
                break;
        }
        return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
exports.default = NLTimeUnitCasualRelativeFormatParser;
//# sourceMappingURL=NLTimeUnitCasualRelativeFormatParser.js.map
});

var NLRelativeDateFormatParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp(`(dit|deze|komende|volgend|volgende|afgelopen|vorige)\\s*(${pattern.matchAnyPattern(constants$4.TIME_UNIT_DICTIONARY)})(?=\\s*)` +
    "(?=\\W|$)", "i");
const MODIFIER_WORD_GROUP = 1;
const RELATIVE_WORD_GROUP = 2;
class NLRelativeDateFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
        const timeunit = constants$4.TIME_UNIT_DICTIONARY[unitWord];
        if (modifier == "volgend" || modifier == "volgende" || modifier == "komende") {
            const timeUnits = {};
            timeUnits[timeunit] = 1;
            return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }
        if (modifier == "afgelopen" || modifier == "vorige") {
            const timeUnits = {};
            timeUnits[timeunit] = -1;
            return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }
        const components = context.createParsingComponents();
        let date = dayjs_1.default(context.reference.instant);
        if (unitWord.match(/week/i)) {
            date = date.add(-date.get("d"), "d");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.imply("year", date.year());
        }
        else if (unitWord.match(/maand/i)) {
            date = date.add(-date.date() + 1, "d");
            components.imply("day", date.date());
            components.assign("year", date.year());
            components.assign("month", date.month() + 1);
        }
        else if (unitWord.match(/jaar/i)) {
            date = date.add(-date.date() + 1, "d");
            date = date.add(-date.month(), "month");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.assign("year", date.year());
        }
        return components;
    }
}
exports.default = NLRelativeDateFormatParser;
//# sourceMappingURL=NLRelativeDateFormatParser.js.map
});

var NLTimeUnitAgoFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("" + "(" + constants$4.TIME_UNITS_PATTERN + ")" + "(?:geleden|voor|eerder)(?=(?:\\W|$))", "i");
const STRICT_PATTERN = new RegExp("" + "(" + constants$4.TIME_UNITS_PATTERN + ")" + "geleden(?=(?:\\W|$))", "i");
class NLTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
    }
    innerExtract(context, match) {
        const timeUnits = constants$4.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits.reverseTimeUnits(timeUnits);
        return results.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
    }
}
exports.default = NLTimeUnitAgoFormatParser;
//# sourceMappingURL=NLTimeUnitAgoFormatParser.js.map
});

var NLTimeUnitLaterFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp("" + "(" + constants$4.TIME_UNITS_PATTERN + ")" + "(later|na|vanaf nu|voortaan|vooruit|uit)" + "(?=(?:\\W|$))", "i");
const STRICT_PATTERN = new RegExp("" + "(" + constants$4.TIME_UNITS_PATTERN + ")" + "(later|vanaf nu)" + "(?=(?:\\W|$))", "i");
const GROUP_NUM_TIMEUNITS = 1;
class NLTimeUnitLaterFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
    }
    innerExtract(context, match) {
        const fragments = constants$4.parseTimeUnits(match[GROUP_NUM_TIMEUNITS]);
        return results.ParsingComponents.createRelativeFromReference(context.reference, fragments);
    }
}
exports.default = NLTimeUnitLaterFormatParser;
//# sourceMappingURL=NLTimeUnitLaterFormatParser.js.map
});

var nl = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const NLMergeDateRangeRefiner_1$1 = __importDefault(NLMergeDateRangeRefiner_1);
const NLMergeDateTimeRefiner_1$1 = __importDefault(NLMergeDateTimeRefiner_1);
const NLCasualDateParser_1$1 = __importDefault(NLCasualDateParser_1);
const NLCasualTimeParser_1$1 = __importDefault(NLCasualTimeParser_1);
const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const NLTimeUnitWithinFormatParser_1$1 = __importDefault(NLTimeUnitWithinFormatParser_1);
const NLWeekdayParser_1$1 = __importDefault(NLWeekdayParser_1);
const NLMonthNameMiddleEndianParser_1$1 = __importDefault(NLMonthNameMiddleEndianParser_1);
const NLMonthNameParser_1$1 = __importDefault(NLMonthNameParser_1);
const NLSlashMonthFormatParser_1$1 = __importDefault(NLSlashMonthFormatParser_1);
const NLTimeExpressionParser_1$1 = __importDefault(NLTimeExpressionParser_1);
const NLCasualYearMonthDayParser_1$1 = __importDefault(NLCasualYearMonthDayParser_1);
const NLCasualDateTimeParser_1$1 = __importDefault(NLCasualDateTimeParser_1);
const NLTimeUnitCasualRelativeFormatParser_1$1 = __importDefault(NLTimeUnitCasualRelativeFormatParser_1);
const NLRelativeDateFormatParser_1$1 = __importDefault(NLRelativeDateFormatParser_1);
const NLTimeUnitAgoFormatParser_1$1 = __importDefault(NLTimeUnitAgoFormatParser_1);
const NLTimeUnitLaterFormatParser_1$1 = __importDefault(NLTimeUnitLaterFormatParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new NLCasualDateParser_1$1.default());
    option.parsers.unshift(new NLCasualTimeParser_1$1.default());
    option.parsers.unshift(new NLCasualDateTimeParser_1$1.default());
    option.parsers.unshift(new NLMonthNameParser_1$1.default());
    option.parsers.unshift(new NLRelativeDateFormatParser_1$1.default());
    option.parsers.unshift(new NLTimeUnitCasualRelativeFormatParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new NLTimeUnitWithinFormatParser_1$1.default(),
            new NLMonthNameMiddleEndianParser_1$1.default(),
            new NLMonthNameParser_1$1.default(),
            new NLWeekdayParser_1$1.default(),
            new NLCasualYearMonthDayParser_1$1.default(),
            new NLSlashMonthFormatParser_1$1.default(),
            new NLTimeExpressionParser_1$1.default(strictMode),
            new NLTimeUnitAgoFormatParser_1$1.default(strictMode),
            new NLTimeUnitLaterFormatParser_1$1.default(strictMode),
        ],
        refiners: [new NLMergeDateTimeRefiner_1$1.default(), new NLMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var ZHHantCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);

const NOW_GROUP = 1;
const DAY_GROUP_1 = 2;
const TIME_GROUP_1 = 3;
const TIME_GROUP_2 = 4;
const DAY_GROUP_3 = 5;
const TIME_GROUP_3 = 6;
class ZHHantCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return new RegExp("(而家|立(?:刻|即)|即刻)|" +
            "(今|明|前|大前|後|大後|聽|昨|尋|琴)(早|朝|晚)|" +
            "(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
            "(今|明|前|大前|後|大後|聽|昨|尋|琴)(?:日|天)" +
            "(?:[\\s|,|，]*)" +
            "(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?", "i");
    }
    innerExtract(context, match) {
        const index = match.index;
        const result = context.createParsingResult(index, match[0]);
        const refMoment = dayjs_1.default(context.refDate);
        let startMoment = refMoment;
        if (match[NOW_GROUP]) {
            result.start.imply("hour", refMoment.hour());
            result.start.imply("minute", refMoment.minute());
            result.start.imply("second", refMoment.second());
            result.start.imply("millisecond", refMoment.millisecond());
        }
        else if (match[DAY_GROUP_1]) {
            const day1 = match[DAY_GROUP_1];
            const time1 = match[TIME_GROUP_1];
            if (day1 == "明" || day1 == "聽") {
                if (refMoment.hour() > 1) {
                    startMoment = startMoment.add(1, "day");
                }
            }
            else if (day1 == "昨" || day1 == "尋" || day1 == "琴") {
                startMoment = startMoment.add(-1, "day");
            }
            else if (day1 == "前") {
                startMoment = startMoment.add(-2, "day");
            }
            else if (day1 == "大前") {
                startMoment = startMoment.add(-3, "day");
            }
            else if (day1 == "後") {
                startMoment = startMoment.add(2, "day");
            }
            else if (day1 == "大後") {
                startMoment = startMoment.add(3, "day");
            }
            if (time1 == "早" || time1 == "朝") {
                result.start.imply("hour", 6);
            }
            else if (time1 == "晚") {
                result.start.imply("hour", 22);
                result.start.imply("meridiem", 1);
            }
        }
        else if (match[TIME_GROUP_2]) {
            const timeString2 = match[TIME_GROUP_2];
            const time2 = timeString2[0];
            if (time2 == "早" || time2 == "朝" || time2 == "上") {
                result.start.imply("hour", 6);
            }
            else if (time2 == "下" || time2 == "晏") {
                result.start.imply("hour", 15);
                result.start.imply("meridiem", 1);
            }
            else if (time2 == "中") {
                result.start.imply("hour", 12);
                result.start.imply("meridiem", 1);
            }
            else if (time2 == "夜" || time2 == "晚") {
                result.start.imply("hour", 22);
                result.start.imply("meridiem", 1);
            }
            else if (time2 == "凌") {
                result.start.imply("hour", 0);
            }
        }
        else if (match[DAY_GROUP_3]) {
            const day3 = match[DAY_GROUP_3];
            if (day3 == "明" || day3 == "聽") {
                if (refMoment.hour() > 1) {
                    startMoment = startMoment.add(1, "day");
                }
            }
            else if (day3 == "昨" || day3 == "尋" || day3 == "琴") {
                startMoment = startMoment.add(-1, "day");
            }
            else if (day3 == "前") {
                startMoment = startMoment.add(-2, "day");
            }
            else if (day3 == "大前") {
                startMoment = startMoment.add(-3, "day");
            }
            else if (day3 == "後") {
                startMoment = startMoment.add(2, "day");
            }
            else if (day3 == "大後") {
                startMoment = startMoment.add(3, "day");
            }
            const timeString3 = match[TIME_GROUP_3];
            if (timeString3) {
                const time3 = timeString3[0];
                if (time3 == "早" || time3 == "朝" || time3 == "上") {
                    result.start.imply("hour", 6);
                }
                else if (time3 == "下" || time3 == "晏") {
                    result.start.imply("hour", 15);
                    result.start.imply("meridiem", 1);
                }
                else if (time3 == "中") {
                    result.start.imply("hour", 12);
                    result.start.imply("meridiem", 1);
                }
                else if (time3 == "夜" || time3 == "晚") {
                    result.start.imply("hour", 22);
                    result.start.imply("meridiem", 1);
                }
                else if (time3 == "凌") {
                    result.start.imply("hour", 0);
                }
            }
        }
        result.start.assign("day", startMoment.date());
        result.start.assign("month", startMoment.month() + 1);
        result.start.assign("year", startMoment.year());
        return result;
    }
}
exports.default = ZHHantCasualDateParser;
//# sourceMappingURL=ZHHantCasualDateParser.js.map
});

var constants$3 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.zhStringToYear = exports.zhStringToNumber = exports.WEEKDAY_OFFSET = exports.NUMBER = void 0;
exports.NUMBER = {
    "零": 0,
    "一": 1,
    "二": 2,
    "兩": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 7,
    "八": 8,
    "九": 9,
    "十": 10,
    "廿": 20,
    "卅": 30,
};
exports.WEEKDAY_OFFSET = {
    "天": 0,
    "日": 0,
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
};
function zhStringToNumber(text) {
    let number = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === "十") {
            number = number === 0 ? exports.NUMBER[char] : number * exports.NUMBER[char];
        }
        else {
            number += exports.NUMBER[char];
        }
    }
    return number;
}
exports.zhStringToNumber = zhStringToNumber;
function zhStringToYear(text) {
    let string = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        string = string + exports.NUMBER[char];
    }
    return parseInt(string);
}
exports.zhStringToYear = zhStringToYear;
//# sourceMappingURL=constants.js.map
});

var ZHHantDateParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const YEAR_GROUP = 1;
const MONTH_GROUP = 2;
const DAY_GROUP = 3;
class ZHHantDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return new RegExp("(" +
            "\\d{2,4}|" +
            "[" + Object.keys(constants$3.NUMBER).join("") + "]{4}|" +
            "[" + Object.keys(constants$3.NUMBER).join("") + "]{2}" +
            ")?" +
            "(?:\\s*)" +
            "(?:年)?" +
            "(?:[\\s|,|，]*)" +
            "(" +
            "\\d{1,2}|" +
            "[" + Object.keys(constants$3.NUMBER).join("") + "]{1,2}" +
            ")" +
            "(?:\\s*)" +
            "(?:月)" +
            "(?:\\s*)" +
            "(" +
            "\\d{1,2}|" +
            "[" + Object.keys(constants$3.NUMBER).join("") + "]{1,2}" +
            ")?" +
            "(?:\\s*)" +
            "(?:日|號)?");
    }
    innerExtract(context, match) {
        const startMoment = dayjs_1.default(context.refDate);
        const result = context.createParsingResult(match.index, match[0]);
        let month = parseInt(match[MONTH_GROUP]);
        if (isNaN(month))
            month = constants$3.zhStringToNumber(match[MONTH_GROUP]);
        result.start.assign("month", month);
        if (match[DAY_GROUP]) {
            let day = parseInt(match[DAY_GROUP]);
            if (isNaN(day))
                day = constants$3.zhStringToNumber(match[DAY_GROUP]);
            result.start.assign("day", day);
        }
        else {
            result.start.imply("day", startMoment.date());
        }
        if (match[YEAR_GROUP]) {
            let year = parseInt(match[YEAR_GROUP]);
            if (isNaN(year))
                year = constants$3.zhStringToYear(match[YEAR_GROUP]);
            result.start.assign("year", year);
        }
        else {
            result.start.imply("year", startMoment.year());
        }
        return result;
    }
}
exports.default = ZHHantDateParser;
//# sourceMappingURL=ZHHantDateParser.js.map
});

var ZHHantDeadlineFormatParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp("(\\d+|[" +
    Object.keys(constants$3.NUMBER).join("") +
    "]+|半|幾)(?:\\s*)" +
    "(?:個)?" +
    "(秒(?:鐘)?|分鐘|小時|鐘|日|天|星期|禮拜|月|年)" +
    "(?:(?:之|過)?後|(?:之)?內)", "i");
const NUMBER_GROUP = 1;
const UNIT_GROUP = 2;
class ZHHantDeadlineFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        let number = parseInt(match[NUMBER_GROUP]);
        if (isNaN(number)) {
            number = constants$3.zhStringToNumber(match[NUMBER_GROUP]);
        }
        if (isNaN(number)) {
            const string = match[NUMBER_GROUP];
            if (string === "幾") {
                number = 3;
            }
            else if (string === "半") {
                number = 0.5;
            }
            else {
                return null;
            }
        }
        let date = dayjs_1.default(context.refDate);
        const unit = match[UNIT_GROUP];
        const unitAbbr = unit[0];
        if (unitAbbr.match(/[日天星禮月年]/)) {
            if (unitAbbr == "日" || unitAbbr == "天") {
                date = date.add(number, "d");
            }
            else if (unitAbbr == "星" || unitAbbr == "禮") {
                date = date.add(number * 7, "d");
            }
            else if (unitAbbr == "月") {
                date = date.add(number, "month");
            }
            else if (unitAbbr == "年") {
                date = date.add(number, "year");
            }
            result.start.assign("year", date.year());
            result.start.assign("month", date.month() + 1);
            result.start.assign("day", date.date());
            return result;
        }
        if (unitAbbr == "秒") {
            date = date.add(number, "second");
        }
        else if (unitAbbr == "分") {
            date = date.add(number, "minute");
        }
        else if (unitAbbr == "小" || unitAbbr == "鐘") {
            date = date.add(number, "hour");
        }
        result.start.imply("year", date.year());
        result.start.imply("month", date.month() + 1);
        result.start.imply("day", date.date());
        result.start.assign("hour", date.hour());
        result.start.assign("minute", date.minute());
        result.start.assign("second", date.second());
        return result;
    }
}
exports.default = ZHHantDeadlineFormatParser;
//# sourceMappingURL=ZHHantDeadlineFormatParser.js.map
});

var ZHHantRelationWeekdayParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp("(?<prefix>上|今|下|這|呢)(?:個)?(?:星期|禮拜|週)(?<weekday>" + Object.keys(constants$3.WEEKDAY_OFFSET).join("|") + ")");
class ZHHantRelationWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const dayOfWeek = match.groups.weekday;
        const offset = constants$3.WEEKDAY_OFFSET[dayOfWeek];
        if (offset === undefined)
            return null;
        let modifier = null;
        const prefix = match.groups.prefix;
        if (prefix == "上") {
            modifier = "last";
        }
        else if (prefix == "下") {
            modifier = "next";
        }
        else if (prefix == "今" || prefix == "這" || prefix == "呢") {
            modifier = "this";
        }
        let startMoment = dayjs_1.default(context.refDate);
        let startMomentFixed = false;
        const refOffset = startMoment.day();
        if (modifier == "last" || modifier == "past") {
            startMoment = startMoment.day(offset - 7);
            startMomentFixed = true;
        }
        else if (modifier == "next") {
            startMoment = startMoment.day(offset + 7);
            startMomentFixed = true;
        }
        else if (modifier == "this") {
            startMoment = startMoment.day(offset);
        }
        else {
            if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                startMoment = startMoment.day(offset - 7);
            }
            else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                startMoment = startMoment.day(offset + 7);
            }
            else {
                startMoment = startMoment.day(offset);
            }
        }
        result.start.assign("weekday", offset);
        if (startMomentFixed) {
            result.start.assign("day", startMoment.date());
            result.start.assign("month", startMoment.month() + 1);
            result.start.assign("year", startMoment.year());
        }
        else {
            result.start.imply("day", startMoment.date());
            result.start.imply("month", startMoment.month() + 1);
            result.start.imply("year", startMoment.year());
        }
        return result;
    }
}
exports.default = ZHHantRelationWeekdayParser;
//# sourceMappingURL=ZHHantRelationWeekdayParser.js.map
});

var ZHHantTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const FIRST_REG_PATTERN = new RegExp("(?:由|從|自)?" +
    "(?:" +
    "(今|明|前|大前|後|大後|聽|昨|尋|琴)(早|朝|晚)|" +
    "(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
    "(今|明|前|大前|後|大後|聽|昨|尋|琴)(?:日|天)" +
    "(?:[\\s,，]*)" +
    "(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
    ")?" +
    "(?:[\\s,，]*)" +
    "(?:(\\d+|[" +
    Object.keys(constants$3.NUMBER).join("") +
    "]+)(?:\\s*)(?:點|時|:|：)" +
    "(?:\\s*)" +
    "(\\d+|半|正|整|[" +
    Object.keys(constants$3.NUMBER).join("") +
    "]+)?(?:\\s*)(?:分|:|：)?" +
    "(?:\\s*)" +
    "(\\d+|[" +
    Object.keys(constants$3.NUMBER).join("") +
    "]+)?(?:\\s*)(?:秒)?)" +
    "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
const SECOND_REG_PATTERN = new RegExp("(?:^\\s*(?:到|至|\\-|\\–|\\~|\\〜)\\s*)" +
    "(?:" +
    "(今|明|前|大前|後|大後|聽|昨|尋|琴)(早|朝|晚)|" +
    "(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
    "(今|明|前|大前|後|大後|聽|昨|尋|琴)(?:日|天)" +
    "(?:[\\s,，]*)" +
    "(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
    ")?" +
    "(?:[\\s,，]*)" +
    "(?:(\\d+|[" +
    Object.keys(constants$3.NUMBER).join("") +
    "]+)(?:\\s*)(?:點|時|:|：)" +
    "(?:\\s*)" +
    "(\\d+|半|正|整|[" +
    Object.keys(constants$3.NUMBER).join("") +
    "]+)?(?:\\s*)(?:分|:|：)?" +
    "(?:\\s*)" +
    "(\\d+|[" +
    Object.keys(constants$3.NUMBER).join("") +
    "]+)?(?:\\s*)(?:秒)?)" +
    "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
const DAY_GROUP_1 = 1;
const ZH_AM_PM_HOUR_GROUP_1 = 2;
const ZH_AM_PM_HOUR_GROUP_2 = 3;
const DAY_GROUP_3 = 4;
const ZH_AM_PM_HOUR_GROUP_3 = 5;
const HOUR_GROUP = 6;
const MINUTE_GROUP = 7;
const SECOND_GROUP = 8;
const AM_PM_HOUR_GROUP = 9;
class ZHHantTimeExpressionParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return FIRST_REG_PATTERN;
    }
    innerExtract(context, match) {
        if (match.index > 0 && context.text[match.index - 1].match(/\w/)) {
            return null;
        }
        const refMoment = dayjs_1.default(context.refDate);
        const result = context.createParsingResult(match.index, match[0]);
        let startMoment = refMoment.clone();
        if (match[DAY_GROUP_1]) {
            var day1 = match[DAY_GROUP_1];
            if (day1 == "明" || day1 == "聽") {
                if (refMoment.hour() > 1) {
                    startMoment = startMoment.add(1, "day");
                }
            }
            else if (day1 == "昨" || day1 == "尋" || day1 == "琴") {
                startMoment = startMoment.add(-1, "day");
            }
            else if (day1 == "前") {
                startMoment = startMoment.add(-2, "day");
            }
            else if (day1 == "大前") {
                startMoment = startMoment.add(-3, "day");
            }
            else if (day1 == "後") {
                startMoment = startMoment.add(2, "day");
            }
            else if (day1 == "大後") {
                startMoment = startMoment.add(3, "day");
            }
            result.start.assign("day", startMoment.date());
            result.start.assign("month", startMoment.month() + 1);
            result.start.assign("year", startMoment.year());
        }
        else if (match[DAY_GROUP_3]) {
            var day3 = match[DAY_GROUP_3];
            if (day3 == "明" || day3 == "聽") {
                startMoment = startMoment.add(1, "day");
            }
            else if (day3 == "昨" || day3 == "尋" || day3 == "琴") {
                startMoment = startMoment.add(-1, "day");
            }
            else if (day3 == "前") {
                startMoment = startMoment.add(-2, "day");
            }
            else if (day3 == "大前") {
                startMoment = startMoment.add(-3, "day");
            }
            else if (day3 == "後") {
                startMoment = startMoment.add(2, "day");
            }
            else if (day3 == "大後") {
                startMoment = startMoment.add(3, "day");
            }
            result.start.assign("day", startMoment.date());
            result.start.assign("month", startMoment.month() + 1);
            result.start.assign("year", startMoment.year());
        }
        else {
            result.start.imply("day", startMoment.date());
            result.start.imply("month", startMoment.month() + 1);
            result.start.imply("year", startMoment.year());
        }
        let hour = 0;
        let minute = 0;
        let meridiem = -1;
        if (match[SECOND_GROUP]) {
            var second = parseInt(match[SECOND_GROUP]);
            if (isNaN(second)) {
                second = constants$3.zhStringToNumber(match[SECOND_GROUP]);
            }
            if (second >= 60)
                return null;
            result.start.assign("second", second);
        }
        hour = parseInt(match[HOUR_GROUP]);
        if (isNaN(hour)) {
            hour = constants$3.zhStringToNumber(match[HOUR_GROUP]);
        }
        if (match[MINUTE_GROUP]) {
            if (match[MINUTE_GROUP] == "半") {
                minute = 30;
            }
            else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                minute = 0;
            }
            else {
                minute = parseInt(match[MINUTE_GROUP]);
                if (isNaN(minute)) {
                    minute = constants$3.zhStringToNumber(match[MINUTE_GROUP]);
                }
            }
        }
        else if (hour > 100) {
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (minute >= 60) {
            return null;
        }
        if (hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = 1;
        }
        if (match[AM_PM_HOUR_GROUP]) {
            if (hour > 12)
                return null;
            var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            if (ampm == "p") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
            var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
            var zhAMPM1 = zhAMPMString1[0];
            if (zhAMPM1 == "朝" || zhAMPM1 == "早") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM1 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
            var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
            var zhAMPM2 = zhAMPMString2[0];
            if (zhAMPM2 == "上" || zhAMPM2 == "朝" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM2 == "下" || zhAMPM2 == "晏" || zhAMPM2 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
            var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
            var zhAMPM3 = zhAMPMString3[0];
            if (zhAMPM3 == "上" || zhAMPM3 == "朝" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM3 == "下" || zhAMPM3 == "晏" || zhAMPM3 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        result.start.assign("hour", hour);
        result.start.assign("minute", minute);
        if (meridiem >= 0) {
            result.start.assign("meridiem", meridiem);
        }
        else {
            if (hour < 12) {
                result.start.imply("meridiem", 0);
            }
            else {
                result.start.imply("meridiem", 1);
            }
        }
        match = SECOND_REG_PATTERN.exec(context.text.substring(result.index + result.text.length));
        if (!match) {
            if (result.text.match(/^\d+$/)) {
                return null;
            }
            return result;
        }
        let endMoment = startMoment.clone();
        result.end = context.createParsingComponents();
        if (match[DAY_GROUP_1]) {
            var day1 = match[DAY_GROUP_1];
            if (day1 == "明" || day1 == "聽") {
                if (refMoment.hour() > 1) {
                    endMoment = endMoment.add(1, "day");
                }
            }
            else if (day1 == "昨" || day1 == "尋" || day1 == "琴") {
                endMoment = endMoment.add(-1, "day");
            }
            else if (day1 == "前") {
                endMoment = endMoment.add(-2, "day");
            }
            else if (day1 == "大前") {
                endMoment = endMoment.add(-3, "day");
            }
            else if (day1 == "後") {
                endMoment = endMoment.add(2, "day");
            }
            else if (day1 == "大後") {
                endMoment = endMoment.add(3, "day");
            }
            result.end.assign("day", endMoment.date());
            result.end.assign("month", endMoment.month() + 1);
            result.end.assign("year", endMoment.year());
        }
        else if (match[DAY_GROUP_3]) {
            var day3 = match[DAY_GROUP_3];
            if (day3 == "明" || day3 == "聽") {
                endMoment = endMoment.add(1, "day");
            }
            else if (day3 == "昨" || day3 == "尋" || day3 == "琴") {
                endMoment = endMoment.add(-1, "day");
            }
            else if (day3 == "前") {
                endMoment = endMoment.add(-2, "day");
            }
            else if (day3 == "大前") {
                endMoment = endMoment.add(-3, "day");
            }
            else if (day3 == "後") {
                endMoment = endMoment.add(2, "day");
            }
            else if (day3 == "大後") {
                endMoment = endMoment.add(3, "day");
            }
            result.end.assign("day", endMoment.date());
            result.end.assign("month", endMoment.month() + 1);
            result.end.assign("year", endMoment.year());
        }
        else {
            result.end.imply("day", endMoment.date());
            result.end.imply("month", endMoment.month() + 1);
            result.end.imply("year", endMoment.year());
        }
        hour = 0;
        minute = 0;
        meridiem = -1;
        if (match[SECOND_GROUP]) {
            var second = parseInt(match[SECOND_GROUP]);
            if (isNaN(second)) {
                second = constants$3.zhStringToNumber(match[SECOND_GROUP]);
            }
            if (second >= 60)
                return null;
            result.end.assign("second", second);
        }
        hour = parseInt(match[HOUR_GROUP]);
        if (isNaN(hour)) {
            hour = constants$3.zhStringToNumber(match[HOUR_GROUP]);
        }
        if (match[MINUTE_GROUP]) {
            if (match[MINUTE_GROUP] == "半") {
                minute = 30;
            }
            else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                minute = 0;
            }
            else {
                minute = parseInt(match[MINUTE_GROUP]);
                if (isNaN(minute)) {
                    minute = constants$3.zhStringToNumber(match[MINUTE_GROUP]);
                }
            }
        }
        else if (hour > 100) {
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (minute >= 60) {
            return null;
        }
        if (hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = 1;
        }
        if (match[AM_PM_HOUR_GROUP]) {
            if (hour > 12)
                return null;
            var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            if (ampm == "p") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
            if (!result.start.isCertain("meridiem")) {
                if (meridiem == 0) {
                    result.start.imply("meridiem", 0);
                    if (result.start.get("hour") == 12) {
                        result.start.assign("hour", 0);
                    }
                }
                else {
                    result.start.imply("meridiem", 1);
                    if (result.start.get("hour") != 12) {
                        result.start.assign("hour", result.start.get("hour") + 12);
                    }
                }
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
            var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
            var zhAMPM1 = zhAMPMString1[0];
            if (zhAMPM1 == "朝" || zhAMPM1 == "早") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM1 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
            var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
            var zhAMPM2 = zhAMPMString2[0];
            if (zhAMPM2 == "上" || zhAMPM2 == "朝" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM2 == "下" || zhAMPM2 == "晏" || zhAMPM2 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
            var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
            var zhAMPM3 = zhAMPMString3[0];
            if (zhAMPM3 == "上" || zhAMPM3 == "朝" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM3 == "下" || zhAMPM3 == "晏" || zhAMPM3 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        result.text = result.text + match[0];
        result.end.assign("hour", hour);
        result.end.assign("minute", minute);
        if (meridiem >= 0) {
            result.end.assign("meridiem", meridiem);
        }
        else {
            const startAtPM = result.start.isCertain("meridiem") && result.start.get("meridiem") == 1;
            if (startAtPM && result.start.get("hour") > hour) {
                result.end.imply("meridiem", 0);
            }
            else if (hour > 12) {
                result.end.imply("meridiem", 1);
            }
        }
        if (result.end.date().getTime() < result.start.date().getTime()) {
            result.end.imply("day", result.end.get("day") + 1);
        }
        return result;
    }
}
exports.default = ZHHantTimeExpressionParser;
//# sourceMappingURL=ZHHantTimeExpressionParser.js.map
});

var ZHHantWeekdayParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp("(?:星期|禮拜|週)(?<weekday>" + Object.keys(constants$3.WEEKDAY_OFFSET).join("|") + ")");
class ZHHantWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const dayOfWeek = match.groups.weekday;
        const offset = constants$3.WEEKDAY_OFFSET[dayOfWeek];
        if (offset === undefined)
            return null;
        let startMoment = dayjs_1.default(context.refDate);
        const refOffset = startMoment.day();
        if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
            startMoment = startMoment.day(offset - 7);
        }
        else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
            startMoment = startMoment.day(offset + 7);
        }
        else {
            startMoment = startMoment.day(offset);
        }
        result.start.assign("weekday", offset);
        {
            result.start.imply("day", startMoment.date());
            result.start.imply("month", startMoment.month() + 1);
            result.start.imply("year", startMoment.year());
        }
        return result;
    }
}
exports.default = ZHHantWeekdayParser;
//# sourceMappingURL=ZHHantWeekdayParser.js.map
});

var ZHHantMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class ZHHantMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(至|到|\-|\~|～|－|ー)\s*$/i;
    }
}
exports.default = ZHHantMergeDateRangeRefiner;
//# sourceMappingURL=ZHHantMergeDateRangeRefiner.js.map
});

var ZHHantMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1$1 = __importDefault(AbstractMergeDateTimeRefiner_1);
class ZHHantMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1$1.default {
    patternBetween() {
        return /^\s*$/i;
    }
}
exports.default = ZHHantMergeDateTimeRefiner;
//# sourceMappingURL=ZHHantMergeDateTimeRefiner.js.map
});

var hant = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.hant = void 0;

const ExtractTimezoneOffsetRefiner_1$1 = __importDefault(ExtractTimezoneOffsetRefiner_1);

const ZHHantCasualDateParser_1$1 = __importDefault(ZHHantCasualDateParser_1);
const ZHHantDateParser_1$1 = __importDefault(ZHHantDateParser_1);
const ZHHantDeadlineFormatParser_1$1 = __importDefault(ZHHantDeadlineFormatParser_1);
const ZHHantRelationWeekdayParser_1$1 = __importDefault(ZHHantRelationWeekdayParser_1);
const ZHHantTimeExpressionParser_1$1 = __importDefault(ZHHantTimeExpressionParser_1);
const ZHHantWeekdayParser_1$1 = __importDefault(ZHHantWeekdayParser_1);
const ZHHantMergeDateRangeRefiner_1$1 = __importDefault(ZHHantMergeDateRangeRefiner_1);
const ZHHantMergeDateTimeRefiner_1$1 = __importDefault(ZHHantMergeDateTimeRefiner_1);
exports.hant = new chrono$1.Chrono(createCasualConfiguration());
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration());
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration() {
    const option = createConfiguration();
    option.parsers.unshift(new ZHHantCasualDateParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration() {
    const configuration = configurations.includeCommonConfiguration({
        parsers: [
            new ZHHantDateParser_1$1.default(),
            new ZHHantRelationWeekdayParser_1$1.default(),
            new ZHHantWeekdayParser_1$1.default(),
            new ZHHantTimeExpressionParser_1$1.default(),
            new ZHHantDeadlineFormatParser_1$1.default(),
        ],
        refiners: [new ZHHantMergeDateRangeRefiner_1$1.default(), new ZHHantMergeDateTimeRefiner_1$1.default()],
    });
    configuration.refiners = configuration.refiners.filter((refiner) => !(refiner instanceof ExtractTimezoneOffsetRefiner_1$1.default));
    return configuration;
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var ZHHansCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);

const NOW_GROUP = 1;
const DAY_GROUP_1 = 2;
const TIME_GROUP_1 = 3;
const TIME_GROUP_2 = 4;
const DAY_GROUP_3 = 5;
const TIME_GROUP_3 = 6;
class ZHHansCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return new RegExp("(现在|立(?:刻|即)|即刻)|" +
            "(今|明|前|大前|后|大后|昨)(早|晚)|" +
            "(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
            "(今|明|前|大前|后|大后|昨)(?:日|天)" +
            "(?:[\\s|,|，]*)" +
            "(?:(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?", "i");
    }
    innerExtract(context, match) {
        const index = match.index;
        const result = context.createParsingResult(index, match[0]);
        const refMoment = dayjs_1.default(context.refDate);
        let startMoment = refMoment;
        if (match[NOW_GROUP]) {
            result.start.imply("hour", refMoment.hour());
            result.start.imply("minute", refMoment.minute());
            result.start.imply("second", refMoment.second());
            result.start.imply("millisecond", refMoment.millisecond());
        }
        else if (match[DAY_GROUP_1]) {
            const day1 = match[DAY_GROUP_1];
            const time1 = match[TIME_GROUP_1];
            if (day1 == "明") {
                if (refMoment.hour() > 1) {
                    startMoment = startMoment.add(1, "day");
                }
            }
            else if (day1 == "昨") {
                startMoment = startMoment.add(-1, "day");
            }
            else if (day1 == "前") {
                startMoment = startMoment.add(-2, "day");
            }
            else if (day1 == "大前") {
                startMoment = startMoment.add(-3, "day");
            }
            else if (day1 == "后") {
                startMoment = startMoment.add(2, "day");
            }
            else if (day1 == "大后") {
                startMoment = startMoment.add(3, "day");
            }
            if (time1 == "早") {
                result.start.imply("hour", 6);
            }
            else if (time1 == "晚") {
                result.start.imply("hour", 22);
                result.start.imply("meridiem", 1);
            }
        }
        else if (match[TIME_GROUP_2]) {
            const timeString2 = match[TIME_GROUP_2];
            const time2 = timeString2[0];
            if (time2 == "早" || time2 == "上") {
                result.start.imply("hour", 6);
            }
            else if (time2 == "下") {
                result.start.imply("hour", 15);
                result.start.imply("meridiem", 1);
            }
            else if (time2 == "中") {
                result.start.imply("hour", 12);
                result.start.imply("meridiem", 1);
            }
            else if (time2 == "夜" || time2 == "晚") {
                result.start.imply("hour", 22);
                result.start.imply("meridiem", 1);
            }
            else if (time2 == "凌") {
                result.start.imply("hour", 0);
            }
        }
        else if (match[DAY_GROUP_3]) {
            const day3 = match[DAY_GROUP_3];
            if (day3 == "明") {
                if (refMoment.hour() > 1) {
                    startMoment = startMoment.add(1, "day");
                }
            }
            else if (day3 == "昨") {
                startMoment = startMoment.add(-1, "day");
            }
            else if (day3 == "前") {
                startMoment = startMoment.add(-2, "day");
            }
            else if (day3 == "大前") {
                startMoment = startMoment.add(-3, "day");
            }
            else if (day3 == "后") {
                startMoment = startMoment.add(2, "day");
            }
            else if (day3 == "大后") {
                startMoment = startMoment.add(3, "day");
            }
            const timeString3 = match[TIME_GROUP_3];
            if (timeString3) {
                const time3 = timeString3[0];
                if (time3 == "早" || time3 == "上") {
                    result.start.imply("hour", 6);
                }
                else if (time3 == "下") {
                    result.start.imply("hour", 15);
                    result.start.imply("meridiem", 1);
                }
                else if (time3 == "中") {
                    result.start.imply("hour", 12);
                    result.start.imply("meridiem", 1);
                }
                else if (time3 == "夜" || time3 == "晚") {
                    result.start.imply("hour", 22);
                    result.start.imply("meridiem", 1);
                }
                else if (time3 == "凌") {
                    result.start.imply("hour", 0);
                }
            }
        }
        result.start.assign("day", startMoment.date());
        result.start.assign("month", startMoment.month() + 1);
        result.start.assign("year", startMoment.year());
        return result;
    }
}
exports.default = ZHHansCasualDateParser;
//# sourceMappingURL=ZHHansCasualDateParser.js.map
});

var constants$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.zhStringToYear = exports.zhStringToNumber = exports.WEEKDAY_OFFSET = exports.NUMBER = void 0;
exports.NUMBER = {
    "零": 0,
    "〇": 0,
    "一": 1,
    "二": 2,
    "两": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 7,
    "八": 8,
    "九": 9,
    "十": 10,
};
exports.WEEKDAY_OFFSET = {
    "天": 0,
    "日": 0,
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
};
function zhStringToNumber(text) {
    let number = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === "十") {
            number = number === 0 ? exports.NUMBER[char] : number * exports.NUMBER[char];
        }
        else {
            number += exports.NUMBER[char];
        }
    }
    return number;
}
exports.zhStringToNumber = zhStringToNumber;
function zhStringToYear(text) {
    let string = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        string = string + exports.NUMBER[char];
    }
    return parseInt(string);
}
exports.zhStringToYear = zhStringToYear;
//# sourceMappingURL=constants.js.map
});

var ZHHansDateParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const YEAR_GROUP = 1;
const MONTH_GROUP = 2;
const DAY_GROUP = 3;
class ZHHansDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return new RegExp("(" +
            "\\d{2,4}|" +
            "[" +
            Object.keys(constants$2.NUMBER).join("") +
            "]{4}|" +
            "[" +
            Object.keys(constants$2.NUMBER).join("") +
            "]{2}" +
            ")?" +
            "(?:\\s*)" +
            "(?:年)?" +
            "(?:[\\s|,|，]*)" +
            "(" +
            "\\d{1,2}|" +
            "[" +
            Object.keys(constants$2.NUMBER).join("") +
            "]{1,3}" +
            ")" +
            "(?:\\s*)" +
            "(?:月)" +
            "(?:\\s*)" +
            "(" +
            "\\d{1,2}|" +
            "[" +
            Object.keys(constants$2.NUMBER).join("") +
            "]{1,3}" +
            ")?" +
            "(?:\\s*)" +
            "(?:日|号)?");
    }
    innerExtract(context, match) {
        const startMoment = dayjs_1.default(context.refDate);
        const result = context.createParsingResult(match.index, match[0]);
        let month = parseInt(match[MONTH_GROUP]);
        if (isNaN(month))
            month = constants$2.zhStringToNumber(match[MONTH_GROUP]);
        result.start.assign("month", month);
        if (match[DAY_GROUP]) {
            let day = parseInt(match[DAY_GROUP]);
            if (isNaN(day))
                day = constants$2.zhStringToNumber(match[DAY_GROUP]);
            result.start.assign("day", day);
        }
        else {
            result.start.imply("day", startMoment.date());
        }
        if (match[YEAR_GROUP]) {
            let year = parseInt(match[YEAR_GROUP]);
            if (isNaN(year))
                year = constants$2.zhStringToYear(match[YEAR_GROUP]);
            result.start.assign("year", year);
        }
        else {
            result.start.imply("year", startMoment.year());
        }
        return result;
    }
}
exports.default = ZHHansDateParser;
//# sourceMappingURL=ZHHansDateParser.js.map
});

var ZHHansDeadlineFormatParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp("(\\d+|[" +
    Object.keys(constants$2.NUMBER).join("") +
    "]+|半|几)(?:\\s*)" +
    "(?:个)?" +
    "(秒(?:钟)?|分钟|小时|钟|日|天|星期|礼拜|月|年)" +
    "(?:(?:之|过)?后|(?:之)?内)", "i");
const NUMBER_GROUP = 1;
const UNIT_GROUP = 2;
class ZHHansDeadlineFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        let number = parseInt(match[NUMBER_GROUP]);
        if (isNaN(number)) {
            number = constants$2.zhStringToNumber(match[NUMBER_GROUP]);
        }
        if (isNaN(number)) {
            const string = match[NUMBER_GROUP];
            if (string === "几") {
                number = 3;
            }
            else if (string === "半") {
                number = 0.5;
            }
            else {
                return null;
            }
        }
        let date = dayjs_1.default(context.refDate);
        const unit = match[UNIT_GROUP];
        const unitAbbr = unit[0];
        if (unitAbbr.match(/[日天星礼月年]/)) {
            if (unitAbbr == "日" || unitAbbr == "天") {
                date = date.add(number, "d");
            }
            else if (unitAbbr == "星" || unitAbbr == "礼") {
                date = date.add(number * 7, "d");
            }
            else if (unitAbbr == "月") {
                date = date.add(number, "month");
            }
            else if (unitAbbr == "年") {
                date = date.add(number, "year");
            }
            result.start.assign("year", date.year());
            result.start.assign("month", date.month() + 1);
            result.start.assign("day", date.date());
            return result;
        }
        if (unitAbbr == "秒") {
            date = date.add(number, "second");
        }
        else if (unitAbbr == "分") {
            date = date.add(number, "minute");
        }
        else if (unitAbbr == "小" || unitAbbr == "钟") {
            date = date.add(number, "hour");
        }
        result.start.imply("year", date.year());
        result.start.imply("month", date.month() + 1);
        result.start.imply("day", date.date());
        result.start.assign("hour", date.hour());
        result.start.assign("minute", date.minute());
        result.start.assign("second", date.second());
        return result;
    }
}
exports.default = ZHHansDeadlineFormatParser;
//# sourceMappingURL=ZHHansDeadlineFormatParser.js.map
});

var ZHHansRelationWeekdayParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp("(?<prefix>上|下|这)(?:个)?(?:星期|礼拜|周)(?<weekday>" + Object.keys(constants$2.WEEKDAY_OFFSET).join("|") + ")");
class ZHHansRelationWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const dayOfWeek = match.groups.weekday;
        const offset = constants$2.WEEKDAY_OFFSET[dayOfWeek];
        if (offset === undefined)
            return null;
        let modifier = null;
        const prefix = match.groups.prefix;
        if (prefix == "上") {
            modifier = "last";
        }
        else if (prefix == "下") {
            modifier = "next";
        }
        else if (prefix == "这") {
            modifier = "this";
        }
        let startMoment = dayjs_1.default(context.refDate);
        let startMomentFixed = false;
        const refOffset = startMoment.day();
        if (modifier == "last" || modifier == "past") {
            startMoment = startMoment.day(offset - 7);
            startMomentFixed = true;
        }
        else if (modifier == "next") {
            startMoment = startMoment.day(offset + 7);
            startMomentFixed = true;
        }
        else if (modifier == "this") {
            startMoment = startMoment.day(offset);
        }
        else {
            if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                startMoment = startMoment.day(offset - 7);
            }
            else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                startMoment = startMoment.day(offset + 7);
            }
            else {
                startMoment = startMoment.day(offset);
            }
        }
        result.start.assign("weekday", offset);
        if (startMomentFixed) {
            result.start.assign("day", startMoment.date());
            result.start.assign("month", startMoment.month() + 1);
            result.start.assign("year", startMoment.year());
        }
        else {
            result.start.imply("day", startMoment.date());
            result.start.imply("month", startMoment.month() + 1);
            result.start.imply("year", startMoment.year());
        }
        return result;
    }
}
exports.default = ZHHansRelationWeekdayParser;
//# sourceMappingURL=ZHHansRelationWeekdayParser.js.map
});

var ZHHansTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const FIRST_REG_PATTERN = new RegExp("(?:从|自)?" +
    "(?:" +
    "(今|明|前|大前|后|大后|昨)(早|朝|晚)|" +
    "(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
    "(今|明|前|大前|后|大后|昨)(?:日|天)" +
    "(?:[\\s,，]*)" +
    "(?:(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
    ")?" +
    "(?:[\\s,，]*)" +
    "(?:(\\d+|[" +
    Object.keys(constants$2.NUMBER).join("") +
    "]+)(?:\\s*)(?:点|时|:|：)" +
    "(?:\\s*)" +
    "(\\d+|半|正|整|[" +
    Object.keys(constants$2.NUMBER).join("") +
    "]+)?(?:\\s*)(?:分|:|：)?" +
    "(?:\\s*)" +
    "(\\d+|[" +
    Object.keys(constants$2.NUMBER).join("") +
    "]+)?(?:\\s*)(?:秒)?)" +
    "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
const SECOND_REG_PATTERN = new RegExp("(?:^\\s*(?:到|至|\\-|\\–|\\~|\\〜)\\s*)" +
    "(?:" +
    "(今|明|前|大前|后|大后|昨)(早|朝|晚)|" +
    "(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
    "(今|明|前|大前|后|大后|昨)(?:日|天)" +
    "(?:[\\s,，]*)" +
    "(?:(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
    ")?" +
    "(?:[\\s,，]*)" +
    "(?:(\\d+|[" +
    Object.keys(constants$2.NUMBER).join("") +
    "]+)(?:\\s*)(?:点|时|:|：)" +
    "(?:\\s*)" +
    "(\\d+|半|正|整|[" +
    Object.keys(constants$2.NUMBER).join("") +
    "]+)?(?:\\s*)(?:分|:|：)?" +
    "(?:\\s*)" +
    "(\\d+|[" +
    Object.keys(constants$2.NUMBER).join("") +
    "]+)?(?:\\s*)(?:秒)?)" +
    "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
const DAY_GROUP_1 = 1;
const ZH_AM_PM_HOUR_GROUP_1 = 2;
const ZH_AM_PM_HOUR_GROUP_2 = 3;
const DAY_GROUP_3 = 4;
const ZH_AM_PM_HOUR_GROUP_3 = 5;
const HOUR_GROUP = 6;
const MINUTE_GROUP = 7;
const SECOND_GROUP = 8;
const AM_PM_HOUR_GROUP = 9;
class ZHHansTimeExpressionParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return FIRST_REG_PATTERN;
    }
    innerExtract(context, match) {
        if (match.index > 0 && context.text[match.index - 1].match(/\w/)) {
            return null;
        }
        const refMoment = dayjs_1.default(context.refDate);
        const result = context.createParsingResult(match.index, match[0]);
        let startMoment = refMoment.clone();
        if (match[DAY_GROUP_1]) {
            const day1 = match[DAY_GROUP_1];
            if (day1 == "明") {
                if (refMoment.hour() > 1) {
                    startMoment = startMoment.add(1, "day");
                }
            }
            else if (day1 == "昨") {
                startMoment = startMoment.add(-1, "day");
            }
            else if (day1 == "前") {
                startMoment = startMoment.add(-2, "day");
            }
            else if (day1 == "大前") {
                startMoment = startMoment.add(-3, "day");
            }
            else if (day1 == "后") {
                startMoment = startMoment.add(2, "day");
            }
            else if (day1 == "大后") {
                startMoment = startMoment.add(3, "day");
            }
            result.start.assign("day", startMoment.date());
            result.start.assign("month", startMoment.month() + 1);
            result.start.assign("year", startMoment.year());
        }
        else if (match[DAY_GROUP_3]) {
            const day3 = match[DAY_GROUP_3];
            if (day3 == "明") {
                startMoment = startMoment.add(1, "day");
            }
            else if (day3 == "昨") {
                startMoment = startMoment.add(-1, "day");
            }
            else if (day3 == "前") {
                startMoment = startMoment.add(-2, "day");
            }
            else if (day3 == "大前") {
                startMoment = startMoment.add(-3, "day");
            }
            else if (day3 == "后") {
                startMoment = startMoment.add(2, "day");
            }
            else if (day3 == "大后") {
                startMoment = startMoment.add(3, "day");
            }
            result.start.assign("day", startMoment.date());
            result.start.assign("month", startMoment.month() + 1);
            result.start.assign("year", startMoment.year());
        }
        else {
            result.start.imply("day", startMoment.date());
            result.start.imply("month", startMoment.month() + 1);
            result.start.imply("year", startMoment.year());
        }
        let hour = 0;
        let minute = 0;
        let meridiem = -1;
        if (match[SECOND_GROUP]) {
            let second = parseInt(match[SECOND_GROUP]);
            if (isNaN(second)) {
                second = constants$2.zhStringToNumber(match[SECOND_GROUP]);
            }
            if (second >= 60)
                return null;
            result.start.assign("second", second);
        }
        hour = parseInt(match[HOUR_GROUP]);
        if (isNaN(hour)) {
            hour = constants$2.zhStringToNumber(match[HOUR_GROUP]);
        }
        if (match[MINUTE_GROUP]) {
            if (match[MINUTE_GROUP] == "半") {
                minute = 30;
            }
            else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                minute = 0;
            }
            else {
                minute = parseInt(match[MINUTE_GROUP]);
                if (isNaN(minute)) {
                    minute = constants$2.zhStringToNumber(match[MINUTE_GROUP]);
                }
            }
        }
        else if (hour > 100) {
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (minute >= 60) {
            return null;
        }
        if (hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = 1;
        }
        if (match[AM_PM_HOUR_GROUP]) {
            if (hour > 12)
                return null;
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            if (ampm == "p") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
            const zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
            const zhAMPM1 = zhAMPMString1[0];
            if (zhAMPM1 == "早") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM1 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
            const zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
            const zhAMPM2 = zhAMPMString2[0];
            if (zhAMPM2 == "上" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM2 == "下" || zhAMPM2 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
            const zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
            const zhAMPM3 = zhAMPMString3[0];
            if (zhAMPM3 == "上" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM3 == "下" || zhAMPM3 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        result.start.assign("hour", hour);
        result.start.assign("minute", minute);
        if (meridiem >= 0) {
            result.start.assign("meridiem", meridiem);
        }
        else {
            if (hour < 12) {
                result.start.imply("meridiem", 0);
            }
            else {
                result.start.imply("meridiem", 1);
            }
        }
        match = SECOND_REG_PATTERN.exec(context.text.substring(result.index + result.text.length));
        if (!match) {
            if (result.text.match(/^\d+$/)) {
                return null;
            }
            return result;
        }
        let endMoment = startMoment.clone();
        result.end = context.createParsingComponents();
        if (match[DAY_GROUP_1]) {
            const day1 = match[DAY_GROUP_1];
            if (day1 == "明") {
                if (refMoment.hour() > 1) {
                    endMoment = endMoment.add(1, "day");
                }
            }
            else if (day1 == "昨") {
                endMoment = endMoment.add(-1, "day");
            }
            else if (day1 == "前") {
                endMoment = endMoment.add(-2, "day");
            }
            else if (day1 == "大前") {
                endMoment = endMoment.add(-3, "day");
            }
            else if (day1 == "后") {
                endMoment = endMoment.add(2, "day");
            }
            else if (day1 == "大后") {
                endMoment = endMoment.add(3, "day");
            }
            result.end.assign("day", endMoment.date());
            result.end.assign("month", endMoment.month() + 1);
            result.end.assign("year", endMoment.year());
        }
        else if (match[DAY_GROUP_3]) {
            const day3 = match[DAY_GROUP_3];
            if (day3 == "明") {
                endMoment = endMoment.add(1, "day");
            }
            else if (day3 == "昨") {
                endMoment = endMoment.add(-1, "day");
            }
            else if (day3 == "前") {
                endMoment = endMoment.add(-2, "day");
            }
            else if (day3 == "大前") {
                endMoment = endMoment.add(-3, "day");
            }
            else if (day3 == "后") {
                endMoment = endMoment.add(2, "day");
            }
            else if (day3 == "大后") {
                endMoment = endMoment.add(3, "day");
            }
            result.end.assign("day", endMoment.date());
            result.end.assign("month", endMoment.month() + 1);
            result.end.assign("year", endMoment.year());
        }
        else {
            result.end.imply("day", endMoment.date());
            result.end.imply("month", endMoment.month() + 1);
            result.end.imply("year", endMoment.year());
        }
        hour = 0;
        minute = 0;
        meridiem = -1;
        if (match[SECOND_GROUP]) {
            let second = parseInt(match[SECOND_GROUP]);
            if (isNaN(second)) {
                second = constants$2.zhStringToNumber(match[SECOND_GROUP]);
            }
            if (second >= 60)
                return null;
            result.end.assign("second", second);
        }
        hour = parseInt(match[HOUR_GROUP]);
        if (isNaN(hour)) {
            hour = constants$2.zhStringToNumber(match[HOUR_GROUP]);
        }
        if (match[MINUTE_GROUP]) {
            if (match[MINUTE_GROUP] == "半") {
                minute = 30;
            }
            else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                minute = 0;
            }
            else {
                minute = parseInt(match[MINUTE_GROUP]);
                if (isNaN(minute)) {
                    minute = constants$2.zhStringToNumber(match[MINUTE_GROUP]);
                }
            }
        }
        else if (hour > 100) {
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (minute >= 60) {
            return null;
        }
        if (hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = 1;
        }
        if (match[AM_PM_HOUR_GROUP]) {
            if (hour > 12)
                return null;
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            if (ampm == "p") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
            if (!result.start.isCertain("meridiem")) {
                if (meridiem == 0) {
                    result.start.imply("meridiem", 0);
                    if (result.start.get("hour") == 12) {
                        result.start.assign("hour", 0);
                    }
                }
                else {
                    result.start.imply("meridiem", 1);
                    if (result.start.get("hour") != 12) {
                        result.start.assign("hour", result.start.get("hour") + 12);
                    }
                }
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
            const zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
            const zhAMPM1 = zhAMPMString1[0];
            if (zhAMPM1 == "早") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM1 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
            const zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
            const zhAMPM2 = zhAMPMString2[0];
            if (zhAMPM2 == "上" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM2 == "下" || zhAMPM2 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
            const zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
            const zhAMPM3 = zhAMPMString3[0];
            if (zhAMPM3 == "上" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                meridiem = 0;
                if (hour == 12)
                    hour = 0;
            }
            else if (zhAMPM3 == "下" || zhAMPM3 == "晚") {
                meridiem = 1;
                if (hour != 12)
                    hour += 12;
            }
        }
        result.text = result.text + match[0];
        result.end.assign("hour", hour);
        result.end.assign("minute", minute);
        if (meridiem >= 0) {
            result.end.assign("meridiem", meridiem);
        }
        else {
            const startAtPM = result.start.isCertain("meridiem") && result.start.get("meridiem") == 1;
            if (startAtPM && result.start.get("hour") > hour) {
                result.end.imply("meridiem", 0);
            }
            else if (hour > 12) {
                result.end.imply("meridiem", 1);
            }
        }
        if (result.end.date().getTime() < result.start.date().getTime()) {
            result.end.imply("day", result.end.get("day") + 1);
        }
        return result;
    }
}
exports.default = ZHHansTimeExpressionParser;
//# sourceMappingURL=ZHHansTimeExpressionParser.js.map
});

var ZHHansWeekdayParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp("(?:星期|礼拜|周)(?<weekday>" + Object.keys(constants$2.WEEKDAY_OFFSET).join("|") + ")");
class ZHHansWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const dayOfWeek = match.groups.weekday;
        const offset = constants$2.WEEKDAY_OFFSET[dayOfWeek];
        if (offset === undefined)
            return null;
        let startMoment = dayjs_1.default(context.refDate);
        const refOffset = startMoment.day();
        if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
            startMoment = startMoment.day(offset - 7);
        }
        else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
            startMoment = startMoment.day(offset + 7);
        }
        else {
            startMoment = startMoment.day(offset);
        }
        result.start.assign("weekday", offset);
        {
            result.start.imply("day", startMoment.date());
            result.start.imply("month", startMoment.month() + 1);
            result.start.imply("year", startMoment.year());
        }
        return result;
    }
}
exports.default = ZHHansWeekdayParser;
//# sourceMappingURL=ZHHansWeekdayParser.js.map
});

var ZHHansMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class ZHHansMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(至|到|-|~|～|－|ー)\s*$/i;
    }
}
exports.default = ZHHansMergeDateRangeRefiner;
//# sourceMappingURL=ZHHansMergeDateRangeRefiner.js.map
});

var ZHHansMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1$1 = __importDefault(AbstractMergeDateTimeRefiner_1);
class ZHHansMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1$1.default {
    patternBetween() {
        return /^\s*$/i;
    }
}
exports.default = ZHHansMergeDateTimeRefiner;
//# sourceMappingURL=ZHHansMergeDateTimeRefiner.js.map
});

var hans = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.hans = void 0;

const ExtractTimezoneOffsetRefiner_1$1 = __importDefault(ExtractTimezoneOffsetRefiner_1);

const ZHHansCasualDateParser_1$1 = __importDefault(ZHHansCasualDateParser_1);
const ZHHansDateParser_1$1 = __importDefault(ZHHansDateParser_1);
const ZHHansDeadlineFormatParser_1$1 = __importDefault(ZHHansDeadlineFormatParser_1);
const ZHHansRelationWeekdayParser_1$1 = __importDefault(ZHHansRelationWeekdayParser_1);
const ZHHansTimeExpressionParser_1$1 = __importDefault(ZHHansTimeExpressionParser_1);
const ZHHansWeekdayParser_1$1 = __importDefault(ZHHansWeekdayParser_1);
const ZHHansMergeDateRangeRefiner_1$1 = __importDefault(ZHHansMergeDateRangeRefiner_1);
const ZHHansMergeDateTimeRefiner_1$1 = __importDefault(ZHHansMergeDateTimeRefiner_1);
exports.hans = new chrono$1.Chrono(createCasualConfiguration());
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration());
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration() {
    const option = createConfiguration();
    option.parsers.unshift(new ZHHansCasualDateParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration() {
    const configuration = configurations.includeCommonConfiguration({
        parsers: [
            new ZHHansDateParser_1$1.default(),
            new ZHHansRelationWeekdayParser_1$1.default(),
            new ZHHansWeekdayParser_1$1.default(),
            new ZHHansTimeExpressionParser_1$1.default(),
            new ZHHansDeadlineFormatParser_1$1.default(),
        ],
        refiners: [new ZHHansMergeDateRangeRefiner_1$1.default(), new ZHHansMergeDateTimeRefiner_1$1.default()],
    });
    configuration.refiners = configuration.refiners.filter((refiner) => !(refiner instanceof ExtractTimezoneOffsetRefiner_1$1.default));
    return configuration;
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var zh = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hans = void 0;
__exportStar(hant, exports);
exports.hans = __importStar(hans);
//# sourceMappingURL=index.js.map
});

var constants$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.FULL_MONTH_NAME_DICTIONARY = exports.WEEKDAY_DICTIONARY = exports.REGEX_PARTS = void 0;


exports.REGEX_PARTS = {
    leftBoundary: "([^\\p{L}\\p{N}_]|^)",
    rightBoundary: "(?=[^\\p{L}\\p{N}_]|$)",
    flags: "iu",
};
exports.WEEKDAY_DICTIONARY = {
    воскресенье: 0,
    воскресенья: 0,
    вск: 0,
    "вск.": 0,
    понедельник: 1,
    понедельника: 1,
    пн: 1,
    "пн.": 1,
    вторник: 2,
    вторника: 2,
    вт: 2,
    "вт.": 2,
    среда: 3,
    среды: 3,
    среду: 3,
    ср: 3,
    "ср.": 3,
    четверг: 4,
    четверга: 4,
    чт: 4,
    "чт.": 4,
    пятница: 5,
    пятницу: 5,
    пятницы: 5,
    пт: 5,
    "пт.": 5,
    суббота: 6,
    субботу: 6,
    субботы: 6,
    сб: 6,
    "сб.": 6,
};
exports.FULL_MONTH_NAME_DICTIONARY = {
    январь: 1,
    января: 1,
    январе: 1,
    февраль: 2,
    февраля: 2,
    феврале: 2,
    март: 3,
    марта: 3,
    марте: 3,
    апрель: 4,
    апреля: 4,
    апреле: 4,
    май: 5,
    мая: 5,
    мае: 5,
    июнь: 6,
    июня: 6,
    июне: 6,
    июль: 7,
    июля: 7,
    июле: 7,
    август: 8,
    августа: 8,
    августе: 8,
    сентябрь: 9,
    сентября: 9,
    сентябре: 9,
    октябрь: 10,
    октября: 10,
    октябре: 10,
    ноябрь: 11,
    ноября: 11,
    ноябре: 11,
    декабрь: 12,
    декабря: 12,
    декабре: 12,
};
exports.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports.FULL_MONTH_NAME_DICTIONARY), { янв: 1, "янв.": 1, фев: 2, "фев.": 2, мар: 3, "мар.": 3, апр: 4, "апр.": 4, авг: 8, "авг.": 8, сен: 9, "сен.": 9, окт: 10, "окт.": 10, ноя: 11, "ноя.": 11, дек: 12, "дек.": 12 });
exports.INTEGER_WORD_DICTIONARY = {
    один: 1,
    одна: 1,
    одной: 1,
    одну: 1,
    две: 2,
    два: 2,
    двух: 2,
    три: 3,
    трех: 3,
    трёх: 3,
    четыре: 4,
    четырех: 4,
    четырёх: 4,
    пять: 5,
    пяти: 5,
    шесть: 6,
    шести: 6,
    семь: 7,
    семи: 7,
    восемь: 8,
    восьми: 8,
    девять: 9,
    девяти: 9,
    десять: 10,
    десяти: 10,
    одиннадцать: 11,
    одиннадцати: 11,
    двенадцать: 12,
    двенадцати: 12,
};
exports.ORDINAL_WORD_DICTIONARY = {
    первое: 1,
    первого: 1,
    второе: 2,
    второго: 2,
    третье: 3,
    третьего: 3,
    четвертое: 4,
    четвертого: 4,
    пятое: 5,
    пятого: 5,
    шестое: 6,
    шестого: 6,
    седьмое: 7,
    седьмого: 7,
    восьмое: 8,
    восьмого: 8,
    девятое: 9,
    девятого: 9,
    десятое: 10,
    десятого: 10,
    одиннадцатое: 11,
    одиннадцатого: 11,
    двенадцатое: 12,
    двенадцатого: 12,
    тринадцатое: 13,
    тринадцатого: 13,
    четырнадцатое: 14,
    четырнадцатого: 14,
    пятнадцатое: 15,
    пятнадцатого: 15,
    шестнадцатое: 16,
    шестнадцатого: 16,
    семнадцатое: 17,
    семнадцатого: 17,
    восемнадцатое: 18,
    восемнадцатого: 18,
    девятнадцатое: 19,
    девятнадцатого: 19,
    двадцатое: 20,
    двадцатого: 20,
    "двадцать первое": 21,
    "двадцать первого": 21,
    "двадцать второе": 22,
    "двадцать второго": 22,
    "двадцать третье": 23,
    "двадцать третьего": 23,
    "двадцать четвертое": 24,
    "двадцать четвертого": 24,
    "двадцать пятое": 25,
    "двадцать пятого": 25,
    "двадцать шестое": 26,
    "двадцать шестого": 26,
    "двадцать седьмое": 27,
    "двадцать седьмого": 27,
    "двадцать восьмое": 28,
    "двадцать восьмого": 28,
    "двадцать девятое": 29,
    "двадцать девятого": 29,
    "тридцатое": 30,
    "тридцатого": 30,
    "тридцать первое": 31,
    "тридцать первого": 31,
};
exports.TIME_UNIT_DICTIONARY = {
    сек: "second",
    секунда: "second",
    секунд: "second",
    секунды: "second",
    секунду: "second",
    секундочка: "second",
    секундочки: "second",
    секундочек: "second",
    секундочку: "second",
    мин: "minute",
    минута: "minute",
    минут: "minute",
    минуты: "minute",
    минуту: "minute",
    минуток: "minute",
    минутки: "minute",
    минутку: "minute",
    час: "hour",
    часов: "hour",
    часа: "hour",
    часу: "hour",
    часиков: "hour",
    часика: "hour",
    часике: "hour",
    часик: "hour",
    день: "d",
    дня: "d",
    дней: "d",
    суток: "d",
    сутки: "d",
    неделя: "week",
    неделе: "week",
    недели: "week",
    неделю: "week",
    недель: "week",
    недельке: "week",
    недельки: "week",
    неделек: "week",
    месяц: "month",
    месяце: "month",
    месяцев: "month",
    месяца: "month",
    квартал: "quarter",
    квартале: "quarter",
    кварталов: "quarter",
    год: "year",
    года: "year",
    году: "year",
    годов: "year",
    лет: "year",
    годик: "year",
    годика: "year",
    годиков: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|пол|несколько|пар(?:ы|у)|\\s{0,3})`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    if (num.match(/несколько/)) {
        return 3;
    }
    else if (num.match(/пол/)) {
        return 0.5;
    }
    else if (num.match(/пар/)) {
        return 2;
    }
    else if (num === "") {
        return 1;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:го|ого|е|ое)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
        return exports.ORDINAL_WORD_DICTIONARY[num];
    }
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
const year = "(?:\\s+(?:году|года|год|г|г.))?";
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}${year}\\s*(?:н.э.|до н.э.|н. э.|до н. э.)|[1-2][0-9]{3}${year}|[5-9][0-9]${year})`;
function parseYear(match) {
    if (/(год|года|г|г.)/i.test(match)) {
        match = match.replace(/(год|года|г|г.)/i, "");
    }
    if (/(до н.э.|до н. э.)/i.test(match)) {
        match = match.replace(/(до н.э.|до н. э.)/i, "");
        return -parseInt(match);
    }
    if (/(н. э.|н.э.)/i.test(match)) {
        match = match.replace(/(н. э.|н.э.)/i, "");
        return parseInt(match);
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,3}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern(`(?:(?:около|примерно)\\s{0,3})?`, SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length).trim();
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
//# sourceMappingURL=constants.js.map
});

var RUTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = `(?:(?:около|примерно)\\s*(?:~\\s*)?)?(${constants$1.TIME_UNITS_PATTERN})${constants$1.REGEX_PARTS.rightBoundary}`;
const PATTERN_WITH_PREFIX = new RegExp(`(?:в течение|в течении)\\s*${PATTERN}`, constants$1.REGEX_PARTS.flags);
const PATTERN_WITHOUT_PREFIX = new RegExp(PATTERN, "i");
class RUTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    patternLeftBoundary() {
        return constants$1.REGEX_PARTS.leftBoundary;
    }
    innerPattern(context) {
        return context.option.forwardDate ? PATTERN_WITHOUT_PREFIX : PATTERN_WITH_PREFIX;
    }
    innerExtract(context, match) {
        const timeUnits = constants$1.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
exports.default = RUTimeUnitWithinFormatParser;
//# sourceMappingURL=RUTimeUnitWithinFormatParser.js.map
});

var RUMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$1;
const constants_3 = constants$1;


const PATTERN = new RegExp(`(?:с)?\\s*(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    `(?:` +
    `\\s{0,3}(?:по|-|–|до)?\\s{0,3}` +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    `)?` +
    `(?:-|\\/|\\s{0,3}(?:of)?\\s{0,3})` +
    `(${pattern.matchAnyPattern(constants$1.MONTH_DICTIONARY)})` +
    `(?:` +
    `(?:-|\\/|,?\\s{0,3})` +
    `(${constants_2.YEAR_PATTERN}(?![^\\s]\\d))` +
    `)?` +
    `${constants$1.REGEX_PARTS.rightBoundary}`, constants$1.REGEX_PARTS.flags);
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class RUMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    patternLeftBoundary() {
        return constants$1.REGEX_PARTS.leftBoundary;
    }
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = RUMonthNameLittleEndianParser;
//# sourceMappingURL=RUMonthNameLittleEndianParser.js.map
});

var RUMonthNameParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const constants_2 = constants$1;

const PATTERN = new RegExp(`((?:в)\\s*)?` +
    `(${pattern.matchAnyPattern(constants$1.MONTH_DICTIONARY)})` +
    `\\s*` +
    `(?:` +
    `[,-]?\\s*(${constants_2.YEAR_PATTERN})?` +
    `)?` +
    `(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`, constants$1.REGEX_PARTS.flags);
const MONTH_NAME_GROUP = 2;
const YEAR_GROUP = 3;
class RUMonthNameParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    patternLeftBoundary() {
        return constants$1.REGEX_PARTS.leftBoundary;
    }
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const monthName = match[MONTH_NAME_GROUP].toLowerCase();
        if (match[0].length <= 3 && !constants$1.FULL_MONTH_NAME_DICTIONARY[monthName]) {
            return null;
        }
        const result = context.createParsingResult(match.index, match.index + match[0].length);
        result.start.imply("day", 1);
        const month = constants$1.MONTH_DICTIONARY[monthName];
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
            const year = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, 1, month);
            result.start.imply("year", year);
        }
        return result;
    }
}
exports.default = RUMonthNameParser;
//# sourceMappingURL=RUMonthNameParser.js.map
});

var RUTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



class RUTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    constructor(strictMode) {
        super(strictMode);
    }
    patternFlags() {
        return constants$1.REGEX_PARTS.flags;
    }
    primaryPatternLeftBoundary() {
        return `(^|\\s|T|(?:[^\\p{L}\\p{N}_]))`;
    }
    followingPhase() {
        return `\\s*(?:\\-|\\–|\\~|\\〜|до|и|по|\\?)\\s*`;
    }
    primaryPrefix() {
        return `(?:(?:в|с)\\s*)??`;
    }
    primarySuffix() {
        return `(?:\\s*(?:утра|вечера|после полудня))?(?!\\/)${constants$1.REGEX_PARTS.rightBoundary}`;
    }
    extractPrimaryTimeComponents(context, match) {
        const components = super.extractPrimaryTimeComponents(context, match);
        if (components) {
            if (match[0].endsWith("вечера")) {
                const hour = components.get("hour");
                if (hour >= 6 && hour < 12) {
                    components.assign("hour", components.get("hour") + 12);
                    components.assign("meridiem", dist.Meridiem.PM);
                }
                else if (hour < 6) {
                    components.assign("meridiem", dist.Meridiem.AM);
                }
            }
            if (match[0].endsWith("после полудня")) {
                components.assign("meridiem", dist.Meridiem.PM);
                const hour = components.get("hour");
                if (hour >= 0 && hour <= 6) {
                    components.assign("hour", components.get("hour") + 12);
                }
            }
            if (match[0].endsWith("утра")) {
                components.assign("meridiem", dist.Meridiem.AM);
                const hour = components.get("hour");
                if (hour < 12) {
                    components.assign("hour", components.get("hour"));
                }
            }
        }
        return components;
    }
}
exports.default = RUTimeExpressionParser;
//# sourceMappingURL=RUTimeExpressionParser.js.map
});

var RUTimeUnitAgoFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp(`(${constants$1.TIME_UNITS_PATTERN})\\s{0,5}назад(?=(?:\\W|$))`, constants$1.REGEX_PARTS.flags);
class RUTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    patternLeftBoundary() {
        return constants$1.REGEX_PARTS.leftBoundary;
    }
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const timeUnits = constants$1.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits.reverseTimeUnits(timeUnits);
        return results.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
    }
}
exports.default = RUTimeUnitAgoFormatParser;
//# sourceMappingURL=RUTimeUnitAgoFormatParser.js.map
});

var RUMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class RUMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(и до|и по|до|по|-)\s*$/i;
    }
}
exports.default = RUMergeDateRangeRefiner;
//# sourceMappingURL=RUMergeDateRangeRefiner.js.map
});

var RUMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1$1 = __importDefault(AbstractMergeDateTimeRefiner_1);
class RUMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1$1.default {
    patternBetween() {
        return new RegExp(`^\\s*(T|в|,|-)?\\s*$`);
    }
}
exports.default = RUMergeDateTimeRefiner;
//# sourceMappingURL=RUMergeDateTimeRefiner.js.map
});

var RUCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const references = __importStar(casualReferences);

const PATTERN = new RegExp(`(?:с|со)?\\s*(сегодня|вчера|завтра|послезавтра|позавчера)${constants$1.REGEX_PARTS.rightBoundary}`, constants$1.REGEX_PARTS.flags);
class RUCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    patternLeftBoundary() {
        return constants$1.REGEX_PARTS.leftBoundary;
    }
    innerPattern(context) {
        return PATTERN;
    }
    innerExtract(context, match) {
        const lowerText = match[1].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "сегодня":
                return references.today(context.reference);
            case "вчера":
                return references.yesterday(context.reference);
            case "завтра":
                return references.tomorrow(context.reference);
            case "послезавтра":
                return references.theDayAfter(context.reference, 2);
            case "позавчера":
                return references.theDayBefore(context.reference, 2);
        }
        return component;
    }
}
exports.default = RUCasualDateParser;
//# sourceMappingURL=RUCasualDateParser.js.map
});

var RUCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const references = __importStar(casualReferences);

const dayjs_2 = __importDefault(dayjs_min);

const PATTERN = new RegExp(`(сейчас|прошлым\\s*вечером|прошлой\\s*ночью|следующей\\s*ночью|сегодня\\s*ночью|этой\\s*ночью|ночью|этим утром|утром|утра|в\\s*полдень|вечером|вечера|в\\s*полночь)` +
    `${constants$1.REGEX_PARTS.rightBoundary}`, constants$1.REGEX_PARTS.flags);
class RUCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    patternLeftBoundary() {
        return constants$1.REGEX_PARTS.leftBoundary;
    }
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_2.default(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        if (lowerText === "сейчас") {
            return references.now(context.reference);
        }
        if (lowerText === "вечером" || lowerText === "вечера") {
            return references.evening(context.reference);
        }
        if (lowerText.endsWith("утром") || lowerText.endsWith("утра")) {
            return references.morning(context.reference);
        }
        if (lowerText.match(/в\s*полдень/)) {
            return references.noon(context.reference);
        }
        if (lowerText.match(/прошлой\s*ночью/)) {
            return references.lastNight(context.reference);
        }
        if (lowerText.match(/прошлым\s*вечером/)) {
            return references.yesterdayEvening(context.reference);
        }
        if (lowerText.match(/следующей\s*ночью/)) {
            const daysToAdd = targetDate.hour() < 22 ? 1 : 2;
            targetDate = targetDate.add(daysToAdd, "day");
            dayjs.assignSimilarDate(component, targetDate);
            component.imply("hour", 0);
        }
        if (lowerText.match(/в\s*полночь/) || lowerText.endsWith("ночью")) {
            return references.midnight(context.reference);
        }
        return component;
    }
}
exports.default = RUCasualTimeParser;
//# sourceMappingURL=RUCasualTimeParser.js.map
});

var RUWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp(`(?:(?:,|\\(|（)\\s*)?` +
    `(?:в\\s*?)?` +
    `(?:(эту|этот|прошлый|прошлую|следующий|следующую|следующего)\\s*)?` +
    `(${pattern.matchAnyPattern(constants$1.WEEKDAY_DICTIONARY)})` +
    `(?:\\s*(?:,|\\)|）))?` +
    `(?:\\s*на\\s*(этой|прошлой|следующей)\\s*неделе)?` +
    `${constants$1.REGEX_PARTS.rightBoundary}`, constants$1.REGEX_PARTS.flags);
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class RUWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    patternLeftBoundary() {
        return constants$1.REGEX_PARTS.leftBoundary;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const weekday = constants$1.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord == "прошлый" || modifierWord == "прошлую" || modifierWord == "прошлой") {
            modifier = "last";
        }
        else if (modifierWord == "следующий" ||
            modifierWord == "следующую" ||
            modifierWord == "следующей" ||
            modifierWord == "следующего") {
            modifier = "next";
        }
        else if (modifierWord == "этот" || modifierWord == "эту" || modifierWord == "этой") {
            modifier = "this";
        }
        return weekdays.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    }
}
exports.default = RUWeekdayParser;
//# sourceMappingURL=RUWeekdayParser.js.map
});

var RURelativeDateFormatParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp(`(в прошлом|на прошлой|на следующей|в следующем|на этой|в этом)\\s*(${pattern.matchAnyPattern(constants$1.TIME_UNIT_DICTIONARY)})(?=\\s*)${constants$1.REGEX_PARTS.rightBoundary}`, constants$1.REGEX_PARTS.flags);
const MODIFIER_WORD_GROUP = 1;
const RELATIVE_WORD_GROUP = 2;
class RURelativeDateFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    patternLeftBoundary() {
        return constants$1.REGEX_PARTS.leftBoundary;
    }
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
        const timeunit = constants$1.TIME_UNIT_DICTIONARY[unitWord];
        if (modifier == "на следующей" || modifier == "в следующем") {
            const timeUnits = {};
            timeUnits[timeunit] = 1;
            return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }
        if (modifier == "в прошлом" || modifier == "на прошлой") {
            const timeUnits = {};
            timeUnits[timeunit] = -1;
            return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }
        const components = context.createParsingComponents();
        let date = dayjs_1.default(context.reference.instant);
        if (timeunit.match(/week/i)) {
            date = date.add(-date.get("d"), "d");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.imply("year", date.year());
        }
        else if (timeunit.match(/month/i)) {
            date = date.add(-date.date() + 1, "d");
            components.imply("day", date.date());
            components.assign("year", date.year());
            components.assign("month", date.month() + 1);
        }
        else if (timeunit.match(/year/i)) {
            date = date.add(-date.date() + 1, "d");
            date = date.add(-date.month(), "month");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.assign("year", date.year());
        }
        return components;
    }
}
exports.default = RURelativeDateFormatParser;
//# sourceMappingURL=RURelativeDateFormatParser.js.map
});

var RUTimeUnitCasualRelativeFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp(`(эти|последние|прошлые|следующие|после|спустя|через|\\+|-)\\s*(${constants$1.TIME_UNITS_PATTERN})${constants$1.REGEX_PARTS.rightBoundary}`, constants$1.REGEX_PARTS.flags);
class RUTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    patternLeftBoundary() {
        return constants$1.REGEX_PARTS.leftBoundary;
    }
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const prefix = match[1].toLowerCase();
        let timeUnits = constants$1.parseTimeUnits(match[2]);
        switch (prefix) {
            case "последние":
            case "прошлые":
            case "-":
                timeUnits = timeunits.reverseTimeUnits(timeUnits);
                break;
        }
        return results.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
exports.default = RUTimeUnitCasualRelativeFormatParser;
//# sourceMappingURL=RUTimeUnitCasualRelativeFormatParser.js.map
});

var ru = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
const RUTimeUnitWithinFormatParser_1$1 = __importDefault(RUTimeUnitWithinFormatParser_1);
const RUMonthNameLittleEndianParser_1$1 = __importDefault(RUMonthNameLittleEndianParser_1);
const RUMonthNameParser_1$1 = __importDefault(RUMonthNameParser_1);
const RUTimeExpressionParser_1$1 = __importDefault(RUTimeExpressionParser_1);
const RUTimeUnitAgoFormatParser_1$1 = __importDefault(RUTimeUnitAgoFormatParser_1);
const RUMergeDateRangeRefiner_1$1 = __importDefault(RUMergeDateRangeRefiner_1);
const RUMergeDateTimeRefiner_1$1 = __importDefault(RUMergeDateTimeRefiner_1);

const RUCasualDateParser_1$1 = __importDefault(RUCasualDateParser_1);
const RUCasualTimeParser_1$1 = __importDefault(RUCasualTimeParser_1);
const RUWeekdayParser_1$1 = __importDefault(RUWeekdayParser_1);
const RURelativeDateFormatParser_1$1 = __importDefault(RURelativeDateFormatParser_1);

const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const RUTimeUnitCasualRelativeFormatParser_1$1 = __importDefault(RUTimeUnitCasualRelativeFormatParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration() {
    const option = createConfiguration(false);
    option.parsers.unshift(new RUCasualDateParser_1$1.default());
    option.parsers.unshift(new RUCasualTimeParser_1$1.default());
    option.parsers.unshift(new RUMonthNameParser_1$1.default());
    option.parsers.unshift(new RURelativeDateFormatParser_1$1.default());
    option.parsers.unshift(new RUTimeUnitCasualRelativeFormatParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(true),
            new RUTimeUnitWithinFormatParser_1$1.default(),
            new RUMonthNameLittleEndianParser_1$1.default(),
            new RUWeekdayParser_1$1.default(),
            new RUTimeExpressionParser_1$1.default(strictMode),
            new RUTimeUnitAgoFormatParser_1$1.default(),
        ],
        refiners: [new RUMergeDateTimeRefiner_1$1.default(), new RUMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var constants = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYear = exports.YEAR_PATTERN = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
exports.WEEKDAY_DICTIONARY = {
    "domingo": 0,
    "dom": 0,
    "lunes": 1,
    "lun": 1,
    "martes": 2,
    "mar": 2,
    "miércoles": 3,
    "miercoles": 3,
    "mié": 3,
    "mie": 3,
    "jueves": 4,
    "jue": 4,
    "viernes": 5,
    "vie": 5,
    "sábado": 6,
    "sabado": 6,
    "sáb": 6,
    "sab": 6,
};
exports.MONTH_DICTIONARY = {
    "enero": 1,
    "ene": 1,
    "ene.": 1,
    "febrero": 2,
    "feb": 2,
    "feb.": 2,
    "marzo": 3,
    "mar": 3,
    "mar.": 3,
    "abril": 4,
    "abr": 4,
    "abr.": 4,
    "mayo": 5,
    "may": 5,
    "may.": 5,
    "junio": 6,
    "jun": 6,
    "jun.": 6,
    "julio": 7,
    "jul": 7,
    "jul.": 7,
    "agosto": 8,
    "ago": 8,
    "ago.": 8,
    "septiembre": 9,
    "setiembre": 9,
    "sep": 9,
    "sep.": 9,
    "octubre": 10,
    "oct": 10,
    "oct.": 10,
    "noviembre": 11,
    "nov": 11,
    "nov.": 11,
    "diciembre": 12,
    "dic": 12,
    "dic.": 12,
};
exports.YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
function parseYear(match) {
    if (match.match(/^[0-9]{1,4}$/)) {
        let yearNumber = parseInt(match);
        if (yearNumber < 100) {
            if (yearNumber > 50) {
                yearNumber = yearNumber + 1900;
            }
            else {
                yearNumber = yearNumber + 2000;
            }
        }
        return yearNumber;
    }
    if (match.match(/a\.?\s*c\.?/i)) {
        match = match.replace(/a\.?\s*c\.?/i, "");
        return -parseInt(match);
    }
    return parseInt(match);
}
exports.parseYear = parseYear;
//# sourceMappingURL=constants.js.map
});

var ESWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:(este|esta|pasado|pr[oó]ximo)\\s*)?" +
    `(${pattern.matchAnyPattern(constants.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(este|esta|pasado|pr[óo]ximo)\\s*semana)?" +
    "(?=\\W|\\d|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class ESWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const weekday = constants.WEEKDAY_DICTIONARY[dayOfWeek];
        if (weekday === undefined) {
            return null;
        }
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let norm = prefix || postfix || "";
        norm = norm.toLowerCase();
        let modifier = null;
        if (norm == "pasado") {
            modifier = "this";
        }
        else if (norm == "próximo" || norm == "proximo") {
            modifier = "next";
        }
        else if (norm == "este") {
            modifier = "this";
        }
        return weekdays.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    }
}
exports.default = ESWeekdayParser;
//# sourceMappingURL=ESWeekdayParser.js.map
});

var ESTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class ESTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:aslas|deslas|las?|al?|de|del)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|a(?:l)?|\\?)\\s*";
    }
}
exports.default = ESTimeExpressionParser;
//# sourceMappingURL=ESTimeExpressionParser.js.map
});

var ESMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1$1 = __importDefault(AbstractMergeDateTimeRefiner_1);
class ESMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1$1.default {
    patternBetween() {
        return new RegExp("^\\s*(?:,|de|aslas|a)?\\s*$");
    }
}
exports.default = ESMergeDateTimeRefiner;
//# sourceMappingURL=ESMergeDateTimeRefiner.js.map
});

var ESMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class ESMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(?:-)\s*$/i;
    }
}
exports.default = ESMergeDateRangeRefiner;
//# sourceMappingURL=ESMergeDateRangeRefiner.js.map
});

var ESMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants;


const PATTERN = new RegExp(`([0-9]{1,2})(?:º|ª|°)?` +
    "(?:\\s*(?:desde|de|\\-|\\–|ao?|\\s)\\s*([0-9]{1,2})(?:º|ª|°)?)?\\s*(?:de)?\\s*" +
    `(?:-|/|\\s*(?:de|,)?\\s*)` +
    `(${pattern.matchAnyPattern(constants.MONTH_DICTIONARY)})` +
    `(?:\\s*(?:de|,)?\\s*(${constants_2.YEAR_PATTERN}))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class ESMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = parseInt(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = parseInt(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = ESMonthNameLittleEndianParser;
//# sourceMappingURL=ESMonthNameLittleEndianParser.js.map
});

var ESCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const references = __importStar(casualReferences);
class ESCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(ahora|hoy|mañana|ayer)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "ahora":
                return references.now(context.reference);
            case "hoy":
                return references.today(context.reference);
            case "mañana":
                return references.tomorrow(context.reference);
            case "ayer":
                return references.yesterday(context.reference);
        }
        return component;
    }
}
exports.default = ESCasualDateParser;
//# sourceMappingURL=ESCasualDateParser.js.map
});

var ESCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });



const dayjs_2 = __importDefault(dayjs_min);
class ESCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return /(?:esta\s*)?(mañana|tarde|medianoche|mediodia|mediodía|noche)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_2.default(context.refDate);
        const component = context.createParsingComponents();
        switch (match[1].toLowerCase()) {
            case "tarde":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "noche":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 22);
                break;
            case "mañana":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "medianoche":
                dayjs.assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;
            case "mediodia":
            case "mediodía":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
        }
        return component;
    }
}
exports.default = ESCasualTimeParser;
//# sourceMappingURL=ESCasualTimeParser.js.map
});

var es = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const ESWeekdayParser_1$1 = __importDefault(ESWeekdayParser_1);
const ESTimeExpressionParser_1$1 = __importDefault(ESTimeExpressionParser_1);
const ESMergeDateTimeRefiner_1$1 = __importDefault(ESMergeDateTimeRefiner_1);
const ESMergeDateRangeRefiner_1$1 = __importDefault(ESMergeDateRangeRefiner_1);
const ESMonthNameLittleEndianParser_1$1 = __importDefault(ESMonthNameLittleEndianParser_1);
const ESCasualDateParser_1$1 = __importDefault(ESCasualDateParser_1);
const ESCasualTimeParser_1$1 = __importDefault(ESCasualTimeParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.push(new ESCasualDateParser_1$1.default());
    option.parsers.push(new ESCasualTimeParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new ESWeekdayParser_1$1.default(),
            new ESTimeExpressionParser_1$1.default(),
            new ESMonthNameLittleEndianParser_1$1.default(),
        ],
        refiners: [new ESMergeDateTimeRefiner_1$1.default(), new ESMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
//# sourceMappingURL=index.js.map
});

var dist = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.parse = exports.casual = exports.strict = exports.es = exports.ru = exports.zh = exports.nl = exports.pt = exports.ja = exports.fr = exports.de = exports.Weekday = exports.Meridiem = exports.Chrono = exports.en = void 0;
const en$1 = __importStar(en);
exports.en = en$1;

Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono$1.Chrono; } });
(function (Meridiem) {
    Meridiem[Meridiem["AM"] = 0] = "AM";
    Meridiem[Meridiem["PM"] = 1] = "PM";
})(exports.Meridiem || (exports.Meridiem = {}));
(function (Weekday) {
    Weekday[Weekday["SUNDAY"] = 0] = "SUNDAY";
    Weekday[Weekday["MONDAY"] = 1] = "MONDAY";
    Weekday[Weekday["TUESDAY"] = 2] = "TUESDAY";
    Weekday[Weekday["WEDNESDAY"] = 3] = "WEDNESDAY";
    Weekday[Weekday["THURSDAY"] = 4] = "THURSDAY";
    Weekday[Weekday["FRIDAY"] = 5] = "FRIDAY";
    Weekday[Weekday["SATURDAY"] = 6] = "SATURDAY";
})(exports.Weekday || (exports.Weekday = {}));
const de$1 = __importStar(de);
exports.de = de$1;
const fr$1 = __importStar(fr);
exports.fr = fr$1;
const ja$1 = __importStar(ja);
exports.ja = ja$1;
const pt$1 = __importStar(pt);
exports.pt = pt$1;
const nl$1 = __importStar(nl);
exports.nl = nl$1;
const zh$1 = __importStar(zh);
exports.zh = zh$1;
const ru$1 = __importStar(ru);
exports.ru = ru$1;
const es$1 = __importStar(es);
exports.es = es$1;
exports.strict = en$1.strict;
exports.casual = en$1.casual;
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
//# sourceMappingURL=index.js.map
});

const index = /*@__PURE__*/getDefaultExportFromCjs(dist);

const chrono = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.assign(/*#__PURE__*/Object.create(null), dist, {
    'default': index
}));

const supportedChronoLocales = ["en", "fr", "ru", "pt", "ja", "nl"];
const chronoParseDate = async (dateString, options) => {
  // Assign default values if no options object provided
  if (!options) {
    options = {
      referenceDate: removeTimezoneOffset(new Date()),
      useStrict: false,
      locale: "en",
      customExpressions: [],
      minDate: undefined,
      maxDate: undefined
    };
  }
  // Destructure options object
  let { referenceDate = removeTimezoneOffset(new Date()), useStrict = false, locale = "en", customExpressions = [], minDate = undefined, maxDate = undefined } = options;
  const chronoSupportedLocale = supportedChronoLocales.includes(locale);
  // Return if Chrono is not supported
  if (!chronoSupportedLocale) {
    if (isValidISODate(dateString))
      return { value: removeTimezoneOffset(new Date(dateString)) };
    else
      return null;
  }
  const custom = chrono[locale].casual.clone();
  customExpressions.forEach((expression) => custom.parsers.push({
    pattern: () => expression.pattern,
    extract: () => {
      return expression.match;
    }
  }));
  let parsedDate;
  if (useStrict)
    parsedDate = await chrono[locale].strict.parseDate(dateString, {
      instant: referenceDate,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }, {
      forwardDate: true
    });
  else {
    parsedDate = await custom.parseDate(dateString, {
      instant: referenceDate,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }, {
      forwardDate: true
    });
  }
  if (parsedDate instanceof Date) {
    if (dateIsWithinBounds(parsedDate, minDate, maxDate))
      return { value: parsedDate };
    else if (parsedDate instanceof Date &&
      !dateIsWithinLowerBounds(parsedDate, minDate)) {
      return { value: null, reason: "minDate" };
    }
    else if (parsedDate instanceof Date &&
      !dateIsWithinUpperBounds(parsedDate, maxDate)) {
      return { value: null, reason: "maxDate" };
    }
  }
  else
    return { value: null, reason: "invalid" };
};
const chronoParseRange = async (dateString, options) => {
  // Assign default values if no options object provided
  if (!options) {
    options = {
      referenceDate: removeTimezoneOffset(new Date()),
      useStrict: false,
      locale: "en",
      customExpressions: [],
      minDate: undefined,
      maxDate: undefined
    };
  }
  // Destructure options object
  let { referenceDate = removeTimezoneOffset(new Date()), useStrict = false, locale = "en", customExpressions = [], minDate = undefined, maxDate = undefined } = options;
  const chronoSupportedLocale = supportedChronoLocales.includes(locale);
  // Return if Chrono is not supported
  if (!chronoSupportedLocale) {
    const possibleDates = extractDates(dateString);
    possibleDates.filter((dateString) => isValidISODate(dateString));
    if (possibleDates.length > 0)
      return {
        value: {
          start: removeTimezoneOffset(new Date(possibleDates[0])),
          end: possibleDates[1]
            ? removeTimezoneOffset(new Date(possibleDates[1]))
            : undefined
        }
      };
    else
      return null;
  }
  const custom = chrono[locale].casual.clone();
  customExpressions.forEach((expression) => custom.parsers.push({
    pattern: () => expression.pattern,
    extract: () => {
      return expression.match;
    }
  }));
  let parsedRange;
  if (useStrict)
    parsedRange = await chrono[locale].strict.parse(dateString, {
      instant: referenceDate,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }, {
      forwardDate: true
    });
  else {
    parsedRange = custom.parse(dateString, {
      instant: referenceDate,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }, {
      forwardDate: true
    });
  }
  let startDate;
  let endDate;
  if (parsedRange.length > 0 &&
    parsedRange[0].start &&
    parsedRange[0].start.date() instanceof Date)
    startDate = parsedRange[0].start.date();
  if (parsedRange.length > 0 &&
    parsedRange[0].end &&
    parsedRange[0].end.date() instanceof Date)
    endDate = parsedRange[0].end.date();
  const returnValue = { value: { start: null, end: null } };
  if (startDate instanceof Date || endDate instanceof Date) {
    if (startDate && dateIsWithinBounds(startDate, minDate, maxDate))
      returnValue.value.start = startDate;
    if (endDate && dateIsWithinBounds(endDate, minDate, maxDate))
      returnValue.value.end = endDate;
    if (returnValue.value.start !== null || returnValue.value.end !== null)
      return returnValue;
    else
      return { value: null, reason: "rangeOutOfBounds" };
  }
  else
    return { value: null, reason: "invalid" };
};

const inclusiveDatesCss = ".visually-hidden.sc-inclusive-dates{position:absolute;overflow:hidden;width:1px;height:1px;white-space:nowrap;clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%)}";

const defaultLabels$1 = {
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
const InclusiveDates = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.selectDate = createEvent(this, "selectDate", 7);
    this.componentReady = createEvent(this, "componentReady", 7);
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
    this.inclusiveDatesLabels = defaultLabels$1;
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
      $319e236875307eab$export$a9b970dcc4ae71a9(`${Intl.DateTimeFormat(this.locale, {
        month: "long",
        year: "numeric"
      }).format(removeTimezoneOffset(new Date(`${newMonth.year}-${newMonth.month}`)))}`, "assertive");
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
    $319e236875307eab$export$a9b970dcc4ae71a9(contentNoCommas, "polite");
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
  get el() { return getElement(this); }
  static get watchers() { return {
    "hasError": ["watchHasError"],
    "locale": ["watchLocale"],
    "label": ["watchLabel"],
    "disabled": ["watchDisabled"],
    "range": ["watchRange"],
    "weekNumbers": ["watchWeekNumbers"],
    "minDate": ["watchMinDate"],
    "maxDate": ["watchMaxDate"],
    "value": ["watchValue"]
  }; }
};
InclusiveDates.style = inclusiveDatesCss;

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
const InclusiveDatesCalendar = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
  }
  watchMaxDate(newValue) {
    this.maxDate = newValue;
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
  get el() { return getElement(this); }
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
};
InclusiveDatesCalendar.style = inclusiveDatesCalendarCss;

/**
 * Traverses the slots of the open shadowroots and returns all children matching the query.
 * @param {ShadowRoot | HTMLElement} root
 * @param skipNode
 * @param isMatch
 * @param {number} maxDepth
 * @param {number} depth
 * @returns {HTMLElement[]}
 */
function queryShadowRoot(root, skipNode, isMatch, maxDepth = 20, depth = 0) {
    let matches = [];
    // If the depth is above the max depth, abort the searching here.
    if (depth >= maxDepth) {
        return matches;
    }
    // Traverses a slot element
    const traverseSlot = ($slot) => {
        // Only check nodes that are of the type Node.ELEMENT_NODE
        // Read more here https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        const assignedNodes = $slot.assignedNodes().filter(node => node.nodeType === 1);
        if (assignedNodes.length > 0) {
            return queryShadowRoot(assignedNodes[0].parentElement, skipNode, isMatch, maxDepth, depth + 1);
        }
        return [];
    };
    // Go through each child and continue the traversing if necessary
    // Even though the typing says that children can't be undefined, Edge 15 sometimes gives an undefined value.
    // Therefore we fallback to an empty array if it is undefined.
    const children = Array.from(root.children || []);
    for (const $child of children) {
        // Check if the node and its descendants should be skipped
        if (skipNode($child)) {
            continue;
        }
        // If the child matches we always add it
        if (isMatch($child)) {
            matches.push($child);
        }
        if ($child.shadowRoot != null) {
            matches.push(...queryShadowRoot($child.shadowRoot, skipNode, isMatch, maxDepth, depth + 1));
        }
        else if ($child.tagName === "SLOT") {
            matches.push(...traverseSlot($child));
        }
        else {
            matches.push(...queryShadowRoot($child, skipNode, isMatch, maxDepth, depth + 1));
        }
    }
    return matches;
}

/**
 * Returns whether the element is hidden.
 * @param $elem
 */
function isHidden($elem) {
    return $elem.hasAttribute("hidden")
        || ($elem.hasAttribute("aria-hidden") && $elem.getAttribute("aria-hidden") !== "false")
        // A quick and dirty way to check whether the element is hidden.
        // For a more fine-grained check we could use "window.getComputedStyle" but we don't because of bad performance.
        // If the element has visibility set to "hidden" or "collapse", display set to "none" or opacity set to "0" through CSS
        // we won't be able to catch it here. We accept it due to the huge performance benefits.
        || $elem.style.display === `none`
        || $elem.style.opacity === `0`
        || $elem.style.visibility === `hidden`
        || $elem.style.visibility === `collapse`;
    // If offsetParent is null we can assume that the element is hidden
    // https://stackoverflow.com/questions/306305/what-would-make-offsetparent-null
    //|| $elem.offsetParent == null;
}
/**
 * Returns whether the element is disabled.
 * @param $elem
 */
function isDisabled($elem) {
    return $elem.hasAttribute("disabled")
        || ($elem.hasAttribute("aria-disabled") && $elem.getAttribute("aria-disabled") !== "false");
}
/**
 * Determines whether an element is focusable.
 * Read more here: https://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus/1600194#1600194
 * Or here: https://stackoverflow.com/questions/18261595/how-to-check-if-a-dom-element-is-focusable
 * @param $elem
 */
function isFocusable($elem) {
    // Discard elements that are removed from the tab order.
    if ($elem.getAttribute("tabindex") === "-1" || isHidden($elem) || isDisabled($elem)) {
        return false;
    }
    return (
    // At this point we know that the element can have focus (eg. won't be -1) if the tabindex attribute exists
    $elem.hasAttribute("tabindex")
        // Anchor tags or area tags with a href set
        || ($elem instanceof HTMLAnchorElement || $elem instanceof HTMLAreaElement) && $elem.hasAttribute("href")
        // Form elements which are not disabled
        || ($elem instanceof HTMLButtonElement
            || $elem instanceof HTMLInputElement
            || $elem instanceof HTMLTextAreaElement
            || $elem instanceof HTMLSelectElement)
        // IFrames
        || $elem instanceof HTMLIFrameElement);
}

const timeouts = new Map();
/**
 * Debounces a callback.
 * @param cb
 * @param ms
 * @param id
 */
function debounce(cb, ms, id) {
    // Clear current timeout for id
    const timeout = timeouts.get(id);
    if (timeout != null) {
        window.clearTimeout(timeout);
    }
    // Set new timeout
    timeouts.set(id, window.setTimeout(() => {
        cb();
        timeouts.delete(id);
    }, ms));
}

/**
 * Template for the focus trap.
 */
const template = document.createElement("template");
template.innerHTML = `
	<div id="start"></div>
	<div id="backup"></div>
	<slot></slot>
	<div id="end"></div>
`;
/**
 * Focus trap web component.
 * @customElement focus-trap
 * @slot - Default content.
 */
class FocusTrap extends HTMLElement {
    /**
     * Attaches the shadow root.
     */
    constructor() {
        super();
        // The debounce id is used to distinguish this focus trap from others when debouncing
        this.debounceId = Math.random().toString();
        this._focused = false;
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));
        this.$backup = shadow.querySelector("#backup");
        this.$start = shadow.querySelector("#start");
        this.$end = shadow.querySelector("#end");
        this.focusLastElement = this.focusLastElement.bind(this);
        this.focusFirstElement = this.focusFirstElement.bind(this);
        this.onFocusIn = this.onFocusIn.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
    }
    // Whenever one of these attributes changes we need to render the template again.
    static get observedAttributes() {
        return [
            "inactive"
        ];
    }
    /**
     * Determines whether the focus trap is active or not.
     * @attr
     */
    get inactive() {
        return this.hasAttribute("inactive");
    }
    set inactive(value) {
        value ? this.setAttribute("inactive", "") : this.removeAttribute("inactive");
    }
    /**
     * Returns whether the element currently has focus.
     */
    get focused() {
        return this._focused;
    }
    /**
     * Hooks up the element.
     */
    connectedCallback() {
        this.$start.addEventListener("focus", this.focusLastElement);
        this.$end.addEventListener("focus", this.focusFirstElement);
        // Focus out is called every time the user tabs around inside the element
        this.addEventListener("focusin", this.onFocusIn);
        this.addEventListener("focusout", this.onFocusOut);
        this.render();
    }
    /**
     * Tears down the element.
     */
    disconnectedCallback() {
        this.$start.removeEventListener("focus", this.focusLastElement);
        this.$end.removeEventListener("focus", this.focusFirstElement);
        this.removeEventListener("focusin", this.onFocusIn);
        this.removeEventListener("focusout", this.onFocusOut);
    }
    /**
     * When the attributes changes we need to re-render the template.
     */
    attributeChangedCallback() {
        this.render();
    }
    /**
     * Focuses the first focusable element in the focus trap.
     */
    focusFirstElement() {
        this.trapFocus();
    }
    /**
     * Focuses the last focusable element in the focus trap.
     */
    focusLastElement() {
        this.trapFocus(true);
    }
    /**
     * Returns a list of the focusable children found within the element.
     */
    getFocusableElements() {
        return queryShadowRoot(this, isHidden, isFocusable);
    }
    /**
     * Focuses on either the last or first focusable element.
     * @param {boolean} trapToEnd
     */
    trapFocus(trapToEnd) {
        if (this.inactive)
            return;
        let focusableChildren = this.getFocusableElements();
        if (focusableChildren.length > 0) {
            if (trapToEnd) {
                focusableChildren[focusableChildren.length - 1].focus();
            }
            else {
                focusableChildren[0].focus();
            }
            this.$backup.setAttribute("tabindex", "-1");
        }
        else {
            // If there are no focusable children we need to focus on the backup
            // to trap the focus. This is a useful behavior if the focus trap is
            // for example used in a dialog and we don't want the user to tab
            // outside the dialog even though there are no focusable children
            // in the dialog.
            this.$backup.setAttribute("tabindex", "0");
            this.$backup.focus();
        }
    }
    /**
     * When the element gains focus this function is called.
     */
    onFocusIn() {
        this.updateFocused(true);
    }
    /**
     * When the element looses its focus this function is called.
     */
    onFocusOut() {
        this.updateFocused(false);
    }
    /**
     * Updates the focused property and updates the view.
     * The update is debounced because the focusin and focusout out
     * might fire multiple times in a row. We only want to render
     * the element once, therefore waiting until the focus is "stable".
     * @param value
     */
    updateFocused(value) {
        debounce(() => {
            if (this.focused !== value) {
                this._focused = value;
                this.render();
            }
        }, 0, this.debounceId);
    }
    /**
     * Updates the template.
     */
    render() {
        this.$start.setAttribute("tabindex", !this.focused || this.inactive ? `-1` : `0`);
        this.$end.setAttribute("tabindex", !this.focused || this.inactive ? `-1` : `0`);
        this.focused ? this.setAttribute("focused", "") : this.removeAttribute("focused");
    }
}
window.customElements.define("focus-trap", FocusTrap);

var getDefaultParent = function (originalTarget) {
    if (typeof document === 'undefined') {
        return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
};
var counterMap = new WeakMap();
var uncontrolledNodes = new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function (node) {
    return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function (parent, targets) {
    return targets.map(function (target) {
        if (parent.contains(target)) {
            return target;
        }
        var correctedTarget = unwrapHost(target);
        if (correctedTarget && parent.contains(correctedTarget)) {
            return correctedTarget;
        }
        console.error('aria-hidden', target, 'in not contained inside', parent, '. Doing nothing');
        return null;
    }).filter(function (x) { return Boolean(x); });
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @param {String} [controlAttribute] - html Attribute to control
 * @return {Undo} undo command
 */
var applyAttributeToOthers = function (originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
        markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var elementsToStop = new Set(targets);
    var keep = function (el) {
        if (!el || elementsToKeep.has(el)) {
            return;
        }
        elementsToKeep.add(el);
        keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function (parent) {
        if (!parent || elementsToStop.has(parent)) {
            return;
        }
        Array.prototype.forEach.call(parent.children, function (node) {
            if (elementsToKeep.has(node)) {
                deep(node);
            }
            else {
                var attr = node.getAttribute(controlAttribute);
                var alreadyHidden = attr !== null && attr !== 'false';
                var counterValue = (counterMap.get(node) || 0) + 1;
                var markerValue = (markerCounter.get(node) || 0) + 1;
                counterMap.set(node, counterValue);
                markerCounter.set(node, markerValue);
                hiddenNodes.push(node);
                if (counterValue === 1 && alreadyHidden) {
                    uncontrolledNodes.set(node, true);
                }
                if (markerValue === 1) {
                    node.setAttribute(markerName, 'true');
                }
                if (!alreadyHidden) {
                    node.setAttribute(controlAttribute, 'true');
                }
            }
        });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function () {
        hiddenNodes.forEach(function (node) {
            var counterValue = counterMap.get(node) - 1;
            var markerValue = markerCounter.get(node) - 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            if (!counterValue) {
                if (!uncontrolledNodes.has(node)) {
                    node.removeAttribute(controlAttribute);
                }
                uncontrolledNodes.delete(node);
            }
            if (!markerValue) {
                node.removeAttribute(markerName);
            }
        });
        lockCount--;
        if (!lockCount) {
            // clear
            counterMap = new WeakMap();
            counterMap = new WeakMap();
            uncontrolledNodes = new WeakMap();
            markerMap = {};
        }
    };
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @return {Undo} undo command
 */
var hideOthers = function (originalTarget, parentNode, markerName) {
    if (markerName === void 0) { markerName = 'data-aria-hidden'; }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function () { return null; };
    }
    // we should not hide ariaLive elements - https://github.com/theKashey/aria-hidden/issues/10
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll('[aria-live]')));
    return applyAttributeToOthers(targets, activeParentNode, markerName, 'aria-hidden');
};

const inclusiveDatesModalCss = ":host::part(body){position:absolute;width:-moz-fit-content;width:fit-content;z-index:1200;margin-top:0.5rem}:host::part(backdrop){}:host::part(content){}";

const InclusiveDatesModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.opened = createEvent(this, "opened", 7);
    this.closed = createEvent(this, "closed", 7);
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
};
InclusiveDatesModal.style = inclusiveDatesModalCss;

export { InclusiveDates as inclusive_dates, InclusiveDatesCalendar as inclusive_dates_calendar, InclusiveDatesModal as inclusive_dates_modal };
