import React, { useState, useEffect } from 'react';
import { RepoDetails, Issue } from '../types';
import { fetchRepoDetails, dispatchJulesAgent, getRepoById } from '../services/mockApi';
import { 
  GitPullRequest, 
  AlertCircle, 
  ChevronRight, 
  X, 
  Zap, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  Terminal
} from 'lucide-react';

interface ProjectsProps {
  watchedRepoIds: number[];
  initialRepoId?: number;
}

const Projects: React.FC<ProjectsProps> = ({ watchedRepoIds, initialRepoId }) => {
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(initialRepoId || watchedRepoIds[0] || null);
  const [details, setDetails] = useState<RepoDetails | null>(null);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [agentPlan, setAgentPlan] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (selectedRepoId) {
      fetchRepoDetails(selectedRepoId).then(setDetails);
    }
  }, [selectedRepoId]);

  useEffect(() => {
      if(activeIssue) {
          setInstructions(`Fix issue #${activeIssue.id}: ${activeIssue.title}\n\nContext: ${activeIssue.body}`);
          setAgentStatus('idle');
          setAgentPlan([]);
      }
  }, [activeIssue]);

  const handleDispatch = async () => {
    if (!activeIssue) return;
    setAgentStatus('running');
    const response = await dispatchJulesAgent(activeIssue.id, instructions);
    setAgentPlan(response.plan);
    setAgentStatus('done');
  };

  if (!selectedRepoId) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
            <p>Select a repository from your Watchlist.</p>
        </div>
    )
  }

  const selectedRepo = getRepoById(selectedRepoId);

  return (
    <div className="relative min-h-[calc(100vh-140px)]">
      {/* Project Selector Header */}
      <div className="flex overflow-x-auto pb-6 mb-2 gap-3 scrollbar-hide">
        {watchedRepoIds.map(id => {
            const r = getRepoById(id);
            if(!r) return null;
            const isSelected = selectedRepoId === id;
            return (
                <button
                    key={id}
                    onClick={() => { setSelectedRepoId(id); setActiveIssue(null); }}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                        isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                        : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }`}
                >
                    {r.name}
                </button>
            )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Issues & PRs */}
        <div className="space-y-6">
            {/* PR Section */}
            {details?.prs && details.prs.length > 0 && (
                <div className="glass-panel rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center backdrop-blur-md">
                        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                            <GitPullRequest size={14} className="text-emerald-400" /> Open Pull Requests
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {details.prs.map(pr => (
                            <div key={pr.id} className="p-5 hover:bg-white/5 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-slate-200 font-medium text-sm group-hover:text-emerald-300 transition-colors">{pr.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1.5 font-mono">
                                            #{pr.id} • opened by <span className={pr.author === 'jules-ai' ? 'text-indigo-400' : 'text-slate-400'}>{pr.author}</span>
                                        </p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        {pr.status}
                                    </span>
                                </div>
                                {pr.author === 'jules-ai' && (
                                    <div className="mt-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                            <Zap size={14} fill="currentColor" />
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            <span className="block text-indigo-300 font-bold mb-0.5">JULES GENERATED</span>
                                            Modified 3 files in <code className="text-slate-300 bg-black/30 px-1 py-0.5 rounded">/src/auth</code>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Issues Section */}
            <div className="glass-panel rounded-xl overflow-hidden">
                 <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                        <AlertCircle size={14} className="text-red-400" /> Active Issues
                    </h3>
                </div>
                <div className="divide-y divide-white/5">
                    {details?.issues.map(issue => (
                        <div 
                            key={issue.id} 
                            onClick={() => setActiveIssue(issue)}
                            className={`p-5 cursor-pointer transition-all border-l-2 ${
                                activeIssue?.id === issue.id 
                                ? 'bg-indigo-600/10 border-indigo-500' 
                                : 'hover:bg-white/5 border-transparent'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-mono text-slate-500">#{issue.id}</span>
                                <ChevronRight size={14} className={`text-slate-600 transition-transform ${activeIssue?.id === issue.id ? 'rotate-90 text-indigo-400' : ''}`} />
                            </div>
                            <h4 className={`font-medium text-sm mb-1 ${activeIssue?.id === issue.id ? 'text-white' : 'text-slate-300'}`}>{issue.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2">{issue.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: The "Dispatch" Interface (Desktop) or Slide Over */}
        <div className={`
            fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:static md:bg-transparent md:inset-auto md:z-auto md:block
            transition-transform duration-300 ease-in-out
            ${activeIssue ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            ${!activeIssue && 'md:hidden lg:hidden'}
        `}>
            {/* Mobile Close Button */}
            <button 
                onClick={() => setActiveIssue(null)}
                className="md:hidden absolute top-4 right-4 p-2 text-slate-400 bg-slate-800 rounded-full z-50 border border-white/10"
            >
                <X size={20} />
            </button>

            {activeIssue ? (
                <div className="h-full md:h-auto glass-card rounded-2xl flex flex-col overflow-hidden relative border border-indigo-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-[#0B0C15]/90">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-mono">ISSUE #{activeIssue.id}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wide font-bold">{selectedRepo?.name}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white leading-tight tracking-tight">{activeIssue.title}</h2>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-8 bg-[#0B0C15]/50">
                        <div className="prose prose-invert prose-sm max-w-none text-slate-300/90 leading-relaxed">
                            <p>{activeIssue.body}</p>
                        </div>

                        {agentStatus === 'done' && (
                             <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-5 animate-in slide-in-from-bottom-4 duration-500">
                                <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Strategy Executed
                                </h4>
                                <ul className="space-y-4">
                                    {agentPlan.map((step, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-sm text-emerald-100/80">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold font-mono">
                                                0{idx + 1}
                                            </div>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 pt-4 border-t border-emerald-500/20 flex justify-end">
                                    <button className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        REVIEW PULL REQUEST
                                    </button>
                                </div>
                             </div>
                        )}
                    </div>

                    {/* The Magic Bar */}
                    <div className="p-1 bg-[#020617] border-t border-white/10 sticky bottom-0">
                        {agentStatus === 'running' ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-8 text-indigo-400">
                                <Loader2 size={32} className="animate-spin text-indigo-500" />
                                <span className="text-sm font-mono animate-pulse">JULES_AGENT::ANALYZING_CONTEXT...</span>
                            </div>
                        ) : (
                            <div className={`transition-opacity duration-300 ${agentStatus === 'done' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                <div className="relative bg-[#0F111A] rounded-xl overflow-hidden border border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.1)] group focus-within:border-indigo-500 focus-within:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1b26] border-b border-white/5">
                                        <Terminal size={12} className="text-indigo-400" />
                                        <span className="text-[10px] text-slate-500 font-mono uppercase">Agent Terminal Input</span>
                                    </div>
                                    <div className="flex items-end gap-2 p-1">
                                        <textarea 
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            className="w-full bg-transparent border-0 text-indigo-100 text-sm font-mono focus:ring-0 p-3 min-h-[100px] resize-none placeholder-slate-600"
                                            placeholder="> Enter instructions for Jules..."
                                        />
                                        <button 
                                            onClick={handleDispatch}
                                            className="mb-2 mr-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-95 whitespace-nowrap"
                                        >
                                            <Zap size={14} fill="currentColor" /> Initialize
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // Desktop Placeholder
                <div className="hidden md:flex h-full border border-dashed border-slate-800 bg-slate-900/20 rounded-2xl items-center justify-center text-slate-600 flex-col gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                        <Terminal size={32} className="text-slate-700" />
                    </div>
                    <p className="font-mono text-sm">Select a ticket to initialize agent protocol.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Projects;