import { t } from '@/common/i18n'
import { getContrastingTextColor } from '@/common/utils/color'
import { cn } from '@/common/utils/cn'
import type { VipPlan } from '@/services/market/market-vip.interface'

interface VipPlanCardProps {
	plan: VipPlan
	note: string
	highlightNote: boolean
	isSelected: boolean
	onSelect: (plan: VipPlan) => void
}

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

export function VipPlanCard({
	plan,
	note,
	highlightNote,
	isSelected,
	onSelect,
}: VipPlanCardProps) {
	const badge = plan.meta?.badge
	const badgeColor = plan.meta?.badgeColor
	const isClaimed = Boolean(plan.isClaimed)

	return (
		<button
			type="button"
			disabled={isClaimed}
			aria-pressed={isSelected}
			onClick={() => !isClaimed && onSelect(plan)}
			className={cn(
				'relative flex flex-col gap-2 w-full px-5 py-3 rounded-2xl border text-start transition-ui focus-visible:focus-ring',
				isClaimed
					? 'border-surface-3 bg-fill opacity-65 cursor-not-allowed'
					: isSelected
						? 'border-brand bg-brand-fill ring-1 ring-brand cursor-pointer'
						: 'border-surface-3 bg-surface-2 hover:border-brand-muted cursor-pointer'
			)}
		>
			{badge && !isClaimed && (
				<span
					style={
						badgeColor
							? {
									backgroundColor: badgeColor,
									color: getContrastingTextColor(badgeColor),
								}
							: undefined
					}
					className={cn(
						'absolute -top-2.5 end-4 px-2 py-0.5 text-2xs font-bold rounded-full shadow-sm',
						!badgeColor && 'bg-brand text-on-brand'
					)}
				>
					{badge}
				</span>
			)}

			{isClaimed && (
				<span className="absolute -top-2.5 end-4 px-2 py-0.5 text-2xs font-bold rounded-full bg-surface text-fg-muted">
					{t('setting.vipPlan.used')}
				</span>
			)}

			<span className="flex items-center justify-between gap-2">
				<span className="text-sm font-bold text-fg-strong">{plan.title}</span>
				<span
					className={cn(
						'w-4 h-4 rounded-full shrink-0 bg-surface transition-ui',
						isSelected ? 'border-4 border-brand' : 'border border-line'
					)}
				/>
			</span>

			{plan.price === 0 ? (
				<span className="text-xl font-black text-fg-strong">
					{isClaimed
						? t('setting.vipPlan.alreadyClaimed')
						: t('setting.vipPlan.free')}
				</span>
			) : (
				<span className="flex items-baseline gap-1">
					<span className="text-xl font-black text-fg-strong tabular-nums">
						{fmt(plan.price)}
					</span>
					<span className="text-xs text-fg-muted">
						{t('setting.vipPlan.currencyToman')}
					</span>
				</span>
			)}

			<span
				className={cn(
					'text-xs',
					highlightNote ? 'font-bold text-brand' : 'text-fg-muted'
				)}
			>
				{note}
			</span>
		</button>
	)
}
