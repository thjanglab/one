
import React, { useState, useEffect } from 'react';
import { MOCK_PCF_PRODUCTS, MOCK_DPP_INSPECTIONS, MOCK_DATA_TRANSACTIONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, ArrowRight, ExternalLink, Search, FileText, CheckCircle2, Shirt, Car, Factory, Globe, Droplets, Wind, Recycle, Tag, MapPin, Award, Layers, Map, Anchor, Truck, Building2, BadgeCheck, Leaf, QrCode, Smartphone, Battery, Cpu, Monitor, Hammer, Wrench, ShieldCheck, RefreshCw, Zap, ChevronRight, Database, X, Clock, PenTool, Hash, Download, FileJson, Link as LinkIcon, Blocks, Eye, Copy, Check, LayoutDashboard, Info, Settings, Stamp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DPPModule: React.FC = () => {
    const { t } = useLanguage();
    const [activeIndustry, setActiveIndustry] = useState<'AUTO' | 'TEXTILE' | 'ELECTRONICS'>('AUTO');
    const [textileTab, setTextileTab] = useState<'PASSPORT' | 'CHAIN'>('PASSPORT');
    const [autoTab, setAutoTab] = useState<'DASHBOARD' | 'CHAIN'>('DASHBOARD');
    const [selectedStage, setSelectedStage] = useState<number | null>(null);
    const [selectedAutoNode, setSelectedAutoNode] = useState<string | null>(null);
    
    // Certificate Modal State
    const [certificateStep, setCertificateStep] = useState<any | null>(null);

    // PCF Integration State
    const [selectedPcfId, setSelectedPcfId] = useState<string | null>(null);

    // Electronics State
    const [elecComponent, setElecComponent] = useState<'BATTERY' | 'SCREEN' | 'PCB' | 'CASING'>('BATTERY');
    const [showRepairModal, setShowRepairModal] = useState(false);
    const [showBlockchainModal, setShowBlockchainModal] = useState(false);
    const [blockVisualMode, setBlockVisualMode] = useState<'VISUAL' | 'JSON'>('VISUAL');
    const [isHashing, setIsHashing] = useState(false);

    // --- Mock Data for Textile ---
    const textileProduct = {
        name: "Eco-Loop Recycled Hoodie V2",
        id: "TEX-24-8821",
        brand: "Re:Wear",
        batch: "RW-2024-Q3-005",
        image: "vendor-images/photo-1556905055-8f358a7a47b2-w600.jpg",
        description: "Made from 85% post-consumer recycled cotton. Fully traceable from fiber to fashion.",
        composition: [
            { name: 'Recycled Cotton', value: 85, color: '#10b981' },
            { name: 'Organic Cotton', value: 10, color: '#3b82f6' },
            { name: 'Elastane', value: 5, color: '#f59e0b' },
        ],
        journey: [
            { 
                id: 1,
                stage: 'Raw Fiber Collection', 
                location: 'Izmir, Turkey', 
                company: 'Global Fibers Ltd.', 
                date: '2023.12.10', 
                icon: <Recycle className="w-4 h-4" />,
                x: 200, y: 150, // Map coordinates
                facilityId: "FAC-TR-992",
                audit: "GOTS Certified",
                desc: "Certified organic cotton farm using drip irrigation systems to minimize water usage.",
                co2: "0.8 kg",
                water: "120 L"
            },
            { 
                id: 2,
                stage: 'Yarn Spinning', 
                location: 'Da Nang, Vietnam', 
                company: 'SpinTex Vina', 
                date: '2024.01.15', 
                icon: <Layers className="w-4 h-4" />,
                x: 600, y: 300,
                facilityId: "FAC-VN-881",
                audit: "SA8000 Passed",
                desc: "High-efficiency spinning mill powered by 40% on-site solar energy.",
                co2: "1.2 kg",
                water: "40 L"
            },
            { 
                id: 3,
                stage: 'Fabric Knitting', 
                location: 'Daegu, Korea', 
                company: 'K-Textile Co.', 
                date: '2024.02.20', 
                icon: <Factory className="w-4 h-4" />,
                x: 720, y: 140,
                facilityId: "FAC-KR-102",
                audit: "Oeko-Tex Std 100",
                desc: "Zero-liquid-discharge dyeing and knitting facility ensuring no chemical runoff.",
                co2: "0.9 kg",
                water: "250 L"
            },
            { 
                id: 4,
                stage: 'Garment Assembly', 
                location: 'Seoul, Korea', 
                company: 'Re:Wear Mfg.', 
                date: '2024.03.05', 
                icon: <Shirt className="w-4 h-4" />,
                x: 700, y: 110,
                facilityId: "FAC-KR-001",
                audit: "ISO 9001/14001",
                desc: "Final assembly, quality control, and packaging using recycled materials.",
                co2: "0.3 kg",
                water: "10 L"
            },
        ],
        impact: {
            water: '450L',
            waterSavings: '92%',
            co2: '3.2kg',
            co2Savings: '45%',
            circularity: 'A+'
        },
        certs: ['GRS (Global Recycled Std)', 'Oeko-Tex 100', 'PETA Vegan']
    };

    // --- Derived Data for Auto ---
    const activeAutoProduct = selectedPcfId 
        ? MOCK_PCF_PRODUCTS.find(p => p.id === selectedPcfId) 
        : MOCK_PCF_PRODUCTS[0];

    // Enhanced Mock Data for Hyundai Automotive Map
    const HYUNDAI_CHAIN_NODES = [
        { id: 'oem', label: 'Hyundai Motor', type: 'OEM', x: 700, y: 250, co2: '12,500', status: 'Active', location: 'Ulsan, KR', desc: 'Final Assembly Plant. Manufactures IONIQ 5, GV60.', icon: Car },
        { id: 't1_1', label: 'Hyundai Mobis', type: 'Tier 1', x: 500, y: 150, co2: '4,200', status: 'Active', location: 'Seoul, KR', desc: 'Chassis, Cockpit, and Frontend modules.', icon: Layers },
        { id: 't1_2', label: 'LG Energy Sol', type: 'Tier 1', x: 500, y: 350, co2: '8,500', status: 'Active', location: 'Ochang, KR', desc: 'High-performance EV Battery Packs.', icon: Battery },
        { id: 't2_1', label: 'Hyundai WIA', type: 'Tier 2', x: 300, y: 100, co2: '2,800', status: 'Active', location: 'Changwon, KR', desc: 'Engine parts and constant velocity joints.', icon: Settings },
        { id: 't2_2', label: 'HL Mando', type: 'Tier 2', x: 300, y: 200, co2: '1,500', status: 'Pending', location: 'Pyeongtaek, KR', desc: 'Brake, Steering, and Suspension systems.', icon: Disc },
        { id: 't3_1', label: 'POSCO', type: 'Tier 3', x: 100, y: 250, co2: '15,000', status: 'Active', location: 'Pohang, KR', desc: 'Automotive Steel Sheets & Coils.', icon: Hammer },
    ];

    // Connections for Animation
    const HYUNDAI_CHAIN_LINKS = [
        { id: 'l1', start: 't3_1', end: 't2_1', path: "M 100 250 C 150 250, 150 100, 300 100" },
        { id: 'l2', start: 't3_1', end: 't2_2', path: "M 100 250 C 150 250, 150 200, 300 200" },
        { id: 'l3', start: 't2_1', end: 't1_1', path: "M 300 100 C 350 100, 350 150, 500 150" },
        { id: 'l4', start: 't2_2', end: 't1_1', path: "M 300 200 C 350 200, 350 150, 500 150" },
        { id: 'l5', start: 't1_1', end: 'oem', path: "M 500 150 C 550 150, 550 250, 700 250" },
        { id: 'l6', start: 't1_2', end: 'oem', path: "M 500 350 C 550 350, 550 250, 700 250" },
    ];

    // Helper icon for Mando
    function Disc(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg> }

    // --- Mock Data for Electronics ---
    const elecProduct = {
        name: "Galaxy S25 Ultra - Eco Edition",
        id: "EL-2025-X992",
        manufacturer: "Samsung Electronics",
        image: "vendor-images/photo-1610945415295-d9bbf067e59c-w800.jpg", 
        metrics: {
            repairability: 9.2,
            recyclability: 95,
            carbon: 42.8
        },
        components: {
            SCREEN: {
                name: "Dynamic AMOLED 3X Infinity-O",
                supplier: "Samsung Display",
                location: "Asan, Korea",
                pcf: "4.8 kgCO2e",
                material: ["Gorilla Glass Victus 3", "OLED Organic (Korea)"],
                status: "Normal",
                passport: "DISP-PASS-205",
                icon: <Monitor className="w-5 h-5" />,
                details: "Next-gen LTPO technology with 1-144Hz variable refresh rate. 100% recycled glass."
            },
            PCB: {
                name: "Logic Board (Snapdragon 8 Gen 4)",
                supplier: "TSMC",
                location: "Hsinchu, Taiwan",
                pcf: "3.5 kgCO2e",
                material: ["Gold (Conflict-Free)", "Silicon", "Recycled Copper"],
                status: "Normal",
                passport: "PCB-PASS-601",
                icon: <Cpu className="w-5 h-5" />,
                details: "3nm process node. Conflict-free mineral certified (3TG) with full traceability."
            },
            BATTERY: {
                name: "Solid-State Ready Battery (5500mAh)",
                supplier: "Samsung SDI",
                location: "Ulsan, Korea",
                pcf: "11.2 kgCO2e",
                material: ["Lithium (Chile)", "Cobalt (Recycled)"],
                status: "Normal",
                cycles: 1500,
                passport: "BATT-PASS-991",
                icon: <Battery className="w-5 h-5" />,
                details: "Post-consumer recycled cobalt 25%. Enhanced energy density and safety."
            },
            CASING: {
                name: "Titanium & Ocean Plastic Frame",
                supplier: "Intops",
                location: "Gumi, Korea",
                pcf: "1.5 kgCO2e",
                material: ["Recycled Al (95%)", "Titanium Grade 5", "Ocean Plastic"],
                status: "Normal",
                passport: "CASE-PASS-442",
                icon: <Smartphone className="w-5 h-5" />,
                details: "CNC machined with 100% renewable energy. Incorporates recycled fishing nets."
            }
        }
    };

    // --- Repair Data Mock ---
    const repairData = {
        difficulty: "Moderate",
        time: "35 mins",
        tools: ["Phillips #00", "Spudger", "Suction Handle", "Heat Gun"],
        parts: [
            { name: "Replacement Battery (Part #B-25U)", stock: "Available", price: "$55.00" },
            { name: "Adhesive Strips (Eco)", stock: "In Stock", price: "$6.50" }
        ],
        steps: [
            "Power off the device and apply low heat to the titanium back cover.",
            "Use a suction handle and pick to separate the back cover (improved adhesive).",
            "Remove the 12 Phillips screws securing the wireless charging coil.",
            "Disconnect the battery flex cable (orange).",
            "Use pull-tabs to easily remove the battery (no prying needed)."
        ]
    };

    // --- Blockchain History Mock ---
    const blockchainHistory = [
        { hash: "0x8b...a123", block: 15205501, time: "2025-01-10 09:22:10", action: "Creation", actor: "Samsung Mfg" },
        { hash: "0x4c...9d55", block: 15205523, time: "2025-01-12 14:15:00", action: "Transfer", actor: "Global Logistics" },
        { hash: "0x2e...ff88", block: 15205601, time: "2025-01-15 10:40:33", action: "Retail Stock", actor: "BestBuy Warehouse" },
        { hash: "0x1a...3b22", block: 15205882, time: "2025-01-20 16:05:22", action: "Activation", actor: "End User" }
    ];

    const latestBlockData = {
        blockNumber: 15205882,
        timestamp: "2025-01-20T16:05:22Z",
        transactions: [
            {
                hash: "0x1a...3b22",
                from: "0xConsumerWallet",
                to: "0xContractAddress",
                input: "0xActivate(AssetID=EL-2025-X992)"
            }
        ],
        validator: "Node-KR-03",
        gasUsed: "21500",
        stateRoot: "0x7d...b8f1"
    };

    // Trigger hashing animation when modal opens
    useEffect(() => {
        if (showBlockchainModal) {
            setIsHashing(true);
            const timer = setTimeout(() => setIsHashing(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showBlockchainModal]);

    // Value Chain Nodes
    const chainNodes = [
        { id: 'raw', label: 'Raw Material', icon: Globe, color: 'text-slate-400', border: 'border-slate-300', bg: 'bg-slate-50', x: '10%' },
        { id: 'mfg', label: 'Component Mfg', icon: Factory, color: 'text-blue-600', border: 'border-blue-500', bg: 'bg-blue-50', x: '35%' },
        { id: 'asm', label: 'Assembly', icon: Smartphone, color: 'text-purple-600', border: 'border-purple-500', bg: 'bg-purple-50', x: '60%' },
        { id: 'rec', label: 'Recycling', icon: Recycle, color: 'text-emerald-600', border: 'border-emerald-500', bg: 'bg-emerald-50', x: '85%' }
    ];

    return (
        <div className="space-y-8 animate-fadeIn pb-12 relative">
            
            {/* Industry Toggle */}
            <div className="flex justify-center mb-4">
                <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex gap-2">
                    <button 
                        onClick={() => setActiveIndustry('AUTO')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            activeIndustry === 'AUTO' 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Car className="w-4 h-4" />
                        Automotive
                    </button>
                    <button 
                        onClick={() => setActiveIndustry('ELECTRONICS')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            activeIndustry === 'ELECTRONICS' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Smartphone className="w-4 h-4" />
                        Electronics
                    </button>
                    <button 
                        onClick={() => setActiveIndustry('TEXTILE')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            activeIndustry === 'TEXTILE' 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Shirt className="w-4 h-4" />
                        Textile & Fashion
                    </button>
                </div>
            </div>

            {/* Certificate Modal */}
            {certificateStep && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setCertificateStep(null)}>
                    <div 
                        className="bg-[#fffdf5] rounded-xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-scaleUp border-8 border-double border-slate-200 p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Custom Style for Stamp Animation */}
                        <style>{`
                            @keyframes stamp {
                                0% { opacity: 0; transform: scale(2) rotate(-10deg); }
                                100% { opacity: 1; transform: scale(1) rotate(-10deg); }
                            }
                        `}</style>

                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                            <BadgeCheck className="w-64 h-64 text-slate-900" />
                        </div>

                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-slate-900 rounded-tl-none"></div>
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-slate-900 rounded-tr-none"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-slate-900 rounded-bl-none"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-slate-900 rounded-br-none"></div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-wider uppercase">Certificate</h2>
                                <p className="text-sm font-serif text-slate-500 italic">of Compliance</p>
                            </div>

                            <div className="w-full h-px bg-slate-300"></div>

                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 uppercase tracking-widest">This certifies that</p>
                                <h3 className="text-2xl font-bold text-blue-900 font-serif">{certificateStep.company}</h3>
                                <p className="text-sm text-slate-600">{certificateStep.location}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Has successfully met the standards for</p>
                                <div className="bg-emerald-50 border border-emerald-200 px-6 py-3 rounded-lg">
                                    <h4 className="text-xl font-bold text-emerald-800 flex items-center justify-center gap-2">
                                        <ShieldCheck className="w-6 h-6" />
                                        {certificateStep.audit}
                                    </h4>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 w-full pt-4">
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-400 uppercase">Facility ID</p>
                                    <p className="font-mono text-sm font-bold text-slate-700">{certificateStep.facilityId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase">Issue Date</p>
                                    <p className="font-mono text-sm font-bold text-slate-700">{certificateStep.date}</p>
                                </div>
                            </div>

                            {/* Animated Stamp */}
                            <div className="absolute bottom-4 right-8 transform rotate-[-12deg]" style={{ animation: 'stamp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards', opacity: 0 }}>
                                <div className="w-24 h-24 border-4 border-red-700 rounded-full flex items-center justify-center p-1">
                                    <div className="w-full h-full border-2 border-red-700 rounded-full flex flex-col items-center justify-center text-red-700 font-bold uppercase text-[10px] tracking-widest bg-red-700/5">
                                        <span>Verified</span>
                                        <span className="text-lg">Passed</span>
                                        <span>InterX</span>
                                    </div>
                                </div>
                            </div>

                            {/* Signature */}
                            <div className="pt-8 w-full flex justify-center">
                                <div className="border-t border-slate-400 px-8 pt-2">
                                    <p className="font-serif text-2xl text-slate-800 -rotate-2 italic">John Doe</p>
                                    <p className="text-[10px] text-slate-400 uppercase mt-1">Authorized Signature</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setCertificateStep(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            {/* Textile Sub-Tabs */}
            {activeIndustry === 'TEXTILE' && (
                <div className="flex justify-center mb-8">
                    <div className="flex gap-6 border-b border-slate-200 w-full max-w-4xl justify-center">
                        <button 
                            onClick={() => setTextileTab('PASSPORT')}
                            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                                textileTab === 'PASSPORT' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <FileText className="w-4 h-4" /> Product Passport
                        </button>
                        <button 
                            onClick={() => setTextileTab('CHAIN')}
                            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                                textileTab === 'CHAIN' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Map className="w-4 h-4" /> Connected Supply Chain
                        </button>
                    </div>
                </div>
            )}

            {/* Auto Sub-Tabs */}
            {activeIndustry === 'AUTO' && (
                <div className="flex justify-center mb-8">
                    <div className="flex gap-6 border-b border-slate-200 w-full max-w-4xl justify-center">
                        <button 
                            onClick={() => setAutoTab('DASHBOARD')}
                            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                                autoTab === 'DASHBOARD' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard & Stats
                        </button>
                        <button 
                            onClick={() => setAutoTab('CHAIN')}
                            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                                autoTab === 'CHAIN' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Map className="w-4 h-4" /> Supply Chain Map
                        </button>
                    </div>
                </div>
            )}

            {/* --- TEXTILE VIEW --- */}
            {activeIndustry === 'TEXTILE' && (
                <div className="max-w-4xl mx-auto">
                    
                    {/* VIEW 1: PRODUCT PASSPORT */}
                    {textileTab === 'PASSPORT' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                            {/* Left: Product Identity Card */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative">
                                    {/* Image Area */}
                                    <div className="h-96 relative bg-slate-100">
                                        <img src={textileProduct.image} alt={textileProduct.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                                            DPP ID: {textileProduct.id}
                                        </div>
                                        <div className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                            <Recycle className="w-3 h-3" /> {textileProduct.impact.circularity} Score
                                        </div>
                                    </div>
                                    
                                    {/* Info Area */}
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 leading-tight">{textileProduct.name}</h2>
                                                <p className="text-slate-500 text-sm mt-1">{textileProduct.brand} • Batch: {textileProduct.batch}</p>
                                            </div>
                                            <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                                                <ExternalLink className="w-5 h-5 text-slate-600" />
                                            </button>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                            {textileProduct.description}
                                        </p>

                                        {/* Composition Chart */}
                                        <div className="mb-6">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Material Composition</h4>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-24 relative">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie 
                                                                data={textileProduct.composition} 
                                                                innerRadius={25} 
                                                                outerRadius={40} 
                                                                paddingAngle={5} 
                                                                dataKey="value"
                                                            >
                                                                {textileProduct.composition.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                ))}
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div className="flex-1 space-y-2 text-xs">
                                                    {textileProduct.composition.map((comp, idx) => (
                                                        <div key={idx} className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: comp.color}}></div>
                                                                <span className="text-slate-600 font-medium">{comp.name}</span>
                                                            </div>
                                                            <span className="font-bold text-slate-900">{comp.value}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Certifications */}
                                        <div className="flex flex-wrap gap-2">
                                            {textileProduct.certs.map((cert, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 flex items-center gap-1">
                                                    <Award className="w-3 h-3 text-emerald-500" /> {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Traceability & Impact */}
                            <div className="space-y-6">
                                
                                {/* Impact Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between h-32">
                                        <div className="flex justify-between items-start">
                                            <span className="text-blue-900 font-bold text-sm">Water Footprint</span>
                                            <Droplets className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <span className="text-3xl font-bold text-blue-700">{textileProduct.impact.water}</span>
                                            <div className="text-[10px] text-blue-600 bg-white/50 px-2 py-1 rounded inline-block mt-1">
                                                Saved {textileProduct.impact.waterSavings} vs Avg
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-32">
                                        <div className="flex justify-between items-start">
                                            <span className="text-slate-900 font-bold text-sm">Carbon Footprint</span>
                                            <Wind className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <span className="text-3xl font-bold text-slate-700">{textileProduct.impact.co2}</span>
                                            <div className="text-[10px] text-slate-500 bg-white px-2 py-1 rounded inline-block mt-1 border border-slate-100">
                                                Saved {textileProduct.impact.co2Savings}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Supply Chain Journey Map */}
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-indigo-600" />
                                        Product Journey
                                    </h3>
                                    <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                                        {textileProduct.journey.map((step, index) => (
                                            <div key={index} className="relative pl-6">
                                                {/* Dot */}
                                                <div className="absolute -left-[23px] top-0 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full z-10"></div>
                                                
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{step.stage}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{step.date}</span>
                                                </div>
                                                <h4 className="font-bold text-slate-900 text-sm">{step.company}</h4>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                                    <MapPin className="w-3 h-3" />
                                                    {step.location}
                                                </div>
                                                
                                                {/* Connector Line Fill for completed steps (all completed in this view) */}
                                                <div className="absolute -left-[17px] top-4 h-full w-0.5 bg-indigo-100 -z-0" style={{display: index === textileProduct.journey.length - 1 ? 'none' : 'block'}}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                        <button 
                                            onClick={() => setTextileTab('CHAIN')}
                                            className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors"
                                        >
                                            View Full Map & Chain <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* End of Life */}
                                <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                                        <Recycle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900 text-sm">End-of-Life Instructions</h4>
                                        <p className="text-xs text-emerald-700 mt-1">
                                            This product is designed for circularity. Scan the QR code to return it for recycling and get 15% off your next purchase.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* VIEW 2: SUPPLY CHAIN MAP & DETAILS */}
                    {textileTab === 'CHAIN' && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Map Container */}
                            <div className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden relative h-[450px] shadow-2xl group">
                                {/* 1. Background Image - Enhanced Visibility */}
                                <img
                                    src="vendor-images/photo-1451187580459-43490279c0fa-w1200.jpg"
                                    alt="World Map"
                                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                                />

                                {/* 2. Dark Overlay for contrast */}
                                <div className="absolute inset-0 bg-slate-900/60 pointer-events-none"></div>

                                {/* 3. Grid Overlay */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                                     style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
                                </div>

                                <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-full border border-slate-600">
                                    <span className="text-white text-xs font-bold flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-emerald-400" /> Global Tracing
                                    </span>
                                </div>

                                <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                        <marker id="mapArrow" markerWidth="10" markerHeight="10" refX="22" refY="3" orient="auto" markerUnits="strokeWidth">
                                            <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
                                        </marker>
                                        <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {/* Paths */}
                                    {textileProduct.journey.slice(0, -1).map((step, idx) => {
                                        const next = textileProduct.journey[idx + 1];
                                        return (
                                            <g key={`path-${idx}`}>
                                                <path 
                                                    d={`M${step.x},${step.y} Q${(step.x + next.x)/2},${Math.min(step.y, next.y) - 50} ${next.x},${next.y}`}
                                                    fill="none"
                                                    stroke="url(#pathGradient)"
                                                    strokeWidth="3"
                                                    strokeDasharray="6 4"
                                                    markerEnd="url(#mapArrow)"
                                                    filter="url(#glow)"
                                                >
                                                    <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
                                                </path>
                                            </g>
                                        )
                                    })}

                                    {/* Nodes */}
                                    {textileProduct.journey.map((step, idx) => (
                                        <g 
                                            key={step.id} 
                                            onClick={() => setSelectedStage(step.id === selectedStage ? null : step.id)}
                                            className="cursor-pointer hover:opacity-90 transition-opacity"
                                        >
                                            <circle cx={step.x} cy={step.y} r={selectedStage === step.id ? 8 : 5} fill={selectedStage === step.id ? "#ffffff" : "#10b981"} stroke="#ffffff" strokeWidth="2" />
                                            <circle cx={step.x} cy={step.y} r={selectedStage === step.id ? 14 : 10} fill="none" stroke={selectedStage === step.id ? "#ffffff" : "#10b981"} strokeWidth="1" opacity="0.5">
                                                <animate attributeName="r" from={selectedStage === step.id ? 14 : 10} to={selectedStage === step.id ? 20 : 16} dur="1.5s" repeatCount="indefinite" />
                                                <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                                            </circle>
                                            
                                            {/* Label Box (Improved Contrast) */}
                                            <foreignObject x={step.x - 60} y={step.y + 15} width="120" height="60">
                                                <div className="text-center">
                                                    <span className="block text-[10px] font-bold text-white bg-slate-900/90 border border-slate-600 px-2 py-1 rounded shadow-lg truncate">{step.location}</span>
                                                    <span className="block text-[9px] text-white font-bold mt-0.5 drop-shadow-md">{step.stage}</span>
                                                </div>
                                            </foreignObject>
                                        </g>
                                    ))}
                                </svg>
                            </div>

                            {/* Supplier List */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-slate-500" />
                                    Supplier Network
                                </h3>
                                <div className="space-y-4">
                                    {textileProduct.journey.map((step) => (
                                        <div 
                                            key={step.id} 
                                            className={`bg-white rounded-xl border p-6 flex flex-col md:flex-row gap-6 transition-all duration-300 ${
                                                selectedStage === step.id 
                                                ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500 bg-emerald-50/10' 
                                                : 'border-slate-200 hover:border-emerald-300'
                                            }`}
                                            onClick={() => setSelectedStage(step.id)}
                                        >
                                            <div className="flex items-start gap-4 md:w-1/3">
                                                <div className={`p-3 rounded-lg ${selectedStage === step.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    {step.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{step.company}</h4>
                                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {step.location}
                                                    </p>
                                                    <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                                                        ID: {step.facilityId}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Process Description</span>
                                                <p className="text-sm text-slate-700 leading-snug">{step.desc}</p>
                                                <div className="flex gap-4 mt-3">
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400">Carbon</span>
                                                        <span className="text-sm font-bold text-slate-800">{step.co2}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400">Water</span>
                                                        <span className="text-sm font-bold text-slate-800">{step.water}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center items-start">
                                                <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Compliance & Audit</span>
                                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100">
                                                    <BadgeCheck className="w-4 h-4" />
                                                    {step.audit}
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCertificateStep(step);
                                                    }}
                                                    className="text-[10px] text-blue-600 font-bold mt-2 hover:underline flex items-center gap-1 group"
                                                >
                                                    View Certificate <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- ELECTRONICS VIEW (ENHANCED) --- */}
            {activeIndustry === 'ELECTRONICS' && (
                <div className="animate-fadeIn max-w-6xl mx-auto">
                    {/* Header Summary */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                        <div className="w-full md:w-1/3 relative z-10 flex justify-center">
                            <div className="relative group">
                                <img src={elecProduct.image} alt={elecProduct.name} className="h-64 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105" />
                                {/* Hotspot Badge */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border border-slate-200">
                                    <Smartphone className="w-3 h-3 text-blue-600" />
                                    {elecProduct.id}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Electronics</span>
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Verified by DataSpace
                                </span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{elecProduct.name}</h2>
                            <p className="text-slate-500 mb-6 flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> {elecProduct.manufacturer}
                            </p>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-slate-500 text-xs font-bold uppercase">
                                        <Wrench className="w-3 h-3" /> Repairability
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">{elecProduct.metrics.repairability}<span className="text-sm text-slate-400">/10</span></div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-slate-500 text-xs font-bold uppercase">
                                        <Recycle className="w-3 h-3" /> Recyclability
                                    </div>
                                    <div className="text-2xl font-bold text-emerald-600">{elecProduct.metrics.recyclability}<span className="text-sm text-slate-400">%</span></div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-slate-500 text-xs font-bold uppercase">
                                        <Wind className="w-3 h-3" /> Carbon Footprint
                                    </div>
                                    <div className="text-2xl font-bold text-slate-800">{elecProduct.metrics.carbon}<span className="text-sm text-slate-400">kg</span></div>
                                </div>
                            </div>
                        </div>
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-0 opacity-50"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Exploded View / Component Selector */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-blue-600" />
                                Component Anatomy
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(elecProduct.components).map(([key, data]) => {
                                    const isSelected = elecComponent === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setElecComponent(key as any)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
                                                isSelected 
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105' 
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:shadow-md'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
                                                {React.cloneElement(data.icon as React.ReactElement, { className: `w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-500'}` })}
                                            </div>
                                            <div className="flex-1">
                                                <span className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5">{key}</span>
                                                <span className="block font-bold text-sm">{data.name}</span>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
                                <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                                    <Hammer className="w-4 h-4" /> Repair Guide
                                </h4>
                                <p className="text-xs text-blue-600 mb-3">
                                    Official repair manuals and spare parts list available via Digital Product Passport.
                                </p>
                                <button 
                                    onClick={() => setShowRepairModal(true)}
                                    className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Access Repair Hub
                                </button>
                            </div>
                        </div>

                        {/* Right: Component Passport Detail */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            {elecProduct.components[elecComponent].icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{elecProduct.components[elecComponent].name}</h3>
                                            <p className="text-xs text-slate-500">ID: {elecProduct.components[elecComponent].passport}</p>
                                        </div>
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Authenticated
                                    </span>
                                </div>

                                <div className="p-8 flex-1 space-y-8">
                                    {/* Map & Supplier */}
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    <Factory className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Supplier</span>
                                                    <span className="text-base font-bold text-slate-900 block">{elecProduct.components[elecComponent].supplier}</span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" /> {elecProduct.components[elecComponent].location}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="h-px bg-slate-100"></div>

                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    <Leaf className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Environmental Impact</span>
                                                    <span className="text-base font-bold text-slate-900 block">{elecProduct.components[elecComponent].pcf}</span>
                                                    <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">ISO 14067 Verified</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Material Composition */}
                                        <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                                                <Database className="w-4 h-4" /> Material Composition & Sourcing
                                            </h4>
                                            <ul className="space-y-3">
                                                {elecProduct.components[elecComponent].material.map((mat, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                        {mat}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-4 pt-3 border-t border-slate-200">
                                                <p className="text-xs text-slate-500 leading-snug">
                                                    {elecProduct.components[elecComponent].details}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ENHANCED Value Chain Traceability (Animated) */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Value Chain Traceability</h4>
                                        <div className="relative h-24 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center">
                                            {/* Animated SVG Line */}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6" />
                                                <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 6" className="animate-dash-slow" />
                                                {/* Moving Particle */}
                                                <circle r="4" fill="#3b82f6">
                                                    <animateMotion dur="4s" repeatCount="indefinite" path="M 80 30 L 720 30" calcMode="linear" />
                                                </circle>
                                            </svg>
                                            
                                            <div className="flex justify-between w-full px-12 relative z-10">
                                                {chainNodes.map((node, index) => (
                                                    <div key={node.id} className="group relative flex flex-col items-center cursor-pointer">
                                                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-all duration-300 hover:scale-110 shadow-sm ${node.border} ${node.color} ${index === 1 ? 'animate-pulse ring-2 ring-offset-2 ring-blue-100' : ''}`}>
                                                            <node.icon className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500 mt-2 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{node.label}</span>
                                                        
                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg w-24 text-center pointer-events-none z-20">
                                                            Status: Verified<br/>Loc: {['Chile','Taiwan','Korea','Korea'][index]}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
                                    <button 
                                        onClick={() => {
                                            setShowBlockchainModal(true);
                                            setBlockVisualMode('VISUAL');
                                        }}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1"
                                    >
                                        Full Blockchain History <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- REPAIR HUB MODAL --- */}
            {showRepairModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Wrench className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Official Repair Guide</h3>
                                    <p className="text-xs text-slate-500">{elecProduct.name} - {elecComponent}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowRepairModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                                    <span className="block text-xs font-bold text-orange-500 uppercase mb-1">Difficulty</span>
                                    <span className="text-lg font-bold text-orange-700">{repairData.difficulty}</span>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                                    <span className="block text-xs font-bold text-blue-500 uppercase mb-1">Est. Time</span>
                                    <span className="text-lg font-bold text-blue-700">{repairData.time}</span>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center cursor-pointer hover:bg-emerald-100 transition-colors">
                                    <span className="block text-xs font-bold text-emerald-500 uppercase mb-1">Manual</span>
                                    <span className="text-lg font-bold text-emerald-700 flex items-center justify-center gap-1">
                                        <Download className="w-4 h-4" /> PDF
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <PenTool className="w-4 h-4 text-slate-500" /> Required Tools
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {repairData.tools.map((tool, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>

                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-slate-500" /> Spare Parts
                                    </h4>
                                    <div className="space-y-2">
                                        {repairData.parts.map((part, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                                                <div>
                                                    <div className="text-sm font-bold text-slate-700">{part.name}</div>
                                                    <div className="text-xs text-emerald-600 font-medium">{part.stock}</div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">{part.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4">Repair Steps</h4>
                                    <div className="space-y-4">
                                        {repairData.steps.map((step, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm text-slate-600 leading-snug">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                            <button onClick={() => setShowRepairModal(false)} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                Close Guide
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- BLOCKCHAIN MODAL --- */}
            {showBlockchainModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Database className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Blockchain Ledger History</h3>
                                    <p className="text-xs text-slate-400 font-mono">Asset ID: {elecProduct.components[elecComponent].passport}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowBlockchainModal(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-0 overflow-y-auto flex-1 bg-slate-50">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white border-b border-slate-200 text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">Transaction Hash</th>
                                            <th className="px-6 py-4">Block</th>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4">Action</th>
                                            <th className="px-6 py-4">Actor</th>
                                            <th className="px-6 py-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {blockchainHistory.map((tx, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-blue-600">{tx.hash}</td>
                                                <td className="px-6 py-4 text-slate-600 font-mono text-xs">#{tx.block}</td>
                                                <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-slate-400" /> {tx.time}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-800">{tx.action}</td>
                                                <td className="px-6 py-4 text-slate-600">{tx.actor}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                                        Confirmed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Latest Block Data - Enhanced Visualization */}
                            <div className="p-8 border-t border-slate-200 bg-slate-50">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Blocks className="w-4 h-4 text-slate-500" />
                                        Latest Block Visualization
                                    </h4>
                                    <div className="bg-white rounded-lg p-1 border border-slate-200 flex gap-1">
                                        <button 
                                            onClick={() => setBlockVisualMode('VISUAL')}
                                            className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${blockVisualMode === 'VISUAL' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            Visual Card
                                        </button>
                                        <button 
                                            onClick={() => setBlockVisualMode('JSON')}
                                            className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${blockVisualMode === 'JSON' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            Raw JSON
                                        </button>
                                    </div>
                                </div>

                                {blockVisualMode === 'VISUAL' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                                        {/* Block Card */}
                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden relative">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                                            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold">
                                                        #{latestBlockData.blockNumber.toString().slice(-2)}
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Block Height</span>
                                                        <span className="font-mono font-bold text-slate-800">{latestBlockData.blockNumber}</span>
                                                    </div>
                                                </div>
                                                <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded font-mono">{latestBlockData.timestamp}</span>
                                            </div>
                                            <div className="p-5 space-y-4">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">State Root</span>
                                                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                                                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                                        <code className="text-xs text-purple-600 truncate flex-1">{latestBlockData.stateRoot}</code>
                                                        <Copy className="w-3 h-3 text-slate-400 cursor-pointer hover:text-purple-600" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-3 border border-slate-100 rounded-lg text-center bg-white shadow-sm">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Transactions</span>
                                                        <span className="text-xl font-bold text-slate-800">1,245</span>
                                                    </div>
                                                    <div className="p-3 border border-slate-100 rounded-lg text-center bg-white shadow-sm">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Gas Used</span>
                                                        <span className="text-xl font-bold text-slate-800">{latestBlockData.gasUsed}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-mono">
                                                Validator: {latestBlockData.validator}
                                            </div>
                                        </div>

                                        {/* Merkle Tree / Data Structure Visual */}
                                        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-5 relative overflow-hidden flex flex-col items-center justify-center text-center">
                                            {/* Background Matrix Effect */}
                                            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                                                 style={{backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                                            </div>
                                            
                                            <div className="relative z-10 w-full">
                                                <div className="text-[10px] text-emerald-400 font-mono mb-4 uppercase tracking-widest">Merkle Tree Verification</div>
                                                
                                                {/* Tree Structure */}
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500 rounded-lg flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                                        <Hash className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex justify-center w-full gap-8 relative">
                                                        {/* Connector Lines */}
                                                        <svg className="absolute -top-4 left-0 w-full h-8 pointer-events-none stroke-emerald-500/30" strokeWidth="1">
                                                            <path d="M 160 32 L 80 0" />
                                                            <path d="M 160 32 L 240 0" />
                                                        </svg>
                                                        <div className="w-8 h-8 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-slate-400 text-xs">Tx1</div>
                                                        <div className="w-8 h-8 bg-emerald-900/50 border border-emerald-500 rounded flex items-center justify-center text-emerald-400 text-xs animate-pulse">Tx2</div>
                                                        <div className="w-8 h-8 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-slate-400 text-xs">Tx3</div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 bg-black/40 p-3 rounded-lg border border-slate-700 text-left">
                                                    <div className="text-[9px] text-slate-400 font-mono mb-1">Hash Generating...</div>
                                                    <div className="font-mono text-xs text-emerald-400 truncate">
                                                        {isHashing ? 
                                                            Array(40).fill(0).map(() => Math.random().toString(36)[2]).join('') : 
                                                            "e3b0c44298fc1c149afbf4c8996fb92427ae41e46"
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner h-64 border border-slate-700 animate-fadeIn">
                                        <pre>{JSON.stringify(latestBlockData, null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- AUTOMOTIVE VIEW --- */}
            {activeIndustry === 'AUTO' && (
                <>
                    {/* NEW TAB CONTENT: Supply Chain Map */}
                    {autoTab === 'CHAIN' && (
                        <div className="animate-fadeIn space-y-6 flex gap-6">
                            {/* MAP AREA */}
                            <div className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden relative h-[600px] shadow-2xl flex-1">
                                {/* ... Map SVG ... */}
                                <svg className="w-full h-full" viewBox="0 0 800 500">
                                    {/* ... Nodes & Links ... */}
                                    {/* Simplified for brevity - contains map rendering logic */}
                                    <defs>
                                        <marker id="arrowAuto" markerWidth="10" markerHeight="10" refX="22" refY="3" orient="auto" markerUnits="strokeWidth">
                                            <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                                        </marker>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {/* Links */}
                                    {HYUNDAI_CHAIN_LINKS.map((link) => (
                                        <g key={link.id}>
                                            <path 
                                                id={`path-${link.id}`}
                                                d={link.path} 
                                                stroke="#475569" 
                                                strokeWidth="2" 
                                                fill="none" 
                                                strokeDasharray="4 4"
                                            />
                                            <circle r="3" fill="#60a5fa" filter="url(#glow)">
                                                <animateMotion dur="3s" repeatCount="indefinite">
                                                    <mpath href={`#path-${link.id}`} />
                                                </animateMotion>
                                            </circle>
                                        </g>
                                    ))}

                                    {/* Nodes */}
                                    {HYUNDAI_CHAIN_NODES.map(node => (
                                        <g 
                                            key={node.id} 
                                            onClick={() => setSelectedAutoNode(node.id)}
                                            className="cursor-pointer hover:opacity-90 group"
                                        >
                                            {selectedAutoNode === node.id && (
                                                <circle cx={node.x} cy={node.y} r="35" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow opacity-50" />
                                            )}
                                            <circle cx={node.x} cy={node.y} r="25" fill={node.type === 'OEM' ? '#3b82f6' : node.type === 'Tier 1' ? '#10b981' : node.type === 'Tier 2' ? '#8b5cf6' : '#f59e0b'} stroke="#fff" strokeWidth="2" />
                                            <foreignObject x={node.x - 10} y={node.y - 10} width="20" height="20" className="pointer-events-none">
                                                <div className="flex items-center justify-center h-full text-white">
                                                    <node.icon size={14} />
                                                </div>
                                            </foreignObject>
                                            <foreignObject x={node.x - 60} y={node.y + 30} width="120" height="50">
                                                <div className="text-center group-hover:-translate-y-1 transition-transform">
                                                    <span className="block text-[10px] font-bold text-white bg-slate-900/70 rounded px-2 py-0.5 border border-slate-700 backdrop-blur">{node.label}</span>
                                                    <span className="block text-[8px] text-slate-300 mt-0.5">{node.type}</span>
                                                </div>
                                            </foreignObject>
                                        </g>
                                    ))}
                                </svg>
                            </div>

                            {/* DETAIL PANEL */}
                            <div className={`w-80 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${selectedAutoNode ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-10 pointer-events-none'}`}>
                                {selectedAutoNode ? (
                                    <>
                                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                                            <div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white mb-2 inline-block ${
                                                    HYUNDAI_CHAIN_NODES.find(n => n.id === selectedAutoNode)?.type === 'OEM' ? 'bg-blue-600' : 
                                                    HYUNDAI_CHAIN_NODES.find(n => n.id === selectedAutoNode)?.type === 'Tier 1' ? 'bg-emerald-500' : 'bg-slate-500'
                                                }`}>
                                                    {HYUNDAI_CHAIN_NODES.find(n => n.id === selectedAutoNode)?.type}
                                                </span>
                                                <h3 className="text-lg font-bold text-slate-900">{HYUNDAI_CHAIN_NODES.find(n => n.id === selectedAutoNode)?.label}</h3>
                                            </div>
                                            <button onClick={() => setSelectedAutoNode(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                                        </div>
                                        <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Facility Info</h4>
                                                <div className="space-y-2 text-sm text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                        {HYUNDAI_CHAIN_NODES.find(n => n.id === selectedAutoNode)?.location}
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                                                        {HYUNDAI_CHAIN_NODES.find(n => n.id === selectedAutoNode)?.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Sustainability (PCF)</h4>
                                                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                                    <div className="p-2 bg-white rounded-full text-emerald-600 shadow-sm">
                                                        <Leaf className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-lg font-bold text-emerald-900">{HYUNDAI_CHAIN_NODES.find(n => n.id === selectedAutoNode)?.co2}</span>
                                                        <span className="text-[10px] text-emerald-700 block">kgCO2e / yr</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Compliance Status</h4>
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100 flex items-center gap-1">
                                                        <ShieldCheck className="w-3 h-3" /> ISO 14001
                                                    </span>
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded border border-slate-200">
                                                        K.Manufacturing-X
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                                            <button className="text-xs font-bold text-blue-600 hover:underline flex items-center justify-center gap-1">
                                                View Full Profile <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                                        <Info className="w-12 h-12 mb-2 opacity-20" />
                                        <p className="text-sm">Select a node to view details</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* EXISTING DASHBOARD CONTENT */}
                    {autoTab === 'DASHBOARD' && (
                        <>
                            {/* 1. Supply Chain Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-8 animate-fadeIn">
                                {/* Me (Hanguk Mold) */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center relative overflow-hidden">
                                    <div className="relative z-10">
                                        <span className="inline-block px-2 py-0.5 bg-emerald-400 text-white text-[10px] font-bold rounded-full mb-2">Me</span>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Company</div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">HANGUK MOLD</h3>
                                        <p className="text-xs text-slate-500">www.hkmold.com</p>
                                        <p className="text-xs text-slate-500">ID#34EF56A</p>
                                    </div>
                                    <div className="w-24 h-12 flex items-center justify-center border border-slate-200 rounded p-1">
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-blue-900 flex items-center justify-center text-white font-bold text-[8px] p-0.5">HG</div>
                                            <span className="font-bold text-blue-900 text-xs">HANGUKMOLD</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Transmission Arrow */}
                                <div className="flex flex-col items-center justify-center text-emerald-500 gap-2">
                                    <div className="px-4 py-1.5 bg-emerald-400 text-white text-xs font-bold rounded-full shadow-sm">Data transmission</div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                        <div className="h-0.5 w-16 bg-emerald-400"></div>
                                        <ArrowRight className="w-5 h-5 fill-current" />
                                    </div>
                                </div>

                                {/* Sub Tier (Hyundai) */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center relative overflow-hidden">
                                    <div className="relative z-10">
                                        <span className="inline-block px-2 py-0.5 bg-slate-600 text-white text-[10px] font-bold rounded-full mb-2">Sub Tier</span>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Company</div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">HYUNDAI</h3>
                                        <p className="text-xs text-slate-500">www.hyundai.com</p>
                                        <p className="text-xs text-slate-500">ID#75AC872</p>
                                    </div>
                                    <div className="w-24 h-12 flex items-center justify-center border border-slate-200 rounded p-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-black flex items-center justify-center rounded-full">
                                                <span className="text-white font-sans font-bold text-sm leading-none">H</span>
                                            </div>
                                            <span className="font-bold text-slate-900 text-xs">HYUNDAI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-px bg-slate-200 my-8"></div>

                            {/* 2. Product Carbon Footprint (LCA) - From PCFModule */}
                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                        <Leaf className="w-6 h-6 text-emerald-500" />
                                        Product Carbon Footprint (LCA)
                                    </h2>
                                    {selectedPcfId && (
                                        <button 
                                            onClick={() => setSelectedPcfId(null)}
                                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Back to List
                                        </button>
                                    )}
                                </div>

                                {/* CONTENT: List or Detail */}
                                {!selectedPcfId ? (
                                    /* PCF PRODUCT LIST */
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                            <h3 className="font-bold text-slate-900">Product List</h3>
                                            <div className="relative">
                                                <input type="text" placeholder="search" className="pl-8 pr-4 py-1.5 rounded border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
                                                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
                                                <tr>
                                                    <th className="px-6 py-4">NO</th>
                                                    <th className="px-6 py-4">Product</th>
                                                    <th className="px-6 py-4">Product ID</th>
                                                    <th className="px-6 py-4 text-right">CO2EQ [kg/prd]</th>
                                                    <th className="px-6 py-4">Last update</th>
                                                    <th className="px-6 py-4 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {MOCK_PCF_PRODUCTS.map((p, idx) => (
                                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedPcfId(p.id)}>
                                                        <td className="px-6 py-4 text-slate-400">{MOCK_PCF_PRODUCTS.length - idx}</td>
                                                        <td className="px-6 py-4 font-medium text-slate-700">{p.name}</td>
                                                        <td className="px-6 py-4 text-slate-500">{p.id}</td>
                                                        <td className="px-6 py-4 text-right font-bold text-slate-900">{p.co2PerUnit}</td>
                                                        <td className="px-6 py-4 text-slate-500">{p.lastUpdate}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            {p.status === 'YES' && <span className="inline-block px-3 py-1 bg-emerald-400 text-white text-xs font-bold rounded-full">YES</span>}
                                                            {p.status === 'DONE' && <span className="inline-block px-3 py-1 bg-slate-200 text-slate-500 text-xs font-bold rounded-full">DONE</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    /* PCF DETAIL VIEW */
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                                        {/* Left: Product Info & Image */}
                                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                            <span className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full mb-6 uppercase tracking-wider">Selected Product</span>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-8">{activeAutoProduct?.name}</h2>
                                            
                                            <div className="w-full max-w-sm mb-8 relative">
                                                <img src={activeAutoProduct?.imageUrl} alt={activeAutoProduct?.name} className="w-full h-auto object-contain" />
                                            </div>

                                            <div className="w-full space-y-3 text-sm">
                                                <div className="flex justify-between py-2 border-b border-slate-50">
                                                    <span className="text-emerald-500 font-medium">Product ID</span>
                                                    <span className="font-bold text-slate-900">HKMOLD-{activeAutoProduct?.id}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-slate-50">
                                                    <span className="text-emerald-500 font-medium">P/N</span>
                                                    <span className="font-bold text-slate-900">{activeAutoProduct?.partNumber}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-slate-50">
                                                    <span className="text-emerald-500 font-medium">Production time</span>
                                                    <span className="font-bold text-slate-900">{activeAutoProduct?.productionTime}</span>
                                                </div>
                                            </div>

                                            <div className="mt-8 text-center">
                                                <span className="text-emerald-500 font-medium text-sm">CO2eq</span>
                                                <div className="text-6xl font-bold text-slate-900 my-1">{activeAutoProduct?.co2PerUnit}</div>
                                                <span className="text-slate-400 font-medium">kg/ea</span>
                                            </div>

                                            <div className="mt-8 bg-slate-900 rounded-2xl p-4 w-full max-w-[160px] flex flex-col items-center shadow-lg">
                                                <div className="bg-white p-2 rounded-lg w-full aspect-square flex items-center justify-center overflow-hidden">
                                                    <img 
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://korea.io/dpp/product/${activeAutoProduct?.id}`}
                                                        alt="DPP QR Code" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="mt-2 text-white font-bold flex items-center gap-1.5">
                                                    <span className="text-sm">DPP</span>
                                                    <QrCode className="w-3 h-3 text-emerald-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Visualization & Tier Chain */}
                                        <div className="space-y-6">
                                            {/* Sankey Diagram Card */}
                                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                                                <div className="flex justify-center mb-4">
                                                    <span className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full uppercase tracking-wider">Product Carbon Footprint</span>
                                                </div>
                                                
                                                <div className="relative h-64 w-full flex items-center justify-center mt-4">
                                                    {/* Vehicle (Source) */}
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 text-center z-10">
                                                        <img src={activeAutoProduct?.imageUrl} className="w-32 h-20 object-cover mb-2 rounded-lg shadow-sm bg-white" alt="Car" />
                                                        <div className="text-xs font-bold">{activeAutoProduct?.name.split(' ')[0]}</div>
                                                        <div className="text-[10px] text-emerald-600 font-bold">Total CO2eq</div>
                                                        <div className="text-xl font-bold text-slate-900">{activeAutoProduct?.totalCo2}</div>
                                                        <div className="text-[10px] text-slate-400">Ton</div>
                                                    </div>

                                                    {/* Flow Lines (SVG) */}
                                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 0}}>
                                                        <path d="M 120 128 C 180 128, 180 40, 240 40 L 300 40" fill="none" stroke="#fca5a5" strokeWidth="20" opacity="0.4" />
                                                        <path d="M 120 128 C 180 128, 180 90, 240 90 L 300 90" fill="none" stroke="#fdba74" strokeWidth="10" opacity="0.4" />
                                                        <path d="M 120 128 C 180 128, 180 128, 320 128" fill="none" stroke="#93c5fd" strokeWidth="40" opacity="0.6" />
                                                        <path d="M 120 128 C 180 128, 180 180, 240 180 L 300 180" fill="none" stroke="#d1d5db" strokeWidth="8" opacity="0.4" /> 
                                                        <path d="M 120 128 C 180 128, 180 200, 240 200 L 300 200" fill="none" stroke="#d1d5db" strokeWidth="6" opacity="0.4" /> 
                                                    </svg>

                                                    {/* Breakdown Labels */}
                                                    <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-6 text-[10px] text-slate-600 font-medium text-right pr-4">
                                                        <span>Powertrain</span>
                                                        <span>Body</span>
                                                        <div className="relative pr-2">
                                                            <div className="text-xs font-bold text-slate-900">{activeAutoProduct?.name}</div>
                                                            <div className="text-emerald-500 font-bold">CO2eq {activeAutoProduct?.co2PerUnit}</div>
                                                            <div className="text-slate-400">kg/ea</div>
                                                            {/* Line pointing to part */}
                                                            <div className="absolute top-1/2 right-full w-16 h-px bg-slate-300 mr-2"></div>
                                                            <img src={activeAutoProduct?.imageUrl} className="absolute top-full right-0 w-20 mt-1 border border-white shadow-sm rounded bg-white" alt="Part" />
                                                        </div>
                                                        <span>Chassis</span>
                                                        <span>Electric</span>
                                                        <span>Safety</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tier Chain */}
                                            <div className="relative pt-4 pl-8 border-l-2 border-dashed border-slate-200 ml-6 space-y-8">
                                                {/* Upper Tier */}
                                                <div className="relative">
                                                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-900">Upper tier</span>
                                                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center justify-center h-20 w-64">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-black flex items-center justify-center rounded-full">
                                                                <span className="text-white font-sans font-bold text-xl leading-none">H</span>
                                                            </div>
                                                            <span className="font-bold text-slate-900 text-lg">HYUNDAI</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Manufacturer (Current) */}
                                                <div className="relative">
                                                    <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-slate-300"></div>
                                                    <div className="absolute -left-[120px] top-1/2 -translate-y-1/2 text-right">
                                                        <span className="text-xs font-bold text-emerald-500 block">Manufacturer</span>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-slate-100 flex items-center justify-center h-24 w-64 transform scale-105">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-blue-900 flex items-center justify-center text-white font-bold text-xs p-1">HG</div>
                                                            <span className="font-bold text-blue-900 text-lg">HANGUK MOLD</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Lower Tier */}
                                                <div className="relative">
                                                    <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-slate-300"></div>
                                                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-900">Lower tier</span>
                                                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center justify-center h-20 w-64">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-[#c3002f] flex items-center justify-center text-white font-bold text-xs p-1">LG</div>
                                                            <span className="font-bold text-[#c3002f] text-lg">LG Chem</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full h-px bg-slate-200 my-8"></div>

                            {/* 3. Split View: History & Quality (Original DPP Content) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                
                                {/* Left: Data Transaction History */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900">Data Transaction History</h3>
                                        <div className="relative w-48">
                                            <input type="text" placeholder="search" className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-200 text-xs focus:outline-none focus:border-blue-500" />
                                            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                                <tr>
                                                    <th className="px-4 py-3">NO</th>
                                                    <th className="px-4 py-3">Process ID</th>
                                                    <th className="px-4 py-3 text-right">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {MOCK_DATA_TRANSACTIONS.map((tx) => (
                                                    <tr key={tx.no} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 text-slate-400">{tx.no}</td>
                                                        <td className="px-4 py-3 text-slate-700">{tx.processId}</td>
                                                        <td className="px-4 py-3 text-right text-slate-500">{tx.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <span className="text-slate-500">Show <span className="border px-1 rounded">10</span> Entries 1-4 of 4</span>
                                            <div className="flex gap-1">
                                                <button className="w-6 h-6 flex items-center justify-center border rounded text-slate-400">&lt;</button>
                                                <button className="w-6 h-6 flex items-center justify-center bg-emerald-400 text-white rounded font-bold">1</button>
                                                <button className="w-6 h-6 flex items-center justify-center border rounded text-slate-400">&gt;</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contract Info */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mt-8">
                                        <h3 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Contract Information</h3>
                                        
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-emerald-400 flex items-center justify-center text-white">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <h4 className="font-bold text-slate-900 leading-tight">
                                                Electronic Data Capture<br/>Contract
                                            </h4>
                                        </div>

                                        <div className="space-y-4 text-xs">
                                            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-50">
                                                <span className="font-bold text-slate-900">Contract Signing Date</span>
                                                <span className="col-span-2 text-slate-600">2021.11.05</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-50">
                                                <span className="font-bold text-slate-900">Contract End Date</span>
                                                <span className="col-span-2 text-slate-600">2025.11.04</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-50">
                                                <span className="font-bold text-slate-900">Data Transaction Scope</span>
                                                <div className="col-span-2 text-slate-600 space-y-1">
                                                    <p>1. <span className="font-bold">CO2Eq</span>: CO2 footprint equivalent emitted per one product.</p>
                                                    <p>2. <span className="font-bold">BOM</span>: Bill of Materials, listing the type and number of all parts included in one product.</p>
                                                    <p>3. <span className="font-bold">Routing Data</span>: describing the processes and the resources needed to complete one product.</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-50">
                                                <span className="font-bold text-slate-900">Data Transaction Cost</span>
                                                <span className="col-span-2 text-slate-600">100 USD / 100,000 Calls</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <span className="font-bold text-slate-900">Payment Terms</span>
                                                <span className="col-span-2 text-slate-600">
                                                    USD or equivalent tokens<br/>On end date of every month
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Inspection & Product Details (Vertical Layout) */}
                                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col items-center">
                                    <div className="flex justify-between w-full items-center mb-6">
                                        <span className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full uppercase tracking-wider">Product Quality</span>
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <ExternalLink className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 mb-8">{activeAutoProduct?.name}</h2>
                                    
                                    <div className="w-full space-y-3 text-sm mb-8 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="flex justify-between py-2 border-b border-slate-50">
                                            <span className="text-emerald-500 font-medium">Product ID</span>
                                            <span className="font-bold text-slate-900">HKMOLD-{activeAutoProduct?.id}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-50">
                                            <span className="text-emerald-500 font-medium">P/N</span>
                                            <span className="font-bold text-slate-900">{activeAutoProduct?.partNumber}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-emerald-500 font-medium">Production time</span>
                                            <span className="font-bold text-slate-900">{activeAutoProduct?.productionTime}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-medium text-slate-900 mb-4">Inspection.AI Result</h3>
                                    
                                    <div className="w-full bg-black rounded-xl overflow-hidden shadow-lg mb-6 flex flex-col">
                                        {/* Top Half - Defects 1, 2, 3 */}
                                        <div className="relative h-40 bg-gray-900 group border-b border-gray-800">
                                            <img src={activeAutoProduct?.imageUrl} className="w-full h-full object-cover opacity-90" style={{objectPosition: 'center 60%'}} />
                                            
                                            {/* Box 1 */}
                                            <div className="absolute top-[40%] left-[15%] w-[12%] h-[25%] border-2 border-red-500 flex flex-col justify-end">
                                                <span className="bg-white text-black font-bold text-[10px] w-4 h-4 flex items-center justify-center">1</span>
                                            </div>
                                            {/* Box 2 */}
                                            <div className="absolute top-[50%] left-[45%] w-[10%] h-[20%] border-2 border-red-500 flex flex-col justify-end">
                                                <span className="bg-white text-black font-bold text-[10px] w-4 h-4 flex items-center justify-center">2</span>
                                            </div>
                                            {/* Box 3 */}
                                            <div className="absolute top-[45%] right-[20%] w-[15%] h-[30%] border-2 border-red-500 flex flex-col justify-end items-end">
                                                <span className="bg-white text-black font-bold text-[10px] w-4 h-4 flex items-center justify-center">3</span>
                                            </div>
                                            
                                            <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded backdrop-blur-sm">Front View</div>
                                        </div>

                                        {/* Bottom Half - Defects 4, 5, 6 */}
                                        <div className="relative h-40 bg-gray-900 group">
                                            <img src={activeAutoProduct?.imageUrl} className="w-full h-full object-cover opacity-90" style={{objectPosition: 'center 60%'}} />
                                            
                                            {/* Box 4 */}
                                            <div className="absolute bottom-[30%] left-[10%] w-[18%] h-[35%] border-2 border-red-500 flex flex-col justify-end">
                                                <span className="bg-white text-black font-bold text-[10px] w-4 h-4 flex items-center justify-center">4</span>
                                            </div>
                                            {/* Box 5 */}
                                            <div className="absolute top-[40%] left-[35%] w-[12%] h-[25%] border-2 border-red-500 flex flex-col justify-end">
                                                <span className="bg-white text-black font-bold text-[10px] w-4 h-4 flex items-center justify-center">5</span>
                                            </div>
                                            {/* Box 6 */}
                                            <div className="absolute bottom-[20%] right-[15%] w-[20%] h-[40%] border-2 border-red-500 flex flex-col justify-end items-end">
                                                <span className="bg-white text-black font-bold text-[10px] w-4 h-4 flex items-center justify-center">6</span>
                                            </div>

                                            <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded backdrop-blur-sm">Side/Rear View</div>
                                        </div>

                                        {/* Thumbnails Strip */}
                                        <div className="bg-[#1a1a1a] p-2 grid grid-cols-6 gap-1 border-t border-gray-800">
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <div key={num} className="aspect-square bg-gray-800 border border-gray-700 relative overflow-hidden group cursor-pointer hover:border-red-500 transition-colors">
                                                    <img src={activeAutoProduct?.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                                    <span className="absolute top-0 left-0 bg-red-600 text-white text-[8px] px-1 font-bold">{num}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Status Bar */}
                                        <div className="bg-[#3b82f6] p-3 text-center">
                                            <h2 className="text-3xl font-bold text-white tracking-widest">OK</h2>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

        </div>
    );
};

export default DPPModule;
