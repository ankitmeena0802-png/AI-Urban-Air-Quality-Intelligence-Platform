import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  TrendingUp, 
  Factory, 
  HeartPulse, 
  BotMessageSquare, 
  ShieldAlert, 
  GitCompare,
  Wind,
  X
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cityCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, cityCount, isOpen = false, onClose }) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'map' as ActiveTab, label: 'Live AQI Map', icon: Map, badge: 'LIVE' },
    { id: 'analytics' as ActiveTab, label: 'City Analytics', icon: BarChart3 },
    { id: 'forecast' as ActiveTab, label: 'AQI Forecast (72h)', icon: TrendingUp },
    { id: 'attribution' as ActiveTab, label: 'Source Attribution', icon: Factory, badge: 'AI' },
    { id: 'advisory' as ActiveTab, label: 'Health Advisory', icon: HeartPulse },
    { id: 'chat' as ActiveTab, label: 'AI Assistant', icon: BotMessageSquare, badge: 'Gemini' },
    { id: 'admin' as ActiveTab, label: 'Admin Panel', icon: ShieldAlert, alert: true },
    { id: 'compare' as ActiveTab, label: 'Multi-City Compare', icon: GitCompare },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen fixed inset-y-0 left-0 lg:sticky top-0 shrink-0 z-50 lg:z-30 select-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white shrink-0">
                <Wind className="w-6 h-6 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-lg text-white tracking-tight leading-none truncate">
                  VayuDrishti <span className="text-cyan-400 text-xs uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 ml-1">AI</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">Urban Air Quality Command</p>
              </div>
            </div>

            {/* Close Button on Mobile Drawer */}
            {onClose && (
              <button 
                onClick={onClose}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-2">Platform Modules</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      item.badge === 'LIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      item.badge === 'AI' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Status Panel */}
        <div className="p-4 m-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Sensor Grid
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">ONLINE</span>
          </div>
          <p className="text-[11px] text-slate-500">Monitoring {cityCount} Major Cities across South Asia with 99.4% Uptime.</p>
        </div>
      </aside>
    </>
  );
};
