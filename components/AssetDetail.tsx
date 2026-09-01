
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_ASSETS, CURRENT_USER } from '../constants';
import { ShieldCheck, Server, FileText, CheckCircle2, ArrowRight, Lock, History } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getIndustryLabel, getAssetTypeLabel, assetTitle, assetDescription } from '../labels';
import { useAssets } from '../contexts/AssetContext';
import PaymentModal from './PaymentModal';

const AssetDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isOwned } = useAssets();
  const asset = MOCK_ASSETS.find(a => a.id === id);
  
  const [showPayment, setShowPayment] = useState(false);
  
  // If already owned, show "Access" state
  const owned = asset ? isOwned(asset.id) : false;

  const techSpecs = language === 'KO'
    ? ['형식: JSON/Parquet', '프로토콜: IDS/EDC', '갱신 주기: 실시간', '라이선스: 상업적 이용']
    : ['Format: JSON/Parquet', 'Protocol: IDS/EDC', 'Update Frequency: Real-time', 'License: Commercial Use'];

  if (!asset) {
    return <div className="p-8">{language === 'KO' ? '자산을 찾을 수 없습니다' : 'Asset not found'}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        {/* Goes where the label says. navigate(-1) followed browser history, which
            left the app entirely when the page was opened directly. */}
        <button onClick={() => navigate('/marketplace')} className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1">
            &larr; {t('ad_back')}
        </button>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal 
            asset={asset} 
            onClose={() => setShowPayment(false)} 
        />
      )}

      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-64 bg-slate-100 relative">
            <img src={asset.imageUrl} alt={assetTitle(asset, language)} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur rounded text-xs font-semibold">{getIndustryLabel(asset.industry, language)}</span>
                    <span className="px-2 py-1 bg-blue-600/80 backdrop-blur rounded text-xs font-semibold flex items-center gap-1">
                        {getAssetTypeLabel(asset.type, language)}
                    </span>
                    {asset.certified && (
                        <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur rounded text-xs font-bold flex items-center gap-1 text-white shadow-sm border border-amber-400/30">
                            <ShieldCheck className="w-3.5 h-3.5 fill-amber-600 stroke-white" />
                            {language === 'KO' ? '인증됨' : 'Certified'}
                        </span>
                    )}
                </div>
                <h1 className="text-3xl font-bold">{assetTitle(asset, language)}</h1>
            </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">{t('ad_desc')}</h3>
                    <p className="text-slate-600 leading-relaxed">{assetDescription(asset, language)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Server className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">{t('ad_data_vol')}</span>
                        </div>
                        <p className="font-semibold text-slate-900">{asset.dataPoints !== undefined ? `${asset.dataPoints.toLocaleString()} ${t('ad_entries')}` : (language === 'KO' ? '정보 없음' : 'N/A')}</p>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">{t('ad_trust')}</span>
                        </div>
                        <p className="font-semibold text-slate-900 flex items-center gap-1">
                            {asset.certified ? t('ad_certified') : t('ad_standard')}
                            {asset.certified && <ShieldCheck className="w-4 h-4 text-amber-500 fill-amber-100" />}
                        </p>
                     </div>
                </div>

                <div>
                     <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">{t('ad_tech_spec')}</h3>
                     <div className="space-y-2">
                        {techSpecs.map((spec, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                {spec}
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            {/* Sidebar / Checkout */}
            <div className="w-full md:w-80 space-y-4">
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-10 -mt-10 z-0"></div>
                    <div className="relative z-10">
                        <p className="text-sm text-slate-500 mb-1">{t('ad_sub_price')}</p>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-bold text-slate-900">{asset.price.toLocaleString()}</span>
                            <span className="text-sm font-medium text-slate-500">{asset.currency}</span>
                        </div>

                        {!owned ? (
                            <button 
                                onClick={() => setShowPayment(true)}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
                            >
                                <span>{t('ad_buy')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
                                <div className="mx-auto w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h4 className="font-bold text-emerald-800 text-sm">{language === 'KO' ? '구독 중' : 'Active Subscription'}</h4>
                                <button 
                                    onClick={() => navigate('/dashboard')}
                                    className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    {t('ad_access')} <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                {t('ad_secured')}
                            </div>
                            <div className="flex items-center gap-2">
                                <History className="w-3 h-3" />
                                {t('ad_instant')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-sm text-slate-900 mb-2">{t('ad_provider_info')}</h4>
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-lg font-bold text-slate-400">
                            {asset.provider.charAt(0)}
                         </div>
                         <div>
                             <p className="text-sm font-medium text-slate-900">{asset.provider}</p>
                             <p className="text-xs text-slate-500">{t('ad_member_since')} 2023</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
