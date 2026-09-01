/**
 * Display labels for enum values that are shown to a person.
 *
 * The enum values themselves stay English because they are compared, filtered
 * on and used as keys; only the rendered label changes with the language. These
 * live here rather than inside one component so the marketplace filter chips and
 * the asset cards beneath them never disagree about what a category is called.
 */
import { Asset, AssetType, Industry } from './types';

export const INDUSTRY_LABELS_KO: Record<string, string> = {
  [Industry.AUTOMOTIVE]: '자동차',
  [Industry.ELECTRONICS]: '전자·반도체',
  [Industry.CONSTRUCTION]: '건설',
  [Industry.ENERGY]: '에너지',
  [Industry.AEROSPACE]: '항공우주',
  [Industry.MANUFACTURING]: '일반 제조',
  [Industry.LOGISTICS]: '물류',
};

export const ASSET_TYPE_LABELS_KO: Record<string, string> = {
  [AssetType.DATASET]: '데이터셋',
  [AssetType.AI_MODEL]: 'AI 모델',
  [AssetType.APP]: '애플리케이션',
  [AssetType.DIGITAL_TWIN]: '디지털 트윈',
  [AssetType.EQUIPMENT]: '설비',
  [AssetType.PART]: '부품',
};

export const getIndustryLabel = (industry: string, language: string) =>
  language === 'KO' ? (INDUSTRY_LABELS_KO[industry] || industry) : industry;

export const getAssetTypeLabel = (type: string, language: string) =>
  language === 'KO' ? (ASSET_TYPE_LABELS_KO[type] || type.replace('_', ' ')) : type.replace('_', ' ');

/**
 * Catalogue copy. Falls back to the English original when no Korean version
 * exists - product names like Recipe.AI read the same in both languages.
 */
export const assetTitle = (asset: Asset, language: string) =>
  language === 'KO' ? (asset.titleKo || asset.title) : asset.title;

export const assetDescription = (asset: Asset, language: string) =>
  language === 'KO' ? (asset.descriptionKo || asset.description) : asset.description;
