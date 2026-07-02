import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { GitCompare, Trophy, ShieldAlert, Wind, Thermometer, Gauge } from 'lucide-react';
import { CityData } from '../types';

interface CityComparisonProps {
  cities: CityData[];
  onSelectCity: (cityName: string) => void;
}

export const CityComparison: React.FC<CityComparisonProps> = ({ cities, onSelectCity }) => {
  const [viewMode, setViewMode] = useState<'bar' | 'radar'>('bar');
  const [metricKey, setMetricKey] = useState<'aqi' | 'pm25' | 'pm10'>('aqi');

  const chartData = cities.map(c => ({
    name: c.name,
    aqi: c.metrics.aqi,
    pm25: c.metrics.pm25,
    pm10: c.metrics.pm10,
    temp: c.weather.temperature,
    humidity: c.weather.humidity,
    risk: c.healthRisk,
    status: c.status,
    color: c.color
  }));

  const radarData = [
    { subject: 'AQI Index', Delhi: cities[0]?.metrics.aqi || 285, Mumbai: cities[1]?.metrics.aqi || 142, Bengaluru: cities[2]?.metrics.aqi || 118, Kolkata: cities[3]?.metrics.aqi || 245, fullMark: 350 },
    { subject: 'PM2.5 Load', Delhi: cities[0]?.metrics.pm25 || 142, Mumbai: cities[1]?.metrics.pm25 || 64, Bengaluru: cities[2]?.metrics.pm25 || 48, Kolkata: cities[3]?.metrics.pm25 || 118, fullMark: 200 },
    { subject: 'PM10 Debris', Delhi: cities[0]?.metrics.pm10 || 235, Mumbai: cities[1]?.metrics.pm10 || 128, Bengaluru: cities[2]?.metrics.pm10 || 92, Kolkata: cities[3]?.metrics.pm10 || 194, fullMark: 300 },
    { subject: 'Humidity %', Delhi: cities[0]?.weather.humidity || 62, Mumbai: cities[1]?.weather.humidity || 78, Bengaluru: cities[2]?.weather.humidity || 65, Kolkata: cities[3]?.weather.humidity || 85, fullMark: 100 },
    { subject: 'Temp °C', Delhi: cities[0]?.weather.temperature || 31, Mumbai: cities[1]?.weather.temperature || 32, Bengaluru: cities[2]?.weather.temperature || 27, Kolkata: cities[3]?.weather.temperature || 30, fullMark: 50 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-950/95 backdrop-blur border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 select-none">
          <p className="font-bold text-white border-b border-slate-800 pb-1 text-sm">{d.name}</p>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">AQI Index:</span>
            <span className="font-black font-mono text-base" style={{ color: d.color }}>{d.aqi}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">PM2.5 Load:</span>
            <span className="font-mono text-slate-200">{d.pm25} µg/m³</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">PM10 Coarse:</span>
            <span className="font-mono text-slate-200">{d.pm10} µg/m³</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Status Verdict:</span>
            <span className="font-bold">{d.status} ({d.risk})</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
            <GitCompare className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">National Urban Telemetry Benchmark</span>
            <h2 className="text-lg font-bold text-white">Multi-City Environmental & Risk Comparison</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setMetricKey('aqi')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${metricKey === 'aqi' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400'}`}
            >AQI</button>
            <button
              onClick={() => setMetricKey('pm25')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${metricKey === 'pm25' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400'}`}
            >PM2.5</button>
            <button
              onClick={() => setMetricKey('pm10')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${metricKey === 'pm10' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400'}`}
            >PM10</button>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold ml-2">
            <button
              onClick={() => setViewMode('bar')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${viewMode === 'bar' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400'}`}
            >Bar Grid</button>
            <button
              onClick={() => setViewMode('radar')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${viewMode === 'radar' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400'}`}
            >Radar Matrix</button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full pt-4">
        {viewMode === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 'bold' }} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={metricKey} radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={110} data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 350]} stroke="#475569" />
              <Radar name="Delhi" dataKey="Delhi" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              <Radar name="Kolkata" dataKey="Kolkata" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
              <Radar name="Mumbai" dataKey="Mumbai" stroke="#eab308" fill="#eab308" fillOpacity={0.3} />
              <Radar name="Bengaluru" dataKey="Bengaluru" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* City Comparison Table Matrix */}
      <div className="overflow-x-auto pt-4 border-t border-slate-800">
        <table className="w-full min-w-[650px] text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4">Current AQI</th>
              <th className="py-3 px-4">PM2.5 / PM10</th>
              <th className="py-3 px-4">Weather °C / %</th>
              <th className="py-3 px-4">Health Verdict</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {cities.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-all">
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }}></span>
                  {c.name}
                </td>
                <td className="py-3 px-4 font-black font-mono text-sm" style={{ color: c.color }}>
                  {c.metrics.aqi} <span className="text-[10px] text-slate-500 font-normal">({c.status})</span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-300">
                  {c.metrics.pm25} / {c.metrics.pm10} µg/m³
                </td>
                <td className="py-3 px-4 font-mono text-slate-300">
                  {c.weather.temperature}°C / {c.weather.humidity}%
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.healthRisk === 'Severe' || c.healthRisk === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    c.healthRisk === 'Moderate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {c.healthRisk} Risk
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onSelectCity(c.name)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-lg text-[11px] transition-all cursor-pointer border border-slate-700"
                  >
                    Inspect Telemetry
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
