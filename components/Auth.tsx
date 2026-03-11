
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../services/dbService';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Função para validar o formato do email
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Função para decodificar JWT sem bibliotecas externas
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Erro ao decodificar token", e);
      return null;
    }
  };

  useEffect(() => {
    // Inicializar Google Identity Services
    const initializeGoogle = () => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: "73204780517-57321680517.apps.googleusercontent.com", // Cliente ID genérico para demonstração
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const googleBtn = document.getElementById('google-signin-btn');
        if (googleBtn) {
          (window as any).google.accounts.id.renderButton(googleBtn, {
            theme: 'filled_black',
            size: 'large',
            width: googleBtn.offsetWidth,
            text: 'signin_with',
            shape: 'pill'
          });
        }
      } else {
        setTimeout(initializeGoogle, 500);
      }
    };

    initializeGoogle();
  }, [isLogin]);

  const handleGoogleResponse = (response: any) => {
    const payload = decodeJwt(response.credential);
    if (payload) {
      const googleUser: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        role: payload.email.includes('admin') ? 'admin' : 'user',
        joinedAt: Date.now(),
        balance: 0
      };
      
      dbService.saveUser(googleUser);
      dbService.setCurrentUser(googleUser);
      onLogin(googleUser);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de email antes de processar
    if (!validateEmail(email)) {
      alert("Por favor, insira um endereço de email válido.");
      return;
    }

    if (isLogin) {
      const users = dbService.getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        dbService.setCurrentUser(user);
        onLogin(user);
      } else if (email === 'admin@quetane.ai') {
        const admin: User = {
          id: 'admin-id',
          name: 'Chief Admin',
          email: 'admin@quetane.ai',
          role: 'admin',
          joinedAt: Date.now()
        };
        dbService.saveUser(admin);
        dbService.setCurrentUser(admin);
        onLogin(admin);
      } else {
        alert("Usuário não encontrado.");
      }
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: email.includes('admin') ? 'admin' : 'user',
        joinedAt: Date.now(),
        balance: 0
      };
      dbService.saveUser(newUser);
      dbService.setCurrentUser(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      
      <div className="w-full max-w-md glass-panel p-10 rounded-[3rem] border border-yellow-500/20 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black gold-gradient tracking-tighter mb-2">QUETANE IA</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] font-bold">O Império Começa Aqui</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                placeholder="Ex: João Milionário"
              />
            </div>
          )}
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Email Corporativo</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-yellow-500/50 outline-none transition-all"
              placeholder="seu@imperio.com"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Chave de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-yellow-500/50 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full py-5 rounded-2xl bg-yellow-500 text-black font-black text-lg hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            {isLogin ? 'ENTRAR NO SISTEMA' : 'FUNDAR CONTA'}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f0f0f] px-4 text-zinc-500 font-bold tracking-widest">Acesso Direto</span>
            </div>
          </div>
          
          <div id="google-signin-btn" className="w-full overflow-hidden flex justify-center"></div>
          
          <p className="text-center text-zinc-500 text-xs">
            {isLogin ? 'Novo no império?' : 'Já possui acesso?'} 
            <button onClick={() => setIsLogin(!isLogin)} className="text-yellow-500 ml-2 font-bold underline">
              {isLogin ? 'Cadastre-se' : 'Faça Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
