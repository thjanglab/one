
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset } from '../types';
import { MOCK_ASSETS } from '../constants';

export interface LibraryAsset extends Asset {
  purchaseDate: string;
  status: 'Active' | 'Expired' | 'Pending';
  nextRenewal: string;
}

interface AssetContextType {
  myAssets: LibraryAsset[];
  addToLibrary: (asset: Asset) => void;
  removeFromLibrary: (assetId: string) => void;
  isOwned: (assetId: string) => boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};

export const AssetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myAssets, setMyAssets] = useState<LibraryAsset[]>(() => {
    try {
      const saved = localStorage.getItem('korea_my_assets');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load assets", e);
    }
    
    // Default initial data for demonstration
    const defaultAssets = MOCK_ASSETS.slice(0, 1).map((asset, index) => ({
      ...asset,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'Active' as const,
      nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    return defaultAssets;
  });

  useEffect(() => {
    localStorage.setItem('korea_my_assets', JSON.stringify(myAssets));
  }, [myAssets]);

  const addToLibrary = (asset: Asset) => {
    const newAsset: LibraryAsset = {
      ...asset,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +30 days
    };
    
    // Prevent duplicates
    if (!myAssets.find(a => a.id === asset.id)) {
      setMyAssets(prev => [newAsset, ...prev]);
    }
  };

  const removeFromLibrary = (assetId: string) => {
    setMyAssets(prev => prev.filter(a => a.id !== assetId));
  };

  const isOwned = (assetId: string) => {
    return myAssets.some(a => a.id === assetId);
  };

  return (
    <AssetContext.Provider value={{ myAssets, addToLibrary, removeFromLibrary, isOwned }}>
      {children}
    </AssetContext.Provider>
  );
};
