import { t } from '@/common/i18n'
import { ConfigKey } from '@/common/constants/config-keys'
import { cn } from '@/common/utils/cn'
import { faNumber } from '../../utils/store-item'

const SIZES = {
	sm: { text: 'text-xs', icon: 'size-4' },
	md: { text: 'text-sm', icon: 'size-5' },
	lg: { text: 'text-2xl', icon: 'size-7' },
}

interface CoinAmountProps {
	amount: number
	size?: keyof typeof SIZES
	className?: string
}

export function CoinAmount({ amount, size = 'sm', className }: CoinAmountProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 font-bold tabular-nums text-fg-strong',
				SIZES[size].text,
				className
			)}
		>
			{faNumber(amount)}
			<img
				src={ConfigKey.WIG_COIN_ICON}
				alt={t('market.coin.amountLabel')}
				className={cn('shrink-0', SIZES[size].icon)}
			/>
		</span>
	)
}
