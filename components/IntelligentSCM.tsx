
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Bot, MessageSquare, Search, FileText, CheckCircle2, Mic, Play, RefreshCw, Layers, ShieldCheck, Users, Briefcase, Award, Zap, GitGraph, Clock, ArrowRight, UserPlus, Factory, AlertTriangle, PenTool, Brain, Share2, Star, Database, Network, Info, Send, X, FileJson, Printer, Download, BarChart3, TrendingUp, Package, Fingerprint, Car, Cpu, Shirt, Box, ChevronRight, Lock, FileSignature, Globe, Scale, Lightbulb, Microscope, BadgeCheck, Sparkles, History, Building2, ShoppingCart, Activity, AlertOctagon, ClipboardList, PackageCheck, Repeat, Timer, TrendingDown, Filter, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, AreaChart, Area, ComposedChart, Treemap } from 'recharts';

// --- I18N HELPER (Mechanism 2) ---
const tx = (lang: string, ko: string, en: string) => (lang === 'KO' ? ko : en);

// --- MOCK DATA ---
const getExperts = (lang: string) => [
    { id: 1, name: tx(lang, '김민수 (Kim Min-su)', 'Kim Min-su'), role: tx(lang, '사출 성형 전문가', 'Injection Molding Specialist'), ex: tx(lang, 'Ex-Samsung (20년)', 'Ex-Samsung (20 yrs)'), skill: tx(lang, '불량 분석, 수율 최적화', 'Defect Analysis, Yield Optimization'), status: 'Available', score: 98, cost: '$150/hr' },
    { id: 2, name: tx(lang, '이지영 (Lee Ji-young)', 'Lee Ji-young'), role: tx(lang, '회로 설계 마스터', 'Circuit Design Master'), ex: tx(lang, 'Ex-LG (15년)', 'Ex-LG (15 yrs)'), skill: tx(lang, 'PCB 레이아웃, 신호 무결성', 'PCB Layout, Signal Integrity'), status: 'Busy', score: 95, cost: '$200/hr' },
    { id: 3, name: tx(lang, '박정윤 (Park Jung-yoon)', 'Park Jung-yoon'), role: tx(lang, '자동화 엔지니어', 'Automation Engineer'), ex: tx(lang, 'Ex-Hyundai (18년)', 'Ex-Hyundai (18 yrs)'), skill: tx(lang, 'PLC, 로봇 제어', 'PLC, Robot Control'), status: 'Available', score: 92, cost: '$180/hr' },
];

const getBomQuality = (lang: string) => [
    {
        name: 'Motor',
        rate: 99.8,
        supplier: 'S-Tech',
        risk: 'Low',
        reason: tx(lang, '12개월 연속 고수율 유지', '12 consecutive months of high yield'),
        details: tx(lang, '코일 권선 공정 자동화로 불량률 0.02% 달성. 진동/소음 테스트 전수 검사 통과.', 'Automated coil winding brought the defect rate down to 0.02%. Passed 100% inspection on vibration and noise tests.'),
        action: tx(lang, '현행 유지 및 장기 공급 계약 검토', 'Maintain current status and review a long-term supply agreement')
    },
    {
        name: 'Gearbox',
        rate: 95.2,
        supplier: 'K-Gear',
        risk: 'Medium',
        reason: tx(lang, '간헐적 공차 이탈 발생', 'Intermittent tolerance deviations'),
        details: tx(lang, '3번 라인 기어 호빙 머신 정밀도 저하 감지됨. 치수 오차가 허용 범위를 상회하는 빈도 증가.', 'Precision loss detected on the Line 3 gear hobbing machine. Dimensional errors exceed the allowed range more frequently.'),
        action: tx(lang, '3번 라인 설비 오버홀 및 전수 치수 검사 실시 요청', 'Request a Line 3 equipment overhaul and 100% dimensional inspection')
    },
    {
        name: 'Controller',
        rate: 98.5,
        supplier: 'ChipSol',
        risk: 'Low',
        reason: tx(lang, 'ISO 26262 인증 공정', 'ISO 26262 certified process'),
        details: tx(lang, 'PCB 솔더링 공정 AI 비전 검사 도입으로 신뢰성 향상. 열충격 테스트 내구도 우수.', 'AI vision inspection on the PCB soldering line improved reliability. Excellent durability in thermal shock testing.'),
        action: tx(lang, '표준 부품 지정 및 안전 재고 확대', 'Designate as a standard part and expand safety stock')
    },
    {
        name: 'Casing',
        rate: 92.1,
        supplier: 'MoldPlus',
        risk: 'High',
        reason: tx(lang, '냉각 사이클 불안정 감지됨', 'Unstable cooling cycle detected'),
        details: tx(lang, '사출 성형 시 금형 냉각수 온도 편차로 인한 치수 변형 발생. 원재료 수분 함유량 과다 의심.', 'Mold coolant temperature deviation during injection molding is causing dimensional distortion. Excessive raw-material moisture is suspected.'),
        action: tx(lang, '공급사 현장 감사(Audit) 및 원재료 건조 공정 개선 명령', 'Order an on-site supplier audit and improvements to the raw-material drying process')
    },
];

// Diverse Nodes for Digital Twin (Tier 1-4)
const getEcosystemNodes = (lang: string) => [
    { id: 1, name: tx(lang, '현대모비스 (Tier 1)', 'Hyundai Mobis (Tier 1)'), grade: 'S', score: 98, status: 'Optimal', type: tx(lang, '모듈', 'Module') },
    { id: 2, name: tx(lang, 'HL만도 (Tier 2)', 'HL Mando (Tier 2)'), grade: 'A', score: 92, status: 'Good', type: tx(lang, '샤시', 'Chassis') },
    { id: 3, name: tx(lang, '포스코 (Tier 3)', 'POSCO (Tier 3)'), grade: 'S', score: 96, status: 'Optimal', type: tx(lang, '원자재', 'Raw Material') },
    { id: 4, name: tx(lang, 'LG화학 (Tier 4)', 'LG Chem (Tier 4)'), grade: 'A', score: 94, status: 'Good', type: tx(lang, '화학 소재', 'Chemical') },
    { id: 5, name: tx(lang, '한온시스템 (Tier 2)', 'Hanon Systems (Tier 2)'), grade: 'B', score: 88, status: 'Warning', type: tx(lang, '열관리', 'Thermal') },
    { id: 6, name: tx(lang, '삼성SDI (Tier 1)', 'Samsung SDI (Tier 1)'), grade: 'S', score: 99, status: 'Optimal', type: tx(lang, '배터리', 'Battery') },
];

const getSuggestedQuestions = (lang: string) => lang === 'KO' ? [
    "최근 발생한 품질 이슈 리포트 보여줘",
    "공급망 리스크가 가장 높은 업체는 어디야?",
    "Tier 2 업체의 탄소 배출량 현황 알려줘",
    "긴급 자재 수급을 위한 대체 공급사는?",
    "다음 분기 수요 예측 기반 발주량 추천해줘"
] : [
    "Show me a report on recent quality issues",
    "Which supplier carries the highest supply chain risk?",
    "What are the carbon emissions of our Tier 2 suppliers?",
    "Which alternative suppliers can cover an urgent material shortage?",
    "Recommend order volumes based on next quarter's demand forecast"
];

// --- INDUSTRIES & PRODUCTS DATA ---
const getIndustries = (lang: string) => [
    {
        id: 'AUTO',
        label: tx(lang, '자동차 (Automotive)', 'Automotive'),
        icon: Car,
        color: 'bg-blue-100 text-blue-600',
        products: lang === 'KO'
            ? ['EV 배터리 모듈', '구동 모터 어셈블리', '샤시 프레임', '인포테인먼트 시스템']
            : ['EV Battery Module', 'Traction Motor Assembly', 'Chassis Frame', 'Infotainment System']
    },
    {
        id: 'ELEC',
        label: tx(lang, '전자 (Electronics)', 'Electronics'),
        icon: Cpu,
        color: 'bg-purple-100 text-purple-600',
        products: lang === 'KO'
            ? ['PCB 메인보드', 'OLED 디스플레이 패널', '카메라 모듈', '전력 반도체']
            : ['PCB Mainboard', 'OLED Display Panel', 'Camera Module', 'Power Semiconductor']
    },
    {
        id: 'SHIP',
        label: tx(lang, '조선 (Shipbuilding)', 'Shipbuilding'),
        icon: Anchor,
        color: 'bg-cyan-100 text-cyan-600',
        products: lang === 'KO'
            ? ['LNG 선박 엔진', '프로펠러 샤프트', '선박용 후판', '항해 통신 장비']
            : ['LNG Vessel Engine', 'Propeller Shaft', 'Marine Heavy Plate', 'Navigation & Comms Equipment']
    },
];

// --- EVALUATION TARGETS ---
const getEvalTargets = (lang: string) => [
    { id: 'S1', name: tx(lang, '미래 테크 (Tier 2)', 'Mirae Tech (Tier 2)'), industry: tx(lang, '전자', 'Electronics') },
    { id: 'S2', name: tx(lang, '강철 정밀 (Tier 3)', 'Gangchul Precision (Tier 3)'), industry: tx(lang, '자동차', 'Automotive') },
    { id: 'S3', name: tx(lang, '오션 파츠 (Tier 1)', 'Ocean Parts (Tier 1)'), industry: tx(lang, '조선', 'Shipbuilding') },
];

// --- FORECASTING MOCK DATA ---
const DEMAND_FORECAST_DATA = [
    { month: 'Jan', actual: 4000, forecast: 4000, legacy: 3500 },
    { month: 'Feb', actual: 3000, forecast: 3100, legacy: 3800 },
    { month: 'Mar', actual: 2000, forecast: 1900, legacy: 3000 },
    { month: 'Apr', actual: 2780, forecast: 2800, legacy: 2200 },
    { month: 'May', actual: 1890, forecast: 1950, legacy: 2500 },
    { month: 'Jun', actual: 2390, forecast: 2400, legacy: 2000 },
    { month: 'Jul', actual: null, forecast: 3490, legacy: 2800 },
    { month: 'Aug', actual: null, forecast: 4000, legacy: 3100 },
    { month: 'Sep', actual: null, forecast: 4200, legacy: 3300 },
];

// NOTE: `status` values ('Excess' | 'Shortage' | 'Optimal') are comparison literals - never translate them.
const getInventoryOptimizationData = (lang: string) => [
    { name: tx(lang, '전자 모듈', 'Elec. Module'), current: 1500, optimal: 1000, status: 'Excess', action: 'Reduce Order' },
    { name: tx(lang, '하우징', 'Housing'), current: 200, optimal: 500, status: 'Shortage', action: 'Urgent Order' },
    { name: tx(lang, '커넥터', 'Connectors'), current: 5000, optimal: 4800, status: 'Optimal', action: 'Maintain' },
    { name: tx(lang, '디스플레이', 'Display'), current: 800, optimal: 800, status: 'Optimal', action: 'Maintain' },
];

// MOCK SUPPLIERS FOR RECOMMENDATION
// NOTE: `risk` values ('Low' | 'Medium') are comparison literals - only the rendered label is mapped.
const getRecommendedSuppliers = (lang: string) => [
    { id: 1, name: 'Alpha Tech', score: 98, tag: tx(lang, '최고 품질', 'Best Quality'), match: '99%', risk: 'Low', location: tx(lang, '한국', 'Korea'), price: '$$$' },
    { id: 2, name: 'Beta Mfg', score: 94, tag: tx(lang, '가격 경쟁력', 'Cost Effective'), match: '92%', risk: 'Low', location: tx(lang, '베트남', 'Vietnam'), price: '$' },
    { id: 3, name: 'Gamma Ind', score: 88, tag: tx(lang, '신속 납기', 'Fast Delivery'), match: '85%', risk: 'Medium', location: tx(lang, '중국', 'China'), price: '$$' },
];

