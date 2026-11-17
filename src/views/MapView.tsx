import React, { useState } from 'react';
import { DESTINATION_GROUPS } from '../data/travelData';
import { WorldMap } from '../components/WorldMap';
import { DestinationGroup, TravelRecord } from '../types/travel';
import {
  MapPin,
  Star,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
  ChevronRight,
  Bed,
  Utensils,
  Car,
  Footprints,
  Train,
  Bus,
} from 'lucide-react';

interface MapViewProps {
  onNavigateToDeepDive: (destination: string) => void;
  selectedCityName?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  onNavigateToDeepDive,
  selectedCityName,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string>(
    selectedCityName || 'Tokyo'
  );

  const activeGroup = DESTINATION_GROUPS.find(
    (g) => g.destination === selectedDestination
  ) || DESTINATION_GROUPS[0];

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
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Geographic Destination Cartography
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            157 global destinations mapped with precise latitude/longitude coordinates. Select any pin to inspect all 6 travel profiles.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          Coordinates: {activeGroup.latitude.toFixed(4)}°, {activeGroup.longitude.toFixed(4)}°
        </div>
      </div>

      {/* Interactive Map */}
      <WorldMap
        destinations={DESTINATION_GROUPS}
        onSelectDestination={(dest) => setSelectedDestination(dest)}
        selectedDestinationName={selectedDestination}
      />

      {/* Detailed City Drawer & Profiles */}
      {activeGroup && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
                <MapPin className="w-4 h-4" />
                <span>{activeGroup.country}</span>
                <span>·</span>
                <span>{activeGroup.continent}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{activeGroup.destination}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary Interest: {activeGroup.mainInterest} · Best Season: {activeGroup.bestSeason}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Avg Daily Cost</span>
                <span className="text-lg font-bold text-slate-900">${activeGroup.avgDailyBudget}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rating</span>
                <span className="text-lg font-bold text-amber-600">★ {activeGroup.avgRating.toFixed(2)}</span>
              </div>
              <button
                onClick={() => onNavigateToDeepDive(activeGroup.destination)}
                className="px-3 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Full City View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 6 Profiles Grid for this City */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              All 6 Travel Profiles for {activeGroup.destination}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGroup.profiles.map((profile) => (
                <div
                  key={profile.travelProfileId}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-900">{profile.tripType}</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {profile.travelProfileId}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                        ${profile.estimatedDailyBudgetUSD}
                      </span>
                      <span className="text-[11px] text-slate-500">/ day</span>
                    </div>
                    <div className="font-mono tabular-nums text-xs font-medium text-amber-700">
                      ★ {profile.averageTravelerRating.toFixed(1)}
                    </div>
                  </div>

                  {/* Itemized cost strip */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs font-mono tabular-nums text-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Bed className="w-3.5 h-3.5" />
                        <span>Hotel / night:</span>
                      </div>
                      <span className="font-semibold text-slate-800">${profile.estimatedHotelPerNightUSD}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Food / day:</span>
                      </div>
                      <span className="font-semibold text-slate-800">${profile.estimatedFoodPerDayUSD}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        {getTransportIcon(profile.typicalTransport)}
                        <span>Transit / day:</span>
                      </div>
                      <span className="font-semibold text-slate-800">${profile.estimatedLocalTransportPerDayUSD}</span>
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{profile.recommendedDays} days rec.</span>
                    <span className="font-semibold text-indigo-700">
                      ${profile.estimatedTripBudgetUSD} total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
