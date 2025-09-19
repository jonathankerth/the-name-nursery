import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, subject, message } = body;

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 }
			);
		}

		// Return success (client will handle Firestore saving)
		return NextResponse.json(
			{
				success: true,
				message: "Your message has been received successfully!",
			},
			{ status: 200 }
		);
	} catch {
		return NextResponse.json(
			{
				error: "Failed to process message. Please try again later.",
				details: "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// Handle unsupported methods
export async function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
