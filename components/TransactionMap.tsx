
import React, { useState, useEffect } from 'react';
import { Building2, Server, ShieldCheck, Zap, Database, Globe, Info, Activity, Radio, Cpu, X, Signal, Map as MapIcon, Navigation, Lock, FileText, CheckCircle2, BadgeCheck, Search, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SECTOR_LABELS, lookupOrg, sectorOf } from '../directory';
import type { Sector } from '../directory';
import OrgProfileModal from './OrgProfileModal';

interface MapNode {
  id: string;
  x: number;
  y: number;
  label: string;
  subLabel?: string;
  type: string;
  color: string;
  status: string;
  throughput: string;
  partners: number;
  description: string;
  isHighlighted?: boolean;
  activeCompanies?: string[]; // Added for the modal feature
}

// --- DATA: GLOBAL VIEW ---
const GLOBAL_NODES: MapNode[] = [
  { 
    id: 'KR-HUB', 
    x: 82, y: 42, // Korea position on World Map
    label: 'Korea DataSpace (KR)', 
    type: 'hub', 
    color: '#3b82f6', // Blue
    status: 'Operational',
    throughput: '18.5 GB/s',
    partners: 156,
    description: 'Asia-Pacific Root CA & Identity Provider (DAPS). Central hub for K-Manufacturing data exchange.',
    isHighlighted: true,
    // Expanded Data for KR-HUB
    activeCompanies: [
        // Semiconductor and electronics
        'Samsung Electronics', 'SK hynix', 'SK Siltron', 'Samsung Electro-Mechanics',
        'LG Electronics', 'LG Display', 'LG Innotek',
        // Automotive
        'Hyundai Motor', 'Kia', 'Hyundai Mobis', 'HL Mando', 'Hyundai WIA', 'Hyundai Transys',
        // Battery and materials
        'LG Energy Solution', 'Samsung SDI', 'SK On', 'EcoPro BM',
        'POSCO', 'POSCO Future M', 'Hyundai Steel', 'Korea Zinc',
        // Chemicals
        'LG Chem', 'Lotte Chemical', 'Hanwha Solutions', 'Kumho Petrochemical',
        // Shipbuilding, heavy industry and machinery
        'HD Hyundai Heavy Industries', 'Hanwha Ocean', 'Samsung Heavy Industries',
        'Doosan Enerbility', 'HD Hyundai Infracore', 'Hyundai Rotem', 'Hyosung Heavy Industries',
        'Doosan Robotics', 'Hyundai Robotics', 'Rainbow Robotics', 'LS Electric',
        // Energy
        'KEPCO', 'SK Energy', 'S-OIL', 'GS Caltex', 'KOGAS',
        // ICT and industrial AI
        'Naver', 'Naver Cloud', 'Kakao', 'Kakao Enterprise', 'Samsung SDS', 'LG CNS',
        'SK AX', 'KT', 'SK Telecom', 'AhnLab', 'Hancom', 'onepredict', 'MakinaRocks',
        // Logistics
        'HMM', 'CJ Logistics', 'Pan Ocean', 'Hanjin Transportation', 'Busan Port Authority',
        // Aerospace and defence
        'Korean Air', 'Korea Aerospace Industries', 'Hanwha Aerospace', 'LIG Nex1',
        // Bio and construction
        'Samsung Biologics', 'Celltrion', 'Samsung C&T', 'Hyundai E&C',
        // Research institutes
        'KIST', 'ETRI', 'KITECH', 'KETI', 'KIMS', 'KERI', 'KIMM', 'KRISS', 'KISTI',
        'KIER', 'KRICT', 'KIOST',
        // Public agencies and universities
        'KIAT', 'KEIT', 'KOTRA', 'NIPA', 'KISA',
        'Korea Institute of Robot Industry Advancement',
        'DGIST', 'UNIST'
    ]
  },
  { 
    id: 'JP-NODE', 
    x: 88, y: 52, // Japan - Moved down/right to avoid overlap
    label: 'Uranos Ecosystem (JP)', 
    type: 'partner', 
    color: '#ef4444', // Red
    status: 'Active',
    throughput: '6.8 GB/s',
    partners: 42,
    description: 'Japan industrial data ecosystem. Connected via Gaia-X trust framework.',
    activeCompanies: ['Toyota', 'Denso', 'Fanuc', 'Sony', 'Mitsubishi', 'Hitachi', 'Softbank']
  },
  { 
    id: 'EU-NODE', 
    x: 52, y: 32, // Europe - Centralized
    label: 'Catena-X Node (EU)', 
    type: 'partner', 
    color: '#10b981', // Emerald
    status: 'Active',
    throughput: '8.2 GB/s',
    partners: 89,
    description: 'European automotive data gateway. Compliance enforcement for GDPR/PCF.',
    // Updated EU companies list based on Certified Partners Portfolio
    activeCompanies: [
        'Korea', // Requested explicitly
        'SAP', 'Siemens', 'T-Systems', 'BMW Group', 'Cofinity-X',
        'Bosch', 'BASF', 'Fraunhofer ISST', 'MHP', 'NTT DATA',
        'AWS', 'Denso', 'IBM', 'Sovity', 'Ipoint', 'Capgemini',
        'Glassdome', 'Kinaxis', 'Circularise', 'e2open', 'Mercedes-Benz',
        'ZF', 'Continental', 'BearingPoint', 'S-Oil'
    ]
  },
  { 
    id: 'US-NODE', 
    x: 28, y: 42, // US - Moved right to avoid legend overlap, better geo position
    label: 'Manufacturing-X (US)', 
    type: 'partner', 
    color: '#8b5cf6', // Purple
    status: 'Active',
    throughput: '9.1 GB/s',
    partners: 65,
    description: 'North American industrial connector hub. High-frequency IoT stream aggregation.',
    activeCompanies: ['Tesla', 'General Motors', 'Ford', 'NVIDIA', 'Intel', 'Microsoft', 'AWS', 'Google Cloud']
  },
  { 
    id: 'SG-HUB', 
    x: 76, y: 65, // Singapore
    label: 'Logistics Hub (SG)', 
    type: 'infra', 
    color: '#f59e0b', // Amber
    status: 'Syncing',
    throughput: '4.5 GB/s',
    partners: 34,
    description: 'Southeast Asia logistics data relay point. Supply chain event visualization.',
    activeCompanies: ['PSA Singapore', 'Grab', 'Shopee', 'Singtel', 'Sea Group']
  },
];

