import React, { useState } from 'react';
import { AgentConfig } from '../types';
import { 
  FileCode, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  ExternalLink, 
  Layers, 
  Cpu, 
  Play, 
  RefreshCw 
} from 'lucide-react';

interface SystemPromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: AgentConfig[];
}

export const SystemPromptsModal: React.FC<SystemPromptsModalProps> = ({
  isOpen,
  onClose,
  agents,
}) => {
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const currentAgent = agents[selectedAgentIndex] || agents[0];

  const handleCopySingle = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const fullBundle = agents
      .map(
        (a) => `=====================================================
AGENTE: ${a.name} (${a.title})
PAPEL: ${a.role} | MODELO RECOMENDADO: ${a.modelAssigned}
=====================================================
${a.systemPrompt}

HABILIDADES INJETADAS (SKILLS):
${a.skills.map((s) => s.systemInstructionAddon).join('\n')}
`
      )
      .join('\n\n');

    navigator.clipboard.writeText(fullBundle);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Test current agent with Gemini API on backend
  const handleTestPrompt = async () => {
    setIsTesting(true);
    setTestOutput(null);

    try {
      const response = await fetch('/api/pipeline/run-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: currentAgent.role === 'leader' ? 'research' : currentAgent.role,
          agentRole: currentAgent.role,
          theme: 'O Mistério Cósmico do Sinal WOW de 1977',
        }),
      });
      const data = await response.json();
      setTestOutput(JSON.stringify(data.data, null, 2));
    } catch {
      setTestOutput('Erro ao conectar ao motor de IA.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Prompts de Sistema com Foco em Orquestração</span>
                <span className="text-xs font-mono font-normal text-amber-400 border border-amber-500/30 rounded px-1.5 py-0.5">
                  Google AI Studio Ready
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Copie os prompts estruturados e cole diretamente na sua chave ou projeto do Google AI Studio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copiado Todos!' : 'Copiar Todos (Bundle)'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left = Agent Tabs | Right = Code/Prompt Viewer */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          
          {/* Agent Selection List */}
          <div className="p-4 border-r border-neutral-800 bg-neutral-950/50 space-y-1.5 overflow-y-auto max-h-[68vh]">
            <span className="text-[11px] font-mono text-neutral-500 uppercase px-2 mb-2 block tracking-wider">
              Selecione o Agente
            </span>
            {agents.map((ag, idx) => (
              <button
                key={ag.id}
                onClick={() => {
                  setSelectedAgentIndex(idx);
                  setTestOutput(null);
                }}
                className={`w-full p-2.5 rounded-lg text-left transition-all flex flex-col ${
                  selectedAgentIndex === idx
                    ? 'bg-neutral-900 border border-amber-500/40 shadow-sm'
                    : 'hover:bg-neutral-900/60 text-neutral-400 border border-transparent'
                }`}
              >
                <div className="font-semibold text-white text-xs">{ag.name}</div>
                <div className="text-[11px] text-neutral-400 truncate mt-0.5">{ag.title}</div>
                <div className="text-[10px] text-amber-400/90 font-mono mt-1">
                  Modelo: {ag.modelAssigned}
                </div>
              </button>
            ))}
          </div>

          {/* Prompt Viewer and Test Panel */}
          <div className="md:col-span-2 p-5 overflow-y-auto max-h-[68vh] space-y-4 bg-neutral-900/40">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{currentAgent.name}</span>
                  <span className="text-xs font-mono text-neutral-400">({currentAgent.role})</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{currentAgent.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestPrompt}
                  disabled={isTesting}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testando...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Testar com Gemini</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopySingle(currentAgent.id, currentAgent.systemPrompt)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copiedId === currentAgent.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Copiar Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* System Instruction Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400">System Instruction Completa:</label>
              <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto selection:bg-amber-500 selection:text-neutral-950">
                {currentAgent.systemPrompt}
              </pre>
            </div>

            {/* Injected Skills for this Agent */}
            {currentAgent.skills.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <label className="text-xs font-mono text-neutral-400">Skills Injetadas (Add-on Instructions):</label>
                <div className="space-y-2">
                  {currentAgent.skills.map((s) => (
                    <div key={s.id} className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-300">
                      <div className="text-purple-400 font-bold mb-1">{s.name} (v{s.version})</div>
                      <pre className="whitespace-pre-wrap text-[11px] text-neutral-400">{s.systemInstructionAddon}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Execution Output Box */}
            {testOutput && (
              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400">Resposta Testada em Tempo Real:</span>
                  <span className="text-neutral-500 font-mono">Status: 200 OK</span>
                </div>
                <pre className="p-3.5 bg-neutral-950 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 whitespace-pre-wrap max-h-56 overflow-y-auto">
                  {testOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
