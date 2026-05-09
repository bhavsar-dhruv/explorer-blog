// Full itinerary for the 42-day Explorer's Fellowship journey across India
// Trip: May 13, 2026 → June 24, 2026

export const TRIP_START = new Date(2026, 4, 13); // May 13, 2026 (months are 0-indexed)
export const TRIP_END = new Date(2026, 5, 24);   // June 24, 2026
export const TOTAL_DAYS = 42;

export const ITINERARY = [
  { id: 1,  place: 'Delhi',      days: 2, entry: '13 May - Morning',    exit: '14 May - Night',     region: 'North' },
  { id: 2,  place: 'Manali',     days: 4, entry: '15 May - Morning',    exit: '18 May - Evening',   region: 'North' },
  { id: 3,  place: 'Dehradun',   days: 1, entry: '19 May - Morning',    exit: '20 May - Morning',   region: 'North' },
  { id: 4,  place: 'Mussoorie',  days: 2, entry: '20 May - Afternoon',  exit: '22 May - Morning',   region: 'North' },
  { id: 5,  place: 'Rishikesh',  days: 3, entry: '22 May - Afternoon',  exit: '25 May - Afternoon', region: 'North' },
  { id: 6,  place: 'Haridwar',   days: 1, entry: '25 May - Evening',    exit: '25 May - Night',     region: 'North' },
  { id: 7,  place: 'Varanasi',   days: 2, entry: '26 May - Afternoon',  exit: '27 May - Evening',   region: 'North' },
  { id: 8,  place: 'Siliguri',   days: 1, entry: '28 May - Morning',    exit: '28 May - Afternoon', region: 'East' },
  { id: 9,  place: 'Gangtok',    days: 3, entry: '28 May - Night',      exit: '31 May - Afternoon', region: 'North-East' },
  { id: 10, place: 'Siliguri',   days: 0, entry: '31 May - Evening',    exit: '1 Jun - Night',      region: 'East' },
  { id: 11, place: 'Guwahati',   days: 1, entry: '2 Jun - Morning',     exit: '2 Jun - Morning',    region: 'North-East' },
  { id: 12, place: 'Meghalaya',  days: 4, entry: '2 Jun - Afternoon',   exit: '5 Jun - Evening',    region: 'North-East' },
  { id: 13, place: 'Guwahati',   days: 1, entry: '5 Jun - Night',       exit: '6 Jun - Afternoon',  region: 'North-East' },
  { id: 14, place: 'Kolkata',    days: 2, entry: '7 Jun - Morning',     exit: '8 Jun - Evening',    region: 'East' },
  { id: 15, place: 'Vizag',      days: 3, entry: '9 Jun - Afternoon',   exit: '11 Jun - Evening',   region: 'South' },
  { id: 16, place: 'Chennai',    days: 2, entry: '12 Jun - Morning',    exit: '13 Jun - Evening',   region: 'South' },
  { id: 17, place: 'Kochi',      days: 2, entry: '14 Jun - Morning',    exit: '15 Jun - Night',     region: 'South' },
  { id: 18, place: 'Alleppey',   days: 2, entry: '15 Jun - Night',      exit: '17 Jun - Afternoon', region: 'South' },
  { id: 19, place: 'Munnar',     days: 2, entry: '17 Jun - Evening',    exit: '19 Jun - Evening',   region: 'South' },
  { id: 20, place: 'Kochi',      days: 0, entry: '20 Jun - Night',      exit: '20 Jun - Night',     region: 'South' },
  { id: 21, place: 'Goa',        days: 3, entry: '21 Jun - Morning',    exit: '24 Jun - Morning',   region: 'West' },
];

