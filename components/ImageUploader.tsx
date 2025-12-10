import React, { useRef, useState, useCallback } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ImageFile) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64Data = result.split(',')[1];
      
      onImageSelected({
        file,
        previewUrl: result,
        base64Data,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative group w-full max-w-2xl mx-auto h-96 rounded-3xl border-2 border-dashed transition-all duration-300 ease-out flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden
        ${isDragging 
          ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' 
          : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
        }
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="pointer-events-none z-10 p-6 space-y-4">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ${isDragging ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-200">Drop your image here</h3>
          <p className="text-sm text-slate-400 mt-2">or click to browse from your device</p>
        </div>
        <div className="text-xs text-slate-500 pt-2">
          Supports PNG, JPG, WEBP up to 10MB
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}>
      </div>
    </div>
  );
};
