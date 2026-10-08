import React, { useState } from 'react';
import { 
  ProviderItem, 
  ProviderCategory, 
  FailoverLog 
} from '../types';
import { 
  Cpu, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Server, 
  ArrowRight, 
  ShieldCheck, 
  Activity,
  KeyRound,
  Play
} from 'lucide-react';

interface FailoverHubProps {
  providers: ProviderItem[];
  onUpdateProviders: (providers: ProviderItem[]) => void;
}

export const FailoverHub: React.FC<FailoverHubProps> = ({
  providers,
  onUpdateProviders,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory | 'all'>('all');
  const [isSimulatingFailover, setIsSimulatingFailover] = useState(false);
  const [failoverLogs, setFailoverLogs] = useState<FailoverLog[]>([
    {
      id: 'log-1',
      timestamp: '18:14:02',
      category: 'chat_llm',
      fromProvider: 'Google Gemini 3.8 Flash',
      toProvider: 'Anthropic Claude 3.5 Sonnet',
      reason: 'http_429',
      latencyMs: 340,
      success: true,
    },
    {
      id: 'log-2',
      timestamp: '17:42:19',
      category: 'video_gen',
      fromProvider: 'Fal.ai / MiniMax',
      toProvider: 'Flow CineGen Studio',
      reason: 'timeout',
      latencyMs: 4120,
      success: true,
    },
  ]);
  const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null);

  const categories: { key: ProviderCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'Todos os Provedores' },
    { key: 'chat_llm', label: 'LLM & Raciocínio' },
    { key: 'video_gen', label: 'Geração de Vídeo' },
    { key: 'image_gen', label: 'Geração de Imagem' },
    { key: 'tts_voice', label: 'Voz & TTS (W Studios)' },
    { key: 'music_gen', label: 'Música & SFX (Suno)' },
    { key: 'media_stock', label: 'Mídia Aberta & YouTube' },
    { key: 'web_search', label: 'Transcrição & Web' },
  ];

  const filteredProviders = selectedCategory === 'all'
    ? providers
    : providers.filter((p) => p.category === selectedCategory);

  // Trigger live Failover simulation via backend
  const handleSimulateFailover = async () => {
    setIsSimulatingFailover(true);
    setSimulatedAlert('Simulando pico de requisição e injeção de erro 429 (Cota Excedida) no provedor primário...');

    try {
      const response = await fetch('/api/failover/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'chat_llm',
          primaryId: 'prov-gemini-3.8-flash',
          fallbackOrder: ['prov-claude-sonnet', 'prov-openai-gpt4o'],
        }),
      });

      const result = await response.json();
      
      const newLog: FailoverLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        category: 'chat_llm',
        fromProvider: 'Google Gemini 3.8 Flash',
        toProvider: 'Anthropic Claude 3.5 Sonnet',
        reason: 'quota_exhausted',
        latencyMs: result.totalRecoveryTimeMs || 530,
        success: true,
      };

      setFailoverLogs((prev) => [newLog, ...prev]);

      // Update provider quotas locally to reflect the switch
      const updated = providers.map((p) => {
        if (p.id === 'prov-gemini-3.8-flash') {
          return { ...p, status: 'degraded' as const, quotaPercent: Math.max(5, p.quotaPercent - 20) };
        }
        if (p.id === 'prov-claude-sonnet') {
          return { ...p, callsSuccess: p.callsSuccess + 1 };
        }
        return p;
      });
      onUpdateProviders(updated);

      setSimulatedAlert(`Chaveamento automático concluído em ${result.totalRecoveryTimeMs}ms! Tráfego comutado com sucesso para Claude 3.5 Sonnet.`);
      setTimeout(() => setSimulatedAlert(null), 6000);
    } catch {
      setSimulatedAlert('Erro na simulação de failover. Verifique conexão.');
    } finally {
      setIsSimulatingFailover(false);
    }
  };

  // Reset quotas and statuses to nominal
  const handleResetPool = () => {
    const reset = providers.map((p) => ({
      ...p,
      status: 'healthy' as const,
      quotaPercent: Math.floor(Math.random() * 20) + 80,
    }));
    onUpdateProviders(reset);
    setSimulatedAlert('Pool de contas e chaves reinicializado com cotas nominais.');
    setTimeout(() => setSimulatedAlert(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Gerenciador de Provedores e Redundância</span>
            <span className="text-xs font-mono font-normal text-emerald-400 border border-emerald-500/30 rounded px-2 py-0.5">
              Failover Ativo
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Hub centralizado para conexões de LLM, vídeo, voz (W Studios) e música (Suno). 
            Em caso de instabilidade ou esgotamento de cotas, o tráfego é comutado instantaneamente sem interromper a esteira.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResetPool}
            className="px-3 py-2 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Recarregar Pool</span>
          </button>

          <button
            onClick={handleSimulateFailover}
            disabled={isSimulatingFailover}
            className="px-4 py-2 text-xs font-medium text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-sm"
          >
            {isSimulatingFailover ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulando Redundância...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Testar Failover ao Vivo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {simulatedAlert && (
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{simulatedAlert}</span>
          </div>
          <button onClick={() => setSimulatedAlert(null)} className="text-amber-400/80 hover:text-amber-200">
            ✕
          </button>
        </div>
      )}

      {/* Redundancy Combo Visualizer */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Mecanismo de Combos & Prioridade de Chaveamento</h3>
          </div>
          <span className="text-xs text-neutral-400">Estratégia: Prioridade em Cascata + Rodízio de Contas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg bg-neutral-950 border border-emerald-500/30 relative">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-emerald-400 font-semibold font-mono">Prioridade 1 (Primário)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="font-medium text-white text-sm">Google Gemini 3.8 Flash</div>
            <div className="text-xs text-neutral-400 mt-1">4 chaves no pool · 310ms latência</div>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 relative">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400 font-semibold font-mono">Prioridade 2 (Secundário)</span>
              <span className="text-neutral-500 text-xs">Standby</span>
            </div>
            <div className="font-medium text-white text-sm">Anthropic Claude 3.5 Sonnet</div>
            <div className="text-xs text-neutral-400 mt-1">2 chaves no pool · 620ms latência</div>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 relative">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400 font-semibold font-mono">Prioridade 3 (Terciário)</span>
              <span className="text-neutral-500 text-xs">Standby</span>
            </div>
            <div className="font-medium text-white text-sm">OpenAI ChatGPT (GPT-4o)</div>
            <div className="text-xs text-neutral-400 mt-1">3 chaves no pool · 740ms latência</div>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 relative">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400 font-semibold font-mono">Prioridade 4 (Reserva)</span>
              <span className="text-neutral-500 text-xs">Emergência</span>
            </div>
            <div className="font-medium text-white text-sm">Antigravity Autonomous Engine</div>
            <div className="text-xs text-neutral-400 mt-1">2 chaves no pool · 980ms latência</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs (Interactive Filter Controls as segmented buttons) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900/80 border border-neutral-800 rounded-lg">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCategory(c.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedCategory === c.key
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Providers Table / Cards */}
      <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-400 font-medium">
              <tr>
                <th className="py-3 px-4">Provedor & Modelo</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Estado da Conexão</th>
                <th className="py-3 px-4">Cota Restante</th>
                <th className="py-3 px-4">Latência</th>
                <th className="py-3 px-4">Contas no Pool</th>
                <th className="py-3 px-4 text-right">Requisições</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredProviders.map((prov) => {
                const isHealthy = prov.status === 'healthy';
                const isDegraded = prov.status === 'degraded';
                return (
                  <tr key={prov.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-medium text-white text-sm">{prov.name}</div>
                      <div className="text-neutral-500 text-xs font-mono">{prov.model}</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-neutral-300">
                      {prov.category === 'chat_llm' && 'LLM / Raciocínio'}
                      {prov.category === 'video_gen' && 'Geração de Vídeo'}
                      {prov.category === 'image_gen' && 'Geração de Imagem'}
                      {prov.category === 'tts_voice' && 'Voz & TTS (W Studios)'}
                      {prov.category === 'music_gen' && 'Música (Suno)'}
                      {prov.category === 'media_stock' && 'Mídia Aberta'}
                      {prov.category === 'web_search' && 'Transcrição'}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      {isHealthy && (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Nominal</span>
                        </div>
                      )}
                      {isDegraded && (
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Degradado / Fallback</span>
                        </div>
                      )}
                      {prov.status === 'quota_exhausted' && (
                        <div className="flex items-center gap-1.5 text-rose-400 text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Cota Exaurida</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-neutral-300 tabular-nums">{prov.quotaPercent}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              prov.quotaPercent > 50
                                ? 'bg-emerald-400'
                                : prov.quotaPercent > 20
                                ? 'bg-amber-400'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${prov.quotaPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-neutral-300">
                      {prov.latencyMs}ms
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <KeyRound className="w-3 h-3 text-amber-400" />
                        <span className="tabular-nums">{prov.accountPoolCount} chaves</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-neutral-400">
                      <span className="text-emerald-400">{prov.callsSuccess}</span>
                      <span className="text-neutral-600"> / </span>
                      <span className="text-rose-400">{prov.callsFailed}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Execution Logs Section */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Registro de Eventos de Failover e Redundância</h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">Tempo real</span>
        </div>

        <div className="space-y-2">
          {failoverLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-neutral-500">{log.timestamp}</span>
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <span className="text-neutral-400">{log.fromProvider}</span>
                  <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-emerald-400 font-medium">{log.toProvider}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-neutral-400">
                <span className="font-mono">Motivo: {log.reason}</span>
                <span className="font-mono tabular-nums text-neutral-300">Recuperação: {log.latencyMs}ms</span>
                <span className="text-emerald-400 font-semibold">Sucesso</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
