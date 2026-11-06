import React, { useState } from 'react';
import {
  FileText,
  Download,
  Code,
  Check,
  Copy,
  ExternalLink,
  Info,
  Database,
  Layers,
} from 'lucide-react';
import { exportToCSV, WORLD_TRAVEL_DATA } from '../data/travelData';

export const DocumentationView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const colabCode = `# WORLD TRAVEL DATASET ANALYSIS IN PYTHON / COLAB
import pandas as pd
import numpy as np

# 1. Load the dataset directly
url = "/assets/aistudio/world_travel_dataset_e8459e94.csv"
df = pd.read_csv(url)

print("Dataset Shape:", df.shape)  # (942, 17)
print("Columns:", df.columns.tolist())

# 2. Key Summary Statistics
print("\\n--- Budget Summary (USD) ---")
print(df[['Estimated_Daily_Budget_USD', 'Estimated_Trip_Budget_USD', 'Average_Traveler_Rating']].describe())

# 3. Average Daily Budget by Continent
continent_summary = df.groupby('Continent').agg(
    Cities=('Destination', 'nunique'),
    Profiles=('Travel_Profile_ID', 'count'),
    Avg_Daily_Budget=('Estimated_Daily_Budget_USD', 'mean'),
    Avg_Rating=('Average_Traveler_Rating', 'mean')
).sort_values(by='Avg_Daily_Budget', ascending=False)
print("\\n--- Continent Economics ---")
print(continent_summary.round(2))

# 4. Travel Style Economics
style_summary = df.groupby('Trip_Type').agg(
    Avg_Daily_Budget=('Estimated_Daily_Budget_USD', 'mean'),
    Avg_Rating=('Average_Traveler_Rating', 'mean'),
    Avg_Days=('Recommended_Days', 'mean')
).sort_values(by='Avg_Daily_Budget', ascending=False)
print("\\n--- Travel Style Profiles ---")
print(style_summary.round(2))`;

  const copyCode = () => {
    navigator.clipboard.writeText(colabCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const columnsData = [
    {
      name: 'Destination',
      type: 'String',
      example: 'Tokyo, Paris, Nairobi',
      desc: 'City or urban destination name (157 unique locations).'
    },
    {
      name: 'Country',
      type: 'String',
      example: 'Japan, France, Kenya',
      desc: 'Sovereign nation in which the destination is located (85 countries).'
    },
    {
      name: 'Continent',
      type: 'String',
      example: 'Asia, Europe, Africa, North America, South America, Oceania',
      desc: 'Global continental geographic region (6 continents).'
    },
    {
      name: 'Latitude',
      type: 'Float',
      example: '35.6762, -33.9249',
      desc: 'Geographic coordinate latitude in decimal degrees.'
    },
    {
      name: 'Longitude',
      type: 'Float',
      example: '139.6503, 18.4241',
      desc: 'Geographic coordinate longitude in decimal degrees.'
    },
    {
      name: 'Trip_Type',
      type: 'String (Enum)',
      example: 'Budget Backpacking, Culture & History, Nature & Adventure, Food & Local Life, Family Holiday, Relaxation',
      desc: 'Travel style profile (6 profiles per destination, exactly 157 of each).'
    },
    {
      name: 'Main_Interest',
      type: 'String (Enum)',
      example: 'Urban & Culture, Culture, Food, Nature, History, Art, Beach, Luxury, Entertainment, Family',
      desc: 'Primary thematic attraction category for the destination.'
    },
    {
      name: 'Best_Season',
      type: 'String (Enum)',
      example: 'Spring, Summer, Autumn, Winter',
      desc: 'Recommended travel season based on weather and activities.'
    },
    {
      name: 'Recommended_Days',
      type: 'Integer',
      example: '3 to 10 days',
      desc: 'Recommended itinerary duration in days for the given profile.'
    },
    {
      name: 'Estimated_Daily_Budget_USD',
      type: 'Float',
      example: '$27.00 to $375.00',
      desc: 'Simulated comprehensive daily spend in US Dollars (average $181.10).'
    },
    {
      name: 'Estimated_Trip_Budget_USD',
      type: 'Float',
      example: '$156.00 to $3,380.00',
      desc: 'Total trip estimate (Estimated_Daily_Budget_USD × Recommended_Days).'
    },
    {
      name: 'Average_Traveler_Rating',
      type: 'Float',
      example: '3.4 to 5.0 (out of 5.0)',
      desc: 'Sample traveler satisfaction rating score (mean 4.21).'
    },
    {
      name: 'Typical_Transport',
      type: 'String (Enum)',
      example: 'Walking, Train, Bus, Public Transport, Taxi/Rideshare, Rental Car',
      desc: 'Most common or recommended primary transit mode for the profile.'
    },
    {
      name: 'Estimated_Hotel_Per_Night_USD',
      type: 'Float',
      example: '$15.00 to $181.00',
      desc: 'Estimated lodging and hotel rate per night in USD.'
    },
    {
      name: 'Estimated_Food_Per_Day_USD',
      type: 'Float',
      example: '$8.00 to $89.00',
      desc: 'Estimated daily dining and meal expenses in USD.'
    },
    {
      name: 'Estimated_Local_Transport_Per_Day_USD',
      type: 'Float',
      example: '$4.00 to $54.00',
      desc: 'Estimated daily local commute and transit expenditure in USD.'
    },
    {
      name: 'Travel_Profile_ID',
      type: 'String',
      example: 'WP001-01 to WP157-06',
      desc: 'Unique alphanumeric identifier encoding destination index and profile style.'
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Dataset Documentation & Data Dictionary
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Metadata specifications, schema dictionary, educational notes, and analysis guidelines for the World Travel Dataset.
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                World Travel Analysis Dataset (world_travel_dataset.csv)
              </h2>
              <div className="text-xs text-slate-500 font-mono tabular-nums flex items-center gap-2 mt-0.5">
                <span>942 Rows</span>
                <span>·</span>
                <span>17 Columns</span>
                <span>·</span>
                <span>157 Destinations</span>
                <span>·</span>
                <span>85 Countries</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/assets/aistudio/world_travel_dataset_e8459e94.csv"
              download="world_travel_dataset.csv"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV File</span>
            </a>

            <a
              href="/assets/aistudio/README_f4278401.txt"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Official README</span>
            </a>
          </div>
        </div>

        {/* Important Notice */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Dataset Notice (From README)</span>
          </div>
          <p className="leading-relaxed text-amber-800">
            This is an educational analysis dataset. Destination names and geographic coordinates are based on real places, but budgets, ratings, hotel/food/transport estimates, and trip profiles are simulated for learning and analytical demonstration. They are intended for benchmarking and curriculum analysis, not live booking prices.
          </p>
        </div>
      </div>

      {/* Data Dictionary Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Schema & Data Dictionary (17 Fields)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete technical specification of all variables present in each row.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/50 font-semibold">
                <th className="py-2.5 px-3 font-mono">Field Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 font-mono">Example Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {columnsData.map((col) => (
                <tr key={col.name} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-900">
                    {col.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    {col.type}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {col.desc}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                    {col.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Colab & Python Integration Guide */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Python / Google Colab Usage Code
            </h3>
          </div>
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950 text-slate-200 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed">
          <pre>{colabCode}</pre>
        </div>
      </div>
    </div>
  );
};
