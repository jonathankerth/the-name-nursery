// Fetch a single blog post by slug
export async function getBlogPostBySlug(
	slug: string
): Promise<BlogPost | null> {
	const posts = await getBlogPosts();
	return posts.find((post) => post.slug === slug) || null;
}
import {
	collection,
	getDocs,
	addDoc,
	query,
	orderBy,
	limit,
	Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface BlogPost {
	id: string;
	title: string;
	excerpt: string;
	content: string;
	date: string;
	readTime: string;
	category: string;
	slug: string;
	isAI: boolean;
	createdAt: Timestamp;
}

const BLOG_COLLECTION = "blogPosts";

// Initial blog posts to seed the database
const initialBlogPosts = [
	{
		title:
			"The Psychology Behind Baby Name Selection: What Your Choice Says About You",
		excerpt:
			"Discover the fascinating psychological factors that influence how parents choose baby names, from cultural identity to personal aspirations.",
		content: `# The Psychology Behind Baby Name Selection

*Published on ${new Date().toLocaleDateString()} | 6 min read*

Choosing a baby name is one of the most meaningful decisions expecting parents make. But have you ever wondered what your naming preferences reveal about your personality, values, and hopes for your child?

## The Power of First Impressions

Research shows that names carry significant psychological weight. Within seconds of hearing a name, we form impressions about someone's personality, background, and even potential success. As parents, we intuitively understand this power and want to give our children names that will serve them well throughout their lives.

## Cultural Identity and Heritage

Many parents gravitate toward names that reflect their cultural heritage. This choice often stems from a desire to:
- Maintain family traditions
- Honor ancestors and relatives
- Preserve cultural identity in a globalized world
- Create a sense of belonging and roots

## Personality Aspirations

The names we choose often reflect the qualities we hope to see in our children:
- **Strong names** (like Alexander or Victoria) for parents who value leadership
- **Nature names** (like River or Sage) for those who prioritize environmental connection
- **Creative names** (like Aria or Phoenix) for artistic families
- **Classic names** (like Elizabeth or William) for those who value tradition

## Modern Naming Trends

Today's parents are influenced by unique factors:
- Social media and celebrity culture
- Desire for uniqueness while maintaining pronunciation ease
- Gender-neutral options reflecting evolving social values
- Global connectivity exposing us to names from diverse cultures

## The Unconscious Influences

Your naming choices might also reflect:
- Your own childhood experiences with your name
- Names of people you admire or want to avoid
- Sound preferences and family surname compatibility
- Professional considerations for your child's future

## Making the Right Choice

Remember, there's no "perfect" name—only the perfect name for your family. Trust your instincts, consider your values, and choose a name that brings you joy every time you say it.

The name you choose will be one of the first gifts you give your child. Make it meaningful, make it yours.`,
		date: "2024-12-15",
		readTime: "6 min read",
		category: "Psychology",
		slug: "psychology-baby-name-selection",
		isAI: false,
	},
	{
		title: "Global Naming Traditions: Beautiful Customs from Around the World",
		excerpt:
			"Explore unique naming ceremonies and traditions from different cultures, from Hindu Namakaran to Jewish naming ceremonies.",
		content: `# Global Naming Traditions: Beautiful Customs from Around the World

*Published on ${new Date().toLocaleDateString()} | 7 min read*

Across cultures and continents, the act of naming a child is surrounded by beautiful traditions, ceremonies, and meaningful rituals. Let's explore some of the world's most fascinating naming customs.

## Hindu Namakaran Ceremony

In Hindu tradition, the Namakaran ceremony typically takes place on the 12th day after birth. This sacred ritual involves:
- Blessing from elders and priests
- Consideration of the child's birth star and planetary positions
- Choosing names that bring good fortune and positive energy
- Family feast and celebration

## Jewish Naming Traditions

Jewish naming customs vary between communities but often include:
- **Brit Milah** for boys (8th day) where Hebrew names are announced
- **Simchat Bat** for girls, celebrating with community
- Naming after deceased relatives to honor their memory
- Hebrew names alongside secular names for dual identity

## Chinese Naming Philosophy

Chinese naming involves deep consideration of:
- Character meanings and their combination
- Balance of elements (fire, water, earth, metal, wood)
- Stroke count for good fortune
- Generational names connecting family lines

## African Naming Traditions

Many African cultures have rich naming traditions:
- **Akan people** name children based on the day of the week they were born
- **Yoruba traditions** include names that tell family stories
- Names often reflect circumstances of birth or family hopes
- Community involvement in the naming process

## Scandinavian Customs

Nordic naming traditions include:
- Nature-inspired names reflecting the landscape
- Patronymic surnames (son of/daughter of)
- Names that honor Norse mythology and history
- Simple, strong sounds that weather pronunciation across cultures

## Latin American Traditions

Hispanic naming customs often feature:
- Multiple names honoring family members
- Saint names for religious protection
- Combination of maternal and paternal surnames
- Celebration with extended family and godparents

## Modern Global Influence

Today's interconnected world creates beautiful fusion:
- Multicultural families blending traditions
- Names crossing cultural boundaries
- Social media spreading naming trends globally
- Preservation of traditions in diaspora communities

## The Universal Thread

Despite diverse customs, all cultures share common themes:
- Names as blessings and protection
- Community involvement in welcoming children
- Hope for the child's future success and happiness
- Connection between names and identity

## Embracing Diversity

Whether you're drawn to your own cultural traditions or inspired by others, remember that every naming tradition carries wisdom, love, and hope for the next generation.

The beauty lies not just in the name itself, but in the love and intention behind the choice.`,
		date: "2024-12-10",
		readTime: "7 min read",
		category: "Culture",
		slug: "global-naming-traditions",
		isAI: false,
	},
	{
		title: "The Rise of Gender-Neutral Names: A Modern Parenting Trend",
		excerpt:
			"Understanding the growing popularity of unisex names and what this trend means for the future of baby naming.",
		content: `# The Rise of Gender-Neutral Names: A Modern Parenting Trend

*Published on ${new Date().toLocaleDateString()} | 5 min read*

Gender-neutral names are experiencing unprecedented popularity among modern parents. This shift reflects changing social values and a desire to give children flexibility in their identity expression.

## Why Gender-Neutral Names Are Trending

Several factors contribute to this growing trend:
- **Social progression**: Recognition of gender fluidity and non-binary identities
- **Professional advantages**: Reducing potential gender bias in applications and resumes
- **Flexibility**: Allowing children to define their own relationship with gender
- **Simplicity**: Avoiding the need to "reveal" gender through names

## Popular Categories of Unisex Names

### Nature Names
- River, Sage, Sky, Ocean
- Rowan, Aspen, Cedar, Wren
- These names connect children to the natural world

### Virtue Names
- Justice, Honor, True, Brave
- Names that embody positive qualities

### Modern Inventions
- Zara, Kai, Sage, Phoenix
- Contemporary sounds that feel fresh and inclusive

### Traditional Names Evolving
- Names like Taylor, Jordan, and Cameron that have become truly unisex
- Traditional names being reclaimed across gender lines

## Benefits for Children

Gender-neutral names can offer several advantages:
- **Reduced assumptions**: Less immediate gender-based expectations
- **Professional flexibility**: Potential reduction in unconscious bias
- **Personal choice**: Children can embrace or reject gender associations as they grow
- **Cultural bridge**: Names that work across different cultural contexts

## Considerations for Parents

When choosing gender-neutral names, consider:
- **Pronunciation clarity**: Ensure the name is easy to say and spell
- **Cultural sensitivity**: Understand the origins and meanings
- **Family harmony**: Consider how the name fits with family traditions
- **Future flexibility**: Think about how the name ages with the child

## Historical Context

Gender-neutral naming isn't entirely new:
- Many cultures have traditionally used unisex names
- Names like Leslie, Ashley, and Shannon have shifted gender associations over time
- The current trend represents expanded choices rather than complete departure from tradition

## The Future of Naming

This trend suggests:
- Continued expansion of naming options
- Less rigid gender categories in society
- Greater emphasis on individual choice and expression
- Evolution of traditional naming practices

## Making Your Choice

Whether you choose a traditional gendered name or a gender-neutral option, the most important factor is that it feels right for your family. Consider your values, hopes for your child, and the name's ability to grow with them throughout their life.

The beauty of modern naming is the freedom to choose what resonates with your family's vision for your child's future.`,
		date: "2024-12-05",
		readTime: "5 min read",
		category: "Trends",
		slug: "gender-neutral-names-trend",
		isAI: false,
	},
	{
		title:
			"Nature-Inspired Baby Names: Connecting Your Child to the Natural World",
		excerpt:
			"From celestial bodies to flower names, discover how nature continues to inspire beautiful and meaningful baby names.",
		content: `# Nature-Inspired Baby Names: Connecting Your Child to the Natural World

*Published on ${new Date().toLocaleDateString()} | 6 min read*

In an increasingly digital world, many parents are drawn to nature-inspired names that ground their children in the beauty and wonder of the natural world.

## The Appeal of Nature Names

Nature names offer several meaningful advantages:
- **Universal beauty**: Natural elements are appreciated across cultures
- **Timeless quality**: Nature themes never go out of style
- **Positive associations**: Connection to growth, strength, and serenity
- **Diverse options**: From subtle to bold, nature offers endless inspiration

## Categories of Nature Names

### Botanical Beauties
**Flowers and Plants:**
- Rose, Lily, Iris, Violet
- Sage, Basil, Rosemary, Thyme
- Jasmine, Dahlia, Magnolia, Azalea

**Trees and Woods:**
- Oak, Aspen, Cedar, Pine
- Rowan, Hazel, Willow, Birch
- Forest, Grove, Branch, Root

### Celestial Wonders
**Stars and Sky:**
- Luna, Stella, Nova, Aurora
- Orion, Leo, Vega, Sirius
- Sky, Star, Cosmos, Galaxy

**Weather and Seasons:**
- Storm, Rain, Snow, Sunny
- Summer, Autumn, Winter, Spring
- Cloud, Misty, Dawn, Dusk

### Water Elements
**Rivers and Oceans:**
- River, Brook, Lake, Bay
- Marina, Coral, Pearl, Tide
- Ocean, Pacific, Azure, Blue

### Geological Gems
**Stones and Minerals:**
- Ruby, Emerald, Jade, Onyx
- Crystal, Diamond, Amber, Opal
- Stone, Rocky, Cliff, Ridge

### Animal Kingdom
**Wildlife Inspiration:**
- Bear, Fox, Wolf, Hawk
- Wren, Robin, Lark, Phoenix
- Leo, Lionel, Drake, Falcon

## Cultural Connections

Nature names appear across cultures:
- **Japanese**: Sakura (cherry blossom), Yuki (snow)
- **Hawaiian**: Leilani (heavenly flowers), Kai (ocean)
- **Native American**: Many names honoring natural elements
- **Celtic**: Names celebrating landscapes and seasons

## Modern Trends

Contemporary nature naming includes:
- **Gender-neutral options**: River, Sage, Sky
- **Unique spellings**: Briar, Wren, Vale
- **Combination names**: Rose-Mae, Lily-Grace
- **International variations**: International forms of nature names

## Choosing the Right Nature Name

Consider these factors:
- **Personal connection**: Choose elements that resonate with your family
- **Pronunciation**: Ensure the name is easy to say and spell
- **Nickname potential**: Consider shortened versions
- **Sibling harmony**: Think about how names work together

## Benefits for Children

Nature names can offer:
- **Positive self-image**: Association with beauty and strength
- **Conversation starters**: Interesting stories behind their names
- **Connection to environment**: Built-in appreciation for nature
- **Versatility**: Names that work in various settings

## Seasonal Considerations

Some parents choose names based on:
- **Birth season**: Spring babies named Flora or Summer
- **Conception season**: Names reflecting when the child was conceived
- **Family traditions**: Seasonal names passed down through generations
- **Personal significance**: Names from meaningful places or times

## The Deeper Connection

Nature names represent more than just beauty—they connect children to:
- The cycles of life and growth
- The importance of environmental stewardship
- The wonder and mystery of the natural world
- A sense of place and belonging on Earth

## Making Your Choice

Whether you choose a subtle nature nod or a bold botanical statement, nature-inspired names offer a beautiful way to connect your child to the world around them. These names carry the promise of growth, the strength of the earth, and the endless possibility of natural beauty.

Let nature guide you to the perfect name for your little one.`,
		date: "2024-12-01",
		readTime: "6 min read",
		category: "Nature",
		slug: "nature-inspired-baby-names",
		isAI: false,
	},
	{
		title:
			"The Science of Name Pronunciation: Why It Matters More Than You Think",
		excerpt:
			"Research shows how a name's pronunciation difficulty can impact a child's social and professional life. Learn what to consider.",
		content: `# The Science of Name Pronunciation: Why It Matters More Than You Think

*Published on ${new Date().toLocaleDateString()} | 7 min read*

The ease or difficulty of pronouncing a name can significantly impact a person's life experiences, from childhood social interactions to professional opportunities. Understanding this science can help you make informed naming decisions.

## The Research Behind Name Pronunciation

Studies have consistently shown that name pronunciation affects:
- **First impressions**: People form judgments within seconds of hearing a name
- **Social integration**: Easier names often lead to smoother social interactions
- **Professional opportunities**: Simple names may have advantages in hiring processes
- **Self-confidence**: Children with easily pronounced names often show higher confidence

## The Cognitive Load Factor

When people encounter difficult names:
- **Mental processing increases**: More brain power needed to decode pronunciation
- **Attention divided**: Focus splits between the name and the conversation
- **Memory formation affected**: Harder names are less likely to be remembered correctly
- **Social discomfort**: People may avoid using names they can't pronounce

## Cultural Considerations

Name pronunciation challenges often involve:
- **Cultural unfamiliarity**: Names from different linguistic traditions
- **Regional variations**: Names that work in one area but not another
- **Generational differences**: Older generations may struggle with modern names
- **International context**: Global mobility requires broader pronunciation ease

## The Fluency Effect

Psychologically, easier names benefit from the "fluency effect":
- **Positive associations**: Easy-to-process information feels more trustworthy
- **Increased likability**: Familiar sounds are generally preferred
- **Reduced cognitive strain**: Less mental effort creates positive feelings
- **Better recall**: Simple names are remembered more accurately

## Practical Implications

Consider these real-world impacts:
- **School experiences**: Teachers may inadvertently favor easily pronounced names
- **Peer relationships**: Playground dynamics can be affected by name complexity
- **Professional networking**: Business cards and introductions become smoother
- **Service interactions**: Phone calls and appointments flow more easily

## Finding the Balance

You don't need to sacrifice meaning for simplicity:
- **Test pronunciation**: Say the name aloud to various people
- **Consider nicknames**: Provide easier alternatives when needed
- **Think phonetically**: Choose names that follow familiar sound patterns
- **Cultural context**: Consider where your child will primarily live and work

## Strategies for Complex Names

If you choose a less common name:
- **Teach confidence**: Help your child feel proud of their unique name
- **Practice pronunciation**: Make it a positive part of their identity
- **Provide alternatives**: Offer nicknames for different situations
- **Embrace uniqueness**: Turn complexity into a conversation starter

## Global Considerations

In our interconnected world:
- **Technology factors**: Voice recognition systems favor simpler names
- **International travel**: Consider how names work across cultures
- **Digital presence**: Online platforms may struggle with complex spellings
- **Future flexibility**: Think about your child's potential global mobility

## The Positive Side of Unique Names

Complex names can offer benefits:
- **Memorable distinctiveness**: Stand out in positive ways
- **Cultural pride**: Maintain important heritage connections
- **Character building**: Develop resilience and confidence
- **Conversation starters**: Create opportunities for cultural exchange

## Making Informed Decisions

When choosing a name, consider:
- **Your priorities**: Balance uniqueness with practicality
- **Family values**: Honor heritage while considering modern context
- **Child's future**: Think about various life scenarios
- **Testing process**: Try the name in different situations

## The Middle Ground

Many parents find success with:
- **Familiar sounds, unique spellings**: Recognizable pronunciation with distinctive look
- **Cultural names with easy nicknames**: Honor heritage with practical alternatives
- **Modern variations**: Updated versions of traditional names
- **International appeal**: Names that work across cultures

## Conclusion

While name pronunciation matters, it shouldn't override your personal values and preferences. The key is making an informed decision that considers both the beauty and meaning you want for your child, alongside the practical realities they'll face.

Remember: confidence in explaining and embracing a name can overcome many pronunciation challenges. The most important factor is choosing a name you love and can help your child love too.`,
		date: "2024-11-28",
		readTime: "7 min read",
		category: "Research",
		slug: "name-pronunciation-science",
		isAI: false,
	},
];

// Get all blog posts from Firebase
export async function getBlogPosts(): Promise<BlogPost[]> {
	try {
		const q = query(
			collection(db, BLOG_COLLECTION),
			orderBy("createdAt", "desc")
		);
		const querySnapshot = await getDocs(q);

		const posts: BlogPost[] = [];
		querySnapshot.forEach((doc) => {
			posts.push({
				id: doc.id,
				...doc.data(),
			} as BlogPost);
		});

		return posts;
	} catch (error) {
		// Silently handle permissions errors - fallback will be used in component
		if (error instanceof Error && error.message.includes("permissions")) {
			return [];
		}
		return [];
	}
}

// Add a new blog post to Firebase
export async function addBlogPost(
	post: Omit<BlogPost, "id" | "createdAt">
): Promise<string | null> {
	try {
		const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
			...post,
			createdAt: Timestamp.now(),
		});
		return docRef.id;
	} catch {
		return null;
	}
}

