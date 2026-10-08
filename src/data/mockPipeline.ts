import { ProviderItem, VisualTemplate, VideoProject, TelegramInteraction } from '../types';

export const INITIAL_PROVIDERS: ProviderItem[] = [
  // Chat LLM
  {
    id: 'prov-gemini-3.8-flash',
    name: 'Google Gemini 3.8 Flash',
    category: 'chat_llm',
    model: 'gemini-3.8-flash',
    status: 'healthy',
    priority: 1,
    quotaPercent: 94,
    latencyMs: 310,
    callsSuccess: 1420,
    callsFailed: 2,
    accountPoolCount: 4,
  },
  {
    id: 'prov-claude-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    category: 'chat_llm',
    model: 'claude-3-5-sonnet-20241022',
    status: 'healthy',
    priority: 2,
    quotaPercent: 78,
    latencyMs: 620,
    callsSuccess: 840,
    callsFailed: 5,
    accountPoolCount: 2,
  },
  {
    id: 'prov-openai-gpt4o',
    name: 'OpenAI ChatGPT (GPT-4o)',
    category: 'chat_llm',
    model: 'gpt-4o',
    status: 'healthy',
    priority: 3,
    quotaPercent: 62,
    latencyMs: 740,
    callsSuccess: 610,
    callsFailed: 8,
    accountPoolCount: 3,
  },
  {
    id: 'prov-antigravity',
    name: 'Antigravity Autonomous Engine',
    category: 'chat_llm',
    model: 'antigravity-deep-agent-v1',
    status: 'healthy',
    priority: 4,
    quotaPercent: 88,
    latencyMs: 980,
    callsSuccess: 320,
    callsFailed: 1,
    accountPoolCount: 2,
  },

  // Image & Video Gen
  {
    id: 'prov-fal-minimax',
    name: 'Fal.ai / MiniMax Hailuo 01',
    category: 'video_gen',
    model: 'minimax-video-01-hd',
    status: 'healthy',
    priority: 1,
    quotaPercent: 71,
    latencyMs: 4200,
    callsSuccess: 280,
    callsFailed: 4,
    accountPoolCount: 3,
  },
  {
    id: 'prov-flow-video',
    name: 'Flow CineGen Studio',
    category: 'video_gen',
    model: 'flow-cinematic-v2',
    status: 'healthy',
    priority: 2,
    quotaPercent: 85,
    latencyMs: 3900,
    callsSuccess: 195,
    callsFailed: 2,
    accountPoolCount: 2,
  },
  {
    id: 'prov-seaart',
    name: 'SeaArt Video Automation',
    category: 'video_gen',
    model: 'seaart-motion-diffusion',
    status: 'healthy',
    priority: 3,
    quotaPercent: 92,
    latencyMs: 4800,
    callsSuccess: 140,
    callsFailed: 3,
    accountPoolCount: 2,
  },
  {
    id: 'prov-chatgpt-dalle',
    name: 'ChatGPT / DALL-E 3 & Flux',
    category: 'image_gen',
    model: 'dall-e-3 / flux.1-schnell',
    status: 'healthy',
    priority: 1,
    quotaPercent: 83,
    latencyMs: 1850,
    callsSuccess: 590,
    callsFailed: 7,
    accountPoolCount: 4,
  },

  // TTS Voice
  {
    id: 'prov-elevenlabs-wstudios',
    name: 'W Studios (ElevenLabs Multilingual v2)',
    category: 'tts_voice',
    model: 'eleven_multilingual_v2',
    status: 'healthy',
    priority: 1,
    quotaPercent: 68,
    latencyMs: 480,
    callsSuccess: 890,
    callsFailed: 3,
    accountPoolCount: 5,
  },
  {
    id: 'prov-capcut-tts',
    name: 'CapCut Neural Voice Pipeline',
    category: 'tts_voice',
    model: 'capcut-narrator-pro-br',
    status: 'healthy',
    priority: 2,
    quotaPercent: 95,
    latencyMs: 380,
    callsSuccess: 450,
    callsFailed: 1,
    accountPoolCount: 3,
  },
  {
    id: 'prov-minimax-tts',
    name: 'MiniMax Speech-01 HD',
    category: 'tts_voice',
    model: 'speech-01-hd',
    status: 'healthy',
    priority: 3,
    quotaPercent: 90,
    latencyMs: 510,
    callsSuccess: 230,
    callsFailed: 2,
    accountPoolCount: 2,
  },

  // Music Gen
  {
    id: 'prov-suno-ai',
    name: 'Suno AI v3.5 Dynamic Music',
    category: 'music_gen',
    model: 'suno-v3.5-instrumental',
    status: 'healthy',
    priority: 1,
    quotaPercent: 74,
    latencyMs: 2900,
    callsSuccess: 310,
    callsFailed: 4,
    accountPoolCount: 3,
  },

  // Media Stock & Open Archives
  {
    id: 'prov-youtube-smart-trim',
    name: 'YouTube Smart Trim & Clip Engine',
    category: 'media_stock',
    model: 'yt-transcript-subclip-v2',
    status: 'healthy',
    priority: 1,
    quotaPercent: 99,
    latencyMs: 240,
    callsSuccess: 1120,
    callsFailed: 0,
    accountPoolCount: 8,
  },
  {
    id: 'prov-internet-archive',
    name: 'Internet Archive Public API',
    category: 'media_stock',
    model: 'ia-archival-video-v1',
    status: 'healthy',
    priority: 2,
    quotaPercent: 100,
    latencyMs: 340,
    callsSuccess: 420,
    callsFailed: 1,
    accountPoolCount: 1,
  },
  {
    id: 'prov-nasa-media',
    name: 'NASA Image & Video Library',
    category: 'media_stock',
    model: 'nasa-open-archive-v1',
    status: 'healthy',
    priority: 3,
    quotaPercent: 100,
    latencyMs: 410,
    callsSuccess: 180,
    callsFailed: 0,
    accountPoolCount: 1,
  },

  // Web & Transcription
  {
    id: 'prov-whisper-gemini-transcribe',
    name: 'Gemini Transcribe & Whisper v3',
    category: 'web_search',
    model: 'gemini-3.5-transcribe',
    status: 'healthy',
    priority: 1,
    quotaPercent: 96,
    latencyMs: 550,
    callsSuccess: 760,
    callsFailed: 2,
    accountPoolCount: 3,
  }
];

