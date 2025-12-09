import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import KnowledgeHub from './components/KnowledgeHub';
import WatchlistManager from './components/WatchlistManager';
import SettingsModal from './components/SettingsModal';
import { ViewState } from './types';
import { getApiKeysStatus, WatchlistStore } from './services/tauriApi';

const App: React.FC = () => {
  // State for Navigation
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // State for Data
  const [watchedRepoIds, setWatchedRepoIds] = useState<number[]>([]);
  const [selectedRepoContext, setSelectedRepoContext] = useState<number | undefined>(undefined);

  // Modal State
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [keysConfigured, setKeysConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        // Check Keys
        const status = await getApiKeysStatus();
        setKeysConfigured(status);
        if (!status) {
          setIsSettingsOpen(true);
        }

        // Load Watchlist
        const ids = await WatchlistStore.getWatchedRepoIds();
        setWatchedRepoIds(ids);
      } catch (e) {
        console.error("Failed to initialize app:", e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Navigation Helper
  const navigateTo = (view: ViewState, repoId?: number) => {
      setCurrentView(view);
      if (repoId) setSelectedRepoContext(repoId);
  };

  // Watchlist Handlers
  const toggleWatch = async (id: number) => {
    const newIds = watchedRepoIds.includes(id)
      ? watchedRepoIds.filter(rId => rId !== id)
      : [...watchedRepoIds, id];

    setWatchedRepoIds(newIds);
    await WatchlistStore.setWatchedRepoIds(newIds);
  };

  // Render Content based on View
  const renderContent = () => {
    if (!keysConfigured && !isLoading) {
       return (
         <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <h2 className="text-xl text-slate-300">Configuration Required</h2>
            <p className="text-slate-500">Please set your API keys to continue.</p>
            <button onClick={() => setIsSettingsOpen(true)} className="text-indigo-400 hover:text-indigo-300 underline">Open Settings</button>
         </div>
       );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard watchedRepoIds={watchedRepoIds} navigateTo={navigateTo} />;
      case 'projects':
        return <Projects watchedRepoIds={watchedRepoIds} initialRepoId={selectedRepoContext} />;
      case 'knowledge':
        return <KnowledgeHub watchedRepoIds={watchedRepoIds} initialRepoId={selectedRepoContext} />;
      case 'agent':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
             <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 animate-pulse">
                     <span className="text-3xl">✦</span>
                </div>
             </div>
             <h2 className="text-2xl font-bold text-white">Jules Agent</h2>
             <p className="text-slate-400 max-w-md">Global agent history and configuration coming soon. Dispatch Jules from the "Active Projects" tab to start a task.</p>
          </div>
        );
      default:
        return <Dashboard watchedRepoIds={watchedRepoIds} navigateTo={navigateTo} />;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading Focus Hub...</div>;
  }

  return (
    <>
      <Layout 
        currentView={currentView} 
        setView={setCurrentView}
        openWatchlist={() => setIsWatchlistOpen(true)}
      >
        {renderContent()}
      </Layout>

      <WatchlistManager 
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchedRepoIds={watchedRepoIds}
        onToggleWatch={toggleWatch}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => {
           setKeysConfigured(true);
           setIsSettingsOpen(false);
        }}
      />
    </>
  );
};

export default App;
