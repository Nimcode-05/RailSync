import React from 'react';
import { Train, AlertOctagon, Navigation, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export default function CorridorView({ stations, trains, disruptions, onSelectTrain, onSimulateRecovery }) {
  const maxDistance = 634.0; // NDLS to PRYJ in km

  const getStationPositionPercent = (km) => {
    return Math.min(Math.max((km / maxDistance) * 100, 2), 98);
  };

  const getTrainPositionPercent = (currentStationCode) => {
    const station = stations.find((s) => s.code === currentStationCode);
    if (!station) return 50;
    return getStationPositionPercent(station.km_distance);
  };

  const getStatusColor = (status, delay) => {
    if (status === 'HELD_AT_LOOP') return 'bg-purple-500 text-purple-100 border-purple-400';
    if (delay > 45) return 'bg-rose-500 text-rose-100 border-rose-400 animate-pulse';
    if (delay > 10) return 'bg-amber-500 text-amber-100 border-amber-400';
    return 'bg-emerald-500 text-emerald-100 border-emerald-400';
  };

  const totalDelay = trains.reduce((acc, t) => acc + (t.current_delay_min || 0), 0);
  const onTimeCount = trains.filter((t) => (t.current_delay_min || 0) <= 10).length;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Rakes Monitored</span>
            <Train className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{trains.length}</span>
            <span className="text-xs text-slate-400">coaching & freight</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <span>● {onTimeCount} On-Time / Buffer Safe</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Corridor Delay</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-400">{Math.round(totalDelay)}</span>
            <span className="text-xs text-slate-400">minutes combined</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-400">
            Avg: {Math.round(totalDelay / (trains.length || 1))} min/train
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Weather & Speed Cautions</span>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-400">{disruptions.filter(d => d.is_active).length}</span>
            <span className="text-xs text-slate-400">active speed orders</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-400">
            Speed cap down to 45 km/h
          </div>
        </div>

        <div className="bg-slate-900 border border-cyan-800/40 rounded-xl p-4 shadow-sm bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400">AI Decision Support</span>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-xs font-medium text-slate-200">Precedence Action Ready</span>
            <div className="text-[11px] text-slate-400 mt-0.5">Potential: -62 min saved</div>
          </div>
          <button
            onClick={onSimulateRecovery}
            className="mt-2 w-full py-1 text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition font-semibold"
          >
            Review Recommendation →
          </button>
        </div>
      </div>

      {/* Corridor Linear Schematic Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Navigation className="h-4 w-4 text-cyan-400" />
              Live Linear Track Diagram: NDLS – PRYJ Section (634 Km)
            </h2>
            <p className="text-xs text-slate-400">
              Interactive automatic block signaling corridor. Stations plotted proportionally by kilometer distance.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span> On Time
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span> Delayed (&gt;10m)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400"></span> Critical (&gt;45m)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span> Held on Loop
            </span>
          </div>
        </div>

        {/* The Track Line Container */}
        <div className="relative pt-12 pb-14 px-4 overflow-x-auto">
          {/* Active Disruption Zone Highlight (e.g. Km 301 to 440: ETW to CNB) */}
          <div
            className="absolute h-9 bg-rose-500/10 border-y border-dashed border-rose-500/40 rounded-sm pointer-events-none top-8 flex items-center justify-center"
            style={{
              left: `${getStationPositionPercent(301.0)}%`,
              width: `${getStationPositionPercent(440.0) - getStationPositionPercent(301.0)}%`,
            }}
          >
            <span className="text-[10px] font-mono text-rose-300 font-bold tracking-tight bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60 shadow">
              ⚠️ WATERLOGGING CAUTION (45 km/h cap)
            </span>
          </div>

          {/* Main Up & Down Track Rails */}
          <div className="relative h-2 bg-slate-700 rounded-full my-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 opacity-30 rounded-full"></div>
            {/* Sleeper ticks */}
            <div className="absolute inset-0 flex justify-between px-1">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-3 w-0.5 bg-slate-600 -mt-0.5"></div>
              ))}
            </div>
          </div>

          {/* Station Markers */}
          {stations.map((st) => {
            const pos = getStationPositionPercent(st.km_distance);
            return (
              <div
                key={st.code}
                className="absolute flex flex-col items-center -translate-x-1/2 top-4"
                style={{ left: `${pos}%` }}
              >
                <div className="h-4 w-4 rounded-full border-2 border-slate-900 bg-cyan-400 shadow-md flex items-center justify-center z-10">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-900"></div>
                </div>
                <div className="text-center mt-3">
                  <div className="text-xs font-bold text-slate-200">{st.code}</div>
                  <div className="text-[10px] text-slate-400 whitespace-nowrap">{st.name}</div>
                  <div className="text-[9px] font-mono text-cyan-400/80">{st.km_distance} km</div>
                </div>
              </div>
            );
          })}

          {/* Train Markers on Track */}
          {trains.map((train, idx) => {
            const pos = getTrainPositionPercent(train.current_station_code);
            // Slight offset if trains share same station to avoid stacking
            const offset = (idx % 2 === 0 ? 1 : -1) * (idx * 2);
            const statusClass = getStatusColor(train.status, train.current_delay_min);

            return (
              <button
                key={train.train_number}
                onClick={() => onSelectTrain(train.train_number)}
                className={`absolute group -translate-x-1/2 -top-8 transition-transform hover:scale-110 z-20 focus:outline-none`}
                style={{ left: `calc(${pos}% + ${offset}px)` }}
                title={`${train.train_number} ${train.train_name} | Delay: ${train.current_delay_min}m | Speed: ${train.current_speed} km/h`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-lg flex items-center space-x-1 ${statusClass}`}
                  >
                    <Train className="h-3 w-3" />
                    <span>{train.train_number}</span>
                  </div>
                  <div className="h-3 w-0.5 bg-slate-400"></div>
                  <div className="text-[9px] font-semibold text-slate-300 bg-slate-950/80 px-1 rounded shadow">
                    +{Math.round(train.current_delay_min)}m
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
