/**
 * High-Precision Pure Calculation Engine for Multilingual Age & Date Calculator
 *
 * Rules & Guarantees:
 * - 100% pure client-side functions with zero side effects.
 * - Local midnight Date construction: `new Date(year, month - 1, day, 0, 0, 0, 0)` (never Date.parse).
 * - Exact calendar borrow arithmetic: if target day < birth day, borrow the length of the month
 *   BEFORE the target's month and decrement months; if months go negative, add 12 and decrement years.
 * - Feb 29 births: In non-leap years, birthday is treated as Feb 28 for age calculation.
 * - Total units (days, weeks, hours, minutes, seconds) are calculated via UTC day numbers to be DST-safe.
 * - Chinese Zodiac: Driven by authoritative Lunar New Year (LNY) dates 1900-2100.
 */

export interface DateParts {
  year: number;
  month: number; // 1 to 12
  day: number; // 1 to 31
}

export type DateInput = DateParts | Date;

export class DateValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DateValidationError';
  }
}

/**
 * Normalizes DateInput into a clean DateParts record.
 */
export function normalizeDateInput(input: DateInput): DateParts {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) {
      throw new DateValidationError('Invalid Date object provided');
    }
    return {
      year: input.getFullYear(),
      month: input.getMonth() + 1,
      day: input.getDate(),
    };
  }
  return {
    year: input.year,
    month: input.month,
    day: input.day,
  };
}

/**
 * Builds a Date instance at local midnight without timezone offset parsing bugs.
 */
export function createLocalDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Determines whether a year is a leap year in the Gregorian calendar.
 * Rule: Year divisible by 4, except century years unless divisible by 400.
 * Examples: 1900 (non-leap), 2000 (leap), 2024 (leap), 2100 (non-leap).
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the number of days in a given month and year.
 * Month is 1-indexed (1 = January, 12 = December).
 */
export function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    return 0;
  }
  // Passing 0 as day to Date returns the last day of previous month
  return new Date(year, month, 0).getDate();
}

/**
 * Validates year, month, and day constraints:
 * - Year between 1900 and 2100 (inclusive)
 * - Month between 1 and 12
 * - Day valid for the specific month & year (e.g., Feb 29 only in leap years, 30-day months)
 */
export function validateDate(year: number, month: number, day: number): void {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new DateValidationError(`Year ${year} is outside the supported range [1900 - 2100]`);
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new DateValidationError(`Month ${month} is invalid; must be between 1 and 12`);
  }
  const maxDays = daysInMonth(year, month);
  if (!Number.isInteger(day) || day < 1 || day > maxDays) {
    throw new DateValidationError(
      `Day ${day} is invalid for month ${month} in year ${year} (max days: ${maxDays})`
    );
  }
}

/**
 * Validates that birth date does not fall after target date.
 */
export function validateDateRange(birthInput: DateInput, targetInput: DateInput): void {
  const birth = normalizeDateInput(birthInput);
  const target = normalizeDateInput(targetInput);

  validateDate(birth.year, birth.month, birth.day);
  validateDate(target.year, target.month, target.day);

  const birthUtc = Date.UTC(birth.year, birth.month - 1, birth.day);
  const targetUtc = Date.UTC(target.year, target.month - 1, target.day);

  if (birthUtc > targetUtc) {
    throw new DateValidationError('Birth date cannot be after target date');
  }
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
}

/**
 * Calculates exact age in years, months, and days.
 *
 * Calendar Borrow Algorithm:
 * - If target day < birth day, borrow the length of the month BEFORE the target's month
 *   and decrement months. If months go negative, add 12 and decrement years.
 * - Feb 29 Birth Rule: In non-leap target years, Feb 29 birthdays are evaluated as Feb 28
 *   for age calculation (as documented in legal conventions).
 */
