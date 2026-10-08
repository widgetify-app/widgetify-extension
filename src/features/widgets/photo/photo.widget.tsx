import { useRef, useState } from 'react'
import Analytics from '@/analytics'
import { WidgetContainer } from '../components/widget-container'
import { WidgetMenuButton } from '../components/widget-menu-button'
import type { WidgetSize } from '../utils/layout-engine/types'
import { useWidgetMenuActions } from '../widget-menu.context'
import { useFreeWidgets } from '@/features/widgets/widgets.context'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { type ApiError, safeAwait } from '@/services/api'
import { uploadWidgetMediaApi } from '@/services/widgets/widget-media.hook'
import { callEvent } from '@/common/utils/call-event'
import { GalleryPickerModal } from '@/components/gallery'
import { PopoverMenuItem, Spinner, VipBadge } from '@/components/ui'
import type { GalleryAsset } from '@/services/gallery/get-gallery-assets.hook'
import { PhotoEmptyState } from './components/photo-empty-state'
import { getPhotoFileError } from './utils/get-photo-file-error'

interface PhotoWidgetProps {
	size?: WidgetSize
	meta?: { imageSrc?: string; isCustom?: boolean }
	instanceId?: string
}

export function PhotoWidget({
	size = { w: 2, h: 2 },
	meta,
	instanceId,
}: PhotoWidgetProps) {
	const { updateWidgetSettings } = useFreeWidgets()
	const { isVip } = useAuth()
	const { blurMode } = useGeneralSetting()
	const inputRef = useRef<HTMLInputElement>(null)

	const [isUploading, setIsUploading] = useState(false)
	const [isGalleryOpen, setIsGalleryOpen] = useState(false)
	const [failedSrc, setFailedSrc] = useState<string | null>(null)

	const imageSrc = meta?.imageSrc
	const isCustom = meta?.isCustom
	const hasFailed = Boolean(imageSrc) && failedSrc === imageSrc
	const showsPhoto = Boolean(imageSrc) && !hasFailed

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		e.target.value = ''
		if (!file) return

		if (!isVip) {
			Analytics.event('photo_upload_vip_required')
			callEvent('openSettings', 'vip')
			return
		}

		const fileError = getPhotoFileError(file)
		if (fileError) {
			showToast(fileError, 'error')
			return
		}

		if (!instanceId) return

		setIsUploading(true)
		const [err, res] = await safeAwait<ApiError, { url: string }>(
			uploadWidgetMediaApi(instanceId, file)
		)
		setIsUploading(false)

		if (err || !res?.url) {
			Analytics.event('photo_upload_failed')
			showToast(translateError(err) as string, 'error')
			return
		}

		updateWidgetSettings(instanceId, { imageSrc: res.url, isCustom: true })
	}

	const handleSelectFromSystem = () => {
		if (!isVip) {
			Analytics.event('photo_upload_vip_required')
			callEvent('openSettings', 'vip')
			return
		}
		inputRef.current?.click()
	}

	const handleOpenGallery = () => {
		Analytics.event('photo_gallery_opened')
		setIsGalleryOpen(true)
	}

	const handleRemovePhoto = () => {
		if (instanceId) {
			Analytics.event('photo_removed')
			updateWidgetSettings(instanceId, {
				imageSrc: undefined,
				isCustom: undefined,
			})
			showToast('عکس برداشته شد', 'success')
		}
	}

	const handleGallerySelect = (asset: GalleryAsset) => {
		if (instanceId) {
			Analytics.event('photo_gallery_selected')
			updateWidgetSettings(instanceId, {
				imageSrc: asset.url,
				isCustom: false,
			})
		}
	}

	useWidgetMenuActions(
		<>
			<PopoverMenuItem
				icon={<Icon name="uploadImage" size={14} />}
				label="عکس از دستگاه"
				badge={!isVip ? <VipBadge size="xs" /> : undefined}
				onClick={handleSelectFromSystem}
				disabled={isUploading}
			/>
			<PopoverMenuItem
				icon={<Icon name="image" size={14} />}
				label="انتخاب از گالری"
				onClick={handleOpenGallery}
				disabled={isUploading}
			/>
			{imageSrc && (
				<PopoverMenuItem
					icon={<Icon name="trash" size={14} />}
					label="برداشتن عکس"
					onClick={handleRemovePhoto}
					disabled={isUploading}
				/>
			)}
		</>
	)

	return (
		<>
			<WidgetContainer
				background={!showsPhoto}
				contentClassName={
					showsPhoto
						? 'rounded-widget'
						: size.w === 1 && size.h === 1
							? 'px-3 py-2.5'
							: size.h === 1
								? 'px-3 py-2.5 gap-1.5'
								: 'p-3 gap-2'
				}
			>
				{showsPhoto ? (
					<img
						src={imageSrc}
						alt=""
						onError={() => setFailedSrc(imageSrc ?? null)}
						className={`object-cover w-full h-full rounded-widget ${
							isCustom && blurMode
								? 'blur-mode blur-xl!'
								: 'disabled-blur-mode'
						}`}
					/>
				) : (
					<PhotoEmptyState
						size={size}
						hasFailed={hasFailed}
						isVip={isVip}
						onPickFromDevice={handleSelectFromSystem}
						onOpenGallery={handleOpenGallery}
					/>
				)}

				{isUploading && (
					<div
						role="status"
						className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-glass-surface-2 rounded-widget"
					>
						<Spinner aria-hidden="true" />
						<span className="text-xs font-medium text-fg">
							دارم آپلودش می‌کنم…
						</span>
					</div>
				)}

				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleUpload}
				/>
				{showsPhoto && <WidgetMenuButton placement="image" />}
			</WidgetContainer>

			<GalleryPickerModal
				isOpen={isGalleryOpen}
				onClose={() => setIsGalleryOpen(false)}
				type="PHOTO_FRAME"
				title="گالری قاب عکس"
				onSelect={handleGallerySelect}
				selectedAssetUrl={imageSrc}
			/>
		</>
	)
}
