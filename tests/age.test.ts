import { describe, it, expect } from 'vitest';
import {
  calculateAge,
  getTotals,
  getNextBirthday,
  getMilestones,
  getWeekdayBorn,
  getWesternZodiac,
  getChineseZodiac,
  estimatedHeartbeats,
  estimatedBreaths,
  validateDate,
  validateDateRange,
  DateValidationError,
  type DateParts,
} from '../src/lib/age';

describe('Date Validation & Century Boundaries', () => {
  it('1. validates a normal date', () => {
    expect(() => validateDate(2024, 6, 15)).not.toThrow();
  });

  it('2. throws on year before 1900', () => {
    expect(() => validateDate(1899, 12, 31)).toThrow(DateValidationError);
  });

  it('3. throws on year after 2100', () => {
    expect(() => validateDate(2101, 1, 1)).toThrow(DateValidationError);
  });

  it('4. century boundary 1900 is NOT a leap year (Feb 28 is valid)', () => {
    expect(() => validateDate(1900, 2, 28)).not.toThrow();
  });

  it('5. century boundary 1900 is NOT a leap year (Feb 29 throws)', () => {
    expect(() => validateDate(1900, 2, 29)).toThrow(DateValidationError);
  });

  it('6. century boundary 2000 IS a leap year (Feb 29 is valid)', () => {
    expect(() => validateDate(2000, 2, 29)).not.toThrow();
  });

  it('7. century boundary 2100 is NOT a leap year (Feb 28 is valid)', () => {
    expect(() => validateDate(2100, 2, 28)).not.toThrow();
  });

  it('8. century boundary 2100 is NOT a leap year (Feb 29 throws)', () => {
    expect(() => validateDate(2100, 2, 29)).toThrow(DateValidationError);
  });

  it('9. leap year 2024 has Feb 29', () => {
    expect(() => validateDate(2024, 2, 29)).not.toThrow();
  });

  it('10. non-leap year 2023 Feb 29 throws', () => {
    expect(() => validateDate(2023, 2, 29)).toThrow(DateValidationError);
  });

  it('11. invalid day 31 on 30-day month (April 31) throws', () => {
    expect(() => validateDate(2024, 4, 31)).toThrow(DateValidationError);
  });

  it('12. invalid day 31 on February throws', () => {
    expect(() => validateDate(2024, 2, 31)).toThrow(DateValidationError);
  });

  it('13. invalid month 0 throws', () => {
    expect(() => validateDate(2024, 0, 15)).toThrow(DateValidationError);
  });

  it('14. invalid month 13 throws', () => {
    expect(() => validateDate(2024, 13, 15)).toThrow(DateValidationError);
  });

  it('15. birth date after target date throws DateValidationError', () => {
    expect(() =>
      validateDateRange(
        { year: 2025, month: 1, day: 1 },
        { year: 2024, month: 1, day: 1 }
      )
    ).toThrow(DateValidationError);
  });
});

