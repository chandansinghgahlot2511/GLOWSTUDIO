import { GoogleGenAI } from "@google/genai";
import { ImageFile } from "../types";

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model constant for Nano Banana (Gemini 2.5 Flash Image)
const MODEL_NAME = 'gemini-2.5-flash-image';

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
      model: MODEL_NAME,
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