export function calculateAge(birthInput: DateInput, targetInput: DateInput): AgeResult {
  validateDateRange(birthInput, targetInput);

  const birth = normalizeDateInput(birthInput);
  const target = normalizeDateInput(targetInput);

  // Feb 29 birth rule: in non-leap target years, treated as Feb 28
  let effectiveBirthDay = birth.day;
  if (birth.month === 2 && birth.day === 29) {
    if (!isLeapYear(target.year)) {
      effectiveBirthDay = 28;
    }
  }

  let y = target.year - birth.year;
  let m = target.month - birth.month;
  let d = target.day - effectiveBirthDay;

  if (d < 0) {
    m -= 1;
    // Length of the month BEFORE target's month
    let prevM = target.month - 1;
    let prevY = target.year;
    if (prevM === 0) {
      prevM = 12;
      prevY -= 1;
    }
    const daysInPrev = daysInMonth(prevY, prevM);
    d += daysInPrev;

    // In case where previous month is shorter than the effective birth day
    // (e.g. born Jan 31, target in early March where February has only 28 days),
    // borrow one more month to maintain unbroken monotonically advancing day sequence.
    if (d < 0) {
      m -= 1;
      let prevPrevM = prevM - 1;
      let prevPrevY = prevY;
      if (prevPrevM === 0) {
        prevPrevM = 12;
        prevPrevY -= 1;
      }
      d += daysInMonth(prevPrevY, prevPrevM);
    }
  }

  if (m < 0) {
    m += 12;
    y -= 1;
  }

  return { years: y, months: m, days: d };
}