describe('calculateAge - Same-Day & Standard Differences', () => {
  it('16. same day returns 0 years, 0 months, 0 days', () => {
    const res = calculateAge(
      { year: 2000, month: 1, day: 1 },
      { year: 2000, month: 1, day: 1 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 0 });
  });

  it('17. one day later returns 0 years, 0 months, 1 day', () => {
    const res = calculateAge(
      { year: 2000, month: 1, day: 1 },
      { year: 2000, month: 1, day: 2 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 1 });
  });

  it('18. exact one month later', () => {
    const res = calculateAge(
      { year: 2000, month: 1, day: 15 },
      { year: 2000, month: 2, day: 15 }
    );
    expect(res).toEqual({ years: 0, months: 1, days: 0 });
  });

  it('19. exact one year later', () => {
    const res = calculateAge(
      { year: 2000, month: 5, day: 10 },
      { year: 2001, month: 5, day: 10 }
    );
    expect(res).toEqual({ years: 1, months: 0, days: 0 });
  });

  it('20. standard borrow across months: target day < birth day', () => {
    // 2000-03-20 to 2024-03-15
    // target day 15 < 20 -> borrows Feb 2024 (29 days) -> 15 + 29 - 20 = 24 days
    // target month 3 - 1 = 2 -> 2 - 3 = -1 -> + 12 = 11 months
    // target year 2024 - 1 - 2000 = 23 years
    const res = calculateAge(
      { year: 2000, month: 3, day: 20 },
      { year: 2024, month: 3, day: 15 }
    );
    expect(res).toEqual({ years: 23, months: 11, days: 24 });
  });

  it('21. standard borrow with 30-day month', () => {
    // 2000-05-25 to 2023-05-10
    // target day 10 < 25 -> borrows April 2023 (30 days) -> 10 + 30 - 25 = 15 days
    // months: 5 - 1 - 5 = -1 -> 11 months, years = 22 years
    const res = calculateAge(
      { year: 2000, month: 5, day: 25 },
      { year: 2023, month: 5, day: 10 }
    );
    expect(res).toEqual({ years: 22, months: 11, days: 15 });
  });

  it('22. accepts Date instances built at local midnight', () => {
    const birth = new Date(1995, 7, 24); // Aug 24, 1995
    const target = new Date(2025, 7, 24); // Aug 24, 2025
    const res = calculateAge(birth, target);
    expect(res).toEqual({ years: 30, months: 0, days: 0 });
  });
});

describe('calculateAge - Feb 29 Births & Non-Leap Years', () => {
  it('23. Feb 29 birth in leap year, target same day 0 years', () => {
    const res = calculateAge(
      { year: 2000, month: 2, day: 29 },
      { year: 2000, month: 2, day: 29 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 0 });
  });

  it('24. Feb 29 birth on next day (March 1) in birth year', () => {
    const res = calculateAge(
      { year: 2000, month: 2, day: 29 },
      { year: 2000, month: 3, day: 1 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 1 });
  });

  it('25. Feb 29 birth on non-leap year Feb 28: treated as Feb 28 -> exactly 1 year', () => {
    const res = calculateAge(
      { year: 2000, month: 2, day: 29 },
      { year: 2001, month: 2, day: 28 }
    );
    expect(res).toEqual({ years: 1, months: 0, days: 0 });
  });

  it('26. Feb 29 birth on non-leap year March 1: 1 year, 0 months, 1 day', () => {
    const res = calculateAge(
      { year: 2000, month: 2, day: 29 },
      { year: 2001, month: 3, day: 1 }
    );
    expect(res).toEqual({ years: 1, months: 0, days: 1 });
  });

  it('27. Feb 29 birth on leap year anniversary (4 years later)', () => {
    const res = calculateAge(
      { year: 2000, month: 2, day: 29 },
      { year: 2004, month: 2, day: 29 }
    );
    expect(res).toEqual({ years: 4, months: 0, days: 0 });
  });

  it('28. Feb 29 birth on leap year March 1 (4 years later)', () => {
    const res = calculateAge(
      { year: 2000, month: 2, day: 29 },
      { year: 2004, month: 3, day: 1 }
    );
    expect(res).toEqual({ years: 4, months: 0, days: 1 });
  });

  it('29. Feb 29 birth on day before non-leap birthday (Feb 27, 2001)', () => {
    const res = calculateAge(
      { year: 2000, month: 2, day: 29 },
      { year: 2001, month: 2, day: 27 }
    );
    // Effective birth day in 2001 is 28.
    // Target day 27 < 28 -> borrows Jan 2001 (31 days) -> 27 + 31 - 28 = 30 days.
    // Months: 2 - 1 - 2 = -1 -> 11 months. Years: 2001 - 1 - 2000 = 0 years.
    expect(res).toEqual({ years: 0, months: 11, days: 30 });
  });
});

