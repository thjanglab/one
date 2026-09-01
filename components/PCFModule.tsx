
import React, { useState } from 'react';
import { MOCK_PCF_PRODUCTS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Search, Filter, Leaf, Factory, Truck, Box, BarChart3, Globe, ShieldCheck, Network, Zap, ChevronRight, Download, Share2, Layers, AlertCircle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Sector } from 'recharts';

// --- MOCK DATA FOR VISUALIZATION ---
const getScope3Breakdown = (language: string) => [
    { name: language === 'KO' ? '원자재' : 'Raw Materials', value: 450, color: '#64748b' }, // Slate-500
    { name: language === 'KO' ? '제조 (Tier 1)' : 'Manufacturing (Tier 1)', value: 280, color: '#3b82f6' }, // Blue-500
    { name: language === 'KO' ? '물류' : 'Logistics', value: 120, color: '#f59e0b' }, // Amber-500
    { name: language === 'KO' ? '자체 조립' : 'Assembly (Own)', value: 80, color: '#10b981' }, // Emerald-500
    { name: language === 'KO' ? '폐기 단계' : 'End of Life', value: 22, color: '#ef4444' }, // Red-500
];

const getSupplierNodes = (language: string) => [
    { id: 't2_a', label: language === 'KO' ? 'Steel Corp (2차 협력사)' : 'Steel Corp (Tier 2)', co2: 120, x: 100, y: 100, status: 'Verified' },
    { id: 't2_b', label: language === 'KO' ? 'Chem Works (2차 협력사)' : 'Chem Works (Tier 2)', co2: 85, x: 100, y: 300, status: 'Verified' },
    { id: 't1_a', label: language === 'KO' ? 'Frame Mfg (1차 협력사)' : 'Frame Mfg (Tier 1)', co2: 210, x: 350, y: 150, status: 'Verified' },
    { id: 't1_b', label: language === 'KO' ? 'Paint Sol. (1차 협력사)' : 'Paint Sol. (Tier 1)', co2: 140, x: 350, y: 280, status: 'Pending' },
    { id: 'oem', label: language === 'KO' ? '최종 조립 (자사)' : 'Final Assembly (Me)', co2: 80, x: 600, y: 200, status: 'Self' },
];

