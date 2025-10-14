import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blogService";


function isPromise<T>(value: unknown): value is Promise<T> {
	return (
		typeof value === "object" &&
		value !== null &&
		typeof (value as Promise<T>).then === "function"
	);
}

export async function GET(
	req: NextRequest,
	context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
	let slug: string | undefined;
	if ("params" in context) {
		const params = context.params;
		if (isPromise<{ slug: string }>(params)) {
			const resolved = await params;
			slug = resolved.slug;
		} else {
			slug = params.slug;
		}
	}
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
