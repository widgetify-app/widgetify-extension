import { useRef, useState } from 'react'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'
import { useFreeWidgets } from '@/context/free-widget/free-widget.context'
import { useAppearance } from '@/context/appearance.context'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { safeAwait } from '@/services/api'
import { uploadWidgetMediaApi } from '@/services/hooks/widgets/widget-media.hook'
import { callEvent } from '@/common/utils/call-event'
import { GalleryPickerModal } from '@/components/gallery'
import {
	PopoverMenu,
	PopoverMenuItem,
	PopoverMenuDivider,
	PopoverMenuHeader,
	VipBadge,
} from '@/components/ui'
import type { AxiosError } from 'axios'
import type { GalleryAsset } from '@/services/hooks/gallery/get-gallery-assets.hook'
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
	const { canvasMode } = useAppearance()
	const { isVip } = useAuth()
	const { blurMode } = useGeneralSetting()
	const inputRef = useRef<HTMLInputElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)

	const [isUploading, setIsUploading] = useState(false)
	const [isGalleryOpen, setIsGalleryOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [failedSrc, setFailedSrc] = useState<string | null>(null)

	const imageSrc = meta?.imageSrc
	const isCustom = meta?.isCustom
	const hasFailed = Boolean(imageSrc) && failedSrc === imageSrc

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		e.target.value = ''
		if (!file) return

		if (!isVip) {
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
		const [err, res] = await safeAwait<AxiosError, { url: string }>(
			uploadWidgetMediaApi(instanceId, file)
		)
		setIsUploading(false)

		if (err || !res?.url) {
			showToast(translateError(err) as string, 'error')
			return
		}

		updateWidgetSettings(instanceId, { imageSrc: res.url, isCustom: true })
	}

	const handleOpenMenu = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (canvasMode === 'edit' || isUploading) return
		setIsMenuOpen((isOpen) => !isOpen)
	}

	const handleSelectFromSystem = () => {
		setIsMenuOpen(false)
		if (!isVip) {
			callEvent('openSettings', 'vip')
			return
		}
		inputRef.current?.click()
	}

	const handleOpenGallery = () => {
		setIsMenuOpen(false)
		setIsGalleryOpen(true)
	}

	const handleRemovePhoto = () => {
		setIsMenuOpen(false)
		if (instanceId) {
			updateWidgetSettings(instanceId, {
				imageSrc: undefined,
				isCustom: undefined,
			})
			showToast('عکس با موفقیت حذف شد', 'success')
		}
	}

	const handleGallerySelect = (asset: GalleryAsset) => {
		if (instanceId) {
			updateWidgetSettings(instanceId, {
				imageSrc: asset.url,
				isCustom: false,
			})
		}
	}

	return (
		<>
			<WidgetContainer
				background={false}
				padding={false}
				contentClassName="w-full h-full relative"
				className="w-full h-full"
			>
				<button
					ref={triggerRef}
					type="button"
					onClick={handleOpenMenu}
					aria-haspopup="menu"
					aria-expanded={isMenuOpen}
					aria-label={
						imageSrc ? 'تغییر عکس قاب عکس' : 'انتخاب عکس برای قاب عکس'
					}
					className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden cursor-pointer group rounded-widget focus-visible:focus-ring"
				>
					{imageSrc && !hasFailed && (
						<img
							src={imageSrc}
							alt=""
							onError={() => setFailedSrc(imageSrc)}
							className={`object-cover w-full h-full rounded-widget ${
								isCustom && blurMode
									? 'blur-mode blur-xl!'
									: 'disabled-blur-mode'
							}`}
						/>
					)}

					{hasFailed && (
						<span className="flex flex-col items-center justify-center w-full h-full gap-2 p-3 text-center select-none rounded-widget bg-content bg-glass">
							<Icon
								name="alert"
								size={18}
								className="text-muted"
								aria-hidden="true"
							/>
							<span className="text-[11px] leading-tight text-muted">
								عکس بارگذاری نشد، یکی دیگه انتخاب کن
							</span>
						</span>
					)}

					{!imageSrc && <PhotoEmptyState size={size} />}
				</button>

				{isUploading && (
					<div
						role="status"
						className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-content bg-glass rounded-widget"
					>
						<span
							aria-hidden="true"
							className="w-5 h-5 border-2 rounded-full border-brand-muted border-t-primary animate-spin"
						/>
						<span className="text-xs font-medium text-content">
							در حال بارگذاری...
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
			</WidgetContainer>

			<PopoverMenu
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				triggerRef={triggerRef}
				width={210}
				placement="bottom-center"
			>
				<PopoverMenuHeader>
					<span>مدیریت قاب عکس</span>
				</PopoverMenuHeader>

				<PopoverMenuItem
					icon={<Icon name="uploadImage" size={14} />}
					label="بارگذاری از دستگاه"
					badge={!isVip ? <VipBadge size="xs" /> : undefined}
					onClick={handleSelectFromSystem}
				/>

				<PopoverMenuItem
					icon={<Icon name="image" size={14} />}
					label="گالری ویجتیفای"
					onClick={handleOpenGallery}
				/>

				{imageSrc && (
					<>
						<PopoverMenuDivider />
						<PopoverMenuItem
							icon={<Icon name="trash" size={14} />}
							label="حذف عکس فعلی"
							variant="danger"
							onClick={handleRemovePhoto}
						/>
					</>
				)}
			</PopoverMenu>

			<GalleryPickerModal
				isOpen={isGalleryOpen}
				onClose={() => setIsGalleryOpen(false)}
				type="PHOTO_FRAME"
				title="گالری تصاویر قاب عکس"
				onSelect={handleGallerySelect}
				selectedAssetUrl={imageSrc}
			/>
		</>
	)
}
