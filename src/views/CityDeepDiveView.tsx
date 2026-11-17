import React, { useState } from 'react';
import { DESTINATION_GROUPS } from '../data/travelData';
import { DestinationGroup, TravelRecord } from '../types/travel';
import {
  MapPin,
  Star,
  DollarSign,
  Calendar,
  Layers,
  ArrowRightLeft,
  Bed,
  Utensils,
  Car,
  Footprints,
  Train,
  Bus,
  Compass,
  Check,
} from 'lucide-react';

interface CityDeepDiveViewProps {
  initialCity?: string;
}

export const CityDeepDiveView: React.FC<CityDeepDiveViewProps> = ({ initialCity = 'Tokyo' }) => {
  const [selectedCityA, setSelectedCityA] = useState<string>(initialCity);
  const [selectedCityB, setSelectedCityB] = useState<string>('Paris');
  const [compareMode, setCompareMode] = useState<boolean>(false);

  const cityA = DESTINATION_GROUPS.find((g) => g.destination === selectedCityA) || DESTINATION_GROUPS[0];
  const cityB = DESTINATION_GROUPS.find((g) => g.destination === selectedCityB) || DESTINATION_GROUPS[1];

  const getTransportIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'walking':
        return <Footprints className="w-3.5 h-3.5 text-slate-500" />;
      case 'train':
        return <Train className="w-3.5 h-3.5 text-slate-500" />;
      case 'bus':
        return <Bus className="w-3.5 h-3.5 text-slate-500" />;
      case 'rental car':
        return <Car className="w-3.5 h-3.5 text-slate-500" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* View Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Destination Deep-Dive & Profile Comparison
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Examine the 6 distinct travel profiles per city or compare two world destinations head-to-head.
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setCompareMode(false)}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
              !compareMode
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Single Destination View
          </button>
          <button
            onClick={() => setCompareMode(true)}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              compareMode
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Compare Two Cities</span>
          </button>
        </div>
      </div>

      {/* City Selectors */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Primary Destination
            </label>
            <select
              value={selectedCityA}
              onChange={(e) => setSelectedCityA(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:bg-white focus:outline-indigo-500"
            >
              {DESTINATION_GROUPS.map((g) => (
                <option key={g.destination} value={g.destination}>
                  {g.destination}, {g.country} ({g.continent})
                </option>
              ))}
            </select>
          </div>

          {compareMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Comparison Destination
              </label>
              <select
                value={selectedCityB}
                onChange={(e) => setSelectedCityB(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:bg-white focus:outline-indigo-500"
              >
                {DESTINATION_GROUPS.map((g) => (
                  <option key={g.destination} value={g.destination}>
                    {g.destination}, {g.country} ({g.continent})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Mode A: Single Destination Deep Dive */}
      {!compareMode && (
        <div className="space-y-6">
          {/* Destination Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{cityA.country}</span>
                  <span>·</span>
                  <span>{cityA.continent}</span>
                  <span>·</span>
                  <span className="font-mono">{cityA.latitude.toFixed(4)}°, {cityA.longitude.toFixed(4)}°</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">{cityA.destination}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                  <span>Interest: <strong className="text-slate-800">{cityA.mainInterest}</strong></span>
                  <span>·</span>
                  <span>Optimal Season: <strong className="text-slate-800">{cityA.bestSeason}</strong></span>
                  <span>·</span>
                  <span>Profiles in Dataset: <strong className="text-slate-800">6 travel styles</strong></span>
                </div>
              </div>

              {/* High-level figures */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono tabular-nums">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">Avg Daily</span>
                  <span className="text-lg font-bold text-slate-900">${cityA.avgDailyBudget}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">Traveler Rating</span>
                  <span className="text-lg font-bold text-amber-600">★ {cityA.avgRating.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">Budget Range</span>
                  <span className="text-lg font-bold text-slate-900">${cityA.minBudget}–${cityA.maxBudget}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">Avg Days</span>
                  <span className="text-lg font-bold text-slate-900">{cityA.avgDays}d</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Grid of All 6 Profiles */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
              All 6 Travel Profiles for {cityA.destination}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cityA.profiles.map((profile) => (
                <div
                  key={profile.travelProfileId}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-bold text-base text-slate-900">{profile.tripType}</span>
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {profile.travelProfileId}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between py-2 border-y border-slate-100 mb-3">
                      <div>
                        <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                          ${profile.estimatedDailyBudgetUSD}
                        </span>
                        <span className="text-xs text-slate-500 font-sans ml-1">/ day</span>
                      </div>
                      <span className="text-xs font-mono tabular-nums font-semibold text-amber-700">
                        ★ {profile.averageTravelerRating.toFixed(1)} rating
                      </span>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-2 text-xs font-mono tabular-nums text-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 font-sans">
                          <Bed className="w-3.5 h-3.5" />
                          <span>Hotel / night:</span>
                        </div>
                        <span className="font-semibold text-slate-800">${profile.estimatedHotelPerNightUSD}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 font-sans">
                          <Utensils className="w-3.5 h-3.5" />
                          <span>Food / day:</span>
                        </div>
                        <span className="font-semibold text-slate-800">${profile.estimatedFoodPerDayUSD}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 font-sans">
                          {getTransportIcon(profile.typicalTransport)}
                          <span>Transit / day:</span>
                        </div>
                        <span className="font-semibold text-slate-800">${profile.estimatedLocalTransportPerDayUSD}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-sans">Transit mode:</span>
                        <span className="font-sans font-medium text-slate-800">{profile.typicalTransport}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{profile.recommendedDays} days trip</span>
                    <span className="font-mono tabular-nums font-bold text-indigo-700">
                      ${profile.estimatedTripBudgetUSD} total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode B: Head-to-Head Comparison */}
      {compareMode && (
        <div className="space-y-6">
          {/* Comparison Matrix Summary */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-800">
              Head-to-Head Macro Comparison
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="p-3 text-left w-1/3">Metric</th>
                    <th className="p-3 text-left w-1/3 text-indigo-900 bg-indigo-50/40 font-bold text-sm">
                      {cityA.destination} ({cityA.country})
                    </th>
                    <th className="p-3 text-left w-1/3 text-emerald-900 bg-emerald-50/40 font-bold text-sm">
                      {cityB.destination} ({cityB.country})
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Continent</td>
                    <td className="p-3 font-semibold text-slate-800 bg-indigo-50/20">{cityA.continent}</td>
                    <td className="p-3 font-semibold text-slate-800 bg-emerald-50/20">{cityB.continent}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Average Daily Budget</td>
                    <td className="p-3 font-mono tabular-nums font-bold text-slate-900 bg-indigo-50/20">
                      ${cityA.avgDailyBudget} / day
                    </td>
                    <td className="p-3 font-mono tabular-nums font-bold text-slate-900 bg-emerald-50/20">
                      ${cityB.avgDailyBudget} / day{' '}
                      <span className="text-[11px] font-normal text-slate-500">
                        ({cityB.avgDailyBudget > cityA.avgDailyBudget ? `+$${cityB.avgDailyBudget - cityA.avgDailyBudget}` : `-$${cityA.avgDailyBudget - cityB.avgDailyBudget}`})
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Average Traveler Rating</td>
                    <td className="p-3 font-mono tabular-nums font-semibold text-amber-700 bg-indigo-50/20">
                      ★ {cityA.avgRating.toFixed(2)}
                    </td>
                    <td className="p-3 font-mono tabular-nums font-semibold text-amber-700 bg-emerald-50/20">
                      ★ {cityB.avgRating.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Daily Budget Range</td>
                    <td className="p-3 font-mono tabular-nums text-slate-800 bg-indigo-50/20">
                      ${cityA.minBudget} – ${cityA.maxBudget}
                    </td>
                    <td className="p-3 font-mono tabular-nums text-slate-800 bg-emerald-50/20">
                      ${cityB.minBudget} – ${cityB.maxBudget}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Optimal Travel Season</td>
                    <td className="p-3 font-medium text-slate-800 bg-indigo-50/20">{cityA.bestSeason}</td>
                    <td className="p-3 font-medium text-slate-800 bg-emerald-50/20">{cityB.bestSeason}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Main Travel Interest</td>
                    <td className="p-3 font-medium text-slate-800 bg-indigo-50/20">{cityA.mainInterest}</td>
                    <td className="p-3 font-medium text-slate-800 bg-emerald-50/20">{cityB.mainInterest}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Coordinates</td>
                    <td className="p-3 font-mono text-slate-500 bg-indigo-50/20">
                      {cityA.latitude.toFixed(2)}°, {cityA.longitude.toFixed(2)}°
                    </td>
                    <td className="p-3 font-mono text-slate-500 bg-emerald-50/20">
                      {cityB.latitude.toFixed(2)}°, {cityB.longitude.toFixed(2)}°
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Style by Style Comparison */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
              Travel Style Profile Breakdown Comparison
            </h3>
            <div className="space-y-3">
              {cityA.profiles.map((profA) => {
                const profB = cityB.profiles.find((p) => p.tripType === profA.tripType) || cityB.profiles[0];

                return (
                  <div
                    key={profA.tripType}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs"
                  >
                    <div className="font-bold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span>{profA.tripType}</span>
                      <span className="text-xs font-mono text-slate-400">
                        {profA.travelProfileId} vs {profB.travelProfileId}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono tabular-nums">
                      {/* City A Side */}
                      <div className="p-3 bg-indigo-50/40 rounded-lg border border-indigo-100 space-y-1.5">
                        <div className="font-bold font-sans text-indigo-950 text-sm mb-1">
                          {cityA.destination}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">Daily Budget:</span>
                          <span className="font-bold text-slate-900">${profA.estimatedDailyBudgetUSD}/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">Hotel / night:</span>
                          <span>${profA.estimatedHotelPerNightUSD}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">Food / day:</span>
                          <span>${profA.estimatedFoodPerDayUSD}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">Transit / day:</span>
                          <span>${profA.estimatedLocalTransportPerDayUSD}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-indigo-100 text-indigo-900 font-sans">
                          <span>Recommended trip:</span>
                          <span className="font-mono font-bold">${profA.estimatedTripBudgetUSD} ({profA.recommendedDays}d)</span>
                        </div>
                      </div>

                      {/* City B Side */}
                      <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100 space-y-1.5">
                        <div className="font-bold font-sans text-emerald-950 text-sm mb-1">
                          {cityB.destination}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">Daily Budget:</span>
                          <span className="font-bold text-slate-900">${profB.estimatedDailyBudgetUSD}/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">Hotel / night:</span>
                          <span>${profB.estimatedHotelPerNightUSD}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">Food / day:</span>
                          <span>${profB.estimatedFoodPerDayUSD}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">Transit / day:</span>
                          <span>${profB.estimatedLocalTransportPerDayUSD}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-emerald-100 text-emerald-900 font-sans">
                          <span>Recommended trip:</span>
                          <span className="font-mono font-bold">${profB.estimatedTripBudgetUSD} ({profB.recommendedDays}d)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
