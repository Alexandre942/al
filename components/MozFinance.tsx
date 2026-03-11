
import React, { useState, useEffect } from 'react';
import { geminiService, downloadAsFile } from '../services/geminiService';

const MozFinance: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await geminiService.fetchFinancialData();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white">Finanças Moçambique</h2>
          <p className="text-zinc-500">Controle do Metical e indicadores econômicos em tempo real.</p>
        </div>
        <div className="flex space-x-3">
          {data && (
            <button 
              onClick={() => downloadAsFile(data.text, 'relatorio_financeiro_moz.txt')}
              className="px-6 py-2 glass-panel rounded-full text-xs font-bold text-emerald-500 hover:bg-white/5 transition-all border border-emerald-500/20"
            >
              📥 BAIXAR RELATÓRIO
            </button>
          )}
          <button 
            onClick={loadData}
            disabled={loading}
            className="px-6 py-2 glass-panel rounded-full text-xs font-bold text-yellow-500 hover:bg-white/5 transition-all"
          >
            {loading ? 'ATUALIZANDO...' : 'RECARREGAR DADOS'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-yellow-500/10">
          <div className="flex items-center justify-between mb-4">
             <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">USD / MZN</span>
             <span className="text-emerald-500 text-[10px] font-bold">LIVE</span>
          </div>
          <div className="text-3xl font-black text-white mb-2">≈ 63.85</div>
          <div className="text-[10px] text-zinc-500">Cotação oficial estimada</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-blue-500/10">
          <div className="flex items-center justify-between mb-4">
             <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">EUR / MZN</span>
             <span className="text-emerald-500 text-[10px] font-bold">LIVE</span>
          </div>
          <div className="text-3xl font-black text-white mb-2">≈ 69.12</div>
          <div className="text-[10px] text-zinc-500">Cotação oficial estimada</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-orange-500/10">
          <div className="flex items-center justify-between mb-4">
             <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">ZAR / MZN</span>
             <span className="text-emerald-500 text-[10px] font-bold">LIVE</span>
          </div>
          <div className="text-3xl font-black text-white mb-2">≈ 3.35</div>
          <div className="text-[10px] text-zinc-500">Cotação oficial estimada</div>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem] min-h-[400px]">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <span className="mr-3">📊</span> Análise de Mercado Moçambicano
        </h3>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-3/4"></div>
            <div className="h-4 bg-white/5 rounded w-full"></div>
            <div className="h-4 bg-white/5 rounded w-5/6"></div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-zinc-300">
            {data?.text.split('\n').map((l: string, i: number) => <p key={i} className="mb-2">{l}</p>)}
          </div>
        )}

        {data?.sources?.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Fontes Oficiais</h4>
            <div className="flex flex-wrap gap-3">
              {data.sources.map((s: any, idx: number) => (
                <a key={idx} href={s.web?.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-500/60 hover:text-yellow-500 transition-all underline decoration-yellow-500/20">
                  {s.web?.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MozFinance;