export interface AgeTotals {
  months: number;
  weeks: number;
  remainingDays: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates total elapsed time broken down into various units.
 * DST-safe: Calculates total calendar days using UTC midnight timestamps,
 * avoiding any 23-hour or 25-hour daylight saving shift anomalies.
 */
export function getTotals(birthInput: DateInput, targetInput: DateInput): AgeTotals {
  validateDateRange(birthInput, targetInput);

  const birth = normalizeDateInput(birthInput);
  const target = normalizeDateInput(targetInput);

  const birthUtc = Date.UTC(birth.year, birth.month - 1, birth.day);
  const targetUtc = Date.UTC(target.year, target.month - 1, target.day);

  const diffMs = targetUtc - birthUtc;
  const MS_PER_DAY = 86_400_000;
  const totalDays = Math.round(diffMs / MS_PER_DAY);

  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  const age = calculateAge(birth, target);
  const totalMonths = age.years * 12 + age.months;

  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  return {
    months: totalMonths,
    weeks: totalWeeks,
    remainingDays,
    days: totalDays,
    hours: totalHours,
    minutes: totalMinutes,
    seconds: totalSeconds,
  };
}

export interface NextBirthdayResult {
  nextBirthday: Date;
  isToday: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
}

/**
 * Calculates the next upcoming birthday and remaining countdown.
 * For Feb 29 births: In non-leap years, falls on Feb 28; in leap years, on Feb 29.
 */
export function getNextBirthday(birthInput: DateInput, fromDateInput?: DateInput): NextBirthdayResult {
  const birth = normalizeDateInput(birthInput);
  validateDate(birth.year, birth.month, birth.day);

  let fromDate: Date;
  if (!fromDateInput) {
    fromDate = new Date();
  } else if (fromDateInput instanceof Date) {
    fromDate = fromDateInput;
  } else {
    fromDate = createLocalDate(fromDateInput.year, fromDateInput.month, fromDateInput.day);
  }

  const currentYear = fromDate.getFullYear();

  function getBdayForYear(year: number): Date {
    let day = birth.day;
    if (birth.month === 2 && birth.day === 29) {
      day = isLeapYear(year) ? 29 : 28;
    }
    return createLocalDate(year, birth.month, day);
  }

  const thisYearBday = getBdayForYear(currentYear);
  const isToday =
    fromDate.getMonth() === thisYearBday.getMonth() &&
    fromDate.getDate() === thisYearBday.getDate();

  // If fromDate is on or after the end of today's birthday midnight + 1 day
  // (or fromDate is already past this year's birthday midnight):
  let nextBirthday: Date;
  const endOfThisYearBday = new Date(thisYearBday.getTime() + 86_400_000 - 1);

  if (fromDate > endOfThisYearBday) {
    nextBirthday = getBdayForYear(currentYear + 1);
  } else {
    nextBirthday = thisYearBday;
  }

  const diffMs = Math.max(0, nextBirthday.getTime() - fromDate.getTime());
  const daysRemaining = Math.floor(diffMs / 86_400_000);
  const hoursRemaining = Math.floor((diffMs % 86_400_000) / 3_600_000);
  const minutesRemaining = Math.floor((diffMs % 3_600_000) / 60_000);
  const secondsRemaining = Math.floor((diffMs % 60_000) / 1000);

  return {
    nextBirthday,
    isToday,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
  };
}

export interface Milestone {
  id: string;
  name: string;
  targetDate: Date;
  description: string;
}

/**
 * Computes major lifetime milestones:
 * - 10,000 days
 * - 15,000 days
 * - 20,000 days
 * - 1 billion seconds (~31.7 years)
 * - Half-birthday (6 months after birth)
 * - 18, 21, 50, and 65 years
 */
export function getMilestones(birthInput: DateInput): Milestone[] {
  const birth = normalizeDateInput(birthInput);
  validateDate(birth.year, birth.month, birth.day);

  const birthUtc = Date.UTC(birth.year, birth.month - 1, birth.day);
  const MS_PER_DAY = 86_400_000;

  function dateFromDays(days: number): Date {
    return new Date(birthUtc + days * MS_PER_DAY);
  }

  function dateFromSeconds(seconds: number): Date {
    return new Date(birthUtc + seconds * 1000);
  }

  function yearMilestone(years: number, id: string, name: string): Milestone {
    const targetYear = birth.year + years;
    let day = birth.day;
    if (birth.month === 2 && birth.day === 29 && !isLeapYear(targetYear)) {
      day = 28;
    }
    return {
      id,
      name,
      targetDate: createLocalDate(targetYear, birth.month, day),
      description: `Turns ${years} years old`,
    };
  }

  // Half-birthday calculation: 6 calendar months after birth
  let halfMonth = birth.month + 6;
  let halfYear = birth.year;
  if (halfMonth > 12) {
    halfMonth -= 12;
    halfYear += 1;
  }
  const maxHalfDays = daysInMonth(halfYear, halfMonth);
  const halfDay = Math.min(birth.day, maxHalfDays);

  return [
    {
      id: 'half-birthday',
      name: 'Half-Birthday',
      targetDate: createLocalDate(halfYear, halfMonth, halfDay),
      description: '6 months after birth date',
    },
    {
      id: '10000-days',
      name: '10,000 Days',
      targetDate: dateFromDays(10_000),
      description: 'Exactly 10,000 days lived on Earth',
    },
    {
      id: '1-billion-seconds',
      name: '1 Billion Seconds',
      targetDate: dateFromSeconds(1_000_000_000),
      description: '1,000,000,000 seconds of life (~31.7 years)',
    },
    {
      id: '15000-days',
      name: '15,000 Days',
      targetDate: dateFromDays(15_000),
      description: '15,000 days milestone (~41 years)',
    },
    {
      id: '20000-days',
      name: '20,000 Days',
      targetDate: dateFromDays(20_000),
      description: '20,000 days milestone (~54.7 years)',
    },
    yearMilestone(18, '18-years', '18th Birthday (Adulthood)'),
    yearMilestone(21, '21-years', '21st Birthday (Full Legal Age)'),
    yearMilestone(50, '50-years', '50th Birthday (Golden Jubilee)'),
    yearMilestone(65, '65-years', '65th Birthday (Senior Age)'),
  ];
}

export interface WeekdayResult {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  isoDayOfWeek: number; // 1 = Monday, 7 = Sunday
  name: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
}

/**
 * Returns the day of the week a person was born.
 */
export function getWeekdayBorn(birthInput: DateInput): WeekdayResult {
  const birth = normalizeDateInput(birthInput);
  validateDate(birth.year, birth.month, birth.day);

  const date = createLocalDate(birth.year, birth.month, birth.day);
  const dayOfWeek = date.getDay();
  const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  const names: WeekdayResult['name'][] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return {
    dayOfWeek,
    isoDayOfWeek,
    name: names[dayOfWeek],
  };
}

export interface WesternZodiacResult {
  sign: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
}

/**
 * Returns Western Zodiac sign, element, and modality.
 */
export function getWesternZodiac(birthInput: DateInput): WesternZodiacResult {
  const birth = normalizeDateInput(birthInput);
  validateDate(birth.year, birth.month, birth.day);

  const { month, day } = birth;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { sign: 'Aries', symbol: '', element: 'Fire', modality: 'Cardinal' };
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { sign: 'Taurus', symbol: '', element: 'Earth', modality: 'Fixed' };
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { sign: 'Gemini', symbol: '', element: 'Air', modality: 'Mutable' };
  }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { sign: 'Cancer', symbol: '', element: 'Water', modality: 'Cardinal' };
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { sign: 'Leo', symbol: '', element: 'Fire', modality: 'Fixed' };
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { sign: 'Virgo', symbol: '', element: 'Earth', modality: 'Mutable' };
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { sign: 'Libra', symbol: '', element: 'Air', modality: 'Cardinal' };
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { sign: 'Scorpio', symbol: '', element: 'Water', modality: 'Fixed' };
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { sign: 'Sagittarius', symbol: '', element: 'Fire', modality: 'Mutable' };
  }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { sign: 'Capricorn', symbol: '', element: 'Earth', modality: 'Cardinal' };
  }
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { sign: 'Aquarius', symbol: '', element: 'Air', modality: 'Fixed' };
  }
  return { sign: 'Pisces', symbol: '', element: 'Water', modality: 'Mutable' };
}

