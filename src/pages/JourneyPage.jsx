import JourneyTimeline from '../components/JourneyTimeline';
import { getCurrentDay, TOTAL_DAYS, ITINERARY } from '../utils/tripConfig';

export default function JourneyPage() {
  const currentDay = getCurrentDay();
  const visitedPlaces = ITINERARY.filter((_, i) => {
    let cumDays = 0;
    for (let j = 0; j <= i; j++) cumDays += Math.max(ITINERARY[j].days, 1);
    return currentDay >= cumDays - ITINERARY[i].days;
  }).length;

  return (
    <div className="pb-safe">
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-heading text-2xl font-bold text-deep-indigo">The Journey</h1>
        <p className="text-xs text-earth-brown/50 font-mono mt-1">22 stops · 42 days · 1 backpack</p>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Day', value: Math.min(currentDay, TOTAL_DAYS), sub: `of ${TOTAL_DAYS}` },
          { label: 'Places', value: Math.min(visitedPlaces, ITINERARY.length), sub: `of ${ITINERARY.length}` },
          { label: 'Regions', value: [...new Set(ITINERARY.slice(0, visitedPlaces).map(s => s.region))].length, sub: 'explored' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-3 text-center border border-sunset-orange/10">
            <p className="text-2xl font-heading font-bold text-terracotta">{stat.value}</p>
            <p className="text-[10px] font-mono text-earth-brown/40">{stat.sub}</p>
            <p className="text-xs text-earth-brown/60 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="px-4 mt-6">
        <h2 className="font-heading text-lg font-semibold text-deep-indigo mb-4">Route Timeline</h2>
        <JourneyTimeline />
      </div>
    </div>
  );
}
