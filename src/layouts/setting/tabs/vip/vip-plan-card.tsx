import { getContrastingTextColor } from '@/common/color'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { VipPlan } from '@/services/hooks/market/market-vip.interface'

interface VipPlanCardProps {
	plan: VipPlan
	isSelected: boolean
	onSelect: (plan: VipPlan) => void
}

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

export function VipPlanCard({ plan, isSelected, onSelect }: VipPlanCardProps) {
	const badge = plan.meta?.badge
	const badgeColor = plan.meta?.badgeColor
	const isClaimed = Boolean(plan.isClaimed)

	return (
		<div
			onClick={() => !isClaimed && onSelect(plan)}
			className={cn(
				'relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all text-right min-h-24 group',
				isClaimed
					? 'opacity-65  border-line bg-fill cursor-not-allowed saturate-50'
					: isSelected
						? 'border-brand bg-brand-fill ring-1 ring-brand shadow-xs cursor-pointer'
						: 'border-line bg-fill hover:border-brand-muted hover:bg-fill-2 cursor-pointer'
			)}
		>
			{badge && !isClaimed && (
				<div
					style={
						badgeColor
							? {
									backgroundColor: badgeColor,
									color: getContrastingTextColor(badgeColor),
								}
							: undefined
					}
					className={cn(
						'absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs',
						!badgeColor && 'bg-brand text-on-brand'
					)}
				>
					{badge}
				</div>
			)}

			{isClaimed && (
				<div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-surface text-fg-muted text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
					<span>استفاده شده</span>
				</div>
			)}

			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2">
					<h5
						className={cn(
							'text-xs font-bold',
							isClaimed ? 'text-fg-muted' : 'text-fg'
						)}
					>
						{plan.title}
					</h5>
					<span className="text-[10px] text-fg-muted">
						{fmt(plan.days)} روز اعتبار
					</span>
				</div>

				<div
					className={cn(
						'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
						isClaimed
							? 'border-line bg-fill text-fg-muted'
							: isSelected
								? 'border-brand bg-brand text-on-brand'
								: 'border-line bg-fill-2 group-hover:border-brand-muted'
					)}
				>
					{isClaimed ? (
						<Icon name="check" size={10} />
					) : (
						isSelected && <Icon name="check" size={10} />
					)}
				</div>
			</div>

			<div className="mt-2.5 space-y-1">
				<div className="flex items-baseline gap-1">
					{plan.price === 0 ? (
						<span
							className={cn(
								'text-base font-black',
								isClaimed ? 'text-fg-muted' : 'text-success'
							)}
						>
							{isClaimed ? 'قبلا دریافت شده' : 'رایگان'}
						</span>
					) : (
						<>
							<span className="text-base font-black text-fg tabular-nums">
								{fmt(plan.price)}
							</span>
							<span className="text-[11px] text-fg-muted">تومان</span>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
