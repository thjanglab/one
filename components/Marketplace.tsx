import React, { useState } from 'react';
import { MOCK_ASSETS } from '../constants';
import AssetCard from './AssetCard';
import { Search, Filter, SlidersHorizontal, BarChart, Layers, Zap, Activity, ScanEye } from 'lucide-react';
import { AssetType, Industry, AICategory } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { getIndustryLabel, getAssetTypeLabel, assetTitle, assetDescription } from '../labels';

const getCoreAiFilters = (language: string) => [
  { id: AICategory.SUPPLY_CHAIN, label: language === 'KO' ? '공급망 (SCM)' : 'Supply Chain (SCM)', icon: <BarChart className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: AICategory.DIGITAL_TWIN, label: language === 'KO' ? '디지털 트윈' : 'Digital Twin', icon: <Layers className="w-4 h-4" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: AICategory.PREDICTIVE_MAINT, label: language === 'KO' ? '설비 예지보전' : 'Auto & Maintenance', icon: <Activity className="w-4 h-4" />, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: AICategory.QUALITY_INSPECTION, label: language === 'KO' ? '품질검사 (QA)' : 'Quality (QA)', icon: <ScanEye className="w-4 h-4" />, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: AICategory.ENERGY_OPTIMIZATION, label: language === 'KO' ? '에너지·탄소' : 'Energy & Carbon', icon: <Zap className="w-4 h-4" />, color: 'text-teal-600 bg-teal-50 border-teal-200' },
];


const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedAiCategory, setSelectedAiCategory] = useState<string | null>(null);
  const { t, language } = useLanguage();

  const coreAiFilters = getCoreAiFilters(language);

  const filteredAssets = MOCK_ASSETS.filter(asset => {
    // Match both languages: a Korean user types Korean, but the English copy is
    // still the record's primary text.
    const haystack = [asset.title, asset.titleKo, asset.description, asset.descriptionKo]
      .filter(Boolean).join(' ').toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || asset.industry === selectedIndustry;
    const matchesType = selectedType === 'All' || asset.type === selectedType;
    const matchesAi = selectedAiCategory ? asset.aiCategory === selectedAiCategory : true;
    
    return matchesSearch && matchesIndustry && matchesType && matchesAi;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('mp_title')}</h1>
            <p className="text-slate-500 mt-1">{t('mp_subtitle')}</p>
        </div>
        <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium text-sm flex items-center gap-2 hover:bg-slate-50">
                <SlidersHorizontal className="w-4 h-4" />
                {t('mp_sort')}
             </button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm shadow-blue-200">
                {t('mp_create')}
             </button>
        </div>
      </div>

      {/* Core AI Models Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{t('mp_core_ai')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {coreAiFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedAiCategory(selectedAiCategory === cat.id ? null : cat.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-2 ${
                selectedAiCategory === cat.id 
                  ? `${cat.color} ring-2 ring-offset-1 ring-blue-500` 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded-full bg-white shadow-sm ${selectedAiCategory === cat.id ? 'bg-transparent shadow-none' : ''}`}>
                 {cat.icon}
              </div>
              <span className="text-xs font-semibold text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center mt-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder={t('mp_search_ph')}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto">
            <select 
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer min-w-[140px]"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
            >
                <option value="All">{t('mp_all_ind')}</option>
                {Object.values(Industry).map(ind => (
                    <option key={ind} value={ind}>{getIndustryLabel(ind, language)}</option>
                ))}
            </select>

            <select 
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer min-w-[140px]"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
            >
                <option value="All">{t('mp_all_types')}</option>
                {Object.values(AssetType).map(type => (
                    <option key={type} value={type}>{getAssetTypeLabel(type, language)}</option>
                ))}
            </select>
        </div>
      </div>

      {/* Grid */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredAssets.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
            ))}
        </div>
      ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{t('mp_no_assets')}</h3>
              <p className="text-slate-500">{t('mp_try_adjust')}</p>
          </div>
      )}
    </div>
  );
};

export default Marketplace;