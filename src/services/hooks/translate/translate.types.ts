export interface TranslateRequestInput {
	from: string
	to: string
	text: string
}

export interface TranslateUsage {
	used: number
	limit: number
	tryAfter: number
}

export interface TranslateResponse {
	translated: string
	usage: TranslateUsage
}

// Success response is directly the translated data
export interface TranslateSuccessResponse {
	translated: string
	usage: TranslateUsage
}

export interface TranslateErrorResponse {
	statusCode: number
	success: false
	message: string
	tryAfter?: number
}

export type TranslateApiResponse = TranslateSuccessResponse | TranslateErrorResponse

export type LanguageCode = string

export interface AvailableLanguagesResponse {
	platform: {
		name: string
		link: string
	}
	isAvailableService: boolean
	languages: LanguageCode[]
}

export interface TranslateValidationResult {
	isValid: boolean
	error?: string
}
