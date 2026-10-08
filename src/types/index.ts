export type ProviderCategory = 
  | 'chat_llm' 
  | 'image_gen' 
  | 'video_gen' 
  | 'tts_voice' 
  | 'music_gen' 
  | 'media_stock' 
  | 'web_search';

export interface ProviderItem {
  id: string;
  name: string;
  category: ProviderCategory;
  model: string;
  status: 'healthy' | 'degraded' | 'quota_exhausted' | 'offline';
  priority: number;
  quotaPercent: number; // 0 to 100
  latencyMs: number;
  callsSuccess: number;
  callsFailed: number;
  accountPoolCount: number;
  endpointUrl?: string;
  isCustom?: boolean;
}

export interface FailoverLog {
  id: string;
  timestamp: string;
  category: ProviderCategory;
  fromProvider: string;
  toProvider: string;
  reason: 'quota_exhausted' | 'timeout' | 'http_429' | 'rate_limit';
  latencyMs: number;
  success: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  version: string;
  tags: string[];
  systemInstructionAddon: string;
  active: boolean;
}

export type AgentRole = 
  | 'leader' 
  | 'researcher' 
  | 'scriptwriter' 
  | 'reviewer' 
  | 'scene_architect' 
  | 'art_director' 
  | 'thumbnail_seo';

export interface AgentConfig {
  id: string;
  name: string;
  role: AgentRole;
  title: string;
  description: string;
  modelAssigned: string;
  systemPrompt: string;
  memoryType: 'isolated' | 'shared';
  skills: SkillItem[];
  temperature: number;
  topP: number;
  reviewThreshold?: number; // e.g. 8.5
}

export type PipelineStage = 
  | 'research' 
  | 'scriptwriting' 
  | 'script_review' 
  | 'project_bible' 
  | 'audio_transcription' 
  | 'scene_prompting' 
  | 'video_assembly' 
  | 'thumbnail_gen';

export interface ColumnRule {
  stage: PipelineStage;
  title: string;
  assignedAgentId: string;
  fallbackModel: string;
  autoAdvance: boolean;
  rejectToStage?: PipelineStage;
  validationCheck: string;
}

export interface ScriptSceneData {
  sceneNumber: number;
  durationSec: number;
  narration: string;
  visualConcept: string;
  suggestedSource: 'youtube_trim' | 'ai_gen' | 'stock';
  soundFx?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  theme: string;
  targetAudience: string;
  status: 'draft' | 'processing' | 'review_needed' | 'ready_for_render' | 'completed';
  currentStage: PipelineStage;
  createdAt: string;
  updatedAt: string;
  
  // Stage 1: Research
  researchOutput?: {
    summary: string;
    hookAngles: string[];
    keyFacts: { fact: string; source: string }[];
    retentionTriggers: string[];
  };

  // Stage 2: Script
  scriptOutput?: {
    title?: string;
    hookDurationSec: number;
    fullText: string;
    scenes: ScriptSceneData[];
    estimatedDurationSec: number;
    wordCount: number;
  };

  // Stage 3: Review
  reviewOutput?: {
    approved: boolean;
    overallScore: number; // 0 to 10
    criteriaScores: {
      hookEffectiveness: number;
      pacingAndRetention: number;
      factualAccuracy: number;
      policyCompliance: number;
    };
    critiquePoints: string[];
    actionableFixes: string[];
    rollbackTriggered: boolean;
  };

  // Stage 4: Project Bible
  bibleOutput?: {
    styleName: string;
    cinematicTone: string;
    colorPalette: {
      dominant: string;
      secondary: string;
      accent: string;
      lutGrade: string;
    };
    mediaMix: {
      youtubePercent: number; // e.g. 40
      aiGenPercent: number;   // e.g. 30
      stockPercent: number;   // e.g. 30
    };
    subtitles: {
      style: 'hormozi_bold' | 'mrbeast_pop' | 'clean_minimal' | 'documentary_gold';
      primaryColor: string;
      highlightColor: string;
      fontSize: number;
    };
    pacingBpm: number;
    aspectRatio: '16:9' | '9:16';
  };

  // Stage 5: Audio & Voice
  audioOutput?: {
    voiceProvider: string;
    voiceName: string;
    audioUrl?: string;
    durationSec: number;
    transcriptWords: {
      word: string;
      startMs: number;
      endMs: number;
      highlight?: boolean;
    }[];
  };

  // Stage 6: Scenes & Media
  sceneEngineOutput?: {
    scenes: {
      id: string;
      sceneNumber: number;
      title: string;
      durationSec: number;
      sourceType: 'youtube_trim' | 'ai_gen' | 'stock';
      providerTag: string;
      visualTemplateId: string;
      promptText?: string;
      mediaUrl: string;
      youtubeClip?: {
        videoUrl: string;
        startSec: number;
        endSec: number;
        transcriptFragment: string;
      };
      highlightWords?: string[];
    }[];
  };

  // Stage 7: Studio & Render
  editorOutput?: {
    bgmTrack: {
      title: string;
      provider: string; // Suno
      genre: string;
      volume: number;
      duckingPercent: number;
    };
    activeColorGrade: string;
    templateDensity: number; // 1 to 5
    watermarkEnabled: boolean;
    exportedVideoUrl?: string;
  };

  // Stage 8: Thumbnail
  thumbnailOutput?: {
    headline: string;
    conceptPrompt: string;
    altTitles: string[];
    tags: string[];
    ctrForecastPercent: number;
    imageUrl?: string;
  };
}

export interface VisualTemplate {
  id: string;
  name: string;
  scenesCount: number;
  category: 'split_screen' | 'picture_in_picture' | 'cinematic_overlay' | 'shorts_vertical' | 'grid_bento';
  aspectRatio: '16:9' | '9:16';
  transitionSfx: string;
  description: string;
  cssLayout: string;
}

export interface TelegramInteraction {
  id: string;
  sender: 'user' | 'bot';
  timestamp: string;
  text: string;
  isVoice?: boolean;
  voiceDurationSec?: number;
  mediaPreview?: {
    type: 'video_preview' | 'script_summary' | 'status_card';
    title: string;
    thumbnailUrl?: string;
  };
  inlineActions?: {
    label: string;
    action: string;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}
