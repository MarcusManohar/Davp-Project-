import React, { useState } from 'react';
import { ActiveTab } from './types/travel';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { MapView } from './views/MapView';
import { DataTableView } from './views/DataTableView';
import { CityDeepDiveView } from './views/CityDeepDiveView';
import { TripCalculatorView } from './views/TripCalculatorView';
import { DocumentationView } from './views/DocumentationView';
import { WORLD_TRAVEL_DATA } from './data/travelData';
import { Compass, Database, Globe, Download, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCity, setSelectedCity] = useState<string>('Tokyo');

  const handleNavigateToCity = (destination: string) => {
    setSelectedCity(destination);
    setActiveTab('deepdive');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMapSelectCity = (destination: string) => {
    setSelectedCity(destination);
    setActiveTab('deepdive');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredCount={WORLD_TRAVEL_DATA.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateToCity={handleNavigateToCity}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            onNavigateToDeepDive={handleMapSelectCity}
            selectedCityName={selectedCity}
          />
        )}

        {activeTab === 'table' && (
          <DataTableView onSelectCity={handleNavigateToCity} />
        )}

        {activeTab === 'deepdive' && (
          <CityDeepDiveView initialCity={selectedCity} />
        )}

        {activeTab === 'calculator' && <TripCalculatorView />}

        {activeTab === 'documentation' && <DocumentationView />}
      </main>

      {/* Clean Footer without mechanical clutter */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">World Travel Atlas</span>
            <span>·</span>
            <span>Educational Analysis Dataset</span>
            <span>·</span>
            <span className="font-mono tabular-nums">942 Profiles · 157 Destinations</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => {
                setActiveTab('documentation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-800 transition-colors"
            >
              Data Dictionary
            </button>
            <button
              onClick={() => {
                setActiveTab('table');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-800 transition-colors"
            >
              Full Catalog
            </button>
            <a
              href="/assets/aistudio/world_travel_dataset_e8459e94.csv"
              download="world_travel_dataset.csv"
              className="hover:text-slate-800 transition-colors inline-flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Download CSV</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
