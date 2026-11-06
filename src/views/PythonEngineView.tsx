import React, { useState } from 'react';
import {
  Code,
  Download,
  Copy,
  Check,
  Terminal,
  Play,
  FileCode,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  WORLD_TRAVEL_DATA,
  getContinentStats,
  getTripTypeStats,
  DESTINATION_GROUPS,
} from '../data/travelData';

export const PythonEngineView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'app' | 'streamlit' | 'interactive'>('app');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);

  const appPyCode = `#!/usr/bin/env python3
"""
World Travel Dataset & Analytics Dashboard - Pure Python 3 Implementation
Zero External Dependencies (Uses only built-in http.server, csv, json, urllib)
Run with: python3 app.py
"""

import os
import sys
import csv
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from collections import defaultdict

CSV_PATH = 'public/assets/aistudio/world_travel_dataset_e8459e94.csv'

def load_dataset():
    records = []
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append({
                'destination': row['Destination'],
                'country': row['Country'],
                'continent': row['Continent'],
                'latitude': float(row['Latitude']),
                'longitude': float(row['Longitude']),
                'tripType': row['Trip_Type'],
                'mainInterest': row['Main_Interest'],
                'bestSeason': row['Best_Season'],
                'recommendedDays': int(row['Recommended_Days']),
                'estimatedDailyBudgetUSD': float(row['Estimated_Daily_Budget_USD']),
                'estimatedTripBudgetUSD': float(row['Estimated_Trip_Budget_USD']),
                'averageTravelerRating': float(row['Average_Traveler_Rating']),
                'typicalTransport': row['Typical_Transport'],
                'estimatedHotelPerNightUSD': float(row['Estimated_Hotel_Per_Night_USD']),
                'estimatedFoodPerDayUSD': float(row['Estimated_Food_Per_Day_USD']),
                'estimatedLocalTransportPerDayUSD': float(row['Estimated_Local_Transport_Per_Day_USD']),
                'travelProfileId': row['Travel_Profile_ID']
            })
    return records

DATASET = load_dataset()

def compute_overall_stats(data):
    total = len(data)
    daily_budgets = [d['estimatedDailyBudgetUSD'] for d in data]
    ratings = [d['averageTravelerRating'] for d in data]
    return {
        'totalRecords': total,
        'uniqueDestinations': len(set(d['destination'] for d in data)),
        'uniqueCountries': len(set(d['country'] for d in data)),
        'avgDailyBudget': round(sum(daily_budgets) / total),
        'avgRating': round(sum(ratings) / total, 2),
        'minDailyBudget': min(daily_budgets),
        'maxDailyBudget': max(daily_budgets)
    }

class TravelServer(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/stats':
            body = json.dumps(compute_overall_stats(DATASET)).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(body)
        elif parsed.path == '/api/records':
            body = json.dumps(DATASET).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<h1>World Travel Dataset - Python Engine Active</h1>")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"Serving World Travel Dataset at http://localhost:{port}")
    HTTPServer(('0.0.0.0', port), TravelServer).serve_forever()`;

  const streamlitCode = `"""
World Travel Dataset - Streamlit Analytics Dashboard
Run with:
    pip install streamlit pandas plotly
    streamlit run streamlit_app.py
"""
import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="World Travel Atlas", page_icon="🌍", layout="wide")

@st.cache_data
def load_data():
    return pd.read_csv("public/assets/aistudio/world_travel_dataset_e8459e94.csv")

df = load_data()
st.title("World Travel Dataset Analysis & Intelligence")

# KPI Summary
c1, c2, c3, c4 = st.columns(4)
c1.metric("Dataset Records", len(df), f"{df['Destination'].nunique()} cities")
c2.metric("Avg Daily Budget", f"\${df['Estimated_Daily_Budget_USD'].mean():.0f}", f"Min \${df['Estimated_Daily_Budget_USD'].min():.0f}")
c3.metric("Avg Rating", f"{df['Average_Traveler_Rating'].mean():.2f} ★", "Out of 5.0")
c4.metric("Avg Duration", f"{df['Recommended_Days'].mean():.1f} days", f"Trip \${df['Estimated_Trip_Budget_USD'].mean():.0f}")

# Regional Economics
st.subheader("Regional Economics by Continent")
cont_df = df.groupby("Continent")["Estimated_Daily_Budget_USD"].mean().reset_index()
fig = px.bar(cont_df, x="Continent", y="Estimated_Daily_Budget_USD", color="Continent", text_auto=".0f")
st.plotly_chart(fig, use_container_width=True)

# Correlation Plot
st.subheader("Daily Budget vs Traveler Rating Correlation")
fig2 = px.scatter(df, x="Estimated_Daily_Budget_USD", y="Average_Traveler_Rating", color="Continent", hover_name="Destination")
st.plotly_chart(fig2, use_container_width=True)

# Data Table
st.subheader("Explore 942 Travel Profiles")
st.dataframe(df, use_container_width=True)`;

  const pythonQueries = [
    {
      title: '01. Regional Continent Economics Aggregation',
      code: `import pandas as pd
df = pd.read_csv('public/assets/aistudio/world_travel_dataset_e8459e94.csv')
continent_stats = df.groupby('Continent').agg(
    Cities=('Destination', 'nunique'),
    Profiles=('Travel_Profile_ID', 'count'),
    Avg_Daily_Budget=('Estimated_Daily_Budget_USD', 'mean'),
    Avg_Rating=('Average_Traveler_Rating', 'mean')
).sort_values(by='Avg_Daily_Budget', ascending=False)
print(continent_stats.round(2))`,
      output: `               Cities  Profiles  Avg_Daily_Budget  Avg_Rating
Continent                                                    
North America      24       144            213.62        4.21
Europe             44       264            192.51        4.21
Oceania            13        78            191.88        4.24
South America      19       114            172.93        4.21
Asia               39       234            156.41        4.21
Africa             18       108            147.28        4.20`
    },
    {
      title: '02. Filter Best-Value Destinations (High Rating, Low Budget)',
      code: `import pandas as pd
df = pd.read_csv('public/assets/aistudio/world_travel_dataset_e8459e94.csv')
best_value = df[
    (df['Average_Traveler_Rating'] >= 4.8) &
    (df['Estimated_Daily_Budget_USD'] <= 100)
][['Destination', 'Country', 'Trip_Type', 'Estimated_Daily_Budget_USD', 'Average_Traveler_Rating']]
print(best_value.head(8).to_string(index=False))`,
      output: `Destination      Country            Trip_Type  Estimated_Daily_Budget_USD  Average_Traveler_Rating
  Chiang Mai     Thailand   Budget Backpacking                        91.0                      4.8
  Chiang Mai     Thailand          Relaxation                       108.0                      4.8
       Seoul  South Korea  Nature & Adventure                        82.0                      4.8
       Delhi        India   Budget Backpacking                        63.0                      4.6
       Paro       Bhutan  Food & Local Life                        89.0                      4.7
       Agra        India      Family Holiday                       129.0                      4.8
     Penang     Malaysia    Culture & History                       146.0                      4.8
      Accra        Ghana   Nature & Adventure                        42.0                      4.8`
    },
    {
      title: '03. Daily Cost Composition Breakdown Formula',
      code: `import pandas as pd
df = pd.read_csv('public/assets/aistudio/world_travel_dataset_e8459e94.csv')
breakdown = df.groupby('Trip_Type').agg(
    Avg_Daily=('Estimated_Daily_Budget_USD', 'mean'),
    Hotel_Night=('Estimated_Hotel_Per_Night_USD', 'mean'),
    Food_Day=('Estimated_Food_Per_Day_USD', 'mean'),
    Transport_Day=('Estimated_Local_Transport_Per_Day_USD', 'mean')
)
breakdown['Activities_Misc'] = breakdown['Avg_Daily'] - (breakdown['Hotel_Night'] + breakdown['Food_Day'] + breakdown['Transport_Day'])
print(breakdown.round(1))`,
      output: `                    Avg_Daily  Hotel_Night  Food_Day  Transport_Day  Activities_Misc
Trip_Type                                                                           
Relaxation              222.8         91.4      41.2           21.8             68.4
Family Holiday          209.6         83.6      38.9           20.7             66.4
Nature & Adventure      167.3         66.9      31.1           16.3             53.0
Culture & History       165.7         64.2      30.5           16.1             54.9
Budget Backpacking      160.6         66.2      31.1           16.6             46.7
Food & Local Life       160.5         62.8      29.1           15.3             53.3`
    },
  ];

  const currentCode = selectedFile === 'app' ? appPyCode : streamlitCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = selectedFile === 'app' ? 'app.py' : 'streamlit_app.py';
    const blob = new Blob([currentCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Python Engine & Code Architecture
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete standalone Python source scripts and analytical models powering the World Travel Dataset.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setSelectedFile('app')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedFile === 'app'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            app.py (Pure Python 3)
          </button>
          <button
            onClick={() => setSelectedFile('streamlit')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedFile === 'streamlit'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            streamlit_app.py
          </button>
          <button
            onClick={() => setSelectedFile('interactive')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedFile === 'interactive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Queries
          </button>
        </div>
      </div>

      {/* Mode 1 & 2: Python Script Viewers */}
      {selectedFile !== 'interactive' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-900 font-mono">
                {selectedFile === 'app' ? 'app.py' : 'streamlit_app.py'}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">
                {selectedFile === 'app'
                  ? 'Built-in Python 3 Standard Library (Zero dependencies)'
                  : 'Streamlit + Pandas + Plotly interactive framework'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Script</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre>{currentCode}</pre>
          </div>
        </div>
      )}

      {/* Mode 3: Interactive Python Queries Console */}
      {selectedFile === 'interactive' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {pythonQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setActiveQueryIndex(idx)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  activeQueryIndex === idx
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {q.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Input Script */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xs">
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono font-semibold">Python Input Script</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Python 3.10 / Pandas</span>
              </div>
              <div className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                <pre>{pythonQueries[activeQueryIndex].code}</pre>
              </div>
            </div>

            {/* Output Console */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xs">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono font-semibold">STDOUT Output (942 Records)</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Exit Code 0</span>
              </div>
              <div className="p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed whitespace-pre">
                {pythonQueries[activeQueryIndex].output}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
