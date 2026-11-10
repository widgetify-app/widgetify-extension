import Analytics from '@/analytics'
import phonesArt from '@/assets/images/mobile-promo/phones.webp'
import { t } from '@/common/i18n'
import { Motion as motion } from '@/common/motion'
import { Icon } from '@/icons'
import { MOBILE_PROMO_URL } from '../utils/mobile-promo-url'
import { QrCode } from './qr-code'

interface MobilePromoCardProps {
	onClose: () => void
}

export function MobilePromoCard({ onClose }: MobilePromoCardProps) {
	return (
		<motion.div
			initial={{ y: 32, opacity: 0, scale: 0.96 }}
			animate={{ y: 0, opacity: 1, scale: 1 }}
			transition={{ type: 'spring', stiffness: 420, damping: 32 }}
			className="fixed bottom-20 start-4 z-float w-88 max-w-[calc(100%-2rem)]"
		>
			<div
				role="status"
				className="flex flex-col gap-3 p-3 border shadow-xl rounded-widget border-line bg-glass-modal"
			>
				<div className="relative h-50 overflow-hidden rounded-2xl bg-brand-fill">
					<img
						src={phonesArt}
						alt=""
						width={328}
						height={200}
						className="object-cover object-bottom size-full"
					/>
					<button
						type="button"
						aria-label={t('ui.common.close')}
						onClick={onClose}
						className="absolute grid rounded-full shadow-sm cursor-pointer top-2 end-2 size-8 place-items-center bg-glass-modal text-fg-muted transition-ui hover:text-fg-strong focus-visible:focus-ring"
					>
						<Icon name="close" size={14} aria-hidden="true" />
					</button>
				</div>
				<div className="flex items-center gap-3 px-1 pb-1">
					<div className="flex flex-col flex-1 min-w-0 gap-1.5">
						<span className="text-sm font-bold leading-relaxed text-fg-strong">
							{t('mobilePromo.title')}
						</span>
						<span className="text-xs leading-loose text-fg-muted">
							{t('mobilePromo.text')}
						</span>
						<a
							href={MOBILE_PROMO_URL}
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => Analytics.event('mobile_promo_link_opened')}
							className="flex items-center gap-1 text-xs font-bold rounded-sm w-fit text-brand transition-ui hover:underline focus-visible:focus-ring"
						>
							{t('mobilePromo.link')}
							<Icon name="externalLink" size={12} aria-hidden="true" />
						</a>
					</div>
					<QrCode
						text={MOBILE_PROMO_URL}
						label={t('mobilePromo.qrLabel')}
						className="overflow-hidden border size-31 shrink-0 rounded-2xl border-line"
					/>
				</div>
			</div>
		</motion.div>
	)
}
