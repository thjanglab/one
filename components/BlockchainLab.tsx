
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ASSETS, CURRENT_USER } from '../constants';
import { Block, BlockchainTx, Asset } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Box, ShieldCheck, Database, Terminal, Cpu, Play, CheckCircle2, Lock, Link as LinkIcon, RefreshCw, Layers, AlertCircle, XCircle, Settings2, UserCheck, ThumbsUp, ThumbsDown, AlertTriangle, Wallet, X, FileText, Share2, Printer, Check, ArrowRight, Info, BookOpen, Key } from 'lucide-react';

// Mock Hash Function
const sha256 = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

type LogType = 'info' | 'success' | 'error' | 'warning';
interface LogMessage {
    timestamp: string;
    message: string;
    type: LogType;
}

type Scenario = 'NORMAL' | 'REJECT_FUNDS' | 'REJECT_POLICY' | 'MANUAL_REVIEW' | 'MANUAL_REVIEW_FAIL';

// Report Data Structure
interface ReportData {
    status: 'SUCCESS' | 'FAILURE';
    txId: string;
    timestamp: string;
    asset: Asset;
    gasUsed?: string;
    blockIndex?: number;
    blockHash?: string;
    failureReason?: string;
    failureStage?: 'POLICY' | 'WALLET' | 'CONSENSUS'; // For Infographic
}

// Educational Content for Lecture Notes (Korean)
const BLOCKCHAIN_EDU = {
    0: {
        title: "블록체인 & 스마트 컨트랙트",
        concept: "분산 원장 기술 (DLT)",
        analogy: "누구나 읽을 수 있지만, 아무도 지울 수 없는 공유된 디지털 공책입니다.",
        lecture: `데이터스페이스에서 블록체인은 '신뢰 계층(Trust Layer)' 역할을 합니다.
중앙 은행이나 중개자 없이 네트워크 노드들에 의해 모든 거래(스마트 컨트랙트)가 검증됩니다.
주요 특징:
1. 투명성: 모두가 동일한 기록을 봅니다.
2. 불변성: 한 번 기록된 데이터는 변경할 수 없습니다.
3. 자동화: 조건이 충족되면 스마트 컨트랙트가 자동으로 실행됩니다.`,
        techStack: "Hyperledger Besu / Ethereum (EVM)"
    },
    1: {
        title: "1단계: 스마트 컨트랙트 정책 검사",
        concept: "ODRL 정책 시행",
        analogy: "입장하기 전에 표를 검사하는 자동 개찰구와 같습니다.",
        lecture: `결제가 이루어지기 전에 스마트 컨트랙트는 ODRL(Open Digital Rights Language)로 정의된 '사용 정책'을 확인합니다.
다음을 검증합니다:
- 구매자는 누구인가? (신원)
- 어디에 있는가? (지역)
- 목적은 무엇인가? (사용 제약)
조건이 맞지 않으면 트랜잭션은 즉시 취소(Revert)되어 가스비를 절약합니다.`,
        techStack: "Solidity, ODRL Interpreter"
    },
    2: {
        title: "2단계: 전자 서명 & 잔액 확인",
        concept: "공개키 암호화",
        analogy: "나만 가지고 있는 도장으로 수표에 서명하여 본인임을 증명하는 것과 같습니다.",
        lecture: `사용자는 개인키(Private Key)를 사용하여 트랜잭션 페이로드에 서명합니다.
네트워크는 사용자의 공개키(Public Key)로 서명을 검증하여 '부인 방지(Non-repudiation, 보낸 사실을 부인할 수 없음)'를 보장합니다.
동시에 원장은 지갑에 충분한 잔액(토큰 + 가스비)이 있는지 확인합니다.`,
        techStack: "ECDSA (Elliptic Curve), ERC-20 Tokens"
    },
    3: {
        title: "3단계: 합의 & 마이닝",
        concept: "IBFT 2.0 (권위 증명)",
        analogy: "공식 기록을 승인하기 위해 투표하는 신뢰할 수 있는 판사 위원회와 같습니다.",
        lecture: `산업용 블록체인에서는 작업 증명(채굴) 대신 권위 증명(PoA)을 주로 사용합니다.
선출된 '검증자 노드(Validator Node)'가 유효한 트랜잭션을 수집하여 '블록'으로 만들고 전파합니다.
다른 노드들이 이를 검증하고, 66% 이상이 동의하면 블록체인에 추가되어 빠른 확정성을 보장합니다.`,
        techStack: "Consensus Algorithms, P2P Gossip Protocol"
    },
    4: {
        title: "4단계: 확정 & 상태 업데이트",
        concept: "상태 전이 (State Transition)",
        analogy: "마스터 장부에 지워지지 않는 잉크로 최종 거래를 기록하는 것입니다.",
        lecture: `블록은 암호화 방식으로 이전 블록과 연결(부모 해시)되어 체인을 형성합니다.
'전역 상태(Global State)'가 업데이트됩니다:
- 구매자의 잔액 감소
- 판매자의 잔액 증가
- 자산 소유권/접근 권한 이전
이 기록은 이제 영구적이며 위변조가 불가능합니다.`,
        techStack: "Merkle Patricia Trie, LevelDB"
    }
};

