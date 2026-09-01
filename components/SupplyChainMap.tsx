
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Building2, Package, Car, Monitor, ShieldCheck, AlertTriangle, Leaf, Network, Layers, ChevronRight, X, Activity, Server, Database, Globe, CheckCircle, Lock, Zap, Key, Cpu, User, MapPin, Calendar, BadgeCheck, FileText, BarChart3, Truck, Wifi, FileJson, ArrowRight, Clock, Code, Download, Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type NodeType = 'OEM' | 'Tier1' | 'Tier2' | 'Tier3' | 'Tier4';
type ExchangeLevel = 'Strategic' | 'Operational' | 'Technical';

interface DataExchange {
    id: string;
    name: string;
    level: ExchangeLevel;
    status: 'Active' | 'Paused' | 'Scheduled';
    lastUpdate: string;
    frequency: string;
    // New Detailed Fields
    protocol: string;
    format: string;
    description: string;
    sourceSystem: string;
    targetSystem: string;
    latency: string;
    samplePayload: string;
}

interface SupplyNode {
    id: string;
    label: string;
    type: NodeType;
    industry: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    carbonFootprint: number; // kgCO2e
    compliance: boolean;
    x: number;
    y: number;
    description: string;
    // New Fields
    dataSpaceStatus: 'Active' | 'Pending' | 'None';
    isCertified: boolean;
    corpInfo: {
        ceo: string;
        founded: string;
        hq: string;
        employees: string;
        revenue: string;
    };
    dataExchanges: DataExchange[];
}

interface SupplyLink {
    from: string;
    to: string;
}

// Mock Data for ESG Chart in Modal
// `month` is the recharts dataKey, so only the tick label value switches language.
const getMockEsgData = (language: 'KO' | 'EN') => [
  { month: language === 'KO' ? '1월' : 'Jan', value: 420 },
  { month: language === 'KO' ? '2월' : 'Feb', value: 380 },
  { month: language === 'KO' ? '3월' : 'Mar', value: 390 },
  { month: language === 'KO' ? '4월' : 'Apr', value: 350 },
  { month: language === 'KO' ? '5월' : 'May', value: 310 },
  { month: language === 'KO' ? '6월' : 'Jun', value: 290 },
];

