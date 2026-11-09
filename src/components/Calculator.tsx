import { useState, useEffect } from 'preact/hooks';
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
  type AgeResult,
  type AgeTotals,
  type NextBirthdayResult,
  type Milestone,
  type WeekdayResult,
  type WesternZodiacResult,
  type ChineseZodiacResult,
  type EstimatedVitalStats,
} from '../lib/age';
import { getTranslations, formatNumber, type SupportedLocale } from '../i18n/utils';
import InterestingFactsCard from './InterestingFactsCard';

interface CalculatorProps {
  lang: SupportedLocale;
  initialMode?: 'today' | 'on-date' | 'compare';
}

export default function Calculator({ lang, initialMode = 'today' }: CalculatorProps) {
  const t = getTranslations(lang);
  const [mode, setMode] = useState<'today' | 'on-date' | 'compare'>(initialMode);

  const today = new Date();
  const currentParts: DateParts = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };

  // State for Person 1 (or single person)
  const [p1Year, setP1Year] = useState<string>('2000');
  const [p1Month, setP1Month] = useState<string>('1');
  const [p1Day, setP1Day] = useState<string>('1');

  // State for Target Date (Mode B)
  const [targetYear, setTargetYear] = useState<string>(String(currentParts.year));
  const [targetMonth, setTargetMonth] = useState<string>(String(currentParts.month));
  const [targetDay, setTargetDay] = useState<string>(String(currentParts.day));

  // State for Person 2 (Mode C)
  const [p2Year, setP2Year] = useState<string>('1995');
  const [p2Month, setP2Month] = useState<string>('5');
  const [p2Day, setP2Day] = useState<string>('15');

  // Calculation output state
  const [error, setError] = useState<string | null>(null);
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [totals, setTotals] = useState<AgeTotals | null>(null);
  const [nextBday, setNextBday] = useState<NextBirthdayResult | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [weekday, setWeekday] = useState<WeekdayResult | null>(null);
  const [western, setWestern] = useState<WesternZodiacResult | null>(null);
  const [chinese, setChinese] = useState<ChineseZodiacResult | null>(null);
  const [heartbeats, setHeartbeats] = useState<EstimatedVitalStats | null>(null);
  const [breaths, setBreaths] = useState<EstimatedVitalStats | null>(null);

  // Compare mode output state
  const [compareResult, setCompareResult] = useState<{
    olderPerson: 1 | 2 | 0;
    diff: AgeResult;
    totalDaysDiff: number;
  } | null>(null);

  // Share state
  const [copied, setCopied] = useState(false);

  // Re-run calculation whenever inputs or mode change
  const compute = () => {
    setError(null);

    const y1 = parseInt(p1Year, 10);
    const m1 = parseInt(p1Month, 10);
    const d1 = parseInt(p1Day, 10);

    try {
      validateDate(y1, m1, d1);
    } catch (e: any) {
      setError(e instanceof DateValidationError ? e.message : t.errors.invalidDate);
      setAgeResult(null);
      return;
    }

    const birthParts: DateParts = { year: y1, month: m1, day: d1 };

    if (mode === 'today' || mode === 'on-date') {
      let targetParts: DateParts;
      if (mode === 'today') {
        targetParts = currentParts;
      } else {
        const ty = parseInt(targetYear, 10);
        const tm = parseInt(targetMonth, 10);
        const td = parseInt(targetDay, 10);
        try {
          validateDate(ty, tm, td);
          targetParts = { year: ty, month: tm, day: td };
        } catch (e: any) {
          setError(e instanceof DateValidationError ? e.message : t.errors.invalidDate);
          setAgeResult(null);
          return;
        }
      }

      try {
        validateDateRange(birthParts, targetParts);
      } catch (e: any) {
        setError(e instanceof DateValidationError ? e.message : t.errors.futureBirth);
        setAgeResult(null);
        return;
      }

      const age = calculateAge(birthParts, targetParts);
      const tot = getTotals(birthParts, targetParts);
      const bday = getNextBirthday(birthParts);
      const mls = getMilestones(birthParts);
      const wk = getWeekdayBorn(birthParts);
      const wz = getWesternZodiac(birthParts);
      const cz = getChineseZodiac(birthParts);
      const hb = estimatedHeartbeats(tot.minutes);
      const br = estimatedBreaths(tot.minutes);

      setAgeResult(age);
      setTotals(tot);
      setNextBday(bday);
      setMilestones(mls);
      setWeekday(wk);
      setWestern(wz);
      setChinese(cz);
      setHeartbeats(hb);
      setBreaths(br);
      setCompareResult(null);
    } else {
      // Mode C: Compare Two People
      const y2 = parseInt(p2Year, 10);
      const m2 = parseInt(p2Month, 10);
      const d2 = parseInt(p2Day, 10);

      try {
        validateDate(y2, m2, d2);
      } catch (e: any) {
        setError(e instanceof DateValidationError ? e.message : t.errors.invalidDate);
        setCompareResult(null);
        return;
      }

      const p2Parts: DateParts = { year: y2, month: m2, day: d2 };

      const utc1 = Date.UTC(y1, m1 - 1, d1);
      const utc2 = Date.UTC(y2, m2 - 1, d2);

      if (utc1 === utc2) {
        setCompareResult({
          olderPerson: 0,
          diff: { years: 0, months: 0, days: 0 },
          totalDaysDiff: 0,
        });
      } else if (utc1 < utc2) {
        // Person 1 was born earlier, so Person 1 is older
        const diff = calculateAge(birthParts, p2Parts);
        const tot = getTotals(birthParts, p2Parts);
        setCompareResult({
          olderPerson: 1,
          diff,
          totalDaysDiff: tot.days,
        });
      } else {
        // Person 2 was born earlier, so Person 2 is older
        const diff = calculateAge(p2Parts, birthParts);
        const tot = getTotals(p2Parts, birthParts);
        setCompareResult({
          olderPerson: 2,
          diff,
          totalDaysDiff: tot.days,
        });
      }
      setAgeResult(null);
    }
  };

  useEffect(() => {
    compute();
  }, [mode, p1Year, p1Month, p1Day, targetYear, targetMonth, targetDay, p2Year, p2Month, p2Day]);

  // Live countdown timer that pauses when tab is hidden to conserve battery
  useEffect(() => {
    if (!nextBday || mode !== 'today') return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const y1 = parseInt(p1Year, 10);
        const m1 = parseInt(p1Month, 10);
        const d1 = parseInt(p1Day, 10);
        if (!isNaN(y1) && !isNaN(m1) && !isNaN(d1)) {
          const freshBday = getNextBirthday({ year: y1, month: m1, day: d1 });
          setNextBday(freshBday);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [p1Year, p1Month, p1Day, mode]);

  // Client-side text copy (zero URL pollution)
  const handleCopyText = async () => {
    if (!ageResult) return;
    const text = `${t.results.ageTitle}: ${ageResult.years} ${t.results.years}, ${ageResult.months} ${t.results.months}, ${ageResult.days} ${t.results.days}. (${formatNumber(totals?.days || 0, lang)} ${t.totals.totalDays})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Client-side HTML5 Canvas card generation (no server, Linear software-craft palette)
  const handleDownloadImage = () => {
    if (!ageResult) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw deep canvas background (#010102)
    ctx.fillStyle = '#010102';
    ctx.fillRect(0, 0, 640, 360);

    // Inner surface-1 card (#0f1011)
    ctx.fillStyle = '#0f1011';
    ctx.roundRect ? ctx.roundRect(16, 16, 608, 328, 12) : ctx.fillRect(16, 16, 608, 328);
    ctx.fill();

    // Hairline border (#23252a)
    ctx.strokeStyle = '#23252a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Header lavender indicator line (#5e6ad2)
    ctx.fillStyle = '#5e6ad2';
    ctx.fillRect(36, 36, 36, 4);

    // Brand tag
    ctx.fillStyle = '#8a8f98';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
    ctx.fillText('AGE & DATE CALCULATOR • PRECISION ENGINE', 36, 62);

    // Main age numbers in crisp light gray (#f7f8f8)
    ctx.fillStyle = '#f7f8f8';
    ctx.font = '600 40px -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText(`${ageResult.years} ${t.results.years}, ${ageResult.months} ${t.results.months}, ${ageResult.days} ${t.results.days}`, 36, 125);

    // Secondary metrics
    ctx.fillStyle = '#d0d6e0';
    ctx.font = '400 17px -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
    ctx.fillText(`• ${t.totals.totalDays}: ${formatNumber(totals?.days || 0, lang)}`, 36, 180);
    ctx.fillText(`• ${t.totals.totalHours}: ${formatNumber(totals?.hours || 0, lang)}`, 36, 215);
    if (western) {
      ctx.fillText(`• ${t.funFacts.westernZodiac}: ${western.sign} (${western.element})`, 36, 250);
    }
    if (chinese) {
      ctx.fillText(`• ${t.funFacts.chineseZodiac}: ${chinese.element} ${chinese.animal}`, 36, 285);
    }

    // Footer note
    ctx.fillStyle = '#62666d';
    ctx.font = '400 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
    ctx.fillText('Client-Side Discrete Calendar Arithmetic • Zero Server Logs', 36, 324);

    // Trigger local download
    const link = document.createElement('a');
    link.download = `chronological-age-${ageResult.years}y.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div class="w-full space-y-6">
      {/* Mode Selector Tabs (Precision Segmented Switch) */}
      <div
        role="tablist"
        aria-label="Calculator Modes"
        class="grid grid-cols-3 p-1 bg-[#010102] [html.light_&]:bg-[#edf1f5] border border-[#23252a] [html.light_&]:border-[#dbe0e8] rounded-[10px] sm:rounded-full gap-1 text-[11px] sm:text-xs font-medium max-w-lg mx-auto shadow-sm"
      >
        <button
          role="tab"
          aria-selected={mode === 'today'}
          onClick={() => setMode('today')}
          class={`py-2 px-1 sm:px-3 rounded-[7px] sm:rounded-full transition-all text-center flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] ${
            mode === 'today'
              ? 'bg-[#141516] [html.light_&]:bg-[#ffffff] text-[#f7f8f8] [html.light_&]:text-[#0f1011] border border-[#23252a] [html.light_&]:border-[#dbe0e8] shadow-sm font-semibold'
              : 'text-[#8a8f98] [html.light_&]:text-[#6b7280] hover:text-[#f7f8f8] [html.light_&]:hover:text-[#0f1011]'
          }`}
        >
          <span>{t.modes.ageToday}</span>
        </button>
        <button
          role="tab"
          aria-selected={mode === 'on-date'}
          onClick={() => setMode('on-date')}
          class={`py-2 px-1 sm:px-3 rounded-[7px] sm:rounded-full transition-all text-center flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] ${
            mode === 'on-date'
              ? 'bg-[#141516] [html.light_&]:bg-[#ffffff] text-[#f7f8f8] [html.light_&]:text-[#0f1011] border border-[#23252a] [html.light_&]:border-[#dbe0e8] shadow-sm font-semibold'
              : 'text-[#8a8f98] [html.light_&]:text-[#6b7280] hover:text-[#f7f8f8] [html.light_&]:hover:text-[#0f1011]'
          }`}
        >
          <span class="sm:hidden">{lang === 'es' ? 'En Fecha' : lang === 'pt' ? 'Em Data' : 'Specific Date'}</span>
          <span class="hidden sm:inline">{t.modes.ageOnDate}</span>
        </button>
        <button
          role="tab"
          aria-selected={mode === 'compare'}
          onClick={() => setMode('compare')}
          class={`py-2 px-1 sm:px-3 rounded-[7px] sm:rounded-full transition-all text-center flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] ${
            mode === 'compare'
              ? 'bg-[#141516] [html.light_&]:bg-[#ffffff] text-[#f7f8f8] [html.light_&]:text-[#0f1011] border border-[#23252a] [html.light_&]:border-[#dbe0e8] shadow-sm font-semibold'
              : 'text-[#8a8f98] [html.light_&]:text-[#6b7280] hover:text-[#f7f8f8] [html.light_&]:hover:text-[#0f1011]'
          }`}
        >
          <span class="sm:hidden">{lang === 'es' ? 'Comparar' : lang === 'pt' ? 'Comparar' : 'Compare'}</span>
          <span class="hidden sm:inline">{t.modes.compareTwo}</span>
        </button>
      </div>

      {/* Input Card Container (Surface-1 Charcoal Panel) */}
      <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Birth Date (Person 1) */}
          <div>
            <label class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
              {mode === 'compare' ? t.labels.person1 : t.labels.birthDate}
            </label>
            <div class="flex items-center gap-2">
              <div class="flex-1">
                <span class="block text-[11px] font-mono text-[#62666d] uppercase mb-1">{t.labels.day}</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={p1Day}
                  onInput={(e) => setP1Day((e.target as HTMLInputElement).value)}
                  class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                  aria-label={`${t.labels.day} of birth`}
                />
              </div>
              <div class="flex-1">
                <span class="block text-[11px] font-mono text-[#62666d] uppercase mb-1">{t.labels.month}</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={p1Month}
                  onInput={(e) => setP1Month((e.target as HTMLInputElement).value)}
                  class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                  aria-label={`${t.labels.month} of birth`}
                />
              </div>
              <div class="flex-1.5">
                <span class="block text-[11px] font-mono text-[#62666d] uppercase mb-1">{t.labels.year}</span>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={p1Year}
                  onInput={(e) => setP1Year((e.target as HTMLInputElement).value)}
                  class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                  aria-label={`${t.labels.year} of birth`}
                />
              </div>
            </div>
          </div>

          {/* Target Date (Mode B) or Person 2 (Mode C) */}
          {mode === 'on-date' && (
            <div>
              <label class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
                {t.labels.targetDate}
              </label>
              <div class="flex items-center gap-2">
                <div class="flex-1">
                  <span class="block text-[11px] font-mono text-[#62666d] uppercase mb-1">{t.labels.day}</span>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={targetDay}
                    onInput={(e) => setTargetDay((e.target as HTMLInputElement).value)}
                    class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                    aria-label={`${t.labels.day} of target date`}
                  />
                </div>
                <div class="flex-1">
                  <span class="block text-[11px] font-mono text-[#62666d] uppercase mb-1">{t.labels.month}</span>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={targetMonth}
                    onInput={(e) => setTargetMonth((e.target as HTMLInputElement).value)}
                    class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                    aria-label={`${t.labels.month} of target date`}
                  />
                </div>
                <div class="flex-1.5">
                  <span class="block text-[11px] font-mono text-[#62666d] uppercase mb-1">{t.labels.year}</span>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={targetYear}
                    onInput={(e) => setTargetYear((e.target as HTMLInputElement).value)}
                    class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                    aria-label={`${t.labels.year} of target date`}
                  />
                </div>
              </div>
            </div>
          )}

          {mode === 'compare' && (
            <div>
              <label class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
                {t.labels.person2}
              </label>
              <div class="flex items-center gap-2">
                <div class="flex-1">
                  <span class="block text-[11px] font-mono text-[#62666d] uppercase mb-1">{t.labels.day}</span>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={p2Day}
                    onInput={(e) => setP2Day((e.target as HTMLInputElement).value)}
                    class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                    aria-label={`${t.labels.day} of second person`}
                  />
                </div>
                <div class="flex-1">
                  <span class="block text-[11px] font-mono text-[#62666d] uppercase mb-1">{t.labels.month}</span>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={p2Month}
                    onInput={(e) => setP2Month((e.target as HTMLInputElement).value)}
                    class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                    aria-label={`${t.labels.month} of second person`}
                  />
                </div>
                <div class="flex-1.5">
                  <span class="block text-[11px] font-mono text-[#62666d] uppercase mb-1">{t.labels.year}</span>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={p2Year}
                    onInput={(e) => setP2Year((e.target as HTMLInputElement).value)}
                    class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                    aria-label={`${t.labels.year} of second person`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Validation Error Message */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            class="mt-4 p-3 bg-[#191a1b] border border-red-900/60 rounded-[8px] text-xs text-red-400 flex items-center gap-2 font-mono"
          >
            <svg class="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Hero Section (Mode A & B) */}
      {ageResult && (
        <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 sm:p-8 text-[#f7f8f8] shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#5e6ad2]"></span>
              <span class="text-xs uppercase tracking-wider font-mono text-[#8a8f98]">
                {t.results.ageTitle}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                class="px-3 py-1.5 text-xs font-medium rounded-[8px] bg-[#141516] hover:bg-[#18191a] text-[#d0d6e0] hover:text-[#f7f8f8] border border-[#23252a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                aria-label={t.share.copyText}
              >
                {copied ? t.share.copied : t.share.copyText}
              </button>
              <button
                onClick={handleDownloadImage}
                class="px-3 py-1.5 text-xs font-medium rounded-[8px] bg-[#5e6ad2] hover:bg-[#828fff] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
                aria-label={t.share.downloadImage}
              >
                {t.share.downloadImage}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 text-center py-2">
            <div class="bg-[#141516] border border-[#23252a] rounded-[8px] p-4">
              <div data-testid="hero-years" class="text-3xl sm:text-5xl font-mono font-semibold tracking-tight text-[#f7f8f8]">
                {ageResult.years}
              </div>
              <div class="text-[11px] font-mono text-[#8a8f98] mt-1.5 uppercase">
                {t.results.years}
              </div>
            </div>
            <div class="bg-[#141516] border border-[#23252a] rounded-[8px] p-4">
              <div class="text-3xl sm:text-5xl font-mono font-semibold tracking-tight text-[#f7f8f8]">
                {ageResult.months}
              </div>
              <div class="text-[11px] font-mono text-[#8a8f98] mt-1.5 uppercase">
                {t.results.months}
              </div>
            </div>
            <div class="bg-[#141516] border border-[#23252a] rounded-[8px] p-4">
              <div class="text-3xl sm:text-5xl font-mono font-semibold tracking-tight text-[#f7f8f8]">
                {ageResult.days}
              </div>
              <div class="text-[11px] font-mono text-[#8a8f98] mt-1.5 uppercase">
                {t.results.days}
              </div>
            </div>
          </div>

          {/* Next Birthday Live Countdown Badge */}
          {nextBday && mode === 'today' && (
            <div class="pt-4 border-t border-[#18191a] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8a8f98]">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#27a644]"></span>
                <span class="font-medium text-[#d0d6e0]">{t.nextBirthday.title}:</span>
              </div>
              {nextBday.isToday ? (
                <span class="font-semibold text-[#f7f8f8]">{t.nextBirthday.todayIsBirthday}</span>
              ) : (
                <div class="flex items-center gap-2 font-mono font-medium text-[#f7f8f8]">
                  <span>{nextBday.daysRemaining} {t.nextBirthday.days}</span>
                  <span>{nextBday.hoursRemaining} {t.nextBirthday.hours}</span>
                  <span>{nextBday.minutesRemaining} {t.nextBirthday.minutes}</span>
                  <span>{nextBday.secondsRemaining} {t.nextBirthday.seconds}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Result Hero Section (Mode C: Compare) */}
      {compareResult && (
        <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 sm:p-8 text-[#f7f8f8] shadow-sm space-y-4">
          <span class="text-xs uppercase tracking-wider font-mono text-[#5e6ad2] font-semibold">
            {t.compare.title}
          </span>
          {compareResult.olderPerson === 0 ? (
            <div class="text-xl sm:text-2xl font-medium py-4 text-center text-[#f7f8f8]">
              {t.compare.sameAge}
            </div>
          ) : (
            <div class="py-2 space-y-2">
              <div class="text-xl sm:text-2xl font-medium text-[#d0d6e0]">
                {compareResult.olderPerson === 1 ? t.labels.person1 : t.labels.person2}{' '}
                <span class="text-[#8a8f98] font-normal">{t.compare.olderBy}</span>
              </div>
              <div class="text-3xl sm:text-4xl font-mono font-semibold text-[#f7f8f8]">
                {compareResult.diff.years} {t.results.years}, {compareResult.diff.months} {t.results.months}, {compareResult.diff.days} {t.results.days}
              </div>
              <div class="text-xs font-mono text-[#8a8f98]">
                ({formatNumber(compareResult.totalDaysDiff, lang)} {t.totals.totalDays})
              </div>
            </div>
          )}
        </div>
      )}

      {/* Totals Grid (Mode A & B) */}
      {totals && (
        <div class="space-y-3">
          <h3 class="text-xs uppercase font-medium text-[#8a8f98] tracking-wider font-mono">
            {t.totals.title}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="bg-[#0f1011] border border-[#23252a] rounded-[8px] p-4">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{t.totals.totalDays}</div>
              <div class="text-lg sm:text-xl font-semibold text-[#f7f8f8] font-mono mt-1">
                {formatNumber(totals.days, lang)}
              </div>
            </div>
            <div class="bg-[#0f1011] border border-[#23252a] rounded-[8px] p-4">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{t.totals.totalWeeks}</div>
              <div class="text-lg sm:text-xl font-semibold text-[#f7f8f8] font-mono mt-1">
                {formatNumber(totals.weeks, lang)}{' '}
                <span class="text-xs text-[#8a8f98] font-normal">
                  (+{totals.remainingDays} {t.totals.remainingDays})
                </span>
              </div>
            </div>
            <div class="bg-[#0f1011] border border-[#23252a] rounded-[8px] p-4">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{t.totals.totalMonths}</div>
              <div class="text-lg sm:text-xl font-semibold text-[#f7f8f8] font-mono mt-1">
                {formatNumber(totals.months, lang)}
              </div>
            </div>
            <div class="bg-[#0f1011] border border-[#23252a] rounded-[8px] p-4">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{t.totals.totalHours}</div>
              <div class="text-lg sm:text-xl font-semibold text-[#f7f8f8] font-mono mt-1">
                {formatNumber(totals.hours, lang)}
              </div>
            </div>
            <div class="bg-[#0f1011] border border-[#23252a] rounded-[8px] p-4">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{t.totals.totalMinutes}</div>
              <div class="text-lg sm:text-xl font-semibold text-[#f7f8f8] font-mono mt-1">
                {formatNumber(totals.minutes, lang)}
              </div>
            </div>
            <div class="bg-[#0f1011] border border-[#23252a] rounded-[8px] p-4">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{t.totals.totalSeconds}</div>
              <div class="text-lg sm:text-xl font-semibold text-[#f7f8f8] font-mono mt-1">
                {formatNumber(totals.seconds, lang)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Astrology & Vital Estimates */}
      {(western || chinese || heartbeats) && (
        <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 space-y-4">
          <h3 class="text-xs uppercase font-medium text-[#8a8f98] tracking-wider font-mono">
            {t.funFacts.title}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {weekday && (
              <div class="flex items-center justify-between p-3.5 bg-[#141516] border border-[#23252a] rounded-[8px]">
                <span class="text-[#8a8f98]">{t.funFacts.weekdayBorn}</span>
                <span class="font-medium text-[#f7f8f8]">{weekday.name}</span>
              </div>
            )}
            {western && (
              <div class="flex items-center justify-between p-3.5 bg-[#141516] border border-[#23252a] rounded-[8px]">
                <span class="text-[#8a8f98]">{t.funFacts.westernZodiac}</span>
                <span class="font-medium text-[#f7f8f8]">
                  {western.sign} ({western.element})
                </span>
              </div>
            )}
            {chinese && (
              <div class="flex items-center justify-between p-3.5 bg-[#141516] border border-[#23252a] rounded-[8px]">
                <span class="text-[#8a8f98]">{t.funFacts.chineseZodiac}</span>
                <span class="font-medium text-[#f7f8f8]">
                  {chinese.element} {chinese.animal}
                </span>
              </div>
            )}
            {heartbeats && (
              <div class="flex items-center justify-between p-3.5 bg-[#141516] border border-[#23252a] rounded-[8px]">
                <div>
                  <div class="text-[#8a8f98]">{t.funFacts.heartbeats}</div>
                  <div class="text-[10px] text-[#62666d]">({t.funFacts.roughEstimate})</div>
                </div>
                <span class="font-mono font-medium text-[#f7f8f8]">
                  &asymp; {formatNumber(heartbeats.average, lang)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interesting Facts Component */}
      {totals?.days && totals.days > 0 && (
        <InterestingFactsCard days={totals.days} lang={lang} />
      )}

      {/* Milestones List */}
      {milestones.length > 0 && mode === 'today' && (
        <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 space-y-4 mb-8 sm:mb-12">
          <h3 class="text-xs uppercase font-medium text-[#8a8f98] tracking-wider font-mono">
            {t.milestones.title}
          </h3>
          <div class="divide-y divide-[#18191a]">
            {milestones.map((m) => {
              const isPassed = m.targetDate <= today;
              const dateStr = m.targetDate.toISOString().slice(0, 10);
              return (
                <div key={m.id} class="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div class="font-medium text-[#f7f8f8]">{m.name}</div>
                    <div class="text-[#8a8f98] mt-0.5">{m.description}</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-mono text-[#8a8f98]">{dateStr}</span>
                    <span
                      class={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono ${
                        isPassed
                          ? 'bg-[#27a644]/10 text-[#27a644] border border-[#27a644]/30'
                          : 'bg-[#141516] text-[#8a8f98] border border-[#23252a]'
                      }`}
                    >
                      {isPassed ? t.milestones.passed : t.milestones.upcoming}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
