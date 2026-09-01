
import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Network, Scale, FileText, Lock, Globe, Layers, Key, RefreshCw, CheckCircle, ExternalLink, UserPlus, FileSignature, Fingerprint, Server, FileCheck, CreditCard, LifeBuoy, Award, Users, Book, Database, Brain, Search, ArrowRight, Zap, Filter, LayoutGrid, GitMerge, Share2, XCircle, CheckCircle2, Cloud, HardDrive, Cpu, Radio, BarChart3, Lightbulb, Gavel, Star, BookOpen, Anchor, Leaf, FileJson, Link, Share, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const Guideline: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('comparison');
  const [animationStep, setAnimationStep] = useState(0);

  // Animation Loop for SVGs
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sections = [
    { id: 'comparison', label: language === 'KO' ? 'Space vs Lake' : 'Space vs Lake', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'security', label: language === 'KO' ? '보안 (Security)' : 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'semantic', label: language === 'KO' ? '시맨틱 웹 & 온톨로지' : 'Semantic Web & Ontology', icon: <Network className="w-4 h-4" /> },
    { id: 'governance', label: language === 'KO' ? '거버넌스' : 'Governance', icon: <Scale className="w-4 h-4" /> },
    { id: 'architecture', label: language === 'KO' ? '아키텍처' : 'Architecture', icon: <Layers className="w-4 h-4" /> },
    { id: 'exchange', label: language === 'KO' ? '데이터 교환' : 'Data Exchange', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'metadata', label: language === 'KO' ? '메타데이터' : 'Metadata', icon: <Search className="w-4 h-4" /> },
    { id: 'federated', label: language === 'KO' ? '연합 학습' : 'Federated Learning', icon: <Brain className="w-4 h-4" /> },
    { id: 'onboarding', label: language === 'KO' ? '온보딩' : 'Onboarding', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'features', label: language === 'KO' ? '주요 기능' : 'Features', icon: <Star className="w-4 h-4" /> },
    { id: 'legal', label: language === 'KO' ? '법적 사항' : 'Legal', icon: <Gavel className="w-4 h-4" /> },
    { id: 'glossary', label: language === 'KO' ? '용어 사전' : 'Glossary', icon: <BookOpen className="w-4 h-4" /> },
  ];

  // --- RENDERERS ---

  const renderSecurity = () => (
    <div className="space-y-16 animate-fadeIn">
        {/* Intro */}
        <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-sm font-bold uppercase tracking-wider">
                {language === 'KO' ? '보안과 데이터 주권' : 'Security & Sovereignty'}
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">
                {language === 'KO' ? '데이터스페이스는 왜 안전한가?' : 'Why is DataSpace Secure?'}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                {language === 'KO' 
                    ? '데이터스페이스는 중앙 서버 저장 방식이 아닌, "데이터 보유자"와 "데이터 사용자" 간의 직접 전송 방식을 사용합니다. 운영 기관조차도 귀하의 원본 데이터를 볼 수 없는 구조입니다.'
                    : 'DataSpace uses a direct transfer method between the "Data Holder" and "Data User", not a central server storage. Even the operating institution cannot view your raw data.'}
            </p>
        </div>

        {/* 2.1 Why is it safe? (Security Layers) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    {language === 'KO' ? '2.1. 다층 방어 보안' : '2.1. Multi-Layered Security'}
                </h3>
                <div className="space-y-4">
                    {[
                        { title: language === 'KO' ? '신원 (Identity)' : 'Identity', desc: language === 'KO' ? 'DID와 VC 기반의 상호 인증. 익명 접근은 허용되지 않습니다.' : 'DID & VC based mutual authentication (No anonymous access).', icon: Fingerprint, color: 'text-blue-500' },
                        { title: language === 'KO' ? '전송 (Transmission)' : 'Transmission', desc: language === 'KO' ? 'P2P 암호화 터널(TLS 1.3/mTLS)로 중간자 공격을 차단합니다.' : 'P2P Encrypted Tunnel (TLS 1.3/mTLS). No man-in-the-middle.', icon: Lock, color: 'text-emerald-500' },
                        { title: language === 'KO' ? '제어 (Control)' : 'Control', desc: language === 'KO' ? '전송 이후에도 사용 정책(ODRL)이 데이터에 함께 따라붙습니다.' : 'Usage Policies (ODRL) attached to data even after transfer.', icon: Scale, color: 'text-purple-500' },
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
                            <div className={`p-3 rounded-full bg-slate-50 h-fit ${item.color}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">{item.title}</h4>
                                <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Layered Onion Visual */}
            <div className="relative h-[400px] bg-slate-900 rounded-3xl overflow-hidden flex items-center justify-center p-8 border border-slate-800 shadow-2xl">
                <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                
                {/* Layers Animation */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Layer 1 */}
                    <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-blue-400 text-xs font-bold px-2">{language === 'KO' ? '신원 계층' : 'Identity Layer'}</div>
                    
                    {/* Layer 2 */}
                    <div className="absolute inset-4 border-4 border-emerald-500/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 text-xs font-bold px-2">{language === 'KO' ? '암호화 계층' : 'Encryption Layer'}</div>

                    {/* Layer 3 */}
                    <div className="absolute inset-10 border-4 border-purple-500/50 rounded-full animate-[spin_8s_linear_infinite]"></div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-purple-400 text-xs font-bold px-2">{language === 'KO' ? '정책 계층' : 'Policy Layer'}</div>

                    {/* Core */}
                    <div className="absolute inset-20 bg-gradient-to-br from-white to-slate-300 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] z-10">
                        <Database className="w-8 h-8 text-slate-900" />
                    </div>
                    <div className="absolute -bottom-8 text-center w-full text-white font-bold">{language === 'KO' ? '내 데이터' : 'Your Data'}</div>
                </div>
            </div>
        </div>

        {/* 2.2 Operator Blindness */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
                    <Eye className="w-8 h-8 text-slate-400" />
                    {language === 'KO' ? '2.2. 운영 기관이 내 데이터를 볼 수 있나요?' : '2.2. Can the Operator see my data?'}
                </h3>
                <p className="text-lg text-slate-600 font-medium">
                    {language === 'KO' 
                        ? '아니오, 볼 수 없습니다. (No, they cannot.)' 
                        : 'No, they cannot.'}
                </p>
                <p className="text-slate-500 mt-2">
                    {language === 'KO' 
                        ? '데이터스페이스 운영자는 "전화교환원"과 같습니다. 통화를 연결해주지만, 통화 내용(데이터)은 듣지 못합니다. 데이터는 P2P(Peer-to-Peer) 암호화 터널을 통해 전송됩니다.' 
                        : 'The operator acts like a "switchboard operator". They connect the call, but cannot hear the conversation. Data flows through a P2P encrypted tunnel.'}
                </p>
            </div>

            {/* Comparison Visual: Central vs Decentralized */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Scenario A: Legacy */}
                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm opacity-60 grayscale hover:grayscale-0 transition-all">
                    <h4 className="text-center font-bold text-red-500 mb-6 flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5" /> {language === 'KO' ? '기존 방식 (중앙 집중식)' : 'Legacy (Centralized)'}
                    </h4>
                    {/* The dashes used to be a <path> at hardcoded pixel
                        coordinates while the icons were laid out with
                        justify-between, so the two only lined up at one
                        container width. Both now sit on the same percentages:
                        <line> accepts them, unlike a path's "d". */}
                    <div className="relative h-40">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line x1="14%" y1="128" x2="50%" y2="72" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                            <line x1="50%" y1="72" x2="86%" y2="128" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                        </svg>

                        {/* Uplink packet, travelling the same two segments */}
                        <span className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 animate-[legacyUplink_2s_linear_infinite]"></span>
                        <style>{`
                            @keyframes legacyUplink {
                                0%   { left: 14%; top: 128px; opacity: 0; }
                                10%  { opacity: 1; }
                                50%  { left: 50%; top: 72px; }
                                90%  { opacity: 1; }
                                100% { left: 86%; top: 128px; opacity: 0; }
                            }
                        `}</style>

                        <div className="absolute left-1/2 top-1 -translate-x-1/2 flex flex-col items-center z-10">
                            <div className="w-16 h-16 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
                                <Server className="w-8 h-8 text-red-500" />
                            </div>
                            <span className="text-xs font-bold text-red-600 mt-2 bg-red-50 px-2 py-1 rounded whitespace-nowrap">{language === 'KO' ? '운영 기관이 데이터 보관' : 'Operator Stores Data'}</span>
                        </div>

                        <Database className="absolute left-[14%] top-[128px] -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-slate-400" />
                        <Database className="absolute left-[86%] top-[128px] -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-slate-400" />
                    </div>
                </div>

                {/* Scenario B: DataSpace */}
                <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{language === 'KO' ? '안전' : 'Secure'}</div>
                    <h4 className="text-center font-bold text-emerald-600 mb-6 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> {language === 'KO' ? '데이터스페이스 (분산형)' : 'DataSpace (Decentralized)'}
                    </h4>
                    <div className="relative h-40 flex justify-between items-center px-8">
                        
                        {/* Provider */}
                        <div className="flex flex-col items-center z-10">
                            <div className="w-12 h-12 bg-blue-50 border-2 border-blue-500 rounded-full flex items-center justify-center">
                                <Database className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 mt-2">{language === 'KO' ? '제공자' : 'Provider'}</span>
                        </div>

                        {/* The Tunnel */}
                        <div className="flex-1 h-12 bg-slate-100 rounded-lg mx-4 flex items-center justify-center relative border border-slate-300 shadow-inner">
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#f1f5f9_10px,#f1f5f9_20px)] opacity-50"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10 bg-white/80 px-2 rounded">{language === 'KO' ? '암호화 터널' : 'Encrypted Tunnel'}</span>
                            
                            {/* Hidden Packet Animation */}
                            <div className="absolute left-2 w-4 h-4 bg-emerald-500 rounded-full animate-[moveRight_2s_linear_infinite] shadow-[0_0_10px_#10b981]"></div>
                            <style>{`
                                @keyframes moveRight {
                                    0% { left: 5%; opacity: 0; }
                                    10% { opacity: 1; }
                                    90% { opacity: 1; }
                                    100% { left: 95%; opacity: 0; }
                                }
                            `}</style>
                        </div>

                        {/* Consumer */}
                        <div className="flex flex-col items-center z-10">
                            <div className="w-12 h-12 bg-purple-50 border-2 border-purple-500 rounded-full flex items-center justify-center">
                                <Database className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 mt-2">{language === 'KO' ? '소비자' : 'Consumer'}</span>
                        </div>

                        {/* Operator (Blind) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 opacity-50">
                            <div className="flex flex-col items-center">
                                <Server className="w-8 h-8 text-slate-300" />
                                <div className="bg-slate-200 text-slate-500 text-[9px] px-2 py-0.5 rounded mt-1 flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {language === 'KO' ? '내용 확인 불가' : 'Blind'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderSemantic = () => (
    <div className="space-y-12 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold uppercase tracking-wider">
                {language === 'KO' ? '데이터의 공통 언어' : 'Common Language of Data'}
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">
                {language === 'KO' ? '시맨틱 웹 & 온톨로지' : 'Semantic Web & Ontology'}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                {language === 'KO' 
                    ? '데이터에 의미(Meaning)를 부여하여 기계가 이해하고 추론할 수 있게 만드는 기술. 서로 다른 시스템 간의 데이터 상호운용성(Interoperability)을 보장하는 핵심 계층입니다.' 
                    : 'Enabling machines to understand and infer data meaning. The core layer ensuring interoperability between disparate systems in the Data Space.'}
            </p>
        </div>

        {/* Hero Visualization: Knowledge Graph */}
        <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl h-[500px] border border-slate-800">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
            </div>

            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                    <Share2 className="w-6 h-6 text-indigo-400" /> {language === 'KO' ? '지식 그래프' : 'Knowledge Graph'}
                </h3>
                <p className="text-slate-400 text-xs mt-1">{language === 'KO' ? 'RDF 트리플로 엔티티를 동적으로 연결합니다' : 'Dynamic Linking of Entities via RDF Triples'}</p>
            </div>

            <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 450">
                <defs>
                    <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                    </marker>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Central Node: Product (Digital Twin) */}
                <g className="cursor-pointer hover:opacity-90 transition-opacity">
                    <circle cx="400" cy="225" r="40" fill="#1e1e2e" stroke="#6366f1" strokeWidth="4" filter="url(#glow)" />
                    <text x="400" y="230" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Asset (AAS)</text>
                    <text x="400" y="245" textAnchor="middle" fill="#818cf8" fontSize="10">Battery #8821</text>
                </g>

                {/* Satellite Nodes */}
                {[
                    { id: 1, label: language === 'KO' ? '제조사' : 'Manufacturer', val: 'LG Energy Sol', x: 200, y: 100, color: '#3b82f6', pred: 'cx:manufacturer' },
                    { id: 2, label: language === 'KO' ? '소재' : 'Material', val: 'Lithium', x: 600, y: 100, color: '#10b981', pred: 'cx:hasPart' },
                    { id: 3, label: language === 'KO' ? '인증서' : 'Certificate', val: 'ISO 14001', x: 600, y: 350, color: '#f59e0b', pred: 'cx:compliantWith' },
                    { id: 4, label: language === 'KO' ? '탄소' : 'Carbon', val: '125 kgCO2e', x: 200, y: 350, color: '#ef4444', pred: 'cx:hasPCF' },
                ].map((node, i) => (
                    <g key={i}>
                        {/* Link Line */}
                        <path 
                            d={`M 400 225 L ${node.x} ${node.y}`} 
                            stroke="#475569" 
                            strokeWidth="2" 
                            markerEnd="url(#arrowHead)" 
                            strokeDasharray="5 5"
                        >
                            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
                        </path>
                        
                        {/* Predicate Label on Line */}
                        <rect x={(400 + node.x)/2 - 40} y={(225 + node.y)/2 - 10} width="80" height="20" rx="4" fill="#0f172a" stroke="#334155" />
                        <text x={(400 + node.x)/2} y={(225 + node.y)/2 + 4} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                            {node.pred}
                        </text>

                        {/* Node */}
                        <circle cx={node.x} cy={node.y} r="30" fill="#1e293b" stroke={node.color} strokeWidth="3" />
                        <text x={node.x} y={node.y - 5} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{node.label}</text>
                        <text x={node.x} y={node.y + 10} textAnchor="middle" fill={node.color} fontSize="9">{node.val}</text>

                        {/* Pulse Effect */}
                        <circle cx={node.x} cy={node.y} r="35" fill="none" stroke={node.color} strokeWidth="1" opacity="0">
                            <animate attributeName="r" from="30" to="45" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>
                    </g>
                ))}

                {/* Inferred Link Animation (Reasoning) */}
                <path d="M 200 100 Q 400 50 600 350" stroke="#a855f7" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.6">
                    <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="5s" repeatCount="indefinite" />
                </path>
                <text x="400" y="80" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="bold" transform="rotate(0 400 80)">
                    [Inferred] holdsCertificate
                </text>
            </svg>
        </div>

        {/* Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors group">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                    <Network className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{language === 'KO' ? 'RDF (그래프 데이터 모델)' : 'RDF (Graph Data Model)'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                    {language === 'KO'
                        ? '데이터를 "주어-서술어-목적어"의 Triple 형태로 표현하여, 데이터 간의 관계를 그래프 구조로 연결합니다.'
                        : 'Expresses data as "subject-predicate-object" triples, linking relationships between data into a graph structure.'}
                    <br/><span className="text-xs text-indigo-600 font-mono mt-2 block">Example: (Car) -&gt; (hasPart) -&gt; (Battery)</span>
                </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors group">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{language === 'KO' ? '온톨로지 (OWL/SHACL)' : 'Ontology (OWL/SHACL)'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                    {language === 'KO'
                        ? '데이터의 개념과 관계를 정의하는 "공통 어휘집"입니다. 산업 표준(e.g., Catena-X) 온톨로지를 사용하여 서로 다른 시스템이 동일한 의미로 소통합니다.'
                        : 'A "shared vocabulary" that defines the concepts and relationships of data. Industry-standard ontologies (e.g., Catena-X) let different systems communicate with identical meaning.'}
                </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition-colors group">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{language === 'KO' ? '추론 (Reasoning)' : 'Reasoning'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                    {language === 'KO'
                        ? '명시되지 않은 사실을 논리적으로 유추합니다. 예: "배터리 부품을 납품하는 A사는 자동으로 자동차 공급망의 일원이다."'
                        : 'Logically infers facts that were never stated explicitly. E.g., "Company A, which supplies battery parts, is automatically part of the automotive supply chain."'}
                </p>
            </div>
        </div>

        {/* Technical Deep Dive: JSON-LD vs Legacy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2">
                        <Database className="w-5 h-5 text-slate-400" /> {language === 'KO' ? '기존 데이터 (사일로)' : 'Legacy Data (Siloed)'}
                    </h4>
                    <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded">CSV / RDB</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-600 overflow-x-auto">
                    <div className="border-b border-slate-100 pb-2 mb-2 font-bold">id, name, supplier_id, co2</div>
                    <div className="text-slate-500">8821, "Battery Pack", "L-99", 125</div>
                    <div className="text-slate-500">9912, "Motor Assy", "M-01", 85</div>
                    <div className="mt-4 text-red-500 italic">
                        {language === 'KO'
                            ? '* 문제점: "supplier_id"가 무엇을 의미하는지, "co2"의 단위가 무엇인지 기계는 알 수 없음 (사람의 해석 필요).'
                            : '* Problem: A machine cannot tell what "supplier_id" means or what unit "co2" uses (human interpretation required).'}
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                        <FileJson className="w-5 h-5 text-indigo-600" /> {language === 'KO' ? '시맨틱 데이터 (연결형)' : 'Semantic Data (Linked)'}
                    </h4>
                    <span className="text-xs font-bold bg-indigo-200 text-indigo-800 px-2 py-1 rounded">JSON-LD</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                    <pre>{`{
  "@context": "https://catenax.io/schema/v1",
  "@type": "cx:Battery",
  "cx:id": "8821",
  "cx:manufacturer": {
    "@id": "urn:bpn:L-99",
    "cx:name": "LG Energy Sol"
  },
  "cx:carbonFootprint": {
    "cx:value": 125,
    "cx:unit": "kgCO2e"
  }
}`}</pre>
                    <div className="mt-2 text-slate-400 italic border-t border-slate-700 pt-2">
                        {language === 'KO'
                            ? '* 장점: "@context"를 통해 전 세계 어디서나 동일한 의미로 해석 가능. 기계 자동 처리 가능.'
                            : '* Benefit: "@context" makes the meaning identical anywhere in the world, so machines can process it automatically.'}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderComparison = () => (
    <div className="space-y-12 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider">
                {language === 'KO' ? '패러다임의 전환' : 'Paradigm Shift'}
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">
                Data Space vs. Data Lake
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                {language === 'KO' 
                    ? '중앙 집중식 저장소에서 분산형 데이터 생태계로의 전환. 데이터 주권(Sovereignty)을 보장하는 차세대 아키텍처 비교 분석.' 
                    : 'Transition from centralized repositories to decentralized data ecosystems. A comparative analysis of next-gen architectures ensuring data sovereignty.'}
            </p>
        </div>

        {/* Animated Visual Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Data Lake (Legacy) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50 text-center">
                    <h3 className="text-xl font-bold text-slate-700">{language === 'KO' ? '기존 방식: 데이터 레이크' : 'Legacy: Data Lake'}</h3>
                    <p className="text-sm text-slate-500">{language === 'KO' ? '중앙 집중형, 복제 기반, 사일로화' : 'Centralized, Copy-based, Siloed'}</p>
                </div>
                <div className="h-64 relative bg-slate-100 flex items-center justify-center overflow-hidden">
                    {/* SVG Animation: Data Flowing to Center */}
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 300">
                        {/* Central Lake */}
                        <ellipse cx="200" cy="150" rx="60" ry="30" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                        <path d="M 200 120 V 135" stroke="#94a3b8" strokeWidth="2" />
                        <path d="M 200 135 C 170 135, 170 165, 200 165 C 230 165, 230 135, 200 135" fill="#e2e8f0" />
                        <text x="200" y="155" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold">{language === 'KO' ? '빅데이터 레이크' : 'Big Data Lake'}</text>

                        {/* Sources Flowing In */}
                        {[0, 1, 2, 3].map(i => {
                            const angle = (i * 90) + 45;
                            const rad = angle * (Math.PI / 180);
                            const x = 200 + Math.cos(rad) * 140;
                            const y = 150 + Math.sin(rad) * 100;
                            return (
                                <g key={i}>
                                    <circle cx={x} cy={y} r="15" fill="#fff" stroke="#64748b" strokeWidth="2" />
                                    <text x={x} y={y+4} textAnchor="middle" fontSize="8" fill="#64748b">{language === 'KO' ? '소스' : 'Src'}</text>
                                    <path 
                                        d={`M ${x} ${y} L 200 150`} 
                                        stroke="#94a3b8" 
                                        strokeWidth="2" 
                                        strokeDasharray="4 4"
                                        className="opacity-50"
                                    />
                                    {/* Moving Packet */}
                                    <circle r="3" fill="#64748b">
                                        <animateMotion 
                                            dur="2s" 
                                            repeatCount="indefinite" 
                                            path={`M ${x} ${y} L 200 150`} 
                                        />
                                    </circle>
                                </g>
                            )
                        })}
                    </svg>
                </div>
                <div className="p-6 bg-white flex-1">
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> {language === 'KO' ? '데이터 복제 및 이동 필수 (보안 취약)' : 'Requires copying and moving data (security exposure)'}</li>
                        <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> {language === 'KO' ? '데이터 소유권 상실 (플랫폼 종속)' : 'Loss of data ownership (platform lock-in)'}</li>
                        <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> {language === 'KO' ? '실시간성 부족 (Batch 처리 위주)' : 'Limited real-time capability (batch-oriented)'}</li>
                    </ul>
                </div>
            </div>

            {/* Data Space (Future) */}
            <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-xl overflow-hidden flex flex-col relative transform scale-105 z-10">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{language === 'KO' ? '권장' : 'Recommended'}</div>
                <div className="p-6 border-b border-blue-100 bg-blue-50 text-center">
                    <h3 className="text-xl font-bold text-blue-700">{language === 'KO' ? '차세대: 데이터 스페이스' : 'Future: Data Space'}</h3>
                    <p className="text-sm text-blue-600">{language === 'KO' ? '연합형, 데이터 주권 보장, P2P' : 'Federated, Sovereign, P2P'}</p>
                </div>
                <div className="h-64 relative bg-slate-900 flex items-center justify-center overflow-hidden">
                    {/* SVG Animation: Mesh Network */}
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 300">
                        <defs>
                            <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>

                        {/* Nodes */}
                        {[0, 1, 2, 3, 4].map(i => {
                            const angle = (i * 72) - 90;
                            const rad = angle * (Math.PI / 180);
                            const x = 200 + Math.cos(rad) * 100;
                            const y = 150 + Math.sin(rad) * 80;
                            return (
                                <g key={i}>
                                    {/* Connections to other nodes */}
                                    {[0, 1, 2, 3, 4].map(j => {
                                        if (i === j) return null;
                                        const angle2 = (j * 72) - 90;
                                        const rad2 = angle2 * (Math.PI / 180);
                                        const x2 = 200 + Math.cos(rad2) * 100;
                                        const y2 = 150 + Math.sin(rad2) * 80;
                                        return (
                                            <line key={j} x1={x} y1={y} x2={x2} y2={y2} stroke="url(#linkGrad)" strokeWidth="1" opacity="0.3" />
                                        )
                                    })}
                                    
                                    {/* Node */}
                                    <circle cx={x} cy={y} r="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                    <path transform={`translate(${x-6}, ${y-6}) scale(0.5)`} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#3b82f6" />
                                    
                                    {/* Connector Badge */}
                                    <rect x={x-10} y={y+20} width="20" height="8" rx="2" fill="#3b82f6" />
                                    <text x={x} y={y+26} textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">EDC</text>
                                </g>
                            )
                        })}

                        {/* Active Data Packet */}
                        <circle r="4" fill="#60a5fa" filter="url(#glow)">
                            <animateMotion 
                                dur="3s" 
                                repeatCount="indefinite" 
                                path="M 200 70 L 295 125 L 258 226 L 141 226 L 105 125 Z" 
                            />
                        </circle>
                    </svg>
                </div>
                <div className="p-6 bg-white flex-1">
                    <ul className="space-y-3 text-sm text-slate-700">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {language === 'KO' ? '탈 중앙화된 데이터 거래 (보안강화)' : 'Decentralized data transactions (stronger security)'}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {language === 'KO' ? '기업의 영업비밀을 보장(블록체인)' : 'Trade secrets protected (blockchain-backed)'}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {language === 'KO' ? '표준 커넥터(EDC) 기반 상호운용성' : 'Interoperability via standard connectors (EDC)'}</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Deep Dive Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-900 text-lg">{language === 'KO' ? '전문가 비교 분석' : 'Expert Comparison Analysis'}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-white border-b border-slate-100 text-slate-500">
                            <th className="px-6 py-4 font-bold w-1/4">{language === 'KO' ? '구분' : 'Dimensions'}</th>
                            <th className="px-6 py-4 font-bold w-1/3">{language === 'KO' ? '데이터 레이크 (기존)' : 'Data Lake (Legacy)'}</th>
                            <th className="px-6 py-4 font-bold text-blue-600 w-1/3">{language === 'KO' ? '데이터 스페이스 (차세대)' : 'Data Space (Next-Gen)'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-bold text-slate-700">{language === 'KO' ? '아키텍처' : 'Architecture'}</td>
                            <td className="px-6 py-4 text-slate-600">{language === 'KO' ? '중앙 집중식 (Centralized)' : 'Centralized'}<br/><span className="text-xs text-slate-400">{language === 'KO' ? '모든 데이터를 한 곳에 모음' : 'All data gathered in one place'}</span></td>
                            <td className="px-6 py-4 text-blue-700 font-medium">{language === 'KO' ? '분산형 메시 (Decentralized Mesh)' : 'Decentralized Mesh'}<br/><span className="text-xs text-blue-400">{language === 'KO' ? '데이터는 소스에 남고 연결만 수행' : 'Data stays at the source; only connections are made'}</span></td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-bold text-slate-700">{language === 'KO' ? '데이터 주권' : 'Sovereignty'}</td>
                            <td className="px-6 py-4 text-slate-600">{language === 'KO' ? '플랫폼 사업자 종속' : 'Locked in to the platform operator'}<br/><span className="text-xs text-slate-400">{language === 'KO' ? '업로드 순간 제어권 상실' : 'Control is lost the moment data is uploaded'}</span></td>
                            <td className="px-6 py-4 text-blue-700 font-medium">{language === 'KO' ? '데이터 소유자 제어' : 'Controlled by the data owner'}<br/><span className="text-xs text-blue-400">{language === 'KO' ? '접근 정책(Policy)으로 제어권 유지' : 'Control retained through access policies'}</span></td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-bold text-slate-700">{language === 'KO' ? '보안 및 신뢰' : 'Security & Trust'}</td>
                            <td className="px-6 py-4 text-slate-600">{language === 'KO' ? '경계 보안 (Perimeter Security)' : 'Perimeter Security'}<br/><span className="text-xs text-slate-400">{language === 'KO' ? '내부자 위협에 취약' : 'Vulnerable to insider threats'}</span></td>
                            <td className="px-6 py-4 text-blue-700 font-medium">{language === 'KO' ? '제로 트러스트 (Zero Trust)' : 'Zero Trust'}<br/><span className="text-xs text-blue-400">{language === 'KO' ? 'DID/VC 기반 상호 인증 필수' : 'Mutual authentication via DID/VC required'}</span></td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-bold text-slate-700">{language === 'KO' ? '비용 효율성' : 'Cost'}</td>
                            <td className="px-6 py-4 text-slate-600">{language === 'KO' ? '높음 (중복 저장/전송 비용)' : 'High (duplicate storage and transfer costs)'}<br/><span className="text-xs text-slate-400">{language === 'KO' ? 'ETL 파이프라인 유지보수 비용' : 'Ongoing ETL pipeline maintenance'}</span></td>
                            <td className="px-6 py-4 text-blue-700 font-medium">{language === 'KO' ? '낮음 (On-Demand 접근)' : 'Low (on-demand access)'}<br/><span className="text-xs text-blue-400">{language === 'KO' ? '필요한 시점에 필요한 만큼만 전송' : 'Transfer only what is needed, when it is needed'}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-8 animate-fadeIn">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                {language === 'KO' ? '데이터 스페이스 거버넌스 프레임워크' : 'Data Space Governance Framework'}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
                {language === 'KO'
                    ? '신뢰 기반의 데이터 생태계를 유지하기 위한 규칙, 절차 및 역할에 대한 정의입니다.'
                    : 'The rules, procedures, and roles that keep a trust-based data ecosystem running.'}
            </p>
        </div>

        {/* Visual Governance Structure */}
        <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
            </div>
            
            <svg className="w-full h-[400px]" viewBox="0 0 800 400">
                {/* Trust Anchor */}
                <g transform="translate(400, 50)">
                    <circle r="40" fill="#1e293b" stroke="#f59e0b" strokeWidth="4" />
                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Trust Anchor</text>
                    <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="10">DAPS / CA</text>
                </g>

                {/* Identity Provider */}
                <g transform="translate(200, 200)">
                    <rect x="-60" y="-30" width="120" height="60" rx="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="3" />
                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Identity Provider</text>
                    <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="10">Clearing House</text>
                </g>

                {/* Marketplace */}
                <g transform="translate(600, 200)">
                    <rect x="-60" y="-30" width="120" height="60" rx="10" fill="#1e293b" stroke="#10b981" strokeWidth="3" />
                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Marketplace</text>
                    <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="10">Broker</text>
                </g>

                {/* Participants */}
                <g transform="translate(250, 350)">
                    <circle r="30" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="10">{language === 'KO' ? '제공자' : 'Provider'}</text>
                </g>
                <g transform="translate(550, 350)">
                    <circle r="30" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="10">{language === 'KO' ? '소비자' : 'Consumer'}</text>
                </g>

                {/* Connection Lines */}
                <path d="M 400 90 L 200 170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
                <path d="M 400 90 L 600 170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
                <path d="M 200 230 L 250 320" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
                <path d="M 200 230 L 550 320" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
                <path d="M 600 230 L 250 320" stroke="#10b981" strokeWidth="2" opacity="0.6" />
                <path d="M 600 230 L 550 320" stroke="#10b981" strokeWidth="2" opacity="0.6" />
                
                {/* Bottom P2P */}
                <path d="M 280 350 L 520 350" stroke="#fff" strokeWidth="4" />
                <circle r="4" fill="#fff">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 280 350 L 520 350" />
                </circle>
            </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    {language === 'KO' ? '데이터 주권 (Data Sovereignty)' : 'Data Sovereignty'}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                    {language === 'KO'
                        ? '데이터 제공자는 데이터가 언제, 누구에게, 어떤 조건으로 사용되는지 100% 제어할 수 있습니다. 이는 단순한 접근 제어를 넘어, 사용 기간 제한, 재배포 금지 등 기술적 강제력을 포함합니다.'
                        : 'Data providers retain full control over when, by whom, and under what conditions their data is used. This goes beyond simple access control to technically enforced limits such as usage periods and redistribution bans.'}
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500">
                    <span className="font-bold text-slate-700">{language === 'KO' ? 'ODRL 정책 예시:' : 'ODRL Policy Example:'}</span><br/>
                    "Allow usage for 30 days only for purpose 'AI_Training'."
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-500" />
                    {language === 'KO' ? '신원 및 신뢰 (Identity & Trust)' : 'Identity & Trust'}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                    {language === 'KO'
                        ? '모든 참여자는 신뢰할 수 있는 기관(Trust Anchor)으로부터 검증된 디지털 신원(DID/VC)을 발급받아야 합니다. 익명의 참여자는 네트워크에 접속할 수 없으며, 모든 트랜잭션은 부인 방지(Non-repudiation) 됩니다.'
                        : 'Every participant must obtain a verified digital identity (DID/VC) from a Trust Anchor. Anonymous parties cannot join the network, and every transaction carries non-repudiation.'}
                </p>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">X.509</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">W3C DID</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Verifiable Credentials</span>
                </div>
            </div>
        </div>
    </div>
  );

  const renderExchange = () => (
    <div className="space-y-8 animate-fadeIn">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{language === 'KO' ? '데이터스페이스 프로토콜 흐름' : 'Dataspace Protocol Flow'}</h2>
            <p className="text-slate-500">{language === 'KO' ? '표준화된 데이터 교환 프로토콜(DSP)의 단계별 프로세스입니다.' : 'The step-by-step process of the standardized Dataspace Protocol (DSP).'}</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-x-auto">
            <div className="min-w-[800px] flex justify-between items-center relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10"></div>
                
                {[
                    { id: 1, title: language === 'KO' ? '탐색' : 'Discovery', icon: Search, desc: language === 'KO' ? '카탈로그 검색' : 'Catalog Search' },
                    { id: 2, title: language === 'KO' ? '협상' : 'Negotiation', icon: Handshake, desc: language === 'KO' ? '계약 합의' : 'Contract Agree' },
                    { id: 3, title: language === 'KO' ? '전송' : 'Transfer', icon: ArrowRightLeft, desc: language === 'KO' ? 'EDR 토큰 발급' : 'EDR Token' },
                    { id: 4, title: language === 'KO' ? '사용' : 'Usage', icon: Database, desc: language === 'KO' ? 'P2P 스트리밍' : 'P2P Stream' }
                ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-white p-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
                            idx === animationStep ? 'bg-blue-600 text-white scale-110' : 'bg-white border-2 border-slate-200 text-slate-400'
                        } transition-all duration-500`}>
                            {idx === 0 && <Search className="w-8 h-8" />}
                            {idx === 1 && <FileText className="w-8 h-8" />}
                            {idx === 2 && <Key className="w-8 h-8" />}
                            {idx === 3 && <Database className="w-8 h-8" />}
                        </div>
                        <h4 className={`font-bold ${idx === animationStep ? 'text-blue-600' : 'text-slate-900'}`}>{step.title}</h4>
                        <p className="text-xs text-slate-500">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">{language === 'KO' ? '기술 상세: EDR (Endpoint Data Reference)' : 'Technical Detail: EDR (Endpoint Data Reference)'}</h3>
            <p className="text-sm text-slate-600 mb-4">
                {language === 'KO'
                    ? '계약 협상이 완료되면 소비자(Consumer)는 EDR 토큰을 발급받습니다. 이 토큰은 실제 데이터가 위치한 Data Plane에 접근할 수 있는 일회성 열쇠입니다. 제어 평면(Control Plane)과 데이터 평면(Data Plane)의 분리를 통해 보안성과 확장성을 극대화합니다.'
                    : 'Once contract negotiation completes, the consumer receives an EDR token — a one-time key granting access to the Data Plane where the actual data resides. Separating the Control Plane from the Data Plane maximizes both security and scalability.'}
            </p>
            <div className="font-mono text-xs bg-slate-900 text-emerald-400 p-4 rounded-xl">
                {`{
  "authCode": "eyJhbGciOiJ...",
  "endpoint": "https://provider-dataplane.com/api/v1/stream",
  "properties": {
    "cid": "cid:88291..."
  }
}`}
            </div>
        </div>
    </div>
  );

  // Helper Icon Components for Exchange
  const Handshake = (props: any) => <FileSignature {...props} />;
  const ArrowRightLeft = (props: any) => <RefreshCw {...props} />;

  const renderArchitecture = () => (
    <div className="space-y-8 animate-fadeIn">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{language === 'KO' ? 'EDC 커넥터 아키텍처' : 'EDC Connector Architecture'}</h2>
            <p className="text-slate-500">{language === 'KO' ? 'Eclipse Dataspace Components (EDC) 구조도' : 'Structure of the Eclipse Dataspace Components (EDC)'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Control Plane */}
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-bl-xl">{language === 'KO' ? '두뇌' : 'Brain'}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Cpu className="w-6 h-6" /> Control Plane
                </h3>
                <ul className="space-y-3">
                    <li className="bg-white p-3 rounded-xl border border-blue-100 text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-blue-500" /> {language === 'KO' ? '신원 및 접근 관리 (IAM)' : 'Identity & IAM'}
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-blue-100 text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2">
                        <Search className="w-4 h-4 text-blue-500" /> {language === 'KO' ? '카탈로그 관리' : 'Catalog Management'}
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-blue-100 text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" /> {language === 'KO' ? '계약 협상' : 'Contract Negotiation'}
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-blue-100 text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2">
                        <Scale className="w-4 h-4 text-blue-500" /> {language === 'KO' ? '정책 집행' : 'Policy Enforcement'}
                    </li>
                </ul>
            </div>

            {/* Data Plane */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-bl-xl">{language === 'KO' ? '근육' : 'Muscle'}</div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <Database className="w-6 h-6" /> Data Plane
                </h3>
                <ul className="space-y-3">
                    <li className="bg-white p-3 rounded-xl border border-emerald-100 text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-emerald-500" /> {language === 'KO' ? '데이터 전송 (HTTP/S3/MQTT)' : 'Data Transfer (HTTP/S3/MQTT)'}
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-emerald-100 text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-500" /> {language === 'KO' ? '암호화 및 복호화' : 'Encryption & Decryption'}
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-emerald-100 text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-500" /> {language === 'KO' ? '퍼블릭 API 게이트웨이' : 'Public API Gateway'}
                    </li>
                </ul>
            </div>
        </div>

        {/* Extensions */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 text-center">
            <h4 className="font-bold mb-4">{language === 'KO' ? '확장 모듈 (플러그인)' : 'Extensions (Pluggable Modules)'}</h4>
            <div className="flex flex-wrap justify-center gap-4">
                {['Azure Vault', 'AWS S3', 'PostgreSQL', 'Hashicorp Vault', 'Prometheus'].map((ext, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm font-mono text-blue-300">
                        {ext}
                    </span>
                ))}
            </div>
        </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="space-y-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{language === 'KO' ? '온보딩 로드맵' : 'Onboarding Roadmap'}</h2>
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-12 py-4">
            {[
                { title: language === 'KO' ? '1단계: 가입 등록' : 'Step 1: Registration', desc: language === 'KO' ? '포털 가입 및 BPN(Business Partner Number) 발급 신청' : 'Sign up on the portal and apply for a BPN (Business Partner Number).' },
                { title: language === 'KO' ? '2단계: 신원 검증' : 'Step 2: Identity Verification', desc: language === 'KO' ? 'Clearing House를 통한 기업 실체 확인 및 VC 발급' : 'Verify the company through the Clearing House and receive a VC.' },
                { title: language === 'KO' ? '3단계: 커넥터 구축' : 'Step 3: Connector Setup', desc: language === 'KO' ? 'EDC 커넥터 설치 (Docker/Kubernetes) 및 DAPS 연동' : 'Install the EDC connector (Docker/Kubernetes) and integrate with DAPS.' },
                { title: language === 'KO' ? '4단계: 자산 등록' : 'Step 4: Asset Publication', desc: language === 'KO' ? '데이터 소스 연결 및 카탈로그 자산 등록 (Contract Definition)' : 'Connect data sources and publish catalog assets (Contract Definition).' },
                { title: language === 'KO' ? '5단계: 데이터 교환' : 'Step 5: Data Exchange', desc: language === 'KO' ? '파트너와 계약 체결 및 데이터 전송 시작' : 'Conclude contracts with partners and begin transferring data.' }
            ].map((step, idx) => (
                <div key={idx} className="relative pl-8">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
                    <h3 className="font-bold text-lg text-slate-900">{step.title}</h3>
                    <p className="text-slate-600 mt-1">{step.desc}</p>
                </div>
            ))}
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex justify-between items-center">
            <div>
                <h4 className="font-bold text-blue-900">{language === 'KO' ? '도움이 필요하신가요?' : 'Need Help?'}</h4>
                <p className="text-sm text-blue-700">{language === 'KO' ? '상세 기술 문서를 확인해 보세요.' : 'Check out our detailed technical documentation.'}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm">
                {language === 'KO' ? '문서 보기' : 'View Docs'}
            </button>
        </div>
    </div>
  );

  const renderMetadata = () => (
    <div className="space-y-12 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-bold uppercase tracking-wider">
                {language === 'KO' ? '탐색 엔진' : 'Discovery Engine'}
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">
                {language === 'KO' ? '연합 메타데이터 검색' : 'Federated Metadata Search'}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                {language === 'KO' 
                    ? '분산된 데이터 자산을 표준화된 메타데이터(DCAT)로 연결하여, 구글 검색처럼 쉽게 찾는 기술.' 
                    : 'Connecting distributed data assets via standardized metadata (DCAT) for Google-like discovery.'}
            </p>
        </div>

        {/* Before vs After Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 opacity-80 hover:opacity-100 transition-opacity">
                <h3 className="text-lg font-bold text-slate-600 mb-6 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" /> {language === 'KO' ? 'Before: 수작업과 사일로' : 'Before: Manual & Siloed'}
                </h3>
                <div className="relative h-48 bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-center items-center gap-4 border-dashed">
                    <div className="flex gap-4 w-full justify-center">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-16 h-20 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center gap-1 relative group">
                                <Database className="w-6 h-6 text-slate-400" />
                                <span className="text-[10px] text-slate-500">{language === 'KO' ? `사일로 ${i}` : `Silo ${i}`}</span>
                                <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Lock className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full animate-pulse">
                        <div className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full border border-red-100">
                            {language === 'KO' ? '"그 데이터, 어디 있죠?"' : '"Where is the data?"'}
                        </div>
                        <Search className="w-6 h-6 text-slate-400" />
                    </div>
                </div>
                <div className="mt-4 text-sm text-slate-500">
                    <p>{language === 'KO' ? '• 데이터 위치 파악 불가 (Dark Data)' : '• No visibility into where data lives (Dark Data)'}</p>
                    <p>{language === 'KO' ? '• 엑셀/이메일로 메타데이터 수동 공유' : '• Metadata shared by hand over Excel and email'}</p>
                    <p>{language === 'KO' ? '• 검색 소요 시간: 수 일(Days)' : '• Time to find data: days'}</p>
                </div>
            </div>

            {/* After */}
            <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200">
                <h3 className="text-lg font-bold text-purple-800 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {language === 'KO' ? 'After: 연합 카탈로그' : 'After: Federated Catalog'}
                </h3>
                <div className="relative h-48 bg-white rounded-xl border border-purple-100 shadow-sm p-4 overflow-hidden">
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 300 150">
                        {/* Broker Node */}
                        <circle cx="150" cy="75" r="25" fill="#9333ea" className="animate-pulse" />
                        <text x="150" y="80" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">Broker</text>
                        
                        {/* Participants */}
                        {[0, 1, 2, 3].map(i => {
                            const angle = (i * 90) + 45;
                            const x = 150 + Math.cos(angle * Math.PI / 180) * 80;
                            const y = 75 + Math.sin(angle * Math.PI / 180) * 50;
                            return (
                                <g key={i}>
                                    <line x1="150" y1="75" x2={x} y2={y} stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4 4" />
                                    <circle cx={x} cy={y} r="15" fill="white" stroke="#9333ea" strokeWidth="2" />
                                    <Database x={x-6} y={y-6} width="12" height="12" className="text-purple-600" />
                                    {/* Flying Metadata Packet */}
                                    <circle r="3" fill="#9333ea">
                                        <animateMotion dur="1.5s" repeatCount="indefinite" path={`M ${x} ${y} L 150 75`} />
                                    </circle>
                                </g>
                            )
                        })}
                    </svg>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm border border-purple-100 text-xs font-bold text-purple-700">
                        {language === 'KO' ? 'DCAT 프로토콜 동기화' : 'DCAT Protocol Sync'}
                    </div>
                </div>
                <div className="mt-4 text-sm text-purple-800">
                    <p>{language === 'KO' ? '• 글로벌 통합 검색 (Global Visibility)' : '• Unified global search (full visibility)'}</p>
                    <p>{language === 'KO' ? '• 크롤러 기반 자동 업데이트 (Real-time)' : '• Crawler-driven automatic updates (real-time)'}</p>
                    <p>{language === 'KO' ? '• 검색 소요 시간: 수 초(Seconds)' : '• Time to find data: seconds'}</p>
                </div>
            </div>
        </div>

        {/* Quantitative Impact */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-emerald-500" />
                {language === 'KO' ? '성과 개선 효과' : 'Performance Impact'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <p className="text-sm text-slate-500 mb-1">{language === 'KO' ? '검색 효율' : 'Search Efficiency'}</p>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">95%</span>
                        <span className="text-sm text-emerald-500 font-bold mb-1">{language === 'KO' ? '단축' : 'Faster'}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-slate-400 w-[5%] float-left"></div>
                        <div className="h-full bg-emerald-500 w-[95%] float-left"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{language === 'KO' ? '2주 -> 2분' : '2 Weeks -> 2 Minutes'}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-1">{language === 'KO' ? '데이터 발견율' : 'Data Discovery Rate'}</p>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">4.5x</span>
                        <span className="text-sm text-blue-500 font-bold mb-1">{language === 'KO' ? '증가' : 'Increase'}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-slate-400 w-[20%] float-left"></div>
                        <div className="h-full bg-blue-500 w-[80%] float-left"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{language === 'KO' ? '사일로 방식 대비 연합 방식' : 'Siloed vs Federated'}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-1">{language === 'KO' ? '규제 대응 비용' : 'Compliance Cost'}</p>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">60%</span>
                        <span className="text-sm text-emerald-500 font-bold mb-1">{language === 'KO' ? '절감' : 'Savings'}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[60%] float-left"></div>
                        <div className="h-full bg-slate-400 w-[40%] float-left"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{language === 'KO' ? '자동 태깅 및 거버넌스' : 'Auto-Tagging & Governance'}</p>
                </div>
            </div>
        </div>
    </div>
  );

  const renderFederated = () => (
    <div className="space-y-12 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold uppercase tracking-wider">
                {language === 'KO' ? '프라이버시 보존형 AI' : 'Privacy-Preserving AI'}
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">
                {language === 'KO' ? '연합 학습 (Federated Learning)' : 'Federated Learning'}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                {language === 'KO' 
                    ? '데이터 이동 없이 AI 모델만 이동하여 학습하는 기술. 프라이버시 보호와 AI 성능 향상을 동시에 달성.' 
                    : 'Training AI by moving models instead of data. Achieving both privacy protection and enhanced AI performance.'}
            </p>
        </div>

        {/* Animation Area */}
        <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl h-[450px]">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20" 
                 style={{backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
            </div>

            <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 400">
                {/* Central Server */}
                <g transform="translate(400, 200)">
                    <circle r="50" fill="#064e3b" stroke="#10b981" strokeWidth="4" />
                    <text x="0" y="5" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">{language === 'KO' ? '글로벌 모델' : 'Global Model'}</text>
                    {/* Pulsing Effect */}
                    <circle r="60" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5">
                        <animate attributeName="r" from="50" to="80" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Local Nodes */}
                {[0, 1, 2].map(i => {
                    const angle = (i * 120) - 90;
                    const rad = angle * (Math.PI / 180);
                    const x = 400 + Math.cos(rad) * 200;
                    const y = 200 + Math.sin(rad) * 120;
                    
                    return (
                        <g key={i}>
                            {/* Connection Line */}
                            <line x1="400" y1="200" x2={x} y2={y} stroke="#334155" strokeWidth="2" />
                            
                            {/* Node */}
                            <circle cx={x} cy={y} r="30" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
                            <text x={x} y={y+40} textAnchor="middle" fill="#94a3b8" fontSize="10">{language === 'KO' ? `로컬 데이터 ${i+1}` : `Local Data ${i+1}`}</text>
                            
                            {/* Brain Icon (Model) Traveling */}
                            <circle r="8" fill="#10b981">
                                <animateMotion 
                                    dur="4s" 
                                    repeatCount="indefinite" 
                                    path={`M 400 200 L ${x} ${y} L 400 200`} 
                                    keyPoints="0;0.5;1"
                                    keyTimes="0;0.5;1"
                                />
                            </circle>
                            
                            {/* Local Training Simulation */}
                            <circle cx={x} cy={y} r="25" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="10 10" opacity="0">
                                <animate attributeName="opacity" values="0;1;0" dur="4s" begin="1s" repeatCount="indefinite" />
                                <animateTransform attributeName="transform" type="rotate" from={`0 ${x} ${y}`} to={`360 ${x} ${y}`} dur="4s" repeatCount="indefinite" />
                            </circle>
                        </g>
                    )
                })}
            </svg>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/50 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/50 backdrop-blur-sm">
                <span className="font-bold flex items-center gap-2"><Radio className="w-4 h-4 animate-pulse" /> {language === 'KO' ? 'Compute-to-Data 동작 중' : 'Compute-to-Data Active'}</span>
            </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm opacity-70 hover:opacity-100 transition-opacity">
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">{language === 'KO' ? '기존 AI 학습 방식' : 'Traditional AI Training'}</h4>
                <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                        <div className="bg-red-100 p-1.5 rounded text-red-600"><Database className="w-4 h-4" /></div>
                        <div>
                            <span className="font-bold text-slate-700 block">{language === 'KO' ? '데이터 중앙 집중' : 'Data Centralization'}</span>
                            <span className="text-xs text-slate-500">{language === 'KO' ? '원본 데이터를 모두 중앙 서버로 옮겨야 하므로 위험이 큽니다.' : 'All raw data must be moved to central server. High risk.'}</span>
                        </div>
                    </li>
                    <li className="flex gap-3 items-start">
                        <div className="bg-red-100 p-1.5 rounded text-red-600"><Lock className="w-4 h-4" /></div>
                        <div>
                            <span className="font-bold text-slate-700 block">{language === 'KO' ? '프라이버시 우려' : 'Privacy Concerns'}</span>
                            <span className="text-xs text-slate-500">{language === 'KO' ? '민감한 개인정보나 영업비밀이 취합 주체에 그대로 노출됩니다.' : 'Sensitive PII or Trade Secrets exposed to aggregator.'}</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
                <h4 className="text-sm font-bold text-emerald-600 uppercase mb-4">{language === 'KO' ? '연합 학습 (데이터 스페이스)' : 'Federated Learning (Data Space)'}</h4>
                <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Cpu className="w-4 h-4" /></div>
                        <div>
                            <span className="font-bold text-emerald-900 block">{language === 'KO' ? '현장 내 학습' : 'Local Training'}</span>
                            <span className="text-xs text-emerald-700">{language === 'KO' ? '원본 데이터는 사업장을 벗어나지 않고, 모델 가중치만 오갑니다.' : 'Raw data never leaves the premise. Only model weights travel.'}</span>
                        </div>
                    </li>
                    <li className="flex gap-3 items-start">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Network className="w-4 h-4" /></div>
                        <div>
                            <span className="font-bold text-emerald-900 block">{language === 'KO' ? '집단 지성' : 'Collective Intelligence'}</span>
                            <span className="text-xs text-emerald-700">{language === 'KO' ? '데이터를 공유하지 않고도 전체 데이터셋의 학습 효과를 누립니다.' : 'Benefits from global dataset without sharing data.'}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );

  const renderLegal = () => (
    <div className="space-y-8 animate-fadeIn">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{language === 'KO' ? '법률 및 규제 준수' : 'Legal & Compliance'}</h2>
            <p className="text-slate-500">{language === 'KO' ? '글로벌 표준 및 규제와의 정합성' : 'Global Standards and Regulatory Alignment'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Gavel className="w-6 h-6" /></div>
                    <h3 className="font-bold text-lg text-slate-900">EU Data Act</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                    {language === 'KO'
                        ? 'Korea DataSpace는 유럽 데이터법(European Data Act)을 완전히 준수하도록 설계되어, 데이터 가치의 공정한 배분과 데이터 접근·활용을 보장합니다.'
                        : 'Korea DataSpace is designed to be fully compliant with the European Data Act, ensuring fairness in the allocation of data value and facilitating data access and use.'}
                </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><Lock className="w-6 h-6" /></div>
                    <h3 className="font-bold text-lg text-slate-900">{language === 'KO' ? 'GDPR 준수' : 'GDPR Compliance'}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                    {language === 'KO'
                        ? '개인정보 보호 기능과 동의 관리 기능을 기본 탑재하여, 산업 현장에서의 개인정보 처리에 대해 GDPR 규정을 엄격히 준수합니다.'
                        : 'Built-in privacy controls and consent management features ensure strict adherence to GDPR regulations for personal data handling within industrial contexts.'}
                </p>
            </div>
        </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">{language === 'KO' ? '주요 플랫폼 기능' : 'Key Platform Features'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { title: language === 'KO' ? '커넥터' : 'Connector', icon: Layers, desc: language === 'KO' ? 'EDC 기반 보안 게이트웨이' : 'EDC-based secure gateway' },
                { title: language === 'KO' ? '카탈로그' : 'Catalog', icon: Search, desc: language === 'KO' ? '연합형 자산 탐색' : 'Federated asset discovery' },
                { title: language === 'KO' ? '계약' : 'Contract', icon: FileText, desc: language === 'KO' ? '정책 자동 협상' : 'Automated policy negotiation' },
                { title: language === 'KO' ? '전송' : 'Transfer', icon: RefreshCw, desc: language === 'KO' ? 'P2P 암호화 스트리밍' : 'P2P encrypted streaming' },
                { title: language === 'KO' ? '신원' : 'Identity', icon: UserPlus, desc: language === 'KO' ? 'DID 및 VC 관리' : 'DID & VC management' },
                { title: language === 'KO' ? '정산' : 'Clearing', icon: Scale, desc: language === 'KO' ? '거래 정산 처리' : 'Transaction settlement' },
                { title: language === 'KO' ? '감사' : 'Audit', icon: FileCheck, desc: language === 'KO' ? '위변조 불가 사용 이력' : 'Immutable usage logs' },
                { title: language === 'KO' ? '앱 스토어' : 'App Store', icon: LayoutGrid, desc: language === 'KO' ? '데이터 기반 애플리케이션' : 'Data-driven applications' }
            ].map((feat, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 text-center hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-600">
                        <feat.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">{feat.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{feat.desc}</p>
                </div>
            ))}
        </div>
    </div>
  );

  const renderGlossary = () => {
    // Extended Glossary Data based on user request and existing terms
    const glossaryItems = [
        { 
            category: language === 'KO' ? '핵심 서비스' : 'Core Services',
            items: [
                { term: 'Identity Provider', defKO: '사용자 및 기업의 신원 인증 및 관리 서비스.', defEN: 'Service for authentication and management of user and corporate identities.' },
                { term: 'Policy Hub', defKO: '데이터 사용 정책을 설정하고 관리할 수 있는 서비스.', defEN: 'Service to set and manage data usage policies.' },
                { term: 'Data Exchange', defKO: '안전한 데이터 교환을 위한 중앙 집중식 서비스 제공.', defEN: 'Centralized service providing secure data exchange mechanisms.' },
                { term: 'Clearing House', defKO: '거래 및 데이터 교환 시 결제 및 정산을 지원하는 기능.', defEN: 'Service supporting payment and settlement for data transactions.' },
                { term: 'Discovery Finder', defKO: '데이터를 쉽게 검색하고 찾을 수 있는 도구를 제공하는 서비스.', defEN: 'Service providing tools to easily search and discover data.' },
                { term: 'Search Robot', defKO: '데이터를 자동으로 탐색하고 인덱싱하여, 분석 결과를 사용자에게 제공하는 서비스.', defEN: 'Automated service that crawls and indexes data to provide analysis results.' },
                { term: 'Knowledge Agent', defKO: '데이터 공간 내에서 지식을 공유하고 활용할 수 있도록 지원하는 서비스.', defEN: 'Service supporting knowledge sharing and utilization within the dataspace.' },
                { term: 'User Identity', defKO: '사용자 인증 및 권한 관리를 지원하는 서비스.', defEN: 'Service supporting user authentication and permission management.' },
                { term: 'Data Sovereignty', defKO: '기업이 자신의 데이터를 완전히 제어할 수 있도록 보장하는 서비스.', defEN: 'Service ensuring companies maintain full control over their data.' },
                { term: 'Regulatory Compliance', defKO: '규제 준수를 위한 도구와 서비스.', defEN: 'Tools and services for regulatory compliance.' },
            ]
        },
        { 
            category: language === 'KO' ? '지속가능성 & ESG' : 'Sustainability & ESG',
            items: [
                { term: 'DPP (Digital Product Passport)', defKO: '제품의 디지털 여권을 생성하여 제품 정보와 추적성을 관리하는 솔루션.', defEN: 'Solution generating digital passports to manage product info and traceability.' },
                { term: 'PCF (Product Carbon Footprint)', defKO: '제품의 탄소 발자국을 계산하고 보고할 수 있는 솔루션.', defEN: 'Solution for calculating and reporting the carbon footprint of products.' },
                { term: 'LCA (Life Cycle Assessment)', defKO: '제품의 전체 생애 주기 동안 환경 영향을 평가하는 솔루션.', defEN: 'Solution evaluating environmental impact throughout a product\'s lifecycle.' },
                { term: 'Circular Economy', defKO: '자원 재사용과 재활용을 촉진하기 위한 순환 경제 솔루션.', defEN: 'Solutions promoting resource reuse and recycling for a circular economy.' },
            ]
        },
        { 
            category: language === 'KO' ? '공급망 & 운영' : 'Supply Chain & Operations',
            items: [
                { term: 'Trace-X', defKO: '공급망 전반에서 부품과 재료의 이동 경로를 추적하여 투명성을 높이는 솔루션.', defEN: 'Solution tracking parts and materials across the supply chain for transparency.' },
                { term: 'PURIS', defKO: '공급망 내 위험 요소를 모니터링하고 관리하는 솔루션.', defEN: 'Solution for monitoring and managing risk factors within the supply chain.' },
                { term: 'Change Notification', defKO: '공급망의 변화를 실시간으로 알려주고, 중요한 변경 사항을 놓치지 않도록 도와주는 서비스.', defEN: 'Real-time notification service for supply chain changes and critical updates.' },
                { term: 'Capacity & Demand', defKO: 'AI 기반 수요 패턴을 예측하고, 재고 수준과 운송 경로를 최적화하는 서비스.', defEN: 'AI service forecasting demand patterns and optimizing inventory and logistics.' },
                { term: 'Quality', defKO: '제품 품질 관련 데이터를 공유하고 분석하여 품질 문제를 사전에 감지하는 모니터링 서비스.', defEN: 'Monitoring service sharing quality data to detect issues in advance.' },
            ]
        },
        { 
            category: language === 'KO' ? '기술 & 표준' : 'Technology & Standards',
            items: [
                { term: 'EDC (Connector)', defKO: '데이터의 안전한 교환과 연결을 위한 기술로, 공유를 위해 기술적 프로토콜과 인터페이스를 정의.', defEN: 'Technology for secure data exchange, defining protocols and interfaces.' },
                { term: 'AAS (Asset Administration Shell)', defKO: '데이터를 일관되게 표현하고 교환하기 위해 특정한 규격과 표준을 정의하는 기술.', defEN: 'Standard for consistent data representation and exchange (Digital Twin).' },
                { term: 'SSI (Self-Sovereign Identity)', defKO: '사용자가 자신의 신원을 스스로 관리할 수 있도록 지원하는 기술.', defEN: 'Technology enabling users to manage their own identities autonomously.' },
                { term: 'Federated Learning', defKO: '데이터를 중앙에 모으지 않고도 여러 기업이 AI 모델을 학습시킬 수 있는 기술.', defEN: 'Tech allowing collaborative AI training without centralizing data.' },
                { term: 'Blockchain', defKO: '데이터 교환의 투명성과 보안을 보장하기 위한 분산형 데이터 저장기술.', defEN: 'Distributed ledger technology ensuring transparency and security.' },
                { term: 'Digital Twin', defKO: '제품과 프로세스의 디지털 미러링을 통해 시뮬레이션과 최적화를 가능하게 하는 기술.', defEN: 'Digital mirroring of products/processes for simulation and optimization.' },
                { term: 'Semantic Hub', defKO: '표준화된 데이터에 메타데이터를 추가하여 관리, 정보 검색, 또는 지식 관리와 관련된 기능.', defEN: 'Manages metadata on standardized data for search and knowledge management.' },
                { term: 'BPDM', defKO: '(Business Partner Data Management) 비즈니스 파트너 데이터를 관리하고 표준화하는 기술.', defEN: 'Technology for managing and standardizing Business Partner Data.' },
                { term: 'Interoperability', defKO: '다양한 시스템 간 상호운용성을 보장하여 원활한 데이터 교환이 가능하게 하는 기술.', defEN: 'Technology ensuring smooth data exchange between diverse systems.' },
                { term: 'Certificate', defKO: '인증서를 제공하여 데이터 교환 시 신뢰성을 보장하는 기능.', defEN: 'Feature providing certificates to ensure trust during data exchange.' },
                { term: 'SD Factory', defKO: '데이터 교환 및 처리 과정에서 표준화된 데이터 관리 기능을 제공.', defEN: 'Provides standardized data management functions during data exchange and processing.' },
                { term: 'IDC Discovery', defKO: 'International Data Connector(IDC)를 검색하는 기능.', defEN: 'Feature to search for International Data Connectors (IDC).' },
                { term: 'BPN Discovery', defKO: 'Business Partner Network(BPN)를 검색하는 기능.', defEN: 'Feature to search for Business Partner Networks (BPN).' },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{language === 'KO' ? '데이터스페이스 용어 사전' : 'DataSpace Glossary'}</h2>
                <p className="text-slate-500">{language === 'KO' ? '생태계를 이해하는 데 필요한 핵심 용어와 솔루션' : 'Essential terminology and solutions for the ecosystem'}</p>
            </div>
            
            <div className="space-y-8">
                {glossaryItems.map((group, idx) => (
                    <div key={idx}>
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="h-px flex-1 bg-slate-200"></div>
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 bg-white px-4 py-1 rounded-full border border-slate-200 shadow-sm">
                                {idx === 0 && <Shield className="w-4 h-4 text-blue-500" />}
                                {idx === 1 && <Leaf className="w-4 h-4 text-emerald-500" />}
                                {idx === 2 && <RefreshCw className="w-4 h-4 text-orange-500" />}
                                {idx === 3 && <Cpu className="w-4 h-4 text-purple-500" />}
                                {group.category}
                            </h3>
                            <div className="h-px flex-1 bg-slate-200"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.items.map((item, i) => (
                                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-2 relative z-10 group-hover:text-blue-600 transition-colors">
                                        {item.term}
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed relative z-10">
                                        {language === 'KO' ? item.defKO : item.defEN}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 relative">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            {sections.map(section => (
                <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                        activeSection === section.id 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-white text-slate-500 hover:bg-slate-100'
                    }`}
                >
                    {section.icon}
                    {section.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm min-h-[600px]">
            {activeSection === 'comparison' && renderComparison()}
            {activeSection === 'security' && renderSecurity()}
            {activeSection === 'semantic' && renderSemantic()}
            {activeSection === 'metadata' && renderMetadata()}
            {activeSection === 'federated' && renderFederated()}
            {activeSection === 'governance' && renderGovernance()}
            {activeSection === 'exchange' && renderExchange()}
            {activeSection === 'architecture' && renderArchitecture()}
            {activeSection === 'onboarding' && renderOnboarding()}
            {activeSection === 'features' && renderFeatures()}
            {activeSection === 'legal' && renderLegal()}
            {activeSection === 'glossary' && renderGlossary()}
        </div>
    </div>
  );
};

export default Guideline;