const SupplyChainMap: React.FC = () => {
    const { t, language } = useLanguage();
    const [selectedChain, setSelectedChain] = useState<'HYUNDAI' | 'LG' | 'SAMSUNG'>('HYUNDAI');
    // Hold ids, not the objects. The node and exchange records are rebuilt each
    // render with the current language, so a stored object would keep showing the
    // language it was opened in after a toggle.
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null);
    const [payloadViewMode, setPayloadViewMode] = useState<'visual' | 'raw'>('visual'); // View toggle
    const [showDataLayer, setShowDataLayer] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [exchangeFilter, setExchangeFilter] = useState<ExchangeLevel | 'All'>('All');

    const isKo = language === 'KO';

    // ---- Display-only label maps -------------------------------------------------
    // The underlying values stay in English because they are used as keys, state
    // values and comparison literals. Only the rendered output switches language.
    const localize = (map: Record<string, string>, value: string) =>
        isKo ? (map[value] ?? value) : value;

    const industryLabels: Record<string, string> = {
        'Automotive': '완성차',
        'Auto Parts': '자동차 부품',
        'Powertrain': '파워트레인',
        'Electronics': '전자',
        'Metal': '금속',
        'Plastic': '플라스틱',
        'Steel': '철강',
        'Chemical': '화학',
        'Consumer Elec': '가전',
        'Display': '디스플레이',
        'Components': '전자부품',
        'Manufacturing': '제조',
        'Semiconductor': '반도체',
        'Raw Material': '원자재',
        'Mining': '광업',
        'Chemicals': '화학소재',
        'Materials': '소재',
        'Equipment': '장비',
    };

    // Korean HQ labels keep the "city, country" comma shape - the profile modal
    // derives the country chip from hq.split(',')[1].
    const hqLabels: Record<string, string> = {
        'Seoul, Korea': '서울, 대한민국',
        'Pyeongtaek, Korea': '평택, 대한민국',
        'Changwon, Korea': '창원, 대한민국',
        'Daegu, Korea': '대구, 대한민국',
        'Gyeongju, Korea': '경주, 대한민국',
        'Asan, Korea': '아산, 대한민국',
        'Pohang, Korea': '포항, 대한민국',
        'Incheon, Korea': '인천, 대한민국',
        'Gumi, Korea': '구미, 대한민국',
        'Suwon, Korea': '수원, 대한민국',
        'Yongin, Korea': '용인, 대한민국',
        'Seongnam, Korea': '성남, 대한민국',
        'Shenzhen, China': '선전, 중국',
        'Tokyo, Japan': '도쿄, 일본',
        'Texas, USA': '텍사스, 미국',
        'Inner Mongolia': '네이멍구',
        'Singapore': '싱가포르',
    };

    const nodeDescriptionLabels: Record<string, string> = {
        'Global OEM. Final assembly and distribution.': '글로벌 완성차 업체. 최종 조립 및 유통을 담당합니다.',
        'Chassis, Cockpit, and Frontend modules.': '섀시, 콕핏, 프런트엔드 모듈을 공급합니다.',
        'Brake, Steering, and Suspension systems.': '제동, 조향, 현가 시스템을 공급합니다.',
        'Engine parts and constant velocity joints.': '엔진 부품과 등속조인트를 생산합니다.',
        'Headlamps and chassis electronics.': '헤드램프와 차체 전장 부품을 생산합니다.',
        'Metal stamping and forming.': '금속 프레스 및 성형 가공을 수행합니다.',
        'Injection molding for interior parts.': '내장 부품용 사출 성형을 담당합니다.',
        'Raw steel coils and sheets.': '철강 코일과 강판 등 원소재를 공급합니다.',
        'Plastic granules and battery materials.': '플라스틱 원료와 배터리 소재를 공급합니다.',
        'Home appliances and home entertainment.': '생활가전과 홈엔터테인먼트 제품을 생산합니다.',
        'OLED/LCD Panels.': 'OLED 및 LCD 패널을 생산합니다.',
        'Camera modules and motor components.': '카메라 모듈과 모터 부품을 생산합니다.',
        'Mainboards and rigid-flex PCBs.': '메인보드와 경연성 PCB를 생산합니다.',
        'Plastic and metal casings.': '플라스틱 및 금속 케이스를 생산합니다.',
        'PMIC and logic chips.': 'PMIC와 로직 칩을 설계·생산합니다.',
        'Silicon wafers.': '실리콘 웨이퍼를 공급합니다.',
        'Rare earth minerals for magnets.': '자석용 희토류 광물을 채굴·공급합니다.',
        'Global leader in consumer electronics and semiconductors.': '가전과 반도체를 아우르는 글로벌 선도 기업입니다.',
        'OLED and QD-Display panels.': 'OLED 및 QD-Display 패널을 생산합니다.',
        'MLCC, Camera modules, and substrates.': 'MLCC, 카메라 모듈, 기판을 생산합니다.',
        'Photoresists and wet chemicals for semiconductor processes.': '반도체 공정용 포토레지스트와 습식 화학소재를 공급합니다.',
        'High purity chemicals for etching and cleaning.': '식각·세정 공정용 고순도 화학소재를 공급합니다.',
        'Semiconductor manufacturing equipment parts.': '반도체 제조 장비 부품을 공급합니다.',
        'Hydrogen peroxide and precursor materials.': '과산화수소와 전구체 소재를 공급합니다.',
        'Raw silicon ingots.': '실리콘 잉곳 원소재를 공급합니다.',
        'Rare earth minerals and gases.': '희토류 광물과 특수가스를 공급합니다.',
    };

    // Role descriptors / placeholders stored in corpInfo (not personal names).
    const corpValueLabels: Record<string, string> = {
        'Local Operator': '현지 운영사',
        'Trading Group': '무역 상사',
        'Unknown': '비공개',
    };

    const nodeTypeLabels: Record<string, string> = {
        'OEM': 'OEM',
        'Tier1': '1차 협력사',
        'Tier2': '2차 협력사',
        'Tier3': '3차 협력사',
        'Tier4': '4차 협력사',
    };

    const levelLabels: Record<string, string> = {
        'All': '전체',
        'Strategic': '전략',
        'Operational': '운영',
        'Technical': '기술',
    };

    const dsStatusLabel = (status: SupplyNode['dataSpaceStatus']) => {
        if (status === 'Active') return isKo ? 'DS 연동' : 'DS Active';
        if (status === 'Pending') return isKo ? '승인 대기' : 'Pending';
        return isKo ? '미등록' : 'None';
    };

    // Helper to generate mock exchanges
    const getMockExchanges = (type: NodeType): DataExchange[] => {
        const base: DataExchange[] = [
            { 
                id: 'dx_1', name: isKo ? '연간 ESG 보고서' : 'Annual ESG Report', level: 'Strategic', status: 'Active', lastUpdate: '2024-01-15', frequency: isKo ? '연 1회' : 'Yearly',
                protocol: 'HTTPS (REST)', format: 'PDF/JSON', description: isKo ? '규제 대응을 위해 요구되는 환경·사회·지배구조 영향 종합 보고서입니다.' : 'Comprehensive environmental, social, and governance impact report required for compliance.',
                sourceSystem: 'Sustainability Portal', targetSystem: 'Supplier Mgmt System', latency: 'N/A',
                samplePayload: '{\n  "reportId": "ESG-2023-KR",\n  "scope1": 1250.5,\n  "scope2": 3400.2,\n  "compliance": "GRI 305"\n}'
            },
            { 
                id: 'dx_2', name: isKo ? '구매 발주서 (PO)' : 'Purchase Order (PO)', level: 'Operational', status: 'Active', lastUpdate: isKo ? '20분 전' : '20 min ago', frequency: isKo ? '실시간' : 'Real-time',
                protocol: 'EDC / HTTP', format: 'JSON (UBL)', description: isKo ? '구매 자동화를 위해 ERP와 실시간으로 동기화되는 전자 발주 정보입니다.' : 'Electronic purchase orders synchronized with ERP systems for automated procurement.',
                sourceSystem: 'SAP S/4HANA', targetSystem: 'Salesforce OMS', latency: '45ms',
                samplePayload: '{\n  "poNumber": "PO-998812",\n  "items": [\n    { "sku": "PART-001", "qty": 500 },\n    { "sku": "PART-002", "qty": 120 }\n  ],\n  "deliveryDate": "2024-06-01"\n}'
            },
        ];
        if (type === 'OEM' || type === 'Tier1') {
            base.push({ 
                id: 'dx_3', name: isKo ? '2025 수요 예측' : 'Demand Forecast 2025', level: 'Strategic', status: 'Active', lastUpdate: isKo ? '2일 전' : '2 days ago', frequency: isKo ? '월 1회' : 'Monthly',
                protocol: 'SFTP / EDC', format: 'XML', description: isKo ? '생산 계획 수립을 지원하는 중장기 수요 예측 데이터입니다.' : 'Long-term demand forecasting data to support production planning.',
                sourceSystem: 'Demand Planner AI', targetSystem: 'ERP Master', latency: '120ms',
                samplePayload: '<Forecast>\n  <Period>2025-Q1</Period>\n  <Volume>50000</Volume>\n  <Confidence>0.89</Confidence>\n</Forecast>'
            });
            base.push({ 
                id: 'dx_4', name: isKo ? '납품 일정 (ASN)' : 'Delivery Schedule (ASN)', level: 'Operational', status: 'Active', lastUpdate: isKo ? '1시간 전' : '1 hr ago', frequency: isKo ? '일 1회' : 'Daily',
                protocol: 'EDC / MQTT', format: 'JSON', description: isKo ? '출하 내역과 도착 예정 시각을 담은 사전 출하 통보서입니다.' : 'Advanced Shipping Notice detailing shipment contents and ETA.',
                sourceSystem: 'Logistics WMS', targetSystem: 'Inbound Dock Sys', latency: '60ms',
                samplePayload: '{\n  "asnId": "ASN-7721",\n  "carrier": "CJ Logistics",\n  "eta": "2024-05-25T14:00:00Z"\n}'
            });
        }
        if (type === 'Tier2' || type === 'Tier3') {
            base.push({ 
                id: 'dx_5', name: isKo ? '품질 검사 로그' : 'Quality Inspection Log', level: 'Technical', status: 'Active', lastUpdate: isKo ? '5초 전' : '5 sec ago', frequency: isKo ? '스트리밍' : 'Stream',
                protocol: 'MQTT / AMQP', format: 'JSON-LD', description: isKo ? '생산 라인의 실시간 센서 측정값과 비전 검사 결과입니다.' : 'Real-time sensor readings and vision inspection results from the production line.',
                sourceSystem: 'Smart Factory IoT', targetSystem: 'Quality Analytics', latency: '12ms',
                samplePayload: '{\n  "deviceId": "CAM-03",\n  "timestamp": 1716304000,\n  "result": "OK",\n  "measurements": [0.012, 0.011]\n}'
            });
            base.push({ 
                id: 'dx_6', name: isKo ? '생산 실적 집계' : 'Production Count', level: 'Operational', status: 'Active', lastUpdate: isKo ? '10분 전' : '10 min ago', frequency: isKo ? '시간별' : 'Hourly',
                protocol: 'HTTP', format: 'JSON', description: isKo ? 'KPI 관리를 위한 시간 단위 생산 실적 집계 데이터입니다.' : 'Hourly production output counters for KPI tracking.',
                sourceSystem: 'MES', targetSystem: 'Dashboard Aggregator', latency: '200ms',
                samplePayload: '{\n  "shift": "A",\n  "line": "L2",\n  "count": 1450,\n  "rejects": 2\n}'
            });
        }
        if (type === 'Tier4') {
            base.push({ 
                id: 'dx_7', name: isKo ? '원자재 시험 성적서' : 'Raw Material Cert', level: 'Technical', status: 'Active', lastUpdate: isKo ? '1일 전' : '1 day ago', frequency: isKo ? '배치 전송' : 'Batch',
                protocol: 'HTTPS', format: 'PDF (Base64)', description: isKo ? '원자재 물성을 검증하는 전자 밀시트(MTC)입니다.' : 'Digital Mill Test Certificates (MTC) verifying raw material properties.',
                sourceSystem: 'Lab LIMS', targetSystem: 'Procurement Portal', latency: '800ms',
                samplePayload: '{\n  "certId": "MTC-9921",\n  "material": "Steel-SS400",\n  "chemical": { "C": 0.18, "Si": 0.25 }\n}'
            });
        }
        if (type === 'Tier1' || type === 'Tier2') {
             base.push({ 
                 id: 'dx_8', name: isKo ? '디지털 트윈 텔레메트리' : 'Digital Twin Telemetry', level: 'Technical', status: 'Paused', lastUpdate: isKo ? '2주 전' : '2 weeks ago', frequency: isKo ? '스트리밍' : 'Stream',
                 protocol: 'OPC-UA / EDC', format: 'Binary', description: isKo ? '디지털 트윈 모델 동기화를 위한 고정밀 텔레메트리 데이터입니다.' : 'High-fidelity telemetry data for synchronizing Digital Twin models.',
                 sourceSystem: 'PLC Controller', targetSystem: 'DT Server', latency: '8ms',
                 samplePayload: '[Binary Stream Data...]'
             });
        }
        return base;
    };

    // Helper function to visualize payload
    const renderPayloadVisuals = (payload: string) => {
        // Handle Binary/Stream
        if (payload.includes('[Binary')) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 animate-pulse">
                        <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-700">{isKo ? '실시간 바이너리 스트림' : 'Real-time Binary Stream'}</h4>
                    <p className="text-xs text-slate-500 mt-1">{isKo ? '고주기 센서 데이터 스트림 (OPC-UA)' : 'High-frequency sensor data stream (OPC-UA)'}</p>
                </div>
            );
        }

        // Handle XML
        if (payload.trim().startsWith('<')) {
            const parser = new DOMParser();
            try {
                const xmlDoc = parser.parseFromString(payload, "text/xml");
                const root = xmlDoc.documentElement;
                const children = Array.from(root.children);
                
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                            <FileText className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-bold text-slate-600 uppercase">{root.tagName}{isKo ? ' 문서' : ' Document'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {children.map((child, idx) => (
                                <div key={idx} className="bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                                    <span className="text-[10px] text-orange-400 font-bold uppercase block mb-1">{child.tagName}</span>
                                    <span className="text-sm font-bold text-slate-800">{child.textContent}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } catch (e) {
                return <div className="text-xs text-slate-500">{isKo ? 'XML 데이터 (파싱 오류)' : 'XML Data (Parse Error)'}</div>;
            }
        }

        // Handle JSON
        try {
            const data = JSON.parse(payload);
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(data).map((entry, idx) => {
                        const [key, value] = entry;
                        let icon = <Database className="w-4 h-4 text-slate-400" />;
                        let colorClass = "bg-slate-50 border-slate-200";
                        let labelColor = "text-slate-500";
                        
                        // Heuristics for icons/colors
                        if (key.toLowerCase().includes('id') || key.toLowerCase().includes('number')) {
                            icon = <FileText className="w-4 h-4 text-blue-500" />;
                            colorClass = "bg-blue-50 border-blue-100";
                            labelColor = "text-blue-400";
                        } else if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) {
                            icon = <Clock className="w-4 h-4 text-purple-500" />;
                            colorClass = "bg-purple-50 border-purple-100";
                            labelColor = "text-purple-400";
                        } else if (key.toLowerCase().includes('scope') || key.toLowerCase().includes('co2')) {
                            icon = <Leaf className="w-4 h-4 text-emerald-500" />;
                            colorClass = "bg-emerald-50 border-emerald-100";
                            labelColor = "text-emerald-500";
                        } else if (typeof value === 'object') {
                            icon = <Layers className="w-4 h-4 text-indigo-500" />;
                        }

                        // Format Value
                        let displayValue: React.ReactNode = String(value);
                        if (typeof value === 'object') {
                            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                                // Simple preview for array of objects (like PO items)
                                displayValue = (
                                    <div className="flex flex-col gap-1 mt-1">
                                        {value.map((v: any, i: number) => (
                                            <div key={i} className="text-[10px] bg-white/50 px-2 py-1 rounded border border-slate-100">
                                                {Object.values(v).join(' - ')}
                                            </div>
                                        ))}
                                    </div>
                                );
                            } else if (typeof value === 'object' && value !== null) {
                                // Flatten simple object
                                displayValue = (
                                     <div className="flex flex-wrap gap-1 mt-1">
                                        {Object.entries(value).map((entry, i) => {
                                            const [k, v] = entry;
                                            return (
                                                <span key={i} className="text-[10px] bg-white/80 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                                                    {k}: {String(v)}
                                                </span>
                                            );
                                        })}
                                    </div>
                                );
                            } else {
                                displayValue = Array.isArray(value)
                                    ? (isKo ? `${value.length}개 항목` : `${value.length} Items`)
                                    : (isKo ? '객체 데이터' : 'Object Data');
                            }
                        }

                        return (
                            <div key={idx} className={`p-3 rounded-xl border ${colorClass} flex flex-col justify-center`}>
                                <div className="flex items-center gap-2 mb-1">
                                    {icon}
                                    <span className={`text-[10px] font-bold uppercase tracking-wide truncate ${labelColor}`}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                </div>
                                <div className="text-sm font-bold text-slate-800 break-words pl-6">
                                    {displayValue}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        } catch (e) {
            return <div className="text-xs text-red-500">{isKo ? '페이로드 형식을 시각화할 수 없습니다.' : 'Unable to visualize payload format.'}</div>;
        }
    };

    // Mock Data for Hyundai
    const hyundaiNodes: SupplyNode[] = [
        { 
            id: 'h_oem', label: 'Hyundai Motor', type: 'OEM', industry: 'Automotive', riskLevel: 'Low', carbonFootprint: 12500, compliance: true, x: 750, y: 250, description: 'Global OEM. Final assembly and distribution.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Jaehoon Chang', founded: '1967', hq: 'Seoul, Korea', employees: '120,000+', revenue: '$110B' },
            dataExchanges: getMockExchanges('OEM')
        },
        { 
            id: 'h_t1_1', label: 'Hyundai Mobis', type: 'Tier1', industry: 'Auto Parts', riskLevel: 'Low', carbonFootprint: 4500, compliance: true, x: 600, y: 150, description: 'Chassis, Cockpit, and Frontend modules.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Sung Hwan Cho', founded: '1977', hq: 'Seoul, Korea', employees: '30,000+', revenue: '$35B' },
            dataExchanges: getMockExchanges('Tier1')
        },
        { 
            id: 'h_t1_2', label: 'HL Mando', type: 'Tier1', industry: 'Auto Parts', riskLevel: 'Low', carbonFootprint: 3200, compliance: true, x: 600, y: 350, description: 'Brake, Steering, and Suspension systems.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Seong-Hyeon Cho', founded: '1962', hq: 'Pyeongtaek, Korea', employees: '11,000+', revenue: '$5.5B' },
            dataExchanges: getMockExchanges('Tier1')
        },
        { 
            id: 'h_t2_1', label: 'Hyundai WIA', type: 'Tier2', industry: 'Powertrain', riskLevel: 'Low', carbonFootprint: 2800, compliance: true, x: 450, y: 100, description: 'Engine parts and constant velocity joints.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Jae-Wook Jung', founded: '1976', hq: 'Changwon, Korea', employees: '8,500', revenue: '$6.2B' },
            dataExchanges: getMockExchanges('Tier2')
        },
        { 
            id: 'h_t2_2', label: 'SL Corp', type: 'Tier2', industry: 'Electronics', riskLevel: 'Medium', carbonFootprint: 1500, compliance: true, x: 450, y: 380, description: 'Headlamps and chassis electronics.',
            dataSpaceStatus: 'Active', isCertified: false,
            corpInfo: { ceo: 'Lee Sung-yeop', founded: '1954', hq: 'Daegu, Korea', employees: '12,000', revenue: '$3.1B' },
            dataExchanges: getMockExchanges('Tier2')
        },
        { 
            id: 'h_t3_1', label: 'Local Stamping', type: 'Tier3', industry: 'Metal', riskLevel: 'Medium', carbonFootprint: 800, compliance: false, x: 300, y: 100, description: 'Metal stamping and forming.',
            dataSpaceStatus: 'Pending', isCertified: false,
            corpInfo: { ceo: 'Kim Chul-soo', founded: '1998', hq: 'Gyeongju, Korea', employees: '150', revenue: '$40M' },
            dataExchanges: getMockExchanges('Tier3')
        },
        { 
            id: 'h_t3_2', label: 'Mold Tech', type: 'Tier3', industry: 'Plastic', riskLevel: 'Low', carbonFootprint: 600, compliance: true, x: 300, y: 300, description: 'Injection molding for interior parts.',
            dataSpaceStatus: 'Active', isCertified: false,
            corpInfo: { ceo: 'Park Min-kyu', founded: '2005', hq: 'Asan, Korea', employees: '80', revenue: '$25M' },
            dataExchanges: getMockExchanges('Tier3')
        },
        { 
            id: 'h_t4_1', label: 'POSCO', type: 'Tier4', industry: 'Steel', riskLevel: 'Low', carbonFootprint: 15000, compliance: true, x: 150, y: 150, description: 'Raw steel coils and sheets.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Jeong-woo Choi', founded: '1968', hq: 'Pohang, Korea', employees: '35,000', revenue: '$60B' },
            dataExchanges: getMockExchanges('Tier4')
        },
        { 
            id: 'h_t4_2', label: 'LG Chem', type: 'Tier4', industry: 'Chemical', riskLevel: 'Low', carbonFootprint: 8000, compliance: true, x: 150, y: 350, description: 'Plastic granules and battery materials.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Hak Cheol Shin', founded: '1947', hq: 'Seoul, Korea', employees: '19,000', revenue: '$42B' },
            dataExchanges: getMockExchanges('Tier4')
        },
    ];

    const hyundaiLinks: SupplyLink[] = [
        { from: 'h_t4_1', to: 'h_t3_1' },
        { from: 'h_t4_1', to: 'h_t2_1' },
        { from: 'h_t4_2', to: 'h_t3_2' },
        { from: 'h_t3_1', to: 'h_t2_1' },
        { from: 'h_t3_2', to: 'h_t2_2' },
        { from: 'h_t2_1', to: 'h_t1_1' },
        { from: 'h_t2_2', to: 'h_t1_1' },
        { from: 'h_t2_2', to: 'h_t1_2' },
        { from: 'h_t1_1', to: 'h_oem' },
        { from: 'h_t1_2', to: 'h_oem' },
    ];

    // Mock Data for LG
    const lgNodes: SupplyNode[] = [
        { 
            id: 'l_oem', label: 'LG Electronics', type: 'OEM', industry: 'Consumer Elec', riskLevel: 'Low', carbonFootprint: 8500, compliance: true, x: 750, y: 250, description: 'Home appliances and home entertainment.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'William Cho', founded: '1958', hq: 'Seoul, Korea', employees: '75,000', revenue: '$63B' },
            dataExchanges: getMockExchanges('OEM')
        },
        { 
            id: 'l_t1_1', label: 'LG Display', type: 'Tier1', industry: 'Display', riskLevel: 'Low', carbonFootprint: 6200, compliance: true, x: 600, y: 150, description: 'OLED/LCD Panels.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Jeong Ho-young', founded: '1999', hq: 'Seoul, Korea', employees: '28,000', revenue: '$20B' },
            dataExchanges: getMockExchanges('Tier1')
        },
        { 
            id: 'l_t1_2', label: 'LG Innotek', type: 'Tier1', industry: 'Components', riskLevel: 'Low', carbonFootprint: 2100, compliance: true, x: 600, y: 350, description: 'Camera modules and motor components.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Cheol-dong Jeong', founded: '1970', hq: 'Seoul, Korea', employees: '13,000', revenue: '$15B' },
            dataExchanges: getMockExchanges('Tier1')
        },
        { 
            id: 'l_t2_1', label: 'PCB Supplier A', type: 'Tier2', industry: 'Electronics', riskLevel: 'Medium', carbonFootprint: 1200, compliance: true, x: 450, y: 120, description: 'Mainboards and rigid-flex PCBs.',
            dataSpaceStatus: 'Active', isCertified: false,
            corpInfo: { ceo: 'Park Jin-woo', founded: '1988', hq: 'Incheon, Korea', employees: '1,200', revenue: '$300M' },
            dataExchanges: getMockExchanges('Tier2')
        },
        { 
            id: 'l_t2_2', label: 'Casing Corp', type: 'Tier2', industry: 'Manufacturing', riskLevel: 'Low', carbonFootprint: 900, compliance: true, x: 450, y: 380, description: 'Plastic and metal casings.',
            dataSpaceStatus: 'Pending', isCertified: false,
            corpInfo: { ceo: 'Choi Min-ho', founded: '2001', hq: 'Gumi, Korea', employees: '450', revenue: '$80M' },
            dataExchanges: getMockExchanges('Tier2')
        },
        { 
            id: 'l_t3_1', label: 'Chip Maker X', type: 'Tier3', industry: 'Semiconductor', riskLevel: 'High', carbonFootprint: 3000, compliance: false, x: 300, y: 150, description: 'PMIC and logic chips.',
            dataSpaceStatus: 'None', isCertified: false,
            corpInfo: { ceo: 'Wang Wei', founded: '2010', hq: 'Shenzhen, China', employees: '800', revenue: '$150M' },
            dataExchanges: getMockExchanges('Tier3')
        },
        { 
            id: 'l_t4_1', label: 'Wafer Co', type: 'Tier4', industry: 'Raw Material', riskLevel: 'Medium', carbonFootprint: 4500, compliance: true, x: 150, y: 150, description: 'Silicon wafers.',
            dataSpaceStatus: 'Pending', isCertified: false,
            corpInfo: { ceo: 'Sato Kenji', founded: '1995', hq: 'Tokyo, Japan', employees: '300', revenue: '$90M' },
            dataExchanges: getMockExchanges('Tier4')
        },
        { 
            id: 'l_t4_2', label: 'Rare Earth Mining', type: 'Tier4', industry: 'Mining', riskLevel: 'High', carbonFootprint: 9000, compliance: false, x: 150, y: 350, description: 'Rare earth minerals for magnets.',
            dataSpaceStatus: 'None', isCertified: false,
            corpInfo: { ceo: 'Local Operator', founded: '2008', hq: 'Inner Mongolia', employees: 'Unknown', revenue: 'Unknown' },
            dataExchanges: getMockExchanges('Tier4')
        },
    ];

    const lgLinks: SupplyLink[] = [
        { from: 'l_t4_1', to: 'l_t3_1' },
        { from: 'l_t4_2', to: 'l_t3_1' }, 
        { from: 'l_t3_1', to: 'l_t2_1' },
        { from: 'l_t2_1', to: 'l_t1_1' },
        { from: 'l_t2_1', to: 'l_t1_2' },
        { from: 'l_t2_2', to: 'l_t1_2' },
        { from: 'l_t2_2', to: 'l_oem' },
        { from: 'l_t1_1', to: 'l_oem' },
        { from: 'l_t1_2', to: 'l_oem' },
    ];

    // Mock Data for Samsung
    const samsungNodes: SupplyNode[] = [
        { 
            id: 's_oem', label: 'Samsung Elec', type: 'OEM', industry: 'Electronics', riskLevel: 'Low', carbonFootprint: 18500, compliance: true, x: 750, y: 250, description: 'Global leader in consumer electronics and semiconductors.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Han Jong-hee', founded: '1969', hq: 'Suwon, Korea', employees: '270,000+', revenue: '$230B' },
            dataExchanges: getMockExchanges('OEM')
        },
        { 
            id: 's_t1_1', label: 'Samsung Display', type: 'Tier1', industry: 'Display', riskLevel: 'Low', carbonFootprint: 5200, compliance: true, x: 600, y: 150, description: 'OLED and QD-Display panels.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Choi Joo-sun', founded: '2012', hq: 'Yongin, Korea', employees: '22,000', revenue: '$25B' },
            dataExchanges: getMockExchanges('Tier1')
        },
        { 
            id: 's_t1_2', label: 'Samsung Electro', type: 'Tier1', industry: 'Components', riskLevel: 'Low', carbonFootprint: 3100, compliance: true, x: 600, y: 350, description: 'MLCC, Camera modules, and substrates.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Chang Duck-hyun', founded: '1973', hq: 'Suwon, Korea', employees: '35,000', revenue: '$7.5B' },
            dataExchanges: getMockExchanges('Tier1')
        },
        { 
            id: 's_t2_1', label: 'Dongjin Semichem', type: 'Tier2', industry: 'Chemicals', riskLevel: 'Medium', carbonFootprint: 2200, compliance: true, x: 450, y: 100, description: 'Photoresists and wet chemicals for semiconductor processes.',
            dataSpaceStatus: 'Active', isCertified: false,
            corpInfo: { ceo: 'Lee Joon-hyuk', founded: '1967', hq: 'Seoul, Korea', employees: '1,500', revenue: '$850M' },
            dataExchanges: getMockExchanges('Tier2')
        },
        { 
            id: 's_t2_2', label: 'Soulbrain', type: 'Tier2', industry: 'Materials', riskLevel: 'Low', carbonFootprint: 1900, compliance: true, x: 450, y: 380, description: 'High purity chemicals for etching and cleaning.',
            dataSpaceStatus: 'Active', isCertified: true,
            corpInfo: { ceo: 'Jung Ji-wan', founded: '1986', hq: 'Seongnam, Korea', employees: '900', revenue: '$780M' },
            dataExchanges: getMockExchanges('Tier2')
        },
        { 
            id: 's_t3_1', label: 'Wonik IPS', type: 'Tier3', industry: 'Equipment', riskLevel: 'Low', carbonFootprint: 1200, compliance: true, x: 300, y: 120, description: 'Semiconductor manufacturing equipment parts.',
            dataSpaceStatus: 'Pending', isCertified: false,
            corpInfo: { ceo: 'Lee Hyun-deok', founded: '1991', hq: 'Pyeongtaek, Korea', employees: '1,400', revenue: '$600M' },
            dataExchanges: getMockExchanges('Tier3')
        },
        { 
            id: 's_t3_2', label: 'Hansol Chemical', type: 'Tier3', industry: 'Chemicals', riskLevel: 'Medium', carbonFootprint: 2500, compliance: true, x: 300, y: 300, description: 'Hydrogen peroxide and precursor materials.',
            dataSpaceStatus: 'Active', isCertified: false,
            corpInfo: { ceo: 'Cho Dong-hyuk', founded: '1980', hq: 'Seoul, Korea', employees: '750', revenue: '$550M' },
            dataExchanges: getMockExchanges('Tier3')
        },
        { 
            id: 's_t4_1', label: 'Global Silicon', type: 'Tier4', industry: 'Raw Material', riskLevel: 'Low', carbonFootprint: 8000, compliance: true, x: 150, y: 150, description: 'Raw silicon ingots.',
            dataSpaceStatus: 'None', isCertified: false,
            corpInfo: { ceo: 'Robert Miller', founded: '1985', hq: 'Texas, USA', employees: '500', revenue: '$200M' },
            dataExchanges: getMockExchanges('Tier4')
        },
        { 
            id: 's_t4_2', label: 'Rare Earth Imp', type: 'Tier4', industry: 'Mining', riskLevel: 'High', carbonFootprint: 6000, compliance: false, x: 150, y: 350, description: 'Rare earth minerals and gases.',
            dataSpaceStatus: 'None', isCertified: false,
            corpInfo: { ceo: 'Trading Group', founded: '2012', hq: 'Singapore', employees: '50', revenue: '$80M' },
            dataExchanges: getMockExchanges('Tier4')
        },
    ];

    const samsungLinks: SupplyLink[] = [
        { from: 's_t4_1', to: 's_t3_1' },
        { from: 's_t4_1', to: 's_t2_1' },
        { from: 's_t4_2', to: 's_t3_2' },
        { from: 's_t3_1', to: 's_t2_1' },
        { from: 's_t3_2', to: 's_t2_2' },
        { from: 's_t2_1', to: 's_t1_1' }, // Chemicals to Display
        { from: 's_t2_1', to: 's_oem' },  // Chemicals direct to Fab (OEM)
        { from: 's_t2_2', to: 's_oem' },  // Materials direct to Fab
        { from: 's_t2_2', to: 's_t1_2' },
        { from: 's_t1_1', to: 's_oem' },
        { from: 's_t1_2', to: 's_oem' },
    ];

    const nodes = selectedChain === 'HYUNDAI' ? hyundaiNodes : selectedChain === 'LG' ? lgNodes : samsungNodes;
    const links = selectedChain === 'HYUNDAI' ? hyundaiLinks : selectedChain === 'LG' ? lgLinks : samsungLinks;

    // Resolved fresh on every render, so both modals follow the language toggle.
    const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) ?? null : null;
    const selectedExchange = selectedNode && selectedExchangeId
        ? selectedNode.dataExchanges.find(ex => ex.id === selectedExchangeId) ?? null
        : null;

    // Helper to get color by risk
    const getRiskColor = (risk: string) => {
        switch(risk) {
            case 'High': return 'text-red-500 bg-red-100 border-red-200';
            case 'Medium': return 'text-amber-500 bg-amber-100 border-amber-200';
            default: return 'text-emerald-500 bg-emerald-100 border-emerald-200';
        }
    };

    const getExchangeLevelColor = (level: ExchangeLevel) => {
        switch(level) {
            case 'Strategic': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Operational': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Technical': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-12 h-full flex flex-col relative">
            
            {/* DATA EXCHANGE DETAIL MODAL */}
            {selectedExchange && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleUp">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getExchangeLevelColor(selectedExchange.level)}`}>
                                        {localize(levelLabels, selectedExchange.level)}
                                    </span>
                                    {selectedExchange.status === 'Active' && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> {isKo ? '활성' : 'Active'}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{selectedExchange.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{selectedExchange.description}</p>
                            </div>
                            <button onClick={() => setSelectedExchangeId(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            
                            {/* Technical Specs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{isKo ? '프로토콜 / 포맷' : 'Protocol / Format'}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-800">{selectedExchange.protocol}</span>
                                        <span className="text-xs text-slate-400">({selectedExchange.format})</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{isKo ? '주기 / 지연시간' : 'Frequency / Latency'}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-800">{selectedExchange.frequency}</span>
                                        <span className="text-xs text-emerald-600 font-medium">({selectedExchange.latency})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Data Flow Visualization */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-white border border-slate-300 rounded-lg flex items-center justify-center mx-auto mb-2 text-slate-600">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 block">{isKo ? '송신 측' : 'Source'}</span>
                                    <span className="text-xs font-bold text-slate-800">{selectedExchange.sourceSystem}</span>
                                </div>
                                
                                <div className="flex-1 px-4 flex flex-col items-center">
                                    <div className="w-full h-0.5 bg-slate-300 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[9px] font-bold border border-blue-200">
                                            EDC Connector
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 mt-1" />
                                </div>

                                <div className="text-center">
                                    <div className="w-10 h-10 bg-white border border-slate-300 rounded-lg flex items-center justify-center mx-auto mb-2 text-slate-600">
                                        <Server className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 block">{isKo ? '수신 측' : 'Target'}</span>
                                    <span className="text-xs font-bold text-slate-800">{selectedExchange.targetSystem}</span>
                                </div>
                            </div>

                            {/* Payload Inspector with Toggle */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <FileJson className="w-4 h-4 text-slate-500" />
                                        {isKo ? '페이로드 인스펙터' : 'Payload Inspector'}
                                    </h4>
                                    <div className="bg-slate-100 p-0.5 rounded-lg flex gap-1">
                                        <button 
                                            onClick={() => setPayloadViewMode('visual')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                                                payloadViewMode === 'visual' 
                                                ? 'bg-white text-blue-600 shadow-sm' 
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                        >
                                            <Eye className="w-3 h-3" /> {isKo ? '시각화' : 'Visual'}
                                        </button>
                                        <button 
                                            onClick={() => setPayloadViewMode('raw')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                                                payloadViewMode === 'raw' 
                                                ? 'bg-white text-blue-600 shadow-sm' 
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                        >
                                            <Code className="w-3 h-3" /> {isKo ? '원본 코드' : 'Raw Code'}
                                        </button>
                                    </div>
                                </div>
                                
                                {payloadViewMode === 'visual' ? (
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-48 overflow-y-auto">
                                        {renderPayloadVisuals(selectedExchange.samplePayload)}
                                    </div>
                                ) : (
                                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-auto max-h-48 border border-slate-700 relative group">
                                        <button className="absolute top-2 right-2 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <pre>{selectedExchange.samplePayload}</pre>
                                    </div>
                                )}
                            </div>

                            {/* Recent Logs (Mini Table) */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    {isKo ? '최근 전송 이력' : 'Recent Transfers'}
                                </h4>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 text-slate-500">
                                            <tr>
                                                <th className="px-3 py-2 font-medium">{isKo ? '시각' : 'Time'}</th>
                                                <th className="px-3 py-2 font-medium">{isKo ? '상태' : 'Status'}</th>
                                                <th className="px-3 py-2 font-medium text-right">{isKo ? '크기' : 'Size'}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="px-3 py-2 text-slate-600">{selectedExchange.lastUpdate}</td>
                                                <td className="px-3 py-2 text-emerald-600 font-bold">{isKo ? '성공' : 'Success'}</td>
                                                <td className="px-3 py-2 text-right text-slate-600">24KB</td>
                                            </tr>
                                            <tr>
                                                <td className="px-3 py-2 text-slate-600">{isKo ? '1시간 전' : '1 hour ago'}</td>
                                                <td className="px-3 py-2 text-emerald-600 font-bold">{isKo ? '성공' : 'Success'}</td>
                                                <td className="px-3 py-2 text-right text-slate-600">22KB</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                        
                        {/* Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                            <button 
                                onClick={() => setSelectedExchangeId(null)}
                                className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                {isKo ? '보고서 닫기' : 'Close Report'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FULL PROFILE MODAL */}
            {showProfileModal && selectedNode && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp relative flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-start shrink-0">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-slate-900 font-bold text-3xl shadow-lg">
                                    {selectedNode.label.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-bold">{selectedNode.label}</h2>
                                        {selectedNode.isCertified && (
                                            <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold border border-amber-200">
                                                <BadgeCheck className="w-4 h-4" /> {isKo ? '인증 완료' : 'Certified'}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-slate-400 text-sm flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> {localize(industryLabels, selectedNode.industry)} • {localize(hqLabels, selectedNode.corpInfo.hq).split(',')[1]}
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded font-mono">BPN: BPN-L-{selectedNode.id.toUpperCase()}</span>
                                        <span className="bg-blue-900 text-blue-200 text-[10px] px-2 py-1 rounded font-mono flex items-center gap-1"><Server className="w-3 h-3" /> EDC: edc-{selectedNode.id}-kr</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
                            {/* --- INFOGRAPHIC BAND --- */}
                            {(() => {
                                const TIERS: NodeType[] = ['Tier4', 'Tier3', 'Tier2', 'Tier1', 'OEM'];
                                const here = TIERS.indexOf(selectedNode.type);
                                // Fixed viewBox with uniform scaling, so the animated
                                // marker stays round and the dashes stay even.
                                const X = (i: number) => 40 + i * 80;
                                const carbonMax = Math.max(...nodes.map(n => n.carbonFootprint));
                                const carbonShare = Math.round((selectedNode.carbonFootprint / carbonMax) * 100);
                                const byLevel = (['Strategic', 'Operational', 'Technical'] as ExchangeLevel[])
                                    .map(level => ({
                                        level,
                                        labelKo: level === 'Strategic' ? '전략' : level === 'Operational' ? '운영' : '기술',
                                        count: selectedNode.dataExchanges.filter(ex => ex.level === level).length,
                                    }));
                                const exTotal = Math.max(1, selectedNode.dataExchanges.length);
                                // Fixed order, never cycled.
                                const LEVEL_COLORS = ['#2563eb', '#059669', '#7c3aed'];
                                const riskTone = selectedNode.riskLevel === 'Low'
                                    ? { bar: 'bg-emerald-500', text: 'text-emerald-700', pct: 25 }
                                    : selectedNode.riskLevel === 'Medium'
                                    ? { bar: 'bg-amber-500', text: 'text-amber-700', pct: 60 }
                                    : { bar: 'bg-red-500', text: 'text-red-700', pct: 90 };

                                return (
                                    <div className="mb-8 space-y-4">
                                        {/* Position in the chain, with data flowing toward the OEM */}
                                        <div className="bg-slate-900 rounded-2xl p-5">
                                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                                                {isKo ? '공급망 내 위치' : 'Position in the chain'}
                                            </h3>
                                            <svg viewBox="0 0 400 92" className="w-full h-[92px]" role="img"
                                                aria-label={isKo ? '공급망 단계 다이어그램' : 'Supply chain tier diagram'}>
                                                <line x1={X(0)} y1="34" x2={X(4)} y2="34" stroke="#334155" strokeWidth="2" />
                                                <path id="scm-flow" d={`M ${X(0)} 34 L ${X(4)} 34`} fill="none" stroke="none" />
                                                {[0, 1, 2].map(i => (
                                                    <circle key={i} r="3.5" fill="#38bdf8">
                                                        <animateMotion dur="3s" begin={`${i}s`} repeatCount="indefinite">
                                                            <mpath href="#scm-flow" />
                                                        </animateMotion>
                                                    </circle>
                                                ))}
                                                {TIERS.map((tier, i) => {
                                                    const active = i === here;
                                                    return (
                                                        <g key={tier}>
                                                            {active && (
                                                                <circle cx={X(i)} cy="34" r="12" fill="none" stroke="#3b82f6" strokeWidth="2">
                                                                    <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
                                                                    <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite" />
                                                                </circle>
                                                            )}
                                                            <circle cx={X(i)} cy="34" r={active ? 11 : 7}
                                                                fill={active ? '#3b82f6' : '#1e293b'} stroke={active ? '#93c5fd' : '#475569'} strokeWidth="2" />
                                                            <text x={X(i)} y="66" textAnchor="middle" fontSize="11"
                                                                fill={active ? '#bfdbfe' : '#94a3b8'} fontWeight={active ? 700 : 400}>{tier}</text>
                                                            {active && (
                                                                <text x={X(i)} y="82" textAnchor="middle" fontSize="10" fill="#3b82f6" fontWeight="700">
                                                                    {isKo ? '이 기업' : 'This company'}
                                                                </text>
                                                            )}
                                                        </g>
                                                    );
                                                })}
                                            </svg>
                                        </div>

                                        {/* Three readings, each labelled and numbered as well as coloured */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                                    {isKo ? '공급 리스크' : 'Supply risk'}
                                                </p>
                                                <p className={`text-xl font-bold ${riskTone.text}`}>
                                                    {isKo ? (selectedNode.riskLevel === 'Low' ? '낮음' : selectedNode.riskLevel === 'Medium' ? '보통' : '높음') : selectedNode.riskLevel}
                                                </p>
                                                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${riskTone.bar} rounded-full transition-all duration-700`} style={{ width: `${riskTone.pct}%` }} />
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                                    {isKo ? '탄소 배출량' : 'Carbon footprint'}
                                                </p>
                                                <p className="text-xl font-bold text-slate-900 tabular-nums">
                                                    {selectedNode.carbonFootprint.toLocaleString()} <span className="text-xs font-medium text-slate-400">kgCO2e</span>
                                                </p>
                                                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-700 rounded-full transition-all duration-700" style={{ width: `${carbonShare}%` }} />
                                                </div>
                                                <p className="mt-1.5 text-[10px] text-slate-400">
                                                    {isKo ? `이 체인 최대치의 ${carbonShare}%` : `${carbonShare}% of the chain's highest`}
                                                </p>
                                            </div>

                                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                                    {isKo ? '데이터 교환' : 'Data exchanges'}
                                                </p>
                                                <p className="text-xl font-bold text-slate-900 tabular-nums">{selectedNode.dataExchanges.length}</p>
                                                <div className="mt-3 flex h-2 rounded-full overflow-hidden gap-[2px]">
                                                    {byLevel.map((lv, i) => lv.count > 0 && (
                                                        <div key={lv.level} style={{ width: `${(lv.count / exTotal) * 100}%`, backgroundColor: LEVEL_COLORS[i] }} />
                                                    ))}
                                                </div>
                                                <ul className="mt-2 space-y-0.5">
                                                    {byLevel.map((lv, i) => (
                                                        <li key={lv.level} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                                            <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: LEVEL_COLORS[i] }} />
                                                            <span>{isKo ? lv.labelKo : lv.level}</span>
                                                            <span className="ml-auto font-mono tabular-nums text-slate-700">{lv.count}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Left Col: Overview & Connectivity */}
                                <div className="space-y-6">
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-blue-600" /> {isKo ? '기업 개요' : 'Corporate Profile'}
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                                <span className="text-slate-500">{isKo ? '대표이사' : 'CEO'}</span>
                                                <span className="font-medium text-slate-900">{localize(corpValueLabels, selectedNode.corpInfo.ceo)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                                <span className="text-slate-500">{isKo ? '본사' : 'Headquarters'}</span>
                                                <span className="font-medium text-slate-900">{localize(hqLabels, selectedNode.corpInfo.hq)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                                <span className="text-slate-500">{isKo ? '설립연도' : 'Founded'}</span>
                                                <span className="font-medium text-slate-900">{selectedNode.corpInfo.founded}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                                <span className="text-slate-500">{isKo ? '임직원 수' : 'Employees'}</span>
                                                <span className="font-medium text-slate-900">{localize(corpValueLabels, selectedNode.corpInfo.employees)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">{isKo ? '매출액' : 'Revenue'}</span>
                                                <span className="font-medium text-emerald-600 font-bold">{localize(corpValueLabels, selectedNode.corpInfo.revenue)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Database className="w-4 h-4 text-purple-600" /> {isKo ? '제공 가능 데이터 자산' : 'Available Data Assets'}
                                        </h3>
                                        <div className="space-y-2">
                                            {[
                                                { name: 'Carbon Footprint Report (PCF)', nameKo: '탄소발자국 보고서 (PCF)', type: 'Report', typeKo: '보고서', access: 'Restricted', accessKo: '제한' },
                                                { name: 'Quality Inspection Logs', nameKo: '품질 검사 로그', type: 'IoT Series', typeKo: 'IoT 시계열', access: 'Contract', accessKo: '계약 필요' },
                                                { name: 'Material Safety Data Sheet', nameKo: '물질안전보건자료 (MSDS)', type: 'Document', typeKo: '문서', access: 'Public', accessKo: '공개' }
                                            ].map((asset, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-purple-200 transition-colors cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${asset.type === 'IoT Series' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                                                            {asset.type.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-800">{isKo ? asset.nameKo : asset.name}</div>
                                                            <div className="text-[10px] text-slate-500">{isKo ? asset.typeKo : asset.type}</div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-slate-200 text-slate-600">{isKo ? asset.accessKo : asset.access}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: ESG & Trust */}
                                <div className="space-y-6">
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Leaf className="w-4 h-4 text-emerald-600" /> {isKo ? '지속가능성 성과' : 'Sustainability Performance'}
                                        </h3>
                                        <div className="h-40 w-full mb-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={getMockEsgData(language)}>
                                                    <defs>
                                                        <linearGradient id="colorEsg" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                                    <YAxis hide />
                                                    <Tooltip />
                                                    <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorEsg)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                            <span className="text-xs text-emerald-800 font-medium">{isKo ? '연초 대비 감축률' : 'YTD Reduction'}</span>
                                            <span className="text-sm font-bold text-emerald-700">-12.5%</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-blue-600" /> {isKo ? '신뢰 및 규제 준수' : 'Trust & Compliance'}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 border border-slate-200 rounded-lg flex flex-col items-center text-center">
                                                <ShieldCheck className="w-6 h-6 text-blue-500 mb-2" />
                                                <span className="text-xs font-bold text-slate-700">{isKo ? '검증 가능 자격증명 (VC)' : 'Verifiable Credential'}</span>
                                                <span className="text-[10px] text-slate-400">{isKo ? 'Clearing House 발급' : 'Issued by Clearing House'}</span>
                                            </div>
                                            <div className="p-3 border border-slate-200 rounded-lg flex flex-col items-center text-center">
                                                <Lock className="w-6 h-6 text-slate-500 mb-2" />
                                                <span className="text-xs font-bold text-slate-700">ISO 27001</span>
                                                <span className="text-[10px] text-slate-400">{isKo ? '정보보안 표준' : 'Security Standard'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
                            <button onClick={() => setShowProfileModal(false)} className="px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors">
                                {isKo ? '닫기' : 'Close'}
                            </button>
                            <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2">
                                <Network className="w-4 h-4" /> {isKo ? '연동 요청' : 'Request Connection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Network className="w-8 h-8 text-indigo-600" />
                        {t('scm_title')}
                    </h1>
                    <p className="text-slate-500 mt-2">{t('scm_subtitle')}</p>
                </div>
                
                <div className="flex gap-4">
                    {/* View Toggle */}
                    <button 
                        onClick={() => setShowDataLayer(!showDataLayer)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border ${
                            showDataLayer 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        {showDataLayer ? <Server className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        {showDataLayer ? (isKo ? '데이터 레이어 활성' : 'Data Layer Active') : (isKo ? '데이터 레이어 보기' : 'Show Data Layer')}
                    </button>

                    <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                        <button
                            onClick={() => { setSelectedChain('HYUNDAI'); setSelectedNodeId(null); }}
                            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${
                                selectedChain === 'HYUNDAI' 
                                ? 'bg-[#002c5f] text-white shadow' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <Car className="w-4 h-4" />
                            Hyundai
                        </button>
                        <button
                            onClick={() => { setSelectedChain('LG'); setSelectedNodeId(null); }}
                            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${
                                selectedChain === 'LG' 
                                ? 'bg-[#a50034] text-white shadow' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <Monitor className="w-4 h-4" />
                            LG
                        </button>
                        <button
                            onClick={() => { setSelectedChain('SAMSUNG'); setSelectedNodeId(null); }}
                            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${
                                selectedChain === 'SAMSUNG' 
                                ? 'bg-[#1428A0] text-white shadow' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <Cpu className="w-4 h-4" />
                            Samsung
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-6 h-[600px]">
                {/* Visual Map Area */}
                <div className={`flex-1 rounded-2xl border relative overflow-hidden shadow-2xl transition-colors duration-500 ${showDataLayer ? 'bg-slate-900 border-indigo-500/50' : 'bg-slate-900 border-slate-700'}`}>
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
                    </div>

                    {/* Legend */}
                    <div className="absolute top-4 left-4 z-20 bg-slate-800/90 backdrop-blur border border-slate-600 p-3 rounded-lg text-xs text-white">
                        <h4 className="font-bold mb-2 text-slate-400">{t('scm_legend')}</h4>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> {t('scm_oem')}</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> {isKo ? '1차 협력사' : 'Tier 1'}</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> {isKo ? '2차 협력사' : 'Tier 2'}</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> {isKo ? '3차 협력사' : 'Tier 3'}</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500"></div> {isKo ? '4차 협력사 (원자재)' : 'Tier 4 (Raw)'}</div>
                            {showDataLayer && (
                                <>
                                    <div className="h-px bg-slate-600 my-1"></div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div> {isKo ? '신뢰 연결 (신원 검증)' : 'Trust Link (Identity)'}</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#60a5fa]"></div> {isKo ? 'P2P 데이터 흐름' : 'P2P Data Flow'}</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-blue-400"></div> {isKo ? 'DAPS (신뢰 앵커)' : 'DAPS (Trust Anchor)'}</div>
                                </>
                            )}
                        </div>
                    </div>

                    <svg className="w-full h-full" viewBox="0 0 900 500">
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="22" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill={showDataLayer ? '#60a5fa' : '#64748b'} />
                            </marker>
                        </defs>

                        {/* Central Trust Anchor (Data Layer Only) */}
                        {showDataLayer && (
                            <g className="animate-fadeIn">
                                <circle cx={450} cy={250} r={40} fill="#1e1e2e" stroke="#3b82f6" strokeWidth="2" className="animate-pulse" />
                                <foreignObject x={430} y={230} width={40} height={40}>
                                    <div className="flex items-center justify-center w-full h-full text-blue-500">
                                        <ShieldCheck size={24} />
                                    </div>
                                </foreignObject>
                                <text x={450} y={310} textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold">{isKo ? 'DAPS 신뢰 앵커' : 'DAPS Trust Anchor'}</text>
                                
                                {/* Dashed Trust Links (Identity - Yellow/Gold) */}
                                {nodes.map((node) => (
                                    <path 
                                        key={`trust-${node.id}`}
                                        d={`M450,250 L${node.x},${node.y}`}
                                        stroke="#f59e0b" 
                                        strokeWidth="1" 
                                        strokeDasharray="2 4" 
                                        opacity="0.4"
                                    />
                                ))}
                            </g>
                        )}

                        {/* Links (P2P Data Flow) */}
                        {links.map((link, idx) => {
                            const source = nodes.find(n => n.id === link.from)!;
                            const target = nodes.find(n => n.id === link.to)!;
                            // Bezier Curve
                            const d = `M${source.x},${source.y} C${source.x + 100},${source.y} ${target.x - 100},${target.y} ${target.x},${target.y}`;
                            
                            return (
                                <g key={`${link.from}-${link.to}`}>
                                    <path 
                                        d={d} 
                                        stroke={showDataLayer ? '#60a5fa' : '#475569'} 
                                        strokeWidth={showDataLayer ? 2.5 : 2} 
                                        fill="none" 
                                        strokeDasharray={showDataLayer ? '0' : '0'}
                                        markerEnd="url(#arrow)"
                                        className="transition-all duration-500"
                                        opacity={showDataLayer ? 0.8 : 1}
                                    />
                                    {/* P2P Label on Link */}
                                    {showDataLayer && idx % 2 === 0 && (
                                        <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 10} textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold">P2P</text>
                                    )}
                                    {/* Animated Data Packets (Only on Data Links) */}
                                    <circle r={showDataLayer ? 3 : 3} fill={showDataLayer ? '#ffffff' : '#60a5fa'}>
                                        <animateMotion dur={`${showDataLayer ? 1.5 : 3 + (idx % 2)}s`} repeatCount="indefinite" path={d} />
                                    </circle>
                                </g>
                            );
                        })}

                        {/* Nodes */}
                        {nodes.map((node) => {
                            let fillColor = '#64748b'; // Tier 4 default
                            if (node.type === 'OEM') fillColor = selectedChain === 'HYUNDAI' ? '#002c5f' : selectedChain === 'LG' ? '#a50034' : '#1428A0';
                            else if (node.type === 'Tier1') fillColor = '#10b981';
                            else if (node.type === 'Tier2') fillColor = '#8b5cf6';
                            else if (node.type === 'Tier3') fillColor = '#f97316';

                            const isSelected = selectedNode?.id === node.id;

                            return (
                                <g 
                                    key={node.id} 
                                    onClick={() => setSelectedNodeId(node.id)}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <circle 
                                        cx={node.x} 
                                        cy={node.y} 
                                        r={isSelected ? 28 : 24} 
                                        fill={fillColor} 
                                        stroke={isSelected ? '#ffffff' : (showDataLayer ? '#3b82f6' : 'none')}
                                        strokeWidth={isSelected ? 3 : (showDataLayer ? 2 : 0)}
                                        className="shadow-lg drop-shadow-md transition-all"
                                    />
                                    <foreignObject x={node.x - 60} y={node.y + 30} width="120" height="70">
                                        <div className="text-center flex flex-col items-center">
                                            <span className="text-[10px] text-white font-bold block truncate drop-shadow-md bg-slate-900/50 rounded px-2 py-0.5 mb-0.5 max-w-full">{node.label}</span>
                                            <span className="text-[9px] text-slate-300 block mb-1">{localize(nodeTypeLabels, node.type)}</span>
                                            
                                            {/* Status Tag */}
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold border backdrop-blur-sm shadow-sm ${
                                                node.dataSpaceStatus === 'Active' ? 'bg-blue-500/80 text-white border-blue-400' :
                                                node.dataSpaceStatus === 'Pending' ? 'bg-amber-500/80 text-white border-amber-400' :
                                                'bg-slate-600/80 text-slate-300 border-slate-500'
                                            }`}>
                                                {dsStatusLabel(node.dataSpaceStatus)}
                                            </span>
                                        </div>
                                    </foreignObject>
                                    
                                    {/* Icon inside node */}
                                    <foreignObject x={node.x - 10} y={node.y - 10} width="20" height="20" className="pointer-events-none">
                                        <div className="flex items-center justify-center w-full h-full text-white">
                                            {node.type === 'OEM' ? <Building2 size={16} /> : 
                                             node.type === 'Tier4' ? <Layers size={16} /> : 
                                             <Package size={16} />}
                                        </div>
                                    </foreignObject>

                                    {/* EDC Connector Badge (Data Layer) */}
                                    {showDataLayer && (
                                        <foreignObject x={node.x + 10} y={node.y - 25} width="16" height="16">
                                            <div className="bg-white rounded-full p-0.5 border border-blue-500 shadow-sm animate-bounce">
                                                <Server size={12} className="text-blue-600" />
                                            </div>
                                        </foreignObject>
                                    )}

                                    {/* Key Icon for Identity (Trust Link Indicator) */}
                                    {showDataLayer && (
                                        <foreignObject x={node.x - 20} y={node.y - 25} width="16" height="16">
                                            <div className="bg-amber-100 rounded-full p-0.5 border border-amber-500 shadow-sm">
                                                <Key size={10} className="text-amber-600" />
                                            </div>
                                        </foreignObject>
                                    )}

                                    {/* Warning Indicator */}
                                    {node.riskLevel === 'High' && !showDataLayer && (
                                        <foreignObject x={node.x + 10} y={node.y - 30} width="20" height="20">
                                            <div className="animate-bounce">
                                                <AlertTriangle size={16} className="text-red-500 fill-red-500 stroke-white" />
                                            </div>
                                        </foreignObject>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Sidebar Details */}
                <div className={`w-96 bg-white rounded-2xl border border-slate-200 shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${selectedNode ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-50 pointer-events-none hidden md:flex'}`}>
                    {selectedNode ? (
                        <>
                            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white mb-2 inline-block ${selectedNode.type === 'OEM' ? 'bg-blue-600' : 'bg-slate-500'}`}>
                                        {localize(nodeTypeLabels, selectedNode.type)}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedNode.label}</h3>
                                    <p className="text-xs text-slate-500">{localize(industryLabels, selectedNode.industry)}</p>
                                </div>
                                <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {localize(nodeDescriptionLabels, selectedNode.description)}
                                </p>

                                {/* Identity & Trust Badges */}
                                <div className="flex gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border flex items-center gap-1 ${
                                        selectedNode.dataSpaceStatus === 'Active' 
                                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                        <Network className="w-3 h-3" />
                                        {selectedNode.dataSpaceStatus === 'Active' ? (isKo ? '데이터스페이스 참여사' : 'DataSpace Member') : (isKo ? '미등록' : 'Not Registered')}
                                    </span>
                                    {selectedNode.isCertified && (
                                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                            <BadgeCheck className="w-3 h-3" /> {isKo ? '인증 완료' : 'Certified'}
                                        </span>
                                    )}
                                </div>

                                {/* Corporate Intelligence Card */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                                        <Building2 className="w-3 h-3" /> {isKo ? '기업 정보' : 'Corporate Intelligence'}
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <User className="w-4 h-4 text-slate-400 mt-0.5" />
                                            <div>
                                                <span className="text-[10px] text-slate-500 block">{isKo ? '대표이사' : 'CEO'}</span>
                                                <span className="text-xs font-bold text-slate-800">{localize(corpValueLabels, selectedNode.corpInfo.ceo)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                            <div>
                                                <span className="text-[10px] text-slate-500 block">{isKo ? '본사' : 'Headquarters'}</span>
                                                <span className="text-xs font-bold text-slate-800">{localize(hqLabels, selectedNode.corpInfo.hq)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Exchange Levels Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1">
                                            <Wifi className="w-3 h-3" /> {isKo ? '데이터 교환 모니터' : 'Data Exchange Monitor'}
                                        </h4>
                                    </div>
                                    
                                    {/* Tabs */}
                                    <div className="flex gap-1 mb-3 bg-slate-100 p-1 rounded-lg">
                                        {['All', 'Strategic', 'Operational', 'Technical'].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setExchangeFilter(level as ExchangeLevel | 'All')}
                                                className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                                                    exchangeFilter === level 
                                                    ? 'bg-white text-slate-900 shadow-sm' 
                                                    : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                            >
                                                {isKo ? levelLabels[level] : (level === 'All' ? 'All' : level.substring(0, 4))}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        {selectedNode.dataExchanges
                                            .filter(ex => exchangeFilter === 'All' || ex.level === exchangeFilter)
                                            .map((ex) => (
                                            <div 
                                                key={ex.id} 
                                                className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-blue-200 transition-colors shadow-sm cursor-pointer group"
                                                onClick={() => setSelectedExchangeId(ex.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                                        ex.level === 'Strategic' ? 'border-purple-200 bg-purple-50 text-purple-600' :
                                                        ex.level === 'Operational' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                                                        'border-emerald-200 bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                        {ex.level === 'Strategic' ? <BarChart3 className="w-4 h-4" /> :
                                                         ex.level === 'Operational' ? <Truck className="w-4 h-4" /> :
                                                         <Activity className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">{ex.name}</span>
                                                        <span className="text-[10px] text-slate-400">{ex.frequency} • {ex.lastUpdate}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${ex.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-400" />
                                                </div>
                                            </div>
                                        ))}
                                        {selectedNode.dataExchanges.filter(ex => exchangeFilter === 'All' || ex.level === exchangeFilter).length === 0 && (
                                            <div className="text-center py-4 text-xs text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
                                                {isKo ? '해당 레벨에 등록된 데이터 교환이 없습니다.' : 'No exchanges found for this level.'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <div className="p-2 bg-white rounded-full text-emerald-600 shadow-sm">
                                            <Leaf className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-emerald-800 block">{t('scm_carbon')}</span>
                                            <span className="text-lg font-bold text-emerald-900">{selectedNode.carbonFootprint.toLocaleString()} <span className="text-xs font-normal">kgCO2e</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100">
                                <button 
                                    onClick={() => setShowProfileModal(true)}
                                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center justify-center gap-2"
                                >
                                    {isKo ? '전체 프로필 보기' : 'View Full Profile'} <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                            <Network className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-sm font-medium">{t('scm_click_details')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplyChainMap;
