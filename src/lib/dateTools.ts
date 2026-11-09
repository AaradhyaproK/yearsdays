import {
  daysInMonth,
  isLeapYear,
  validateDate,
  type DateParts,
  type AgeResult,
  calculateAge,
} from './age';

export interface DaysBetweenResult {
  days: number;
  daysInclusive: number;
  weeks: number;
  remainingDays: number;
  businessDays: number;
  weekendDays: number;
  hours: number;
  minutes: number;
  seconds: number;
  calendarDifference: AgeResult;
  isNegative: boolean;
}

/**
 * Calculates exact calendar duration and total days between any two dates.
 * DST-safe via UTC day numbers.
 */
export function calculateDaysBetween(start: DateParts, end: DateParts): DaysBetweenResult {
  validateDate(start.year, start.month, start.day);
  validateDate(end.year, end.month, end.day);

  const startUtc = Date.UTC(start.year, start.month - 1, start.day);
  const endUtc = Date.UTC(end.year, end.month - 1, end.day);

  const isNegative = startUtc > endUtc;
  const diffMs = Math.abs(endUtc - startUtc);
  const days = Math.round(diffMs / 86_400_000);
  const daysInclusive = days + 1;
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;

  let businessDays = 0;
  let weekendDays = 0;
  const minUtc = Math.min(startUtc, endUtc);
  const maxUtc = Math.max(startUtc, endUtc);

  // Fast day-by-day iteration over the interval to count weekdays vs weekends
  for (let t = minUtc; t < maxUtc; t += 86_400_000) {
    const dayOfWeek = new Date(t).getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
  }

  const hours = days * 24;
  const minutes = hours * 60;
  const seconds = minutes * 60;

  const calendarDifference = isNegative
    ? calculateAge(end, start)
    : calculateAge(start, end);

  return {
    days,
    daysInclusive,
    weeks,
    remainingDays,
    businessDays,
    weekendDays,
    hours,
    minutes,
    seconds,
    calendarDifference,
    isNegative,
  };
}

export interface DaysAliveResult {
  daysAlive: number;
  hoursAlive: number;
  minutesAlive: number;
  nextDayMilestone: {
    targetDays: number;
    targetDate: Date;
    daysRemaining: number;
  };
}

/**
 * Calculates days alive and next major day milestone (e.g., next 1,000 or 10,000 days).
 */