// Date ranges for each stop (for getCurrentLocation)
const STOP_DATES = [
  { start: new Date(2026, 4, 13), end: new Date(2026, 4, 14, 23, 59) }, // Delhi
  { start: new Date(2026, 4, 15), end: new Date(2026, 4, 18, 23, 59) }, // Manali
  { start: new Date(2026, 4, 19), end: new Date(2026, 4, 20, 8) },      // Dehradun
  { start: new Date(2026, 4, 20, 12), end: new Date(2026, 4, 22, 8) },  // Mussoorie
  { start: new Date(2026, 4, 22, 12), end: new Date(2026, 4, 25, 15) }, // Rishikesh
  { start: new Date(2026, 4, 25, 17), end: new Date(2026, 4, 25, 23, 59) }, // Haridwar
  { start: new Date(2026, 4, 26, 12), end: new Date(2026, 4, 27, 20) }, // Varanasi
  { start: new Date(2026, 4, 28), end: new Date(2026, 4, 28, 15) },     // Siliguri
  { start: new Date(2026, 4, 28, 20), end: new Date(2026, 4, 31, 15) }, // Gangtok
  { start: new Date(2026, 4, 31, 17), end: new Date(2026, 5, 1, 23, 59) }, // Siliguri
  { start: new Date(2026, 5, 2), end: new Date(2026, 5, 2, 10) },       // Guwahati
  { start: new Date(2026, 5, 2, 12), end: new Date(2026, 5, 5, 20) },   // Meghalaya
  { start: new Date(2026, 5, 5, 21), end: new Date(2026, 5, 6, 15) },   // Guwahati
  { start: new Date(2026, 5, 7), end: new Date(2026, 5, 8, 20) },       // Kolkata
  { start: new Date(2026, 5, 9, 12), end: new Date(2026, 5, 11, 20) },  // Vizag
  { start: new Date(2026, 5, 12), end: new Date(2026, 5, 13, 20) },     // Chennai
  { start: new Date(2026, 5, 14), end: new Date(2026, 5, 15, 23) },     // Kochi
  { start: new Date(2026, 5, 15, 23), end: new Date(2026, 5, 17, 15) }, // Alleppey
  { start: new Date(2026, 5, 17, 18), end: new Date(2026, 5, 19, 20) }, // Munnar
  { start: new Date(2026, 5, 20, 21), end: new Date(2026, 5, 20, 23, 59) }, // Kochi
  { start: new Date(2026, 5, 21), end: new Date(2026, 5, 24, 8) },      // Goa
];

export function getCurrentDay(now = new Date()) {
  const diffMs = now - TRIP_START;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(0, Math.min(diffDays, TOTAL_DAYS));
}

export function getDayProgress(now = new Date()) {
  const day = getCurrentDay(now);
  return Math.min((day / TOTAL_DAYS) * 100, 100);
}

export function getCurrentLocation(now = new Date()) {
  for (let i = 0; i < STOP_DATES.length; i++) {
    if (now >= STOP_DATES[i].start && now <= STOP_DATES[i].end) {
      return ITINERARY[i];
    }
  }
  // Between stops — return the last passed stop or the next upcoming
  const day = getCurrentDay(now);
  if (day <= 0) return ITINERARY[0];
  if (day > TOTAL_DAYS) return ITINERARY[ITINERARY.length - 1];
  
  // Find nearest stop
  for (let i = STOP_DATES.length - 1; i >= 0; i--) {
    if (now >= STOP_DATES[i].start) {
      return ITINERARY[i];
    }
  }
  return ITINERARY[0];
}

export function isWithinTrip(now = new Date()) {
  return now >= TRIP_START && now <= TRIP_END;
}

export function getTripDayForDate(date) {
  const d = new Date(date);
  const diffMs = d - TRIP_START;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(diffDays, TOTAL_DAYS));
}

export const REGION_COLORS = {
  'North':      { bg: 'bg-deep-indigo',   text: 'text-cream',    hex: '#1B3A4B' },
  'South':      { bg: 'bg-terracotta',    text: 'text-cream',    hex: '#C1440E' },
  'East':       { bg: 'bg-saffron',       text: 'text-charcoal', hex: '#D4A03C' },
  'West':       { bg: 'bg-sunset-orange', text: 'text-charcoal', hex: '#E8A87C' },
  'North-East': { bg: 'bg-earth-brown',   text: 'text-cream',    hex: '#5C4033' },
};
