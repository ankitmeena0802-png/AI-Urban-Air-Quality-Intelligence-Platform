import React, { useState } from 'react';
import { PRESET_CITIES } from './data/presetCities';
import { CityData, ActiveTab } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardCards } from './components/DashboardCards';
import { InteractiveMap } from './components/InteractiveMap';
import { SourceAttribution } from './components/SourceAttribution';
import { ForecastChart } from './components/ForecastChart';
import { WeatherIntelligence } from './components/WeatherIntelligence';
import { HealthAdvisory } from './components/HealthAdvisory';
import { AdminPanel } from './components/AdminPanel';
import { CityComparison } from './components/CityComparison';
import { AiAssistantChat } from './components/AiAssistantChat';
import { ReportModal } from './components/ReportModal';
import { MonitoringStations } from './components/MonitoringStations';
import { Sparkles, Activity, ShieldAlert, HeartPulse, CloudSun, GitCompare, BotMessageSquare, AlertCircle } from 'lucide-react';

export default function App() {
  const [cities, setCities] = useState<CityData[]>(PRESET_CITIES);
  const [selectedCityId, setSelectedCityId] = useState<string>(PRESET_CITIES[0].id);
  const [activeTab, setActiveTab] = useState<ActiveTab | string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // Search & Modal States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [isReAnalyzing, setIsReAnalyzing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const currentCity = cities.find(c => c.id === selectedCityId) || cities[0];

  // Handle Location Search via backend Nominatim & Open-Meteo API
  const handleSearch = async (params: any) => {
    const queryObj = typeof params === 'string' ? { query: params } : params;
    if (!queryObj.query?.trim()) return;
    setIsSearching(true);
    setSearchQuery(queryObj.name || queryObj.query);

    try {
      let url = `/api/city-search?q=${encodeURIComponent(queryObj.query)}`;
      if (queryObj.lat !== undefined && queryObj.lng !== undefined) {
        url += `&lat=${queryObj.lat}&lng=${queryObj.lng}&name=${encodeURIComponent(queryObj.name || queryObj.query)}&state=${encodeURIComponent(queryObj.state || '')}&country=${encodeURIComponent(queryObj.country || '')}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCities(prev => {
          const filtered = prev.filter(c => c.id !== data.id && c.name.toLowerCase() !== data.name.toLowerCase());
          return [data, ...filtered];
        });
        setSelectedCityId(data.id);
        showToast(`Located and synchronized environmental index for ${data.name}!`, 'success');
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || `No location found for "${queryObj.query}". Please check the spelling and try again.`, 'error');
      }
    } catch (err) {
      console.error('Search error', err);
      showToast(`Network error while searching for "${queryObj.query}". Please try again.`, 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPresetCity = (cityName: string) => {
    const found = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (found) {
      setSelectedCityId(found.id);
    } else {
      handleSearch(cityName);
    }
  };

  const handleRunAiReAnalysis = async () => {
    setIsReAnalyzing(true);
    try {
      const prompt = `Re-evaluate pollution source probability distribution for ${currentCity.name} given current AQI ${currentCity.metrics.aqi} and wind speed ${currentCity.weather.windSpeed} km/h. Return JSON { vehicle: number, industry: number, construction: number, wasteBurning: number, rationale: string, confidence: number } where numbers sum to 100.`;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, cityData: currentCity })
      });
      if (res.ok) {
        const data = await res.json();
        try {
          // Attempt parse reply if JSON formatted
          const match = data.reply.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            setCities(prev => prev.map(c => c.id === currentCity.id ? {
              ...c,
              attribution: {
                vehicle: parsed.vehicle || c.attribution.vehicle,
                industry: parsed.industry || c.attribution.industry,
                construction: parsed.construction || c.attribution.construction,
                wasteBurning: parsed.wasteBurning || c.attribution.wasteBurning,
                analysisRationale: parsed.rationale || c.attribution.analysisRationale,
                confidenceScore: parsed.confidence || 94
              }
            } : c));
          }
        } catch (e) {
          // Keep existing if parse fails
        }
      }
    } catch (e) {
      console.error('Re-analysis error', e);
    } finally {
      setIsReAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab as any} 
        setActiveTab={setActiveTab as any} 
        cityCount={cities.length} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header 
          currentCity={currentCity}
          onSearchCity={handleSearch}
          isLoading={isSearching}
          onOpenReport={() => setShowReportModal(true)}
          onOpenAiAssistant={() => setActiveTab('chat')}
          onSelectPreset={handleSelectPresetCity}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          
          {/* Live Location Analysis Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Status Indicator Circle */}
                <div 
                  className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-slate-950 text-sm shadow-md"
                  style={{ backgroundColor: currentCity.color }}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 leading-none">AQI</span>
                  <span className="text-base leading-tight font-black">{currentCity.metrics.aqi}</span>
                </div>

                {/* Main Name & Details */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Location Analysis
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      Estimated Coordinate Interpolation (Selected Location ≠ Official Ground Sensor Station)
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-lg font-black text-slate-100">{currentCity.name}</h2>
                    <span className="text-xs text-slate-400 font-medium">
                      {currentCity.state}, {currentCity.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coordinates & Timestamp */}
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
                <div className="bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <span className="text-slate-500 font-bold text-[10px] uppercase">Coordinates:</span>
                  <span className="text-slate-300 font-bold text-[11px]">{currentCity.lat.toFixed(4)}° N, {currentCity.lng.toFixed(4)}° E</span>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <span className="text-slate-500 font-bold text-[10px] uppercase">Telemetry Sync:</span>
                  <span className="text-emerald-400 font-bold text-[11px]">{currentCity.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t border-slate-800/60">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AQI Category</span>
                <span className="text-xs font-black mt-1 block" style={{ color: currentCity.color }}>
                  {currentCity.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pollution Level</span>
                <span className="text-xs font-bold text-slate-200 mt-1 block">
                  {currentCity.healthRisk} Risk ({currentCity.mainPollutant})
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ambient Conditions</span>
                <span className="text-xs font-bold text-sky-400 mt-1 block">
                  {currentCity.weather.temperature}°C ({currentCity.weather.weatherCondition})
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Wind Velocity</span>
                <span className="text-xs font-bold text-slate-300 mt-1 block">
                  {currentCity.weather.windSpeed} km/h
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Relative Humidity</span>
                <span className="text-xs font-bold text-slate-300 mt-1 block">
                  {currentCity.weather.humidity}%
                </span>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="w-full py-2 bg-gradient-to-r from-purple-500/15 to-purple-600/10 hover:from-purple-500/25 hover:to-purple-600/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ask Gemini Scientist</span>
                </button>
              </div>
            </div>

            {/* Quick Jumps Panel */}
            <div className="flex items-center gap-2 overflow-x-auto pt-3 text-[11px] border-t border-slate-800/40 scrollbar-none">
              <span className="text-slate-500 font-bold uppercase tracking-wider shrink-0 text-[10px]">Jump to City:</span>
              {cities.slice(0, 6).map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCityId(c.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    selectedCityId === c.id 
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' 
                      : 'bg-slate-950/40 hover:bg-slate-800 text-slate-400 border-slate-800/60'
                  }`}
                >
                  {c.name} (AQI {c.metrics.aqi})
                </button>
              ))}
            </div>
          </div>

          {/* VIEW: DASHBOARD HOME */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Primary Metrics Grid */}
              <DashboardCards city={currentCity} />

              {/* Map & Forecast 2-Col */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                  <InteractiveMap 
                    key={currentCity.id}
                    city={currentCity} 
                  />
                </div>
                <div className="lg:col-span-1">
                  <WeatherIntelligence city={currentCity} />
                </div>
              </div>

              {/* Monitoring Stations Section */}
              <MonitoringStations city={currentCity} />

              {/* Attribution Full Width */}
              <SourceAttribution 
                city={currentCity} 
                onRunAiReAnalysis={handleRunAiReAnalysis}
                isAnalyzing={isReAnalyzing}
              />

              {/* 72h Forecast Chart */}
              <ForecastChart city={currentCity} />

              {/* Clinical Advisory Preview */}
              <HealthAdvisory city={currentCity} />
            </div>
          )}

          {/* VIEW: MAP & GIS SENSORS */}
          {activeTab === 'map' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-2">GIS Urban Dispersion & Sensor Network</h2>
                <p className="text-xs text-slate-400 mb-6">Interactive geographical telemetry tracking particulate matter transport and plume hotspots across major metropolitan sectors.</p>
                <InteractiveMap 
                  key={currentCity.id}
                  city={currentCity} 
                />
              </div>
            </div>
          )}

          {/* VIEW: CITY ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <DashboardCards city={currentCity} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SourceAttribution 
                  city={currentCity} 
                  onRunAiReAnalysis={handleRunAiReAnalysis}
                  isAnalyzing={isReAnalyzing}
                />
                <CityComparison cities={cities} onSelectCity={handleSelectPresetCity} />
              </div>
            </div>
          )}

          {/* VIEW: PREDICTIVE FORECAST */}
          {activeTab === 'forecast' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <ForecastChart city={currentCity} />
              <WeatherIntelligence city={currentCity} />
            </div>
          )}

          {/* VIEW: SOURCE ATTRIBUTION */}
          {activeTab === 'attribution' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SourceAttribution 
                city={currentCity} 
                onRunAiReAnalysis={handleRunAiReAnalysis}
                isAnalyzing={isReAnalyzing}
              />
            </div>
          )}

          {/* VIEW: CLINICAL HEALTH ADVISORY */}
          {activeTab === 'advisory' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <HealthAdvisory city={currentCity} />
            </div>
          )}

          {/* VIEW: CITY BENCHMARK & COMPARISON */}
          {activeTab === 'compare' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <CityComparison cities={cities} onSelectCity={handleSelectPresetCity} />
            </div>
          )}

          {/* VIEW: MUNICIPAL COMMAND CENTER */}
          {activeTab === 'admin' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <AdminPanel cities={cities} />
            </div>
          )}

          {/* VIEW: AI SCIENTIST CHAT */}
          {activeTab === 'chat' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <AiAssistantChat city={currentCity} />
            </div>
          )}

        </main>
      </div>

      {/* Official Report Download Modal */}
      {showReportModal && (
        <ReportModal city={currentCity} onClose={() => setShowReportModal(false)} />
      )}

      {/* Dynamic Non-blocking Toast Alerts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="shrink-0 mt-0.5">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : toast.type === 'success' ? (
              <Activity className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-cyan-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-100">System Notification</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-[10px] text-slate-500 hover:text-white cursor-pointer px-1">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
