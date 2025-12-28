import { HistoryItems } from './history/browser-history'
import { SuggestedSites } from './suggested-content/suggested-content'

interface TrendingSearchesProps {
	visible: boolean

	onSelectHistory?: (url: string) => void
}

export const SearchboxDropdown = ({
	visible,
	onSelectHistory,
}: TrendingSearchesProps) => {
	if (!visible) return null

	return (
		<div
			className={
				'left-0 right-0 overflow-hidden absolute w-full shadow-2xl bg-widget widget-wrapper rounded-2xl top-14'
			}
			style={{
				zIndex: 9999,
				maxHeight: '400px',
				overflowY: 'auto',
			}}
		>
			<HistoryItems onHistoryClick={onSelectHistory || (() => {})} />
			<SuggestedSites />
		</div>
	)
}
