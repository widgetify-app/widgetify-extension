import { ConfigKey } from '@/common/constants/config-keys'
import { Button } from '@/components/ui'
import { useGetCoinPackages } from '@/services/market/market-coins.hook'
import { useCoinCheckout } from '../../hooks/use-coin-checkout'
import { faNumber, pickTopUpPackage } from '../../utils/store-item'

interface TopUpSuggestionProps {
	shortfall: number
	onSeeAll: () => void
}

export function TopUpSuggestion({ shortfall, onSeeAll }: TopUpSuggestionProps) {
	const { data } = useGetCoinPackages({ limit: 12 })
	const { checkout, payingPackageId } = useCoinCheckout()
	const pkg = pickTopUpPackage(data?.packages ?? [], shortfall)
	if (!pkg) return null

	return (
		<div className="p-3 space-y-3 border rounded-2xl border-surface-3 bg-surface-2">
			<p className="font-semibold text-2xs text-fg-muted">
				ارزون‌ترین بسته‌ای که کسری رو پر می‌کنه
			</p>
			<div className="flex items-center gap-3">
				<span className="grid rounded-xl size-11 place-items-center bg-warning-fill shrink-0">
					<img src={ConfigKey.WIG_COIN_ICON} alt="" className="size-7" />
				</span>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-bold text-fg-strong">
						{faNumber(pkg.coin)} ویج‌کوین
					</p>
					<p className="truncate text-2xs text-fg-muted">{pkg.title}</p>
				</div>
				<Button
					color="brand"
					size="sm"
					onClick={() => checkout(pkg)}
					loading={payingPackageId === pkg.id}
					loadingText="انتقال به درگاه..."
				>
					{faNumber(pkg.price)} تومان
				</Button>
			</div>
			<button
				type="button"
				onClick={onSeeAll}
				className="font-semibold rounded-sm cursor-pointer text-2xs text-brand hover:underline focus-visible:focus-ring"
			>
				بسته‌های دیگه رو ببین
			</button>
		</div>
	)
}
