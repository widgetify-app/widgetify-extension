import { type ComponentType, useId } from 'react'
import { type MessageKey, t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon, type IconName } from '@/icons'
import { PAUSED_LOOPS_CLASS } from '../../constants'
import { useInView } from '../../hooks/use-in-view'
import { SectionHeading } from '../section-heading'
import { GalleryDemo } from './gallery-demo'
import { LayoutDemo } from './layout-demo'
import { SizesDemo } from './sizes-demo'
import { VideoDemo } from './video-demo'

interface Perk {
	icon: IconName
	title: MessageKey
	body: MessageKey
	Demo: ComponentType
	centered: boolean
}

const PERKS: Perk[] = [
	{
		icon: 'layout',
		title: 'setting.vip.layoutTitle',
		body: 'setting.vip.layoutBody',
		Demo: LayoutDemo,
		centered: true,
	},
	{
		icon: 'outlineSquares2X2',
		title: 'setting.vip.sizesTitle',
		body: 'setting.vip.sizesBody',
		Demo: SizesDemo,
		centered: false,
	},
	{
		icon: 'videoCamera',
		title: 'setting.vip.videoTitle',
		body: 'setting.vip.videoBody',
		Demo: VideoDemo,
		centered: true,
	},
	{
		icon: 'images',
		title: 'setting.vip.galleryTitle',
		body: 'setting.vip.galleryBody',
		Demo: GalleryDemo,
		centered: false,
	},
]

export function FeatureGrid() {
	const titleId = useId()
	const [sectionRef, inView] = useInView<HTMLElement>()

	return (
		<section
			ref={sectionRef}
			aria-labelledby={titleId}
			className={cn('flex flex-col gap-4', !inView && PAUSED_LOOPS_CLASS)}
		>
			<SectionHeading
				id={titleId}
				title={t('setting.vip.featuresTitle')}
				description={t('setting.vip.featuresBody')}
			/>
			<div className="grid gap-4 @2xl:grid-cols-2">
				{PERKS.map(({ icon, title, body, Demo, centered }) => (
					<article
						key={title}
						className="flex flex-col overflow-hidden border rounded-2xl bg-surface-2 border-surface-3"
					>
						<div
							aria-hidden="true"
							className={cn(
								'relative overflow-hidden border-b h-43 bg-vip-fill border-surface-3',
								centered && 'flex items-center justify-center'
							)}
						>
							<Demo />
						</div>
						<div className="flex gap-3 p-4">
							<span className="grid rounded-xl shrink-0 size-9.5 place-items-center bg-vip-fill text-vip">
								<Icon name={icon} size={20} />
							</span>
							<div>
								<h4 className="text-base font-extrabold text-fg-strong">
									{t(title)}
								</h4>
								<p className="mt-1 text-xs leading-relaxed text-fg-muted">
									{t(body)}
								</p>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}
