
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

const data = [
  { name: 'Seg', wealth: 4000, operations: 2400 },
  { name: 'Ter', wealth: 3000, operations: 1398 },
  { name: 'Qua', wealth: 2000, operations: 9800 },
  { name: 'Qui', wealth: 2780, operations: 3908 },
  { name: 'Sex', wealth: 1890, operations: 4800 },
  { name: 'Sab', wealth: 2390, operations: 3800 },
  { name: 'Dom', wealth: 3490, operations: 4300 },
];

const assetData = [
  { name: 'Ações IA', performance: 94 },
  { name: 'Cripto Ativos', performance: 78 },
  { name: 'Patentes Neurais', performance: 62 },
  { name: 'Imóveis Digitais', performance: 88 },
  { name: 'Infra SaaS', performance: 71 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; color: string }> = ({ title, value, trend, color }) => (
  <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-500 shadow-lg">
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 blur-3xl ${color}`} />
    <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
    <div className="text-3xl font-black text-white mb-1 tracking-tighter">{value}</div>
    <div className="text-[10px] font-bold text-green-400 flex items-center">
      <span className="mr-1">↑</span> {trend} <span className="text-zinc-600 ml-1">esta semana</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2 text-white uppercase">Centro de Controle Soberano</h2>
          <p className="text-zinc-500 font-medium max-w-xl">Bem-vindo à interface de comando da QUETANE IA. Gerenciando ativos globais, operações neurais e trajetórias de riqueza em escala industrial.</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="px-4 py-2 glass-panel rounded-full text-[10px] font-black text-yellow-500 animate-pulse border border-yellow-500/20 tracking-widest uppercase">
            Nível de Acesso: Mestre Imperial
          </div>
          <div className="text-[10px] font-mono text-zinc-600">SISTEMAS_ONLINE: 100% | LATÊNCIA: 4ms</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Potencial Líquido" value="R$ 12.4M" trend="+12.5%" color="bg-yellow-500" />
        <StatCard title="Forjas Ativas" value="08" trend="+2" color="bg-blue-500" />
        <StatCard title="Sinais de Mercado" value="1.2k" trend="+450" color="bg-purple-500" />
        <StatCard title="Eficiência IA" value="99.8%" trend="+0.2%" color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] h-[400px] border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Trajetória de Acúmulo de Capital</h3>
            <div className="flex space-x-2">
               <span className="w-3 h-3 rounded-full bg-yellow-500" />
               <span className="text-[10px] text-zinc-500 font-bold">MÉTRICA DE RIQUEZA</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
              <XAxis dataKey="name" stroke="#333" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#555'}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px', fontSize: '12px' }}
                itemStyle={{ color: '#FFD700' }}
                cursor={{ stroke: '#FFD700', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Line 
                type="monotone" 
                dataKey="wealth" 
                stroke="#FFD700" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#FFD700', stroke: '#000', strokeWidth: 2 }} 
                activeDot={{ r: 8, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] h-[400px] border border-white/5">
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">Intensidade Operacional</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
              <XAxis dataKey="name" stroke="#333" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#555'}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px' }}
              />
              <Bar dataKey="operations" fill="#1a1a1a" radius={[10, 10, 0, 0]} stroke="#333">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 2 ? '#FFD700' : '#222'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="glass-panel p-8 rounded-[2.5rem] h-[450px] border border-yellow-500/10 bg-gradient-to-b from-transparent to-yellow-500/[0.02]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Desempenho de Ativos Virtuais</h3>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Status de Performance por Categoria de Ativo</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-yellow-500">82.4%</span>
              <p className="text-[10px] text-zinc-600 font-bold uppercase">Média de Performance</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="75%">
            <BarChart data={assetData} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#FFD700" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                width={120}
                tick={{fill: '#888', fontWeight: 'bold'}}
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: '#000', border: '1px solid #FFD70033', borderRadius: '12px' }}
              />
              <Bar dataKey="performance" radius={[0, 20, 20, 0]} barSize={32}>
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FFD700' : '#B8860B'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Diretrizes Milionárias em Execução</h3>
          <button className="text-[10px] font-black text-yellow-500 hover:text-white transition-all uppercase tracking-widest border border-yellow-500/20 px-4 py-2 rounded-full">Ver Todos os Protocolos</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-yellow-500/30 transition-all cursor-pointer group">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-black flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {['🚀', '⚖️', '⛓️', '🏦'][i-1]}
                </div>
                <div>
                  <h4 className="font-black text-white text-lg tracking-tight">
                    {['SaaS IA de Infraestrutura', 'Arbitragem Algorítmica', 'Smart Contracts Imobiliários', 'Gestão de Ativos Neurais'][i-1]}
                  </h4>
                  <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">
                    ROI Projetado: <span className="text-emerald-400">+{ [450, 220, 180, 510][i-1] }%</span> | Protocolo: QTN-{i}0X
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
