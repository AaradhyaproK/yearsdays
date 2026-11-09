import { useState, useEffect, useMemo } from 'preact/hooks';
import { addSubtractDate, calculateDaysBetween, type TimeUnit, type DateOperation } from '../../lib/dateTools';
import { type DateParts } from '../../lib/age';
import { type SupportedLocale } from '../../i18n/utils';
import InterestingFactsCard from '../InterestingFactsCard';

export default function AddSubtractCalculator({ lang }: { lang: SupportedLocale }) {
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2024');

  const [operation, setOperation] = useState<DateOperation>('add');
  const [amount, setAmount] = useState('30');
  const [unit, setUnit] = useState<TimeUnit>('days');

  const [result, setResult] = useState<DateParts | null>(() =>
    addSubtractDate({ year: 2024, month: 1, day: 1 }, 30, 'days', 'add')
  );
  const [error, setError] = useState<string | null>(null);

  const compute = () => {
    setError(null);
    try {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      const d = parseInt(day, 10);
      const amt = parseInt(amount, 10);

      if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(amt)) {
        return;
      }

      const res = addSubtractDate(
        { year: y, month: m, day: d },
        amt,
        unit,
        operation
      );
      setResult(res);
    } catch (e: any) {
      setError(e.message || 'Calculation error');
      setResult(null);
    }
  };

  useEffect(() => {
    compute();
  }, [day, month, year, operation, amount, unit]);

  const elapsedDays = useMemo(() => {
    if (!result) return 30;
    try {
      const startParts = { year: parseInt(year, 10), month: parseInt(month, 10), day: parseInt(day, 10) };
      const diff = calculateDaysBetween(startParts, result);
      return diff.days || 1;
    } catch {
      return 30;
    }
  }, [result, year, month, day]);

  const isEs = lang === 'es';
  const isPt = lang === 'pt';

  const labels = {
    start: isEs ? 'Fecha de Inicio' : isPt ? 'Data de Início' : 'Start Date',
    day: isEs ? 'Día (DD)' : isPt ? 'Dia (DD)' : 'Day (DD)',
    month: isEs ? 'Mes (MM)' : isPt ? 'Mês (MM)' : 'Month (MM)',
    year: isEs ? 'Año (AAAA)' : isPt ? 'Ano (AAAA)' : 'Year (YYYY)',
    operation: isEs ? 'Operación' : isPt ? 'Operação' : 'Operation',
    add: isEs ? '+ Sumar' : isPt ? '+ Somar' : '+ Add',
    subtract: isEs ? '- Restar' : isPt ? '- Subtrair' : '- Subtract',
    amount: isEs ? 'Cantidad' : isPt ? 'Quantidade' : 'Amount',
    unit: isEs ? 'Unidad' : isPt ? 'Unidade' : 'Unit',
    daysUnit: isEs ? 'Días' : isPt ? 'Dias' : 'Days',
    weeksUnit: isEs ? 'Semanas' : isPt ? 'Semanas' : 'Weeks',
    monthsUnit: isEs ? 'Meses' : isPt ? 'Meses' : 'Months',
    yearsUnit: isEs ? 'Años' : isPt ? 'Anos' : 'Years',
    targetTitle: isEs ? 'Fecha Resultante del Calendario' : isPt ? 'Data Resultante no Calendário' : 'Calculated Target Date',
  };

  return (
    <div class="space-y-6">
      <div class="bg-[#0f1011] p-6 rounded-[12px] border border-[#23252a] space-y-4">
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

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
              {labels.operation}
            </label>
            <div class="flex gap-1 bg-[#010102] p-1 rounded-[8px] border border-[#23252a]">
              <button
                type="button"
                onClick={() => setOperation('add')}
                class={`flex-1 py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
                  operation === 'add' ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]' : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                }`}
              >
                {labels.add}
              </button>
              <button
                type="button"
                onClick={() => setOperation('subtract')}
                class={`flex-1 py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
                  operation === 'subtract' ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]' : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                }`}
              >
                {labels.subtract}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="add-sub-amount" class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
              {labels.amount}
            </label>
            <input
              id="add-sub-amount"
              aria-label={labels.amount}
              type="number"
              min="1"
              value={amount}
              onInput={(e) => setAmount((e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
            />
          </div>

          <div>
            <label htmlFor="add-sub-unit" class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
              {labels.unit}
            </label>
            <select
              id="add-sub-unit"
              aria-label={labels.unit}
              value={unit}
              onChange={(e) => setUnit((e.target as HTMLSelectElement).value as TimeUnit)}
              class="w-full px-3 py-2 rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
            >
              <option value="days" class="bg-[#0f1011]">{labels.daysUnit}</option>
              <option value="weeks" class="bg-[#0f1011]">{labels.weeksUnit}</option>
              <option value="months" class="bg-[#0f1011]">{labels.monthsUnit}</option>
              <option value="years" class="bg-[#0f1011]">{labels.yearsUnit}</option>
            </select>
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
              {labels.targetTitle}
            </div>
            <div class="text-3xl sm:text-5xl font-mono font-semibold tracking-tight">
              {result.year}-{String(result.month).padStart(2, '0')}-{String(result.day).padStart(2, '0')}
            </div>
            <div class="pt-3 text-xs text-[#8a8f98] border-t border-[#18191a]">
              {operation === 'add' ? (isEs ? 'Sumados' : isPt ? 'Somados' : 'Added') : (isEs ? 'Restados' : isPt ? 'Subtraídos' : 'Subtracted')} {amount} {unit} {isEs ? 'a partir de' : isPt ? 'a partir de' : 'from'} {year}-{String(month).padStart(2, '0')}-{String(day).padStart(2, '0')}.
            </div>
          </div>

          {/* Interesting Facts Component */}
          <InterestingFactsCard days={elapsedDays} lang={lang} />
        </div>
      )}
    </div>
  );
}
