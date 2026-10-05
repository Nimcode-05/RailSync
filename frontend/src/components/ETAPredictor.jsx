import React, { useState, useEffect } from 'react';
import { Cpu, Clock, CheckCircle2, CloudRain, AlertTriangle, ArrowRight, Gauge, Layers } from 'lucide-react';
import { fetchTrainETA } from '../services/api';

export default function ETAPredictor({ trains, selectedTrainNumber, onSelectTrain }) {
  const [etaData, setEtaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeTrainNumber = selectedTrainNumber || (trains.length > 0 ? trains[0].train_number : null);

  useEffect(() => {
    if (activeTrainNumber) {
      loadETA(activeTrainNumber);
    }
  }, [activeTrainNumber]);

  const loadETA = async (trainNum) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTrainETA(trainNum);
      setEtaData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dynamic ETA prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Train Selector Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            AI Dynamic ETA Engine (SIH26028 Pipeline Stage 2)
          </h2>
          <p className="text-xs text-slate-400">
            Gradient-boosted decision trees calculating section-by-section dynamic arrival times.
          </p>
        </div>

        {/* Quick Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {trains.map((t) => {
            const isSelected = t.train_number === activeTrainNumber;
            return (
              <button
                key={t.train_number}
                onClick={() => onSelectTrain(t.train_number)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {t.train_number} {t.train_name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent mb-3"></div>
          <p className="text-sm font-medium">Running Dynamic Gradient Boosting ETA Regressor...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs">
          {error}
        </div>
      )}

      {etaData && !loading && (
        <>
          {/* Model Metrics & Active Rake Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">Selected Coaching Rake</div>
              <div className="mt-1 text-lg font-bold text-white">{etaData.train_number} – {etaData.train_name}</div>
              <div className="mt-2 flex items-center space-x-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Gauge className="h-3.5 w-3.5 text-cyan-400" />
                  {Math.round(etaData.current_speed_kmh)} km/h
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  Current Delay: +{Math.round(etaData.current_delay_min)}m
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                ML Regression Architecture
              </div>
              <div className="mt-1 text-sm font-semibold text-cyan-300">
                {etaData.model_metadata.engine}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Mean Absolute Error (MAE)</span>
                  <span className="text-emerald-400 font-bold">{etaData.model_metadata.mae}</span>
                </div>
                <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">R² Accuracy Metric</span>
                  <span className="text-cyan-400 font-bold">{etaData.model_metadata.r2_accuracy}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <CloudRain className="h-3.5 w-3.5 text-rose-400" />
                Disruption Awareness Input
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-200">
                Active Section Speed Restriction
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Traversing zone with speed capped at <strong className="text-rose-400 font-mono">{etaData.model_metadata.active_weather_cap}</strong> due to heavy rainfall warning.
              </div>
            </div>
          </div>

          {/* Station Arrival Comparison Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                Downstream Station Arrival Dynamic Forecast
              </h3>
              <p className="text-xs text-slate-400">
                Comparing published static timetable vs. dynamic AI predicted ETA with confidence intervals.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Station</th>
                    <th className="py-3 px-4">Distance</th>
                    <th className="py-3 px-4">Static Timetable</th>
                    <th className="py-3 px-4">Dynamic Forecast (ETA)</th>
                    <th className="py-3 px-4">Predicted True Delay</th>
                    <th className="py-3 px-4">Confidence Window</th>
                    <th className="py-3 px-4">Weather / Congestion Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {etaData.station_etas.map((st, idx) => (
                    <tr key={st.station_code} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                          {st.station_name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{st.station_code}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {st.distance_km} km
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {st.scheduled_arrival}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-sm font-bold text-cyan-400">
                          {st.predicted_eta}
                        </div>
                        <div className="text-[10px] text-slate-500">Predicted Dynamic ETA</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                          st.predicted_delay_min > 30 ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          st.predicted_delay_min > 10 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          +{st.predicted_delay_min} min
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        ± {st.confidence_interval_min} min (MAE)
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2 text-[11px]">
                          {st.weather_impact_delay_min > 0 && (
                            <span className="text-rose-400 flex items-center gap-1 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900">
                              <CloudRain className="h-3 w-3" /> +{st.weather_impact_delay_min}m
                            </span>
                          )}
                          {st.congestion_impact_delay_min > 0 && (
                            <span className="text-amber-400 flex items-center gap-1 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-900">
                              <AlertTriangle className="h-3 w-3" /> +{st.congestion_impact_delay_min}m
                            </span>
                          )}
                          {st.weather_impact_delay_min === 0 && st.congestion_impact_delay_min === 0 && (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Nominal Run
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
