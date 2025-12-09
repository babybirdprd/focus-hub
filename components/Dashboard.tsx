import React, { useEffect, useState } from 'react';
import { fetchRepoDetails, getRepoById } from '../services/mockApi';
import { RepoDetails, ViewState } from '../types';
import { Activity, GitPullRequest, AlertCircle, BookOpen, Zap, Lock, Globe } from 'lucide-react';

interface DashboardProps {
  watchedRepoIds: number[];
  navigateTo: (view: ViewState, repoId?: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ watchedRepoIds, navigateTo }) => {
  const [repoData, setRepoData] = useState<Record<number, RepoDetails>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data: Record<number, RepoDetails> = {};
      for (const id of watchedRepoIds) {
        data[id] = await fetchRepoDetails(id);
      }
      setRepoData(data);
      setLoading(false);
    };
    if (watchedRepoIds.length > 0) loadData();
    else setLoading(false);
  }, [watchedRepoIds]);

  const totalIssues = (Object.values(repoData) as RepoDetails[]).reduce((acc, curr) => acc + curr.issues.length, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Command Center</h2>
                <p className="text-slate-400 text-lg font-light">
                    System Alert: <span className="text-red-400 font-medium drop-shadow-sm">{totalIssues} Critical Issues</span> detected across active sectors.
                </p>
            </div>
            <button className="group relative bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all overflow-hidden border border-white/5 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-3">
                    <Zap size={18} className="text-indigo-400 group-hover:text-white transition-colors" fill="currentColor" /> 
                    <span>Run Jules Analysis</span>
                </div>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Grid: Pulse Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          {watchedRepoIds.length === 0 ? (
            <div className="col-span-full border border-dashed border-slate-800 rounded-2xl p-16 text-center bg-slate-900/30">
              <p className="text-slate-500">No signals detected. Initialize watchlist to begin monitoring.</p>
            </div>
          ) : (
             watchedRepoIds.map(id => {
              const repo = getRepoById(id);
              const details = repoData[id];
              
              if (!repo) return null;

              return (
                <div key={id} className="glass-card rounded-2xl p-6 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-[220px]">
                  
                  {/* Decorative Background Glow on Hover */}
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                            {repo.private ? (
                                <Lock size={12} className="text-slate-500" />
                            ) : (
                                <Globe size={12} className="text-slate-500" />
                            )}
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{repo.private ? 'Private' : 'Public'}</span>
                        </div>
                        <h3 className="font-bold text-white text-xl tracking-tight group-hover:text-indigo-200 transition-colors">{repo.name}</h3>
                      </div>
                      <button 
                            onClick={(e) => { e.stopPropagation(); navigateTo('knowledge', id); }}
                            className="p-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-indigo-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/40 transition-all border border-white/5" 
                            title="Access Knowledge Base">
                            <BookOpen size={18} />
                      </button>
                    </div>
                  </div>

                  {loading || !details ? (
                    <div className="space-y-3 animate-pulse mt-auto">
                        <div className="h-2 bg-slate-700/50 rounded w-1/3"></div>
                        <div className="h-8 bg-slate-800/50 rounded w-full"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 mt-auto relative z-10">
                        <div 
                            className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 cursor-pointer hover:bg-red-500/10 transition-colors group/stat" 
                            onClick={() => navigateTo('projects', id)}
                        >
                            <div className="flex items-center gap-2 text-red-400 mb-1">
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Issues</span>
                            </div>
                            <span className="text-3xl font-light text-red-200 font-mono tracking-tighter group-hover/stat:text-red-400 transition-colors">
                                {details.issues.length}
                            </span>
                        </div>

                        <div 
                            className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 cursor-pointer hover:bg-emerald-500/10 transition-colors group/stat"
                            onClick={() => navigateTo('projects', id)}
                        >
                             <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                <GitPullRequest size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">PRs</span>
                            </div>
                            <span className="text-3xl font-light text-emerald-200 font-mono tracking-tighter group-hover/stat:text-emerald-400 transition-colors">
                                {details.prs.length}
                            </span>
                        </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar: Jules Activity Widget */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-6 h-full backdrop-blur-md">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 tracking-wide">
                <Activity size={16} className="text-indigo-400" /> 
                LIVE FEED
            </h3>
            <div className="space-y-6 relative">
                {/* Timeline Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/50 to-transparent"></div>
                
                {[1, 2, 3].map((i) => (
                    <div key={i} className="relative pl-8 group">
                        <div className="absolute left-0 top-1.5 w-[15px] h-[15px] bg-[#020617] border-2 border-indigo-500 rounded-full z-10 shadow-[0_0_10px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform"></div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-indigo-300 font-mono">auth-service</span>
                            <span className="text-[10px] text-slate-500">10m ago</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-snug">
                            Jules generated a PR for <span className="text-white font-medium cursor-pointer hover:text-indigo-400 transition-colors">#402</span>: Refactoring Middleware.
                        </p>
                    </div>
                ))}
                 <div className="relative pl-8 group">
                        <div className="absolute left-0 top-1.5 w-[15px] h-[15px] bg-[#020617] border-2 border-slate-700 rounded-full z-10 group-hover:border-slate-500 transition-colors"></div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-slate-400 font-mono">focus-hub</span>
                            <span className="text-[10px] text-slate-500">1h ago</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-snug">
                           Analysis complete on documentation structure.
                        </p>
                    </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;