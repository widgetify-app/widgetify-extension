import { useRef, useState } from 'react'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'

declare global {
	interface Window {
		SpeechRecognition: any
		webkitSpeechRecognition: any
	}
}

export interface UseVoiceSearchReturn {
	isListening: boolean
	currentTranscript: string
	startVoiceSearch: () => void
	stopVoiceSearch: () => void
	clearTranscript: () => void
}

export function useVoiceSearch(
	onResult: (transcript: string) => void,
	language: string = 'fa-IR'
): UseVoiceSearchReturn {
	const [isListening, setIsListening] = useState(false)
	const [currentTranscript, setCurrentTranscript] = useState('')
	const recognitionRef = useRef<any>(null)

	const initSpeechRecognition = () => {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition
		if (!SpeechRecognition) {
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
			console.error('Speech recognition error:', event.error)
			setIsListening(false)
			Analytics.event('voice_search_error', { error: event.error })
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
			} catch (error) {
				console.error('Error starting speech recognition:', error)
			}
		}
	}

	const stopVoiceSearch = () => {
		if (recognitionRef.current && isListening) {
			recognitionRef.current.stop()
		}
	}

	const clearTranscript = () => {
		setCurrentTranscript('')
	}

	return {
		isListening,
		currentTranscript,
		startVoiceSearch,
		stopVoiceSearch,
		clearTranscript,
	}
}
