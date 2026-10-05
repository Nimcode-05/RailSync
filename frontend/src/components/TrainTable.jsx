import React from 'react';
import { Train, Gauge, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function TrainTable({ trains, onSelectTrain, onInspectPropagation, onUpdateDelay }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 1:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 w-fit">
            <Zap className="h-3 w-3" /> P1 Super
          </span>
        );
      case 2:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 w-fit">
            P2 Superfast
          </span>
        );
      case 3:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 w-fit">
            P3 Express
          </span>
        );
      case 4:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40 w-fit">
            P4 Passenger
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-500/20 text-zinc-300 border border-zinc-500/40 w-fit">
            P5 Freight
          </span>
        );
    }
  };

  const getStatusBadge = (status, delay) => {
    if (status === 'HELD_AT_LOOP') {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800">
          HELD AT LOOP
        </span>
      );
    }
    if (delay > 45) {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping"></span>
          CRITICAL (+{Math.round(delay)}m)
        </span>
      );
    }
    if (delay > 10) {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
          DELAYED (+{Math.round(delay)}m)
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
        ON TIME (+{Math.round(delay)}m)
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Train className="h-4 w-4 text-cyan-400" />
            Active Coaching & Freight Train Telemetry Board
          </h2>
          <p className="text-xs text-slate-400">
            Real-time speeds, accumulated section delays, and operational precedence.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Train Number & Name</th>
              <th className="py-3 px-4 font-semibold">Priority</th>
              <th className="py-3 px-4 font-semibold">Current Section</th>
              <th className="py-3 px-4 font-semibold">Speed Telemetry</th>
              <th className="py-3 px-4 font-semibold">Status & Delay</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {trains.map((train) => (
              <tr key={train.train_number} className="hover:bg-slate-800/30 transition">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white text-sm">{train.train_number}</div>
                  <div className="text-slate-400 text-xs">{train.train_name}</div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">{train.train_type}</div>
                </td>

                <td className="py-3.5 px-4">
                  {getPriorityBadge(train.priority)}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                    <span className="font-mono text-cyan-400 font-bold">{train.current_station_code}</span>
                    <ArrowRight className="h-3 w-3 text-slate-500" />
                    <span className="font-mono text-slate-400">{train.next_station_code}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Direction: {train.direction}</div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4 text-cyan-400" />
                    <div>
                      <span className="font-bold text-slate-200">{Math.round(train.current_speed)}</span>
                      <span className="text-slate-400 text-[10px]"> / {train.max_speed} km/h</span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  {getStatusBadge(train.status, train.current_delay_min)}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onSelectTrain(train.train_number)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition"
                      title="Inspect station-by-station dynamic ETA"
                    >
                      Dynamic ETA
                    </button>
                    <button
                      onClick={() => onInspectPropagation(train.train_number)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition"
                      title="Inspect delay cascade across network"
                    >
                      Propagation
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
