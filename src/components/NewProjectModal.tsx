import React, { useState } from 'react';
import { VideoProject } from '../types';
import { Sparkles, X, Clapperboard } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (title: string, theme: string, audience: string) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [audience, setAudience] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateProject(
      title.trim(),
      theme.trim() || 'Mistérios Científicos e Descobertas Históricas',
      audience.trim() || 'Público geral fascinado por documentários e curiosidades'
    );
    setTitle('');
    setTheme('');
    setAudience('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Criar Novo Projeto Audiovisual</h3>
              <p className="text-xs text-neutral-400">Inicia a esteira autônoma de múltiplos agentes</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 block mb-1 font-medium">Título do Projeto:</label>
            <input
              type="text"
              required
              placeholder="Ex: O Enigma da Fossa das Marianas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-neutral-300 block mb-1 font-medium">Tema & Foco da Pesquisa:</label>
            <textarea
              rows={3}
              placeholder="Descreva o assunto principal, ganchos desejados ou mistério a ser desvendado..."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-neutral-300 block mb-1 font-medium">Público-Alvo:</label>
            <input
              type="text"
              placeholder="Ex: Jovens curiosos em TikTok/Reels ou Entusiastas de Ciência"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors shadow-sm"
            >
              Criar e Despachar para Athena
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