describe('calculateAge - Month-End Rollovers', () => {
  it('30. Jan 31 -> Feb 28 in non-leap year (2023)', () => {
    // Target day 28 < 31 -> borrows Jan 2023 (31 days): 28 + 31 - 31 = 28 days
    // Months: 2 - 1 - 1 = 0 months
    const res = calculateAge(
      { year: 2023, month: 1, day: 31 },
      { year: 2023, month: 2, day: 28 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 28 });
  });

  it('31. Jan 31 -> Feb 29 in leap year (2024)', () => {
    // Target day 29 < 31 -> borrows Jan 2024 (31 days): 29 + 31 - 31 = 29 days
    // Months: 2 - 1 - 1 = 0 months
    const res = calculateAge(
      { year: 2024, month: 1, day: 31 },
      { year: 2024, month: 2, day: 29 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 29 });
  });

  it('32. Jan 31 -> Mar 1 in non-leap year (2023)', () => {
    // 29 days total elapsed from Jan 31: 0 months, 29 days
    const res = calculateAge(
      { year: 2023, month: 1, day: 31 },
      { year: 2023, month: 3, day: 1 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 29 });
  });

  it('33. Jan 31 -> Mar 2 in non-leap year (2023)', () => {
    const res = calculateAge(
      { year: 2023, month: 1, day: 31 },
      { year: 2023, month: 3, day: 2 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 30 });
  });

  it('34. Jan 31 -> Mar 3 in non-leap year (2023): completes 1 month', () => {
    const res = calculateAge(
      { year: 2023, month: 1, day: 31 },
      { year: 2023, month: 3, day: 3 }
    );
    expect(res).toEqual({ years: 0, months: 1, days: 0 });
  });

  it('35. Jan 31 -> Mar 31: completes 2 full months', () => {
    const res = calculateAge(
      { year: 2023, month: 1, day: 31 },
      { year: 2023, month: 3, day: 31 }
    );
    expect(res).toEqual({ years: 0, months: 2, days: 0 });
  });

  it('36. Mar 31 -> Apr 30 (30-day month rollover)', () => {
    // Target day 30 < 31 -> borrows March (31 days): 30 + 31 - 31 = 30 days
    // Months: 4 - 1 - 3 = 0 months
    const res = calculateAge(
      { year: 2023, month: 3, day: 31 },
      { year: 2023, month: 4, day: 30 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 30 });
  });

  it('37. Mar 31 -> May 1 (1 month completed)', () => {
    // Target day 1 < 31 -> borrows April (30 days): 1 + 30 - 31 = 0 days
    // Months: 5 - 1 - 3 = 1 month
    const res = calculateAge(
      { year: 2023, month: 3, day: 31 },
      { year: 2023, month: 5, day: 1 }
    );
    expect(res).toEqual({ years: 0, months: 1, days: 0 });
  });

  it('38. May 31 -> Jun 30', () => {
    const res = calculateAge(
      { year: 2023, month: 5, day: 31 },
      { year: 2023, month: 6, day: 30 }
    );
    expect(res).toEqual({ years: 0, months: 0, days: 30 });
  });

  it('39. May 31 -> Jul 1', () => {
    const res = calculateAge(
      { year: 2023, month: 5, day: 31 },
      { year: 2023, month: 7, day: 1 }
    );
    expect(res).toEqual({ years: 0, months: 1, days: 0 });
  });
});

