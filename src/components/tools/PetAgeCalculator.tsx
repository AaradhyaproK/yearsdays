import { useState } from 'preact/hooks';
import { calculatePetAge, type DogSize, type PetAgeResult } from '../../lib/dateTools';
import { type SupportedLocale } from '../../i18n/utils';
import InterestingFactsCard from '../InterestingFactsCard';

export default function PetAgeCalculator({ lang }: { lang: SupportedLocale }) {
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  const [petYears, setPetYears] = useState('3');
  const [dogSize, setDogSize] = useState<DogSize>('medium');

  const [result, setResult] = useState<PetAgeResult>(() =>
    calculatePetAge('dog', 3, 'medium')
  );

  return (
    <div class="space-y-6">
      <div class="bg-[#0f1011] p-6 rounded-[12px] border border-[#23252a] space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
              Species
            </label>
            <div class="flex gap-2">
              <button
                type="button"
                onClick={() => { setSpecies('dog'); setResult(calculatePetAge('dog', parseFloat(petYears) || 1, dogSize)); }}
                class={`flex-1 py-2 rounded-[8px] text-xs font-medium transition-colors ${
                  species === 'dog'
                    ? 'bg-[#5e6ad2] text-white shadow-sm'
                    : 'bg-[#141516] border border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8]'
                }`}
              >
                Canine (Dog)
              </button>
              <button
                type="button"
                onClick={() => { setSpecies('cat'); setResult(calculatePetAge('cat', parseFloat(petYears) || 1)); }}
                class={`flex-1 py-2 rounded-[8px] text-xs font-medium transition-colors ${
                  species === 'cat'
                    ? 'bg-[#5e6ad2] text-white shadow-sm'
                    : 'bg-[#141516] border border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8]'
                }`}
              >
                Feline (Cat)
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="pet-calendar-years" class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
              Pet Age (Calendar Years)
            </label>
            <input
              id="pet-calendar-years"
              aria-label="Pet Age (Calendar Years)"
              type="number"
              min="0.5"
              step="0.5"
              max="30"
              value={petYears}
              onInput={(e) => {
                const val = (e.target as HTMLInputElement).value;
                setPetYears(val);
                setResult(calculatePetAge(species, parseFloat(val) || 1, dogSize));
              }}
              class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
            />
          </div>

          {species === 'dog' && (
            <div>
              <label htmlFor="dog-weight-size" class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider mb-2">
                Dog Size / Weight Class
              </label>
              <select
                id="dog-weight-size"
                aria-label="Dog Size / Weight Class"
                value={dogSize}
                onChange={(e) => {
                  const val = (e.target as HTMLSelectElement).value as DogSize;
                  setDogSize(val);
                  setResult(calculatePetAge('dog', parseFloat(petYears) || 1, val));
                }}
                class="w-full px-3 py-2 rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
              >
                <option value="small" class="bg-[#0f1011]">Small (&lt; 20 lbs / 9 kg)</option>
                <option value="medium" class="bg-[#0f1011]">Medium (21–50 lbs / 10–23 kg)</option>
                <option value="large" class="bg-[#0f1011]">Large (51–90 lbs / 24–40 kg)</option>
                <option value="giant" class="bg-[#0f1011]">Giant (&gt; 90 lbs / 41+ kg)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 sm:p-8 text-[#f7f8f8] space-y-4">
          <div class="text-xs uppercase tracking-wider font-mono text-[#5e6ad2] font-semibold">
            Equivalent Human Age
          </div>
          <div class="text-3xl sm:text-5xl font-mono font-semibold tracking-tight">
            &asymp; {result.humanYears} <span class="text-sm sm:text-base font-normal text-[#8a8f98]">human years</span>
          </div>
          <div class="pt-4 text-xs text-[#8a8f98] border-t border-[#18191a] flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="text-[#d0d6e0] font-medium">Veterinary Stage:</span> {result.lifeStage}
            </div>
            <div class="font-mono text-[#62666d]">Standard: {result.guidelinesSource}</div>
          </div>
        </div>
      )}

      {result && (
        <InterestingFactsCard days={Math.round(result.humanYears * 365.25)} lang={lang} />
      )}
    </div>
  );
}
