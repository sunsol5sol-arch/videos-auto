import React from 'react';
import { 
  Workflow, 
  Bot, 
  Cpu, 
  Clapperboard, 
  Send, 
  Sliders, 
  Play, 
  FileCode,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'kanban' | 'agents' | 'failover' | 'scenes' | 'studio' | 'telegram';
  setActiveTab: (tab: 'kanban' | 'agents' | 'failover' | 'scenes' | 'studio' | 'telegram') => void;
  onOpenPromptsModal: () => void;
  onRunAutonomousPipeline: () => void;
  isRunningPipeline: boolean;
  projectTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPromptsModal,
  onRunAutonomousPipeline,
  isRunningPipeline,
  projectTitle,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clapperboard className="w-4 h-4" />
          </div>
          <a href="#" className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            <span>AutoVideo</span>
            <span className="text-xs font-mono font-normal text-amber-400 border border-amber-500/30 rounded px-1.5 py-0.5">AI Engine</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean unboxed typography) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'kanban'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-amber-400" />
            <span>Esteira Kanban</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'agents'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span>Multi-Agentes</span>
          </button>

          <button
            onClick={() => setActiveTab('failover')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'failover'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hub & Failover</span>
          </button>

          <button
            onClick={() => setActiveTab('scenes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'scenes'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Scene Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5 text-rose-400" />
            <span>Video Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'telegram'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-blue-400" />
            <span>Telegram Bot</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenPromptsModal}
            className="px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
            title="Visualizar e copiar Prompts de Sistema para o Google AI Studio"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Prompts Orquestração</span>
          </button>

          <button
            onClick={onRunAutonomousPipeline}
            disabled={isRunningPipeline}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shadow-sm ${
              isRunningPipeline
                ? 'bg-amber-600/50 text-neutral-200 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold'
            }`}
          >
            {isRunningPipeline ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Executar Pipeline</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Sub-bar showing active project breadcrumb and API health */}
      <div className="bg-neutral-900/60 border-t border-neutral-800/80 px-4 sm:px-6 py-1.5 text-xs flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-2 truncate max-w-lg">
          <span className="text-neutral-500">Projeto Ativo:</span>
          <span className="text-neutral-200 font-medium truncate">{projectTitle}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-neutral-300">Failover Engine: Online</span>
          </div>
          <span className="text-neutral-600">|</span>
          <span className="font-mono text-neutral-400">Latência: 310ms</span>
        </div>
      </div>
    </header>
  );
};
