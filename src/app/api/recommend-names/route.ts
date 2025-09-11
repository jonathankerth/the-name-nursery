import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Simple test endpoint
export async function GET() {
	return NextResponse.json({
		message: "API is working",
		hasApiKey: !!process.env.OPENAI_API_KEY,
		model: process.env.OPENAI_MODEL,
	});
}

export async function POST(request: NextRequest) {
	try {
		const requestData = await request.json();
		const {
			gender,
			letter,
			personality,
			inspiration,
			origin,
			existingNames = [],
		} = requestData;

		if (!gender || !letter) {
			return NextResponse.json(
				{ error: "Gender and letter are required" },
				{ status: 400 }
			);
		}

		// Construct a cost-effective prompt for name recommendations
		const prompt = `Generate exactly ${
			existingNames.length > 0 ? "15" : "10"
		} ${
			gender === "baby" ? "unisex" : gender
		} names that start with the letter "${letter}". 

Requirements:
- Names should be culturally diverse and meaningful
- Include both traditional and contemporary options
- ${
			gender === "baby"
				? "All names should work for any gender"
				: `All names should be appropriate for ${gender}s`
		}
${
	personality
		? `- Focus on names that feel ${personality} and sophisticated`
		: ""
}
${
	inspiration
		? `- Draw inspiration from ${inspiration}-related themes and concepts`
		: ""
}
${
	origin
		? `- Emphasize names with ${origin} linguistic and cultural origins`
		: ""
}
${
	existingNames.length > 0
		? `- CRITICAL: DO NOT include ANY of these existing names under any circumstances: ${existingNames.join(
				", "
		  )}\n- If you accidentally generate any of these names, you must replace them with completely different names`
		: ""
}
- Provide only the names, one per line
- No explanations, descriptions, or additional text
- Each name must start with the letter ${letter}

Names:`;

		const completion = await openai.chat.completions.create({
			model: process.env.OPENAI_MODEL || "gpt-4o-mini",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			max_tokens: 150,
			temperature: 0.8,
		});

		const response = completion.choices[0]?.message?.content?.trim();

		if (!response) {
			throw new Error("No response from OpenAI");
		}

		// Parse the response into an array of names
		const names = response
			.split("\n")
			.map((name) => name.trim())
			.filter((name) => name.length > 0)
			.map((name) => name.replace(/^\d+\.\s*/, "")) // Remove numbering if present
			.map((name) => name.replace(/^-\s*/, "")) // Remove bullet points if present
			.slice(0, existingNames.length > 0 ? 15 : 10); // Get more names when avoiding duplicates

		return NextResponse.json({
			names,
			gender,
			letter,
		});
	} catch {
		return NextResponse.json(
			{ error: "Failed to generate names. Please try again." },
			{ status: 500 }
		);
	}
}
