import { truncateTitle } from '@/common/utils/truncate-text'
import { FaHistory } from 'react-icons/fa'

interface HistoryItemProps {
	index: number
	history?: {
		id: string
		url: string
		title: string
		lastVisitTime: number
	}
	onClick?: () => void
}

export const BrowserHistoryItemComponent = ({ history, onClick }: HistoryItemProps) => {
	return (
		<div
			onClick={onClick}
			className="flex flex-row items-center gap-2 p-1 rounded-lg cursor-pointer text-base-content/80 hover:bg-base-200"
		>
			<FaHistory className="text-[10px]" />
			<span className="text-xs truncate">
				{truncateTitle(history?.title || '', 60)}
			</span>
		</div>
	)
}