describe('getTotals & DST-Safety', () => {
  it('40. same-day totals are all zero', () => {
    const totals = getTotals(
      { year: 2020, month: 1, day: 1 },
      { year: 2020, month: 1, day: 1 }
    );
    expect(totals.days).toBe(0);
    expect(totals.weeks).toBe(0);
    expect(totals.remainingDays).toBe(0);
    expect(totals.hours).toBe(0);
    expect(totals.minutes).toBe(0);
    expect(totals.seconds).toBe(0);
  });

  it('41. exactly 10 days produces correct derived totals', () => {
    const totals = getTotals(
      { year: 2024, month: 1, day: 1 },
      { year: 2024, month: 1, day: 11 }
    );
    expect(totals.days).toBe(10);
    expect(totals.weeks).toBe(1);
    expect(totals.remainingDays).toBe(3);
    expect(totals.hours).toBe(240);
    expect(totals.minutes).toBe(14400);
    expect(totals.seconds).toBe(864000);
  });

  it('42. DST Spring forward transition (US 2024-03-10): day count is exact 1 day', () => {
    // 2024-03-09 to 2024-03-11 spans the US DST transition
    const totals = getTotals(
      { year: 2024, month: 3, day: 9 },
      { year: 2024, month: 3, day: 11 }
    );
    expect(totals.days).toBe(2);
    expect(totals.hours).toBe(48);
  });

  it('43. DST Fall back transition (Europe 2024-10-27): day count is exact', () => {
    const totals = getTotals(
      { year: 2024, month: 10, day: 26 },
      { year: 2024, month: 10, day: 28 }
    );
    expect(totals.days).toBe(2);
    expect(totals.hours).toBe(48);
  });

  it('44. 1 full non-leap year is exactly 365 days', () => {
    const totals = getTotals(
      { year: 2022, month: 1, day: 1 },
      { year: 2023, month: 1, day: 1 }
    );
    expect(totals.days).toBe(365);
    expect(totals.weeks).toBe(52);
    expect(totals.remainingDays).toBe(1);
  });

  it('45. 1 full leap year is exactly 366 days', () => {
    const totals = getTotals(
      { year: 2024, month: 1, day: 1 },
      { year: 2025, month: 1, day: 1 }
    );
    expect(totals.days).toBe(366);
    expect(totals.weeks).toBe(52);
    expect(totals.remainingDays).toBe(2);
  });
});

describe('Next Birthday & Countdown', () => {
  it('46. birthday later this year', () => {
    const birth: DateParts = { year: 1990, month: 10, day: 15 };
    const from = new Date(2024, 4, 1, 12, 0, 0); // May 1, 2024
    const next = getNextBirthday(birth, from);
    expect(next.nextBirthday.getFullYear()).toBe(2024);
    expect(next.nextBirthday.getMonth()).toBe(9); // 0-indexed month 9 is Oct
    expect(next.nextBirthday.getDate()).toBe(15);
    expect(next.isToday).toBe(false);
  });

  it('47. birthday already passed this year (rolls to next year)', () => {
    const birth: DateParts = { year: 1990, month: 3, day: 10 };
    const from = new Date(2024, 4, 1, 12, 0, 0); // May 1, 2024
    const next = getNextBirthday(birth, from);
    expect(next.nextBirthday.getFullYear()).toBe(2025);
    expect(next.nextBirthday.getMonth()).toBe(2); // March
    expect(next.nextBirthday.getDate()).toBe(10);
  });

  it('48. today IS birthday', () => {
    const birth: DateParts = { year: 1990, month: 5, day: 1 };
    const from = new Date(2024, 4, 1, 10, 0, 0); // May 1, 2024
    const next = getNextBirthday(birth, from);
    expect(next.isToday).toBe(true);
  });

  it('49. Feb 29 birth in non-leap year (treated as Feb 28)', () => {
    const birth: DateParts = { year: 2000, month: 2, day: 29 };
    const from = new Date(2023, 0, 15); // Jan 15, 2023 (non-leap)
    const next = getNextBirthday(birth, from);
    expect(next.nextBirthday.getFullYear()).toBe(2023);
    expect(next.nextBirthday.getMonth()).toBe(1); // Feb
    expect(next.nextBirthday.getDate()).toBe(28);
  });

  it('50. Feb 29 birth in leap year (falls on Feb 29)', () => {
    const birth: DateParts = { year: 2000, month: 2, day: 29 };
    const from = new Date(2024, 0, 15); // Jan 15, 2024 (leap)
    const next = getNextBirthday(birth, from);
    expect(next.nextBirthday.getFullYear()).toBe(2024);
    expect(next.nextBirthday.getMonth()).toBe(1); // Feb
    expect(next.nextBirthday.getDate()).toBe(29);
  });
});

