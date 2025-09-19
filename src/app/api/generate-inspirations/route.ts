import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
	const { usedInspirations = [] } = await request.json();

	try {
		// Check if OpenAI API key is available
		if (!process.env.OPENAI_API_KEY) {
			const fallbackInspirations = [
				"nature",
				"music",
				"art",
				"dance",
				"literature",
				"science",
				"sports",
				"animals",
				"flowers",
				"colors",
				"stars",
				"oceans",
			];
			return NextResponse.json({
				inspirations: fallbackInspirations,
				usedInspirations: [...usedInspirations, ...fallbackInspirations],
			});
		}

		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const prompt = `Generate 12 unique inspiration themes for baby names. These should be concrete themes that commonly inspire baby name choices.

${
	usedInspirations.length > 0
		? `Do NOT include any of these previously used themes: ${usedInspirations.join(
				", "
		  )}`
		: ""
}

Return ONLY a JSON array of exactly 12 different inspiration themes. Each theme should be a single word or short phrase (1-2 words max) that represents a category commonly used for baby name inspiration.

Focus on themes that are visual, cultural, natural, or aspirational and work well for naming babies. Mix different types of themes for maximum variety: some from nature, some from culture, some from qualities, some from places, etc.

Examples of good themes: "nature", "flowers", "animals", "colors", "gems", "trees", "birds", "oceans", "mountains", "stars", "music", "art", "dance", "books", "sports", "travel", "virtues", "qualities", "seasons", "weather", "food", "spices", "mythology", "history", "countries", "cities", "rivers", "lakes", "forests", "deserts", "islands", "continents", "planets", "constellations", "minerals", "metals", "fabrics", "instruments", "painting", "sculpture", "poetry", "theater", "film", "photography"

Avoid abstract concepts like "elements", "innovation", "dreams", "legacy", "technology", "fantasy". Focus on tangible, name-inspiring categories and ensure high variety across different theme types. Return format: ["theme1", "theme2", "theme3", "theme4", "theme5", "theme6", "theme7", "theme8", "theme9", "theme10", "theme11", "theme12"]`;

		const completion = await openai.chat.completions.create({
			model: process.env.OPENAI_MODEL || "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that generates creative inspiration categories for baby names. Always respond with valid JSON arrays only.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			max_tokens: 200,
			temperature: 1.0,
		});

		const content = completion.choices[0]?.message?.content;
		if (!content) {
			throw new Error("No response from OpenAI");
		}

		let inspirations;
		try {
			// Try to extract JSON array from the response
			const jsonMatch = content.match(/\[[\s\S]*\]/);
			if (jsonMatch) {
				inspirations = JSON.parse(jsonMatch[0]);
			} else {
				inspirations = JSON.parse(content);
			}

			// Ensure we have an array of strings
			if (!Array.isArray(inspirations) || inspirations.length !== 12) {
				throw new Error("Invalid response format");
			}
		} catch {
			// Fallback if parsing fails
			inspirations = [
				"nature",
				"music",
				"art",
				"dance",
				"literature",
				"science",
				"sports",
				"animals",
				"flowers",
				"colors",
				"stars",
				"oceans",
			];
		}

		return NextResponse.json({
			inspirations,
			usedInspirations: [...usedInspirations, ...inspirations],
		});
	} catch {
		// Fallback inspirations
		const fallbackInspirations = [
			"nature",
			"music",
			"art",
			"dance",
			"literature",
			"science",
			"sports",
			"animals",
			"flowers",
			"colors",
			"stars",
			"oceans",
		];

		return NextResponse.json({
			inspirations: fallbackInspirations,
			usedInspirations: [...usedInspirations, ...fallbackInspirations],
		});
	}
}
