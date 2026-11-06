import React, { useState, useMemo } from 'react';
import { DestinationGroup, TravelRecord } from '../types/travel';
import { CONTINENT_COLORS } from './CustomCharts';
import { MapPin, Search, ZoomIn, ZoomOut, RotateCcw, Compass, ArrowRight, DollarSign, Star, Calendar } from 'lucide-react';

interface WorldMapProps {
  destinations: DestinationGroup[];
  onSelectDestination: (destination: string) => void;
  selectedDestinationName?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  destinations,
  onSelectDestination,
  selectedDestinationName,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredCity, setHoveredCity] = useState<DestinationGroup | null>(null);
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');

  const width = 1000;
  const height = 500;

  // Convert lat/long to map coordinates (Miller/Equirectangular projection)
  const project = (lat: number, lng: number) => {
    // Clamping lat between -60 and 80 to prevent extreme pole distortion
    const clampedLat = Math.max(-60, Math.min(80, lat));
    const x = ((lng + 180) / 360) * width;
    const y = ((85 - clampedLat) / 145) * height;
    return { x, y };
  };

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      if (selectedContinent !== 'All' && d.continent !== selectedContinent) return false;
      if (search) {
        const q = search.toLowerCase();
        return d.destination.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
      }
      return true;
    });
  }, [destinations, selectedContinent, search]);

  const activeCity = useMemo(() => {
    if (selectedDestinationName) {
      return destinations.find((d) => d.destination === selectedDestinationName) || null;
    }
    return hoveredCity;
  }, [selectedDestinationName, hoveredCity, destinations]);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.9, Math.min(3.5, prev + delta)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSearch('');
    setSelectedContinent('All');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Map Control Bar */}
      <div className="p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-800">
            Global Destination Cartography
          </span>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            ({filteredDestinations.length} of {destinations.length} cities mapped)
          </span>
        </div>

        {/* Controls: Search, Continent filter, Zoom */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 157 cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-md text-xs focus:outline-indigo-500 w-36 sm:w-44"
            />
          </div>

          {/* Continent selector */}
          <select
            value={selectedContinent}
            onChange={(e) => setSelectedContinent(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-indigo-500"
          >
            <option value="All">All Continents (6)</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Africa">Africa</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Oceania">Oceania</option>
          </select>

          {/* Zoom controls */}
          <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white">
            <button
              onClick={() => handleZoom(0.3)}
              className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.3)}
              className="p-1 hover:bg-slate-100 text-slate-600 border-l border-slate-200 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 hover:bg-slate-100 text-slate-600 border-l border-slate-200 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative w-full h-[460px] sm:h-[520px] bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing">
        {/* SVG World Canvas */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Subtle lat/long grid lines */}
          <g stroke="#334155" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4">
            {/* Equator */}
            <line x1="0" y1={project(0, 0).y} x2={width} y2={project(0, 0).y} stroke="#475569" strokeWidth="1" />
            {/* Tropic of Cancer & Capricorn */}
            <line x1="0" y1={project(23.5, 0).y} x2={width} y2={project(23.5, 0).y} />
            <line x1="0" y1={project(-23.5, 0).y} x2={width} y2={project(-23.5, 0).y} />
            {/* Arctic & Antarctic Circles */}
            <line x1="0" y1={project(66.5, 0).y} x2={width} y2={project(66.5, 0).y} />
            <line x1="0" y1={project(-60, 0).y} x2={width} y2={project(-60, 0).y} />
            {/* Prime Meridian */}
            <line x1={project(0, 0).x} y1="0" x2={project(0, 0).x} y2={height} stroke="#475569" strokeWidth="1" />
            {/* Meridians every 60 deg */}
            {[-120, -60, 60, 120].map((lng) => (
              <line key={lng} x1={project(0, lng).x} y1="0" x2={project(0, lng).x} y2={height} />
            ))}
          </g>

          {/* Stylized Continent Background Landmasses */}
          <g fill="#1e293b" stroke="#334155" strokeWidth="0.75" opacity="0.9">
            {/* North America */}
            <path d="M 120 70 L 220 50 L 320 80 L 280 150 L 250 200 L 230 260 L 210 240 L 190 220 L 140 180 L 110 130 Z" />
            {/* Greenland */}
            <path d="M 330 30 L 400 35 L 380 90 L 320 80 Z" />
            {/* South America */}
            <path d="M 270 270 L 350 280 L 380 340 L 320 440 L 290 440 L 260 340 Z" />
            {/* Europe */}
            <path d="M 460 70 L 580 65 L 560 130 L 510 160 L 460 140 L 440 100 Z" />
            {/* Africa */}
            <path d="M 460 160 L 560 160 L 610 230 L 570 350 L 520 370 L 460 270 L 440 200 Z" />
            {/* Asia */}
            <path d="M 580 60 L 850 60 L 890 140 L 820 220 L 730 240 L 660 210 L 600 150 Z" />
            {/* Indian Subcontinent */}
            <path d="M 680 180 L 740 190 L 710 260 Z" />
            {/* Southeast Asia & Indonesia */}
            <path d="M 760 230 L 820 230 L 860 310 L 790 320 Z" />
            {/* Australia */}
            <path d="M 800 340 L 920 340 L 900 420 L 820 420 Z" />
            {/* New Zealand */}
            <path d="M 940 410 L 970 410 L 950 450 Z" />
            {/* Japan Arc */}
            <path d="M 870 140 L 895 150 L 885 180 Z" />
          </g>

          {/* City Markers */}
          {filteredDestinations.map((d) => {
            const { x, y } = project(d.latitude, d.longitude);
            const color = CONTINENT_COLORS[d.continent]?.fill || '#6366f1';
            const isSelected = selectedDestinationName === d.destination;
            const isHovered = hoveredCity?.destination === d.destination;

            return (
              <g
                key={d.destination}
                className="cursor-pointer group"
                onClick={() => onSelectDestination(d.destination)}
                onMouseEnter={() => setHoveredCity(d)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Ping ring for selected or hovered */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 10 : 7}
                    fill={color}
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Outer halo */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : isHovered ? 5 : 3.5}
                  fill={isSelected ? '#ffffff' : color}
                  stroke={isSelected ? color : '#0f172a'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  className="transition-all duration-150"
                />

                {/* City name text for high zoom or selected */}
                {(isSelected || isHovered || zoom > 1.8) && (
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium select-none pointer-events-none drop-shadow-md"
                  >
                    {d.destination}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Active City Intelligence Card */}
        {activeCity && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-xl p-3.5 shadow-xl z-20 transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeCity.country}</span>
                  <span>·</span>
                  <span>{activeCity.continent}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">{activeCity.destination}</h3>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-semibold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{activeCity.avgRating.toFixed(2)}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Avg Daily</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-400">
                  ${activeCity.avgDailyBudget}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Budget Range</span>
                <span className="font-mono tabular-nums text-slate-300">
                  ${activeCity.minBudget}–${activeCity.maxBudget}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Best Season</span>
                <span className="text-slate-300 font-medium">{activeCity.bestSeason}</span>
              </div>
            </div>

            {/* Coordinates & Action */}
            <div className="flex items-center justify-between mt-2.5 pt-1 text-[11px]">
              <span className="text-slate-400 font-mono">
                {activeCity.latitude.toFixed(2)}°, {activeCity.longitude.toFixed(2)}°
              </span>
              <button
                onClick={() => onSelectDestination(activeCity.destination)}
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white font-medium transition-colors"
              >
                <span>View 6 Profiles</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Continent Legend Overlay */}
        <div className="absolute top-3 right-3 hidden sm:flex flex-col gap-1 bg-slate-900/90 backdrop-blur-xs border border-slate-700/60 p-2.5 rounded-lg text-[11px] text-slate-300 z-10">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Continents
          </div>
          {Object.entries(CONTINENT_COLORS).map(([name, col]) => (
            <div key={name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.fill }} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
