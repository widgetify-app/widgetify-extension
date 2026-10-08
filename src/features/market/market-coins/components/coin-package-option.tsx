import { t } from '@/common/i18n'
import { ConfigKey } from '@/common/constants/config-keys'
import { cn } from '@/common/utils/cn'
import type { CoinPackage } from '@/services/market/market-coins.interface'
import { faNumber, pricePerHundredCoins } from '../../utils/store-item'

interface CoinPackageOptionProps {
	pkg: CoinPackage
	selected: boolean
	isBestValue: boolean
	onSelect: () => void
}

export function CoinPackageOption({
	pkg,
	selected,
	isBestValue,
	onSelect,
}: CoinPackageOptionProps) {
	return (
		<button
			type="button"
			aria-pressed={selected}
			onClick={onSelect}
			className={cn(
				'relative flex flex-col items-center gap-1 px-3 pt-5 pb-3 text-center border cursor-pointer rounded-2xl transition-ui focus-visible:focus-ring',
				selected
					? 'border-brand bg-brand-fill ring-2 ring-brand-fill-2'
					: 'border-surface-3 bg-surface-2 hover:border-brand-muted'
			)}
		>
			{isBestValue && (
				<span className="absolute inline-flex items-center h-5 px-2 font-bold rounded-lg shadow-sm -top-2.5 bg-success text-on-success text-3xs">
					{t('market.coinPackage.bestValueBadge')}
				</span>
			)}
			<img src={ConfigKey.WIG_COIN_ICON} alt="" className="size-9" />
			<span className="text-2xl font-bold leading-tight tabular-nums text-fg-strong">
				{faNumber(pkg.coin)}
			</span>
			<span className="text-2xs text-fg-muted">{pkg.title}</span>
			<span className="w-full pt-2 mt-1 border-t border-line">
				<span className="block text-sm font-bold tabular-nums text-fg">
					{faNumber(pkg.price)}{' '}
					<span className="font-normal text-2xs text-fg-muted">
						{t('market.topUp.currencyLabel')}
					</span>
				</span>
				<span className="block text-3xs text-fg-faint tabular-nums">
					{t('market.coinPackage.perHundredLabel')}{' '}
					{faNumber(pricePerHundredCoins(pkg))}{' '}
					{t('market.topUp.currencyLabel')}
				</span>
			</span>
		</button>
	)
}
