import { GoogleGenAI } from "@google/genai";
import { ImageFile } from "../types";

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model constant for Nano Banana (Gemini 2.5 Flash Image)
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';
// Model constant for Text tasks
const TEXT_MODEL_NAME = 'gemini-2.5-flash';

export const editImageWithGemini = async (
  image: ImageFile,
  prompt: string,
  referenceImage?: ImageFile | null
): Promise<string> => {
  try {
    const parts: any[] = [
      {
        inlineData: {
          data: image.base64Data,
          mimeType: image.mimeType,
        },
      },
    ];

    // Add reference image if provided
    if (referenceImage) {
      parts.push({
        inlineData: {
          data: referenceImage.base64Data,
          mimeType: referenceImage.mimeType,
        },
      });
    }

    parts.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: parts,
      },
      // Note: responseMimeType and responseSchema are not supported for nano banana
    });

    // Iterate through parts to find the image part
    const responseParts = response.candidates?.[0]?.content?.parts;
    
    if (!responseParts) {
      throw new Error("No content generated");
    }

    for (const part of responseParts) {
      if (part.inlineData && part.inlineData.data) {
        // Construct a usable data URL
        const base64Str = part.inlineData.data;
        // The API typically returns raw base64. We need to prepend the mime type for the browser.
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Str}`;
      }
    }

    // Fallback if no image part found but maybe text (shouldn't happen for image edit request typically, unless refused)
    const textPart = responseParts.find(p => p.text);
    if (textPart) {
      throw new Error(`Model returned text instead of image: ${textPart.text}`);
    }

    throw new Error("Model response did not contain an image.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const enhancePrompt = async (prompt: string): Promise<string> => {
  try {
    const systemInstruction = `You are a world-class AI visual prompt engineer for an advanced photo editing tool. 
Your mission is to upgrade simple, flat user requests into vivid, highly descriptive image generation prompts that produce stunning visual results.

**Core Instructions:**
1.  **Identify the Subject:** Specify what is being changed or added (e.g., "sunglasses" -> "chic aviator sunglasses with gold frames").
2.  **Inject Style & Atmosphere:** Add keywords for lighting (e.g., "cinematic", "golden hour"), texture (e.g., "detailed fabric", "4k"), and art style (e.g., "photorealistic", "cyberpunk", "vintage film").
3.  **Preserve Context:** If the user mentions a specific action (e.g. "riding a horse"), ensure it remains the central focus.
4.  **Output Language:** The result must be in English.

**Training Examples (Few-Shot):**

User: "make it look cool"
AI: "Cyberpunk aesthetic, neon blue and pink lighting, futuristic city background, high contrast, cool color temperature, cinematic depth"

User: "cat"
AI: "A fluffy maine coon cat, soft studio lighting, intricate fur detail, 8k resolution, adorable expression, portrait photography style"

User: "pencil sketch"
AI: "Charcoal and pencil sketch style, rough texture on paper, artistic shading, high contrast, monochrome, hand-drawn masterpiece"

User: "sunset"
AI: "Breathtaking sunset background, vibrant orange and purple sky, silhouette details, golden hour illumination, reflection on water, photorealistic"

User: "scary"
AI: "Horror movie atmosphere, dark foggy background, eerie green lighting, mysterious shadows, dramatic tension, detailed texture"

User: "y2k"
AI: "Y2K aesthetic, glossy textures, hot pink and chrome color palette, butterfly motifs, fisheye lens effect, retro-futuristic vibe"

**Constraint:** Output ONLY the enhanced prompt string. Do not include labels like "AI:" or "Output:". Keep it concise (max 50 words).`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.75, // Slightly higher creative freedom for "enhancement"
      }
    });

    const enhancedText = response.text;
    return enhancedText ? enhancedText.trim() : prompt;
  } catch (error) {
    console.error("Prompt enhancement failed:", error);
    return prompt; // Fallback to original prompt on error
  }
};