export const VISUAL_TEMPLATES: VisualTemplate[] = [
  {
    id: 'tmpl-split-2-vert',
    name: 'Split Screen 50/50 Dual Contrast',
    scenesCount: 2,
    category: 'split_screen',
    aspectRatio: '16:9',
    transitionSfx: 'whoosh_air_snap',
    description: 'Divisão vertical limpa em duas metades com linha de contraste central e sincronização simultânea.',
    cssLayout: 'grid grid-cols-2 gap-2',
  },
  {
    id: 'tmpl-split-3-columns',
    name: 'Triptych 3-Column Comparison',
    scenesCount: 3,
    category: 'split_screen',
    aspectRatio: '16:9',
    transitionSfx: 'shutter_click_soft',
    description: 'Três colunas verticais dinâmicas para evolução histórica ou contraste cronológico.',
    cssLayout: 'grid grid-cols-3 gap-2',
  },
  {
    id: 'tmpl-bento-4-grid',
    name: 'Bento Grid 4-Scene Matrix',
    scenesCount: 4,
    category: 'grid_bento',
    aspectRatio: '16:9',
    transitionSfx: 'glitch_digital_hit',
    description: 'Diagramação no estilo Bento Box com 1 cena dominante expandida e 3 miniaturas de apoio.',
    cssLayout: 'grid grid-cols-3 grid-rows-2 gap-2',
  },
  {
    id: 'tmpl-pip-reaction',
    name: 'Picture-in-Picture Floating Reaction',
    scenesCount: 2,
    category: 'picture_in_picture',
    aspectRatio: '16:9',
    transitionSfx: 'pop_bubble_impact',
    description: 'Vídeo principal ao fundo com recorte secundário flutuante no canto inferior com borda de realce.',
    cssLayout: 'relative w-full h-full',
  },
  {
    id: 'tmpl-cinematic-letterbox',
    name: 'Cinematic 2.39:1 Anamorphic Letterbox',
    scenesCount: 1,
    category: 'cinematic_overlay',
    aspectRatio: '16:9',
    transitionSfx: 'cinematic_sub_bass_drop',
    description: 'Faixas pretas anamórficas com granulação de filme 35mm e iluminação de contraste alto.',
    cssLayout: 'relative w-full h-full overflow-hidden',
  },
  {
    id: 'tmpl-shorts-split-stack',
    name: 'Mobile Vertical 9:16 Split Stack',
    scenesCount: 2,
    category: 'shorts_vertical',
    aspectRatio: '9:16',
    transitionSfx: 'whoosh_fast_swipe',
    description: 'Layout vertical para Reels/Shorts/TikTok com cena superior de impacto e b-roll de gameplay/arquivo abaixo.',
    cssLayout: 'grid grid-rows-2 gap-1.5 h-full',
  },
  {
    id: 'tmpl-spotlight-zoom',
    name: 'Spotlight Focus & Radial Dim',
    scenesCount: 1,
    category: 'cinematic_overlay',
    aspectRatio: '16:9',
    transitionSfx: 'focus_zoom_whoosh',
    description: 'Efeito de vinheta e zoom lento contínuo com destaque central para momentos de revelação.',
    cssLayout: 'relative w-full h-full flex items-center justify-center',
  },
  {
    id: 'tmpl-grid-6-mosaic',
    name: 'Multi-Source Mosaic 6-Panels',
    scenesCount: 6,
    category: 'grid_bento',
    aspectRatio: '16:9',
    transitionSfx: 'digital_matrix_burst',
    description: 'Painel simultâneo de 6 fontes sincronizadas com bordas sutis e ativação sequencial por fala.',
    cssLayout: 'grid grid-cols-3 grid-rows-2 gap-1.5',
  }
];

