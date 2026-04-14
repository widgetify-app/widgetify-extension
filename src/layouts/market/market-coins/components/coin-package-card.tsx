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
		<div className="group relative flex flex-col  bg-base-100 rounded-2xl p-3 border border-base-300/70 hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 h-64 max-h-64 min-h-64">
			<div className="flex items-start justify-between">
				<div className="flex flex-col">
					<h3 className="text-lg font-bold transition-colors text-content group-hover:text-primary">
						{pkg.title}
					</h3>
				</div>
				<div className="flex items-center justify-center w-10 h-10 transition-transform rounded-full bg-base-200 group-hover:scale-110">
					<img
						src={ConfigKey.WIG_COIN_ICON}
						alt="ویج‌کوین"
						className="relative w-10 h-10"
					/>
				</div>
			</div>

			<div className="flex-1">
				<div className="relative z-10 p-4 text-center">
					<div className="flex items-center justify-center gap-2 mb-1">
						<span className="text-4xl font-bold text-primary">
							{formatPrice(pkg.coin)}
						</span>
					</div>
					<span className="text-sm font-light text-muted">عدد ویج‌کوین</span>
				</div>
			</div>

			{/* Description */}
			<p className="px-1 mb-2 text-xs leading-relaxed text-muted line-clamp-2 min-h-[2.5rem]">
				{pkg.description || ''}
			</p>

			{/* Price and Purchase Button */}
			<div className="flex items-center justify-between border-t border-base-200/40">
				<div className="flex flex-col">
					<span className="text-xs text-muted">قیمت</span>
					<div className="flex items-baseline gap-1">
						<span className="text-sm font-bold text-content">
							{formatPrice(pkg.price)}
						</span>
						<span className="text-xs text-muted">تومان</span>
					</div>
				</div>

				<Button
					size="xs"
					onClick={onPurchase}
					className="h-8 px-4 text-xs font-bold text-white transition-all rounded-xl bg-primary/80 hover:bg-primary active:scale-95"
				>
					<div className="flex items-center gap-1.5">
						<FiShoppingCart size={14} />
						<span>خرید</span>
					</div>
				</Button>
			</div>
		</div>
	)
}
