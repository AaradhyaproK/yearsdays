import { useState, useEffect } from 'preact/hooks';
import { calculateDaysBetween, type DaysBetweenResult } from '../../lib/dateTools';
import { formatNumber, type SupportedLocale } from '../../i18n/utils';
import InterestingFactsCard from '../InterestingFactsCard';

export default function DaysBetweenCalculator({ lang }: { lang: SupportedLocale }) {
  const [startYear, setStartYear] = useState('2024');
  const [startMonth, setStartMonth] = useState('1');
  const [startDay, setStartDay] = useState('1');

  const [endYear, setEndYear] = useState('2024');
  const [endMonth, setEndMonth] = useState('12');
  const [endDay, setEndDay] = useState('31');

  const [result, setResult] = useState<DaysBetweenResult | null>(() =>
    calculateDaysBetween(
      { year: 2024, month: 1, day: 1 },
      { year: 2024, month: 12, day: 31 }
    )
  );
  const [error, setError] = useState<string | null>(null);

  const compute = () => {
    setError(null);
    try {
      const sY = parseInt(startYear, 10);
      const sM = parseInt(startMonth, 10);
      const sD = parseInt(startDay, 10);
      const eY = parseInt(endYear, 10);
      const eM = parseInt(endMonth, 10);
      const eD = parseInt(endDay, 10);

      if (isNaN(sY) || isNaN(sM) || isNaN(sD) || isNaN(eY) || isNaN(eM) || isNaN(eD)) {
        return;
      }

      const res = calculateDaysBetween(
        { year: sY, month: sM, day: sD },
        { year: eY, month: eM, day: eD }
      );
      setResult(res);
    } catch (e: any) {
      setError(e.message || 'Invalid dates entered');
      setResult(null);
    }
  };

  useEffect(() => {
    compute();
  }, [startYear, startMonth, startDay, endYear, endMonth, endDay]);

  const isEs = lang === 'es';
  const isPt = lang === 'pt';

  const labels = {
    start: isEs ? 'Fecha Inicial' : isPt ? 'Data Inicial' : 'Start Date',
    end: isEs ? 'Fecha Final' : isPt ? 'Data Final' : 'End Date',
    day: isEs ? 'Día (DD)' : isPt ? 'Dia (DD)' : 'Day (DD)',
    month: isEs ? 'Mes (MM)' : isPt ? 'Mês (MM)' : 'Month (MM)',
    year: isEs ? 'Año (AAAA)' : isPt ? 'Ano (AAAA)' : 'Year (YYYY)',
    exactDuration: isEs ? 'Duración Exacta del Calendario' : isPt ? 'Duração Exata do Calendário' : 'Exact Calendar Duration',
    daysWord: isEs ? 'días' : isPt ? 'dias' : 'days',
    inclusivePrefix: isEs ? 'O bien' : isPt ? 'Ou' : 'Or',
    inclusiveSuffix: isEs ? 'días al incluir el día final.' : isPt ? 'dias ao incluir a data final.' : 'days when including the end date.',
    weeks: isEs ? 'Semanas Calendario' : isPt ? 'Semanas no Calendário' : 'Calendar Weeks',
    workingDays: isEs ? 'Días Hábiles (L-V)' : isPt ? 'Dias Úteis (Seg-Sex)' : 'Working Days (M-F)',
    weekendDays: isEs ? 'Días de Fin de Semana' : isPt ? 'Finais de Semana' : 'Weekend Days',
    hours: isEs ? 'Horas Transcurridas' : isPt ? 'Horas Decorridas' : 'Total Elapsed Hours',
  };

  return (
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0f1011] p-6 rounded-[12px] border border-[#23252a]">
        {/* Start Date */}
        <div>
          <label class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
            {labels.start}
          </label>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <span class="block text-[11px] font-mono text-[#8a8f98] uppercase mb-1">
                {labels.day}
              </span>
              <input
                type="number"
                min="1"
                max="31"
                value={startDay}
                onInput={(e) => { setStartDay((e.target as HTMLInputElement).value); }}
                placeholder="DD"
                aria-label={labels.day}
                class="w-full px-2.5 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div>
              <span class="block text-[11px] font-mono text-[#8a8f98] uppercase mb-1">
                {labels.month}
              </span>
              <input
                type="number"
                min="1"
                max="12"
                value={startMonth}
                onInput={(e) => { setStartMonth((e.target as HTMLInputElement).value); }}
                placeholder="MM"
                aria-label={labels.month}
                class="w-full px-2.5 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div>
              <span class="block text-[11px] font-mono text-[#8a8f98] uppercase mb-1">
                {labels.year}
              </span>
              <input
                type="number"
                min="1900"
                max="2100"
                value={startYear}
                onInput={(e) => { setStartYear((e.target as HTMLInputElement).value); }}
                placeholder="YYYY"
                aria-label={labels.year}
                class="w-full px-2.5 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
              />
            </div>
          </div>
        </div>

        {/* End Date */}
        <div>
          <label class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
            {labels.end}
          </label>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <span class="block text-[11px] font-mono text-[#8a8f98] uppercase mb-1">
                {labels.day}
              </span>
              <input
                type="number"
                min="1"
                max="31"
                value={endDay}
                onInput={(e) => { setEndDay((e.target as HTMLInputElement).value); }}
                placeholder="DD"
                aria-label={labels.day}
                class="w-full px-2.5 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div>
              <span class="block text-[11px] font-mono text-[#8a8f98] uppercase mb-1">
                {labels.month}
              </span>
              <input
                type="number"
                min="1"
                max="12"
                value={endMonth}
                onInput={(e) => { setEndMonth((e.target as HTMLInputElement).value); }}
                placeholder="MM"
                aria-label={labels.month}
                class="w-full px-2.5 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div>
              <span class="block text-[11px] font-mono text-[#8a8f98] uppercase mb-1">
                {labels.year}
              </span>
              <input
                type="number"
                min="1900"
                max="2100"
                value={endYear}
                onInput={(e) => { setEndYear((e.target as HTMLInputElement).value); }}
                placeholder="YYYY"
                aria-label={labels.year}
                class="w-full px-2.5 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div class="p-3 bg-[#191a1b] border border-red-900/60 rounded-[8px] text-xs text-red-400 font-mono">
          {error}
        </div>
      )}

      {result && (
        <div class="space-y-6">
          <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 sm:p-8 text-[#f7f8f8] space-y-4">
            <div class="text-xs uppercase tracking-wider text-[#5e6ad2] font-semibold font-mono">
              {labels.exactDuration}
            </div>
            <div class="text-3xl sm:text-5xl font-mono font-semibold tracking-tight">
              {formatNumber(result.days, lang)} <span class="text-base sm:text-lg font-normal text-[#8a8f98]">{labels.daysWord}</span>
            </div>
            <div class="pt-3 text-xs text-[#8a8f98] border-t border-[#18191a] font-mono">
              {labels.inclusivePrefix} {formatNumber(result.daysInclusive, lang)} {labels.inclusiveSuffix}
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-4 bg-[#0f1011] border border-[#23252a] rounded-[8px]">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{labels.weeks}</div>
              <div class="text-lg sm:text-xl font-mono font-semibold text-[#f7f8f8] mt-1">
                {formatNumber(result.weeks, lang)}
              </div>
            </div>
            <div class="p-4 bg-[#0f1011] border border-[#23252a] rounded-[8px]">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{labels.workingDays}</div>
              <div class="text-lg sm:text-xl font-mono font-semibold text-[#f7f8f8] mt-1">
                {formatNumber(result.businessDays, lang)}
              </div>
            </div>
            <div class="p-4 bg-[#0f1011] border border-[#23252a] rounded-[8px]">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{labels.weekendDays}</div>
              <div class="text-lg sm:text-xl font-mono font-semibold text-[#f7f8f8] mt-1">
                {formatNumber(result.weekendDays, lang)}
              </div>
            </div>
            <div class="p-4 bg-[#0f1011] border border-[#23252a] rounded-[8px]">
              <div class="text-[11px] text-[#8a8f98] font-mono uppercase">{labels.hours}</div>
              <div class="text-lg sm:text-xl font-mono font-semibold text-[#f7f8f8] mt-1">
                {formatNumber(result.hours, lang)}
              </div>
            </div>
          </div>

          {/* Interesting Facts Component */}
          <InterestingFactsCard days={result.days} lang={lang} />
        </div>
      )}
    </div>
  );
}
