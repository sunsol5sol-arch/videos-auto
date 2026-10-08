import React, { useState } from 'react';
import { TelegramInteraction } from '../types';
import { INITIAL_TELEGRAM_MESSAGES } from '../data/mockPipeline';
import { 
  Send, 
  Mic, 
  Bot, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  RotateCcw, 
  Radio, 
  Volume2, 
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface TelegramBotProps {
  onTriggerNewVideo: (theme: string) => void;
  onApproveRender: () => void;
}

export const TelegramBot: React.FC<TelegramBotProps> = ({
  onTriggerNewVideo,
  onApproveRender,
}) => {
  const [messages, setMessages] = useState<TelegramInteraction[]>(INITIAL_TELEGRAM_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [botStatusOnline, setBotStatusOnline] = useState(true);

  // Quick Command buttons
  const quickCommands = [
    { label: '/status', cmd: '/status' },
    { label: '/preview', cmd: '/preview' },
    { label: '/novo_video', cmd: '/novo_video Os Mistérios da Fossa das Marianas' },
    { label: '/aprovar', cmd: '/aprovar' },
  ];

  const handleSendMessage = async (textToSend?: string, isVoice = false) => {
    const text = (textToSend || inputText).trim();
    if (!text && !isVoice) return;

    const userMsg: TelegramInteraction = {
      id: `tg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: isVoice ? '🎙️ [Comando de Áudio] "Criar vídeo sobre mistérios do sinal wow de 1977"' : text,
      isVoice,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Send to backend endpoint
    try {
      const response = await fetch('/api/telegram/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, isVoice }),
      });
      const data = await response.json();

      const botReply: TelegramInteraction = {
        id: `tg-bot-${Date.now()}`,
        sender: 'bot',
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.reply,
        inlineActions: data.inlineButtons,
        mediaPreview: data.mediaPreview,
      };

      setMessages((prev) => [...prev, botReply]);

      // If user typed /novo_video, trigger app state
      if (text.startsWith('/novo_video')) {
        const theme = text.replace('/novo_video', '').trim();
        onTriggerNewVideo(theme);
      } else if (text === '/aprovar') {
        onApproveRender();
      }
    } catch {
      const botFallback: TelegramInteraction = {
        id: `tg-bot-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: '⚡ Resposta automática: comando registrado pelo Agente Líder no servidor.',
      };
      setMessages((prev) => [...prev, botFallback]);
    }
  };

  const handleVoiceCommand = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      handleSendMessage('Criar vídeo sobre mistérios do sinal wow de 1977', true);
    }, 1800);
  };

  const handleInlineClick = (action: string) => {
    if (action === 'approve_render') {
      handleSendMessage('/aprovar');
    } else if (action === 'request_revision') {
      handleSendMessage('Solicito refatoração da cena 2 para aumentar a tensão dramática.');
    } else if (action === 'preview') {
      handleSendMessage('/preview');
    } else {
      handleSendMessage('/status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Controle Remoto & Notificações via Telegram Bot</span>
            <span className="text-xs font-mono font-normal text-blue-400 border border-blue-500/30 rounded px-2 py-0.5">
              @AutoVideoEngine_bot
            </span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Comunicação bidirecional com os múltiplos agentes: envie mensagens de texto ou áudio (transcritas via Whisper v3),
            receba notificações push a cada avanço no Kanban e aprove prévias com 1 clique direto no celular.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Webhook: Conectado</span>
          </div>
        </div>
      </div>

      {/* Telegram Chat Simulation Interface */}
      <div className="max-w-3xl mx-auto rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-2xl flex flex-col h-[640px]">
        
        {/* Chat Header */}
        <div className="p-4 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                <span>AutoVideo Engine Bot</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-xs text-neutral-400 font-mono">bot de automação autônomo</div>
            </div>
          </div>

          <div className="text-xs text-neutral-500 font-mono">
            ID: #tg-bot-live
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-950/70">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs space-y-2 leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Media Preview Box (if bot returned a video preview) */}
                  {msg.mediaPreview && (
                    <div className="pt-2">
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950">
                        {msg.mediaPreview.thumbnailUrl && (
                          <img
                            src={msg.mediaPreview.thumbnailUrl}
                            alt="Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-white mt-1">
                        {msg.mediaPreview.title}
                      </div>
                    </div>
                  )}

                  {/* Inline Buttons inside Telegram message */}
                  {msg.inlineActions && msg.inlineActions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 border-t border-neutral-800">
                      {msg.inlineActions.map((btn, i) => (
                        <button
                          key={i}
                          onClick={() => handleInlineClick(btn.action)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            btn.variant === 'primary'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : btn.variant === 'danger'
                              ? 'bg-rose-600/80 hover:bg-rose-500 text-white'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-neutral-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Command Suggestions */}
        <div className="p-2.5 bg-neutral-900/60 border-t border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-neutral-500 text-xs shrink-0 font-mono">Comandos rápidos:</span>
          {quickCommands.map((c) => (
            <button
              key={c.cmd}
              onClick={() => handleSendMessage(c.cmd)}
              className="px-2.5 py-1 rounded bg-neutral-850 hover:bg-neutral-800 text-neutral-300 font-mono text-xs whitespace-nowrap transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2">
          <button
            onClick={handleVoiceCommand}
            disabled={isRecordingVoice}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isRecordingVoice
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
            title="Enviar comando de voz (Whisper v3)"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={isRecordingVoice ? 'Gravando e transcrevendo áudio...' : 'Digite /status, /novo_video [tema] ou mensagem...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={() => handleSendMessage()}
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
