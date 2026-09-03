import { useRef, useState } from 'react'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'
import { useFreeWidgets } from '@/context/free-widget/free-widget.context'
import { useAppearance } from '@/context/appearance.context'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/src/icons'
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

interface PhotoWidgetProps {
	size?: WidgetSize
	meta?: { imageSrc?: string }
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
	const inputRef = useRef<HTMLInputElement>(null)
	const triggerRef = useRef<HTMLDivElement>(null)

	const [isUploading, setIsUploading] = useState(false)
	const [isGalleryOpen, setIsGalleryOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const is1x1 = size.w === 1 && size.h === 1
	const imageSrc = meta?.imageSrc

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!isVip) {
			callEvent('openSettings', 'vip')
			return
		}

		if (!file.type.startsWith('image/')) {
			showToast('لطفا یک فایل تصویری انتخاب کن', 'error')
			return
		}

		if (file.size > 1024 * 1024) {
			showToast('حجم عکس نباید بیشتر از ۱ مگابایت باشه', 'error')
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

		updateWidgetSettings(instanceId, { imageSrc: res.url })
		showToast('عکس با موفقیت ذخیره شد', 'success')
		e.target.value = ''
	}

	const handleOpenMenu = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (canvasMode === 'edit' || isUploading) return
		setIsMenuOpen(true)
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
			updateWidgetSettings(instanceId, { imageSrc: undefined })
			showToast('عکس با موفقیت حذف شد', 'success')
		}
	}

	const handleGallerySelect = (asset: GalleryAsset) => {
		if (instanceId) {
			updateWidgetSettings(instanceId, { imageSrc: asset.url })
			showToast('عکس با موفقیت تنظیم شد', 'success')
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
				<div
					ref={triggerRef}
					onClick={handleOpenMenu}
					className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden transition-all duration-200 cursor-pointer group rounded-widget"
				>
					{imageSrc ? (
						<img
							src={imageSrc}
							className="object-cover w-full h-full rounded-widget"
						/>
					) : (
						<div className="flex flex-col items-center justify-center w-full h-full gap-2 p-4 text-center rounded-widget bg-content bg-glass">
							<div className="flex items-center justify-center w-10 h-10 transition-colors rounded-xl bg-base-300/60 text-muted group-hover:text-primary">
								<Icon name="image" size={is1x1 ? 18 : 22} />
							</div>
							{!is1x1 && (
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold text-content">
										انتخاب تصویر
									</span>
									<span className="text-[11px] text-muted">
										برای تغییر عکس کلیک کن
									</span>
								</div>
							)}
						</div>
					)}

					{isUploading && (
						<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-base-100/70 backdrop-blur-xs rounded-widget">
							<div className="w-5 h-5 border-2 rounded-full border-primary/30 border-t-primary animate-spin" />
							<span className="text-xs font-medium text-content">
								در حال بارگذاری...
							</span>
						</div>
					)}
				</div>

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
			/>
		</>
	)
}
