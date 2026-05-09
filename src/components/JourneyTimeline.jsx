import { ITINERARY, getCurrentDay, REGION_COLORS } from '../utils/tripConfig';
import { MapPin, Check, Circle } from 'lucide-react';

export default function JourneyTimeline() {
  const currentDay = getCurrentDay();

  // Calculate cumulative days for timeline
  let cumDays = 0;
  const stops = ITINERARY.map((stop) => {
    cumDays += Math.max(stop.days, 1);
    const status = currentDay >= cumDays ? 'past' : currentDay >= cumDays - stop.days ? 'current' : 'future';
    return { ...stop, cumDays, status };
  });

  return (
    <div className="space-y-0">
      {stops.map((stop, i) => {
        const regionColor = REGION_COLORS[stop.region] || REGION_COLORS['North'];
        const isCurrent = stop.status === 'current';
        const isPast = stop.status === 'past';

        return (
          <div key={stop.id} className={`flex gap-3 ${isCurrent ? 'animate-fade-in' : ''}`}>
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center w-8 flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                isCurrent ? 'border-terracotta bg-terracotta text-cream scale-110' :
                isPast ? 'border-saffron bg-saffron/20 text-saffron' :
                'border-earth-brown/20 bg-off-white text-earth-brown/30'
              }`}>
                {isPast ? <Check size={12} /> : isCurrent ? <MapPin size={12} /> : <Circle size={8} />}
              </div>
              {i < stops.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[24px] ${isPast ? 'bg-saffron/40' : 'bg-earth-brown/10'}`} />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-4 ${isCurrent ? '' : isPast ? 'opacity-70' : 'opacity-40'}`}>
              <div className="flex items-center gap-2">
                <h3 className={`font-heading font-semibold ${isCurrent ? 'text-lg text-deep-indigo' : 'text-sm text-charcoal'}`}>
                  {stop.place}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${regionColor.bg} ${regionColor.text}`}>
                  {stop.region}
                </span>
              </div>
              <p className="text-xs text-earth-brown/60 mt-0.5">
                {stop.entry} → {stop.exit}
              </p>
              {stop.days > 0 && (
                <p className="text-xs text-earth-brown/40 font-mono">{stop.days} day{stop.days > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