const GLOBAL_LINKS = [
  { id: 'l1', from: 'KR-HUB', to: 'EU-NODE', traffic: 'High' },
  { id: 'l2', from: 'KR-HUB', to: 'US-NODE', traffic: 'Medium' },
  { id: 'l3', from: 'KR-HUB', to: 'SG-HUB', traffic: 'High' },
  { id: 'l4', from: 'US-NODE', to: 'EU-NODE', traffic: 'Low' },
  { id: 'l5', from: 'KR-HUB', to: 'JP-NODE', traffic: 'Medium' }, 
  { id: 'l6', from: 'US-NODE', to: 'JP-NODE', traffic: 'Low' }, 
];

// --- DATA: KOREA VIEW ---
// Adjusted to fit reasonably within the "Zoomed In" area of the World Map background
// Seoul shifted right to avoid legend overlap
const KOREA_NODES: MapNode[] = [
    { 
      id: 'SEOUL-HQ', x: 50, y: 22, label: 'Korea HQ (Seoul)', type: 'hub', color: '#3b82f6', 
      status: 'Active', throughput: '5.2 GB/s', partners: 50, description: 'Main Control Tower & ID Provider.',
      activeCompanies: [
        'Korea', 'KOTRA', 'KETI', 'KIST', 'KISA', 'NIPA',
        'KITECH', 'KIAT', 'KEIT',
        'Naver Cloud', 'onepredict', 'MakinaRocks',
        'HYUNDAI', 'KIA', 'LG', 'SK', 'SAMSUNG',
      ]
    },
    { 
      id: 'PANGYO-RD', x: 55, y: 30, label: 'R&D Center (Pangyo)', type: 'infra', color: '#8b5cf6', 
      status: 'Active', throughput: '3.1 GB/s', partners: 20, description: 'AI Model Training & Verification.',
      activeCompanies: [
        'Kakao', 'NCSOFT', 'Nexon', 'SK Planet', 'AhnLab', 'Hancom',
        'Kakao Mobility', 'Naver Cloud',
        'KETI', 'Gyeonggi Business & Science Accelerator', 'Pangyo Techno Valley'
      ]
    },
    { 
      id: 'GUMI-ELEC', x: 58, y: 52, label: 'Electronics Cluster (Gumi)', type: 'partner', color: '#ef4444', 
      status: 'Maintenance', throughput: '2.0 GB/s', partners: 18, description: 'Semiconductor & Display Parts.',
      activeCompanies: [
        'Samsung Electronics Gumi', 'LG Electronics', 'LG Display', 'LG Innotek',
        'SK Siltron', 'Toray Advanced Materials', 'Korea Aerospace Industries',
        'Gumi Electronics & Information Technology Research Institute',
        'KICOX Daegu-Gyeongbuk', 'Kumoh National Institute of Technology'
      ]
    },
    { 
      id: 'DAEGU-NODE', x: 65, y: 60, label: 'Future Mobility (Daegu)', type: 'partner', color: '#10b981', 
      status: 'Active', throughput: '4.1 GB/s', partners: 25, description: 'Robotics & Auto Parts Innovation Hub.',
      activeCompanies: [
        'SL Corporation', 'PHC', 'Daedong', 'Iljin', 'Rainbow Robotics',
        'Hyundai Robotics',
        'Korea Institute of Robot Industry Advancement', 'DGIST',
        'Daegu Technopark', 'Daegu Mechatronics & Materials Institute'
      ]
    },
    { 
      id: 'ULSAN-FAC', x: 78, y: 68, label: 'Smart Factory (Ulsan)', type: 'partner', color: '#10b981', 
      status: 'Active', throughput: '8.5 GB/s', partners: 35, description: 'Auto-parts Manufacturing Hub.',
      activeCompanies: [
        'Hyundai Motor Ulsan', 'HD Hyundai Heavy Industries', 'Hyundai Mobis',
        'S-OIL', 'SK Energy', 'Lotte Chemical', 'Hyundai Transys',
        'Ulsan Technopark', 'UNIST', 'Ulsan Institute'
      ]
    },
    { 
      id: 'CHANGWON-MACH', x: 70, y: 76, label: 'Machinery Cluster (Changwon)', type: 'partner', color: '#8b5cf6', 
      status: 'Active', throughput: '6.4 GB/s', partners: 42, description: 'Machinery, power generation and defence manufacturing. Korea\'s first smart industrial complex pilot.',
      activeCompanies: [
        'Doosan Enerbility', 'Hyundai Rotem', 'Hyundai WIA', 'HD Hyundai Infracore',
        'Hanwha Aerospace', 'Hyosung Heavy Industries', 'LG Electronics',
        'KERI', 'KIMS'
      ]
    },
    { 
      id: 'BUSAN-PORT', x: 82, y: 80, label: 'Logistics Port (Busan)', type: 'infra', color: '#f59e0b', 
      status: 'Active', throughput: '4.2 GB/s', partners: 15, description: 'Import/Export Logistics Tracking.',
      activeCompanies: [
        'HMM', 'Busan Port Authority', 'CJ Logistics', 'SM Line', 'Pan Ocean',
        'Hanjin Transportation',
        'Busan Technopark', 'KIOST', 'Korea Maritime & Ocean University'
      ]
    },
];

