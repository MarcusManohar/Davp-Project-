import { WORLD_TRAVEL_DATA } from './dataset';
import type { TravelRecord, DestinationGroup, FilterState } from '../types/travel';

export { WORLD_TRAVEL_DATA };
export type { TravelRecord };

// Get all unique values for dropdowns
export const CONTINENTS: string[] = Array.from(new Set(WORLD_TRAVEL_DATA.map(d => d.continent))).sort();
export const COUNTRIES: string[] = Array.from(new Set(WORLD_TRAVEL_DATA.map(d => d.country))).sort();
export const TRIP_TYPES: string[] = Array.from(new Set(WORLD_TRAVEL_DATA.map(d => d.tripType))).sort();
export const MAIN_INTERESTS: string[] = Array.from(new Set(WORLD_TRAVEL_DATA.map(d => d.mainInterest))).sort();
export const BEST_SEASONS: string[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
export const TYPICAL_TRANSPORTS: string[] = Array.from(new Set(WORLD_TRAVEL_DATA.map(d => d.typicalTransport))).sort();

// Group records by unique destination
export const DESTINATION_GROUPS: DestinationGroup[] = (() => {
  const map = new Map<string, TravelRecord[]>();
  for (const r of WORLD_TRAVEL_DATA) {
    const list = map.get(r.destination) || [];
    list.push(r);
    map.set(r.destination, list);
  }

  const groups: DestinationGroup[] = [];
  map.forEach((profiles, destination) => {
    const first = profiles[0];
    const totalDaily = profiles.reduce((acc, p) => acc + p.estimatedDailyBudgetUSD, 0);
    const totalRating = profiles.reduce((acc, p) => acc + p.averageTravelerRating, 0);
    const totalDays = profiles.reduce((acc, p) => acc + p.recommendedDays, 0);
    const budgets = profiles.map(p => p.estimatedDailyBudgetUSD);

    groups.push({
      destination,
      country: first.country,
      continent: first.continent,
      latitude: first.latitude,
      longitude: first.longitude,
      mainInterest: first.mainInterest,
      bestSeason: first.bestSeason,
      profiles,
      avgDailyBudget: Math.round(totalDaily / profiles.length),
      avgRating: Number((totalRating / profiles.length).toFixed(2)),
      avgDays: Math.round(totalDays / profiles.length),
      minBudget: Math.min(...budgets),
      maxBudget: Math.max(...budgets)
    });
  });

  return groups.sort((a, b) => a.destination.localeCompare(b.destination));
})();

// Calculate overall summary stats
export function getOverallStats(data: TravelRecord[] = WORLD_TRAVEL_DATA) {
  const total = data.length;
  if (total === 0) {
    return {
      totalRecords: 0,
      uniqueDestinations: 0,
      uniqueCountries: 0,
      avgDailyBudget: 0,
      avgTripBudget: 0,
      avgRating: 0,
      avgDays: 0,
      minDailyBudget: 0,
      maxDailyBudget: 0,
      avgHotelNight: 0,
      avgFoodDay: 0,
      avgTransportDay: 0
    };
  }

  const uniqueDest = new Set(data.map(d => d.destination)).size;
  const uniqueCtry = new Set(data.map(d => d.country)).size;
  const dailyBudgets = data.map(d => d.estimatedDailyBudgetUSD);
  const tripBudgets = data.map(d => d.estimatedTripBudgetUSD);
  const ratings = data.map(d => d.averageTravelerRating);
  const days = data.map(d => d.recommendedDays);
  const hotels = data.map(d => d.estimatedHotelPerNightUSD);
  const foods = data.map(d => d.estimatedFoodPerDayUSD);
  const transports = data.map(d => d.estimatedLocalTransportPerDayUSD);

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  return {
    totalRecords: total,
    uniqueDestinations: uniqueDest,
    uniqueCountries: uniqueCtry,
    avgDailyBudget: Math.round(sum(dailyBudgets) / total),
    avgTripBudget: Math.round(sum(tripBudgets) / total),
    avgRating: Number((sum(ratings) / total).toFixed(2)),
    avgDays: Number((sum(days) / total).toFixed(1)),
    minDailyBudget: Math.min(...dailyBudgets),
    maxDailyBudget: Math.max(...dailyBudgets),
    avgHotelNight: Math.round(sum(hotels) / total),
    avgFoodDay: Math.round(sum(foods) / total),
    avgTransportDay: Math.round(sum(transports) / total)
  };
}

// Stats by continent
export function getContinentStats(data: TravelRecord[] = WORLD_TRAVEL_DATA) {
  const map = new Map<string, TravelRecord[]>();
  for (const r of data) {
    const list = map.get(r.continent) || [];
    list.push(r);
    map.set(r.continent, list);
  }

  return Array.from(map.entries()).map(([continent, items]) => {
    const stats = getOverallStats(items);
    return {
      continent,
      count: items.length,
      destinations: stats.uniqueDestinations,
      avgDailyBudget: stats.avgDailyBudget,
      avgTripBudget: stats.avgTripBudget,
      avgRating: stats.avgRating,
      avgHotel: stats.avgHotelNight,
      avgFood: stats.avgFoodDay,
      avgTransport: stats.avgTransportDay
    };
  }).sort((a, b) => b.avgDailyBudget - a.avgDailyBudget);
}

// Stats by trip type
export function getTripTypeStats(data: TravelRecord[] = WORLD_TRAVEL_DATA) {
  const map = new Map<string, TravelRecord[]>();
  for (const r of data) {
    const list = map.get(r.tripType) || [];
    list.push(r);
    map.set(r.tripType, list);
  }

  return Array.from(map.entries()).map(([tripType, items]) => {
    const stats = getOverallStats(items);
    return {
      tripType,
      count: items.length,
      avgDailyBudget: stats.avgDailyBudget,
      avgTripBudget: stats.avgTripBudget,
      avgRating: stats.avgRating,
      avgDays: stats.avgDays,
      avgHotel: stats.avgHotelNight,
      avgFood: stats.avgFoodDay,
      avgTransport: stats.avgTransportDay
    };
  }).sort((a, b) => b.avgDailyBudget - a.avgDailyBudget);
}

// Stats by season
export function getSeasonStats(data: TravelRecord[] = WORLD_TRAVEL_DATA) {
  const map = new Map<string, TravelRecord[]>();
  for (const r of data) {
    const list = map.get(r.bestSeason) || [];
    list.push(r);
    map.set(r.bestSeason, list);
  }

  return BEST_SEASONS.map(season => {
    const items = map.get(season) || [];
    const stats = getOverallStats(items);
    return {
      season,
      count: items.length,
      avgDailyBudget: stats.avgDailyBudget,
      avgRating: stats.avgRating
    };
  });
}

// Stats by transport mode
export function getTransportStats(data: TravelRecord[] = WORLD_TRAVEL_DATA) {
  const map = new Map<string, TravelRecord[]>();
  for (const r of data) {
    const list = map.get(r.typicalTransport) || [];
    list.push(r);
    map.set(r.typicalTransport, list);
  }

  return Array.from(map.entries()).map(([transport, items]) => {
    const stats = getOverallStats(items);
    return {
      transport,
      count: items.length,
      avgDailyBudget: stats.avgDailyBudget,
      avgRating: stats.avgRating
    };
  }).sort((a, b) => b.count - a.count);
}

// Filter dataset
export function filterRecords(data: TravelRecord[], filters: FilterState): TravelRecord[] {
  const searchLower = filters.search.trim().toLowerCase();

  return data.filter(record => {
    if (searchLower) {
      const match =
        record.destination.toLowerCase().includes(searchLower) ||
        record.country.toLowerCase().includes(searchLower) ||
        record.travelProfileId.toLowerCase().includes(searchLower) ||
        record.mainInterest.toLowerCase().includes(searchLower);
      if (!match) return false;
    }

    if (filters.continent && record.continent !== filters.continent) return false;
    if (filters.country && record.country !== filters.country) return false;
    if (filters.tripType && record.tripType !== filters.tripType) return false;
    if (filters.mainInterest && record.mainInterest !== filters.mainInterest) return false;
    if (filters.bestSeason && record.bestSeason !== filters.bestSeason) return false;
    if (filters.typicalTransport && record.typicalTransport !== filters.typicalTransport) return false;

    if (record.estimatedDailyBudgetUSD < filters.minDailyBudget) return false;
    if (record.estimatedDailyBudgetUSD > filters.maxDailyBudget) return false;
    if (record.averageTravelerRating < filters.minRating) return false;

    return true;
  });
}

// Convert records to CSV format and trigger download
export function exportToCSV(records: TravelRecord[], filename = 'world_travel_dataset_export.csv') {
  const headers = [
    'Destination',
    'Country',
    'Continent',
    'Latitude',
    'Longitude',
    'Trip_Type',
    'Main_Interest',
    'Best_Season',
    'Recommended_Days',
    'Estimated_Daily_Budget_USD',
    'Estimated_Trip_Budget_USD',
    'Average_Traveler_Rating',
    'Typical_Transport',
    'Estimated_Hotel_Per_Night_USD',
    'Estimated_Food_Per_Day_USD',
    'Estimated_Local_Transport_Per_Day_USD',
    'Travel_Profile_ID'
  ];

  const escapeCSV = (val: string | number) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = records.map(r => [
    escapeCSV(r.destination),
    escapeCSV(r.country),
    escapeCSV(r.continent),
    r.latitude,
    r.longitude,
    escapeCSV(r.tripType),
    escapeCSV(r.mainInterest),
    escapeCSV(r.bestSeason),
    r.recommendedDays,
    r.estimatedDailyBudgetUSD,
    r.estimatedTripBudgetUSD,
    r.averageTravelerRating,
    escapeCSV(r.typicalTransport),
    r.estimatedHotelPerNightUSD,
    r.estimatedFoodPerDayUSD,
    r.estimatedLocalTransportPerDayUSD,
    escapeCSV(r.travelProfileId)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
