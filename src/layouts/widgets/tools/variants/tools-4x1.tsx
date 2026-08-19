import {
	MdOutlineCurrencyExchange,
	MdOutlineMosque,
	MdOutlineTimer,
} from 'react-icons/md'
import { Icon } from '@/src/icons'

interface ToolsWideBannerProps {
	onSelectTab: (tab: 'pomodoro' | 'religious-time' | 'currency-converter') => void
}

export function ToolsWideBanner({ onSelectTab }: ToolsWideBannerProps) {
	return (
		<div className="flex items-center justify-between h-full w-full px-3 py-1 select-none">
			<div className="flex items-center gap-2 font-bold text-xs text-content">
				<Icon name="settings" className="w-4 h-4 text-primary" />
				<span>ابزارها</span>
			</div>

			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => onSelectTab('pomodoro')}
					className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200/50 hover:bg-base-200/80 border border-base-content/10 transition-colors cursor-pointer text-xs font-medium text-content"
				>
					<MdOutlineTimer className="w-3.5 h-3.5 text-primary" />
					<span>پومودورو</span>
				</button>

				<button
					type="button"
					onClick={() => onSelectTab('religious-time')}
					className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200/50 hover:bg-base-200/80 border border-base-content/10 transition-colors cursor-pointer text-xs font-medium text-content"
				>
					<MdOutlineMosque className="w-3.5 h-3.5 text-primary" />
					<span>اوقات شرعی</span>
				</button>

				<button
					type="button"
					onClick={() => onSelectTab('currency-converter')}
					className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200/50 hover:bg-base-200/80 border border-base-content/10 transition-colors cursor-pointer text-xs font-medium text-content"
				>
					<MdOutlineCurrencyExchange className="w-3.5 h-3.5 text-primary" />
					<span>تبدیل ارز</span>
				</button>
			</div>
		</div>
	)
}
