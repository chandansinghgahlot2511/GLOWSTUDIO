import React from 'react';

interface AdSpaceProps {
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export const AdSpace: React.FC<AdSpaceProps> = ({ variant = 'horizontal', className = '' }) => {
  return (
    <div className={`w-full animate-fadeIn opacity-80 hover:opacity-100 transition-opacity duration-300 ${className}`}>
      <div className="flex items-center justify-center mb-2">
        <span className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Advertisement</span>
      </div>
      <div className={`
        bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col items-center justify-center overflow-hidden relative group backdrop-blur-sm w-full
        ${variant === 'vertical' ? 'min-h-[500px] h-full' : 'h-28 md:h-32'}
      `}>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(45deg, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        </div>
        
        {/* Placeholder Content */}
        <div className="z-10 flex flex-col items-center gap-2 text-slate-600">
          <div className="p-2 rounded-full bg-slate-800/50 border border-slate-700/50">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 2.625a2.625 2.625 0 01-1.012.875 1.125 1.125 0 01-.875-1.012m-2.625-3.75a2.625 2.625 0 01.875-1.012 1.125 1.125 0 011.012-.875" />
            </svg>
          </div>
          <span className="text-xs font-medium">Space Available</span>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      </div>
    </div>
  );
};