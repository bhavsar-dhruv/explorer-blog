import { format } from 'date-fns';
import { getTripDayForDate, TOTAL_DAYS } from '../utils/tripConfig';

export default function Timestamp({ date, tripDay, compact }) {
  if (!date) return null;

  const d = new Date(date);
  const day = tripDay || getTripDayForDate(d);
  const formatted = format(d, "d MMM yyyy · h:mm a");

  if (compact) {
    return (
      <time className="text-xs font-mono text-earth-brown/50" dateTime={d.toISOString()}>
        Day {day} · {format(d, "d MMM · h:mm a")}
      </time>
    );
  }

  return (
    <time className="inline-flex items-center gap-2 text-sm font-mono text-earth-brown/70 bg-cream/60 px-3 py-1.5 rounded-lg" dateTime={d.toISOString()}>
      <span className="text-terracotta font-semibold">Day {Math.min(day, TOTAL_DAYS)}</span>
      <span className="text-earth-brown/30">·</span>
      <span>{formatted} IST</span>
    </time>
  );
}
