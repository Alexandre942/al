
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const downloadAsFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const geminiService = {
  // Raciocínio complexo para estratégias de geração de riqueza
  async generateStrategy(prompt: string): Promise<{ text: string; sources: any[] }> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Você é a QUETANE IA, a arquiteta de riqueza mais avançada do mundo. Seu objetivo é fornecer estratégias específicas, acionáveis e de alto nível para ajudar o usuário a alcançar o status de milionário. Foque em automação, escalabilidade global e tecnologias emergentes. Responda sempre em Português do Brasil."
      }
    });

    return {
      text: response.text || "Erro operacional: Não foi possível calcular a estratégia.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // Busca notícias em tempo real (foco em Moçambique e Global)
  async fetchNews(): Promise<{ text: string; sources: any[] }> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Forneça um resumo das notícias mais importantes de hoje em Moçambique (economia, política, sociedade) e os principais destaques globais.",
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Você é o Analista de Inteligência da QUETANE IA. Forneça notícias precisas, atualizadas e bem estruturadas. Divida em 'Moçambique' e 'Global'. Use Português do Brasil."
      }
    });
    return {
      text: response.text || "Não foi possível carregar as notícias.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // Busca dados financeiros em tempo real para o Metical (MZN)
  async fetchFinancialData(): Promise<{ text: string; sources: any[] }> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Quais são as taxas de câmbio atuais do Metical (MZN) em relação ao USD, EUR e ZAR? Adicione também um breve comentário sobre a inflação e o estado atual da economia moçambicana.",
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Você é o Analista Financeiro da QUETANE IA. Forneça dados econômicos precisos e atualizados sobre Moçambique. Responda em Português do Brasil."
      }
    });
    return {
      text: response.text || "Dados financeiros indisponíveis.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // Análise de mercado com grounding do Google Maps/Search
  async analyzeMarket(location: string, niche: string, latLng?: { lat: number; lng: number }) {
    const ai = getAI();
    const prompt = `Analise o potencial de mercado para ${niche} em ${location}. Identifique lacunas, concorrentes e oportunidades de alto valor.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: latLng ? {
            latLng: {
              latitude: latLng.lat,
              longitude: latLng.lng
            }
          } : undefined
        }
      }
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // Geração de ativos visuais para branding
  async forgeAsset(prompt: string, type: 'image' | 'video' = 'image') {
    const ai = getAI();
    
    if (type === 'image') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `Crie um ativo de marketing 4k luxuoso, profissional e futurista para: ${prompt}` }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  }
};

// Utils para Live API
export const audioUtils = {
  encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },
  decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  },
  async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
};
