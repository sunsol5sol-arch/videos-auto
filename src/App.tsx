/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { KanbanPipeline } from './components/KanbanPipeline';
import { AgentSystem } from './components/AgentSystem';
import { FailoverHub } from './components/FailoverHub';
import { SceneEngine } from './components/SceneEngine';
import { StudioEditor } from './components/StudioEditor';
import { TelegramBot } from './components/TelegramBot';
import { SystemPromptsModal } from './components/SystemPromptsModal';
import { NewProjectModal } from './components/NewProjectModal';

import { VideoProject, ProviderItem, AgentConfig, PipelineStage } from './types';
import { INITIAL_PROJECT, INITIAL_PROVIDERS } from './data/mockPipeline';
import { AGENT_CONFIGS } from './data/agentPrompts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'agents' | 'failover' | 'scenes' | 'studio' | 'telegram'>('kanban');
  const [project, setProject] = useState<VideoProject>(INITIAL_PROJECT);
  const [providers, setProviders] = useState<ProviderItem[]>(INITIAL_PROVIDERS);
  const [agents, setAgents] = useState<AgentConfig[]>(AGENT_CONFIGS);

  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [isRunningStep, setIsRunningStep] = useState(false);
  const [isPromptsModalOpen, setIsPromptsModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Health check on initial mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .catch((err) => console.log('Backend health check info:', err));
  }, []);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 5000);
  };

  // Run a single stage in the pipeline
  const handleRunStep = async (stage: PipelineStage) => {
    setIsRunningStep(true);
    showNotification(`Executando etapa "${stage}" com o agente correspondente...`);

    let agentRole = 'leader';
    if (stage === 'research') agentRole = 'researcher';
    if (stage === 'scriptwriting') agentRole = 'scriptwriter';
    if (stage === 'script_review') agentRole = 'reviewer';
    if (stage === 'project_bible') agentRole = 'art_director';
    if (stage === 'scene_prompting') agentRole = 'scene_architect';
    if (stage === 'thumbnail_gen') agentRole = 'thumbnail_seo';

    try {
      const response = await fetch('/api/pipeline/run-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          agentRole,
          theme: project.theme,
          existingData: project,
        }),
      });

      const resData = await response.json();
      const output = resData.data;

      // Update project according to the stage completed
      const updated: VideoProject = { ...project };
      if (stage === 'research') updated.researchOutput = output;
      if (stage === 'scriptwriting') updated.scriptOutput = output;
      if (stage === 'script_review') updated.reviewOutput = output;
      if (stage === 'project_bible') updated.bibleOutput = output;
      if (stage === 'scene_prompting') updated.sceneEngineOutput = output;
      if (stage === 'thumbnail_gen') updated.thumbnailOutput = output;

      // Advance stage if approved
      const stageSequence: PipelineStage[] = [
        'research',
        'scriptwriting',
        'script_review',
        'project_bible',
        'audio_transcription',
        'scene_prompting',
        'video_assembly',
        'thumbnail_gen',
      ];
      const currentIndex = stageSequence.indexOf(stage);
      if (currentIndex < stageSequence.length - 1) {
        updated.currentStage = stageSequence[currentIndex + 1];
      }

      setProject(updated);
      showNotification(`Etapa "${stage}" concluída com sucesso via ${resData.providerUsed}!`);
    } catch {
      showNotification(`Erro ao executar etapa ${stage}. Verifique o console.`);
    } finally {
      setIsRunningStep(false);
    }
  };

  // Run autonomous pipeline from start to finish
  const handleRunAutonomousPipeline = async () => {
    setIsRunningPipeline(true);
    showNotification('Orquestrador Ares assumiu o controle. Executando pipeline ponta a ponta...');

    const stages: PipelineStage[] = [
      'research',
      'scriptwriting',
      'script_review',
      'project_bible',
      'audio_transcription',
      'scene_prompting',
      'video_assembly',
      'thumbnail_gen',
    ];

    for (const stage of stages) {
      await handleRunStep(stage);
      // Brief pause between stages to let user observe the flow
      await new Promise((r) => setTimeout(r, 600));
    }

    setIsRunningPipeline(false);
    showNotification('Pipeline concluído! Vídeo final, legendas karaokê e templates prontos para visualização.');
    setActiveTab('studio');
  };

  // Create new project
  const handleCreateProject = (title: string, theme: string, audience: string) => {
    const newProj: VideoProject = {
      id: `proj-${Date.now()}`,
      title,
      theme,
      targetAudience: audience,
      status: 'processing',
      currentStage: 'research',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      researchOutput: undefined,
      scriptOutput: undefined,
      reviewOutput: undefined,
      bibleOutput: undefined,
      audioOutput: undefined,
      sceneEngineOutput: undefined,
      editorOutput: undefined,
      thumbnailOutput: undefined,
    };
    setProject(newProj);
    setActiveTab('kanban');
    showNotification(`Projeto "${title}" criado. Despachando para Athena (Pesquisa)...`);
    // Automatically trigger research
    setTimeout(() => {
      handleRunStep('research');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Universal Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPromptsModal={() => setIsPromptsModalOpen(true)}
        onRunAutonomousPipeline={handleRunAutonomousPipeline}
        isRunningPipeline={isRunningPipeline}
        projectTitle={project.title}
      />

      {/* Global Status Toast Notification */}
      {statusNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-3.5 rounded-xl bg-neutral-900 border border-amber-500/40 text-amber-300 text-xs shadow-2xl flex items-center justify-between gap-3 animate-fade-in">
          <span>{statusNotification}</span>
          <button onClick={() => setStatusNotification(null)} className="text-neutral-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'kanban' && (
          <KanbanPipeline
            project={project}
            onUpdateProject={setProject}
            onRunStep={handleRunStep}
            isRunningStep={isRunningStep}
            onRunAutonomousPipeline={handleRunAutonomousPipeline}
            isRunningPipeline={isRunningPipeline}
          />
        )}

        {activeTab === 'agents' && (
          <AgentSystem
            agents={agents}
            onUpdateAgent={(updated) => {
              setAgents(agents.map((a) => (a.id === updated.id ? updated : a)));
            }}
            onOpenSystemPromptsModal={() => setIsPromptsModalOpen(true)}
          />
        )}

        {activeTab === 'failover' && (
          <FailoverHub
            providers={providers}
            onUpdateProviders={setProviders}
          />
        )}

        {activeTab === 'scenes' && (
          <SceneEngine
            project={project}
            onUpdateProject={setProject}
          />
        )}

        {activeTab === 'studio' && (
          <StudioEditor
            project={project}
            onUpdateProject={setProject}
          />
        )}

        {activeTab === 'telegram' && (
          <TelegramBot
            onTriggerNewVideo={(theme) => handleCreateProject(`Vídeo Telegram: ${theme}`, theme, 'Geral')}
            onApproveRender={() => {
              showNotification('Render aprovado via Telegram! Abrindo o Video Studio...');
              setActiveTab('studio');
            }}
          />
        )}
      </main>

      {/* System Prompts Modal (Google AI Studio Ready) */}
      <SystemPromptsModal
        isOpen={isPromptsModalOpen}
        onClose={() => setIsPromptsModalOpen(false)}
        agents={agents}
      />

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Quiet Footer (strictly copyright and user action link, no ornamental telemetry) */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-4 px-6 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>AutoVideo AI Engine</span>
          <span aria-hidden="true">·</span>
          <span>Automação Multi-Agentes para Vídeo & Áudio</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            + Novo Projeto
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setIsPromptsModalOpen(true)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Prompts de Orquestração
          </button>
        </div>
      </footer>
    </div>
  );
}
