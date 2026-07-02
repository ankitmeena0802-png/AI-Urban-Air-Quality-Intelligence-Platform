import React from 'react';
import { Factory, Car, HardHat, Flame, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CityData } from '../types';

interface SourceAttributionProps {
  city: CityData;
  onRunAiReAnalysis: () => void;
  isAnalyzing?: boolean;
}

export const SourceAttribution: React.FC<SourceAttributionProps> = ({
  city,
  onRunAiReAnalysis,
  isAnalyzing = false
}) => {
  const { attribution } = city;

  const sources = [
    {
      id: 'src-vehicle',
      name: 'Vehicle Emission',
      prob: attribution.vehicle,
      icon: Car,
      color: '#3b82f6', // blue
      bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      description: 'Heavy diesel transport & peak hour commuter congestion exhaust.'
    },
    {
      id: 'src-industry',
      name: 'Industrial Output',
      prob: attribution.industry,
      icon: Factory,
      color: '#a855f7', // purple
      bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      description: 'Coal fly ash, chemical refineries & power plant stack plumes.'
    },
    {
      id: 'src-construction',
      name: 'Construction Dust',
      prob: attribution.construction,
      icon: HardHat,
      color: '#f97316', // orange
      bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      description: 'Excavation debris, metro line digging & unpaved road resuspension.'
    },
    {
      id: 'src-waste',
      name: 'Waste & Biomass Burning',
      prob: attribution.wasteBurning,
      icon: Flame,
      color: '#ef4444', // red
      bg: 'bg-red-500/10 border-red-500/30 text-red-400',
      description: 'Open landfill incineration & agricultural stubble fires.'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold tracking-wider uppercase">
              Gemini Spectral Neural Attribution
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time ML Model v4.2</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Pollution Source Probability Attribution</h2>
          <p className="text-xs text-slate-400 mt-0.5">Automated multi-spectral correlation of wind shear, traffic congestion, and industrial stack telemetry.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Confidence Score:</span>
            <span className="font-black text-emerald-400 font-mono text-sm">{attribution.confidenceScore}%</span>
          </div>

          <button
            onClick={onRunAiReAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Running Neural Audit...' : 'Re-Analyze Sources'}</span>
          </button>
        </div>
      </div>

      {/* Probability Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((s) => {
          const IconComp = s.icon;
          return (
            <div 
              key={s.id} 
              className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${s.bg}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-white font-mono tracking-tight">{s.prob}%</span>
                </div>

                <h3 className="font-bold text-sm text-slate-200">{s.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{s.description}</p>
              </div>

              {/* Bar Fill */}
              <div className="mt-5 pt-3 border-t border-slate-900">
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700" 
                    style={{ width: `${s.prob}%`, backgroundColor: s.color }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rationale Panel */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/30 border border-purple-500/20 rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-300 uppercase tracking-wider text-[11px]">AI Synthesis Rationale for {city.name}:</span>
            <span className="text-[10px] font-mono text-slate-500">GENERATED BY GEMINI 3.5</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-medium">{attribution.analysisRationale}</p>
        </div>
      </div>
    </div>
  );
};
