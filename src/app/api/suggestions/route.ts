import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { brand, category } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        // Fallback if no key provided
        if (!apiKey) {
            await new Promise(r => setTimeout(r, 1500)); // Simulate delay
            return NextResponse.json({
                suggestions: [
                    {
                        title: "Leverage Short-Form Video",
                        description: `Create 15-second localized reels for ${brand} targeting the ${category} audience to boost organic reach.`
                    },
                    {
                        title: "Community Engagement",
                        description: "Host an AMA (Ask Me Anything) on Reddit communities to address product feedback directly and build trust."
                    },
                    {
                        title: "SEO Optimization",
                        description: `Update product descriptions with high-volume keywords related to '${category}' to capture search intent.`
                    }
                ]
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Give 3 specific, actionable marketing trend suggestions for a ${category} brand named "${brand}" to increase digital visibility. 
    Format the response as a valid JSON array of objects with 'title' and 'description' keys. Do not include markdown formatting.
    Example: [{"title": "Short Video", "description": "Make reels."}]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Simple cleanup to ensure JSON parsing works
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let suggestions;
        try {
            suggestions = JSON.parse(cleanedText);
        } catch (e) {
            // Fallback if AI returns malformed JSON
            return NextResponse.json({
                suggestions: [
                    { title: "AI Generation Error", description: "Could not parse AI response. Try again." }
                ]
            });
        }

        return NextResponse.json({ suggestions });

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({
            suggestions: [
                { title: "Service Unavailable", description: "AI service is currently offline. Please check your API key." }
            ]
        });
    }
}
