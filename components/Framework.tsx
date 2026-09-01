import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ASSETS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

// Helper to get the specific icon box initials based on the asset
const getIconInitials = (title: string) => {
    if (title.includes('Recipe')) return 'Re';
    if (title.includes('Quality')) return 'Qu';
    if (title.includes('Inspection')) return 'In';
    if (title.includes('DT')) return 'DT';
    if (title.includes('NetZero')) return 'NZ';
    if (title.includes('Preprocessing')) return 'Pr';
    if (title.includes('SCM')) return 'SC';
    return 'Ai';
};

// Helper for the service subtitle based on screenshot context
const getSubtitle = (title: string, language: string) => {
    const isKO = language === 'KO';
    if (title.includes('Recipe')) return isKO ? '생산조건최적화서비스' : 'Production Condition Optimization';
    if (title.includes('Quality')) return isKO ? '품질예측서비스' : 'Quality Prediction Service';
    if (title.includes('Inspection')) return isKO ? '품질검사서비스' : 'Quality Inspection Service';
    if (title.includes('DT')) return isKO ? '가상공장서비스' : 'Virtual Factory Service';
    if (title.includes('NetZero')) return isKO ? '에너지 최적화·탄소 저감' : 'Energy Optimization & Carbon Reduction';
    if (title.includes('Preprocessing')) return isKO ? '전처리자동화' : 'Automated Data Preprocessing';
    if (title.includes('SCM')) return isKO ? '공급망 최적화/수요관리' : 'Supply Chain Optimization / Demand Management';
    return isKO ? '산업용 AI 솔루션' : 'Industrial AI Solution';
};

const Framework: React.FC = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    // Show all assets to include the new 3 items
    const mainAssets = MOCK_ASSETS; 

    return (
        <div className="space-y-12 py-4">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {t('fw_title')}
                </h1>
                <p className="text-slate-500 text-lg font-light">
                    {t('fw_subtitle')}
                </p>
            </div>

            {/* Service Cards Grid (White Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainAssets.map((asset) => (
                    <div 
                        key={asset.id} 
                        onClick={() => navigate(`/asset/${asset.id}`)}
                        className="bg-white rounded-lg p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative group h-64 flex flex-col justify-between"
                    >
                        {/* Top Row: Icon Box & Status */}
                        <div className="flex justify-between items-start">
                            {/* Icon Box */}
                            <div className="w-14 h-14 bg-slate-800 text-white font-bold text-xl flex items-center justify-center rounded shadow-md relative overflow-hidden group-hover:bg-slate-900 transition-colors">
                                <span className="relative z-10">{getIconInitials(asset.title)}</span>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500"></div>
                            </div>
                            
                            {/* Status Badges */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                    {asset.title.includes('DT') ? 'DT' : 'AI'}
                                </div>
                                <div className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    {language === 'KO' ? '활성화' : 'Active'}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: Text */}
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">
                                {asset.title.split(' ')[0]}
                            </h3>
                            <p className="text-sm text-slate-400 font-medium">
                                {getSubtitle(asset.title, language)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Framework Section (Dark Card) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                    className="relative rounded-2xl overflow-hidden h-80 cursor-pointer group shadow-xl"
                    onClick={() => navigate('/marketplace')}
                >
                    {/* Background Image/Gradient */}
                    <div className="absolute inset-0 bg-slate-950">
                         {/* Abstract Particles Background simulation */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,200,150,0.3),rgba(0,0,0,0))]"></div>
                        <div className="absolute top-0 right-0 w-full h-full opacity-40 mix-blend-screen" 
                             style={{backgroundImage: 'url("vendor-images/photo-1451187580459-43490279c0fa-w800.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        </div>
                    </div>
                    
                    <div className="relative z-10 p-8 flex flex-col h-full">
                        {/* Green Dash */}
                        <div className="w-8 h-1 bg-emerald-500 mb-6"></div>
                        
                        <h2 className="text-3xl font-bold text-white mb-2">{t('fw_card_framework')}</h2>
                        <p className="text-slate-300 text-sm font-light">{t('fw_card_desc')}</p>

                        <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                             <span className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
                                 <span dangerouslySetInnerHTML={{ __html: t('fw_view_details') }} />
                             </span>
                        </div>
                    </div>
                </div>
                
                {/* Additional Placeholder Cards to balance grid if needed, or leave empty as per screenshot */}
                <div className="hidden md:block col-span-2">
                    {/* Empty space or additional marketing content could go here */}
                </div>
            </div>
        </div>
    )
}

export default Framework;