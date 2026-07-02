import { GoogleGenAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/env.js'; // Ensure you add GEMINI_API_KEY to your env config

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateSubscriptionInsights = async (subscriptions, userName) => {
    try {
        if (!subscriptions || subscriptions.length === 0) {
            return "You don't have any active subscriptions tracked yet. Add some to get personalized AI optimization tips!";
        }

        // Format the subscription data cleanly so the AI can easily parse it
        const subListText = subscriptions.map(sub => 
            `- ${sub.name}: ${sub.price} ${sub.currency} (${sub.frequency}), Category: ${sub.category}`
        ).join('\n');

        // Craft a precise prompt ensuring the response stays brief and professional
        const prompt = `
        You are a smart financial advisor built into a subscription tracking app. 
        Analyze the following subscription list for a user named ${userName} and provide exactly one actionable, sharp, 2-line optimization or savings tip.
        Look for overlapping categories, high costs, or frequency optimizations. Keep it conversational but concise. Do not use markdown bolding or bullet points.

        User's Subscriptions:
        ${subListText}
        `;

        // Call the Gemini 1.5 Flash model (perfect for fast, text-based tasks)
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error('Error generating AI insights:', error);
        return "Unable to generate financial insights at this moment. Please try again later.";
    }
};