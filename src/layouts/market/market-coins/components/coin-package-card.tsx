import { FiShoppingCart } from 'react-icons/fi'
import { Button } from '@/components/button/button'
import { ConfigKey } from '@/common/constant/config.key'
import { CoinPackage } from '@/services/hooks/market/market-coins.interface'

interface CoinPackageCardProps {
	package: CoinPackage
	onPurchase: () => void
	isAuthenticated: boolean
}

const formatPrice = (price: number) => {
	return new Intl.NumberFormat('fa-IR').format(price)
}

export function CoinPackageCard({ package: pkg, onPurchase }: CoinPackageCardProps) {
	return (
		<div className="group relative flex flex-col bg-base-100 rounded-2xl border border-base-300/60 hover:border-primary/30 hover:shadow-lg transition-all duration-200 overflow-hidden h-64 max-h-64 min-h-64">
			<div className="flex items-center justify-center flex-1 relative bg-base-200/30">
				<div className="flex flex-col items-center gap-1">
					<img
						src={ConfigKey.WIG_COIN_ICON}
						alt="ویج‌کوین"
						className="w-12 h-12 group-hover:scale-110 transition-transform duration-200"
					/>
					<div className="flex items-baseline gap-1 mt-1">
						<span className="text-3xl font-bold text-primary tabular-nums">
							{formatPrice(pkg.coin)}
						</span>
					</div>
					<span className="text-xs text-muted">عدد ویج‌کوین</span>
				</div>
			</div>

			<div className="flex flex-col gap-1 p-3 border-t border-base-200/50">
				<h3 className="text-sm font-semibold text-content group-hover:text-primary transition-colors truncate">
					{pkg.title}
				</h3>
				{pkg.description && (
					<p className="text-[11px] text-muted line-clamp-1">{pkg.description}</p>
				)}

				<div className="flex items-center justify-between mt-1.5">
					<div className="flex items-baseline gap-1">
						<span className="text-sm font-bold text-content tabular-nums">
							{formatPrice(pkg.price)}
						</span>
						<span className="text-[11px] text-muted">تومان</span>
					</div>

					<Button
						size="xs"
						onClick={onPurchase}
						className="h-7 px-3 text-[11px] font-semibold text-white transition-all rounded-lg bg-primary/85 hover:bg-primary active:scale-95"
					>
						<div className="flex items-center gap-1">
							<FiShoppingCart size={12} />
							<span>خرید</span>
						</div>
					</Button>
				</div>
			</div>
		</div>
	)
}
