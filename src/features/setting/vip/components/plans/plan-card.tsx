import { t } from '@/common/i18n'
import { getContrastingTextColor } from '@/common/utils/color'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { formatNumber } from '../../utils/format'
import { inThousands, type PlanOffer } from '../../utils/plan-offers'
import { Mascot } from '../mascot'

interface PlanCardProps {
	offer: PlanOffer
	isSelected: boolean
	footnote: string
	onSelect: () => void
}

function monthlyLabel(monthlyPrice: number | null): string {
	if (monthlyPrice === null) return ''
	const price = formatNumber(inThousands(monthlyPrice))
	return monthlyPrice % 1000 === 0
		? t('setting.vip.monthlyExact', { price })
		: t('setting.vip.monthlyAbout', { price })
}

export function PlanCard({ offer, isSelected, footnote, onSelect }: PlanCardProps) {
	const { plan, fullPrice, discountPercent, isBestValue } = offer
	const badge = plan.meta?.badge
	const badgeColor = plan.meta?.badgeColor
	const ribbon = badge || (isBestValue ? t('setting.vip.bestValue') : null)

	return (
		<button
			type="button"
			aria-pressed={isSelected}
			onClick={onSelect}
			className={cn(
				'relative flex flex-col gap-3 p-5 pb-4.5 border-2 text-start cursor-pointer min-h-45 rounded-2xl transition-ui duration-300 focus-visible:focus-ring',
				isSelected
					? 'border-vip bg-vip-fill shadow-[0_20px_40px_-24px_var(--color-vip)]'
					: 'border-surface-3 bg-surface-2 hover:border-vip-fill-2'
			)}
		>
			{ribbon && (
				<span
					style={
						badge && badgeColor
							? {
									backgroundColor: badgeColor,
									color: getContrastingTextColor(badgeColor),
								}
							: undefined
					}
					className="absolute inline-flex items-center gap-1 px-3 text-xs font-black rounded-full shadow-md -top-3.5 right-4.5 h-6.5 bg-warning text-on-warning"
				>
					<Icon name="sparkle" size={12} />
					{ribbon}
				</span>
			)}
			{isSelected && (
				<span
					aria-hidden="true"
					className="absolute hidden w-16 overflow-hidden -top-13.5 left-4.5 h-14 @2xl:block"
				>
					<span className="block animate-pro-peek">
						<Mascot pose="peek" className="w-16" />
					</span>
				</span>
			)}

			<span className="flex items-center gap-2.5">
				<span
					className={cn(
						'grid border-2 rounded-full shrink-0 size-5.5 place-items-center transition-ui duration-200',
						isSelected ? 'border-vip' : 'border-fg-ghost'
					)}
				>
					<span
						className={cn(
							'rounded-full size-2.5 bg-vip transition-ui duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
							isSelected ? 'scale-100' : 'scale-0'
						)}
					/>
				</span>
				<span className="text-base font-black text-fg-strong">{plan.title}</span>
				{discountPercent > 0 && (
					<span className="inline-flex items-center h-6 px-2.5 text-xs font-extrabold rounded-full ms-auto shrink-0 bg-warning-fill-2 text-fg-strong">
						{t('setting.vip.discount', {
							percent: formatNumber(discountPercent),
						})}
					</span>
				)}
			</span>

			<span className="flex flex-wrap items-baseline gap-x-1.5">
				<span className="text-3xl font-black text-fg-strong">
					{formatNumber(plan.price)}
				</span>
				<span className="text-xs font-bold text-fg-muted">
					{t('setting.vip.currencyToman')}
				</span>
				{fullPrice !== null && (
					<span className="text-xs font-semibold line-through ms-1 text-fg-muted">
						{formatNumber(fullPrice)}
					</span>
				)}
			</span>

			<span className="h-px mt-auto bg-line" />
			<span className="flex justify-between gap-2 text-xs font-semibold text-fg-muted">
				<span>{monthlyLabel(offer.monthlyPrice)}</span>
				<span>{footnote}</span>
			</span>
		</button>
	)
}
