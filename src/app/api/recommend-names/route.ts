import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Simple test endpoint
export async function GET() {
	console.log("GET endpoint called - API is working!");
	return NextResponse.json({
		message: "API is working",
		hasApiKey: !!process.env.OPENAI_API_KEY,
		model: process.env.OPENAI_MODEL,
	});
}

export async function POST(request: NextRequest) {
	console.log("=== API ROUTE CALLED ===");

	try {
		const requestData = await request.json();
		const { gender, letter } = requestData;

		console.log("Received request:", { gender, letter });

		if (!gender || !letter) {
			return NextResponse.json(
				{ error: "Gender and letter are required" },
				{ status: 400 }
			);
		}

		// Construct a cost-effective prompt for name recommendations
		const prompt = `Generate exactly 10 ${
			gender === "baby" ? "unisex" : gender
		} names that start with the letter "${letter}". 

Requirements:
- Names should be modern, popular, and culturally diverse
- Include a mix of traditional and contemporary names
- ${
			gender === "baby"
				? "All names should work for any gender"
				: `All names should be appropriate for ${gender}s`
		}
- Provide only the names, one per line
- No explanations, descriptions, or additional text
- Each name must start with the letter ${letter}

Names:`;

		console.log("Sending prompt to OpenAI:", prompt);

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

		console.log("OpenAI call successful!");

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
			.slice(0, 10); // Ensure we only return 10 names

		console.log("Final names being returned:", names);

		return NextResponse.json({
			names,
			gender,
			letter,
		});
	} catch (error) {
		console.error("Error generating names:", error);

		return NextResponse.json(
			{ error: "Failed to generate names. Please try again." },
			{ status: 500 }
		);
	}
}
