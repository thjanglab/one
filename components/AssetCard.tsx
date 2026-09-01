import React from 'react';
import { Asset, AICategory } from '../types';
import { ShieldCheck, Database, Box, Cpu, FileCode, Zap, Search, Activity, Layers, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getIndustryLabel, getAssetTypeLabel, assetTitle, assetDescription } from '../labels';

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const { t, language } = useLanguage();

  const getIcon = () => {
    switch (asset.type) {
      case 'DATASET': return <Database className="w-4 h-4" />;
      case 'AI_MODEL': return <Cpu className="w-4 h-4" />;
      case 'APP': return <FileCode className="w-4 h-4" />;
      default: return <Box className="w-4 h-4" />;
    }
  };

  const getAiCategoryLabel = (cat: AICategory) => {
    switch (cat) {
      case AICategory.SUPPLY_CHAIN: return { label: language === 'KO' ? '공급망·수요예측' : 'SCM & Demand', color: 'bg-purple-100 text-purple-700 border-purple-200' };
      case AICategory.DIGITAL_TWIN: return { label: language === 'KO' ? '디지털 트윈' : 'Digital Twin', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
      case AICategory.PREDICTIVE_MAINT: return { label: language === 'KO' ? '설비 예지보전' : 'Auto & Maint.', color: 'bg-orange-100 text-orange-700 border-orange-200' };
      case AICategory.QUALITY_INSPECTION: return { label: language === 'KO' ? '품질검사' : 'Quality & QA', color: 'bg-rose-100 text-rose-700 border-rose-200' };
      case AICategory.ENERGY_OPTIMIZATION: return { label: language === 'KO' ? '에너지·ESG' : 'Energy & ESG', color: 'bg-teal-100 text-teal-700 border-teal-200' };
      default: return { label: '', color: '' };
    }
  };

  const aiBadge = asset.aiCategory ? getAiCategoryLabel(asset.aiCategory) : null;

  return (
    <Link to={`/asset/${asset.id}`} className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={asset.imageUrl} 
          alt={assetTitle(asset, language)} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
            <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-slate-700 rounded-md shadow-sm uppercase">
                {getIndustryLabel(asset.industry, language)}
            </span>
            {aiBadge && (
              <span className={`px-2 py-1 backdrop-blur text-xs font-bold rounded-md shadow-sm border ${aiBadge.color}`}>
                {aiBadge.label}
              </span>
            )}
        </div>
        {asset.certified && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/95 backdrop-blur text-xs font-bold text-white rounded-full shadow-md border border-amber-400/50">
            <ShieldCheck className="w-3.5 h-3.5 fill-amber-600 stroke-white" />
            <span>{language === 'KO' ? '인증 완료' : 'Certified'}</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-slate-600 border border-slate-100">
            {getIcon()} {getAssetTypeLabel(asset.type, language)}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-blue-700 transition-colors">
          {assetTitle(asset, language)}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {assetDescription(asset, language)}
        </p>
        
        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
                <p className="text-xs text-slate-400">{t('c_provider')}</p>
                <p className="text-sm font-medium text-slate-700">{asset.provider}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-400">{t('c_price')}</p>
                <p className="text-lg font-bold text-blue-700">
                    {asset.price.toLocaleString()} <span className="text-xs font-normal text-slate-500">{asset.currency}</span>
                </p>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default AssetCard;