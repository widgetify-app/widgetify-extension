import { TbVolume } from 'react-icons/tb'
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import { speakTextInLanguage } from '../shared'

interface TranslationInputProp {
	inputText: string
	fromLanguage: string
	onChangeInputText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}
export function TranslationInput({
	inputText,
	fromLanguage,
	onChangeInputText,
}: TranslationInputProp) {
	return (
		<div className="relative">
			<textarea
				value={inputText}
				onChange={(e) => onChangeInputText(e)}
				placeholder="متن برای ترجمه..."
				className="w-full h-16 p-2 text-xs resize-none textarea textarea-bordered bg-content text-content placeholder:text-content/60 !border-none !outline-none focus:ring-1 focus:ring-primary rounded-xl"
				maxLength={500}
			/>
			<div className="absolute flex items-center gap-1 bottom-1 left-1">
				<span className="text-[10px] text-content/60">
					{inputText.length}/500
				</span>
				{inputText && (
					<Tooltip content="پخش صوتی" position="top">
						<Button
							size="xs"
							onClick={() => speakTextInLanguage(inputText, fromLanguage)}
							className="!btn-xs !w-5 !h-5 !min-h-5 !p-0 btn-ghost"
						>
							<TbVolume className="w-3 h-3" />
						</Button>
					</Tooltip>
				)}
			</div>
		</div>
	)
}
