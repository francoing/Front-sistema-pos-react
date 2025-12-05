import { GoogleGenAI, Type } from "@google/genai";
import { CartItem, GeminiAnalysis } from "../types";

// Initialize Gemini
// NOTE: In a real production app, ensure your key is secure.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeCartAndGenerateReceipt = async (items: CartItem[], customerName: string = "Cliente"): Promise<GeminiAnalysis> => {
  if (!items || items.length === 0) {
    return {
      upsellSuggestion: "Agrega productos al carrito para ver sugerencias.",
      thankYouNote: "¡Gracias por su visita!"
    };
  }

  const itemsList = items.map(i => `${i.quantity}x ${i.name}`).join(", ");

  const prompt = `
    Actúa como un asistente amable de un punto de venta (POS) para una cafetería moderna.
    El cliente ${customerName} ha comprado: ${itemsList}.
    
    1. Sugiere UN solo producto complementario brevemente (Upsell) que combine bien con lo que compró (ej: si compró café, sugiere un postre).
    2. Redacta una nota de agradecimiento corta, personalizada y cálida (máximo 15 palabras) para el ticket de compra.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            upsellSuggestion: { type: Type.STRING },
            thankYouNote: { type: Type.STRING },
          },
          required: ["upsellSuggestion", "thankYouNote"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiAnalysis;
    }
    
    throw new Error("No response text");
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return {
      upsellSuggestion: "¿Te gustaría agregar una galleta?",
      thankYouNote: `¡Gracias por tu compra, ${customerName}!`
    };
  }
};
