import { useEffect, useState } from 'react'
import { MdClose, MdMic, MdSettings } from 'react-icons/md'
import { useVoiceSearch } from './useVoiceSearch'

interface VoiceSearchPortalProps {
	onClose: () => void
	onSearch: (query: string) => void
}

export type Language = 'fa-IR' | 'en-US'
const languages = [
	{ code: 'fa-IR' as Language, name: 'فارسی' },
	{ code: 'en-US' as Language, name: 'English' },
]

export function VoiceSearchPortal({ onClose, onSearch }: VoiceSearchPortalProps) {
	const [selectedLanguage, setSelectedLanguage] = useState<Language>('fa-IR')
	const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

	const { isListening, currentTranscript, startVoiceSearch, stopVoiceSearch } =
		useVoiceSearch((result) => {
			if (result.trim()) {
				onSearch(result)
				onClose()
			}
		}, selectedLanguage)

	useEffect(() => {
		startVoiceSearch()
		return () => stopVoiceSearch()
	}, [selectedLanguage])

	return (
		<div className="absolute top-0 left-0 w-full z-[60] bg-base-100 rounded-[28px] shadow-2xl p-5 animate-in fade-in slide-in-from-top-4 duration-300">
			<div className="flex items-center justify-between px-1 mb-6">
				<div className="flex items-center gap-2">
					<span className="text-[15px] font-medium text-base-content/90">
						جستجوی صوتی
					</span>
					<div className="flex items-end h-3 gap-1 mb-1">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className={`w-1 bg-primary rounded-full ${isListening ? 'animate-bounce' : 'h-1'}`}
								style={{
									animationDelay: `${i * 0.1}s`,
									height: isListening
										? `${Math.random() * 12 + 4}px`
										: '4px',
								}}
							/>
						))}
					</div>
				</div>
				<button
					onClick={onClose}
					className="p-2 transition-colors rounded-full cursor-pointer hover:bg-base-200 text-base-content/60"
				>
					<MdClose size={22} />
				</button>
			</div>

			<div className="flex flex-col items-center gap-6 py-2">
				<div className="w-full min-h-[60px] flex items-center justify-center px-4">
					<p
						className={`text-xl text-center leading-relaxed ${currentTranscript ? 'text-base-content font-bold' : 'text-base-content/30 font-medium'}`}
					>
						{currentTranscript ||
							(selectedLanguage === 'fa-IR'
								? 'در حال گوش دادن...'
								: 'Listening...')}
					</p>
				</div>

				<div className="flex items-center justify-between w-full pt-4 mt-4 border-t border-base-content/5">
					<div className="relative">
						<button
							onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
							className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-base-200 rounded-xl transition-colors text-xs font-bold text-base-content/60"
						>
							<MdSettings size={18} />
							{languages.find((l) => l.code === selectedLanguage)?.name}
						</button>

						{isLanguageMenuOpen && (
							<div className="absolute bottom-full mb-2 left-0 bg-base-100 border border-base-content/10 shadow-xl rounded-xl overflow-hidden min-w-[120px]">
								{languages.map((lang) => (
									<button
										key={lang.code}
										onClick={() => {
											setSelectedLanguage(lang.code)
											setIsLanguageMenuOpen(false)
										}}
										className="w-full cursor-pointer px-4 py-2.5 text-right text-xs font-bold hover:bg-base-200 transition-colors"
									>
										{lang.name}
									</button>
								))}
							</div>
						)}
					</div>

					<button
						onClick={() =>
							isListening ? stopVoiceSearch() : startVoiceSearch()
						}
						className={`w-12 h-12 cursor-pointer flex items-center justify-center rounded-full transition-all ${isListening ? 'bg-error text-white shadow-lg shadow-error/20' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}
					>
						<MdMic size={24} className={isListening ? 'animate-pulse' : ''} />
					</button>
				</div>
			</div>
		</div>
	)
}
