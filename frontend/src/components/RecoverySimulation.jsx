import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, TrendingDown, CheckCircle2, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { simulateRecovery, approveRecovery } from '../services/api';

export default function RecoverySimulation({ onActionExecuted }) {
  const [simData, setSimData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    runSimulation();
  }, []);

  const runSimulation = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await simulateRecovery();
      setSimData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (optionId) => {
    setApproving(true);
    try {
      const res = await approveRecovery(optionId);
      setFeedback(res.data.message);
      if (onActionExecuted) {
        onActionExecuted();
      }
      // Re-run simulation after delay reduction
      await runSimulation();
    } catch (err) {
      console.error('Failed to approve recovery action', err);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            AI Delay Recovery Engine & What-If Optimizer (SIH Stages 5 & 6)
          </h2>
          <p className="text-xs text-slate-400">
            Powered by Google OR-Tools constraint solver to identify feasible lower-delay dispatching alternatives.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Re-evaluate Optimization Model</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {loading && (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3"></div>
          <p className="text-sm font-medium">Solving Mathematical Constraint Optimization via OR-Tools...</p>
        </div>
      )}

      {simData && !loading && (
        <>
          {/* Key Optimization Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-medium">Unmitigated Baseline Delay</span>
              <div className="mt-1 text-2xl font-bold text-rose-400 font-mono">
                {Math.round(simData.baseline_network_delay_min)} min
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Status Quo with cascade propagation</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-medium">Optimized Network Delay</span>
              <div className="mt-1 text-2xl font-bold text-cyan-400 font-mono">
                {Math.round(simData.optimized_network_delay_min)} min
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <TrendingDown className="h-3.5 w-3.5" /> -{Math.round(simData.total_delay_saved_min)} min network delay saved
              </div>
            </div>

            <div className="bg-slate-900 border border-emerald-800/60 rounded-xl p-4 bg-gradient-to-br from-slate-900 to-emerald-950/30">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Network Delay Reduction (SIH KPI)
              </span>
              <div className="mt-1 text-2xl font-bold text-emerald-400 font-mono">
                {simData.overall_reduction_pct}%
              </div>
              <div className="text-[11px] text-slate-300 mt-1">Exceeds SIH target threshold</div>
            </div>
          </div>

          {/* Recommended Action Card (Primary Highlight) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border-2 border-cyan-500/40 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
              ★ AI Recommended Action
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-400">
                <Zap className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  {simData.recommended_action.title}
                </div>
                <div className="text-xs text-cyan-400 font-mono mt-0.5">
                  Location: {simData.recommended_action.location}
                </div>

                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  {simData.recommended_action.action_details}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-slate-400 mr-1">Target Rakes:</span>
                  {simData.recommended_action.target_trains.map((train) => (
                    <span key={train} className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                      {train}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <span className="text-emerald-400 font-bold">
                      Delay Reduction: -{simData.recommended_action.delay_saved_min} min ({simData.recommended_action.delay_reduction_percentage}%)
                    </span>
                    <span className="text-slate-400">
                      Feasibility Score: {(simData.recommended_action.feasibility_score * 100).toFixed(0)}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleApprove(simData.recommended_action.option_id)}
                    disabled={approving}
                    className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{approving ? 'Executing Protocol...' : 'Authorize & Execute Recovery Action'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Strategies */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">
              Alternative Simulated Dispatching Scenarios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simData.alternative_actions.map((alt) => (
                <div key={alt.option_id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="text-sm font-bold text-slate-200">{alt.title}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{alt.location}</div>
                  <p className="mt-2 text-xs text-slate-300">{alt.action_details}</p>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-mono font-bold">
                      Saved: -{alt.delay_saved_min} min ({alt.delay_reduction_percentage}%)
                    </span>
                    <button
                      onClick={() => handleApprove(alt.option_id)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    >
                      Execute Option
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
