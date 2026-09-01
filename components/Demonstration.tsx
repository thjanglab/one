
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Play, CheckCircle2, Lock, ArrowRight, Database, Server, ShieldCheck, FileJson, RefreshCw, Zap, Factory, Truck, Recycle, Search, ShoppingBag, Box, Activity, ScanEye, Camera, Thermometer, Monitor, Cpu, Settings, FileCheck, Leaf, Globe, X, Share2, BarChart3, Fingerprint, Tag, AlertTriangle, Sparkles, Brain, Network, TrendingUp, Timer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Step = {
    id: number;
    titleKO: string;
    titleEN: string;
    actor: string;
    role: string;
    icon: React.ReactNode;
    actionKO: string;
    actionEN: string;
    dataSnippet: any;
};

type Scenario = {
    id: string;
    labelKO: string;
    labelEN: string;
    steps: Step[];
};

const Demonstration: React.FC = () => {
    const { t, language } = useLanguage();
    // Default to SCM (Scenario 1) instead of Battery (now Scenario 6)
    const [activeScenarioId, setActiveScenarioId] = useState('scm');
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    
    // Modal States
    const [showStepModal, setShowStepModal] = useState(false);
    const [showFinalModal, setShowFinalModal] = useState(false);
    const [modalData, setModalData] = useState<any>(null);

    // Reordered Scenarios: Battery Passport moved to #6
    const scenarios: Scenario[] = [
        {
            id: 'scm',
            labelKO: '1. 공급망 수요관리 (SCM)',
            labelEN: '1. Supply Chain Demand Mgmt',
            steps: [
                {
                    id: 1,
                    titleKO: '시장 판매 데이터 수집', titleEN: 'Retail Sales Data',
                    actor: 'Global Retailer', role: 'Retailer',
                    icon: <ShoppingBag className="w-6 h-6 text-pink-600" />,
                    actionKO: 'POS 데이터 집계 및 수요 변동 감지', actionEN: 'Aggregate POS Data & Detect Demand Shift',
                    dataSnippet: { "region": "NA", "sku": "Model-X", "sales_velocity": "+15%", "forecast": "High" }
                },
                {
                    id: 2,
                    titleKO: '물류 재고 최적화', titleEN: 'Logistics Optimization',
                    actor: 'CJ Logistics', role: 'Logistics',
                    icon: <Truck className="w-6 h-6 text-slate-600" />,
                    actionKO: '운송 경로 재설정 및 재고 분배', actionEN: 'Reroute Transport & Distribute Inventory',
                    dataSnippet: { "routeId": "RT-55", "eta": "2024-06-01", "container_load": "98%" }
                },
                {
                    id: 3,
                    titleKO: '생산 계획 조정 (AI)', titleEN: 'Production Planning (AI)',
                    actor: 'Manufacturer HQ', role: 'AI',
                    icon: <Brain className="w-6 h-6 text-blue-600" />,
                    actionKO: 'AI 수요 예측 기반 증산 명령', actionEN: 'AI Demand Forecast & Production Order',
                    dataSnippet: { "planId": "P-2024-Q3", "target_output": 50000, "confidence": "94.2%" }
                },
                {
                    id: 4,
                    titleKO: '부품 발주 자동화', titleEN: 'Automated Ordering',
                    actor: 'Tier 1 Supplier', role: 'Supplier',
                    icon: <Box className="w-6 h-6 text-orange-600" />,
                    actionKO: 'JIT 납품 지시 수신 및 출하', actionEN: 'Receive JIT Order & Ship Parts',
                    dataSnippet: { "orderId": "PO-9921", "part": "Chipset-A", "qty": 10000, "delivery": "D+2" }
                }
            ]
        },
        {
            id: 'dt',
            labelKO: '2. 디지털트윈 연계 (R&D)',
            labelEN: '2. Digital Twin Integration',
            steps: [
                {
                    id: 1,
                    titleKO: '신소재 물성 연구', titleEN: 'Material R&D',
                    actor: 'Material Lab', role: 'R&D',
                    icon: <Database className="w-6 h-6 text-purple-600" />,
                    actionKO: '실험 데이터 표준화 및 공유', actionEN: 'Standardize & Share Lab Data',
                    dataSnippet: { "material": "Polymer-X", "tensile_strength": "450MPa", "thermal_res": "200C" }
                },
                {
                    id: 2,
                    titleKO: '제품 설계 시뮬레이션', titleEN: 'Design Simulation',
                    actor: 'Design Studio', role: 'Designer',
                    icon: <Monitor className="w-6 h-6 text-indigo-600" />,
                    actionKO: 'CAE 해석 및 설계 최적화', actionEN: 'CAE Analysis & Design Optimization',
                    dataSnippet: { "designId": "D-V2", "safety_factor": 2.5, "weight_reduction": "10%" }
                },
                {
                    id: 3,
                    titleKO: '가상 공장 시운전 (AI)', titleEN: 'Virtual Factory (AI)',
                    actor: 'Digital Twin Center', role: 'AI',
                    icon: <Server className="w-6 h-6 text-cyan-600" />,
                    actionKO: 'AI 공정 조건 최적화 (No Risk)', actionEN: 'AI Process Optimization (No Risk)',
                    dataSnippet: { "cycle_time": "45s", "optimization_score": "98/100", "throughput": "+5%" }
                },
                {
                    id: 4,
                    titleKO: '실제 공장 적용', titleEN: 'Physical Plant',
                    actor: 'Production Line', role: 'Factory',
                    icon: <Factory className="w-6 h-6 text-slate-700" />,
                    actionKO: '최적 파라미터 다운로드 및 생산', actionEN: 'Download Parameters & Start Production',
                    dataSnippet: { "jobId": "Live-01", "param_set": "Opt-V2", "status": "Running" }
                }
            ]
        },
        {
            id: 'auto',
            labelKO: '3. 자동화·예지보전',
            labelEN: '3. Automation & Predictive Maint.',
            steps: [
                {
                    id: 1,
                    titleKO: 'IoT 센서 데이터 수집', titleEN: 'IoT Data Collection',
                    actor: 'Robot Arm #5', role: 'Device',
                    icon: <Activity className="w-6 h-6 text-red-600" />,
                    actionKO: '진동/온도 데이터 실시간 스트리밍', actionEN: 'Stream Vibration/Temp Data',
                    dataSnippet: { "sensor": "Vib-X", "val": 4.2, "temp": 65, "timestamp": "14:00:01" }
                },
                {
                    id: 2,
                    titleKO: '엣지 데이터 필터링', titleEN: 'Edge Filtering',
                    actor: 'Edge Gateway', role: 'Edge',
                    icon: <Server className="w-6 h-6 text-slate-500" />,
                    actionKO: '노이즈 제거 및 이상 징후 1차 판별', actionEN: 'Denoise & Preliminary Check',
                    dataSnippet: { "status": "Warning", "noise_reduced": true, "packet_size": "2kb" }
                },
                {
                    id: 3,
                    titleKO: 'AI 고장 예측', titleEN: 'AI Failure Prediction',
                    actor: 'AI Cloud Core', role: 'AI',
                    icon: <Cpu className="w-6 h-6 text-blue-600" />,
                    actionKO: '잔여 수명(RUL) 예측 및 알림', actionEN: 'Predict RUL & Send Alert',
                    dataSnippet: { "rul_hours": 48, "confidence": "92%", "failure_mode": "Bearing" }
                },
                {
                    id: 4,
                    titleKO: '자율 제어 및 유지보수', titleEN: 'Autonomous Control',
                    actor: 'Control System', role: 'Controller',
                    icon: <Settings className="w-6 h-6 text-emerald-600" />,
                    actionKO: '속도 감속 및 정비 티켓 발행', actionEN: 'Reduce Speed & Issue Ticket',
                    dataSnippet: { "action": "Slow_Down", "speed": "50%", "maint_ticket": "MT-101" }
                }
            ]
        },
        {
            id: 'qa',
            labelKO: '4. 품질검사·불량예측',
            labelEN: '4. Quality Inspection',
            steps: [
                {
                    id: 1,
                    titleKO: '비전 이미지 촬영', titleEN: 'Vision Imaging',
                    actor: 'Inspection Camera', role: 'Sensor',
                    icon: <Camera className="w-6 h-6 text-blue-500" />,
                    actionKO: '고해상도 제품 표면 촬영', actionEN: 'Capture High-Res Surface Image',
                    dataSnippet: { "img_id": "Img-8821", "resolution": "4K", "format": "RAW" }
                },
                {
                    id: 2,
                    titleKO: 'AI 결함 탐지', titleEN: 'AI Defect Detection',
                    actor: 'Inference Server', role: 'AI',
                    icon: <ScanEye className="w-6 h-6 text-purple-600" />,
                    actionKO: '미세 크랙 및 스크래치 판독', actionEN: 'Detect Micro-cracks & Scratches',
                    dataSnippet: { "result": "NG", "defect_type": "Scratch", "confidence": "99.1%" }
                },
                {
                    id: 3,
                    titleKO: 'MES 품질 로그 기록', titleEN: 'MES Logging',
                    actor: 'MES Database', role: 'System',
                    icon: <Database className="w-6 h-6 text-slate-600" />,
                    actionKO: '품질 이력 저장 및 로트 추적', actionEN: 'Save Quality Log & Lot Tracking',
                    dataSnippet: { "lot_id": "L-2201", "quality_grade": "B", "action": "Rework" }
                },
                {
                    id: 4,
                    titleKO: '품질 분석 리포트', titleEN: 'Quality Report',
                    actor: 'Quality Dashboard', role: 'Admin',
                    icon: <FileCheck className="w-6 h-6 text-emerald-600" />,
                    actionKO: '불량 원인 분석 및 수율 관리', actionEN: 'Analyze Root Cause & Yield',
                    dataSnippet: { "yield": "94.5%", "top_defect": "Scratch", "trend": "Improving" }
                }
            ]
        },
        {
            id: 'esg',
            labelKO: '5. 에너지 최적화·탄소 저감',
            labelEN: '5. Energy & Carbon Opt.',
            steps: [
                {
                    id: 1,
                    titleKO: '전력 사용량 측정', titleEN: 'Power Metering',
                    actor: 'Smart Meter', role: 'IoT',
                    icon: <Zap className="w-6 h-6 text-yellow-500" />,
                    actionKO: '설비별 실시간 전력 데이터 수집', actionEN: 'Real-time Power Data Collection',
                    dataSnippet: { "device": "Compressor-A", "power_kw": 45.2, "peak": 50.1 }
                },
                {
                    id: 2,
                    titleKO: '에너지 흐름 분석', titleEN: 'Energy Analysis',
                    actor: 'FEMS (Energy System)', role: 'EMS',
                    icon: <Activity className="w-6 h-6 text-blue-500" />,
                    actionKO: '에너지 소비 패턴 및 낭비 분석', actionEN: 'Analyze Patterns & Waste',
                    dataSnippet: { "efficiency": "82%", "waste_detected": true, "zone": "Zone-B" }
                },
                {
                    id: 3,
                    titleKO: 'AI 최적 제어', titleEN: 'AI Optimization',
                    actor: 'Optimization Engine', role: 'AI',
                    icon: <Brain className="w-6 h-6 text-red-500" />,
                    actionKO: '피크 부하 제어 및 공조 최적화', actionEN: 'Peak Shaving & HVAC Opt',
                    dataSnippet: { "setpoint_adjust": "-1.5C", "ess_discharge": "Start", "cost_save": "$20/hr" }
                },
                {
                    id: 4,
                    titleKO: 'ESG 리포트 발행', titleEN: 'ESG Reporting',
                    actor: 'Sustainability Platform', role: 'Report',
                    icon: <Leaf className="w-6 h-6 text-emerald-600" />,
                    actionKO: '탄소 배출량 산출 및 인증', actionEN: 'Calc Emissions & Certify',
                    dataSnippet: { "daily_co2": "1.2T", "reduction": "5%", "compliance": "ISO50001" }
                }
            ]
        },
        {
            id: 'batt',
            labelKO: '6. 배터리 여권 (EV Battery Passport)',
            labelEN: '6. EV Battery Passport',
            steps: [
                {
                    id: 1,
                    titleKO: '원자재 채굴 및 제련', titleEN: 'Raw Material Mining',
                    actor: 'Australian Lithium Co.', role: 'Miner',
                    icon: <Database className="w-6 h-6 text-orange-600" />,
                    actionKO: '탄소 배출량 데이터 생성 및 AAS 등록', actionEN: 'Generate PCF Data & Register AAS',
                    dataSnippet: { "assetId": "Li-2024-x99", "material": "Lithium Hydroxide", "co2_footprint": 12.5, "unit": "kgCO2e/kg" }
                },
                {
                    id: 2,
                    titleKO: '배터리 셀 제조', titleEN: 'Battery Cell Mfg',
                    actor: 'LG Energy Solution', role: 'Supplier',
                    icon: <Zap className="w-6 h-6 text-yellow-600" />,
                    actionKO: '원자재 데이터 수신 및 여권 생성', actionEN: 'Import Material Data & Create Passport',
                    dataSnippet: { "passportId": "KR-001", "chemistry": "NCM 811", "components": ["Li-2024-x99"] }
                },
                {
                    id: 3,
                    titleKO: '전기차 조립', titleEN: 'EV Assembly',
                    actor: 'Hyundai Motor', role: 'OEM',
                    icon: <Factory className="w-6 h-6 text-blue-600" />,
                    actionKO: '규제 검증 및 차량 연동', actionEN: 'Verify Regulation & Link to Vehicle',
                    dataSnippet: { "vin": "KMH-EV-2024", "battery_ref": "KR-001", "compliance": "PASS" }
                },
                {
                    id: 4,
                    titleKO: '폐배터리 재활용', titleEN: 'Recycling',
                    actor: 'SungEel HiTech', role: 'Recycler',
                    icon: <Recycle className="w-6 h-6 text-emerald-600" />,
                    actionKO: '분해 지침 요청 및 광물 회수', actionEN: 'Request Instructions & Recover Minerals',
                    dataSnippet: { "recycleJob": "882", "target": "KR-001", "recovery_rate": "95%" }
                }
            ]
        }
    ];

    const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

    const handleNextStep = () => {
        if (currentStep >= activeScenario.steps.length) return;
        
        setIsAnimating(true);
        const nextStep = currentStep + 1;
        const nextStepData = activeScenario.steps[nextStep - 1]; // nextStep is 1-based index
        
        setLogs([]);
        const newLogs = [
            `[EDC] Requesting data transfer for step: ${language === 'KO' ? nextStepData.titleKO : nextStepData.titleEN}...`,
            `[Policy] Validating access rights for ${nextStepData.actor}... OK`,
            `[Transfer] Stream established. Payload size: ${Math.floor(Math.random() * 500) + 100}kb`,
            `[Ledger] Transaction hash generated: 0x${Math.random().toString(16).substr(2, 8)}...`,
            `[System] Action completed: ${language === 'KO' ? nextStepData.actionKO : nextStepData.actionEN}`
        ];

        let delay = 0;
        newLogs.forEach((log, index) => {
            setTimeout(() => {
                setLogs(prev => [...prev, log]);
                // When last log finishes
                if (index === newLogs.length - 1) {
                    setIsAnimating(false);
                    // Show Step Modal instead of immediately incrementing index
                    setModalData({
                        ...nextStepData,
                        txHash: `0x${Math.random().toString(16).substr(2, 16)}...`,
                        latency: `${Math.floor(Math.random() * 50 + 20)}ms`,
                        packetSize: `${Math.floor(Math.random() * 100 + 50)} KB`
                    });
                    setShowStepModal(true);
                }
            }, delay);
            delay += 800;
        });
    };

    const confirmStepCompletion = () => {
        setShowStepModal(false);
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        // Check if scenario is finished
        if (nextStep >= activeScenario.steps.length) {
            setTimeout(() => setShowFinalModal(true), 500);
        }
    };

    const resetDemo = () => {
        setCurrentStep(0);
        setLogs([]);
        setIsAnimating(false);
        setShowStepModal(false);
        setShowFinalModal(false);
        setModalData(null);
    };

    const changeScenario = (id: string) => {
        setActiveScenarioId(id);
        resetDemo();
    };

    // Calculate dynamic node positions
    const getXPosition = (index: number, total: number) => {
        const width = 800; // viewBox width
        const margin = 100;
        const availableWidth = width - (margin * 2);
        return margin + (index * (availableWidth / (total - 1)));
    };

    // Helper to detect AI steps
    const isAiStep = (step: Step) => {
        return step.role === 'AI' || 
               step.titleKO.includes('AI') || 
               step.titleEN.includes('AI') || 
               step.actionKO.includes('예측') ||
               step.actionEN.includes('Predict') ||
               step.actionKO.includes('탐지') ||
               step.actionEN.includes('Detect') ||
               step.actionKO.includes('최적화') ||
               step.actionEN.includes('Optimization');
    };

    // Display-only role labels. NOTE: the `role` field itself must stay in English
    // (it is compared against 'AI' in isAiStep above) - only the rendered label is mapped.
    const roleLabelsKO: Record<string, string> = {
        'Retailer': '유통사',
        'Logistics': '물류사',
        'AI': 'AI',
        'Supplier': '공급사',
        'Device': '설비',
        'Edge': '엣지',
        'Controller': '제어기',
        'Sensor': '센서',
        'System': '시스템',
        'Admin': '관리자',
        'IoT': 'IoT',
        'EMS': 'EMS',
        'Report': '리포트',
        'R&D': '연구개발',
        'Designer': '설계사',
        'Factory': '공장',
        'Miner': '광산사',
        'OEM': 'OEM',
        'Recycler': '재활용사'
    };

    const getRoleLabel = (role: string) => (language === 'KO' ? (roleLabelsKO[role] || role) : role);

    // --- Helper for Final Report Data ---
    const getScenarioImpact = (id: string) => {
        switch(id) {
            case 'scm': return { 
                metric: language === 'KO' ? '예측 정확도' : 'Forecast Accuracy', 
                before: 72, after: 94, unit: '%', 
                labelBefore: language === 'KO' ? '기존 예측' : 'Legacy Forecast',
                labelAfter: language === 'KO' ? 'AI 예측' : 'AI Forecast'
            };
            case 'dt': return { 
                metric: language === 'KO' ? '시제품 제작 기간' : 'Prototyping Time', 
                before: 14, after: 2, unit: 'Days',
                labelBefore: language === 'KO' ? '물리적 테스트' : 'Physical Test',
                labelAfter: language === 'KO' ? '가상 시뮬레이션' : 'Virtual Sim'
            };
            case 'auto': return { 
                metric: language === 'KO' ? '비계획 다운타임' : 'Unplanned Downtime', 
                before: 120, after: 15, unit: 'Min/Mo',
                labelBefore: language === 'KO' ? '사후 보전' : 'Reactive Maint.',
                labelAfter: language === 'KO' ? '예지 보전' : 'Predictive Maint.'
            };
            case 'qa': return { 
                metric: language === 'KO' ? '미세 결함 검출률' : 'Defect Detection', 
                before: 85, after: 99.1, unit: '%',
                labelBefore: language === 'KO' ? '육안 검사' : 'Visual Inspect',
                labelAfter: language === 'KO' ? 'AI 비전' : 'AI Vision'
            };
            case 'esg': return { 
                metric: language === 'KO' ? '에너지 낭비율' : 'Energy Waste', 
                before: 15, after: 3, unit: '%',
                labelBefore: language === 'KO' ? '수동 제어' : 'Manual Control',
                labelAfter: language === 'KO' ? 'AI 최적 제어' : 'AI Optimal'
            };
            case 'batt': return { 
                metric: language === 'KO' ? '데이터 추적 시간' : 'Traceability Time', 
                before: 72, after: 0.1, unit: 'Hours',
                labelBefore: language === 'KO' ? '이메일/문서' : 'Email/Docs',
                labelAfter: language === 'KO' ? '데이터스페이스' : 'DataSpace'
            };
            default: return {
                metric: language === 'KO' ? '운영 효율' : 'Efficiency',
                before: 50, after: 90, unit: '%',
                labelBefore: language === 'KO' ? '기존 방식' : 'Legacy',
                labelAfter: language === 'KO' ? 'AI 적용' : 'AI Applied'
            };
        }
    };

    // Helper to render data snippet in a user-friendly card format
    const renderFriendlyPayload = (data: any) => {
        if (!data) return null;

        return (
            <div className="grid grid-cols-2 gap-3">
                {Object.entries(data).map(([key, value]) => {
                    let icon = <Tag className="w-4 h-4 text-slate-400" />;
                    let label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    let valueDisplay: React.ReactNode = String(value);
                    let cardStyle = "bg-slate-50 border-slate-200";

                    // Custom Styles based on Key content
                    if (key.includes('co2') || key.includes('emission')) {
                        icon = <Leaf className="w-4 h-4 text-emerald-500" />;
                        cardStyle = "bg-emerald-50 border-emerald-100";
                    } else if (key.includes('id') || key.includes('Id')) {
                        icon = <Fingerprint className="w-4 h-4 text-purple-500" />;
                        valueDisplay = <span className="font-mono text-xs text-slate-600">{String(value)}</span>;
                    } else if (key.includes('status') || key.includes('compliance') || key.includes('result')) {
                        const isPos = String(value).toUpperCase() === 'PASS' || String(value).toUpperCase() === 'OK';
                        icon = isPos ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />;
                        valueDisplay = <span className={`font-bold ${isPos ? 'text-green-600' : 'text-amber-600'}`}>{String(value)}</span>;
                    } else if (key.includes('rate') || key.includes('efficiency') || key.includes('yield') || key.includes('confidence') || key.includes('score')) {
                        // Extract number properly
                        const numStr = String(value).replace(/[^0-9.]/g, '');
                        const numVal = parseFloat(numStr) || 0;
                        const isHigh = numVal >= 80;
                        
                        icon = <Activity className="w-4 h-4 text-blue-500" />;
                        valueDisplay = (
                            <div className="w-full">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-blue-700">{String(value)}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${isHigh ? 'bg-blue-500' : 'bg-amber-500'}`} style={{width: `${Math.min(numVal, 100)}%`}}></div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={key} className={`p-3 rounded-xl border ${cardStyle} flex flex-col justify-center`}>
                            <div className="flex items-center gap-2 mb-1">
                                {icon}
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate">{label}</span>
                            </div>
                            <div className="text-sm font-semibold text-slate-800 break-words">
                                {valueDisplay}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-12 relative">
            {/* --- STEP COMPLETION MODAL --- */}
            {showStepModal && modalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{language === 'KO' ? '단계 처리 완료' : 'Step Completed'}</h3>
                                    <p className="text-blue-100 text-xs">{language === 'KO' ? modalData.titleKO : modalData.titleEN}</p>
                                </div>
                            </div>
                            <button onClick={confirmStepCompletion} className="text-white/80 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* AI Inference Visualization (Conditionally Rendered) */}
                            {isAiStep(modalData) && (
                                <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 relative overflow-hidden shadow-lg">
                                    {/* Abstract Decor */}
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <Cpu className="w-24 h-24 text-blue-400" />
                                    </div>
                                    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2 relative z-10">
                                        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                                        {language === 'KO' ? 'AI 모델 추론 분석' : 'AI Model Inference Analysis'}
                                    </h4>
                                    <div className="grid grid-cols-3 gap-2 relative z-10">
                                         {/* Input */}
                                         <div className="bg-slate-800 rounded p-2 text-center border border-slate-600 flex flex-col items-center justify-center min-h-[80px]">
                                             <span className="text-[10px] text-slate-400 block uppercase mb-1">{language === 'KO' ? '입력' : 'Input'}</span>
                                             <Database className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                                             <span className="text-[9px] text-white leading-tight">{language === 'KO' ? '센서 / 로그 데이터' : 'Sensor/Log Data'}</span>
                                         </div>
                                         {/* Process */}
                                         <div className="flex flex-col items-center justify-center">
                                             <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded relative">
                                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 rounded-full border border-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                                     <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                                                 </div>
                                             </div>
                                             <span className="text-[10px] text-purple-300 mt-3 font-mono">{language === 'KO' ? '추론 중...' : 'Inference...'}</span>
                                         </div>
                                         {/* Output */}
                                         <div className="bg-slate-800 rounded p-2 text-center border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center min-h-[80px]">
                                             <span className="text-[10px] text-emerald-400 block uppercase mb-1">{language === 'KO' ? '결과' : 'Result'}</span>
                                             <div className="text-lg font-bold text-white leading-none mb-1">
                                                {modalData.dataSnippet.confidence || modalData.dataSnippet.optimization_score || '98%'}
                                             </div>
                                             <span className="text-[9px] text-slate-400 leading-tight">{language === 'KO' ? '신뢰도 점수' : 'Confidence Score'}</span>
                                         </div>
                                    </div>
                                    {/* Explainability Text (Mock) */}
                                    <div className="mt-4 text-[10px] text-slate-300 border-t border-slate-700 pt-3 flex items-start gap-1">
                                        <Network className="w-3 h-3 text-blue-400 mt-0.5" />
                                        <span>
                                            <span className="text-blue-400 font-bold">{language === 'KO' ? 'XAI (설명 가능한 AI):' : 'XAI (Explainable AI):'}</span>
                                            {language === 'KO' ? ' 주요 영향 인자 - 진동 패턴(45%), 온도 상승(30%), 압력(25%)' : ' Key Factors: Vibration Pattern (45%), Temp Rise (30%), Pressure (25%)'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Visual Indicator */}
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="text-center">
                                    <span className="block text-xs text-slate-400 uppercase font-bold mb-1">{language === 'KO' ? '수행 주체' : 'Actor'}</span>
                                    <span className="font-bold text-slate-800 text-sm">{modalData.actor}</span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300" />
                                <div className="text-center">
                                    <span className="block text-xs text-slate-400 uppercase font-bold mb-1">{language === 'KO' ? '처리 상태' : 'Status'}</span>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{language === 'KO' ? '성공' : 'Success'}</span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300" />
                                <div className="text-center">
                                    <span className="block text-xs text-slate-400 uppercase font-bold mb-1">{language === 'KO' ? '블록체인' : 'Blockchain'}</span>
                                    <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{language === 'KO' ? '기록 완료' : 'Anchored'}</span>
                                </div>
                            </div>

                            {/* Data Snippet Preview - VISUALIZED */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <FileJson className="w-4 h-4 text-slate-500" />
                                    {language === 'KO' ? '데이터 페이로드 (검증 완료)' : 'Data Payload (Verified)'}
                                </h4>
                                <div className="max-h-60 overflow-y-auto pr-1">
                                    {renderFriendlyPayload(modalData.dataSnippet)}
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                                <div>
                                    <div className="text-sm font-bold text-emerald-900">{language === 'KO' ? 'Verifiable Credential 검증 완료' : 'Verifiable Credential Verified'}</div>
                                    <div className="text-xs text-emerald-700">{language === 'KO' ? 'DAPS가 발급한 전자서명이 유효합니다.' : 'Digital Signature from DAPS is valid.'}</div>
                                </div>
                            </div>

                            <button 
                                onClick={confirmStepCompletion}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {language === 'KO' ? '다음 단계 진행' : 'Continue to Next Step'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- FINAL RESULT MODAL --- */}
            {showFinalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp relative my-8">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600"></div>
                        
                        <div className="p-8 md:p-10">
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner animate-bounce">
                                    <Globe className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                                    {language === 'KO' ? '시나리오 시뮬레이션 완료' : 'Scenario Simulation Complete'}
                                </h2>
                                <p className="text-slate-500 max-w-lg mx-auto">
                                    {language === 'KO' 
                                        ? '모든 데이터 교환 및 프로세스가 성공적으로 완료되었습니다.' 
                                        : 'All data exchanges and processes have been successfully completed.'}
                                </p>
                            </div>

                            {/* AI Impact Section */}
                            <div className="mb-10 bg-slate-50 rounded-2xl border border-slate-200 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    {language === 'KO' ? 'AI 적용 및 성과 분석' : 'AI Application & Impact Analysis'}
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* 1. How/Where AI Applied Visualization */}
                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">
                                            {language === 'KO' ? 'AI 적용 프로세스 맵' : 'AI Process Map'}
                                        </h4>
                                        <div className="flex-1 flex flex-col justify-center relative py-4">
                                            {/* Flow Line */}
                                            <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-slate-200"></div>
                                            
                                            <div className="space-y-6 relative z-10">
                                                {/* Input Data */}
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-slate-400">
                                                        <Database className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-600 block">{language === 'KO' ? '원천 데이터' : 'Raw Data'}</span>
                                                        <span className="text-[10px] text-slate-400">{language === 'KO' ? 'IoT / 센서 / 로그' : 'IoT / Sensor / Logs'}</span>
                                                    </div>
                                                </div>

                                                {/* AI Engine */}
                                                <div className="flex items-center gap-4 pl-4">
                                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                    <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg text-white shadow-lg flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Brain className="w-5 h-5 animate-pulse" />
                                                            <div>
                                                                <span className="text-xs font-bold block">{language === 'KO' ? 'AI 엔진' : 'AI Engine'}</span>
                                                                <span className="text-[9px] opacity-80 block">{language === 'KO' ? '추론 및 최적화' : 'Inference & Optimization'}</span>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                {/* Outcome */}
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-sm">
                                                        <TrendingUp className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-emerald-700 block">{language === 'KO' ? '창출된 가치' : 'Value Created'}</span>
                                                        <span className="text-[10px] text-slate-500">{language === 'KO' ? '최적화 결과' : 'Optimization Result'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Before/After Comparison Chart */}
                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">
                                            {language === 'KO' ? '도입 전후 성과 비교' : 'Performance Comparison (Before vs After)'}
                                        </h4>
                                        <div className="h-48 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart 
                                                    layout="vertical" 
                                                    data={[getScenarioImpact(activeScenarioId)]} 
                                                    barSize={20}
                                                    margin={{ left: 20, right: 30 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="metric" type="category" width={80} tick={{fontSize: 11, fontWeight: 'bold'}} />
                                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                                                    <Bar dataKey="before" name={language === 'KO' ? '기존 방식' : 'Legacy'} fill="#94a3b8" radius={[0, 4, 4, 0]}>
                                                        <Cell fill="#cbd5e1" />
                                                    </Bar>
                                                    <Bar dataKey="after" name={language === 'KO' ? 'AI 적용' : 'AI Applied'} fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                                                        <Cell fill="url(#colorGradient)" />
                                                    </Bar>
                                                    <defs>
                                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                                            <stop offset="0%" stopColor="#3b82f6" />
                                                            <stop offset="100%" stopColor="#9333ea" />
                                                        </linearGradient>
                                                    </defs>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        {/* Comparison Text */}
                                        <div className="mt-2 flex justify-between items-end text-sm">
                                            <div className="text-center w-1/2">
                                                <p className="text-xs text-slate-400 mb-1">{getScenarioImpact(activeScenarioId).labelBefore}</p>
                                                <p className="font-bold text-slate-500 text-lg">
                                                    {getScenarioImpact(activeScenarioId).before} <span className="text-xs">{getScenarioImpact(activeScenarioId).unit}</span>
                                                </p>
                                            </div>
                                            <div className="h-8 w-px bg-slate-200"></div>
                                            <div className="text-center w-1/2">
                                                <p className="text-xs text-purple-500 mb-1 font-bold">{getScenarioImpact(activeScenarioId).labelAfter}</p>
                                                <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-2xl">
                                                    {getScenarioImpact(activeScenarioId).after} <span className="text-xs text-purple-600">{getScenarioImpact(activeScenarioId).unit}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Standard Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">{language === 'KO' ? '운영 효율' : 'Efficiency'}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">94<span className="text-sm text-slate-400">%</span></div>
                                    <div className="text-xs text-emerald-600 font-medium">{language === 'KO' ? '기존 방식 대비 +12%' : '+12% vs Traditional'}</div>
                                </div>

                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-purple-300 transition-colors group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <Fingerprint className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">{language === 'KO' ? '신뢰도 점수' : 'Trust Score'}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">100<span className="text-sm text-slate-400">/100</span></div>
                                    <div className="text-xs text-slate-500 font-medium">{language === 'KO' ? '모든 전자서명 유효' : 'All signatures valid'}</div>
                                </div>

                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <Leaf className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">{language === 'KO' ? '비용 / 탄소' : 'Cost/Carbon'}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">-30<span className="text-sm text-slate-400">%</span></div>
                                    <div className="text-xs text-emerald-600 font-medium">{language === 'KO' ? '종이 문서 제거 절감 효과' : 'Paperless Savings'}</div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button 
                                    onClick={resetDemo}
                                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-colors flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    {language === 'KO' ? '시뮬레이션 초기화' : 'Reset Simulation'}
                                </button>
                                <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                                    <Share2 className="w-4 h-4" />
                                    {language === 'KO' ? '리포트 공유' : 'Share Report'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Play className="w-8 h-8 text-blue-600 fill-current" />
                        {t('demo_title')}
                    </h1>
                    <p className="text-slate-500 mt-2">{t('demo_subtitle')}</p>
                </div>
                
                {/* Scenario Selector */}
                <div className="flex items-center gap-2">
                    <select 
                        value={activeScenarioId}
                        onChange={(e) => changeScenario(e.target.value)}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm"
                    >
                        {scenarios.map(s => (
                            <option key={s.id} value={s.id}>
                                {language === 'KO' ? s.labelKO : s.labelEN}
                            </option>
                        ))}
                    </select>
                    <button 
                        onClick={resetDemo}
                        className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        {language === 'KO' ? '초기화' : 'Reset'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Process Stepper */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-900">
                            {language === 'KO' ? '프로세스 단계' : 'Process Steps'}
                        </div>
                        <div className="p-6 space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[35px] top-10 bottom-10 w-0.5 bg-slate-100"></div>

                            {activeScenario.steps.map((step, idx) => {
                                const isActive = idx + 1 === currentStep;
                                const isCompleted = idx + 1 < currentStep;
                                
                                return (
                                    <div key={step.id} className={`relative flex gap-4 transition-all duration-500 ${isActive ? 'scale-105' : 'opacity-80'}`}>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 z-10 bg-white transition-colors duration-300 ${
                                            isCompleted ? 'border-emerald-500 text-emerald-500 bg-emerald-50' :
                                            isActive ? 'border-blue-500 text-blue-500 shadow-lg shadow-blue-100' :
                                            'border-slate-200 text-slate-300'
                                        }`}>
                                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <h4 className={`font-bold text-sm ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>
                                                {language === 'KO' ? step.titleKO : step.titleEN}
                                            </h4>
                                            <p className="text-xs text-slate-500 font-medium">{step.actor}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {language === 'KO' ? step.actionKO : step.actionEN}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                            <button
                                onClick={handleNextStep}
                                disabled={isAnimating || currentStep >= activeScenario.steps.length}
                                className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                                    isAnimating ? 'bg-slate-400 cursor-wait' : 
                                    currentStep >= activeScenario.steps.length ? 'bg-emerald-500 hover:bg-emerald-600' :
                                    'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isAnimating ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        {language === 'KO' ? '처리 중...' : 'Processing...'}
                                    </>
                                ) : currentStep >= activeScenario.steps.length ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        {language === 'KO' ? '완료됨' : 'Completed'}
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current" />
                                        {currentStep === 0
                                            ? (language === 'KO' ? '실증 시작하기' : 'Start Demonstration')
                                            : (language === 'KO' ? '다음 단계 실행' : 'Execute Next Step')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Visualizer & Data View */}
                <div className="lg:col-span-2 space-y-6">
                    {/* ENHANCED NETWORK VISUALIZER */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-0 relative overflow-hidden flex flex-col justify-center min-h-[360px]">
                        {/* Background Grid */}
                        <div className="absolute inset-0 opacity-10" 
                             style={{backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px'}}>
                        </div>

                        {/* Connection Lines (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                            {activeScenario.steps.slice(0, -1).map((step, idx) => {
                                const startX = getXPosition(idx, activeScenario.steps.length);
                                const endX = getXPosition(idx + 1, activeScenario.steps.length);
                                const isCompleted = idx + 1 < currentStep;
                                const isAnimatingStep = isAnimating && idx + 1 === currentStep;

                                return (
                                    <g key={`line-${idx}`}>
                                        {/* Base Line */}
                                        <path 
                                            d={`M${startX},180 L${endX},180`} 
                                            stroke={isCompleted ? '#10b981' : '#334155'} 
                                            strokeWidth="4" 
                                            strokeDasharray={isCompleted ? '0' : '8 4'}
                                            className="transition-colors duration-500"
                                        />
                                        {/* Animation Line */}
                                        {isAnimatingStep && (
                                            <>
                                                <path 
                                                    d={`M${startX},180 L${endX},180`} 
                                                    stroke="url(#activeGradient)" 
                                                    strokeWidth="6"
                                                    strokeLinecap="round"
                                                >
                                                    <animate attributeName="stroke-dasharray" from="0, 500" to="500, 0" dur="1s" repeatCount="indefinite" />
                                                </path>
                                                {/* Moving Data Packet */}
                                                <circle r="6" fill="#60a5fa">
                                                    <animateMotion 
                                                        path={`M${startX},180 L${endX},180`}
                                                        dur="2s"
                                                        repeatCount="indefinite"
                                                    />
                                                </circle>
                                            </>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Nodes */}
                        <div className="relative z-10 w-full h-full">
                            {activeScenario.steps.map((step, idx) => {
                                const total = activeScenario.steps.length;
                                const active = idx + 1 === currentStep;
                                const done = idx + 1 < currentStep;
                                const leftPos = `${(idx / (total - 1)) * 80 + 10}%`; // Simple percent based positioning with margin
                                
                                return (
                                    <div 
                                        key={step.id} 
                                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                                        style={{ left: leftPos, transform: 'translate(-50%, -50%)' }}
                                    >
                                        {/* Pulse Effect on Active */}
                                        {active && isAnimating && (
                                            <div className="absolute w-24 h-24 bg-blue-500/20 rounded-full animate-ping"></div>
                                        )}
                                        
                                        {/* Data Verification Badge (Shows when step completes) */}
                                        {done && (
                                            <div className="absolute -top-12 animate-bounce">
                                                <div className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg shadow-emerald-500/30">
                                                    <CheckCircle2 className="w-3 h-3" /> {language === 'KO' ? '검증 완료' : 'Verified'}
                                                </div>
                                            </div>
                                        )}

                                        {/* Main Node Circle */}
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl relative transition-all duration-500 border-4 ${
                                            active ? 'bg-blue-600 border-blue-400 text-white scale-110' : 
                                            done ? 'bg-emerald-600 border-emerald-400 text-white' : 
                                            'bg-slate-800 border-slate-700 text-slate-500'
                                        }`}>
                                            <div className="transform scale-125">
                                                {step.icon}
                                            </div>
                                            
                                            {/* Corner Status Icon */}
                                            <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1 border border-slate-700">
                                                {done ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                                            </div>
                                        </div>

                                        {/* Labels */}
                                        <div className="text-center mt-4 bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur border border-slate-700">
                                            <span className={`text-xs font-bold block ${active || done ? 'text-white' : 'text-slate-400'}`}>{getRoleLabel(step.role)}</span>
                                            <span className="text-[10px] text-slate-400 max-w-[80px] truncate block mx-auto">{step.actor}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Data Viewer & Logs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* JSON Data Viewer */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-80">
                            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                                <div className="flex items-center gap-2">
                                    <FileJson className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-700">{language === 'KO' ? '데이터 페이로드 (AAS)' : 'Data Payload (AAS)'}</span>
                                </div>
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">JSON-LD</span>
                            </div>
                            <div className="flex-1 p-4 overflow-auto bg-slate-50 font-mono text-xs text-slate-600">
                                {currentStep > 0 ? (
                                    <pre>{JSON.stringify(activeScenario.steps[currentStep - 1].dataSnippet, null, 2)}</pre>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                        <Search className="w-8 h-8 mb-2" />
                                        <p>{language === 'KO' ? '프로세스 시작을 기다리는 중입니다...' : 'Waiting for process start...'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* System Logs */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm flex flex-col h-80">
                            <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl">
                                <div className="flex items-center gap-2">
                                    <Server className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm font-bold text-slate-300">{language === 'KO' ? 'EDC 커넥터 로그' : 'EDC Connector Logs'}</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2">
                                <div className="text-slate-500">{'>'} System Ready. Waiting for trigger...</div>
                                {logs.map((log, i) => (
                                    <div key={i} className="flex gap-2 animate-fadeIn">
                                        <span className="text-slate-600">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                        <span className={`${
                                            log.includes('Error') ? 'text-red-400' :
                                            log.includes('Verified') || log.includes('committed') || log.includes('completed') ? 'text-emerald-400' :
                                            'text-slate-300'
                                        }`}>
                                            {log}
                                        </span>
                                    </div>
                                ))}
                                {isAnimating && (
                                    <div className="text-blue-400 animate-pulse">{'>'} Processing transaction...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Demonstration;
