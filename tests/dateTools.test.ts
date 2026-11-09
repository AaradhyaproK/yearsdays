import { describe, it, expect } from 'vitest';
import {
  calculateDaysBetween,
  calculateDaysAlive,
  addSubtractDate,
  getBirthdayCountdownDetails,
  calculateHalfBirthday,
  calculatePetAge,
} from '../src/lib/dateTools';
import { getBestChronologicalFact } from '../src/lib/interestingFacts';

describe('Days Between Dates Calculator', () => {
  it('calculates days between two same dates as 0', () => {
    const res = calculateDaysBetween(
      { year: 2024, month: 1, day: 1 },
      { year: 2024, month: 1, day: 1 }
    );
    expect(res.days).toBe(0);
    expect(res.weeks).toBe(0);
    expect(res.remainingDays).toBe(0);
  });

  it('calculates days between two dates across leap year February', () => {
    // 2024 is a leap year; Feb has 29 days
    const res = calculateDaysBetween(
      { year: 2024, month: 2, day: 1 },
      { year: 2024, month: 3, day: 1 }
    );
    expect(res.days).toBe(29);
  });

  it('calculates days between two dates in non-leap year', () => {
    // 2023 is non-leap; Feb has 28 days
    const res = calculateDaysBetween(
      { year: 2023, month: 2, day: 1 },
      { year: 2023, month: 3, day: 1 }
    );
    expect(res.days).toBe(28);
  });

  it('calculates weeks and remaining days correctly', () => {
    const res = calculateDaysBetween(
      { year: 2024, month: 1, day: 1 },
      { year: 2024, month: 1, day: 16 }
    );
    expect(res.days).toBe(15);
    expect(res.weeks).toBe(2);
    expect(res.remainingDays).toBe(1);
    expect(res.daysInclusive).toBe(16);
    expect(res.hours).toBe(15 * 24);
    expect(res.minutes).toBe(15 * 24 * 60);
    expect(res.seconds).toBe(15 * 24 * 60 * 60);
    expect(res.businessDays + res.weekendDays).toBe(15);
  });

  it('calculates business days and weekend days over an exact full week (Mon to Mon)', () => {
    // 2024-01-08 was Monday, 2024-01-15 was Monday (7 elapsed days)
    const res = calculateDaysBetween(
      { year: 2024, month: 1, day: 8 },
      { year: 2024, month: 1, day: 15 }
    );
    expect(res.days).toBe(7);
    expect(res.businessDays).toBe(5);
    expect(res.weekendDays).toBe(2);
    expect(res.daysInclusive).toBe(8);
  });

  it('correctly calculates user test case without any NaN values', () => {
    const res = calculateDaysBetween(
      { year: 2026, month: 7, day: 17 },
      { year: 2027, month: 12, day: 26 }
    );
    expect(res.days).toBe(527);
    expect(res.daysInclusive).toBe(528);
    expect(res.weeks).toBe(75);
    expect(res.hours).toBe(527 * 24);
    expect(Number.isNaN(res.businessDays)).toBe(false);
    expect(Number.isNaN(res.weekendDays)).toBe(false);
    expect(res.businessDays + res.weekendDays).toBe(527);
  });
});

describe('Days Alive Calculator', () => {
  it('computes days alive from known date (2000-01-01 to 2020-01-01)', () => {
    // 2000 to 2020: 20 years including leap years 2000, 2004, 2008, 2012, 2016 (5 leap years)
    // 20 * 365 + 5 = 7305 days
    const res = calculateDaysAlive(
      { year: 2000, month: 1, day: 1 },
      { year: 2020, month: 1, day: 1 }
    );
    expect(res.daysAlive).toBe(7305);
    expect(res.hoursAlive).toBe(7305 * 24);
  });

  it('identifies next 1,000 / 10,000 day milestone', () => {
    // Person lived 9,500 days
    // Next milestone is 10,000 days -> 500 days remaining
    const res = calculateDaysAlive(
      { year: 2000, month: 1, day: 1 },
      { year: 2026, month: 1, day: 1 } // exactly 26 years (approx 9497 days)
    );
    expect(res.nextDayMilestone.targetDays).toBe(10000);
    expect(res.nextDayMilestone.daysRemaining).toBeGreaterThan(0);
  });
});