/**
 * Chinese Lunar New Year Gregorian Dates Table (1900 - 2100).
 *
 * Source Citation:
 * Astronomical conversion table compiled from astronomical observations and published by:
 * 1. Hong Kong Observatory (HKO) Gregorian-Lunar Calendar Conversion Tables (1901-2100).
 * 2. Purple Mountain Observatory, Chinese Academy of Sciences (standard national calendar ephemeris).
 * 3. Astronomical Applications Department of the U.S. Naval Observatory (USNO).
 * Format: [Gregorian Month, Gregorian Day] for Lunar New Year (1st Day of 1st Lunar Month).
 */
export const LUNAR_NEW_YEAR_TABLE: Record<number, [number, number]> = {
  1900: [1, 31], 1901: [2, 19], 1902: [2, 8],  1903: [1, 29], 1904: [2, 16],
  1905: [2, 4],  1906: [1, 25], 1907: [2, 13], 1908: [2, 2],  1909: [1, 22],
  1910: [2, 10], 1911: [1, 30], 1912: [2, 18], 1913: [2, 6],  1914: [1, 26],
  1915: [2, 14], 1916: [2, 3],  1917: [1, 23], 1918: [2, 11], 1919: [2, 1],
  1920: [2, 20], 1921: [2, 8],  1922: [1, 28], 1923: [2, 16], 1924: [2, 5],
  1925: [1, 24], 1926: [2, 13], 1927: [2, 2],  1928: [1, 23], 1929: [2, 10],
  1930: [1, 30], 1931: [2, 17], 1932: [2, 6],  1933: [1, 26], 1934: [2, 14],
  1935: [2, 4],  1936: [1, 24], 1937: [2, 11], 1938: [1, 31], 1939: [2, 19],
  1940: [2, 8],  1941: [1, 27], 1942: [2, 15], 1943: [2, 5],  1944: [1, 25],
  1945: [2, 13], 1946: [2, 2],  1947: [1, 22], 1948: [2, 10], 1949: [1, 29],
  1950: [2, 17], 1951: [2, 6],  1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
  1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
  1960: [1, 28], 1961: [2, 15], 1962: [2, 5],  1963: [1, 25], 1964: [2, 13],
  1965: [2, 2],  1966: [1, 21], 1967: [2, 9],  1968: [1, 30], 1969: [2, 17],
  1970: [2, 6],  1971: [1, 27], 1972: [2, 15], 1973: [2, 3],  1974: [1, 23],
  1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7],  1979: [1, 28],
  1980: [2, 16], 1981: [2, 5],  1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
  1985: [2, 20], 1986: [2, 9],  1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
  1990: [1, 27], 1991: [2, 15], 1992: [2, 4],  1993: [1, 23], 1994: [2, 10],
  1995: [1, 31], 1996: [2, 19], 1997: [2, 7],  1998: [1, 28], 1999: [2, 16],
  2000: [2, 5],  2001: [1, 24], 2002: [2, 12], 2003: [2, 1],  2004: [1, 22],
  2005: [2, 9],  2006: [1, 29], 2007: [2, 18], 2008: [2, 7],  2009: [1, 26],
  2010: [2, 14], 2011: [2, 3],  2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
  2015: [2, 19], 2016: [2, 8],  2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
  2020: [1, 25], 2021: [2, 12], 2022: [2, 1],  2023: [1, 22], 2024: [2, 10],
  2025: [1, 29], 2026: [2, 17], 2027: [2, 6],  2028: [1, 26], 2029: [2, 13],
  2030: [2, 3],  2031: [1, 23], 2032: [2, 11], 2033: [1, 31], 2034: [2, 19],
  2035: [2, 8],  2036: [1, 28], 2037: [2, 15], 2038: [2, 4],  2039: [1, 24],
  2040: [2, 12], 2041: [2, 1],  2042: [1, 22], 2043: [2, 10], 2044: [1, 30],
  2045: [2, 17], 2046: [2, 6],  2047: [1, 26], 2048: [2, 14], 2049: [2, 2],
  2050: [1, 23], 2051: [2, 11], 2052: [2, 1],  2053: [2, 19], 2054: [2, 8],
  2055: [1, 28], 2056: [2, 15], 2057: [2, 4],  2058: [1, 24], 2059: [2, 12],
  2060: [2, 2],  2061: [1, 21], 2062: [2, 9],  2063: [1, 29], 2064: [2, 17],
  2065: [2, 5],  2066: [1, 26], 2067: [2, 14], 2068: [2, 3],  2069: [1, 23],
  2070: [2, 11], 2071: [1, 31], 2072: [2, 19], 2073: [2, 7],  2074: [1, 27],
  2075: [2, 15], 2076: [2, 5],  2077: [1, 24], 2078: [2, 12], 2079: [2, 2],
  2080: [1, 22], 2081: [2, 9],  2082: [1, 29], 2083: [2, 17], 2084: [2, 6],
  2085: [1, 26], 2086: [2, 14], 2087: [2, 3],  2088: [1, 24], 2089: [2, 10],
  2090: [1, 30], 2091: [2, 18], 2092: [2, 7],  2093: [1, 27], 2094: [2, 15],
  2095: [2, 5],  2096: [1, 25], 2097: [2, 12], 2098: [2, 1],  2099: [1, 21],
  2100: [2, 9],
};

