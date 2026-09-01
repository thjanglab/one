
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, CheckCircle, Zap, ShieldCheck, Factory, Cpu, Smartphone, Car, Link as LinkIcon, Ship, FlaskConical, Sun, Bot, Hammer, Package, Anchor, Server, Database, Globe, Lock, Activity, Truck, Radio, Recycle, FileCheck, Share2, Building2, Filter, MessageSquare, UserPlus, Plug, Rocket, ChevronRight, Layers, Code, Key, Settings, QrCode, AlertTriangle, XCircle, TrendingUp, Clock, Timer, FileX, Wrench, Map as MapIcon, RefreshCw, X, Search, BarChart3, Microscope, FileSpreadsheet, Mail, FileText, Blocks, Network, Workflow } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';

type AdoptionPoint = {
    title: string;
    desc: string;
    icon: React.ReactNode;
};

type ComparisonItem = {
    metric: string;
    before: string;
    after: string;
    icon?: React.ReactNode;
};

type CompanyCase = {
  id: string;
  name: string;
  industry: string;
  category: string; // Added for filtering
  logoColor: string;
  heroImage: string;
  icon: React.ReactNode;
  content: {
    title: string;
    subtitle: string;
    challenge: string;
    solution: string;
    benefit: string;
    details: string[];
    adoption: AdoptionPoint[];
    comparison: ComparisonItem[]; // New: Before vs After Data
  };
  infographic: React.ReactNode; 
};