const KOREA_LINKS = [
    { id: 'k1', from: 'SEOUL-HQ', to: 'PANGYO-RD', traffic: 'High' },
    { id: 'k2', from: 'SEOUL-HQ', to: 'ULSAN-FAC', traffic: 'High' }, // Long haul
    { id: 'k3', from: 'ULSAN-FAC', to: 'BUSAN-PORT', traffic: 'High' },
    { id: 'k4', from: 'PANGYO-RD', to: 'GUMI-ELEC', traffic: 'Medium' },
    { id: 'k5', from: 'GUMI-ELEC', to: 'DAEGU-NODE', traffic: 'Medium' },
    { id: 'k6', from: 'DAEGU-NODE', to: 'ULSAN-FAC', traffic: 'High' },
    { id: 'k7', from: 'DAEGU-NODE', to: 'CHANGWON-MACH', traffic: 'Medium' },
    { id: 'k8', from: 'CHANGWON-MACH', to: 'BUSAN-PORT', traffic: 'High' },
];

// Mock Live Transactions for Sidebar
const MOCK_LIVE_TXS = [
    { hash: '0x7a...9f', from: 'LG Energy (KR)', to: 'BMW (EU)', asset: 'Battery PCF', status: 'Verifying', type: 'Cross-Border' },
    { hash: '0xb2...1c', from: 'POSCO (KR)', to: 'Samsung (KR)', asset: 'Quality Cert', status: 'Success', type: 'Domestic' },
    { hash: '0x9c...4d', from: 'Tesla (US)', to: 'Hyundai (KR)', asset: 'Robot Logs', status: 'Processing', type: 'Cross-Border' },
    { hash: '0x1d...ee', from: 'Hanwha (KR)', to: 'Grid Ops (SG)', asset: 'Solar Output', status: 'Success', type: 'Cross-Border' },
];

