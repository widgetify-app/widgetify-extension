import { ConfigKey } from '@/common/constants/config-keys'
import { t } from '@/common/i18n'
import { Tooltip } from '@/components/ui'

interface Prop {
	coins: number
	title?: string
}
export function UserCoin({ coins, title }: Prop) {
	return (
		<Tooltip content={title || t('common.coin.name')}>
			<div className="relative overflow-hidden transition-ui duration-300 transform border bg-gradient-to-r from-warning-fill via-warning-fill to-warning-fill border-warning-fill-2 rounded-2xl">
				<div className="absolute inset-0 opacity-50 bg-gradient-to-r from-warning-fill to-transparent"></div>

				<div className="relative flex items-center gap-2 px-2 py-0.5">
					<span className="text-sm font-semibold text-warning bg-gradient-to-r from-warning to-warning bg-clip-text">
						{coins?.toLocaleString() || t('common.coin.zero')}
					</span>
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-warning-fill-2 to-warning-fill blur-xs"></div>
						<img
							src={ConfigKey.WIG_COIN_ICON}
							alt={t('common.coin.name')}
							className="relative w-6 h-6"
						/>
					</div>
				</div>
			</div>
		</Tooltip>
	)
}
