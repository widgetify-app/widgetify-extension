import { Button } from '@/components/button/button'
import { ConfigKey } from '@/common/constant/config.key'
import { CoinPackage } from '@/services/hooks/market/market-coins.interface'
import { Icon } from '@/src/icons'

interface CoinPackageCardProps {
	package: CoinPackage
	onPurchase: () => void
	isAuthenticated: boolean
}

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

export function CoinPackageCard({ package: pkg, onPurchase }: CoinPackageCardProps) {
	return (
		<div className="flex flex-col overflow-hidden transition-all duration-200 border bg-base-100/80 rounded-2xl border-base-content/8 hover:border-primary/30 hover:shadow-sm group">
			{/* Coin visual area */}
			<div className="flex items-center justify-center py-6 bg-base-200/40">
				<div className="flex flex-col items-center gap-2">
					<div className="relative">
						<div className="absolute inset-0 scale-125 rounded-full bg-warning/20 blur-md" />
						<img
							src={ConfigKey.WIG_COIN_ICON}
							alt="ویج‌کوین"
							className="relative w-10 h-10 transition-transform duration-200 group-hover:scale-105"
						/>
					</div>
					<p className="text-2xl font-bold leading-none text-primary tabular-nums">
						{fmt(pkg.coin)}
					</p>
					<p className="text-[10px] text-base-content/40 font-medium">
						ویج‌کوین
					</p>
				</div>
			</div>

			{/* Info */}
			<div className="flex flex-col gap-2.5 px-3 py-2.5 border-t border-base-content/5">
				<div>
					<p className="text-[12px] font-semibold text-base-content leading-snug truncate">
						{pkg.title}
					</p>
					{pkg.description && (
						<p className="text-[10px] text-base-content/40 mt-0.5 line-clamp-1">
							{pkg.description}
						</p>
					)}
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-baseline gap-0.5">
						<span className="text-sm font-bold text-base-content tabular-nums">
							{fmt(pkg.price)}
						</span>
						<span className="text-[10px] text-base-content/40 mr-0.5">
							تومان
						</span>
					</div>

					<Button
						size="xs"
						onClick={onPurchase}
						className="h-6 px-2.5 text-[11px] font-medium text-white rounded-lg bg-primary/90 hover:bg-primary active:scale-95 transition-all"
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
