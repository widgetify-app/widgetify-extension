import type { ComponentType } from 'react'
import { type MessageKey, t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Button, Modal } from '@/components/ui'
import { Icon } from '@/icons'
import {
	DEFAULT_VIP_MAX_UPLOAD_SIZE,
	useGetWallpaperConfig,
} from '@/services/wallpapers/get-wallpaper-config.hook'
import stageArt from '@/assets/images/pro/stage.webp'
import {
	GalleryStage,
	LayoutStage,
	MoreStage,
	WallpaperStage,
	WidgetsStage,
} from './vip-feature-art'

export const VIP_FEATURE_IDS = [
	'layout',
	'widgets',
	'wallpaper',
	'gallery',
	'more',
] as const

export type VipFeatureId = (typeof VIP_FEATURE_IDS)[number]

interface FeaturePage {
	title: MessageKey
	body: MessageKey
	Stage: ComponentType<{ maxUploadSize: number }>
}

const PAGES: Record<VipFeatureId, FeaturePage> = {
	layout: {
		title: 'setting.vipFeatures.layoutTitle',
		body: 'setting.vipFeatures.layoutBody',
		Stage: LayoutStage,
	},
	widgets: {
		title: 'setting.vipFeatures.widgetsTitle',
		body: 'setting.vipFeatures.widgetsBody',
		Stage: WidgetsStage,
	},
	wallpaper: {
		title: 'setting.vipFeatures.wallpaperTitle',
		body: 'setting.vipFeatures.wallpaperBody',
		Stage: WallpaperStage,
	},
	gallery: {
		title: 'setting.vipFeatures.galleryTitle',
		body: 'setting.vipFeatures.galleryBody',
		Stage: GalleryStage,
	},
	more: {
		title: 'setting.vipFeatures.moreTitle',
		body: 'setting.vipFeatures.moreBody',
		Stage: MoreStage,
	},
}

const faNumber = new Intl.NumberFormat('fa-IR')

interface VipFeaturesModalProps {
	isOpen: boolean
	page: number
	onPageChange: (page: number) => void
	onClose: () => void
	onActivate: () => void
	activateLabel: string
}

export function VipFeaturesModal({
	isOpen,
	page,
	onPageChange,
	onClose,
	onActivate,
	activateLabel,
}: VipFeaturesModalProps) {
	const { data: config } = useGetWallpaperConfig()
	const count = VIP_FEATURE_IDS.length
	const { title, body, Stage } = PAGES[VIP_FEATURE_IDS[page]]
	const goTo = (next: number) => onPageChange((next + count) % count)

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="lg"
			showCloseButton={false}
			className="p-0 md:p-0"
		>
			<section
				aria-label={t('setting.vipFeatures.label')}
				className="flex flex-col"
			>
				<div
					className="relative grid h-80 -mx-0.5 overflow-hidden bg-center bg-cover md:-mx-1 rounded-t-widget place-items-center"
					style={{ backgroundImage: `url(${stageArt})` }}
				>
					<button
						type="button"
						onClick={onClose}
						aria-label={t('ui.common.close')}
						className="absolute z-10 grid w-8 h-8 border rounded-lg cursor-pointer top-3.5 left-3.5 place-items-center bg-image-fill border-image-line text-image-fg transition-ui hover:bg-scrim-soft focus-visible:focus-ring"
					>
						<Icon name="close" size={16} />
					</button>
					<div aria-hidden="true" className="contents">
						<Stage
							maxUploadSize={
								config?.maxUploadSizeVip ?? DEFAULT_VIP_MAX_UPLOAD_SIZE
							}
						/>
					</div>
				</div>
				<div className="flex flex-col items-center gap-4 px-6 pt-5 pb-6 text-center">
					<div>
						<h2 className="text-lg font-bold text-fg-strong">{t(title)}</h2>
						<p className="mt-1 text-sm text-fg-muted">{t(body)}</p>
					</div>
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => goTo(page - 1)}
							aria-label={t('ui.common.previous')}
							className="grid rounded-xl cursor-pointer w-9 h-9 place-items-center bg-fill text-fg-muted transition-ui hover:bg-fill-2 focus-visible:focus-ring"
						>
							<Icon name="chevronRight" size={20} />
						</button>
						<span className="flex items-center gap-1.5">
							{VIP_FEATURE_IDS.map((id, index) => (
								<button
									key={id}
									type="button"
									onClick={() => goTo(index)}
									aria-label={t('setting.vipFeatures.page', {
										p0: faNumber.format(index + 1),
									})}
									aria-current={index === page ? 'step' : undefined}
									className={cn(
										'h-1.5 rounded-full cursor-pointer transition-[width,background-color] duration-200 focus-visible:focus-ring',
										index === page
											? 'w-4.5 bg-brand'
											: 'w-1.5 bg-fill-3'
									)}
								/>
							))}
						</span>
						<button
							type="button"
							onClick={() => goTo(page + 1)}
							aria-label={t('ui.common.next')}
							className="grid rounded-xl cursor-pointer w-9 h-9 place-items-center bg-fill text-fg-muted transition-ui hover:bg-fill-2 focus-visible:focus-ring"
						>
							<Icon name="chevronLeft" size={20} />
						</button>
					</div>
					<Button
						color="brand"
						size="md"
						rounded="xl"
						fullWidth
						onClick={onActivate}
					>
						<Icon name="diamond" size={14} />
						<span>{activateLabel}</span>
					</Button>
				</div>
			</section>
		</Modal>
	)
}
