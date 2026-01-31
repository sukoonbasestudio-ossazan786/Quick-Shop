
import { GoogleGenAI } from "@google/genai";

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Audio,
                mimeType: mimeType,
              },
            },
            {
              text: "Please transcribe the audio accurately into text. Provide only the transcription without any extra comments.",
            },
          ],
        },
      ],
    });

    return response.text || "Could not transcribe audio.";
  } catch (error) {
    console.error("Transcription error:", error);
    return "Error during transcription.";
  }
};
