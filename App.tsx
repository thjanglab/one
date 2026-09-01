
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar, { MobileHeader } from './components/Navbar';
import Marketplace from './components/Marketplace';
import AssetDetail from './components/AssetDetail';
import Dashboard from './components/Dashboard';
import Overview from './components/Overview';
import Framework from './components/Framework';
import Guideline from './components/Guideline';
import Tutorial from './components/Tutorial';
import UseCases from './components/UseCases';
import Connector from './components/Connector';
import Portal from './components/Portal';
import BlockchainLab from './components/BlockchainLab';
import PCFModule from './components/PCFModule';
import DPPModule from './components/DPPModule';
import ClearingHouse from './components/ClearingHouse';
import PreprocessingModule from './components/PreprocessingModule';
import EnergyModule from './components/EnergyModule';
import Demonstration from './components/Demonstration';
import EDCSimulation from './components/EDCSimulation';
import IdentityVerification from './components/IdentityVerification';
import SupplyChainMap from './components/SupplyChainMap';
import IntelligentSCM from './components/IntelligentSCM';
import SecurityModule from './components/SecurityModule';
import { LanguageProvider } from './contexts/LanguageContext';
import { AssetProvider } from './contexts/AssetContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AssetProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
            <MobileHeader />
            <Navbar />
            
            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<Navigate to="/overview" replace />} />
                        <Route path="/overview" element={<Overview />} />
                        <Route path="/portal" element={<Portal />} />
                        <Route path="/pcf" element={<PCFModule />} />
                        <Route path="/dpp" element={<DPPModule />} />
                        <Route path="/intelligent-scm" element={<IntelligentSCM />} />
                        <Route path="/supply-chain" element={<SupplyChainMap />} />
                        <Route path="/security" element={<SecurityModule />} />
                        <Route path="/framework" element={<Framework />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/usecases" element={<UseCases />} />
                        <Route path="/demonstration" element={<Demonstration />} />
                        <Route path="/edc-simulation" element={<EDCSimulation />} />
                        <Route path="/identity-sim" element={<IdentityVerification />} />
                        <Route path="/asset/:id" element={<AssetDetail />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/connector" element={<Connector />} />
                        <Route path="/blockchain" element={<BlockchainLab />} />
                        <Route path="/clearinghouse" element={<ClearingHouse />} />
                        <Route path="/preprocessing" element={<PreprocessingModule />} />
                        <Route path="/energy" element={<EnergyModule />} />
                        <Route path="/guideline" element={<Guideline />} />
                        <Route path="/tutorial" element={<Tutorial />} />
                    </Routes>
                </div>
            </main>
          </div>
        </Router>
      </AssetProvider>
    </LanguageProvider>
  );
};

export default App;
