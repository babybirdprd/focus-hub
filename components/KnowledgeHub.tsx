import React, { useState, useEffect } from 'react';
import { RepoDetails } from '../types';
import { fetchRepoDetails, getRepoById } from '../services/mockApi';
import { Folder, FileText, Bot, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';

interface KnowledgeHubProps {
  watchedRepoIds: number[];
  initialRepoId?: number;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ watchedRepoIds, initialRepoId }) => {
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(initialRepoId || watchedRepoIds[0] || null);
  const [details, setDetails] = useState<RepoDetails | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRepoId) {
      fetchRepoDetails(selectedRepoId).then(d => {
        setDetails(d);
        const files = Object.keys(d.files);
        if (files.length > 0) setActiveFile(files[0]);
      });
    }
  }, [selectedRepoId]);

  const activeContent = (activeFile && details?.files[activeFile]) || "Select a file.";

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      
      {/* Sidebar: Repos & Files */}
      <div className="md:col-span-3 glass-panel rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/5 bg-white/5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Knowledge Base</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {watchedRepoIds.map(id => {
                 const r = getRepoById(id);
                 if(!r) return null;
                 const isActive = selectedRepoId === id;
                 return (
                    <div key={id} className="mb-2">
                        <button 
                            onClick={() => setSelectedRepoId(id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                                isActive ? 'text-white bg-white/5' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            {isActive ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <Folder size={14} className={isActive ? 'text-indigo-400' : 'text-slate-600'} /> 
                            {r.name}
                        </button>
                        
                        {isActive && details && (
                             <div className="ml-4 mt-1 pl-3 border-l border-white/10 space-y-1">
                                {Object.keys(details.files).map(fileName => (
                                    <button
                                        key={fileName}
                                        onClick={() => setActiveFile(fileName)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center gap-2 transition-all font-mono ${
                                            activeFile === fileName 
                                            ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20' 
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                        }`}
                                    >
                                        <FileText size={12} /> {fileName}
                                    </button>
                                ))}
                             </div>
                        )}
                    </div>
                 )
            })}
        </div>
      </div>

      {/* Main Content: Markdown Viewer */}
      <div className="md:col-span-9 flex flex-col relative h-full">
         <div className="glass-card rounded-xl flex-1 overflow-hidden relative shadow-2xl flex flex-col border border-white/5">
             {/* Toolbar */}
             <div className="h-14 border-b border-white/5 bg-[#0B0C15] flex items-center px-6 justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-indigo-400" />
                    <span className="text-sm text-slate-200 font-mono font-bold">{activeFile}</span>
                </div>
                <span className="px-2 py-1 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">Read Only</span>
             </div>
             
             {/* Viewer */}
             <div className="flex-1 p-8 overflow-y-auto bg-[#050811]">
                 <article className="prose prose-invert prose-indigo max-w-4xl mx-auto">
                    {/* Simulated Markdown Rendering */}
                    <div className="whitespace-pre-wrap font-sans text-slate-300 leading-8">
                        {activeContent.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white mb-6 mt-8 pb-4 border-b border-white/10 tracking-tight">{line.replace('# ', '')}</h1>
                            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold text-indigo-100 mb-4 mt-8">{line.replace('## ', '')}</h2>
                            if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-slate-300 mb-2 pl-2 marker:text-indigo-500">{line.replace('- ', '')}</li>
                            if (line.trim() === '') return <br key={i} />
                            return <p key={i} className="mb-4 text-slate-400 font-light">{line}</p>
                        })}
                    </div>
                 </article>
             </div>

             {/* FAB */}
             <div className="absolute bottom-8 right-8">
                <button className="group relative bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-4 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
                    <div className="relative flex items-center gap-2">
                        <MessageSquare size={20} />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap group-hover:pr-2 font-medium text-sm">Ask Jules</span>
                    </div>
                </button>
             </div>
         </div>
      </div>

    </div>
  );
};

export default KnowledgeHub;