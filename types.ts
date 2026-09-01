
export enum AssetType {
  DATASET = 'DATASET',
  AI_MODEL = 'AI_MODEL',
  APP = 'APP',
  DIGITAL_TWIN = 'DIGITAL_TWIN',
  EQUIPMENT = 'EQUIPMENT', 
  PART = 'PART'            
}

export enum Industry {
  AUTOMOTIVE = 'Automotive',
  ELECTRONICS = 'Electronics',
  CONSTRUCTION = 'Construction',
  ENERGY = 'Energy',
  AEROSPACE = 'Aerospace',
  MANUFACTURING = 'Manufacturing',
  LOGISTICS = 'Logistics'
}

export enum AICategory {
  SUPPLY_CHAIN = 'SUPPLY_CHAIN',     
  DIGITAL_TWIN = 'DIGITAL_TWIN',     
  PREDICTIVE_MAINT = 'PREDICTIVE_MAINT', 
  QUALITY_INSPECTION = 'QUALITY_INSPECTION', 
  ENERGY_OPTIMIZATION = 'ENERGY_OPTIMIZATION' 
}

export interface Asset {
  id: string;
  title: string;
  provider: string;
  type: AssetType;
  industry: Industry;
  aiCategory?: AICategory; 
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  dataPoints?: number; 
  tags: string[];
  certified: boolean; 
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logo: string; 
  logoUrl: string; 
  industry: Industry;
  productsCount: number;
}

export interface Contract {
  id: string;
  assetId: string;
  buyer: string;
  provider: string;
  status: 'PENDING' | 'ACTIVE' | 'TERMINATED';
  hash: string; 
  timestamp: string;
  usagePolicy: string;
}

export interface User {
  id: string;
  name: string;
  company: string;
  walletAddress: string;
  role: 'PROVIDER' | 'CONSUMER' | 'BOTH';
}

export interface Block {
  index: number;
  timestamp: string;
  prevHash: string;
  hash: string;
  transactions: BlockchainTx[];
  validator: string;
  nonce: number;
}

export interface BlockchainTx {
  id: string;
  from: string;
  to: string;
  assetId: string;
  amount: number;
  signature: string;
  status: 'PENDING' | 'VERIFIED' | 'COMMITTED';
}

// --- New Types for PCF & DPP ---

export interface PCFProduct {
  id: string;
  name: string;
  partNumber: string;
  productionTime: string;
  co2PerUnit: number; // kg/ea
  totalCo2: number; // Ton (for the whole vehicle context)
  lastUpdate: string;
  status: 'YES' | 'NO' | 'DONE'; // Update request status
  imageUrl: string;
}

export interface TierInfo {
  tier: 'Upper' | 'Manufacturer' | 'Lower';
  companyName: string;
  logoUrl: string;
  status: 'Connected' | 'Pending';
}

export interface DPPInspection {
  id: string;
  imageUrl: string;
  timestamp: string;
  result: 'OK' | 'NG';
  defects: { x: number, y: number, label: string }[];
}

export interface DataTransaction {
  no: number;
  processId: string;
  date: string;
}
