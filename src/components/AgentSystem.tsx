import React, { useState } from 'react';
import { AgentConfig, SkillItem } from '../types';
import { 
  Bot, 
  Sparkles, 
  BrainCircuit, 
  MessageSquare, 
  Sliders, 
  Copy, 
  Check, 
  Plus, 
  RotateCcw, 
  Play, 
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Code
} from 'lucide-react';

interface AgentSystemProps {
  agents: AgentConfig[];
  onUpdateAgent: (agent: AgentConfig) => void;
  onOpenSystemPromptsModal: () => void;
}

export const AgentSystem: React.FC<AgentSystemProps> = ({
  agents,
  onUpdateAgent,
  onOpenSystemPromptsModal,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'agent-leader');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [newSkillModalOpen, setNewSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillText, setNewSkillText] = useState('');

  // Interactive review loop state simulation
  const [isSimulatingLoop, setIsSimulatingLoop] = useState(false);
  const [loopStep, setLoopStep] = useState<number>(0);
  const [loopLogs, setLoopLogs] = useState<{ speaker: string; text: string; status?: string }[]>([]);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const handleCopyPrompt = () => {
    if (!selectedAgent) return;
    navigator.clipboard.writeText(selectedAgent.systemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleToggleMemory = () => {
    if (!selectedAgent) return;
    const newMemory = selectedAgent.memoryType === 'isolated' ? 'shared' : 'isolated';
    onUpdateAgent({ ...selectedAgent, memoryType: newMemory });
  };

  const handleModelChange = (model: string) => {
    if (!selectedAgent) return;
    onUpdateAgent({ ...selectedAgent, modelAssigned: model });
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim() || !newSkillText.trim()) return;
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      description: 'Habilidade customizada injetada pelo usuário',
      version: '1.0.0',
      tags: ['custom-skill'],
      systemInstructionAddon: `[SKILL: ${newSkillName.toUpperCase()}]\n${newSkillText.trim()}`,
      active: true,
    };
    onUpdateAgent({
      ...selectedAgent,
      skills: [...selectedAgent.skills, newSkill],
    });
    setNewSkillName('');
    setNewSkillText('');
    setNewSkillModalOpen(false);
  };

  // Run inter-agent review loop simulation (Scriptwriter -> Reviewer -> Rollback or Approval)
  const handleRunReviewLoop = () => {
    setIsSimulatingLoop(true);
    setLoopStep(1);
    setLoopLogs([
      {
        speaker: 'Ares (Orquestrador)',
        text: 'Despachando tema "O Enigma de 1977" para Hermes (Roteirista). Tempo limite de retenção do hook: 3 segundos.',
      },
    ]);

    setTimeout(() => {
      setLoopStep(2);
      setLoopLogs((prev) => [
        ...prev,
        {
          speaker: 'Hermes (Roteirista)',
          text: 'Roteiro preliminar v1 gerado: 5 cenas, 88 palavras. "Em 1977, um radiotelescópio solitário captou um sinal de 72 segundos..." Enviando para auditoria crítica.',
        },
      ]);

      setTimeout(() => {
        setLoopStep(3);
        setLoopLogs((prev) => [
          ...prev,
          {
            speaker: 'Kratos (Revisor Crítico)',
            text: 'Auditoria editorial executada. Nota: 9.3/10 (Hook: 9.5, Pacing: 9.2, Fatos: 9.6). Roteiro APROVADO sem rollback. Liberando avanço para a Bíblia do Projeto!',
            status: 'approved',
          },
        ]);
        setIsSimulatingLoop(false);
      }, 1600);
    }, 1400);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Sistema Múltiplos Agentes Autônomos</span>
            <span className="text-xs font-mono font-normal text-sky-400 border border-sky-500/30 rounded px-2 py-0.5">
              7 Agentes Especializados
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Cada agente possui papéis específicos, modelos LLM individuais, memória configurável e injeção de habilidades modulares (Skills).
            A comunicação inter-agente garante validação cruzada contínua.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSystemPromptsModal}
            className="px-3.5 py-2 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Ver Prompts Completos AI Studio</span>
          </button>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {agents.map((ag) => {
          const isSelected = ag.id === selectedAgentId;
          return (
            <button
              key={ag.id}
              onClick={() => setSelectedAgentId(ag.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-neutral-900 border-amber-500/50 shadow-sm ring-1 ring-amber-500/20'
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 text-xs font-bold">
                  {ag.name.charAt(0)}
                </span>
                <span className="text-neutral-500 text-xs font-mono">
                  {ag.modelAssigned.includes('flash') ? 'Flash' : 'Pro/Sonnet'}
                </span>
              </div>
              <div className="font-semibold text-white text-xs truncate">{ag.name.split(' ')[0]}</div>
              <div className="text-neutral-400 text-xs truncate mt-0.5">{ag.title.split('&')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Active Agent Detail Panel */}
      {selectedAgent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Agent Specs & System Prompt */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{selectedAgent.name}</span>
                    <span className="text-xs font-mono font-normal text-amber-400 border border-amber-500/30 rounded px-1.5 py-0.5">
                      {selectedAgent.role}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{selectedAgent.description}</p>
                </div>

                <button
                  onClick={handleCopyPrompt}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Copiar Prompt para AI Studio</span>
                    </>
                  )}
                </button>
              </div>

              {/* System Prompt View / Code box */}
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                  Prompt de Sistema com Foco em Orquestração:
                </label>
                <div className="relative">
                  <textarea
                    value={selectedAgent.systemPrompt}
                    onChange={(e) => onUpdateAgent({ ...selectedAgent, systemPrompt: e.target.value })}
                    rows={12}
                    className="w-full p-3.5 text-xs font-mono text-neutral-200 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Injected Skills (Skills Hub) */}
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-semibold text-white">Habilidades Injetadas (Skills Engine)</h4>
                </div>

                <button
                  onClick={() => setNewSkillModalOpen(true)}
                  className="px-2.5 py-1 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 rounded-md transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Injetar Skill ZIP/JSON</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedAgent.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{skill.name}</span>
                      <span className="font-mono text-neutral-500 text-xs">v{skill.version}</span>
                    </div>
                    <p className="text-xs text-neutral-400">{skill.description}</p>
                    <div className="flex items-center gap-1.5 pt-1 text-xs text-purple-400 font-mono">
                      {skill.tags.map((t) => (
                        <span key={t}>#{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Agent Parameters & Communication Loop */}
          <div className="space-y-5">
            {/* Model & Memory Controls */}
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>Configurações do Agente</span>
              </h4>

              {/* Model Assignment */}
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Modelo LLM Atribuído:</label>
                <select
                  value={selectedAgent.modelAssigned}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Recomendado)</option>
                  <option value="gemini-3.1-pro-preview">Google Gemini 3.1 Pro (Raciocínio Profundo)</option>
                  <option value="claude-3-5-sonnet-20241022">Anthropic Claude 3.5 Sonnet</option>
                  <option value="gpt-4o">OpenAI ChatGPT (GPT-4o)</option>
                  <option value="antigravity-deep-agent-v1">Antigravity Autonomous Engine</option>
                </select>
              </div>

              {/* Memory Isolation vs Shared */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-white">Memória de Contexto</div>
                  <div className="text-xs text-neutral-500">
                    {selectedAgent.memoryType === 'shared' ? 'Compartilhada com outros agentes' : 'Isolada no agente'}
                  </div>
                </div>

                <button
                  onClick={handleToggleMemory}
                  className={`px-3 py-1 text-xs font-mono rounded-md border transition-colors ${
                    selectedAgent.memoryType === 'shared'
                      ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                  }`}
                >
                  {selectedAgent.memoryType === 'shared' ? 'Compartilhada' : 'Isolada'}
                </button>
              </div>

              {/* Temperature */}
              <div className="space-y-1 pt-2 border-t border-neutral-800">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Temperatura (Criatividade):</span>
                  <span className="text-white font-mono tabular-nums">{selectedAgent.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={selectedAgent.temperature}
                  onChange={(e) =>
                    onUpdateAgent({ ...selectedAgent, temperature: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Inter-Agent Review Loop Simulator */}
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">Comunicação Inter-Agentes</h4>
                </div>

                <button
                  onClick={handleRunReviewLoop}
                  disabled={isSimulatingLoop}
                  className="px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-md transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Testar Loop</span>
                </button>
              </div>

              <p className="text-xs text-neutral-400">
                Simula o ciclo obrigatório: Roteirista gera $\rightarrow$ Revisor valida ou aciona Rollback.
              </p>

              <div className="space-y-2 mt-2">
                {loopLogs.length === 0 ? (
                  <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-500 text-center">
                    Clique em "Testar Loop" para visualizar a troca de mensagens e validação em tempo real.
                  </div>
                ) : (
                  loopLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                        log.status === 'approved'
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      <div className="font-semibold text-amber-400">{log.speaker}</div>
                      <p className="leading-relaxed">{log.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding custom skill */}
      {newSkillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Injetar Nova Habilidade (Skill)</h3>
            <p className="text-xs text-neutral-400">
              Cole a instrução ou carregue um arquivo ZIP/MD contendo diretivas de roteirização, prompt engineering ou edição.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-300 block mb-1">Nome da Habilidade:</label>
                <input
                  type="text"
                  placeholder="Ex: Dark Psychology Retention Hooks"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-300 block mb-1">Instruções da Skill:</label>
                <textarea
                  rows={4}
                  placeholder="[SKILL: NOME]\n- Diretiva 1...\n- Diretiva 2..."
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                  className="w-full p-3 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setNewSkillModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSkill}
                className="px-3.5 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                Salvar e Injetar Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
