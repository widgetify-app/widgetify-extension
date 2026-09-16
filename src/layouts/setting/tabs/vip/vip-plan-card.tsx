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
	const isPopular = plan.meta?.isPopular || plan.meta?.badge === 'popular'
	const isClaimed = Boolean(plan.isClaimed)

	return (
		<div
			onClick={() => !isClaimed && onSelect(plan)}
			className={cn(
				'relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all text-right min-h-24 group',
				isClaimed
					? 'opacity-65 border-dashed border-base-content/20 bg-base-300/10 cursor-not-allowed saturate-50'
					: isSelected
						? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs cursor-pointer'
						: 'border-base-content/10 bg-base-300/20 hover:border-primary/40 hover:bg-base-300/40 cursor-pointer'
			)}
		>
			{isPopular && !isClaimed && (
				<div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-content text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
					محبوب‌ترین
				</div>
			)}

			{isClaimed && (
				<div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-base-content/20 text-muted text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
					<Icon name="check" size={10} />
					<span>استفاده شده</span>
				</div>
			)}

			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2">
					<h5
						className={cn(
							'text-xs font-bold',
							isClaimed ? 'text-muted' : 'text-content'
						)}
					>
						{plan.title}
					</h5>
					<span className="text-[10px] text-muted">
						{fmt(plan.days)} روز اعتبار
					</span>
				</div>

				<div
					className={cn(
						'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
						isClaimed
							? 'border-base-content/20 bg-base-300/30 text-muted'
							: isSelected
								? 'border-primary bg-primary text-primary-content'
								: 'border-base-content/25 bg-base-300/50 group-hover:border-primary/50'
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
								isClaimed ? 'text-muted' : 'text-success'
							)}
						>
							{isClaimed ? 'قبلاً دریافت شده' : 'رایگان'}
						</span>
					) : (
						<>
							<span className="text-base font-black text-content tabular-nums">
								{fmt(plan.price)}
							</span>
							<span className="text-[11px] text-muted">تومان</span>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