export function calculateDaysAlive(birth: DateParts, target?: DateParts): DaysAliveResult {
  validateDate(birth.year, birth.month, birth.day);

  const now = target || {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  validateDate(now.year, now.month, now.day);

  const birthUtc = Date.UTC(birth.year, birth.month - 1, birth.day);
  const nowUtc = Date.UTC(now.year, now.month - 1, now.day);

  const daysAlive = Math.max(0, Math.round((nowUtc - birthUtc) / 86_400_000));
  const hoursAlive = daysAlive * 24;
  const minutesAlive = hoursAlive * 60;

  // Determine next significant day milestone (multiples of 5,000 or 10,000)
  const milestoneStep = daysAlive < 10_000 ? 10_000 : 5_000;
  const targetDays = Math.ceil((daysAlive + 1) / milestoneStep) * milestoneStep;
  const daysRemaining = targetDays - daysAlive;
  const targetDate = new Date(birthUtc + targetDays * 86_400_000);

  return {
    daysAlive,
    hoursAlive,
    minutesAlive,
    nextDayMilestone: {
      targetDays,
      targetDate,
      daysRemaining,
    },
  };
}

export type TimeUnit = 'days' | 'weeks' | 'months' | 'years';
export type DateOperation = 'add' | 'subtract';

/**
 * Adds or subtracts days, weeks, months, or years to a start date.
 * Handles month-end overflow cleanly (e.g. Jan 31 + 1 month = Feb 28 or Feb 29).
 */
export function addSubtractDate(
  start: DateParts,
  amount: number,
  unit: TimeUnit,
  operation: DateOperation
): DateParts {
  validateDate(start.year, start.month, start.day);
  const factor = operation === 'add' ? 1 : -1;
  const delta = amount * factor;

  if (unit === 'days' || unit === 'weeks') {
    const daysToAdd = unit === 'weeks' ? delta * 7 : delta;
    const currentUtc = Date.UTC(start.year, start.month - 1, start.day);
    const targetDate = new Date(currentUtc + daysToAdd * 86_400_000);
    return {
      year: targetDate.getUTCFullYear(),
      month: targetDate.getUTCMonth() + 1,
      day: targetDate.getUTCDate(),
    };
  }

  if (unit === 'months') {
    let newYear = start.year;
    let newMonth = start.month + delta;

    while (newMonth > 12) {
      newMonth -= 12;
      newYear += 1;
    }
    while (newMonth < 1) {
      newMonth += 12;
      newYear -= 1;
    }

    const maxDays = daysInMonth(newYear, newMonth);
    const newDay = Math.min(start.day, maxDays);

    return {
      year: newYear,
      month: newMonth,
      day: newDay,
    };
  }

  // unit === 'years'
  const newYear = start.year + delta;
  let newDay = start.day;
  if (start.month === 2 && start.day === 29 && !isLeapYear(newYear)) {
    newDay = 28;
  }

  return {
    year: newYear,
    month: start.month,
    day: newDay,
  };
}

export interface BirthdayCountdownDetails {
  nextBirthday: Date;
  isToday: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  upcomingDaysOfWeek: { year: number; dayName: string }[];
}

/**
 * Computes live countdown to next birthday and the weekday of the next 5 birthdays.
 */
export function getBirthdayCountdownDetails(
  birth: { month: number; day: number },
  fromDate: Date = new Date()
): BirthdayCountdownDetails {
  const currentYear = fromDate.getFullYear();

  function getBdayDate(year: number): Date {
    let day = birth.day;
    if (birth.month === 2 && birth.day === 29 && !isLeapYear(year)) {
      day = 28;
    }
    return new Date(year, birth.month - 1, day, 0, 0, 0, 0);
  }

  const thisYearBday = getBdayDate(currentYear);
  const isToday =
    fromDate.getMonth() === thisYearBday.getMonth() &&
    fromDate.getDate() === thisYearBday.getDate();

  let nextBday: Date;
  const endOfTodayBday = new Date(thisYearBday.getTime() + 86_400_000 - 1);
  const startYearForList = fromDate > endOfTodayBday ? currentYear + 1 : currentYear;

  if (fromDate > endOfTodayBday) {
    nextBday = getBdayDate(currentYear + 1);
  } else {
    nextBday = thisYearBday;
  }

  const diffMs = Math.max(0, nextBday.getTime() - fromDate.getTime());
  const daysRemaining = Math.floor(diffMs / 86_400_000);
  const hoursRemaining = Math.floor((diffMs % 86_400_000) / 3_600_000);
  const minutesRemaining = Math.floor((diffMs % 3_600_000) / 60_000);
  const secondsRemaining = Math.floor((diffMs % 60_000) / 1000);

  const weekdayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];

  const upcomingDaysOfWeek: { year: number; dayName: string }[] = [];
  for (let i = 0; i < 5; i++) {
    const yr = startYearForList + i;
    const d = getBdayDate(yr);
    upcomingDaysOfWeek.push({
      year: yr,
      dayName: weekdayNames[d.getDay()],
    });
  }

  return {
    nextBirthday: nextBday,
    isToday,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
    upcomingDaysOfWeek,
  };
}

export interface HalfBirthdayResult {
  halfMonth: number;
  halfDay: number;
  nextHalfBirthday: Date;
  daysRemaining: number;
}

/**
 * Calculates half-birthday (exactly 6 calendar months from birthday).
 */
