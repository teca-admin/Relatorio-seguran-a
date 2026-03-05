
import React, { useState, useEffect } from 'react';
import { ReportData, ChannelData, Occurrence } from '../types';
import { supabase } from '../supabase';
import { Activity, Clock, ShieldAlert, Plane, ClipboardCheck, Info, Map, CheckCircle2, AlertCircle, Scan, AlertTriangle, X, ExternalLink, LayoutGrid, Copy, Radio, RefreshCw, Zap, Network, Signal, UserCheck, Shield, UserPlus } from 'lucide-react';

interface Props {
  data: ReportData;
  activeShiftId: string | null;
}

const LeaderDashboard: React.FC<Props> = ({ data, activeShiftId }) => {
  const [selectedChannel, setSelectedChannel] = useState<{ name: string; occurrences: Occurrence[] } | null>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [networkLogs, setNetworkLogs] = useState<{ id: string, msg: string, time: string }[]>([]);
  const hubUrl = `${window.location.origin}${window.location.pathname}?role=hub`;

  useEffect(() => {
    const logs = [
      { id: '1', msg: 'REDE ESTABILIZADA: TERMINAL BRAVO ONLINE', time: '18:05' },
      { id: '2', msg: 'DADOS RECEBIDOS: POSTO ALFA INTEGRADO', time: '18:12' },
      { id: '3', msg: 'VARREDURA VALIDADA: CANAL FOX OK', time: '18:24' }
    ];
    setNetworkLogs(logs);
  }, []);

  const copyHubLink = () => {
    navigator.clipboard.writeText(hubUrl);
    alert('URL do Hub copiada para a área de transferência.');
  };

  return (
    <div className="h-full w-full p-6 grid grid-cols-12 grid-rows-6 gap-6 overflow-hidden bg-[#0f1117] relative animate-in fade-in duration-700">
      
      {/* Top Navigation Bar */}
      <div className="col-span-12 row-span-1 bg-[#1a1c26] border border-slate-700 p-5 flex items-center justify-between shadow-xl rounded-lg border-l-4 border-l-blue-600">
         <div className="flex gap-12 items-center">
            <div className="border-r border-slate-700 pr-12">
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Supervisor em Comando</label>
              <div className="text-xl font-black text-white uppercase tracking-tight leading-none">{data.liderNome || 'AGUARDANDO...'}</div>
            </div>

            <div className="flex items-center gap-6 bg-black/40 border border-slate-800 p-2 rounded-lg px-4">
               <div className="flex items-center gap-4 border-r border-slate-700 pr-6">
                  <div className="relative">
                     <div className="absolute inset-0 bg-emerald-500 blur-md opacity-20 animate-pulse"></div>
                     <Network className="w-6 h-6 text-emerald-500 relative" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Status HQ</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Fluxo de Dados Ativo</span>
                  </div>
               </div>
               
               <button 
                 onClick={() => setShowShiftModal(true)}
                 className="flex items-center gap-3 px-8 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 bg-blue-600 hover:bg-blue-500 text-white"
               >
                 <UserPlus className="w-4 h-4" />
                 Gerenciar Turno
               </button>

               <div className="h-8 w-px bg-slate-700 mx-2"></div>

               <div className="flex items-center gap-3">
                  <a href={hubUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg text-slate-400 hover:text-white transition-all border border-slate-700" title="Abrir Hub">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={copyHubLink} className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg text-slate-400 hover:text-white transition-all border border-slate-700" title="Copiar Link">
                    <Copy className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="block text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1.5">Turno Operacional</span>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Grupo {data.turno} | {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 shadow-inner">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
         </div>
      </div>

      <div className="col-span-9 row-span-5 grid grid-cols-4 gap-6">
        <ChannelCard title="Bravo" data={data.canais.bravo} onOpenOccurrences={() => setSelectedChannel({ name: 'Bravo', occurrences: data.canais.bravo.ocorrenciasList })} />
        <ChannelCard title="Alfa" data={data.canais.alfa} onOpenOccurrences={() => setSelectedChannel({ name: 'Alfa', occurrences: data.canais.alfa.ocorrenciasList })} />
        <ChannelCard title="Fox" data={data.canais.fox} onOpenOccurrences={() => setSelectedChannel({ name: 'Fox', occurrences: data.canais.fox.ocorrenciasList })} />
        <ChannelCard title="Charlie" data={data.canais.charlie} onOpenOccurrences={() => setSelectedChannel({ name: 'Charlie', occurrences: data.canais.charlie.ocorrenciasList })} />
      </div>

      <div className="col-span-3 row-span-5 flex flex-col gap-6">
        <section className="flex-grow bg-[#1a1c26] border border-slate-700 shadow-xl overflow-hidden flex flex-col rounded-lg">
          <div className="bg-slate-700/20 p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tráfego de Dados</h3>
            <Signal className="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>
          <div className="flex-grow p-4 space-y-4 overflow-y-auto font-mono text-[9px]">
            {networkLogs.map(log => (
               <div key={log.id} className="flex gap-4 border-l-2 border-slate-800 pl-4 pb-1 group transition-all">
                 <span className="text-slate-600 font-bold">{log.time}</span>
                 <span className="text-slate-400 group-hover:text-blue-400 transition-colors uppercase">{log.msg}</span>
               </div>
            ))}
            <div className="flex gap-4 border-l-2 border-emerald-500/30 pl-4 pb-1 animate-pulse">
              <span className="text-slate-600 font-bold">REDE</span>
              <span className="text-emerald-500 font-black uppercase">Sincronizando Pacotes AVSEC...</span>
            </div>
          </div>
        </section>

        <section className="bg-[#1a1c26] border border-slate-700 shadow-xl rounded-lg">
          <div className="bg-slate-700/20 p-4 border-b border-slate-700 flex justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inspeção Técnica</h3>
            <ClipboardCheck className="w-4 h-4 text-slate-500" />
          </div>
          <div className="p-5 space-y-3">
            <SweepItem label="Terminal Bravo" status={data.canais.bravo.inspecoes.length > 0 ? 'OK' : 'PENDENTE'} />
            <SweepItem label="Terminal Charlie" status={data.canais.charlie.inspecoes.length > 0 ? 'OK' : 'PENDENTE'} />
            <SweepItem label="Terminal Alfa" status={data.canais.alfa.inspecoes.length > 0 ? 'OK' : 'PENDENTE'} />
            <SweepItem label="Terminal Fox" status={data.canais.fox.inspecoes.length > 0 ? 'OK' : 'PENDENTE'} />
          </div>
        </section>

        <section className="h-40 bg-blue-600 p-6 flex flex-col justify-between overflow-hidden shadow-xl rounded-lg relative">
          <div className="absolute top-0 right-0 p-4 opacity-20">
             <Shield className="w-20 h-20 text-white" />
          </div>
          <div className="relative z-10">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-white/70">Capacidade Operacional</h3>
             <div className="text-3xl font-black text-white mt-1">98.2%</div>
          </div>
          <div className="relative z-10 text-[9px] font-black uppercase text-white tracking-widest flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
             Perímetro Seguro
          </div>
        </section>
      </div>
    </div>
  );
};

const ChannelCard = ({ title, data, onOpenOccurrences }: any) => {
  const statusThemes: any = { 
    Pendente: 'border-slate-700 text-slate-600 bg-slate-900/50', 
    Preenchendo: 'border-blue-500/50 text-blue-400 bg-blue-500/10 animate-pulse', 
    Finalizado: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' 
  };
  
  return (
    <div className={`bg-[#1a1c26] border rounded-lg flex flex-col transition-all shadow-2xl overflow-hidden ${data.status === 'Finalizado' ? 'border-emerald-500/50' : 'border-slate-700'}`}>
      <div className="p-4 bg-slate-700/10 border-b border-slate-700 flex items-center justify-between">
        <h4 className="text-[12px] font-black uppercase tracking-widest text-white">Posto {title}</h4>
        <div className={`text-[8px] font-black uppercase px-2 py-1 rounded border ${statusThemes[data.status]}`}>
          {data.status === 'Pendente' ? 'Offline' : data.status === 'Preenchendo' ? 'Atualizando' : 'Sincronizado'}
        </div>
      </div>
      <div className="p-5 flex-grow space-y-6">
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Agentes Logados ({data.agentes.length})</label>
          <div className="bg-black/40 border border-slate-800 p-3 min-h-[80px] space-y-2 rounded-lg">
            {data.agentes.map((a: any) => (
              <div key={a.id} className="flex justify-between text-[10px] border-b border-slate-800/50 pb-1.5 last:border-0 last:pb-0">
                <span className="font-bold text-slate-300 uppercase truncate pr-2">{a.nome.split(' ')[0]}</span>
                <span className="font-mono text-emerald-500 text-[9px]">{a.horario.split(' ')[0]}</span>
              </div>
            ))}
            {data.agentes.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center py-4 opacity-20">
                 <UserCheck className="w-5 h-5 text-slate-600 mb-1" />
                 <span className="text-[8px] font-black uppercase">Vazio</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Alerta de Segurança</label>
          <div className={`bg-black/40 border border-slate-800 px-4 py-3 text-[10px] font-black flex items-center gap-3 rounded-lg ${data.condicaoPosto === 'Crítico' ? 'text-red-500 border-red-500/30' : 'text-emerald-500'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${data.condicaoPosto === 'Crítico' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            {data.condicaoPosto.toUpperCase()}
          </div>
        </div>
        
        {data.inspecoes.length > 0 && (
          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
             <CheckCircle2 className="w-3.5 h-3.5" />
             <span className="text-[9px] font-black uppercase tracking-widest">Varredura OK</span>
          </div>
        )}
      </div>
    </div>
  );
};

const SweepItem = ({ label, status }: any) => (
  <div className="flex items-center justify-between bg-black/30 p-3 border border-slate-800 rounded-lg group hover:border-slate-600 transition-all">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <div className={`px-3 py-1 text-[9px] font-black tracking-widest rounded border ${status === 'OK' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-600 bg-slate-800 border-slate-700'}`}>
      {status}
    </div>
  </div>
);

const FlightRow = ({ flight, time, status }: any) => (
  <div className="flex justify-between items-center text-[10px] border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
    <span className="font-bold text-slate-200 tracking-widest">{flight}</span>
    <span className="font-mono text-slate-500">{time}</span>
    <span className={`font-black text-[8px] tracking-widest ${status === 'EMBARCADO' ? 'text-emerald-600' : 'text-amber-600'}`}>{status}</span>
  </div>
);

export default LeaderDashboard;
