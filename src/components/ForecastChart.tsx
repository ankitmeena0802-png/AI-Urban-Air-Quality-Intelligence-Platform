import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { TrendingUp, Clock, Calendar, AlertCircle, RefreshCcw } from 'lucide-react';
import { CityData } from '../types';

interface ForecastChartProps {
  city: CityData;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ city }) => {
  const { forecast } = city;
  const [timeframe, setTimeframe] = useState<'24h' | '48h' | '72h'>('72h');

  const getFilteredData = () => {
    if (timeframe === '24h') return forecast.filter(d => d.hourOffset <= 24);
    if (timeframe === '48h') return forecast.filter(d => d.hourOffset <= 48);
    return forecast;
  };

  const chartData = getFilteredData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 backdrop-blur border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 select-none">
          <p className="font-bold text-white border-b border-slate-800 pb-1 text-sm">{data.timeLabel}</p>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Predicted AQI:</span>
            <span className="font-black font-mono text-cyan-400 text-base">{data.aqi}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Status Category:</span>
            <span className="font-bold px-1.5 py-0.5 rounded text-slate-950 text-[10px]" style={{
              backgroundColor: data.aqi > 300 ? '#7f1d1d' : data.aqi > 200 ? '#ef4444' : data.aqi > 150 ? '#f97316' : data.aqi > 100 ? '#eab308' : '#22c55e'
            }}>
              {data.status}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4 text-[11px]">
            <span className="text-slate-500">Confidence Band:</span>
            <span className="font-mono text-slate-300">{data.lowerBound} - {data.upperBound}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold tracking-wider uppercase">
              Deep Neural AutoRegressive Forecast
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Updated 2 mins ago
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">72-Hour Predictive AQI Trajectory for {city.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Machine learning simulation factoring expected diurnal wind shifts and urban traffic density cycles.</p>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setTimeframe('24h')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeframe === '24h' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Next 24 Hours
          </button>
          <button
            onClick={() => setTimeframe('48h')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeframe === '48h' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Next 48 Hours
          </button>
          <button
            onClick={() => setTimeframe('72h')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeframe === '72h' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Next 72 Hours (Full)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={city.color} stopOpacity={0.6} />
                <stop offset="95%" stopColor={city.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="timeLabel" 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              domain={[0, 'dataMax + 50']}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={100} stroke="#eab308" strokeDasharray="4 4" label={{ value: 'Moderate Limit (100)', fill: '#eab308', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Poor Threshold (200)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            <Area 
              type="monotone" 
              dataKey="aqi" 
              stroke={city.color} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#aqiAreaGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical Benchmark Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-500 uppercase text-[10px] font-bold block">Today Baseline</span>
          <span className="text-xl font-black font-mono text-white mt-1 block">{forecast[0]?.aqi || 180} <span className="text-xs font-normal text-slate-400">AQI</span></span>
          <span className="text-[11px] text-slate-400 mt-1 block">Status: {forecast[0]?.status}</span>
        </div>
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-500 uppercase text-[10px] font-bold block">Tomorrow (+24h)</span>
          <span className="text-xl font-black font-mono text-cyan-400 mt-1 block">{forecast[3]?.aqi || 220} <span className="text-xs font-normal text-slate-400">AQI</span></span>
          <span className="text-[11px] text-slate-400 mt-1 block">Status: {forecast[3]?.status}</span>
        </div>
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-500 uppercase text-[10px] font-bold block">After 2 Days (+48h)</span>
          <span className="text-xl font-black font-mono text-indigo-400 mt-1 block">{forecast[4]?.aqi || 250} <span className="text-xs font-normal text-slate-400">AQI</span></span>
          <span className="text-[11px] text-slate-400 mt-1 block">Status: {forecast[4]?.status}</span>
        </div>
      </div>
    </div>
  );
};
