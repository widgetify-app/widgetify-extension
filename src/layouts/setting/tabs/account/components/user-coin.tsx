import { ConfigKey } from '@/common/constant/config.key'
import Tooltip from '@/components/toolTip'

interface Prop {
	coins: number
	title?: string
}
export function UserCoin({ coins, title }: Prop) {
	return (
		<Tooltip content={title || 'ویج‌کوین'}>
			<div className="relative overflow-hidden transition-all duration-300 transform border bg-gradient-to-r from-warning/15 via-warning/10 to-warning/5 border-warning/25 rounded-2xl">
				<div className="absolute inset-0 opacity-50 bg-gradient-to-r from-warning/5 to-transparent"></div>

				<div className="relative flex items-center gap-2 px-2 py-0.5">
					<span className="text-sm font-semibold text-warning bg-gradient-to-r from-warning to-warning/80 bg-clip-text">
						{coins?.toLocaleString() || '۰'}
					</span>
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-warning/30 to-warning/10 blur-xs"></div>
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
