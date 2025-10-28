import { useEffect, useMemo, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FiMic, FiMicOff, FiSettings } from 'react-icons/fi'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { useVoiceSearch } from './useVoiceSearch'

interface VoiceSearchModalProps {
	isOpen: boolean
	onClose: () => void
	onSearch?: (query: string) => void
}
export type Language = 'fa-IR' | 'en-US'
const languages = [
	{ code: 'fa-IR' as Language, name: 'فارسی', flag: '🇮🇷' },
	{ code: 'en-US' as Language, name: 'انگلیسی', flag: '🇺🇸' },
]

export function VoiceSearchModal({ isOpen, onClose, onSearch }: VoiceSearchModalProps) {
	const [selectedLanguage, setSelectedLanguage] = useState<Language>('fa-IR')
	const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

	const barHeights = useMemo(() => {
		return [...Array(6)].map(() => Math.random() * 15 + 8)
	}, [])

	const {
		isListening,
		currentTranscript,
		startVoiceSearch,
		stopVoiceSearch,
		clearTranscript,
	} = useVoiceSearch(() => {}, selectedLanguage)

	useEffect(() => {
		if (isOpen && !isListening) {
			startVoiceSearch()
		} else if (!isOpen && isListening) {
			stopVoiceSearch()
		}
	}, [isOpen, isListening, startVoiceSearch, stopVoiceSearch])

	const handleClose = () => {
		stopVoiceSearch()
		clearTranscript()
		onClose()
	}

	const handleLanguageChange = (language: Language) => {
		setSelectedLanguage(language)
		setIsLanguageMenuOpen(false)
		if (isListening) {
			stopVoiceSearch()
			setTimeout(() => startVoiceSearch(), 100)
		}
	}

	const handleSearch = () => {
		if (currentTranscript.trim() && onSearch) {
			Analytics.event('voice_search_submitted')
			stopVoiceSearch()
			onSearch(currentTranscript.trim())
			onClose()
		}
	}

	const getLanguageName = (lang: Language) => {
		return lang === 'fa-IR' ? 'فارسی' : 'انگلیسی'
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="md"
			direction="rtl"
			closeOnBackdropClick={false}
			showCloseButton={false}
		>
			<div className="space-y-6 text-center">
				<div className="flex items-center justify-center gap-3">
					{isListening && (
						<div className="flex items-center gap-1">
							{barHeights.slice(0, 3).map((height, i) => (
								<div
									key={i}
									className="w-1 rounded-full bg-error"
									style={{
										height: `${height}px`,
										animationDelay: `${i * 0.1}s`,
										animation: 'pulse 0.8s ease-in-out infinite',
									}}
								/>
							))}
						</div>
					)}

					<div
						className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
							isListening
								? 'bg-error text-white shadow-lg shadow-red-500/30'
								: 'bg-base-300 text-muted'
						}`}
					>
						{isListening ? <FiMicOff size={28} /> : <FiMic size={28} />}
					</div>

					{isListening && (
						<div className="flex items-center gap-1">
							{barHeights.slice(3, 6).map((height, i) => (
								<div
									key={i}
									className="w-1 rounded-full bg-error"
									style={{
										height: `${height}px`,
										animationDelay: `${(i + 3) * 0.1}s`,
										animation: 'pulse 0.8s ease-in-out infinite',
									}}
								/>
							))}
						</div>
					)}
				</div>

				<div className="space-y-2">
					<h3 className="text-xs font-light text-content">
						{currentTranscript
							? currentTranscript
							: isListening
								? 'در حال گوش دادن...'
								: 'آماده برای گوش دادن'}
					</h3>
					<p className="text-sm text-muted">
						{isListening
							? `زبان: ${getLanguageName(selectedLanguage)}`
							: 'برای شروع گوش دادن کلیک کنید'}
					</p>
				</div>

				<div className="space-y-3">
					<div className="relative h-32">
						<button
							onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
							className="flex items-center justify-between w-full p-3 transition-colors border-2 rounded-xl border-base-300 hover:border-base-400"
						>
							<div className="flex items-center space-x-2 space-x-reverse">
								<span className="text-sm font-medium">
									{
										languages.find((l) => l.code === selectedLanguage)
											?.name
									}
								</span>
							</div>
							<FiSettings
								size={16}
								className={`transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
							/>
						</button>

						{isLanguageMenuOpen && (
							<div className="absolute left-0 right-0 z-10 border shadow-lg top-12 bg-content bg-widget border-base-300 rounded-xl">
								{languages.map((lang) => (
									<button
										key={lang.code}
										onClick={() => handleLanguageChange(lang.code)}
										className={`w-full p-3 text-right cursor-pointer first:rounded-t-xl last:rounded-b-xl hover:bg-base-300/50 transition-colors ${
											selectedLanguage === lang.code
												? 'bg-primary/10 text-primary'
												: ''
										}`}
									>
										<div className="flex items-center justify-between">
											<span className="font-medium">
												{lang.name}
											</span>
										</div>
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="flex gap-3">
					<Button
						onClick={handleClose}
						size="md"
						className="flex-1 border border-content/20 text-content hover:bg-base-300/50 rounded-2xl"
					>
						بستن
					</Button>
					<Button
						onClick={isListening ? handleSearch : startVoiceSearch}
						size="md"
						className={`flex-1 rounded-2xl border-none bg-primary/80 hover:bg-primary text-white`}
						disabled={isListening && !currentTranscript.trim()}
					>
						{isListening ? (
							<div className="flex items-center justify-center gap-2">
								<FaSearch />
								جستجو در وب...
							</div>
						) : (
							'شروع'
						)}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
