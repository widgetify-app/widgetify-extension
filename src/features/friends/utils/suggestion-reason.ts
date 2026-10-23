interface SuggestionReasons {
	mutualCount: number
	sharedInterests: string[]
	city: string | null
}

type SuggestionReason =
	| { kind: 'mutual'; value: number }
	| { kind: 'interest'; value: string }
	| { kind: 'city'; value: string }

export function suggestionReason(reasons: SuggestionReasons): SuggestionReason | null {
	if (reasons.mutualCount > 0) return { kind: 'mutual', value: reasons.mutualCount }
	if (reasons.sharedInterests[0]) {
		return { kind: 'interest', value: reasons.sharedInterests[0] }
	}
	if (reasons.city) return { kind: 'city', value: reasons.city }

	return null
}
