import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, RefreshCw, FileText, Sparkles, Globe, Menu } from 'lucide-react';
import { CityData } from '../types';

interface HeaderProps {
  currentCity: CityData;
  onSearchCity: (queryOrParams: any) => void;
  isLoading: boolean;
  onOpenReport: () => void;
  onOpenAiAssistant: () => void;
  onSelectPreset?: (cityId: string) => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSearchCity,
  isLoading,
  onOpenReport,
  onOpenAiAssistant,
  onToggleSidebar,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Nominatim API suggestions fetch
  useEffect(() => {
    if (!searchInput.trim() || searchInput.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSuggesting(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchInput.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data || []);
          if (data && data.length > 0) setShowDropdown(true);
        }
      } catch (err) {
        console.error('Failed to fetch Nominatim suggestions', err);
      } finally {
        setIsSuggesting(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setShowDropdown(false);
      onSearchCity(searchInput.trim());
    }
  };

  const handleSelectSuggestion = (s: any) => {
    setShowDropdown(false);
    const mainName = s.address?.city || s.address?.town || s.address?.village || s.address?.suburb || s.address?.county || s.name || s.display_name.split(',')[0];
    setSearchInput(mainName);
    onSearchCity({
      query: s.display_name,
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lon),
      name: mainName,
      state: s.address?.state || s.address?.country || '',
      country: s.address?.country || 'India'
    });
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-4 md:px-6 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4 select-none">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all shrink-0 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* City Search Bar with Autocomplete Dropdown */}
        <div className="flex-1 relative" ref={dropdownRef}>
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="global-city-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              placeholder="Search any location (e.g. Kota, Rajasthan; Sonipat; Jaipur; Mumbai)..."
              className="w-full pl-10 pr-20 md:pr-24 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isSuggesting && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin mr-1" />}
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 md:px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-[11px] font-semibold rounded-lg shadow transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer min-h-[32px]"
              >
                {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Locate'}
              </button>
            </div>
          </form>

          {/* Dynamic Nominatim Autocomplete Dropdown Menu */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80 animate-in fade-in duration-200 max-h-80 overflow-y-auto">
              <div className="px-3.5 py-2 bg-slate-950/80 text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-cyan-400" /> OpenStreetMap Nominatim Suggestions</span>
                <span className="text-[9px] text-slate-500">Live Geocode</span>
              </div>
              {suggestions.map((s, idx) => (
                <button
                  key={s.place_id || idx}
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-800/90 transition-colors flex items-start gap-3 group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                      {s.address?.city || s.address?.town || s.address?.village || s.address?.suburb || s.name || s.display_name.split(',')[0]}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {s.display_name}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 shrink-0 self-center hidden sm:inline">
                    {parseFloat(s.lat).toFixed(2)}°, {parseFloat(s.lon).toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active City Pill & Global Actions */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3 shrink-0">
        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs flex-1 md:flex-initial min-w-0">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-bounce shrink-0" />
          <span className="text-slate-400 hidden lg:inline">Target:</span>
          <span className="font-bold text-white tracking-wide truncate max-w-[120px] md:max-w-none">{currentCity.name}</span>
          <span
            className="w-2.5 h-2.5 rounded-full ml-1 shrink-0 shadow-sm"
            style={{ backgroundColor: currentCity.color }}
            title={`AQI: ${currentCity.metrics.aqi} - ${currentCity.status}`}
          ></span>
        </div>

        <button
          onClick={onOpenReport}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all shadow-sm cursor-pointer min-h-[38px] min-w-[38px] flex-1 sm:flex-none"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline">Generate Report</span>
        </button>

        <button
          onClick={onOpenAiAssistant}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer min-h-[38px] min-w-[38px] flex-1 sm:flex-none animate-pulse"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>
      </div>
    </header>
  );
};
