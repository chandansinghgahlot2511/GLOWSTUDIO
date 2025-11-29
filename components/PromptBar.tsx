import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { ImageFile, Language } from '../types';

interface PromptBarProps {
  onSubmit: (prompt: string, referenceImage: ImageFile | null) => void;
  isLoading: boolean;
  language: Language;
}

const SUGGESTIONS = [
  // Traditional & Cultural
  { en: "Wear traditional Indian clothing", hi: "पारंपरिक भारतीय परिधान पहनाएं" },
  { en: "Add festive Diwali lights", hi: "दिवाली की रोशनी जोड़ें" },
  { en: "Background of an ancient temple", hi: "प्राचीन मंदिर का बैकग्राउंड" },
  { en: "Wear a saree", hi: "साड़ी पहनाएं" },
  { en: "Wear a sherwani", hi: "शेरवानी पहनाएं" },
  { en: "Add traditional jewelry", hi: "पारंपरिक आभूषण जोड़ें" },
  { en: "Holi festival colors", hi: "होली के रंग" },
  { en: "Mehndi on hands", hi: "हाथों पर मेहंदी" },
  { en: "Wear a turban", hi: "पगड़ी पहनाएं" },

  // Artistic Styles
  { en: "Make it an oil painting", hi: "इसे ऑइल पेंटिंग जैसा बनाएं" },
  { en: "Convert to watercolor sketch", hi: "वाटरकलर स्केच में बदलें" },
  { en: "Pencil sketch style", hi: "पेंसिल स्केच स्टाइल" },
  { en: "Van Gogh style", hi: "वैन गॉग स्टाइल" },
  { en: "Pop art style", hi: "पॉप आर्ट स्टाइल" },
  { en: "Cyberpunk aesthetic", hi: "साइबरपंक एस्थेटिक" },
  { en: "Pixel art style", hi: "पिक्सेल आर्ट स्टाइल" },
  { en: "Anime style", hi: "एनीमे स्टाइल" },
  { en: "Cartoon character", hi: "कार्टून चरित्र" },
  { en: "3D render style", hi: "3D रेंडर स्टाइल" },
  { en: "Claymation style", hi: "क्लेमेशन स्टाइल" },
  { en: "Origami style", hi: "ओरिगामी स्टाइल" },
  { en: "Stained glass art", hi: "सना हुआ ग्लास कला" },
  { en: "Mosaic art", hi: "मोज़ेक कला" },
  { en: "Graffiti art", hi: "ग्रेफिटी कला" },
  { en: "Charcoal drawing", hi: "चारकोल ड्राइंग" },
  { en: "Impressionist painting", hi: "इंप्रेशनिस्ट पेंटिंग" },
  { en: "Surrealist art", hi: "अतियथार्थवादी कला" },
  { en: "Ukiyo-e style", hi: "उकियो-ए स्टाइल" },
  { en: "Low poly art", hi: "लो पॉली आर्ट" },

  // Photography & Filters
  { en: "Vintage slide photo", hi: "विंटेज स्लाइड फोटो" },
  { en: "Vintage film style", hi: "विंटेज फिल्म स्टाइल" },
  { en: "Black and white noir", hi: "ब्लैक एंड व्हाइट नॉयर" },
  { en: "Polaroid photo style", hi: "पोलाराइड फोटो स्टाइल" },
  { en: "Fisheye lens effect", hi: "फिशआई लेंस प्रभाव" },
  { en: "Double exposure", hi: "डबल एक्सपोज़र" },
  { en: "Sepia tone", hi: "सीपिया टोन" },
  { en: "Glitch effect", hi: "गड़बड़ (Glitch) प्रभाव" },
  { en: "Vaporwave style", hi: "वेपरवेव स्टाइल" },
  { en: "Kodak film look", hi: "कोडैक फिल्म लुक" },
  { en: "Bokeh background", hi: "बोकेह बैकग्राउंड" },
  { en: "Tilt-shift effect", hi: "टिल्ट-शिफ्ट प्रभाव" },
  { en: "HDR style", hi: "HDR स्टाइल" },
  { en: "Macro photography", hi: "मैक्रो फोटोग्राफी" },
  { en: "Long exposure", hi: "लॉन्ग एक्सपोज़र" },
  { en: "Thermal camera look", hi: "थर्मल कैमरा लुक" },

  // Lighting & Atmosphere
  { en: "Golden hour lighting", hi: "गोल्डन आवर लाइटिंग" },
  { en: "Neon lights glowing", hi: "नियॉन रोशनी चमकती हुई" },
  { en: "Cinematic lighting", hi: "सिनेमैटिक लाइटिंग" },
  { en: "Moonlight setting", hi: "चांदनी रात की सेटिंग" },
  { en: "Sunset background", hi: "सूर्यास्त का बैकग्राउंड" },
  { en: "Rainy day mood", hi: "बरसात के दिन का मूड" },
  { en: "Snowy atmosphere", hi: "बर्फीला वातावरण" },
  { en: "Foggy morning", hi: "धुंध भरी सुबह" },
  { en: "Underwater scene", hi: "पानी के नीचे का दृश्य" },
  { en: "Fire and flames", hi: "आग और लपटें" },
  { en: "Disco lights", hi: "डिस्को लाइट्स" },
  { en: "Candlelight", hi: "मोमबत्ती की रोशनी" },
  { en: "Northern lights", hi: "उत्तरी रोशनी (Aurora)" },
  { en: "Stormy sky", hi: "तूफानी आसमान" },
  { en: "Rainbow in sky", hi: "आसमान में इंद्रधनुष" },

  // Backgrounds
  { en: "In space", hi: "अंतरिक्ष में" },
  { en: "On Mars", hi: "मंगल ग्रह पर" },
  { en: "In a jungle", hi: "जंगल में" },
  { en: "On a beach", hi: "समुद्र तट पर" },
  { en: "In a futuristic city", hi: "भविष्य के शहर में" },
  { en: "In a castle", hi: "महल में" },
  { en: "In a library", hi: "पुस्तकालय में" },
  { en: "At a coffee shop", hi: "कॉफी शॉप में" },
  { en: "On a mountain peak", hi: "पहाड़ की चोटी पर" },
  { en: "In a flower garden", hi: "फूलों के बगीचे में" },
  { en: "Under a waterfall", hi: "झरने के नीचे" },
  { en: "In a desert", hi: "रेगिस्तान में" },
  { en: "On a boat", hi: "नाव पर" },
  { en: "In a stadium", hi: "स्टेडियम में" },
  { en: "In a video game", hi: "वीडियो गेम में" },

  // Fashion & Accessories
  { en: "Wear sunglasses", hi: "धूप का चश्मा पहनाएं" },
  { en: "Wear a tuxedo", hi: "टक्सीडो पहनाएं" },
  { en: "Wear a leather jacket", hi: "लेदर जैकेट पहनाएं" },
  { en: "Wear a floral dress", hi: "फ्लोरल ड्रेस पहनाएं" },
  { en: "Wear a cowboy hat", hi: "काउबॉय टोपी पहनाएं" },
  { en: "Wear a crown", hi: "ताज पहनाएं" },
  { en: "Wear a space suit", hi: "स्पेस सूट पहनाएं" },
  { en: "Wear a superhero cape", hi: "सुपरहीरो केप पहनाएं" },
  { en: "Wear glasses", hi: "चश्मा पहनाएं" },
  { en: "Wear a hoodie", hi: "हुडी पहनाएं" },
  { en: "Wear a winter coat", hi: "विंटर कोट पहनाएं" },
  { en: "Wear a swimsuit", hi: "स्विमसूट पहनाएं" },
  { en: "Wear a uniform", hi: "यूनिफ़ॉर्म पहनाएं" },
  { en: "Wear a mask", hi: "मास्क पहनाएं" },
  { en: "Wear headphones", hi: "हेडफ़ोन पहनाएं" },

  // Fun & Fantasy
  { en: "Turn into a zombie", hi: "ज़ोंबी में बदलें" },
  { en: "Turn into a vampire", hi: "वैम्पायर में बदलें" },
  { en: "Turn into a cyborg", hi: "साइबोर्ग में बदलें" },
  { en: "Turn into a fairy", hi: "परी में बदलें" },
  { en: "Turn into a statue", hi: "मूर्ति में बदलें" },
  { en: "Turn into a robot", hi: "रोबोट में बदलें" },
  { en: "Add angel wings", hi: "परी के पंख जोड़ें" },
  { en: "Add dragon wings", hi: "ड्रैगन के पंख जोड़ें" },
  { en: "Hold a magic wand", hi: "जादुई छड़ी पकड़ें" },
  { en: "Hold a sword", hi: "तलवार पकड़ें" },
  { en: "Ride a horse", hi: "घोड़े की सवारी करें" },
  { en: "Ride a dragon", hi: "ड्रैगन की सवारी करें" },
  { en: "Ride a motorcycle", hi: "मोटरसाइकिल चलाएं" },
  { en: "Float in air", hi: "हवा में तैरें" },
  { en: "Surrounded by butterflies", hi: "तितलियों से घिरा हुआ" },
  { en: "Surrounded by fireflies", hi: "जुगनू से घिरा हुआ" },
  { en: "With a cute puppy", hi: "प्यारे पिल्ले के साथ" },
  { en: "With a kitten", hi: "बिल्ली के बच्चे के साथ" },
  { en: "With a parrot", hi: "तोते के साथ" },
  { en: "With a lion", hi: "शेर के साथ" },
  
  // Hair & Face
  { en: "Blue hair color", hi: "नीले रंग के बाल" },
  { en: "Red hair color", hi: "लाल रंग के बाल" },
  { en: "Blonde hair", hi: "सुनहरे बाल" },
  { en: "Curly hair", hi: "घुंघराले बाल" },
  { en: "Straight hair", hi: "सीधे बाल" },
  { en: "Short haircut", hi: "छोटे बाल" },
  { en: "Long flowing hair", hi: "लंबे लहराते बाल" },
  { en: "Mohawk hairstyle", hi: "मोहाक हेयरस्टाइल" },
  { en: "Bald head", hi: "गंजा सिर" },
  { en: "Beard and mustache", hi: "दाढ़ी और मूंछ" },
  { en: "Clown makeup", hi: "जोकर मेकअप" },
  { en: "Tribal face paint", hi: "आदिवासी फेस पेंट" },
  { en: "Aging effect", hi: "उम्र बढ़ने का प्रभाव" },
  { en: "Younger effect", hi: "युवा दिखने का प्रभाव" },
  { en: "Big smile", hi: "बड़ी मुस्कान" }
];