// --- I18N: Korean copy for module-level data (data itself stays English so that
// ids, types, statuses and asset names remain valid lookup/comparison literals) ---
// Node names stay English in both languages: they are proper nouns.
const NODE_TEXT_KO: Record<string, { description?: string; status?: string }> = {
  'KR-HUB': {
    status: '정상 운영',
    description: '아시아·태평양 루트 CA 및 신원 제공자(DAPS). 국내 제조 데이터 교환의 중심 허브입니다.',
  },
  'JP-NODE': {
    status: '운영 중',
    description: '일본 산업 데이터 생태계. Gaia-X 신뢰 프레임워크를 통해 연결되어 있습니다.',
  },
  'EU-NODE': {
    status: '운영 중',
    description: '유럽 자동차 산업 데이터 게이트웨이. GDPR/PCF 준수 여부를 관리합니다.',
  },
  'US-NODE': {
    status: '운영 중',
    description: '북미 산업용 커넥터 허브. 고빈도 IoT 스트림을 집계합니다.',
  },
  'SG-HUB': {
    status: '동기화 중',
    description: '동남아시아 물류 데이터 중계 거점. 공급망 이벤트를 시각화합니다.',
  },
  'SEOUL-HQ': {
    status: '운영 중',
    description: '중앙 관제 타워 및 ID 제공자.',
  },
  'PANGYO-RD': {
    status: '운영 중',
    description: 'AI 모델 학습 및 검증.',
  },
  'GUMI-ELEC': {
    status: '점검 중',
    description: '반도체 및 디스플레이 부품.',
  },
  'DAEGU-NODE': {
    status: '운영 중',
    description: '로보틱스 및 자동차 부품 혁신 허브.',
  },
  'ULSAN-FAC': {
    status: '운영 중',
    description: '자동차 부품 제조 허브.',
  },
  'CHANGWON-MACH': {
    status: '운영 중',
    description: '기계·발전설비·방위산업 제조 거점. 1974년 조성된 창원국가산업단지를 기반으로 하며, 국내 첫 스마트산단 시범단지입니다.',
  },
  'BUSAN-PORT': {
    status: '운영 중',
    description: '수출입 물류 추적.',
  },
};

const TX_ASSET_KO: Record<string, string> = {
  'Battery PCF': '배터리 PCF',
  'Quality Cert': '품질 인증서',
  'Robot Logs': '로봇 로그',
  'Solar Output': '태양광 발전량',
};

const TX_STATUS_KO: Record<string, string> = {
  'Verifying': '검증 중',
  'Success': '완료',
  'Processing': '처리 중',
  'Anchoring': '앵커링 중',
};

const getNodeLabel = (node: MapNode, language: string): string =>
  node.label;

const getNodeDescription = (node: MapNode, language: string): string =>
  (language === 'KO' && NODE_TEXT_KO[node.id]?.description) || node.description;

const getNodeStatus = (node: MapNode, language: string): string =>
  (language === 'KO' && NODE_TEXT_KO[node.id]?.status) || node.status;

const getTxAsset = (asset: string, language: string): string =>
  (language === 'KO' && TX_ASSET_KO[asset]) || asset;

const getTxStatus = (status: string, language: string): string =>
  (language === 'KO' && TX_STATUS_KO[status]) || status;

