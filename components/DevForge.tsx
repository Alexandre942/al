
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { downloadAsFile } from '../services/geminiService';
import { dbService } from '../services/dbService';

const DevForge: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleForge = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setCode('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      // Usando gemini-3-flash-preview para velocidade máxima e eficiência em geração de código
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Você é o Engenheiro Chefe da QUETANE IA. Sua tarefa é criar código completo, profissional e pronto para produção para sites e aplicativos de alta performance. Use tecnologias modernas (React, Tailwind CSS, TypeScript). Forneça o código em um formato limpo, modular e bem comentado. Responda em Português do Brasil."
        }
      });

      const generatedCode = result.text || '';
      setCode(generatedCode);

      // Salvar no banco de dados do usuário
      const user = dbService.getCurrentUser();
      if (user && generatedCode) {
        dbService.saveData(user.id, 'project', { 
          prompt, 
          code: generatedCode,
          engine: 'Gemini 3 Flash' 
        });
      }
    } catch (error) {
      console.error("Erro na forja:", error);
      setCode("// Ocorreu um erro operacional na forja. Verifique sua conexão ou tente um prompt mais simples.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[80vh] animate-in fade-in duration-700">
      <div className="space-y-6 flex flex-col">
        <div className="glass-panel p-8 rounded-[2.5rem] space-y-4 border border-blue-500/10">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Project Forge</h3>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-bold uppercase tracking-widest">Motor Turbo Ativo</span>
          </div>
          <p className="text-zinc-500 text-sm">Descreva sua visão digital. QUETANE traduzirá sua ideia em código de classe mundial instantaneamente.</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Crie uma Landing Page luxuosa para uma agência de marketing, usando React, Tailwind e animações de entrada. Inclua seção de preços e formulário de contato."
            className="w-full h-48 bg-black/50 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-blue-500/50 resize-none transition-all placeholder:text-zinc-700"
          />
          <button
            onClick={handleForge}
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-black text-lg hover:from-blue-600 hover:to-blue-400 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'GERANDO CÓDIGO NEURAL...' : 'FORJAR PROJETO DIGITAL'}
          </button>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] flex-grow border border-white/5">
           <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Parâmetros de Arquitetura</h4>
           <div className="grid grid-cols-2 gap-3">
             {['React 19 (Latest)', 'Tailwind CSS v4', 'TypeScript Strict', 'Componentes Modulares', 'Mobile First', 'SEO Optimized'].map(t => (
               <div key={t} className="flex items-center space-x-2 text-[10px] text-zinc-400 bg-white/5 p-2 rounded-lg border border-white/5">
                 <span className="text-blue-500">✔</span>
                 <span>{t}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col bg-[#080808] border border-white/5 shadow-2xl relative">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md relative z-10">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Output_Terminal.tsx</span>
            {code && !loading && (
              <div className="flex space-x-2">
                <button 
                  onClick={handleCopy}
                  className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition-all ${copied ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                  {copied ? 'COPIADO!' : 'COPIAR'}
                </button>
                <button 
                  onClick={() => downloadAsFile(code, 'projeto_quetane_ia.tsx')}
                  className="text-[10px] bg-blue-600/20 hover:bg-blue-600/30 px-3 py-1.5 rounded-lg border border-blue-600/30 text-blue-400 font-bold transition-all"
                >
                  DOWNLOAD
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-grow p-8 font-mono text-sm text-blue-200 overflow-y-auto whitespace-pre relative z-10 custom-scrollbar">
          {loading ? (
             <div className="flex flex-col h-full items-center justify-center space-y-6">
                <div className="w-full max-w-md space-y-3">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-3 bg-blue-500/10 rounded-full animate-pulse" 
                      style={{ 
                        width: `${Math.random() * 40 + 60}%`,
                        animationDelay: `${i * 0.1}s`,
                        opacity: (12 - i) / 12
                      }} 
                    />
                  ))}
                </div>
                <div className="text-blue-500 animate-pulse text-[10px] font-black tracking-[0.3em] uppercase">
                  Compilando Estruturas Neurais...
                </div>
             </div>
          ) : (
            code || (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <div className="text-8xl mb-4">⌨️</div>
                <p className="text-xs font-black uppercase tracking-[0.4em]">Terminal Pronto para Injeção</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DevForge;
