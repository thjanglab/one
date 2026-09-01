import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldCheck, Database, FileText, Lock, Unlock, RefreshCw, Key, Zap, Cpu, Network, X, Binary, Terminal, MessageSquare, BookOpen, CheckCircle, ArrowRight, Info, Search, FileJson, Layout, BarChart, XCircle, Share2, Printer } from 'lucide-react';

const EDCSimulation: React.FC = () => {
    const { t, language } = useLanguage();
    const [step, setStep] = useState(0); // 0: Idle, 1: Identity, 2: Discovery, 3: Negotiation, 4: Transfer
    const [isAnimating, setIsAnimating] = useState(false);
    const [inspectorData, setInspectorData] = useState<string>('');
    const [protocolMsg, setProtocolMsg] = useState<string>('System Idle - Ready to Start');
    const [nodeStatus, setNodeStatus] = useState({ consumer: 'IDLE', provider: 'IDLE' });
    
    // UI States
    const [activeTab, setActiveTab] = useState<'PAYLOAD' | 'LECTURE'>('PAYLOAD');
    const [showReport, setShowReport] = useState(false);
    const [showDetailReport, setShowDetailReport] = useState(false); // New state for detailed report
    const logsEndRef = useRef<HTMLDivElement>(null);

    // --- REPORT DATA (Mock) ---
    const REPORT_DATA = {
        meta: {
            id: "ASSET-8821-KR",
            transactionId: "0x7f2ca...9a21",
            timestamp: new Date().toLocaleString(),
            hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        },
        stats: {
            totalRecords: 12500,
            dataSize: "4.8 MB",
            format: "JSON-LD (AAS Standard)",
            schemaVersion: "v3.1.0"
        },
        product: {
            name: "Battery Module NCM811",
            id: "BATT-MOD-2024-X99",
            manufacturer: "LG Energy Solution",
            location: language === 'KO' ? "오창 2공장, 대한민국" : "Ochang Plant #2, KR",
            image: "vendor-images/photo-1620288627223-53302f4e8c74-w300.jpg"
        },
        structure: [
            { name: "Root", type: "Object", children: [
                { name: "Header", type: "Meta", desc: "Asset ID, Timestamp" },
                { name: "Body", type: "Object", children: [
                    { name: "Material", type: "Array", desc: "Li, Co, Ni Composition" },
                    { name: "Process", type: "Object", desc: "Temp, Pressure Logs" },
                    { name: "Carbon", type: "Float", desc: "PCF Value (kgCO2e)" }
                ]}
            ]},
        ],
        sampleRows: [
            { id: 1, time: "10:00:01", temp: 24.5, voltage: 3.82, status: "Normal", pcf: 0.45 },
            { id: 2, time: "10:00:02", temp: 24.6, voltage: 3.81, status: "Normal", pcf: 0.45 },
            { id: 3, time: "10:00:03", temp: 24.8, voltage: 3.80, status: "Normal", pcf: 0.46 },
            { id: 4, time: "10:00:04", temp: 25.1, voltage: 3.79, status: "Warning", pcf: 0.48 },
            { id: 5, time: "10:00:05", temp: 24.9, voltage: 3.80, status: "Normal", pcf: 0.45 },
        ]
    };

    // --- Educational Content (University Level) ---
    const EDU_CONTENT = {
        1: {
            title: language === 'KO' ? "1단계: 신원 및 신뢰 (Identity & Trust)" : "Step 1: Identity & Trust",
            concept: language === 'KO' ? "디지털 신분증 검사" : "Digital ID Verification",
            analogy: language === 'KO'
                ? "공항 검색대에서 여권(VC)과 탑승권(Token)을 검사하는 것과 동일합니다."
                : "It works just like an airport checkpoint inspecting your passport (VC) and your boarding pass (Token).",
            lecture: language === 'KO'
                ? `데이터스페이스에서는 '제로 트러스트(Zero Trust)' 원칙을 따릅니다.
서버 간 통신이 시작되기 전, 중앙 신뢰 기관(DAPS)이 발급한 **검증 가능한 자격증명(Verifiable Credential, VC)**을 확인합니다.
이 단계에서 생성되는 JWT(JSON Web Token)는 위변조가 불가능하며, 이후 모든 요청의 '입장권' 역할을 합니다.`
                : `A dataspace operates on a strict 'Zero Trust' principle.
Before any server-to-server communication begins, the **Verifiable Credential (VC)** issued by the central trust anchor (DAPS) is validated.
The JWT (JSON Web Token) minted at this stage cannot be forged, and acts as the 'entry pass' for every request that follows.`,
            techStack: language === 'KO'
                ? "X.509 인증서, DAPS, OAuth2.0, DID (Decentralized Identity)"
                : "X.509 Certificate, DAPS, OAuth2.0, DID (Decentralized Identity)",
            reportTitle: language === 'KO' ? "신원 검증 완료" : "Identity Verification Complete",
            reportSummary: language === 'KO'
                ? "Consumer(현대차)의 디지털 신원이 DAPS를 통해 성공적으로 검증되었습니다. 보안 토큰(Dynamic Attribute Token)이 발급되어 세션에 바인딩되었습니다."
                : "The Consumer (Hyundai Motor) digital identity was successfully verified through DAPS. A security token (Dynamic Attribute Token) has been issued and bound to this session."
        },
        2: {
            title: language === 'KO' ? "2단계: 카탈로그 탐색 (Catalog Discovery)" : "Step 2: Catalog Discovery",
            concept: language === 'KO' ? "분산형 메타데이터 검색" : "Federated Metadata Search",
            analogy: language === 'KO'
                ? "도서관의 통합 검색 시스템에서 책의 위치와 대출 가능 여부를 확인하는 과정입니다."
                : "It is like checking a library's integrated search system for where a book sits and whether it can be borrowed.",
            lecture: language === 'KO'
                ? `데이터 자체는 이동하지 않고, 데이터의 '설명서'인 **메타데이터(Metadata)**만 조회합니다.
DCAT(Data Catalog Vocabulary) 표준을 사용하여, 이기종 시스템 간에도 자산의 이름, 타입, 정책 등을 이해할 수 있습니다.
실제 데이터는 여전히 Provider의 보안 영역(Firewall) 내부에 안전하게 보관되어 있습니다.`
                : `The data itself never moves - only the **metadata**, the 'instruction manual' of the data, is queried.
The DCAT (Data Catalog Vocabulary) standard lets heterogeneous systems interpret an asset's name, type and policy alike.
The actual data still sits safely inside the Provider's protected zone, behind the firewall.`,
            techStack: "DCAT, Federated Catalog, Crawler",
            reportTitle: language === 'KO' ? "자산 탐색 성공" : "Asset Discovery Successful",
            reportSummary: language === 'KO'
                ? "'NCM811 배터리 탄소발자국(PCF)' 자산이 카탈로그에서 발견되었습니다. 해당 자산은 '계약 협상 필수' 정책이 적용되어 있습니다."
                : "The 'NCM811 Battery Carbon Footprint (PCF)' asset was found in the catalog. A 'contract negotiation required' policy is attached to it."
        },
        3: {
            title: language === 'KO' ? "3단계: 계약 협상 (Contract Negotiation)" : "Step 3: Contract Negotiation",
            concept: language === 'KO' ? "정책 기반의 자동 계약 체결" : "Policy-Driven Automated Contracting",
            analogy: language === 'KO'
                ? "변호사 없이 프로그램 코드가 자동으로 계약서에 도장을 찍는 것과 같습니다."
                : "It is as if program code stamped the contract by itself, with no lawyer in the room.",
            lecture: language === 'KO'
                ? `ODRL(Open Digital Rights Language)을 사용하여 사용 권한을 기계적으로 협상합니다.
Consumer가 "30일 동안, EU 규제 대응 목적으로만 쓰겠다"고 제안(Offer)하면, Provider의 정책 엔진이 이를 검토하고 승인(Agreement)합니다.
이 과정은 사람의 개입 없이 **Control Plane** 간에 수 밀리초(ms) 내에 이루어집니다.`
                : `Usage rights are negotiated machine-to-machine with ODRL (Open Digital Rights Language).
When the Consumer offers "use for 30 days, solely for EU regulatory compliance", the Provider's policy engine reviews it and issues an Agreement.
The whole exchange happens between the two **Control Planes** in a few milliseconds, with no human in the loop.`,
            techStack: "ODRL, Policy Engine, Contract Definition",
            reportTitle: language === 'KO' ? "계약 체결 및 보관 완료" : "Contract Signed & Archived",
            reportSummary: language === 'KO'
                ? "데이터 사용 계약(Agreement ID: agr:8821)이 체결되었습니다. 정책 조건(Purpose: EU_Regulation)이 충족되어 전송 권한이 부여되었습니다."
                : "The data usage agreement (Agreement ID: agr:8821) has been concluded. The policy condition (Purpose: EU_Regulation) was satisfied, so transfer rights were granted."
        },
        4: {
            title: language === 'KO' ? "4단계: 데이터 전송 (Data Transfer)" : "Step 4: Data Transfer",
            concept: language === 'KO' ? "P2P 암호화 스트리밍" : "P2P Encrypted Streaming",
            analogy: language === 'KO'
                ? "OTT 서비스에서 영화를 스트리밍하는 것처럼, 데이터가 끊김 없이 전송됩니다."
                : "Data streams through without interruption, much like watching a movie on an OTT service.",
            lecture: language === 'KO'
                ? `계약이 체결되면 **EDR(Endpoint Data Reference)** 토큰이 발급됩니다.
이 토큰은 일회용 비밀번호와 같아서, Data Plane을 열 수 있는 유일한 열쇠입니다.
데이터는 중앙 서버를 거치지 않고(Peer-to-Peer), AES-256 알고리즘으로 암호화되어 전송되므로 중간 탈취가 불가능합니다.`
                : `Once the contract is signed, an **EDR (Endpoint Data Reference)** token is issued.
Like a one-time password, it is the only key that can open the Data Plane.
The data travels peer-to-peer without passing through any central server, encrypted with AES-256, so it cannot be intercepted in transit.`,
            techStack: "EDR Token, AES-256, HTTP/S, MQTT",
            reportTitle: language === 'KO' ? "보안 전송 완료" : "Secure Transfer Completed",
            reportSummary: language === 'KO'
                ? "암호화된 데이터 스트림이 Consumer의 저장소(Azure Blob)로 전송 완료되었습니다. 데이터 무결성이 검증되었으며 연결이 종료됩니다."
                : "The encrypted data stream has been delivered to the Consumer's storage (Azure Blob). Data integrity was verified and the connection is now closed."
        }
    };

    const SCENARIO_INFO = {
        1: {
            protocol: "POST /auth/token",
            consumerStatus: "Requesting Token...",
            providerStatus: "Verifying Token..."
        },
        2: {
            protocol: "POST /dsp/v2/catalog/request",
            consumerStatus: "Querying Catalog...",
            providerStatus: "Returning Metadata..."
        },
        3: {
            protocol: "POST /dsp/v2/contract/request",
            consumerStatus: "Signing Offer...",
            providerStatus: "Validating Policy..."
        },
        4: {
            protocol: "GET /public/api/transfer",
            consumerStatus: "Receiving Stream...",
            providerStatus: "Encrypting & Sending..."
        }
    };

    const SAMPLES = {
        identity: `// 1. DAPS Token Response (JWT)\n{\n  "iss": "DAPS_SERVER",\n  "sub": "BPNL000000000001",\n  "aud": "idsc:IDS_CONNECT",\n  "scope": "idsc:IDS_CONNECTOR_ATTRIBUTES_ALL",\n  "exp": 1680000000\n}`,
        catalog: `// 2. DCAT Catalog Response\n{\n  "@type": "dcat:Catalog",\n  "dataset": [{\n    "@id": "asset:batteries:ncm811",\n    "title": "NCM811 Battery PCF",\n    "odrl:hasPolicy": "policy:eu_reg_only",\n    "dcat:distribution": {\n       "format": "JSON"\n    }\n  }]\n}`,
        contract: `// 3. Contract Agreement (ODRL)\n{\n  "@type": "dspace:Agreement",\n  "target": "asset:batteries:ncm811",\n  "assignee": "BPN-L-HYUNDAI",\n  "permission": {\n    "action": "USE",\n    "constraint": {\n       "leftOperand": "purpose",\n       "operator": "eq",\n       "rightOperand": "EU_Regulation"\n    }\n  }\n}`,
        transfer_enc: `// 4. Encrypted Stream (AES-256)\n<Packet Sequence 001>\nHeader: { alg: "AES-GCM", keyId: "edc-key-01" }\nPayload: 8f92a1c... [Encrypted]\n\n<Packet Sequence 002>\nPayload: b2c1d4e... [Encrypted]`,
        transfer_src: `// Source: LGES MES Database (Raw)\n{\n  "product": "Battery Module NCM811",\n  "batch_id": "LGES-2024-X99",\n  "carbon_footprint": 45.2,\n  "unit": "kgCO2e/kWh",\n  "origin": "Ochang, KR",\n  "chemistry": {"Ni": 80, "Co": 10, "Mn": 10}\n}`,
        transfer_dec: `// Destination: Hyundai Azure Blob (Received)\n{\n  "product": "Battery Module NCM811",\n  "batch_id": "LGES-2024-X99",\n  "carbon_footprint": 45.2,\n  "unit": "kgCO2e/kWh",\n  "origin": "Ochang, KR",\n  "chemistry": {"Ni": 80, "Co": 10, "Mn": 10}\n}`
    };

    // Animation Logic
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isAnimating && step > 0) {
            const info = SCENARIO_INFO[step as keyof typeof SCENARIO_INFO];
            setProtocolMsg(`${info.protocol}`);
            setNodeStatus({ consumer: info.consumerStatus, provider: info.providerStatus });

            // Duration of the animation phase
            const animationDuration = 5000; 

            timer = setTimeout(() => {
                setIsAnimating(false);
                setNodeStatus({ consumer: "Waiting", provider: "Waiting" });
                // Show report modal after animation finishes
                setShowReport(true);
            }, animationDuration);
        }
        return () => clearTimeout(timer);
    }, [isAnimating, step]);

    // Inspector Data Typewriter Effect
    useEffect(() => {
        let data = '';
        switch(step) {
            case 1: data = SAMPLES.identity; break;
            case 2: data = SAMPLES.catalog; break;
            case 3: data = SAMPLES.contract; break;
            case 4: data = SAMPLES.transfer_enc; break;
            default: data = '';
        }
        
        if (data) {
            setInspectorData('');
            let i = 0;
            const typeInterval = setInterval(() => {
                setInspectorData(data.substring(0, i + 1));
                i++;
                if (i >= data.length) clearInterval(typeInterval);
            }, 5);
            return () => clearInterval(typeInterval);
        } else {
            setInspectorData('');
        }
    }, [step]);

    // Auto-scroll inspector
    useEffect(() => {
        if(activeTab === 'PAYLOAD') {
            logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [inspectorData, activeTab]);

    const handleStepStart = (targetStep: number) => {
        setStep(targetStep);
        setIsAnimating(true);
        setShowReport(false);
        setShowDetailReport(false);
        // Switch tab automatically based on context if needed
        if(targetStep === 1) setActiveTab('LECTURE'); 
    };

    const handleNextStep = () => {
        setShowReport(false);
        if (step < 4) {
            handleStepStart(step + 1);
        } else {
            // End of simulation
            setStep(0);
            setInspectorData('');
            setProtocolMsg('Simulation Completed.');
        }
    };

    const openDetailReport = () => {
        setShowReport(false);
        setShowDetailReport(true);
    };

    const reset = () => {
        setStep(0);
        setIsAnimating(false);
        setShowReport(false);
        setShowDetailReport(false);
        setInspectorData('');
        setProtocolMsg('System Idle - Ready to Start');
        setNodeStatus({ consumer: 'IDLE', provider: 'IDLE' });
    };

    const currentEduContent = EDU_CONTENT[step as keyof typeof EDU_CONTENT];

    return (
        <div className="space-y-8 animate-fadeIn pb-12 relative">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto pt-4">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
                    <Network className="w-8 h-8 text-blue-600" />
                    {language === 'KO' ? 'EDC 커넥터 데이터 흐름 시뮬레이터' : 'EDC Connector Data Flow Simulator'}
                </h1>
                <p className="text-lg text-slate-500">
                    {language === 'KO' 
                        ? '현대자동차(Consumer)와 LG에너지솔루션(Provider) 간의 배터리 여권 데이터 교환 시나리오'
                        : 'Battery Passport Exchange Scenario: Hyundai Motor (Consumer) <-> LG Energy Solution (Provider)'}
                </p>
            </div>

            {/* --- DETAILED DATA REPORT MODAL (NEW) --- */}
            {showDetailReport && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-scaleUp relative my-8">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <FileJson className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{language === 'KO' ? '데이터 자산 전송 리포트' : 'Data Asset Transfer Report'}</h2>
                                    <p className="text-xs text-slate-400 font-mono">TX: {REPORT_DATA.meta.transactionId} • {REPORT_DATA.meta.timestamp}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailReport(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh]">
                            
                            {/* Section 1: Product & Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center h-full flex flex-col items-center">
                                        <div className="w-full h-40 bg-white rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-slate-100 p-2">
                                            <img src={REPORT_DATA.product.image} alt={language === 'KO' ? '제품 이미지' : 'Product'} className="max-h-full object-contain" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900">{REPORT_DATA.product.name}</h3>
                                        <p className="text-sm text-slate-500 mb-4">{REPORT_DATA.product.manufacturer}</p>
                                        <div className="w-full space-y-2 text-xs text-left bg-white p-3 rounded-lg border border-slate-100">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">ID:</span>
                                                <span className="font-mono text-slate-700">{REPORT_DATA.product.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">{language === 'KO' ? '위치:' : 'Loc:'}</span>
                                                <span className="text-slate-700">{REPORT_DATA.product.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <span className="text-xs font-bold text-blue-500 uppercase block mb-1">{language === 'KO' ? '총 레코드 수' : 'Total Records'}</span>
                                            <span className="text-2xl font-bold text-blue-900">{REPORT_DATA.stats.totalRecords.toLocaleString()}</span>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                            <span className="text-xs font-bold text-emerald-500 uppercase block mb-1">{language === 'KO' ? '데이터 용량' : 'Data Size'}</span>
                                            <span className="text-2xl font-bold text-emerald-900">{REPORT_DATA.stats.dataSize}</span>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                            <span className="text-xs font-bold text-purple-500 uppercase block mb-1">{language === 'KO' ? '스키마' : 'Schema'}</span>
                                            <span className="text-lg font-bold text-purple-900 truncate">{REPORT_DATA.stats.schemaVersion}</span>
                                        </div>
                                    </div>

                                    {/* Structure Infographic */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <Layout className="w-4 h-4 text-slate-500" />
                                            {language === 'KO' ? '데이터 구조 (스키마 트리)' : 'Data Structure (Schema Tree)'}
                                        </h4>
                                        <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg overflow-x-auto">
                                            <div className="flex gap-8 items-start">
                                                {/* Root */}
                                                <div className="flex flex-col items-center relative">
                                                    <div className="w-20 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-md z-10">
                                                        {language === 'KO' ? '자산 루트' : 'Asset Root'}
                                                    </div>
                                                    <div className="h-8 w-px bg-slate-300"></div>
                                                    {/* Connector Line Horizontal */}
                                                    <div className="w-[280px] h-px bg-slate-300 relative">
                                                        <div className="absolute left-0 top-0 h-4 w-px bg-slate-300 transform translate-y-0"></div>
                                                        <div className="absolute left-1/2 top-0 h-4 w-px bg-slate-300 transform translate-y-0"></div>
                                                        <div className="absolute right-0 top-0 h-4 w-px bg-slate-300 transform translate-y-0"></div>
                                                    </div>
                                                    {/* Children */}
                                                    <div className="flex gap-4 mt-4 w-[360px] justify-between">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-24 h-10 bg-white border border-slate-300 text-slate-600 rounded flex items-center justify-center text-[10px] font-bold shadow-sm">
                                                                Metadata
                                                            </div>
                                                            <span className="text-[9px] text-slate-400 mt-1">{language === 'KO' ? '헤더 정보' : 'Header Info'}</span>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-24 h-10 bg-white border-2 border-blue-200 text-blue-700 rounded flex items-center justify-center text-[10px] font-bold shadow-sm">
                                                                Payload
                                                            </div>
                                                            <span className="text-[9px] text-slate-400 mt-1">{language === 'KO' ? '주요 데이터' : 'Primary Data'}</span>
                                                            <div className="h-4 w-px bg-blue-200 mt-1"></div>
                                                            <div className="w-20 h-8 bg-blue-50 border border-blue-100 rounded flex items-center justify-center text-[9px] text-blue-600 mt-1">
                                                                Measurements
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-24 h-10 bg-white border border-slate-300 text-slate-600 rounded flex items-center justify-center text-[10px] font-bold shadow-sm">
                                                                Signature
                                                            </div>
                                                            <span className="text-[9px] text-slate-400 mt-1">{language === 'KO' ? '무결성 검증' : 'Integrity Check'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Sample Data Table */}
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Database className="w-4 h-4 text-slate-500" />
                                        {language === 'KO' ? '샘플 데이터 미리보기 (상위 5행)' : 'Sample Data Preview (First 5 Rows)'}
                                    </h4>
                                    <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                        {language === 'KO' ? '무결성 검증됨' : 'Integrity Verified'}
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3">ID</th>
                                                <th className="px-6 py-3">{language === 'KO' ? '타임스탬프' : 'Timestamp'}</th>
                                                <th className="px-6 py-3">{language === 'KO' ? '온도 (°C)' : 'Temp (°C)'}</th>
                                                <th className="px-6 py-3">{language === 'KO' ? '전압 (V)' : 'Voltage (V)'}</th>
                                                <th className="px-6 py-3">PCF (kg)</th>
                                                <th className="px-6 py-3">{language === 'KO' ? '상태' : 'Status'}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {REPORT_DATA.sampleRows.map((row) => (
                                                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-3 font-mono text-slate-500">{row.id}</td>
                                                    <td className="px-6 py-3 text-slate-600">{row.time}</td>
                                                    <td className="px-6 py-3 font-bold text-slate-700">{row.temp}</td>
                                                    <td className="px-6 py-3 text-slate-600">{row.voltage}</td>
                                                    <td className="px-6 py-3 text-slate-600">{row.pcf}</td>
                                                    <td className="px-6 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                                            row.status === 'Normal' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {language === 'KO' ? (row.status === 'Normal' ? '정상' : '경고') : row.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end">
                                <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                                    <Printer className="w-4 h-4" /> {language === 'KO' ? 'PDF 인쇄' : 'Print PDF'}
                                </button>
                                <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                                    <Share2 className="w-4 h-4" /> {language === 'KO' ? '공유' : 'Share'}
                                </button>
                                <button 
                                    onClick={reset}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors flex items-center gap-2"
                                >
                                    {language === 'KO' ? '완료 후 닫기' : 'Finish & Close'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- REPORT MODAL (POPUP) --- */}
            {showReport && step > 0 && currentEduContent && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-3xl animate-fadeIn" onClick={() => {}}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-scaleUp border border-slate-200">
                        <div className="bg-slate-900 text-white p-5 flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-full">
                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{currentEduContent.reportTitle}</h3>
                                <p className="text-xs text-slate-400">{language === 'KO' ? `${step}단계 / 전체 4단계 완료` : `Step ${step} of 4 Completed`}</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">{language === 'KO' ? '작업 요약' : 'Operation Summary'}</h4>
                                <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {currentEduContent.reportSummary}
                                </p>
                            </div>
                            
                            {/* Data Integrity Check for Step 4 */}
                            {step === 4 && (
                                <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        {language === 'KO' ? '데이터 무결성 검사 (원본 vs 수신본)' : 'Data Integrity Check (Source vs Dest)'}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                                <Database className="w-3 h-3" /> {language === 'KO' ? 'Provider (원본)' : 'Provider (Original)'}
                                            </span>
                                            <pre className="text-[10px] bg-slate-800 text-slate-300 p-3 rounded border border-slate-700 overflow-x-auto h-28 scrollbar-thin">
                                                {SAMPLES.transfer_src}
                                            </pre>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                                <Unlock className="w-3 h-3" /> {language === 'KO' ? 'Consumer (수신본)' : 'Consumer (Received)'}
                                            </span>
                                            <pre className="text-[10px] bg-slate-800 text-emerald-300 p-3 rounded border border-slate-700 overflow-x-auto h-28 scrollbar-thin">
                                                {SAMPLES.transfer_dec}
                                            </pre>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded border border-emerald-100">
                                        <CheckCircle className="w-4 h-4" />
                                        {language === 'KO' ? '무결성 검증 완료: 100% 일치' : 'Integrity Verified: Match Verified 100%'}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">{language === 'KO' ? '기술 산출물' : 'Technical Artifacts'}</h4>
                                <div className="flex gap-2">
                                    {step === 1 && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">JWT Token</span>}
                                    {step === 2 && <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">DCAT Catalog</span>}
                                    {step === 3 && <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">ODRL Contract</span>}
                                    {step === 4 && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">AES-256 Stream</span>}
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Log: OK</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {step === 4 && (
                                    <button 
                                        onClick={openDetailReport}
                                        className="flex-1 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <FileText className="w-4 h-4" />
                                        {language === 'KO' ? '데이터 리포트 보기' : 'View Data Report'}
                                    </button>
                                )}
                                <button 
                                    onClick={handleNextStep}
                                    className={`py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 ${step === 4 ? 'flex-1' : 'w-full'}`}
                                >
                                    {language === 'KO' ? (step === 4 ? '완료' : '다음 단계') : (step === 4 ? 'Finish' : 'Next Step')}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Stage (Visualization) */}
            <div className="bg-slate-900 rounded-3xl p-4 md:p-8 relative overflow-hidden shadow-2xl border border-slate-700 min-h-[500px]">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(to right, #475569 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
                </div>

                {/* PROTOCOL STATUS BAR */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-black/40 backdrop-blur border-b border-slate-700 flex items-center px-6 gap-3 z-30">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="font-mono text-xs text-emerald-400 flex-1 text-center truncate">
                        {step > 0 && <span className="text-slate-500 mr-2">PROTOCOL:</span>}
                        {protocolMsg}
                    </div>
                    <div className="text-xs text-slate-500 font-mono hidden md:block">EDC v0.5.2</div>
                </div>

                {/* --- CENTRAL DAPS (Identity Provider) --- */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div className={`w-20 h-20 bg-slate-800 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg transition-all duration-500 ${step === 1 ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-slate-600'}`}>
                        <ShieldCheck className={`w-8 h-8 mb-1 ${step === 1 ? 'text-emerald-500' : 'text-slate-500'}`} />
                        <span className="text-[9px] text-slate-400 font-bold">DAPS</span>
                    </div>
                </div>

                {/* --- CONSUMER (Left) --- */}
                <div className="absolute top-48 left-4 md:left-16 w-64 z-10">
                    <div className="bg-slate-800/80 backdrop-blur border border-slate-600 rounded-2xl p-4 relative shadow-xl">
                        <div className="absolute -top-3 left-4 bg-[#002c5f] text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span> Hyundai
                        </div>
                        
                        {/* Control Plane */}
                        <div className={`mb-3 p-3 rounded-xl border-2 transition-all duration-300 relative ${step === 3 ? 'bg-blue-900/30 border-blue-500' : 'bg-slate-700/50 border-slate-600'}`}>
                            <div className="absolute top-1/2 -right-3 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-900 translate-y-[-50%] z-20"></div>
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-100 font-bold text-xs">Control Plane</span>
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-300 space-y-1 font-mono bg-black/20 p-2 rounded">
                                <div className="flex justify-between"><span>IAM:</span> <span className={step >= 1 ? "text-emerald-400" : "text-slate-500"}>{step >= 1 ? 'OK' : '-'}</span></div>
                                <div className="flex justify-between"><span>Contract:</span> <span className={step >= 3 ? "text-yellow-400" : "text-slate-500"}>{step >= 3 ? 'OK' : '-'}</span></div>
                            </div>
                        </div>

                        {/* Data Plane */}
                        <div className={`p-3 rounded-xl border-2 transition-all duration-300 relative ${step === 4 ? 'bg-emerald-900/30 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-slate-700/50 border-slate-600'}`}>
                            <div className="absolute top-1/2 -right-3 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-900 translate-y-[-50%] z-20"></div>
                            <div className="flex items-center gap-2 mb-1">
                                <Database className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-100 font-bold text-xs">Data Plane</span>
                            </div>
                            <div className="text-[10px] text-slate-300 font-mono bg-black/20 p-2 rounded">
                                <div className="mt-1 flex justify-between">
                                    <span>Status:</span> 
                                    <span className={step === 4 ? "text-emerald-400 animate-pulse font-bold" : "text-slate-500"}>
                                        {step === 4 ? 'RX' : nodeStatus.consumer}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PROVIDER (Right) --- */}
                <div className="absolute top-48 right-4 md:right-16 w-64 z-10">
                    <div className="bg-slate-800/80 backdrop-blur border border-slate-600 rounded-2xl p-4 relative shadow-xl">
                        <div className="absolute -top-3 right-4 bg-[#c3002f] text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span> LGES
                        </div>
                        
                        {/* Control Plane */}
                        <div className={`mb-3 p-3 rounded-xl border-2 transition-all duration-300 relative ${step === 3 ? 'bg-purple-900/30 border-purple-500' : 'bg-slate-700/50 border-slate-600'}`}>
                            <div className="absolute top-1/2 -left-3 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-900 translate-y-[-50%] z-20"></div>
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-purple-400" />
                                    <span className="text-purple-100 font-bold text-xs">Control Plane</span>
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-300 space-y-1 font-mono bg-black/20 p-2 rounded">
                                <div className="flex justify-between"><span>Policy:</span> <span className={step >= 2 ? "text-blue-400" : "text-slate-500"}>{step >= 2 ? 'OK' : '-'}</span></div>
                                <div className="flex justify-between"><span>Agreement:</span> <span className={step >= 3 ? "text-yellow-400" : "text-slate-500"}>{step >= 3 ? 'OK' : '-'}</span></div>
                            </div>
                        </div>

                        {/* Data Plane */}
                        <div className={`p-3 rounded-xl border-2 transition-all duration-300 relative ${step === 4 ? 'bg-emerald-900/30 border-emerald-500' : 'bg-slate-700/50 border-slate-600'}`}>
                            <div className="absolute top-1/2 -left-3 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-900 translate-y-[-50%] z-20"></div>
                            <div className="flex items-center gap-2 mb-1">
                                <Database className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-100 font-bold text-xs">Data Plane</span>
                            </div>
                            <div className="text-[10px] text-slate-300 font-mono bg-black/20 p-2 rounded">
                                <div className="mt-1 flex justify-between">
                                    <span>Status:</span>
                                    <span className={step === 4 ? "text-emerald-400 animate-pulse font-bold" : "text-slate-500"}>
                                        {step === 4 ? 'TX' : nodeStatus.provider}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONNECTIONS (SVG Layer) --- */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 5}} viewBox="0 0 800 550" preserveAspectRatio="none">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                        </marker>
                    </defs>

                    {/* --- STATIC GUIDE LINES --- */}
                    <g className="opacity-20">
                        {/* Identity Paths */}
                        <path d="M 230 250 C 280 150, 350 150, 400 170" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" fill="none" />
                        <path d="M 570 250 C 520 150, 450 150, 400 170" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" fill="none" />
                        {/* Control Plane */}
                        <path d="M 310 280 L 490 280" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" fill="none" />
                        {/* Data Plane */}
                        <path d="M 490 420 L 310 420" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" fill="none" />
                    </g>

                    {/* --- ACTIVE ANIMATED PATHS --- */}
                    
                    {/* 1. Identity Lines (Token) */}
                    {step === 1 && (
                        <>
                            <path d="M 230 250 C 280 150, 350 150, 400 170" fill="none" stroke="#10b981" strokeWidth="2" />
                            <path d="M 570 250 C 520 150, 450 150, 400 170" fill="none" stroke="#10b981" strokeWidth="2" />
                            {/* Floating Labels */}
                            <g>
                                <animateMotion dur="1s" repeatCount="indefinite" path="M 230 250 C 280 150, 350 150, 400 170" />
                                <rect x="-15" y="-10" width="30" height="14" rx="4" fill="#10b981" />
                                <text x="0" y="0" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">Token</text>
                            </g>
                            <g>
                                <animateMotion dur="1s" repeatCount="indefinite" path="M 570 250 C 520 150, 450 150, 400 170" />
                                <rect x="-15" y="-10" width="30" height="14" rx="4" fill="#10b981" />
                                <text x="0" y="0" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">Token</text>
                            </g>
                        </>
                    )}
                    
                    {/* 2. Discovery (Catalog) */}
                    {step === 2 && (
                        <>
                            <path d="M 310 280 L 490 280" fill="none" stroke="#3b82f6" strokeWidth="2" />
                            <g>
                                <animateMotion dur="1.5s" repeatCount="indefinite" path="M 310 280 L 490 280" />
                                <rect x="-20" y="-12" width="40" height="16" rx="4" fill="#3b82f6" stroke="white" strokeWidth="1" />
                                <text x="0" y="0" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">Catalog?</text>
                            </g>
                            <g>
                                <animateMotion dur="1.5s" begin="0.75s" repeatCount="indefinite" path="M 490 280 L 310 280" />
                                <rect x="-25" y="-12" width="50" height="16" rx="4" fill="#1e40af" stroke="white" strokeWidth="1" />
                                <text x="0" y="0" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">Asset: PCF</text>
                            </g>
                        </>
                    )}

                    {/* 3. Negotiation Line (Contract) */}
                    {step === 3 && (
                        <>
                            <path d="M 310 280 L 490 280" fill="none" stroke="#fbbf24" strokeWidth="3" />
                            <g>
                                <animateMotion dur="2s" repeatCount="indefinite" path="M 310 280 L 490 280" keyPoints="0;0.5;1" keyTimes="0;0.5;1" calcMode="linear" />
                                <rect x="-15" y="-10" width="30" height="20" fill="#fbbf24" rx="2" stroke="#b45309" strokeWidth="1" />
                                <text x="0" y="0" fontSize="8" fill="#78350f" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">Offer</text>
                            </g>
                            <g>
                                <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M 490 280 L 310 280" keyPoints="0;0.5;1" keyTimes="0;0.5;1" calcMode="linear" />
                                <rect x="-15" y="-10" width="30" height="20" fill="#f59e0b" rx="2" stroke="#fff" strokeWidth="1" />
                                <text x="0" y="0" fontSize="8" fill="#fff" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">Agree</text>
                            </g>
                        </>
                    )}
                    
                    {/* 4. Encrypted Data Transfer */}
                    {step === 4 && (
                        <>
                            <path d="M 490 420 L 310 420" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="5 5" className="animate-dash" />
                            {/* Stream Particles */}
                            {[0, 0.5, 1.0, 1.5].map((delay) => (
                                <g key={delay}>
                                    <animateMotion dur="2s" begin={`${delay}s`} repeatCount="indefinite" path="M 490 420 L 310 420" />
                                    <circle r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                    <text x="0" y="2" fontSize="8" fill="white" textAnchor="middle" dominantBaseline="middle">PCF</text>
                                    <text x="8" y="-8" fontSize="8" fill="white">🔒</text>
                                </g>
                            ))}
                        </>
                    )}
                </svg>

                {/* Central Status Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    {step === 2 && (
                        <div className="bg-blue-600/90 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce flex items-center gap-2">
                            <Search className="w-4 h-4" /> {language === 'KO' ? '자산 탐색 중' : 'Discovery'}
                        </div>
                    )}
                    {step === 3 && (
                        <div className="bg-yellow-500/90 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-pulse">
                            <FileText className="w-4 h-4" /> {language === 'KO' ? '계약 협상 중...' : 'Negotiating...'}
                        </div>
                    )}
                    {step === 4 && (
                        <div className="bg-emerald-500/90 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                            <Lock className="w-4 h-4" /> AES-256 Stream
                        </div>
                    )}
                </div>

            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {[
                        { id: 1, label: language === 'KO' ? '1. 신원 인증' : '1. Identity', icon: Key },
                        { id: 2, label: language === 'KO' ? '2. 자산 탐색' : '2. Discovery', icon: Search },
                        { id: 3, label: language === 'KO' ? '3. 계약 협상' : '3. Negotiation', icon: FileText },
                        { id: 4, label: language === 'KO' ? '4. 데이터 전송' : '4. Transfer', icon: Zap },
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => handleStepStart(btn.id)}
                            disabled={isAnimating}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                                step === btn.id 
                                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <btn.icon className="w-4 h-4" />
                            {btn.label}
                        </button>
                    ))}
                </div>
                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                <button 
                    onClick={reset}
                    className="px-4 py-2 text-slate-400 hover:text-slate-600 font-medium text-sm flex items-center gap-1"
                >
                    <RefreshCw className="w-4 h-4" /> {language === 'KO' ? '초기화' : 'Reset'}
                </button>
            </div>

            {/* Enhanced Live Data Inspector (Split View) */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-lg mt-4 flex flex-col h-[400px]">
                {/* Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-950">
                    <button 
                        onClick={() => setActiveTab('PAYLOAD')}
                        className={`px-6 py-3 text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'PAYLOAD' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Terminal className="w-4 h-4" /> {language === 'KO' ? '원본 페이로드 (JSON)' : 'Raw Payload (JSON)'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('LECTURE')}
                        className={`px-6 py-3 text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'LECTURE' ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <BookOpen className="w-4 h-4" /> {language === 'KO' ? '강의 노트' : 'Lecture Notes'}
                    </button>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {activeTab === 'PAYLOAD' ? (
                        <div className="absolute inset-0 p-4 font-mono text-xs md:text-sm overflow-y-auto text-slate-300">
                            {step === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                    <Binary className="w-8 h-8 mb-2 opacity-50" />
                                    <p>{language === 'KO' ? '시뮬레이션 시작을 기다리는 중...' : 'Waiting for simulation start...'}</p>
                                </div>
                            )}
                            {step > 0 && (
                                <div className="space-y-4">
                                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                                        <h4 className="text-blue-400 font-bold mb-1 flex items-center gap-2">
                                            <MessageSquare className="w-3 h-3" /> 
                                            {language === 'KO' ? '프로토콜 상태' : 'Protocol Status'}
                                        </h4>
                                        <p className="text-slate-400 leading-relaxed">
                                            {nodeStatus.consumer} -&gt; {nodeStatus.provider} via {protocolMsg}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-emerald-500 font-bold mb-1">{language === 'KO' ? '페이로드 미리보기' : 'Payload Preview'}</h4>
                                        <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed bg-black/30 p-3 rounded border border-slate-800">
                                            {inspectorData}
                                            <span className="animate-pulse">_</span>
                                        </pre>
                                    </div>
                                    <div ref={logsEndRef} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="absolute inset-0 p-6 overflow-y-auto bg-slate-900">
                            {step === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                    <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                                    <p>{language === 'KO' ? '단계를 선택하면 상세 설명이 표시됩니다.' : 'Select a step to view detailed explanations.'}</p>
                                </div>
                            ) : currentEduContent ? (
                                <div className="space-y-6 animate-fadeIn">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-blue-400" />
                                            {currentEduContent.title}
                                        </h3>
                                        <div className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 text-xs font-bold rounded-full border border-blue-800">
                                            {language === 'KO' ? '핵심 개념: ' : 'Core Concept: '}{currentEduContent.concept}
                                        </div>
                                    </div>

                                    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">{language === 'KO' ? '비유' : 'Analogy'}</h4>
                                        <p className="text-slate-200 leading-relaxed border-l-2 border-yellow-500 pl-3">
                                            {currentEduContent.analogy}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">{language === 'KO' ? '기술 심화 설명' : 'Technical Deep Dive'}</h4>
                                        <p className="text-slate-300 leading-loose whitespace-pre-line text-sm">
                                            {currentEduContent.lecture}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800">
                                        <span className="text-xs text-slate-500 font-mono">{language === 'KO' ? '기술 스택: ' : 'Tech Stack: '}</span>
                                        <span className="text-xs text-emerald-400 font-mono">{currentEduContent.techStack}</span>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EDCSimulation;