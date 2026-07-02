import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  Gauge, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  CloudRain,
  Compass
} from 'lucide-react';
import { CityData } from '../types';

interface DashboardCardsProps {
  city: CityData;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ city }) => {
  const { metrics, weather, status, color, healthRisk } = city;
  const [syncTime, setSyncTime] = useState<string>(() => new Date().toLocaleTimeString());

  useEffect(() => {
    setSyncTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setSyncTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, [city]);

  const cards = [
    {
      id: 'aqi-card',
      title: 'Current AQI',
      value: `${metrics.aqi}`,
      unit: 'US AQI',
      subtitle: status,
      subtitleColor: color,
      icon: Activity,
      iconBg: 'bg-red-500/10 border-red-500/20 text-red-400',
      progress: Math.min(100, (metrics.aqi / 500) * 100),
      progressColor: color,
      description: `Primary contaminant: ${city.mainPollutant}`
    },
    {
      id: 'pm25-card',
      title: 'PM2.5 Level',
      value: `${metrics.pm25}`,
      unit: 'µg/m³',
      subtitle: metrics.pm25 > 60 ? 'Unhealthy Spike' : 'Acceptable',
      subtitleColor: metrics.pm25 > 60 ? '#ef4444' : '#22c55e',
      icon: Wind,
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      progress: Math.min(100, (metrics.pm25 / 250) * 100),
      progressColor: metrics.pm25 > 60 ? '#ef4444' : '#22c55e',
      description: 'Fine aerosol respirable depth'
    },
    {
      id: 'pm10-card',
      title: 'PM10 Level',
      value: `${metrics.pm10}`,
      unit: 'µg/m³',
      subtitle: metrics.pm10 > 100 ? 'Coarse Dust Alert' : 'Normal',
      subtitleColor: metrics.pm10 > 100 ? '#f97316' : '#22c55e',
      icon: Gauge,
      iconBg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      progress: Math.min(100, (metrics.pm10 / 400) * 100),
      progressColor: metrics.pm10 > 100 ? '#f97316' : '#22c55e',
      description: 'Road dust & construction debris'
    },
    {
      id: 'temp-card',
      title: 'Temperature',
      value: `${weather.temperature}`,
      unit: '°C',
      subtitle: weather.weatherCondition,
      subtitleColor: '#38bdf8',
      icon: Thermometer,
      iconBg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
      progress: Math.min(100, ((weather.temperature + 10) / 60) * 100),
      progressColor: '#38bdf8',
      description: `Visibility: ${weather.visibility} km`
    },
    {
      id: 'humidity-card',
      title: 'Humidity',
      value: `${weather.humidity}`,
      unit: '%',
      subtitle: weather.humidity > 70 ? 'High Condensation' : 'Balanced',
      subtitleColor: '#818cf8',
      icon: Droplets,
      iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      progress: weather.humidity,
      progressColor: '#818cf8',
      description: `Rain probability: ${weather.rainProbability}%`
    },
    {
      id: 'wind-card',
      title: 'Wind Speed',
      value: `${weather.windSpeed}`,
      unit: 'km/h',
      subtitle: weather.windSpeed < 8 ? 'Stagnant Air' : 'Active Dispersion',
      subtitleColor: weather.windSpeed < 8 ? '#f43f5e' : '#10b981',
      icon: Compass,
      iconBg: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
      progress: Math.min(100, (weather.windSpeed / 40) * 100),
      progressColor: weather.windSpeed < 8 ? '#f43f5e' : '#10b981',
      description: `Direction: ${weather.windDirection}° Azimuth`
    },
    {
      id: 'risk-card',
      title: 'Health Risk Index',
      value: healthRisk,
      unit: 'RISK',
      subtitle: healthRisk === 'Severe' || healthRisk === 'High' ? 'N95 Mandatory' : 'Safe Outdoor',
      subtitleColor: color,
      icon: ShieldAlert,
      iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      progress: healthRisk === 'Severe' ? 100 : healthRisk === 'High' ? 75 : healthRisk === 'Moderate' ? 50 : 25,
      progressColor: color,
      description: 'Vulnerable group warning'
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Real-Time Telemetry Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Live atmospheric indices gathered from urban municipal monitoring stations</p>
        </div>
        <div className="text-[11px] text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
          Sync: <span className="text-emerald-400">{syncTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={card.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{card.title}</span>
                  <div className={`p-2 rounded-xl border ${card.iconBg} transition-transform group-hover:scale-110`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white tracking-tight">{card.value}</span>
                  <span className="text-xs font-bold text-slate-400 font-mono">{card.unit}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span 
                    className="text-xs font-bold px-2 py-0.5 rounded-md text-slate-950 font-mono inline-block shadow-sm"
                    style={{ backgroundColor: card.subtitleColor }}
                  >
                    {card.subtitle}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${card.progress}%`, backgroundColor: card.progressColor }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">{card.description}</p>
              </div>
            </div>
          );
        })}

        {/* Additional Mini Gas Matrix Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Secondary Gases</span>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/50">TRACE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">NO2 (Nitrogen)</span>
                <span className="font-bold text-slate-200 text-sm">{metrics.no2} <span className="text-[10px] text-slate-500">ppb</span></span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SO2 (Sulfur)</span>
                <span className="font-bold text-slate-200 text-sm">{metrics.so2} <span className="text-[10px] text-slate-500">ppb</span></span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CO (Carbon)</span>
                <span className="font-bold text-slate-200 text-sm">{metrics.co} <span className="text-[10px] text-slate-500">ppm</span></span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">O3 (Ozone)</span>
                <span className="font-bold text-slate-200 text-sm">{metrics.o3} <span className="text-[10px] text-slate-500">ppb</span></span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-2 font-medium">
            <span>EPA Standard Verified</span>
            <AlertTriangle className="w-3 h-3 text-amber-500" />
          </div>
        </div>
      </div>
    </section>
  );
};
