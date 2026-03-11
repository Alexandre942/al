
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { User, StoredData } from '../types';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [allData, setAllData] = useState<StoredData[]>([]);

  useEffect(() => {
    setUsers(dbService.getUsers());
    setAllData(dbService.getAllStoredData());
  }, []);

  const handleDeleteUser = (userId: string) => {
    if (confirm("Tem certeza que deseja apagar este usuário e todos os seus dados?")) {
      dbService.deleteUser(userId);
      setUsers(dbService.getUsers());
      setAllData(dbService.getAllStoredData());
    }
  };

  const handleDeleteData = (dataId: string) => {
    dbService.deleteData(dataId, '', true);
    setAllData(dbService.getAllStoredData());
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-4xl font-black text-white italic tracking-tighter">SOVEREIGN ADMIN PANEL</h2>
        <p className="text-zinc-500">Controle total sobre o ecossistema Quetane IA.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Usuários do Sistema ({users.length})</h3>
          <div className="space-y-4">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-black text-xs">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{u.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">{u.email}</p>
                  </div>
                </div>
                {u.role !== 'admin' && (
                  <button 
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 flex flex-col">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Atividade Recente ({allData.length})</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {allData.sort((a,b) => b.timestamp - a.timestamp).map(d => {
              const user = users.find(u => u.id === d.userId);
              return (
                <div key={d.id} className="flex items-start justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-yellow-500 uppercase tracking-widest">{d.type}</p>
                    <p className="text-[10px] text-zinc-400 italic">Por: {user?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-zinc-600 font-mono">{new Date(d.timestamp).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteData(d.id)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-zinc-500 rounded-xl transition-all"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-[3rem] border border-red-500/10 bg-red-500/[0.02]">
        <h3 className="text-xl font-black text-red-500 mb-4 uppercase tracking-widest">Protocolos de Segurança</h3>
        <p className="text-zinc-500 text-sm mb-6">Modifique parâmetros globais da IA ou realize manutenção de banco de dados.</p>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10">RESETAR SISTEMA DE CACHE</button>
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10">MODO MANUTENÇÃO: OFF</button>
          <button className="px-6 py-3 bg-red-600/20 border border-red-600/30 rounded-xl text-xs font-black text-red-500 hover:bg-red-600/30">PURGA TOTAL DE DADOS INVATIVOS</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
