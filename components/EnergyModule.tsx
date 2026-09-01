
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Zap, Leaf, TrendingDown, Factory, Sun, Battery, AlertTriangle, CheckCircle2, ArrowRight, BarChart3, Settings, Play, Power, Thermometer, Sparkles, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, ComposedChart, Line } from 'recharts';

const EnergyModule: React.FC = () => {
    const { t, language } = useLanguage();
    const [autoPilot, setAutoPilot] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ZONES' | 'AI_OPTIMIZER'>('OVERVIEW');

    // Enhanced Mock Data: Actual vs Baseline vs Optimized (AI)
    const energyData = [
        { time: '00:00', actual: 320, baseline: 350, optimized: 290, solar: 0, cost: 80 },
        { time: '04:00', actual: 280, baseline: 340, optimized: 250, solar: 0, cost: 70 },
        { time: '08:00', actual: 650, baseline: 800, optimized: 580, solar: 120, cost: 150 },
        { time: '12:00', actual: 850, baseline: 950, optimized: 720, solar: 450, cost: 220 },
        { time: '16:00', actual: 780, baseline: 880, optimized: 690, solar: 300, cost: 200 },
        { time: '20:00', actual: 550, baseline: 600, optimized: 480, solar: 0, cost: 120 },
        { time: '23:59', actual: 380, baseline: 400, optimized: 340, solar: 0, cost: 90 },
    ];

    // Calculated Totals for Comparison
    const totalActual = energyData.reduce((acc, cur) => acc + cur.actual, 0);
    const totalOptimized = energyData.reduce((acc, cur) => acc + cur.optimized, 0);
    const savings = totalActual - totalOptimized;
    const savingsPercent = ((savings / totalActual) * 100).toFixed(1);

    // Mock Data: Zone Efficiency
    const zones = [
        { id: 1, name: 'Assembly Line A', status: 'Optimal', efficiency: 92, consumption: 450, temp: 24 },
        { id: 2, name: 'Welding Shop', status: 'Warning', efficiency: 78, consumption: 820, temp: 28 },
        { id: 3, name: 'Paint Booth', status: 'Optimal', efficiency: 88, consumption: 320, temp: 23 },
        { id: 4, name: 'Warehouse', status: 'Saving', efficiency: 96, consumption: 150, temp: 21 },
    ];

    const handleAutoPilotToggle = () => {
        if (!autoPilot) {
            setIsOptimizing(true);
            setTimeout(() => {
                setIsOptimizing(false);
                setAutoPilot(true);
            }, 1200); // Simulate AI calculation time
        } else {
            setAutoPilot(false);
        }
    };

    const ComparisonBar = ({ label, before, after, unit, color }: any) => (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>{label}</span>
                <span className={after < before ? 'text-emerald-500' : 'text-slate-700'}>
                    {after < before ? `-${Math.round((1 - after/before)*100)}%` : '0%'}
                </span>
            </div>
            <div className="flex items-center gap-2 h-6">
                {/* Before Bar */}
                <div className="flex-1 h-full bg-slate-100 rounded-l-md relative overflow-hidden group">
                    <div className="absolute inset-y-0 right-2 flex items-center justify-end text-[10px] text-slate-400 font-mono z-10">
                        {before.toLocaleString()} {unit}
                    </div>
                    <div className="h-full bg-slate-300 w-full opacity-30"></div>
                </div>
                
                <ArrowRight className="w-4 h-4 text-slate-300" />

                {/* After Bar */}
                <div className="flex-1 h-full bg-slate-50 rounded-r-md relative overflow-hidden">
                    <div className={`absolute inset-y-0 left-0 h-full ${color} transition-all duration-1000 ease-out`} style={{ width: autoPilot ? '100%' : '0%' }}></div>
                    <div className={`absolute inset-y-0 right-2 flex items-center justify-end text-[10px] font-bold font-mono z-10 ${autoPilot ? 'text-white' : 'text-slate-300'}`}>
                        {after.toLocaleString()} {unit}
                    </div>
                </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 px-1">
                <span>Before (Manual)</span>
                <span>After (AI Auto)</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
                        {t('en_title')}
                    </h1>
                    <p className="text-slate-500 mt-2">{t('en_subtitle')}</p>
                </div>
                
                <div className={`flex items-center gap-4 p-2 rounded-xl border shadow-sm transition-all duration-500 ${autoPilot ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                    <div className="pl-2">
                        <span className={`text-sm font-bold block ${autoPilot ? 'text-emerald-700' : 'text-slate-600'}`}>{t('en_autopilot')}</span>
                        {autoPilot && <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Optimizing</span>}
                    </div>
                    <button 
                        onClick={handleAutoPilotToggle}
                        disabled={isOptimizing}
                        className={`relative inline-flex h-10 w-16 items-center rounded-full transition-colors focus:outline-none ${autoPilot ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                        <span className={`inline-block h-8 w-8 transform rounded-full bg-white shadow transition duration-300 ease-in-out ${autoPilot ? 'translate-x-7' : 'translate-x-1'} flex items-center justify-center`}>
                            {isOptimizing ? <Settings className="w-5 h-5 text-slate-400 animate-spin" /> : <Power className={`w-5 h-5 ${autoPilot ? 'text-emerald-500' : 'text-slate-400'}`} />}
                        </span>
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{t('en_kpi_usage')}</p>
                            <h3 className="text-3xl font-bold text-slate-900 transition-all duration-500">
                                {autoPilot ? '715' : '850'} <span className="text-sm font-normal text-slate-400">kW</span>
                            </h3>
                        </div>
                        <div className={`p-2 rounded-lg transition-colors ${autoPilot ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <Power className="w-6 h-6" />
                        </div>
                    </div>
                    <div className={`mt-4 flex items-center gap-2 text-xs font-medium ${autoPilot ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <TrendingDown className="w-4 h-4" />
                        {autoPilot ? '15.8% Optimized' : '12% vs Baseline'}
                    </div>
                    {/* Background Decor */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{t('en_kpi_carbon')}</p>
                            <h3 className="text-3xl font-bold text-slate-900 transition-all duration-500">
                                {autoPilot ? '120' : '142'} <span className="text-sm font-normal text-slate-400">kgCO2</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <Leaf className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600">
                        <TrendingDown className="w-4 h-4" />
                        {autoPilot ? '15.5% Reduced' : '8% Reduction'}
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50"></div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{t('en_kpi_solar')}</p>
                            <h3 className="text-3xl font-bold text-slate-900">45 <span className="text-sm font-normal text-slate-400">%</span></h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Sun className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-400">
                        Self-Sufficiency Rate
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg text-white relative overflow-hidden transition-all duration-500 ${autoPilot ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-slate-900 to-slate-800'}`}>
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className={`text-sm font-medium mb-1 ${autoPilot ? 'text-emerald-100' : 'text-slate-300'}`}>{t('en_kpi_savings')}</p>
                            <h3 className="text-3xl font-bold text-white transition-all duration-500">
                                ${autoPilot ? '3,850' : '3,240'}
                            </h3>
                        </div>
                        <div className="p-2 bg-white/10 rounded-lg text-white">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                    </div>
                    <div className={`mt-4 text-xs ${autoPilot ? 'text-emerald-100' : 'text-slate-300'}`}>
                        {autoPilot ? 'AI Optimization Active' : 'Estimated Monthly Savings'}
                    </div>
                    {autoPilot && <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles className="w-20 h-20 text-white animate-pulse" /></div>}
                </div>
            </div>

            {/* AI Optimization Impact Panel (Visible when AutoPilot is ON) */}
            {autoPilot && (
                <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 animate-slideDown shadow-inner">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-600" />
                                {language === 'KO' ? 'AI 최적화 적용 분석 (Before vs After)' : 'AI Optimization Impact Analysis (Before vs After)'}
                            </h3>
                            <p className="text-sm text-emerald-700">
                                {language === 'KO' 
                                    ? 'AI 오토파일럿이 실시간으로 설비를 제어하여 불필요한 에너지 낭비를 줄이고 탄소 배출을 최소화하고 있습니다.' 
                                    : 'AI Autopilot controls equipment in real-time to reduce unnecessary energy waste and minimize carbon emissions.'}
                            </p>
                        </div>
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                            <ComparisonBar 
                                label={language === 'KO' ? '에너지 사용량' : 'Energy Usage'} 
                                before={totalActual} 
                                after={totalOptimized} 
                                unit="kWh" 
                                color="bg-blue-500" 
                            />
                            <ComparisonBar 
                                label={language === 'KO' ? '예상 비용' : 'Est. Cost'} 
                                before={totalActual * 0.15} 
                                after={totalOptimized * 0.15} 
                                unit="$" 
                                color="bg-amber-500" 
                            />
                            <ComparisonBar 
                                label={language === 'KO' ? '탄소 배출' : 'Carbon Emission'} 
                                before={totalActual * 0.4} 
                                after={totalOptimized * 0.4} 
                                unit="kg" 
                                color="bg-emerald-500" 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Main Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">{t('en_chart_title')}</h3>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-900"></div> Actual</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300"></div> AI Baseline</span>
                                {autoPilot && <span className="flex items-center gap-1 animate-fadeIn"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Optimized (AI)</span>}
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400"></div> Solar</span>
                            </div>
                        </div>
                        <div className="h-80 w-full relative">
                            {isOptimizing && (
                                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm rounded-lg">
                                    <div className="flex flex-col items-center gap-2">
                                        <Settings className="w-8 h-8 text-emerald-500 animate-spin" />
                                        <span className="text-sm font-bold text-emerald-700">Calibrating AI Models...</span>
                                    </div>
                                </div>
                            )}
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={energyData}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}} />
                                    
                                    {/* Standard Layers */}
                                    <Line type="monotone" dataKey="baseline" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                    <Bar dataKey="solar" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={20} />
                                    
                                    {/* Dynamic Layers based on AutoPilot */}
                                    {autoPilot ? (
                                        <>
                                            {/* Faded Actual */}
                                            <Area type="monotone" dataKey="actual" stroke="#94a3b8" strokeWidth={1} fill="transparent" strokeDasharray="3 3" />
                                            {/* Highlighted AI Optimized */}
                                            <Area type="monotone" dataKey="optimized" stroke="#10b981" strokeWidth={3} fill="url(#colorOptimized)" />
                                        </>
                                    ) : (
                                        <Area type="monotone" dataKey="actual" stroke="#0f172a" strokeWidth={2} fill="url(#colorActual)" />
                                    )}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Zone Breakdown */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">{t('en_zone_title')}</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Zone Name</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Temperature</th>
                                        <th className="px-4 py-3">Consumption</th>
                                        <th className="px-4 py-3 rounded-r-lg">Efficiency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {zones.map((zone) => (
                                        <tr key={zone.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-4 font-bold text-slate-700">{zone.name}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold transition-colors duration-500 ${
                                                    autoPilot ? 'bg-emerald-100 text-emerald-700' : 
                                                    (zone.status === 'Optimal' ? 'bg-emerald-100 text-emerald-700' :
                                                    zone.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700')
                                                }`}>
                                                    {autoPilot ? 'AI Controlled' : zone.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600 flex items-center gap-1">
                                                <Thermometer className="w-4 h-4 text-slate-400" />
                                                {autoPilot && zone.status === 'Warning' ? zone.temp - 2 : zone.temp}°C
                                            </td>
                                            <td className="px-4 py-4 font-mono text-slate-600">
                                                {autoPilot ? Math.round(zone.consumption * 0.85) : zone.consumption} kW
                                                {autoPilot && <span className="text-[10px] text-emerald-500 ml-1">(-15%)</span>}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                                (autoPilot ? zone.efficiency + 5 : zone.efficiency) > 90 ? 'bg-emerald-500' : 
                                                                (autoPilot ? zone.efficiency + 5 : zone.efficiency) > 80 ? 'bg-blue-500' : 'bg-amber-500'
                                                            }`} 
                                                            style={{width: `${Math.min(100, autoPilot ? zone.efficiency + 8 : zone.efficiency)}%`}}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{Math.min(100, autoPilot ? zone.efficiency + 8 : zone.efficiency)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right: AI Actions & Battery */}
                <div className="space-y-6">
                    {/* Energy Mix Ring Chart (Visual Only) */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white text-center">
                        <h3 className="font-bold mb-6 flex items-center justify-center gap-2">
                            <Factory className="w-5 h-5 text-blue-400" />
                            Current Energy Mix
                        </h3>
                        <div className="relative w-48 h-48 mx-auto mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="70" stroke="#1e293b" strokeWidth="20" fill="none" />
                                <circle cx="50%" cy="50%" r="70" stroke="#3b82f6" strokeWidth="20" fill="none" strokeDasharray="440" strokeDashoffset={autoPilot ? 250 : 220} className="transition-all duration-1000" />
                                <circle cx="50%" cy="50%" r="70" stroke="#fbbf24" strokeWidth="20" fill="none" strokeDasharray="440" strokeDashoffset="380" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold transition-all duration-500">{autoPilot ? '48%' : '55%'}</span>
                                <span className="text-xs text-slate-400">Grid Power</span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Grid
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-amber-400 rounded-full"></div> Solar
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> ESS
                            </div>
                        </div>
                    </div>

                    {/* AI Recommendations */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-purple-600" />
                            {t('en_ai_actions')}
                        </h3>
                        
                        <div className="space-y-3">
                            <div className={`p-3 rounded-xl border transition-all duration-500 ${autoPilot ? 'bg-slate-50 border-slate-200 opacity-50' : 'bg-amber-50 border-amber-100'}`}>
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        {autoPilot ? <CheckCircle2 className="w-5 h-5 text-slate-400" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Peak Load Predicted</h4>
                                        <p className="text-xs text-slate-600 mt-1">Grid demand expected to spike at 14:00. Recommendation: Discharge ESS.</p>
                                        {!autoPilot && (
                                            <button className="mt-2 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded hover:bg-amber-600 transition-colors">
                                                Activate Peak Shaving
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={`p-3 rounded-xl border transition-all duration-500 ${autoPilot ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        <Battery className={`w-5 h-5 ${autoPilot ? 'text-emerald-500' : 'text-blue-500'}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">ESS Optimization</h4>
                                        <p className="text-xs text-slate-600 mt-1">
                                            {autoPilot ? 'AI is managing charge/discharge cycles automatically based on real-time pricing.' : 'Charge battery now (Low Tariff) to prep for evening peak.'}
                                        </p>
                                        {autoPilot && <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 animate-pulse"><Sparkles className="w-3 h-3" /> AI Active</span>}
                                    </div>
                                </div>
                            </div>

                            <div className={`p-3 rounded-xl border transition-all duration-500 ${autoPilot ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        <Thermometer className={`w-5 h-5 ${autoPilot ? 'text-emerald-500' : 'text-slate-500'}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">HVAC Adjustment</h4>
                                        <p className="text-xs text-slate-600 mt-1">
                                            {autoPilot ? 'Zone temperatures optimized for occupancy and weather.' : 'Increase setpoint in Welding Shop by 1°C to save 4% energy.'}
                                        </p>
                                        {autoPilot && <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Optimized</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergyModule;
