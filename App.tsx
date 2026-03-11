
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StrategyForge from './components/StrategyForge';
import AdvisorLive from './components/AdvisorLive';
import OmniChat from './components/OmniChat';
import DevForge from './components/DevForge';
import MusicStudio from './components/MusicStudio';
import MozFinance from './components/MozFinance';
import MozNews from './components/MozNews';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import { AppView, User } from './types';
import { dbService } from './services/dbService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = dbService.getCurrentUser();
    if (session) setUser(session);
  }, []);

  const handleLogout = () => {
    dbService.setCurrentUser(null);
    setUser(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const renderView = () => {
    if (!user) return null;

    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.STRATEGY:
        return <StrategyForge />;
      case AppView.ADVISOR:
        return <AdvisorLive />;
      case AppView.CHAT:
        return <OmniChat />;
      case AppView.DEVELOPMENT:
        return <DevForge />;
      case AppView.MUSIC:
        return <MusicStudio />;
      case AppView.FINANCE:
        return <MozFinance />;
      case AppView.NEWS:
        return <MozNews />;
      case AppView.PROFILE:
        return <UserProfile user={user} onUpdate={setUser} setView={setCurrentView} />;
      case AppView.ADMIN:
        return user.role === 'admin' ? <AdminDashboard /> : <Dashboard />;
      case AppView.PRIVACY:
        return <PrivacyPolicy />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="text-6xl">🚧</div>
              <h2 className="text-2xl font-black text-white">Módulo em Construção</h2>
              <p className="text-zinc-500">A QUETANE IA está forjando este componente de alto valor.</p>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="ml-64 flex-grow p-12 min-h-screen relative">
        <div className="max-w-7xl mx-auto pb-24">
          {renderView()}
        </div>
        
        {/* Decorative background elements */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[150px] -mr-64 -mt-64 pointer-events-none" />
        <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] -ml-48 -mb-48 pointer-events-none" />
      </main>
    </div>
  );
};

export default App;