export const INITIAL_PROJECT: VideoProject = {
  id: 'proj-dark-001',
  title: 'O Enigma de 1977: O Sinal WOW que Ninguém Decifrou',
  theme: 'Astrofísica, mistérios do espaço e sinais extraterrestres desclassificados',
  targetAudience: 'Público fascinado por mistérios científicos, documentários cósmicos e tecnologia profunda',
  status: 'processing',
  currentStage: 'video_assembly',
  createdAt: '2026-10-07T18:10:00Z',
  updatedAt: '2026-10-07T19:20:00Z',

  researchOutput: {
    summary: 'Em 15 de agosto de 1977, o radiotelescópio Big Ear da Ohio State University captou um sinal de rádio de banda estreita com 72 segundos de duração, vindo da constelação de Sagitário. Jerry Ehman circulou os caracteres 6EQUJ5 no papel e escreveu a mão: "Wow!". O sinal jamais se repetiu da mesma forma.',
    hookAngles: [
      'Em 1977, um astrônomo circulou 6 letras que a NASA tentou explicar por 40 anos.',
      'O sinal durou apenas 72 segundos. Mas violou todas as leis de transmissão conhecidas.',
      'Por que este foi o único sinal de rádio cósmico que nunca mais emitiu uma réplica?'
    ],
    keyFacts: [
      { fact: 'Frequência de 1420.455 MHz, a exata linha do hidrogênio interestelar prevista por Carl Sagan.', source: 'Ohio State Big Ear Archive' },
      { fact: 'Intensidade registrada como 6EQUJ5 em escala de 0 a 36.', source: 'Dr. Jerry Ehman, Original Printout' },
      { fact: 'Localização apontava para a estrela 2MASS 19281982-2640123 na constelação de Sagitário.', source: 'Astronomical Journal (2022 Analysis)' }
    ],
    retentionTriggers: [
      'Loop 1: O que significa o código alfanumérico 6EQUJ5 no papel perfurado?',
      'Loop 2: A teoria recente dos cometas de hidrogênio foi refutada ou comprovada?',
      'Loop 3: O radiotelescópio foi demolido e substituído por um campo de golfe.'
    ]
  },

  scriptOutput: {
    hookDurationSec: 3,
    estimatedDurationSec: 38,
    wordCount: 88,
    fullText: 'Em 1977, um radiotelescópio solitário captou um sinal de 72 segundos que gelou a espinha dos astrônomos. No papel perfurado, seis caracteres surgiram: 6EQUJ5. O astrônomo circulou com caneta vermelha e escreveu apenas: WOW! A frequência era exatamente a linha cósmica do hidrogênio. Nenhuma estrela conhecida emite isso. E o mais assustador: ele nunca mais se repetiu.',
    scenes: [
      {
        sceneNumber: 1,
        durationSec: 4,
        narration: 'Em 1977, um radiotelescópio solitário captou um sinal de 72 segundos que gelou a espinha dos astrônomos.',
        visualConcept: 'Radiotelescópio Big Ear sob céu estrelado à noite, antena massiva em campo aberto.',
        suggestedSource: 'youtube_trim',
        soundFx: 'wind_cosmic_drone'
      },
      {
        sceneNumber: 2,
        durationSec: 5,
        narration: 'No papel perfurado, seis caracteres surgiram: 6EQUJ5. O astrônomo circulou em vermelho: WOW!',
        visualConcept: 'Close cirúrgico no papel original datado de 1977 com o círculo de caneta vermelha em 6EQUJ5.',
        suggestedSource: 'stock',
        soundFx: 'pen_circle_scratch'
      },
      {
        sceneNumber: 3,
        durationSec: 5,
        narration: 'A frequência era exatamente 1420 megahertz: a chave do hidrogênio neutro universal.',
        visualConcept: 'Renderização 3D de espectrograma com pico de intensidade extrema subindo do ruído cósmico.',
        suggestedSource: 'ai_gen',
        soundFx: 'frequency_sine_pulse'
      },
      {
        sceneNumber: 4,
        durationSec: 5,
        narration: 'Nenhum pulsar, satélite ou fenômeno natural conhecido consegue emitir com essa pureza espectral.',
        visualConcept: 'Recorte histórico documental de conferência da NASA e cientistas analisando fitas magnéticas.',
        suggestedSource: 'youtube_trim',
        soundFx: 'sub_bass_drop'
      },
      {
        sceneNumber: 5,
        durationSec: 6,
        narration: 'E o detalhe mais intrigante de todos: por 49 anos, o espaço profundo permaneceu em silêncio absoluto.',
        visualConcept: 'Câmera se afastando da Terra em direção ao vazio negro da constelação de Sagitário.',
        suggestedSource: 'ai_gen',
        soundFx: 'abyss_silence_fade'
      }
    ]
  },

  reviewOutput: {
    approved: true,
    overallScore: 9.3,
    criteriaScores: {
      hookEffectiveness: 9.5,
      pacingAndRetention: 9.2,
      factualAccuracy: 9.6,
      policyCompliance: 10.0
    },
    critiquePoints: [
      'Hook direto nos 3 primeiros segundos sem introdução supérflua.',
      'Excelente correspondência entre a frequência de 1420 MHz e o roteiro.',
      'Cena 2 com conexão tangível ao papel histórico amplifica a retenção.'
    ],
    actionableFixes: [],
    rollbackTriggered: false
  },

  bibleOutput: {
    styleName: 'Deep Space Mystery Noir',
    cinematicTone: 'Misterioso, elegante, documental investigativo com alto contraste',
    colorPalette: {
      dominant: '#0B0F19',
      secondary: '#1A2333',
      accent: '#F59E0B',
      lutGrade: 'Kodak 5219 Deep Cyan & Warm Amber'
    },
    mediaMix: {
      youtubePercent: 40,
      aiGenPercent: 30,
      stockPercent: 30
    },
    subtitles: {
      style: 'hormozi_bold',
      primaryColor: '#FFFFFF',
      highlightColor: '#F59E0B',
      fontSize: 44
    },
    pacingBpm: 122,
    aspectRatio: '16:9'
  },

  audioOutput: {
    voiceProvider: 'W Studios (ElevenLabs Multilingual v2)',
    voiceName: 'Marcus - Deep Documentary Host',
    durationSec: 25,
    transcriptWords: [
      { word: 'Em', startMs: 100, endMs: 300 },
      { word: '1977,', startMs: 320, endMs: 700, highlight: true },
      { word: 'um', startMs: 720, endMs: 900 },
      { word: 'radiotelescópio', startMs: 920, endMs: 1600, highlight: true },
      { word: 'solitário', startMs: 1620, endMs: 2100 },
      { word: 'captou', startMs: 2150, endMs: 2500 },
      { word: 'um', startMs: 2520, endMs: 2700 },
      { word: 'sinal', startMs: 2720, endMs: 3100, highlight: true },
      { word: 'de', startMs: 3120, endMs: 3250 },
      { word: '72', startMs: 3280, endMs: 3600, highlight: true },
      { word: 'segundos...', startMs: 3620, endMs: 4200 },
      { word: 'No', startMs: 4300, endMs: 4500 },
      { word: 'papel', startMs: 4520, endMs: 4900 },
      { word: 'perfurado:', startMs: 4920, endMs: 5400 },
      { word: '6EQUJ5.', startMs: 5500, endMs: 6200, highlight: true },
      { word: 'O', startMs: 6300, endMs: 6450 },
      { word: 'astrônomo', startMs: 6480, endMs: 7000 },
      { word: 'circulou:', startMs: 7020, endMs: 7400 },
      { word: 'WOW!', startMs: 7450, endMs: 8100, highlight: true }
    ]
  },

  sceneEngineOutput: {
    scenes: [
      {
        id: 'sc-1',
        sceneNumber: 1,
        title: 'Antena Big Ear Noturna',
        durationSec: 4.5,
        sourceType: 'youtube_trim',
        providerTag: 'YouTube Smart Trim [Recorte 4s]',
        visualTemplateId: 'tmpl-split-2-vert',
        mediaUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=80',
        youtubeClip: {
          videoUrl: 'https://www.youtube.com/watch?v=BigEarDoc1977',
          startSec: 18,
          endSec: 22,
          transcriptFragment: 'o momento da varredura na Ohio State'
        },
        highlightWords: ['1977', 'radiotelescópio', 'sinal']
      },
      {
        id: 'sc-2',
        sceneNumber: 2,
        title: 'Círculo Vermelho 6EQUJ5',
        durationSec: 4.5,
        sourceType: 'stock',
        providerTag: 'Internet Archive Public Assets',
        visualTemplateId: 'tmpl-pip-reaction',
        mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        highlightWords: ['6EQUJ5', 'WOW!']
      },
      {
        id: 'sc-3',
        sceneNumber: 3,
        title: 'Espectro 1420 MHz Neon Wave',
        durationSec: 5.0,
        sourceType: 'ai_gen',
        providerTag: 'Fal.ai / Minimax Video Gen',
        visualTemplateId: 'tmpl-cinematic-letterbox',
        promptText: 'Cinematic 8k spectrogram wave pulse spiking into cosmic gold light in void of space, 16:9',
        mediaUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
        highlightWords: ['hidrogênio', 'espectro']
      },
      {
        id: 'sc-4',
        sceneNumber: 4,
        title: 'Silêncio Cósmico em Sagitário',
        durationSec: 5.5,
        sourceType: 'stock',
        providerTag: 'NASA Open Media Archive',
        visualTemplateId: 'tmpl-spotlight-zoom',
        mediaUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
        highlightWords: ['silêncio', 'espaço']
      }
    ]
  },

  editorOutput: {
    bgmTrack: {
      title: 'Cosmic Transmission (Dark Ambient 122 BPM)',
      provider: 'Suno AI v3.5',
      genre: 'Cinematic Sci-Fi Atmospheric Drone',
      volume: 0.28,
      duckingPercent: 70
    },
    activeColorGrade: 'Kodak 5219 Deep Cyan & Warm Amber',
    templateDensity: 3,
    watermarkEnabled: false,
    exportedVideoUrl: '/exports/wow_signal_1977_master.mp4'
  },

  thumbnailOutput: {
    headline: 'O SINAL QUE CALOU A NASA',
    conceptPrompt: 'Ultra-realistic cinematic shot of 1970s radio telescope under starry night with glowing red ink inscription 6EQUJ5 floating in anamorphic light beams, 16:9, dramatic depth of field',
    altTitles: [
      '72 Segundos de Terror: O Mistério do Sinal WOW!',
      'Eles Ocultaram Isso da NASA por 49 Anos',
      'O Único Sinal Cósmico Que a Ciência Não Conseguiu Explicar'
    ],
    tags: ['astronomia', 'sinal wow', 'espaço', 'nasa', 'documentário', 'ciência'],
    ctrForecastPercent: 16.4,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80'
  }
};

