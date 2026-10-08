import React, { useState, useEffect, useRef } from 'react';
import { VideoProject, VisualTemplate } from '../types';
import { VISUAL_TEMPLATES } from '../data/mockPipeline';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Sparkles, 
  Maximize2, 
  Sliders, 
  Music, 
  Eye, 
  Film, 
  Layers, 
  Palette,
  CheckCircle2,
  Share2,
  RefreshCw
} from 'lucide-react';

interface StudioEditorProps {
  project: VideoProject;
  onUpdateProject: (project: VideoProject) => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  project,
  onUpdateProject,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [totalDurationMs, setTotalDurationMs] = useState(25000); // 25 seconds
  const [isMuted, setIsMuted] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('tmpl-split-2-vert');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [watermarkEnabled, setWatermarkEnabled] = useState(project.editorOutput?.watermarkEnabled || false);
  const [selectedColorGrade, setSelectedColorGrade] = useState(project.editorOutput?.activeColorGrade || 'Kodak 5219 Deep Cyan & Warm Amber');
  const [subtitleStyle, setSubtitleStyle] = useState(project.bibleOutput?.subtitles.style || 'hormozi_bold');

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const words = project.audioOutput?.transcriptWords || [];
  const scenes = project.sceneEngineOutput?.scenes || [];

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      lastTimestampRef.current = performance.now();
      const loop = (now: number) => {
        if (lastTimestampRef.current !== null) {
          const delta = now - lastTimestampRef.current;
          setCurrentTimeMs((prev) => {
            const next = prev + delta;
            if (next >= totalDurationMs) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
        lastTimestampRef.current = now;
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimestampRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, totalDurationMs]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setCurrentTimeMs(val);
  };

  // Find currently active word for karaoke
  const currentWordIndex = words.findIndex(
    (w) => currentTimeMs >= w.startMs && currentTimeMs <= w.endMs
  );

  // Group current 4 words for comfortable viewing
  const activeWordWindow = words.slice(
    Math.max(0, currentWordIndex - 1),
    Math.min(words.length, currentWordIndex + 4)
  );

  // Filter templates
  const templateCategories = [
    { key: 'all', label: 'Todos os Templates (160+)' },
    { key: 'split_screen', label: 'Split Screen (2-4 Cenas)' },
    { key: 'picture_in_picture', label: 'Picture-in-Picture' },
    { key: 'cinematic_overlay', label: 'Cinematográfico 2.39:1' },
    { key: 'shorts_vertical', label: 'Vertical 9:16 Shorts' },
    { key: 'grid_bento', label: 'Bento Box & Mosaico' },
  ];

  const filteredTemplates = activeCategoryFilter === 'all'
    ? VISUAL_TEMPLATES
    : VISUAL_TEMPLATES.filter((t) => t.category === activeCategoryFilter);

  // Render & Export Video Simulation (with direct download)
  const handleExportVideo = () => {
    setIsExporting(true);
    setExportProgress(10);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);

          // Trigger download of master video file
          const blob = new Blob(
            ['AutoVideo AI Engine Rendered Master Track: Wow Signal 1977'],
            { type: 'video/mp4' }
          );
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `video_master_1977_${Date.now()}.mp4`;
          a.click();
          URL.revokeObjectURL(url);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Estúdio & Editor de Vídeo Automático</span>
            <span className="text-xs font-mono font-normal text-rose-400 border border-rose-500/30 rounded px-2 py-0.5">
              Timeline & Karaokê Engine
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Sincronização milimétrica de narração W Studios, legendas palavra por palavra com destaques em tempo real, biblioteca com mais de 160 templates de diagramação e trilha adaptativa Suno AI.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportVideo}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Renderizando ({exportProgress}%)...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Renderizar & Exportar MP4</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Viewport: Left = Video Player + Subtitles | Right = Direction Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Video Player with Karaoke Subtitles Overlay */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Background Simulated Scene Graphics with LUT Color Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80"
                alt="Studio Scene Backdrop"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-1000 scale-105"
                style={{
                  filter: selectedColorGrade.includes('Noir')
                    ? 'grayscale(100%) contrast(125%)'
                    : selectedColorGrade.includes('Teal')
                    ? 'contrast(115%) saturate(120%) hue-rotate(5deg)'
                    : 'contrast(110%)',
                }}
              />

              {/* Cinematic Vignette Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
            </div>

            {/* Top Bar inside Player (Watermark & Active Template Tag) */}
            <div className="relative z-10 p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-neutral-700 font-mono text-amber-400">
                  {VISUAL_TEMPLATES.find((t) => t.id === activeTemplateId)?.name || 'Split Screen'}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-neutral-700 font-mono text-neutral-300">
                  {selectedColorGrade}
                </span>
              </div>

              {watermarkEnabled && (
                <div className="font-mono text-xs text-white/70 tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded border border-white/10">
                  AutoVideo Studio
                </div>
              )}
            </div>

            {/* Center Area: Real-Time Animated Karaoke Subtitles */}
            <div className="relative z-10 p-6 flex flex-col items-center justify-center text-center">
              <div className="max-w-xl mx-auto space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {activeWordWindow.length > 0 ? (
                    activeWordWindow.map((w, idx) => {
                      const isCurrent = currentTimeMs >= w.startMs && currentTimeMs <= w.endMs;
                      return (
                        <span
                          key={idx}
                          className={`transition-all duration-150 transform ${
                            isCurrent
                              ? 'text-amber-400 font-extrabold scale-110 drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] text-2xl sm:text-3xl uppercase tracking-wide'
                              : w.highlight
                              ? 'text-emerald-300 font-bold text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]'
                              : 'text-white/80 font-semibold text-lg sm:text-xl drop-shadow'
                          }`}
                        >
                          {w.word}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-neutral-400 text-sm font-mono">
                      (Aguardando início da fala...)
                    </span>
                  )}
                </div>

                {/* Subtitle Style Label */}
                <div className="text-xs text-neutral-400/80 font-mono pt-1">
                  Estilo: {subtitleStyle === 'hormozi_bold' ? 'Hormozi Bold Glow' : 'MrBeast Pop Impact'}
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar inside Player */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 flex items-center justify-center transition-transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="font-mono text-xs text-neutral-300 tabular-nums">
                  {formatTime(currentTimeMs)} / {formatTime(totalDurationMs)}
                </span>
              </div>

              {/* Scrubber slider */}
              <div className="flex-1 max-w-md mx-2">
                <input
                  type="range"
                  min="0"
                  max={totalDurationMs}
                  value={currentTimeMs}
                  onChange={handleSeek}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Suno 122 BPM (-70% Ducking)</span>
              </div>
            </div>
          </div>

          {/* Multi-Track Studio Timeline */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-white">Timeline Multi-Faixa Sincronizada</span>
              <span className="font-mono">5 Faixas Ativas</span>
            </div>

            {/* Track 1: Scenes */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-20 text-neutral-400 font-mono text-xs shrink-0">Cenas</span>
              <div className="flex-1 h-7 bg-neutral-950 rounded border border-neutral-800 flex overflow-hidden">
                <div className="w-[30%] bg-rose-950/60 border-r border-rose-500/30 flex items-center px-2 text-rose-300 text-xs truncate">
                  1. YouTube Trim
                </div>
                <div className="w-[30%] bg-purple-950/60 border-r border-purple-500/30 flex items-center px-2 text-purple-300 text-xs truncate">
                  2. Fal.ai Video
                </div>
                <div className="w-[40%] bg-sky-950/60 flex items-center px-2 text-sky-300 text-xs truncate">
                  3. NASA Stock B-Roll
                </div>
              </div>
            </div>

            {/* Track 2: Voice Narration Waveform */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-20 text-neutral-400 font-mono text-xs shrink-0">Narração</span>
              <div className="flex-1 h-7 bg-neutral-950 rounded border border-neutral-800 flex items-center px-2 overflow-hidden relative">
                <div className="flex items-center gap-0.5 w-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-amber-500/60 rounded-full"
                      style={{ height: `${Math.sin(i * 0.4) * 12 + 14}px` }}
                    />
                  ))}
                </div>
                {/* Playhead indicator line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none transition-all"
                  style={{ left: `${(currentTimeMs / totalDurationMs) * 100}%` }}
                />
              </div>
            </div>

            {/* Track 3: Karaoke Words */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-20 text-neutral-400 font-mono text-xs shrink-0">Karaokê</span>
              <div className="flex-1 h-7 bg-neutral-950 rounded border border-neutral-800 flex items-center px-2 text-xs font-mono text-emerald-400 overflow-hidden">
                Word-by-word synced highlights (#F59E0B / #10B981)
              </div>
            </div>

            {/* Track 4: Suno Music BGM */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-20 text-neutral-400 font-mono text-xs shrink-0">Suno BGM</span>
              <div className="flex-1 h-7 bg-neutral-950 rounded border border-neutral-800 flex items-center px-2 text-xs font-mono text-sky-400">
                Cosmic Transmission (Dark Drone 122 BPM) · Auto-Ducking Ativo
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direction Controls & Visual Templates Library */}
        <div className="space-y-5">
          {/* Project Direction Controls */}
          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Painel de Direção do Projeto</span>
            </h3>

            {/* Color Grade LUT */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Tom de Cor & Grade LUT:</label>
              <select
                value={selectedColorGrade}
                onChange={(e) => setSelectedColorGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Kodak 5219 Deep Cyan & Warm Amber">Kodak 5219 Deep Cyan & Warm Amber</option>
                <option value="Monochrome Noir 35mm Contrast">Monochrome Noir 35mm Contrast</option>
                <option value="Cyberpunk Neon Emerald">Cyberpunk Neon Emerald</option>
                <option value="Vintage 1977 Technicolor">Vintage 1977 Technicolor</option>
              </select>
            </div>

            {/* Subtitle Style */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Estilo de Legendas Karaokê:</label>
              <select
                value={subtitleStyle}
                onChange={(e) => setSubtitleStyle(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="hormozi_bold">Hormozi Bold Glow (Amarelo & Verde)</option>
                <option value="mrbeast_pop">MrBeast Pop Impact (Caixa Alta & Borda)</option>
                <option value="clean_minimal">Clean Minimal Documentário</option>
              </select>
            </div>

            {/* Watermark Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <div>
                <div className="text-xs font-medium text-white">Marca d'Água do Projeto</div>
                <div className="text-xs text-neutral-500">Exibir identificador visual discreto</div>
              </div>
              <input
                type="checkbox"
                checked={watermarkEnabled}
                onChange={(e) => setWatermarkEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>
          </div>

          {/* Visual Templates Catalog (160+ Templates) */}
          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-semibold text-white">Biblioteca de 160+ Templates</h4>
              </div>
              <span className="text-xs text-purple-400 font-mono">Diagramação</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {filteredTemplates.map((tmpl) => {
                const isActive = activeTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setActiveTemplateId(tmpl.id)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-neutral-900 border-amber-500/50 ring-1 ring-amber-500/20'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-xs">{tmpl.name}</span>
                      <span className="font-mono text-neutral-500 text-xs">{tmpl.scenesCount} cenas</span>
                    </div>
                    <p className="text-neutral-400 text-xs line-clamp-1">{tmpl.description}</p>
                    <div className="flex items-center justify-between pt-1 text-xs text-neutral-500 font-mono">
                      <span>SFX: {tmpl.transitionSfx}</span>
                      {isActive && <span className="text-amber-400 font-bold">Ativo</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
