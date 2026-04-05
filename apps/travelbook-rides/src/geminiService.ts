import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getChatResponse(history: ChatMessage[], prompt: string) {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: "user", parts: [{ text: prompt }] }
    ],
    config: {
      systemInstruction: "You are a helpful assistant for RideConnect providers. You help them manage their vehicles, understand ride requests, and navigate the platform. Be professional and supportive.",
    }
  });

  const result = await model;
  return result.text || "I'm sorry, I couldn't process that.";
}

export async function analyzeVehiclePhoto(base64Image: string) {
  const model = ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          { text: "Analyze this vehicle photo. Identify the vehicle type (Car, Van, Bus, Motorcycle), the model if possible, and estimate the passenger capacity. Also check if the vehicle looks well-maintained and suitable for commercial transportation." },
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "Vehicle type (Car, Van, Bus, Motorcycle)" },
          model: { type: Type.STRING, description: "Vehicle model" },
          capacity: { type: Type.NUMBER, description: "Estimated passenger capacity" },
          isSuitable: { type: Type.BOOLEAN, description: "Whether the vehicle is suitable for transportation" },
          notes: { type: Type.STRING, description: "Additional notes or observations" }
        },
        required: ["type", "model", "capacity", "isSuitable"]
      }
    }
  });

  const result = await model;
  try {
    return JSON.parse(result.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
}