const PCFModule: React.FC = () => {
    const { language } = useLanguage();
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'MAP' | 'ANALYTICS' | 'TRUST'>('MAP');
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    const scope3Breakdown = getScope3Breakdown(language);
    const supplierNodes = getSupplierNodes(language);

    // Stored status literals stay English (they are compared against); only the rendered text is localized.
    const nodeStatusLabel = (status: string) => {
        if (language !== 'KO') return status;
        if (status === 'Verified') return '검증 완료';
        if (status === 'Pending') return '검증 대기';
        return '자체 산정';
    };

    const product = selectedProduct 
        ? MOCK_PCF_PRODUCTS.find(p => p.id === selectedProduct) 
        : null;

    // --- RENDER HELPERS ---

    const renderScope3Map = () => (
        <div className="relative h-[400px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
            </div>

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur border border-slate-600 p-3 rounded-lg text-xs text-slate-300 z-10">
                <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> {language === 'KO' ? '데이터 흐름 (EDC)' : 'Data Flow (EDC)'}</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> {language === 'KO' ? 'PCF 검증 완료' : 'Verified PCF'}</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div> {language === 'KO' ? '검증 대기' : 'Pending Verification'}</div>
            </div>

            <svg className="w-full h-full absolute inset-0 pointer-events-none" style={{zIndex: 1}}>
                <defs>
                    <marker id="flowArrow" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
                    </marker>
                    <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                    </linearGradient>
                </defs>
                
                {/* Connections */}
                <path d="M 120 100 C 200 100, 200 150, 330 150" stroke="url(#linkGrad)" strokeWidth="2" fill="none" markerEnd="url(#flowArrow)" />
                <path d="M 120 300 C 200 300, 200 280, 330 280" stroke="url(#linkGrad)" strokeWidth="2" fill="none" markerEnd="url(#flowArrow)" />
                <path d="M 370 150 C 450 150, 450 200, 580 200" stroke="url(#linkGrad)" strokeWidth="4" fill="none" markerEnd="url(#flowArrow)" />
                <path d="M 370 280 C 450 280, 450 200, 580 200" stroke="url(#linkGrad)" strokeWidth="4" fill="none" markerEnd="url(#flowArrow)" />

                {/* Animated Particles (Data Packets) */}
                <circle r="3" fill="#60a5fa">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 120 100 C 200 100, 200 150, 330 150" />
                </circle>
                <circle r="3" fill="#60a5fa">
                    <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M 120 300 C 200 300, 200 280, 330 280" />
                </circle>
                <circle r="4" fill="#60a5fa">
                    <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path="M 370 150 C 450 150, 450 200, 580 200" />
                </circle>
            </svg>

            {/* Nodes */}
            {supplierNodes.map(node => (
                <div 
                    key={node.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left: node.x, top: node.y, zIndex: 10 }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                >
                    <div className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center bg-slate-800 shadow-lg transition-all duration-300 ${
                        hoveredNode === node.id ? 'scale-110 border-white' : 
                        node.status === 'Verified' ? 'border-emerald-500' : 
                        node.status === 'Self' ? 'border-blue-500' : 'border-amber-500'
                    }`}>
                        <Factory className={`w-6 h-6 ${
                            node.status === 'Verified' ? 'text-emerald-400' : 
                            node.status === 'Self' ? 'text-blue-400' : 'text-amber-400'
                        }`} />
                    </div>
                    
                    {/* Floating Label */}
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-32 text-center">
                        <div className="bg-slate-800/90 text-white text-[10px] px-2 py-1 rounded border border-slate-600 font-bold mb-1">
                            {node.label}
                        </div>
                        <div className="text-emerald-400 text-xs font-bold font-mono">
                            {node.co2} kgCO2e
                        </div>
                    </div>

                    {/* Hover Info Card */}
                    {hoveredNode === node.id && (
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 bg-white p-3 rounded-xl shadow-xl z-50 animate-fadeIn text-left">
                            <h4 className="text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-1">{node.label}</h4>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between text-slate-500">
                                    <span>{language === 'KO' ? '산정 방식:' : 'Method:'}</span> <span className="font-medium text-slate-700">ISO 14067</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>{language === 'KO' ? '출처:' : 'Source:'}</span> <span className="font-medium text-slate-700">{language === 'KO' ? '1차 데이터' : 'Primary Data'}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>{language === 'KO' ? '상태:' : 'Status:'}</span> 
                                    <span className={`font-bold ${node.status==='Verified'?'text-emerald-600':'text-amber-600'}`}>{nodeStatusLabel(node.status)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    // --- MAIN VIEW ---

    if (product) {
        return (
            <div className="space-y-6 animate-fadeIn pb-12">
                {/* Navigation & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSelectedProduct(null)}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 bg-white"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded uppercase">PCF ID: {product.id}</span>
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase border border-emerald-200">{language === 'KO' ? '검증 완료' : 'Verified'}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
                            <Share2 className="w-4 h-4" /> {language === 'KO' ? '공유' : 'Share'}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-md">
                            <Download className="w-4 h-4" /> {language === 'KO' ? '보고서' : 'Report'}
                        </button>
                    </div>
                </div>

                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{language === 'KO' ? '총 PCF' : 'Total PCF'}</p>
                            <h3 className="text-3xl font-bold text-slate-900">{product.co2PerUnit}</h3>
                            <p className="text-xs text-slate-400">kgCO2e / unit</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                            <Leaf className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{language === 'KO' ? 'Scope 3 비중' : 'Scope 3 Share'}</p>
                            <h3 className="text-3xl font-bold text-blue-600">78%</h3>
                            <p className="text-xs text-slate-400">{language === 'KO' ? '공급망 상류 배출량' : 'Upstream Emissions'}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <Globe className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{language === 'KO' ? '데이터 품질' : 'Data Quality'}</p>
                            <h3 className="text-3xl font-bold text-slate-900">A+</h3>
                            <p className="text-xs text-slate-400">{language === 'KO' ? '1차 데이터: 92%' : 'Primary Data: 92%'}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-2xl shadow-lg flex items-center justify-between text-white">
                        <div>
                            <p className="text-sm font-medium text-slate-400">{language === 'KO' ? '감축 목표' : 'Reduction Target'}</p>
                            <h3 className="text-3xl font-bold text-emerald-400">-15%</h3>
                            <p className="text-xs text-slate-500">{language === 'KO' ? '2025년까지' : 'by 2025'}</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <div className="flex gap-2 border-b border-slate-200">
                    <button 
                        onClick={() => setViewMode('MAP')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${viewMode === 'MAP' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Network className="w-4 h-4" /> {language === 'KO' ? 'Scope 3 공급망' : 'Scope 3 Supply Chain'}
                    </button>
                    <button 
                        onClick={() => setViewMode('ANALYTICS')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${viewMode === 'ANALYTICS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <BarChart3 className="w-4 h-4" /> {language === 'KO' ? '배출량 분석' : 'Emission Analysis'}
                    </button>
                    <button 
                        onClick={() => setViewMode('TRUST')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${viewMode === 'TRUST' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <ShieldCheck className="w-4 h-4" /> {language === 'KO' ? '신뢰성 및 검증' : 'Trust & Verification'}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-slate-200 border-t-0 p-6 shadow-sm min-h-[450px]">
                    
                    {/* 1. MAP VIEW */}
                    {viewMode === 'MAP' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">{language === 'KO' ? '실시간 탄소 데이터 흐름 (Tier-N → OEM)' : 'Live Carbon Data Flow (Tier-N to OEM)'}</h3>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    {language === 'KO' ? '실시간 EDC 연결 중' : 'Real-time EDC Connection Active'}
                                </span>
                            </div>
                            {renderScope3Map()}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{language === 'KO' ? '공급망 상류 (Tier 1-N)' : 'Upstream (Tier 1-N)'}</h4>
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-bold text-slate-900">732 <span className="text-sm font-normal text-slate-500">kg</span></span>
                                        <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">{language === 'KO' ? '전년 대비 -5%' : '-5% YoY'}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{language === 'KO' ? '핵심 공정 (Gate-to-Gate)' : 'Core Process (Gate-to-Gate)'}</h4>
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-bold text-slate-900">145 <span className="text-sm font-normal text-slate-500">kg</span></span>
                                        <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">{language === 'KO' ? '전년 대비 +2%' : '+2% YoY'}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{language === 'KO' ? '공급망 하류' : 'Downstream'}</h4>
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-bold text-slate-900">80 <span className="text-sm font-normal text-slate-500">kg</span></span>
                                        <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded">{language === 'KO' ? '변동 없음' : 'Stable'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. ANALYTICS VIEW */}
                    {viewMode === 'ANALYTICS' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                            {/* Breakdown Chart */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-6">{language === 'KO' ? '생애주기 단계별 배출량' : 'Emissions by Lifecycle Stage'}</h3>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={scope3Breakdown}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {scope3Breakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'}} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {scope3Breakdown.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs">
                                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                                            <span className="text-slate-600">{item.name}</span>
                                            <span className="font-bold text-slate-900 ml-auto">{Math.round((item.value / 952)*100)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hotspot Analysis */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-6">{language === 'KO' ? '부품별 핫스팟 분석' : 'Component Hotspot Analysis'}</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: language === 'KO' ? '배터리 셀 모듈' : 'Battery Cell Module', impact: 45, trend: 'down' },
                                        { name: language === 'KO' ? '강판 차체 프레임' : 'Steel Body Frame', impact: 25, trend: 'stable' },
                                        { name: language === 'KO' ? '알루미늄 휠' : 'Aluminum Wheels', impact: 15, trend: 'up' },
                                        { name: language === 'KO' ? '전장 PCB' : 'Electronics PCB', impact: 10, trend: 'down' },
                                        { name: language === 'KO' ? '내장 플라스틱' : 'Interior Plastic', impact: 5, trend: 'stable' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-32 text-xs font-bold text-slate-600 truncate">{item.name}</div>
                                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${item.impact > 30 ? 'bg-red-500' : item.impact > 15 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                    style={{ width: `${item.impact}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-12 text-right text-xs font-bold text-slate-900">{item.impact}%</div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">{language === 'KO' ? 'AI 최적화 제안' : 'AI Optimization Suggestion'}</h4>
                                    <p className="text-xs text-blue-600 leading-relaxed">
                                        {language === 'KO' ? (
                                            <>"알루미늄 휠" 공급사를 <strong>GreenAlu Corp</strong>(Tier 2)로 전환하면 최신 PCF 인증서를 기준으로 Scope 3 총 배출량을 <strong>4.2%</strong> 줄일 수 있습니다.</>
                                        ) : (
                                            <>Switching "Aluminum Wheels" supplier to <strong>GreenAlu Corp</strong> (Tier 2) could reduce total Scope 3 emissions by <strong>4.2%</strong> based on their latest PCF certificate.</>
                                        )}
                                    </p>
                                    <button className="mt-3 text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700">
                                        {language === 'KO' ? '변경 시뮬레이션' : 'Simulate Change'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. TRUST VIEW */}
                    {viewMode === 'TRUST' && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="font-bold text-slate-800 mb-4">{language === 'KO' ? '데이터 검증 체인' : 'Data Verification Chain'}</h3>
                            
                            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 py-2">
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow"></div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900">PC-2024-X99 {language === 'KO' ? '(최종 제품)' : '(Final Product)'}</h4>
                                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">{language === 'KO' ? '검증 완료' : 'Verified'}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">{language === 'KO' ? '자체 선언한 값을 제3자 감사를 통해 검증했습니다.' : 'Self-declared value verified by 3rd party audit.'}</p>
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-[10px] text-slate-600">
                                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                                {language === 'KO' ? '서명:' : 'Sig:'} 0x7f...a1
                                            </div>
                                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-[10px] text-slate-600">
                                                <Globe className="w-3 h-3 text-blue-500" />
                                                {language === 'KO' ? '발급기관:' : 'Issuer:'} Korea Cert
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow"></div>
                                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900">Tier 1: {language === 'KO' ? '프레임 모듈' : 'Frame Module'}</h4>
                                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">EDC {language === 'KO' ? '수신' : 'Received'}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">{language === 'KO' ? '커넥터를 통해 데이터를 수신했으며, Verifiable Credential을 DAPS로 검증했습니다.' : 'Data received via connector. Verifiable Credential checked against DAPS.'}</p>
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200 text-[10px] text-slate-600">
                                                <Network className="w-3 h-3 text-blue-500" />
                                                {language === 'KO' ? '커넥터:' : 'Connector:'} edc-frame-kr
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow"></div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 opacity-75">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900">Tier 2: {language === 'KO' ? '원자재 강판' : 'Raw Steel'}</h4>
                                            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">{language === 'KO' ? '레거시 API' : 'Legacy API'}</span>
                                        </div>
                                        <p className="text-xs text-slate-500">{language === 'KO' ? '레거시 API로 수집된 데이터로, 암호학적 증명이 첨부되어 있지 않습니다.' : 'Data ingested via legacy API. No cryptographic proof attached.'}</p>
                                        <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600">
                                            <AlertCircle className="w-3 h-3" />
                                            {language === 'KO' ? '검증 권장' : 'Verification Recommended'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- DASHBOARD VIEW (List) ---
    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Leaf className="w-8 h-8 text-emerald-500" />
                    {language === 'KO' ? 'PCF 트래커' : 'PCF Tracker'}
                </h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
                        {language === 'KO' ? '보고서 내보내기' : 'Export Report'}
                    </button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-md flex items-center gap-2">
                        <Box className="w-4 h-4" /> {language === 'KO' ? '제품 추가' : 'Add Product'}
                    </button>
                </div>
            </div>

            {/* Dashboard KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium mb-1">{language === 'KO' ? '총 탄소발자국' : 'Total Carbon Footprint'}</p>
                        <h2 className="text-4xl font-bold mb-2">14,250 <span className="text-lg text-slate-500">tons</span></h2>
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded w-fit">
                            <Leaf className="w-3 h-3" /> {language === 'KO' ? '전년 대비 -12%' : '-12% vs Last Year'}
                        </div>
                    </div>
                    <Leaf className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-800 z-0" />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium mb-1">{language === 'KO' ? 'Scope 3 커버리지' : 'Scope 3 Coverage'}</p>
                    <h2 className="text-4xl font-bold text-slate-900 mb-2">82%</h2>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[82%]"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{language === 'KO' ? '45개 공급사로부터 수집된 데이터' : 'Data collected from 45 suppliers'}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium mb-1">{language === 'KO' ? '평균 데이터 신뢰도' : 'Avg. Data Reliability'}</p>
                    <h2 className="text-4xl font-bold text-slate-900 mb-2">A-</h2>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        {language === 'KO' ? '1차 데이터 비중 기준' : 'Based on Primary Data Share'}
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900">{language === 'KO' ? '추적 중인 제품' : 'Tracked Products'}</h3>
                    <div className="relative w-64">
                        <input type="text" placeholder={language === 'KO' ? '제품 검색...' : 'Search product...'} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">{language === 'KO' ? '제품명' : 'Product Name'}</th>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">CO2eq (kg)</th>
                            <th className="px-6 py-4">{language === 'KO' ? '추적성' : 'Traceability'}</th>
                            <th className="px-6 py-4">{language === 'KO' ? '상태' : 'Status'}</th>
                            <th className="px-6 py-4 text-right">{language === 'KO' ? '작업' : 'Action'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {MOCK_PCF_PRODUCTS.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-bold text-slate-900">{p.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.id}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">{p.co2PerUnit}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[8px] text-white">T1</div>
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white">T2</div>
                                            <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[8px] text-slate-600">+3</div>
                                        </div>
                                        <span className="text-xs text-slate-500">{language === 'KO' ? '5개 티어' : '5 Tiers'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                        {language === 'KO' ? '실시간' : 'Live'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => setSelectedProduct(p.id)}
                                        className="text-emerald-600 font-bold text-xs hover:text-emerald-700 flex items-center justify-end gap-1"
                                    >
                                        {language === 'KO' ? '상세 보기' : 'View Detail'} <ChevronRight className="w-3 h-3" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PCFModule;