export const PromptBar: React.FC<PromptBarProps> = ({ onSubmit, isLoading, language }) => {
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const t = {
    placeholderRef: { en: "Describe how to use this reference image...", hi: "इस संदर्भ छवि का उपयोग कैसे करें, वर्णन करें..." },
    placeholder: { en: "Describe how to edit (or add a reference image)...", hi: "संपादित कैसे करें वर्णन करें (या एक संदर्भ छवि जोड़ें)..." },
    generate: { en: "Generate", hi: "उत्पन्न करें" },
    addRef: { en: "Add reference image", hi: "संदर्भ छवि जोड़ें" }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert(language === 'en' ? "Please select an image file." : "कृपया एक छवि फ़ाइल चुनें।");
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
    <div className="fixed bottom-8 left-0 right-0 z-40 px-4 flex flex-col items-center justify-end gap-3 pointer-events-none">
      
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
            className="w-full overflow-x-auto flex gap-2 pb-2 [&::-webkit-scrollbar]:hidden px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(s[language])}
                className="shrink-0 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-medium text-slate-300 hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all shadow-lg cursor-pointer active:scale-95 whitespace-nowrap"
              >
                {s[language]}
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
              title={t.addRef[language]}
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
            placeholder={referenceImage ? t.placeholderRef[language] : t.placeholder[language]}
            className="w-full bg-transparent text-white placeholder-slate-400 border-none focus:ring-0 h-12 outline-none"
            disabled={isLoading}
          />
        </div>

        <Button 
          type="submit" 
          disabled={!prompt.trim() || isLoading} 
          isLoading={isLoading}
          className="shrink-0 bg-purple-600 hover:bg-purple-500 shadow-purple-500/30"
        >
          {t.generate[language]}
        </Button>
      </form>
    </div>
  );
};