describe('Milestones (including 10,000 days checked against independent calculation)', () => {
  it('51. 10,000 days milestone from 2000-01-01 is 2027-05-19', () => {
    const milestones = getMilestones({ year: 2000, month: 1, day: 1 });
    const m10k = milestones.find((m) => m.id === '10000-days');
    expect(m10k).toBeDefined();
    expect(m10k!.targetDate.toISOString().slice(0, 10)).toBe('2027-05-19');
  });

  it('52. 10,000 days milestone from 1990-05-15 is 2017-09-30', () => {
    const milestones = getMilestones({ year: 1990, month: 5, day: 15 });
    const m10k = milestones.find((m) => m.id === '10000-days');
    expect(m10k).toBeDefined();
    expect(m10k!.targetDate.toISOString().slice(0, 10)).toBe('2017-09-30');
  });

  it('53. 15,000 and 20,000 days milestones exist and are mathematically exact', () => {
    const milestones = getMilestones({ year: 2000, month: 1, day: 1 });
    const m15k = milestones.find((m) => m.id === '15000-days');
    const m20k = milestones.find((m) => m.id === '20000-days');
    expect(m15k).toBeDefined();
    expect(m20k).toBeDefined();
    const diff15 = (m15k!.targetDate.getTime() - Date.UTC(2000, 0, 1)) / 86400000;
    const diff20 = (m20k!.targetDate.getTime() - Date.UTC(2000, 0, 1)) / 86400000;
    expect(diff15).toBe(15000);
    expect(diff20).toBe(20000);
  });

  it('54. 1 billion seconds milestone is 1,000,000,000 seconds', () => {
    const milestones = getMilestones({ year: 2000, month: 1, day: 1 });
    const m1b = milestones.find((m) => m.id === '1-billion-seconds');
    expect(m1b).toBeDefined();
    const diffSec = (m1b!.targetDate.getTime() - Date.UTC(2000, 0, 1)) / 1000;
    expect(diffSec).toBe(1_000_000_000);
  });

  it('55. age milestones: 18, 21, 50, 65 years', () => {
    const milestones = getMilestones({ year: 2000, month: 6, day: 15 });
    const m18 = milestones.find((m) => m.id === '18-years');
    const m21 = milestones.find((m) => m.id === '21-years');
    const m50 = milestones.find((m) => m.id === '50-years');
    const m65 = milestones.find((m) => m.id === '65-years');
    expect(m18!.targetDate.getFullYear()).toBe(2018);
    expect(m21!.targetDate.getFullYear()).toBe(2021);
    expect(m50!.targetDate.getFullYear()).toBe(2050);
    expect(m65!.targetDate.getFullYear()).toBe(2065);
  });

  it('56. half-birthday milestone is 6 months after birth', () => {
    const milestones = getMilestones({ year: 2000, month: 1, day: 15 });
    const half = milestones.find((m) => m.id === 'half-birthday');
    expect(half).toBeDefined();
    expect(half!.targetDate.getMonth()).toBe(6); // July (month 7)
    expect(half!.targetDate.getDate()).toBe(15);
  });
});

describe('Weekday Born', () => {
  it('57. 2000-01-01 was a Saturday', () => {
    const res = getWeekdayBorn({ year: 2000, month: 1, day: 1 });
    expect(res.name).toBe('Saturday');
    expect(res.dayOfWeek).toBe(6);
    expect(res.isoDayOfWeek).toBe(6);
  });

  it('58. 1969-07-20 was a Sunday (Apollo 11)', () => {
    const res = getWeekdayBorn({ year: 1969, month: 7, day: 20 });
    expect(res.name).toBe('Sunday');
    expect(res.dayOfWeek).toBe(0);
    expect(res.isoDayOfWeek).toBe(7);
  });

  it('59. 1900-01-01 was a Monday', () => {
    const res = getWeekdayBorn({ year: 1900, month: 1, day: 1 });
    expect(res.name).toBe('Monday');
    expect(res.dayOfWeek).toBe(1);
    expect(res.isoDayOfWeek).toBe(1);
  });
});

