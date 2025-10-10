import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blogService";

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const { slug } = params;
	if (!slug) {
		return NextResponse.json({ error: "Missing slug" }, { status: 400 });
	}
	try {
		const post = await getBlogPostBySlug(slug);
		if (!post) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}
		return NextResponse.json(post);
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch article" },
			{ status: 500 }
		);
	}
}