// Initialize blog posts in Firebase (run once)
export async function initializeBlogPosts(): Promise<void> {
	try {
		// Check if posts already exist
		const existingPosts = await getBlogPosts();
		if (existingPosts.length > 0) {
			return;
		}

		// Add initial posts
		for (const post of initialBlogPosts) {
			await addBlogPost(post);
		}
	} catch {
		// Silently handle initialization errors
	}
}
export async function shouldGenerateNewPost(): Promise<boolean> {
	try {
		const threeDaysAgo = new Date();
		threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

		// Simplified query without compound index requirement
		const q = query(
			collection(db, BLOG_COLLECTION),
			orderBy("createdAt", "desc"),
			limit(10) // Get recent posts to check
		);

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			return true; // No posts yet, can generate
		}

		// Filter AI posts in JavaScript instead of Firestore query
		const aiPosts = querySnapshot.docs.filter(
			(doc) => doc.data().isAI === true
		);

		if (aiPosts.length === 0) {
			return true; // No AI posts yet, can generate
		}

		const lastAIPost = aiPosts[0];
		const lastPostDate = lastAIPost.data().createdAt.toDate();

		return lastPostDate < threeDaysAgo;
	} catch {
		return false;
	}
}

// Generate and save a new AI blog post
export async function generateAndSaveNewPost(): Promise<BlogPost | null> {
	try {
		const response = await fetch("/api/generate-article?action=generate");
		const data = await response.json();

		if (data.success) {
			const newPost: Omit<BlogPost, "id" | "createdAt"> = {
				...data.article,
				isAI: true,
			};

			const postId = await addBlogPost(newPost);
			if (postId) {
				return {
					...newPost,
					id: postId,
					createdAt: Timestamp.now(),
				};
			}
		}

		return null;
	} catch {
		return null;
	}
}
