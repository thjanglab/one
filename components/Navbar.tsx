
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, ShoppingBag, BarChart3, Database, Search, Bell, Settings, Cpu, Globe, BookOpen, GraduationCap, Briefcase, Store, Link as LinkIcon, Leaf, Tag, BadgeCheck, Wand2, Zap, Play, Network, KeyRound, Map, Bot, Workflow, Share2, X, Copy, Check, Lock, Monitor, Shield } from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock Short URL
  const shortUrl = "https://korea.io/s/8x2k9a";

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 hidden md:flex flex-col overflow-y-auto">
        <div className="p-8 border-b border-slate-100 flex items-center justify-start">
          <Link to="/overview" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
               <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path 
                      d="M20 15 L45 50 L20 85 H35 L60 50 L85 85 H70 L45 50 L70 15 H85 L60 50 L35 15 H20 Z" 
                      stroke="#FF8A00" 
                      strokeWidth="8" 
                      strokeLinejoin="miter" 
                      fill="none"
                  />
               </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Kore<span className="text-[#FF8A00]">a</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 py-8 px-4 space-y-1">
          <Link to="/overview" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/overview')}`}>
            <LayoutGrid className="w-5 h-5" />
            {t('nav_overview')}
          </Link>
          <Link to="/portal" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/portal')}`}>
            <Store className="w-5 h-5 text-blue-600" />
            {t('nav_portal')}
          </Link>

          {/* Sustainability Section */}
          <div className="pt-2 pb-1 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Sustainability</div>
          <Link to="/pcf" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/pcf')}`}>
            <Leaf className="w-5 h-5 text-emerald-500" />
            {t('nav_pcf')}
          </Link>
          <Link to="/dpp" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/dpp')}`}>
            <Tag className="w-5 h-5 text-blue-500" />
            {t('nav_dpp')}
          </Link>
          
          {/* SCM Innovation Section */}
          <div className="pt-2 pb-1 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Intelligent SCM</div>
          <Link to="/intelligent-scm" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/intelligent-scm')}`}>
            <Bot className="w-5 h-5 text-purple-600" />
            {language === 'KO' ? '지능형 SCM' : 'Intelligent SCM'}
          </Link>
          <Link to="/supply-chain" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/supply-chain')}`}>
            <Map className="w-5 h-5 text-indigo-500" />
            {t('nav_supplychain')}
          </Link>

          {/* Modules Section */}
          <div className="pt-2 pb-1 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Modules</div>
          <Link to="/framework" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/framework')}`}>
            <Cpu className="w-5 h-5" />
            {t('nav_framework')}
          </Link>
          <Link to="/marketplace" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/marketplace')}`}>
            <ShoppingBag className="w-5 h-5" />
            {t('nav_marketplace')}
          </Link>
          <Link to="/preprocessing" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/preprocessing')}`}>
            <Wand2 className="w-5 h-5" />
            {t('nav_preprocessing')}
          </Link>
          <Link to="/energy" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/energy')}`}>
            <Zap className="w-5 h-5" />
            {t('nav_energy')}
          </Link>
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/dashboard')}`}>
            <BarChart3 className="w-5 h-5" />
            {t('nav_myassets')}
          </Link>
          <Link to="/connector" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/connector')}`}>
            <Database className="w-5 h-5" />
            {t('nav_connector')}
          </Link>

          <div className="pt-4 mt-4 border-t border-slate-100">
              <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Support</p>
              {/* Security Link Added Here */}
              <Link to="/security" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/security')}`}>
                <Shield className="w-5 h-5" />
                {t('nav_security')}
              </Link>
              <Link to="/usecases" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/usecases')}`}>
                <Briefcase className="w-5 h-5" />
                {t('nav_usecases')}
              </Link>
              <Link to="/demonstration" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/demonstration')}`}>
                <Play className="w-5 h-5" />
                {t('nav_demonstration')}
              </Link>
              <Link to="/edc-simulation" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/edc-simulation')}`}>
                <Network className="w-5 h-5" />
                {t('nav_edc_sim')}
              </Link>
              <Link to="/identity-sim" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/identity-sim')}`}>
                <KeyRound className="w-5 h-5" />
                {t('nav_id_sim')}
              </Link>
              <Link to="/blockchain" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/blockchain')}`}>
                <LinkIcon className="w-5 h-5" />
                {t('nav_blockchain')}
              </Link>
               <Link to="/clearinghouse" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/clearinghouse')}`}>
                <BadgeCheck className="w-5 h-5" />
                {t('nav_clearinghouse')}
              </Link>
              <Link to="/guideline" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/guideline')}`}>
                <BookOpen className="w-5 h-5" />
                {t('nav_guideline')}
              </Link>
              <Link to="/tutorial" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/tutorial')}`}>
                <GraduationCap className="w-5 h-5" />
                {t('nav_tutorial')}
              </Link>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 space-y-4">
          <button 
              onClick={() => setShowShareModal(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
              <Share2 className="w-4 h-4" />
              <span>Share Project</span>
          </button>

          <button 
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
              <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>{t('nav_lang')}</span>
              </div>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">
                  <span className={language === 'KO' ? 'text-slate-900 font-bold' : 'text-slate-400'}>KO</span>
                  <span className="text-slate-300">|</span>
                  <span className={language === 'EN' ? 'text-blue-600 font-bold' : 'text-slate-400'}>EN</span>
              </div>
          </button>

          <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                {CURRENT_USER.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{CURRENT_USER.name}</p>
                <p className="text-xs text-slate-400 truncate">{CURRENT_USER.company}</p>
              </div>
          </div>
        </div>
      </nav>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp relative">
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Share Project</h3>
                  <p className="text-xs text-slate-500">Create a secure link for external viewing</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Short URL Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex-1 truncate">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Short Link</span>
                    <span className="font-mono text-sm text-blue-600 font-bold block truncate">{shortUrl}</span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`p-2 rounded-lg transition-all ${
                      copied 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Settings */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                    <div className="p-1 bg-emerald-100 text-emerald-600 rounded">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-slate-700 block">View Only</span>
                      <span className="text-[10px] text-slate-400 block">Editing disabled. Code hidden.</span>
                    </div>
                    <Check className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                    <div className="p-1 bg-purple-100 text-purple-600 rounded">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-slate-700 block">Full Screen Mode</span>
                      <span className="text-[10px] text-slate-400 block">Navbars and panels are hidden.</span>
                    </div>
                    <Check className="w-4 h-4 text-blue-500" />
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[10px] text-slate-400">Link expires in 7 days.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button 
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MobileHeader: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const shortUrl = "https://korea.io/s/8x2k9a";

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40">
         <Link to="/overview" className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <path 
                      d="M20 15 L45 50 L20 85 H35 L60 50 L85 85 H70 L45 50 L70 15 H85 L60 50 L35 15 H20 Z" 
                      stroke="#FF8A00" 
                      strokeWidth="8" 
                      strokeLinejoin="miter" 
                      fill="none"
                  />
            </svg>
            <span className="text-lg font-bold text-slate-900">
              Kore<span className="text-[#FF8A00]">a</span>
            </span>
        </Link>
        <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-2 text-blue-600 bg-blue-50 rounded-lg"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={toggleLanguage} className="text-xs font-bold text-slate-600 border border-slate-200 rounded px-2 py-1">
                {language}
            </button>
            <button className="p-2 text-slate-600">
              <Settings className="w-6 h-6" />
            </button>
        </div>
      </header>

      {/* Share Modal (Mobile Duplicate) */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp relative">
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Share Project</h3>
                  <p className="text-xs text-slate-500">Secure link generated</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 mb-4">
                <div className="flex-1 truncate">
                  <span className="font-mono text-sm text-blue-600 font-bold block truncate">{shortUrl}</span>
                </div>
                <button 
                  onClick={handleCopy}
                  className={`p-2 rounded-lg transition-all ${
                    copied 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                 <Check className="w-3 h-3 text-blue-500" /> View Only
                 <span className="mx-1">•</span>
                 <Check className="w-3 h-3 text-blue-500" /> Full Screen
              </div>

              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar;
