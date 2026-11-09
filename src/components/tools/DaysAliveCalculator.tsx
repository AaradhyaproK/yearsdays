import { useState, useEffect } from 'preact/hooks';
import { calculateDaysAlive, type DaysAliveResult } from '../../lib/dateTools';
import { formatNumber, type SupportedLocale } from '../../i18n/utils';
import InterestingFactsCard from '../InterestingFactsCard';

export default function DaysAliveCalculator({ lang }: { lang: SupportedLocale }) {
  const [year, setYear] = useState('2000');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');

  const [result, setResult] = useState<DaysAliveResult | null>(() =>
    calculateDaysAlive({ year: 2000, month: 1, day: 1 })
  );
  const [error, setError] = useState<string | null>(null);

  const compute = () => {
    setError(null);
    try {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      const d = parseInt(day, 10);

      if (isNaN(y) || isNaN(m) || isNaN(d)) {
        return;
      }

      const res = calculateDaysAlive({ year: y, month: m, day: d });
      setResult(res);
    } catch (e: any) {
      setError(e.message || 'Invalid date entered');
      setResult(null);
    }
  };

  useEffect(() => {
    compute();
  }, [year, month, day]);

  const isEs = lang === 'es';
  const isPt = lang === 'pt';

  const labels = {
    title: isEs ? 'Introduce tu Fecha de Nacimiento' : isPt ? 'Informe sua Data de Nascimento' : 'Enter Your Date of Birth',
    day: isEs ? 'Día (DD)' : isPt ? 'Dia (DD)' : 'Day (DD)',
    month: isEs ? 'Mes (MM)' : isPt ? 'Mês (MM)' : 'Month (MM)',
    year: isEs ? 'Año (AAAA)' : isPt ? 'Ano (AAAA)' : 'Year (YYYY)',
    totalDays: isEs ? 'Días Totales Vividos' : isPt ? 'Total de Dias Vividos' : 'Total Days Lived',
    daysAliveSuffix: isEs ? 'días vividos' : isPt ? 'dias vividos' : 'days alive',
    hours: isEs ? 'Horas:' : isPt ? 'Horas:' : 'Hours:',
    minutes: isEs ? 'Minutos:' : isPt ? 'Minutos:' : 'Minutes:',
    milestoneTitle: isEs ? 'Próximo Gran Hito Métrico' : isPt ? 'Próximo Grande Marco Métrico' : 'Next Major Day Milestone',
    daysRemainingWord: isEs ? 'días restantes' : isPt ? 'dias restantes' : 'days remaining',
  };

  return (
    <div class="space-y-6">
      <div class="bg-[#0f1011] p-6 rounded-[12px] border border-[#23252a] space-y-4">
        <label class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
          {labels.title}
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
              value={day}
              onInput={(e) => setDay((e.target as HTMLInputElement).value)}
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
              value={month}
              onInput={(e) => setMonth((e.target as HTMLInputElement).value)}
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
              value={year}
              onInput={(e) => setYear((e.target as HTMLInputElement).value)}
              placeholder="YYYY"
              aria-label={labels.year}
              class="w-full px-2.5 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
            />
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
              {labels.totalDays}
            </div>
            <div class="text-3xl sm:text-5xl font-mono font-semibold tracking-tight">
              {formatNumber(result.daysAlive, lang)} <span class="text-base sm:text-lg font-normal text-[#8a8f98]">{labels.daysAliveSuffix}</span>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-3 border-t border-[#18191a] text-xs font-mono text-[#8a8f98]">
              <div>{labels.hours} {formatNumber(result.hoursAlive, lang)}</div>
              <div>{labels.minutes} {formatNumber(result.minutesAlive, lang)}</div>
            </div>
          </div>

          {result.nextDayMilestone && (
            <div class="bg-[#0f1011] border border-[#23252a] p-5 rounded-[12px] space-y-3">
              <h3 class="text-xs font-semibold text-[#8a8f98] uppercase font-mono tracking-wider">
                {labels.milestoneTitle}
              </h3>
              <div class="p-4 bg-[#141516] border border-[#23252a] rounded-[8px] flex flex-wrap justify-between items-center gap-2 text-xs">
                <div>
                  <span class="font-medium text-[#f7f8f8]">
                    {formatNumber(result.nextDayMilestone.targetDays, lang)} {labels.daysAliveSuffix}
                  </span>
                  <div class="text-[#8a8f98] mt-0.5">
                    {formatNumber(result.nextDayMilestone.daysRemaining, lang)} {labels.daysRemainingWord}
                  </div>
                </div>
                <span class="font-mono text-[#5e6ad2]">
                  {result.nextDayMilestone.targetDate.toISOString().slice(0, 10)}
                </span>
              </div>
            </div>
          )}

          {/* Interesting Facts Component */}
          <InterestingFactsCard days={result.daysAlive} lang={lang} />
        </div>
      )}
    </div>
  );
}
