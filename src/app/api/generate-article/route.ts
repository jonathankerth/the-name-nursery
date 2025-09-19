import { NextRequest, NextResponse } from "next/server";

interface ArticleTopic {
	title: string;
	category: string;
	description: string;
}

// Sample topics for AI article generation
const articleTopics: ArticleTopic[] = [
	{
		title: "The Hidden Psychology Behind Name Preferences",
		category: "Psychology",
		description:
			"Discover what your name choices reveal about your personality and values",
	},
	{
		title: "Rising Baby Name Trends for {currentYear}",
		category: "Trends",
		description:
			"Explore the hottest naming trends and predictions for this year",
	},
	{
		title: "Cultural Name Ceremonies Around the World",
		category: "Culture",
		description:
			"Beautiful traditions from different cultures for welcoming babies",
	},
	{
		title: "Nature-Inspired Names That Connect Your Child to Earth",
		category: "Nature",
		description:
			"From celestial bodies to botanical beauties - nature names that inspire",
	},
	{
		title: "The Science of Name Sound and Personality",
		category: "Research",
		description:
			"How the sound of a name can influence personality development",
	},
	{
		title: "Vintage Names Making Their Modern Comeback",
		category: "Trends",
		description: "Classic names that are trending again among new parents",
	},
	{
		title: "Choosing Names Across Different Cultures in Mixed Families",
		category: "Culture",
		description: "Navigating cultural diversity when choosing your baby's name",
	},
	{
		title: "The Impact of Social Media on Baby Naming Decisions",
		category: "Modern",
		description:
			"How digital age influences are changing the way we choose names",
	},
];

function generateArticleContent(topic: ArticleTopic) {
	const currentYear = new Date().getFullYear();
	const title = topic.title.replace("{currentYear}", currentYear.toString());

	// Simulate AI-generated content based on the topic
	const content = `
# ${title}

*Published on ${new Date().toLocaleDateString()} | ${
		Math.floor(Math.random() * 3) + 5
	} min read*

Choosing the perfect name for your baby is one of the most meaningful decisions you'll make as a parent. ${
		topic.description
	}

## Introduction

Every parent wants to give their child a name that carries significance, beauty, and the promise of a bright future. In this comprehensive guide, we'll explore the fascinating world of baby naming and help you discover insights that will guide your decision.

## Key Insights

### Understanding the Psychology
Names carry deep psychological weight and can influence how others perceive us and how we see ourselves. Research shows that:

- Names can affect personality development in subtle but meaningful ways
- Cultural associations with names impact social interactions
- The sound and rhythm of names influence first impressions

### Cultural Considerations
Different cultures have unique approaches to naming:

- Some cultures prioritize family heritage and ancestral connections
- Others focus on meaning and aspirational qualities
- Modern families often blend traditions from multiple backgrounds

### Modern Trends
Today's naming landscape is influenced by:

- Social media and pop culture references
- Desire for uniqueness while maintaining pronunciation ease
- Environmental and nature-conscious choices
- Gender-neutral options gaining popularity

## Practical Tips

1. **Consider the full name**: Think about how the first, middle, and last names work together
2. **Test pronunciation**: Make sure the name is easy to pronounce and spell
3. **Think long-term**: Consider how the name will suit your child throughout their life
4. **Cultural sensitivity**: Research the cultural origins and meanings of names you're considering
5. **Family input**: Balance family traditions with your personal preferences

## Making Your Decision

The perfect name for your child is one that:
- Resonates with your family's values and heritage
- Feels right when you say it aloud
- Has a meaning that speaks to your hopes for your child
- Works well in both professional and personal contexts

## Conclusion

Remember, there's no universally "perfect" name – only the perfect name for your family. Trust your instincts, do your research, and choose a name that brings you joy every time you say it.

The journey of naming your child is deeply personal and incredibly meaningful. Take your time, explore your options, and celebrate this special part of welcoming your little one into the world.

---

*Ready to start exploring names? Use our interactive name generator to discover personalized recommendations based on your preferences.*
  `.trim();

	return {
		id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		title,
		content,
		excerpt: topic.description,
		category: topic.category,
		date: new Date().toISOString().split("T")[0],
		readTime: `${Math.floor(Math.random() * 3) + 5} min read`,
		slug: title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, ""),
		isAI: true,
	};
}

export async function GET(request: NextRequest) {
	try {
		const url = new URL(request.url);
		const action = url.searchParams.get("action");

		if (action === "generate") {
			// Generate a new article
			const randomTopic =
				articleTopics[Math.floor(Math.random() * articleTopics.length)];
			const article = generateArticleContent(randomTopic);

			return NextResponse.json({
				success: true,
				article,
				message: "New article generated successfully!",
			});
		}

		if (action === "list") {
			// Return list of available topics for preview
			return NextResponse.json({
				success: true,
				topics: articleTopics.map((topic) => ({
					...topic,
					title: topic.title.replace(
						"{currentYear}",
						new Date().getFullYear().toString()
					),
				})),
			});
		}

		return NextResponse.json({
			success: false,
			error: "Invalid action. Use ?action=generate or ?action=list",
		});
	} catch {
		return NextResponse.json(
			{ success: false, error: "Failed to generate article" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { topic, customPrompt } = body;

		// Allow custom topic generation
		if (customPrompt) {
			const customTopic = {
				title: topic || "Custom Baby Naming Guide",
				category: "Custom",
				description: customPrompt,
			};

			const article = generateArticleContent(customTopic);

			return NextResponse.json({
				success: true,
				article,
				message: "Custom article generated successfully!",
			});
		}

		return NextResponse.json({
			success: false,
			error: "Missing required fields",
		});
	} catch {
		return NextResponse.json(
			{ success: false, error: "Failed to process request" },
			{ status: 500 }
		);
	}
}
