
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { audioUtils } from '../services/geminiService';

const AdvisorLive: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: audioUtils.encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
            setIsActive(true);
          },
          onmessage: async (msg: LiveServerMessage) => {
             const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
             if (audioData && outputContextRef.current) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContextRef.current.currentTime);
                const buffer = await audioUtils.decodeAudioData(audioUtils.decode(audioData), outputContextRef.current, 24000, 1);
                const source = outputContextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(outputContextRef.current.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
             }

             if (msg.serverContent?.outputTranscription) {
               setTranscription(prev => [...prev.slice(-4), `IA: ${msg.serverContent!.outputTranscription!.text}`]);
             }
             if (msg.serverContent?.inputTranscription) {
                setTranscription(prev => [...prev.slice(-4), `VOCÊ: ${msg.serverContent!.inputTranscription!.text}`]);
             }
          },
          onerror: (e) => console.error("Erro na Sessão Ao Vivo", e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'Você é o Consultor Executivo de Elite da QUETANE IA. Fale com confiança, autoridade e precisão tática. Ajude o usuário a escalar suas operações rumo ao sucesso financeiro. Responda sempre em Português do Brasil.',
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      alert("O acesso ao microfone é necessário para o Consultor de Voz.");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="relative">
        <div className={`w-64 h-64 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30 transition-all duration-700 ${isActive ? 'scale-110 shadow-[0_0_80px_-10px_rgba(234,179,8,0.4)]' : ''}`}>
           <div className={`w-48 h-48 rounded-full bg-yellow-500/40 flex items-center justify-center transition-all duration-500 ${isActive ? 'animate-pulse' : ''}`}>
             <div className="w-32 h-32 rounded-full bg-yellow-500 flex items-center justify-center shadow-inner">
               <span className="text-5xl">{isActive ? '🎙️' : '💤'}</span>
             </div>
           </div>
        </div>
        {isActive && (
          <div className="absolute -inset-8 pointer-events-none">
            {[1, 2, 3].map(i => (
              <div key={i} className="absolute inset-0 border border-yellow-500/20 rounded-full animate-ping" style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </div>
        )}
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">Consultor Executivo de Voz</h2>
        <p className="text-zinc-500 max-w-md">Treinamento tático em tempo real de baixa latência para decisões de alto risco.</p>
      </div>

      <div className="w-full max-w-xl glass-panel p-6 rounded-3xl min-h-[150px] flex flex-col justify-end space-y-2">
        {transcription.length === 0 && <p className="text-zinc-700 italic text-center">Sessão inativa. Inicie para ouvir...</p>}
        {transcription.map((t, i) => (
          <div key={i} className={`text-sm font-medium ${t.startsWith('IA:') ? 'text-yellow-500' : 'text-zinc-400'}`}>
            {t}
          </div>
        ))}
      </div>

      <button
        onClick={isActive ? stopSession : startSession}
        className={`px-12 py-5 rounded-full font-black text-xl transition-all ${isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}
      >
        {isActive ? 'DESCONECTAR CONSULTOR' : 'INICIALIZAR CANAL DE VOZ'}
      </button>
    </div>
  );
};

export default AdvisorLive;
