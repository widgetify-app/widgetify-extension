import { ConfigKey } from '@/common/constants/config-keys'
import { Button } from '@/components/ui'
import type { CoinPackage } from '@/services/market/market-coins.interface'
import { Icon } from '@/icons'

interface CoinPackageCardProps {
	package: CoinPackage
	onPurchase: () => void
	isAuthenticated: boolean
}

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

export function CoinPackageCard({ package: pkg, onPurchase }: CoinPackageCardProps) {
	return (
		<div className="flex flex-col overflow-hidden transition-ui duration-200 border bg-surface-veil rounded-2xl border-line hover:border-brand-fill-2 hover:shadow-sm group">
			{/* Coin visual area */}
			<div className="flex items-center justify-center py-6 bg-fill">
				<div className="flex flex-col items-center gap-2">
					<div className="relative">
						<div className="absolute inset-0 scale-125 rounded-full bg-warning-fill-2 blur-md" />
						<img
							src={ConfigKey.WIG_COIN_ICON}
							alt="ویج‌کوین"
							className="relative w-10 h-10 transition-transform duration-200 group-hover:scale-105"
						/>
					</div>
					<p className="text-2xl font-bold leading-none text-brand tabular-nums">
						{fmt(pkg.coin)}
					</p>
					<p className="text-3xs text-fg-faint font-medium">ویج‌کوین</p>
				</div>
			</div>

			{/* Info */}
			<div className="flex flex-col gap-2.5 px-3 py-2.5 border-t border-line">
				<div>
					<p className="text-xs font-semibold text-fg-strong leading-snug truncate">
						{pkg.title}
					</p>
					{pkg.description && (
						<p className="text-3xs text-fg-faint mt-0.5 line-clamp-1">
							{pkg.description}
						</p>
					)}
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-baseline gap-0.5">
						<span className="text-sm font-bold text-fg-strong tabular-nums">
							{fmt(pkg.price)}
						</span>
						<span className="text-3xs text-fg-faint mr-0.5">تومان</span>
					</div>

					<Button
						size="xs"
						onClick={onPurchase}
						color={'brand'}
						rounded={'lg'}
						className="px-2.5"
					>
						<div className="flex items-center gap-1">
							<Icon name="shoppingCart" size={10} />
							<span>خرید</span>
						</div>
					</Button>
				</div>
			</div>
		</div>
	)
}
