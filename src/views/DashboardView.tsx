import React, { useState, useMemo } from 'react';
import {
  WORLD_TRAVEL_DATA,
  DESTINATION_GROUPS,
  getOverallStats,
  getContinentStats,
  getTripTypeStats,
  getSeasonStats,
  getTransportStats,
  CONTINENTS,
} from '../data/travelData';
import {
  ContinentBarChart,
  CostCompositionChart,
  BudgetRatingScatterPlot,
  DonutBreakdownChart,
} from '../components/CustomCharts';
import {
  DollarSign,
  Star,
  Globe,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { ActiveTab } from '../types/travel';

interface DashboardViewProps {
  onNavigateToCity: (destination: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToCity,
  setActiveTab,
}) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('All');

  // Filtered dataset based on selected continent
  const filteredData = useMemo(() => {
    if (selectedContinent === 'All') return WORLD_TRAVEL_DATA;
    return WORLD_TRAVEL_DATA.filter((d) => d.continent === selectedContinent);
  }, [selectedContinent]);

  const stats = useMemo(() => getOverallStats(filteredData), [filteredData]);
  const continentStats = useMemo(() => getContinentStats(filteredData), [filteredData]);
  const tripTypeStats = useMemo(() => getTripTypeStats(filteredData), [filteredData]);
  const seasonStats = useMemo(() => getSeasonStats(filteredData), [filteredData]);
  const transportStats = useMemo(() => getTransportStats(filteredData), [filteredData]);

  // Scatter plot data
  const scatterPoints = useMemo(() => {
    return filteredData.map((d) => ({
      id: d.travelProfileId,
      name: d.destination,
      country: d.country,
      continent: d.continent,
      budget: d.estimatedDailyBudgetUSD,
      rating: d.averageTravelerRating,
      tripType: d.tripType,
    }));
  }, [filteredData]);

  // Cost composition data for trip types
  const costBreakdownData = useMemo(() => {
    return tripTypeStats.map((t) => {
      const other = t.avgDailyBudget - (t.avgHotel + t.avgFood + t.avgTransport);
      return {
        label: t.tripType,
        hotel: t.avgHotel,
        food: t.avgFood,
        transport: t.avgTransport,
        other: Math.max(0, other),
        total: t.avgDailyBudget,
      };
    });
  }, [tripTypeStats]);

  // Season donut data
  const seasonDonutData = useMemo(() => {
    const colors: Record<string, string> = {
      Spring: '#10b981',
      Summer: '#f59e0b',
      Autumn: '#f97316',
      Winter: '#3b82f6',
    };
    return seasonStats.map((s) => ({
      label: s.season,
      count: s.count,
      color: colors[s.season] || '#64748b',
    }));
  }, [seasonStats]);

  // Transport donut data
  const transportDonutData = useMemo(() => {
    const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#f43f5e', '#eab308'];
    return transportStats.map((t, idx) => ({
      label: t.transport,
      count: t.count,
      color: colors[idx % colors.length],
    }));
  }, [transportStats]);

  // Top 5 destinations by rating
  const topRated = useMemo(() => {
    return [...DESTINATION_GROUPS]
      .filter((d) => selectedContinent === 'All' || d.continent === selectedContinent)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5);
  }, [selectedContinent]);

  // Top 5 budget destinations (lowest avg daily budget)
  const mostAffordable = useMemo(() => {
    return [...DESTINATION_GROUPS]
      .filter((d) => selectedContinent === 'All' || d.continent === selectedContinent)
      .sort((a, b) => a.avgDailyBudget - b.avgDailyBudget)
      .slice(0, 5);
  }, [selectedContinent]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="border-b border-slate-200 pb-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900" style={{ textWrap: 'balance' }}>
              World Travel Dataset Analysis & Intelligence
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Analytical breakdown of 942 verified travel profiles across 157 global destinations, covering hotel rates, food, transportation, and traveler sentiment.
            </p>
          </div>

          {/* Quick continent switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            <button
              onClick={() => setSelectedContinent('All')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedContinent === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Continents
            </button>
            {CONTINENTS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedContinent(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedContinent === c
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Profiles */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Dataset Records</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {stats.totalRecords}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            {stats.uniqueDestinations} cities · {stats.uniqueCountries} countries
          </div>
        </div>

        {/* Metric 2: Avg Daily Budget */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Avg Daily Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            ${stats.avgDailyBudget}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            Range: ${stats.minDailyBudget} – ${stats.maxDailyBudget} / day
          </div>
        </div>

        {/* Metric 3: Avg Rating */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Avg Traveler Rating</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums flex items-baseline gap-1">
            <span>{stats.avgRating.toFixed(2)}</span>
            <span className="text-sm text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across all traveler profiles
          </div>
        </div>

        {/* Metric 4: Trip Duration */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Avg Recommended Trip</span>
            <Calendar className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums flex items-baseline gap-1">
            <span>{stats.avgDays}</span>
            <span className="text-sm text-slate-500 font-normal">days</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            Avg trip cost: ${stats.avgTripBudget}
          </div>
        </div>
      </div>

      {/* Row 1: Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continent Cost Comparison */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Regional Economics by Continent</h2>
              <p className="text-xs text-slate-500">Average daily budget and traveler rating by region</p>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
            >
              <span>Explore Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ContinentBarChart
            data={continentStats}
            selectedContinent={selectedContinent === 'All' ? undefined : selectedContinent}
            onSelectContinent={(c) => setSelectedContinent(c || 'All')}
          />
        </div>

        {/* Season & Transport Donut Breakdowns */}
        <div className="space-y-6">
          <DonutBreakdownChart data={seasonDonutData} title="Optimal Travel Season Distribution" />
          <DonutBreakdownChart data={transportDonutData} title="Typical Mode of Transit" />
        </div>
      </div>

      {/* Row 2: Scatter Plot Correlation */}
      <div>
        <div className="mb-2">
          <h2 className="text-base font-bold text-slate-900">Budget vs Traveler Rating Correlation</h2>
          <p className="text-xs text-slate-500">
            Interactive distribution map showing budget efficiency. Hover over any node to inspect destination metrics.
          </p>
        </div>
        <BudgetRatingScatterPlot
          data={scatterPoints}
          onSelectPoint={(pt) => onNavigateToCity(pt.name)}
        />
      </div>

      {/* Row 3: Daily Cost Structure Across Trip Types */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Itemized Cost Structure by Travel Style</h2>
            <p className="text-xs text-slate-500">
              Breakdown of daily budget into Hotel, Food, Local Transport, and Activities across all 6 travel profiles
            </p>
          </div>
          <button
            onClick={() => setActiveTab('calculator')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
          >
            <span>Plan with Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <CostCompositionChart data={costBreakdownData} />
      </div>

      {/* Row 4: Leaderboards (Highest Rated vs Best Value) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Highest Rated Destinations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Highest Rated Destinations</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {topRated.map((city, idx) => (
              <div
                key={city.destination}
                onClick={() => onNavigateToCity(city.destination)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-md cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-slate-400 w-4">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-slate-900">{city.destination}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {city.country} · {city.continent}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono tabular-nums font-semibold text-amber-700 block">
                    ★ {city.avgRating.toFixed(2)}
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-slate-500">
                    ${city.avgDailyBudget}/day
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Affordable Destinations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900">Most Budget-Friendly Destinations</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {mostAffordable.map((city, idx) => (
              <div
                key={city.destination}
                onClick={() => onNavigateToCity(city.destination)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-md cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-slate-400 w-4">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-slate-900">{city.destination}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {city.country} · {city.continent}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono tabular-nums font-semibold text-emerald-700 block">
                    ${city.avgDailyBudget}/day
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-slate-500">
                    ★ {city.avgRating.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
