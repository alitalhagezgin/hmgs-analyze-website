import { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer   = setTimeout(() => setFadeOut(true), 1200);
    const finishTimer = setTimeout(() => onFinish(), 1700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center
                  bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900
                  transition-opacity duration-500
                  ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="animate-splash-scale">
        <Scale
          size={88}
          className="text-white mb-6 drop-shadow-lg"
          strokeWidth={1.5}
        />
      </div>
      <h1 className="text-white text-4xl font-bold tracking-tight animate-splash-fade-up">
        HMGS Sınav Analizi
      </h1>
      <p className="text-indigo-200 text-base mt-3 animate-splash-fade-up-delayed">
        Performansını analiz et, ilerle
      </p>
      <div className="absolute bottom-12 animate-splash-fade-up-delayed">
        <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-splash-progress" />
        </div>
      </div>
    </div>
  );
}