export interface ChineseZodiacResult {
  animal: string;
  element: string;
  heavenlyStem: string;
  earthlyBranch: string;
  lunarYear: number;
}

/**
 * Returns Chinese Zodiac animal, element, and stems based on actual Lunar New Year date.
 */
export function getChineseZodiac(birthInput: DateInput): ChineseZodiacResult {
  const birth = normalizeDateInput(birthInput);
  validateDate(birth.year, birth.month, birth.day);

  const lnyDate = LUNAR_NEW_YEAR_TABLE[birth.year];
  let lunarYear = birth.year;

  if (lnyDate) {
    const [lnyMonth, lnyDay] = lnyDate;
    if (birth.month < lnyMonth || (birth.month === lnyMonth && birth.day < lnyDay)) {
      lunarYear = birth.year - 1;
    }
  }

  const animals = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
  ];

  // Year 1900 LNY is Rat: (1900 - 4) % 12 = 0 -> Rat
  const animalIndex = ((lunarYear - 4) % 12 + 12) % 12;

  // 10 Heavenly Stems and 5 Elements
  // (lunarYear - 4) % 10:
  // 0: Wood (Yang), 1: Wood (Yin), 2: Fire (Yang), 3: Fire (Yin)
  // 4: Earth (Yang), 5: Earth (Yin), 6: Metal (Yang), 7: Metal (Yin), 8: Water (Yang), 9: Water (Yin)
  const stemIndex = ((lunarYear - 4) % 10 + 10) % 10;
  const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  const stems = [
    'Yang Wood (Jia)', 'Yin Wood (Yi)',
    'Yang Fire (Bing)', 'Yin Fire (Ding)',
    'Yang Earth (Wu)', 'Yin Earth (Ji)',
    'Yang Metal (Geng)', 'Yin Metal (Xin)',
    'Yang Water (Ren)', 'Yin Water (Gui)',
  ];

  const earthlyBranches = [
    'Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si',
    'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai',
  ];

  return {
    animal: animals[animalIndex],
    element: elements[stemIndex],
    heavenlyStem: stems[stemIndex],
    earthlyBranch: earthlyBranches[animalIndex],
    lunarYear,
  };
}

export interface EstimatedVitalStats {
  label: 'rough estimate';
  minBpm: number;
  maxBpm: number;
  minTotal: number;
  maxTotal: number;
  average: number;
}

/**
 * Estimates total lifetime heartbeats based on elapsed minutes (~70-80 bpm).
 * Labelled explicitly as "rough estimate".
 */
export function estimatedHeartbeats(totalMinutes: number): EstimatedVitalStats {
  const minBpm = 70;
  const maxBpm = 80;
  return {
    label: 'rough estimate',
    minBpm,
    maxBpm,
    minTotal: totalMinutes * minBpm,
    maxTotal: totalMinutes * maxBpm,
    average: totalMinutes * 75,
  };
}

/**
 * Estimates total lifetime breaths based on elapsed minutes (~12-20 breaths/min).
 * Labelled explicitly as "rough estimate".
 */
export function estimatedBreaths(totalMinutes: number): EstimatedVitalStats {
  const minBpm = 12;
  const maxBpm = 20;
  return {
    label: 'rough estimate',
    minBpm,
    maxBpm,
    minTotal: totalMinutes * minBpm,
    maxTotal: totalMinutes * maxBpm,
    average: totalMinutes * 16,
  };
}

