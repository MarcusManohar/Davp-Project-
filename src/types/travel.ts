export interface TravelRecord {
  destination: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  tripType: string;
  mainInterest: string;
  bestSeason: string;
  recommendedDays: number;
  estimatedDailyBudgetUSD: number;
  estimatedTripBudgetUSD: number;
  averageTravelerRating: number;
  typicalTransport: string;
  estimatedHotelPerNightUSD: number;
  estimatedFoodPerDayUSD: number;
  estimatedLocalTransportPerDayUSD: number;
  travelProfileId: string;
}

export interface FilterState {
  search: string;
  continent: string;
  country: string;
  tripType: string;
  mainInterest: string;
  bestSeason: string;
  typicalTransport: string;
  minDailyBudget: number;
  maxDailyBudget: number;
  minRating: number;
}

export type ActiveTab = 'dashboard' | 'map' | 'table' | 'deepdive' | 'calculator' | 'python' | 'documentation';

export interface DestinationGroup {
  destination: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  mainInterest: string;
  bestSeason: string;
  profiles: TravelRecord[];
  avgDailyBudget: number;
  avgRating: number;
  avgDays: number;
  minBudget: number;
  maxBudget: number;
}