const TransactionMap: React.FC = () => {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'GLOBAL' | 'KOREA'>('GLOBAL');
  const [liveTxs, setLiveTxs] = useState(MOCK_LIVE_TXS);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false); // Modal State
  // Directory filters, and the member whose profile is open
  const [companyQuery, setCompanyQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<Sector | 'All'>('All');
  const [openOrg, setOpenOrg] = useState<string | null>(null);

  // Switch Data based on view mode
  const currentNodes = viewMode === 'GLOBAL' ? GLOBAL_NODES : KOREA_NODES;
  const currentLinks = viewMode === 'GLOBAL' ? GLOBAL_LINKS : KOREA_LINKS;
  
  // Background Image - World Map for both
  // We will use CSS transforms to "zoom in" on Korea when in Korea mode
  const bgImage = "vendor-images/photo-1451187580459-43490279c0fa-w2000.jpg";

  // Simulate incoming transactions
  useEffect(() => {
    const interval = setInterval(() => {
        setLiveTxs(prev => {
            const newTx = { ...MOCK_LIVE_TXS[Math.floor(Math.random() * MOCK_LIVE_TXS.length)] };
            newTx.hash = '0x' + Math.random().toString(16).substr(2, 8) + '...';
            const statuses = ['Verifying', 'Success', 'Processing', 'Anchoring'];
            newTx.status = statuses[Math.floor(Math.random() * statuses.length)];
            return [newTx, ...prev.slice(0, 6)];
        });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Visual Map Area */}
        <div className="lg:col-span-3 bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl group transition-all duration-500">
            
            {/* View Toggle Buttons */}
            <div className="absolute top-6 right-6 z-40 flex bg-slate-900/90 backdrop-blur rounded-lg p-1 border border-slate-700 shadow-lg">
                <button 
                    onClick={() => { setViewMode('GLOBAL'); setSelectedNode(null); }}
                    className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                        viewMode === 'GLOBAL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Globe className="w-3 h-3" /> {language === 'KO' ? '글로벌' : 'Global'}
                </button>
                <button 
                    onClick={() => { setViewMode('KOREA'); setSelectedNode(null); }}
                    className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                        viewMode === 'KOREA' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Navigation className="w-3 h-3" /> {language === 'KO' ? '국내' : 'Korea'}
                </button>
            </div>

            {/* Background Map Image */}
            <div className="absolute inset-0 z-0 transition-opacity duration-700 bg-slate-950 overflow-hidden">
                <img 
                    src={bgImage} 
                    alt={language === 'KO' ? '지도 배경' : 'Map Background'}
                    // Adjusted scale and opacity for better visibility of the map itself
                    className={`w-full h-full object-cover transition-transform duration-1000 mix-blend-normal ${viewMode === 'GLOBAL' ? 'scale-100 opacity-80' : 'scale-[3] opacity-60 grayscale origin-[82%_38%]'}`}
                />
                {/* Dark Overlay Gradient - Lighter at top to show map */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                {/* Grid Overlay - lighter */}
                <div className="absolute inset-0 bg-noise opacity-5"></div>
            </div>

            {/* Radar Scan Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[10px] bg-emerald-500/10 blur-2xl animate-[scan_8s_linear_infinite_reverse] rotate-45"></div>
            </div>
            <style>{`
                @keyframes scan {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>

            {/* Header / Legend */}
            <div className="absolute top-6 left-6 z-30 pointer-events-none max-w-[250px]">
                <h3 className="text-white font-bold text-xl flex items-center gap-3 drop-shadow-md">
                    <div className="p-2 bg-blue-600/20 border border-blue-500/50 rounded-lg backdrop-blur-md">
                        {viewMode === 'GLOBAL' ? <Globe className="w-6 h-6 text-blue-400" /> : <MapIcon className="w-6 h-6 text-blue-400" />}
                    </div>
                    {language === 'KO' ? '실시간 데이터 생태계 맵' : 'Real-time Data Ecosystem Map'}
                </h3>
                <div className="flex flex-col gap-2 mt-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/50 pointer-events-auto">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                        </span>
                        {language === 'KO' ? '신뢰 앵커' : 'Trust Anchor'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                        {language === 'KO' ? '파트너 노드' : 'Partner Node'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                        {language === 'KO' ? '인프라 노드' : 'Infra Node'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 pt-1 border-t border-slate-700">
                        <Lock className="w-3 h-3 text-blue-400" />
                        EDC {language === 'KO' ? '보안 연결' : 'Secured Link'}
                    </div>
                </div>
            </div>

            {/* SVG Layer for Links - Using 0-100 coordinate system for perfect alignment */}
            <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="linkGradient" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Curved Links */}
                {currentLinks.map((link) => {
                    const source = currentNodes.find(n => n.id === link.from)!;
                    const target = currentNodes.find(n => n.id === link.to)!;
                    
                    const x1 = source.x;
                    const y1 = source.y;
                    const x2 = target.x;
                    const y2 = target.y;

                    // Quadratic Bezier Curve
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2 - (viewMode === 'KOREA' ? 5 : 10); // Less curve for Korea map
                    const pathD = `M${x1},${y1} Q${midX},${midY} ${x2},${y2}`;

                    return (
                        <g key={link.id} className="opacity-60 hover:opacity-100 transition-opacity duration-300">
                            {/* Static Path */}
                            <path 
                                d={pathD} 
                                stroke="url(#linkGradient)" 
                                strokeWidth="0.3" 
                                fill="none"
                                strokeDasharray="1 1"
                            />
                            {/* Animated Particle */}
                            <circle r="0.4" fill="#ffffff" filter="url(#glow)">
                                <animateMotion dur={`${Math.random() * 2 + 2}s`} repeatCount="indefinite" path={pathD} rotate="auto">
                                    <mpath href={`#path-${link.id}`} />
                                </animateMotion>
                            </circle>
                        </g>
                    );
                })}
            </svg>

            {/* HTML Layer for Interactive Nodes - Z-Index 20 ensures they are above map */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {currentNodes.map((node) => (
                    <div 
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group pointer-events-auto"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onClick={() => setSelectedNode(node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        {/* Highlight Ring for Special Nodes (e.g., Korea Hub) */}
                        {node.isHighlighted && (
                            <div className="absolute inset-0 rounded-full animate-ping border-4 border-blue-500/50 opacity-75 scale-150"></div>
                        )}

                        {/* Pulse Ring */}
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${selectedNode?.id === node.id ? 'bg-white' : ''}`} style={{ backgroundColor: node.color }}></div>
                        
                        {/* Main Dot */}
                        <div 
                            className={`w-4 h-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-transform duration-300 group-hover:scale-125 ${selectedNode?.id === node.id ? 'scale-150 ring-4 ring-white/20' : ''}`}
                            style={{ backgroundColor: node.color }}
                        ></div>

                        {/* Label (Always Visible or on Hover) - REMOVED EDC BADGES */}
                        <div className={`absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 flex flex-col items-center ${
                            hoveredNode === node.id || selectedNode?.id === node.id || node.isHighlighted ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'
                        }`}>
                            <span className={`text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10 ${node.isHighlighted ? 'border-blue-400 text-blue-100' : ''}`}>
                                {getNodeLabel(node, language)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Node Detail Card (Floating) */}
            {selectedNode && (
                <div className="absolute bottom-6 left-6 z-50 w-80 animate-slideUp">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: selectedNode.color }}></div>
                        
                        {/* Close Button */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }}
                            className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                                <Server className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg leading-tight">{getNodeLabel(selectedNode, language)}</h4>
                                <span className="text-[10px] text-slate-400 font-mono uppercase">{selectedNode.type} {language === 'KO' ? '노드' : 'Node'}</span>
                            </div>
                        </div>

                        {/* Korea Manufacturing-X Certified Badge - MOVED BELOW HEADER */}
                        {selectedNode.id === 'KR-HUB' && (
                            <div className="mb-4 bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg animate-pulse">
                                <BadgeCheck className="w-4 h-4" />
                                Korea Manufacturing-X {language === 'KO' ? '인증' : 'Certified'}
                            </div>
                        )}

                        {selectedNode.subLabel && selectedNode.id !== 'KR-HUB' && (
                            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded px-3 py-1.5 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-100">{selectedNode.subLabel}</span>
                            </div>
                        )}

                        <p className="text-xs text-slate-300 mb-4 leading-relaxed border-b border-white/10 pb-4">
                            {getNodeDescription(selectedNode, language)}
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                                <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-[10px] uppercase font-bold">
                                    <Activity className="w-3 h-3" /> {language === 'KO' ? '처리량' : 'Throughput'}
                                </div>
                                <div className="text-sm font-mono text-emerald-400">{selectedNode.throughput}</div>
                            </div>
                            <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                                <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-[10px] uppercase font-bold">
                                    <Building2 className="w-3 h-3" /> {language === 'KO' ? '파트너' : 'Partners'}
                                </div>
                                <div className="text-sm font-mono text-blue-400">{selectedNode.partners}{language === 'KO' ? '개 활성' : ' Active'}</div>
                            </div>
                            <div className="bg-black/30 p-2 rounded-lg border border-white/5 col-span-2">
                                <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-[10px] uppercase font-bold">
                                    <Signal className="w-3 h-3" /> {language === 'KO' ? '네트워크 상태' : 'Network Status'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-sm text-white">{getNodeStatus(selectedNode, language)} {language === 'KO' ? '(가동률 99.99%)' : '(99.99% Uptime)'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Connected Companies List - MORE BUTTON FEATURE */}
                        {selectedNode.activeCompanies && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h5 className="text-[10px] text-slate-400 uppercase font-bold mb-2 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" /> {language === 'KO' ? '연결된 기관' : 'Connected Entities'}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {selectedNode.activeCompanies.slice(0, 4).map((company, idx) => (
                                        <span key={idx} className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-300 hover:bg-white/20 transition-colors cursor-default">
                                            {company}
                                        </span>
                                    ))}
                                    {selectedNode.activeCompanies.length > 4 && (
                                        <button 
                                            onClick={() => { setCompanyQuery(''); setSectorFilter('All'); setOpenOrg(null); setShowCompanyModal(true); }}
                                            className="text-[10px] bg-blue-600/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1"
                                        >
                                            +{selectedNode.activeCompanies.length - 4}{language === 'KO' ? '개 더보기' : ' More'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {openOrg && (
            <OrgProfileModal
                name={openOrg}
                nodeLabel={selectedNode ? getNodeLabel(selectedNode, language) : undefined}
                onClose={() => setOpenOrg(null)}
            />
        )}

        {/* --- COMPANY LIST POPUP MODAL --- */}
        {showCompanyModal && selectedNode && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-scaleUp relative flex flex-col max-h-[80vh]">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{getNodeLabel(selectedNode, language)}</h2>
                                <p className="text-xs text-slate-400">{language === 'KO' ? '생태계 파트너 • ' : 'Ecosystem Partners • '}{selectedNode.activeCompanies?.length}{language === 'KO' ? '개 기관' : ' Entities'}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowCompanyModal(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {(() => {
                        const isKo = language === 'KO';
                        const members: string[] = selectedNode.activeCompanies ?? [];
                        // Only offer sectors this node actually has, so no chip is ever empty.
                        const sectors: Sector[] = Array.from(new Set<Sector>(members.map(sectorOf)))
                            .sort((a, b) => SECTOR_LABELS[a][isKo ? 'ko' : 'en'].localeCompare(SECTOR_LABELS[b][isKo ? 'ko' : 'en']));
                        const countBySector = (sec: Sector) => members.filter((m) => sectorOf(m) === sec).length;
                        const q = companyQuery.trim().toLowerCase();
                        const shown = members.filter((m) => {
                            if (sectorFilter !== 'All' && sectorOf(m) !== sectorFilter) return false;
                            if (!q) return true;
                            const org = lookupOrg(m);
                            // Search both names, so Korean typing finds an English record.
                            return [m, org?.nameKo, org?.summary, org?.summaryKo]
                                .filter(Boolean).join(' ').toLowerCase().includes(q);
                        });

                        return (
                            <>
                                <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3 shrink-0">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={companyQuery}
                                            onChange={(e) => setCompanyQuery(e.target.value)}
                                            placeholder={isKo ? '기업·기관 검색...' : 'Search organisations...'}
                                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                                        />
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            onClick={() => setSectorFilter('All')}
                                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                                                sectorFilter === 'All'
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                                            }`}
                                        >
                                            {isKo ? '전체' : 'All'} <span className="opacity-60">{members.length}</span>
                                        </button>
                                        {sectors.map((sec) => (
                                            <button
                                                key={sec}
                                                onClick={() => setSectorFilter(sec)}
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                                                    sectorFilter === sec
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300'
                                                }`}
                                            >
                                                {SECTOR_LABELS[sec][isKo ? 'ko' : 'en']} <span className="opacity-60">{countBySector(sec)}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                                    {shown.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-12">
                                            {isKo ? '조건에 맞는 기업·기관이 없습니다.' : 'No organisation matches those filters.'}
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {shown.map((company) => {
                                                const org = lookupOrg(company);
                                                const sec = sectorOf(company);
                                                return (
                                                    <button
                                                        key={company}
                                                        type="button"
                                                        onClick={() => setOpenOrg(company)}
                                                        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                                                            {company.charAt(0)}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <h4 className="font-bold text-slate-800 text-sm truncate">
                                                                {isKo ? (org?.nameKo || company) : company}
                                                            </h4>
                                                            <p className="text-[10px] text-slate-500 truncate">{SECTOR_LABELS[sec][isKo ? 'ko' : 'en']}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()}

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
                        <button 
                            onClick={() => setShowCompanyModal(false)}
                            className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                        >
                            {language === 'KO' ? '목록 닫기' : 'Close List'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Live Feed Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    {t('ov_live_feed')}
                </h3>
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{language === 'KO' ? '실시간' : 'Real-time'}</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
                {liveTxs.map((tx, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-all animate-fadeIn flex flex-col gap-2 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] group cursor-pointer hover:border-blue-200">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${tx.type === 'Cross-Border' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {tx.type === 'Cross-Border' ? <Globe className="w-3 h-3" /> : <Radio className="w-3 h-3" />}
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded group-hover:bg-white group-hover:text-blue-500 transition-colors">{tx.hash}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                tx.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                tx.status === 'Verifying' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                                {getTxStatus(tx.status, language)}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs mt-1">
                             <div className="flex items-center gap-1.5 text-slate-700 font-bold truncate max-w-[40%]">
                                 {tx.from}
                             </div>
                             <div className="flex-1 mx-2 h-px bg-slate-200 relative">
                                <div className="absolute right-0 -top-1 text-slate-300">►</div>
                             </div>
                             <div className="flex items-center gap-1.5 text-slate-700 font-bold truncate max-w-[40%] justify-end">
                                 {tx.to}
                             </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-50">
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Database className="w-3 h-3" />
                                {getTxAsset(tx.asset, language)}
                            </div>
                            <div className="text-[9px] text-slate-400">12ms {language === 'KO' ? '지연' : 'latency'}</div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button 
                    onClick={() => setShowLedgerModal(true)}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 w-full"
                >
                    {language === 'KO' ? '전체 원장 보기' : 'View Full Ledger'} <Activity className="w-3 h-3" />
                </button>
            </div>
        </div>

        {/* --- FULL LEDGER MODAL --- */}
        {showLedgerModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
                <div className="bg-slate-950 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-800 animate-scaleUp h-[80vh] flex flex-col">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <Activity className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{language === 'KO' ? '실시간 트랜잭션 원장' : 'Live Transaction Ledger'}</h2>
                                <p className="text-xs text-slate-400 font-mono">{language === 'KO' ? '합의 알고리즘: IBFT 2.0 • 블록 생성 주기: 2s' : 'Consensus: IBFT 2.0 • Block Time: 2s'}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowLedgerModal(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-hidden relative">
                        {/* Background Matrix Rain Effect Simulation */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" 
                             style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(32, 255, 77, .1) 25%, rgba(32, 255, 77, .1) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .1) 75%, rgba(32, 255, 77, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 77, .1) 25%, rgba(32, 255, 77, .1) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .1) 75%, rgba(32, 255, 77, .1) 76%, transparent 77%, transparent)', backgroundSize: '30px 30px'}}>
                        </div>

                        <div className="h-full overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-700">
                            <table className="w-full text-left text-sm font-mono text-slate-300">
                                <thead className="bg-slate-900/90 sticky top-0 z-10 border-b border-slate-800 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4">{language === 'KO' ? '트랜잭션 해시' : 'Tx Hash'}</th>
                                        <th className="px-6 py-4">{language === 'KO' ? '블록' : 'Block'}</th>
                                        <th className="px-6 py-4">{language === 'KO' ? '보내는 곳' : 'From'}</th>
                                        <th className="px-6 py-4">{language === 'KO' ? '받는 곳' : 'To'}</th>
                                        <th className="px-6 py-4">{language === 'KO' ? '페이로드' : 'Payload'}</th>
                                        <th className="px-6 py-4 text-right">{language === 'KO' ? '상태' : 'Status'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {/* Generate more mock rows for the modal */}
                                    {Array.from({length: 20}).map((_, i) => (
                                        <tr key={i} className="hover:bg-slate-800/50 transition-colors animate-fadeIn" style={{animationDelay: `${i * 50}ms`}}>
                                            <td className="px-6 py-3 text-blue-400">0x{Math.random().toString(16).substr(2, 10)}...</td>
                                            <td className="px-6 py-3 text-slate-500">#{154002 + i}</td>
                                            <td className="px-6 py-3 truncate max-w-[150px]">{['Hyundai', 'LGES', 'Samsung', 'POSCO', 'SK On'][i % 5]}</td>
                                            <td className="px-6 py-3 truncate max-w-[150px]">{['BMW', 'Tesla', 'Volkswagen', 'GM', 'Ford'][i % 5]}</td>
                                            <td className="px-6 py-3 text-slate-400 truncate max-w-[200px]">
                                                {['PCF_Report_v2.json', 'Battery_Passport.xml', 'Quality_Log.csv', 'Audit_Trail.pdf'][i % 4]}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    {language === 'KO' ? '확정 완료' : 'CONFIRMED'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                        <span>{language === 'KO' ? '동기화 상태: 100%' : 'Sync Status: 100%'}</span>
                        <div className="flex gap-4">
                            <span>{language === 'KO' ? '피어: 142' : 'Peers: 142'}</span>
                            <span>TPS: 4,200</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default TransactionMap;
