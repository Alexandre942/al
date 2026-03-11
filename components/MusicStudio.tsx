
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { downloadAsFile } from '../services/geminiService';

const MusicStudio: React.FC = () => {
  const [genre, setGenre] = useState('Trap');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompose = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const compositionResult = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Componha um guia de produção instrumental e letra para um ${genre} com o tema: ${prompt}.`,
        config: {
          systemInstruction: "Você é um produtor musical multi-platina da QUETANE Records. Crie estruturas de BPM, Key, sugestões de instrumentos, patterns de bateria e letras impactantes para Rap, Trap ou Quizomba. Responda em Português do Brasil com formato estruturado."
        }
      });
      setResult(compositionResult.text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-1000">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-white italic tracking-tighter">BEAT FORGE</h2>
        <p className="text-zinc-500 text-lg">Crie a trilha sonora do seu império. Rap, Trap, Quizomba e além.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Escolha o Gênero</label>
              <div className="grid grid-cols-2 gap-2">
                {['Rap', 'Trap', 'Quizomba', 'Drill'].map(g => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`py-3 rounded-xl text-xs font-black transition-all ${genre === g ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                  >
                    {g.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Conceito da Faixa</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Uma letra sobre superação, batida pesada com graves profundos e melodia melancólica de piano."
                className="w-full h-32 bg-black/30 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-yellow-500/50"
              />
            </div>

            <button
              onClick={handleCompose}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-black font-black hover:bg-zinc-200 transition-all active:scale-95"
            >
              {loading ? 'COMPONDO...' : 'GERAR ESTRUTURA MUSICAL'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel p-10 rounded-[3rem] min-h-[500px] bg-gradient-to-br from-zinc-900 to-black relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -mr-32 -mt-32" />
            
            {result && !loading && (
              <button 
                onClick={() => downloadAsFile(result, `composicao_${genre.toLowerCase()}.txt`)}
                className="absolute top-8 right-8 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/10"
                title="Baixar Composição"
              >
                📥
              </button>
            )}

            {!result && !loading ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                <div className="text-8xl">🎧</div>
                <div className="flex space-x-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1 h-12 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-zinc-300">
                {loading ? (
                  <div className="flex flex-col items-center justify-center space-y-4 pt-20">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-mono text-yellow-500 text-sm">PROCESSANDO FREQUÊNCIAS...</p>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-medium leading-relaxed">
                    {result}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicStudio;
