import { useMemo } from 'preact/hooks';
import { getBestChronologicalFact } from '../lib/interestingFacts';
import { type SupportedLocale } from '../i18n/utils';

interface Props {
  days: number;
  lang: SupportedLocale;
}

export default function InterestingFactsCard({ days, lang }: Props) {
  const fact = useMemo(() => getBestChronologicalFact({ days, lang }), [days, lang]);

  return (
    <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 sm:p-7 space-y-4 shadow-sm mt-6 sm:mt-8 mb-6 sm:mb-8">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#5e6ad2]"></span>
          <span class="text-[11px] uppercase font-mono tracking-wider text-[#5e6ad2] font-medium">
            {fact.categoryLabel}
          </span>
        </div>
        <div class="text-right">
          <span class="font-mono text-sm sm:text-base font-semibold text-[#f7f8f8]">
            {fact.statValue}
          </span>
        </div>
      </div>

      <div class="space-y-1.5">
        <h3 class="text-sm sm:text-base font-medium text-[#f7f8f8] leading-snug">
          {fact.headline}
        </h3>
        <p class="text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
          {fact.explanation}
        </p>
      </div>

      <div class="pt-3.5 pb-2 border-t border-[#18191a] flex items-center justify-between text-[11px] font-mono text-[#62666d]">
        <span>{fact.statLabel}</span>
      </div>
    </div>
  );
}
