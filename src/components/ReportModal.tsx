import React from 'react';
import { FileText, Download, CheckCircle2, Building2, Calendar, ShieldAlert } from 'lucide-react';
import { CityData } from '../types';

interface ReportModalProps {
  city: CityData;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ city, onClose }) => {
  const downloadReport = () => {
    const reportText = `========================================================
VAYUDRISHTI AI SMART CITY ENVIRONMENTAL INTERVENTION REPORT
========================================================
Generated Timestamp: ${new Date().toLocaleString()}
Target Jurisdiction: ${city.name}, ${city.state} (${city.country})
Coordinates: ${city.lat.toFixed(4)}° N, ${city.lng.toFixed(4)}° E

1. REAL-TIME ATMOSPHERIC INDICES
--------------------------------------------------------
US AQI Index: ${city.metrics.aqi} [Verdict: ${city.status}]
Primary Attribution Cause: ${city.mainPollutant}
Health Risk Categorization: ${city.healthRisk} Risk

Particulate & Gas Matrix:
- PM2.5 Fine Aerosols: ${city.metrics.pm25} µg/m³
- PM10 Coarse Particulates: ${city.metrics.pm10} µg/m³
- NO2 Nitrogen Dioxide: ${city.metrics.no2} ppb
- SO2 Sulfur Dioxide: ${city.metrics.so2} ppb
- CO Carbon Monoxide: ${city.metrics.co} ppm
- O3 Surface Ozone: ${city.metrics.o3} ppb

2. METEOROLOGICAL DISPERSION OVERLAY
--------------------------------------------------------
Ambient Temperature: ${city.weather.temperature}°C
Relative Humidity: ${city.weather.humidity}%
Surface Wind Speed: ${city.weather.windSpeed} km/h (${city.weather.windDirection}° Azimuth)
Atmospheric Visibility: ${city.weather.visibility} km
Precipitation Probability: ${city.weather.rainProbability}%

Meteorological Rationale:
"${city.weatherExplanation}"

3. AI POLLUTION SOURCE PROBABILITY ATTRIBUTION
--------------------------------------------------------
- Vehicular Exhaust & Freight Transit: ${city.attribution.vehicle}%
- Industrial Plumes & Refineries: ${city.attribution.industry}%
- Construction Excavation Debris: ${city.attribution.construction}%
- Open Biomass & Landfill Burning: ${city.attribution.wasteBurning}%
[Neural Model Confidence Score: ${city.attribution.confidenceScore}%]

4. MULTILINGUAL CLINICAL HEALTH ADVISORY
--------------------------------------------------------
English Advisory:
"${city.advisory.english}"

Vulnerable Demographic Protocol:
"${city.advisory.sensitiveGroupsInfo}"

========================================================
OFFICIAL DOCUMENT - DEPARTMENT OF ENVIRONMENT & URBAN GIS
========================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VayuDrishti_AQI_Intervention_Report_${city.name}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Official Executive Dossier</span>
              <h3 className="font-bold text-base text-white">Smart City Environmental Intervention Audit Report</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm bg-slate-800 px-2.5 py-1 rounded-lg">✕</button>
        </div>

        {/* Report Preview Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-slate-400" />
              <div>
                <span className="font-bold text-white text-sm block">{city.name} Municipal Corp</span>
                <span className="text-[10px] text-slate-500">{city.state}, {city.country}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black font-mono text-base px-2.5 py-0.5 rounded text-slate-950 inline-block shadow-sm" style={{ backgroundColor: city.color }}>
                {city.metrics.aqi} AQI ({city.status})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-slate-300">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 uppercase text-[10px] block font-sans font-bold">Primary Pollutant</span>
              <span className="text-amber-400 font-bold text-sm mt-1 block">{city.mainPollutant} ({city.metrics.pm25} µg/m³)</span>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 uppercase text-[10px] block font-sans font-bold">Health Risk Rating</span>
              <span className="text-red-400 font-bold text-sm mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> {city.healthRisk} Index
              </span>
            </div>
          </div>

          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
            <span className="font-bold text-cyan-400 uppercase text-[10px] tracking-wider block">AI Source Attribution Synthesis:</span>
            <p>Vehicular Emissions ({city.attribution.vehicle}%) and Industrial Plumes ({city.attribution.industry}%) are dominating the local atmospheric aerosol load under current meteorological dispersion speeds ({city.weather.windSpeed} km/h).</p>
          </div>

          <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between text-emerald-300 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> EPA & Central Pollution Board Compliant Export
            </span>
            <span className="font-mono text-[10px] text-slate-400">PDF/TXT FORMAT</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancel Preview
          </button>
          <button
            onClick={() => { downloadReport(); onClose(); }}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Dossier (.TXT)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