export const INITIAL_TELEGRAM_MESSAGES: TelegramInteraction[] = [
  {
    id: 'tg-1',
    sender: 'user',
    timestamp: '18:10',
    text: '/novo_video O Enigma de 1977: O Sinal WOW que Ninguém Decifrou',
  },
  {
    id: 'tg-2',
    sender: 'bot',
    timestamp: '18:10',
    text: '🎬 Pipeline autônomo iniciado com sucesso!\n\n📋 **Projeto**: O Enigma de 1977\n⚡ **Orquestrador**: Ares (Gemini 3.8 Flash)\n🔍 **Pesquisador**: Athena ativada coletando fatos validados...\n\nVocê receberá notificações automáticas a cada avanço da esteira.',
  },
  {
    id: 'tg-3',
    sender: 'bot',
    timestamp: '18:14',
    text: '✅ **Etapa 2 & 3 Concluídas**: Roteiro aprovado pelo Revisor Kratos com pontuação **9.3/10**.\n\n🎯 *Hook*: 72 segundos de sinal na linha do hidrogênio.\n⏱️ *Duração estimada*: 38 segundos.\n🔄 *Rollback*: Não acionado (Qualidade Nominal).',
    inlineActions: [
      { label: '📄 Ver Roteiro', action: 'view_script' },
      { label: '🎨 Ver Bíblia', action: 'view_bible' }
    ]
  },
  {
    id: 'tg-4',
    sender: 'user',
    timestamp: '18:22',
    text: '/preview',
  },
  {
    id: 'tg-5',
    sender: 'bot',
    timestamp: '18:22',
    text: '🎥 **Prévia Gerada**: Sincronização de timeline, narração W Studios e templates visuais pronta para revisão remota.',
    mediaPreview: {
      type: 'video_preview',
      title: 'O Enigma de 1977 (Master Cut v1)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80'
    },
    inlineActions: [
      { label: '🚀 Aprovar & Renderizar', action: 'approve_render', variant: 'primary' },
      { label: '↩️ Pedir Refatoração', action: 'request_revision', variant: 'danger' }
    ]
  }
];
