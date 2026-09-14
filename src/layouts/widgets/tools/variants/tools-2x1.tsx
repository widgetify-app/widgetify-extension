import {
	MdOutlineCurrencyExchange,
	MdOutlineMosque,
	MdOutlineTimer,
} from 'react-icons/md'

interface ToolsCompactRowProps {
	onSelectTab: (tab: 'pomodoro' | 'religious-time' | 'currency-converter') => void
}

export function ToolsCompactRow({ onSelectTab }: ToolsCompactRowProps) {
	return (
		<div className="grid grid-cols-3 gap-1.5 h-full w-full select-none">
			<button
				type="button"
				onClick={() => onSelectTab('pomodoro')}
				className="flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl bg-base-200/40 hover:bg-base-200/70 border border-base-content/10 transition-colors cursor-pointer"
			>
				<MdOutlineTimer className="w-4 h-4 text-primary" />
				<span className="text-[10px] font-medium text-content">پومودورو</span>
			</button>

			<button
				type="button"
				onClick={() => onSelectTab('religious-time')}
				className="flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl bg-base-200/40 hover:bg-base-200/70 border border-base-content/10 transition-colors cursor-pointer"
			>
				<MdOutlineMosque className="w-4 h-4 text-primary" />
				<span className="text-[10px] font-medium text-content">اوقات شرعی</span>
			</button>

			<button
				type="button"
				onClick={() => onSelectTab('currency-converter')}
				className="flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl bg-base-200/40 hover:bg-base-200/70 border border-base-content/10 transition-colors cursor-pointer"
			>
				<MdOutlineCurrencyExchange className="w-4 h-4 text-primary" />
				<span className="text-[10px] font-medium text-content">تبدیل ارز</span>
			</button>
		</div>
	)
}
