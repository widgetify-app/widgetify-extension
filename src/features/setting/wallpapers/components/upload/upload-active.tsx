import type { Wallpaper } from '@/common/types/wallpaper.interface'
import { Spinner, Tile, Tooltip, VipBadge } from '@/components/ui'
import { Icon } from '@/icons'
import { MediaPreview } from '../media-preview'

interface UploadActiveProps {
	customWallpaper: Wallpaper
	isActive: boolean
	isUploading: boolean
	isRemoving: boolean
	onFileSelect: () => void
	onRemove: () => void
}

export function UploadActive({
	customWallpaper,
	isActive,
	isUploading,
	isRemoving,
	onFileSelect,
	onRemove,
}: UploadActiveProps) {
	const isCloudWallpaper = Boolean(customWallpaper.src?.startsWith('http'))
	const caption = customWallpaper.type === 'IMAGE' ? 'عکس خودت' : 'ویدیوی خودت'

	return (
		<Tile
			bare
			selected={isActive}
			label={`${caption}؛ برای عوض کردنش بزن`}
			onClick={onFileSelect}
			media={<MediaPreview customWallpaper={customWallpaper} />}
			overlay={
				<span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2 pt-6 font-medium bg-linear-to-t from-scrim to-transparent text-image-fg text-2xs">
					{isUploading ? (
						<Spinner size="xs" tone="image" aria-hidden="true" />
					) : (
						<Icon name="edit" size={12} />
					)}
					{caption}
					{isCloudWallpaper && <VipBadge variant="solid" iconOnly size="xs" />}
				</span>
			}
			actions={
				<Tooltip content="حذفش کن">
					<button
						type="button"
						onClick={onRemove}
						disabled={isRemoving}
						aria-label={`حذف ${caption}`}
						className="grid rounded-lg cursor-pointer size-7 place-items-center bg-scrim text-image-fg backdrop-glass hover:bg-scrim-strong transition-ui focus-visible:focus-ring"
					>
						{isRemoving ? (
							<Spinner size="xs" tone="image" aria-hidden="true" />
						) : (
							<Icon name="trash" size={14} />
						)}
					</button>
				</Tooltip>
			}
		/>
	)
}
