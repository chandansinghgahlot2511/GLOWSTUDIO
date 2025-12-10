import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { ImageFile } from '../types';
import { enhancePrompt } from '../services/geminiService';

interface PromptBarProps {
  onSubmit: (prompt: string, referenceImage: ImageFile | null) => void;
  isLoading: boolean;
}

const TRENDING_SUGGESTIONS = [
  "Cyberpunk neon portrait",
  "Vintage 90s anime style",
  "Professional LinkedIn headshot",
  "Claymation style",
  "PS2 graphics aesthetic",
  "Retro 80s synthwave"
];

const SUGGESTIONS = [
  // Gen Z Aesthetics
  "Y2K aesthetic with butterfly clips",
  "0.5x fisheye lens selfie",
  "Vintage 2000s digicam look",
  "Cybercore aesthetic with neon",
  "Grainy disposable camera vibe",
  "E-girl aesthetic with heart makeup",
  "Frutiger Aero aesthetic",
  "McBling style with rhinestones",
  "Coquette aesthetic with bows",
  "Webcore weirdness",
  "Dreamcore surrealism",
  "Dark Academia library vibes",
  "Cottagecore picnic setting",
  "Old Money aesthetic",
  "Clean Girl aesthetic",
  "Indie sleaze vibe",
  "Grunge texture overlay",
  "Vaporwave glitch background",
  "Retro anime screenshot style",
  "Lo-fi hip hop vibe",

  // Photography & Edits
  "Flash photography at night",
  "Motion blur effect",
  "Overexposed flash look",
  "Chromatic aberration glitch",
  "Scanlines effect",
  "VHS tape distortion",
  "Polaroid frame",
  "Film burn light leaks",
  "Dithered pixel art",
  "Halftone pattern",
  "Fisheye lens",
  "Wide angle lens distortion",
  "Thermal camera effect",
  "Night vision green tint",
  "X-ray effect",

  // Fun & Fantasy
  "Add angel wings and halo",
  "Cyberpunk robot parts",
  "Fairy wings and glitter",
  "Vampire fangs and red eyes",
  "Demon horns and tail",
  "Elf ears and nature magic",
  "Mermaid tail underwater",
  "Astronaut in deep space",
  "Zombie makeup style",
  "Clowncore aesthetic",
  
  // Locations & Vibes
  "In a neon lit arcade",
  "At a concerts mosh pit",
  "In a liminal space hallway",
  "On a vaporwave beach",
  "Inside a spaceship cockpit",
  "At a retro diner",
  "In a messy bedroom mirror selfie",
  "Underground rave party",
  "Abandoned mall setting",
  "Rooftop at sunset",

  // Accessories & Fashion
  "Wear pit viper sunglasses",
  "Wear chunky headphones",
  "Wear a bucket hat",
  "Wear oversized hoodie",
  "Wear baggy jeans",
  "Wear platform boots",
  "Wear star hair clips",
  "Wear layered silver chains",
  "Wear fingerless gloves",
  "Wear goth makeup"
];

export const PromptBar: React.FC<PromptBarProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [referenceImage, setReferenceImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        const base64Data = result.split(',')[1];
        setReferenceImage({
          file,
          previewUrl: result,
          base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReference = () => {
    setReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim(), referenceImage);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setPrompt(text);
  };

  const handleEnhance = async () => {
    if (!prompt.trim() || isEnhancing) return;
    
    setIsEnhancing(true);
    const improved = await enhancePrompt(prompt);
    setPrompt(improved);
    setIsEnhancing(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 z-40 px-6 md:px-12 flex flex-col items-center justify-end gap-3 pointer-events-none">
      
      {/* Suggestions Slider */}
      {!isLoading && (
        <div className="w-full max-w-2xl relative group/slider pointer-events-auto">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-slate-900/80 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity border border-slate-700 hover:bg-purple-600 hover:border-purple-500 shadow-lg backdrop-blur-sm -ml-2 sm:-ml-4"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto flex gap-2 pb-2 [&::-webkit-scrollbar]:hidden px-1 scroll-smooth items-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Trending Section */}
            <div className="flex items-center gap-2 pr-2 border-r border-slate-700/50 mr-2 shrink-0">
               <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider whitespace-nowrap pl-1">Trending</span>
            </div>

            {TRENDING_SUGGESTIONS.map((s, i) => (
              <button
                key={`trending-${i}`}
                onClick={() => handleSuggestionClick(s)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-purple-900/40 backdrop-blur-md border border-purple-500/50 text-xs font-medium text-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-400 transition-all shadow-lg shadow-purple-900/20 cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5 group"
              >
                <span className="text-xs group-hover:animate-bounce">🔥</span>
                {s}
              </button>
            ))}

            <div className="w-px h-4 bg-slate-700/50 mx-1 shrink-0"></div>

            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-medium text-slate-300 hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all shadow-lg cursor-pointer active:scale-95 whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-slate-900/80 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity border border-slate-700 hover:bg-purple-600 hover:border-purple-500 shadow-lg backdrop-blur-sm -mr-2 sm:-mr-4"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-2 flex gap-2 ring-1 ring-white/10 pointer-events-auto"
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="relative flex-1 flex items-center bg-transparent rounded-xl px-2">
          {/* Reference Image Trigger or Preview */}
          {referenceImage ? (
            <div className="relative group mr-3 shrink-0">
              <img 
                src={referenceImage.previewUrl} 
                alt="Ref" 
                className="h-10 w-10 rounded-lg object-cover border border-purple-500/50 shadow-sm" 
              />
              <button
                type="button"
                onClick={handleRemoveReference}
                className="absolute -top-1.5 -right-1.5 bg-slate-800 text-slate-200 rounded-full p-0.5 border border-slate-600 shadow-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                title="Remove reference image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          ) : (
             <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 mr-1 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all"
              title="Add reference image"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
          )}

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={referenceImage ? "Describe how to use this reference image..." : "Describe your Gen Z edit..."}
            className="w-full bg-transparent text-white placeholder-slate-400 border-none focus:ring-0 h-12 outline-none"
            disabled={isLoading}
          />
          
          {/* Enhance Button */}
          {prompt.trim().length > 3 && !isLoading && (
            <button
              type="button"
              onClick={handleEnhance}
              disabled={isEnhancing}
              className={`p-2 rounded-xl transition-all mr-2 ${isEnhancing ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-yellow-300 hover:bg-yellow-500/10'}`}
              title="Enhance prompt with AI"
            >
              {isEnhancing ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576L8.279 5.044A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.394a.75.75 0 010 1.422l-1.183.394c-.447.15-.799.502-.948.948l-.394 1.183a.75.75 0 01-1.422 0l-.394-1.183a1.5 1.5 0 00-.948-.948l-1.183-.394a.75.75 0 010-1.422l1.183-.394c.447-.15.799-.502.948-.948l.394-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={!prompt.trim() || isLoading} 
          isLoading={isLoading}
          className="shrink-0 bg-purple-600 hover:bg-purple-500 shadow-purple-500/30"
        >
          Generate
        </Button>
      </form>
    </div>
  );
};