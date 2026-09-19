import { ConfigKey } from '@/common/constants/config.key'
import { Tooltip } from '@/components/ui'

interface Prop {
	coins: number
	title?: string
}
export function UserCoin({ coins, title }: Prop) {
	return (
		<Tooltip content={title || 'ویج‌کوین'}>
			<div className="relative overflow-hidden transition-all duration-300 transform border bg-gradient-to-r from-warning-subtle via-warning-subtle to-warning-subtle border-warning-muted rounded-2xl">
				<div className="absolute inset-0 opacity-50 bg-gradient-to-r from-warning-subtle to-transparent"></div>

				<div className="relative flex items-center gap-2 px-2 py-0.5">
					<span className="text-sm font-semibold text-warning bg-gradient-to-r from-warning to-warning-subtle bg-clip-text">
						{coins?.toLocaleString() || '۰'}
					</span>
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-warning-subtle to-warning-subtle blur-xs"></div>
						<img
							src={ConfigKey.WIG_COIN_ICON}
							alt="ویج‌کوین"
							className="relative w-6 h-6"
						/>
					</div>
				</div>
			</div>
		</Tooltip>
	)
}
