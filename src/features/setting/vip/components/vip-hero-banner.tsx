import type { ComponentType } from 'react'
import { type MessageKey, t } from '@/common/i18n'
import { VipBadge } from '@/components/ui'
import { Icon } from '@/icons'
import heroArt from '@/assets/images/pro/hero-pro.webp'
import {
	GalleryCardArt,
	LayoutCardArt,
	WallpaperCardArt,
	WidgetsCardArt,
} from './vip-feature-art'
import type { VipFeatureId } from './vip-features-modal'

interface BenefitCard {
	id: VipFeatureId
	title: MessageKey
	body: MessageKey
	Art: ComponentType
}

const BENEFITS: BenefitCard[] = [
	{
		id: 'layout',
		title: 'setting.vipHero.layoutFreedomTitle',
		body: 'setting.vipHero.layoutFreedomBody',
		Art: LayoutCardArt,
	},
	{
		id: 'widgets',
		title: 'setting.vipHero.widgetsAccessTitle',
		body: 'setting.vipHero.widgetsAccessBody',
		Art: WidgetsCardArt,
	},
	{
		id: 'wallpaper',
		title: 'setting.vipHero.videoWallpaperTitle',
		body: 'setting.vipHero.videoWallpaperBody',
		Art: WallpaperCardArt,
	},
	{
		id: 'gallery',
		title: 'setting.vipHero.galleryAccessTitle',
		body: 'setting.vipHero.galleryAccessBody',
		Art: GalleryCardArt,
	},
]

interface VipHeroBannerProps {
	onOpenFeature: (feature: VipFeatureId) => void
}

export function VipHeroBanner({ onOpenFeature }: VipHeroBannerProps) {
	return (
		<div>
			<section className="relative overflow-hidden h-62 rounded-2xl bg-brand">
				<img
					src={heroArt}
					alt=""
					className="absolute inset-0 object-cover object-left w-full h-full"
				/>
				<div className="absolute top-0 bottom-16 start-0 flex w-full flex-col justify-center gap-3 px-8 sm:w-3/5">
					<VipBadge text={t('setting.vip.proLabel')} className="self-start" />
					<h2 className="text-3xl font-black text-image-fg">
						{t('setting.vipHero.title')}
					</h2>
					<p className="text-sm text-image-fg">
						{t('setting.vipHero.subtitle')}
					</p>
				</div>
			</section>
			<div className="relative grid grid-cols-2 gap-4 mx-6 -mt-16 md:grid-cols-4">
				{BENEFITS.map(({ id, title, body, Art }) => (
					<button
						key={id}
						type="button"
						aria-haspopup="dialog"
						onClick={() => onOpenFeature(id)}
						className="flex flex-col gap-3 p-4 text-start border cursor-pointer rounded-2xl border-surface-3 bg-surface-2 shadow-md transition-ui hover:border-brand-muted focus-visible:focus-ring"
					>
						<span
							aria-hidden="true"
							className="relative flex items-center justify-center gap-1.5 overflow-hidden border h-14 rounded-xl border-surface-3 bg-surface"
						>
							<Art />
						</span>
						<span className="flex flex-col gap-0.5">
							<span className="text-sm font-bold text-fg-strong">
								{t(title)}
							</span>
							<span className="text-xs min-h-9 text-fg-muted">
								{t(body)}
							</span>
						</span>
						<span className="inline-flex items-center gap-0.5 mt-auto text-xs font-bold text-brand">
							{t('setting.vipHero.details')}
							<Icon name="chevronLeft" size={14} />
						</span>
					</button>
				))}
			</div>
		</div>
	)
}
