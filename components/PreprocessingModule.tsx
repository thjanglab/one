
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Upload, Play, Save, RotateCcw, FileSpreadsheet, Settings, ArrowRight, BarChart3, Wand2, CheckCircle2, AlertCircle, RefreshCw, FileCheck, Layers, Download, Database, Building2, Store, DollarSign, Activity, PieChart, Sliders, Workflow, Plus, Trash2, X, Cloud, Link as LinkIcon, Mail, Globe, Copy, Key } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar } from 'recharts';

const PreprocessingModule: React.FC = () => {
    const { t, language } = useLanguage();
    const [step, setStep] = useState(1); // 1: Upload, 2: Config, 3: Result
    const [userType, setUserType] = useState<'SME' | 'ENTERPRISE'>('SME');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    
    // Serverless API State for SME
    const [hostedUrl, setHostedUrl] = useState<string | null>(null);
    const [isGeneratingApi, setIsGeneratingApi] = useState(false);

    // Pipeline Steps State (Ordered List for Flowchart)
    const [flowSteps, setFlowSteps] = useState<string[]>(['Imputation', 'Outlier Removal']);

    // Detailed Configuration State
    const [config, setConfig] = useState({
        imputationMethod: 'mean', // mean, median, knn
        outlierThreshold: 3.0,
        normalizationMethod: 'minmax'
    });

    // Mock Line Chart Data (Time Series)
    const rawData = Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: Math.sin(i * 0.5) * 10 + Math.random() * 5 + (i === 5 || i === 15 ? 15 : 0), // Add noise and outliers
        clean: Math.sin(i * 0.5) * 10 + 2.5
    }));

    const processedData = rawData.map(d => ({
        time: d.time,
        value: d.value > 15 ? d.clean : d.value, // Remove outliers roughly
        processed: Math.sin(d.time * 0.5) * 10 + 2.5 // Ideal curve
    }));

    // Radar Chart Data (Data Quality Dimensions) - Now Available for SME
    const qualityData = [
        { subject: t('pp_metric_completeness'), A: 65, B: 98, fullMark: 100 },
        { subject: t('pp_metric_accuracy'), A: 50, B: 95, fullMark: 100 },
        { subject: t('pp_metric_consistency'), A: 40, B: 90, fullMark: 100 },
        { subject: t('pp_metric_uniqueness'), A: 70, B: 100, fullMark: 100 },
        { subject: t('pp_metric_validity'), A: 55, B: 92, fullMark: 100 },
    ];

    const availableTools = [
        { id: 'Imputation', label: t('pp_opt_missing'), icon: AlertCircle, color: 'text-orange-600 bg-orange-50 border-orange-200' },
        { id: 'Outlier Removal', label: t('pp_opt_outlier'), icon: Sliders, color: 'text-red-600 bg-red-50 border-red-200' },
        { id: 'Normalization', label: t('pp_opt_norm'), icon: Layers, color: 'text-purple-600 bg-purple-50 border-purple-200' },
        { id: 'Noise Reduction', label: t('pp_opt_noise'), icon: RefreshCw, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    ];

    const handleFileUpload = () => {
        // Simulate file upload
        setTimeout(() => {
            setSelectedFile('sensor_log_2024_05.csv');
            setStep(2);
        }, 800);
    };

    const toggleStep = (stepId: string) => {
        if (flowSteps.includes(stepId)) {
            setFlowSteps(prev => prev.filter(id => id !== stepId));
        } else {
            setFlowSteps(prev => [...prev, stepId]);
        }
    };

    const runPipeline = () => {
        setIsProcessing(true);
        setProgress(0);
        
        // Simulate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsProcessing(false);
                    setStep(3);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleGenerateApi = () => {
        setIsGeneratingApi(true);
        setTimeout(() => {
            setHostedUrl('https://api.korea.io/v1/sme-data/8f92a1c');
            setIsGeneratingApi(false);
        }, 1500);
    };

    const reset = () => {
        setStep(1);
        setSelectedFile(null);
        setProgress(0);
        setFlowSteps(['Imputation', 'Outlier Removal']);
        setHostedUrl(null);
    };

    // Auto-configure based on User Type
    useEffect(() => {
        if (userType === 'SME') {
            setFlowSteps(['Imputation', 'Outlier Removal', 'Normalization']);
        } else {
            // Enterprise starts with a basic set but allows more manual control
            setFlowSteps(['Imputation']);
        }
    }, [userType]);

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Wand2 className="w-8 h-8 text-blue-600" />
                        {t('pp_title')}
                    </h1>
                    <p className="text-slate-500 mt-2">{t('pp_subtitle')}</p>
                </div>
                
                {/* User Type Toggle */}
                <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                    <button 
                        onClick={() => setUserType('SME')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${userType === 'SME' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Store className="w-4 h-4" />
                        {t('pp_mode_sme')}
                    </button>
                    <button 
                        onClick={() => setUserType('ENTERPRISE')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${userType === 'ENTERPRISE' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Building2 className="w-4 h-4" />
                        {t('pp_mode_ent')}
                    </button>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center justify-center mb-8">
                <div className={`flex items-center gap-2 ${step >= 1 ? (userType === 'SME' ? 'text-blue-600' : 'text-purple-600') : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? (userType === 'SME' ? 'bg-blue-100' : 'bg-purple-100') : 'bg-slate-100'}`}>1</div>
                    <span className="font-medium text-sm">{t('pp_step_upload')}</span>
                </div>
                <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? (userType === 'SME' ? 'bg-blue-600' : 'bg-purple-600') : 'bg-slate-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? (userType === 'SME' ? 'text-blue-600' : 'text-purple-600') : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? (userType === 'SME' ? 'bg-blue-100' : 'bg-purple-100') : 'bg-slate-100'}`}>2</div>
                    <span className="font-medium text-sm">{t('pp_step_config')}</span>
                </div>
                <div className={`w-16 h-0.5 mx-4 ${step >= 3 ? (userType === 'SME' ? 'bg-blue-600' : 'bg-purple-600') : 'bg-slate-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 3 ? (userType === 'SME' ? 'text-blue-600' : 'text-purple-600') : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? (userType === 'SME' ? 'bg-blue-100' : 'bg-purple-100') : 'bg-slate-100'}`}>3</div>
                    <span className="font-medium text-sm">{t('pp_step_result')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Workflow Area */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* STEP 1: Upload */}
                    {step === 1 && (
                        <div className={`bg-white rounded-2xl border-2 border-dashed p-12 text-center transition-colors cursor-pointer group ${userType === 'SME' ? 'border-slate-300 hover:border-blue-400' : 'border-slate-300 hover:border-purple-400'}`} onClick={handleFileUpload}>
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors ${userType === 'SME' ? 'bg-blue-50 group-hover:bg-blue-100 text-blue-600' : 'bg-purple-50 group-hover:bg-purple-100 text-purple-600'}`}>
                                <Upload className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('pp_upload_drag')}</h3>
                            <p className="text-slate-500 mb-6">{t('pp_upload_desc')}</p>
                            <button className={`px-6 py-3 text-white rounded-xl font-bold transition-colors shadow-lg ${userType === 'SME' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'}`}>
                                {t('pp_btn_browse')}
                            </button>
                            <div className="mt-8 flex justify-center gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><FileSpreadsheet className="w-4 h-4" /> CSV</span>
                                <span className="flex items-center gap-1"><FileSpreadsheet className="w-4 h-4" /> Excel</span>
                                <span className="flex items-center gap-1"><Database className="w-4 h-4" /> Parquet</span>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Configuration (No-Code Flowchart) */}
                    {step === 2 && !isProcessing && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <FileCheck className="w-6 h-6 text-emerald-600" />
                                    <div>
                                        <h3 className="font-bold text-slate-900">{selectedFile}</h3>
                                        <p className="text-xs text-slate-500">12.5 MB • 24,500 Rows • 15 Columns</p>
                                    </div>
                                </div>
                                <button onClick={reset} className="text-xs text-red-500 hover:underline">{t('pp_btn_remove')}</button>
                            </div>
                            
                            <div className="p-8">
                                <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                                    <Workflow className="w-5 h-5 text-slate-500" />
                                    Pipeline Visualizer
                                </h3>

                                {/* Flowchart Canvas */}
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 overflow-x-auto">
                                    <div className="flex items-center min-w-max">
                                        {/* Start Node */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-md border-4 border-slate-100">
                                                <Database className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 uppercase">Input</span>
                                        </div>

                                        {/* Dynamic Nodes */}
                                        {flowSteps.map((stepId, index) => {
                                            const tool = availableTools.find(t => t.id === stepId) || availableTools[0];
                                            return (
                                                <React.Fragment key={index}>
                                                    {/* Arrow */}
                                                    <div className="w-12 h-0.5 bg-slate-300 relative mx-2">
                                                        <ArrowRight className="w-4 h-4 text-slate-300 absolute -right-2 -top-2" />
                                                    </div>
                                                    
                                                    {/* Processing Node */}
                                                    <div className="relative group">
                                                        <div className={`w-32 h-20 rounded-xl border flex flex-col items-center justify-center gap-1 shadow-sm bg-white ${tool.color.replace('bg-', 'hover:bg-opacity-50 ')} transition-all`}>
                                                            <tool.icon className="w-5 h-5 mb-1" />
                                                            <span className="text-xs font-bold text-center leading-tight px-1">{tool.label}</span>
                                                        </div>
                                                        {/* Remove Button (Hover) */}
                                                        <button 
                                                            onClick={() => toggleStep(stepId)}
                                                            className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })}

                                        {/* Arrow to End */}
                                        <div className="w-12 h-0.5 bg-slate-300 relative mx-2">
                                            <ArrowRight className="w-4 h-4 text-slate-300 absolute -right-2 -top-2" />
                                        </div>

                                        {/* End Node */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md border-4 border-slate-100 ${userType === 'SME' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                                                <FileCheck className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 uppercase">Output</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Tool Palette (Available Operations) */}
                                <div className="mb-8">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Available Operations</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {availableTools.map((tool) => {
                                            const isActive = flowSteps.includes(tool.id);
                                            return (
                                                <button
                                                    key={tool.id}
                                                    onClick={() => toggleStep(tool.id)}
                                                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                                                        isActive 
                                                        ? `${tool.color} ring-2 ring-offset-1 ${userType === 'SME' ? 'ring-blue-500' : 'ring-purple-500'}` 
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/50' : 'bg-slate-100'}`}>
                                                        <tool.icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="block text-xs font-bold">{tool.label}</span>
                                                        <span className="text-[10px] opacity-80">{isActive ? 'Active' : 'Add to flow'}</span>
                                                    </div>
                                                    {isActive && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Detailed Settings (Enterprise Only) */}
                                {userType === 'ENTERPRISE' && flowSteps.length > 0 && (
                                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 mb-8 animate-fadeIn">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                                            <Sliders className="w-4 h-4" />
                                            Node Configuration
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {flowSteps.includes('Imputation') && (
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Imputation Strategy</label>
                                                    <select 
                                                        className="w-full p-2 text-sm border border-slate-300 rounded bg-white focus:border-purple-500 outline-none"
                                                        value={config.imputationMethod}
                                                        onChange={(e) => setConfig({...config, imputationMethod: e.target.value})}
                                                    >
                                                        <option value="mean">Mean Substitution</option>
                                                        <option value="median">Median Substitution</option>
                                                        <option value="knn">K-Nearest Neighbors (KNN)</option>
                                                        <option value="linear">Linear Interpolation</option>
                                                    </select>
                                                </div>
                                            )}
                                            {flowSteps.includes('Outlier Removal') && (
                                                <div>
                                                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                                                        <span className="font-semibold">Z-Score Threshold</span>
                                                        <span className="font-bold text-purple-600">{config.outlierThreshold}</span>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="1" max="5" step="0.1" 
                                                        value={config.outlierThreshold}
                                                        onChange={(e) => setConfig({...config, outlierThreshold: parseFloat(e.target.value)})}
                                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <button onClick={runPipeline} className={`w-full py-4 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg ${userType === 'SME' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}>
                                    <Play className="w-5 h-5 fill-current" />
                                    {t('pp_btn_run')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Processing State */}
                    {isProcessing && (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke={userType === 'SME' ? '#3b82f6' : '#9333ea'} strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} strokeLinecap="round" className="transition-all duration-300" transform="rotate(-90 50 50)" />
                                </svg>
                                <div className={`absolute inset-0 flex items-center justify-center font-bold text-xl ${userType === 'SME' ? 'text-blue-600' : 'text-purple-600'}`}>
                                    {progress}%
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('pp_processing')}</h3>
                            <p className="text-slate-500 animate-pulse">{t('pp_processing_desc')}</p>
                        </div>
                    )}

                    {/* STEP 3: Results */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* SME: ROI Card */}
                            {userType === 'SME' && (
                                <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-emerald-900 font-bold text-lg">Estimated Savings</h3>
                                            <p className="text-emerald-700 text-sm">Manual cleaning time saved: ~12 hours</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-emerald-600">$850</p>
                                        <p className="text-xs text-emerald-500 font-bold uppercase">This Session</p>
                                    </div>
                                </div>
                            )}

                            {/* Chart Comparison (Shared) */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className={`w-5 h-5 ${userType === 'SME' ? 'text-blue-600' : 'text-purple-600'}`} />
                                    {t('pp_res_chart')}
                                </h3>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={processedData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="time" hide />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}} />
                                            <Legend />
                                            <Line type="monotone" dataKey="value" stroke="#cbd5e1" strokeWidth={2} dot={{r: 4}} name="Original Data" />
                                            <Line type="monotone" dataKey="processed" stroke={userType === 'SME' ? '#3b82f6' : '#9333ea'} strokeWidth={3} dot={false} name="Processed Data" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Radar Chart for Quality Dimensions - Now Available for ALL modes */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                                    <PieChart className={`w-5 h-5 ${userType === 'SME' ? 'text-blue-600' : 'text-purple-600'}`} />
                                    Multidimensional Quality Analysis
                                </h3>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={qualityData}>
                                            <PolarGrid stroke="#e2e8f0" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar 
                                                name="Before" 
                                                dataKey="A" 
                                                stroke="#94a3b8" 
                                                fill="#cbd5e1" 
                                                fillOpacity={0.3} 
                                            />
                                            <Radar 
                                                name="After" 
                                                dataKey="B" 
                                                stroke={userType === 'SME' ? '#3b82f6' : '#9333ea'} 
                                                fill={userType === 'SME' ? '#3b82f6' : '#a855f7'} 
                                                fillOpacity={0.5} 
                                            />
                                            <Legend />
                                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center text-xs text-slate-500 mt-2">
                                    Quality Improvement in 5 Key Dimensions
                                </div>
                            </div>

                            {/* Data Table Preview */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50">
                                    <h3 className="font-bold text-slate-900">{t('pp_res_preview')}</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3">Timestamp</th>
                                                <th className="px-6 py-3">Sensor_A (Raw)</th>
                                                <th className={`px-6 py-3 ${userType === 'SME' ? 'text-blue-600' : 'text-purple-600'}`}>Sensor_A (Clean)</th>
                                                <th className="px-6 py-3">Flag</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {processedData.slice(0, 5).map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50">
                                                    <td className="px-6 py-3 font-mono text-slate-500">2024-05-24 10:00:{10 + i}</td>
                                                    <td className="px-6 py-3 text-slate-400">{row.value.toFixed(4)}</td>
                                                    <td className={`px-6 py-3 font-bold ${userType === 'SME' ? 'text-blue-700 bg-blue-50/50' : 'text-purple-700 bg-purple-50/50'}`}>{row.processed.toFixed(4)}</td>
                                                    <td className="px-6 py-3">
                                                        {Math.abs(row.value - row.processed) > 1 ? (
                                                            <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-600 font-bold">Outlier Fixed</span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-600 font-bold">OK</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Summary & Actions */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
                        <h3 className="font-bold text-lg mb-4">{t('pp_stats_title')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Total Rows</span>
                                <span className="font-mono font-bold">24,500</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Missing Values</span>
                                <span className={`font-mono font-bold ${step === 3 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                    {step === 3 ? '0' : '1,240'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Outliers Detected</span>
                                <span className={`font-mono font-bold ${step === 3 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {step === 3 ? '0' : '856'}
                                </span>
                            </div>
                            <div className="h-px bg-slate-700 my-2"></div>
                            
                            {/* Detailed List for Enterprise */}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Quality Score</span>
                                <span className={`font-bold text-xl ${userType === 'SME' ? 'text-blue-400' : 'text-purple-400'}`}>{step === 3 ? '98.5' : '72.4'}</span>
                            </div>
                        </div>
                    </div>

                    {step === 3 && (
                        <div className="space-y-4">
                            {/* Serverless Export Options for SME */}
                            {userType === 'SME' ? (
                                <div className="space-y-3">
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                                        <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                                            <Cloud className="w-4 h-4" />
                                            Serverless Export
                                        </h4>
                                        <p className="text-xs text-blue-600 mb-3">
                                            No server? No problem. Deploy directly to cloud or generate a hosted API.
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button className="flex flex-col items-center justify-center p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                                                <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-1" />
                                                <span className="text-[10px] font-bold text-slate-700">{t('pp_export_excel')}</span>
                                            </button>
                                            <button className="flex flex-col items-center justify-center p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                                                <Cloud className="w-5 h-5 text-blue-600 mb-1" />
                                                <span className="text-[10px] font-bold text-slate-700">{t('pp_export_cloud')}</span>
                                            </button>
                                            <button className="flex flex-col items-center justify-center p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                                                <Mail className="w-5 h-5 text-purple-600 mb-1" />
                                                <span className="text-[10px] font-bold text-slate-700">{t('pp_export_email')}</span>
                                            </button>
                                            <button 
                                                onClick={handleGenerateApi}
                                                className="flex flex-col items-center justify-center p-3 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors shadow-md group"
                                            >
                                                <Globe className="w-5 h-5 text-white mb-1 group-hover:animate-pulse" />
                                                <span className="text-[10px] font-bold text-white">{t('pp_export_api')}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hosted API Result */}
                                    {(isGeneratingApi || hostedUrl) && (
                                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm animate-fadeIn">
                                            {isGeneratingApi ? (
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                                    Provisioning Serverless Endpoint...
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                                            <Globe className="w-3 h-3 text-emerald-500" />
                                                            Hosted API Ready
                                                        </span>
                                                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded p-2 mb-2">
                                                        <code className="text-[10px] text-slate-600 truncate flex-1">{hostedUrl}</code>
                                                        <button className="text-slate-400 hover:text-blue-600"><Copy className="w-3 h-3" /></button>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                        <Key className="w-3 h-3" />
                                                        <span>API Key: sk_live_...9f2</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Enterprise Actions
                                <div className="space-y-3">
                                    <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                                        <Download className="w-4 h-4" />
                                        {t('pp_btn_download')}
                                    </button>
                                    <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                        <Save className="w-4 h-4" />
                                        {t('pp_btn_save_asset')}
                                    </button>
                                </div>
                            )}
                            
                            <button onClick={reset} className="w-full py-3 text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center justify-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                {t('pp_btn_new')}
                            </button>
                        </div>
                    )}
                    
                    {/* Helper Box */}
                    <div className={`${userType === 'SME' ? 'bg-blue-50 border-blue-100' : 'bg-purple-50 border-purple-100'} p-5 rounded-xl border`}>
                        <h4 className={`font-bold text-sm mb-2 flex items-center gap-2 ${userType === 'SME' ? 'text-blue-900' : 'text-purple-900'}`}>
                            <Wand2 className="w-4 h-4" />
                            Auto-ML Suggestion
                        </h4>
                        <p className={`text-xs leading-relaxed ${userType === 'SME' ? 'text-blue-700' : 'text-purple-700'}`}>
                            {userType === 'SME' 
                                ? 'Simple cleanup is sufficient for this dataset. Click "Download" to use it in Excel.' 
                                : 'Distribution analysis suggests enabling KNN Imputation (k=5) for optimal model accuracy.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreprocessingModule;
