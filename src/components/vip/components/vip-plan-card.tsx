import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'
import type { VipPlan } from '@/services/hooks/market/market-vip.interface'

interface VipPlanCardProps {
	plan: VipPlan
	isSelected: boolean
	onSelect: () => void
}

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

export function VipPlanCard({
	plan,
	isSelected,
	onSelect,
}: VipPlanCardProps) {
	const badgeText =
		plan.meta?.badge === 'popular'
			? 'محبوب'
			: plan.meta?.badge

	return (
		<div
			onClick={onSelect}
			className={cn(
				'relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-right min-h-[125px] group',
				isSelected
					? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
					: 'border-base-content/10 bg-base-300/20 hover:border-primary/40 hover:bg-base-300/40'
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2">
					<div
						className={cn(
							'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
							isSelected
								? 'border-primary bg-primary text-white'
								: 'border-base-content/25 bg-base-300/50 group-hover:border-primary/50'
						)}
					>
						{isSelected && <Icon name="check" size={10} />}
					</div>

					<h4 className="text-sm font-bold text-content leading-tight">
						{plan.title}
					</h4>
				</div>

				{badgeText && (
					<span
						className={cn(
							'px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors shrink-0',
							isSelected
								? 'bg-primary text-white'
								: 'bg-primary/15 text-primary'
						)}
					>
						{badgeText}
					</span>
				)}
			</div>

			<div className="mt-3.5 pt-2.5 border-t border-base-content/5 space-y-0.5">
				<div className="flex items-baseline gap-1">
					<span className="text-base sm:text-lg font-black text-content tabular-nums">
						{fmt(plan.price)}
					</span>
					<span className="text-xs text-muted">تومان</span>
				</div>
				<p className="text-[11px] text-muted">
					{fmt(plan.days)} روز اعتبار
				</p>
			</div>
		</div>
	)
}
