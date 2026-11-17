import React, { useState, useMemo } from 'react';
import {
  WORLD_TRAVEL_DATA,
  TravelRecord,
  CONTINENTS,
  COUNTRIES,
  TRIP_TYPES,
  MAIN_INTERESTS,
  BEST_SEASONS,
  TYPICAL_TRANSPORTS,
  filterRecords,
  exportToCSV,
} from '../data/travelData';
import { FilterState } from '../types/travel';
import {
  Search,
  SlidersHorizontal,
  Download,
  RotateCcw,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Star,
  MapPin,
  Bed,
  Utensils,
  Car,
} from 'lucide-react';

interface DataTableViewProps {
  onSelectCity: (destination: string) => void;
}

type SortField =
  | 'destination'
  | 'country'
  | 'continent'
  | 'tripType'
  | 'recommendedDays'
  | 'estimatedDailyBudgetUSD'
  | 'estimatedTripBudgetUSD'
  | 'averageTravelerRating'
  | 'estimatedHotelPerNightUSD'
  | 'estimatedFoodPerDayUSD'
  | 'estimatedLocalTransportPerDayUSD';

export const DataTableView: React.FC<DataTableViewProps> = ({ onSelectCity }) => {
  const initialFilters: FilterState = {
    search: '',
    continent: '',
    country: '',
    tripType: '',
    mainInterest: '',
    bestSeason: '',
    typicalTransport: '',
    minDailyBudget: 20,
    maxDailyBudget: 400,
    minRating: 3.0,
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [sortField, setSortField] = useState<SortField>('destination');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return filterRecords(WORLD_TRAVEL_DATA, filters);
  }, [filters]);

  // Sorted dataset
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [filteredRecords, sortField, sortAsc]);

  // Paginated records
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            World Travel Dataset Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete database of 942 verified traveler profile records across 157 global destinations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          <button
            onClick={() => exportToCSV(sortedRecords, 'filtered_world_travel_dataset.csv')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered ({sortedRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          {/* Row 1: Search & Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* Search */}
            <div className="relative">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Search text</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="City, country, or ID..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({ ...filters, search: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Continent */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Continent</label>
              <select
                value={filters.continent}
                onChange={(e) => {
                  setFilters({ ...filters, continent: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:bg-white focus:outline-indigo-500"
              >
                <option value="">All Continents (6)</option>
                {CONTINENTS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Trip Type */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Travel Style</label>
              <select
                value={filters.tripType}
                onChange={(e) => {
                  setFilters({ ...filters, tripType: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:bg-white focus:outline-indigo-500"
              >
                <option value="">All Styles (6)</option>
                {TRIP_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Optimal Season</label>
              <select
                value={filters.bestSeason}
                onChange={(e) => {
                  setFilters({ ...filters, bestSeason: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:bg-white focus:outline-indigo-500"
              >
                <option value="">All Seasons</option>
                {BEST_SEASONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Secondary Dropdowns & Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1 border-t border-slate-100">
            {/* Main Interest */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Main Interest</label>
              <select
                value={filters.mainInterest}
                onChange={(e) => {
                  setFilters({ ...filters, mainInterest: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:bg-white focus:outline-indigo-500"
              >
                <option value="">All Interests (10)</option>
                {MAIN_INTERESTS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            {/* Typical Transport */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Typical Transport</label>
              <select
                value={filters.typicalTransport}
                onChange={(e) => {
                  setFilters({ ...filters, typicalTransport: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:bg-white focus:outline-indigo-500"
              >
                <option value="">All Transit Modes</option>
                {TYPICAL_TRANSPORTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Daily Budget Max Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                <span>Max Daily Budget:</span>
                <span className="font-mono tabular-nums font-bold text-slate-900">${filters.maxDailyBudget}/day</span>
              </div>
              <input
                type="range"
                min="30"
                max="375"
                step="5"
                value={filters.maxDailyBudget}
                onChange={(e) => {
                  setFilters({ ...filters, maxDailyBudget: Number(e.target.value) });
                  setCurrentPage(1);
                }}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Min Rating Slider */}
            <div className="flex items-end justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Min Rating:</span>
                  <span className="font-mono tabular-nums font-bold text-amber-600">★ {filters.minRating.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="3.4"
                  max="5.0"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) => {
                    setFilters({ ...filters, minRating: Number(e.target.value) });
                    setCurrentPage(1);
                  }}
                  className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Count & Page Size Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 px-1">
        <div className="font-mono tabular-nums">
          Showing <span className="font-bold text-slate-900">{Math.min(sortedRecords.length, (currentPage - 1) * pageSize + 1)}</span> to{' '}
          <span className="font-bold text-slate-900">{Math.min(sortedRecords.length, currentPage * pageSize)}</span> of{' '}
          <span className="font-bold text-slate-900">{sortedRecords.length}</span> records
          {sortedRecords.length !== WORLD_TRAVEL_DATA.length && (
            <span className="text-slate-400"> (filtered from 942)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          {[25, 50, 100].map((size) => (
            <button
              key={size}
              onClick={() => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-xs font-mono tabular-nums ${
                pageSize === size
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th className="py-2.5 px-3 font-mono text-slate-400 w-16">ID</th>
                <th
                  onClick={() => handleSort('destination')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Destination</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('country')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Country</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('continent')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
                >
                  <span>Continent</span>
                </th>
                <th
                  onClick={() => handleSort('tripType')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
                >
                  <span>Trip Style</span>
                </th>
                <th
                  onClick={() => handleSort('estimatedDailyBudgetUSD')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Daily $</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('recommendedDays')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <span>Days</span>
                </th>
                <th
                  onClick={() => handleSort('estimatedTripBudgetUSD')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <span>Trip $</span>
                </th>
                <th
                  onClick={() => handleSort('averageTravelerRating')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Rating</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Transit</th>
                <th className="py-2.5 px-3 text-center w-14">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-sans">
                    No matching travel profiles found for your current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => {
                  const isExpanded = expandedId === r.travelProfileId;
                  return (
                    <React.Fragment key={r.travelProfileId}>
                      <tr
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isExpanded ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                          {r.travelProfileId}
                        </td>
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">
                          <button
                            onClick={() => onSelectCity(r.destination)}
                            className="hover:text-indigo-600 transition-colors text-left"
                          >
                            {r.destination}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-700">{r.country}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">{r.continent}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">{r.tripType}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          ${r.estimatedDailyBudgetUSD}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">{r.recommendedDays}d</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-indigo-700">
                          ${r.estimatedTripBudgetUSD}
                        </td>
                        <td className="py-2.5 px-3 text-right text-amber-700 font-semibold">
                          ★ {r.averageTravelerRating.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-600 text-[11px]">
                          {r.typicalTransport}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : r.travelProfileId)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors"
                            title={isExpanded ? 'Collapse' : 'Expand full details'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable row card */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 font-sans">
                          <td colSpan={11} className="p-4 border-y border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                              {/* Destination Coordinates */}
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                  Geographic Details
                                </span>
                                <div className="font-semibold text-slate-900">{r.destination}, {r.country}</div>
                                <div className="text-slate-500 font-mono tabular-nums">
                                  Lat: {r.latitude}°, Lng: {r.longitude}°
                                </div>
                                <div className="text-slate-500">
                                  Interest: <span className="font-medium text-slate-800">{r.mainInterest}</span>
                                </div>
                                <div className="text-slate-500">
                                  Season: <span className="font-medium text-slate-800">{r.bestSeason}</span>
                                </div>
                              </div>

                              {/* Itemized Cost Breakdown */}
                              <div className="space-y-1.5 font-mono tabular-nums md:col-span-2">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-sans">
                                  Daily Expense Composition
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="p-2 bg-white rounded border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block font-sans">Hotel / Night</span>
                                    <span className="font-bold text-slate-900">${r.estimatedHotelPerNightUSD}</span>
                                  </div>
                                  <div className="p-2 bg-white rounded border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block font-sans">Food / Day</span>
                                    <span className="font-bold text-slate-900">${r.estimatedFoodPerDayUSD}</span>
                                  </div>
                                  <div className="p-2 bg-white rounded border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block font-sans">Local Transit / Day</span>
                                    <span className="font-bold text-slate-900">${r.estimatedLocalTransportPerDayUSD}</span>
                                  </div>
                                </div>

                                <div className="text-[11px] text-slate-500 pt-1 font-sans">
                                  Activities & incidental budget:{' '}
                                  <span className="font-mono tabular-nums font-semibold text-slate-800">
                                    ${Math.max(0, r.estimatedDailyBudgetUSD - (r.estimatedHotelPerNightUSD + r.estimatedFoodPerDayUSD + r.estimatedLocalTransportPerDayUSD))}
                                  </span>{' '}
                                  / day
                                </div>
                              </div>

                              {/* Navigation button */}
                              <div className="flex flex-col justify-center items-start md:items-end">
                                <button
                                  onClick={() => onSelectCity(r.destination)}
                                  className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center gap-1.5"
                                >
                                  <span>Deep Dive {r.destination}</span>
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between gap-3 text-xs bg-slate-50/70">
          <div className="font-mono tabular-nums text-slate-500">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Jump direct page numbers */}
            <div className="hidden sm:flex items-center gap-1 font-mono tabular-nums">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  p = currentPage - 2 + i;
                  if (p > totalPages) p = totalPages - (4 - i);
                }
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded text-xs transition-colors ${
                      currentPage === p
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
