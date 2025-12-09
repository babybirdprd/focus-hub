import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import KnowledgeHub from './components/KnowledgeHub';
import WatchlistManager from './components/WatchlistManager';
import { ViewState } from './types';

const App: React.FC = () => {
  // State for Navigation
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // State for Data
  const [watchedRepoIds, setWatchedRepoIds] = useState<number[]>([102, 103]); // Default mocked user state
  const [selectedRepoContext, setSelectedRepoContext] = useState<number | undefined>(undefined);

  // Modal State
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Navigation Helper
  const navigateTo = (view: ViewState, repoId?: number) => {
      setCurrentView(view);
      if (repoId) setSelectedRepoContext(repoId);
  };

  // Watchlist Handlers
  const toggleWatch = (id: number) => {
    setWatchedRepoIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(rId => rId !== id);
      }
      return [...prev, id];
    });
  };

  // Render Content based on View
  const renderContent = () => {
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
    </>
  );
};

export default App;