
import React, { useState, useEffect } from 'react';
import { Box, Wallet, TrendingUp, TrendingDown, Calendar, CreditCard, Play, PlusCircle, X, Trash2, AlertTriangle, Settings, Activity, Database, CheckCircle2, Loader2, Search, Filter, PieChart as PieIcon, ArrowRight, Building2, Lock } from 'lucide-react';
import { RECENT_TRANSACTIONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { assetTitle, assetDescription } from '../labels';
import { useAssets } from '../contexts/AssetContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { myAssets, removeFromLibrary } = useAssets();

  // Mock Data for Wallet (Using localStorage to sync with Blockchain Lab)
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('korea_wallet_balance');
    return saved ? parseInt(saved) : 124500;
  });

  const [income] = useState(45200);
  const [expense] = useState(13500);

  // Transaction State (Initialized with Mock Data)
  const [allTransactions, setAllTransactions] = useState(RECENT_TRANSACTIONS);

  // Modal States
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpStep, setTopUpStep] = useState<'AMOUNT' | 'METHOD' | 'PROCESSING' | 'SUCCESS'>('AMOUNT');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CRYPTO' | 'BANK'>('CARD');
  const [topUpAmount, setTopUpAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  const [managingAsset, setManagingAsset] = useState<string | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false); // State for in-modal confirmation
  
  // New Modal States
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [launchingAssetTitle, setLaunchingAssetTitle] = useState('');
  const [launchStep, setLaunchStep] = useState(0); // 0: Init, 1: Connect, 2: Auth, 3: Ready
  
  const [showTxModal, setShowTxModal] = useState(false);
  const [txSearch, setTxSearch] = useState('');

  // Financial Report State
  const [activeReport, setActiveReport] = useState<'INCOME' | 'EXPENSE' | null>(null);

  // Sync state if localStorage changes elsewhere (basic sync)
  useEffect(() => {
    const handleStorageChange = () => {
        const saved = localStorage.getItem('korea_wallet_balance');
        if (saved) setBalance(parseInt(saved));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Launch Simulation Logic
  useEffect(() => {
      let timer: any;
      if (showLaunchModal && launchStep < 3) {
          timer = setTimeout(() => {
              setLaunchStep(prev => prev + 1);
          }, 1500);
      }
      return () => clearTimeout(timer);
  }, [showLaunchModal, launchStep]);

  const openTopUpModal = () => {
      setShowTopUpModal(true);
      setTopUpStep('AMOUNT');
      setTopUpAmount(0);
      setCustomAmount('');
  };

  const handleAmountSelect = () => {
      let finalAmount = topUpAmount;
      if (finalAmount === 0 && customAmount) {
          finalAmount = parseInt(customAmount);
      }
      if (!finalAmount || finalAmount <= 0) {
          alert(language === 'KO' ? '올바른 금액을 입력해 주세요.' : 'Please enter a valid amount.');
          return;
      }
      setTopUpAmount(finalAmount);
      setTopUpStep('METHOD');
  };

  const processTopUp = () => {
      setTopUpStep('PROCESSING');
      setTimeout(() => {
          const newBalance = balance + topUpAmount;
          setBalance(newBalance);
          localStorage.setItem('korea_wallet_balance', newBalance.toString());
          
          // Add Deposit Transaction
          const depositTx = {
             id: `tx_dep_${Math.floor(Math.random() * 10000)}`,
             asset: language === 'KO' ? '지갑 충전' : 'Wallet Top Up',
             amount: topUpAmount,
             date: new Date().toISOString().split('T')[0],
             status: 'Confirmed'
          };
          setAllTransactions(prev => [depositTx, ...prev]);

          setTopUpStep('SUCCESS');
      }, 2000);
  };

  const executeCancellation = (id: string) => {
      // Find asset details before removing
      const assetToCancel = myAssets.find(a => a.id === id);
      
      if (assetToCancel) {
          // Create Cancellation Transaction Record
          const cancelTx = {
              id: `tx_cnl_${Math.floor(Math.random() * 10000)}`,
              asset: `${assetToCancel.title} ${language === 'KO' ? '(환불/취소)' : '(Refund/Cancel)'}`,
              amount: 0, // Or refund amount if applicable
              date: new Date().toISOString().split('T')[0],
              status: 'Cancelled'
          };
          // Prepend to transactions list
          setAllTransactions(prev => [cancelTx, ...prev]);
      }

      removeFromLibrary(id);
      setManagingAsset(null);
      setConfirmingCancel(false);
  };

  const handleLaunch = (title: string) => {
      setLaunchingAssetTitle(title);
      setLaunchStep(0);
      setShowLaunchModal(true);
  };

  // Mock Data for Reports
  const monthLabels = language === 'KO'
      ? ['1월', '2월', '3월', '4월', '5월', '6월']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const incomeTrend = [
      { name: monthLabels[0], value: 32000 }, { name: monthLabels[1], value: 35000 }, { name: monthLabels[2], value: 34000 },
      { name: monthLabels[3], value: 38000 }, { name: monthLabels[4], value: 42000 }, { name: monthLabels[5], value: 45200 },
  ];
  const incomeSources = [
      { name: language === 'KO' ? '데이터 판매' : 'Data Sales', value: 65, color: '#3b82f6' },
      { name: language === 'KO' ? '자산 임대' : 'Asset Rental', value: 25, color: '#10b981' },
      { name: language === 'KO' ? '로열티' : 'Royalties', value: 10, color: '#8b5cf6' },
  ];

  const expenseTrend = [
      { name: monthLabels[0], value: 11000 }, { name: monthLabels[1], value: 12500 }, { name: monthLabels[2], value: 11800 },
      { name: monthLabels[3], value: 14000 }, { name: monthLabels[4], value: 13200 }, { name: monthLabels[5], value: 13500 },
  ];
  const expenseCategories = [
      { name: language === 'KO' ? '자산 구독' : 'Asset Subscriptions', value: 55, color: '#ef4444' },
      { name: language === 'KO' ? '컴퓨팅 자원' : 'Compute Resources', value: 30, color: '#f59e0b' },
      { name: language === 'KO' ? '네트워크 수수료' : 'Network Fees', value: 15, color: '#64748b' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn relative">
      <h1 className="text-3xl font-bold text-slate-900">{t('db_title')}</h1>
      
      {/* --- LAUNCH MODAL --- */}
      {showLaunchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700 relative text-white">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                          <Play className="w-5 h-5 text-emerald-500 fill-current" />
                          {language === 'KO' ? '실행 중:' : 'Launching:'} {launchingAssetTitle}
                      </h3>
                      <button onClick={() => setShowLaunchModal(false)} className="text-slate-400 hover:text-white">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-8">
                      <div className="space-y-6">
                          <div className={`flex items-center gap-4 ${launchStep >= 0 ? 'opacity-100' : 'opacity-30'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${launchStep > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                  {launchStep > 0 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                              </div>
                              <span className={launchStep === 0 ? 'text-blue-400 font-bold animate-pulse' : 'text-slate-300'}>{language === 'KO' ? '컨테이너 초기화 중...' : 'Initializing Container...'}</span>
                          </div>
                          <div className={`flex items-center gap-4 ${launchStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${launchStep > 1 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                  {launchStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                              </div>
                              <span className={launchStep === 1 ? 'text-blue-400 font-bold animate-pulse' : 'text-slate-300'}>{language === 'KO' ? 'EDC 연결 수립 중...' : 'Establishing EDC Connection...'}</span>
                          </div>
                          <div className={`flex items-center gap-4 ${launchStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${launchStep > 2 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                  {launchStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '3'}
                              </div>
                              <span className={launchStep === 2 ? 'text-blue-400 font-bold animate-pulse' : 'text-slate-300'}>{language === 'KO' ? '액세스 토큰 검증 중...' : 'Verifying Access Token...'}</span>
                          </div>
                      </div>

                      {launchStep === 3 && (
                          <div className="mt-8 text-center animate-scaleUp">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/50 mb-4">
                                  <CheckCircle2 className="w-4 h-4" /> {language === 'KO' ? '실행 준비 완료' : 'Ready to Launch'}
                              </div>
                              <button 
                                  onClick={() => { alert(language === 'KO' ? '애플리케이션을 여는 중입니다...' : 'Opening Application...'); setShowLaunchModal(false); }}
                                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/50"
                              >
                                  {language === 'KO' ? '애플리케이션 열기' : 'Open Application'}
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* --- FINANCIAL REPORT MODAL --- */}
      {activeReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-scaleUp flex flex-col">
                  <div className={`p-6 border-b flex justify-between items-center ${activeReport === 'INCOME' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${activeReport === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {activeReport === 'INCOME' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                          </div>
                          <div>
                              <h2 className={`text-xl font-bold ${activeReport === 'INCOME' ? 'text-emerald-900' : 'text-rose-900'}`}>
                                  {language === 'KO'
                                      ? (activeReport === 'INCOME' ? '월간 수입 분석' : '월간 지출 분석')
                                      : (activeReport === 'INCOME' ? 'Monthly Income Analysis' : 'Monthly Expense Analysis')}
                              </h2>
                              <p className={`text-xs ${activeReport === 'INCOME' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  {language === 'KO' ? '2024년 6월 리포트' : 'June 2024 Report'}
                              </p>
                          </div>
                      </div>
                      <button onClick={() => setActiveReport(null)} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                          <X className="w-6 h-6 text-slate-500" />
                      </button>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left: Trend Chart */}
                      <div className="space-y-4">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-blue-500" /> {language === 'KO' ? '6개월 추이' : '6-Month Trend'}
                          </h3>
                          <div className="h-64 w-full bg-slate-50 rounded-xl p-2 border border-slate-100">
                              <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={activeReport === 'INCOME' ? incomeTrend : expenseTrend}>
                                      <defs>
                                          <linearGradient id="colorReport" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor={activeReport === 'INCOME' ? '#10b981' : '#f43f5e'} stopOpacity={0.2}/>
                                              <stop offset="95%" stopColor={activeReport === 'INCOME' ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                                          </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                      <YAxis hide />
                                      <Tooltip />
                                      <Area 
                                          type="monotone" 
                                          dataKey="value" 
                                          stroke={activeReport === 'INCOME' ? '#10b981' : '#f43f5e'} 
                                          strokeWidth={2}
                                          fillOpacity={1} 
                                          fill="url(#colorReport)" 
                                      />
                                  </AreaChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      {/* Right: Breakdown & Summary */}
                      <div className="space-y-6">
                          <div>
                              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                  <PieIcon className="w-4 h-4 text-purple-500" /> {language === 'KO' ? '카테고리별 분석' : 'Category Breakdown'}
                              </h3>
                              <div className="h-48 w-full flex">
                                  <ResponsiveContainer width="50%" height="100%">
                                      <PieChart>
                                          <Pie
                                              data={activeReport === 'INCOME' ? incomeSources : expenseCategories}
                                              innerRadius={40}
                                              outerRadius={60}
                                              paddingAngle={5}
                                              dataKey="value"
                                          >
                                              {(activeReport === 'INCOME' ? incomeSources : expenseCategories).map((entry, index) => (
                                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                              ))}
                                          </Pie>
                                          <Tooltip />
                                      </PieChart>
                                  </ResponsiveContainer>
                                  <div className="flex-1 flex flex-col justify-center space-y-2 text-xs">
                                      {(activeReport === 'INCOME' ? incomeSources : expenseCategories).map((item, idx) => (
                                          <div key={idx} className="flex items-center gap-2">
                                              <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                              <span className="text-slate-600">{item.name}</span>
                                              <span className="font-bold text-slate-900 ml-auto">{item.value}%</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-slate-500">{language === 'KO'
                                      ? (activeReport === 'INCOME' ? '총 수입' : '총 지출')
                                      : (activeReport === 'INCOME' ? 'Total Income' : 'Total Expenses')}</span>
                                  <span className={`text-xl font-bold ${activeReport === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      ${activeReport === 'INCOME' ? income.toLocaleString() : expense.toLocaleString()}
                                  </span>
                              </div>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <ArrowRight className="w-3 h-3" />
                                  {language === 'KO'
                                      ? (activeReport === 'INCOME' ? '전월 대비 +8.5%' : '전월 대비 +2.1%')
                                      : (activeReport === 'INCOME' ? '+8.5% vs last month' : '+2.1% vs last month')}
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- TRANSACTION HISTORY MODAL --- */}
      {showTxModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp flex flex-col max-h-[85vh]">
                  <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                      <div>
                          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                              <Database className="w-5 h-5 text-blue-600" /> {language === 'KO' ? '거래 내역' : 'Transaction History'}
                          </h2>
                          <p className="text-xs text-slate-500">{language === 'KO' ? '스마트 컨트랙트 실행 전체 원장' : 'Full ledger of smart contract executions'}</p>
                      </div>
                      <button onClick={() => setShowTxModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                          <X className="w-6 h-6" />
                      </button>
                  </div>
                  
                  <div className="p-4 border-b border-slate-100 flex gap-4">
                      <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                              type="text" 
                              placeholder={language === 'KO' ? '자산, ID 또는 날짜로 검색...' : 'Search by Asset, ID, or Date...'} 
                              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                              value={txSearch}
                              onChange={(e) => setTxSearch(e.target.value)}
                          />
                      </div>
                      <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                          <Filter className="w-4 h-4" /> {language === 'KO' ? '필터' : 'Filter'}
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-0">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0">
                              <tr>
                                  <th className="px-6 py-3">{language === 'KO' ? '거래 ID' : 'Transaction ID'}</th>
                                  <th className="px-6 py-3">{language === 'KO' ? '자산' : 'Asset'}</th>
                                  <th className="px-6 py-3">{language === 'KO' ? '날짜' : 'Date'}</th>
                                  <th className="px-6 py-3 text-right">{language === 'KO' ? '금액' : 'Amount'}</th>
                                  <th className="px-6 py-3 text-center">{language === 'KO' ? '상태' : 'Status'}</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {/* Using state instead of static const to reflect cancellations */}
                              {allTransactions
                                .filter(tx => tx.asset.toLowerCase().includes(txSearch.toLowerCase()) || tx.id.toLowerCase().includes(txSearch.toLowerCase()))
                                .map((tx) => (
                                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.id}</td>
                                      <td className="px-6 py-4 font-bold text-slate-800">{tx.asset}</td>
                                      <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                                      <td className="px-6 py-4 text-right font-bold text-slate-900">${tx.amount.toLocaleString()}</td>
                                      <td className="px-6 py-4 text-center">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                              tx.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                              tx.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                              'bg-emerald-100 text-emerald-800'
                                          }`}>
                                              {tx.status}
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
                      <button className="text-sm font-bold text-blue-600 hover:underline">{language === 'KO' ? 'CSV 내보내기' : 'Export CSV'}</button>
                  </div>
              </div>
          </div>
      )}

      {/* Management Modal (Cancellation) */}
      {managingAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
                  <button onClick={() => setManagingAsset(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{language === 'KO' ? '구독 관리' : 'Manage Subscription'}</h3>
                  <div className="p-4 bg-slate-50 rounded-xl mb-6 border border-slate-100">
                      <p className="text-sm font-bold text-slate-700">{myAssets.find(a => a.id === managingAsset)?.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{language === 'KO' ? '상태: 이용 중 • 30일 후 갱신' : 'Status: Active • Renewing in 30 days'}</p>
                  </div>
                  
                  {!confirmingCancel ? (
                      <button 
                          onClick={() => setConfirmingCancel(true)}
                          className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                          <Trash2 className="w-4 h-4" /> {language === 'KO' ? '구독 해지' : 'Cancel Subscription'}
                      </button>
                  ) : (
                      <div className="space-y-3 animate-fadeIn">
                          <p className="text-sm text-center font-bold text-slate-700">{language === 'KO' ? '정말 해지하시겠습니까?' : 'Are you sure you want to cancel?'}</p>
                          <div className="flex gap-3">
                              <button 
                                  onClick={() => setConfirmingCancel(false)}
                                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50"
                              >
                                  {language === 'KO' ? '아니요, 유지할게요' : 'No, Keep'}
                              </button>
                              <button 
                                  onClick={() => executeCancellation(managingAsset)}
                                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-md shadow-red-100"
                              >
                                  {language === 'KO' ? '네, 해지합니다' : 'Yes, Cancel'}
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* --- ENHANCED TOP UP MODAL --- */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{t('db_topup_modal_title')}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {language === 'KO'
                              ? (topUpStep === 'AMOUNT' ? '1단계: 금액 선택' :
                                 topUpStep === 'METHOD' ? '2단계: 결제 수단' : '결제 처리 중')
                              : (topUpStep === 'AMOUNT' ? 'Step 1: Select Amount' :
                                 topUpStep === 'METHOD' ? 'Step 2: Payment Method' : 'Processing Payment')}
                        </p>
                    </div>
                    {topUpStep !== 'PROCESSING' && topUpStep !== 'SUCCESS' && (
                        <button onClick={() => setShowTopUpModal(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                <div className="p-6">
                    {/* STEP 1: AMOUNT */}
                    {topUpStep === 'AMOUNT' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">{t('db_select_amount')}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[100, 500, 1000, 5000, 10000, 50000].map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => { setTopUpAmount(amt); setCustomAmount(''); }}
                                            className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                                                topUpAmount === amt 
                                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                : 'border-slate-100 hover:border-blue-200 text-slate-600'
                                            }`}
                                        >
                                            ${amt.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('db_custom_amount')}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input 
                                        type="number" 
                                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                                        placeholder="0"
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                            setTopUpAmount(0);
                                        }}
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleAmountSelect}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                {language === 'KO' ? '계속' : 'Continue'} <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: METHOD */}
                    {topUpStep === 'METHOD' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">{language === 'KO' ? '결제 금액' : 'Total to Pay'}</span>
                                <span className="text-2xl font-bold text-blue-600">${topUpAmount.toLocaleString()}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <button 
                                    onClick={() => setPaymentMethod('CARD')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === 'CARD' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                                >
                                    <CreditCard className="w-6 h-6 mb-2" />
                                    <span className="text-xs font-bold">{language === 'KO' ? '카드' : 'Card'}</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('CRYPTO')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === 'CRYPTO' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'}`}
                                >
                                    <Wallet className="w-6 h-6 mb-2" />
                                    <span className="text-xs font-bold">{language === 'KO' ? '암호화폐' : 'Crypto'}</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('BANK')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === 'BANK' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}
                                >
                                    <Building2 className="w-6 h-6 mb-2" />
                                    <span className="text-xs font-bold">{language === 'KO' ? '계좌이체' : 'Bank'}</span>
                                </button>
                            </div>

                            {paymentMethod === 'CARD' && (
                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                                        <span>{language === 'KO' ? '4242로 끝나는 카드' : 'Card ending in 4242'}</span>
                                        <Lock className="w-3 h-3" />
                                    </div>
                                    <button onClick={processTopUp} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                        {language === 'KO' ? '지금 결제' : 'Pay Now'}
                                    </button>
                                </div>
                            )}
                            
                            {paymentMethod === 'CRYPTO' && (
                                <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=0x123`} alt={language === 'KO' ? 'QR 코드' : 'QR'} className="mx-auto mb-3 rounded-lg mix-blend-multiply" />
                                    <button onClick={processTopUp} className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors">
                                        {language === 'KO' ? '송금을 완료했습니다' : 'I have sent payment'}
                                    </button>
                                </div>
                            )}

                            {paymentMethod === 'BANK' && (
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">{language === 'KO' ? '은행' : 'Bank'}</span>
                                        <span className="font-bold">Woori Bank</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">{language === 'KO' ? '계좌번호' : 'Account'}</span>
                                        <span className="font-mono">1002-123-456789</span>
                                    </div>
                                    <button onClick={processTopUp} className="w-full mt-4 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors">
                                        {language === 'KO' ? '이체 확인' : 'Confirm Transfer'}
                                    </button>
                                </div>
                            )}
                            
                            <button onClick={() => setTopUpStep('AMOUNT')} className="w-full text-slate-400 hover:text-slate-600 text-xs font-bold">
                                {language === 'KO' ? '금액 선택으로 돌아가기' : 'Back to Amount'}
                            </button>
                        </div>
                    )}

                    {/* STEP 3: PROCESSING */}
                    {topUpStep === 'PROCESSING' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-fadeIn">
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">{language === 'KO' ? '결제 처리 중...' : 'Processing Payment...'}</h3>
                            <p className="text-slate-500 mt-2">{language === 'KO' ? '이 창을 닫지 말아 주세요.' : 'Please do not close this window.'}</p>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {topUpStep === 'SUCCESS' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-scaleUp">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{language === 'KO' ? '결제가 완료되었습니다!' : 'Payment Successful!'}</h3>
                            <p className="text-slate-500 mb-6">
                                {language === 'KO' ? (
                                    <>지갑에 <strong>${topUpAmount.toLocaleString()}</strong>이(가) 충전되었습니다.</>
                                ) : (
                                    <>Your wallet has been recharged with <strong>${topUpAmount.toLocaleString()}</strong>.</>
                                )}
                            </p>
                            <button 
                                onClick={() => setShowTopUpModal(false)}
                                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                            >
                                {language === 'KO' ? '닫기' : 'Close'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Connector Status Banner (Kept for context) */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center relative">
                 <Activity className="w-6 h-6 text-blue-400" />
                 <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
             </div>
             <div>
                 <h2 className="text-lg font-bold">{t('db_connector_active')}</h2>
                 <p className="text-slate-400 text-sm">{language === 'KO' ? '연결 ID' : 'Connection ID'}: edc-provider-kr-001 • v0.5.2</p>
             </div>
        </div>
        <div className="hidden md:block text-right">
             <p className="text-xs text-slate-400 uppercase tracking-wide">{t('db_uptime')}</p>
             <p className="text-xl font-mono font-bold text-emerald-400">99.98%</p>
        </div>
      </div>

      {/* Wallet / Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-24 h-24 text-blue-600" />
            </div>
            <div className="relative z-10">
                <p className="text-sm font-medium text-slate-500 mb-2">{t('db_balance')}</p>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                    ${balance.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-400 font-mono mb-4">{language === 'KO' ? '지갑 ID' : 'Wallet ID'}: 0x71C...9A23</p>
                
                <button 
                    onClick={openTopUpModal}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                >
                    <PlusCircle className="w-4 h-4" />
                    {t('db_topup')}
                </button>
            </div>
        </div>

        {/* Income - Clickable Report */}
        <div 
            onClick={() => setActiveReport('INCOME')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1 group-hover:text-emerald-600 transition-colors">{t('db_income')}</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        +${income.toLocaleString()}
                    </h3>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">{language === 'KO' ? '클릭하여 리포트 보기' : 'Click for report'}</p>
        </div>

        {/* Expenses - Clickable Report */}
        <div 
            onClick={() => setActiveReport('EXPENSE')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-rose-300 hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1 group-hover:text-rose-600 transition-colors">{t('db_expense')}</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        -${expense.toLocaleString()}
                    </h3>
                </div>
                <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                    <TrendingDown className="w-6 h-6 text-rose-600" />
                </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">{language === 'KO' ? '클릭하여 리포트 보기' : 'Click for report'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* My Library / Assets List */}
         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Box className="w-5 h-5 text-blue-600" />
                    {t('db_my_library')}
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {myAssets.length} {t('db_active_sub')}
                    </span>
                </h3>
             </div>

             <div className="space-y-4">
                 {myAssets.length === 0 ? (
                     <div className="text-center py-10 text-slate-400">
                         <Box className="w-12 h-12 mx-auto mb-2 opacity-50" />
                         <p>{language === 'KO' ? '아직 구매한 자산이 없습니다.' : 'No assets purchased yet.'}</p>
                     </div>
                 ) : (
                     myAssets.map((asset) => (
                         <div key={asset.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                             <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                                 <img src={asset.imageUrl} alt={assetTitle(asset, language)} className="w-full h-full object-cover" />
                             </div>
                             
                             <div className="flex-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900">{assetTitle(asset, language)}</h4>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full tracking-wide">
                                        {asset.status}
                                    </span>
                                 </div>
                                 <p className="text-xs text-slate-500 line-clamp-1">{assetDescription(asset, language)}</p>
                                 <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                     <span className="flex items-center gap-1">
                                         <Calendar className="w-3 h-3" /> {t('db_renewal')}: {asset.nextRenewal}
                                     </span>
                                     <span className="flex items-center gap-1">
                                         <CreditCard className="w-3 h-3" /> {asset.price.toLocaleString()} {asset.currency}
                                     </span>
                                 </div>
                             </div>

                             <div className="flex gap-2">
                                <button 
                                    onClick={() => handleLaunch(asset.title)}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                    {language === 'KO' ? '실행' : 'Launch'}
                                </button>
                                <button 
                                    onClick={() => { setManagingAsset(asset.id); setConfirmingCancel(false); }}
                                    className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                             </div>
                         </div>
                     ))
                 )}
             </div>
         </div>

         {/* Recent Tx */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-4">{t('db_smart_contracts')}</h3>
             <div className="space-y-4">
                 {allTransactions.slice(0, 5).map(tx => (
                     <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                         <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded bg-blue-50 flex items-center justify-center ${tx.status === 'Cancelled' ? 'text-red-600 bg-red-50' : 'text-blue-600'}`}>
                                 <Database className="w-4 h-4" />
                             </div>
                             <div>
                                 <p className="text-sm font-semibold text-slate-900">{tx.asset}</p>
                                 <p className="text-xs text-slate-500">{tx.date}</p>
                             </div>
                         </div>
                         <div className="text-right">
                             <p className="text-sm font-bold text-slate-900">${tx.amount}</p>
                             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${tx.status === 'Cancelled' ? 'text-red-600 bg-red-100' : 'text-emerald-600 bg-emerald-50'}`}>{tx.status}</span>
                         </div>
                     </div>
                 ))}
                 <div className="pt-4 border-t border-slate-100 mt-2">
                     <button 
                        onClick={() => setShowTxModal(true)}
                        className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700"
                     >
                         {t('db_view_tx')}
                     </button>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
