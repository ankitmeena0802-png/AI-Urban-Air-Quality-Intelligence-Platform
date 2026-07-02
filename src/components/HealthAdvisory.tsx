import React, { useState } from 'react';
import { HeartPulse, ShieldAlert, CheckCircle2, Languages, Volume2, AlertTriangle } from 'lucide-react';
import { CityData } from '../types';

interface HealthAdvisoryProps {
  city: CityData;
}

export const HealthAdvisory: React.FC<HealthAdvisoryProps> = ({ city }) => {
  const { advisory, status, color, healthRisk } = city;
  const [activeLang, setActiveLang] = useState<'english' | 'hindi' | 'regional'>('english');

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (activeLang === 'hindi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Gemini Clinical Advisory System</span>
            <h2 className="text-lg font-bold text-white">Multilingual Public Health & Exposure Recommendations</h2>
          </div>
        </div>

        {/* Language Toggles */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <Languages className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
          <button
            onClick={() => setActiveLang('english')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeLang === 'english' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setActiveLang('hindi')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeLang === 'hindi' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी (Hindi)
          </button>
          <button
            onClick={() => setActiveLang('regional')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeLang === 'regional' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Regional
          </button>
        </div>
      </div>

      {/* Main Advisory Box */}
      <div 
        className="rounded-2xl p-6 border relative overflow-hidden transition-all shadow-lg"
        style={{ 
          backgroundColor: `${color}15`, 
          borderColor: `${color}40` 
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <span 
            className="px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider text-slate-950 shadow-sm"
            style={{ backgroundColor: color }}
          >
            Risk Category: {status} ({healthRisk} Risk)
          </span>

          <button
            onClick={() => speakText(advisory[activeLang])}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer shadow transition-all"
            title="Read aloud via Text-to-Speech"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Listen Audio</span>
          </button>
        </div>

        <p className="text-base text-slate-100 font-medium leading-relaxed">
          {advisory[activeLang]}
        </p>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Vulnerable Group Mandate: {advisory.sensitiveGroupsInfo}</span>
        </div>
      </div>

      {/* Actionable Precautions Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mandatory Citizen Intervention Checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {advisory.precautions.map((item, idx) => (
            <div 
              key={idx}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-200 hover:border-slate-700 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
