import React, { useState } from 'react';
import { Book, PlayCircle, CheckCircle, ChevronRight, Upload, ShoppingCart, Database, X, Image as ImageIcon, Network, Video, Eye, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { GoogleGenAI } from "@google/genai";

type TutorialStep = {
  title: string;
  description: string;
  demoImage: string; 
};

type TutorialScenario = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  steps: TutorialStep[];
};

const Tutorial: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  
  // Updated state to support both image and video
  const [activeDemo, setActiveDemo] = useState<{title: string, url: string, type: 'image' | 'video'} | null>(null);
  
  // State for video generation
  const [videoCache, setVideoCache] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<string | null>(null); // Stores ID of step being generated

  const scenarios: TutorialScenario[] = [
    {
      id: 'tractusx_architecture',
      title: language === 'KO' ? '데이터 교환 아키텍처' : 'Data Exchange Architecture',
      desc: language === 'KO' 
        ? '데이터 주권 및 교환 프로세스의 아키텍처 흐름을 학습합니다.' 
        : 'Learn the architectural flow of data sovereignty and exchange processes.',
      icon: <Network className="w-6 h-6 text-indigo-600" />,
      steps: [
        { 
            title: '1. Trust & Identity (MIW/DAPS)', 
            description: language === 'KO' 
                ? '신뢰 구축 단계입니다. 모든 참여자(Connector)는 BPN(Business Partner Number)과 검증된 자격 증명(VC)을 사용하여 중앙 신원 공급자(MIW/DAPS)로부터 인증 토큰을 발급받아야 네트워크에 참여할 수 있습니다.' 
                : 'Trust Establishment phase. All participants (Connectors) must authenticate with the central Identity Provider (MIW/DAPS) using BPN and Verifiable Credentials (VC) to join the network.',
            // Abstract Network/Identity Visualization
            demoImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: '2. Asset & Contract Definition', 
            description: language === 'KO' 
                ? '제공자(Provider)는 데이터 소스를 자산(Asset)으로 등록하고, "특정 기간 사용" 또는 "목적 제한"과 같은 ODRL 기반의 사용 정책(Policy)을 정의하여 계약 정의(Contract Definition)를 생성합니다.' 
                : 'The Provider registers data sources as Assets and defines ODRL-based usage policies (e.g., time-bound, purpose-limited) to create a Contract Definition.',
            // New Image: Smart Contract / Digital Document
            demoImage: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: '3. Dataspace Protocol Negotiation', 
            description: language === 'KO' 
                ? '소비자(Consumer)가 카탈로그에서 자산을 발견하고 협상을 요청합니다. Control Plane 간에 Dataspace Protocol(DSP)을 통해 정책 준수 여부를 확인하고, 최종적으로 계약 합의(Agreement)에 서명합니다.' 
                : 'The Consumer discovers the asset and requests negotiation. Control Planes verify policy compliance via the Dataspace Protocol (DSP) and sign the Contract Agreement.',
            // Digital Handshake / Network Interaction
            demoImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: '4. Data Plane Transfer (EDR)', 
            description: language === 'KO' 
                ? '계약이 체결되면 소비자는 EDR(Endpoint Data Reference) 토큰을 받습니다. 이 토큰을 사용하여 Provider Data Plane에 직접 요청하며, 데이터는 암호화된 채널을 통해 P2P로 전송됩니다.' 
                : 'Upon agreement, the Consumer receives an EDR token. Using this token, they request data directly from the Provider Data Plane, transferred P2P via an encrypted channel.',
            // Digital data stream. The photo originally used here was deleted
            // from Unsplash and returned 404, so this reuses the shot the
            // marketplace walkthrough already uses for its transfer step.
            demoImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200' 
        },
      ]
    },
    {
      id: 'provider_registration',
      title: language === 'KO' ? '데이터 자산 등록하기 (제공자)' : 'Registering Data Assets (Provider)',
      desc: language === 'KO' 
        ? '보유하고 있는 데이터셋이나 AI 모델을 마켓플레이스에 등록하고 사용 정책을 설정하는 방법입니다.' 
        : 'Learn how to register your datasets or AI models to the marketplace and configure usage policies.',
      icon: <Upload className="w-6 h-6 text-blue-600" />,
      steps: [
        { 
            title: 'Connector Setup', 
            description: language === 'KO' ? 'EDC 커넥터를 로컬 서버에 설치하고 데이터 소스(DB/File)와 연결 설정을 마칩니다.' : 'Install the EDC connector on your local server and configure the connection to your data source (DB/File).',
            // Server Room / Infrastructure
            demoImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: 'Asset Definition', 
            description: language === 'KO' ? '마켓플레이스 > 자산 등록 메뉴에서 자산의 메타데이터(이름, 설명, 산업군, 태그)를 입력합니다.' : 'Enter asset metadata (name, description, industry, tags) in the Marketplace > Create Asset menu.',
            // Dashboard / Analytics UI
            demoImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: 'Policy Configuration', 
            description: language === 'KO' ? 'ODRL 기반의 사용 정책을 정의합니다. (예: 기간 제한, 특정 기업만 접근 허용)' : 'Define ODRL-based usage policies (e.g., time restrictions, allowlist for specific companies).',
            // Security / Access Control Concept
            demoImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: 'Contract Definition', 
            description: language === 'KO' ? '자산과 정책을 묶어 계약 정의(Contract Definition)를 생성하여 카탈로그에 발행합니다.' : 'Bundle the asset and policy to create a Contract Definition and publish it to the catalog.',
            // Document / Signing Concept
            demoImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200'
        },
      ]
    },
    {
      id: 'consumer_purchase',
      title: language === 'KO' ? '데이터 구매 및 사용 (사용자)' : 'Buying & Using Data (Consumer)',
      desc: language === 'KO'
        ? '마켓플레이스에서 필요한 데이터를 검색하고 계약을 체결하여 데이터를 전송받는 방법입니다.'
        : 'How to search for required data in the marketplace, sign a contract, and receive the data stream.',
      icon: <ShoppingCart className="w-6 h-6 text-emerald-600" />,
      steps: [
        { 
            title: 'Search & Discover', 
            description: language === 'KO' ? '마켓플레이스에서 필터와 검색 기능을 사용하여 원하는 자산을 찾습니다.' : 'Use filters and search in the Marketplace to find the desired asset.',
            // New Image: Searching / Laptop Interface
            demoImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: 'Contract Negotiation', 
            description: language === 'KO' ? '자산 상세 페이지에서 "구매하기"를 클릭합니다. 시스템이 자동으로 정책 준수 여부를 확인하고 협상을 진행합니다.' : 'Click "Buy Now" on the asset detail page. The system automatically verifies policy compliance and negotiates.',
            // Business Process / Automation
            demoImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: 'Transaction Sign', 
            description: language === 'KO' ? '협상이 완료되면 블록체인 지갑을 통해 트랜잭션에 서명합니다.' : 'Once negotiation is complete, sign the transaction using your blockchain wallet.',
            // Blockchain / Crypto Concept
            demoImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1200'
        },
        { 
            title: 'Data Transfer', 
            description: language === 'KO' ? '계약이 활성화되면 EDC 커넥터를 통해 Consumer 측의 타겟 스토리지(S3, DB 등)로 데이터 전송이 시작됩니다.' : 'Once the contract is active, data transfer to the Consumer\'s target storage (S3, DB, etc.) begins via the EDC connector.',
            // Server / Data Center
            demoImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200' 
        },
      ]
    },
    {
      id: 'connector_setup',
      title: language === 'KO' ? 'EDC 커넥터 연동 가이드' : 'EDC Connector Integration Guide',
      desc: language === 'KO'
        ? '플랫폼과 통신하기 위한 필수 구성 요소인 Eclipse Dataspace Connector의 기본 설정법입니다.'
        : 'Basic configuration for the Eclipse Dataspace Connector, a prerequisite for communicating with the platform.',
      icon: <Database className="w-6 h-6 text-purple-600" />,
      steps: [
        { 
            title: 'Prerequisites', 
            description: language === 'KO' ? 'Java 17+, Docker, 그리고 공인 IP 또는 도메인이 필요합니다.' : 'Java 17+, Docker, and a public IP or domain are required.',
            // New Image: Containers / Infrastructure
            demoImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: 'Identity Config', 
            description: language === 'KO' ? 'DAPS(Dynamic Attribute Provisioning Service) 서버에 클라이언트 인증서를 등록하여 토큰을 발급받습니다.' : 'Register your client certificate with the DAPS server to obtain a token.',
            // Security Key
            demoImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: 'Config Modification', 
            description: language === 'KO' ? 'config.properties 파일에서 data-plane-selector 및 control-plane 엔드포인트를 수정합니다.' : 'Modify the data-plane-selector and control-plane endpoints in the config.properties file.',
            // Code Editor
            demoImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200' 
        },
        { 
            title: 'Health Check', 
            description: language === 'KO' ? '서버 구동 후 /api/check 엔드포인트를 호출하여 상태가 Healthy인지 확인합니다.' : 'After starting the server, call the /api/check endpoint to verify status is Healthy.',
            // New Image: System Status / Dashboard
            demoImage: 'https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?auto=format&fit=crop&q=80&w=1200'
        },
      ]
    }
  ];

  const selectedScenario = scenarios.find(s => s.id === activeScenario);

  const handleVideoGeneration = async (scenarioId: string, stepIndex: number, title: string, description: string) => {
    const cacheKey = `${scenarioId}-${stepIndex}`;
    
    // If already cached, just show it
    if (videoCache[cacheKey]) {
        setActiveDemo({ title, url: videoCache[cacheKey], type: 'video' });
        return;
    }

    // Check API Key
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
        await (window as any).aistudio?.openSelectKey();
    }

    setIsGenerating(cacheKey);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Industrial tech visualization of: ${title}. ${description}. Futuristic data interface, 3d animation, high quality, cinematic lighting.`;
        
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // Polling
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5s poll
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            const authenticatedUri = `${videoUri}&key=${process.env.API_KEY}`;
            setVideoCache(prev => ({ ...prev, [cacheKey]: authenticatedUri }));
            setActiveDemo({ title, url: authenticatedUri, type: 'video' });
        }
    } catch (error: any) {
        console.error("Video generation failed", error);
        
        // Handle "Requested entity was not found" specifically for Veo
        if (JSON.stringify(error).includes("Requested entity was not found") || error.message?.includes("Requested entity was not found")) {
             if ((window as any).aistudio?.openSelectKey) {
                 await (window as any).aistudio.openSelectKey();
             }
        }
        
        alert("Failed to generate video. Please try again.");
    } finally {
        setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 relative">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t('tut_title')}</h1>
        <p className="text-slate-500 mt-2">
          {t('tut_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Scenarios List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
             {language === 'KO' ? '학습 시나리오' : 'Scenarios'}
          </h2>
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenario(scenario.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                activeScenario === scenario.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4 relative z-10">
                <div className={`p-2 rounded-lg ${activeScenario === scenario.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
                  {React.cloneElement(scenario.icon as React.ReactElement<{ className?: string }>, {
                     className: `w-5 h-5 ${activeScenario === scenario.id ? 'text-white' : ''}` 
                  })}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{scenario.title}</h3>
                  <p className={`text-xs line-clamp-2 ${activeScenario === scenario.id ? 'text-blue-100' : 'text-slate-500'}`}>
                    {scenario.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content: Steps */}
        <div className="lg:col-span-2">
          {selectedScenario ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[500px]">
               <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    {selectedScenario.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedScenario.title}</h2>
                    <p className="text-slate-500 text-sm mt-1">{selectedScenario.desc}</p>
                  </div>
               </div>

               <div className="space-y-0 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-4 bottom-10 w-0.5 bg-slate-200"></div>

                  {selectedScenario.steps.map((step, index) => (
                    <div key={index} className="relative pl-16 pb-10 last:pb-0 group">
                       {/* Number Bubble */}
                       <div className="absolute left-0 top-0 w-12 h-12 bg-white border-2 border-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg shadow-sm z-10 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          {index + 1}
                       </div>
                       
                       <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 group-hover:border-blue-200 group-hover:shadow-md transition-all">
                          <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            {step.description}
                          </p>
                          <div className="flex gap-2 mt-4">
                              {/* Reference Image Button */}
                              <button 
                                onClick={() => setActiveDemo({ title: step.title, url: step.demoImage, type: 'image' })}
                                className="flex items-center gap-2 text-xs font-semibold text-blue-600 cursor-pointer bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                              >
                                 <Eye className="w-4 h-4" />
                                 {language === 'KO' ? '참고 자료' : 'View Reference'}
                              </button>

                              {/* AI Video Generation Button */}
                              <button
                                onClick={() => handleVideoGeneration(selectedScenario.id, index, step.title, step.description)}
                                disabled={isGenerating !== null}
                                className={`flex items-center gap-2 text-xs font-semibold cursor-pointer px-3 py-2 rounded-lg border transition-colors ${
                                    isGenerating === `${selectedScenario.id}-${index}` 
                                    ? 'bg-purple-100 text-purple-700 border-purple-200 cursor-wait' 
                                    : videoCache[`${selectedScenario.id}-${index}`] 
                                        ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700' 
                                        : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'
                                }`}
                              >
                                {isGenerating === `${selectedScenario.id}-${index}` ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating AI Video...
                                    </>
                                ) : videoCache[`${selectedScenario.id}-${index}`] ? (
                                    <>
                                        <PlayCircle className="w-4 h-4" />
                                        Play AI Video
                                    </>
                                ) : (
                                    <>
                                        <Video className="w-4 h-4" />
                                        Generate AI Video Demo
                                    </>
                                )}
                              </button>
                          </div>
                       </div>
                    </div>
                  ))}
                  
                  {/* Finish State */}
                  <div className="relative pl-16 pt-2">
                     <div className="absolute left-2 top-2 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center z-10">
                        <CheckCircle className="w-5 h-5" />
                     </div>
                     <p className="text-sm font-medium text-emerald-700 pt-3">
                        {language === 'KO' ? '모든 단계를 완료했습니다!' : 'All steps completed!'}
                     </p>
                  </div>
               </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
               <Book className="w-16 h-16 mb-4 text-slate-300" />
               <h3 className="text-lg font-semibold text-slate-600 mb-2">
                 {language === 'KO' ? '시나리오를 선택하세요' : 'Select a Scenario'}
               </h3>
               <p className="max-w-xs">
                 {language === 'KO' ? '왼쪽 목록에서 학습하고 싶은 튜토리얼을 선택하여 시작하세요.' : 'Choose a tutorial from the list on the left to get started.'}
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Demo Modal (Media Viewer) */}
      {activeDemo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${activeDemo.type === 'video' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                            {activeDemo.type === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                        </div>
                        <h3 className="font-bold text-slate-900">
                            {language === 'KO' ? '데모 시청' : 'Demo Viewer'}: {activeDemo.title}
                        </h3>
                    </div>
                    <button 
                        onClick={() => setActiveDemo(null)}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 bg-slate-900 p-0 overflow-hidden flex items-center justify-center relative min-h-[400px]">
                   {activeDemo.type === 'video' ? (
                       <video 
                           src={activeDemo.url}
                           controls
                           autoPlay
                           className="w-full h-full object-contain max-h-[70vh]"
                       />
                   ) : (
                       <img 
                         src={activeDemo.url}
                         alt={activeDemo.title}
                         className="w-full h-full object-contain max-h-[70vh]"
                       />
                   )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-white text-right">
                    <button 
                        onClick={() => setActiveDemo(null)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                        {language === 'KO' ? '닫기' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Tutorial;