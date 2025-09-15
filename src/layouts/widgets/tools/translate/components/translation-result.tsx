import { TbCopy, TbVolume } from 'react-icons/tb'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import { speakTextInLanguage } from '../shared'

interface TranslationResultProps {
	translatedText: string
	validationError: string
	translateMutation: any
	errorMessage: string
	toLanguage: string
}

const handleCopy = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text)
		Analytics.event('translate_copy_text')
	} catch (err) {
		console.error('Failed to copy text:', err)
	}
}

export function TranslationResult({
	translatedText,
	validationError,
	translateMutation,
	errorMessage,
	toLanguage,
}: TranslationResultProps) {
	return (
		<div className="relative">
			<div className="h-20 p-2 overflow-y-auto border rounded-xl bg-content border-base-300 text-content">
				{validationError || translateMutation.error ? (
					<div className="pb-4 text-xs leading-tight text-error">
						{errorMessage}
					</div>
				) : (
					<div className="pb-4 text-sm leading-tight">{translatedText}</div>
				)}
				{translatedText &&
					!translateMutation.isPending &&
					!(validationError || translateMutation.error) && (
						<div className="absolute flex items-center gap-1 bottom-1 left-1">
							<Tooltip content="کپی" position="top">
								<Button
									size="xs"
									onClick={() => handleCopy(translatedText)}
									className="!btn-xs !w-5 !h-5 !min-h-5 !p-0 btn-ghost"
								>
									<TbCopy className="w-3 h-3" />
								</Button>
							</Tooltip>
							<Tooltip content="پخش صوتی" position="top">
								<Button
									size="xs"
									onClick={() =>
										speakTextInLanguage(translatedText, toLanguage)
									}
									className="!btn-xs !w-5 !h-5 !min-h-5 !p-0 btn-ghost"
								>
									<TbVolume className="w-3 h-3" />
								</Button>
							</Tooltip>
						</div>
					)}
			</div>
		</div>
	)
}
