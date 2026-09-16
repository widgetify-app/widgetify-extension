import { useRef, useState } from 'react'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'

declare global {
	interface Window {
		SpeechRecognition: any
		webkitSpeechRecognition: any
	}
}

export type VoiceSearchError = 'permission-denied' | 'unsupported' | 'failed' | null

export interface UseVoiceSearchReturn {
	isListening: boolean
	currentTranscript: string
	error: VoiceSearchError
	startVoiceSearch: () => void
	stopVoiceSearch: () => void
}

const PERMISSION_ERRORS = ['not-allowed', 'service-not-allowed', 'audio-capture']

export function useVoiceSearch(
	onResult: (transcript: string) => void,
	language: string = 'fa-IR'
): UseVoiceSearchReturn {
	const [isListening, setIsListening] = useState(false)
	const [currentTranscript, setCurrentTranscript] = useState('')
	const [error, setError] = useState<VoiceSearchError>(null)
	const recognitionRef = useRef<any>(null)

	const initSpeechRecognition = () => {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition
		if (!SpeechRecognition) {
			setError('unsupported')
			showToast('مرورگر شما از جستجوی صوتی پشتیبانی نمی‌کند.', 'error')
			return null
		}

		const recognition = new SpeechRecognition()
		recognition.continuous = true
		recognition.interimResults = true
		recognition.lang = language

		recognition.onstart = () => {
			setIsListening(true)
			setCurrentTranscript('')
			setError(null)
			Analytics.event('voice_search_started')
		}

		recognition.onresult = (event: any) => {
			let finalTranscript = ''
			let interimTranscript = ''

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcript = event.results[i][0].transcript
				if (event.results[i].isFinal) {
					finalTranscript += transcript
				} else {
					interimTranscript += transcript
				}
			}

			const fullTranscript = finalTranscript + interimTranscript
			setCurrentTranscript(fullTranscript)

			if (finalTranscript) {
				onResult(finalTranscript)
				Analytics.event('voice_search_transcribed')
			}
		}

		recognition.onerror = (event: any) => {
			setIsListening(false)
			Analytics.event('voice_search_error', { error: event.error })

			if (event.error === 'aborted' || event.error === 'no-speech') return

			setError(
				PERMISSION_ERRORS.includes(event.error) ? 'permission-denied' : 'failed'
			)
		}

		recognition.onend = () => {
			setIsListening(false)
		}

		return recognition
	}

	const startVoiceSearch = () => {
		if (!recognitionRef.current) {
			recognitionRef.current = initSpeechRecognition()
		}

		if (recognitionRef.current) {
			try {
				recognitionRef.current.start()
			} catch {
				setError('failed')
			}
		}
	}

	const stopVoiceSearch = () => {
		if (recognitionRef.current && isListening) {
			recognitionRef.current.stop()
		}
	}

	return {
		isListening,
		currentTranscript,
		error,
		startVoiceSearch,
		stopVoiceSearch,
	}
}
