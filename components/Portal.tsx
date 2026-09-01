import React, { useState } from 'react';
import { Search, Monitor, Settings, Database, Cpu, LayoutGrid, ArrowRight, Building2, Wrench, Cog } from 'lucide-react';
import { MOCK_ASSETS, MOCK_COMPANIES } from '../constants';
import AssetCard from './AssetCard';
import { AssetType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Portal: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Categories for the "Chips"
  const categories = [
    { id: 'EQUIPMENT', label: language === 'KO' ? '설비 (Equipment)' : 'Equipment', icon: <Wrench className="w-4 h-4" /> },
    { id: 'PART', label: language === 'KO' ? '부품 (Parts)' : 'Parts', icon: <Cog className="w-4 h-4" /> },
    { id: 'DATASET', label: language === 'KO' ? '데이터 (Data)' : 'Data', icon: <Database className="w-4 h-4" /> },
    { id: 'AI_MODEL', label: language === 'KO' ? 'AI 서비스' : 'AI Service', icon: <Cpu className="w-4 h-4" /> },
    { id: 'APP', label: language === 'KO' ? 'App' : 'App', icon: <LayoutGrid className="w-4 h-4" /> },
  ];

  // Specific Apps Shortcuts - Icons Styled like the Framework cards
  const quickApps = [
    { 
        label: 'Recipe.AI', 
        initials: 'Re' 
    },
    { 
        label: 'Quality.AI', 
        initials: 'Qu' 
    },
    { 
        label: 'Inspection.AI', 
        initials: 'In' 
    },
    { 
        label: 'Korea.DT', 
        initials: 'DT' 
    },
    { 
        label: 'Korea.FW', 
        initials: 'FW' 
    },
  ];

  // Filter Logic
  const filteredAssets = activeCategory === 'All' 
    ? MOCK_ASSETS 
    : MOCK_ASSETS.filter(a => a.type === activeCategory);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Hero Banner Section (Light Blue Gradient) */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 overflow-hidden border border-blue-100 shadow-sm text-center">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-60"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
             <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                {t('pt_welcome')}
             </h1>
             
             {/* Search Bar */}
             <div className="relative max-w-xl mx-auto mb-10 group">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-full shadow-lg flex items-center p-2 border border-slate-200">
                    <Search className="ml-4 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder={t('pt_search_ph')} 
                        className="flex-1 px-4 py-2 outline-none text-slate-700 placeholder-slate-400 bg-transparent"
                    />
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-slate-800 transition-colors">
                        Search
                    </button>
                </div>
             </div>

             {/* Quick App Icons - Styled as Dark Boxes with Initials */}
             <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                 {quickApps.map((app, idx) => (
                     <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1">
                         <div className="w-14 h-14 bg-slate-900 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden group-hover:bg-slate-800 transition-colors border border-slate-700">
                             <span className="text-white font-bold text-xl relative z-10">{app.initials}</span>
                             <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500"></div>
                         </div>
                         <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">{app.label}</span>
                     </div>
                 ))}
             </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-4">
         <h2 className="text-lg font-bold text-slate-900 px-1">{t('pt_categories')}</h2>
         <div className="flex flex-wrap gap-3">
             <button 
                onClick={() => setActiveCategory('All')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${activeCategory === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
             >
                 {language === 'KO' ? '전체' : 'All'}
             </button>
             {categories.map((cat) => (
                 <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${activeCategory === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}
                 >
                     {cat.icon}
                     {cat.label}
                 </button>
             ))}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-12">
         
         {/* Participating Companies (B2B Feature) - Now with Initial Icons */}
         {activeCategory === 'All' && (
             <div>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-slate-500" />
                        {t('pt_participants')}
                    </h2>
                    <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                        {t('ov_view_all')} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {MOCK_COMPANIES.map((company) => (
                        <div key={company.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer text-center group">
                             <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:ring-4 group-hover:ring-blue-50 transition-all border border-slate-200 shadow-sm">
                                 <span className="text-3xl font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                                     {company.logo}
                                 </span>
                             </div>
                             <h3 className="font-bold text-slate-900 mb-1">{company.name}</h3>
                             <p className="text-xs text-slate-500 line-clamp-1">{company.description}</p>
                             <div className="mt-3 pt-3 border-t border-slate-100">
                                 <span className="text-xs font-medium text-slate-400">{company.productsCount} items</span>
                             </div>
                        </div>
                    ))}
                </div>
             </div>
         )}

         {/* Products/Services Grid */}
         <div>
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold text-slate-900">
                    {activeCategory === 'All' ? t('pt_featured_products') : t('pt_results')}
                </h2>
            </div>
            
            {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAssets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No items found in this category.</p>
                </div>
            )}
         </div>

      </div>
    </div>
  );
};

export default Portal;