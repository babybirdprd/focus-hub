import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Book, 
  Bot, 
  Plus, 
  Settings,
  Zap
} from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  openWatchlist: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, openWatchlist, children }) => {
  
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`group relative flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'text-white' 
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {/* Active Background Glow */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-xl border border-white/5 shadow-[0_0_15px_rgba(99,102,241,0.15)]" />
        )}
        
        <Icon size={20} className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'group-hover:scale-110'}`} />
        <span className={`relative z-10 font-medium text-sm tracking-wide ${isActive ? 'text-indigo-100' : ''}`}>{label}</span>
      </button>
    );
  };

  const MobileNavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`flex flex-col items-center justify-center p-2 transition-all ${
          isActive ? 'text-indigo-400' : 'text-slate-500'
        }`}
      >
        <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : ''}`}>
           <Icon size={20} />
        </div>
        <span className="text-[10px] mt-1 font-medium tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen text-slate-200 flex flex-col md:flex-row">
      
      {/* Desktop Sidebar - Glass Effect */}
      <aside className="hidden md:flex flex-col w-72 fixed h-full z-20 border-r border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg shadow-lg shadow-indigo-500/20">
               <Zap size={16} className="text-white" fill="currentColor" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Focus Hub
            </span>
          </h1>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4 px-3">Menu</div>
          <NavItem view="dashboard" icon={LayoutDashboard} label="Command Center" />
          <NavItem view="projects" icon={FolderKanban} label="Projects" />
          <NavItem view="knowledge" icon={Book} label="Knowledge" />
          <NavItem view="agent" icon={Bot} label="Jules AI" />
        </nav>

        <div className="p-6 border-t border-white/5 bg-gradient-to-t from-indigo-900/10 to-transparent">
           <button 
            onClick={openWatchlist}
            className="group w-full flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 py-3 rounded-xl text-sm font-medium transition-all border border-white/5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <Plus size={16} className="text-indigo-400 group-hover:text-white transition-colors" /> 
            <span>Add Repository</span>
          </button>
          
          <div className="flex items-center gap-3 mt-6 px-1">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-0 animate-ping opacity-75" />
            </div>
            <span className="text-xs text-slate-400 font-mono">SYSTEM: ONLINE</span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar - Glass */}
      <header className="md:hidden fixed top-0 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 z-30 px-4 h-16 flex items-center justify-between">
        <h1 className="font-bold text-lg text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-md flex items-center justify-center">
                 <Zap size={12} className="text-white" fill="currentColor" />
            </div>
            Focus Hub
        </h1>
        <button 
          onClick={openWatchlist}
          className="w-9 h-9 flex items-center justify-center bg-indigo-600/20 border border-indigo-500/50 text-indigo-400 rounded-full active:scale-95 transition-transform"
        >
          <Plus size={18} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 pt-20 md:pt-0 pb-24 md:pb-0 min-h-screen overflow-y-auto scroll-smooth">
        <div className="max-w-7xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav - Glass */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#020617]/90 backdrop-blur-lg border-t border-white/5 h-20 grid grid-cols-4 z-30 pb-4 pt-2">
        <MobileNavItem view="dashboard" icon={LayoutDashboard} label="Home" />
        <MobileNavItem view="projects" icon={FolderKanban} label="Projects" />
        <MobileNavItem view="knowledge" icon={Book} label="Docs" />
        <MobileNavItem view="agent" icon={Bot} label="Agent" />
      </nav>
    </div>
  );
};

export default Layout;