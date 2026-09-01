
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldCheck, Building2, FileSignature, Key, Stamp, Server, ArrowRight, CheckCircle, RefreshCw, Lock, Terminal, Fingerprint, BadgeCheck, BookOpen, Info, FileJson, Layout, X, Share2, Printer, Database, Unlock, FileText, Send, AlertTriangle, AlertOctagon } from 'lucide-react';

const IdentityVerification: React.FC = () => {
    const { t, language } = useLanguage();
    const [step, setStep] = useState(0); // 0: Idle, 1: DID, 2: Req, 3: VC, 4: DAPS
    const [scenario, setScenario] = useState<'SUCCESS' | 'FAIL_SIGNATURE' | 'FAIL_EXPIRED'>('SUCCESS');
    const [isAnimating, setIsAnimating] = useState(false);
    const [inspectorData, setInspectorData] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'PAYLOAD' | 'LECTURE'>('PAYLOAD');
    const [showReport, setShowReport] = useState(false);
    const [showDetailReport, setShowDetailReport] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // --- Educational Content ---
    const EDU_CONTENT = {
        1: {
            title: language === 'KO'
                ? "Step 1: DID 생성 (자기주권신원)"
                : "Step 1: DID Generation (Self-Sovereign Identity)",
            concept: "Self-Sovereign Identity (SSI)",
            analogy: language === 'KO'
                ? "나만의 도장(Private Key)과 인감증명서(Public Key)를 만드는 과정입니다."
                : "It is like carving your own personal seal (Private Key) and registering its official certificate (Public Key).",
            lecture: language === 'KO'
                ? `중앙 기관 없이 스스로 신원을 증명할 수 있는 **DID(Decentralized Identifier)**를 생성합니다.
W3C 표준을 따르며, 개인키(Private Key)는 기업의 보안 지갑(Wallet)에 안전하게 저장되고 절대 외부로 유출되지 않습니다.
공개키(Public Key)는 블록체인이나 웹(did:web)에 공개되어 누구나 서명을 검증할 수 있게 합니다.`
                : `A **DID (Decentralized Identifier)** is generated so the organization can prove its own identity without relying on any central authority.
It follows the W3C standard: the Private Key stays inside the company's secure Wallet and never leaves it.
The Public Key is published on a blockchain or on the web (did:web) so that anyone can verify the signatures it produces.`,
            techStack: "Elliptic Curve Cryptography (Secp256k1), DID Document, JSON-LD",
            reportTitle: language === 'KO' ? "DID 문서 생성 완료" : "DID Document Created",
            reportSummary: language === 'KO'
                ? "참여자(Participant)의 고유 식별자(DID)와 암호화 키 쌍이 생성되었습니다. DID 문서는 네트워크에 등록되어 신원 확인의 기준점이 됩니다."
                : "A unique identifier (DID) and a cryptographic key pair have been created for the Participant. The DID Document is registered on the network and becomes the reference point for every identity check."
        },
        2: {
            title: language === 'KO'
                ? "Step 2: VC 신청 (자격증명 신청)"
                : "Step 2: VC Request (Credential Application)",
            concept: "Credential Application",
            analogy: language === 'KO'
                ? "동사무소에 등본 발급 신청서를 제출하는 단계입니다."
                : "This is the step where you hand in an application form at the civil affairs office to have an official certificate issued.",
            lecture: language === 'KO'
                ? `참여자(Participant)는 자신의 DID로 서명된 **자격증명 신청서(Credential Application)**를 Clearing House에 제출합니다.
이 신청서에는 기업의 실체 증빙 정보(사업자등록증 등)가 포함되며, Clearing House는 이를 기반으로 신원을 검증(KYB)합니다.`
                : `The Participant submits a **Credential Application** signed with its own DID to the Clearing House.
The application carries documentary evidence that the company exists (business registration certificate and the like), which the Clearing House uses to run its identity check (KYB).`,
            techStack: "DID Auth, HTTP POST, Verifiable Credential Data Model",
            reportTitle: language === 'KO' ? "신청서 제출 완료" : "Application Submitted",
            reportSummary: language === 'KO'
                ? "Clearing House에 자격증명 발급 신청서가 전송되었습니다. 기업 정보 및 DID 서명 검증 절차가 시작됩니다."
                : "The credential application has been delivered to the Clearing House. Verification of the company details and of the DID signature now begins."
        },
        3: {
            title: language === 'KO'
                ? "Step 3: VC 발급 (자격증명 발급)"
                : "Step 3: VC Issuance (Verifiable Credential)",
            concept: "Verifiable Credential (VC)",
            analogy: language === 'KO'
                ? "기관장 직인이 찍힌 공식 증명서(VC)를 발급받아 지갑에 보관합니다."
                : "You receive an official certificate (VC) stamped with the issuing authority's seal and keep it in your wallet.",
            lecture: language === 'KO'
                ? `Clearing House는 검증된 정보에 대해 자신의 개인키로 전자서명(Proof)을 추가하여 **VC(Verifiable Credential)**를 발행합니다.
이 VC는 위변조가 불가능하며, 데이터스페이스 네트워크 내에서 '신뢰된 멤버'임을 증명하는 디지털 여권 역할을 합니다.`
                : `The Clearing House signs the verified information with its own private key, adding a Proof, and issues a **VC (Verifiable Credential)**.
The VC cannot be forged or altered, and acts as a digital passport proving that the holder is a trusted member of the dataspace network.`,
            techStack: "W3C VC, Digital Signature (Ed25519), JWT",
            reportTitle: language === 'KO' ? "자격증명 검증 성공" : "Credential Verification Successful",
            reportSummary: language === 'KO'
                ? "Clearing House가 서명한 VC가 발급되어 Participant의 Wallet에 안전하게 저장되었습니다. 이제 참여자는 '신뢰된 멤버'임을 증명할 수 있습니다."
                : "The VC signed by the Clearing House has been issued and stored safely in the Participant's Wallet. The Participant can now prove that it is a trusted member."
        },
        4: {
            title: language === 'KO'
                ? "Step 4: DAPS 인증 (토큰 발급)"
                : "Step 4: DAPS Authentication (Token Issuance)",
            concept: "Dynamic Attribute Provisioning",
            analogy: language === 'KO'
                ? "여권(VC)을 제시하고 비행기 탑승권(Access Token)을 받는 출입국 심사 과정입니다."
                : "It is the immigration desk: you present your passport (VC) and receive a boarding pass (Access Token) in return.",
            lecture: language === 'KO'
                ? `데이터 전송을 시작하기 전, DAPS(Dynamic Attribute Provisioning Service)에 VC를 포함한 **VP(Verifiable Presentation)**를 제출합니다.
DAPS는 VC의 서명과 유효 기간을 검증한 후, 단기적으로 유효한 **DAT(Dynamic Attribute Token)**를 발급합니다. 이 토큰(JWT)이 실제 데이터 교환의 '열쇠'가 됩니다.`
                : `Before any data transfer starts, a **VP (Verifiable Presentation)** containing the VC is submitted to DAPS (Dynamic Attribute Provisioning Service).
DAPS checks the VC's signature and validity period, then issues a short-lived **DAT (Dynamic Attribute Token)**. That token (a JWT) is the actual key to the data exchange.`,
            techStack: "OAUTH 2.0, JWT (JSON Web Token), Client Credentials Grant",
            reportTitle: language === 'KO' ? "액세스 토큰(DAT) 발급 완료" : "Access Token (DAT) Issued",
            reportSummary: language === 'KO'
                ? "DAPS가 제출된 자격증명(VP)을 검증하고 보안 토큰(DAT)을 발급했습니다. 이 토큰은 1시간 동안 유효하며, 데이터 커넥터 간 통신에 사용됩니다."
                : "DAPS verified the submitted presentation (VP) and issued a security token (DAT). The token is valid for one hour and is used for communication between data connectors."
        }
    };

    const SAMPLES = {
        did: `// 1. DID Document (did:web:korea...)\n{\n  "@context": "https://www.w3.org/ns/did/v1",\n  "id": "did:web:korea:participant:001",\n  "verificationMethod": [{\n    "id": "#key-1",\n    "type": "JsonWebKey2020",\n    "controller": "did:web:korea...",\n    "publicKeyJwk": { ... }\n  }]\n}`,
        vc_req: `// 2. VC Request (Participant -> Clearing House)\n{\n  "type": "CredentialApplication",\n  "issuer": "did:web:korea:participant:001",\n  "credentialTypes": ["MembershipCredential"],\n  "claims": {\n    "company": "Hyundai Motor",\n    "bizRegNo": "101-81-09147",\n    "country": "KR"\n  },\n  "proof": { "type": "JsonWebSignature2020", "jws": "eyJhb..." }\n}`,
        vc: `// 3. Verifiable Credential (VC)\n{\n  "@context": ["https://www.w3.org/2018/credentials/v1"],\n  "type": ["VerifiableCredential", "MembershipCredential"],\n  "issuer": "did:web:clearinghouse",\n  "issuanceDate": "2024-05-25T10:00:00Z",\n  "credentialSubject": {\n    "id": "did:web:korea:participant:001",\n    "company": "Hyundai Motor",\n    "country": "KR",\n    "trustLevel": "Gold"\n  },\n  "proof": { "type": "Ed25519Signature2018", "jws": "eyJhbGciOiJFZERT..." }\n}`,
        token: `// 4. DAPS Token (JWT Decoded)\n{\n  "iss": "https://daps.korea.io",\n  "sub": "did:web:korea:participant:001",\n  "aud": "idsc:IDS_CONNECT",\n  "exp": 1716637200,\n  "scope": "idsc:IDS_CONNECTOR_ATTRIBUTES_ALL",\n  "referringConnector": "https://connector.hyundai.com"\n}`
    };

    // --- FINAL REPORT DATA ---
    const FINAL_REPORT = {
        meta: {
            id: "DID-SESSION-9921",
            timestamp: new Date().toLocaleString(),
            securityLevel: "IDS-RAM 4.0 (High)"
        },
        vcStructure: [
            { name: "VC Root", type: "Container", children: [
                { name: "Issuer", type: "Identity", desc: "Clearing House (Trust Anchor)" },
                { name: "Subject", type: "Identity", desc: "Hyundai Motor (Participant)" },
                { name: "Claims", type: "Data", children: [
                    { name: "Membership", type: "String", desc: "Active" },
                    { name: "Region", type: "String", desc: "APAC/KR" },
                    { name: "Role", type: "String", desc: "Data Consumer" }
                ]},
                { name: "Proof", type: "Crypto", desc: "Ed25519 Signature" }
            ]}
        ],
        tokenClaims: [
            { claim: "iss", value: "DAPS Server", desc: language === 'KO' ? "토큰 발급자" : "Issuer" },
            { claim: "sub", value: "did:web:hyundai...", desc: language === 'KO' ? "토큰 주체 (참여자)" : "Subject (Participant)" },
            { claim: "aud", value: "IDS Connectors", desc: language === 'KO' ? "토큰 사용 대상" : "Audience" },
            { claim: "scope", value: "READ_ALL", desc: language === 'KO' ? "허용 권한 범위" : "Permissions" },
            { claim: "exp", value: "+1 Hour", desc: language === 'KO' ? "만료 시점" : "Expiration" },
        ]
    };

    // --- Animation & Logic ---
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isAnimating && step > 0) {
            const duration = 4000;
            timer = setTimeout(() => {
                setIsAnimating(false);
                setShowReport(true);
            }, duration);
        }
        return () => clearTimeout(timer);
    }, [isAnimating, step]);

    // Typewriter Effect
    useEffect(() => {
        let data = '';
        if (step === 1) data = SAMPLES.did;
        else if (step === 2) data = SAMPLES.vc_req;
        else if (step === 3) data = SAMPLES.vc;
        else if (step === 4) data = SAMPLES.token;

        if (data) {
            setInspectorData('');
            let i = 0;
            const typeInterval = setInterval(() => {
                setInspectorData(data.substring(0, i + 1));
                i++;
                if (i >= data.length) clearInterval(typeInterval);
            }, 3); // Faster typing
            return () => clearInterval(typeInterval);
        }
    }, [step]);

    // Auto-scroll
    useEffect(() => {
        if (activeTab === 'PAYLOAD') {
            logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [inspectorData, activeTab]);

    const handleStepStart = (targetStep: number) => {
        setStep(targetStep);
        setIsAnimating(true);
        setShowReport(false);
        setShowDetailReport(false);
        if (targetStep === 1) setActiveTab('LECTURE');
    };

    const handleNextStep = () => {
        setShowReport(false);
        if (step < 4) {
            handleStepStart(step + 1);
        } else {
            // Finished
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
    };

    const getReportData = () => {
        const base = EDU_CONTENT[step as keyof typeof EDU_CONTENT];
        if (!base) return null;

        // Failure Logic at Step 4 (DAPS Auth)
        if (step === 4) {
            if (scenario === 'FAIL_SIGNATURE') {
                return {
                    title: language === 'KO' ? "인증 실패" : "Authentication Failed",
                    subtitle: language === 'KO' ? "전자서명이 유효하지 않음" : "Invalid Digital Signature",
                    summary: language === 'KO'
                        ? "DAPS 서버에서 VC의 전자서명을 검증하는 데 실패했습니다. 데이터 무결성이 훼손되었거나 서명 키가 일치하지 않습니다."
                        : "DAPS failed to verify the digital signature of the VC. Data integrity compromised or key mismatch.",
                    status: "error"
                };
            }
            if (scenario === 'FAIL_EXPIRED') {
                return {
                    title: language === 'KO' ? "인증 실패" : "Authentication Failed",
                    subtitle: language === 'KO' ? "자격증명 유효기간 만료" : "Credential Expired",
                    summary: language === 'KO'
                        ? "제출된 VC의 유효 기간(expirationDate)이 만료되었습니다. Clearing House를 통해 자격증명을 갱신해야 합니다."
                        : "The validity period of the submitted VC has expired. Credential renewal via Clearing House is required.",
                    status: "error"
                };
            }
        }
        
        return {
            title: base.reportTitle,
            subtitle: language === 'KO' ? `4단계 중 ${step}단계 완료` : `Step ${step} of 4 Completed`,
            summary: base.reportSummary,
            status: "success"
        };
    };

    const currentEduContent = EDU_CONTENT[step as keyof typeof EDU_CONTENT];
    const reportData = getReportData();

    return (
        <div className="space-y-4 animate-fadeIn pb-8 relative">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto pt-2 mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center justify-center gap-3">
                    <BadgeCheck className="w-8 h-8 text-blue-600" />
                    {language === 'KO' ? '신원 및 신뢰 시뮬레이터' : 'Identity & Trust Simulator'}
                </h1>
                <p className="text-sm text-slate-500">
                    {language === 'KO' 
                        ? 'DID, VC, DAPS를 활용한 데이터스페이스의 제로 트러스트(Zero Trust) 인증 프로세스'
                        : 'Zero Trust Authentication Process in DataSpace using DID, VC, and DAPS'}
                </p>
            </div>

            {/* Scenario Selector */}
            <div className="flex justify-center gap-4 mb-6">
                <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center">
                    <button
                        onClick={() => { setScenario('SUCCESS'); reset(); }}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${scenario === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <CheckCircle className="w-3 h-3" /> {language === 'KO' ? '정상 흐름' : 'Normal Flow'}
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button
                        onClick={() => { setScenario('FAIL_SIGNATURE'); reset(); }}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${scenario === 'FAIL_SIGNATURE' ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <AlertTriangle className="w-3 h-3" /> {language === 'KO' ? '오류: 서명 불일치' : 'Error: Invalid Sig'}
                    </button>
                    <button
                        onClick={() => { setScenario('FAIL_EXPIRED'); reset(); }}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${scenario === 'FAIL_EXPIRED' ? 'bg-orange-100 text-orange-700' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <AlertOctagon className="w-3 h-3" /> {language === 'KO' ? '오류: VC 만료' : 'Error: Expired VC'}
                    </button>
                </div>
            </div>

            {/* --- DETAILED REPORT MODAL --- */}
            {showDetailReport && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp relative my-8">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-emerald-600 rounded-lg">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{language === 'KO' ? '신원 및 신뢰 리포트' : 'Identity & Trust Report'}</h2>
                                    <p className="text-xs text-slate-400 font-mono">Session: {FINAL_REPORT.meta.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailReport(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh]">
                            
                            {/* Section 1: Trust Chain Visualization */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Layout className="w-4 h-4 text-slate-500" />
                                    {language === 'KO' ? '검증 가능한 자격증명(VC) 구조' : 'Verifiable Credential (VC) Structure'}
                                </h4>
                                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg overflow-x-auto">
                                    <div className="flex flex-col items-center gap-4">
                                        {/* Root */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-32 h-10 bg-slate-800 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-md z-10">
                                                VC: Membership
                                            </div>
                                            <div className="h-6 w-px bg-slate-300"></div>
                                        </div>
                                        
                                        {/* Tree Branches */}
                                        <div className="relative flex justify-center gap-12">
                                            {/* Connector Line */}
                                            <div className="absolute top-0 left-16 right-16 h-px bg-slate-300 -translate-y-6"></div>
                                            
                                            {/* Issuer */}
                                            <div className="flex flex-col items-center relative">
                                                <div className="absolute -top-6 left-1/2 w-px h-6 bg-slate-300"></div>
                                                <div className="w-24 h-24 bg-white border-2 border-purple-200 rounded-full flex flex-col items-center justify-center text-center shadow-sm p-2">
                                                    <Stamp className="w-6 h-6 text-purple-600 mb-1" />
                                                    <span className="text-[10px] font-bold text-slate-700">Issuer</span>
                                                    <span className="text-[8px] text-slate-400">Clearing House</span>
                                                </div>
                                            </div>

                                            {/* Subject (Claims) */}
                                            <div className="flex flex-col items-center relative">
                                                <div className="absolute -top-6 left-1/2 w-px h-6 bg-slate-300"></div>
                                                <div className="w-28 h-28 bg-white border-2 border-blue-200 rounded-xl flex flex-col items-center justify-center text-center shadow-sm p-2">
                                                    <Fingerprint className="w-6 h-6 text-blue-600 mb-1" />
                                                    <span className="text-[10px] font-bold text-slate-700">Claims (Subject)</span>
                                                    <div className="mt-1 text-[8px] text-left w-full pl-2 space-y-0.5 bg-slate-50 rounded p-1">
                                                        <div className="text-slate-500">ID: did:web...</div>
                                                        <div className="text-emerald-600">Status: Active</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Proof */}
                                            <div className="flex flex-col items-center relative">
                                                <div className="absolute -top-6 left-1/2 w-px h-6 bg-slate-300"></div>
                                                <div className="w-24 h-24 bg-white border-2 border-slate-300 rounded-full flex flex-col items-center justify-center text-center shadow-sm p-2">
                                                    <Lock className="w-6 h-6 text-slate-500 mb-1" />
                                                    <span className="text-[10px] font-bold text-slate-700">Proof</span>
                                                    <span className="text-[8px] text-slate-400">{language === 'KO' ? '전자서명' : 'Digital Signature'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Token Claims Table */}
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Key className="w-4 h-4 text-slate-500" />
                                        {language === 'KO' ? '디코딩된 액세스 토큰(DAT) 클레임' : 'Decoded Access Token (DAT) Claims'}
                                    </h4>
                                    <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                        {language === 'KO' ? '서명 유효' : 'Valid Signature'}
                                    </span>
                                </div>
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3">{language === 'KO' ? '클레임 (Key)' : 'Claim (Key)'}</th>
                                            <th className="px-6 py-3">{language === 'KO' ? '값' : 'Value'}</th>
                                            <th className="px-6 py-3">{language === 'KO' ? '설명' : 'Description'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {FINAL_REPORT.tokenClaims.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-3 font-mono text-slate-500 font-bold">{row.claim}</td>
                                                <td className="px-6 py-3 font-mono text-blue-600 bg-blue-50/30">{row.value}</td>
                                                <td className="px-6 py-3 text-slate-600 text-xs">{row.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-4 justify-end">
                                <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                                    <Printer className="w-4 h-4" /> {language === 'KO' ? '증명서 인쇄' : 'Print Certificate'}
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

            {/* --- REPORT MODAL (STEP) --- */}
            {showReport && step > 0 && reportData && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-3xl animate-fadeIn" onClick={() => {}}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-scaleUp border border-slate-200">
                        <div className={`text-white p-5 flex items-center gap-3 ${reportData.status === 'error' ? 'bg-red-600' : 'bg-slate-900'}`}>
                            <div className={`p-2 rounded-full ${reportData.status === 'error' ? 'bg-white/20' : 'bg-emerald-500/20'}`}>
                                {reportData.status === 'error' ? <AlertTriangle className="w-6 h-6 text-white" /> : <CheckCircle className="w-6 h-6 text-emerald-400" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{reportData.title}</h3>
                                <p className="text-xs text-white/70">{reportData.subtitle}</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">{language === 'KO' ? '처리 요약' : 'Operation Summary'}</h4>
                                <p className={`text-sm leading-relaxed p-4 rounded-xl border ${reportData.status === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                                    {reportData.summary}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">{language === 'KO' ? '생성된 산출물' : 'Generated Artifacts'}</h4>
                                <div className="flex gap-2">
                                    {step >= 1 && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">DID Doc</span>}
                                    {step >= 2 && <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">Credential App</span>}
                                    {step >= 3 && <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">VC (Signed)</span>}
                                    {step >= 4 && reportData.status === 'success' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">DAT (Token)</span>}
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Log: OK</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {step === 4 && reportData.status === 'success' && (
                                    <button 
                                        onClick={openDetailReport}
                                        className="flex-1 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <FileText className="w-4 h-4" />
                                        {language === 'KO' ? '전체 리포트 보기' : 'View Full Report'}
                                    </button>
                                )}
                                {reportData.status === 'error' ? (
                                    <button 
                                        onClick={reset}
                                        className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                                    >
                                        <RefreshCw className="w-4 h-4" /> {language === 'KO' ? '다시 시도' : 'Retry'}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleNextStep}
                                        className={`py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 ${step === 4 ? 'flex-1' : 'w-full'}`}
                                    >
                                        {step === 4
                                            ? (language === 'KO' ? '완료' : 'Finish')
                                            : (language === 'KO' ? '다음 단계' : 'Next Step')}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Stage */}
            <div className="bg-slate-900 rounded-3xl p-4 relative overflow-hidden shadow-2xl border border-slate-700 h-[380px]">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
                </div>

                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 5}} viewBox="0 0 800 380" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Step 2 Path (P -> CH: Request) */}
                    {(step === 2) && (
                        <>
                            <path d="M 190 190 L 370 190" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="5 5" className="opacity-50" />
                            <g>
                                <animateMotion dur="2s" repeatCount="indefinite" path="M 190 190 L 370 190" />
                                <circle r="4" fill="#f59e0b" />
                            </g>
                        </>
                    )}

                    {/* Step 3 Path (CH -> P: Issuance) */}
                    {(step === 3) && (
                        <>
                            <path d="M 370 190 L 190 190" stroke="#a855f7" strokeWidth="2" fill="none" strokeDasharray="5 5" className="opacity-50" />
                            <g>
                                <animateMotion dur="2s" repeatCount="indefinite" path="M 370 190 L 190 190" />
                                <circle r="4" fill="#a855f7" />
                            </g>
                        </>
                    )}

                    {/* Step 4 Path (P -> DAPS: Token) - Curved */}
                    {(step === 4) && (
                        <>
                            <path d="M 190 210 Q 400 350 630 210" stroke={scenario === 'SUCCESS' || isAnimating ? "#10b981" : "#ef4444"} strokeWidth="2" fill="none" strokeDasharray="5 5" className="opacity-50" />
                            <g>
                                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 190 210 Q 400 350 630 210" />
                                <circle r="4" fill={scenario === 'SUCCESS' || isAnimating ? "#10b981" : "#ef4444"} />
                            </g>
                            {/* Return Path if Success */}
                            {(scenario === 'SUCCESS' || isAnimating) && (
                                <g>
                                    <animateMotion dur="2.5s" begin="1.25s" repeatCount="indefinite" path="M 630 210 Q 400 350 190 210" />
                                    <circle r="4" fill="#6ee7b7" />
                                </g>
                            )}
                        </>
                    )}
                </svg>

                {/* Nodes Container (Absolute Positioning) */}
                <div className="relative z-10 w-full h-full">
                    
                    {/* Node 1: Participant (Left) */}
                    <div className={`absolute top-1/2 left-[15%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ${step >= 1 ? 'opacity-100 scale-105' : 'opacity-60'}`}>
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center border-4 shadow-xl relative z-10 ${step >= 1 ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
                            <Building2 className="w-10 h-10" />
                            {step === 1 && isAnimating && (
                                <div className="absolute inset-0 bg-blue-500 rounded-2xl animate-ping opacity-20"></div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-white font-bold block text-lg">{language === 'KO' ? '참여자' : 'Participant'}</span>
                            <span className="text-slate-400 text-xs">{language === 'KO' ? '(지갑 & DID)' : '(Wallet & DID)'}</span>
                        </div>
                        {step >= 1 && (
                            <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce z-20 shadow-lg">
                                {language === 'KO' ? '키 쌍 생성' : 'Key Pair'}
                            </div>
                        )}
                    </div>

                    {/* Node 2: Clearing House (Center) */}
                    <div className={`absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ${step >= 2 ? 'opacity-100 scale-105' : 'opacity-60'}`}>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-xl relative z-10 ${step >= 2 ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
                            <Stamp className="w-10 h-10" />
                            {/* Pulse for Step 2 and 3 */}
                            {(step === 2 || step === 3) && isAnimating && (
                                <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-white font-bold block text-lg">Clearing House</span>
                            <span className="text-slate-400 text-xs">{language === 'KO' ? '(발급기관)' : '(Issuer)'}</span>
                        </div>
                        {step >= 3 && (
                            <div className="absolute -top-2 right-0 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-20 shadow-lg">
                                {language === 'KO' ? '발급 완료' : 'Issued'}
                            </div>
                        )}
                    </div>

                    {/* Node 3: DAPS (Right) */}
                    <div className={`absolute top-1/2 left-[85%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ${step >= 4 ? 'opacity-100 scale-105' : 'opacity-60'}`}>
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center border-4 shadow-xl relative z-10 ${
                            step >= 4 ? (scenario === 'SUCCESS' || isAnimating ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-red-600 border-red-400 text-white') : 
                            'bg-slate-800 border-slate-600 text-slate-500'
                        }`}>
                            {scenario === 'SUCCESS' || isAnimating ? <ShieldCheck className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                            {step === 4 && isAnimating && (
                                <div className="absolute inset-0 bg-emerald-500 rounded-2xl animate-ping opacity-20"></div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-white font-bold block text-lg">DAPS</span>
                            <span className="text-slate-400 text-xs">{language === 'KO' ? '(검증기관)' : '(Verifier)'}</span>
                        </div>
                        {step >= 4 && (scenario === 'SUCCESS' || isAnimating) && (
                            <div className="absolute -top-4 -right-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse z-20 shadow-lg">
                                {language === 'KO' ? '인증 완료' : 'Active'}
                            </div>
                        )}
                        {step >= 4 && scenario !== 'SUCCESS' && !isAnimating && (
                            <div className="absolute -top-4 -right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-20 shadow-lg">
                                {language === 'KO' ? '거부됨' : 'Rejected'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur border border-slate-600 px-6 py-2 rounded-full shadow-lg z-20">
                    <span className="text-slate-300 text-sm font-mono flex items-center gap-2">
                        {language === 'KO' ? '시스템 상태:' : 'System Status:'}
                        <span className={`font-bold ${
                            step === 4 && !isAnimating 
                                ? (scenario === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400')
                                : 'text-yellow-400'
                        }`}>
                            {step === 0 ? (language === 'KO' ? '대기 중' : 'Idle') :
                             isAnimating ? (language === 'KO' ? '처리 중...' : 'Processing...') :
                             (scenario === 'SUCCESS'
                                ? (language === 'KO' ? '완료' : 'Completed')
                                : (language === 'KO' ? '실패' : 'Failed'))}
                        </span>
                    </span>
                </div>

                {/* Legend/Artifacts */}
                <div className="absolute bottom-4 left-0 right-0 px-8 flex justify-center gap-4 pointer-events-none z-20">
                    <div className={`bg-slate-800/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="p-2 bg-blue-500/20 rounded-lg"><Fingerprint className="w-4 h-4 text-blue-400" /></div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">{language === 'KO' ? '신원' : 'Identity'}</div>
                            <div className="text-xs text-white font-bold">DID Document</div>
                        </div>
                    </div>
                    <div className={`bg-slate-800/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="p-2 bg-purple-500/20 rounded-lg"><FileSignature className="w-4 h-4 text-purple-400" /></div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">{language === 'KO' ? '자격증명' : 'Credential'}</div>
                            <div className="text-xs text-white font-bold">Verifiable Credential</div>
                        </div>
                    </div>
                    <div className={`bg-slate-800/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 transition-opacity duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="p-2 bg-emerald-500/20 rounded-lg"><Key className="w-4 h-4 text-emerald-400" /></div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">{language === 'KO' ? '접근 권한' : 'Access'}</div>
                            <div className="text-xs text-white font-bold">DAPS Token</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {[
                        { id: 1, label: language === 'KO' ? '1. DID 생성' : '1. DID Gen', icon: Fingerprint },
                        { id: 2, label: language === 'KO' ? '2. 신청' : '2. Request', icon: Send },
                        { id: 3, label: language === 'KO' ? '3. 발급' : '3. Issue', icon: Stamp },
                        { id: 4, label: language === 'KO' ? '4. 토큰' : '4. Token', icon: Key },
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

            {/* Inspector (Split View) */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-lg mt-2 flex flex-col h-[400px]">
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
                                    <Database className="w-8 h-8 mb-2 opacity-50" />
                                    <p>{language === 'KO' ? '시뮬레이션 시작을 기다리는 중입니다...' : 'Waiting for simulation start...'}</p>
                                </div>
                            )}
                            {step > 0 && (
                                <div>
                                    <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed bg-black/30 p-3 rounded border border-slate-800">
                                        {inspectorData}
                                        <span className="animate-pulse">_</span>
                                    </pre>
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
                                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">{language === 'KO' ? '비유로 이해하기' : 'Analogy'}</h4>
                                        <p className="text-slate-200 leading-relaxed border-l-2 border-yellow-500 pl-3">
                                            {currentEduContent.analogy}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">{language === 'KO' ? '기술 상세 설명' : 'Technical Deep Dive'}</h4>
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

export default IdentityVerification;
