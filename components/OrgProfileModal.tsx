import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SECTOR_LABELS, lookupOrg, sectorOf } from '../directory';

const KIND_LABELS = {
    Enterprise: { en: 'Enterprise', ko: '기업' },
    Institute: { en: 'Research institute', ko: '연구기관' },
    Agency: { en: 'Public agency', ko: '공공기관' },
    Academia: { en: 'University', ko: '대학' },
};

interface Props {
    /** Directory key - the organisation's English name. */
    name: string;
    /** Node the member was opened from, when there is one. */
    nodeLabel?: string;
    onClose: () => void;
}

/**
 * Profile for one organisation in the ecosystem directory. Shared by the map's
 * member list and the overview's participant list so the two cannot drift.
 */
const OrgProfileModal: React.FC<Props> = ({ name, nodeLabel, onClose }) => {
    const { language } = useLanguage();
    const isKo = language === 'KO';
    const org = lookupOrg(name);
    const sec = sectorOf(name);
    const kindLabel = KIND_LABELS[org?.kind ?? 'Enterprise'];
    const detailed = Boolean(org?.summary);
    // Stable per organisation rather than random, so the figure does not
    // change every time the card is opened.
    const assets = 3 + (name.length % 9);

    return (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
                    onClick={() => onClose()}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp flex flex-col max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg shrink-0">
                                    {name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold leading-tight">{isKo ? (org?.nameKo || name) : name}</h3>
                                    {isKo && org?.nameKo && <p className="text-[11px] text-slate-400 mt-0.5">{name}</p>}
                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600">
                                            {SECTOR_LABELS[sec][isKo ? 'ko' : 'en']}
                                        </span>
                                        {/* Research institutes and agencies have a sector
                                            that already says what they are - no need to
                                            print the same word twice. */}
                                        {(isKo ? kindLabel.ko : kindLabel.en) !== SECTOR_LABELS[sec][isKo ? 'ko' : 'en'] && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700">
                                                {isKo ? kindLabel.ko : kindLabel.en}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => onClose()}
                                aria-label={isKo ? '프로필 닫기' : 'Close the profile'}
                                className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 overflow-y-auto bg-slate-50">
                            {detailed ? (
                                <>
                                    <p className="text-sm text-slate-700 leading-relaxed">{isKo ? org?.summaryKo : org?.summary}</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">{isKo ? '본사' : 'Headquarters'}</p>
                                            <p className="text-sm font-bold text-slate-900">{isKo ? org?.hqKo : org?.hq}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">{isKo ? '설립' : 'Founded'}</p>
                                            <p className="text-sm font-bold text-slate-900 tabular-nums">{org?.founded}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">{isKo ? '데이터스페이스 역할' : 'Role in the dataspace'}</p>
                                        <p className="text-sm text-slate-700 leading-relaxed">{isKo ? org?.roleKo : org?.role}</p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {isKo
                                        ? '해외 파트너 기관으로, 상세 프로필은 아직 등록되지 않았습니다.'
                                        : 'An overseas partner. A detailed profile has not been registered yet.'}
                                </p>
                            )}

                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-3">{isKo ? '연동 정보' : 'Connection'}</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">{isKo ? '소속 노드' : 'Node'}</span>
                                        <span className="font-medium text-slate-800">{nodeLabel ?? (isKo ? '—' : '—')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">EDC {isKo ? '커넥터' : 'connector'}</span>
                                        <span className="font-mono text-[11px] text-slate-700">
                                            edc-{name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 18)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">{isKo ? '공개 데이터 자산' : 'Published data assets'}</span>
                                        <span className="font-mono tabular-nums text-slate-800">{assets}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">{isKo ? '상태' : 'Status'}</span>
                                        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            {isKo ? '연동 중' : 'Connected'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 bg-white flex justify-end shrink-0">
                            <button onClick={() => onClose()}
                                className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                                {isKo ? '닫기' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
    );
};

export default OrgProfileModal;