const UseCases: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('hyundai');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPainPoint, setSelectedPainPoint] = useState<ComparisonItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // NEW: State for Tech Stack Modal
  const [selectedTechItem, setSelectedTechItem] = useState<AdoptionPoint | null>(null);

  // --- Visual Diagrams for Each Case ---
  
  const HyundaiDiagram = () => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Battery Passport Data Flow</h4>
        <div className="flex items-center justify-between text-[10px] md:text-xs">
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-300">
                    <Factory className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold text-center">Supplier<br/>(Mining/Cell)</span>
            </div>
            
            <div className="flex-1 px-2 flex flex-col items-center">
                <div className="w-full h-0.5 bg-slate-300 relative">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded-full">PCF Data (EDC)</span>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#002c5f] text-white rounded-lg flex items-center justify-center shadow-lg">
                    <Car className="w-6 h-6" />
                </div>
                <span className="font-bold text-[#002c5f]">Hyundai</span>
            </div>

            <div className="flex-1 px-2 flex flex-col items-center">
                <div className="w-full h-0.5 bg-slate-300 relative">
                     <ArrowRight className="w-3 h-3 text-slate-400 absolute right-0 -top-1.5" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Pass ID</span>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center border border-green-200">
                    <Recycle className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-semibold text-center">EU<br/>Regulator</span>
            </div>
        </div>
    </div>
  );

  const SamsungDiagram = () => (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Compute-to-Data Architecture</h4>
          <div className="relative border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50/50">
              <span className="absolute top-0 right-0 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg">Samsung Fab (Secure Zone)</span>
              <div className="flex items-center justify-around">
                  <div className="flex flex-col items-center gap-2 z-10">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                          <Database className="w-5 h-5 text-slate-600" />
                      </div>
                      <span className="text-[10px] font-bold">Raw Data</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-12 h-12 bg-white rounded-full border-2 border-emerald-400 flex items-center justify-center shadow-md z-10">
                          <Cpu className="w-6 h-6 text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-1">AI Training</span>
                  </div>

                  <div className="h-0.5 w-full bg-slate-300 absolute top-1/2 left-0 z-0"></div>
              </div>
          </div>
          <div className="flex justify-between mt-4 text-[10px]">
              <div className="text-center w-1/3">
                  <div className="mx-auto w-0.5 h-4 bg-slate-300"></div>
                  <span className="text-slate-400">Data never leaves</span>
              </div>
              <div className="text-center w-1/3">
                  <div className="mx-auto w-0.5 h-4 bg-emerald-400"></div>
                  <span className="font-bold text-slate-900">Equipment Maker</span>
                  <p className="text-slate-400">(Sends Algorithm)</p>
              </div>
          </div>
      </div>
  );

  const LGDiagram = () => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Cross-Domain Data Convergence</h4>
        <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col gap-2">
                <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] font-bold">Weather Data</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-[10px] font-bold">Energy Grid</span>
                </div>
            </div>
            
            <div className="w-16 h-16 bg-[#a50034] rounded-full flex items-center justify-center text-white shadow-xl relative z-10">
                <Smartphone className="w-8 h-8" />
                <div className="absolute -inset-1 bg-[#a50034] rounded-full opacity-20 animate-ping"></div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-[10px] font-bold">Smart Home</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-bold">Construction</span>
                </div>
            </div>
        </div>
        <div className="text-center mt-3">
             <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Global Data Aggregation (GDPR Compliant)</span>
        </div>
    </div>
  );

  const PoscoDiagram = () => (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Digital Mill Sheet Verification</h4>
          <div className="flex items-center justify-between gap-2">
              <div className="text-center">
                  <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center border border-slate-200 mx-auto">
                      <div className="w-6 h-6 rounded-full border-4 border-slate-400"></div>
                  </div>
                  <span className="text-[10px] font-bold block mt-1">Steel Coil</span>
              </div>
              
              <ArrowRight className="w-4 h-4 text-slate-300" />
              
              <div className="text-center relative">
                  <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center border border-blue-100 mx-auto">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 fill-white" />
                  </div>
                  <span className="text-[10px] font-bold block mt-1">Digital Cert</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300" />

              <div className="text-center">
                  <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center border border-slate-600 mx-auto">
                      <LinkIcon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold block mt-1">Blockchain</span>
              </div>
          </div>
      </div>
  );

  const HMMDiagram = () => (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Smart Logistics Synchronization</h4>
          <div className="relative pt-2 pb-4">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
              <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full"></div>
              
              <div className="flex justify-between relative z-10">
                  <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-white border-2 border-blue-400 rounded-full flex items-center justify-center">
                          <Ship className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-[10px] font-bold mt-1">Sea</span>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-white border-2 border-emerald-400 rounded-full flex items-center justify-center">
                          <Anchor className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-bold mt-1">Port</span>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center">
                          <Truck className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-[10px] font-bold mt-1">Land</span>
                  </div>
              </div>
              
              <div className="absolute top-0 left-1/3 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full -mt-2">
                  ETA Sync
              </div>
          </div>
      </div>
  );

  const LGChemDiagram = () => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Federated Learning Network</h4>
        <div className="flex justify-center items-center relative h-24">
            {/* Center Model */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Share2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-[9px] font-bold text-center mt-1 bg-indigo-50 text-indigo-700 px-1 rounded">Global Model</div>
            </div>

            {/* Nodes */}
            <div className="absolute left-4 top-0 animate-pulse">
                <FlaskConical className="w-6 h-6 text-slate-400" />
            </div>
            <div className="absolute right-4 top-0 animate-pulse delay-75">
                <FlaskConical className="w-6 h-6 text-slate-400" />
            </div>
            <div className="absolute left-4 bottom-0 animate-pulse delay-150">
                <FlaskConical className="w-6 h-6 text-slate-400" />
            </div>
            <div className="absolute right-4 bottom-0 animate-pulse delay-200">
                <FlaskConical className="w-6 h-6 text-slate-400" />
            </div>

            {/* Connecting Lines (Simulated) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-32 h-32 border border-dashed border-indigo-200 rounded-full opacity-50"></div>
            </div>
        </div>
        <div className="text-center mt-2">
             <span className="text-[9px] text-slate-400">Only Model Weights Transferred (No Data Leak)</span>
        </div>
    </div>
  );

  const HanwhaDiagram = () => (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Virtual Power Plant (VPP)</h4>
          {/* Added 'relative' class to fix layout error */}
          <div className="relative flex items-end justify-center gap-1 h-20 mb-2 border-b border-slate-200 pb-1">
              {[20, 35, 50, 45, 60, 80, 70, 50, 40].map((h, i) => (
                  <div key={i} className="w-3 bg-orange-400 rounded-t-sm" style={{height: `${h}%`}}></div>
              ))}
              <div className="absolute w-full h-12 border-t-2 border-dashed border-blue-400 top-14 opacity-50"></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-orange-500" /> Solar Farms
              </div>
              <div className="flex items-center gap-1">
                   <Activity className="w-3 h-3 text-blue-500" /> Grid Stable
              </div>
          </div>
      </div>
  );

  const DoosanDiagram = () => (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Remote Robot Diagnostics</h4>
          <div className="flex items-center justify-between">
              <div className="text-center">
                  <Bot className="w-8 h-8 text-blue-900 mx-auto" />
                  <span className="text-[10px] font-bold block mt-1">Robot</span>
              </div>
              
              <div className="flex-1 px-2">
                  <div className="flex gap-1 justify-center mb-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                  <div className="h-0.5 bg-slate-200 w-full"></div>
                  <span className="text-[9px] text-slate-400 block text-center mt-1">IoT Logs</span>
              </div>

              <div className="text-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                      <Server className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold block mt-1">Cloud</span>
              </div>
          </div>
          <div className="mt-3 bg-red-50 p-2 rounded border border-red-100 text-center">
              <span className="text-[10px] font-bold text-red-600 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" /> Warning: Motor Heat
              </span>
          </div>
      </div>
  );

  const CJDiagram = () => (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">AI Route Optimization</h4>
          <div className="relative h-24 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
              {/* Map simulation */}
              <svg className="w-full h-full absolute inset-0 opacity-20" viewBox="0 0 100 50">
                  <path d="M10,10 Q50,5 90,40" stroke="black" fill="none" />
                  <path d="M10,40 Q50,45 90,10" stroke="black" fill="none" />
              </svg>
              
              <div className="absolute top-2 left-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-[8px] z-10 shadow-md">
                  Hub
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[8px] z-10 shadow-md">
                  Home
              </div>

              {/* Optimized Path */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow text-[9px] font-bold text-blue-600 border border-blue-100 z-20">
                  Optimized
              </div>
              <div className="absolute top-[20%] left-[40%] w-2 h-2 bg-slate-400 rounded-full opacity-50"></div>
              <div className="absolute bottom-[30%] left-[60%] w-2 h-2 bg-slate-400 rounded-full opacity-50"></div>
          </div>
      </div>
  );

  const HDDiagram = () => (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Smart Yard Digital Twin</h4>
          <div className="grid grid-cols-4 gap-1 h-20">
              <div className="col-span-2 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[9px] text-slate-400">
                  Dock A
              </div>
              <div className="bg-blue-50 rounded border border-blue-200 flex flex-col items-center justify-center text-[9px]">
                  <Anchor className="w-3 h-3 text-blue-600 mb-1" />
                  <span className="font-bold text-blue-700">Ship 1</span>
              </div>
              <div className="bg-slate-100 rounded border border-slate-200"></div>
              
              <div className="bg-emerald-50 rounded border border-emerald-200 flex flex-col items-center justify-center text-[9px]">
                  <Radio className="w-3 h-3 text-emerald-600 mb-1" />
                  <span className="font-bold text-emerald-700">IoT</span>
              </div>
              <div className="col-span-3 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[9px] text-slate-400">
                  Material Storage Area
              </div>
          </div>
      </div>
  );


  const cases: Record<string, CompanyCase> = {
    hyundai: {
      id: 'hyundai',
      name: language === 'KO' ? '현대자동차' : 'Hyundai Motor',
      industry: language === 'KO' ? '자동차 & 모빌리티' : 'Automotive & Mobility',
      category: 'Automotive',
      logoColor: 'text-[#002c5f]',
      heroImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1200',
      icon: <Car className="w-6 h-6" />,
      infographic: <HyundaiDiagram />,
      content: {
        title: language === 'KO' 
          ? '글로벌 배터리 패스포트 및 탄소 배출량 추적' 
          : 'Global Battery Passport & Carbon Footprint Tracking',
        subtitle: language === 'KO'
          ? 'Catena-X 표준 기반의 공급망 투명성 확보 및 EU 규제 대응'
          : 'Securing supply chain transparency based on Catena-X standards and complying with EU regulations',
        challenge: language === 'KO'
          ? '유럽의 디지털 제품 여권(DPP) 및 배터리 규제 강화로 인해 원자재 채굴부터 폐기까지 전 생애주기의 데이터를 투명하게 증명해야 했습니다. 하지만 수천 개의 협력사(Tier N)가 보유한 민감한 공정 데이터를 중앙 서버로 수집하는 것은 보안 및 영업비밀 문제로 불가능했습니다.'
          : 'With stricter EU Digital Product Passport (DPP) and battery regulations, transparent proof of lifecycle data from mining to disposal was required. However, collecting sensitive process data from thousands of suppliers (Tier N) into a central server was impossible due to security and trade secret concerns.',
        solution: language === 'KO'
          ? 'Korea 데이터스페이스를 도입하여 "데이터 이동 없는" 연합형 네트워크를 구축했습니다. 각 협력사는 자신의 EDC(Eclipse Dataspace Connector)를 통해 데이터를 자체 서버에 보유하면서, 탄소 배출량(PCF) 계산 결과값과 인증서만 현대자동차에 전송합니다.'
          : 'Adopted Korea DataSpace to build a "data-sovereignty-first" federated network. Suppliers keep data on their own servers via EDC (Eclipse Dataspace Connector) and transmit only calculated PCF results and certificates to Hyundai Motor.',
        benefit: language === 'KO'
          ? '공급망 전체의 Scope 3 탄소 배출량을 실시간으로 집계할 수 있게 되었으며, 데이터 주권을 보장하여 협력사의 자발적 참여를 이끌어냈습니다. 이를 통해 EU 배터리 규제를 선제적으로 충족하고 ESG 경영을 가속화했습니다.'
          : 'Enabled real-time aggregation of Scope 3 carbon emissions across the supply chain and ensured data sovereignty to encourage voluntary supplier participation. proactively met EU battery regulations and accelerated ESG management.',
        details: [
            language === 'KO' ? '배터리 원자재(리튬, 코발트) 추적성 확보' : 'Traceability of battery raw materials (Lithium, Cobalt)',
            language === 'KO' ? '탄소 발자국(PCF) 데이터 교환 표준화' : 'Standardization of PCF data exchange',
            language === 'KO' ? '재활용 비율 인증 자동화' : 'Automation of recycling rate certification'
        ],
        adoption: [
            {
                title: language === 'KO' ? 'EDC & AAS 표준 적용' : 'EDC & AAS Integration',
                desc: language === 'KO' ? 'Eclipse Dataspace Components(EDC)를 통해 협력사 연결 및 데이터 모델 표준화(AAS) 적용.' : 'Connected suppliers via EDC and standardized data models using Asset Administration Shell (AAS).',
                icon: <Layers className="w-5 h-5 text-blue-500" />
            },
            {
                title: language === 'KO' ? '공급망 신원 인증 (VC)' : 'Verifiable Credentials (VC)',
                desc: language === 'KO' ? 'Catena-X 표준을 준수하는 VC 기반의 기업 신원 인증으로 데이터 신뢰성 확보.' : 'Ensured data trust via Catena-X compliant VC for corporate identity verification.',
                icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />
            },
            {
                title: language === 'KO' ? '탄소 데이터 앱 배포' : 'PCF Calculation App',
                desc: language === 'KO' ? '중앙 저장소 없이 파트너 노드에서 데이터를 호출하여 계산하는 분산 앱 배포.' : 'Deployed distributed apps that compute PCF by invoking data from partner nodes without central storage.',
                icon: <Code className="w-5 h-5 text-purple-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? '추적 시간' : 'Tracking Time', before: language === 'KO' ? '2주' : '2 Weeks', after: language === 'KO' ? '실시간' : 'Real-time', icon: <Timer className="w-4 h-4" /> },
            { metric: language === 'KO' ? '데이터 신뢰성' : 'Data Trust', before: language === 'KO' ? '자가 선언' : 'Self-Declared', after: language === 'KO' ? '검증됨(VC)' : 'Verified (VC)', icon: <ShieldCheck className="w-4 h-4" /> },
            { metric: language === 'KO' ? '가시성' : 'Visibility', before: language === 'KO' ? '1차 협력사' : 'Tier 1 Only', after: language === 'KO' ? 'N차 공급망' : 'Tier N (Deep)', icon: <Globe className="w-4 h-4" /> }
        ]
      }
    },
    samsung: {
      id: 'samsung',
      name: language === 'KO' ? '삼성전자' : 'Samsung Electronics',
      industry: language === 'KO' ? '반도체 & 전자' : 'Semiconductor & Electronics',
      category: 'Electronics',
      logoColor: 'text-[#1428a0]',
      heroImage: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&q=80&w=1200',
      icon: <Cpu className="w-6 h-6" />,
      infographic: <SamsungDiagram />,
      content: {
        title: language === 'KO'
          ? '반도체 설비 예지보전 및 수율 최적화 협업'
          : 'Semiconductor Equipment Predictive Maintenance & Yield Optimization',
        subtitle: language === 'KO'
          ? '장비 제조사와 팹(Fab) 간의 안전한 데이터 공유 생태계'
          : 'Secure data sharing ecosystem between equipment manufacturers and Fabs',
        challenge: language === 'KO'
            ? '반도체 공정의 복잡성이 증가함에 따라, 장비 제조사와의 협업 없이 수율을 극대화하는 것은 한계에 도달했습니다. 그러나 팹(Fab) 운영 데이터는 보안상 외부 반출이 엄격히 금지되어 있어 데이터 기반의 협업이 어려웠습니다.'
            : 'As semiconductor process complexity increased, maximizing yield without collaboration with equipment makers reached a limit. However, Fab operational data is strictly prohibited from external transfer, making data-driven collaboration difficult.',
        solution: language === 'KO'
          ? '데이터스페이스의 "Compute-to-Data" 기능을 활용했습니다. 장비 제조사의 AI 알고리즘이 삼성전자 팹 내부의 안전한 샌드박스 컨테이너로 전송되어 학습 및 추론을 수행하고, 원본 데이터의 유출 없이 결과(장비 상태 진단)만 반환받는 구조를 구현했습니다.'
          : 'Utilized the "Compute-to-Data" feature of DataSpace. Equipment makers\' AI algorithms are sent to a secure sandbox container within the Samsung Fab to perform training/inference, returning only the results (equipment diagnostics) without leaking raw data.',
        benefit: language === 'KO'
          ? '보안 위협 없이 장비 고장을 24시간 전에 예측하여 다운타임을 30% 감소시켰으며, 장비 제조사는 실제 환경 데이터를 기반으로 차세대 장비 성능을 개선할 수 있었습니다.'
          : 'Predicted equipment failure 24 hours in advance without security threats, reducing downtime by 30%, while equipment makers improved next-gen equipment performance based on real-world environment data.',
        details: [
            language === 'KO' ? 'Fab 내부 데이터 보안 유지 (데이터 이동 X)' : 'Maintained Fab internal data security (No data movement)',
            language === 'KO' ? '설비 로그 기반 이상 탐지 모델 고도화' : 'Enhanced anomaly detection models based on equipment logs',
            language === 'KO' ? '공정 레시피와 장비 파라미터 상관관계 분석' : 'Correlation analysis between process recipes and equipment parameters'
        ],
        adoption: [
            {
                title: language === 'KO' ? 'Compute-to-Data 구현' : 'Compute-to-Data',
                desc: language === 'KO' ? '알고리즘을 데이터가 있는 곳으로 전송하는 역발상 구조로 보안 문제 완벽 해결.' : 'Solved security issues by sending algorithms to data source instead of moving data.',
                icon: <Server className="w-5 h-5 text-indigo-500" />
            },
            {
                title: language === 'KO' ? '보안 컨테이너 샌드박스' : 'Secure Sandbox',
                desc: language === 'KO' ? '외부 알고리즘이 실행되는 격리된 환경 구축 및 네트워크 접근 제어.' : 'Established isolated environments for external algorithms with strict network control.',
                icon: <Lock className="w-5 h-5 text-slate-600" />
            },
            {
                title: language === 'KO' ? '고성능 스트리밍 커넥터' : 'High-Perf Streaming',
                desc: language === 'KO' ? '실시간 설비 센서 데이터 처리를 위한 고성능 EDC 커넥터 튜닝.' : 'Optimized EDC connectors for high-throughput real-time sensor data processing.',
                icon: <Activity className="w-5 h-5 text-orange-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? '데이터 보안' : 'Data Security', before: language === 'KO' ? '반출 불가' : 'Blocked (Security)', after: language === 'KO' ? '유출 0%' : 'Zero Leakage', icon: <Lock className="w-4 h-4" /> },
            { metric: language === 'KO' ? '협업' : 'Collaboration', before: language === 'KO' ? '불가능' : 'Impossible', after: language === 'KO' ? 'Compute-to-Data' : 'Compute-to-Data', icon: <Server className="w-4 h-4" /> },
            { metric: language === 'KO' ? '다운타임' : 'Downtime', before: language === 'KO' ? '비계획적' : 'Unplanned', after: language === 'KO' ? '-30% (예측)' : '-30% (Predicted)', icon: <TrendingUp className="w-4 h-4" /> }
        ]
      }
    },
    lg: {
      id: 'lg',
      name: language === 'KO' ? 'LG전자' : 'LG Electronics',
      industry: language === 'KO' ? '스마트 가전 & 홈' : 'Smart Home & Appliances',
      category: 'Electronics',
      logoColor: 'text-[#a50034]',
      heroImage: 'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?auto=format&fit=crop&q=80&w=1200',
      icon: <Smartphone className="w-6 h-6" />,
      infographic: <LGDiagram />,
      content: {
        title: language === 'KO'
          ? '스마트 라이프스타일 데이터 기반 서비스 R&D'
          : 'Service R&D based on Smart Lifestyle Data',
        subtitle: language === 'KO'
          ? '개인정보 보호 강화 및 이종 산업 간 데이터 융합'
          : 'Enhanced privacy protection and data convergence across heterogeneous industries',
        challenge: language === 'KO'
          ? '전 세계에 판매된 스마트 가전에서 발생하는 방대한 사용 데이터를 신제품 개발과 에너지 효율화에 활용하고 싶었으나, GDPR 등 국가별 개인정보 보호법 규제로 인해 데이터를 통합 분석하는 데 제약이 있었습니다.'
          : 'Wanted to utilize vast usage data from global smart appliances for new product development and energy efficiency, but faced restrictions in integrated analysis due to privacy laws like GDPR.',
        solution: language === 'KO'
          ? '각 국가별 리전(Region)에 데이터스페이스 노드를 구축하고, 개인 식별 정보를 제거하거나 가명화한 통계 데이터만을 교환하는 표준 계약을 체결했습니다. 또한 에너지 기업, 건설사 등 이종 산업 파트너와 데이터를 안전하게 융합할 수 있는 마켓플레이스를 조성했습니다.'
          : 'Established DataSpace nodes in each regional region and signed standard contracts to exchange only de-identified or pseudonymized statistical data. Also created a marketplace to securely converge data with cross-industry partners like energy and construction firms.',
        benefit: language === 'KO'
          ? '글로벌 고객의 사용 패턴을 분석하여 에너지 절감 AI 알고리즘("ThinQ AI")을 고도화하였으며, 스마트홈 데이터와 에너지 그리드 데이터를 결합한 새로운 에너지 관리 서비스(EMS) 비즈니스 모델을 창출했습니다.'
          : 'Analyzed global usage patterns to enhance energy-saving AI algorithms ("ThinQ AI") and created new Energy Management Service (EMS) business models by combining smart home data with energy grid data.',
        details: [
            language === 'KO' ? 'GDPR 준수형 글로벌 데이터 파이프라인' : 'GDPR-compliant global data pipeline',
            language === 'KO' ? '가전 사용 패턴 기반 에너지 수요 예측' : 'Energy demand forecasting based on usage patterns',
            language === 'KO' ? '크로스 도메인 데이터(날씨, 건설) 융합' : 'Convergence of cross-domain data (Weather, Construction)'
        ],
        adoption: [
            {
                title: language === 'KO' ? '글로벌 데이터 메시' : 'Global Data Mesh',
                desc: language === 'KO' ? '국가별 데이터 주권을 준수하는 분산형 데이터 메시 아키텍처 구현.' : 'Implemented distributed data mesh architecture complying with regional data sovereignty.',
                icon: <Globe className="w-5 h-5 text-blue-500" />
            },
            {
                title: language === 'KO' ? '동의 관리 시스템 연동' : 'Consent Management',
                desc: language === 'KO' ? '사용자 개인정보 동의 여부를 커넥터 정책 엔진과 실시간 연동.' : 'Integrated user consent status with connector policy engine in real-time.',
                icon: <UserPlus className="w-5 h-5 text-purple-500" />
            },
            {
                title: language === 'KO' ? '이종 데이터 온톨로지' : 'Unified Ontology',
                desc: language === 'KO' ? '가전, 에너지, 기상 등 서로 다른 도메인 데이터의 의미적 통합.' : 'Semantic integration of heterogeneous data domains (home, energy, weather).',
                icon: <LinkIcon className="w-5 h-5 text-slate-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? '데이터 범위' : 'Data Scope', before: language === 'KO' ? '지역별 사일로' : 'Regional Silos', after: language === 'KO' ? '글로벌 메시' : 'Global Mesh', icon: <Globe className="w-4 h-4" /> },
            { metric: language === 'KO' ? '규제 준수' : 'Compliance', before: language === 'KO' ? '수동 점검' : 'Manual Check', after: language === 'KO' ? '자동 정책' : 'Auto Policy', icon: <FileCheck className="w-4 h-4" /> },
            { metric: language === 'KO' ? '통찰력' : 'Insight', before: language === 'KO' ? '파편화' : 'Fragmented', after: language === 'KO' ? '통합 분석' : 'Integrated', icon: <Activity className="w-4 h-4" /> }
        ]
      }
    },
    posco: {
      id: 'posco',
      name: language === 'KO' ? 'POSCO' : 'POSCO',
      industry: language === 'KO' ? '철강 & 소재' : 'Steel & Materials',
      category: 'Materials',
      logoColor: 'text-[#005aab]',
      heroImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200',
      icon: <Hammer className="w-6 h-6" />,
      infographic: <PoscoDiagram />,
      content: {
        title: language === 'KO'
          ? '그린 철강 인증 및 공급망 품질 데이터 공유'
          : 'Green Steel Certification & Supply Chain Quality Data Sharing',
        subtitle: language === 'KO'
          ? '저탄소 철강 제품의 신뢰성 확보 및 고객사 품질 대응'
          : 'Ensuring reliability of low-carbon steel products and responding to customer quality needs',
        challenge: language === 'KO'
          ? '자동차 및 가전 고객사로부터 탄소 저감 강판에 대한 인증 데이터와 세부 품질 물성치(인장강도 등) 요구가 증가했으나, 이메일이나 엑셀을 통한 수동 대응은 데이터 위변조 위험과 비효율을 초래했습니다.'
          : 'Demand for certification data and detailed quality properties (tensile strength, etc.) for low-carbon steel increased from auto and appliance customers, but manual response via email/Excel caused inefficiency and risk of forgery.',
        solution: language === 'KO'
          ? 'POSCO는 데이터스페이스를 통해 생산 코일(Coil) 단위의 탄소 배출량과 품질 검사 성적서(Mill Sheet)를 디지털 자산으로 발행했습니다. 고객사는 블록체인에 기록된 원본 데이터를 즉시 조회하고 검증할 수 있습니다.'
          : 'POSCO published carbon emissions and quality inspection certificates (Mill Sheets) per coil as digital assets via DataSpace. Customers can instantly view and verify the original data recorded on the blockchain.',
        benefit: language === 'KO'
          ? '품질 성적서 위변조 문제를 원천 차단하고 데이터 제공 시간을 3일에서 실시간으로 단축했습니다. 이를 통해 글로벌 완성차 업체의 친환경 소재 조달 파트너로서의 입지를 공고히 했습니다.'
          : 'Eliminated forgery issues of quality certificates and reduced data provision time from 3 days to real-time, solidifying its position as an eco-friendly material partner for global automakers.',
        details: [
            language === 'KO' ? '디지털 Mill Sheet 자동 발행 시스템' : 'Digital Mill Sheet automated issuance system',
            language === 'KO' ? '코일 단위 탄소 데이터 추적성(Traceability)' : 'Coil-level carbon data traceability',
            language === 'KO' ? '고객사 ERP 자동 연동 API 제공' : 'API for automatic integration with customer ERP'
        ],
        adoption: [
            {
                title: language === 'KO' ? '블록체인 공증' : 'Blockchain Notarization',
                desc: language === 'KO' ? '품질 증명서의 해시값을 블록체인에 기록하여 위변조 방지.' : 'Anchored hash of quality certificates to blockchain to prevent forgery.',
                icon: <LinkIcon className="w-5 h-5 text-emerald-500" />
            },
            {
                title: language === 'KO' ? '제품 시리얼 추적' : 'Serialization Service',
                desc: language === 'KO' ? '코일 단위의 고유 ID와 데이터스페이스 자산을 매핑하여 추적성 확보.' : 'Mapped coil unique IDs with dataspace assets for full traceability.',
                icon: <QrCode className="w-5 h-5 text-slate-600" />
            },
            {
                title: language === 'KO' ? '스마트 컨트랙트 정산' : 'Auto Settlement',
                desc: language === 'KO' ? '데이터 수신 확인 시 자동으로 토큰 결제가 이루어지는 정산 시스템.' : 'Automatic token settlement upon verification of data receipt.',
                icon: <Zap className="w-5 h-5 text-yellow-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? '검증 시간' : 'Verify Time', before: language === 'KO' ? '3일' : '3 Days', after: language === 'KO' ? '즉시' : 'Instant', icon: <Clock className="w-4 h-4" /> },
            { metric: language === 'KO' ? '형태' : 'Format', before: language === 'KO' ? '종이/PDF' : 'Paper/PDF', after: language === 'KO' ? '디지털 토큰' : 'Digital Token', icon: <FileCheck className="w-4 h-4" /> },
            { metric: language === 'KO' ? '위변조 위험' : 'Forgery Risk', before: language === 'KO' ? '높음' : 'High', after: language === 'KO' ? '불가능' : 'Impossible', icon: <ShieldCheck className="w-4 h-4" /> }
        ]
      }
    },
    hmm: {
      id: 'hmm',
      name: language === 'KO' ? 'HMM' : 'HMM',
      industry: language === 'KO' ? '해운 & 물류' : 'Shipping & Logistics',
      category: 'Logistics',
      logoColor: 'text-[#0c2c56]',
      heroImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
      icon: <Ship className="w-6 h-6" />,
      infographic: <HMMDiagram />,
      content: {
        title: language === 'KO'
          ? '스마트 항만 연계 및 실시간 화물 모니터링'
          : 'Smart Port Integration & Real-time Cargo Monitoring',
        subtitle: language === 'KO'
          ? '항만 적체 해소 및 컨테이너 운송 효율화'
          : 'Relieving port congestion and optimizing container transport efficiency',
        challenge: language === 'KO'
          ? '글로벌 항만의 불확실한 대기 시간과 내륙 운송 정보의 단절로 인해 물류 리드 타임 예측이 어려웠습니다. 선박, 터미널, 트럭킹 회사가 각기 다른 시스템을 사용하여 정보 공유가 지연되었습니다.'
          : 'Predicting logistics lead time was difficult due to uncertain wait times at global ports and disconnected inland transport info. Delays occurred as ships, terminals, and trucking companies used different systems.',
        solution: language === 'KO'
          ? 'HMM은 데이터스페이스를 통해 선박 위치, 도착 예정 시간(ETA), 컨테이너 상태 데이터를 항만 터미널 및 육상 운송사와 실시간으로 공유했습니다. IDS 표준을 적용하여 이기종 물류 시스템 간의 상호 운용성을 확보했습니다.'
          : 'HMM shared vessel location, ETA, and container status data in real-time with port terminals and land transporters via DataSpace, securing interoperability between heterogeneous logistics systems using IDS standards.',
        benefit: language === 'KO'
          ? '항만 대기 시간을 평균 15% 단축하고 연료 소모를 절감했습니다. 화주에게는 정확한 도착 정보를 제공하여 공급망 가시성을 높이고 고객 만족도를 개선했습니다.'
          : 'Reduced port wait times by 15% on average and saved fuel. Improved supply chain visibility and customer satisfaction by providing accurate arrival information to cargo owners.',
        details: [
            language === 'KO' ? '선박-항만-육상 간 실시간 데이터 동기화' : 'Real-time data synchronization: Ship-Port-Land',
            language === 'KO' ? 'IoT 기반 냉동 컨테이너 상태 모니터링' : 'IoT-based reefer container monitoring',
            language === 'KO' ? '도착 예정 시간(ETA) 예측 정확도 95% 달성' : 'Achieved 95% accuracy in ETA prediction'
        ],
        adoption: [
            {
                title: language === 'KO' ? '멀티모달 커넥터' : 'Multi-Modal Connector',
                desc: language === 'KO' ? '선박(위성), 항만(터미널OS), 트럭(텔레매틱스) 간 이기종 시스템 통합.' : 'Integration of heterogeneous systems across vessel (satellite), port, and truck.',
                icon: <Truck className="w-5 h-5 text-blue-500" />
            },
            {
                title: language === 'KO' ? '이벤트 스트림 전송' : 'Event Streaming',
                desc: language === 'KO' ? 'MQTT 기반 데이터 플레인을 활용하여 실시간 물류 이벤트 초저지연 전송.' : 'Utilized MQTT-based data planes for low-latency logistics event streaming.',
                icon: <Activity className="w-5 h-5 text-orange-500" />
            },
            {
                title: language === 'KO' ? '항만 디지털 트윈 연동' : 'Port Digital Twin',
                desc: language === 'KO' ? '물류 데이터를 항만 디지털 트윈과 동기화하여 접안 계획 최적화.' : 'Synchronized logistics data with port digital twin for berth planning.',
                icon: <Anchor className="w-5 h-5 text-emerald-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? 'ETA 정확도' : 'ETA Accuracy', before: '60%', after: '95%', icon: <Activity className="w-4 h-4" /> },
            { metric: language === 'KO' ? '항만 대기' : 'Port Wait', before: language === 'KO' ? '2일' : '2 Days', after: language === 'KO' ? '4시간' : '4 Hours', icon: <Timer className="w-4 h-4" /> },
            { metric: language === 'KO' ? '정보 흐름' : 'Info Flow', before: language === 'KO' ? '전화/이메일' : 'Phone/Email', after: language === 'KO' ? 'API 스트림' : 'API Stream', icon: <Zap className="w-4 h-4" /> }
        ]
      }
    },
    lgchem: {
      id: 'lgchem',
      name: language === 'KO' ? 'LG화학' : 'LG Chem',
      industry: language === 'KO' ? '화학 & 바이오' : 'Chemical & Bio',
      category: 'Chemical',
      logoColor: 'text-[#c3002f]',
      heroImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200',
      icon: <FlaskConical className="w-6 h-6" />,
      infographic: <LGChemDiagram />,
      content: {
        title: language === 'KO'
          ? '신소재 개발을 위한 연합 학습 기반 R&D'
          : 'Federated Learning-based R&D for New Materials',
        subtitle: language === 'KO'
          ? '민감한 실험 데이터 공유 없이 AI 모델 성능 고도화'
          : 'Enhancing AI model performance without sharing sensitive experimental data',
        challenge: language === 'KO'
          ? '새로운 고분자 소재 개발을 위해서는 방대한 물성 실험 데이터가 필요하지만, 각 연구소와 파트너사가 보유한 실험 데이터는 핵심 영업비밀이므로 외부 공유가 불가능하여 AI 모델 학습에 한계가 있었습니다.'
          : 'Developing new polymer materials requires vast property data, but experimental data held by labs and partners is a key trade secret, making external sharing impossible and limiting AI model training.',
        solution: language === 'KO'
          ? '데이터스페이스의 연합 학습(Federated Learning) 기술을 적용했습니다. 각 연구소의 로컬 서버에서 AI 모델을 1차 학습시킨 후, 모델의 가중치(Weight)만 중앙 서버로 전송하여 글로벌 모델을 업데이트하는 방식을 채택했습니다.'
          : 'Applied Federated Learning technology. AI models were trained locally at each lab, and only model weights were sent to a central server to update the global model.',
        benefit: language === 'KO'
          ? '데이터 유출 걱정 없이 전 세계 연구소의 데이터를 통합 활용할 수 있게 되어, 신소재 후보 물질 탐색 기간을 기존 대비 40% 단축했습니다.'
          : 'Enabled integrated use of data from global labs without leakage concerns, reducing the screening period for new material candidates by 40%.',
        details: [
            language === 'KO' ? '글로벌 연구소 간 R&D 데이터 사일로 해소' : 'Eliminating R&D data silos between global labs',
            language === 'KO' ? '물성 예측 AI 모델 정확도 20% 향상' : '20% improvement in property prediction AI accuracy',
            language === 'KO' ? '화학 반응 시뮬레이션 데이터 공유' : 'Sharing chemical reaction simulation data'
        ],
        adoption: [
            {
                title: language === 'KO' ? '연합 학습 오케스트레이션' : 'Federated Learning',
                desc: language === 'KO' ? '로컬 학습 및 가중치 집계(Aggregation) 프로세스를 자동화.' : 'Automated local training and weight aggregation processes.',
                icon: <Share2 className="w-5 h-5 text-indigo-500" />
            },
            {
                title: language === 'KO' ? '차분 프라이버시 기술' : 'Differential Privacy',
                desc: language === 'KO' ? '모델 업데이트 시 노이즈를 추가하여 역공학(Reverse-Engineering) 방지.' : 'Applied noise to model updates to prevent reverse-engineering of recipes.',
                icon: <ShieldCheck className="w-5 h-5 text-slate-600" />
            },
            {
                title: language === 'KO' ? '연구망 보안 게이트웨이' : 'Secure R&D Gateway',
                desc: language === 'KO' ? '폐쇄된 연구소 네트워크와 데이터스페이스 간의 안전한 연결 통로.' : 'Secure tunnel bridging isolated lab networks with the dataspace.',
                icon: <Server className="w-5 h-5 text-emerald-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? 'R&D 주기' : 'R&D Cycle', before: language === 'KO' ? '3년' : '3 Years', after: language === 'KO' ? '1.8년' : '1.8 Years', icon: <Timer className="w-4 h-4" /> },
            { metric: language === 'KO' ? '데이터 접근' : 'Data Access', before: language === 'KO' ? '로컬 한정' : 'Local Only', after: language === 'KO' ? '글로벌 연합' : 'Global Federated', icon: <Globe className="w-4 h-4" /> },
            { metric: language === 'KO' ? '위험도' : 'Risk', before: language === 'KO' ? '데이터 복제' : 'Copying', after: language === 'KO' ? '가중치 전송' : 'Weight Only', icon: <Lock className="w-4 h-4" /> }
        ]
      }
    },
    hanwha: {
      id: 'hanwha',
      name: language === 'KO' ? '한화솔루션' : 'Hanwha Solutions',
      industry: language === 'KO' ? '신재생 에너지' : 'Renewable Energy',
      category: 'Energy',
      logoColor: 'text-[#f37321]',
      heroImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200',
      icon: <Sun className="w-6 h-6" />,
      infographic: <HanwhaDiagram />,
      content: {
        title: language === 'KO'
          ? '가상 발전소(VPP) 운영 및 전력 중개 최적화'
          : 'Virtual Power Plant (VPP) Operation & Power Trading Optimization',
        subtitle: language === 'KO'
          ? '분산된 태양광 발전 데이터 통합 및 전력망 안정화'
          : 'Integrating distributed solar generation data and stabilizing the power grid',
        challenge: language === 'KO'
          ? '전국에 분산된 수천 개의 소규모 태양광 발전소는 날씨에 따라 발전량이 불규칙하여 전력망 운영에 부담을 주었습니다. 정확한 발전량 예측 없이는 전력 도매 시장에서의 수익성을 확보하기 어려웠습니다.'
          : 'Thousands of distributed small solar plants caused grid instability due to weather-dependent irregular generation. Profitability in the wholesale power market was hard to secure without accurate forecasting.',
        solution: language === 'KO'
          ? '분산된 발전소의 실시간 발전 데이터와 기상청의 기상 데이터를 데이터스페이스로 수집하여 통합 분석 플랫폼을 구축했습니다. AI 예측 모델을 통해 발전량을 정밀하게 예측하고 가상 발전소(VPP) 자원으로 묶어 관리했습니다.'
          : 'Built an integrated analysis platform collecting real-time generation data from distributed plants and weather data via DataSpace. Managed them as VPP resources with precise AI-based forecasting.',
        benefit: language === 'KO'
          ? '발전량 예측 오차율을 3% 이내로 줄여 전력망 안정화에 기여하고, 전력 중개 시장에서의 정산 수익을 극대화했습니다. 소규모 발전 사업자들에게도 데이터 기반의 수익 모델을 제공했습니다.'
          : 'Reduced forecasting error to within 3%, contributing to grid stability and maximizing revenue in the power trading market. Provided data-driven revenue models to small power producers.',
        details: [
            language === 'KO' ? '분산 에너지 자원(DER) 실시간 통합 관제' : 'Real-time integrated control of DERs',
            language === 'KO' ? '기상 데이터 연동 발전량 예측 AI' : 'Weather-linked generation forecasting AI',
            language === 'KO' ? 'RE100 이행을 위한 재생에너지 인증' : 'Renewable energy certification for RE100'
        ],
        adoption: [
            {
                title: language === 'KO' ? '경량 엣지 커넥터' : 'Lightweight Edge',
                desc: language === 'KO' ? '소규모 발전소 환경에 적합한 저전력/경량 EDC 에이전트 배포.' : 'Deployed lightweight EDC agents suitable for small-scale plant environments.',
                icon: <Cpu className="w-5 h-5 text-orange-500" />
            },
            {
                title: language === 'KO' ? '기상 데이터 오라클' : 'Weather Oracle',
                desc: language === 'KO' ? '외부 기상 API 데이터를 신뢰할 수 있는 형태로 데이터스페이스에 주입.' : 'Injected external weather API data into dataspace via trusted oracle.',
                icon: <Sun className="w-5 h-5 text-yellow-500" />
            },
            {
                title: language === 'KO' ? 'REC 토큰화' : 'Tokenized REC',
                desc: language === 'KO' ? '재생에너지 공급 인증서(REC)를 토큰 자산으로 발행하여 거래 투명성 확보.' : 'Minted Renewable Energy Certificates (REC) as tokens for trading transparency.',
                icon: <Code className="w-5 h-5 text-emerald-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? '예측 오차' : 'Prediction Error', before: '15%', after: '3%', icon: <Activity className="w-4 h-4" /> },
            { metric: language === 'KO' ? '그리드 페널티' : 'Grid Penalty', before: language === 'KO' ? '높음' : 'High', after: language === 'KO' ? '낮음' : 'Low', icon: <XCircle className="w-4 h-4" /> },
            { metric: language === 'KO' ? '수익' : 'Revenue', before: language === 'KO' ? '기본' : 'Baseline', after: language === 'KO' ? '최적화됨' : 'Optimized', icon: <TrendingUp className="w-4 h-4" /> }
        ]
      }
    },
    doosan: {
      id: 'doosan',
      name: language === 'KO' ? '두산로보틱스' : 'Doosan Robotics',
      industry: language === 'KO' ? '로봇 & 자동화' : 'Robotics & Automation',
      category: 'Robotics',
      logoColor: 'text-[#003f84]',
      heroImage: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200',
      icon: <Bot className="w-6 h-6" />,
      infographic: <DoosanDiagram />,
      content: {
        title: language === 'KO'
          ? '협동로봇 플릿 매니지먼트 및 원격 진단'
          : 'Cobot Fleet Management & Remote Diagnostics',
        subtitle: language === 'KO'
          ? '글로벌 설치 로봇의 가동률 향상 및 선제적 유지보수'
          : 'Improving utilization and proactive maintenance of globally installed robots',
        challenge: language === 'KO'
          ? '전 세계 다양한 공장에 설치된 협동로봇의 운영 상태를 실시간으로 파악하기 어려웠습니다. 고장 발생 시 엔지니어가 현장에 방문해야만 원인을 파악할 수 있어, 수리 시간과 비용이 과다하게 소요되었습니다.'
          : 'Real-time status of cobots in global factories was hard to track. Engineers had to visit sites to diagnose failures, causing excessive repair time and costs.',
        solution: language === 'KO'
          ? '고객사의 보안 정책을 준수하면서 로봇의 토크 센서, 모터 온도, 에러 로그 데이터를 수집하는 데이터스페이스 파이프라인을 구축했습니다. 이상 징후가 감지되면 자동으로 진단 리포트가 생성되어 관리자에게 전송됩니다.'
          : 'Built a DataSpace pipeline collecting torque sensor, motor temp, and error logs while complying with customer security policies. Automated diagnostic reports are sent to managers upon anomaly detection.',
        benefit: language === 'KO'
          ? '사후 대응이 아닌 사전 예지보전이 가능해져 로봇의 다운타임을 최소화하고 부품 수명을 연장했습니다. 수집된 데이터를 바탕으로 로봇의 작업 효율을 최적화하는 컨설팅 서비스로 비즈니스를 확장했습니다.'
          : 'Enabled proactive predictive maintenance instead of reactive response, minimizing downtime and extending part life. Expanded business to consulting services optimizing robot efficiency based on collected data.',
        details: [
            language === 'KO' ? '글로벌 로봇 통합 관제 대시보드' : 'Global robot integrated control dashboard',
            language === 'KO' ? '부품 수명 예측 및 자동 발주 시스템' : 'Part life prediction and auto-ordering system',
            language === 'KO' ? '작업 공정별 최적 모션 데이터 추천' : 'Optimal motion data recommendation per process'
        ],
        adoption: [
            {
                title: language === 'KO' ? 'RaaS 과금 모델' : 'RaaS Billing',
                desc: language === 'KO' ? '로봇 사용량 데이터 스트림에 기반한 종량제(Pay-per-use) 과금 구현.' : 'Implemented pay-per-use billing based on robot usage data streams.',
                icon: <Activity className="w-5 h-5 text-blue-500" />
            },
            {
                title: language === 'KO' ? '보안 OTA 파이프라인' : 'Secure OTA',
                desc: language === 'KO' ? '데이터스페이스를 통해 펌웨어 업데이트를 안전하게 배포하고 검증.' : 'Securely deployed and verified firmware updates via dataspace.',
                icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />
            },
            {
                title: language === 'KO' ? '로봇 DID 관리' : 'Robot Identity',
                desc: language === 'KO' ? '개별 로봇마다 고유 식별자(DID)를 부여하여 생애주기 관리.' : 'Assigned Unique Decentralized Identifier (DID) for robot lifecycle management.',
                icon: <Key className="w-5 h-5 text-purple-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? '대응 시간' : 'Response Time', before: language === 'KO' ? '48시간' : '48 Hours', after: language === 'KO' ? '2시간' : '2 Hours', icon: <Clock className="w-4 h-4" /> },
            { metric: language === 'KO' ? '유지보수' : 'Maintenance', before: language === 'KO' ? '고장 후 수리' : 'Break-fix', after: language === 'KO' ? '예지보전' : 'Predictive', icon: <Wrench className="w-4 h-4" /> },
            { metric: language === 'KO' ? '가동률' : 'Uptime', before: '85%', after: '98%', icon: <TrendingUp className="w-4 h-4" /> }
        ]
      }
    },
    cj: {
      id: 'cj',
      name: language === 'KO' ? 'CJ대한통운' : 'CJ Logistics',
      industry: language === 'KO' ? '물류 & 리테일' : 'Logistics & Retail',
      category: 'Logistics',
      logoColor: 'text-[#ff7f00]',
      heroImage: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=1200',
      icon: <Package className="w-6 h-6" />,
      infographic: <CJDiagram />,
      content: {
        title: language === 'KO'
          ? '풀필먼트 최적화 및 라스트마일 혁신'
          : 'Fulfillment Optimization & Last Mile Innovation',
        subtitle: language === 'KO'
          ? '이커머스 데이터 연동을 통한 예측 배송 시스템 구축'
          : 'Building a predictive delivery system via e-commerce data integration',
        challenge: language === 'KO'
          ? '이커머스 주문량의 급격한 변동과 다품종 소량 배송 증가로 인해 물류 센터의 운영 효율성이 저하되고, 배송 지연이 빈번하게 발생했습니다. 판매자(Seller)와 물류사 간의 데이터 단절이 주요 원인이었습니다.'
          : 'Rapid fluctuations in e-commerce orders and increased small-batch deliveries reduced warehouse efficiency and caused frequent delays. Data disconnection between sellers and logistics providers was the main cause.',
        solution: language === 'KO'
          ? '데이터스페이스를 통해 쇼핑몰의 주문 정보, 상품 제원, 고객 배송지 데이터를 실시간으로 공유받아 AI 기반의 풀필먼트 시스템을 구축했습니다. 개인정보가 포함된 배송 데이터는 암호화되어 안전하게 처리되었습니다.'
          : 'Built an AI-based fulfillment system by sharing real-time order info, product specs, and delivery addresses via DataSpace. Sensitive delivery data was encrypted and processed securely.',
        benefit: language === 'KO'
          ? '주문 마감 시간을 연장하면서도 익일 배송률을 98%까지 끌어올렸습니다. 최적화된 적재 및 라우팅 알고리즘을 적용하여 배송 차량의 운행 거리를 단축하고 탄소 배출을 저감했습니다.'
          : 'Extended order cutoff times while boosting next-day delivery rates to 98%. Applied optimized loading and routing algorithms to reduce delivery mileage and carbon emissions.',
        details: [
            language === 'KO' ? '판매자-물류센터 간 실시간 재고 동기화' : 'Real-time inventory sync between seller and warehouse',
            language === 'KO' ? 'AI 기반 택배 박스 크기 추천 (오포장 감소)' : 'AI-based box size recommendation (reduced packaging waste)',
            language === 'KO' ? '동적 라우팅을 통한 배송 경로 최적화' : 'Delivery route optimization via dynamic routing'
        ],
        adoption: [
            {
                title: language === 'KO' ? '이커머스 통합 게이트웨이' : 'E-commerce Gateway',
                desc: language === 'KO' ? '다양한 판매자 API를 표준 물류 모델로 변환하는 게이트웨이 구축.' : 'Built a gateway mapping diverse seller APIs to standard logistics models.',
                icon: <Server className="w-5 h-5 text-orange-500" />
            },
            {
                title: language === 'KO' ? '동적 라우팅 엔진' : 'Dynamic Routing',
                desc: language === 'KO' ? '실시간 교통 정보와 주문 데이터를 연동하여 배송 경로 최적화.' : 'Optimized delivery routes by linking real-time traffic and order data.',
                icon: <Truck className="w-5 h-5 text-blue-500" />
            },
            {
                title: language === 'KO' ? '동형 암호화 분석' : 'Homomorphic Enc.',
                desc: language === 'KO' ? '개인정보 노출 없이 고객 배송 패턴을 분석하기 위한 암호화 기술 적용.' : 'Applied encryption to analyze delivery patterns without exposing PII.',
                icon: <Lock className="w-5 h-5 text-slate-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? '배송 속도' : 'Delivery Speed', before: 'D+2', after: 'D+1', icon: <Truck className="w-4 h-4" /> },
            { metric: language === 'KO' ? '포장 낭비' : 'Packaging Waste', before: '20%', after: '5%', icon: <Recycle className="w-4 h-4" /> },
            { metric: language === 'KO' ? '라우팅' : 'Routing', before: language === 'KO' ? '고정 경로' : 'Static', after: language === 'KO' ? '동적 AI' : 'Dynamic AI', icon: <MapIcon className="w-4 h-4" /> }
        ]
      }
    },
    hd: {
      id: 'hd',
      name: language === 'KO' ? 'HD현대' : 'HD Hyundai',
      industry: language === 'KO' ? '조선 & 중공업' : 'Shipbuilding & Heavy Ind.',
      category: 'Shipbuilding',
      logoColor: 'text-[#006e51]',
      heroImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200', 
      icon: <Anchor className="w-6 h-6" />,
      infographic: <HDDiagram />,
      content: {
        title: language === 'KO'
          ? '스마트 야드 구축 및 용접 품질 데이터 공유'
          : 'Smart Yard Construction & Welding Quality Data Sharing',
        subtitle: language === 'KO'
          ? '조선소 내 수만 개의 IoT 센서 데이터 통합 및 협력사 품질 관리'
          : 'Integrating data from tens of thousands of IoT sensors in the shipyard and managing supplier quality',
        challenge: language === 'KO'
          ? '거대한 조선소 야드에 분산된 자재의 위치 파악이 어렵고, 수많은 협력사가 수행하는 용접 공정의 품질을 일일이 검사하는 데 막대한 인력과 시간이 소요되었습니다.'
          : 'Locating materials dispersed across the vast shipyard was difficult, and manually inspecting welding quality performed by numerous subcontractors required immense labor and time.',
        solution: language === 'KO'
          ? '협력사의 용접기 IoT 데이터를 데이터스페이스로 수집하여 실시간으로 용접 전류, 전압, 아크 시간을 모니터링했습니다. 또한, 야드 내 크레인과 운송 장비의 위치 데이터를 공유하여 물류 흐름을 시각화했습니다.'
          : 'Collected welder IoT data from subcontractors via DataSpace to monitor current, voltage, and arc time in real-time. Also shared location data of cranes and transporters to visualize logistics flow.',
        benefit: language === 'KO'
          ? '용접 불량률을 획기적으로 낮추고 비파괴 검사(NDT) 비용을 절감했습니다. 자재 위치 추적을 통해 공기(Lead Time)를 단축하고, 안전 사고 위험을 사전에 감지하여 작업자 안전을 확보했습니다.'
          : 'Drastically reduced welding defect rates and NDT costs. Shortened lead time via material tracking and secured worker safety by detecting risks in advance.',
        details: [
            language === 'KO' ? '용접 파라미터 실시간 모니터링 및 이상 탐지' : 'Real-time monitoring and anomaly detection of welding parameters',
            language === 'KO' ? '야드 내 자재/장비 위치 기반 물류 최적화' : 'Logistics optimization based on material/equipment location',
            language === 'KO' ? '협력사 공정 데이터 통합 품질 리포트' : 'Integrated quality reports with subcontractor process data'
        ],
        adoption: [
            {
                title: language === 'KO' ? 'IoT 데이터 레이크하우스' : 'IoT Lakehouse',
                desc: language === 'KO' ? '야드 내 대규모 IoT 스트림을 가상화하여 커넥터로 연결.' : 'Virtualizing massive IoT streams in the yard accessible via connectors.',
                icon: <Database className="w-5 h-5 text-blue-600" />
            },
            {
                title: language === 'KO' ? '5G MEC 적용' : '5G MEC',
                desc: language === 'KO' ? '대용량 용접 데이터의 초저지연 전송을 위해 5G 엣지 컴퓨팅 활용.' : 'Leveraged 5G MEC for low-latency transmission of large welding datasets.',
                icon: <Radio className="w-5 h-5 text-emerald-500" />
            },
            {
                title: language === 'KO' ? '작업자 안전 데이터 보호' : 'Worker Safety Privacy',
                desc: language === 'KO' ? '웨어러블 기기의 생체 데이터 수집 시 엄격한 프라이버시 제어 적용.' : 'Strict privacy controls for biometric data from wearables.',
                icon: <ShieldCheck className="w-5 h-5 text-red-500" />
            }
        ],
        comparison: [
            { metric: language === 'KO' ? '불량률' : 'Defect Rate', before: '5%', after: '0.5%', icon: <AlertTriangle className="w-4 h-4" /> },
            { metric: language === 'KO' ? '추적' : 'Tracking', before: language === 'KO' ? '수동' : 'Manual', after: language === 'KO' ? '디지털 트윈' : 'Digital Twin', icon: <Globe className="w-4 h-4" /> },
            { metric: language === 'KO' ? '안전' : 'Safety', before: language === 'KO' ? '위험' : 'Risky', after: language === 'KO' ? '확보됨' : 'Secured', icon: <ShieldCheck className="w-4 h-4" /> }
        ]
      }
    }
  };

  // Filter Cases
  const filteredCases = Object.values(cases).filter(c => selectedCategory === 'All' || c.category === selectedCategory);
  const activeCase = cases[activeTab];

  // Auto-switch tab if active tab is filtered out
  useEffect(() => {
      const isVisible = filteredCases.find(c => c.id === activeTab);
      if (!isVisible && filteredCases.length > 0) {
          setActiveTab(filteredCases[0].id);
      }
  }, [selectedCategory]);

  const categories = ['All', ...Array.from(new Set(Object.values(cases).map(c => c.category)))];

  const steps = [
      { id: 1, icon: <MessageSquare className="w-6 h-6" />, titleKey: 'uc_step_1_title', descKey: 'uc_step_1_desc', color: 'bg-blue-500' },
      { id: 2, icon: <UserPlus className="w-6 h-6" />, titleKey: 'uc_step_2_title', descKey: 'uc_step_2_desc', color: 'bg-indigo-500' },
      { id: 3, icon: <Plug className="w-6 h-6" />, titleKey: 'uc_step_3_title', descKey: 'uc_step_3_desc', color: 'bg-purple-500' },
      { id: 4, icon: <Rocket className="w-6 h-6" />, titleKey: 'uc_step_4_title', descKey: 'uc_step_4_desc', color: 'bg-emerald-500' },
  ];

  // Helper function to prepare chart data for the popup
  const getPopupChartData = (item: ComparisonItem) => {
      // Very basic parsing to generate sample numeric data for visualization
      const parseValue = (str: string) => {
          const num = parseFloat(str.replace(/[^0-9.]/g, ''));
          return isNaN(num) ? 50 : num; // Default fallback
      };

      const beforeVal = parseValue(item.before);
      const afterVal = parseValue(item.after);
      
      // Determine if lower is better (e.g. time, waste) or higher is better (e.g. trust, accuracy)
      const isTimeOrWaste = item.metric.toLowerCase().includes('time') || 
                            item.metric.toLowerCase().includes('waste') ||
                            item.metric.toLowerCase().includes('risk') ||
                            item.metric.toLowerCase().includes('wait') ||
                            item.metric.toLowerCase().includes('defect') ||
                            item.metric.toLowerCase().includes('시간') ||
                            item.metric.toLowerCase().includes('낭비') ||
                            item.metric.toLowerCase().includes('위험') ||
                            item.metric.toLowerCase().includes('불량');

      // Adjust mock values for better visualization if parsing failed or units differ widely
      let finalBefore = beforeVal;
      let finalAfter = afterVal;

      if (finalBefore === 50 && finalAfter === 50) {
          // If parsing failed, create dummy "improvement" data
          finalBefore = 80;
          finalAfter = 20; 
          if (!isTimeOrWaste) {
             finalBefore = 20;
             finalAfter = 80;
          }
      } else if (item.before.includes('Days') && item.after.includes('Hours')) {
          // Unit conversion scenario mock
          finalBefore = beforeVal * 24; 
          finalAfter = afterVal;
      }

      return [
          { name: language === 'KO' ? '기존' : 'Before', value: finalBefore, fill: '#ef4444' }, // Red for Before
          { name: language === 'KO' ? '개선 후' : 'After', value: finalAfter, fill: '#10b981' }   // Green for After
      ];
  };

  const getDetailedContent = (item: ComparisonItem) => {
      // In a real app, this would come from the database. Here we generate generic but context-aware text.
      const isKorean = language === 'KO';
      
      return {
          title: item.metric,
          description: isKorean 
            ? `기존의 프로세스에서는 "${item.before}" 수준에 머물렀던 성과가 데이터스페이스 도입 후 "${item.after}" 수준으로 획기적으로 개선되었습니다. 데이터의 투명한 공유와 자동화된 처리가 주요 요인입니다.`
            : `Performance improved significantly from "${item.before}" to "${item.after}" after adopting DataSpace. Transparent data sharing and automated processing were key factors.`,
          impact: isKorean
            ? "비용 절감, 리드타임 단축, 그리고 신뢰성 확보를 통해 비즈니스 경쟁력을 강화했습니다."
            : "Enhanced business competitiveness through cost reduction, lead time reduction, and secured reliability."
      };
  };

  // Mock Radar Data for Detailed Case Study
  const getRadarData = () => [
      { subject: language === 'KO' ? '속도' : 'Speed', A: 40, B: 95, fullMark: 100 },
      { subject: language === 'KO' ? '보안' : 'Security', A: 50, B: 100, fullMark: 100 },
      { subject: language === 'KO' ? '가시성' : 'Visibility', A: 30, B: 90, fullMark: 100 },
      { subject: language === 'KO' ? '비용 효율' : 'Cost Eff.', A: 60, B: 85, fullMark: 100 },
      { subject: language === 'KO' ? '규정 준수' : 'Compliance', A: 45, B: 98, fullMark: 100 },
  ];

  // --- TECH STACK HELPERS ---
  const getTechVisual = (title: string) => {
      // Return a visual component based on the title keywords
      if (title.includes('EDC') || title.includes('Connector')) {
          return (
              <div className="relative h-48 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent"></div>
                  <div className="flex gap-8 items-center z-10">
                      <div className="w-16 h-16 bg-slate-800 border-2 border-blue-500 rounded-lg flex flex-col items-center justify-center text-blue-400">
                          <Database className="w-6 h-6 mb-1" />
                          <span className="text-[9px] font-bold">Provider</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <div className="w-24 h-1 bg-slate-700 relative overflow-hidden rounded-full">
                              <div className="absolute top-0 left-0 h-full w-1/2 bg-blue-500 animate-[shimmer_2s_infinite]"></div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">HTTPS / IDS</span>
                      </div>
                      <div className="w-16 h-16 bg-slate-800 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center text-emerald-400">
                          <Server className="w-6 h-6 mb-1" />
                          <span className="text-[9px] font-bold">Consumer</span>
                      </div>
                  </div>
              </div>
          );
      }
      if (title.includes('Blockchain') || title.includes('VC') || title.includes('Token')) {
          return (
              <div className="relative h-48 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="flex gap-2 z-10">
                      {[1, 2, 3].map(i => (
                          <div key={i} className="w-16 h-16 bg-slate-800 border-2 border-purple-500 rounded-lg flex items-center justify-center shadow-lg relative">
                              <Blocks className="w-6 h-6 text-purple-400" />
                              <div className="absolute -right-3 top-1/2 w-4 h-1 bg-purple-700"></div>
                          </div>
                      ))}
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-purple-300 text-xs font-mono bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500/30">
                      Hash: 0x7f2...9a1
                  </div>
              </div>
          );
      }
      if (title.includes('Learning') || title.includes('AI') || title.includes('Algorithm')) {
          return (
              <div className="relative h-48 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-noise opacity-10"></div>
                  <div className="w-32 h-32 border-4 border-dashed border-indigo-500 rounded-full flex items-center justify-center animate-spin-slow">
                      <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                          <Network className="w-10 h-10 text-white" />
                      </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-indigo-900/80 text-indigo-200 text-[10px] px-2 py-1 rounded">
                      Model Update
                  </div>
              </div>
          );
      }
      // Default
      return (
          <div className="relative h-48 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
              <Workflow className="w-16 h-16 text-slate-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          </div>
      );
  };

  const getTechInfo = (title: string, desc: string) => {
      // Mocking detailed content generation based on title keywords
      const isKorean = language === 'KO';
      let mechanism = isKorean ? "상세 메커니즘 설명이 여기에 표시됩니다." : "Detailed mechanism explanation goes here.";
      let strategy = isKorean ? "이 기술이 선택된 전략적 이유입니다." : "Strategic reason for choosing this tech.";
      let specs = ["Protocol v1.0", "ISO Standard"];

      if (title.includes('EDC')) {
          mechanism = isKorean 
            ? "EDC(Eclipse Dataspace Components)는 데이터 전송(Data Plane)과 제어(Control Plane)를 분리하여, 데이터 소유자가 접근 정책을 엄격하게 제어할 수 있게 합니다. 데이터는 중앙 서버에 저장되지 않고 피어 투 피어(P2P)로 암호화되어 전송됩니다."
            : "EDC separates the Data Plane from the Control Plane, allowing data owners to strictly control access policies. Data is not stored centrally but transmitted peer-to-peer (P2P) in an encrypted format.";
          strategy = isKorean
            ? "기존 레거시 시스템(ERP/MES)을 변경하지 않고도 안전하게 외부와 데이터를 연동할 수 있는 가장 효율적인 표준입니다."
            : "The most efficient standard to securely link data with external parties without altering existing legacy systems (ERP/MES).";
          specs = ["IDS-RAM 4.0", "DCATv2", "ODRL"];
      } else if (title.includes('Blockchain') || title.includes('VC') || title.includes('Did')) {
          mechanism = isKorean
            ? "하이퍼레저(Hyperledger) 또는 이더리움 기반의 프라이빗 체인을 사용하여 데이터의 해시값(지문)만을 기록합니다. 이를 통해 데이터의 위변조 여부를 검증하고, 스마트 컨트랙트로 거래를 자동 실행합니다."
            : "Uses Hyperledger or Ethereum-based private chains to record only data hashes (fingerprints). This verifies data integrity and automates transactions via smart contracts.";
          strategy = isKorean
            ? "참여자 간의 신뢰 비용을 제거하고, 감사 추적(Audit Trail)을 자동화하여 규제 준수 비용을 절감합니다."
            : "Eliminates trust costs between participants and automates audit trails to reduce compliance costs.";
          specs = ["Hyperledger Besu", "W3C DID", "Verifiable Credentials"];
      } else if (title.includes('Learning') || title.includes('Compute')) {
          mechanism = isKorean
            ? "원시 데이터는 로컬 서버에 남겨두고, AI 알고리즘만 이동하여 학습을 수행하는 방식입니다. 학습된 가중치(Weight) 결과값만 중앙 서버로 전송되어 글로벌 모델을 업데이트합니다."
            : "Raw data remains on local servers; only AI algorithms move to perform training. Only the learned weights are sent back to the central server to update the global model.";
          strategy = isKorean
            ? "민감한 제조 데이터나 개인정보의 외부 유출 없이 AI 모델의 성능을 고도화할 수 있는 유일한 방법입니다."
            : "The only way to enhance AI model performance without leaking sensitive manufacturing data or personal information.";
          specs = ["PySyft", "TensorFlow Federated", "Differential Privacy"];
      }

      return { mechanism, strategy, specs };
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 relative">
      {/* --- POPUP MODAL (PAIN POINTS) --- */}
      {selectedPainPoint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp relative">
                  {/* Header */}
                  <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600 rounded-lg">
                              <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <div>
                              <h2 className="text-xl font-bold">{language === 'KO' ? '성과 상세 분석' : 'Performance Analysis'}</h2>
                              <p className="text-xs text-slate-400 uppercase tracking-wider">{selectedPainPoint.metric}</p>
                          </div>
                      </div>
                      <button 
                          onClick={() => setSelectedPainPoint(null)}
                          className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                      >
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left: Story & Context */}
                      <div className="space-y-6">
                          <div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-2">{getDetailedContent(selectedPainPoint).title}</h3>
                              <p className="text-slate-600 leading-relaxed">
                                  {getDetailedContent(selectedPainPoint).description}
                              </p>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-blue-600" />
                                  {language === 'KO' ? '비즈니스 임팩트' : 'Business Impact'}
                              </h4>
                              <p className="text-sm text-blue-800">
                                  {getDetailedContent(selectedPainPoint).impact}
                              </p>
                          </div>

                          {/* Process Transformation Visualization */}
                          <div>
                              <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider">
                                  {language === 'KO' ? '프로세스 변화' : 'Process Transformation'}
                              </h4>
                              <div className="relative flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  {/* Old Way */}
                                  <div className="flex flex-col items-center gap-2 text-center opacity-60">
                                      <div className="w-12 h-12 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center text-slate-400">
                                          <FileX className="w-5 h-5" />
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">Legacy / Manual</span>
                                  </div>

                                  {/* Arrow Animation */}
                                  <div className="flex-1 px-4 relative">
                                      <div className="h-1 bg-slate-200 w-full rounded-full overflow-hidden">
                                          <div className="h-full bg-blue-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
                                      </div>
                                      <ArrowRight className="w-4 h-4 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 rounded-full p-0.5" />
                                  </div>

                                  {/* New Way */}
                                  <div className="flex flex-col items-center gap-2 text-center">
                                      <div className="w-12 h-12 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-100">
                                          <Zap className="w-5 h-5" />
                                      </div>
                                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Automated / Real-time</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Right: Visual Chart */}
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-center">
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-6 text-center tracking-wider">
                              {language === 'KO' ? '정량적 비교 데이터' : 'Quantitative Comparison'}
                          </h4>
                          <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={getPopupChartData(selectedPainPoint)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                                      <YAxis hide />
                                      <Tooltip 
                                          cursor={{fill: 'transparent'}}
                                          content={({ active, payload }) => {
                                              if (active && payload && payload.length) {
                                                  return (
                                                      <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg">
                                                          <p className="font-bold">{payload[0].payload.name}</p>
                                                          <p>Value Index: {payload[0].value}</p>
                                                      </div>
                                                  );
                                              }
                                              return null;
                                          }}
                                      />
                                      <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                                          {getPopupChartData(selectedPainPoint).map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.fill} />
                                          ))}
                                      </Bar>
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                          <div className="flex justify-between px-8 mt-2">
                              <div className="text-center">
                                  <span className="block text-2xl font-bold text-red-500">{selectedPainPoint.before}</span>
                                  <span className="text-[10px] text-slate-400 uppercase font-bold">Before</span>
                              </div>
                              <div className="text-center">
                                  <span className="block text-2xl font-bold text-emerald-500">{selectedPainPoint.after}</span>
                                  <span className="text-[10px] text-slate-400 uppercase font-bold">After</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- TECH STACK MODAL (NEW) --- */}
      {selectedTechItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp relative flex flex-col md:flex-row max-h-[90vh]">
                  
                  {/* Left: Visual & Key Specs */}
                  <div className="md:w-5/12 bg-slate-950 p-8 text-white relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" 
                           style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                      </div>
                      
                      <button onClick={() => setSelectedTechItem(null)} className="absolute top-4 left-4 md:hidden text-white/50 hover:text-white">
                          <ArrowRight className="w-6 h-6 rotate-180" />
                      </button>

                      <div className="mb-8 relative z-10">
                          {getTechVisual(selectedTechItem.title)}
                      </div>

                      <div className="flex-1 relative z-10">
                          <h3 className="text-xl font-bold mb-2">{selectedTechItem.title}</h3>
                          <p className="text-sm text-slate-400 mb-6">{selectedTechItem.desc}</p>
                          
                          <div className="space-y-4">
                              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Technical Standards</h4>
                              {getTechInfo(selectedTechItem.title, selectedTechItem.desc).specs.map((spec, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                                      <Settings className="w-4 h-4 text-emerald-400" />
                                      <span className="text-sm font-mono">{spec}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Right: Detailed Content */}
                  <div className="md:w-7/12 p-8 bg-white overflow-y-auto relative">
                      <button onClick={() => setSelectedTechItem(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                          <X className="w-6 h-6" />
                      </button>

                      <div className="space-y-8 pt-4">
                          <div>
                              <h4 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                                  <Cpu className="w-4 h-4 text-blue-600" />
                                  {language === 'KO' ? '기술 메커니즘' : 'Technical Mechanism'}
                              </h4>
                              <p className="text-slate-600 leading-relaxed text-sm">
                                  {getTechInfo(selectedTechItem.title, selectedTechItem.desc).mechanism}
                              </p>
                          </div>

                          <div>
                              <h4 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                                  <Rocket className="w-4 h-4 text-purple-600" />
                                  {language === 'KO' ? '전략적 가치' : 'Strategic Value'}
                              </h4>
                              <p className="text-slate-600 leading-relaxed text-sm">
                                  {getTechInfo(selectedTechItem.title, selectedTechItem.desc).strategy}
                              </p>
                          </div>

                          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                              <h4 className="font-bold text-blue-900 text-sm mb-2">
                                  {language === 'KO' ? '데이터스페이스 적용 효과' : 'Applied Impact'}
                              </h4>
                              <div className="flex items-center gap-4">
                                  <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-600 w-[85%]"></div>
                                  </div>
                                  <span className="text-xs font-bold text-blue-700">High Impact</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- DETAILED CASE STUDY MODAL (FULL REPORT) --- */}
      {showDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden animate-scaleUp relative my-8 flex flex-col">
                  {/* Modal Header */}
                  <div className="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-50">
                      <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-600 rounded-lg">
                              <Microscope className="w-6 h-6 text-white" />
                          </div>
                          <div>
                              <h2 className="text-xl font-bold">{activeCase.name} - Digital Transformation Report</h2>
                              <p className="text-xs text-slate-400 uppercase tracking-wider">{activeCase.industry}</p>
                          </div>
                      </div>
                      <button 
                          onClick={() => setShowDetailModal(false)}
                          className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                      >
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="p-8 space-y-12 overflow-y-auto max-h-[85vh]">
                      
                      {/* Section 1: Architecture Shift Infographic */}
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                              <Layers className="w-6 h-6 text-blue-600" />
                              {language === 'KO' ? '데이터 아키텍처의 진화 (Before vs After)' : 'Evolution of Data Architecture (Before vs After)'}
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                              {/* Before State */}
                              <div className="md:col-span-3 bg-slate-50 p-6 rounded-2xl border border-slate-200 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                  <h4 className="text-center text-sm font-bold text-slate-500 uppercase mb-6">Legacy / Siloed</h4>
                                  <div className="flex justify-center gap-8 relative">
                                      <div className="flex flex-col items-center gap-2">
                                          <div className="w-12 h-12 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                                              <FileSpreadsheet className="w-6 h-6" />
                                          </div>
                                          <span className="text-xs font-bold text-slate-500">Excel</span>
                                      </div>
                                      <div className="flex flex-col items-center gap-2">
                                          <div className="w-12 h-12 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                                              <Mail className="w-6 h-6" />
                                          </div>
                                          <span className="text-xs font-bold text-slate-500">Email</span>
                                      </div>
                                      {/* Disconnected Line */}
                                      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-300 -z-10 border-t-2 border-dashed"></div>
                                      <XCircle className="w-6 h-6 text-red-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
                                  </div>
                                  <p className="text-center text-xs text-slate-500 mt-4 px-4">
                                      Manual data entry, delayed synchronization, high risk of errors.
                                  </p>
                              </div>

                              {/* Transition Arrow */}
                              <div className="md:col-span-1 flex justify-center">
                                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                                      <ArrowRight className="w-6 h-6" />
                                  </div>
                              </div>

                              {/* After State */}
                              <div className="md:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full filter blur-3xl opacity-10"></div>
                                  <h4 className="text-center text-sm font-bold text-blue-700 uppercase mb-6">DataSpace Connected</h4>
                                  <div className="flex justify-center gap-4 relative z-10">
                                      {/* Nodes */}
                                      <div className="flex flex-col items-center gap-2">
                                          <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-600 shadow-md">
                                              <Database className="w-6 h-6" />
                                          </div>
                                          <span className="text-xs font-bold text-blue-700">EDC Node</span>
                                      </div>
                                      
                                      {/* Animated Stream */}
                                      <div className="flex-1 h-12 flex items-center justify-center relative">
                                          <div className="w-full h-1 bg-blue-200 rounded-full overflow-hidden">
                                              <div className="h-full w-1/2 bg-blue-500 animate-[progress_1s_ease-in-out_infinite]"></div>
                                          </div>
                                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-500 border border-blue-100 shadow-sm">
                                              IDS/DSP
                                          </div>
                                      </div>

                                      <div className="flex flex-col items-center gap-2">
                                          <div className="w-12 h-12 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 shadow-md">
                                              <Activity className="w-6 h-6" />
                                          </div>
                                          <span className="text-xs font-bold text-emerald-700">Real-time AI</span>
                                      </div>
                                  </div>
                                  <p className="text-center text-xs text-blue-600 mt-4 px-4 font-medium">
                                      Automated, secure P2P streaming with sovereignty protection.
                                  </p>
                              </div>
                          </div>
                      </div>

                      {/* Section 2: Quantitative Impact (Radar Chart) */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                  <BarChart3 className="w-5 h-5 text-purple-600" />
                                  {language === 'KO' ? '다차원 성과 분석' : 'Multi-Dimensional Impact Analysis'}
                              </h3>
                              <div className="h-80 w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                          { subject: language === 'KO' ? '속도' : 'Speed', A: 40, B: 95, fullMark: 100 },
                                          { subject: language === 'KO' ? '보안' : 'Security', A: 50, B: 100, fullMark: 100 },
                                          { subject: language === 'KO' ? '가시성' : 'Visibility', A: 30, B: 90, fullMark: 100 },
                                          { subject: language === 'KO' ? '비용 효율' : 'Cost Eff.', A: 60, B: 85, fullMark: 100 },
                                          { subject: language === 'KO' ? '규정 준수' : 'Compliance', A: 45, B: 98, fullMark: 100 },
                                      ]}>
                                          <PolarGrid stroke="#e2e8f0" />
                                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                          <Radar name="Before (Legacy)" dataKey="A" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.4} />
                                          <Radar name="After (DataSpace)" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                          <Legend />
                                          <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                                      </RadarChart>
                                  </ResponsiveContainer>
                              </div>
                          </div>

                          <div className="space-y-6">
                              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-emerald-600" />
                                  {language === 'KO' ? '핵심 성과 요약' : 'Key Executive Summary'}
                              </h3>
                              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                  <p className="text-slate-700 leading-relaxed mb-4 text-sm">
                                      {language === 'KO' 
                                          ? `본 프로젝트를 통해 ${activeCase.name}는 데이터 사일로를 제거하고 공급망 전체의 투명성을 확보했습니다. 기존의 수동적인 데이터 취합 방식에서 벗어나, 국제 표준(IDSA/GAIA-X) 기반의 데이터스페이스를 도입함으로써 실시간 데이터 파이프라인을 구축했습니다.`
                                          : `Through this project, ${activeCase.name} eliminated data silos and secured transparency across the supply chain. By moving away from manual data aggregation and adopting an international standard (IDSA/GAIA-X) based DataSpace, a real-time data pipeline was established.`}
                                  </p>
                                  <div className="space-y-3">
                                      {activeCase.content.comparison.map((item, idx) => (
                                          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                              <span className="text-xs font-bold text-slate-500 uppercase">{item.metric}</span>
                                              <div className="flex items-center gap-2">
                                                  <span className="text-sm text-red-400 line-through decoration-red-400/50">{item.before}</span>
                                                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                                                  <span className="text-lg font-bold text-emerald-600">{item.after}</span>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>
                  
                  {/* Footer */}
                  <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                      <button 
                          onClick={() => setShowDetailModal(false)}
                          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                      >
                          {language === 'KO' ? '닫기' : 'Close Report'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-4 mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t('uc_title')}</h1>
        <p className="text-lg text-slate-500">{t('uc_subtitle')}</p>
      </div>

      {/* Industry Filter */}
      <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        selectedCategory === cat 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      {/* Company Navigation Tabs - Scrollable for more items */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {filteredCases.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveTab(c.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all duration-300 min-w-[200px] ${
              activeTab === c.id
                ? `border-blue-500 bg-white shadow-xl scale-105 z-10`
                : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-white hover:border-slate-200'
            }`}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === c.id ? 'bg-slate-100' : 'bg-transparent'}`}>
                {React.cloneElement(c.icon as React.ReactElement<{ className?: string }>, {
                    className: `w-5 h-5 ${activeTab === c.id ? c.logoColor : 'text-slate-400'}`
                })}
            </div>
            <div className="text-left overflow-hidden">
                <span className={`block font-bold text-base truncate ${activeTab === c.id ? 'text-slate-900' : 'text-slate-500'}`}>
                    {c.name}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider truncate block">{c.industry}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        
        {/* Hero Banner for Active Case */}
        <div className="relative h-80 w-full overflow-hidden">
             <img 
                src={activeCase.heroImage} 
                alt={activeCase.name} 
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
             <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Success Story</span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" /> DataSpace Connected
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{activeCase.content.title}</h2>
                <p className="text-lg text-slate-200 font-light max-w-3xl">{activeCase.content.subtitle}</p>
             </div>
        </div>

        {/* Detailed Content Grid */}
        <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
                
                {/* Left Column: Challenge & Solution */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 flex-shrink-0 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{language === 'KO' ? '도전 과제 (The Challenge)' : 'The Challenge'}</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {activeCase.content.challenge}
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100"></div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 flex-shrink-0 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <LinkIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{language === 'KO' ? 'Korea 솔루션 (The Solution)' : 'The Solution'}</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {activeCase.content.solution}
                            </p>
                        </div>
                    </div>

                    {/* Pain Points Resolved (Before vs After Visualization) */}
                    <div className="mt-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <RefreshCw className="w-32 h-32 text-slate-900" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                            {language === 'KO' ? 'Pain Points 해결 성과 (Before vs After)' : 'Pain Points Resolved (Before vs After)'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {activeCase.content.comparison.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setSelectedPainPoint(item)}
                                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all group cursor-pointer hover:border-blue-300 transform hover:-translate-y-1"
                                >
                                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                {item.icon}
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide group-hover:text-blue-600">{item.metric}</span>
                                        </div>
                                        <div className="text-xs text-slate-400 hover:text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full flex items-center gap-1 group-hover:bg-blue-50 group-hover:text-blue-600">
                                            <Search className="w-3 h-3" />
                                            {language === 'KO' ? '자세히' : 'View'}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="text-center w-[40%]">
                                            <span className="block text-[10px] font-bold text-red-400 uppercase mb-1">{language === 'KO' ? '적용 전' : 'Before'}</span>
                                            <div className="text-sm font-bold text-slate-600 bg-red-50 py-1 px-2 rounded border border-red-100 line-through decoration-red-300">
                                                {item.before}
                                            </div>
                                        </div>
                                        
                                        <div className="text-slate-300 group-hover:text-blue-400 group-hover:scale-125 transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>

                                        <div className="text-center w-[40%]">
                                            <span className="block text-[10px] font-bold text-emerald-500 uppercase mb-1">{language === 'KO' ? '적용 후' : 'After'}</span>
                                            <div className="text-sm font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded border border-emerald-100 shadow-sm">
                                                {item.after}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Benefits & Metrics with Infographic */}
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 h-fit shadow-inner">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        {language === 'KO' ? '주요 성과 (Key Benefits)' : 'Key Benefits'}
                    </h3>
                    
                    {/* Visual Architecture Diagram */}
                    {activeCase.infographic}

                    <p className="text-slate-700 font-medium mb-8 leading-relaxed">
                        {activeCase.content.benefit}
                    </p>

                    <div className="space-y-4">
                        {activeCase.content.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-600 font-medium">{detail}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <button 
                            onClick={() => setShowDetailModal(true)}
                            className="text-blue-600 font-bold text-sm flex items-center justify-center gap-2 hover:gap-3 transition-all p-2 rounded hover:bg-blue-50 w-full"
                        >
                            {language === 'KO' ? '자세한 사례 연구 보기' : 'View Detailed Case Study'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Implementation & Tech Stack Section - CLICKABLE */}
            <div className="border-t border-slate-100 pt-10">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-slate-700" />
                    {language === 'KO' ? '도입 및 기술 전략 (Implementation & Tech Stack)' : 'Implementation & Tech Stack'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeCase.content.adoption.map((item, i) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedTechItem(item)}
                            className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors group cursor-pointer relative"
                        >
                            <div className="absolute top-4 right-4 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-blue-100">
                                <Search className="w-3 h-3 text-blue-500" />
                            </div>
                            <div className="mb-4 bg-white w-12 h-12 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                            
                            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1 text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                {language === 'KO' ? '기술 상세 보기' : 'View Tech Details'} <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
      
      {/* Animated Adoption Roadmap */}
      <div className="bg-slate-900 rounded-2xl p-10 relative overflow-hidden mt-12 text-white">
          <div className="relative z-10">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">{t('uc_roadmap_title')}</h2>
                  <p className="text-slate-400">{language === 'KO' ? '성공적인 데이터스페이스 도입을 위한 4단계 여정' : '4-Step Journey to Successful DataSpace Adoption'}</p>
              </div>

              <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Connection Line (Desktop) */}
                  <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-800 rounded-full">
                      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-30 animate-pulse"></div>
                  </div>

                  {steps.map((step, idx) => (
                      <div key={step.id} className="relative group">
                          {/* Step Icon */}
                          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 border-slate-800 bg-slate-900 relative z-10 transition-transform duration-300 group-hover:-translate-y-2 shadow-xl shadow-${step.color}/20`}>
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${step.color} text-white shadow-lg`}>
                                  {step.id === 4 ? <Rocket className="w-8 h-8 animate-bounce" /> : step.icon}
                              </div>
                              {/* Step Number Badge */}
                              <div className="absolute -top-1 -right-1 w-8 h-8 bg-white text-slate-900 rounded-full flex items-center justify-center font-bold border-2 border-slate-900">
                                  {step.id}
                              </div>
                          </div>

                          {/* Content */}
                          <div className="text-center mt-6">
                              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{t(step.titleKey)}</h3>
                              <p className="text-sm text-slate-400 leading-relaxed px-4">{t(step.descKey)}</p>
                          </div>
                          
                          {/* Arrow for mobile */}
                          {idx < 3 && (
                              <div className="md:hidden flex justify-center my-4">
                                  <ChevronRight className="w-6 h-6 text-slate-600" />
                              </div>
                          )}
                      </div>
                  ))}
              </div>

              <div className="text-center mt-12">
                  <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/50 flex items-center gap-3 mx-auto transform hover:scale-105">
                      {language === 'KO' ? '도입 가이드 다운로드' : 'Download Adoption Guide'}
                      <ArrowRight className="w-5 h-5" />
                  </button>
              </div>
          </div>
          
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-3xl"></div>
          </div>
      </div>

    </div>
  );
};

export default UseCases;
