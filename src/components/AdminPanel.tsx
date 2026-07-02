import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Building2, 
  PlusCircle,
  RefreshCw,
  Trophy,
  Activity
} from 'lucide-react';
import { PriorityAction, CityData } from '../types';

interface AdminPanelProps {
  cities: CityData[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ cities }) => {
  const [actions, setActions] = useState<PriorityAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New action form state
  const [newLoc, setNewLoc] = useState('');
  const [newCity, setNewCity] = useState('Delhi');
  const [newReason, setNewReason] = useState('');
  const [newActionText, setNewActionText] = useState('');

  const fetchActions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-actions');
      if (res.ok) {
        const data = await res.json();
        setActions(data);
      }
    } catch (e) {
      console.error('Failed to fetch admin actions', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleDispatch = async (actionId: string) => {
    try {
      const res = await fetch('/api/admin-actions/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId })
      });
      if (res.ok) {
        setActions(prev => prev.map(a => a.id === actionId ? { ...a, status: 'Team Deployed' } : a));
      }
    } catch (e) {
      console.error('Dispatch error', e);
    }
  };

  const handleResolve = async (actionId: string) => {
    try {
      const res = await fetch('/api/admin-actions/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId })
      });
      if (res.ok) {
        setActions(prev => prev.map(a => a.id === actionId ? { ...a, status: 'Action Resolved' } : a));
      }
    } catch (e) {
      console.error('Resolve error', e);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoc || !newReason) return;

    try {
      const res = await fetch('/api/admin-actions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: newLoc,
          city: newCity,
          priorityLevel: 'HIGH PRIORITY',
          reason: newReason,
          recommendedAction: newActionText || 'Enforce immediate emission stack shutdown.'
        })
      });
      if (res.ok) {
        const { action } = await res.json();
        setActions(prev => [action, ...prev]);
        setShowAddModal(false);
        setNewLoc('');
        setNewReason('');
        setNewActionText('');
      }
    } catch (err) {
      console.error('Create action err', err);
    }
  };

  // Sort cities by AQI highest to lowest for City Ranking
  const rankedCities = [...cities].sort((a, b) => b.metrics.aqi - a.metrics.aqi);

  return (
    <div className="space-y-6 select-none">
      {/* Government Command Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-500/30 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg shadow-red-600/20">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black tracking-widest uppercase">
              GOVERNMENT OF INDIA / MUNICIPAL CORP
            </span>
            <h2 className="text-xl font-black text-white mt-1">Central Pollution Control Admin Command Center</h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time municipal intervention audit, high priority enforcement dispatch, and national city ranking grid.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchActions}
            disabled={loading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 cursor-pointer transition-all"
            title="Refresh active intervention queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue Priority Mandate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* City Ranking Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                National AQI City Ranking
              </h3>
              <span className="text-[10px] font-mono text-slate-500">MOST POLLUTED TO LEAST</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[410px] pr-1">
              {rankedCities.map((c, i) => (
                <div 
                  key={c.id}
                  className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black font-mono text-[11px] ${
                      i === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      i === 1 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      i === 2 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      #{i + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white block leading-tight">{c.name}</span>
                      <span className="text-[10px] text-slate-500">{c.state}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span 
                      className="font-black font-mono px-2 py-0.5 rounded text-slate-950 text-xs inline-block shadow-sm"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.metrics.aqi} AQI
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium mt-0.5">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Actions Queue */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3 shrink-0">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400 animate-pulse" />
              Active Municipal Enforcement Queue ({actions.length})
            </h3>
            <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800/50 font-mono font-bold">
              AI DETECTED HOTSPOTS
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {actions.map((act) => (
              <div 
                key={act.id}
                className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
                  act.status === 'Action Resolved' 
                    ? 'bg-slate-950/40 border-slate-800/50 opacity-60' 
                    : act.priorityLevel === 'HIGH PRIORITY' 
                    ? 'bg-gradient-to-r from-red-950/40 to-slate-950 border-red-500/40 shadow-md' 
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border ${
                      act.priorityLevel === 'HIGH PRIORITY' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      act.priorityLevel === 'URGENT INTERVENTION' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                      'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    }`}>
                      {act.priorityLevel}
                    </span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {act.location} ({act.city})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-500 text-[11px]">{act.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      act.status === 'Team Deployed' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      act.status === 'Action Resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-3 font-medium leading-relaxed">
                  <span className="text-slate-500 font-bold">Trigger Reason: </span>
                  {act.reason}
                </p>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-cyan-300">
                    <span className="font-bold text-slate-400">Mandated Action: </span>
                    {act.recommendedAction}
                    <span className="block text-[10px] text-emerald-400 font-mono mt-0.5">AI Attribution Confidence: {act.confidence}%</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {act.status === 'Pending Dispatch' && (
                      <button
                        onClick={() => handleDispatch(act.id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-lg shadow transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        Deploy Squad
                      </button>
                    )}
                    {act.status === 'Team Deployed' && (
                      <button
                        onClick={() => handleResolve(act.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Resolved
                      </button>
                    )}
                    {act.status === 'Action Resolved' && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Mandate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-500" />
                Issue Emergency Municipal Enforcement Mandate
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Sector / Hotspot Location</label>
                <input 
                  type="text" 
                  required
                  value={newLoc}
                  onChange={e => setNewLoc(e.target.value)}
                  placeholder="e.g. Bawana Industrial Belt Sector 4"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">City</label>
                <select 
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kota">Kota</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Observed Violation / Reason</label>
                <input 
                  type="text" 
                  required
                  value={newReason}
                  onChange={e => setNewReason(e.target.value)}
                  placeholder="e.g. Unregulated nocturnal chemical stack discharge detected."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Recommended Municipal Intervention</label>
                <textarea 
                  rows={3}
                  value={newActionText}
                  onChange={e => setNewActionText(e.target.value)}
                  placeholder="e.g. Dispatch mobile air quality audit drone & seal production facility pending compliance audit."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  Publish Enforcement Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
