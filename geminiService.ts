
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateServiceDescription(title: string, category: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I am an 11-year-old starting a business for "${title}" in the "${category}" category. 
      Please write a friendly, professional, and short description (max 3 sentences) that I can use on my website to attract customers. 
      Make it sound like it's coming from a smart and hardworking student.`,
    });
    return response.text || "I provide high-quality service with a smile!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Friendly and reliable service for the neighborhood!";
  }
}

export async function getBusinessAdvice(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I am an 11-year-old entrepreneur. I have a question about running my small business: "${query}". 
      Please give me 3 simple, encouraging tips.`,
    });
    return response.text || "Keep working hard and always be kind to your customers!";
  } catch (error) {
    return "Stay organized and keep learning!";
  }
}

export async function analyzeReviews(reviews: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I am an 11-year-old business owner. Here are my latest customer reviews:
      ${reviews.join("\n- ")}
      
      Please analyze these and tell me:
      1. What is the overall "Happiness Score" (out of 100)?
      2. One thing I'm doing great.
      3. One thing I could do even better next time.
      Keep it encouraging and simple for an 11-year-old.`,
    });
    return response.text || "Your customers seem happy! Keep up the great work.";
  } catch (error) {
    return "You're doing a great job! Keep focusing on your customers.";
  }
}
