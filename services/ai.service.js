import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/env.js';

const ai = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

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

        if (!ai) {
            return 'AI insights are unavailable because GEMINI_API_KEY is not configured.';
        }

        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);
        const text = await response.response.text();

        return text.trim();
    } catch (error) {
        console.error('Error generating AI insights:', error);
        return "Unable to generate financial insights at this moment. Please try again later.";
    }
};