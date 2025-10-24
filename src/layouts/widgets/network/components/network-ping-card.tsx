import type { JSX } from 'react'
import {
	MdOutlineSignalCellularAlt,
	MdOutlineSignalCellularAlt1Bar,
	MdOutlineSignalCellularAlt2Bar,
	MdRouter,
} from 'react-icons/md'
import Tooltip from '@/components/toolTip'

interface NetworkPingCardProps {
	ping: number | null
}

export function NetworkPingCard({ ping }: NetworkPingCardProps) {
	const feedbackText =
		ping !== null
			? ping < 150
				? 'پینگ شما عالی هست.'
				: ping < 300
					? 'پینگ شما متوسط است.'
					: 'پینگ شما ضعیف است.'
			: 'N/A'
	return (
		<div className="grid grid-cols-1 gap-2">
			<div className="relative p-3 border rounded-2xl border-content">
				<div className="flex items-center gap-2 mb-1">
					<MdRouter className={`w-4 h-4 text-muted`} />
					<span className="text-xs font-medium text-muted">
						پینگ - زمان پاسخگویی
					</span>
				</div>
				<Tooltip content={feedbackText}>
					<div className="flex items-center text-sm font-bold gap-0.5">
						{getPingIcon(ping !== null ? ping : -1)}
						{ping ? `${ping}ms` : 'N/A'}
					</div>
				</Tooltip>
				<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
			</div>
		</div>
	)
}

function getPingIcon(ping: number): JSX.Element {
	switch (true) {
		case ping === -1:
			return <MdOutlineSignalCellularAlt1Bar className={' text-[#A63F3F]'} />
		case ping <= 100:
			return <MdOutlineSignalCellularAlt className={' text-[#40CF4E]'} />
		case ping <= 180:
			return <MdOutlineSignalCellularAlt2Bar className={' text-[#A6893F]'} />
		default:
			return <MdOutlineSignalCellularAlt1Bar className={' text-[#A63F3F]'} />
	}
}
