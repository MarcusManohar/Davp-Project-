import React, { useState } from 'react';

// Continent color mapping
export const CONTINENT_COLORS: Record<string, { bg: string; fill: string; border: string; text: string }> = {
  'Asia': { bg: 'bg-amber-500', fill: '#f59e0b', border: '#d97706', text: 'text-amber-700' },
  'Europe': { bg: 'bg-blue-500', fill: '#3b82f6', border: '#2563eb', text: 'text-blue-700' },
  'Africa': { bg: 'bg-emerald-500', fill: '#10b981', border: '#059669', text: 'text-emerald-700' },
  'North America': { bg: 'bg-indigo-500', fill: '#6366f1', border: '#4f46e5', text: 'text-indigo-700' },
  'South America': { bg: 'bg-rose-500', fill: '#f43f5e', border: '#e11d48', text: 'text-rose-700' },
  'Oceania': { bg: 'bg-cyan-500', fill: '#06b6d4', border: '#0891b2', text: 'text-cyan-700' },
};

// 1. Continent Cost & Rating Bar Comparison
interface ContinentBarChartProps {
  data: {
    continent: string;
    count: number;
    destinations: number;
    avgDailyBudget: number;
    avgRating: number;
  }[];
  onSelectContinent?: (continent: string) => void;
  selectedContinent?: string;
}