function Anchor(props: any) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
    )
}

// --- REPORT TYPES ---
type ReportType = 'CONTRACT' | 'ORDER' | 'QUALITY_ANALYSIS' | 'SUPPLIER_EVAL' | 'EO_IMPACT' | 'CHAT_RESULT' | 'EXPERT_CONNECT' | 'INVENTORY_REPORT' | 'BOM_FULL_REPORT' | 'FORECAST_REPORT' | 'SUPPLIER_RECOMMENDATION' | null;
type ConfigMode = 'CONTRACT' | 'ORDER' | 'EVAL' | null;

const IntelligentSCM: React.FC = () => {
    const { language } = useLanguage();
    const isKO = language === 'KO';
    // Local shorthand for mechanism-2 switching
    const T = (ko: string, en: string) => (isKO ? ko : en);

    // Language-aware mock data (module constants cannot read the hook)
    const EXPERTS = getExperts(language);
    const BOM_QUALITY = getBomQuality(language);
    const ECOSYSTEM_NODES = getEcosystemNodes(language);
    const SUGGESTED_QUESTIONS = getSuggestedQuestions(language);
    const INDUSTRIES = getIndustries(language);
    const EVAL_TARGETS = getEvalTargets(language);
    const INVENTORY_OPTIMIZATION_DATA = getInventoryOptimizationData(language);
    const RECOMMENDED_SUPPLIERS = getRecommendedSuppliers(language);

    // Display-only label maps: the stored literals stay in English (they are compared against)
    const riskLabel = (value: string) => isKO
        ? ({ Low: '낮음', Medium: '보통', High: '높음', None: '없음' } as Record<string, string>)[value] || value
        : value;
    const availabilityLabel = (value: string) => isKO
        ? ({ Available: '가능', Busy: '진행 중' } as Record<string, string>)[value] || value
        : value;
    const stockStatusLabel = (value: string) => isKO
        ? ({ Excess: '과잉', Shortage: '부족', Optimal: '적정' } as Record<string, string>)[value] || value
        : value;

    const [activeTab, setActiveTab] = useState<'AUTO' | 'QUALITY' | 'ECO' | 'STRATEGY' | 'FORECAST'>('AUTO');
    
    // UI States
    const [activeReport, setActiveReport] = useState<ReportType>(null);
    const [configMode, setConfigMode] = useState<ConfigMode>(null);
    const [reportData, setReportData] = useState<any>(null);

    // Configuration States
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null); // For Eval
    const [configStep, setConfigStep] = useState(1); 

    // 2.1 Chatbot State
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', content: string, contentEn?: string, action?: any, targetCompany?: string, targetCompanyEn?: string}[]>([
        {
            role: 'bot',
            content: '안녕하세요! 지능형 데이터 카탈로그 에이전트입니다. 무엇을 도와드릴까요?',
            contentEn: 'Hello! I am the Intelligent Data Catalog agent. How can I help you today?'
        }
    ]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // 2.2 Contract State
    const [contractStep, setContractStep] = useState(0);

    // 2.3 Order State
    const [orderStatus, setOrderStatus] = useState<'IDLE' | 'SYNCING' | 'COMPLETED'>('IDLE');

    // 4.1 Agent Eval State
    const [agentChatLog, setAgentChatLog] = useState<{sender: string, msg: string, msgEn?: string}[]>([
        {
            sender: 'System',
            msg: 'AI 에이전트 협상 프로토콜 대기 중...',
            msgEn: 'Waiting for the AI agent negotiation protocol...'
        }
    ]);
    
    // Inventory Simulation State
    const [invSimulationData, setInvSimulationData] = useState<any[]>([]);
    
    // Safety ref for interval
    const evalIntervalRef = useRef<any>(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (evalIntervalRef.current) clearInterval(evalIntervalRef.current);
        };
    }, []);

    // --- FEATURE 2.1: CHATBOT LOGIC ---
    const handleChatSubmit = (query?: string) => {
        const text = query || chatInput;
        if (!text.trim()) return;
        
        setChatHistory(prev => [...prev, { role: 'user', content: text }]);
        setChatInput('');

        setTimeout(() => {
            let responseMsg = '';
            let responseMsgEn = '';
            // Pick a random company for visualization (resolve the name in both languages)
            const randomIdx = Math.floor(Math.random() * ECOSYSTEM_NODES.length);
            const companyKo = getEcosystemNodes('KO')[randomIdx].name;
            const companyEn = getEcosystemNodes('EN')[randomIdx].name;

            // Default Action for ALL responses to show a report
            let actionData: { type: string; label: string; labelEn: string; query: string; queryEn: string } = {
                type: 'CHAT_RESULT',
                label: 'AI 분석 리포트 보기',
                labelEn: 'View AI Analysis Report',
                query: text,
                queryEn: text
            };

            // Matched in both languages: the suggested questions are localized,
            // so an English question has to reach the same branch as its Korean twin.
            const asks = (...terms: string[]) => terms.some(term => text.toLowerCase().includes(term.toLowerCase()));

            if (asks('불량', '품질', 'quality', 'defect')) {
                responseMsg = `지난달 불량률 분석 결과, "${companyKo}"의 부품에서 간헐적 공차 이탈이 발견되었습니다. 상세 품질 분석 리포트를 생성했습니다.`;
                responseMsgEn = `Last month's defect analysis found intermittent tolerance deviations in parts from "${companyEn}". A detailed quality analysis report has been generated.`;
                actionData.query = '품질 결함 분석 (Defect Analysis)';
                actionData.queryEn = 'Defect Analysis';
            } else if (asks('계약', '갱신', 'contract', 'renew')) {
                responseMsg = `현재 "${companyKo}"와의 공급 계약 갱신 시점이 도래했습니다. 표준 계약 초안 및 공급사 평가 보고서를 준비했습니다.`;
                responseMsgEn = `The supply contract with "${companyEn}" is now due for renewal. A standard contract draft and a supplier evaluation report are ready.`;
                actionData.query = '계약 갱신 검토 (Contract Review)';
                actionData.queryEn = 'Contract Review';
            } else {
                responseMsg = `"${text}"에 대한 데이터셋 14건을 찾았으며, "${companyKo}" 관련 공급망 인사이트를 분석했습니다.`;
                responseMsgEn = `Found 14 datasets matching "${text}" and analyzed the related supply chain insights for "${companyEn}".`;
            }

            setChatHistory(prev => [...prev, {
                role: 'bot',
                content: responseMsg,
                contentEn: responseMsgEn,
                action: actionData,
                targetCompany: companyKo,
                targetCompanyEn: companyEn
            }]);
        }, 1000);
    };

    const handleChatAction = (action: any) => {
        if (action.type === 'CHAT_RESULT') {
            const last = chatHistory[chatHistory.length - 1];
            const company = (isKO ? last.targetCompany : (last.targetCompanyEn || last.targetCompany)) || 'MoldPlus Inc.';
            setReportData({
                title: T('AI 인텔리전스 분석 리포트', 'AI Intelligence Analysis Report'),
                targetCompany: T('대상 업체: ', 'Target Company: ') + company,
                topic: isKO ? action.query : (action.queryEn || action.query),
                summary: T(
                    'AI가 1.2TB의 공급망 데이터를 분석했습니다. 귀하의 질의와 관련된 주요 패턴과 리스크 요인을 식별했습니다.',
                    'The AI analyzed 1.2TB of supply chain data and identified the key patterns and risk factors relevant to your query.'
                ),
                insights: [
                    { label: T('데이터 신뢰도', 'Data Confidence'), value: '98%' },
                    { label: T('시장 추세', 'Market Trend'), value: T('상승세', 'Upward') },
                    { label: T('리스크 점수', 'Risk Score'), value: T('낮음 (12/100)', 'Low (12/100)') }
                ],
                recommendation: T(
                    'Q3 재고 확보를 위한 선제적 발주 및 공급망 다변화를 권장합니다.',
                    'We recommend placing pre-emptive orders to secure Q3 inventory and diversifying the supply base.'
                ),
                chartData: isKO
                    ? [
                        { name: '월', value: 400 }, { name: '화', value: 300 }, { name: '수', value: 550 },
                        { name: '목', value: 450 }, { name: '금', value: 600 }
                    ]
                    : [
                        { name: 'Mon', value: 400 }, { name: 'Tue', value: 300 }, { name: 'Wed', value: 550 },
                        { name: 'Thu', value: 450 }, { name: 'Fri', value: 600 }
                    ]
            });
            setActiveReport('CHAT_RESULT');
        }
    };

    // --- CONFIGURATION HANDLERS ---
    const openConfigModal = (mode: ConfigMode) => {
        setConfigMode(mode);
        setConfigStep(1);
        setSelectedIndustry(null);
        setSelectedProduct(null);
        setSelectedSupplier(null);
    };

    const handleConfigConfirm = () => {
        setConfigMode(null); // Close modal
        if (configMode === 'CONTRACT') {
            runContractFlow();
        } else if (configMode === 'ORDER') {
            runOrderSync();
        } else if (configMode === 'EVAL') {
            runAgentEval();
        }
    };

    // --- FEATURE 2.2: AUTO CONTRACT ---
    const runContractFlow = () => {
        setContractStep(1);
        setTimeout(() => setContractStep(2), 1500); // AI Review
        setTimeout(() => setContractStep(3), 3000); // Signed
        setTimeout(() => {
            setReportData({
                contractId: `CTR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                industry: selectedIndustry ? INDUSTRIES.find(i => i.id === selectedIndustry)?.label : T('일반', 'General'),
                product: selectedProduct || T('표준 부품', 'Standard Part'),
                parties: T('Korea (구매자) <-> S-Tech (공급자)', 'Korea (Buyer) <-> S-Tech (Supplier)'),
                terms: T('LME 지수 연동 변동 가격제', 'Floating pricing indexed to the LME'),
                clause: T(
                    '제 4.2조: 24시간 이상 납기 지연 시 자동 위약금 부과',
                    'Article 4.2: An automatic penalty applies to any delivery delayed by more than 24 hours.'
                ),
                status: T('전자 서명 완료 (DID 앵커링)', 'Electronically signed (DID anchored)'),
                reasoning: T(
                    'AI 분석 결과: ESG 점수(92점) 및 납기 준수율(99.8%) 최우수 업체로 선정됨. 공급 리스크가 가장 낮음.',
                    'AI analysis: selected as the top supplier on ESG score (92) and on-time delivery rate (99.8%), with the lowest supply risk of the candidates.'
                ),
                supplierScore: 92
            });
            setActiveReport('CONTRACT');
        }, 3500);
    };

    const resetContract = () => {
        setContractStep(0);
    }

    // --- FEATURE 2.3: MULTI-TIER ORDER ---
    const runOrderSync = () => {
        setOrderStatus('SYNCING');
        setTimeout(() => {
            setOrderStatus('COMPLETED');
            setReportData({
                orderId: `PO-SYNC-${Math.floor(Math.random() * 10000)}`,
                industry: selectedIndustry ? INDUSTRIES.find(i => i.id === selectedIndustry)?.label : T('일반', 'General'),
                targetProduct: selectedProduct || T('모듈', 'Module'),
                items: [
                    { tier: 'Tier 1', supplier: T('현대모비스', 'Hyundai Mobis'), part: T('모듈 A', 'Module A'), status: T('수신확인', 'Acknowledged'), sn: 'SN-A-001', eta: 'D+2' },
                    { tier: 'Tier 2', supplier: T('현대위아', 'Hyundai Wia'), part: T('기어 세트', 'Gear Set'), status: T('수신확인', 'Acknowledged'), sn: 'SN-B-102', eta: 'D+1' },
                    { tier: 'Tier 3', supplier: 'POSCO', part: T('강철 코일', 'Steel Coil'), status: T('수신확인', 'Acknowledged'), sn: 'SN-C-882', eta: T('준비완료', 'Ready') }
                ],
                totalQty: 5000,
                syncTime: '1.2s',
                optimization: T(
                    'AI 최적화 경로를 통해 전체 리드타임 14% 단축 예상.',
                    'The AI-optimized route is expected to cut total lead time by 14%.'
                )
            });
            setActiveReport('ORDER');
        }, 3000);
    };

    const resetOrder = () => {
        setOrderStatus('IDLE');
    }

    // --- EXPERT CONNECT ---
    const handleExpertConnect = (expert: any) => {
        setReportData({
            expertName: expert.name,
            role: expert.role,
            matchScore: expert.score,
            skills: expert.skill,
            experience: expert.ex,
            rate: expert.cost,
            reasoning: T(
                `최근 검색하신 "사출 성형 불량" 키워드와 98% 일치합니다. ${expert.name}님은 ${expert.ex} 분야에서 유사 문제 해결 경험이 풍부합니다.`,
                `A 98% match with your recent search for "injection molding defects". ${expert.name} brings deep experience solving similar problems at ${expert.ex}.`
            ),
            contractTerms: T('표준 자문 계약 (NDA 포함)', 'Standard advisory agreement (NDA included)'),
            radar: [
                { subject: T('기술 적합성', 'Technical Fit'), A: expert.score, fullMark: 100 },
                { subject: T('가용성', 'Availability'), A: expert.status === 'Available' ? 100 : 50, fullMark: 100 },
                { subject: T('비용 효율', 'Cost Efficiency'), A: 85, fullMark: 100 },
                { subject: T('경력', 'Experience'), A: 95, fullMark: 100 },
                { subject: T('평판', 'Reputation'), A: 90, fullMark: 100 },
            ]
        });
        setActiveReport('EXPERT_CONNECT');
    };

    // --- BOM ANALYSIS ---
    const handleBOMDetail = (item: any) => {
        setReportData({
            title: T('부품 품질 정밀 분석', 'Component Quality Deep-Dive'),
            target: `${item.name} (${item.supplier})`,
            metric: T(`합격률: ${item.rate}%`, `Pass rate: ${item.rate}%`),
            rootCause: item.details || item.reason, // Use detailed reason
            riskLevel: item.risk,
            recommendation: item.action || (item.risk === 'High'
                ? T('공급사 현장 감사 및 시정 조치(CAPA) 요청', 'Request an on-site supplier audit and corrective action (CAPA)')
                : T('현행 모니터링 유지', 'Continue current monitoring')),
            trendData: [
                { name: T('1주차', 'Week 1'), value: item.rate - 2 }, { name: T('2주차', 'Week 2'), value: item.rate - 1 },
                { name: T('3주차', 'Week 3'), value: item.rate + 1 }, { name: T('4주차', 'Week 4'), value: item.rate }
            ],
            contractImpact: T(
                '제 7.2조 (품질 보증) 위반 소지 있음. 페널티 검토 필요.',
                'Possible breach of Article 7.2 (Quality Assurance). Penalty review required.'
            )
        });
        setActiveReport('QUALITY_ANALYSIS');
    };

    const handleBomFullReport = () => {
        // Mock data for BOM Full Report
        const data = {
            totalItems: 420,
            avgYield: "97.8%",
            riskItems: 3,
            supplierCount: 15,
            defectTrend: [
                { name: 'M-5', rate: 1.2 }, { name: 'M-4', rate: 1.5 }, { name: 'M-3', rate: 0.8 },
                { name: 'M-2', rate: 2.1 }, { name: 'M-1', rate: 2.2 } // Decreasing defects
            ],
            treeData: [
                { name: T('파워트레인', 'Powertrain'), size: 1200, color: '#3b82f6' },
                { name: T('샤시', 'Chassis'), size: 800, color: '#10b981' },
                { name: T('전장', 'Electronics'), size: 600, color: '#8b5cf6' },
                { name: T('차체', 'Body'), size: 400, color: '#f59e0b' },
                { name: T('내장', 'Interior'), size: 300, color: '#64748b' }
            ],
            topRisks: [
                { id: 'P-102', name: 'Casing', reason: T('치수 오차', 'Dimension Error'), supplier: 'MoldPlus', severity: 'High' },
                { id: 'E-221', name: 'PCB Board', reason: T('솔더링 불량', 'Solder Defect'), supplier: 'ChipSol', severity: 'Medium' },
                { id: 'G-303', name: 'Gearbox', reason: T('진동 이상', 'Vibration'), supplier: 'K-Gear', severity: 'Medium' }
            ]
        };
        setReportData(data);
        setActiveReport('BOM_FULL_REPORT');
    };

    // --- INVENTORY OPTIMIZATION REPORT ---
    const handleInventoryClick = (item: any) => {
        // Generate mock trend data for the chart
        const simulationData = [];
        let stock = item.current;
        const days = 30;
        for (let i = 0; i < days; i++) {
            const consumption = Math.floor(Math.random() * 50) + 20;
            stock -= consumption;
            if (i === 15 && item.status === 'Shortage') stock += 500; // Simulate replenishment
            simulationData.push({
                day: `D+${i+1}`,
                stock: Math.max(0, stock),
                optimal: item.optimal,
                safety: item.optimal * 0.2
            });
        }
        setInvSimulationData(simulationData);

        setReportData({
            itemName: item.name,
            current: item.current,
            optimal: item.optimal,
            status: item.status,
            action: item.action,
            leadTime: T('3일', '3 Days'),
            consumptionRate: T('일 35개', '35 units/day'),
            nextOrder: T('2024-05-28 (권장)', '2024-05-28 (Recommended)'),
            trendData: simulationData,
            aiInsight: item.status === 'Excess'
                ? T(
                    '출하를 통합하여 재고 유지 비용을 12% 절감할 것을 권장합니다.',
                    'Consolidation of shipments recommended to reduce holding costs by 12%.'
                  )
                : T(
                    '긴급: 4일 내 재고 소진이 예상됩니다. Tier 2 공급사를 통해 긴급 발주를 실행하세요.',
                    'Urgent: Run-out predicted in 4 days. Execute expedited order via Tier 2 supplier.'
                  )
        });
        setActiveReport('INVENTORY_REPORT');
    };

    const simulateDemandSpike = () => {
        if (!reportData) return;
        // Adjust simulation data for a demand spike
        const spikedData = invSimulationData.map((d, i) => {
            if (i > 5) return { ...d, stock: Math.max(0, d.stock - (i * 10)) }; // Accelerate depletion
            return d;
        });
        setInvSimulationData(spikedData);
        setReportData({
            ...reportData,
            trendData: spikedData,
            aiInsight: T(
                '경고: 수요 +20% 급증 시뮬레이션 결과 D+12에 재고가 소진됩니다. 즉시 보충 발주가 필요합니다.',
                'Warning: Simulated +20% demand spike leads to stockout on D+12. Immediate replenishment required.'
            )
        });
    };

    // --- FORECASTING REPORT (NEW) ---
    const handleForecastClick = () => {
        setReportData({
            title: T('AI 수요 예측 분석', 'Demand Forecasting AI Analysis'),
            metrics: {
                mape: { before: "15%", after: "2.1%" },
                stockout: { before: T('연 4회', '4 events/yr'), after: T('연 0회', '0 events/yr') },
                inventory: { before: "$1.2M", after: "$0.8M" }
            },
            data: DEMAND_FORECAST_DATA
        });
        setActiveReport('FORECAST_REPORT');
    };

    // --- SUPPLIER RECOMMENDATION REPORT (NEW) ---
    const handleSupplierRecommendation = () => {
        setReportData({
            title: T('AI 최적 협력사 소싱', 'AI Optimal Supplier Sourcing'),
            candidates: 1420,
            qualified: 24,
            shortlist: 3,
            criteria: isKO
                ? ['비용 효율', '품질 인증', 'ESG 점수', '납기 속도']
                : ['Cost Efficiency', 'Quality Certs', 'ESG Score', 'Delivery Speed'],
            suppliers: RECOMMENDED_SUPPLIERS,
            comparisonData: [
                { attribute: T('품질', 'Quality'), alpha: 98, beta: 90, gamma: 88, full: 100 },
                { attribute: T('비용', 'Cost'), alpha: 80, beta: 98, gamma: 90, full: 100 },
                { attribute: T('납기', 'Delivery'), alpha: 95, beta: 85, gamma: 99, full: 100 },
                { attribute: 'ESG', alpha: 92, beta: 88, gamma: 85, full: 100 },
                { attribute: T('리스크', 'Risk'), alpha: 95, beta: 92, gamma: 80, full: 100 },
            ]
        });
        setActiveReport('SUPPLIER_RECOMMENDATION');
    };

    // --- AI AGENT EVALUATION ---
    const runAgentEval = () => {
        if (evalIntervalRef.current) clearInterval(evalIntervalRef.current);

        const evalTarget = selectedSupplier || T('평가 대상', 'Target');
        setAgentChatLog([{
            sender: 'System',
            msg: `${evalTarget} 대상 AI 평가 시작...`,
            msgEn: `Starting AI evaluation of ${evalTarget}...`
        }]);
        const sequence = [
            { sender: 'Buyer Bot', msg: '보유 역량 증빙 자료 요청 중...', msgEn: 'Requesting evidence of capabilities...' },
            { sender: 'Supplier Bot', msg: 'ISO 9001 인증서 제출 완료.', msgEn: 'ISO 9001 certificate submitted.' },
            { sender: 'Supplier Bot', msg: '1분기 생산 수율 로그 제출...', msgEn: 'Submitting Q1 production yield logs...' },
            { sender: 'Buyer Bot', msg: '블록체인을 통한 문서 진위 검증 중...', msgEn: 'Verifying document authenticity on the blockchain...' },
            { sender: 'Buyer Bot', msg: '분석 완료. 신용 등급 및 기술 점수 산출됨.', msgEn: 'Analysis complete. Credit rating and technical score calculated.' }
        ];
        let i = 0;
        
        evalIntervalRef.current = setInterval(() => {
            if (i >= sequence.length) {
                if (evalIntervalRef.current) clearInterval(evalIntervalRef.current);
                setReportData({
                    supplier: selectedSupplier || 'MoldPlus Inc.',
                    grade: 'A-',
                    score: 92,
                    strengths: isKO
                        ? ['가격 경쟁력 우수', '친환경 공정 인증']
                        : ['Outstanding price competitiveness', 'Certified eco-friendly process'],
                    weaknesses: isKO
                        ? ['납기 일관성 다소 부족']
                        : ['Somewhat inconsistent delivery performance'],
                    radar: [
                        { subject: T('품질', 'Quality'), A: 90, fullMark: 100 },
                        { subject: T('비용', 'Cost'), A: 95, fullMark: 100 },
                        { subject: T('납기', 'Delivery'), A: 80, fullMark: 100 },
                        { subject: 'ESG', A: 98, fullMark: 100 },
                        { subject: T('기술력', 'Technology'), A: 85, fullMark: 100 },
                    ]
                });
                setActiveReport('SUPPLIER_EVAL');
                return;
            }
            
            const nextMsg = sequence[i];
            if (nextMsg) {
                setAgentChatLog(prev => [...prev, nextMsg]);
            }
            i++;
        }, 1000);
    };

    const runEOSimulation = () => {
        setReportData({
            eoId: 'EO-24-05-002',
            change: T('재질 변경 (Steel -> Aluminum)', 'Material Change (Steel -> Aluminum)'),
            stockImpact: [
                { date: T('5월 10일', 'May 10'), stock: 4500, status: T('안전', 'Safe') },
                { date: T('5월 11일', 'May 11'), stock: 3200, status: T('안전', 'Safe') },
                { date: T('5월 12일', 'May 12'), stock: 100, status: T('위험', 'Critical') }, // Run-out
                { date: T('5월 13일', 'May 13'), stock: 0, status: T('소진', 'Depleted') },
            ],
            optimalDate: T('5월 13일, 08:00 AM', 'May 13, 08:00 AM'),
            costSaving: T('$12,500 (폐기 비용 절감)', '$12,500 (scrap cost avoided)'),
            // Updated with Supply Chain Map companies - Explicitly matching Recommended Suppliers
            suppliers: RECOMMENDED_SUPPLIERS.map(s => ({ ...s, role: T('대체 공급사', 'Alternative Supplier') })),
            // AI Comparison Data
            processMap: {
                manual: isKO
                    ? ['설계 변경 통보 (이메일)', '수동 재고 확인', '공급사 유선 연락', '발주서 수정', '리스크: 높음']
                    : ['Engineering Change Notice (Email)', 'Manual Stock Check', 'Supplier Call', 'PO Update', 'Risk: High'],
                ai: isKO
                    ? ['자동 감지', '실시간 재고 동기화', '스마트 계약 갱신', '자동 물량 조정', '리스크: 없음']
                    : ['Auto-Detection', 'Real-time Stock Sync', 'Smart Contract Update', 'Auto-Balancing', 'Risk: None']
            },
            impactMetrics: {
                time: { before: T('5일', '5 Days'), after: T('2시간', '2 Hours') },
                cost: { before: "$15,000", after: "$2,500" },
                risk: { before: T('높음 (라인 정지)', 'High (Line Stop)'), after: T('낮음 (무중단)', 'Low (Seamless)') }
            }
        });
        setActiveReport('EO_IMPACT');
    };

    // --- MODAL: CONFIGURATION (WIZARD) ---
    const renderConfigModal = () => {
        if (!configMode) return null;

        const isEval = configMode === 'EVAL';

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp relative">
                    <button onClick={() => setConfigMode(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    
                    <div className="p-8">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                {configMode === 'CONTRACT'
                                    ? T('계약 조건 설정', 'Contract Terms Setup')
                                    : configMode === 'ORDER'
                                        ? T('동시 발주 설정', 'Simultaneous Order Setup')
                                        : T('AI 평가 대상 설정', 'AI Evaluation Target Setup')}
                            </h2>
                            <p className="text-slate-500 text-sm">
                                {T('프로세스를 시작하기 위해 대상을 선택해주세요.', 'Select a target to start the process.')}
                            </p>
                        </div>

                        {/* Step Indicators */}
                        <div className="flex justify-center items-center gap-4 mb-8">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${configStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                            <div className="w-10 h-0.5 bg-slate-200"></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${configStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                            <div className="w-10 h-0.5 bg-slate-200"></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${configStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
                        </div>

                        {/* Step 1: Industry Selection */}
                        {configStep === 1 && (
                            <div className="grid grid-cols-1 gap-3 animate-fadeIn">
                                {INDUSTRIES.map(ind => (
                                    <button
                                        key={ind.id}
                                        onClick={() => { setSelectedIndustry(ind.id); setConfigStep(2); }}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                                    >
                                        <div className={`p-3 rounded-lg ${ind.color} group-hover:scale-110 transition-transform`}>
                                            <ind.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{ind.label}</h4>
                                            <p className="text-xs text-slate-500">{T('선택하여 세부 품목/업체 보기', 'Select to view products and suppliers')}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-blue-500" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Product or Supplier Selection */}
                        {configStep === 2 && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="flex items-center gap-2 mb-2">
                                    <button onClick={() => setConfigStep(1)} className="text-sm text-slate-400 hover:text-slate-600">&larr; {T('뒤로', 'Back')}</button>
                                    <span className="text-sm font-bold text-slate-900">/ {isEval ? T('평가 대상 업체 선택', 'Select supplier to evaluate') : T('대상 품목 선택', 'Select target product')}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {isEval ? (
                                        EVAL_TARGETS.map((target, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => { setSelectedSupplier(target.name); setConfigStep(3); }}
                                                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                            >
                                                <span className="font-medium text-slate-800">{target.name}</span>
                                                <span className="text-xs text-slate-500">{target.industry}</span>
                                            </button>
                                        ))
                                    ) : (
                                        INDUSTRIES.find(i => i.id === selectedIndustry)?.products.map((prod, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => { setSelectedProduct(prod); setConfigStep(3); }}
                                                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                            >
                                                <span className="font-medium text-slate-800">{prod}</span>
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirmation & Visual */}
                        {configStep === 3 && (
                            <div className="text-center animate-fadeIn">
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">{T('설정 요약', 'Configuration Summary')}</h4>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-500">{T('산업군', 'Industry')}</span>
                                        <span className="font-bold text-slate-900">{INDUSTRIES.find(i => i.id === selectedIndustry)?.label}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">{isEval ? T('대상 업체', 'Target Supplier') : T('대상 품목', 'Target Product')}</span>
                                        <span className="font-bold text-blue-600">{isEval ? selectedSupplier : selectedProduct}</span>
                                    </div>
                                    
                                    {/* Visual Representation */}
                                    <div className="mt-6 flex justify-center items-center gap-4 text-xs text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <Database className="w-8 h-8 text-slate-300 mb-1" />
                                            <span>{T('설정 완료', 'Setup Complete')}</span>
                                        </div>
                                        <div className="flex-1 h-px bg-slate-300 relative">
                                            <div className="absolute -top-1 left-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Bot className="w-8 h-8 text-blue-500 mb-1" />
                                            <span className="text-blue-600 font-bold">{T('AI 에이전트', 'AI Agent')}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleConfigConfirm}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                                    {T('프로세스 시작', 'Start Process')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // --- MODAL: REPORT VISUALIZATION ---
    const renderReportModal = () => {
        if (!activeReport || !reportData) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp flex flex-col max-h-[90vh] relative">
                    
                    {/* Animated Stamp Style */}
                    <style>{`
                        @keyframes stamp {
                            0% { opacity: 0; transform: scale(2) rotate(-10deg); }
                            100% { opacity: 1; transform: scale(1) rotate(-10deg); }
                        }
                    `}</style>

                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {activeReport === 'CONTRACT' && <FileSignature className="w-6 h-6 text-blue-600" />}
                            {activeReport === 'ORDER' && <Network className="w-6 h-6 text-emerald-600" />}
                            {activeReport === 'QUALITY_ANALYSIS' && <Microscope className="w-6 h-6 text-red-600" />}
                            {activeReport === 'SUPPLIER_EVAL' && <Award className="w-6 h-6 text-yellow-500" />}
                            {activeReport === 'EO_IMPACT' && <GitGraph className="w-6 h-6 text-orange-600" />}
                            {activeReport === 'CHAT_RESULT' && <Brain className="w-6 h-6 text-purple-600" />}
                            {activeReport === 'EXPERT_CONNECT' && <Briefcase className="w-6 h-6 text-indigo-600" />}
                            {activeReport === 'INVENTORY_REPORT' && <Package className="w-6 h-6 text-cyan-600" />}
                            {activeReport === 'BOM_FULL_REPORT' && <Layers className="w-6 h-6 text-teal-600" />}
                            {activeReport === 'FORECAST_REPORT' && <TrendingUp className="w-6 h-6 text-pink-600" />}
                            {activeReport === 'SUPPLIER_RECOMMENDATION' && <Target className="w-6 h-6 text-blue-600" />}
                            
                            {activeReport === 'CONTRACT' && T('스마트 계약 체결 리포트', 'Smart Contract Execution Report')}
                            {activeReport === 'ORDER' && T('동시 발주(Sync) 리포트', 'Simultaneous Order (Sync) Report')}
                            {activeReport === 'QUALITY_ANALYSIS' && T('품질 정밀 분석 리포트', 'Quality Deep-Dive Report')}
                            {activeReport === 'SUPPLIER_EVAL' && T('AI 공급사 평가 리포트', 'AI Supplier Evaluation Report')}
                            {activeReport === 'EO_IMPACT' && T('설계 변경(EO) 영향도 분석', 'Engineering Order (EO) Impact Analysis')}
                            {activeReport === 'CHAT_RESULT' && T('AI 인텔리전스 분석', 'AI Intelligence Analysis')}
                            {activeReport === 'EXPERT_CONNECT' && T('전문가 매칭 계약서', 'Expert Matching Agreement')}
                            {activeReport === 'INVENTORY_REPORT' && T('재고 최적화 및 수요 예측', 'Inventory Optimization & Demand Forecast')}
                            {activeReport === 'BOM_FULL_REPORT' && T('BOM 통합 품질 대시보드', 'Integrated BOM Quality Dashboard')}
                            {activeReport === 'FORECAST_REPORT' && T('AI 수요 예측 비교 분석', 'AI Demand Forecast Comparison')}
                            {activeReport === 'SUPPLIER_RECOMMENDATION' && T('AI 최적 협력사 추천 리포트', 'AI Optimal Supplier Recommendation Report')}
                        </h3>
                        <button onClick={() => setActiveReport(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                    </div>
                    
                    <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50 relative">
                        
                        {/* Certified Stamp Animation - Moved lower to top-24 to avoid overlapping */}
                        <div className="absolute top-24 right-8 z-10 pointer-events-none" style={{ animation: 'stamp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards', opacity: 0 }}>
                            <div className="w-28 h-28 border-4 border-blue-700 rounded-full flex items-center justify-center p-1 opacity-80">
                                <div className="w-full h-full border-2 border-blue-700 rounded-full flex flex-col items-center justify-center text-blue-700 font-bold uppercase text-xs tracking-widest bg-blue-700/5 rotate-[-12deg]">
                                    <span>Korea</span>
                                    <span className="text-lg">Verified</span>
                                    <span>AI Cert</span>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Content based on Report Type */}
                        
                        {activeReport === 'FORECAST_REPORT' && (
                            <div className="space-y-6">
                                {/* Header / Summary */}
                                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                    <h2 className="text-2xl font-bold mb-2">{T('AI 수요 예측 분석', 'AI Demand Forecasting Analysis')}</h2>
                                    <p className="opacity-90 text-sm">{T('기존 수작업 방식과 AI 기반 예측의 성능 비교', 'Comparing Legacy (Manual) vs. AI-Driven Forecasting Performance')}</p>

                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                                            <span className="block text-xs uppercase opacity-70 font-bold">{T('정확도 개선', 'Accuracy Improvement')}</span>
                                            <span className="text-2xl font-bold flex items-center gap-2">
                                                +12.9% <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                                            <span className="block text-xs uppercase opacity-70 font-bold">{T('재고 비용', 'Inventory Cost')}</span>
                                            <span className="text-2xl font-bold flex items-center gap-2">
                                                -33% <TrendingDown className="w-4 h-4" />
                                            </span>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                                            <span className="block text-xs uppercase opacity-70 font-bold">{T('결품 발생', 'Stockout Events')}</span>
                                            <span className="text-2xl font-bold flex items-center gap-2">
                                                0 <span className="text-sm font-normal opacity-70">{T('/ 연간', '/ Year')}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Chart */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-pink-600" />
                                        {T('기존 방식 대비 AI 예측 정확도', 'Legacy vs AI Forecast Accuracy')}
                                    </h4>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={reportData.data}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="month" fontSize={12} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Area type="monotone" dataKey="actual" name={T('실제 판매', 'Actual Sales')} fill="#bfdbfe" stroke="#3b82f6" fillOpacity={0.2} />
                                                <Line type="monotone" dataKey="legacy" name={T('기존 예측', 'Legacy Forecast')} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                                                <Line type="monotone" dataKey="forecast" name={T('AI 예측', 'AI Forecast')} stroke="#db2777" strokeWidth={3} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 p-3 bg-pink-50 text-pink-800 text-xs rounded border border-pink-100 flex items-start gap-2">
                                        <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
                                        <p>
                                            <strong>{T('분석:', 'Analysis:')}</strong>{' '}
                                            {T(
                                                '기존 모델은 계절성 반영이 늦어 1분기에는 과대 예측, 2분기에는 과소 예측을 반복했습니다. AI 모델은 14일 이내에 추세 변화에 적응해 5월의 결품 위험을 사전에 차단했습니다.',
                                                'The legacy model consistently over-forecasted in Q1 and under-forecasted in Q2 due to seasonality lag. The AI model adapted to the trend change within 14 days, preventing a potential stockout in May.'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Before / After Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {Object.entries(reportData.metrics).map(([key, val]: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">{key.toUpperCase()}</h5>
                                            <div className="flex items-center justify-between">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-slate-400 line-through decoration-red-400">{val.before}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{T('도입 전', 'Before')}</div>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-slate-300" />
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-emerald-600">{val.after}</div>
                                                    <div className="text-[10px] text-emerald-500 font-bold uppercase">{T('AI 도입 후', 'After AI')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeReport === 'SUPPLIER_RECOMMENDATION' && (
                            <div className="space-y-8 animate-fadeIn">
                                {/* Top Funnel Visualization */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                    <h4 className="text-lg font-bold text-slate-900 mb-6 text-center">{T('AI 전략 소싱 퍼널', 'AI Strategic Sourcing Funnel')}</h4>

                                    <div className="flex justify-center items-center gap-2 mb-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-32 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200">
                                                {T('전체 후보', 'Total Candidates')}
                                                <br/>
                                                <span className="text-lg text-slate-800">{reportData.candidates.toLocaleString()}</span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-28 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                                                {T('적격 업체', 'Qualified')}
                                                <br/>
                                                <span className="text-lg text-blue-800">{reportData.qualified}</span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-24 h-16 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm border border-emerald-100 shadow-lg scale-110">
                                                {T('최종 후보', 'Shortlist')}
                                                <br/>
                                                <span className="text-lg text-emerald-800">{reportData.shortlist}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-center gap-4 text-xs text-slate-500">
                                        {reportData.criteria.map((c: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-slate-100 rounded border border-slate-200 flex items-center gap-1">
                                                <Filter className="w-3 h-3" /> {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Comparison Radar & Table */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-purple-600" />
                                            {T('역량 비교', 'Capability Comparison')}
                                        </h4>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={reportData.comparisonData}>
                                                    <PolarGrid />
                                                    <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                                    <Radar name="Alpha Tech" dataKey="alpha" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                                                    <Radar name="Beta Mfg" dataKey="beta" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                                                    <Radar name="Gamma Ind" dataKey="gamma" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                                                    <Legend />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-yellow-500" />
                                            {T('추천 순위', 'Top Recommendations')}
                                        </h4>
                                        {reportData.suppliers.map((sup: any, i: number) => (
                                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                                {i === 0 && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-bl">{T('1순위', '#1 CHOICE')}</div>}
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h5 className="font-bold text-slate-900">{sup.name}</h5>
                                                        <p className="text-xs text-slate-500">{sup.location} • {sup.price}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-emerald-600">{sup.score}</div>
                                                        <div className="text-[10px] text-slate-400">{T('AI 점수', 'AI Score')}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100">{sup.tag}</span>
                                                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded border border-slate-200">{T('리스크', 'Risk')}: {riskLabel(sup.risk)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeReport === 'INVENTORY_REPORT' && (
                            <div className="space-y-6">
                                {/* Header KPI */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase mb-2">{T('현재 재고', 'Current Stock')}</span>
                                        <span className={`text-3xl font-bold ${reportData.status === 'Shortage' ? 'text-red-500' : 'text-slate-900'}`}>
                                            {reportData.current.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-slate-400 mt-1">{T('개', 'Units')}</span>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase mb-2">{T('적정 재고', 'Optimal Level')}</span>
                                        <span className="text-3xl font-bold text-blue-600">
                                            {reportData.optimal.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-slate-400 mt-1">{T('개', 'Units')}</span>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase mb-2">{T('다음 발주', 'Next Order')}</span>
                                        <span className="text-xl font-bold text-emerald-600 mt-2">
                                            {reportData.nextOrder.split('(')[0]}
                                        </span>
                                        <span className="text-xs text-slate-400 mt-1">{T('AI 권장', 'AI Recommendation')}</span>
                                    </div>
                                </div>

                                {/* Simulation Chart */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                                            {T('AI 재고 시뮬레이션 (30일)', 'AI Inventory Simulation (30 Days)')}
                                        </h4>
                                        <button 
                                            onClick={simulateDemandSpike}
                                            className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full font-bold border border-orange-200 hover:bg-orange-200 transition-colors flex items-center gap-1"
                                        >
                                            <AlertTriangle className="w-3 h-3" /> {T('수요 급증 시뮬레이션 (+20%)', 'Simulate Demand Spike (+20%)')}
                                        </button>
                                    </div>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={reportData.trendData || invSimulationData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="day" fontSize={12} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Area type="monotone" dataKey="stock" name={T('예상 재고', 'Projected Stock')} fill="#bfdbfe" stroke="#3b82f6" />
                                                <Line type="monotone" dataKey="optimal" name={T('적정 재고', 'Optimal Level')} stroke="#10b981" strokeDasharray="5 5" dot={false} />
                                                <Line type="monotone" dataKey="safety" name={T('안전 재고', 'Safety Stock')} stroke="#ef4444" strokeDasharray="3 3" dot={false} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* AI Insight & Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                        <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                                            {T('AI 전략 인사이트', 'AI Strategy Insight')}
                                        </h4>
                                        <p className="text-sm text-indigo-800 leading-relaxed mb-4">
                                            {reportData.aiInsight}
                                        </p>
                                        <div className="text-xs text-indigo-600 font-medium">
                                            {T(
                                                `* 과거 소비 속도 ${reportData.consumptionRate} 및 공급사 리드타임 ${reportData.leadTime} 기준입니다.`,
                                                `* Based on historical consumption rate of ${reportData.consumptionRate} and vendor lead time of ${reportData.leadTime}.`
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                        <h4 className="font-bold text-slate-900 mb-3">{T('권장 조치', 'Suggested Actions')}</h4>
                                        <div className="space-y-3">
                                            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                                <ShoppingCart className="w-4 h-4" /> {T('발주서 생성', 'Generate Purchase Order')}
                                            </button>
                                            <button className="w-full py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm">
                                                <MessageSquare className="w-4 h-4" /> {T('공급사 연락', 'Contact Supplier')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeReport === 'BOM_FULL_REPORT' && (
                            <div className="space-y-8">
                                {/* Summary KPIs */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">{T('전체 품목', 'Total Items')}</div>
                                        <div className="text-2xl font-bold text-slate-900">{reportData.totalItems}</div>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                                        <div className="text-xs text-emerald-600 uppercase font-bold mb-1">{T('평균 수율', 'Avg. Yield')}</div>
                                        <div className="text-2xl font-bold text-emerald-800">{reportData.avgYield}</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                        <div className="text-xs text-red-600 uppercase font-bold mb-1">{T('고위험 품목', 'High Risk Items')}</div>
                                        <div className="text-2xl font-bold text-red-800">{reportData.riskItems}</div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                        <div className="text-xs text-blue-600 uppercase font-bold mb-1">{T('공급사', 'Suppliers')}</div>
                                        <div className="text-2xl font-bold text-blue-800">{reportData.supplierCount}</div>
                                    </div>
                                </div>

                                {/* BOM Tree Map & Trend */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-blue-600" />
                                            {T('BOM 구성 비중', 'BOM Component Distribution')}
                                        </h4>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <Treemap
                                                    data={reportData.treeData}
                                                    dataKey="size"
                                                    aspectRatio={4 / 3}
                                                    stroke="#fff"
                                                    content={<CustomContent />}
                                                />
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-purple-600" />
                                            {T('불량률 추이 (최근 6개월)', 'Defect Rate Trend (Last 6 Months)')}
                                        </h4>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={reportData.defectTrend}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="name" fontSize={12} />
                                                    <YAxis fontSize={12} />
                                                    <Tooltip cursor={{fill: 'transparent'}} />
                                                    <Bar dataKey="rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} name={T('불량률 %', 'Defect %')}>
                                                        {reportData.defectTrend.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={entry.rate > 2.0 ? '#ef4444' : '#8b5cf6'} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Table */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-900 flex items-center gap-2">
                                        <AlertOctagon className="w-5 h-5 text-red-500" />
                                        {T('우선 조치 필요 품목', 'Priority Risk Items (Action Required)')}
                                    </div>
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-3">{T('부품 ID', 'Part ID')}</th>
                                                <th className="px-6 py-3">{T('부품명', 'Component Name')}</th>
                                                <th className="px-6 py-3">{T('공급사', 'Supplier')}</th>
                                                <th className="px-6 py-3">{T('근본 원인', 'Root Cause')}</th>
                                                <th className="px-6 py-3 text-center">{T('심각도', 'Severity')}</th>
                                                <th className="px-6 py-3 text-right">{T('조치', 'Action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {reportData.topRisks.map((item: any, i: number) => (
                                                <tr key={i} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                                                    <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                                                    <td className="px-6 py-4 text-slate-600">{item.supplier}</td>
                                                    <td className="px-6 py-4 text-slate-600">{item.reason}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                            item.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {riskLabel(item.severity)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-blue-600 font-bold text-xs hover:underline flex items-center justify-end gap-1">
                                                            <ClipboardList className="w-3 h-3" /> {T('감사', 'Audit')}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeReport === 'CHAT_RESULT' && (
                            <div className="space-y-6">
                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-purple-900 text-lg mb-2">{T(`"${reportData.topic}" 분석 결과`, `Analysis Result: "${reportData.topic}"`)}</h4>
                                        {reportData.targetCompany && (
                                            <p className="text-xs text-purple-600 font-bold uppercase mb-2">{reportData.targetCompany}</p>
                                        )}
                                        <p className="text-purple-800 text-sm leading-relaxed">{reportData.summary}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {reportData.insights.map((insight: any, i: number) => (
                                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">{insight.label}</div>
                                            <div className="text-xl font-bold text-slate-900">{insight.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200 h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportData.chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                                    <h5 className="text-sm font-bold text-blue-800 mb-1">{T('AI 추천 사항', 'AI Recommendation')}</h5>
                                    <p className="text-sm text-blue-700">{reportData.recommendation}</p>
                                </div>
                            </div>
                        )}

                        {activeReport === 'EXPERT_CONNECT' && (
                            <div className="space-y-6">
                                {/* Profile Header */}
                                <div className="flex gap-6 items-center">
                                    <div className="w-24 h-24 bg-white border-2 border-indigo-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-md">
                                        {reportData.expertName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900">{reportData.expertName}</h2>
                                                <p className="text-indigo-600 font-medium">{reportData.role}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-slate-900">{reportData.rate}</div>
                                                <div className="text-xs text-slate-500">{T('표준 단가', 'Standard Rate')}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-600">{reportData.experience}</span>
                                            <span className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold text-emerald-700">{T('매칭 점수', 'Match Score')}: {reportData.matchScore}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reasoning & Radar */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> {T('선정 사유', 'Selection Reasoning')}</h4>
                                            <p className="text-sm text-slate-700 leading-relaxed">{reportData.reasoning}</p>
                                        </div>
                                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                            <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2">{T('주요 역량', 'Primary Skills')}</h4>
                                            <p className="text-sm text-indigo-700">{reportData.skills}</p>
                                        </div>
                                    </div>
                                    <div className="h-60 bg-white rounded-xl border border-slate-200 p-2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={reportData.radar}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                                <Radar name={reportData.expertName} dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.5} />
                                                <Legend />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Contract Section */}
                                <div className="border-t-2 border-dashed border-slate-300 pt-6 mt-6">
                                    <h4 className="text-center font-serif text-xl font-bold text-slate-800 mb-4">{T('기술 자문 계약서', 'Consulting Service Agreement')}</h4>
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10"><FileText className="w-24 h-24" /></div>
                                        <p className="text-sm text-slate-600 mb-4 font-serif">
                                            {isKO ? (
                                                <>본 계약은 <strong>Korea Co., Ltd.</strong>와 <strong>{reportData.expertName}</strong> 간에 체결되며, 전문가는 업무 범위(Scope of Work)에 명시된 기술 자문 용역을 제공하기로 합의한다.</>
                                            ) : (
                                                <>This agreement is made between <strong>Korea Co., Ltd.</strong> and <strong>{reportData.expertName}</strong>.
                                                The expert agrees to provide technical consulting services as described in the Scope of Work.</>
                                            )}
                                        </p>
                                        <div className="flex justify-between items-end mt-8">
                                            <div className="text-center">
                                                <div className="font-script text-2xl text-blue-600 mb-1">Signed.AI</div>
                                                <div className="border-t border-slate-300 w-32 pt-1 text-[10px] text-slate-400 uppercase">{T('Korea 승인', 'Korea Authorized')}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-script text-2xl text-slate-800 mb-1">{reportData.expertName}</div>
                                                <div className="border-t border-slate-300 w-32 pt-1 text-[10px] text-slate-400 uppercase">{T('전문가 서명', 'Expert Signature')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeReport === 'CONTRACT' && (
                            <div className="space-y-8">
                                {/* Success Header */}
                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                                        <FileSignature className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-emerald-900">{T('계약 체결 완료 (Success)', 'Contract Executed Successfully')}</h2>
                                        <p className="text-emerald-700 text-sm mt-1">{reportData.contractId} • {new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Selection Reasoning */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                                        {T('선정 사유 (Why this Supplier?)', 'Why this Supplier?')}
                                    </h4>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                        {reportData.reasoning}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                            <span className="text-xs text-slate-500 block">{T('AI 평가 점수', 'AI Evaluation Score')}</span>
                                            <span className="text-xl font-bold text-blue-600">{reportData.supplierScore}/100</span>
                                        </div>
                                        <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                            <span className="text-xs text-slate-500 block">{T('리스크 레벨', 'Risk Level')}</span>
                                            <span className="text-xl font-bold text-emerald-600">{T('Low (안전)', 'Low (Safe)')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Digital Contract Visual */}
                                <div className="border-4 border-double border-slate-200 p-8 rounded-lg bg-white relative">
                                    <div className="absolute top-4 right-4 opacity-10"><Scale className="w-32 h-32" /></div>
                                    <h3 className="text-center font-serif text-2xl font-bold mb-6 text-slate-900 underline decoration-slate-300 decoration-1 underline-offset-4">{T('표준 공급 계약서', 'Standard Supply Agreement')}</h3>

                                    <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                                        <div>
                                            <span className="block font-bold text-slate-700">{T('구매자 (Buyer)', 'Buyer')}</span>
                                            <span className="block text-slate-600">Korea Corp.</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-slate-700">{T('공급자 (Supplier)', 'Supplier')}</span>
                                            <span className="block text-slate-600">S-Tech Inc.</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-sm text-slate-600 font-serif leading-relaxed">
                                        <p><strong>{T('제 1조 (목적)', 'Article 1 (Purpose)')}</strong> {T(`본 계약은 ${reportData.product}의 공급에 관한 제반 사항을 규정함을 목적으로 한다.`, `The purpose of this agreement is to set out all matters relating to the supply of ${reportData.product}.`)}</p>
                                        <p><strong>{T('제 2조 (기간 및 조건)', 'Article 2 (Term and Conditions)')}</strong> {reportData.terms}</p>
                                        <div className="bg-yellow-50 p-3 border border-yellow-100 rounded">
                                            <strong>{T('제 3조 (특약 사항)', 'Article 3 (Special Terms)')}</strong> {reportData.clause}
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-12 pt-8 border-t border-slate-200">
                                        <div className="text-center">
                                            <div className="font-script text-3xl text-blue-600 mb-2">Signed.AI</div>
                                            <div className="h-px w-40 bg-slate-400 mx-auto"></div>
                                            <span className="text-xs text-slate-400 uppercase mt-1 block">{T('구매자 서명', 'Buyer Signature')}</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-script text-3xl text-slate-800 mb-2">S-Tech CEO</div>
                                            <div className="h-px w-40 bg-slate-400 mx-auto"></div>
                                            <span className="text-xs text-slate-400 uppercase mt-1 block">{T('공급자 서명', 'Supplier Signature')}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 text-center text-[10px] text-slate-400 font-mono">
                                        Hash: 0x7f82...91a2 | Timestamp: {new Date().toISOString()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeReport === 'ORDER' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <div>
                                        <p className="text-sm text-emerald-800 font-bold">{T('동시 발주 총 수량', 'Total Simultaneous Order Qty')}</p>
                                        <p className="text-2xl font-bold text-emerald-600">{reportData.totalQty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-emerald-700">{T('동기화 지연시간', 'Sync Latency')}</p>
                                        <p className="font-mono font-bold">{reportData.syncTime}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> {T('AI 최적화 효과', 'AI Optimization Impact')}</h4>
                                    <p className="text-sm text-slate-600 mb-4">{reportData.optimization}</p>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-blue-500 w-3/4"></div>
                                        <div className="h-full bg-emerald-500 w-1/4"></div>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1 text-slate-500">
                                        <span>{T('표준 리드타임', 'Standard Lead Time')}</span>
                                        <span className="text-emerald-600 font-bold">{T('단축된 시간', 'Time Saved')}</span>
                                    </div>
                                </div>

                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-100 text-slate-600">
                                        <tr>
                                            <th className="p-3">{T('단계', 'Tier')}</th>
                                            <th className="p-3">{T('공급사', 'Supplier')}</th>
                                            <th className="p-3">{T('품목 / S.N', 'Item / S.N')}</th>
                                            <th className="p-3">{T('예상도착', 'ETA')}</th>
                                            <th className="p-3">{T('상태', 'Status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {reportData.items.map((item: any, i: number) => (
                                            <tr key={i}>
                                                <td className="p-3 font-bold text-slate-500">{item.tier}</td>
                                                <td className="p-3 font-bold text-slate-800">{item.supplier}</td>
                                                <td className="p-3">
                                                    <div>{item.part}</div>
                                                    <div className="text-xs text-slate-400 font-mono">{item.sn}</div>
                                                </td>
                                                <td className="p-3 text-slate-600">{item.eta}</td>
                                                <td className="p-3 text-emerald-600 font-bold">{item.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeReport === 'QUALITY_ANALYSIS' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4">
                                    <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-red-800 text-lg">{T('품질 경보', 'Quality Alert')}: {reportData.target}</h4>
                                        <p className="text-sm text-red-700 mt-1">{reportData.metric}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                                        <h5 className="font-bold text-slate-800 mb-2 text-sm">{T('근본 원인 (AI 분석)', 'Root Cause (AI Analysis)')}</h5>
                                        <p className="text-sm text-slate-600">{reportData.rootCause}</p>
                                        <div className="mt-2 text-xs font-bold text-red-500 border border-red-200 bg-red-50 px-2 py-1 rounded inline-block">
                                            {T('위험도', 'Risk Level')}: {riskLabel(reportData.riskLevel)}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                                        <h5 className="font-bold text-slate-800 mb-2 text-sm">{T('계약 위반 사항', 'Contract Breach')}</h5>
                                        <p className="text-xs text-slate-600 leading-relaxed">{reportData.contractImpact}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200 h-48">
                                    <h5 className="font-bold text-slate-800 mb-2 text-sm">{T('트렌드 분석 (최근 4주)', 'Trend Analysis (Last 4 Weeks)')}</h5>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={reportData.trendData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div>
                                    <h5 className="font-bold text-slate-800 mb-2">{T('권장 조치 사항', 'Recommended Actions')}</h5>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                        {reportData.recommendation}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeReport === 'SUPPLIER_EVAL' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-2xl font-bold text-slate-900">{reportData.supplier}</h4>
                                        <p className="text-sm text-slate-500">{T('AI 자동 평가 리포트', 'Automated AI Evaluation Report')}</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600">{reportData.grade}</div>
                                        <div className="text-xs font-bold text-slate-400">{T('종합 점수', 'Overall Score')}: {reportData.score}</div>
                                    </div>
                                </div>
                                
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={reportData.radar}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fontWeight: 'bold'}} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                            <Radar name={T('공급사', 'Supplier')} dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
                                            <Legend />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <span className="text-xs font-bold text-emerald-700 uppercase block mb-1">{T('강점 (Strengths)', 'Strengths')}</span>
                                        <ul className="list-disc list-inside text-sm text-emerald-900">
                                            {reportData.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                        <span className="text-xs font-bold text-red-700 uppercase block mb-1">{T('약점 (Weaknesses)', 'Weaknesses')}</span>
                                        <ul className="list-disc list-inside text-sm text-red-900">
                                            {reportData.weaknesses.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeReport === 'EO_IMPACT' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-orange-800">{reportData.eoId} : {reportData.change}</h4>
                                        <p className="text-sm text-orange-700 mt-1">{T('최적 적용 시점', 'Optimal Apply Date')}: <strong>{reportData.optimalDate}</strong></p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-orange-600 font-bold">{T('리스크 등급', 'Risk Level')}</div>
                                        <div className="text-2xl font-bold text-red-500">{T('높음', 'High')}</div>
                                    </div>
                                </div>

                                {/* Before vs After Process Visualization */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <RefreshCw className="w-5 h-5 text-blue-600" />
                                        {T('프로세스 혁신 (도입 전 vs 도입 후)', 'Process Transformation (Before vs After)')}
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 gap-8">
                                        {/* Manual Process */}
                                        <div className="relative pl-8 border-l-2 border-slate-200 border-dashed">
                                            <div className="absolute -left-3 top-0 bg-slate-200 text-slate-500 rounded-full p-1"><X className="w-4 h-4" /></div>
                                            <h5 className="text-sm font-bold text-slate-500 mb-3">{T('기존 수작업 프로세스 (5일)', 'Legacy Manual Process (5 Days)')}</h5>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {reportData.processMap.manual.map((step: string, i: number) => (
                                                    <div key={i} className="flex-shrink-0 w-32 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-500 text-center flex flex-col items-center justify-center h-20">
                                                        {step}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* AI Process */}
                                        <div className="relative pl-8 border-l-2 border-emerald-500">
                                            <div className="absolute -left-3 top-0 bg-emerald-500 text-white rounded-full p-1"><Zap className="w-4 h-4" /></div>
                                            <h5 className="text-sm font-bold text-emerald-600 mb-3">{T('AI 자동화 프로세스 (2시간)', 'AI Automated Process (2 Hours)')}</h5>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {reportData.processMap.ai.map((step: string, i: number) => (
                                                    <div key={i} className="flex-shrink-0 w-32 bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-xs text-emerald-800 text-center flex flex-col items-center justify-center h-20 font-bold shadow-sm">
                                                        {step}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Impact Metrics */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">{T('적용 소요 시간', 'Time to Apply')}</div>
                                        <div className="flex justify-center items-baseline gap-2">
                                            <span className="text-sm text-slate-400 line-through">{reportData.impactMetrics.time.before}</span>
                                            <span className="text-xl font-bold text-emerald-600">{reportData.impactMetrics.time.after}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">{T('비용 영향', 'Cost Impact')}</div>
                                        <div className="flex justify-center items-baseline gap-2">
                                            <span className="text-sm text-slate-400 line-through">{reportData.impactMetrics.cost.before}</span>
                                            <span className="text-xl font-bold text-emerald-600">{reportData.impactMetrics.cost.after}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">{T('리스크 감소', 'Risk Reduction')}</div>
                                        <div className="text-sm font-bold text-slate-400 mb-1">{reportData.impactMetrics.risk.before}</div>
                                        <ArrowRight className="w-4 h-4 text-slate-300 mx-auto my-1" />
                                        <div className="text-sm font-bold text-emerald-600">{reportData.impactMetrics.risk.after}</div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center">
                                    <span>{T('총 비용 절감액', 'Total Cost Saving')}</span>
                                    <span className="text-2xl font-bold text-emerald-400">{reportData.costSaving}</span>
                                </div>

                                {reportData.suppliers && (
                                    <div className="mt-4">
                                        <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-yellow-500" />
                                            {T('최적 공급사 추천', 'Optimal Supplier Recommendation')}
                                        </h5>
                                        <div className="grid grid-cols-1 gap-3">
                                            {reportData.suppliers.map((sup: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{i+1}</div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm">{sup.name}</div>
                                                            <div className="text-[10px] text-slate-500">{sup.role}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-emerald-600 font-bold">{T(`${sup.score}점`, `${sup.score} pts`)}</div>
                                                        <div className="text-[10px] text-slate-400">{T('적합도', 'Fit Score')}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                    
                    <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                        <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-white flex items-center gap-2">
                            <Printer className="w-4 h-4" /> {T('출력', 'Print')}
                        </button>
                        <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-white flex items-center gap-2">
                            <Download className="w-4 h-4" /> {T('저장 (PDF)', 'Save (PDF)')}
                        </button>
                        <button onClick={() => setActiveReport(null)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800">
                            {T('닫기', 'Close')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Custom Content for Treemap to render Labels
    const CustomContent = (props: any) => {
        const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
        
        return (
          <g>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              style={{
                fill: payload?.color || '#3b82f6', // Safe access
                stroke: '#fff',
                strokeWidth: 2 / (depth + 1e-10),
                strokeOpacity: 1 / (depth + 1e-10),
              }}
            />
            {
              width > 50 && height > 30 ? (
                <text
                  x={x + width / 2}
                  y={y + height / 2}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={10}
                  fontWeight="bold"
                >
                  {name}
                </text>
              ) : null
            }
          </g>
        );
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-12 relative">
            {renderReportModal()}
            {renderConfigModal()}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Bot className="w-8 h-8 text-purple-600" />
                        {language === 'KO' ? '지능형 SCM (Intelligent SCM)' : 'Intelligent SCM'}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {language === 'KO' 
                            ? 'AI 및 데이터스페이스 기반의 차세대 공급망 자동화 및 협업 플랫폼' 
                            : 'AI & DataSpace based Next-Gen Supply Chain Automation & Collaboration Platform'}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('AUTO')}
                    className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'AUTO' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    <Zap className="w-4 h-4" />
                    {language === 'KO' ? '프로세스 자동화' : 'Process Automation'}
                </button>
                <button 
                    onClick={() => setActiveTab('QUALITY')}
                    className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'QUALITY' ? 'border-emerald-600 text-emerald-600 bg-emerald-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    {language === 'KO' ? '품질 & 전문가' : 'Quality & Experts'}
                </button>
                <button 
                    onClick={() => setActiveTab('ECO')}
                    className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'ECO' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    <Share2 className="w-4 h-4" />
                    {language === 'KO' ? '생태계 트윈' : 'Ecosystem Twin'}
                </button>
                <button 
                    onClick={() => setActiveTab('STRATEGY')}
                    className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'STRATEGY' ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    <GitGraph className="w-4 h-4" />
                    {language === 'KO' ? 'SCM 전략' : 'SCM Strategy'}
                </button>
                <button 
                    onClick={() => setActiveTab('FORECAST')}
                    className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'FORECAST' ? 'border-pink-600 text-pink-600 bg-pink-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    <TrendingUp className="w-4 h-4" />
                    {language === 'KO' ? '수요/재고 AI' : 'Demand & Inventory AI'}
                </button>
            </div>

            {/* --- TAB 1: AUTOMATION --- */}
            {activeTab === 'AUTO' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                    
                    {/* 2.1 Natural Language Chatbot */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-purple-600" />
                                {language === 'KO' ? '자연어 데이터 카탈로그' : 'Natural Language Data Catalog'}
                            </h3>
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">{T('AI 작동 중', 'AI Active')}</span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {msg.role === 'bot' && msg.targetCompany && (
                                        <div className="mb-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md self-start border border-purple-100 flex items-center gap-1">
                                            <Building2 className="w-3 h-3" />
                                            {isKO ? msg.targetCompany : (msg.targetCompanyEn || msg.targetCompany)}
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                                        <p>{isKO ? msg.content : (msg.contentEn || msg.content)}</p>
                                        {msg.action && (
                                            <button 
                                                onClick={() => handleChatAction(msg.action)}
                                                className="mt-3 text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-2 rounded-lg font-bold hover:bg-purple-100 transition-colors w-full text-center flex items-center justify-center gap-1"
                                            >
                                                {isKO ? msg.action.label : (msg.action.labelEn || msg.action.label)} <ArrowRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {/* Suggested Questions */}
                            {chatHistory[chatHistory.length - 1].role === 'bot' && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {SUGGESTED_QUESTIONS.slice(0, 3).map((q, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleChatSubmit(q)}
                                            className="text-xs bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-full hover:border-purple-300 hover:text-purple-600 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
                                    placeholder={language === 'KO' ? "질문을 입력하세요..." : "Type your query..."}
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                                />
                                <button onClick={() => handleChatSubmit()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* 2.2 Contract Automation */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <FileText className="w-24 h-24 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                                <PenTool className="w-5 h-5 text-blue-600" />
                                {language === 'KO' ? '계약 자동화 시스템' : 'Auto-Contract System'}
                            </h3>
                            
                            {contractStep > 0 ? (
                                // Active State
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${contractStep >= 0 ? 'opacity-100 scale-105' : 'opacity-50'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-500 ${contractStep >= 1 ? 'bg-blue-600' : 'bg-slate-300'} ${contractStep === 1 ? 'animate-pulse ring-4 ring-blue-100' : ''}`}>1</div>
                                            <span className="text-xs font-bold text-slate-600">{T('초안', 'Draft')}</span>
                                        </div>
                                        <div className="h-0.5 flex-1 bg-slate-200 mx-2 relative">
                                            <div className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000" style={{width: contractStep >= 2 ? '100%' : '0%'}}></div>
                                        </div>
                                        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${contractStep >= 1 ? 'opacity-100 scale-105' : 'opacity-50'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-500 ${contractStep >= 2 ? 'bg-blue-600' : 'bg-slate-300'} ${contractStep === 2 ? 'animate-pulse ring-4 ring-blue-100' : ''}`}>2</div>
                                            <span className="text-xs font-bold text-slate-600">{T('AI 검토', 'AI Review')}</span>
                                        </div>
                                        <div className="h-0.5 flex-1 bg-slate-200 mx-2 relative">
                                            <div className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000" style={{width: contractStep >= 3 ? '100%' : '0%'}}></div>
                                        </div>
                                        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${contractStep >= 2 ? 'opacity-100 scale-105' : 'opacity-50'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-500 ${contractStep >= 3 ? 'bg-emerald-600' : 'bg-slate-300'}`}>3</div>
                                            <span className="text-xs font-bold text-slate-600">{T('체결 완료', 'Signed')}</span>
                                        </div>
                                    </div>
                                    <div className="text-center text-sm font-bold text-blue-600 animate-pulse h-6">
                                        {contractStep === 1 && T('초안 생성 중...', 'Generating draft...')}
                                        {contractStep === 2 && T('AI 리스크 검토 중...', 'AI risk review in progress...')}
                                        {contractStep === 3 && T('계약 체결 완료 (Contract Finalized)', 'Contract Finalized')}
                                    </div>
                                    
                                    {/* RESET BUTTON */}
                                    {contractStep === 3 && (
                                        <button 
                                            onClick={resetContract}
                                            className="mt-2 w-full py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3" /> {T('새 계약 시작', 'Start New Contract')}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                // Initial State
                                <div className="flex flex-col gap-4 relative z-10">
                                    <p className="text-sm text-slate-500">{T('스마트 계약을 자동으로 생성하고 체결합니다.', 'Automatically draft and execute a smart contract.')}</p>
                                    <button 
                                        onClick={() => openConfigModal('CONTRACT')}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        {language === 'KO' ? '자동 계약 시작' : 'Start Auto Contract'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 2.3 Simultaneous Ordering */}
                        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                            {/* Background Animation */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.2),transparent_70%)]"></div>
                            </div>

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Network className="w-5 h-5 text-emerald-400" />
                                    {language === 'KO' ? '동시 발주 시스템 (Multi-Tier Sync)' : 'Simultaneous Ordering System'}
                                </h3>
                                <div className="flex gap-2">
                                    {orderStatus === 'COMPLETED' ? (
                                        <button 
                                            onClick={resetOrder}
                                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3" /> {T('초기화', 'Reset')}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => openConfigModal('ORDER')}
                                            disabled={orderStatus === 'SYNCING'}
                                            className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-2 ${orderStatus === 'SYNCING' ? 'bg-slate-700 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                                        >
                                            {orderStatus === 'SYNCING' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                            {orderStatus === 'SYNCING' ? T('동기화 중...', 'Syncing...') : T('발주 동기화', 'Sync Orders')}
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="relative h-40 flex items-center justify-around z-10">
                                <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-700 -translate-y-1/2"></div>
                                {orderStatus === 'SYNCING' && (
                                    <>
                                        <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 -translate-y-1/2 animate-pulse"></div>
                                        <div className="absolute top-1/2 left-0 h-4 w-4 bg-white rounded-full blur-md animate-[ping_1s_linear_infinite]" style={{left: '50%'}}></div>
                                    </>
                                )}
                                {orderStatus === 'COMPLETED' && (
                                    <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-emerald-500 -translate-y-1/2 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                )}

                                {['OEM', 'Tier 1', 'Tier 2', 'Tier 3'].map((label, i) => (
                                    <div key={i} className="flex flex-col items-center bg-slate-800 p-3 rounded-xl border border-slate-600 z-10 w-24 transition-all duration-300 hover:scale-105 hover:border-emerald-500">
                                        <div className={`w-3 h-3 rounded-full mb-2 transition-colors duration-300 ${
                                            orderStatus === 'COMPLETED' ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 
                                            orderStatus === 'SYNCING' ? 'bg-blue-400 animate-pulse' : 
                                            'bg-slate-500'
                                        }`}></div>
                                        <span className={`font-bold text-xs transition-colors ${orderStatus === 'COMPLETED' ? 'text-emerald-400' : 'text-white'}`}>{label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute bottom-4 right-6 text-xs text-slate-400 font-mono flex items-center gap-2">
                                <Fingerprint className="w-3 h-3" />
                                {T('추적 번호', 'Tracking Serial')}: {orderStatus === 'SYNCING' ? 'SYNCING...' : orderStatus === 'COMPLETED' ? 'CONFIRMED' : '#SN-2024-X99'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- TAB 2: QUALITY & EXPERTS --- */}
            {activeTab === 'QUALITY' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                    {/* 3.1 BOM Quality Analysis */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-emerald-600" />
                                {language === 'KO' ? 'BOM 기준 품질 분석' : 'BOM-based Quality Analysis'}
                            </h3>
                            <button 
                                onClick={handleBomFullReport}
                                className="text-xs text-blue-600 font-bold hover:underline"
                            >
                                {T('전체 리포트 보기', 'View Full Report')}
                            </button>
                        </div>
                        <div className="h-64 w-full mb-4 cursor-pointer" onClick={() => handleBOMDetail(BOM_QUALITY[0])}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={BOM_QUALITY} layout="vertical" margin={{ left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fontWeight: 'bold'}} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="rate" name={T('합격률 %', 'Pass Rate %')} radius={[0, 4, 4, 0]}>
                                        {BOM_QUALITY.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.rate > 95 ? '#10b981' : entry.rate > 90 ? '#f59e0b' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2">
                            {BOM_QUALITY.map((item, i) => (
                                <div 
                                    key={i} 
                                    className="flex justify-between text-xs border-b border-slate-100 pb-2 cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => handleBOMDetail(item)}
                                >
                                    <span className="font-bold text-slate-700">{item.name} ({item.supplier})</span>
                                    <span className={item.risk === 'High' ? 'text-red-500 font-bold' : 'text-slate-500'}>{T('리스크', 'Risk')}: {riskLabel(item.risk)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3.2 Expert Matching */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                            {language === 'KO' ? '문제 해결 전문가 매칭' : 'Expert Matching'}
                        </h3>
                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2">
                            {EXPERTS.map((expert) => (
                                <div key={expert.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors group">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200 shadow-sm">
                                        {expert.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4 className="font-bold text-slate-900">{expert.name}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${expert.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                                {availabilityLabel(expert.status)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-blue-600 font-medium mb-1">{expert.role}</p>
                                        <p className="text-xs text-slate-500">{expert.ex} • {expert.skill}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleExpertConnect(expert)}
                                        className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors"
                                    >
                                        {T('연결', 'Connect')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB 3: ECOSYSTEM TWIN --- */}
            {activeTab === 'ECO' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                    
                    {/* 4.1 AI Agent Evaluation */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg lg:col-span-1 flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Bot className="w-5 h-5 text-emerald-400" />
                                {language === 'KO' ? 'AI 에이전트 업체 평가' : 'AI Agent Evaluation'}
                            </h3>
                            <button 
                                onClick={() => openConfigModal('EVAL')}
                                className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white font-bold"
                            >
                                {T('대상 선택', 'Select Target')}
                            </button>
                        </div>
                        <div className="flex-1 bg-black/30 rounded-xl p-4 space-y-4 overflow-y-auto mb-4 font-mono text-xs">
                            {agentChatLog.map((log, i) => {
                                if (!log || !log.sender) return null;
                                return (
                                <div key={i} className={`flex flex-col ${log.sender.includes('Buyer') ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[10px] text-slate-400 mb-1">{log.sender}</span>
                                    <div className={`p-2 rounded-lg max-w-[90%] ${log.sender.includes('Buyer') ? 'bg-blue-600 text-white' : log.sender === 'System' ? 'bg-slate-700 text-yellow-300' : 'bg-slate-700 text-slate-200'}`}>
                                        {isKO ? log.msg : (log.msgEn || log.msg)}
                                    </div>
                                </div>
                            )})}
                        </div>
                        <button 
                            onClick={() => configMode === 'EVAL' ? handleConfigConfirm() : openConfigModal('EVAL')}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            {language === 'KO' ? '평가 시뮬레이션 시작' : 'Run Eval Simulation'}
                        </button>
                    </div>

                    {/* 4.2 Digital Twin Ecosystem Map */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden h-[500px] flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                            <Share2 className="w-5 h-5 text-blue-600" />
                            {language === 'KO' ? '공급망 디지털 트윈' : 'Supply Chain Digital Twin'}
                        </h3>
                        
                        {/* Background Grid */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" 
                             style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10 flex-1 content-center overflow-y-auto p-2">
                            {ECOSYSTEM_NODES.map((node) => (
                                <div 
                                    key={node.id} 
                                    onClick={() => {
                                        setReportData({
                                            supplier: node.name,
                                            grade: node.grade,
                                            score: node.score,
                                            strengths: isKO ? ['안정적인 품질', '데이터 투명성'] : ['Stable Quality', 'Data Transparency'],
                                            weaknesses: isKO ? ['원가 구조'] : ['Cost Structure'],
                                            radar: [
                                                { subject: T('품질', 'Quality'), A: node.score, fullMark: 100 },
                                                { subject: T('비용', 'Cost'), A: node.score - 10, fullMark: 100 },
                                                { subject: T('납기', 'Delivery'), A: node.score - 5, fullMark: 100 },
                                                { subject: 'ESG', A: 95, fullMark: 100 },
                                                { subject: T('기술', 'Technology'), A: 90, fullMark: 100 },
                                            ]
                                        });
                                        setActiveReport('SUPPLIER_EVAL');
                                    }}
                                    className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center gap-2 hover:shadow-md transition-all group cursor-pointer hover:border-blue-400 hover:scale-105"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                                        node.grade === 'S' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 
                                        node.grade === 'A' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 
                                        'bg-slate-200 text-slate-600 border-slate-300'
                                    }`}>
                                        {node.grade}
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-bold text-slate-900 text-xs md:text-sm group-hover:text-blue-600">{node.name}</h4>
                                        <span className="text-[10px] text-slate-500">{node.type}</span>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600" style={{width: `${node.score}%`}}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500">{node.score}</span>
                                        </div>
                                    </div>
                                    {node.grade === 'S' && <Star className="w-4 h-4 text-yellow-500 fill-current absolute top-2 right-2" />}
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-4 flex justify-center">
                            <div className="px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-500 font-medium flex items-center gap-2">
                                <Info className="w-3 h-3" />
                                {language === 'KO' ? '노드를 클릭하여 상세 평가 리포트를 확인하세요.' : 'Click nodes to view detailed evaluation reports.'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB 4: STRATEGY (SCM) --- */}
            {activeTab === 'STRATEGY' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                    {/* 5.1 EO Management */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <GitGraph className="w-5 h-5 text-orange-600" />
                            {language === 'KO' ? '설계 변경(EO) 대응 시뮬레이션' : 'EO Response Simulation'}
                        </h3>
                        
                        <div className="relative h-40 flex items-center mb-4">
                            {/* Timeline Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2"></div>
                            
                            {/* Events */}
                            <div className="absolute left-[10%] top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                                <div className="w-4 h-4 rounded-full bg-slate-400 border-2 border-white shadow-md mb-2"></div>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{T('EO 발행', 'EO Issued')}</span>
                            </div>

                            <div className="absolute left-[40%] top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md mb-2 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">{T('재고 소진', 'Stock Run-out')}</span>
                                <div className="absolute top-8 text-[10px] text-slate-400 w-24 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    {T('현재 재고: 4,500개', 'Current Stock: 4,500 ea')}
                                </div>
                            </div>

                            <div className="absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md mb-2"></div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">{T('신규 버전 투입', 'New Ver. Start')}</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <div className="flex-1 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {language === 'KO' 
                                    ? 'AI 분석: 현재 재고 소진 예상일은 5월 12일입니다. 신규 버전 투입 시점을 5월 13일로 자동 설정하시겠습니까?' 
                                    : 'AI Analysis: Current stock run-out estimated on May 12. Auto-schedule new version input for May 13?'}
                            </div>
                            <button 
                                onClick={runEOSimulation}
                                className="px-4 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 shadow-md"
                            >
                                {T('시뮬레이션', 'Simulate')}
                            </button>
                        </div>
                    </div>

                    {/* 5.2 Supplier Recommender */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                {language === 'KO' ? '최적 협력사 추천' : 'Optimal Supplier Recommendation'}
                            </h3>
                            <button 
                                onClick={handleSupplierRecommendation}
                                className="text-xs text-blue-600 font-bold hover:underline"
                            >
                                {T('상세 리포트 보기', 'View Detailed Report')}
                            </button>
                        </div>
                        <div className="space-y-3">
                            {RECOMMENDED_SUPPLIERS.map((sup, i) => (
                                <div 
                                    key={i} 
                                    onClick={handleSupplierRecommendation}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-yellow-400 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-700 font-bold shadow-sm border border-slate-100">
                                            {sup.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{sup.name}</h4>
                                            <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-100">{sup.tag}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-emerald-600">{sup.match}</div>
                                        <div className="text-[10px] text-slate-400">{T('매칭 점수', 'Match Score')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB 5: DEMAND & INVENTORY AI --- */}
            {activeTab === 'FORECAST' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                    
                    {/* Demand Forecasting Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-pink-300 transition-all" onClick={handleForecastClick}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-pink-600" />
                                {language === 'KO' ? '수요 예측 AI (Demand Forecasting)' : 'Demand Forecasting AI'}
                            </h3>
                            <button className="text-xs text-pink-600 font-bold hover:underline flex items-center gap-1">
                                {T('AI 효과 리포트 보기', 'View AI Impact Report')} <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="h-64 w-full mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={DEMAND_FORECAST_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{fontSize: 12}} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="actual" name={T('실제 판매', 'Actual Sales')} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                                    <Line type="monotone" dataKey="legacy" name={T('기존 예측', 'Legacy Forecast')} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                                    <Line type="monotone" dataKey="forecast" name={T('AI 예측', 'AI Forecast')} stroke="#db2777" strokeWidth={3} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-4 mt-2">
                            <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                                <span className="text-xs text-slate-500 block font-bold uppercase">{T('예측 정확도', 'Forecast Accuracy')}</span>
                                <span className="text-xl font-bold text-blue-600">96.4%</span>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                                <span className="text-xs text-slate-500 block font-bold uppercase">{T('성장률 (MoM)', 'Growth Rate (MoM)')}</span>
                                <span className="text-xl font-bold text-emerald-600">+12%</span>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Optimization Table */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-600" />
                            {language === 'KO' ? '재고 최적화 (Inventory Optimization)' : 'Inventory Optimization'}
                        </h3>
                        
                        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                            {INVENTORY_OPTIMIZATION_DATA.map((item, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => handleInventoryClick(item)}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            item.status === 'Excess' ? 'bg-orange-100 text-orange-600' : 
                                            item.status === 'Shortage' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-700">{item.name}</div>
                                            <div className="text-xs text-slate-500">
                                                {T('현재', 'Curr')}: {item.current} / {T('적정', 'Opt')}: {item.optimal}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xs font-bold px-2 py-1 rounded mb-1 inline-block ${
                                            item.status === 'Excess' ? 'bg-orange-100 text-orange-700' : 
                                            item.status === 'Shortage' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {stockStatusLabel(item.status)}
                                        </div>
                                        <div className="text-[10px] text-blue-600 font-bold flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {T('리포트 보기', 'View Report')} <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-xs font-bold text-indigo-800 mb-1">{T('AI 인사이트', 'AI Insight')}</h4>
                                <p className="text-xs text-indigo-700 leading-relaxed">
                                    {T(
                                        '"전자 모듈" 재고가 최적 수준 대비 50% 초과 상태입니다. 다음 발주 수량을 500개 감소시켜 재고 비용을 약 $8,000 절감할 수 있습니다.',
                                        '"Elec. Module" stock is running 50% above the optimal level. Cutting the next order by 500 units would save roughly $8,000 in inventory cost.'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntelligentSCM;
