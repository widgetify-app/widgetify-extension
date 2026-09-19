import { useEffect, useState } from 'react'
import { Dropdown, Portal } from '@/components/ui'
import { Icon } from '@/icons'
import { useVoiceSearch, type VoiceSearchError } from '../../hooks/use-voice-search'

interface VoiceSearchPortalProps {
	onClose: () => void
	onSearch: (query: string) => void
	portalStyles?: React.CSSProperties
	portalRef: React.RefObject<HTMLDivElement | null>
}

export type Language = 'fa-IR' | 'en-US'

const languages = [
	{ code: 'fa-IR' as Language, name: 'فارسی' },
	{ code: 'en-US' as Language, name: 'English' },
]

const ERROR_MESSAGES: Record<Exclude<VoiceSearchError, null>, string> = {
	'permission-denied':
		'دسترسی به میکروفون داده نشده. از نوار آدرس مرورگر اجازه‌ی میکروفون رو بده و دوباره تلاش کن.',
	unsupported: 'مرورگرت از جستجوی صوتی پشتیبانی نمی‌کنه.',
	failed: 'جستجوی صوتی شروع نشد. دوباره تلاش کن.',
}

export function VoiceSearchPortal({
	onClose,
	onSearch,
	portalStyles,
	portalRef,
}: VoiceSearchPortalProps) {
	const [selectedLanguage, setSelectedLanguage] = useState<Language>('fa-IR')

	const { isListening, currentTranscript, error, startVoiceSearch, stopVoiceSearch } =
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
		<Portal>
			<div
				ref={portalRef}
				style={portalStyles}
				role="dialog"
				aria-label="جستجوی صوتی"
				className="z-20 p-5 overflow-hidden duration-300 shadow-2xl -mt-26 bg-content bg-glass rounded-2xl animate-in fade-in slide-in-from-top-2"
			>
				<div className="flex items-center justify-between px-1 mb-6">
					<div className="flex items-center gap-2">
						<span className="text-[15px] font-medium text-content">
							جستجوی صوتی
						</span>
						<div aria-hidden="true" className="flex items-end h-3 gap-1 mb-1">
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className={`w-1 bg-primary rounded-full ${isListening ? 'animate-bounce h-3' : 'h-1'}`}
									style={{ animationDelay: `${i * 0.1}s` }}
								/>
							))}
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="بستن جستجوی صوتی"
						className="p-2 rounded-full cursor-pointer transition-ui hover:bg-hovered text-muted focus-visible:focus-ring"
					>
						<Icon name="close" size={22} aria-hidden="true" />
					</button>
				</div>

				<div className="flex flex-col items-center gap-6 py-2">
					<div className="w-full min-h-[60px] flex items-center justify-center px-4">
						{error ? (
							<p
								role="alert"
								className="flex items-start gap-2 text-sm leading-relaxed text-center text-error"
							>
								<Icon
									name="alert"
									size={18}
									className="mt-0.5 shrink-0"
									aria-hidden="true"
								/>
								<span>{ERROR_MESSAGES[error]}</span>
							</p>
						) : (
							<p
								aria-live="polite"
								className={`text-xl text-center leading-relaxed ${currentTranscript ? 'text-strong font-bold' : 'text-strong font-medium'}`}
							>
								{currentTranscript ||
									(selectedLanguage === 'fa-IR'
										? 'در حال گوش دادن...'
										: 'Listening...')}
							</p>
						)}
					</div>

					<div className="flex items-center justify-between w-full pt-4 mt-4 border-t border-faint">
						<Dropdown
							position="top-right"
							width="120px"
							dropdownClassName="text-xs font-bold searchbox-item"
							trigger={
								<div className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-hovered rounded-xl transition-ui text-xs font-bold text-muted">
									<Icon name="settings" size={14} aria-hidden="true" />
									{
										languages.find((l) => l.code === selectedLanguage)
											?.name
									}
								</div>
							}
							options={languages.map((lang) => ({
								id: lang.code,
								label: lang.name,
							}))}
							onOptionSelect={(option) =>
								setSelectedLanguage(option.id as Language)
							}
						/>

						<button
							type="button"
							onClick={() =>
								isListening ? stopVoiceSearch() : startVoiceSearch()
							}
							aria-label={isListening ? 'توقف ضبط صدا' : 'شروع ضبط صدا'}
							className={`w-12 h-12 cursor-pointer flex items-center justify-center rounded-full transition-ui focus-visible:focus-ring ${isListening ? 'bg-error text-error-content shadow-lg shadow-danger-muted' : 'bg-primary text-primary-content shadow-lg shadow-brand-muted'}`}
						>
							<Icon
								name="mic"
								size={24}
								aria-hidden="true"
								className={isListening ? 'animate-pulse' : ''}
							/>
						</button>
					</div>
				</div>
			</div>
		</Portal>
	)
}
