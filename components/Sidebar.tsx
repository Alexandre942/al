
import React from 'react';
import { AppView, User } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Centro de Controle', icon: '⚡' },
    { id: AppView.FINANCE, label: 'Finanças Moçambique', icon: '🇲🇿' },
    { id: AppView.NEWS, label: 'Notícias Globais', icon: '📰' },
    { id: AppView.STRATEGY, label: 'Plano de Riqueza', icon: '💎' },
    { id: AppView.CHAT, label: 'Omni Chat IA', icon: '💬' },
    { id: AppView.DEVELOPMENT, label: 'Forja de Apps & Sites', icon: '💻' },
    { id: AppView.MUSIC, label: 'Estúdio de Ritmos', icon: '🎹' },
    { id: AppView.ADVISOR, label: 'Consultor de Voz', icon: '🎙️' },
  ];

  if (user.role === 'admin') {
    menuItems.push({ id: AppView.ADMIN, label: 'Painel Admin', icon: '👑' });
  }

  return (
    <div className="w-64 h-screen glass-panel flex flex-col p-4 fixed left-0 top-0 z-50">
      <div className="mb-10 px-2 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
        <h1 className="text-2xl font-black gold-gradient tracking-tighter">QUETANE IA</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold">O Império Digital</p>
      </div>
      
      <nav className="space-y-1 flex-grow overflow-y-auto pr-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.1)]' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold text-xs uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
        <button 
          onClick={() => setView(AppView.PROFILE)}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${currentView === AppView.PROFILE ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
          <div className="relative">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-200" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-white truncate w-24">{user.name.toUpperCase()}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{user.role === 'admin' ? 'Fundador' : 'Milionário'}</span>
          </div>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-[10px] text-red-500 hover:text-red-400 font-black uppercase tracking-widest transition-all"
        >
          <span>🚪 SAIR DO SISTEMA</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
