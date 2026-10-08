import React, { useState } from 'react';
import { 
  VideoProject, 
  PipelineStage, 
  ColumnRule 
} from '../types';
import { 
  Workflow, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  Download, 
  Upload, 
  Clock, 
  Sparkles,
  Bot,
  Settings,
  ChevronRight,
  FileJson
} from 'lucide-react';

interface KanbanPipelineProps {
  project: VideoProject;
  onUpdateProject: (project: VideoProject) => void;
  onRunStep: (stage: PipelineStage) => Promise<void>;
  isRunningStep: boolean;
  onRunAutonomousPipeline: () => void;
  isRunningPipeline: boolean;
}

const STAGES: { stage: PipelineStage; title: string; agent: string; iconLabel: string }[] = [
  { stage: 'research', title: '01. Pesquisa', agent: 'Athena (Pesquisa)', iconLabel: '🔍' },
  { stage: 'scriptwriting', title: '02. Roteiro', agent: 'Hermes (Roteirista)', iconLabel: '✍️' },
  { stage: 'script_review', title: '03. Revisão', agent: 'Kratos (Revisor)', iconLabel: '🛡️' },
  { stage: 'project_bible', title: '04. Bíblia', agent: 'Apollo (Diretor Arte)', iconLabel: '🎨' },
  { stage: 'audio_transcription', title: '05. Áudio/Voz', agent: 'W Studios (TTS)', iconLabel: '🎙️' },
  { stage: 'scene_prompting', title: '06. Cenas/YouTube', agent: 'Daedalus (Cenógrafo)', iconLabel: '🎬' },
  { stage: 'video_assembly', title: '07. Edição', agent: 'Studio Timeline', iconLabel: '🎞️' },
  { stage: 'thumbnail_gen', title: '08. Thumbnail', agent: 'Midas (CTR Master)', iconLabel: '🖼️' },
];

