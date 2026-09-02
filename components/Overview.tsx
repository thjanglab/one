
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, Database, Activity, Globe, ArrowUpRight, Zap, ShieldCheck, X, TrendingUp, Network, Building2, Search, Filter, ChevronRight } from 'lucide-react';
import { MOCK_ASSETS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { DIRECTORY, SECTOR_LABELS, lookupOrg, sectorOf } from '../directory';
import type { Sector } from '../directory';
import OrgProfileModal from './OrgProfileModal';
import TransactionMap from './TransactionMap';

const trafficData = [
  { name: '00:00', upload: 240, download: 400 },
  { name: '04:00', upload: 139, download: 300 },
  { name: '08:00', upload: 980, download: 1200 },
  { name: '12:00', upload: 390, download: 800 },
  { name: '16:00', upload: 480, download: 950 },
  { name: '20:00', upload: 380, download: 500 },
  { name: '23:59', upload: 250, download: 430 },
];

// Fixed order, never cycled. The tail folds into "Other" rather than
// generating a ninth hue.
const SHARE_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#0ea5e9'];

/**
 * Industry split of the actual directory, so the chart, the headline count and
 * the participant list all describe the same set of organisations.
 */
const getEcosystemData = (language: string) => {
  const counts = new Map<Sector, number>();
  DIRECTORY.forEach((org) => counts.set(org.sector, (counts.get(org.sector) ?? 0) + 1));
  const ranked = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, 5);
  const restTotal = ranked.slice(5).reduce((sum, [, n]) => sum + n, 0);
  const rows = top.map(([sec, n], i) => ({
    name: SECTOR_LABELS[sec][language === 'KO' ? 'ko' : 'en'],
    value: n,
    color: SHARE_COLORS[i],
  }));
  if (restTotal > 0) {
    rows.push({ name: language === 'KO' ? '기타' : 'Other', value: restTotal, color: '#64748b' });
  }
  return rows;
};

// Mock Data for Popups
const getReportData = (language: string) => ({
    PARTICIPANTS: {
        title: language === 'KO' ? "에코시스템 참여 기업" : "Ecosystem Participants",
        total: DIRECTORY.length,
        growth: "+12%",
        chartData: [
            { name: language === 'KO' ? '1월' : 'Jan', value: 80 },
            { name: language === 'KO' ? '2월' : 'Feb', value: 95 },
            { name: language === 'KO' ? '3월' : 'Mar', value: 110 },
            { name: language === 'KO' ? '4월' : 'Apr', value: 125 },
            { name: language === 'KO' ? '5월' : 'May', value: DIRECTORY.length }
        ],
        companies: DIRECTORY.filter((o) => o.summary).slice(0, 5)
    },
    VOLUME: {
        title: language === 'KO' ? "데이터 볼륨 분석" : "Data Volume Analytics",
        total: "2,450 TB",
        growth: "+5.4%",
        chartData: [
            { name: language === 'KO' ? '1주차' : 'W1', value: 2100 },
            { name: language === 'KO' ? '2주차' : 'W2', value: 2250 },
            { name: language === 'KO' ? '3주차' : 'W3', value: 2380 },
            { name: language === 'KO' ? '4주차' : 'W4', value: 2450 }
        ],
        types: [
            { name: language === 'KO' ? 'IoT 스트림' : 'IoT Streams', value: 60, color: '#8b5cf6' },
            { name: language === 'KO' ? '이미지/영상' : 'Images/Video', value: 25, color: '#ec4899' },
            { name: language === 'KO' ? '정형 데이터' : 'Structured', value: 15, color: '#64748b' }
        ],
        recentHistory: [
            { id: 1, type: language === 'KO' ? "IoT 배치 전송" : "IoT Batch", size: "125 GB", time: language === 'KO' ? "10분 전" : "10 min ago" },
            { id: 2, type: language === 'KO' ? "영상 로그" : "Video Log", size: "2.4 TB", time: language === 'KO' ? "1시간 전" : "1 hr ago" },
            { id: 3, type: language === 'KO' ? "CAD 파일" : "CAD Files", size: "500 MB", time: language === 'KO' ? "2시간 전" : "2 hrs ago" }
        ]
    },
    TRANSACTIONS: {
        title: language === 'KO' ? "거래 서비스 리포트" : "Transaction Services Report",
        total: "$1.2M",
        growth: "+8.2%",
        chartData: [
            { name: language === 'KO' ? '월' : 'Mon', value: 150 },
            { name: language === 'KO' ? '화' : 'Tue', value: 230 },
            { name: language === 'KO' ? '수' : 'Wed', value: 180 },
            { name: language === 'KO' ? '목' : 'Thu', value: 290 },
            { name: language === 'KO' ? '금' : 'Fri', value: 200 },
            { name: language === 'KO' ? '토' : 'Sat', value: 90 },
            { name: language === 'KO' ? '일' : 'Sun', value: 60 }
        ],
        services: MOCK_ASSETS.slice(0, 5)
    },
    CONNECTIVITY: {
        title: language === 'KO' ? "글로벌 연결 현황" : "Global Connectivity Status",
        regions: 32,
        nodes: 156,
        uptime: "99.99%",
        mapUrl: "vendor-images/photo-1451187580459-43490279c0fa-w600.jpg",
        countries: language === 'KO'
            ? ["대한민국", "독일", "미국", "일본", "베트남", "싱가포르"]
            : ["South Korea", "Germany", "USA", "Japan", "Vietnam", "Singapore"]
    }
});

