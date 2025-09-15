import Analytics from '@/analytics'
import type {
	TranslateRequestInput,
	TranslateValidationResult,
} from '@/services/hooks/translate'

export function speakTextInLanguage(text: string, lang: string) {
	if ('speechSynthesis' in window) {
		const utterance = new SpeechSynthesisUtterance(text)
		utterance.lang = lang === 'fa' ? 'fa-IR' : lang === 'en' ? 'en-US' : lang
		speechSynthesis.speak(utterance)
		Analytics.event(`translate_speak_${lang}`)
	}
}

export function validateTranslateRequest(
	request: TranslateRequestInput
): TranslateValidationResult {
	if (!request.text || request.text.trim().length === 0) {
		return {
			isValid: false,
			error: 'EMPTY_TEXT',
		}
	}

	if (request.text.length > 5000) {
		return {
			isValid: false,
			error: 'TEXT_TOO_LONG',
		}
	}

	if (request.from === request.to) {
		return {
			isValid: false,
			error: 'SOURCE_AND_TARGET_LANG_MUST_BE_DIFFERENT',
		}
	}

	if (request.to === 'auto') {
		return {
			isValid: false,
			error: 'TARGET_LANG_CANNOT_BE_AUTO',
		}
	}

	return { isValid: true }
}
