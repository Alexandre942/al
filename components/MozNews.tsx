
import React, { useState, useEffect } from 'react';
import { geminiService, downloadAsFile } from '../services/geminiService';

const MozNews: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    try {
      const result = await geminiService.fetchNews();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-1000">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter">Global Intelligence</h2>
          <p className="text-zinc-500">Notícias de Moçambique e do mundo filtradas pela QUETANE IA.</p>
        </div>
        <div className="flex space-x-3">
          {data && (
            <button 
              onClick={() => downloadAsFile(data.text, 'noticias_quetane.txt')}
              className="p-3 glass-panel rounded-2xl hover:bg-white/5 transition-all text-yellow-500 border border-yellow-500/20 text-xs font-bold"
            >
              📥 BAIXAR BRIEFING
            </button>
          )}
          <button 
            onClick={loadNews}
            disabled={loading}
            className="p-3 glass-panel rounded-2xl hover:bg-white/5 transition-all"
          >
            <span className={loading ? 'animate-spin block' : ''}>🔄</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[1, 2].map(i => (
             <div key={i} className="glass-panel p-8 rounded-[2.5rem] space-y-4 animate-pulse">
                <div className="h-8 bg-white/5 rounded w-1/3"></div>
                <div className="space-y-2">
                   <div className="h-4 bg-white/5 rounded"></div>
                   <div className="h-4 bg-white/5 rounded"></div>
                   <div className="h-4 bg-white/5 rounded w-5/6"></div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <div className="glass-panel p-10 rounded-[3rem] bg-gradient-to-br from-zinc-900/50 to-black border-l-4 border-yellow-500">
            <div className="flex items-center space-x-3 mb-8">
               <span className="text-2xl">🇲🇿</span>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Foco: Moçambique</h3>
            </div>
            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-lg">
               {data?.text.split('Global')[0].split('\n').map((l: string, i: number) => <p key={i} className="mb-4">{l}</p>)}
            </div>
          </div>

          <div className="glass-panel p-10 rounded-[3rem] bg-zinc-900/30">
            <div className="flex items-center space-x-3 mb-8">
               <span className="text-2xl">🌍</span>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Destaques Globais</h3>
            </div>
            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed">
               {data?.text.includes('Global') ? data.text.split('Global')[1].split('\n').map((l: string, i: number) => <p key={i} className="mb-4">{l}</p>) : "Destaques globais carregados no bloco principal."}
            </div>
          </div>
        </div>
      )}

      {data?.sources?.length > 0 && (
        <div className="glass-panel p-6 rounded-[2rem]">
          <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Fontes de Verificação</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.sources.map((s: any, idx: number) => (
              <a key={idx} href={s.web?.uri} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
                <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center text-[10px] group-hover:bg-yellow-500/20">🔗</div>
                <span className="text-xs text-zinc-400 group-hover:text-yellow-500 truncate">{s.web?.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MozNews;
