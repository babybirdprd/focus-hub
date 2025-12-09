import React, { useState, useEffect } from 'react';
import { X, Search, Check, Plus, Loader2 } from 'lucide-react';
import { searchGithubRepos, getRepoById } from '../services/mockApi';
import { Repo } from '../types';

interface WatchlistManagerProps {
  isOpen: boolean;
  onClose: () => void;
  watchedRepoIds: number[];
  onToggleWatch: (id: number) => void;
}

const WatchlistManager: React.FC<WatchlistManagerProps> = ({ isOpen, onClose, watchedRepoIds, onToggleWatch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        setIsLoading(true);
        const data = await searchGithubRepos(query);
        setResults(data);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-700/50 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] relative">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0B0C15]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Manage Watchlist</h2>
            <p className="text-xs text-slate-500 mt-1">Select high-priority repositories to monitor.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 bg-[#0B0C15]/50">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-[#020617] rounded-xl border border-white/10 overflow-hidden">
                <Search className="ml-4 text-slate-500" size={20} />
                <input 
                type="text"
                placeholder="Search your GitHub repos (e.g., 'auth', 'focus')..."
                className="w-full bg-transparent border-none py-4 px-4 text-white focus:ring-0 placeholder-slate-600 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0B0C15]">
           {isLoading ? (
             <div className="flex justify-center py-12 text-indigo-400">
               <Loader2 className="animate-spin" size={32} />
             </div>
           ) : results.length > 0 ? (
             <div className="space-y-2">
               {results.map(repo => {
                 const isWatched = watchedRepoIds.includes(repo.id);
                 return (
                   <div key={repo.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                     <div>
                       <div className="flex items-center gap-3">
                         <span className="font-semibold text-slate-100 text-lg">{repo.name}</span>
                         {repo.private && (
                           <span className="text-[10px] uppercase tracking-wider bg-black/40 text-slate-500 px-2 py-1 rounded border border-white/10">Private</span>
                         )}
                       </div>
                       {repo.description && (
                         <p className="text-sm text-slate-500 mt-1 truncate max-w-[300px]">{repo.description}</p>
                       )}
                     </div>
                     <button
                        onClick={() => onToggleWatch(repo.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isWatched 
                            ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-105' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                        }`}
                     >
                       {isWatched ? <Check size={20} /> : <Plus size={20} />}
                     </button>
                   </div>
                 );
               })}
             </div>
           ) : (
             <div className="text-center py-16 text-slate-600">
               {query ? 'No repositories found matching your query.' : 'Type to search your repository index.'}
             </div>
           )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-[#020617] border-t border-white/5 text-center">
            <span className="text-xs font-mono text-slate-500">
                ACTIVE_WATCHLIST_COUNT: <span className="text-indigo-400">{watchedRepoIds.length}</span>
            </span>
        </div>

      </div>
    </div>
  );
};

export default WatchlistManager;