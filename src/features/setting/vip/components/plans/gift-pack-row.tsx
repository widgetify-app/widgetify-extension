import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'
import type { VipPlan } from '@/services/market/market-vip.interface'
import { formatNumber } from '../../utils/format'

interface GiftPackRowProps {
	plan: VipPlan
	isClaiming: boolean
	onClaim: () => void
}

export function GiftPackRow({ plan, isClaiming, onClaim }: GiftPackRowProps) {
	const isUsed = Boolean(plan.isClaimed)

	return (
		<div
			className={cn(
				'flex flex-wrap items-center gap-3.5 px-4 py-3 border border-dashed rounded-2xl',
				isUsed ? 'bg-fill border-line' : 'bg-vip-fill border-vip-fill-2'
			)}
		>
			<span
				className={cn(
					'grid border shrink-0 size-10 place-items-center rounded-xl bg-surface border-surface-3',
					isUsed ? 'text-fg-muted' : 'text-vip'
				)}
			>
				<Icon name="gift" size={20} />
			</span>
			<span className="flex flex-col flex-1 min-w-0">
				<span
					className={cn(
						'text-sm font-extrabold',
						isUsed ? 'text-fg-muted' : 'text-fg-strong'
					)}
				>
					{plan.title}
				</span>
				<span className="text-xs text-fg-muted">
					{t('setting.vip.giftBody', { days: formatNumber(plan.days) })}
				</span>
			</span>
			{isUsed ? (
				<span className="inline-flex items-center gap-1.5 px-3 text-xs font-bold rounded-full h-7.5 bg-fill-2 text-fg-muted">
					<Icon name="check" size={14} />
					{t('setting.vip.giftUsed')}
				</span>
			) : (
				<Button
					variant="outline"
					color="vip"
					size="sm"
					className="font-extrabold bg-surface"
					loading={isClaiming}
					loadingText={t('setting.vip.giftClaiming')}
					disabled={isClaiming}
					onClick={onClaim}
				>
					{t('setting.vip.giftClaim')}
				</Button>
			)}
		</div>
	)
}
