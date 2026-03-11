
import React, { useState, useEffect } from 'react';
import { User, StoredData, AppView } from '../types';
import { dbService } from '../services/dbService';

interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  setView: (view: AppView) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, setView }) => {
  const [history, setHistory] = useState<StoredData[]>([]);

  useEffect(() => {
    setHistory(dbService.getUserData(user.id));
  }, [user.id]);

  const handleDeleteData = (dataId: string) => {
    dbService.deleteData(dataId, user.id, user.role === 'admin');
    setHistory(dbService.getUserData(user.id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10 p-10 glass-panel rounded-[3rem] border border-yellow-500/10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-200 p-1">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl font-black gold-gradient">
            {user.name.charAt(0)}
          </div>
        </div>
        <div className="text-center md:text-left flex-grow">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">{user.name}</h2>
          <p className="text-zinc-500 font-mono text-sm mb-4">{user.email}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
             <span className="px-4 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-[10px] font-black text-yellow-500 uppercase tracking-widest">Nível: Milionário</span>
             <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest">Membro desde: {new Date(user.joinedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="text-center">
           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Saldo Digital</p>
           <p className="text-3xl font-black text-white">MZN 0,00</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest flex items-center justify-between">
            Seu Histórico
            <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-zinc-500">{history.length} itens</span>
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {history.length === 0 ? (
              <p className="text-zinc-600 italic text-center py-10">Nenhum dado gerado ainda.</p>
            ) : (
              history.sort((a,b) => b.timestamp - a.timestamp).map(d => (
                <div key={d.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group">
                  <div>
                    <p className="text-xs font-black text-yellow-500 uppercase tracking-widest">{d.type}</p>
                    <p className="text-[10px] text-zinc-500">{new Date(d.timestamp).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteData(d.id)}
                    className="p-2 bg-white/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 text-red-500 rounded-xl"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Configurações de Conta</h3>
          <div className="space-y-4">
             <button className="w-full text-left p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-xs font-bold text-white flex justify-between items-center">
                Alterar Senha
                <span>➡️</span>
             </button>
             <button className="w-full text-left p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-xs font-bold text-white flex justify-between items-center">
                Segurança (2FA)
                <span>🔒</span>
             </button>
             <button 
               onClick={() => setView(AppView.PRIVACY)}
               className="w-full text-left p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-xs font-bold text-white flex justify-between items-center"
             >
                Política de Privacidade & Dados
                <span>📋</span>
             </button>
             <button 
               onClick={() => {
                 if(confirm("Deseja realmente apagar sua conta? Esta ação é IRREVERSÍVEL.")) {
                   dbService.deleteUser(user.id);
                   window.location.reload();
                 }
               }}
               className="w-full text-left p-4 bg-red-600/10 rounded-2xl border border-red-600/20 hover:bg-red-600/20 transition-all text-xs font-black text-red-500"
             >
                ENCERRAR CONTA DEFINITIVAMENTE
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