export function calculateHalfBirthday(birth: DateParts, fromDate: Date = new Date()): HalfBirthdayResult {
  validateDate(birth.year, birth.month, birth.day);

  let halfMonth = birth.month + 6;
  if (halfMonth > 12) {
    halfMonth -= 12;
  }

  const currentYear = fromDate.getFullYear();
  const maxDaysThisYear = daysInMonth(currentYear, halfMonth);
  const halfDay = Math.min(birth.day, maxDaysThisYear);

  let nextDate = new Date(currentYear, halfMonth - 1, halfDay, 0, 0, 0, 0);
  if (fromDate > nextDate) {
    const maxDaysNextYear = daysInMonth(currentYear + 1, halfMonth);
    const halfDayNext = Math.min(birth.day, maxDaysNextYear);
    nextDate = new Date(currentYear + 1, halfMonth - 1, halfDayNext, 0, 0, 0, 0);
  }

  const diffMs = Math.max(0, nextDate.getTime() - fromDate.getTime());
  const daysRemaining = Math.floor(diffMs / 86_400_000);

  return {
    halfMonth,
    halfDay,
    nextHalfBirthday: nextDate,
    daysRemaining,
  };
}

export type DogSize = 'small' | 'medium' | 'large' | 'giant';

export interface PetAgeResult {
  humanYears: number;
  lifeStage: 'Puppy/Kitten' | 'Junior' | 'Adult' | 'Senior' | 'Geriatric';
  guidelinesSource: string;
}

/**
 * Calculates pet age in human equivalent years using veterinary standards
 * (American Animal Hospital Association - AAHA and AVMA feline/canine life-stage guidelines).
 */
export function calculatePetAge(
  species: 'dog' | 'cat',
  petYears: number,
  dogSize: DogSize = 'medium'
): PetAgeResult {
  if (species === 'cat') {
    let humanYears: number;
    if (petYears <= 1) {
      humanYears = Math.round(petYears * 15);
    } else if (petYears <= 2) {
      humanYears = 15 + Math.round((petYears - 1) * 9);
    } else {
      humanYears = 24 + Math.round((petYears - 2) * 4);
    }

    let lifeStage: PetAgeResult['lifeStage'] = 'Adult';
    if (petYears < 1) lifeStage = 'Puppy/Kitten';
    else if (petYears <= 2) lifeStage = 'Junior';
    else if (petYears < 11) lifeStage = 'Adult';
    else if (petYears < 15) lifeStage = 'Senior';
    else lifeStage = 'Geriatric';

    return {
      humanYears,
      lifeStage,
      guidelinesSource: 'AAHA/AAFP Feline Life Stage Guidelines',
    };
  }

  // Dog calculation based on weight categories
  let humanYears: number;
  if (dogSize === 'giant') {
    if (petYears <= 1) humanYears = 12;
    else if (petYears <= 2) humanYears = 22;
    else humanYears = 22 + Math.round((petYears - 2) * 7.5);
  } else if (dogSize === 'large') {
    if (petYears <= 1) humanYears = 15;
    else if (petYears <= 2) humanYears = 24;
    else humanYears = 24 + (petYears - 2) * 6;
  } else if (dogSize === 'medium') {
    if (petYears <= 1) humanYears = 15;
    else if (petYears <= 2) humanYears = 24;
    else humanYears = 24 + (petYears - 2) * 5;
  } else {
    // small
    if (petYears <= 1) humanYears = 15;
    else if (petYears <= 2) humanYears = 24;
    else humanYears = 24 + (petYears - 2) * 4;
  }

  let lifeStage: PetAgeResult['lifeStage'] = 'Adult';
  if (petYears < 1) lifeStage = 'Puppy/Kitten';
  else if (petYears <= 2) lifeStage = 'Junior';
  else if (dogSize === 'giant' && petYears >= 7) lifeStage = 'Geriatric';
  else if (petYears >= 11) lifeStage = 'Geriatric';
  else if (petYears >= 8) lifeStage = 'Senior';

  return {
    humanYears,
    lifeStage,
    guidelinesSource: 'AAHA Canine Life Stage Guidelines',
  };
}

