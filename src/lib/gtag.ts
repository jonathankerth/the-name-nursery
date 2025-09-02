// Type declaration for gtag
declare global {
	interface Window {
		gtag: (
			command: "config" | "event",
			targetId: string,
			config?: Record<string, unknown>
		) => void;
	}
}

// Google Analytics configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
	if (typeof window !== "undefined" && GA_TRACKING_ID) {
		window.gtag("config", GA_TRACKING_ID, {
			page_path: url,
		});
	}
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
	action,
	category,
	label,
	value,
}: {
	action: string;
	category: string;
	label?: string;
	value?: number;
}) => {
	if (typeof window !== "undefined" && GA_TRACKING_ID) {
		window.gtag("event", action, {
			event_category: category,
			event_label: label,
			value: value,
		});
	}
};

// Custom events for your baby name app
export const trackNameSearch = (gender: string, letter: string) => {
	event({
		action: "search_names",
		category: "User Interaction",
		label: `${gender}_${letter}`,
	});
};

export const trackNameView = (
	gender: string,
	letter: string,
	isAIGenerated: boolean
) => {
	event({
		action: "view_results",
		category: "Content",
		label: `${gender}_${letter}_${isAIGenerated ? "ai" : "fallback"}`,
	});
};

export const trackStepProgression = (fromStep: string, toStep: string) => {
	event({
		action: "step_progression",
		category: "User Flow",
		label: `${fromStep}_to_${toStep}`,
	});
};
