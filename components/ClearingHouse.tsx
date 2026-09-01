
import React, { useState, useRef, useEffect } from 'react';
import { BadgeCheck, Search, CheckCircle2, XCircle, FileText, CreditCard, Users, RefreshCw, Filter, Building, Activity, ShieldAlert, Scale, Play, Terminal, Lock, Globe, Database, Server, FileWarning, Award, Download, Share2, AlertTriangle, X, PieChart as PieIcon, BarChart3, Receipt, FileCheck, ArrowRight, ChevronRight, Briefcase, FileJson, Stamp, Link as LinkIcon, Wallet, Siren, Cpu, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ClearingHouse: React.FC = () => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'IDENTITY' | 'FINANCIAL' | 'SIMULATION'>('IDENTITY');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Modal States ---
    const [selectedVerification, setSelectedVerification] = useState<any>(null);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    
    // Batch Processing States
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [batchProgress, setBatchProgress] = useState(0);
    const [showSettlementReport, setShowSettlementReport] = useState(false);

    // VC Issuance States
    const [isIssuingVC, setIsIssuingVC] = useState(false);
    const [showVCReport, setShowVCReport] = useState(false); 
    const [issuedVCData, setIssuedVCData] = useState<any>(null);

    // Rejection Report State
    const [showRejectReport, setShowRejectReport] = useState(false);
    const [rejectData, setRejectData] = useState<any>(null);

    // --- Simulation State ---
    const [simState, setSimState] = useState<'IDLE' | 'RUNNING' | 'COMPLETE'>('IDLE');
    const [simScenario, setSimScenario] = useState<'SUCCESS' | 'FAIL_REGISTRY' | 'FAIL_COMPLIANCE'>('SUCCESS');
    const [simResult, setSimResult] = useState<{status: 'PASS' | 'FAIL', reason?: string, data?: any, scenario?: string} | null>(null);
    const [showSimReport, setShowSimReport] = useState(false); // Simulation Report Modal
    const [currentStep, setCurrentStep] = useState(0);
    const [simLogs, setSimLogs] = useState<{time: string, msg: string, type: 'info'|'success'|'error'}[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const [mockRequest, setMockRequest] = useState({
        companyName: 'NextGen Mobility Co.',
        regNumber: 'DE-HRB-123456',
        country: 'Germany',
        bpn: 'BPN-L-99887766'
    });

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [simLogs]);

    const addLog = (msg: string, type: 'info'|'success'|'error' = 'info') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        setSimLogs(prev => [...prev, { time, msg, type }]);
    };

    const runSimulation = async () => {
        if (simState === 'RUNNING') return;
        setSimState('RUNNING');
        setSimResult(null);
        setCurrentStep(1);
        setSimLogs([]);
        
        addLog(`Received verification request for ${mockRequest.companyName}`, 'info');
        
        // Step 1: Registry Lookup
        await new Promise(r => setTimeout(r, 1000));
        addLog(`Connecting to Commercial Register (${mockRequest.country})...`, 'info');
        
        if (simScenario === 'FAIL_REGISTRY') {
            await new Promise(r => setTimeout(r, 800));
            addLog(`Error: Registration Number '${mockRequest.regNumber}' not found.`, 'error');
            addLog(`Verification Process Failed.`, 'error');
            setSimState('COMPLETE');
            setSimResult({
                status: 'FAIL',
                scenario: 'FAIL_REGISTRY',
                reason: language === 'KO' ? '상업등기부에서 해당 법인을 찾을 수 없습니다.' : 'Entity not found in Commercial Register.',
                data: { step: 'Registry Check', code: 'REG_404' }
            });
            return;
        }

        addLog(`Validating Registration Number: ${mockRequest.regNumber}`, 'info');
        addLog(`Registry Check Passed. Legal Entity Verified.`, 'success');
        setCurrentStep(2);

        // Step 2: Compliance Check
        await new Promise(r => setTimeout(r, 1000));
        addLog(`Scanning Global Sanctions Lists (UN, EU, OFAC)...`, 'info');
        
        if (simScenario === 'FAIL_COMPLIANCE') {
            await new Promise(r => setTimeout(r, 800));
            addLog(`Warning: Match found in OFAC SDN List.`, 'error');
            addLog(`Compliance Check Failed. Risk Level: HIGH.`, 'error');
            setSimState('COMPLETE');
            setSimResult({
                status: 'FAIL',
                scenario: 'FAIL_COMPLIANCE',
                reason: language === 'KO' ? '제재 대상 목록(OFAC)과 일치하는 항목이 확인되었습니다.' : 'Sanctions list match detected (OFAC).',
                data: { step: 'Compliance Check', code: 'COMP_RISK_HIGH' }
            });
            return;
        }

        addLog(`Checking AML (Anti-Money Laundering) database...`, 'info');
        addLog(`Compliance Status: CLEAN. No risk factors found.`, 'success');
        setCurrentStep(3);

        // Step 3: VC Issuance
        await new Promise(r => setTimeout(r, 1000));
        addLog(`Generating Verifiable Credential (VC)...`, 'info');
        addLog(`Signing VC with Clearing House Private Key...`, 'info');
        const did = `did:web:korea:clearinghouse:${Math.random().toString(36).substr(2, 8)}`;
        addLog(`VC Issued: ${did}`, 'success');
        setCurrentStep(4);

        // Step 4: Blockchain Anchor
        await new Promise(r => setTimeout(r, 1000));
        addLog(`Broadcasting credential hash to Trust Chain...`, 'info');
        addLog(`Anchor created at Block #14,206,102`, 'success');
        addLog(`Updating Dynamic Attribute Provisioning Service (DAPS)...`, 'info');
        
        setCurrentStep(5);
        setSimState('COMPLETE');
        setSimResult({
            status: 'PASS',
            scenario: 'SUCCESS',
            reason: '',
            data: {
                did: did,
                issueDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
                txHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').substring(0, 16) + '...'
            }
        });
        addLog(`Verification Process Completed Successfully.`, 'success');
    };

    const resetSimulation = () => {
        setSimState('IDLE');
        setSimResult(null);
        setCurrentStep(0);
        setSimLogs([]);
    };

    // --- Batch Processing Simulation ---
    const runBatchProcessing = () => {
        setShowBatchModal(true);
        setBatchProgress(0);
        const interval = setInterval(() => {
            setBatchProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2; 
            });
        }, 50);
    };

    const handleViewSettlementReport = () => {
        setShowBatchModal(false);
        setShowSettlementReport(true);
    };

    // --- VC Issuance Handler ---
    const handleIssueVC = async () => {
        if (!selectedVerification) return;
        setIsIssuingVC(true);
        
        // Simulate processing
        await new Promise(r => setTimeout(r, 2000));
        
        const newVC = {
            id: `vc_${Math.random().toString(36).substr(2, 9)}`,
            issuer: 'did:web:korea:clearinghouse',
            subject: selectedVerification.company,
            bpn: selectedVerification.bpn,
            issuanceDate: new Date().toISOString(),
            type: ['VerifiableCredential', 'MembershipCredential'],
            proof: {
                type: 'JsonWebSignature2020',
                created: new Date().toISOString(),
                jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..',
            }
        };
        
        setIssuedVCData(newVC);
        setIsIssuingVC(false);
        setSelectedVerification(null);
        setShowVCReport(true);
    };

    // --- Rejection Handler ---
    const handleRejectRequest = () => {
        if (!selectedVerification) return;
        setRejectData({
            company: selectedVerification.company,
            bpn: selectedVerification.bpn,
            riskScore: 85,
            reason: language === 'KO' ? '컴플라이언스 위반 (제재 대상)' : 'Compliance Violation (Sanctions)',
            evidence: language === 'KO'
                ? ['OFAC 특별지정제재대상(SDN) 목록 일치', '유효하지 않은 사업자등록번호']
                : ['OFAC Specially Designated Nationals List Match', 'Invalid Tax Registration Number']
        });
        setSelectedVerification(null);
        setShowRejectReport(true);
    };

    // --- Mock Data ---
    const pendingVerifications = [
        { id: 'v1', company: 'Future EVs Ltd.', bpn: 'BPN-L-88291', country: 'DE', status: 'PENDING', date: '2024-05-22', docs: language === 'KO' ? ['사업자등록증', '납세증명서'] : ['Business License', 'Tax Cert'] },
        { id: 'v2', company: 'Green Battery Co.', bpn: 'BPN-L-11029', country: 'KR', status: 'PENDING', date: '2024-05-23', docs: language === 'KO' ? ['사업자등록증', 'ISO 14001'] : ['Business License', 'ISO 14001'] },
    ];

    const verifiedCompanies = [
        { id: 'c1', company: 'Hyundai Motor', bpn: 'BPN-L-00001', country: 'KR', status: 'VERIFIED', date: '2023-01-15', tier: 'OEM', trust: 98 },
        { id: 'c2', company: 'Samsung Electronics', bpn: 'BPN-L-00002', country: 'KR', status: 'VERIFIED', date: '2023-02-10', tier: 'Tier 1', trust: 99 },
        { id: 'c3', company: 'LG Energy Solution', bpn: 'BPN-L-00003', country: 'KR', status: 'VERIFIED', date: '2023-03-22', tier: 'Tier 1', trust: 97 },
        { id: 'c4', company: 'POSCO', bpn: 'BPN-L-00004', country: 'KR', status: 'VERIFIED', date: '2023-04-05', tier: 'Tier 2', trust: 95 },
    ];

    const settlements = [
        { id: 'st_1029', from: 'Hyundai Motor', to: 'LG Energy Solution', amount: 45000, asset: language === 'KO' ? '배터리 충방전 데이터' : 'Battery Cycle Data', status: 'CLEARED', date: '2024-05-20 14:30' },
        { id: 'st_1030', from: 'Doosan Robotics', to: 'Samsung Electronics', amount: 12500, asset: language === 'KO' ? '팹 자동화 로그' : 'Fab Automation Log', status: 'CLEARED', date: '2024-05-21 09:15' },
        { id: 'st_1031', from: 'POSCO', to: 'Hyundai Motor', amount: 8900, asset: language === 'KO' ? '철강 품질 인증서' : 'Steel Quality Cert', status: 'PENDING', date: '2024-05-22 11:00' },
        { id: 'st_1032', from: 'HMM', to: 'CJ Logistics', amount: 3200, asset: language === 'KO' ? '항만 도착예정시간 피드' : 'Port ETA Feed', status: 'CLEARED', date: '2024-05-22 13:45' },
    ];

    // Chart Data
    const countryStats = [
        { name: language === 'KO' ? '한국' : 'Korea', value: 65, color: '#3b82f6' },
        { name: language === 'KO' ? '독일' : 'Germany', value: 20, color: '#ec4899' },
        { name: language === 'KO' ? '미국' : 'USA', value: 10, color: '#f59e0b' },
        { name: language === 'KO' ? '일본' : 'Japan', value: 5, color: '#10b981' },
    ];

    const financialTrend = [
        { name: language === 'KO' ? '1월' : 'Jan', amount: 3200 },
        { name: language === 'KO' ? '2월' : 'Feb', amount: 4100 },
        { name: language === 'KO' ? '3월' : 'Mar', amount: 3800 },
        { name: language === 'KO' ? '4월' : 'Apr', amount: 5200 },
        { name: language === 'KO' ? '5월' : 'May', amount: 4200 }, // Current
    ];

    return (
        <div className="space-y-8 animate-fadeIn pb-12 relative">
            
            {/* --- MODALS --- */}

            {/* 5. Simulation Report Modal (Detailed) */}
            {simState === 'COMPLETE' && showSimReport && simResult && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-scaleUp relative flex flex-col max-h-[90vh]">
                         {/* Header based on status */}
                         <div className={`${simResult.status === 'PASS' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-red-600 to-rose-600'} text-white p-6 flex justify-between items-center shrink-0`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur border border-white/20 shadow-lg">
                                    {simResult.status === 'PASS' ? <BadgeCheck className="w-8 h-8 text-white" /> : <ShieldAlert className="w-8 h-8 text-white" />}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">{simResult.status === 'PASS'
                                        ? (language === 'KO' ? '신원 검증 완료' : 'Identity Verified Successfully')
                                        : (language === 'KO' ? '검증 거부' : 'Verification Rejected')}</h2>
                                    <p className="text-xs text-white/80 opacity-90 font-mono mt-1">{language === 'KO' ? '식별자' : 'ID'}: {simResult.data?.did || 'N/A'} • {new Date().toLocaleString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowSimReport(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-white" /></button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto bg-slate-50 flex-1">
                            {/* 1. Process Pipeline Visualization */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-500 uppercase mb-8 text-center tracking-widest">{language === 'KO' ? '검증 파이프라인 진행 상태' : 'Verification Pipeline Status'}</h4>
                                <div className="relative">
                                    {/* Connecting Line */}
                                    <div className="absolute left-[10%] right-[10%] top-6 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${simResult.status === 'PASS' ? 'bg-emerald-500 w-full' : 'bg-red-500'}`}
                                            style={{ width: simResult.status === 'FAIL' ? (simResult.scenario === 'FAIL_REGISTRY' ? '25%' : '50%') : '100%' }}
                                        ></div>
                                    </div>
                                    
                                    <div className="flex justify-between relative z-10">
                                        {(language === 'KO'
                                            ? ['등기부 조회', '컴플라이언스 검사', 'VC 발급', '블록체인 앵커링']
                                            : ['Registry Check', 'Compliance Scan', 'VC Issuance', 'Anchor']
                                        ).map((step, i) => {
                                            let status = 'pending';
                                            if (simResult.status === 'PASS') status = 'success';
                                            else {
                                                const failIndex = simResult.scenario === 'FAIL_REGISTRY' ? 0 : 1; 
                                                if (i < failIndex) status = 'success';
                                                else if (i === failIndex) status = 'error';
                                                else status = 'pending';
                                            }

                                            const icons = [Globe, ShieldAlert, Award, LinkIcon];
                                            const Icon = icons[i];

                                            return (
                                                <div key={i} className="flex flex-col items-center gap-3 w-32 text-center">
                                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-sm ${
                                                        status === 'success' ? 'bg-emerald-500 border-emerald-100 text-white shadow-emerald-200' :
                                                        status === 'error' ? 'bg-red-500 border-red-100 text-white shadow-red-200 scale-110' :
                                                        'bg-white border-slate-200 text-slate-300'
                                                    }`}>
                                                        {status === 'error' ? <X className="w-6 h-6" /> : 
                                                         status === 'success' ? <CheckCircle2 className="w-6 h-6" /> : 
                                                         <Icon className="w-6 h-6" />}
                                                    </div>
                                                    <span className={`text-xs font-bold uppercase ${
                                                        status === 'error' ? 'text-red-600' : 
                                                        status === 'success' ? 'text-emerald-600' : 'text-slate-400'
                                                    }`}>{step}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Detailed Result Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                
                                {/* Left: Data & Compliance */}
                                <div className="space-y-6">
                                    {/* Entity Data */}
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <Building className="w-5 h-5 text-blue-500" />
                                            {language === 'KO' ? '법인 검증 정보' : 'Entity Verification Data'}
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">{language === 'KO' ? '법인명' : 'Legal Name'}</span>
                                                <span className="font-bold text-slate-900">{mockRequest.companyName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">{language === 'KO' ? '등록번호' : 'Registration No.'}</span>
                                                <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{mockRequest.regNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">{language === 'KO' ? '관할 국가' : 'Jurisdiction'}</span>
                                                <span className="text-slate-700">{mockRequest.country}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">BPN</span>
                                                <span className="text-blue-600 font-bold text-xs">{mockRequest.bpn}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compliance Results */}
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <ShieldCheck className="w-5 h-5 text-purple-500" />
                                            {language === 'KO' ? '컴플라이언스 검사 결과' : 'Compliance Scan Results'}
                                        </h4>
                                        {simResult.status === 'PASS' ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {['OFAC SDN', 'EU Sanctions', 'UN Consolidated', 'Interpol Red'].map((list, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                        <span className="text-xs font-bold text-emerald-800 truncate">{list}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                                    <span className="font-bold text-red-800">{language === 'KO' ? '위험 감지' : 'Risk Detected'}</span>
                                                </div>
                                                <p className="text-xs text-red-700">{simResult.reason}</p>
                                                <div className="mt-3 text-xs font-mono bg-white p-2 rounded border border-red-200 text-red-600">
                                                    Code: {simResult.data?.code || 'ERR_UNKNOWN'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Credential & Blockchain */}
                                <div className="space-y-6">
                                    {simResult.status === 'PASS' ? (
                                        <>
                                            {/* Visual Credential Card */}
                                            <div className="relative group perspective-1000">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-1 opacity-20 group-hover:rotate-2 transition-transform"></div>
                                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl relative overflow-hidden transform transition-transform group-hover:-translate-y-1">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full opacity-50"></div>
                                                    
                                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">IX</div>
                                                            <div>
                                                                <h5 className="font-bold text-slate-900 text-lg">Verifiable Credential</h5>
                                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{language === 'KO' ? '멤버십 토큰' : 'Membership Token'}</p>
                                                            </div>
                                                        </div>
                                                        <Stamp className="w-8 h-8 text-emerald-500 opacity-80" />
                                                    </div>

                                                    <div className="space-y-3 relative z-10">
                                                        <div>
                                                            <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'KO' ? '보유자 (주체)' : 'Holder (Subject)'}</span>
                                                            <span className="text-sm font-bold text-slate-800">{mockRequest.companyName}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] text-slate-400 uppercase font-bold block">DID</span>
                                                            <span className="text-xs font-mono text-slate-600 truncate block bg-slate-50 p-1 rounded">{simResult.data.did}</span>
                                                        </div>
                                                        <div className="flex justify-between pt-2">
                                                            <div>
                                                                <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'KO' ? '발급일' : 'Issued'}</span>
                                                                <span className="text-xs text-slate-700">{simResult.data.issueDate}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'KO' ? '만료일' : 'Expires'}</span>
                                                                <span className="text-xs text-slate-700">{simResult.data.expiryDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Blockchain Proof */}
                                            <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                                    <LinkIcon className="w-4 h-4" /> {language === 'KO' ? '블록체인 앵커' : 'Blockchain Anchor'}
                                                </h4>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-emerald-400">Block #14,206,102</span>
                                                    <span className="text-xs text-slate-500">{language === 'KO' ? '확정됨' : 'Confirmed'}</span>
                                                </div>
                                                <div className="bg-black/30 p-2 rounded border border-slate-700 font-mono text-[10px] text-slate-300 break-all">
                                                    Tx: {simResult.data.txHash || '0x7f2ca...9a21'}
                                                </div>
                                                <div className="mt-3 flex gap-2">
                                                    <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">Gas: 21,000</span>
                                                    <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">Net: Polygon</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        // Failure Right Panel
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 h-full flex flex-col justify-center items-center text-center">
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                                <XCircle className="w-8 h-8 text-red-600" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-2">{language === 'KO' ? '검증 중단' : 'Verification Halted'}</h4>
                                            <p className="text-sm text-slate-500 mb-6">
                                                {language === 'KO'
                                                    ? '클리어링 하우스 정책 엔진이 검증 절차를 자동으로 중단했습니다. 오류 상세 내용을 확인한 뒤 다시 시도해 주세요.'
                                                    : 'The process was automatically stopped by the Clearing House Policy Engine. Please review the error details and try again.'}
                                            </p>
                                            <div className="w-full bg-white p-4 rounded-lg border border-slate-200 text-left">
                                                <h5 className="text-xs font-bold text-slate-700 mb-2">{language === 'KO' ? '문제 해결 방법:' : 'Troubleshooting:'}</h5>
                                                <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
                                                    <li>{language === 'KO' ? '법인 등록번호 형식을 확인하세요.' : 'Check the company registration number format.'}</li>
                                                    <li>{language === 'KO' ? '해당 법인이 유효한 제재 목록에 포함되어 있지 않은지 확인하세요.' : 'Ensure the entity is not on any active sanctions list.'}</li>
                                                    <li>{language === 'KO' ? 'BPN 유효성을 확인하세요.' : 'Verify the BPN validity.'}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                            {simResult.status === 'PASS' && (
                                <button className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-white transition-colors flex items-center gap-2">
                                    <Download className="w-4 h-4" /> {language === 'KO' ? '증명서 저장' : 'Save Certificate'}
                                </button>
                            )}
                            <button onClick={() => setShowSimReport(false)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                                {language === 'KO' ? '리포트 닫기' : 'Close Report'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Other Modals (Batch, etc.) kept as is ... --- */}
            {/* 1. Batch Processing Modal (Progress) */}
            {showBatchModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-scaleUp">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {batchProgress < 100 ? <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" /> : <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {batchProgress < 100
                                ? (language === 'KO' ? '정산 배치 처리 중...' : 'Processing Settlement Batch...')
                                : (language === 'KO' ? '배치 처리 완료' : 'Batch Completed')}
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            {batchProgress < 100
                                ? (language === 'KO' ? '거래 로그를 집계하여 순포지션을 계산하고 있습니다.' : 'Aggregating transaction logs and calculating net positions.')
                                : (language === 'KO' ? '대기 중이던 모든 거래가 정상적으로 청산되었습니다.' : 'All pending transactions have been cleared successfully.')}
                        </p>
                        
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-blue-600 transition-all duration-200" style={{ width: `${batchProgress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mb-6">
                            <span>{language === 'KO' ? '검증 중...' : 'Validating...'}</span>
                            <span>{batchProgress}%</span>
                        </div>

                        {batchProgress < 100 ? (
                            <button disabled className="w-full py-3 rounded-xl font-bold bg-slate-200 text-slate-400 cursor-not-allowed">
                                {language === 'KO' ? '처리 중...' : 'Processing...'}
                            </button>
                        ) : (
                            <button 
                                onClick={handleViewSettlementReport}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                            >
                                <FileText className="w-4 h-4" /> {language === 'KO' ? '정산 리포트 보기' : 'View Settlement Report'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 1-B. Settlement Report Modal (Detailed) */}
            {showSettlementReport && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-scaleUp relative my-8">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Scale className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{language === 'KO' ? '월간 정산 리포트' : 'Monthly Settlement Report'}</h2>
                                    <p className="text-xs text-slate-400">{language === 'KO' ? '배치 ID' : 'Batch ID'}: #BATCH-2024-05-24 • {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowSettlementReport(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                    <p className="text-xs font-bold text-blue-500 uppercase mb-1">{language === 'KO' ? '총 거래액' : 'Total Volume'}</p>
                                    <h3 className="text-3xl font-bold text-blue-900">$4,250,000</h3>
                                    <p className="text-xs text-blue-400 mt-2">{language === 'KO' ? '직전 배치 대비 +12%' : '+12% vs last batch'}</p>
                                </div>
                                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-500 uppercase mb-1">{language === 'KO' ? '청산 완료 거래' : 'Cleared Transactions'}</p>
                                    <h3 className="text-3xl font-bold text-emerald-900">12,450</h3>
                                    <p className="text-xs text-emerald-400 mt-2">{language === 'KO' ? '성공률 100%' : '100% Success Rate'}</p>
                                </div>
                                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                                    <p className="text-xs font-bold text-purple-500 uppercase mb-1">{language === 'KO' ? '네팅 효율' : 'Netting Efficiency'}</p>
                                    <h3 className="text-3xl font-bold text-purple-900">35%</h3>
                                    <p className="text-xs text-purple-400 mt-2">{language === 'KO' ? '이체 건수 감소' : 'Reduction in transfers'}</p>
                                </div>
                            </div>

                            {/* Infographic: Netting Process */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-blue-500" />
                                    {language === 'KO' ? '다자간 네팅 시각화' : 'Multilateral Netting Visualization'}
                                </h4>
                                <div className="relative h-64 w-full bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">
                                    {/* Animated SVG Visualization */}
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 300">
                                        <defs>
                                            <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                                            </marker>
                                        </defs>
                                        
                                        {/* Center: Clearing House */}
                                        <circle cx="400" cy="150" r="40" fill="#1e293b" />
                                        <text x="400" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{language === 'KO' ? '클리어링' : 'CLEARING'}</text>
                                        
                                        {/* Left Side (Debtors) */}
                                        <g>
                                            <rect x="50" y="50" width="100" height="40" rx="5" fill="#fff" stroke="#cbd5e1" />
                                            <text x="100" y="75" textAnchor="middle" fontSize="10">Hyundai (-$5M)</text>
                                            <path d="M 150 70 Q 275 70 360 140" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowHead)">
                                                <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" fill="freeze" />
                                            </path>
                                        </g>
                                        <g>
                                            <rect x="50" y="210" width="100" height="40" rx="5" fill="#fff" stroke="#cbd5e1" />
                                            <text x="100" y="235" textAnchor="middle" fontSize="10">Doosan (-$1M)</text>
                                            <path d="M 150 230 Q 275 230 360 160" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowHead)">
                                                <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" fill="freeze" />
                                            </path>
                                        </g>

                                        {/* Right Side (Creditors) */}
                                        <g>
                                            <rect x="650" y="50" width="100" height="40" rx="5" fill="#fff" stroke="#cbd5e1" />
                                            <text x="700" y="75" textAnchor="middle" fontSize="10">LGES (+$3M)</text>
                                            <path d="M 440 140 Q 525 70 650 70" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowHead)">
                                                <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" begin="1s" fill="freeze" />
                                            </path>
                                        </g>
                                        <g>
                                            <rect x="650" y="210" width="100" height="40" rx="5" fill="#fff" stroke="#cbd5e1" />
                                            <text x="700" y="235" textAnchor="middle" fontSize="10">Samsung (+$2M)</text>
                                            <path d="M 440 160 Q 525 230 650 230" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowHead)">
                                                <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" begin="1s" fill="freeze" />
                                            </path>
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            {/* Net Positions Table */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-4">{language === 'KO' ? '순포지션 현황' : 'Net Positions'}</h4>
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-3">{language === 'KO' ? '참여 기업' : 'Participant'}</th>
                                                <th className="px-6 py-3 text-right">{language === 'KO' ? '총 지급액' : 'Gross Payables'}</th>
                                                <th className="px-6 py-3 text-right">{language === 'KO' ? '총 수취액' : 'Gross Receivables'}</th>
                                                <th className="px-6 py-3 text-right">{language === 'KO' ? '순포지션' : 'Net Position'}</th>
                                                <th className="px-6 py-3 text-center">{language === 'KO' ? '상태' : 'Status'}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {[
                                                { name: 'Hyundai Motor', pay: 5200000, recv: 200000, net: -5000000 },
                                                { name: 'LG Energy Sol', pay: 500000, recv: 3500000, net: 3000000 },
                                                { name: 'Samsung Elec', pay: 800000, recv: 2800000, net: 2000000 },
                                                { name: 'Doosan Robotics', pay: 1200000, recv: 200000, net: -1000000 },
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 font-bold text-slate-700">{row.name}</td>
                                                    <td className="px-6 py-4 text-right text-slate-500">${row.pay.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right text-slate-500">${row.recv.toLocaleString()}</td>
                                                    <td className={`px-6 py-4 text-right font-bold ${row.net > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {row.net > 0 ? '+' : ''}${row.net.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">{language === 'KO' ? '정산 완료' : 'Settled'}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                            <button className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-white flex items-center gap-2">
                                <Download className="w-4 h-4" /> {language === 'KO' ? 'CSV 내보내기' : 'Export CSV'}
                            </button>
                            <button onClick={() => setShowSettlementReport(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800">
                                {language === 'KO' ? '닫기' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Verification Detail Modal */}
            {selectedVerification && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
                        <div className="bg-amber-50 p-6 border-b border-amber-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-700"><ShieldAlert className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-amber-900">{language === 'KO' ? 'KYB 심사' : 'KYB Review'}</h3>
                                    <p className="text-xs text-amber-700">{language === 'KO' ? '요청 ID' : 'Request ID'}: {selectedVerification.id.toUpperCase()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedVerification(null)}><X className="w-5 h-5 text-amber-800/50 hover:text-amber-800" /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-500 font-bold text-lg">
                                    {selectedVerification.company.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{selectedVerification.company}</h4>
                                    <p className="text-sm text-slate-500">{selectedVerification.country} • {selectedVerification.bpn}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">{language === 'KO' ? '제출 서류' : 'Submitted Documents'}</h5>
                                <div className="space-y-2">
                                    {selectedVerification.docs.map((doc: string, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-500" /> {doc}
                                            </span>
                                            <button className="text-xs text-blue-600 font-bold hover:underline">{language === 'KO' ? '보기' : 'View'}</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={handleRejectRequest}
                                    className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
                                >
                                    {language === 'KO' ? '거부' : 'Reject'}
                                </button>
                                <button 
                                    onClick={handleIssueVC}
                                    disabled={isIssuingVC}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isIssuingVC ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                                    {isIssuingVC
                                        ? (language === 'KO' ? '발급 중...' : 'Issuing...')
                                        : (language === 'KO' ? '승인 및 VC 발급' : 'Approve & Issue VC')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2-B. VC Issuance Report Modal (Detailed) */}
            {showVCReport && issuedVCData && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp relative my-8">
                        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur">
                                    <Award className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{language === 'KO' ? '자격증명 발급 완료' : 'Credential Issued'}</h2>
                                    <p className="text-xs text-blue-200 font-mono">{language === 'KO' ? '식별자' : 'ID'}: {issuedVCData.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowVCReport(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <div className="p-10 space-y-10 flex flex-col items-center bg-slate-50 min-h-[500px]">
                            
                            {/* Animated Stamp Effect */}
                            <style>{`
                                @keyframes stampIn {
                                    0% { opacity: 0; transform: scale(3) rotate(-30deg); }
                                    100% { opacity: 1; transform: scale(1) rotate(-12deg); }
                                }
                            `}</style>

                            {/* VC Visual Card */}
                            <div className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl p-8 overflow-hidden">
                                {/* Watermark */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                    <BadgeCheck className="w-96 h-96 text-slate-900" />
                                </div>
                                
                                {/* Header */}
                                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-lg font-bold text-xl">IX</div>
                                        <div>
                                            <h3 className="font-serif text-2xl font-bold text-slate-900 tracking-wide">VERIFIABLE CREDENTIAL</h3>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest">Korea DataSpace Clearing House</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-slate-100 px-3 py-1 rounded text-xs font-mono font-bold text-slate-600 mb-1">
                                            TYPE: MembershipCredential
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <span className="text-xs text-slate-400 uppercase font-bold block mb-1">{language === 'KO' ? '발급자 (DID)' : 'Issuer (DID)'}</span>
                                            <span className="text-sm font-mono text-slate-800 break-all">{issuedVCData.issuer}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400 uppercase font-bold block mb-1">{language === 'KO' ? '발급 일시' : 'Issuance Date'}</span>
                                            <span className="text-sm font-mono text-slate-800">{new Date(issuedVCData.issuanceDate).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-bold block mb-2">{language === 'KO' ? '주체 클레임' : 'Subject Claim'}</span>
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold text-slate-700">{language === 'KO' ? '기업명' : 'Company Name'}</span>
                                                <span className="text-lg font-bold text-blue-900">{issuedVCData.subject}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-slate-700">BPN</span>
                                                <span className="text-sm font-mono text-slate-600">{issuedVCData.bpn}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-bold block mb-2">{language === 'KO' ? '전자 서명 (JWS)' : 'Digital Proof (JWS)'}</span>
                                        <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-3 rounded-lg break-all">
                                            {issuedVCData.proof.jws}
                                        </div>
                                    </div>
                                </div>

                                {/* STAMP ANIMATION */}
                                <div className="absolute bottom-8 right-8 z-20" style={{ animation: 'stampIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards', opacity: 0 }}>
                                    <div className="w-32 h-32 border-4 border-blue-800 rounded-full flex items-center justify-center p-1 opacity-90">
                                        <div className="w-full h-full border-2 border-blue-800 rounded-full flex flex-col items-center justify-center text-blue-800 font-bold uppercase text-xs tracking-widest bg-blue-800/5">
                                            <span>{language === 'KO' ? '클리어링' : 'Clearing'}</span>
                                            <span className="text-xl my-1">{language === 'KO' ? '검증완료' : 'VERIFIED'}</span>
                                            <span>{language === 'KO' ? '하우스' : 'House'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Blockchain Anchor Info */}
                            <div className="w-full max-w-2xl flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <LinkIcon className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{language === 'KO' ? '블록체인 앵커' : 'Blockchain Anchor'}</h4>
                                        <p className="text-xs text-emerald-600 font-medium">Block #14,552,001 • {language === 'KO' ? '확정됨' : 'Confirmed'}</p>
                                    </div>
                                </div>
                                <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">0x8f2a...c91e</span>
                            </div>

                        </div>

                        <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                            <button className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2">
                                <Download className="w-4 h-4" /> {language === 'KO' ? 'JSON-LD 다운로드' : 'Download JSON-LD'}
                            </button>
                            <button onClick={() => setShowVCReport(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                                {language === 'KO' ? '완료' : 'Done'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2-C. Rejection Report Modal */}
            {showRejectReport && rejectData && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleUp">
                        <div className="bg-red-600 text-white p-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Siren className="w-8 h-8 text-white" />
                                <div>
                                    <h2 className="text-xl font-bold">{language === 'KO' ? '검증 거부' : 'Verification Rejected'}</h2>
                                    <p className="text-xs text-red-100 opacity-90">{language === 'KO' ? '식별자' : 'ID'}: {rejectData.bpn}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowRejectReport(false)} className="p-2 hover:bg-red-700 rounded-full transition-colors">
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            {/* Rejection Stamp Visual */}
                            <div className="relative border-4 border-double border-slate-200 bg-slate-50 p-6 rounded-xl overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-red-600/30 text-red-600/30 font-black text-6xl rotate-[-20deg] px-8 py-2 rounded-xl pointer-events-none uppercase tracking-widest z-0">
                                    {language === 'KO' ? '거부됨' : 'Rejected'}
                                </div>
                                <div className="relative z-10 text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-slate-900">{rejectData.company}</h3>
                                    <p className="text-sm text-slate-500">{language === 'KO' ? '비즈니스 파트너 번호' : 'Business Partner Number'}: {rejectData.bpn}</p>
                                </div>
                            </div>

                            {/* Reason & Risk */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <h4 className="text-xs font-bold text-red-700 uppercase mb-2">{language === 'KO' ? '주요 사유' : 'Primary Reason'}</h4>
                                    <p className="text-lg font-bold text-red-900">{rejectData.reason}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{language === 'KO' ? '위험 점수' : 'Risk Score'}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 w-[85%]"></div>
                                        </div>
                                        <span className="text-lg font-bold text-red-600">{rejectData.riskScore}/100</span>
                                    </div>
                                    <p className="text-xs text-red-500 mt-1">{language === 'KO' ? '높은 위험 수준 감지' : 'High Risk Detected'}</p>
                                </div>
                            </div>

                            {/* Evidence List */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <FileWarning className="w-4 h-4" /> {language === 'KO' ? '증빙 및 조사 결과' : 'Evidence & Findings'}
                                </h4>
                                <ul className="space-y-2">
                                    {rejectData.evidence.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                            <button className="px-6 py-2 border border-slate-300 bg-white rounded-lg text-slate-600 font-bold hover:bg-slate-50">
                                {language === 'KO' ? '리포트 내보내기' : 'Export Report'}
                            </button>
                            <button onClick={() => setShowRejectReport(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800">
                                {language === 'KO' ? '닫기' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Transaction Invoice Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
                        <button onClick={() => setSelectedTransaction(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500 border border-slate-200 shadow-sm">
                                <Receipt className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{language === 'KO' ? '거래 영수증' : 'Transaction Receipt'}</h3>
                            <p className="text-xs text-slate-500 font-mono mb-6">{selectedTransaction.id}</p>

                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{language === 'KO' ? '자산' : 'Asset'}</span>
                                    <span className="font-bold text-slate-800">{selectedTransaction.asset}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{language === 'KO' ? '송신 기업' : 'From'}</span>
                                    <span className="font-medium text-slate-800">{selectedTransaction.from}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{language === 'KO' ? '수신 기업' : 'To'}</span>
                                    <span className="font-medium text-slate-800">{selectedTransaction.to}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                                    <span className="text-slate-500 font-bold">{language === 'KO' ? '총 금액' : 'Total Amount'}</span>
                                    <span className="font-bold text-emerald-600 text-lg">${selectedTransaction.amount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="text-xs text-slate-400 mb-6">
                                {language === 'KO' ? '처리 시각' : 'Timestamp'}: {selectedTransaction.date}<br/>
                                {language === 'KO' ? '상태' : 'Status'}: <span className="font-bold text-slate-600">{selectedTransaction.status}</span>
                            </div>

                            <button onClick={() => setSelectedTransaction(null)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                {language === 'KO' ? '영수증 닫기' : 'Close Receipt'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Company Profile Modal */}
            {selectedCompany && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
                        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                            <button onClick={() => setSelectedCompany(null)} className="absolute top-4 right-4 text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="px-8 pb-8 -mt-12 relative">
                            <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-slate-700 mb-4">
                                {selectedCompany.company.charAt(0)}
                            </div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedCompany.company}</h2>
                                    <p className="text-slate-500 text-sm">{selectedCompany.tier} • {selectedCompany.country}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs text-slate-400 font-bold uppercase">{language === 'KO' ? '신뢰 점수' : 'Trust Score'}</span>
                                    <span className="text-2xl font-bold text-emerald-600">{selectedCompany.trust}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> BPN</span>
                                    <span className="text-xs font-mono font-bold text-slate-800">{selectedCompany.bpn}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2"><Award className="w-4 h-4 text-purple-500" /> {language === 'KO' ? '인증일' : 'Certified'}</span>
                                    <span className="text-xs font-bold text-slate-800">{selectedCompany.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Scale className="w-8 h-8 text-blue-600" />
                    {t('ch_title')}
                </h1>
                <p className="text-slate-500 mt-2">{t('ch_subtitle')}</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors cursor-default group">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <BadgeCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">{t('ch_kpi_participants')}</p>
                        <h3 className="text-2xl font-bold text-slate-900">156</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-emerald-300 transition-colors cursor-default group">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">{t('ch_kpi_settlement')}</p>
                        <h3 className="text-2xl font-bold text-slate-900">$4.2M</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-purple-300 transition-colors cursor-default group">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">{t('ch_kpi_transactions')}</p>
                        <h3 className="text-2xl font-bold text-slate-900">12,450</h3>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="flex border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('IDENTITY')}
                        className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'IDENTITY' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <Users className="w-4 h-4" />
                        {t('ch_tab_identity')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('FINANCIAL')}
                        className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'FINANCIAL' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <RefreshCw className="w-4 h-4" />
                        {t('ch_tab_financial')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('SIMULATION')}
                        className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'SIMULATION' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <Play className="w-4 h-4" />
                        {t('ch_tab_simulation')}
                    </button>
                </div>

                <div className="p-6">
                    {/* IDENTITY TAB */}
                    {activeTab === 'IDENTITY' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                            {/* Left: Pending & List */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Pending Requests - Now Clickable */}
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                                        <ShieldAlert className="w-4 h-4" />
                                        {t('ch_pending_verifications')}
                                    </h3>
                                    <div className="space-y-2">
                                        {pendingVerifications.map(item => (
                                            <div 
                                                key={item.id} 
                                                onClick={() => setSelectedVerification(item)}
                                                className="flex items-center justify-between bg-white p-3 rounded-lg border border-amber-100 shadow-sm cursor-pointer hover:border-amber-300 hover:shadow-md transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-amber-100 group-hover:text-amber-700">
                                                        {item.company.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600">{item.company}</p>
                                                        <p className="text-xs text-slate-500">{item.bpn} • {item.country}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">{item.date}</span>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Verified List - Now Clickable */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-slate-900">{t('ch_verified_list')}</h3>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder={language === 'KO' ? 'BPN 검색...' : 'Search BPN...'} 
                                                className="pl-8 pr-3 py-1.5 rounded border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                            />
                                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3">{language === 'KO' ? '기업명' : 'Company'}</th>
                                                    <th className="px-4 py-3">BPN</th>
                                                    <th className="px-4 py-3">{language === 'KO' ? '국가' : 'Country'}</th>
                                                    <th className="px-4 py-3">{language === 'KO' ? '상태' : 'Status'}</th>
                                                    <th className="px-4 py-3 text-right">{language === 'KO' ? '작업' : 'Action'}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {verifiedCompanies.map(item => (
                                                    <tr 
                                                        key={item.id} 
                                                        onClick={() => setSelectedCompany(item)}
                                                        className="hover:bg-slate-50 cursor-pointer group"
                                                    >
                                                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                            {item.company}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{item.bpn}</td>
                                                        <td className="px-4 py-3 text-slate-500">{item.country}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                                                {language === 'KO' ? '검증 완료' : 'Verified'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">{language === 'KO' ? '프로필 보기' : 'View Profile'}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Demographics */}
                            <div>
                                <div className="bg-white border border-slate-200 rounded-xl p-6 h-full shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <PieIcon className="w-5 h-5 text-blue-600" />
                                        {language === 'KO' ? '참여 기업 분포' : 'Participant Demographics'}
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={countryStats}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {countryStats.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 p-4 bg-slate-50 rounded-lg text-xs text-slate-600 text-center">
                                        {language === 'KO' ? '총 156개 검증 기업' : 'Total of 156 Verified Companies'}<br/>{language === 'KO' ? '12개국 참여' : 'Across 12 Countries'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FINANCIAL TAB */}
                    {activeTab === 'FINANCIAL' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                            
                            {/* Left: Actions & History */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
                                    <div>
                                        <h3 className="font-bold text-blue-900 mb-1">{language === 'KO' ? '청산 기간: 2024년 5월' : 'Clearing Period: May 2024'}</h3>
                                        <p className="text-xs text-blue-600">{language === 'KO' ? '다음 정산 주기까지 5일 남았습니다.' : 'Next settlement cycle runs in 5 days.'}</p>
                                    </div>
                                    <button 
                                        onClick={runBatchProcessing}
                                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 text-sm flex items-center gap-2 transition-transform hover:scale-105"
                                    >
                                        <RefreshCw className="w-4 h-4" /> {language === 'KO' ? '청산 배치 실행' : 'Run Clearing Batch'}
                                    </button>
                                </div>

                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3">{language === 'KO' ? '거래 ID' : 'Tx ID'}</th>
                                                <th className="px-4 py-3">{language === 'KO' ? '송신 기업' : 'From'}</th>
                                                <th className="px-4 py-3">{language === 'KO' ? '수신 기업' : 'To'}</th>
                                                <th className="px-4 py-3">{language === 'KO' ? '자산' : 'Asset'}</th>
                                                <th className="px-4 py-3 text-right">{language === 'KO' ? '금액' : 'Amount'}</th>
                                                <th className="px-4 py-3 text-center">{language === 'KO' ? '상태' : 'Status'}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {settlements.map(tx => (
                                                <tr 
                                                    key={tx.id} 
                                                    onClick={() => setSelectedTransaction(tx)}
                                                    className="hover:bg-slate-50 cursor-pointer group transition-colors"
                                                >
                                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{tx.id}</td>
                                                    <td className="px-4 py-3 text-slate-900 font-medium">{tx.from}</td>
                                                    <td className="px-4 py-3 text-slate-900 font-medium">{tx.to}</td>
                                                    <td className="px-4 py-3 text-slate-500">{tx.asset}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-700">
                                                        ${tx.amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {tx.status === 'CLEARED' ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                                                {language === 'KO' ? '청산 완료' : 'Cleared'}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                                                {language === 'KO' ? '대기 중' : 'Pending'}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
                                        {language === 'KO' ? '행을 클릭하면 거래 명세를 확인할 수 있습니다' : 'Click rows to view invoice details'}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Charts */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                    {language === 'KO' ? '월별 정산 규모' : 'Monthly Settlement Volume'}
                                </h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={financialTrend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" fontSize={12} />
                                            <YAxis fontSize={12} tickFormatter={(val) => `$${val}`} />
                                            <Tooltip formatter={(value) => `$${value}`} />
                                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-xs text-emerald-800 border border-emerald-100">
                                    <strong>{language === 'KO' ? '추이' : 'Trend'}:</strong> {language === 'KO' ? '전월 대비 거래액이 12% 증가했습니다.' : '+12% increase in transaction volume compared to last month.'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SIMULATION TAB */}
                    {activeTab === 'SIMULATION' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                            {/* Left: Input & Controls */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-emerald-600" />
                                        {t('ch_sim_title')}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-6">
                                        {t('ch_sim_desc')}
                                    </p>

                                    <div className="space-y-4">
                                        {/* Scenario Selector */}
                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{language === 'KO' ? '시뮬레이션 시나리오' : 'Simulation Scenario'}</label>
                                            <div className="flex flex-col gap-2">
                                                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-50 rounded transition-colors">
                                                    <input 
                                                        type="radio" 
                                                        name="scenario" 
                                                        checked={simScenario === 'SUCCESS'} 
                                                        onChange={() => setSimScenario('SUCCESS')}
                                                        disabled={simState === 'RUNNING'}
                                                        className="text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <span className="text-sm text-slate-700 font-medium">{t('ch_sim_scen_success')}</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-50 rounded transition-colors">
                                                    <input 
                                                        type="radio" 
                                                        name="scenario" 
                                                        checked={simScenario === 'FAIL_REGISTRY'} 
                                                        onChange={() => setSimScenario('FAIL_REGISTRY')}
                                                        disabled={simState === 'RUNNING'}
                                                        className="text-red-600 focus:ring-red-500"
                                                    />
                                                    <span className="text-sm text-slate-700">{t('ch_sim_scen_fail_reg')}</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-50 rounded transition-colors">
                                                    <input 
                                                        type="radio" 
                                                        name="scenario" 
                                                        checked={simScenario === 'FAIL_COMPLIANCE'} 
                                                        onChange={() => setSimScenario('FAIL_COMPLIANCE')}
                                                        disabled={simState === 'RUNNING'}
                                                        className="text-orange-600 focus:ring-orange-500"
                                                    />
                                                    <span className="text-sm text-slate-700">{t('ch_sim_scen_fail_comp')}</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('ch_sim_company')}</label>
                                            <input 
                                                type="text" 
                                                value={mockRequest.companyName}
                                                onChange={(e) => setMockRequest({...mockRequest, companyName: e.target.value})}
                                                disabled={simState === 'RUNNING'}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'KO' ? '등록번호' : 'Reg Number'}</label>
                                                <input 
                                                    type="text" 
                                                    value={mockRequest.regNumber}
                                                    onChange={(e) => setMockRequest({...mockRequest, regNumber: e.target.value})}
                                                    disabled={simState === 'RUNNING'}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'KO' ? '국가' : 'Country'}</label>
                                                <input 
                                                    type="text" 
                                                    value={mockRequest.country}
                                                    onChange={(e) => setMockRequest({...mockRequest, country: e.target.value})}
                                                    disabled={simState === 'RUNNING'}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-8">
                                        {simState === 'COMPLETE' ? (
                                            <button 
                                                onClick={() => setShowSimReport(true)}
                                                className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                            >
                                                <FileText className="w-4 h-4 fill-current" />
                                                {language === 'KO' ? '리포트 보기' : 'View Report'}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={runSimulation}
                                                disabled={simState === 'RUNNING'}
                                                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                            >
                                                <Play className="w-4 h-4 fill-current" />
                                                {simState === 'RUNNING' ? (language === 'KO' ? '실행 중...' : 'Running...') : t('ch_sim_start')}
                                            </button>
                                        )}
                                        <button 
                                            onClick={resetSimulation}
                                            disabled={simState === 'RUNNING'}
                                            className="px-4 py-3 border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold rounded-lg transition-colors"
                                        >
                                            {t('ch_sim_reset')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Visualization & Logs */}
                            <div className="space-y-6">
                                {/* Visual Stepper */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-wider">{language === 'KO' ? '프로세스 시각화' : 'Process Visualizer'}</h3>
                                    <div className="relative space-y-6">
                                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                                        
                                        {[
                                            { step: 1, label: t('ch_sim_step_1'), icon: Globe },
                                            { step: 2, label: t('ch_sim_step_2'), icon: ShieldAlert },
                                            { step: 3, label: t('ch_sim_step_3'), icon: BadgeCheck },
                                            { step: 4, label: t('ch_sim_step_4'), icon: Server },
                                        ].map((item) => {
                                            const isActive = currentStep === item.step;
                                            const isCompleted = currentStep > item.step;
                                            
                                            return (
                                                <div key={item.step} className={`relative flex items-center gap-4 transition-all duration-300 ${isActive ? 'scale-105' : 'opacity-80'}`}>
                                                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ${
                                                        isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                        isActive ? 'bg-white border-blue-500 text-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' :
                                                        'bg-white border-slate-200 text-slate-300'
                                                    }`}>
                                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
                                                    </div>
                                                    <div className={`flex-1 transition-all ${isActive ? 'translate-x-1' : ''}`}>
                                                        <span className={`text-sm font-bold block ${
                                                            isCompleted || isActive ? 'text-slate-900' : 'text-slate-400'
                                                        }`}>
                                                            {item.label}
                                                        </span>
                                                        {isActive && simState === 'RUNNING' && (
                                                            <span className="text-xs text-blue-500 animate-pulse">{language === 'KO' ? '처리 중...' : 'Processing...'}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Terminal Logs */}
                                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg flex flex-col h-64 font-mono text-xs">
                                    <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                                        <span className="text-slate-300 font-bold flex items-center gap-2">
                                            <Terminal className="w-3 h-3 text-emerald-500" />
                                            {t('ch_sim_logs')}
                                        </span>
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                        <div className="text-slate-500 mb-2">{'>'} Clearing House Node Initialized...</div>
                                        {simLogs.length === 0 && simState === 'IDLE' && (
                                            <div className="text-slate-600 italic">{language === 'KO' ? '시뮬레이션 시작을 기다리는 중...' : 'Waiting for simulation start...'}</div>
                                        )}
                                        {simLogs.map((log, idx) => (
                                            <div key={idx} className="flex gap-2 animate-fadeIn">
                                                <span className="text-slate-500 flex-shrink-0">[{log.time}]</span>
                                                <span className={`${
                                                    log.type === 'success' ? 'text-emerald-400 font-bold' : 
                                                    log.type === 'error' ? 'text-red-400 font-bold' : 'text-slate-200'
                                                }`}>
                                                    {log.msg}
                                                </span>
                                            </div>
                                        ))}
                                        <div ref={logsEndRef} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClearingHouse;
  