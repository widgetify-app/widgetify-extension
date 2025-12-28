import { Button } from '@/components/button/button'
import { useGeneralSetting } from '@/context/general-setting.context'
import { FaLock } from 'react-icons/fa'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { useGetBrowserHistory } from './useGetBrowserHistory'
import { BrowserHistoryItemComponent } from './history-item'

interface HistoryItemsProps {
	onHistoryClick: (url: string) => void
}
export const HistoryItems = ({ onHistoryClick }: HistoryItemsProps) => {
	const { browserHistoryEnabled } = useGeneralSetting()
	const history = useGetBrowserHistory(browserHistoryEnabled)
	console.log(history)
	const onShowPrivacyModal = () => {
		callEvent('show_browser_history_privacy_modal')
	}

	if (browserHistoryEnabled) {
		return (
			<div className="flex flex-col items-center justify-center w-full h-32 px-4 py-2">
				<div className="flex flex-col items-center gap-1 mb-2">
					<div className="p-2 rounded-full bg-base-300/50">
						<FaLock className="text-sm text-base-content" />
					</div>
					<p className="text-[10px] md:text-xs font-medium text-center text-content leading-tight">
						برای دیدن تاریخچه، باید اجازه بدی!
					</p>
				</div>

				<Button
					className="w-full max-w-35 h-8! text-[11px] rounded-2xl shadow-sm"
					isPrimary
					size="sm"
					onClick={() => onShowPrivacyModal()}
				>
					دسترسی به تاریخچه
				</Button>
			</div>
		)
	}

	if (history.length === 0) {
		Analytics.event('browser_history_empty')
		return (
			<div className="flex flex-col items-center justify-center w-full h-32 opacity-60">
				<div className="mb-2 text-2xl">🌵</div>
				<p className="text-[10px] md:text-xs font-medium text-center text-content leading-tight">
					تاریخچه‌ت از کویر لوت هم خالی‌تره! <br />
					(شاید هم تازه همه رو پاک کردی)
				</p>
			</div>
		)
	}

	return (
		<div className="h-32 px-2 overflow-y-auto small-scrollbar">
			<div className="grid grid-cols-1 gap-1 py-2">
				{history.map((item, index) => (
					<BrowserHistoryItemComponent
						key={item.id}
						index={index}
						history={item}
						onClick={() => onHistoryClick(item.url)}
					/>
				))}
			</div>
		</div>
	)
}
