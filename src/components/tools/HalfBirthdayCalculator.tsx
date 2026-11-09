import { useState, useEffect } from 'preact/hooks';
import { calculateHalfBirthday, type HalfBirthdayResult } from '../../lib/dateTools';
import { formatNumber, type SupportedLocale } from '../../i18n/utils';
import InterestingFactsCard from '../InterestingFactsCard';

export default function HalfBirthdayCalculator({ lang }: { lang: SupportedLocale }) {
  const [year, setYear] = useState('2000');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('15');

  const [result, setResult] = useState<HalfBirthdayResult | null>(() =>
    calculateHalfBirthday({ year: 2000, month: 1, day: 15 })
  );

  const compute = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && d >= 1 && d <= 31 && m >= 1 && m <= 12) {
      setResult(calculateHalfBirthday({ year: y, month: m, day: d }));
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
    annualTitle: isEs ? 'Fecha Anual de Medio Cumpleaños' : isPt ? 'Data Anual de Meio Aniversário' : 'Annual Half-Birthday Date',
    nextPrefix: isEs ? 'Próxima celebración:' : isPt ? 'Próxima comemoração:' : 'Next occurrence:',
    daysAwaySuffix: isEs ? 'días restantes' : isPt ? 'dias restantes' : 'days away',
  };

  const monthNames = isEs
    ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    : isPt
    ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

      {result && (
        <div class="space-y-6">
          <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 sm:p-8 text-[#f7f8f8] space-y-4">
            <div class="text-xs uppercase tracking-wider text-[#5e6ad2] font-semibold font-mono">
              {labels.annualTitle}
            </div>
            <div class="text-3xl sm:text-5xl font-mono font-semibold tracking-tight">
              {isEs || isPt
                ? `${result.halfDay} de ${monthNames[result.halfMonth - 1]}`
                : `${monthNames[result.halfMonth - 1]} ${result.halfDay}`}
            </div>
            <div class="pt-3 text-xs text-[#8a8f98] border-t border-[#18191a]">
              {labels.nextPrefix} {result.nextHalfBirthday.toISOString().slice(0, 10)} ({formatNumber(result.daysRemaining, lang)} {labels.daysAwaySuffix})
            </div>
          </div>

          {/* Interesting Facts Component */}
          <InterestingFactsCard days={result.daysRemaining || 182} lang={lang} />
        </div>
      )}
    </div>
  );
}
