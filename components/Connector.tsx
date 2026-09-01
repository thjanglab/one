
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import { Activity, Server, Database, Share2, ArrowUpRight, ArrowDownLeft, Zap, FileCheck, X, FileText, Globe, Cloud, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Connector: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Real-time Simulation States
  const [trafficData, setTrafficData] = useState([
    { name: '00:00', rx: 240, tx: 400 },
    { name: '04:00', rx: 139, tx: 300 },
    { name: '08:00', rx: 980, tx: 1200 },
    { name: '12:00', rx: 390, tx: 800 },
    { name: '16:00', rx: 480, tx: 950 },
    { name: '20:00', rx: 380, tx: 500 },
    { name: '23:59', rx: 250, tx: 430 },
  ]);
  
  const [logs, setLogs] = useState([
      { id: 1, type: 'tx', msg: 'Uploaded to consumer-kr-05', time: '10:45:22' },
      { id: 2, type: 'rx', msg: 'Downloaded from provider-eu-01', time: '10:44:15' },
      { id: 3, type: 'tx', msg: 'Uploaded to consumer-kr-05', time: '10:43:55' },
      { id: 4, type: 'rx', msg: 'Downloaded from provider-us-02', time: '10:42:10' },
      { id: 5, type: 'tx', msg: 'Uploaded to consumer-jp-03', time: '10:41:05' },
  ]);

  const [activeDetail, setActiveDetail] = useState<'VOLUME' | 'CONTRACTS' | 'LOGS' | null>(null);

  // Simulate Live Data Updates
  useEffect(() => {
      const interval = setInterval(() => {
          // 1. Update Traffic Chart
          setTrafficData(prev => {
              const newRx = Math.floor(Math.random() * 500) + 200;
              const newTx = Math.floor(Math.random() * 800) + 400;
              const now = new Date();
              const timeLabel = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
              
              const newData = [...prev.slice(1), { name: timeLabel, rx: newRx, tx: newTx }];
              return newData;
          });

          // 2. Add New Log randomly
          if (Math.random() > 0.6) {
              const types = ['rx', 'tx'];
              const type = types[Math.floor(Math.random() * types.length)];
              const msg = type === 'rx' ? 'Downloaded from provider-eu-01' : 'Uploaded to consumer-kr-05';
              const now = new Date();
              const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
              
              setLogs(prev => [{ id: Date.now(), type, msg, time }, ...prev.slice(0, 9)]);
          }

      }, 2000);

      return () => clearInterval(interval);
  }, []);

  // Detail Modal Content
  const renderDetailContent = () => {
      if (!activeDetail) return null;

      if (activeDetail === 'VOLUME') {
          return (
              <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                          <p className="text-xs text-slate-500 uppercase font-bold">{language === 'KO' ? '총 수신량' : 'Total Inbound'}</p>
                          <p className="text-2xl font-bold text-blue-600">210 TB</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                          <p className="text-xs text-slate-500 uppercase font-bold">{language === 'KO' ? '총 송신량' : 'Total Outbound'}</p>
                          <p className="text-2xl font-bold text-emerald-600">240 TB</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                          <p className="text-xs text-slate-500 uppercase font-bold">{language === 'KO' ? '최대 처리량' : 'Peak Throughput'}</p>
                          <p className="text-2xl font-bold text-purple-600">1.2 GB/s</p>
                      </div>
                  </div>
                  <div className="h-64 w-full border border-slate-100 rounded-xl p-2">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={trafficData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="rx" fill="#3b82f6" name={language === 'KO' ? '수신' : 'Inbound'} />
                              <Bar dataKey="tx" fill="#10b981" name={language === 'KO' ? '송신' : 'Outbound'} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 text-center">{language === 'KO' ? '최근 30일간 모든 EDC 커넥터에서 집계한 이력 데이터입니다.' : 'Historical data aggregated from all EDC connectors in the last 30 days.'}</p>
              </div>
          );
      }

      if (activeDetail === 'CONTRACTS') {
          return (
              <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center">
                      <div>
                          <h4 className="font-bold text-blue-900">{language === 'KO' ? '활성 계약' : 'Active Agreements'}</h4>
                          <p className="text-xs text-blue-700">{language === 'KO' ? '현재 12건의 계약을 통해 데이터가 전송되고 있습니다' : '12 Contracts currently streaming data'}</p>
                      </div>
                      <FileCheck className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-medium">
                              <tr>
                                  <th className="px-4 py-2">{language === 'KO' ? '계약 ID' : 'Contract ID'}</th>
                                  <th className="px-4 py-2">{language === 'KO' ? '파트너' : 'Partner'}</th>
                                  <th className="px-4 py-2">{language === 'KO' ? '정책' : 'Policy'}</th>
                                  <th className="px-4 py-2">{language === 'KO' ? '상태' : 'Status'}</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              <tr>
                                  <td className="px-4 py-2 font-mono text-xs">agr:8821...</td>
                                  <td className="px-4 py-2">Hyundai Motor</td>
                                  <td className="px-4 py-2">{language === 'KO' ? '사용 기간: 30일' : 'Usage: 30 days'}</td>
                                  <td className="px-4 py-2 text-emerald-600 font-bold">{language === 'KO' ? '활성' : 'Active'}</td>
                              </tr>
                              <tr>
                                  <td className="px-4 py-2 font-mono text-xs">agr:9912...</td>
                                  <td className="px-4 py-2">LG Energy Sol</td>
                                  <td className="px-4 py-2">{language === 'KO' ? '사용 목적: AI' : 'Purpose: AI'}</td>
                                  <td className="px-4 py-2 text-emerald-600 font-bold">{language === 'KO' ? '활성' : 'Active'}</td>
                              </tr>
                              <tr>
                                  <td className="px-4 py-2 font-mono text-xs">agr:1102...</td>
                                  <td className="px-4 py-2">Samsung Elec</td>
                                  <td className="px-4 py-2">{language === 'KO' ? '지역: KR' : 'Region: KR'}</td>
                                  <td className="px-4 py-2 text-amber-600 font-bold">{language === 'KO' ? '만료 예정' : 'Expiring'}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          );
      }

      if (activeDetail === 'LOGS') {
          return (
              <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-sm font-bold text-slate-700">{language === 'KO' ? '총 이벤트 (24시간)' : 'Total Events (24h)'}</span>
                      <span className="text-sm font-mono font-bold">14,205</span>
                  </div>
                  <div className="h-96 overflow-y-auto border border-slate-200 rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300">
                      {logs.map((log, i) => (
                          <div key={i} className="mb-2 border-b border-slate-800 pb-2 last:border-0">
                              <span className="text-slate-500 mr-2">[{log.time}]</span>
                              <span className={log.type === 'rx' ? 'text-blue-400' : 'text-emerald-400'}>
                                  {log.type.toUpperCase()}
                              </span>
                              <span className="ml-2">{log.msg}</span>
                          </div>
                      ))}
                      <div className="text-slate-600 italic">... older logs archived</div>
                  </div>
              </div>
          );
      }
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      <h1 className="text-3xl font-bold text-slate-900">{t('nav_connector')}</h1>

      {/* --- DETAIL MODAL --- */}
      {activeDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleUp">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                          {activeDetail === 'VOLUME' && <Database className="w-5 h-5 text-blue-600" />}
                          {activeDetail === 'CONTRACTS' && <FileCheck className="w-5 h-5 text-purple-600" />}
                          {activeDetail === 'LOGS' && <Activity className="w-5 h-5 text-slate-600" />}
                          {activeDetail === 'VOLUME' ? (language === 'KO' ? '데이터 처리량 분석' : 'Data Throughput Analytics') : 
                           activeDetail === 'CONTRACTS' ? (language === 'KO' ? '활성 계약 현황' : 'Active Contract Agreements') : (language === 'KO' ? '커넥터 이벤트 로그' : 'Connector Event Logs')}
                      </h3>
                      <button onClick={() => setActiveDetail(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-6">
                      {renderDetailContent()}
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                      <button onClick={() => setActiveDetail(null)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
                          {language === 'KO' ? '리포트 닫기' : 'Close Report'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Status Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg gap-4">
        <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center relative">
                 <Activity className="w-8 h-8 text-blue-400" />
                 <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
             </div>
             <div>
                 <h2 className="text-xl font-bold">{language === 'KO' ? 'EDC 커넥터 활성' : 'EDC Connector Active'}</h2>
                 <p className="text-slate-400 text-sm">
                    {language === 'KO' ? '호스트:' : 'Host:'} <span className="font-mono text-slate-300">edc-provider-kr-001</span> • v0.5.2
                 </p>
             </div>
        </div>
        <div className="flex items-center gap-8 text-right">
             <div>
                 <p className="text-xs text-slate-400 uppercase tracking-wide">{language === 'KO' ? '가동 시간' : 'Uptime'}</p>
                 <p className="text-2xl font-mono font-bold text-emerald-400">99.98%</p>
             </div>
             <div className="h-10 w-px bg-slate-700"></div>
             <div>
                 <p className="text-xs text-slate-400 uppercase tracking-wide">DSP {language === 'KO' ? '프로토콜' : 'Protocol'}</p>
                 <p className="text-xl font-mono font-bold text-blue-400">v2.1</p>
             </div>
        </div>
      </div>

      {/* KPI Grid - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveDetail('VOLUME')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
          >
              <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {language === 'KO' ? '전체' : 'Total'}
                  </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">450 TB</h3>
              <p className="text-xs text-slate-500 font-medium uppercase mt-1">{t('db_total_vol')}</p>
          </div>

          <div 
            onClick={() => setActiveDetail('CONTRACTS')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group"
          >
              <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <FileCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      {language === 'KO' ? '활성' : 'Active'}
                  </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
              <p className="text-xs text-slate-500 font-medium uppercase mt-1">{t('db_active_contracts')}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-50 rounded-lg">
                      <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> 5%
                  </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">8.2M</h3>
              <p className="text-xs text-slate-500 font-medium uppercase mt-1">{t('db_api_calls')}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                      <Server className="w-5 h-5 text-emerald-600" />
                  </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">12ms</h3>
              <p className="text-xs text-slate-500 font-medium uppercase mt-1">{language === 'KO' ? '평균 응답 지연' : 'Avg. Latency'}</p>
          </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        {t('db_data_transfer')}
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase animate-pulse">{language === 'KO' ? '실시간' : 'Live'}</span>
                    </h3>
                    <p className="text-sm text-slate-500">{language === 'KO' ? '실시간 수신(RX) / 송신(TX)' : 'Real-time Inbound (RX) / Outbound (TX)'}</p>
                 </div>
                 <div className="flex gap-2">
                     <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                         <div className="w-2 h-2 rounded-full bg-blue-500"></div> RX
                     </span>
                     <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div> TX
                     </span>
                 </div>
             </div>
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                        <defs>
                            <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}
                            itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                            labelStyle={{fontSize: '11px', color: '#64748b', marginBottom: '8px'}}
                        />
                        <Area type="monotone" dataKey="rx" stackId="1" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRx)" name={language === 'KO' ? '수신 (MB)' : 'Inbound (MB)'} animationDuration={500} />
                        <Area type="monotone" dataKey="tx" stackId="1" stroke="#10b981" strokeWidth={2} fill="url(#colorTx)" name={language === 'KO' ? '송신 (MB)' : 'Outbound (MB)'} animationDuration={500} />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* Transfer Logs */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{language === 'KO' ? '전송 로그' : 'Transfer Logs'}</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[320px]">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors animate-fadeIn">
                        <div className={`mt-1 p-1.5 rounded-full ${log.type === 'rx' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {log.type === 'rx' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="text-xs font-bold text-slate-700">{language === 'KO' ? '자산 #' : 'Asset #'}{log.id.toString().substr(-4)}</span>
                                <span className="text-[10px] text-slate-400">{log.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">
                                {log.msg}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => setActiveDetail('LOGS')}
                className="w-full mt-4 py-2 text-xs font-bold text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
                {language === 'KO' ? '전체 로그 보기' : 'View All Logs'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Connector;