export const KanbanPipeline: React.FC<KanbanPipelineProps> = ({
  project,
  onUpdateProject,
  onRunStep,
  isRunningStep,
  onRunAutonomousPipeline,
  isRunningPipeline,
}) => {
  const [selectedColumn, setSelectedColumn] = useState<PipelineStage>(project.currentStage);
  const [schedulerMode, setSchedulerMode] = useState<'manual' | 'cron' | 'interval' | 'queue'>('cron');
  const [cronExpression, setCronExpression] = useState('0 9,15,21 * * *');
  const [intervalHours, setIntervalHours] = useState('6');
  const [rollbackAlert, setRollbackAlert] = useState<string | null>(null);

  // Manual Trigger for a single step
  const handleTriggerStage = async (stage: PipelineStage) => {
    setSelectedColumn(stage);
    await onRunStep(stage);
  };

  // Simulate Rollback (Reviewer rejects script -> Card returns to Scriptwriting)
  const handleSimulateRollback = () => {
    setRollbackAlert('Rollback ativado: O Revisor Kratos rejeitou o roteiro por ritmo lento na cena 3. Cartão retornado para a etapa "02. Roteiro" com apontamentos de refatoração.');
    onUpdateProject({
      ...project,
      currentStage: 'scriptwriting',
      reviewOutput: {
        approved: false,
        overallScore: 6.8,
        criteriaScores: {
          hookEffectiveness: 7.2,
          pacingAndRetention: 6.1,
          factualAccuracy: 9.0,
          policyCompliance: 10.0,
        },
        critiquePoints: [
          'A cena 3 excedeu 25 palavras, desacelerando a retenção em 14%.',
          'Hook inicial precisa de uma quebra de expectativa mais direta.',
        ],
        actionableFixes: [
          'Cortar advérbios na cena 2 e condensar fala da cena 3 em menos de 14 palavras.',
        ],
        rollbackTriggered: true,
      },
    });
  };

  // Export pipeline as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pipeline_${project.id}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON pipeline
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onUpdateProject(parsed);
        alert('Esteira e projeto importados com sucesso!');
      } catch {
        alert('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Automation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Esteira de Produção & Fluxos Kanban</span>
            <span className="text-xs font-mono font-normal text-amber-400 border border-amber-500/30 rounded px-2 py-0.5">
              8 Estágios
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Pipeline sequencial autônomo com regras específicas por coluna, verificação de qualidade entre etapas e rollback automático em caso de reprovação na revisão.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <label className="cursor-pointer px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-neutral-400" />
            <span>Importar JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Exportar JSON</span>
          </button>

          <button
            onClick={handleSimulateRollback}
            className="px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 rounded-lg transition-colors flex items-center gap-1.5"
            title="Simula a rejeição pelo Revisor e a devolução automática do cartão para a etapa anterior"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Simular Rollback</span>
          </button>

          <button
            onClick={onRunAutonomousPipeline}
            disabled={isRunningPipeline}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunningPipeline ? 'Executando Esteira...' : 'Executar Esteira Completa'}</span>
          </button>
        </div>
      </div>

      {/* Rollback Alert Notice */}
      {rollbackAlert && (
        <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 shrink-0 text-rose-400 animate-spin" />
            <span>{rollbackAlert}</span>
          </div>
          <button onClick={() => setRollbackAlert(null)} className="text-rose-400 hover:text-rose-200">
            ✕
          </button>
        </div>
      )}

      {/* Task Scheduler / Trigger Configuration Bar */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-semibold text-white">Agendador de Tarefas (Triggers):</span>
            <span className="text-neutral-400 ml-2">Disparos periódicos ou por evento em fila</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-0.5 bg-neutral-950 border border-neutral-800 rounded-lg">
            {(['manual', 'cron', 'interval', 'queue'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSchedulerMode(mode)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  schedulerMode === mode
                    ? 'bg-neutral-800 text-white font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {mode === 'manual' && 'Manual'}
                {mode === 'cron' && 'Cron Horário'}
                {mode === 'interval' && 'Intervalo'}
                {mode === 'queue' && 'Fila / Webhook'}
              </button>
            ))}
          </div>

          {schedulerMode === 'cron' && (
            <div className="flex items-center gap-1.5 font-mono text-neutral-300 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1">
              <span>cron:</span>
              <input
                type="text"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                className="bg-transparent text-amber-400 focus:outline-none w-28 text-xs font-mono"
              />
            </div>
          )}

          {schedulerMode === 'interval' && (
            <div className="flex items-center gap-1.5 text-neutral-300 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1">
              <span>a cada:</span>
              <input
                type="number"
                value={intervalHours}
                onChange={(e) => setIntervalHours(e.target.value)}
                className="bg-transparent text-amber-400 focus:outline-none w-10 text-xs font-mono"
              />
              <span>horas</span>
            </div>
          )}
        </div>
      </div>

      {/* 8-Column Horizontal Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-8 gap-3 min-w-[1300px]">
          {STAGES.map((col, index) => {
            const isCurrent = project.currentStage === col.stage;
            const isPast = STAGES.findIndex((s) => s.stage === project.currentStage) > index;
            const isSelected = selectedColumn === col.stage;

            return (
              <div
                key={col.stage}
                onClick={() => setSelectedColumn(col.stage)}
                className={`rounded-xl border flex flex-col justify-between transition-all cursor-pointer min-h-[460px] p-3 ${
                  isCurrent
                    ? 'bg-neutral-900 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : isPast
                    ? 'bg-neutral-950/80 border-neutral-800/80'
                    : 'bg-neutral-950/40 border-neutral-900'
                }`}
              >
                {/* Column Header */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-base">{col.iconLabel}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-medium">
                        Ativa
                      </span>
                    )}
                    {isPast && (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pronto
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-white text-xs tracking-tight">{col.title}</h3>
                  <div className="text-neutral-500 text-xs mt-0.5 truncate">{col.agent}</div>

                  {/* Column Card Content */}
                  <div className="mt-4 space-y-2">
                    {/* Research Summary Card */}
                    {col.stage === 'research' && project.researchOutput && (
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                        <div className="font-semibold text-neutral-200">Pesquisa Concluída</div>
                        <p className="text-neutral-400 text-xs line-clamp-3">
                          {project.researchOutput.summary}
                        </p>
                        <div className="text-amber-400 text-xs font-mono pt-1">
                          {project.researchOutput.keyFacts.length} fatos validados
                        </div>
                      </div>
                    )}

                    {/* Scriptwriting Card */}
                    {col.stage === 'scriptwriting' && project.scriptOutput && (
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                        <div className="font-semibold text-neutral-200">{project.scriptOutput.title}</div>
                        <div className="text-neutral-400 text-xs">
                          {project.scriptOutput.wordCount} palavras · {project.scriptOutput.estimatedDurationSec}s
                        </div>
                        <div className="text-sky-400 text-xs font-mono pt-1">
                          {project.scriptOutput.scenes.length} cenas estruturadas
                        </div>
                      </div>
                    )}

                    {/* Script Review Card */}
                    {col.stage === 'script_review' && project.reviewOutput && (
                      <div className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                        project.reviewOutput.approved
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      }`}>
                        <div className="flex justify-between items-center font-semibold">
                          <span>{project.reviewOutput.approved ? 'Aprovado' : 'Rejeitado'}</span>
                          <span className="font-mono">{project.reviewOutput.overallScore}/10</span>
                        </div>
                        <div className="text-xs opacity-80">
                          Hook: {project.reviewOutput.criteriaScores.hookEffectiveness}/10
                        </div>
                        {project.reviewOutput.rollbackTriggered && (
                          <div className="text-rose-400 text-xs font-mono font-bold">
                            ROLLBACK ATIVADO
                          </div>
                        )}
                      </div>
                    )}

                    {/* Project Bible Card */}
                    {col.stage === 'project_bible' && project.bibleOutput && (
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                        <div className="font-semibold text-neutral-200">{project.bibleOutput.styleName}</div>
                        <div className="text-neutral-400 text-xs">{project.bibleOutput.cinematicTone}</div>
                        <div className="text-xs text-amber-400 font-mono pt-1">
                          Mix: {project.bibleOutput.mediaMix.youtubePercent}% YT · {project.bibleOutput.mediaMix.aiGenPercent}% IA
                        </div>
                      </div>
                    )}

                    {/* Audio & Voice Card */}
                    {col.stage === 'audio_transcription' && project.audioOutput && (
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                        <div className="font-semibold text-neutral-200">Sintetizador W Studios</div>
                        <div className="text-neutral-400 text-xs">{project.audioOutput.voiceName}</div>
                        <div className="text-purple-400 text-xs font-mono pt-1">
                          {project.audioOutput.transcriptWords.length} palavras sincronizadas
                        </div>
                      </div>
                    )}

                    {/* Scenes & YouTube Prompts Card */}
                    {col.stage === 'scene_prompting' && project.sceneEngineOutput && (
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                        <div className="font-semibold text-neutral-200">Motor de Cenas Ativo</div>
                        <div className="text-neutral-400 text-xs">
                          {project.sceneEngineOutput.scenes.length} tomadas mapeadas
                        </div>
                        <div className="text-emerald-400 text-xs font-mono pt-1">
                          Recortes cirúrgicos YouTube OK
                        </div>
                      </div>
                    )}

                    {/* Video Assembly Card */}
                    {col.stage === 'video_assembly' && project.editorOutput && (
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                        <div className="font-semibold text-neutral-200">Timeline Pronta</div>
                        <div className="text-neutral-400 text-xs">Suno BGM + Karaokê</div>
                        <div className="text-amber-400 text-xs font-mono pt-1">
                          Pronto para renderização
                        </div>
                      </div>
                    )}

                    {/* Thumbnail Card */}
                    {col.stage === 'thumbnail_gen' && project.thumbnailOutput && (
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                        <div className="font-semibold text-neutral-200">{project.thumbnailOutput.headline}</div>
                        <div className="text-emerald-400 text-xs font-mono">
                          CTR previsto: {project.thumbnailOutput.ctrForecastPercent}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column Action Trigger Button */}
                <div className="mt-4 pt-3 border-t border-neutral-850">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerStage(col.stage);
                    }}
                    disabled={isRunningStep}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                      isCurrent
                        ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold'
                        : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Executar Etapa</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Drawer */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">
              Painel de Detalhes da Etapa: {STAGES.find((s) => s.stage === selectedColumn)?.title}
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            Agente Atribuído: {STAGES.find((s) => s.stage === selectedColumn)?.agent}
          </span>
        </div>

        {/* Dynamic Detail Viewer based on Stage */}
        <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-3 font-mono leading-relaxed">
          {selectedColumn === 'research' && project.researchOutput && (
            <div className="space-y-3">
              <div>
                <span className="text-amber-400 font-bold block mb-1">Ângulos de Retenção e Quebra de Padrão:</span>
                <ul className="list-disc pl-4 space-y-1 text-neutral-300">
                  {project.researchOutput.hookAngles.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-sky-400 font-bold block mb-1">Fatos Validados e Fontes Históricas:</span>
                <ul className="list-disc pl-4 space-y-1 text-neutral-300">
                  {project.researchOutput.keyFacts.map((f, i) => (
                    <li key={i}>
                      {f.fact} <span className="text-neutral-500">({f.source})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {selectedColumn === 'scriptwriting' && project.scriptOutput && (
            <div className="space-y-3">
              <div>
                <span className="text-amber-400 font-bold block mb-1">Texto Completo para Narração:</span>
                <p className="text-neutral-200 font-sans leading-relaxed text-sm bg-neutral-900 p-3 rounded-lg border border-neutral-800">
                  "{project.scriptOutput.fullText}"
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                {project.scriptOutput.scenes.map((sc) => (
                  <div key={sc.sceneNumber} className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 text-xs">
                    <div className="text-amber-400 font-semibold mb-1">Cena {sc.sceneNumber} ({sc.durationSec}s) · {sc.suggestedSource}</div>
                    <div className="text-neutral-300">"{sc.narration}"</div>
                    <div className="text-neutral-500 text-xs mt-1">Conceito: {sc.visualConcept}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedColumn === 'script_review' && project.reviewOutput && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-white font-bold">Pontuação Geral:</span>
                <span className="text-lg font-bold text-amber-400">{project.reviewOutput.overallScore}/10</span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  project.reviewOutput.approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {project.reviewOutput.approved ? 'Aprovado' : 'Rejeitado para Refatoração'}
                </span>
              </div>
              <div>
                <span className="text-sky-400 font-bold block mb-1">Critérios Auditados:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    Hook (0-10): <span className="text-white">{project.reviewOutput.criteriaScores.hookEffectiveness}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    Pacing (0-10): <span className="text-white">{project.reviewOutput.criteriaScores.pacingAndRetention}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    Precisão (0-10): <span className="text-white">{project.reviewOutput.criteriaScores.factualAccuracy}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    Políticas (0-10): <span className="text-white">{project.reviewOutput.criteriaScores.policyCompliance}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedColumn === 'project_bible' && project.bibleOutput && (
            <div className="space-y-2">
              <div className="text-white font-bold">{project.bibleOutput.styleName} ({project.bibleOutput.cinematicTone})</div>
              <div className="text-neutral-300">
                Paleta de Cores: Dominante ({project.bibleOutput.colorPalette.dominant}) · Destaque ({project.bibleOutput.colorPalette.accent})
              </div>
              <div className="text-amber-400">
                Grade LUT: {project.bibleOutput.colorPalette.lutGrade} · Legendas: {project.bibleOutput.subtitles.style}
              </div>
            </div>
          )}

          {selectedColumn !== 'research' && selectedColumn !== 'scriptwriting' && selectedColumn !== 'script_review' && selectedColumn !== 'project_bible' && (
            <div className="text-neutral-400">
              Dados da etapa processados e sincronizados com os motores de cena e editor timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
