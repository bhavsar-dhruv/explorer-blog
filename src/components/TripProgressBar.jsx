import { getCurrentDay, getDayProgress, getCurrentLocation, TOTAL_DAYS, isWithinTrip } from '../utils/tripConfig';

export default function TripProgressBar() {
  const now = new Date();
  const day = getCurrentDay(now);
  const progress = getDayProgress(now);
  const location = getCurrentLocation(now);
  const withinTrip = isWithinTrip(now);
  const daysLeft = Math.max(0, TOTAL_DAYS - day);

  return (
    <div className="bg-gradient-to-br from-deep-indigo to-deep-indigo-dark rounded-2xl p-4 text-cream shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-heading text-lg font-bold">
            {withinTrip ? `Day ${day} of ${TOTAL_DAYS}` : day <= 0 ? 'Journey Begins Soon' : 'Journey Complete'}
          </h2>
          {location && (
            <p className="text-sunset-orange text-sm mt-0.5">
              📍 {location.place}
              <span className="text-cream/50 text-xs ml-2">{location.region}</span>
            </p>
          )}
        </div>
        <div className="text-right">
          {withinTrip && (
            <p className="text-xs text-cream/60">{daysLeft} days left</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 bg-cream/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${Math.max(progress, 2)}%`,
            background: 'linear-gradient(90deg, #C1440E, #D4A03C, #E8A87C)',
          }}
        />
      </div>

      <div className="flex justify-between mt-1.5 text-[10px] font-mono text-cream/40">
        <span>Delhi</span>
        <span>Goa</span>
      </div>
    </div>
  );
}