describe('Western Zodiac (element + modality + cusps)', () => {
  it('60. Aries (Mar 21 - Apr 19): Fire, Cardinal', () => {
    const res = getWesternZodiac({ year: 2000, month: 3, day: 21 });
    expect(res.sign).toBe('Aries');
    expect(res.element).toBe('Fire');
    expect(res.modality).toBe('Cardinal');
  });

  it('61. Pisces cusp boundary (Mar 20): Water, Mutable', () => {
    const res = getWesternZodiac({ year: 2000, month: 3, day: 20 });
    expect(res.sign).toBe('Pisces');
    expect(res.element).toBe('Water');
    expect(res.modality).toBe('Mutable');
  });

  it('62. Taurus: Earth, Fixed', () => {
    const res = getWesternZodiac({ year: 2000, month: 5, day: 5 });
    expect(res.sign).toBe('Taurus');
    expect(res.element).toBe('Earth');
    expect(res.modality).toBe('Fixed');
  });

  it('63. Gemini: Air, Mutable', () => {
    const res = getWesternZodiac({ year: 2000, month: 6, day: 10 });
    expect(res.sign).toBe('Gemini');
    expect(res.element).toBe('Air');
    expect(res.modality).toBe('Mutable');
  });

  it('64. Cancer: Water, Cardinal', () => {
    const res = getWesternZodiac({ year: 2000, month: 7, day: 10 });
    expect(res.sign).toBe('Cancer');
    expect(res.element).toBe('Water');
    expect(res.modality).toBe('Cardinal');
  });

  it('65. Leo: Fire, Fixed', () => {
    const res = getWesternZodiac({ year: 2000, month: 8, day: 10 });
    expect(res.sign).toBe('Leo');
    expect(res.element).toBe('Fire');
    expect(res.modality).toBe('Fixed');
  });

  it('66. Virgo: Earth, Mutable', () => {
    const res = getWesternZodiac({ year: 2000, month: 9, day: 10 });
    expect(res.sign).toBe('Virgo');
    expect(res.element).toBe('Earth');
    expect(res.modality).toBe('Mutable');
  });

  it('67. Libra: Air, Cardinal', () => {
    const res = getWesternZodiac({ year: 2000, month: 10, day: 10 });
    expect(res.sign).toBe('Libra');
    expect(res.element).toBe('Air');
    expect(res.modality).toBe('Cardinal');
  });

  it('68. Scorpio: Water, Fixed', () => {
    const res = getWesternZodiac({ year: 2000, month: 11, day: 10 });
    expect(res.sign).toBe('Scorpio');
    expect(res.element).toBe('Water');
    expect(res.modality).toBe('Fixed');
  });

  it('69. Sagittarius: Fire, Mutable', () => {
    const res = getWesternZodiac({ year: 2000, month: 12, day: 10 });
    expect(res.sign).toBe('Sagittarius');
    expect(res.element).toBe('Fire');
    expect(res.modality).toBe('Mutable');
  });

  it('70. Capricorn: Earth, Cardinal', () => {
    const res = getWesternZodiac({ year: 2000, month: 1, day: 10 });
    expect(res.sign).toBe('Capricorn');
    expect(res.element).toBe('Earth');
    expect(res.modality).toBe('Cardinal');
  });

  it('71. Aquarius: Air, Fixed', () => {
    const res = getWesternZodiac({ year: 2000, month: 2, day: 10 });
    expect(res.sign).toBe('Aquarius');
    expect(res.element).toBe('Air');
    expect(res.modality).toBe('Fixed');
  });
});

