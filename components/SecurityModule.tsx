
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, Server, Database, FileKey, Network, CheckCircle2, XCircle, Fingerprint, Globe, Key, AlertTriangle, ArrowRight, LayoutGrid, Unlock, Layers, FileText, Activity, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SecurityModule: React.FC = () => {
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'COMPARISON' | 'BLINDNESS' | 'METADATA' | 'LAYERS'>('COMPARISON');
    
    // Animation States
    const [packetStep, setPacketStep] = useState(0);
    const [layerStep, setLayerStep] = useState(1);

    // Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setPacketStep(prev => (prev + 1) % 100);
        }, 50);
        
        const layerInterval = setInterval(() => {
            setLayerStep(prev => (prev % 3) + 1);
        }, 3000);

        return () => {
            clearInterval(interval);
            clearInterval(layerInterval);
        };
    }, []);

    // --- VISUALIZATION 1: ARCHITECTURE COMPARISON ---
    const renderComparison = () => (
        <div className="space-y-12 animate-fadeIn">
            {/* Header - Updated to match Operator Blindness style */}
            <div className="text-center space-y-6">
                <h2 className="text-3xl font-extrabold text-slate-900">
                    {language === 'KO' ? '데이터스페이스는 왜 안전한가?' : 'Why is DataSpace Secure?'}
                </h2>
                <p className="text-slate-500 max-w-4xl mx-auto text-xl font-bold leading-relaxed break-keep">
                    {language === 'KO' 
                        ? '"기존 플랫폼은 데이터를 중앙 서버에 저장하여 해킹 위험(Honey Pot)이 높습니다. 반면, 데이터스페이스는 저장하지 않는 아키텍처를 통해 데이터가 소유자의 통제 하에 P2P로 직접 전송되므로 물리적으로 탈취가 불가능합니다."'
                        : '"Legacy platforms store data centrally, creating Honey Pot risks. DataSpace adopts a store-nothing architecture where data is transferred P2P under owner control, making physical theft impossible."'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT: Centralized (Legacy) */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative group">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                        <h3 className="font-bold text-red-800 flex items-center gap-2">
                            <Server className="w-5 h-5" /> Legacy Platform
                        </h3>
                        <span className="text-xs font-bold bg-red-200 text-red-800 px-2 py-1 rounded">High Risk</span>
                    </div>
                    
                    <div className="p-8 h-80 relative bg-slate-50 overflow-hidden">
                        {/* Central Server (Honey Pot) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                            <div className="w-24 h-24 bg-white border-4 border-red-300 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)] z-10 relative">
                                <Database className="w-8 h-8 text-red-500" />
                                <span className="text-[10px] font-bold text-slate-500 mt-1">Central DB</span>
                                
                                {/* Hacker Icon Animation */}
                                <div className="absolute -top-8 -right-8 animate-bounce delay-700">
                                    <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                        <Unlock className="w-3 h-3 text-red-400" /> Hacked!
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full animate-pulse">
                                Data Ownership Loss
                            </div>
                        </div>

                        {/* Nodes Sending Data TO Center */}
                        {[0, 1, 2, 3].map(i => {
                            const angle = (i * 90) * (Math.PI / 180);
                            const x = 50 + 40 * Math.cos(angle);
                            const y = 50 + 40 * Math.sin(angle);
                            return (
                                <div key={i} className="absolute w-12 h-12 bg-white border border-slate-300 rounded-lg flex items-center justify-center shadow-sm" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                                    <Server className="w-5 h-5 text-slate-400" />
                                    {/* Particle Moving to Center */}
                                    <div 
                                        className="absolute w-3 h-3 bg-red-400 rounded-full"
                                        style={{
                                            top: '50%', left: '50%',
                                            transform: `translate(-50%, -50%)`,
                                            offsetPath: `path('M 0 0 L ${50-x}vw ${50-y}vh')` 
                                        }}
                                    >
                                        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                                    </div>
                                </div>
                            )
                        })}
                        
                        {/* Connecting Lines (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line x1="50%" y1="10%" x2="50%" y2="35%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                            <line x1="50%" y1="90%" x2="50%" y2="65%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                            <line x1="10%" y1="50%" x2="35%" y2="50%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                            <line x1="90%" y1="50%" x2="65%" y2="50%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                        </svg>
                    </div>

                    <div className="p-6 bg-white border-t border-slate-100">
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-slate-600">
                                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                                {language === 'KO' ? '데이터가 중앙 서버에 저장됨 (Honey Pot 위험)' : 'Data stored centrally (Honey Pot Risk)'}
                            </li>
                            <li className="flex gap-3 text-sm text-slate-600">
                                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                                {language === 'KO' ? '플랫폼 운영자가 모든 데이터를 볼 수 있음' : 'Platform operator can access all data'}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* RIGHT: DataSpace (Decentralized) */}
                <div className="bg-white rounded-3xl border-2 border-blue-500 shadow-2xl overflow-hidden relative group transform scale-105 z-10">
                    <div className="bg-blue-600 p-4 border-b border-blue-700 flex justify-between items-center text-white">
                        <h3 className="font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5" /> DataSpace
                        </h3>
                        <span className="text-xs font-bold bg-white text-blue-600 px-2 py-1 rounded">Sovereign & Safe</span>
                    </div>
                    
                    <div className="p-8 h-80 relative bg-slate-900 overflow-hidden">
                        {/* Background Grid */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" 
                            style={{backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                        </div>

                        {/* Nodes */}
                        {[0, 1, 2].map((i) => {
                            // Triangle layout
                            const x = i === 0 ? 50 : i === 1 ? 20 : 80;
                            const y = i === 0 ? 20 : 70;
                            return (
                                <div key={i} className="absolute w-16 h-16 bg-slate-800 border-2 border-blue-500 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] z-20" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                                    <Database className="w-6 h-6 text-blue-400" />
                                    <div className="absolute -bottom-6 text-[10px] text-blue-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                                        Connector
                                    </div>
                                </div>
                            )
                        })}

                        {/* P2P Connections (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="p2pGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                            {/* 0 -> 1 */}
                            <path d="M 50 20 L 20 70" stroke="url(#p2pGradient)" strokeWidth="0.5" />
                            {/* 0 -> 2 */}
                            <path d="M 50 20 L 80 70" stroke="url(#p2pGradient)" strokeWidth="0.5" />
                            {/* 1 <-> 2 */}
                            <path d="M 20 70 L 80 70" stroke="url(#p2pGradient)" strokeWidth="0.5" />

                            {/* Moving Packets (Encrypted) */}
                            <circle r="1" fill="#60a5fa">
                                <animateMotion dur="2s" repeatCount="indefinite" path="M 50 20 L 20 70" />
                            </circle>
                            <circle r="1" fill="#60a5fa">
                                <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M 20 70 L 80 70" />
                            </circle>
                        </svg>

                        {/* Lock Icon in Center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <Lock className="w-6 h-6 text-emerald-400 mb-1" />
                            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">End-to-End Encrypted</span>
                        </div>
                    </div>

                    <div className="p-6 bg-white border-t border-slate-100">
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-slate-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                {language === 'KO' ? '데이터는 소유자의 서버에만 존재 (중앙 저장 X)' : 'Data stays with the owner (No Central Storage)'}
                            </li>
                            <li className="flex gap-3 text-sm text-slate-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                {language === 'KO' ? 'P2P 암호화 전송으로 중간 탈취 불가능' : 'P2P Encrypted transfer preventing interception'}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- VISUALIZATION 2: OPERATOR BLINDNESS ---
    const renderBlindness = () => (
        <div className="space-y-12 animate-fadeIn">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-extrabold text-slate-900">
                    {language === 'KO' ? '운영기관은 데이터를 볼 수 있는가?' : 'Can the Operator see the data?'}
                </h2>
                <p className="text-slate-500 max-w-3xl mx-auto text-lg">
                    {language === 'KO' 
                        ? '아니오. 운영기관(플랫폼)은 메타데이터(카탈로그)만 관리하며, 실제 데이터는 "암호화된 터널"을 통해 당사자 간에 직접 전송됩니다. 이를 "Operator Blindness(운영자 눈가림)" 원칙이라 합니다.'
                        : 'No. The operator only manages metadata. Actual data is transmitted directly between parties via an "Encrypted Tunnel". This is the "Operator Blindness" principle.'}
                </p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-slate-800 min-h-[500px]">
                {/* Layers Labels */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-slate-700 border border-slate-500 rounded"></div>
                        <span className="text-xs text-slate-400 font-bold uppercase">Control Plane (Metadata)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-900/50 border border-blue-500 rounded"></div>
                        <span className="text-xs text-blue-400 font-bold uppercase">Data Plane (Actual Data)</span>
                    </div>
                </div>

                {/* 1. Control Plane (Upper Layer) */}
                <div className="absolute top-0 left-0 w-full h-[40%] border-b border-slate-700/50 bg-slate-800/30 z-10 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 border-2 border-dashed border-slate-600 rounded-full flex flex-col items-center justify-center bg-slate-900 shadow-2xl">
                        <EyeOff className="w-10 h-10 text-slate-400 mb-2" />
                        <span className="text-xs font-bold text-slate-500 uppercase">Platform Operator</span>
                        <div className="mt-1 px-2 py-0.5 bg-red-900/50 text-red-400 text-[9px] rounded border border-red-900">
                            Access Denied
                        </div>
                    </div>
                    
                    {/* Metadata Flow lines (Dotted) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 20 100 Q 50 50 50 80" stroke="#64748b" strokeWidth="0.5" strokeDasharray="1 1" fill="none" />
                        <path d="M 80 100 Q 50 50 50 80" stroke="#64748b" strokeWidth="0.5" strokeDasharray="1 1" fill="none" />
                    </svg>
                    {/* Sits at the foot of the band, between the two dotted
                        curves, so it does not land on the operator circle. */}
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-medium tracking-wide text-slate-500 pointer-events-none">
                        Metadata Only
                    </span>
                </div>

                {/* 2. Data Plane (Lower Layer) */}
                <div className="absolute bottom-0 left-0 w-full h-[60%] flex items-center justify-between px-6 lg:px-16">
                    
                    {/* Provider Node */}
                    <div className="flex flex-col items-center z-20 shrink-0">
                        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)] border-2 border-white">
                            <Database className="w-8 h-8 text-white" />
                        </div>
                        <span className="mt-4 text-white font-bold bg-blue-900/80 px-3 py-1 rounded-full">Provider (A)</span>
                    </div>

                    {/* Encrypted Tunnel Visual */}
                    {/* The badge is a row of its own rather than an overlay: when
                        the tunnel narrows it used to wrap onto the packets. */}
                    <div className="flex-1 min-w-0 mx-4 lg:mx-8 h-24 bg-slate-800/50 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col justify-center gap-2 py-2">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#1e293b_10px,#1e293b_20px)] opacity-30"></div>
                        <div className="relative z-10 mx-auto max-w-full bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold border border-emerald-500/50 flex items-center gap-1 whitespace-nowrap overflow-hidden">
                            <Lock className="w-3 h-3 shrink-0" /> <span className="truncate">TLS 1.3 / mTLS Tunnel</span>
                        </div>

                        {/* Animated Packets */}
                        <div className="w-full relative h-10">
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 w-12 h-8 bg-blue-500 rounded-md shadow-[0_0_15px_#3b82f6] flex items-center justify-center transition-all duration-75"
                                style={{ left: `${packetStep}%` }}
                            >
                                <span className="text-[8px] font-bold text-white">DATA</span>
                            </div>
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 w-12 h-8 bg-blue-500 rounded-md shadow-[0_0_15px_#3b82f6] flex items-center justify-center transition-all duration-75"
                                style={{ left: `${(packetStep + 50) % 100}%` }}
                            >
                                <span className="text-[8px] font-bold text-white">FILE</span>
                            </div>
                        </div>
                    </div>

                    {/* Consumer Node */}
                    <div className="flex flex-col items-center z-20 shrink-0">
                        <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] border-2 border-white">
                            <Server className="w-8 h-8 text-white" />
                        </div>
                        <span className="mt-4 text-white font-bold bg-emerald-900/80 px-3 py-1 rounded-full">Consumer (B)</span>
                    </div>
                </div>
            </div>

            {/* Q&A Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        {language === 'KO' ? '만약 운영자가 데이터를 보고 싶다면?' : 'What if the operator wants to see the data?'}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {language === 'KO' 
                            ? '기술적으로 불가능합니다. 데이터 전송 시 사용되는 암호화 키는 Provider와 Consumer 간에만 교환되며, 운영자 서버에는 저장되지 않습니다.'
                            : 'Technically impossible. Encryption keys are exchanged only between Provider and Consumer. They are never stored on the operator server.'}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-500" />
                        {language === 'KO' ? '데이터 주권(Sovereignty)은 어떻게 보장되나요?' : 'How is Data Sovereignty guaranteed?'}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {language === 'KO' 
                            ? '데이터 소유자는 "사용 기간", "목적", "재배포 금지" 등의 정책(Policy)을 데이터에 부착합니다. EDC 커넥터는 이 정책을 기술적으로 강제하여, 조건 위반 시 접근을 차단합니다.'
                            : 'Data owners attach policies (e.g., duration, purpose, no redistribution). The EDC connector technically enforces these, blocking access if conditions are met.'}
                    </p>
                </div>
            </div>
        </div>
    );

    // --- VISUALIZATION 3: METADATA SEPARATION (New Tab) ---
    const renderMetadata = () => (
        <div className="space-y-12 animate-fadeIn">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-extrabold text-slate-900">
                    {language === 'KO' ? '메타데이터 분리 (Metadata Separation)' : 'Metadata vs Data Separation'}
                </h2>
                <p className="text-slate-500 max-w-3xl mx-auto text-lg">
                    {language === 'KO' 
                        ? '운영자는 데이터의 "목록(Catalog)"만 볼 수 있으며, "내용(Content)"은 볼 수 없습니다.'
                        : 'Operators can only see the "Catalog" of data, not the "Content".'}
                </p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-slate-800 min-h-[500px]">
                {/* SVG Connections Layer (Global across full container) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <marker id="greyArrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                            <path d="M0,0 L0,4 L4,2 z" fill="#64748b" />
                        </marker>
                    </defs>

                    {/* Metadata Flow: Operator (Top Center) <-> Provider (Bottom Left) */}
                    <path 
                        d="M 50 20 L 20 75" 
                        stroke="#64748b" 
                        strokeWidth="0.5" 
                        strokeDasharray="1 1" 
                        fill="none" 
                    />
                    <circle r="1" fill="#94a3b8">
                        <animateMotion 
                            dur="2s" 
                            repeatCount="indefinite" 
                            path="M 50 20 L 20 75" 
                        />
                    </circle>
                    <circle r="1" fill="#94a3b8">
                        <animateMotion 
                            dur="2s" 
                            begin="1s"
                            repeatCount="indefinite" 
                            path="M 20 75 L 50 20" 
                        />
                    </circle>

                    {/* Metadata Flow: Operator (Top Center) <-> Consumer (Bottom Right) */}
                    <path 
                        d="M 50 20 L 80 75" 
                        stroke="#64748b" 
                        strokeWidth="0.5" 
                        strokeDasharray="1 1" 
                        fill="none" 
                    />
                    <circle r="1" fill="#94a3b8">
                        <animateMotion 
                            dur="2s" 
                            repeatCount="indefinite" 
                            path="M 50 20 L 80 75" 
                        />
                    </circle>
                    <circle r="1" fill="#94a3b8">
                        <animateMotion 
                            dur="2s" 
                            begin="1s"
                            repeatCount="indefinite" 
                            path="M 80 75 L 50 20" 
                        />
                    </circle>
                </svg>

                {/* Visual Layers Labels */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-slate-700 border border-slate-500 rounded"></div>
                        <span className="text-xs text-slate-400 font-bold uppercase">Control Plane (Metadata)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-900/50 border border-blue-500 rounded"></div>
                        <span className="text-xs text-blue-400 font-bold uppercase">Data Plane (Content)</span>
                    </div>
                </div>

                {/* --- Control Plane Node --- */}
                {/* Operator (Top Center) - 20% Top */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center">
                    <div className="w-28 h-28 border-2 border-dashed border-slate-500 rounded-full flex flex-col items-center justify-center bg-slate-800 shadow-xl">
                        {/* Red Eye Icon for Operator Blindness */}
                        <EyeOff className="w-10 h-10 text-red-500 mb-2" />
                        <span className="text-xs font-bold text-slate-400 uppercase">Operator</span>
                    </div>
                    <div className="mt-2 bg-slate-900/80 px-3 py-1 rounded text-[10px] text-slate-400 font-mono border border-slate-700">
                        Metadata Search Only
                    </div>
                </div>

                {/* --- Data Plane Nodes --- */}
                
                {/* Provider (Bottom Left) - 75% Top, 20% Left */}
                <div className="absolute top-[75%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                    <div className="absolute -top-3 -right-3 bg-yellow-500 text-slate-900 rounded-full p-1.5 border-2 border-slate-900 z-30">
                        <Key className="w-4 h-4" />
                    </div>
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
                        <Database className="w-8 h-8 text-white" />
                    </div>
                    <span className="mt-4 text-white font-bold bg-blue-900/80 px-3 py-1 rounded-full">Provider</span>
                </div>

                {/* Consumer (Bottom Right) - 75% Top, 80% Left */}
                <div className="absolute top-[75%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                    <div className="absolute -top-3 -left-3 bg-yellow-500 text-slate-900 rounded-full p-1.5 border-2 border-slate-900 z-30">
                        <Key className="w-4 h-4" />
                    </div>
                    <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
                        <Server className="w-8 h-8 text-white" />
                    </div>
                    <span className="mt-4 text-white font-bold bg-emerald-900/80 px-3 py-1 rounded-full">Consumer</span>
                </div>

                {/* P2P Tunnel (Bottom Center connecting Provider and Consumer) */}
                <div className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-16 bg-gradient-to-r from-blue-900/20 via-blue-900/50 to-blue-900/20 rounded-full overflow-hidden flex items-center justify-center border border-slate-700 z-10">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#1e3a8a_20px,#1e3a8a_40px)] opacity-20 animate-[slideRight_2s_linear_infinite]"></div>
                    <style>{`
                        @keyframes slideRight {
                            0% { background-position: 0 0; }
                            100% { background-position: 40px 0; }
                        }
                    `}</style>
                    
                    <div className="flex items-center gap-2 z-10 bg-slate-900/80 px-4 py-1 rounded-full border border-blue-500/30">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Encrypted P2P</span>
                    </div>

                    {/* Moving Data Packets */}
                    <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-lg shadow-[0_0_15px_#3b82f6] animate-[moveRight_3s_linear_infinite] opacity-80 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-lg shadow-[0_0_15px_#3b82f6] animate-[moveRight_3s_linear_infinite] opacity-80 flex items-center justify-center" style={{animationDelay: '1.5s'}}>
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                    <style>{`
                        @keyframes moveRight {
                            0% { left: 0%; opacity: 0; transform: scale(0.8); }
                            10% { opacity: 1; transform: scale(1); }
                            90% { opacity: 1; transform: scale(1); }
                            100% { left: 95%; opacity: 0; transform: scale(0.8); }
                        }
                    `}</style>
                </div>
            </div>

            {/* Q&A / Explanation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        {language === 'KO' ? '운영자의 접근 권한' : 'Operator Access'}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {language === 'KO' 
                            ? '운영자는 메타데이터(데이터 이름, 설명)만 볼 수 있습니다. 실제 파일이나 DB 데이터는 암호화된 P2P 터널을 통해 전송됩니다.'
                            : 'Operators can only see metadata (names, descriptions). Actual files or DB data are transmitted via encrypted P2P tunnels.'}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-500" />
                        {language === 'KO' ? '암호화 키 관리' : 'Encryption Key Management'}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {language === 'KO' 
                            ? '키는 오직 데이터 제공자와 소비자의 커넥터(Connector)만 가지고 있습니다. 중앙 서버는 키를 관리하거나 저장하지 않습니다.'
                            : 'Keys are held only by the Provider and Consumer connectors. The central server does not manage or store any keys.'}
                    </p>
                </div>
            </div>
        </div>
    );

    // --- VISUALIZATION 4: SECURITY LAYERS ---
    const renderLayers = () => (
        <div className="space-y-12 animate-fadeIn">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-extrabold text-slate-900">
                    {language === 'KO' ? '3중 보안 계층' : '3-Layer Security Architecture'}
                </h2>
                <p className="text-slate-500 max-w-3xl mx-auto text-lg">
                    {language === 'KO' 
                        ? '데이터스페이스는 신원(Identity), 전송(Transport), 정책(Policy)의 3단계 방어막을 통해 완벽한 보안을 제공합니다.'
                        : 'DataSpace provides complete security through a 3-layer defense system: Identity, Transport, and Policy.'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
                {/* Visual */}
                <div className="relative h-96 w-full flex items-center justify-center">
                    {/* Orbital Rings Animation */}
                    {[1, 2, 3].map((layer) => (
                        <div 
                            key={layer}
                            className={`absolute border-2 rounded-full flex items-center justify-center transition-all duration-1000 ${
                                layerStep === layer 
                                ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)] bg-blue-500/5 scale-105' 
                                : 'border-slate-200'
                            }`}
                            style={{ width: `${layer * 100 + 80}px`, height: `${layer * 100 + 80}px`, zIndex: 10 - layer }}
                        >
                             {/* Orbiting Icon */}
                             <div 
                                className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                                 layerStep === layer ? 'border-blue-500 text-blue-500 scale-125' : 'border-slate-300 text-slate-300'
                             }`}>
                                 {layer === 3 ? <Fingerprint className="w-4 h-4" /> : 
                                  layer === 2 ? <Lock className="w-4 h-4" /> : 
                                  <FileKey className="w-4 h-4" />}
                             </div>
                        </div>
                    ))}
                    
                    {/* Center Core */}
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-2xl z-20 relative border-4 border-slate-100 animate-pulse">
                        <Database className="w-10 h-10" />
                        <div className="absolute -bottom-8 text-slate-900 font-bold text-sm">DATA</div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-6">
                    <div 
                        className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                            layerStep === 3 ? 'bg-blue-50 border-blue-500 shadow-md transform -translate-x-2' : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                        onClick={() => setLayerStep(3)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                <Fingerprint className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Layer 1: Identity (신원)</h4>
                                <p className="text-slate-600 text-sm mt-1">
                                    {language === 'KO' 
                                    ? '중앙 신원 확인소(DAPS)를 통해 검증된 참여자(DID/VC)만 네트워크에 접속할 수 있습니다. 익명 접속은 불가능합니다.' 
                                    : 'Only participants with verified DIDs/VCs can access the network via DAPS. No anonymous access.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div 
                        className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                            layerStep === 2 ? 'bg-purple-50 border-purple-500 shadow-md transform -translate-x-2' : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                        onClick={() => setLayerStep(2)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Layer 2: Transport (전송)</h4>
                                <p className="text-slate-600 text-sm mt-1">
                                    {language === 'KO' 
                                    ? '모든 데이터 전송은 TLS 1.3 및 mTLS(상호 인증) 터널을 통해 암호화됩니다. 중간자 공격(MITM)이 원천 차단됩니다.' 
                                    : 'All data transfer is encrypted via TLS 1.3 & mTLS tunnels. Man-in-the-middle attacks are blocked.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div 
                        className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                            layerStep === 1 ? 'bg-emerald-50 border-emerald-500 shadow-md transform -translate-x-2' : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                        onClick={() => setLayerStep(1)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                <FileKey className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Layer 3: Policy (정책)</h4>
                                <p className="text-slate-600 text-sm mt-1">
                                    {language === 'KO' 
                                    ? '데이터에 ODRL 정책(사용 기간, 목적 제한)이 부착되어 전송됩니다. 커넥터가 정책 위반 시 접근을 강제 차단합니다.' 
                                    : 'ODRL policies (duration, purpose) travel with data. Connectors strictly enforce access control.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn pb-12 relative">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto pt-4">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
                    <Shield className="w-10 h-10 text-blue-600 fill-blue-100" />
                    {language === 'KO' ? '보안 및 데이터 주권' : 'Security & Data Sovereignty'}
                </h1>
                <p className="text-lg text-slate-500">
                    {language === 'KO' 
                        ? '중앙 집중식 저장소의 한계를 넘어, 데이터 주권을 보장하는 차세대 보안 아키텍처'
                        : 'Next-gen security architecture ensuring data sovereignty beyond centralized storage limits.'}
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap justify-center gap-2">
                    <button 
                        onClick={() => setActiveTab('COMPARISON')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'COMPARISON' 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        {language === 'KO' ? '보안 구조 비교' : 'Architecture Comparison'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('BLINDNESS')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'BLINDNESS' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <EyeOff className="w-4 h-4" />
                        {language === 'KO' ? '운영자 눈가림 (P2P)' : 'Operator Blindness'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('METADATA')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'METADATA' 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Activity className="w-4 h-4" />
                        {language === 'KO' ? '메타데이터 분리' : 'Metadata Separation'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('LAYERS')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'LAYERS' 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Layers className="w-4 h-4" />
                        {language === 'KO' ? '3중 보안 계층' : 'Security Layers'}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm min-h-[600px]">
                {activeTab === 'COMPARISON' && renderComparison()}
                {activeTab === 'BLINDNESS' && renderBlindness()}
                {activeTab === 'METADATA' && renderMetadata()}
                {activeTab === 'LAYERS' && renderLayers()}
            </div>
        </div>
    );
};

export default SecurityModule;
