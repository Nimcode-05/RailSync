import React from 'react';
import { AlertTriangle, CloudRain, Eye, ShieldAlert, CheckCircle, Clock, Zap } from 'lucide-react';
import { toggleDisruption } from '../services/api';

export default function DisruptionAlerts({ disruptions, onRefresh }) {
  const handleToggle = async (id) => {
    try {
      await toggleDisruption(id);
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle disruption status', err);
    }
  };

  const getDisruptionIcon = (type) => {
    if (type.includes('RAIN') || type.includes('WATERLOGGING')) {
      return <CloudRain className="h-5 w-5 text-rose-400" />;
    }
    if (type.includes('FOG')) {
      return <Eye className="h-5 w-5 text-amber-400" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Natural Disruption & Weather Hazard Module (SIH26028 Stage 4)
          </h2>
          <p className="text-xs text-slate-400">
            Real-time hazard monitoring imposing speed caps and tracking advance alert lead times.
          </p>
        </div>
      </div>

      {/* Disruption Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disruptions.map((dis) => (
          <div
            key={dis.id}
            className={`border rounded-xl p-5 transition shadow-lg ${
              dis.is_active
                ? 'bg-slate-900 border-rose-800/60 shadow-rose-950/20'
                : 'bg-slate-900/60 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${dis.is_active ? 'bg-rose-950/80 border border-rose-800' : 'bg-slate-800'}`}>
                  {getDisruptionIcon(dis.disruption_type)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {dis.section_name}
                    {dis.is_active ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                        ACTIVE CAUTION
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        CLEARED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Section: {dis.start_station_code} ➔ {dis.end_station_code}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleToggle(dis.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                  dis.is_active
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {dis.is_active ? 'Clear Caution Order' : 'Reactivate Hazard'}
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              {dis.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Enforced Speed Limit</span>
                <span className="text-sm font-bold text-rose-400 font-mono">
                  {dis.speed_cap_kmh} km/h Cap
                </span>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  Alert Lead Time (SIH KPI)
                </span>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  {dis.lead_time_min} minutes advance
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
