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
			exploreMode = false,
		} = requestData;

		if (!gender && !exploreMode) {
			return NextResponse.json(
				{ error: "Gender is required" },
				{ status: 400 }
			);
		}

		// Different prompt for explore mode vs regular mode
		let prompt: string;
		let targetCount: number;

		if (exploreMode) {
			// Explore mode: Generate popular names for swiping
			targetCount = 25;
			const genderText = gender === "baby" ? "unisex/gender-neutral" : gender;

			prompt = `Generate exactly ${targetCount} of the most popular and trending ${genderText} baby names.

Requirements:
- Focus on currently popular and trending names
- Include a mix of classic and modern names
- ${
				gender === "baby"
					? "All names should work perfectly for any gender"
					: `All names should be appropriate for ${gender}s`
			}
${
	existingNames.length > 0
		? `- CRITICAL: DO NOT include ANY of these existing names under any circumstances: ${existingNames.join(
				", "
		  )}\n- If you accidentally generate any of these names, you must replace them with completely different popular names`
		: ""
}
- Provide only the names, one per line
- No explanations, descriptions, or additional text
- Each name should be a single word (no hyphens or spaces)
- Focus on names that are currently popular in baby name trends

Popular ${genderText} names:`;
		} else {
			// Regular mode: Generate names based on criteria
			targetCount = existingNames.length > 0 ? 15 : 10;

			prompt = `Generate exactly ${targetCount} ${
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
		}
		const completion = await openai.chat.completions.create({
			model: process.env.OPENAI_MODEL || "gpt-4o-mini",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			max_tokens: exploreMode ? 200 : 150,
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
			.slice(0, targetCount); // Get the target number of names

		return NextResponse.json({
			names,
			gender,
			letter: exploreMode ? "" : letter,
			exploreMode,
		});
	} catch {
		return NextResponse.json(
			{ error: "Failed to generate names. Please try again." },
			{ status: 500 }
		);
	}
}