export const ContinentBarChart: React.FC<ContinentBarChartProps> = ({
  data,
  onSelectContinent,
  selectedContinent,
}) => {
  const maxBudget = Math.max(...data.map(d => d.avgDailyBudget), 1);

  return (
    <div className="space-y-3.5">
      {data.map((item) => {
        const percent = (item.avgDailyBudget / maxBudget) * 100;
        const color = CONTINENT_COLORS[item.continent]?.fill || '#64748b';
        const isSelected = selectedContinent === item.continent;

        return (
          <div
            key={item.continent}
            onClick={() => onSelectContinent?.(isSelected ? '' : item.continent)}
            className={`group cursor-pointer p-2.5 rounded-lg border transition-all ${
              isSelected
                ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-300'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-semibold text-slate-800">{item.continent}</span>
                <span className="text-slate-400 font-mono tabular-nums">
                  {item.destinations} cities · {item.count} profiles
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono tabular-nums text-slate-700 font-medium">
                <span className="text-slate-900 font-semibold">${item.avgDailyBudget}/day</span>
                <span className="text-amber-700">★ {item.avgRating.toFixed(2)}</span>
              </div>
            </div>

            {/* Progress track */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percent}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 2. Stacked Daily Cost Composition Chart
interface CostBreakdownProps {
  data: {
    label: string;
    hotel: number;
    food: number;
    transport: number;
    other: number;
    total: number;
  }[];
}

export const CostCompositionChart: React.FC<CostBreakdownProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-indigo-500" />
          <span>Hotel per night</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-emerald-500" />
          <span>Food per day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-amber-500" />
          <span>Local transport</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-slate-300" />
          <span>Activities & misc</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const hotelPct = Math.max(0, (item.hotel / item.total) * 100);
          const foodPct = Math.max(0, (item.food / item.total) * 100);
          const transportPct = Math.max(0, (item.transport / item.total) * 100);
          const otherPct = Math.max(0, 100 - (hotelPct + foodPct + transportPct));

          return (
            <div key={item.label} className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">{item.label}</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  ${item.total}/day total
                </span>
              </div>

              {/* Stacked Bar */}
              <div className="w-full bg-slate-100 h-3 rounded-full flex overflow-hidden">
                <div
                  style={{ width: `${hotelPct}%` }}
                  className="bg-indigo-500 h-full transition-all duration-300"
                  title={`Hotel: $${item.hotel}`}
                />
                <div
                  style={{ width: `${foodPct}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title={`Food: $${item.food}`}
                />
                <div
                  style={{ width: `${transportPct}%` }}
                  className="bg-amber-500 h-full transition-all duration-300"
                  title={`Transport: $${item.transport}`}
                />
                <div
                  style={{ width: `${otherPct}%` }}
                  className="bg-slate-300 h-full transition-all duration-300"
                  title={`Activities/Misc: $${Math.max(0, item.other)}`}
                />
              </div>

              {/* Detail figures */}
              <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-500 mt-1.5">
                <span>Hotel: ${item.hotel}</span>
                <span>Food: ${item.food}</span>
                <span>Transport: ${item.transport}</span>
                <span>Misc: ${Math.max(0, item.other)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Interactive Scatter Plot: Budget vs Traveler Rating
interface ScatterPoint {
  id: string;
  name: string;
  country: string;
  continent: string;
  budget: number;
  rating: number;
  tripType?: string;
}

interface ScatterPlotProps {
  data: ScatterPoint[];
  onSelectPoint?: (point: ScatterPoint) => void;
}

export const BudgetRatingScatterPlot: React.FC<ScatterPlotProps> = ({ data, onSelectPoint }) => {
  const [hovered, setHovered] = useState<ScatterPoint | null>(null);

  // Bounds
  const minX = 0;
  const maxX = 400; // max daily budget around $375
  const minY = 3.0; // ratings are 3.4 - 5.0
  const maxY = 5.0;

  const width = 640;
  const height = 340;
  const padding = { top: 24, right: 30, bottom: 44, left: 48 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scaleX = (val: number) => padding.left + ((val - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (val: number) => padding.top + plotHeight - ((val - minY) / (maxY - minY)) * plotHeight;

  const xTicks = [0, 50, 100, 150, 200, 250, 300, 350, 400];
  const yTicks = [3.0, 3.5, 4.0, 4.5, 5.0];

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div>
          <span className="font-semibold text-slate-800">Budget vs Traveler Rating Correlation</span>
          <p className="text-slate-500 text-[11px]">Upper-left quadrant represents high-value destinations</p>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(CONTINENT_COLORS).map(([name, col]) => (
            <div key={name} className="flex items-center gap-1 text-[11px] text-slate-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.fill }} />
              <span className="hidden sm:inline">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] select-none"
        >
          {/* Subtle Best-Value sweet spot quadrant highlight */}
          <rect
            x={padding.left}
            y={scaleY(5.0)}
            width={scaleX(150) - padding.left}
            height={scaleY(4.2) - scaleY(5.0)}
            fill="#ecfdf5"
            fillOpacity="0.5"
            rx="4"
          />
          <text
            x={padding.left + 8}
            y={scaleY(4.9) + 12}
            className="text-[10px] fill-emerald-700 font-medium"
          >
            Best Value Zone (High Rating &lt;$150/day)
          </text>

          {/* Grid lines */}
          {yTicks.map(tick => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={scaleY(tick)}
                x2={width - padding.right}
                y2={scaleY(tick)}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={scaleY(tick) + 3}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono tabular-nums"
              >
                {tick.toFixed(1)}★
              </text>
            </g>
          ))}

          {xTicks.map(tick => (
            <g key={tick}>
              <line
                x1={scaleX(tick)}
                y1={padding.top}
                x2={scaleX(tick)}
                y2={height - padding.bottom}
                stroke="#f1f5f9"
              />
              <text
                x={scaleX(tick)}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono tabular-nums"
              >
                ${tick}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 8}
            textAnchor="middle"
            className="text-[11px] fill-slate-500 font-medium"
          >
            Estimated Daily Budget (USD)
          </text>
          <text
            x={-height / 2}
            y={14}
            transform="rotate(-90)"
            textAnchor="middle"
            className="text-[11px] fill-slate-500 font-medium"
          >
            Traveler Rating (Stars)
          </text>

          {/* Points */}
          {data.map((point) => {
            const cx = scaleX(point.budget);
            const cy = scaleY(point.rating);
            const color = CONTINENT_COLORS[point.continent]?.fill || '#6366f1';
            const isHovered = hovered?.id === point.id;

            return (
              <circle
                key={point.id}
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : 3.5}
                fill={color}
                fillOpacity={isHovered ? 1 : 0.75}
                stroke={isHovered ? '#0f172a' : '#ffffff'}
                strokeWidth={isHovered ? 2 : 1}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHovered(point)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectPoint?.(point)}
              />
            );
          })}
        </svg>
      </div>

      {/* Tooltip Card */}
      {hovered && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none z-20 whitespace-nowrap border border-slate-700">
          <div className="font-semibold">{hovered.name}, {hovered.country}</div>
          <div className="text-slate-300 font-mono tabular-nums flex items-center gap-2 mt-0.5">
            <span>{hovered.continent}</span>
            <span>·</span>
            <span className="text-emerald-400">${hovered.budget}/day</span>
            <span>·</span>
            <span className="text-amber-300">★ {hovered.rating.toFixed(2)}</span>
            {hovered.tripType && (
              <>
                <span>·</span>
                <span className="text-slate-300">{hovered.tripType}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Season / Transport Donut Breakdown
interface DonutData {
  label: string;
  count: number;
  color: string;
}

export const DonutBreakdownChart: React.FC<{ data: DonutData[]; title: string }> = ({ data, title }) => {
  const total = data.reduce((a, b) => a + b.count, 0);

  let currentAngle = 0;
  const slices = data.map((d) => {
    const angle = (d.count / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...d, startAngle, angle, percent: Math.round((d.count / total) * 100) };
  });

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-xs font-semibold text-slate-800 mb-3">{title}</div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* SVG Ring */}
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="-1 -1 2 2" className="w-full h-full -rotate-90">
            {slices.map((slice, i) => {
              const startPct = slice.startAngle / 360;
              const endPct = (slice.startAngle + slice.angle) / 360;
              const [startX, startY] = getCoordinatesForPercent(startPct);
              const [endX, endY] = getCoordinatesForPercent(endPct);
              const largeArcFlag = slice.angle > 180 ? 1 : 0;
              const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={slice.color}
                  className="hover:opacity-85 transition-opacity"
                />
              );
            })}
            <circle cx="0" cy="0" r="0.65" fill="#ffffff" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-bold text-slate-900 font-mono tabular-nums">{total}</span>
            <span className="text-[10px] text-slate-400">total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-2 gap-2 text-xs w-full">
          {slices.map((slice) => (
            <div key={slice.label} className="flex items-center justify-between p-1.5 rounded-sm bg-slate-50">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-slate-700 truncate">{slice.label}</span>
              </div>
              <span className="font-mono tabular-nums text-slate-500 text-[11px] ml-1">
                {slice.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
