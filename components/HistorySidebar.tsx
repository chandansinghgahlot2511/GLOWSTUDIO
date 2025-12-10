import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onSelect }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-slate-900/95 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-purple-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold text-white tracking-tight">History</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-800/20">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <p className="font-medium">No edits yet</p>
              <p className="text-sm mt-1">Create something amazing!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800 transition-all cursor-pointer shadow-lg hover:shadow-purple-500/10"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <div className="flex gap-4 p-3">
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 relative">
                       <img 
                        src={item.imageUrl} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed font-medium group-hover:text-purple-300 transition-colors">
                        "{item.prompt}"
                      </p>
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                        </svg>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
