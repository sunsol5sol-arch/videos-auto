import React, { useState } from 'react';
import { VideoProject } from '../types';
import { 
  Scissors, 
  Search, 
  Sliders, 
  Youtube, 
  Sparkles, 
  Film, 
  Check, 
  Clock, 
  Layers, 
  ArrowRight,
  Database,
  Eye,
  Plus
} from 'lucide-react';

interface SceneEngineProps {
  project: VideoProject;
  onUpdateProject: (project: VideoProject) => void;
}

export const SceneEngine: React.FC<SceneEngineProps> = ({
  project,
  onUpdateProject,
}) => {
  // YouTube Smart Trimming Interactive State
  const [ytUrl, setYtUrl] = useState('https://www.youtube.com/watch?v=BigEarArchive1977');
  const [ytSearchQuery, setYtSearchQuery] = useState('sinal cósmico 6EQUJ5');
  const [ytStartSec, setYtStartSec] = useState(14);
  const [ytEndSec, setYtEndSec] = useState(19);
  const [isSearchingYt, setIsSearchingYt] = useState(false);
  const [trimResult, setTrimResult] = useState<any>(null);

  // Project Bible Media Mix Sliders
  const bible = project.bibleOutput || {
    styleName: 'Deep Space Mystery Noir',
    cinematicTone: 'Misterioso, documental e analítico',
    colorPalette: {
      dominant: '#0B0F19',
      secondary: '#1A2333',
      accent: '#F59E0B',
      lutGrade: 'Kodak 5219 Teal & Amber Contrast',
    },
    mediaMix: {
      youtubePercent: 40,
      aiGenPercent: 30,
      stockPercent: 30,
    },
    subtitles: {
      style: 'hormozi_bold' as const,
      primaryColor: '#FFFFFF',
      highlightColor: '#F59E0B',
      fontSize: 44,
    },
    pacingBpm: 122,
    aspectRatio: '16:9' as const,
  };

  const handleMediaMixChange = (key: 'youtubePercent' | 'aiGenPercent' | 'stockPercent', val: number) => {
    const updatedBible = {
      ...bible,
      mediaMix: {
        ...bible.mediaMix,
        [key]: val,
      },
    };
    onUpdateProject({
      ...project,
      bibleOutput: updatedBible,
    });
  };

  const handleExecuteTrim = async () => {
    setIsSearchingYt(true);
    try {
      const response = await fetch('/api/youtube/trim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: ytUrl,
          searchQuery: ytSearchQuery,
          startSec: ytStartSec,
          endSec: ytEndSec,
        }),
      });
      const data = await response.json();
      setTrimResult(data);
    } catch {
      alert('Erro ao buscar trechos do YouTube');
    } finally {
      setIsSearchingYt(false);
    }
  };

  // Add the trimmed clip directly into project scenes
  const handleAddTrimToScenes = () => {
    if (!trimResult) return;
    const currentScenes = project.sceneEngineOutput?.scenes || [];
    const newScene = {
      id: `sc-${Date.now()}`,
      sceneNumber: currentScenes.length + 1,
      title: `Recorte YouTube (${trimResult.selectedCut.durationSec}s)`,
      durationSec: trimResult.selectedCut.durationSec,
      sourceType: 'youtube_trim' as const,
      providerTag: 'YouTube Smart Trim Engine',
      visualTemplateId: 'tmpl-split-2-vert',
      mediaUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=80',
      youtubeClip: {
        videoUrl: trimResult.videoUrl,
        startSec: trimResult.selectedCut.startSec,
        endSec: trimResult.selectedCut.endSec,
        transcriptFragment: trimResult.requestedQuery,
      },
      highlightWords: ['sinal', 'cósmico'],
    };

    onUpdateProject({
      ...project,
      sceneEngineOutput: {
        scenes: [...currentScenes, newScene],
      },
    });

    alert('Cena recortada e adicionada com sucesso à biblioteca do projeto!');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Motor de Cenas & Extração Inteligente</span>
            <span className="text-xs font-mono font-normal text-purple-400 border border-purple-500/30 rounded px-2 py-0.5">
              Smart Trimmer & Bible
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Permite extração cirúrgica de vídeos do YouTube sem download integral, marcação de procedência de mídias (YouTube, Fal.ai, Flow, NASA)
            e balanceamento da proporção estética definida na Bíblia do Projeto.
          </p>
        </div>
      </div>

      {/* Grid: Left = YouTube Smart Trimmer | Right = Project Bible Media Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 4.A: YouTube Smart Trimming without Full Download */}
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-semibold text-white">
                Extração Cirúrgica do YouTube (Smart Trim)
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Zero Download Total</span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            Busca por termos na transcrição oficial do vídeo e extrai trechos de 4 a 8 segundos diretamente via stream, economizando centenas de megabytes.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="text-xs text-neutral-300 block mb-1">URL do Vídeo do YouTube:</label>
              <input
                type="text"
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-300 block mb-1">Buscar Palavra-Chave na Transcrição:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ytSearchQuery}
                  onChange={(e) => setYtSearchQuery(e.target.value)}
                  placeholder="Ex: sinal cósmico 6EQUJ5"
                  className="flex-1 px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleExecuteTrim}
                  disabled={isSearchingYt}
                  className="px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearchingYt ? 'Buscando...' : 'Localizar Trecho'}</span>
                </button>
              </div>
            </div>

            {/* Timestamps selectors */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Timestamp Inicial:</span>
                  <span className="font-mono text-white">{ytStartSec}s (00:{ytStartSec < 10 ? '0' : ''}{ytStartSec})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={ytStartSec}
                  onChange={(e) => setYtStartSec(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Timestamp Final:</span>
                  <span className="font-mono text-white">{ytEndSec}s (00:{ytEndSec < 10 ? '0' : ''}{ytEndSec})</span>
                </div>
                <input
                  type="range"
                  min={ytStartSec + 1}
                  max={ytStartSec + 15}
                  value={ytEndSec}
                  onChange={(e) => setYtEndSec(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            {/* Trimming result card */}
            {trimResult && (
              <div className="p-3.5 rounded-lg bg-neutral-950 border border-emerald-500/30 space-y-2 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Trecho Encontrado e Bufferizado ({trimResult.selectedCut.durationSec}s)</span>
                  </div>
                  <span className="font-mono text-neutral-400">
                    -{trimResult.downloadSkippedMegabytes} MB poupados
                  </span>
                </div>

                <div className="text-xs text-neutral-300 font-mono bg-neutral-900 p-2.5 rounded border border-neutral-800">
                  {trimResult.matchedTranscripts?.[1]?.text}
                </div>

                <button
                  onClick={handleAddTrimToScenes}
                  className="w-full py-2 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Inserir Recorte no Rol de Cenas do Projeto</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Module 4.B: Project Bible & Media Mix Ratio */}
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">
                Bíblia do Projeto (Project Style Guide & Mix)
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">Regras Estéticas</span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            Define as proporções rígidas de mistura visual para evitar saturação de IA gerativa e enriquecer o vídeo com registros documentais autênticos.
          </p>

          <div className="space-y-4 pt-1">
            {/* YouTube Trims Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Recortes do YouTube (Autoridade/B-Roll)</span>
                </span>
                <span className="font-mono text-white font-bold">{bible.mediaMix.youtubePercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={bible.mediaMix.youtubePercent}
                onChange={(e) => handleMediaMixChange('youtubePercent', parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            {/* Generative AI Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>IA Generativa (Fal.ai, Flow, Veo)</span>
                </span>
                <span className="font-mono text-white font-bold">{bible.mediaMix.aiGenPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={bible.mediaMix.aiGenPercent}
                onChange={(e) => handleMediaMixChange('aiGenPercent', parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Media Stock Open Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span>Bancos Abertos (NASA, Internet Archive, Wikipédia)</span>
                </span>
                <span className="font-mono text-white font-bold">{bible.mediaMix.stockPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={bible.mediaMix.stockPercent}
                onChange={(e) => handleMediaMixChange('stockPercent', parseInt(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>

            {/* Cinematic Look & LUTs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                <div className="text-xs text-neutral-400 mb-1">Color Grading / LUT:</div>
                <div className="text-xs font-semibold text-amber-400 truncate">
                  {bible.colorPalette.lutGrade}
                </div>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                <div className="text-xs text-neutral-400 mb-1">Proporção do Frame:</div>
                <div className="text-xs font-semibold text-white">
                  {bible.aspectRatio} (Widescreen Cinema)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Curated Gallery with Provider Tags */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Galeria de Cenas & Tagging de Origem do Projeto
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {project.sceneEngineOutput?.scenes.length || 0} cenas ativas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {project.sceneEngineOutput?.scenes.map((scene) => (
            <div
              key={scene.id}
              className="group rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all"
            >
              {/* Media Preview Box (styled CSS fallback with gradient mesh and tags) */}
              <div className="relative aspect-video bg-neutral-900 overflow-hidden flex items-center justify-center">
                {scene.mediaUrl ? (
                  <img
                    src={scene.mediaUrl}
                    alt={scene.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 flex items-center justify-center text-neutral-600">
                    <Film className="w-6 h-6" />
                  </div>
                )}

                {/* Provider Tag Overlaid */}
                <div className="absolute top-2 left-2 z-10">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium backdrop-blur-md ${
                    scene.sourceType === 'youtube_trim'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                      : scene.sourceType === 'ai_gen'
                      ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                      : 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                  }`}>
                    {scene.providerTag}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-xs font-mono text-white">
                  {scene.durationSec}s
                </div>
              </div>

              {/* Scene Info */}
              <div className="p-3 space-y-1.5 text-xs">
                <div className="font-semibold text-white truncate">{scene.title}</div>
                {scene.youtubeClip && (
                  <div className="text-neutral-400 font-mono text-xs truncate">
                    Corte: 00:{scene.youtubeClip.startSec} - 00:{scene.youtubeClip.endSec}
                  </div>
                )}
                {scene.promptText && (
                  <div className="text-neutral-400 text-xs line-clamp-2">
                    {scene.promptText}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
