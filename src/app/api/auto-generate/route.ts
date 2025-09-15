import { NextRequest, NextResponse } from "next/server";

// Simple in-memory storage for demo purposes
// In a real app, you'd use a database
let lastGeneratedDate: string | null = null;
let articleCount = 0;

const GENERATION_INTERVAL_DAYS = 3;

function shouldGenerateNewArticle(): boolean {
	if (!lastGeneratedDate) return true;

	const lastDate = new Date(lastGeneratedDate);
	const now = new Date();
	const daysDifference = Math.floor(
		(now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
	);

	return daysDifference >= GENERATION_INTERVAL_DAYS;
}

export async function GET(request: NextRequest) {
	try {
		const url = new URL(request.url);
		const action = url.searchParams.get("action");

		if (action === "check") {
			// Check if it's time to generate a new article
			const shouldGenerate = shouldGenerateNewArticle();

			return NextResponse.json({
				success: true,
				shouldGenerate,
				lastGeneratedDate,
				articleCount,
				daysSinceLastGeneration: lastGeneratedDate
					? Math.floor(
							(new Date().getTime() - new Date(lastGeneratedDate).getTime()) /
								(1000 * 60 * 60 * 24)
					  )
					: null,
				nextGenerationDate: lastGeneratedDate
					? new Date(
							new Date(lastGeneratedDate).getTime() +
								GENERATION_INTERVAL_DAYS * 24 * 60 * 60 * 1000
					  ).toISOString()
					: null,
			});
		}

		if (action === "generate") {
			// Generate a new article if it's time
			if (!shouldGenerateNewArticle()) {
				return NextResponse.json({
					success: false,
					message: `Too early to generate new article. Last generated: ${lastGeneratedDate}`,
					nextGenerationDate: new Date(
						new Date(lastGeneratedDate!).getTime() +
							GENERATION_INTERVAL_DAYS * 24 * 60 * 60 * 1000
					).toISOString(),
				});
			}

			// Call the generate-article API
			const generateResponse = await fetch(
				`${request.nextUrl.origin}/api/generate-article?action=generate`
			);
			const generateData = await generateResponse.json();

			if (generateData.success) {
				lastGeneratedDate = new Date().toISOString();
				articleCount++;

				return NextResponse.json({
					success: true,
					article: generateData.article,
					message: "New article generated automatically!",
					articleCount,
					lastGeneratedDate,
				});
			} else {
				return NextResponse.json({
					success: false,
					error: "Failed to generate article",
				});
			}
		}

		if (action === "reset") {
			// Reset the generation timer (for testing purposes)
			lastGeneratedDate = null;
			articleCount = 0;

			return NextResponse.json({
				success: true,
				message: "Generation timer reset",
			});
		}

		return NextResponse.json({
			success: false,
			error:
				"Invalid action. Use ?action=check, ?action=generate, or ?action=reset",
		});
	} catch (error) {
		console.error("Error in auto-generate API:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to process auto-generation request" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { forceGenerate } = body;

		if (forceGenerate) {
			// Generate regardless of timing
			const generateResponse = await fetch(
				`${request.nextUrl.origin}/api/generate-article?action=generate`
			);
			const generateData = await generateResponse.json();

			if (generateData.success) {
				lastGeneratedDate = new Date().toISOString();
				articleCount++;

				return NextResponse.json({
					success: true,
					article: generateData.article,
					message: "New article generated (forced)!",
					articleCount,
					lastGeneratedDate,
				});
			}
		}

		return NextResponse.json({
			success: false,
			error: "Invalid request",
		});
	} catch (error) {
		console.error("Error in auto-generate POST:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to process request" },
			{ status: 500 }
		);
	}
}
