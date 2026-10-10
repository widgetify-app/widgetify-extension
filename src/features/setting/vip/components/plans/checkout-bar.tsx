import { t } from '@/common/i18n'
import { Button } from '@/components/ui'
import { Icon, type IconName } from '@/icons'
import { formatNumber } from '../../utils/format'

interface CheckoutBarProps {
	icon: IconName
	title: string
	detail: string
	price: number
	cta: string
	ctaIcon?: IconName
	isPending: boolean
	onPay: () => void
}

export function CheckoutBar({
	icon,
	title,
	detail,
	price,
	cta,
	ctaIcon,
	isPending,
	onPay,
}: CheckoutBarProps) {
	return (
		<div className="sticky z-30 flex flex-wrap items-center p-3.5 mt-auto border shadow-xl bottom-3 gap-x-4 gap-y-3 ps-4.5 rounded-2xl bg-glass-modal border-surface-3">
			<span className="grid shrink-0 size-11.5 place-items-center rounded-xl bg-vip-fill text-vip">
				<Icon name={icon} size={24} />
			</span>
			<div key={title} className="flex flex-col min-w-0 animate-pro-slide-in">
				<span className="text-base font-black text-fg-strong">{title}</span>
				<span className="text-xs font-semibold text-fg-muted">{detail}</span>
			</div>
			<div className="flex flex-col ms-auto">
				<span className="text-xs font-semibold text-fg-muted">
					{t('setting.vip.payableAmount')}
				</span>
				<span
					key={price}
					className="flex items-baseline gap-1.25 animate-pro-slide-in"
				>
					<span className="text-2xl font-black text-fg-strong">
						{formatNumber(price)}
					</span>
					<span className="text-xs font-bold text-fg-muted">
						{t('setting.vip.currencyToman')}
					</span>
				</span>
			</div>
			<Button
				color="vip"
				size="lg"
				rounded="2xl"
				loading={isPending}
				loadingText={t('setting.vip.transferring')}
				disabled={isPending}
				onClick={onPay}
				className="relative w-full gap-2.5 overflow-hidden text-base font-black h-13 px-6.5 @xl:w-auto hover:-translate-y-0.5 shadow-[0_12px_26px_-12px_var(--color-vip)]"
			>
				<span
					aria-hidden="true"
					className="absolute inset-y-0 -right-22.5 w-17.5 bg-linear-to-r from-transparent via-image-fill to-transparent animate-pro-sheen"
				/>
				{ctaIcon && <Icon name={ctaIcon} size={20} />}
				{cta}
				<Icon name="arrowLeft" size={20} />
			</Button>
		</div>
	)
}
