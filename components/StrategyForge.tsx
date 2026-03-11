
import React, { useState } from 'react';
import { geminiService, downloadAsFile } from '../services/geminiService';
import { dbService } from '../services/dbService';

const StrategyForge: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const data = await geminiService.generateStrategy(prompt);
      setResult(data);
      const user = dbService.getCurrentUser();
      if (user) {
        dbService.saveData(user.id, 'strategy', { prompt, response: data.text });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-5xl font-black text-white">Arquiteto de Riqueza</h2>
        <p className="text-zinc-500 text-lg">Defina seus objetivos. A QUETANE IA calcula o caminho.</p>
      </div>

      <div className="glass-panel p-8 rounded-[3rem] shadow-2xl relative">
        <div className="space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Tenho R$ 10.000 e 10 horas por semana. Construa uma operação de IA globalmente escalável para atingir R$ 1M em 18 meses."
            className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-yellow-500/50 transition-all text-lg placeholder:text-zinc-700"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-6 rounded-3xl bg-yellow-500 text-black font-black text-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_-5px_rgba(234,179,8,0.5)]"
          >
            {loading ? 'ARQUITETANDO...' : 'INICIAR PROTOCOLO DE RIQUEZA'}
          </button>
        </div>
      </div>

      {result && (
        <div className="glass-panel p-8 rounded-[3rem] animate-in slide-in-from-bottom-8 duration-1000 relative">
          <button 
            onClick={() => downloadAsFile(result.text, 'estrategia_quetane.txt')}
            className="absolute top-6 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-yellow-500 border border-white/5"
            title="Baixar Estratégia"
          >
            📥 Baixar Plano
          </button>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-xl">💡</div>
            <h3 className="text-2xl font-black text-white">A Estratégia Quetane</h3>
          </div>
          <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-4">
             {result.text.split('\n').map((line: string, i: number) => (
               <p key={i}>{line}</p>
             ))}
          </div>
          {result.sources?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/5">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Fontes de Embasamento</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.map((s: any, idx: number) => (
                  <a key={idx} href={s.web?.uri} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-500/30 transition-all text-sm text-yellow-500/80 truncate">
                    {s.web?.title || 'Inteligência Externa'}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StrategyForge;
