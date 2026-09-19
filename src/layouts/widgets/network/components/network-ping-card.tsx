import type React from 'react'
import { Tooltip } from '@/components/ui'
import { Icon } from '@/icons'
import type { IconName } from '@/icons/types'
import {
	getPingFeedback,
	getPingQuality,
	getPingTextClass,
	type PingQuality,
} from '../utils/ping-quality'

const QUALITY_ICON: Record<PingQuality, IconName> = {
	unknown: 'signalLow',
	good: 'signalHigh',
	fair: 'signalMedium',
	poor: 'signalLow',
}

interface NetworkPingCardProps {
	ping: number | null
}

export const NetworkPingCard: React.FC<NetworkPingCardProps> = ({ ping }) => {
	return (
		<div className="relative p-3 overflow-hidden border rounded-2xl border-content">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-linear-to-br from-subtle to-transparent"
			/>

			<dl className="relative">
				<dt className="flex items-center gap-2 mb-1 text-xs font-medium text-muted">
					<Icon name="router" className="w-4 h-4" aria-hidden="true" />
					پینگ - زمان پاسخگویی
				</dt>
				<Tooltip content={getPingFeedback(ping)}>
					<dd className="flex items-center text-sm font-bold gap-0.5">
						<Icon
							name={QUALITY_ICON[getPingQuality(ping)]}
							className={getPingTextClass(ping)}
							aria-hidden="true"
						/>
						{ping === null ? (
							<span className="text-muted">اندازه‌گیری نشد</span>
						) : (
							<data value={ping}>{ping}ms</data>
						)}
					</dd>
				</Tooltip>
			</dl>
		</div>
	)
}
