
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ASSETS, CURRENT_USER } from '../constants';
import { Block, BlockchainTx, Asset } from '../types';
import { assetTitle } from '../labels';
import { useLanguage } from '../contexts/LanguageContext';
import { Box, ShieldCheck, Database, Terminal, Cpu, Play, CheckCircle2, Lock, Link as LinkIcon, RefreshCw, Layers, AlertCircle, XCircle, Settings2, UserCheck, ThumbsUp, ThumbsDown, AlertTriangle, Wallet, X, FileText, Share2, Printer, Check, ArrowRight, Info, BookOpen, Key, Timer, Fuel, Hash, Coins, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

// Educational Content for Lecture Notes.
// Declared outside the component, so it takes `language` instead of reading the hook.
const getBlockchainEdu = (language: string) => ({
    0: {
        title: language === 'KO' ? "블록체인 & 스마트 컨트랙트" : "Blockchain & Smart Contracts",
        concept: language === 'KO' ? "분산 원장 기술 (DLT)" : "Distributed Ledger Technology (DLT)",
        analogy: language === 'KO'
            ? "누구나 읽을 수 있지만, 아무도 지울 수 없는 공유된 디지털 공책입니다."
            : "A shared digital notebook that anyone can read, but no one can erase.",
        lecture: language === 'KO'
            ? `데이터스페이스에서 블록체인은 '신뢰 계층(Trust Layer)' 역할을 합니다.
중앙 은행이나 중개자 없이 네트워크 노드들에 의해 모든 거래(스마트 컨트랙트)가 검증됩니다.
주요 특징:
1. 투명성: 모두가 동일한 기록을 봅니다.
2. 불변성: 한 번 기록된 데이터는 변경할 수 없습니다.
3. 자동화: 조건이 충족되면 스마트 컨트랙트가 자동으로 실행됩니다.`
            : `In a dataspace, the blockchain acts as the 'Trust Layer'.
Every trade (smart contract) is verified by the network nodes themselves, with no central bank or intermediary in the middle.
Key characteristics:
1. Transparency: everyone sees the very same record.
2. Immutability: once written, data can no longer be altered.
3. Automation: a smart contract executes on its own the moment its conditions are met.`,
        techStack: "Hyperledger Besu / Ethereum (EVM)"
    },
    1: {
        title: language === 'KO' ? "1단계: 스마트 컨트랙트 정책 검사" : "Step 1: Smart Contract Policy Check",
        concept: language === 'KO' ? "ODRL 정책 시행" : "ODRL Policy Enforcement",
        analogy: language === 'KO'
            ? "입장하기 전에 표를 검사하는 자동 개찰구와 같습니다."
            : "Like an automated turnstile that checks your ticket before letting you through.",
        lecture: language === 'KO'
            ? `결제가 이루어지기 전에 스마트 컨트랙트는 ODRL(Open Digital Rights Language)로 정의된 '사용 정책'을 확인합니다.
다음을 검증합니다:
- 구매자는 누구인가? (신원)
- 어디에 있는가? (지역)
- 목적은 무엇인가? (사용 제약)
조건이 맞지 않으면 트랜잭션은 즉시 취소(Revert)되어 가스비를 절약합니다.`
            : `Before any payment is made, the smart contract checks the 'usage policy' expressed in ODRL (Open Digital Rights Language).
It verifies:
- Who is the buyer? (Identity)
- Where are they located? (Region)
- What is it for? (Usage constraints)
If the conditions are not met, the transaction reverts immediately, saving the gas fee.`,
        techStack: "Solidity, ODRL Interpreter"
    },
    2: {
        title: language === 'KO' ? "2단계: 전자 서명 & 잔액 확인" : "Step 2: Digital Signature & Balance Check",
        concept: language === 'KO' ? "공개키 암호화" : "Public Key Cryptography",
        analogy: language === 'KO'
            ? "나만 가지고 있는 도장으로 수표에 서명하여 본인임을 증명하는 것과 같습니다."
            : "Like signing a cheque with a seal only you own, proving the signature is really yours.",
        lecture: language === 'KO'
            ? `사용자는 개인키(Private Key)를 사용하여 트랜잭션 페이로드에 서명합니다.
네트워크는 사용자의 공개키(Public Key)로 서명을 검증하여 '부인 방지(Non-repudiation, 보낸 사실을 부인할 수 없음)'를 보장합니다.
동시에 원장은 지갑에 충분한 잔액(토큰 + 가스비)이 있는지 확인합니다.`
            : `The user signs the transaction payload with their private key.
The network verifies that signature against the user's public key, which guarantees non-repudiation - the sender cannot later deny having sent it.
At the same time, the ledger checks that the wallet holds enough balance (tokens + gas fee).`,
        techStack: "ECDSA (Elliptic Curve), ERC-20 Tokens"
    },
    3: {
        title: language === 'KO' ? "3단계: 합의 & 마이닝" : "Step 3: Consensus & Mining",
        concept: language === 'KO' ? "IBFT 2.0 (권위 증명)" : "IBFT 2.0 (Proof of Authority)",
        analogy: language === 'KO'
            ? "공식 기록을 승인하기 위해 투표하는 신뢰할 수 있는 판사 위원회와 같습니다."
            : "Like a panel of trusted judges voting to approve the official record.",
        lecture: language === 'KO'
            ? `산업용 블록체인에서는 작업 증명(채굴) 대신 권위 증명(PoA)을 주로 사용합니다.
선출된 '검증자 노드(Validator Node)'가 유효한 트랜잭션을 수집하여 '블록'으로 만들고 전파합니다.
다른 노드들이 이를 검증하고, 66% 이상이 동의하면 블록체인에 추가되어 빠른 확정성을 보장합니다.`
            : `Industrial blockchains generally use Proof of Authority (PoA) rather than Proof of Work (mining).
An elected validator node gathers the valid transactions, packs them into a block, and gossips it out.
The other nodes verify it, and once more than 66% agree the block is appended to the chain - which is what gives this network its fast finality.`,
        techStack: "Consensus Algorithms, P2P Gossip Protocol"
    },
    4: {
        title: language === 'KO' ? "4단계: 확정 & 상태 업데이트" : "Step 4: Finality & State Update",
        concept: language === 'KO' ? "상태 전이 (State Transition)" : "State Transition",
        analogy: language === 'KO'
            ? "마스터 장부에 지워지지 않는 잉크로 최종 거래를 기록하는 것입니다."
            : "Writing the settled trade into the master ledger in ink that cannot be erased.",
        lecture: language === 'KO'
            ? `블록은 암호화 방식으로 이전 블록과 연결(부모 해시)되어 체인을 형성합니다.
'전역 상태(Global State)'가 업데이트됩니다:
- 구매자의 잔액 감소
- 판매자의 잔액 증가
- 자산 소유권/접근 권한 이전
이 기록은 이제 영구적이며 위변조가 불가능합니다.`
            : `Each block is cryptographically linked to the one before it (the parent hash), and that is what forms the chain.
The global state is then updated:
- The buyer's balance goes down
- The seller's balance goes up
- Ownership of, and access rights to, the asset move across
This record is now permanent and tamper-evident.`,
        techStack: "Merkle Patricia Trie, LevelDB"
    }
});

// Categorical hues for the block report. Validated for the dark modal surface:
// inside the dark lightness band, chroma floor met, adjacent-pair CVD separation
// and contrast all pass. Assigned in this fixed order, never cycled.
const GAS_COLORS = ['#3b82f6', '#059669', '#8b5cf6', '#d97706'];

// Everything here is derived from the block itself, so a report is stable
// across re-renders rather than reshuffling on each open.
const buildBlockReport = (block: Block, chain: Block[], language: string) => {
    const position = chain.findIndex((b) => b.index === block.index);
    const prev = position > 0 ? chain[position - 1] : null;

    const txCount = block.transactions.length;
    const totalValue = block.transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const confirmations = Math.max(0, chain.length - 1 - position);
    const blockTimeMs = prev
        ? new Date(block.timestamp).getTime() - new Date(prev.timestamp).getTime()
        : null;

    // Gas is simulated, like the rest of this lab, but composed from the block
    // so the numbers add up and stay put.
    // `key` stays English - it is the React key and the slice identity.
    // `name` is the label a person reads, so it follows the language.
    const gas = [
        { key: 'base', name: language === 'KO' ? '기본 수수료' : 'Base fee', value: 21000 },
        { key: 'execution', name: language === 'KO' ? '실행' : 'Execution', value: txCount * 14200 },
        { key: 'storage', name: language === 'KO' ? '저장' : 'Storage', value: txCount * 6800 },
        { key: 'signature', name: language === 'KO' ? '서명' : 'Signature', value: txCount * 3000 },
    ].filter((slice) => slice.value > 0);
    const gasTotal = gas.reduce((sum, slice) => sum + slice.value, 0);

    // Block time across the chain, so this block can be read against its peers.
    const timeline = chain
        .map((b, i) => ({
            index: b.index,
            label: `#${b.index}`,
            seconds: i === 0
                ? 0
                : (new Date(b.timestamp).getTime() - new Date(chain[i - 1].timestamp).getTime()) / 1000,
        }))
        .filter((point) => point.index > 0);

    return { position, prev, txCount, totalValue, confirmations, blockTimeMs, gas, gasTotal, timeline };
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

    // Ledger block the detail report is open for
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

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

    // Lecture content for the current step, resolved in the active language.
    const blockchainEdu = getBlockchainEdu(language);
    const currentEdu = blockchainEdu[currentStep as keyof typeof blockchainEdu];

    // --- INFOGRAPHIC COMPONENT ---
    const TxInfographic: React.FC<{ status: 'SUCCESS' | 'FAILURE', failureStage?: string }> = ({ status, failureStage }) => {
        const steps = [
            { id: 'POLICY', label: language === 'KO' ? '정책 검사' : 'Policy Check', icon: ShieldCheck },
            { id: 'WALLET', label: language === 'KO' ? '지갑 서명' : 'Wallet Sign', icon: Wallet },
            { id: 'CONSENSUS', label: language === 'KO' ? '합의' : 'Consensus', icon: Database },
            { id: 'BLOCK', label: language === 'KO' ? '온체인' : 'On-Chain', icon: Box },
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

            {/* --- LEDGER BLOCK REPORT --- */}
            {selectedBlock && (() => {
                const r = buildBlockReport(selectedBlock, blocks, language);
                const isGenesis = selectedBlock.index === 0;
                return (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn"
                        onClick={() => setSelectedBlock(null)}
                    >
                        <div
                            className="bg-slate-900 text-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp border border-slate-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 relative shrink-0">
                                <div className="absolute inset-0 opacity-10"
                                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                                </div>
                                <div className="relative z-10 flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/15 border border-white/25 rounded-xl flex items-center justify-center shrink-0">
                                            <Box className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">{language === 'KO' ? '블록' : 'Block'} #{selectedBlock.index}</h3>
                                            <p className="text-white/70 text-xs font-mono mt-1 break-all">{selectedBlock.hash}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="hidden sm:flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'KO' ? '확정됨' : 'Confirmed'}
                                        </span>
                                        <button
                                            onClick={() => setSelectedBlock(null)}
                                            aria-label={language === 'KO' ? '블록 리포트 닫기' : 'Close the block report'}
                                            className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto">
                                {/* Headline figures */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {[
                                        { id: 'txCount', icon: FileText, label: language === 'KO' ? '트랜잭션' : 'Transactions', value: String(r.txCount), tone: 'text-blue-400' },
                                        { id: 'value', icon: Coins, label: language === 'KO' ? '정산 금액' : 'Value settled', value: `${r.totalValue.toLocaleString()} KRW`, tone: 'text-emerald-400' },
                                        { id: 'blockTime', icon: Timer, label: language === 'KO' ? '블록 생성 시간' : 'Block time', value: r.blockTimeMs === null ? '—' : `${(r.blockTimeMs / 1000).toFixed(2)}s`, tone: 'text-violet-400' },
                                        { id: 'confirmations', icon: Layers, label: language === 'KO' ? '컨펌 수' : 'Confirmations', value: String(r.confirmations), tone: 'text-amber-400' },
                                    ].map((tile) => (
                                        <div key={tile.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                                            <tile.icon className={`w-4 h-4 mb-2 ${tile.tone}`} />
                                            <p className="text-xl font-bold tabular-nums leading-none">{tile.value}</p>
                                            <p className="text-[11px] text-slate-400 mt-1.5">{tile.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Position in the chain */}
                                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                        <LinkIcon className="w-3.5 h-3.5" /> {language === 'KO' ? '체인 연결' : 'Chain linkage'}
                                    </h4>
                                    <div className="flex items-center gap-3 overflow-x-auto">
                                        <div className="flex-1 min-w-[150px] bg-slate-900/70 border border-slate-700 rounded-lg p-3">
                                            <p className="text-[10px] uppercase text-slate-500 mb-1">{language === 'KO' ? '이전 블록' : 'Parent block'}</p>
                                            <p className="text-sm font-bold">{r.prev ? `#${r.prev.index}` : (language === 'KO' ? '없음 (제네시스)' : 'None (genesis)')}</p>
                                            <p className="text-[10px] font-mono text-slate-400 truncate mt-1">{selectedBlock.prevHash}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />
                                        <div className="flex-1 min-w-[150px] bg-blue-950/60 border border-blue-500/50 rounded-lg p-3">
                                            <p className="text-[10px] uppercase text-blue-300 mb-1">{language === 'KO' ? '현재 블록' : 'This block'}</p>
                                            <p className="text-sm font-bold">#{selectedBlock.index}</p>
                                            <p className="text-[10px] font-mono text-blue-200/80 truncate mt-1">{selectedBlock.hash}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />
                                        <div className="flex-1 min-w-[150px] bg-slate-900/70 border border-slate-700 rounded-lg p-3">
                                            <p className="text-[10px] uppercase text-slate-500 mb-1">{language === 'KO' ? '다음 블록' : 'Child block'}</p>
                                            <p className="text-sm font-bold">
                                                {r.confirmations > 0
                                                    ? `#${selectedBlock.index + 1}`
                                                    : (language === 'KO' ? '체인 최상단' : 'Chain head')}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                {r.confirmations > 0
                                                    ? (language === 'KO' ? `위에 ${r.confirmations}개 블록이 쌓임` : `${r.confirmations} block(s) on top`)
                                                    : (language === 'KO' ? '가장 최근 블록' : 'Newest block')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Gas composition - parts of one whole, so one bar, not four */}
                                    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-2">
                                            <Fuel className="w-3.5 h-3.5" /> {language === 'KO' ? '가스 구성' : 'Gas composition'}
                                        </h4>
                                        <p className="text-2xl font-bold tabular-nums mb-4">{r.gasTotal.toLocaleString()} <span className="text-sm font-medium text-slate-400">Gwei</span></p>

                                        <div className="flex h-3 rounded-full overflow-hidden gap-[2px] mb-4">
                                            {r.gas.map((slice, i) => (
                                                <div
                                                    key={slice.key}
                                                    title={`${slice.name}: ${slice.value.toLocaleString()} Gwei`}
                                                    style={{ width: `${(slice.value / r.gasTotal) * 100}%`, backgroundColor: GAS_COLORS[i] }}
                                                />
                                            ))}
                                        </div>

                                        {/* Every segment is also named and numbered, so identity never rests on hue alone */}
                                        <ul className="space-y-2">
                                            {r.gas.map((slice, i) => (
                                                <li key={slice.key} className="flex items-center gap-2 text-xs">
                                                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: GAS_COLORS[i] }} />
                                                    <span className="text-slate-300">{slice.name}</span>
                                                    <span className="flex-1 border-b border-dotted border-slate-700" />
                                                    <span className="font-mono tabular-nums text-slate-200">{slice.value.toLocaleString()}</span>
                                                    <span className="font-mono tabular-nums text-slate-500 w-12 text-right">
                                                        {((slice.value / r.gasTotal) * 100).toFixed(0)}%
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Block time against the rest of the chain */}
                                    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-2">
                                            <Activity className="w-3.5 h-3.5" /> {language === 'KO' ? '체인 전체 블록 생성 시간' : 'Block time across the chain'}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 mb-4">
                                            {language === 'KO'
                                                ? '이전 블록 이후 경과한 시간(초)입니다. 현재 블록이 강조되어 있습니다.'
                                                : 'Seconds since the parent block. This block is highlighted.'}
                                        </p>
                                        {r.timeline.length === 0 ? (
                                            <p className="text-xs text-slate-500 py-10 text-center">
                                                {language === 'KO'
                                                    ? '블록을 채굴하면 블록 생성 시간을 비교할 수 있습니다.'
                                                    : 'Mine a block to compare block times.'}
                                            </p>
                                        ) : (
                                            <div className="h-[168px] -ml-2">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={r.timeline} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                                                        <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={34} />
                                                        <Tooltip
                                                            cursor={{ fill: '#ffffff0d' }}
                                                            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                                                            labelStyle={{ color: '#e2e8f0' }}
                                                            formatter={(v: number) => [`${v.toFixed(2)}s`, language === 'KO' ? '블록 생성 시간' : 'Block time']}
                                                        />
                                                        <Bar dataKey="seconds" radius={[4, 4, 0, 0]} maxBarSize={38}>
                                                            {r.timeline.map((point) => (
                                                                <Cell
                                                                    key={point.index}
                                                                    fill={point.index === selectedBlock.index ? '#3b82f6' : '#334155'}
                                                                />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Transactions */}
                                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" /> {language === 'KO' ? '트랜잭션' : 'Transactions'} ({r.txCount})
                                    </h4>
                                    {r.txCount === 0 ? (
                                        <p className="text-xs text-slate-500">
                                            {isGenesis
                                                ? (language === 'KO'
                                                    ? '제네시스 블록은 체인의 기준점 역할만 하며, 트랜잭션을 담고 있지 않습니다.'
                                                    : 'The genesis block anchors the chain and carries no transactions.')
                                                : (language === 'KO'
                                                    ? '이 블록에는 트랜잭션이 없습니다.'
                                                    : 'This block carries no transactions.')}
                                        </p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="text-left text-slate-500 border-b border-slate-700">
                                                        <th className="pb-2 font-medium">{language === 'KO' ? '트랜잭션' : 'Tx'}</th>
                                                        <th className="pb-2 font-medium">{language === 'KO' ? '발신' : 'From'}</th>
                                                        <th className="pb-2 font-medium">{language === 'KO' ? '수신' : 'To'}</th>
                                                        <th className="pb-2 font-medium text-right">{language === 'KO' ? '금액' : 'Amount'}</th>
                                                        <th className="pb-2 font-medium text-right">{language === 'KO' ? '상태' : 'Status'}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-800">
                                                    {selectedBlock.transactions.map((tx) => (
                                                        <tr key={tx.id}>
                                                            <td className="py-2.5 font-mono text-slate-300">{tx.id.substring(0, 14)}…</td>
                                                            <td className="py-2.5 text-slate-300">{tx.from}</td>
                                                            <td className="py-2.5 text-slate-300">{tx.to}</td>
                                                            <td className="py-2.5 text-right font-mono tabular-nums text-slate-200">{tx.amount.toLocaleString()}</td>
                                                            <td className="py-2.5 text-right">
                                                                <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                                                    <Check className="w-3 h-3" /> {tx.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Integrity */}
                                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                        <Hash className="w-3.5 h-3.5" /> {language === 'KO' ? '무결성' : 'Integrity'}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                        <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-3">
                                            <p className="text-[10px] uppercase text-slate-500 mb-1">{language === 'KO' ? '검증자' : 'Validator'}</p>
                                            <p className="text-sm font-mono text-slate-200 break-all">{selectedBlock.validator}</p>
                                        </div>
                                        <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-3">
                                            <p className="text-[10px] uppercase text-slate-500 mb-1">{language === 'KO' ? '논스' : 'Nonce'}</p>
                                            <p className="text-sm font-mono text-slate-200 tabular-nums">{selectedBlock.nonce}</p>
                                        </div>
                                        <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-3">
                                            <p className="text-[10px] uppercase text-slate-500 mb-1">{language === 'KO' ? '봉인 시각' : 'Sealed at'}</p>
                                            <p className="text-sm font-mono text-slate-200">{new Date(selectedBlock.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <p className="text-xs text-emerald-200">
                                            {language === 'KO'
                                                ? '해시가 이전 블록의 연결 값과 일치합니다. 따라서 체인을 깨뜨리지 않고서는 이 블록 이전의 어떤 기록도 바꿀 수 없습니다.'
                                                : 'Hash matches the parent link, so nothing before this block can change without breaking the chain.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-700 p-4 flex justify-end shrink-0 bg-slate-900">
                                <button
                                    onClick={() => setSelectedBlock(null)}
                                    className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold transition-colors"
                                >
                                    {t('c_close')}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

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
                                    {reportData.status === 'SUCCESS'
                                        ? (language === 'KO' ? '트랜잭션 확정 완료' : 'Transaction Confirmed')
                                        : (language === 'KO' ? '트랜잭션 실패' : 'Transaction Failed')}
                                </h3>
                                <p className="text-white/80 text-xs mt-1 font-mono">
                                    {reportData.status === 'SUCCESS'
                                        ? (language === 'KO'
                                            ? `블록 #${reportData.blockIndex} • 확정됨`
                                            : `Block #${reportData.blockIndex} • Confirmed`)
                                        : (language === 'KO' ? 'EVM에 의해 되돌려짐' : 'Reverted by EVM')}
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
                                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{language === 'KO' ? '블록 해시' : 'Block Hash'}</span>
                                                <span className="font-mono text-[10px] text-emerald-400 break-all leading-tight block">{reportData.blockHash}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{language === 'KO' ? '사용 가스' : 'Gas Used'}</span>
                                                <span className="font-mono text-sm text-yellow-400 font-bold">{reportData.gasUsed}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Receipt Details */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{language === 'KO' ? '결제 금액' : 'Amount Paid'}</span>
                                            <span className="font-bold text-slate-900">{reportData.asset.price.toLocaleString()} {reportData.asset.currency}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{language === 'KO' ? '트랜잭션 해시' : 'Tx Hash'}</span>
                                            <span className="font-mono text-xs text-blue-600 truncate max-w-[150px]">{reportData.txId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{language === 'KO' ? '처리 시각' : 'Timestamp'}</span>
                                            <span className="text-slate-700 text-xs">{new Date(reportData.timestamp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 rounded-xl p-4 border border-red-100 space-y-3 text-sm">
                                    <div className="flex justify-between items-start">
                                        <span className="text-red-700 font-medium">{language === 'KO' ? '오류 코드' : 'Error Code'}</span>
                                        <span className="font-mono font-bold text-red-900">EVM_REVERT_0x52</span>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-red-100">
                                        <span className="text-xs text-slate-400 block uppercase font-bold mb-1">{language === 'KO' ? '실패 사유' : 'Reason'}</span>
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
                                            <Share2 className="w-4 h-4" /> {language === 'KO' ? '공유' : 'Share'}
                                        </button>
                                        <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                            <Printer className="w-4 h-4" /> {language === 'KO' ? '영수증' : 'Receipt'}
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={handleGoToRecharge}
                                        className="w-full py-3 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Wallet className="w-4 h-4" /> {language === 'KO' ? '지갑 잔액 확인' : 'Check Wallet Balance'}
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
                                    {language === 'KO' ? '자산' : 'Asset'}: <span className="font-semibold text-slate-700">{pendingData?.asset.title}</span><br/>
                                    {language === 'KO' ? '금액' : 'Amount'}: <span className="font-semibold text-slate-700">{pendingData?.asset.price.toLocaleString()} {pendingData?.asset.currency}</span>
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
                                {language === 'KO' ? '잔액' : 'Balance'}: ${walletBalance.toLocaleString()}
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
                                            {assetTitle(asset, language)} ({asset.price} {asset.currency})
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
                                { step: 1, label: language === 'KO' ? '스마트 컨트랙트 정책 검사' : 'Smart Contract Policy Check', icon: ShieldCheck },
                                { step: 2, label: language === 'KO' ? '지갑 잔액 & 서명' : 'Wallet Balance & Signature', icon: Lock },
                                { step: 3, label: language === 'KO' ? '채굴 & 검증' : 'Mining & Validation', icon: Pick },
                                { step: 4, label: language === 'KO' ? '원장에 기록 완료' : 'Committed to Ledger', icon: Database },
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
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBlock(block)}
                                        aria-label={language === 'KO'
                                            ? `블록 #${block.index} 상세 리포트 열기`
                                            : `Open the detail report for block #${block.index}`}
                                        className="bg-slate-800 rounded-lg p-4 border border-slate-700 w-64 flex-shrink-0 text-left hover:border-blue-500 hover:bg-slate-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors group relative cursor-pointer">
                                        
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-60 bg-slate-950/95 backdrop-blur border border-slate-600 text-white text-xs p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 translate-y-2 group-hover:translate-y-0">
                                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                                                <span className="font-bold text-emerald-400 flex items-center gap-1">
                                                    <Box className="w-3 h-3" /> {language === 'KO' ? '블록 정보' : 'Block Info'}
                                                </span>
                                                <span className="text-[10px] text-slate-500">{new Date(block.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded">
                                                    <span className="text-slate-400">{language === 'KO' ? '트랜잭션' : 'Transactions'}</span>
                                                    <span className="font-mono font-bold text-blue-300">{block.transactions.length}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-400">{language === 'KO' ? '검증자' : 'Validator'}</span>
                                                    <span className="font-mono text-[10px] text-slate-300 bg-slate-800 px-1 rounded">{block.validator}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-400">{language === 'KO' ? '사용 가스' : 'Gas Used'}</span>
                                                    <span className="font-mono text-[10px] text-slate-300">21,000 Gwei</span>
                                                </div>
                                                <div className="pt-1">
                                                    <span className="text-[10px] text-slate-500 block mb-0.5">{language === 'KO' ? '생성 시각' : 'Timestamp'}</span>
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
                                                {language === 'KO' ? '논스' : 'Nonce'}: <span className="text-blue-300">{block.nonce}</span>
                                            </p>
                                            <p className="text-xs text-slate-500 truncate" title={block.timestamp}>
                                                {block.timestamp.split('T')[1].replace('Z','')}
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-2 border-t border-slate-700 pt-2">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">{language === 'KO' ? '이전 해시' : 'Prev Hash'}</p>
                                                <p className="text-[10px] font-mono text-slate-400 truncate">
                                                    {block.prevHash.substring(0, 10)}...
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">{language === 'KO' ? '현재 해시' : 'Current Hash'}</p>
                                                <p className="text-[10px] font-mono text-emerald-400 truncate">
                                                    {block.hash.substring(0, 10)}...
                                                </p>
                                            </div>
                                            <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50 flex items-center justify-between gap-2">
                                                <p className="text-[10px] text-slate-400">
                                                    {language === 'KO' ? '트랜잭션 수' : 'Tx Count'}: <span className="text-white">{block.transactions.length}</span>
                                                </p>
                                                <span className="text-[10px] font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                    {language === 'KO' ? '리포트' : 'Report'} <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                    
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
                                <Terminal className="w-3 h-3" /> {language === 'KO' ? 'Node-03 콘솔' : 'Node-03 Console'}
                            </button>
                            <button 
                                onClick={() => setActiveTab('LECTURE')}
                                className={`px-4 py-2 text-xs font-bold flex items-center gap-2 transition-colors ${activeTab === 'LECTURE' ? 'text-blue-400 bg-slate-800 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <BookOpen className="w-3 h-3" /> {language === 'KO' ? '강의 노트' : 'Lecture Notes'}
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
                                {currentStep > 0 && currentEdu ? (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                                <Info className="w-5 h-5 text-blue-400" />
                                                {currentEdu.title}
                                            </h3>
                                            <div className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 text-xs font-bold rounded-full border border-blue-800">
                                                {language === 'KO' ? '핵심 개념' : 'Concept'}: {currentEdu.concept}
                                            </div>
                                        </div>

                                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">{language === 'KO' ? '비유로 이해하기' : 'Analogy'}</h4>
                                            <p className="text-slate-200 text-sm leading-relaxed border-l-2 border-yellow-500 pl-3">
                                                {currentEdu.analogy}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">{language === 'KO' ? '자세히 알아보기' : 'Deep Dive'}</h4>
                                            <p className="text-slate-300 text-sm leading-loose whitespace-pre-line">
                                                {currentEdu.lecture}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-800">
                                            <span className="text-xs text-slate-500 font-mono">{language === 'KO' ? '기술 스택' : 'Tech Stack'}: </span>
                                            <span className="text-xs text-emerald-400 font-mono">{currentEdu.techStack}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                        <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                                        <p>{language === 'KO' ? '시뮬레이션을 시작하면 학습 내용이 표시됩니다.' : 'Start the simulation to view educational content.'}</p>
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
