import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from './gate/passphrase';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * The on/off switch that puts the platform in fullscreen and takes it out.
 *
 * Entering fullscreen needs a user gesture, so the gate rides on its 열기
 * click — but that click is gone after a reload, which drops out of fullscreen
 * and does not re-prompt. This switch is the way back, and the way out for
 * anyone who did not want it.
 *
 * It reads the document through useFullscreen rather than remembering its own
 * clicks, so F11 and Esc move it too and a refused request leaves it off.
 */
const FullscreenToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isFull, toggle } = useFullscreen();
  const { language } = useLanguage();
  const label = language === 'KO' ? '전체화면' : 'Full screen';

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isFull}
      title={
        isFull
          ? language === 'KO' ? '전체화면을 해제합니다. Esc 로도 해제됩니다.' : 'Leave fullscreen. Esc also works.'
          : language === 'KO' ? '주소창과 탭을 감추고 화면 전체를 씁니다.' : 'Hide the address bar and tabs, and use the whole screen.'
      }
      className={`flex items-center gap-2 shrink-0 whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
        isFull
          ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      } ${className}`}
    >
      {isFull ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline">{label}</span>
      <span
        aria-hidden
        className={`relative h-3.5 w-6 shrink-0 rounded-full transition-colors ${
          isFull ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-2.5 w-2.5 rounded-full bg-white transition-transform ${
            isFull ? 'translate-x-2.5' : ''
          }`}
        />
      </span>
    </button>
  );
};

export default FullscreenToggle;
