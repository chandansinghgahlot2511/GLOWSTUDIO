import React from 'react';
import { ImageFile } from '../types';

interface FilterBarProps {
  originalImage: ImageFile;
  onFilterApplied: (image: ImageFile) => void;
}

const FILTERS = [
  { id: 'none', name: 'Normal', css: 'none' },
  { id: 'y2k', name: 'Y2K', css: 'saturate(1.5) contrast(1.2) hue-rotate(-10deg)' },
  { id: 'digicam', name: 'Digicam', css: 'brightness(1.2) contrast(1.1) saturate(0.8)' },
  { id: 'indie', name: 'Indie', css: 'sepia(0.2) contrast(1.2) brightness(1.1) saturate(1.3)' },
  { id: 'disposable', name: 'Disposable', css: 'sepia(0.2) contrast(1.2) brightness(1.1)' },
  { id: 'grunge', name: 'Grunge', css: 'grayscale(100%) contrast(1.5) brightness(0.8)' },
  { id: 'cool', name: 'Cool', css: 'hue-rotate(180deg) saturate(50%)' },
  { id: 'warm', name: 'Warm', css: 'sepia(30%) saturate(140%)' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(50%) contrast(120%) brightness(90%)' },
  { id: 'invert', name: 'Invert', css: 'invert(100%)' },
  { id: 'saturate', name: 'Vibrant', css: 'saturate(200%)' },
];

export const FilterBar: React.FC<FilterBarProps> = ({ originalImage, onFilterApplied }) => {
  const [activeFilter, setActiveFilter] = React.useState('none');

  const applyFilter = (filterId: string, cssFilter: string) => {
    setActiveFilter(filterId);
    
    if (filterId === 'none') {
      onFilterApplied(originalImage);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = originalImage.previewUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Apply the CSS filter string directly to the canvas context
        ctx.filter = cssFilter;
        ctx.drawImage(img, 0, 0);
        
        const dataUrl = canvas.toDataURL(originalImage.mimeType);
        // Remove data:image/xxx;base64, prefix for the API
        const base64Data = dataUrl.split(',')[1];
        
        onFilterApplied({
          ...originalImage,
          previewUrl: dataUrl,
          base64Data: base64Data
        });
      }
    };
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-purple-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Filters
        </span>
      </div>
      
      <div className="w-full overflow-x-auto pb-4 mb-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-800/50 [&::-webkit-scrollbar-thumb]:bg-slate-700/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        <div className="flex gap-3 min-w-max px-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => applyFilter(filter.id, filter.css)}
              className={`
                group flex flex-col items-center gap-2 p-2 rounded-xl border transition-all duration-200 min-w-[80px]
                ${activeFilter === filter.id 
                  ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/10' 
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500'
                }
              `}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 relative ring-1 ring-black/20">
                <img 
                  src={originalImage.previewUrl} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ filter: filter.css }}
                  alt={filter.name}
                />
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${activeFilter === filter.id ? 'text-purple-300' : 'text-slate-400 group-hover:text-slate-300'}`}>
                {filter.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
