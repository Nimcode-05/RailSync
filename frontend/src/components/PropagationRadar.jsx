import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, GitFork, ArrowDownRight, ShieldAlert, Train } from 'lucide-react';
import { fetchPropagation } from '../services/api';

export default function PropagationRadar({ trains, selectedTrainNumber, onSelectTrain }) {
  const [propData, setPropData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeTrainNumber = selectedTrainNumber || (trains.length > 0 ? trains[0].train_number : null);

  useEffect(() => {
    if (activeTrainNumber) {
      loadPropagation(activeTrainNumber);
    }
  }, [activeTrainNumber]);

  const loadPropagation = async (trainNum) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPropagation(trainNum);
      setPropData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch propagation simulation data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-400" />
            Delay Propagation & Cascade Radar (SIH26028 Pipeline Stage 3)
          </h2>
          <p className="text-xs text-slate-400">
            Graph traversal simulating secondary knock-on delays across downstream track blocks and platforms.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {trains.map((t) => {
            const isSelected = t.train_number === activeTrainNumber;
            return (
              <button
                key={t.train_number}
                onClick={() => onSelectTrain(t.train_number)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {t.train_number} ({Math.round(t.current_delay_min)}m)
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-3"></div>
          <p className="text-sm font-medium">Calculating Headway & Network Cascade Propagation...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs">
          {error}
        </div>
      )}

      {propData && !loading && (
        <>
          {/* Cascade Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-medium">Primary Disturbance Source</span>
              <div className="mt-1 text-xl font-bold text-white">Train {propData.source_train_number}</div>
              <div className="mt-1 text-xs text-amber-400 font-mono">
                Primary Delay: +{Math.round(propData.source_delay_min)} min
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-medium">Downstream Knock-on Delay</span>
              <div className="mt-1 text-2xl font-bold text-rose-400 font-mono">
                +{Math.round(propData.total_network_knockon_delay_min)} min
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Cascading across {propData.affected_trains_count} interconnected trains
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-medium">Network Cascade Risk Index</span>
              <div className="mt-1">
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  propData.system_risk_index.includes('RED')
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {propData.system_risk_index}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Automatic block headway saturation
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-medium">Critical Junction Bottlenecks</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {propData.critical_junction_bottlenecks.map((j) => (
                  <span key={j} className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono font-bold text-xs border border-slate-700">
                    {j}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-[10px] text-slate-500">Kanpur Central Throat Conflict</div>
            </div>
          </div>

          {/* List of Affected Trains */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <GitFork className="h-4 w-4 text-purple-400" />
                Interconnected Affected Trains (Knock-On Impact Breakdown)
              </h3>
              <p className="text-xs text-slate-400">
                Trains scheduled or running behind the disturbance absorbing signal and platform queues.
              </p>
            </div>

            {propData.affected_trains.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No severe knock-on propagation detected for this train's current location and delay.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Affected Train</th>
                      <th className="py-3 px-4">Original Delay</th>
                      <th className="py-3 px-4">Secondary Knock-on</th>
                      <th className="py-3 px-4">Projected Total Delay</th>
                      <th className="py-3 px-4">Bottleneck Conflict Location</th>
                      <th className="py-3 px-4">Conflict Mechanism</th>
                      <th className="py-3 px-4">Risk Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {propData.affected_trains.map((t) => (
                      <tr key={t.train_number} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white text-sm">{t.train_number}</div>
                          <div className="text-slate-400">{t.train_name}</div>
                          <span className="text-[10px] text-cyan-400 uppercase font-mono">Priority {t.priority}</span>
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-400">
                          +{Math.round(t.original_delay_min)}m
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-rose-400">
                          +{Math.round(t.knock_on_delay_min)}m
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-950 text-white border border-slate-700">
                            +{Math.round(t.total_projected_delay_min)}m
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-300">
                          {t.conflict_location}
                        </td>

                        <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs">
                          {t.conflict_cause}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.risk_level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            t.risk_level === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}>
                            {t.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
