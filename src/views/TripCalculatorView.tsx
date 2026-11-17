import React, { useState, useMemo } from 'react';
import {
  DESTINATION_GROUPS,
  TRIP_TYPES,
  WORLD_TRAVEL_DATA,
  TravelRecord,
} from '../data/travelData';
import {
  Calculator,
  Calendar,
  DollarSign,
  Users,
  Compass,
  Bed,
  Utensils,
  Car,
  Footprints,
  Train,
  Bus,
  Check,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';

export const TripCalculatorView: React.FC = () => {
  const [destination, setDestination] = useState<string>('Tokyo');
  const [tripType, setTripType] = useState<string>('Food & Local Life');
  const [travelers, setTravelers] = useState<number>(1);
  const [customDays, setCustomDays] = useState<number | null>(null);

  // Find exact dataset record
  const exactRecord = useMemo(() => {
    return (
      WORLD_TRAVEL_DATA.find(
        (r) => r.destination === destination && r.tripType === tripType
      ) || WORLD_TRAVEL_DATA[0]
    );
  }, [destination, tripType]);

  const days = customDays !== null ? customDays : exactRecord.recommendedDays;

  // Computations
  const dailyPerPerson = exactRecord.estimatedDailyBudgetUSD;
  const hotelPerNight = exactRecord.estimatedHotelPerNightUSD;
  const foodPerDay = exactRecord.estimatedFoodPerDayUSD;
  const transitPerDay = exactRecord.estimatedLocalTransportPerDayUSD;
  const miscPerDay = Math.max(
    0,
    dailyPerPerson - (hotelPerNight + foodPerDay + transitPerDay)
  );

  const totalAccommodation = hotelPerNight * days; // assuming room shared per booking or profile rate
  const totalFood = foodPerDay * days * travelers;
  const totalTransit = transitPerDay * days * travelers;
  const totalMisc = miscPerDay * days * travelers;
  const grandTotal = (dailyPerPerson * days) * travelers;

  const resetToRecommendedDays = () => {
    setCustomDays(null);
  };

  const getTransportIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'walking':
        return <Footprints className="w-4 h-4 text-slate-500" />;
      case 'train':
        return <Train className="w-4 h-4 text-slate-500" />;
      case 'bus':
        return <Bus className="w-4 h-4 text-slate-500" />;
      case 'rental car':
        return <Car className="w-4 h-4 text-slate-500" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* View Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Dataset Trip Budget Calculator & Planner
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate realistic travel expenditure estimates grounded purely in the World Travel Dataset formulas and benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Parameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Trip Parameters</span>
          </h2>

          {/* Destination */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destination City (157 available)
            </label>
            <select
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setCustomDays(null);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-indigo-500"
            >
              {DESTINATION_GROUPS.map((g) => (
                <option key={g.destination} value={g.destination}>
                  {g.destination}, {g.country} ({g.continent})
                </option>
              ))}
            </select>
          </div>

          {/* Trip Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Travel Style Profile
            </label>
            <select
              value={tripType}
              onChange={(e) => {
                setTripType(e.target.value);
                setCustomDays(null);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-indigo-500"
            >
              {TRIP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Duration in Days */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">Duration (Days):</span>
              <span className="font-mono tabular-nums font-bold text-indigo-600">
                {days} days{' '}
                {days === exactRecord.recommendedDays && (
                  <span className="text-[10px] text-slate-400 font-normal">(recommended)</span>
                )}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="21"
              value={days}
              onChange={(e) => setCustomDays(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            {days !== exactRecord.recommendedDays && (
              <button
                onClick={resetToRecommendedDays}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium mt-1 inline-block"
              >
                Reset to dataset default ({exactRecord.recommendedDays} days)
              </button>
            )}
          </div>

          {/* Number of Travelers */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Party Size (Travelers)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setTravelers(num)}
                  className={`py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors ${
                    travelers === num
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} {num === 1 ? 'solo' : 'pax'}
                </button>
              ))}
            </div>
          </div>

          {/* Dataset Profile Meta Box */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Dataset Profile ID:</span>
              <span className="font-mono font-semibold text-slate-800">{exactRecord.travelProfileId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Optimal Travel Season:</span>
              <span className="font-medium text-slate-800">{exactRecord.bestSeason}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transit Mode:</span>
              <span className="font-medium text-slate-800">{exactRecord.typicalTransport}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Average Traveler Rating:</span>
              <span className="font-mono text-amber-700 font-semibold">★ {exactRecord.averageTravelerRating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Detailed Calculated Financials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grand Total Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-6 shadow-md border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold block mb-1">
                  Estimated Expenditure Total
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold font-mono tabular-nums text-white">
                    ${grandTotal.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-300 font-sans">
                    USD for {days} days ({travelers} {travelers === 1 ? 'traveler' : 'travelers'})
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Based on ${dailyPerPerson}/day per traveler in {exactRecord.destination}, {exactRecord.country}.
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-slate-700 sm:pl-6 space-y-1 font-mono tabular-nums">
                <span className="text-[11px] text-slate-400 block font-sans">Baseline Daily Rate</span>
                <span className="text-2xl font-bold text-emerald-400">${dailyPerPerson}</span>
                <span className="text-[11px] text-slate-400 block">/ person / day</span>
              </div>
            </div>
          </div>

          {/* Itemized Category Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hotel */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-indigo-500" />
                  <span>Accommodations</span>
                </span>
                <span className="font-mono tabular-nums">${hotelPerNight} / night</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                ${totalAccommodation.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Estimated hotel cost for {days} nights ({travelers > 1 ? 'room shared' : 'single room'}).
              </p>
            </div>

            {/* Food */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-emerald-500" />
                  <span>Food & Dining</span>
                </span>
                <span className="font-mono tabular-nums">${foodPerDay} / person / day</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                ${totalFood.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Meals and local culinary experiences for {travelers} pax over {days} days.
              </p>
            </div>

            {/* Local Transit */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {getTransportIcon(exactRecord.typicalTransport)}
                  <span>Transit ({exactRecord.typicalTransport})</span>
                </span>
                <span className="font-mono tabular-nums">${transitPerDay} / person / day</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                ${totalTransit.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Local commute via {exactRecord.typicalTransport} as modeled in dataset.
              </p>
            </div>

            {/* Activities & Incidental */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span>Activities & Miscellaneous</span>
                </span>
                <span className="font-mono tabular-nums">${miscPerDay} / person / day</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                ${totalMisc.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Attraction admissions, souvenirs, and discretionary spending.
              </p>
            </div>
          </div>

          {/* Dataset Benchmark Comparisons */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>Comparative Benchmark Context</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono tabular-nums pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-sans">Global Dataset Avg</span>
                <span className="font-bold text-slate-900">$181 / day</span>
                <span className="text-[10px] text-slate-500 block font-sans">
                  {dailyPerPerson < 181
                    ? `${Math.round(((181 - dailyPerPerson) / 181) * 100)}% cheaper than avg`
                    : `${Math.round(((dailyPerPerson - 181) / 181) * 100)}% above avg`}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-sans">Style Average ({exactRecord.tripType})</span>
                <span className="font-bold text-slate-900">
                  {exactRecord.tripType === 'Budget Backpacking' ? '$170/day' : exactRecord.tripType === 'Relaxation' ? '$223/day' : '$180/day'}
                </span>
                <span className="text-[10px] text-slate-500 block font-sans">Across all 157 cities</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-sans">Traveler Sentiment</span>
                <span className="font-bold text-amber-700">★ {exactRecord.averageTravelerRating.toFixed(1)} / 5.0</span>
                <span className="text-[10px] text-slate-500 block font-sans">Based on traveler reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
