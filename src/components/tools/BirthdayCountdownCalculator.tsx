import { useState, useEffect } from 'preact/hooks';
import { getBirthdayCountdownDetails, type BirthdayCountdownDetails } from '../../lib/dateTools';
import { type SupportedLocale } from '../../i18n/utils';
import InterestingFactsCard from '../InterestingFactsCard';

interface Props {
  initialDay?: number;
  initialMonth?: number;
  lang?: SupportedLocale;
}

export default function BirthdayCountdownCalculator({ initialDay = 15, initialMonth = 6, lang = 'en' }: Props) {
  const [day, setDay] = useState(String(initialDay));
  const [month, setMonth] = useState(String(initialMonth));
  const [details, setDetails] = useState<BirthdayCountdownDetails | null>(null);

  const calculate = () => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    if (!isNaN(d) && !isNaN(m) && d >= 1 && d <= 31 && m >= 1 && m <= 12) {
      setDetails(getBirthdayCountdownDetails({ month: m, day: d }));
    } else {
      setDetails(null);
    }
  };

  useEffect(() => {
    calculate();
  }, [day, month]);

  // Live countdown update every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        if (!isNaN(d) && !isNaN(m)) {
          setDetails(getBirthdayCountdownDetails({ month: m, day: d }));
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [day, month]);

  return (
    <div class="space-y-6">
      <div class="bg-[#0f1011] border border-[#23252a] p-6 rounded-[12px] space-y-4">
        <label class="block text-xs uppercase font-medium text-[#8a8f98] tracking-wider">
          Enter Your Birthday (Month &amp; Day)
        </label>
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <label htmlFor="bday-countdown-day" class="block text-[11px] text-[#62666d] mb-1 font-mono uppercase">Day</label>
            <input
              id="bday-countdown-day"
              aria-label="Birthday Day"
              type="number"
              min="1"
              max="31"
              value={day}
              onInput={(e) => setDay((e.target as HTMLInputElement).value)}
              placeholder="Day"
              class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
            />
          </div>
          <div class="flex-1">
            <label htmlFor="bday-countdown-month" class="block text-[11px] text-[#62666d] mb-1 font-mono uppercase">Month</label>
            <input
              id="bday-countdown-month"
              aria-label="Birthday Month"
              type="number"
              min="1"
              max="12"
              value={month}
              onInput={(e) => setMonth((e.target as HTMLInputElement).value)}
              placeholder="Month"
              class="w-full px-3 py-2 text-center rounded-[8px] border border-[#23252a] bg-[#010102] text-[#f7f8f8] text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]"
            />
          </div>
        </div>
      </div>

      {details && (
        <div class="space-y-4">
          <div class="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 sm:p-8 text-[#f7f8f8] shadow-sm space-y-4 text-center">
            <div class="text-xs uppercase tracking-wider text-[#5e6ad2] font-semibold font-mono">
              Next Birthday Countdown
            </div>
            {details.isToday ? (
              <div class="text-2xl sm:text-3xl font-semibold text-[#f7f8f8] py-4">
                Happy Birthday! Today is your milestone day.
              </div>
            ) : (
              <div class="grid grid-cols-4 gap-2 sm:gap-3 py-2">
                <div class="p-4 bg-[#141516] border border-[#23252a] rounded-[8px]">
                  <div class="text-2xl sm:text-4xl font-mono font-semibold text-[#f7f8f8]">{details.daysRemaining}</div>
                  <div class="text-[10px] uppercase font-mono text-[#8a8f98] mt-1">Days</div>
                </div>
                <div class="p-4 bg-[#141516] border border-[#23252a] rounded-[8px]">
                  <div class="text-2xl sm:text-4xl font-mono font-semibold text-[#f7f8f8]">{details.hoursRemaining}</div>
                  <div class="text-[10px] uppercase font-mono text-[#8a8f98] mt-1">Hours</div>
                </div>
                <div class="p-4 bg-[#141516] border border-[#23252a] rounded-[8px]">
                  <div class="text-2xl sm:text-4xl font-mono font-semibold text-[#f7f8f8]">{details.minutesRemaining}</div>
                  <div class="text-[10px] uppercase font-mono text-[#8a8f98] mt-1">Mins</div>
                </div>
                <div class="p-4 bg-[#141516] border border-[#23252a] rounded-[8px]">
                  <div class="text-2xl sm:text-4xl font-mono font-semibold text-[#f7f8f8]">{details.secondsRemaining}</div>
                  <div class="text-[10px] uppercase font-mono text-[#8a8f98] mt-1">Secs</div>
                </div>
              </div>
            )}
          </div>

          <div class="bg-[#0f1011] border border-[#23252a] p-5 rounded-[12px] space-y-3">
            <h3 class="text-xs font-semibold text-[#8a8f98] uppercase font-mono tracking-wider">
              Upcoming 5 Birthdays (Day of Week)
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              {details.upcomingDaysOfWeek.map((item) => (
                <div key={item.year} class="p-3 bg-[#141516] border border-[#23252a] rounded-[8px]">
                  <div class="font-mono font-medium text-[#f7f8f8]">{item.year}</div>
                  <div class="text-[#8a8f98] mt-0.5">{item.dayName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interesting Facts Component */}
          <InterestingFactsCard days={details.daysRemaining || 365} lang={lang} />
        </div>
      )}
    </div>
  );
}
