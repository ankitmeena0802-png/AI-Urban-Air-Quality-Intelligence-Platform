import React from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Eye, 
  Compass, 
  CloudRain, 
  AlertCircle,
  ThermometerSun
} from 'lucide-react';
import { CityData } from '../types';

interface WeatherIntelligenceProps {
  city: CityData;
}

export const WeatherIntelligence: React.FC<WeatherIntelligenceProps> = ({ city }) => {
  const { weather, weatherExplanation } = city;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30 text-sky-400">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Meteorological Impact Module</span>
            <h2 className="text-lg font-bold text-white leading-tight">Live Atmospheric & Weather Telemetry</h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-white font-mono">{weather.temperature}°C</span>
          <p className="text-xs text-sky-300 font-medium">{weather.weatherCondition}</p>
        </div>
      </div>

      {/* Critical Weather Impact Callout Banner */}
      <div className="bg-gradient-to-r from-amber-950/50 via-slate-950 to-red-950/40 border border-amber-500/30 p-5 rounded-2xl flex items-start gap-3.5 shadow-inner">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Meteorological Dispersion Verdict:</span>
          <p className="text-xs text-slate-200 leading-relaxed font-semibold font-mono">{weatherExplanation}</p>
        </div>
      </div>

      {/* 6-Grid Telemetry Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <ThermometerSun className="w-3.5 h-3.5 text-sky-400" /> Temp
          </span>
          <span className="text-lg font-black text-white font-mono mt-2">{weather.temperature}°C</span>
          <span className="text-[10px] text-slate-400 mt-1">Surface Ambient</span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-teal-400" /> Wind Speed
          </span>
          <span className="text-lg font-black text-white font-mono mt-2">{weather.windSpeed} <span className="text-xs font-normal">km/h</span></span>
          <span className={`text-[10px] font-bold ${weather.windSpeed < 7 ? 'text-red-400' : 'text-emerald-400'}`}>
            {weather.windSpeed < 7 ? 'Low Dispersion' : 'High Airflow'}
          </span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-400" /> Wind Dir
          </span>
          <span className="text-lg font-black text-white font-mono mt-2">{weather.windDirection}°</span>
          <span className="text-[10px] text-slate-400 mt-1">Prevailing Azimuth</span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
          </span>
          <span className="text-lg font-black text-white font-mono mt-2">{weather.humidity}%</span>
          <span className="text-[10px] text-slate-400 mt-1">Relative Saturation</span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Rain Prob
          </span>
          <span className="text-lg font-black text-white font-mono mt-2">{weather.rainProbability}%</span>
          <span className="text-[10px] text-slate-400 mt-1">Precipitation Odds</span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-purple-400" /> Visibility
          </span>
          <span className="text-lg font-black text-white font-mono mt-2">{weather.visibility} <span className="text-xs font-normal">km</span></span>
          <span className="text-[10px] text-slate-400 mt-1">Optical Clear Line</span>
        </div>
      </div>
    </div>
  );
};
