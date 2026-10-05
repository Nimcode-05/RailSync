import React from 'react';
import { Train, Activity, AlertTriangle, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onRefresh, isRefreshing, activeDisruptionsCount }) {
  const tabs = [
    { id: 'overview', label: 'Network Overview', icon: Train },
    { id: 'eta', label: 'Dynamic ETA Predictor', icon: Cpu },
    { id: 'propagation', label: 'Delay Propagation Radar', icon: Activity },
    { id: 'disruptions', label: 'Disruption Awareness', icon: AlertTriangle, badge: activeDisruptionsCount },
    { id: 'recovery', label: 'Recovery & Optimization', icon: ShieldCheck, highlight: true },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Hackathon Tag */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-xl">
              <Train className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">RailSync</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  SIH26028
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE SIMULATION
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Dynamic Train ETA & Cascade Delay Mitigation Decision Support
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Refresh telemetry & telemetry models"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Sync Telemetry'}</span>
            </button>
            <div className="text-right hidden md:block border-l border-slate-800 pl-3">
              <div className="text-xs font-semibold text-slate-300">NDLS – CNB – PRYJ Trunk</div>
              <div className="text-[10px] text-slate-400 font-mono">Double Track Automatic Block</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    AI Rec
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
