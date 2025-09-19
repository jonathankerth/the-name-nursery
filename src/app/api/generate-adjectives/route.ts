import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
	const { usedAdjectives = [] } = await request.json();

	try {
		if (!process.env.OPENAI_API_KEY) {
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
			return NextResponse.json({
				adjectives: fallbackAdjectives,
				usedAdjectives: [...usedAdjectives, ...fallbackAdjectives],
			});
		}

		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const prompt = `Generate 9 unique personality adjectives for baby names. These should be positive personality traits that parents might want for their child.

${
	usedAdjectives.length > 0
		? `Do NOT include any of these previously used adjectives: ${usedAdjectives.join(
				", "
		  )}`
		: ""
}

Return ONLY a JSON array of exactly 9 different personality adjectives. Each adjective should be a single word.

Examples of good adjectives: "strong", "gentle", "creative", "brave", "wise", "joyful", "calm", "spirited", "kind", "curious", "bold", "sweet", "clever", "lively", "tender", "charming", "graceful", "adventurous", "compassionate", "intelligent"

Make each suggestion unique and varied. Focus on positive, aspirational traits. Return format: ["adjective1", "adjective2", "adjective3", "adjective4", "adjective5", "adjective6", "adjective7", "adjective8", "adjective9"]`;

		try {
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
				// Try to extract JSON array from the response
				const jsonMatch = content.match(/\[[\s\S]*\]/);
				if (jsonMatch) {
					adjectives = JSON.parse(jsonMatch[0]);
				} else {
					adjectives = JSON.parse(content);
				}

				// Ensure we have an array
				if (!Array.isArray(adjectives) || adjectives.length !== 9) {
					throw new Error("Invalid response format");
				}
			} catch (parseError) {
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
			return NextResponse.json({
				adjectives,
				usedAdjectives: [...usedAdjectives, ...adjectives],
			});
		} catch (openaiError) {
			throw openaiError; // Re-throw to be caught by outer catch
		}
	} catch {
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

		return NextResponse.json({
			adjectives: fallbackAdjectives,
			usedAdjectives: [...usedAdjectives, ...fallbackAdjectives],
		});
	}
}