describe('Chinese Zodiac - Lunar New Year Cusp Dates', () => {
  it('72. 1900 LNY is Jan 31: Jan 15 is Pig (1899), Jan 31 is Rat (1900)', () => {
    const before = getChineseZodiac({ year: 1900, month: 1, day: 15 });
    const after = getChineseZodiac({ year: 1900, month: 1, day: 31 });
    expect(before.animal).toBe('Pig');
    expect(after.animal).toBe('Rat');
    expect(after.element).toBe('Metal');
  });

  it('73. 2000 LNY is Feb 5: Jan 15 is Rabbit (1999), Feb 5 is Dragon (2000)', () => {
    const before = getChineseZodiac({ year: 2000, month: 1, day: 15 });
    const after = getChineseZodiac({ year: 2000, month: 2, day: 5 });
    expect(before.animal).toBe('Rabbit');
    expect(after.animal).toBe('Dragon');
    expect(after.element).toBe('Metal');
  });

  it('74. 2024 LNY is Feb 10: Jan 15 is Rabbit (2023), Feb 10 is Dragon (2024)', () => {
    const before = getChineseZodiac({ year: 2024, month: 1, day: 15 });
    const after = getChineseZodiac({ year: 2024, month: 2, day: 10 });
    expect(before.animal).toBe('Rabbit');
    expect(after.animal).toBe('Dragon');
    expect(after.element).toBe('Wood');
  });

  it('75. 2025 LNY is Jan 29: Jan 15 is Dragon (2024), Jan 29 is Snake (2025)', () => {
    const before = getChineseZodiac({ year: 2025, month: 1, day: 15 });
    const after = getChineseZodiac({ year: 2025, month: 1, day: 29 });
    expect(before.animal).toBe('Dragon');
    expect(after.animal).toBe('Snake');
    expect(after.element).toBe('Wood');
  });

  it('76. 2026 LNY is Feb 17: Feb 16 is Snake (2025), Feb 17 is Horse (2026)', () => {
    const before = getChineseZodiac({ year: 2026, month: 2, day: 16 });
    const after = getChineseZodiac({ year: 2026, month: 2, day: 17 });
    expect(before.animal).toBe('Snake');
    expect(after.animal).toBe('Horse');
    expect(after.element).toBe('Fire');
  });

  it('77. 2100 boundary year LNY lookup works correctly', () => {
    const res = getChineseZodiac({ year: 2100, month: 3, day: 1 });
    expect(res.animal).toBe('Monkey');
  });
});

describe('Estimated Heartbeats & Breaths (arithmetic verification)', () => {
  it('78. estimatedHeartbeats calculation is accurate and labelled "rough estimate"', () => {
    const minutes = 1000;
    const res = estimatedHeartbeats(minutes);
    expect(res.label).toBe('rough estimate');
    expect(res.minBpm).toBe(70);
    expect(res.maxBpm).toBe(80);
    expect(res.minTotal).toBe(70_000);
    expect(res.maxTotal).toBe(80_000);
    expect(res.average).toBe(75_000);
  });

  it('79. estimatedBreaths calculation is accurate and labelled "rough estimate"', () => {
    const minutes = 1000;
    const res = estimatedBreaths(minutes);
    expect(res.label).toBe('rough estimate');
    expect(res.minBpm).toBe(12);
    expect(res.maxBpm).toBe(20);
    expect(res.minTotal).toBe(12_000);
    expect(res.maxTotal).toBe(20_000);
    expect(res.average).toBe(16_000);
  });

  it('80. 0 minutes yields 0 beats and 0 breaths', () => {
    const beats = estimatedHeartbeats(0);
    const breaths = estimatedBreaths(0);
    expect(beats.average).toBe(0);
    expect(breaths.average).toBe(0);
  });
});

