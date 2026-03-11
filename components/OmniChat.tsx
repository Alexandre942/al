
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';
import { downloadAsFile } from '../services/geminiService';

const OmniChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => setSelectedFile(f.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedFile) return;

    const userMessage: Message = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const promptParts: any[] = [{ text: input || "Analise este arquivo." }];
      
      if (selectedFile) {
        promptParts.push({
          inlineData: {
            data: selectedFile.split(',')[1],
            mimeType: selectedFile.match(/data:(.*?);/)?.[1] || 'image/png'
          }
        });
      }

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: promptParts }],
        config: {
          systemInstruction: "Você é o Omni Chat da QUETANE IA. Você é inteligente, conciso e focado em produtividade extrema. Ajude o usuário com qualquer tarefa, análise de arquivos, fotos ou dúvidas técnicas. Responda em Português do Brasil."
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: result.text || '', timestamp: Date.now() }]);
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] glass-panel rounded-[2.5rem] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h3 className="text-xl font-black text-white">Omni Chat <span className="text-yellow-500 font-mono text-xs ml-2">v2.5</span></h3>
        <div className="flex items-center space-x-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Neural Link Active</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-8 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
            <div className="text-6xl">🤖</div>
            <p className="max-w-xs text-sm font-bold uppercase tracking-[0.2em]">O sistema aguarda seus comandos, mestre.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative group max-w-[80%] p-5 rounded-[2rem] ${
              m.role === 'user' 
                ? 'bg-yellow-500 text-black font-medium' 
                : 'bg-white/5 border border-white/10 text-zinc-200'
            }`}>
              {m.text}
              {m.role === 'model' && (
                <button 
                  onClick={() => downloadAsFile(m.text, `resposta_quetane_${i}.txt`)}
                  className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/5 rounded-lg hover:bg-white/10"
                  title="Baixar Resposta"
                >
                  📥
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-yellow-500 animate-pulse font-mono text-xs">PENSANDO...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 bg-black/40 border-t border-white/5">
        {selectedFile && (
          <div className="mb-4 relative inline-block">
             <img src={selectedFile} className="h-20 w-20 object-cover rounded-xl border border-yellow-500/50" />
             <button onClick={() => setSelectedFile(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-xs">×</button>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-xl"
          >
            📎
          </button>
          <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*,.pdf,.txt" />
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite seu comando..."
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-yellow-500/50"
          />
          <button
            onClick={handleSendMessage}
            className="p-4 rounded-2xl bg-yellow-500 text-black font-black hover:bg-yellow-400 transition-all"
          >
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default OmniChat;
