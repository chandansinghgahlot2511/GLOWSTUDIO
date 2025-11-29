import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptBar } from './components/PromptBar';
import { Button } from './components/Button';
import { FilterBar } from './components/FilterBar';
import { AppStatus, ImageFile, Language } from './types';
import { editImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [workingImage, setWorkingImage] = useState<ImageFile | null>(null); // The image (potentially filtered) sent to API
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // To prevent scrolling when the prompt bar is fixed
  const bottomRef = useRef<HTMLDivElement>(null);

  const t = {
    heroTitle: { en: "Reimagine your photos with GlowStudio", hi: "GlowStudio के साथ अपनी तस्वीरों को फिर से तैयार करें" },
    heroSubtitle: { en: "Powered by Gemini 2.5 Flash Image. Upload, Filter, and Transform.", hi: "जेमिनी 2.5 फ्लैश इमेज द्वारा संचालित। अपलोड करें, फ़िल्टर करें और बदलें।" },
    editorTitle: { en: "Editor Workspace", hi: "संपादक कार्यस्थान" },
    startOver: { en: "Start Over", hi: "फिर से शुरू करें" },
    original: { en: "Original", hi: "असली" },
    edited: { en: "Edited", hi: "संपादित" },
    dreaming: { en: "Gemini is dreaming...", hi: "जेमिनी सोच रहा है..." },
    waiting: { en: "Your edited masterpiece will appear here", hi: "आपकी संपादित कृति यहाँ दिखाई देगी" },
    download: { en: "Download Image", hi: "छवि डाउनलोड करें" },
    errorGeneric: { en: "Something went wrong while processing the image.", hi: "छवि संसाधित करते समय कुछ गलत हो गया।" },
    errorSafety: { en: "Request cannot be processed due to safety guidelines.", hi: "सुरक्षा दिशानिर्देशों के कारण अनुरोध संसाधित नहीं किया जा सकता है।" }
  };

  const handleImageSelected = (image: ImageFile) => {
    setOriginalImage(image);
    setWorkingImage(image); // Initially, working image is original
    setGeneratedImageUrl(null);
    setStatus(AppStatus.IMAGE_SELECTED);
    setErrorMsg(null);
  };

  const handleFilterApplied = (filteredImage: ImageFile) => {
    setWorkingImage(filteredImage);
    // If we have a result, clear it because the source changed
    if (generatedImageUrl) {
      setGeneratedImageUrl(null);
      setStatus(AppStatus.IMAGE_SELECTED);
    }
  };

  const handlePromptSubmit = async (prompt: string, referenceImage: ImageFile | null) => {
    if (!workingImage) return;

    setStatus(AppStatus.PROCESSING);
    setErrorMsg(null);
    setGeneratedImageUrl(null);

    try {
      const resultBase64 = await editImageWithGemini(workingImage, prompt, referenceImage);
      setGeneratedImageUrl(resultBase64);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      
      const errorMessage = err.message || '';
      // Check for safety related errors or blocks
      const isSafetyError = 
        errorMessage.includes('SAFETY') || 
        errorMessage.includes('blocked') || 
        errorMessage.includes('finishReason') ||
        errorMessage.includes('400'); // Often 400 Bad Request on safety

      if (isSafetyError) {
        setErrorMsg(t.errorSafety[language]);
      } else {
        setErrorMsg(t.errorGeneric[language]);
      }
      
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setWorkingImage(null);
    setGeneratedImageUrl(null);
    setStatus(AppStatus.IDLE);
    setErrorMsg(null);
  };

  const downloadImage = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
      link.download = `glowstudio-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadOriginalImage = () => {
    if (workingImage) {
      const link = document.createElement('a');
      link.href = workingImage.previewUrl;
      link.download = `glowstudio-source-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30">
      <Header language={language} setLanguage={setLanguage} />

      <main className="container mx-auto px-4 py-8 pb-32 max-w-7xl">
        
        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center gap-3 animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">{errorMsg}</p>
            <button onClick={() => setErrorMsg(null)} className="ml-auto hover:text-white">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {status === AppStatus.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6 leading-tight">
                {t.heroTitle[language]}
              </h2>
              <p className="text-lg text-slate-400">
                {t.heroSubtitle[language]}
              </p>
            </div>
            <ImageUploader onImageSelected={handleImageSelected} language={language} />
          </div>
        )}

        {(status !== AppStatus.IDLE && originalImage && workingImage) && (
          <div className="animate-fadeIn">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">{t.editorTitle[language]}</h3>
                <Button variant="ghost" onClick={handleReset} className="text-sm">
                  {t.startOver[language]}
                </Button>
             </div>

             <div className="mb-8">
               <FilterBar 
                  originalImage={originalImage} 
                  onFilterApplied={handleFilterApplied} 
                  language={language}
               />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* Working Image Card (Source) */}
                <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl transition-all">
                  <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-white/10">
                    {t.original[language]}
                  </div>

                  <button 
                    onClick={downloadOriginalImage}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title={t.download[language]}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                  </button>

                  <img 
                    src={workingImage.previewUrl} 
                    alt="Original" 
                    className="w-full h-auto object-contain max-h-[600px] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-slate-900" 
                  />
                </div>

                {/* Generated Result Card Container */}
                <div className="flex flex-col gap-4">
                  <div className={`relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl min-h-[300px] flex items-center justify-center ${status === AppStatus.ERROR ? 'border-red-500/30' : ''}`}>
                     {status === AppStatus.PROCESSING ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-20">
                           <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                           <p className="text-purple-400 animate-pulse font-medium">{t.dreaming[language]}</p>
                        </div>
                     ) : null}

                     {status === AppStatus.SUCCESS && generatedImageUrl ? (
                       <>
                          <div className="absolute top-4 left-4 z-10 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg text-white">
                            {t.edited[language]}
                          </div>
                          <img 
                            src={generatedImageUrl} 
                            alt="Generated" 
                            className="w-full h-auto object-contain max-h-[600px] animate-fadeIn"
                          />
                       </>
                     ) : (
                       status !== AppStatus.PROCESSING && (
                          <div className="text-center p-10 text-slate-500">
                            {status === AppStatus.ERROR ? (
                              <div className="text-red-400 opacity-80">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p>{errorMsg || t.errorGeneric[language]}</p>
                              </div>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                </svg>
                                <p>{t.waiting[language]}</p>
                              </>
                            )}
                          </div>
                       )
                     )}
                  </div>
                  
                  {/* Action Buttons */}
                  {status === AppStatus.SUCCESS && generatedImageUrl && (
                    <div className="flex justify-end animate-fadeIn">
                       <Button variant="primary" onClick={downloadImage} className="w-full md:w-auto shadow-xl shadow-purple-500/20 bg-purple-600 hover:bg-purple-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {t.download[language]}
                       </Button>
                    </div>
                  )}
                </div>
             </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </main>

      {/* Floating Prompt Bar - Only show when image is selected */}
      {status !== AppStatus.IDLE && (
        <PromptBar 
          onSubmit={handlePromptSubmit} 
          isLoading={status === AppStatus.PROCESSING} 
          language={language}
        />
      )}
    </div>
  );
};

export default App;