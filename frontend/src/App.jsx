import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CorridorView from './components/CorridorView';
import TrainTable from './components/TrainTable';
import ETAPredictor from './components/ETAPredictor';
import PropagationRadar from './components/PropagationRadar';
import DisruptionAlerts from './components/DisruptionAlerts';
import RecoverySimulation from './components/RecoverySimulation';
import { fetchStations, fetchTrains, fetchDisruptions } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);
  const [disruptions, setDisruptions] = useState([]);
  const [selectedTrainNumber, setSelectedTrainNumber] = useState('22436');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const [stRes, trRes, disRes] = await Promise.all([
        fetchStations(),
        fetchTrains(),
        fetchDisruptions(),
      ]);
      setStations(stRes.data);
      setTrains(trRes.data);
      setDisruptions(disRes.data);
      if (trRes.data.length > 0 && !selectedTrainNumber) {
        setSelectedTrainNumber(trRes.data[0].train_number);
      }
    } catch (err) {
      console.error('Error fetching corridor data:', err);
      setError('Backend service connecting... Ensure FastAPI server is running on http://127.0.0.1:8000');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSelectTrain = (trainNumber) => {
    setSelectedTrainNumber(trainNumber);
    setActiveTab('eta');
  };

  const handleInspectPropagation = (trainNumber) => {
    setSelectedTrainNumber(trainNumber);
    setActiveTab('propagation');
  };

  const handleActionExecuted = () => {
    loadAllData();
  };

  const activeDisruptionsCount = disruptions.filter((d) => d.is_active).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={loadAllData}
        isRefreshing={isRefreshing}
        activeDisruptionsCount={activeDisruptionsCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadAllData}
              className="px-3 py-1 bg-amber-800/60 hover:bg-amber-700 rounded text-white font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-cyan-500 border-t-transparent mb-4"></div>
            <h3 className="text-base font-semibold text-white">Initializing RailSync Decision Support Platform</h3>
            <p className="text-xs text-slate-400 mt-1">Connecting to Northern Railway Trunk Corridor Telemetry & AI Models...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <CorridorView
                  stations={stations}
                  trains={trains}
                  disruptions={disruptions}
                  onSelectTrain={handleSelectTrain}
                  onSimulateRecovery={() => setActiveTab('recovery')}
                />
                <TrainTable
                  trains={trains}
                  onSelectTrain={handleSelectTrain}
                  onInspectPropagation={handleInspectPropagation}
                />
              </div>
            )}

            {activeTab === 'eta' && (
              <ETAPredictor
                trains={trains}
                selectedTrainNumber={selectedTrainNumber}
                onSelectTrain={setSelectedTrainNumber}
              />
            )}

            {activeTab === 'propagation' && (
              <PropagationRadar
                trains={trains}
                selectedTrainNumber={selectedTrainNumber}
                onSelectTrain={setSelectedTrainNumber}
              />
            )}

            {activeTab === 'disruptions' && (
              <DisruptionAlerts
                disruptions={disruptions}
                onRefresh={loadAllData}
              />
            )}

            {activeTab === 'recovery' && (
              <RecoverySimulation
                onActionExecuted={handleActionExecuted}
              />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Smart India Hackathon 2026 • PS ID: 26028 • Team: CodeVerse_1</span>
          <span className="font-mono text-slate-400">
            Pipeline: Predict ➔ Propagate ➔ Detect ➔ Simulate ➔ Optimize ➔ Recommend
          </span>
        </div>
      </footer>
    </div>
  );
}
