import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export interface BioFormData {
  name: string;
  profession: string;
  audience: string;
  valueProp: string;
  keywords: string;
  ctaType: string;
  website: string;
}

export async function generateBios(data: BioFormData): Promise<string[]> {
  const prompt = `
    You are an expert social media manager specializing in Instagram growth.
    Create 5 unique, highly optimized Instagram bios based on the following details:

    Name/Brand: ${data.name}
    Profession/Niche: ${data.profession}
    Target Audience: ${data.audience}
    Value Proposition: ${data.valueProp}
    Keywords: ${data.keywords}
    Call to Action: ${data.ctaType}
    Website: ${data.website}

    Format each bio EXACTLY as follows (keep it under 150 characters if possible, use emojis effectively):
    ${data.name} | ${data.profession}
    [Concise Value Proposition] (Include only if provided or relevant)
    [Keywords/Interests]
    ⬇️ [CTA Phrase]
    ${data.website ? data.website : "[Do not include website line if not provided]"}

    If the website is empty, do not include the website line in the output.
    If the value proposition is empty, generate a short, catchy one based on the profession and keywords.

    Return the response as a JSON array of strings, where each string is a full bio. 
    Do not include markdown code blocks (like \`\`\`json). Just the raw JSON array.
  `;

  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let text = response.text;
    if (!text) return [];
    
    // Cleanup markdown if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parse JSON
    const bios = JSON.parse(text);
    return Array.isArray(bios) ? bios : [];
  } catch (error) {
    console.error("Error generating bios:", error);
    throw error;
  }
}
