import { cn } from '@/common/utils/cn'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { CoinAmount } from './store-item/coin-amount'

interface WalletCardProps {
	selected: boolean
	onOpen: () => void
}

export function WalletCard({ selected, onOpen }: WalletCardProps) {
	const { isAuthenticated, user } = useAuth()

	return (
		<button
			type="button"
			onClick={onOpen}
			aria-current={selected ? 'page' : undefined}
			className={cn(
				'flex flex-col gap-1 p-3 text-start border rounded-2xl cursor-pointer shrink-0 transition-ui focus-visible:focus-ring max-md:flex-row max-md:items-center max-md:gap-3 max-md:py-2',
				selected
					? 'border-brand bg-brand-fill'
					: 'border-warning-fill-2 bg-warning-fill hover:border-warning'
			)}
		>
			<span className="text-2xs text-fg-muted max-md:hidden">موجودی ویج‌کوین</span>
			{isAuthenticated ? (
				<CoinAmount amount={user?.coins ?? 0} size="md" />
			) : (
				<span className="text-xs font-semibold text-fg">هنوز وارد نشدی</span>
			)}
			<span className="flex items-center gap-1 font-bold text-2xs text-brand">
				{isAuthenticated ? 'افزایش موجودی' : 'ببین چطور کار می‌کنه'}
				<Icon name="chevronLeft" size={12} />
			</span>
		</button>
	)
}
