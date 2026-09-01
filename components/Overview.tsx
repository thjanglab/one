
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, Database, Activity, Globe, ArrowUpRight, Zap, ShieldCheck, X, TrendingUp, Network, Building2, Search, Filter, ChevronRight } from 'lucide-react';
import { MOCK_ASSETS, MOCK_COMPANIES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
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

const ecosystemData = [
  { name: 'Automotive', value: 35, color: '#3b82f6' },
  { name: 'Electronics', value: 25, color: '#8b5cf6' },
  { name: 'Energy', value: 20, color: '#f59e0b' },
  { name: 'Logistics', value: 15, color: '#10b981' },
  { name: 'Other', value: 5, color: '#64748b' },
];

// Mock Data for Popups
const REPORT_DATA = {
    PARTICIPANTS: {
        title: "Ecosystem Participants",
        total: 142,
        growth: "+12%",
        chartData: [
            { name: 'Jan', value: 80 }, { name: 'Feb', value: 95 }, { name: 'Mar', value: 110 },
            { name: 'Apr', value: 125 }, { name: 'May', value: 142 }
        ],
        companies: MOCK_COMPANIES
    },
    VOLUME: {
        title: "Data Volume Analytics",
        total: "2,450 TB",
        growth: "+5.4%",
        chartData: [
            { name: 'W1', value: 2100 }, { name: 'W2', value: 2250 }, { name: 'W3', value: 2380 }, { name: 'W4', value: 2450 }
        ],
        types: [
            { name: 'IoT Streams', value: 60, color: '#8b5cf6' },
            { name: 'Images/Video', value: 25, color: '#ec4899' },
            { name: 'Structured', value: 15, color: '#64748b' }
        ],
        recentHistory: [
            { id: 1, type: "IoT Batch", size: "125 GB", time: "10 min ago" },
            { id: 2, type: "Video Log", size: "2.4 TB", time: "1 hr ago" },
            { id: 3, type: "CAD Files", size: "500 MB", time: "2 hrs ago" }
        ]
    },
    TRANSACTIONS: {
        title: "Transaction Services Report",
        total: "$1.2M",
        growth: "+8.2%",
        chartData: [
            { name: 'Mon', value: 150 }, { name: 'Tue', value: 230 }, { name: 'Wed', value: 180 },
            { name: 'Thu', value: 290 }, { name: 'Fri', value: 200 }, { name: 'Sat', value: 90 }, { name: 'Sun', value: 60 }
        ],
        services: MOCK_ASSETS.slice(0, 5)
    },
    CONNECTIVITY: {
        title: "Global Connectivity Status",
        regions: 32,
        nodes: 156,
        uptime: "99.99%",
        mapUrl: "vendor-images/photo-1451187580459-43490279c0fa-w600.jpg",
        countries: ["South Korea", "Germany", "USA", "Japan", "Vietnam", "Singapore"]
    }
};

const Overview: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [activeReport, setActiveReport] = useState<keyof typeof REPORT_DATA | null>(null);
    const [showAllCompanies, setShowAllCompanies] = useState(false);
    const [companySearch, setCompanySearch] = useState('');

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
                                <p className="text-xs text-slate-400">Real-time System Metrics</p>
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
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Metric</p>
                                <h3 className="text-3xl font-bold text-slate-900">{(data as any).total || (data as any).regions}</h3>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Growth Rate</p>
                                <h3 className="text-3xl font-bold text-emerald-600">{(data as any).growth || (data as any).uptime}</h3>
                            </div>
                        </div>

                        {/* Visualization Logic */}
                        {activeReport === 'CONNECTIVITY' ? (
                            <div className="space-y-6">
                                <div className="rounded-xl overflow-hidden relative h-48 border border-slate-200 shadow-inner">
                                    <img src={(data as any).mapUrl} className="w-full h-full object-cover" alt="Global Map" />
                                    <div className="absolute inset-0 bg-blue-900/20"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping mb-2"></div>
                                        <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur">
                                            {(data as any).nodes} Active Nodes
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-2">Connected Regions</h4>
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
                                <div className="h-64 w-full bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-center relative">
                                    <h4 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase">Industry Distribution</h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={ecosystemData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {ecosystemData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-bold text-slate-800">Top 5 Partners</h4>
                                        <button 
                                            onClick={() => setShowAllCompanies(true)}
                                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            View Full List <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(data as any).companies.map((comp: any) => (
                                            <div key={comp.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">
                                                    {comp.logo}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-slate-800">{comp.name}</div>
                                                    <div className="text-xs text-slate-500">{comp.industry}</div>
                                                </div>
                                                <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">{comp.productsCount} Assets</span>
                                            </div>
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
                                <h4 className="text-sm font-bold text-slate-800 mb-3">Recent Transfer Log</h4>
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
                                <h4 className="text-sm font-bold text-slate-800 mb-3">Top Traded Services</h4>
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
                            Close Report
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
            {showAllCompanies && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp flex flex-col max-h-[85vh]">
                        <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <Building2 className="w-6 h-6" />
                                <h2 className="text-xl font-bold">Participating Companies</h2>
                            </div>
                            <button onClick={() => setShowAllCompanies(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search by company name, industry..." 
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                                    value={companySearch}
                                    onChange={(e) => setCompanySearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Dynamically generate more mock companies for demo */}
                                {[...MOCK_COMPANIES, ...MOCK_COMPANIES, ...MOCK_COMPANIES].map((company, idx) => ({...company, id: `${company.id}_${idx}`}))
                                    .filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()) || c.industry.toLowerCase().includes(companySearch.toLowerCase()))
                                    .map((company, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 shadow-sm transition-all group">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                                                {company.logo}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-slate-900 truncate">{company.name}</h4>
                                                <p className="text-xs text-slate-500 truncate">{company.industry}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{company.description}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">Items: {company.productsCount}</span>
                                            <button className="text-xs font-bold text-blue-600 hover:underline">Profile</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-slate-200 bg-white text-right">
                            <button onClick={() => setShowAllCompanies(false)} className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200">
                                Close
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
                        <h3 className="text-2xl font-bold text-slate-900">142</h3>
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
                        <h3 className="text-2xl font-bold text-slate-900">32 Regions</h3>
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
                                <Area type="monotone" dataKey="download" stackId="1" stroke="#3b82f6" fill="url(#colorDown)" name="Download (MB)" />
                                <Area type="monotone" dataKey="upload" stackId="1" stroke="#10b981" fill="url(#colorUp)" name="Upload (MB)" />
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
                        <p className="text-sm text-slate-500">{t('ov_highest_growth')} <span className="font-semibold text-slate-900">Automotive</span> {t('ov_sector')}</p>
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
