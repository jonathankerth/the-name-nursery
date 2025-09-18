import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
	console.log("Generate adjectives API called");
	try {
		const { gender, letter } = await request.json();
		console.log("Request data:", { gender, letter });

		// Check if OpenAI API key is available
		if (!process.env.OPENAI_API_KEY) {
			console.log("No OpenAI API key found, using fallback adjectives");
			const fallbackAdjectives = [
				"strong",
				"gentle",
				"creative",
				"brave",
				"wise",
				"joyful",
				"calm",
				"spirited",
				"kind",
			];
			return NextResponse.json({ adjectives: fallbackAdjectives });
		}

		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const prompt = `Generate 9 personality adjectives that parents would want for their ${gender} baby whose name starts with "${letter}". Return only a JSON array of 9 single-word adjectives that are positive, diverse, and suitable for baby names inspiration. Examples: ["strong", "gentle", "creative", "brave", "wise", "joyful", "calm", "spirited", "kind"]`;

		const completion = await openai.chat.completions.create({
			model: process.env.OPENAI_MODEL || "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that generates personality adjectives for baby names. Always respond with valid JSON.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			max_tokens: 150,
			temperature: 0.8,
		});

		const content = completion.choices[0]?.message?.content;
		if (!content) {
			throw new Error("No response from OpenAI");
		}

		let adjectives;
		try {
			adjectives = JSON.parse(content);
		} catch {
			// Fallback if parsing fails
			adjectives = [
				"strong",
				"gentle",
				"creative",
				"brave",
				"wise",
				"joyful",
				"calm",
				"spirited",
				"kind",
			];
		}

		return NextResponse.json({ adjectives });
	} catch (error) {
		console.error("Error generating adjectives:", error);

		// Fallback adjectives
		const fallbackAdjectives = [
			"strong",
			"gentle",
			"creative",
			"brave",
			"wise",
			"joyful",
			"calm",
			"spirited",
			"kind",
		];
		console.log("Returning fallback adjectives:", fallbackAdjectives);

		return NextResponse.json({ adjectives: fallbackAdjectives });
	}
}
