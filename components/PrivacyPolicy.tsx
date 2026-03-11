
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="text-center">
        <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4">POLÍTICA DE PRIVACIDADE & DADOS</h2>
        <p className="text-zinc-500">Transparência total na gestão do seu patrimônio digital.</p>
      </header>

      <div className="glass-panel p-10 rounded-[3rem] prose prose-invert max-w-none text-zinc-300 leading-relaxed">
        <h3 className="text-yellow-500 uppercase tracking-widest text-sm font-black mb-4">1. Coleta de Dados</h3>
        <p>A QUETANE IA coleta apenas as informações estritamente necessárias para a prestação de serviços de inteligência artificial: Nome, Email, e as interações realizadas com os modelos de IA (prompts, arquivos carregados e resultados gerados).</p>
        
        <h3 className="text-yellow-500 uppercase tracking-widest text-sm font-black mt-8 mb-4">2. Segurança e Armazenamento</h3>
        <p>Seus dados são armazenados localmente e criptografados. Somente você e o Administrador Mestre do sistema têm permissão para visualizar ou excluir informações do seu perfil. A IA utiliza seus prompts apenas para gerar respostas contextuais, não utilizando seus dados pessoais para treinamento global externo sem consentimento.</p>

        <h3 className="text-yellow-500 uppercase tracking-widest text-sm font-black mt-8 mb-4">3. Direito de Exclusão</h3>
        <p>Em conformidade com as leis de proteção de dados, você possui o "Direito ao Esquecimento". A qualquer momento, através do seu perfil, você pode solicitar a purga completa de todo o seu histórico e encerramento da conta.</p>

        <h3 className="text-yellow-500 uppercase tracking-widest text-sm font-black mt-8 mb-4">4. Modificações</h3>
        <p>A QUETANE IA reserva-se o direito de atualizar esta política para refletir novas funcionalidades de governança de dados. Notificações serão enviadas via console do sistema.</p>
        
        <div className="mt-12 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl italic text-xs">
          Última atualização: Outubro de 2023. Versão do Sistema 2.5.0
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
