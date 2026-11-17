import React from 'react';
import { ActiveTab } from '../types/travel';
import { Download } from 'lucide-react';
import { exportToCSV, WORLD_TRAVEL_DATA } from '../data/travelData';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, filteredCount }) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'map', label: 'Global Map' },
    { id: 'table', label: 'Dataset (942)' },
    { id: 'deepdive', label: 'Destinations' },
    { id: 'calculator', label: 'Trip Calculator' },
    { id: 'python', label: 'Python Code' },
    { id: 'documentation', label: 'Documentation' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-indigo-600 transition-colors text-left"
          >
            World Travel Atlas
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 relative ${
                  activeTab === item.id
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => exportToCSV(WORLD_TRAVEL_DATA, 'world_travel_dataset_full.csv')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              title="Download original 942-row dataset as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile subnav bar */}
      <div className="md:hidden flex overflow-x-auto scrollbar-none px-4 py-2 border-t border-slate-100 gap-3 text-xs bg-slate-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded transition-colors ${
              activeTab === item.id
                ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
