
import React, { useState } from 'react';
import { X, CreditCard, Wallet, Building2, CheckCircle2, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Asset } from '../types';
import { useAssets } from '../contexts/AssetContext';
import { useLanguage } from '../contexts/LanguageContext';
import { assetTitle, assetDescription } from '../labels';
import { useNavigate } from 'react-router-dom';

interface PaymentModalProps {
  asset: Asset;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ asset, onClose }) => {
  const { addToLibrary } = useAssets();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [method, setMethod] = useState<'CARD' | 'CRYPTO' | 'BANK'>('CARD');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    // Simulate API call and processing time
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      addToLibrary(asset);
    }, 2000);
  };

  const handleGoToAssets = () => {
      onClose();
      navigate('/dashboard');
  };

  if (completed) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-scaleUp">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{language === 'KO' ? '결제가 완료되었습니다!' : 'Payment Successful!'}</h2>
          <p className="text-slate-500 mb-6 text-sm">
            {language === 'KO' ? (
              <>
                <strong>{assetTitle(asset, language)}</strong> 구매가 정상적으로 완료되었습니다.<br/>
                해당 자산이 내 라이브러리에 추가되었습니다.
              </>
            ) : (
              <>
                You have successfully purchased <strong>{assetTitle(asset, language)}</strong>.<br/>
                The asset has been added to your library.
              </>
            )}
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm border border-slate-100">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500">{language === 'KO' ? '거래 ID' : 'Transaction ID'}</span>
              <span className="font-mono font-bold text-slate-700">TX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'KO' ? '결제 금액' : 'Amount Paid'}</span>
              <span className="font-bold text-slate-900">{asset.price.toLocaleString()} {asset.currency}</span>
            </div>
          </div>
          <button 
            onClick={handleGoToAssets}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {language === 'KO' ? '내 자산으로 이동' : 'Go to My Assets'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{language === 'KO' ? '결제하기' : 'Checkout'}</h2>
            <p className="text-xs text-slate-500 mt-1">{language === 'KO' ? '보안 결제 게이트웨이' : 'Secure Payment Gateway'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Order Summary */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex items-start gap-4">
            <div className="w-16 h-16 bg-white rounded-lg border border-blue-100 overflow-hidden shrink-0">
                <img src={asset.imageUrl} alt={assetTitle(asset, language)} className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 text-sm">{assetTitle(asset, language)}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{assetDescription(asset, language)}</p>
                <div className="mt-2 font-bold text-blue-700">{asset.price.toLocaleString()} {asset.currency}</div>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button 
                onClick={() => setMethod('CARD')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${method === 'CARD' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
            >
                <CreditCard className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">{language === 'KO' ? '신용카드' : 'Credit Card'}</span>
            </button>
            <button 
                onClick={() => setMethod('CRYPTO')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${method === 'CRYPTO' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'}`}
            >
                <Wallet className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">{language === 'KO' ? '암호화폐/토큰' : 'Crypto/Token'}</span>
            </button>
            <button 
                onClick={() => setMethod('BANK')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${method === 'BANK' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}
            >
                <Building2 className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">{language === 'KO' ? '계좌이체' : 'Bank Transfer'}</span>
            </button>
          </div>

          {/* Payment Form */}
          <div className="space-y-4 min-h-[200px]">
            {method === 'CARD' && (
                <div className="space-y-3 animate-fadeIn">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'KO' ? '카드 번호' : 'Card Number'}</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" defaultValue="4242 4242 4242 4242" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'KO' ? '유효기간' : 'Expiry'}</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" defaultValue="12/28" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                            <input type="text" placeholder="123" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" defaultValue="123" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'KO' ? '카드 소유자명' : 'Cardholder Name'}</label>
                        <input type="text" placeholder={language === 'KO' ? '홍길동' : 'John Doe'} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" defaultValue="Korea USER" />
                    </div>
                </div>
            )}

            {method === 'CRYPTO' && (
                <div className="space-y-4 animate-fadeIn text-center py-4">
                    <div className="bg-slate-900 p-4 rounded-xl inline-block mx-auto mb-2 border-2 border-purple-500 shadow-lg shadow-purple-200">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x71C...9A23`} alt={language === 'KO' ? 'QR 코드' : 'QR'} className="w-32 h-32 rounded-lg" />
                    </div>
                    <p className="text-xs text-slate-500">{language === 'KO' ? 'USDC (ERC-20)로 결제하려면 QR 코드를 스캔하세요' : 'Scan to pay with USDC (ERC-20)'}</p>
                    <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-between border border-slate-200">
                        <code className="text-[10px] text-slate-700 font-mono truncate mr-2">0x71C7656EC7ab88b098defB751B7401B5f6d89A23</code>
                        <button className="text-blue-600 text-xs font-bold hover:underline">{language === 'KO' ? '복사' : 'Copy'}</button>
                    </div>
                </div>
            )}

            {method === 'BANK' && (
                <div className="space-y-4 animate-fadeIn bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-sm text-slate-500">{language === 'KO' ? '은행명' : 'Bank Name'}</span>
                        <span className="text-sm font-bold text-slate-800">Woori Bank</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-sm text-slate-500">{language === 'KO' ? '계좌번호' : 'Account No.'}</span>
                        <span className="text-sm font-bold text-slate-800">1002-123-456789</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-slate-500">{language === 'KO' ? '예금주' : 'Account Holder'}</span>
                        <span className="text-sm font-bold text-slate-800">Korea Inc.</span>
                    </div>
                    <div className="mt-4 p-2 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-200 flex items-start gap-2">
                        <Lock className="w-3 h-3 mt-0.5" />
                        <span>{language === 'KO' ? '가상계좌는 24시간 동안 유효합니다.' : 'Virtual account valid for 24 hours.'}</span>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
            <button 
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                {processing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> {language === 'KO' ? '결제 처리 중...' : 'Processing Payment...'}
                    </>
                ) : (
                    <>
                        {language === 'KO'
                            ? `${asset.price.toLocaleString()} ${asset.currency} 결제하기`
                            : `Pay ${asset.price.toLocaleString()} ${asset.currency}`}
                    </>
                )}
            </button>
            <div className="text-center mt-3 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> {language === 'KO' ? '256-bit SSL 암호화 거래' : '256-bit SSL Encrypted Transaction'}
            </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;