const BlockchainLab: React.FC = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedAsset, setSelectedAsset] = useState(MOCK_ASSETS[0].id);
    const [scenario, setScenario] = useState<Scenario>('NORMAL');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationStatus, setSimulationStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [currentStep, setCurrentStep] = useState(0); // 0: Idle, 1: Policy, 2: Sign, 3: Mining, 4: Done
    
    // UI Tabs for Bottom Panel
    const [activeTab, setActiveTab] = useState<'CONSOLE' | 'LECTURE'>('CONSOLE');

    // Manual Review State
    const [waitingForApproval, setWaitingForApproval] = useState(false);
    const [pendingData, setPendingData] = useState<{ txId: string; asset: Asset; signature: string } | null>(null);

    // Report State
    const [reportData, setReportData] = useState<ReportData | null>(null);

    // Wallet Balance (Sync with LocalStorage)
    const [walletBalance, setWalletBalance] = useState(() => {
        const saved = localStorage.getItem('korea_wallet_balance');
        return saved ? parseInt(saved) : 124500;
    });

    const logsEndRef = useRef<HTMLDivElement>(null);

    // Initial Genesis Block
    useEffect(() => {
        const createGenesis = async () => {
            const genesisBlock: Block = {
                index: 0,
                timestamp: new Date().toISOString(),
                prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
                hash: await sha256("Genesis Block"),
                transactions: [],
                validator: "KOREA_GENESIS_NODE",
                nonce: 0
            };
            setBlocks([genesisBlock]);
        };
        createGenesis();
    }, []);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs, activeTab]);

    const addLog = (message: string, type: LogType = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { timestamp, message, type }]);
    };

    const startSimulation = async () => {
        if (isSimulating) return;
        
        setIsSimulating(true);
        setSimulationStatus('PROCESSING');
        setWaitingForApproval(false);
        setReportData(null);
        setPendingData(null);
        setCurrentStep(1);
        setActiveTab('LECTURE'); // Auto-switch to lecture mode for education
        setLogs([]); // Clear previous logs
        
        const asset = MOCK_ASSETS.find(a => a.id === selectedAsset)!;
        const txId = `tx_${Math.random().toString(36).substr(2, 9)}`;

        try {
            // --- Step 1: Smart Contract / Policy Check ---
            addLog("INITIATING SMART CONTRACT (SC_DataTrade_v2)...", 'info');
            await new Promise(r => setTimeout(r, 1500)); // Increased delay for reading time
            addLog(`Loading Asset Metadata: ${asset.title}`, 'info');
            addLog(`Checking ODRL Policy: { target: "${asset.id}", action: "use" }`, 'warning');
            
            await new Promise(r => setTimeout(r, 1500));

            // SCENARIO: POLICY REJECTION
            if (scenario === 'REJECT_POLICY') {
                throw { 
                    message: "ODRL Policy Violation: Buyer region 'KR' not in allowed list ['EU', 'US'].", 
                    stage: 'POLICY' 
                };
            }

            addLog("Policy Validation: PASSED ✅", 'success');
            
            // --- Step 2: Signing & Fund Check ---
            setCurrentStep(2);
            await new Promise(r => setTimeout(r, 1500));
            addLog(`Wallet: ${CURRENT_USER.walletAddress} verifying balance...`, 'info');
            
            // SCENARIO: INSUFFICIENT FUNDS (Immediate Rejection)
            if (scenario === 'REJECT_FUNDS') {
                addLog(`Required: ${asset.price} ${asset.currency} | Available: 50.00 USD`, 'warning'); // Fake low balance
                await new Promise(r => setTimeout(r, 1000));
                throw { 
                    message: `Insufficient Funds: Wallet balance (50.00) < Required (${asset.price}).`, 
                    stage: 'WALLET' 
                };
            } else {
                 addLog(`Required: ${asset.price} ${asset.currency} | Available: ${walletBalance.toLocaleString()} ${asset.currency}`, 'info');
            }

            const payload = `${txId}:${CURRENT_USER.id}:${asset.provider}:${asset.price}`;
            const signature = await sha256(payload); 
            addLog(`Signature Generated: 0x${signature.substring(0, 30)}...`, 'success');
            
            // SCENARIO: MANUAL REVIEW (Both Success and Fail types pause here)
            if (scenario === 'MANUAL_REVIEW' || scenario === 'MANUAL_REVIEW_FAIL') {
                addLog("⚠️ SUSPENDED: Manual Approval Required by Governance Policy.", 'warning');
                setPendingData({ txId, asset, signature });
                setWaitingForApproval(true);
                return; // Pause here, wait for user action
            }

            addLog("Transaction Broadcasted to Mempool 📡", 'info');
            await finalizeSimulation(txId, asset, signature);

        } catch (error: any) {
            handleError(error, txId, asset);
        }
    };

    const finalizeSimulation = async (txId: string, asset: Asset, signature: string) => {
        try {
            // --- Step 3: Mining / Consensus ---
            setCurrentStep(3);
            await new Promise(r => setTimeout(r, 2000));
            addLog("Consensus Mechanism: IBFT 2.0 (Authority)", 'info');
            addLog("Validator Node [Node-03] selected.", 'info');
            addLog("Packing transaction into Block Candidate...", 'warning');

            // Create Transaction Object
            const newTx: BlockchainTx = {
                id: txId,
                from: CURRENT_USER.id,
                to: asset.provider,
                assetId: asset.id,
                amount: asset.price,
                signature: signature,
                status: 'COMMITTED'
            };

            // Mine Block
            const prevBlock = blocks[blocks.length - 1];
            const newIndex = prevBlock.index + 1;
            const timestamp = new Date().toISOString();
            const nonce = Math.floor(Math.random() * 10000);
            const blockData = `${newIndex}${prevBlock.hash}${timestamp}${JSON.stringify([newTx])}${nonce}`;
            const newHash = await sha256(blockData);

            await new Promise(r => setTimeout(r, 2000));
            addLog(`Block #${newIndex} Mined! ⛏️`, 'success');
            addLog(`Hash: ${newHash}`, 'info');

            const newBlock: Block = {
                index: newIndex,
                timestamp,
                prevHash: prevBlock.hash,
                hash: newHash,
                transactions: [newTx],
                validator: "Node-03",
                nonce
            };

            setBlocks(prev => [...prev, newBlock]);
            
            // --- Step 4: Done ---
            setCurrentStep(4);
            addLog("Transaction Finalized on Ledger. 🔗", 'success');
            setSimulationStatus('SUCCESS');
            
            // Show Success Report
            setReportData({
                status: 'SUCCESS',
                txId,
                timestamp,
                asset,
                blockIndex: newIndex,
                blockHash: newHash,
                gasUsed: "0.0042 ETH"
            });
            
            // Update local balance simulation
            setWalletBalance(prev => {
                const newBal = prev - asset.price;
                localStorage.setItem('korea_wallet_balance', newBal.toString());
                return newBal;
            });
        } catch (error: any) {
            handleError(error, txId, asset);
        } finally {
            setIsSimulating(false);
            setWaitingForApproval(false);
            setPendingData(null);
        }
    };

    const handleError = (error: any, txId: string, asset: Asset) => {
        addLog(`❌ ABORTED: ${error.message || error}`, 'error');
        setSimulationStatus('ERROR');
        setIsSimulating(false);
        setWaitingForApproval(false);
        
        // Show Failure Report
        setReportData({
            status: 'FAILURE',
            txId,
            timestamp: new Date().toISOString(),
            asset,
            failureReason: error.message || "Unknown Error",
            failureStage: error.stage || "CONSENSUS"
        });
    };

    const handleManualApprove = async (simulateLowFunds: boolean = false) => {
        if (!pendingData) return;
        
        addLog("✅ USER INTERVENTION: Transaction Approved.", 'success');
        setWaitingForApproval(false);

        // SCENARIO: MANUAL REVIEW FAIL (Insufficient funds after approval)
        if (scenario === 'MANUAL_REVIEW_FAIL' || simulateLowFunds) {
            addLog("Resuming transaction broadcast...", 'info');
            
            // Proceed to Step 3 visually
            await new Promise(r => setTimeout(r, 1000));
            setCurrentStep(3);
            addLog("Consensus: Verifying State Trie...", 'info');
            
            await new Promise(r => setTimeout(r, 800));
            addLog(`⚠️ ERR: Sender balance too low for value + gas`, 'warning');
            
            handleError({ message: "EVM Reverted: Insufficient Balance during execution.", stage: "WALLET" }, pendingData.txId, pendingData.asset);
            return;
        }

        addLog("Resuming transaction broadcast...", 'info');
        await finalizeSimulation(pendingData.txId, pendingData.asset, pendingData.signature);
    };

    const handleManualReject = () => {
        addLog("⛔ USER INTERVENTION: Transaction Rejected.", 'error');
        if (pendingData) {
            handleError({ message: "Transaction rejected by Governance Operator.", stage: "CONSENSUS" }, pendingData.txId, pendingData.asset);
        }
        setPendingData(null);
    };

    const handleGoToRecharge = () => {
        navigate('/dashboard');
    };

    // --- INFOGRAPHIC COMPONENT ---
    const TxInfographic: React.FC<{ status: 'SUCCESS' | 'FAILURE', failureStage?: string }> = ({ status, failureStage }) => {
        const steps = [
            { id: 'POLICY', label: 'Policy Check', icon: ShieldCheck },
            { id: 'WALLET', label: 'Wallet Sign', icon: Wallet },
            { id: 'CONSENSUS', label: 'Consensus', icon: Database },
            { id: 'BLOCK', label: 'On-Chain', icon: Box },
        ];

        let failedIndex = -1;
        if (status === 'FAILURE' && failureStage) {
            failedIndex = steps.findIndex(s => s.id === failureStage);
        }

        return (
            <div className="w-full py-6 px-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between relative">
                    {/* Connecting Line Background */}
                    <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                    
                    {/* Active Line */}
                    <div 
                        className={`absolute top-1/2 left-6 h-1 -translate-y-1/2 z-0 transition-all duration-1000 ${status === 'SUCCESS' ? 'bg-emerald-500 w-[85%]' : 'bg-red-500'}`}
                        style={{ width: status === 'FAILURE' && failedIndex !== -1 ? `${(failedIndex / (steps.length - 1)) * 100}%` : undefined }}
                    ></div>

                    {steps.map((step, idx) => {
                        let nodeStatus = 'pending'; // pending, success, error
                        if (status === 'SUCCESS') {
                            nodeStatus = 'success';
                        } else {
                            if (idx < failedIndex) nodeStatus = 'success';
                            else if (idx === failedIndex) nodeStatus = 'error';
                            else nodeStatus = 'pending';
                        }

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 transform ${
                                    nodeStatus === 'success' ? 'bg-emerald-500 border-emerald-200 text-white scale-110' :
                                    nodeStatus === 'error' ? 'bg-red-500 border-red-200 text-white shadow-lg shadow-red-200 scale-125' :
                                    'bg-white border-slate-200 text-slate-300'
                                }`}>
                                    {nodeStatus === 'error' ? <X className="w-6 h-6" /> : 
                                     nodeStatus === 'success' ? <Check className="w-6 h-6" /> : 
                                     <step.icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-[10px] font-bold mt-3 uppercase tracking-wide ${
                                    nodeStatus === 'error' ? 'text-red-600' : 
                                    nodeStatus === 'success' ? 'text-emerald-600' : 'text-slate-400'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <LinkIcon className="w-8 h-8 text-blue-600" />
                    {t('bl_title')}
                </h1>
                <p className="text-slate-500 mt-2">{t('bl_subtitle')}</p>
            </div>

            {/* --- UNIFIED REPORT MODAL (SUCCESS & FAILURE) --- */}
            {reportData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp relative">
                        {/* Header */}
                        <div className={`${reportData.status === 'SUCCESS' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-red-600 to-orange-600'} p-6 text-center text-white relative overflow-hidden`}>
                            {/* Decorative Background Pattern */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-10" 
                                style={{backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px'}}>
                            </div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-2 border-white/30 shadow-inner animate-bounce">
                                    {reportData.status === 'SUCCESS' ? <CheckCircle2 className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
                                </div>
                                <h3 className="text-2xl font-bold">
                                    {reportData.status === 'SUCCESS' ? 'Transaction Confirmed' : 'Transaction Failed'}
                                </h3>
                                <p className="text-white/80 text-xs mt-1 font-mono">
                                    {reportData.status === 'SUCCESS' ? `Block #${reportData.blockIndex} • Confirmed` : 'Reverted by EVM'}
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => setReportData(null)}
                                className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {/* Infographic */}
                            <TxInfographic status={reportData.status} failureStage={reportData.failureStage} />

                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">{language === 'KO' ? '대상 자산' : 'Target Asset'}</p>
                                <h4 className="text-lg font-bold text-slate-900">{reportData.asset.title}</h4>
                                <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded mt-1 border border-blue-100">
                                    {reportData.asset.type.replace('_', ' ')}
                                </span>
                            </div>

                            {reportData.status === 'SUCCESS' ? (
                                <div className="space-y-4">
                                    {/* Block Visual */}
                                    <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden shadow-inner">
                                        <div className="absolute top-0 right-0 p-2 opacity-10"><Box className="w-12 h-12 text-white" /></div>
                                        <div className="grid grid-cols-2 gap-4 relative z-10">
                                            <div>
                                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Block Hash</span>
                                                <span className="font-mono text-[10px] text-emerald-400 break-all leading-tight block">{reportData.blockHash}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Gas Used</span>
                                                <span className="font-mono text-sm text-yellow-400 font-bold">{reportData.gasUsed}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Receipt Details */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Amount Paid</span>
                                            <span className="font-bold text-slate-900">{reportData.asset.price.toLocaleString()} {reportData.asset.currency}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Tx Hash</span>
                                            <span className="font-mono text-xs text-blue-600 truncate max-w-[150px]">{reportData.txId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Timestamp</span>
                                            <span className="text-slate-700 text-xs">{new Date(reportData.timestamp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 rounded-xl p-4 border border-red-100 space-y-3 text-sm">
                                    <div className="flex justify-between items-start">
                                        <span className="text-red-700 font-medium">Error Code</span>
                                        <span className="font-mono font-bold text-red-900">EVM_REVERT_0x52</span>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-red-100">
                                        <span className="text-xs text-slate-400 block uppercase font-bold mb-1">Reason</span>
                                        <p className="text-red-600 font-medium leading-snug">{reportData.failureReason}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-red-700 mt-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>
                                            {language === 'KO' 
                                                ? '자산 구매 비용은 차감되지 않았습니다 (검증 수수료 제외).' 
                                                : 'No funds were deducted (Verification Fee only).'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                {reportData.status === 'SUCCESS' ? (
                                    <>
                                        <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                            <Share2 className="w-4 h-4" /> Share
                                        </button>
                                        <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                            <Printer className="w-4 h-4" /> Receipt
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={handleGoToRecharge}
                                        className="w-full py-3 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Wallet className="w-4 h-4" /> Check Wallet Balance
                                    </button>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => setReportData(null)}
                                className={`w-full py-3 text-white font-bold rounded-xl transition-colors shadow-lg ${reportData.status === 'SUCCESS' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {t('c_close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Simulator Controls */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Control Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                        
                        {/* Waiting for Approval Overlay */}
                        {waitingForApproval && (
                            <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                                    <UserCheck className="w-8 h-8 text-yellow-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('bl_manual_review_req')}</h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    Asset: <span className="font-semibold text-slate-700">{pendingData?.asset.title}</span><br/>
                                    Amount: <span className="font-semibold text-slate-700">{pendingData?.asset.price.toLocaleString()} {pendingData?.asset.currency}</span>
                                </p>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex gap-3 w-full">
                                        <button 
                                            onClick={handleManualReject}
                                            className="flex-1 py-3 px-4 rounded-lg border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                            {t('bl_reject')}
                                        </button>
                                        <button 
                                            onClick={() => handleManualApprove(false)}
                                            className="flex-1 py-3 px-4 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            {t('bl_approve')}
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleManualApprove(true)}
                                        className="w-full py-2 px-4 rounded-lg border-2 border-red-100 bg-red-50 text-red-600 font-semibold hover:bg-red-100 hover:border-red-200 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {t('bl_approve_low_funds')}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-blue-600" />
                                {t('bl_tx_simulator')}
                            </h2>
                            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                                Balance: ${walletBalance.toLocaleString()}
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                                    {t('bl_select_asset')}
                                </label>
                                <select 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedAsset}
                                    onChange={(e) => setSelectedAsset(e.target.value)}
                                    disabled={isSimulating}
                                >
                                    {MOCK_ASSETS.map(asset => (
                                        <option key={asset.id} value={asset.id}>
                                            {asset.title} ({asset.price} {asset.currency})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Scenario Selection */}
                            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                                <label className="block text-xs font-bold text-indigo-800 uppercase mb-2 flex items-center gap-1">
                                    <Settings2 className="w-3 h-3" />
                                    {t('bl_scenario')}
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="scenario" 
                                            checked={scenario === 'NORMAL'} 
                                            onChange={() => setScenario('NORMAL')}
                                            disabled={isSimulating}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-slate-700">{t('bl_scen_normal')}</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="scenario" 
                                            checked={scenario === 'REJECT_FUNDS'} 
                                            onChange={() => setScenario('REJECT_FUNDS')}
                                            disabled={isSimulating}
                                            className="text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm text-slate-700">{t('bl_scen_funds')}</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="scenario" 
                                            checked={scenario === 'REJECT_POLICY'} 
                                            onChange={() => setScenario('REJECT_POLICY')}
                                            disabled={isSimulating}
                                            className="text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-slate-700">{t('bl_scen_policy')}</span>
                                    </label>
                                    <div className="my-1 border-t border-indigo-100"></div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="scenario" 
                                            checked={scenario === 'MANUAL_REVIEW'} 
                                            onChange={() => setScenario('MANUAL_REVIEW')}
                                            disabled={isSimulating}
                                            className="text-yellow-600 focus:ring-yellow-500"
                                        />
                                        <span className="text-sm text-slate-700 flex items-center gap-1">
                                            {t('bl_scen_manual')}
                                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={startSimulation}
                                disabled={isSimulating}
                                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                                    isSimulating 
                                    ? 'bg-slate-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-200'
                                }`}
                            >
                                {isSimulating && !waitingForApproval ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        {t('bl_processing')}
                                    </>
                                ) : waitingForApproval ? (
                                    <>
                                        <UserCheck className="w-5 h-5 animate-pulse" />
                                        {t('bl_waiting')}
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 fill-current" />
                                        {t('bl_exec_contract')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Progress Visualizer */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
                            {t('bl_consensus_flow')}
                        </h2>
                        <div className="relative space-y-6 pl-4">
                            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                            
                            {[
                                { step: 1, label: 'Smart Contract Policy Check', icon: ShieldCheck },
                                { step: 2, label: 'Wallet Balance & Signature', icon: Lock },
                                { step: 3, label: 'Mining & Validation', icon: Pick },
                                { step: 4, label: 'Committed to Ledger', icon: Database },
                            ].map((item) => {
                                // Logic for step visuals
                                let statusClass = 'bg-white border-slate-200 text-slate-300';
                                let icon = <item.icon className="w-5 h-5" />;

                                if (simulationStatus === 'ERROR' && currentStep === item.step) {
                                    statusClass = 'bg-red-500 border-red-500 text-white shadow-md shadow-red-200';
                                    icon = <XCircle className="w-5 h-5" />;
                                } else if (currentStep > item.step || (currentStep === item.step && simulationStatus === 'SUCCESS')) {
                                    statusClass = 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200';
                                    icon = <CheckCircle2 className="w-5 h-5" />;
                                } else if (currentStep === item.step) {
                                    if (waitingForApproval) {
                                        statusClass = 'bg-yellow-100 border-yellow-400 text-yellow-600 animate-pulse';
                                        icon = <UserCheck className="w-5 h-5" />;
                                    } else if (isSimulating) {
                                        statusClass = 'bg-white border-blue-500 text-blue-500 animate-pulse';
                                    }
                                }

                                return (
                                    <div key={item.step} className="relative flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${statusClass}`}>
                                            {icon}
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${
                                            currentStep >= item.step ? 'text-slate-900' : 'text-slate-400'
                                        }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Center & Right: Blockchain Visualization & Logs */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Visual Chain */}
                    <div className="bg-slate-900 rounded-xl p-6 shadow-xl overflow-x-auto">
                        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-400" />
                            {t('bl_live_ledger')}
                        </h2>
                        <div className="flex items-start gap-4 pb-4 min-w-full">
                            {blocks.map((block) => (
                                <div key={block.index} className="flex items-center">
                                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 w-64 flex-shrink-0 hover:border-blue-500 transition-colors group relative">
                                        
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-60 bg-slate-950/95 backdrop-blur border border-slate-600 text-white text-xs p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 translate-y-2 group-hover:translate-y-0">
                                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                                                <span className="font-bold text-emerald-400 flex items-center gap-1">
                                                    <Box className="w-3 h-3" /> Block Info
                                                </span>
                                                <span className="text-[10px] text-slate-500">{new Date(block.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded">
                                                    <span className="text-slate-400">Transactions</span>
                                                    <span className="font-mono font-bold text-blue-300">{block.transactions.length}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-400">Validator</span>
                                                    <span className="font-mono text-[10px] text-slate-300 bg-slate-800 px-1 rounded">{block.validator}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-400">Gas Used</span>
                                                    <span className="font-mono text-[10px] text-slate-300">21,000 Gwei</span>
                                                </div>
                                                <div className="pt-1">
                                                    <span className="text-[10px] text-slate-500 block mb-0.5">Timestamp</span>
                                                    <span className="font-mono text-[10px] text-slate-300 block">{block.timestamp}</span>
                                                </div>
                                            </div>
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-600"></div>
                                        </div>

                                        <div className="absolute top-0 right-0 px-2 py-1 bg-slate-700 rounded-bl text-[10px] text-slate-400 font-mono">
                                            #{block.index}
                                        </div>
                                        <div className="mb-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center mb-2 shadow-lg">
                                                <Box className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-xs text-slate-400 font-mono mb-1">
                                                Nonce: <span className="text-blue-300">{block.nonce}</span>
                                            </p>
                                            <p className="text-xs text-slate-500 truncate" title={block.timestamp}>
                                                {block.timestamp.split('T')[1].replace('Z','')}
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-2 border-t border-slate-700 pt-2">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Prev Hash</p>
                                                <p className="text-[10px] font-mono text-slate-400 truncate">
                                                    {block.prevHash.substring(0, 10)}...
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Current Hash</p>
                                                <p className="text-[10px] font-mono text-emerald-400 truncate">
                                                    {block.hash.substring(0, 10)}...
                                                </p>
                                            </div>
                                            <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                                <p className="text-[10px] text-slate-400">
                                                    Tx Count: <span className="text-white">{block.transactions.length}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Chain Link */}
                                    {block.index < blocks.length - 1 && (
                                        <div className="px-2">
                                            <div className="h-0.5 w-8 bg-slate-600"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabbed Terminal / Lecture Notes */}
                    <div className="bg-black rounded-xl border border-slate-800 shadow-lg overflow-hidden h-[500px] flex flex-col">
                        <div className="flex border-b border-slate-800 bg-slate-900">
                            <button 
                                onClick={() => setActiveTab('CONSOLE')}
                                className={`px-4 py-2 text-xs font-bold flex items-center gap-2 transition-colors ${activeTab === 'CONSOLE' ? 'text-emerald-400 bg-slate-800 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Terminal className="w-3 h-3" /> Node-03 Console
                            </button>
                            <button 
                                onClick={() => setActiveTab('LECTURE')}
                                className={`px-4 py-2 text-xs font-bold flex items-center gap-2 transition-colors ${activeTab === 'LECTURE' ? 'text-blue-400 bg-slate-800 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <BookOpen className="w-3 h-3" /> Lecture Notes
                            </button>
                        </div>

                        {activeTab === 'CONSOLE' ? (
                            <div className="p-4 overflow-y-auto flex-1 text-slate-300 space-y-1 font-mono text-sm">
                                <div className="text-slate-500">
                                    {'>'} System Initialized. Connected to Catena-X Mainnet.
                                </div>
                                {logs.map((log, idx) => (
                                    <div key={idx} className="break-all flex">
                                        <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                                        <span className={`${
                                            log.type === 'error' ? 'text-red-500 font-bold' :
                                            log.type === 'success' ? 'text-emerald-400' :
                                            log.type === 'warning' ? 'text-yellow-400' :
                                            'text-slate-300'
                                        }`}>
                                            {log.message}
                                        </span>
                                    </div>
                                ))}
                                {simulationStatus === 'ERROR' && (
                                    <div className="mt-2 text-red-500 font-bold">
                                        {'>'} TRANSACTION REJECTED.
                                    </div>
                                )}
                                <div ref={logsEndRef} />
                            </div>
                        ) : (
                            <div className="p-6 overflow-y-auto flex-1 bg-slate-900">
                                {currentStep > 0 && BLOCKCHAIN_EDU[currentStep as keyof typeof BLOCKCHAIN_EDU] ? (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                                <Info className="w-5 h-5 text-blue-400" />
                                                {BLOCKCHAIN_EDU[currentStep as keyof typeof BLOCKCHAIN_EDU].title}
                                            </h3>
                                            <div className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 text-xs font-bold rounded-full border border-blue-800">
                                                Concept: {BLOCKCHAIN_EDU[currentStep as keyof typeof BLOCKCHAIN_EDU].concept}
                                            </div>
                                        </div>

                                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Analogy</h4>
                                            <p className="text-slate-200 text-sm leading-relaxed border-l-2 border-yellow-500 pl-3">
                                                {BLOCKCHAIN_EDU[currentStep as keyof typeof BLOCKCHAIN_EDU].analogy}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Deep Dive</h4>
                                            <p className="text-slate-300 text-sm leading-loose whitespace-pre-line">
                                                {BLOCKCHAIN_EDU[currentStep as keyof typeof BLOCKCHAIN_EDU].lecture}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-800">
                                            <span className="text-xs text-slate-500 font-mono">Tech Stack: </span>
                                            <span className="text-xs text-emerald-400 font-mono">{BLOCKCHAIN_EDU[currentStep as keyof typeof BLOCKCHAIN_EDU].techStack}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                        <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                                        <p>Start the simulation to view educational content.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Icon component for the visualizer
const Pick = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
);

export default BlockchainLab;