describe('Add or Subtract Dates Calculator', () => {
  it('adds days across month boundary correctly', () => {
    const res = addSubtractDate({ year: 2024, month: 1, day: 25 }, 10, 'days', 'add');
    expect(res.year).toBe(2024);
    expect(res.month).toBe(2);
    expect(res.day).toBe(4);
  });

  it('subtracts days across month boundary correctly', () => {
    const res = addSubtractDate({ year: 2024, month: 3, day: 5 }, 10, 'days', 'subtract');
    // Feb 2024 has 29 days
    expect(res.year).toBe(2024);
    expect(res.month).toBe(2);
    expect(res.day).toBe(24);
  });

  it('adds months with month-end capping (Jan 31 + 1 month in non-leap year)', () => {
    const res = addSubtractDate({ year: 2023, month: 1, day: 31 }, 1, 'months', 'add');
    // February 2023 caps at 28
    expect(res.year).toBe(2023);
    expect(res.month).toBe(2);
    expect(res.day).toBe(28);
  });

  it('adds months with month-end capping (Jan 31 + 1 month in leap year)', () => {
    const res = addSubtractDate({ year: 2024, month: 1, day: 31 }, 1, 'months', 'add');
    // February 2024 caps at 29
    expect(res.year).toBe(2024);
    expect(res.month).toBe(2);
    expect(res.day).toBe(29);
  });

  it('adds years for Feb 29 birth into non-leap year', () => {
    const res = addSubtractDate({ year: 2020, month: 2, day: 29 }, 1, 'years', 'add');
    // 2021 is non-leap year -> caps at Feb 28
    expect(res.year).toBe(2021);
    expect(res.month).toBe(2);
    expect(res.day).toBe(28);
  });
});

describe('Birthday Countdown Details', () => {
  it('returns upcoming 5 birthdays with correct day names', () => {
    const res = getBirthdayCountdownDetails(
      { month: 10, day: 15 },
      new Date(2024, 0, 1) // Jan 1, 2024
    );
    expect(res.upcomingDaysOfWeek.length).toBe(5);
    expect(res.upcomingDaysOfWeek[0].year).toBe(2024);
    expect(['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday']).toContain(
      res.upcomingDaysOfWeek[0].dayName
    );
  });
});

describe('Half-Birthday Calculator', () => {
  it('computes half-birthday 6 months from birth date', () => {
    const res = calculateHalfBirthday({ year: 2000, month: 1, day: 15 });
    expect(res.halfMonth).toBe(7); // July
    expect(res.halfDay).toBe(15);
  });

  it('caps half-birthday for March 31 (September has 30 days)', () => {
    const res = calculateHalfBirthday({ year: 2000, month: 3, day: 31 });
    expect(res.halfMonth).toBe(9); // September
    expect(res.halfDay).toBe(30); // September has only 30 days
  });
});

describe('Pet Age in Human Years Calculator (Veterinary Standards)', () => {
  it('calculates cat age: 1 year = 15, 2 years = 24, 3 years = 28', () => {
    expect(calculatePetAge('cat', 1).humanYears).toBe(15);
    expect(calculatePetAge('cat', 2).humanYears).toBe(24);
    expect(calculatePetAge('cat', 3).humanYears).toBe(28);
    expect(calculatePetAge('cat', 10).humanYears).toBe(56);
  });

  it('calculates small dog age: 1 yr = 15, 2 yr = 24, 3 yr = 28', () => {
    expect(calculatePetAge('dog', 1, 'small').humanYears).toBe(15);
    expect(calculatePetAge('dog', 2, 'small').humanYears).toBe(24);
    expect(calculatePetAge('dog', 3, 'small').humanYears).toBe(28);
  });

  it('calculates giant dog age (ages faster in senior years)', () => {
    expect(calculatePetAge('dog', 1, 'giant').humanYears).toBe(12);
    expect(calculatePetAge('dog', 2, 'giant').humanYears).toBe(22);
    expect(calculatePetAge('dog', 5, 'giant').humanYears).toBe(45);
    expect(calculatePetAge('dog', 8, 'giant').lifeStage).toBe('Geriatric');
  });
});

describe('Best Chronological & Date-Based Fact Engine', () => {
  it('generates exact planetary fact for 200 days without generic text or NaN', () => {
    const fact = getBestChronologicalFact({ days: 200, lang: 'en' });
    expect(fact.category).toBe('planetary');
    expect(fact.statValue).toBe('54.8%');
    expect(fact.headline).toContain('54.8%');
    expect(fact.explanation).toContain('200 days');
    expect(fact.explanation.includes('NaN')).toBe(false);
  });

  it('generates exact cosmic voyage fact for 527 days (user test case)', () => {
    const fact = getBestChronologicalFact({ days: 527, lang: 'en' });
    expect(fact.category).toBe('cosmic');
    expect(fact.headline).toContain('1355.9 million km');
    expect(fact.explanation).toContain('527 days');
    expect(fact.explanation.includes('NaN')).toBe(false);
  });

  it('generates properly localized facts in Spanish and Portuguese', () => {
    const factEs = getBestChronologicalFact({ days: 200, lang: 'es' });
    expect(factEs.categoryLabel).toBe('Mecánica Celeste');
    expect(factEs.explanation).toContain('200 días');
    expect(factEs.explanation.includes('NaN')).toBe(false);

    const factPt = getBestChronologicalFact({ days: 200, lang: 'pt' });
    expect(factPt.categoryLabel).toBe('Mecânica Celeste');
    expect(factPt.explanation).toContain('200 dias');
    expect(factPt.explanation.includes('NaN')).toBe(false);
  });
});