type ReportKey = keyof ReturnType<typeof getReportData>;

const Overview: React.FC = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [activeReport, setActiveReport] = useState<ReportKey | null>(null);
    const [showAllCompanies, setShowAllCompanies] = useState(false);
    const [participantSector, setParticipantSector] = useState<Sector | 'All'>('All');
    const [openOrg, setOpenOrg] = useState<string | null>(null);
    const [companySearch, setCompanySearch] = useState('');

    const ecosystemData = getEcosystemData(language);
    const REPORT_DATA = getReportData(language);

    const renderReportContent = () => {
        if (!activeReport) return null;
        const data = REPORT_DATA[activeReport];

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col relative">
                    <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{data.title}</h2>
                                <p className="text-xs text-slate-400">{language === 'KO' ? '실시간 시스템 지표' : 'Real-time System Metrics'}</p>
                            </div>
                        </div>
                        <button onClick={() => setActiveReport(null)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="p-8 overflow-y-auto">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">{language === 'KO' ? '전체 지표' : 'Total Metric'}</p>
                                <h3 className="text-3xl font-bold text-slate-900">{(data as any).total || (data as any).regions}</h3>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-600 uppercase mb-1">{language === 'KO' ? '성장률' : 'Growth Rate'}</p>
                                <h3 className="text-3xl font-bold text-emerald-600">{(data as any).growth || (data as any).uptime}</h3>
                            </div>
                        </div>

                        {/* Visualization Logic */}
                        {activeReport === 'CONNECTIVITY' ? (
                            <div className="space-y-6">
                                <div className="rounded-xl overflow-hidden relative h-48 border border-slate-200 shadow-inner">
                                    <img src={(data as any).mapUrl} className="w-full h-full object-cover" alt={language === 'KO' ? '글로벌 지도' : 'Global Map'} />
                                    <div className="absolute inset-0 bg-blue-900/20"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping mb-2"></div>
                                        <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur">
                                            {language === 'KO' ? `활성 노드 ${(data as any).nodes}개` : `${(data as any).nodes} Active Nodes`}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-2">{language === 'KO' ? '연결된 국가' : 'Connected Regions'}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(data as any).countries.map((c: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 font-bold border border-slate-200">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : activeReport === 'PARTICIPANTS' ? (
                            <div className="space-y-6">
                                {/* Seventeen sectors is too many for a donut - the tail would
                                    collapse into an "Other" wedge larger than any real one. Ranked
                                    bars show every sector at its own size, directly labelled. */}
                                {(() => {
                                    const isKo = language === 'KO';
                                    const rows = Array.from(
                                        DIRECTORY.reduce((acc, org) => acc.set(org.sector, (acc.get(org.sector) ?? 0) + 1), new Map<Sector, number>())
                                    ).sort((a, b) => b[1] - a[1]);
                                    const max = rows[0]?.[1] ?? 1;
                                    return (
                                        <div className="w-full bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">{isKo ? '산업별 분포' : 'Industry Distribution'}</h4>
                                            <ul className="space-y-2">
                                                {rows.map(([sec, n]) => (
                                                    <li key={sec} className="flex items-center gap-3">
                                                        <span className="w-28 shrink-0 text-xs text-slate-600 truncate">{SECTOR_LABELS[sec][isKo ? 'ko' : 'en']}</span>
                                                        <span className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <span className="block h-full bg-indigo-500 rounded-full transition-all duration-700"
                                                                style={{ width: `${(n / max) * 100}%` }} />
                                                        </span>
                                                        <span className="w-8 shrink-0 text-right text-xs font-mono tabular-nums text-slate-700">{n}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })()}
                                
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-bold text-slate-800">{language === 'KO' ? '주요 파트너 TOP 5' : 'Top 5 Partners'}</h4>
                                        <button 
                                            onClick={() => { setCompanySearch(''); setParticipantSector('All'); setShowAllCompanies(true); }}
                                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            {language === 'KO' ? '전체 목록 보기' : 'View Full List'} <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(data as any).companies.map((comp: any) => (
                                            <button
                                                key={comp.name}
                                                type="button"
                                                onClick={() => setOpenOrg(comp.name)}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200 shrink-0">
                                                    {comp.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="text-sm font-bold text-slate-800 truncate">{language === 'KO' ? (comp.nameKo || comp.name) : comp.name}</div>
                                                    <div className="text-xs text-slate-500 truncate">{SECTOR_LABELS[comp.sector as Sector][language === 'KO' ? 'ko' : 'en']}</div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 w-full bg-white border border-slate-100 rounded-xl p-4 shadow-sm mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={(data as any).chartData}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Lists / Breakdowns for other reports */}
                        {activeReport === 'VOLUME' && (
                            <div className="mt-6">
                                <h4 className="text-sm font-bold text-slate-800 mb-3">{language === 'KO' ? '최근 전송 이력' : 'Recent Transfer Log'}</h4>
                                <div className="space-y-2">
                                    {(data as any).recentHistory.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-xs">
                                            <div className="flex items-center gap-2">
                                                <Database className="w-3 h-3 text-slate-400" />
                                                <span className="font-bold text-slate-700">{item.type}</span>
                                            </div>
                                            <span className="text-slate-500">{item.size}</span>
                                            <span className="text-slate-400">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeReport === 'TRANSACTIONS' && (
                            <div className="mt-6">
                                <h4 className="text-sm font-bold text-slate-800 mb-3">{language === 'KO' ? '거래 상위 서비스' : 'Top Traded Services'}</h4>
                                <div className="space-y-2">
                                    {(data as any).services.map((asset: any) => (
                                        <div key={asset.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg border-b border-slate-100 last:border-0">
                                            <span className="text-sm font-medium text-slate-700">{asset.title}</span>
                                            <span className="text-xs font-bold text-emerald-600">{asset.price.toLocaleString()} {asset.currency}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4 border-t border-slate-200 bg-slate-50 text-right shrink-0">
                        <button onClick={() => setActiveReport(null)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
                            {language === 'KO' ? '리포트 닫기' : 'Close Report'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 relative">
            {renderReportContent()}

            {/* FULL COMPANY LIST MODAL */}
            {openOrg && (
                <OrgProfileModal name={openOrg} onClose={() => setOpenOrg(null)} />
            )}

            {showAllCompanies && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp flex flex-col max-h-[85vh]">
                        <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <Building2 className="w-6 h-6" />
                                <h2 className="text-xl font-bold">{language === 'KO' ? '참여 기업 전체' : 'Participating Companies'}</h2>
                            </div>
                            <button onClick={() => setShowAllCompanies(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {(() => {
                            const isKo = language === 'KO';
                            const label = (sec: Sector) => SECTOR_LABELS[sec][isKo ? 'ko' : 'en'];
                            const sectors: Sector[] = Array.from(new Set<Sector>(DIRECTORY.map((o) => o.sector)))
                                .sort((a, b) => label(a).localeCompare(label(b)));
                            const countIn = (sec: Sector) => DIRECTORY.filter((o) => o.sector === sec).length;
                            const q = companySearch.trim().toLowerCase();
                            const shown = DIRECTORY.filter((org) => {
                                if (participantSector !== 'All' && org.sector !== participantSector) return false;
                                if (!q) return true;
                                // Match either language, so a Korean query finds an English record.
                                return [org.name, org.nameKo, org.summary, org.summaryKo, label(org.sector)]
                                    .filter(Boolean).join(' ').toLowerCase().includes(q);
                            });

                            return (
                                <>
                                    <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3 shrink-0">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder={isKo ? '기업·기관명, 산업 분야로 검색...' : 'Search by name or industry...'}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                                                value={companySearch}
                                                onChange={(e) => setCompanySearch(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            <button
                                                onClick={() => setParticipantSector('All')}
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                                                    participantSector === 'All'
                                                        ? 'bg-slate-900 text-white border-slate-900'
                                                        : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                                                }`}
                                            >
                                                {isKo ? '전체' : 'All'} <span className="opacity-60">{DIRECTORY.length}</span>
                                            </button>
                                            {sectors.map((sec) => (
                                                <button
                                                    key={sec}
                                                    onClick={() => setParticipantSector(sec)}
                                                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                                                        participantSector === sec
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300'
                                                    }`}
                                                >
                                                    {label(sec)} <span className="opacity-60">{countIn(sec)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                                        {shown.length === 0 ? (
                                            <p className="text-sm text-slate-500 text-center py-12">
                                                {isKo ? '조건에 맞는 기업·기관이 없습니다.' : 'No organisation matches those filters.'}
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {shown.map((org) => (
                                                    <button
                                                        key={org.name}
                                                        type="button"
                                                        onClick={() => setOpenOrg(org.name)}
                                                        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 shadow-sm transition-all group text-left flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                                    >
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 shrink-0">
                                                                {org.name.charAt(0)}
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <h4 className="font-bold text-slate-900 truncate">{isKo ? (org.nameKo || org.name) : org.name}</h4>
                                                                <p className="text-xs text-slate-500 truncate">{label(org.sector)}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">
                                                            {(isKo ? org.summaryKo : org.summary)
                                                                ?? (isKo ? '해외 파트너 기관입니다.' : 'An overseas partner.')}
                                                        </p>
                                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 w-full">
                                                            <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                                                                {org.hq ? (isKo ? org.hqKo : org.hq) : (isKo ? '해외' : 'Overseas')}
                                                            </span>
                                                            <span className="text-xs font-bold text-blue-600 group-hover:underline">
                                                                {isKo ? '프로필' : 'Profile'}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                        
                        <div className="p-4 border-t border-slate-200 bg-white text-right">
                            <button onClick={() => setShowAllCompanies(false)} className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200">
                                {language === 'KO' ? '닫기' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('ov_title')}</h1>
                    <p className="text-slate-500 mt-1">{t('ov_subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        {t('ov_network_op')}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                        Block: #14,205,992
                    </span>
                </div>
            </div>

            {/* KPI Cards - CLICKABLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div onClick={() => setActiveReport('PARTICIPANTS')} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{DIRECTORY.length}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('ov_part_comp')}</p>
                    </div>
                </div>

                <div onClick={() => setActiveReport('VOLUME')} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Database className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +5.4%
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">2,450 TB</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('ov_total_data')}</p>
                    </div>
                </div>

                <div onClick={() => setActiveReport('TRANSACTIONS')} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 cursor-pointer hover:border-orange-400 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                            <Activity className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +8.2%
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">$1.2M</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('ov_monthly_tx')}</p>
                    </div>
                </div>

                <div onClick={() => setActiveReport('CONNECTIVITY')} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                            <Globe className="w-5 h-5 text-slate-600" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{language === 'KO' ? '32개 지역' : '32 Regions'}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('ov_global_conn')}</p>
                    </div>
                </div>
            </div>

            {/* LIVE TRANSACTION MAP (NEW MODULE) */}
            <TransactionMap />

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">{t('ov_network_traffic')}</h3>
                        <select className="text-xs border-slate-200 rounded-md bg-slate-50 px-2 py-1 text-slate-600">
                            <option>{t('ov_last_24h')}</option>
                            <option>{t('ov_last_7d')}</option>
                            <option>{t('ov_last_30d')}</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}} />
                                <Area type="monotone" dataKey="download" stackId="1" stroke="#3b82f6" fill="url(#colorDown)" name={language === 'KO' ? '다운로드 (MB)' : 'Download (MB)'} />
                                <Area type="monotone" dataKey="upload" stackId="1" stroke="#10b981" fill="url(#colorUp)" name={language === 'KO' ? '업로드 (MB)' : 'Upload (MB)'} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Industry Breakdown */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">{t('ov_industry_share')}</h3>
                    <div className="h-60 w-full mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ecosystemData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fontSize: 11, fill: '#64748b'}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-500">{t('ov_highest_growth')} <span className="font-semibold text-slate-900">{language === 'KO' ? '자동차' : 'Automotive'}</span> {t('ov_sector')}</p>
                    </div>
                </div>
            </div>

            {/* Recent Assets / Bottom Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">{t('ov_new_assets')}</h3>
                    <button 
                        onClick={() => navigate('/marketplace')}
                        className="text-sm text-blue-600 font-medium hover:text-blue-700"
                    >
                        {t('ov_view_all')}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {MOCK_ASSETS.slice(0, 4).map((asset) => (
                        <div key={asset.id} className="p-5 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate(`/asset/${asset.id}`)}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    asset.type === 'AI_MODEL' ? 'bg-purple-100 text-purple-700' : 
                                    asset.type === 'DIGITAL_TWIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {asset.type.replace('_', ' ')}
                                </span>
                                {asset.certified && <ShieldCheck className="w-3 h-3 text-blue-500" />}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 truncate">{asset.title}</h4>
                            <p className="text-xs text-slate-500 mb-3 truncate">{asset.provider}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-800">{asset.price.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{asset.currency.split('/')[0]}</span></span>
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600">
                                    <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Overview;
