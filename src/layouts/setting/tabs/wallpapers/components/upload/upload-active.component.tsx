import type { Wallpaper } from '@/common/wallpaper.interface'
import { MediaPreview } from '../media-preview.component'
import { Icon } from '@/icons'
import { Button, Tooltip, VipBadge } from '@/components/ui'

interface UploadActiveProps {
	customWallpaper: Wallpaper
	isUploading: boolean
	isRemoving: boolean
	onFileSelect: () => void
	onRemove: () => void
}

export function UploadActive({
	customWallpaper,
	isUploading,
	isRemoving,
	onFileSelect,
	onRemove,
}: UploadActiveProps) {
	const isCloudWallpaper = Boolean(customWallpaper.src?.startsWith('http'))

	return (
		<div className="relative p-3 overflow-hidden transition-all border shadow-sm rounded-2xl border-surface-3 bg-surface-2">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center min-w-0 gap-3">
					<div className="relative w-24 h-16 overflow-hidden shadow-sm rounded-xl shrink-0 bg-surface-2">
						<MediaPreview customWallpaper={customWallpaper} />
						<div className="absolute inset-0 bg-scrim-soft" />

						<span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-3xs font-bold text-on-brand rounded-lg bg-brand-hover backdrop-blur-xs shadow-sm">
							{customWallpaper.type === 'IMAGE' ? 'عکس' : 'ویدیو'}
						</span>

						{isCloudWallpaper && (
							<div className="absolute top-1.5 left-1.5">
								<VipBadge variant="indigo" iconOnly size="xs" />
							</div>
						)}
					</div>

					<div className="flex flex-col min-w-0 gap-1">
						<p className="text-sm font-bold truncate text-fg">
							{customWallpaper.type === 'IMAGE'
								? 'پس‌زمینه فعلی'
								: 'ویدیو پس‌زمینه فعلی'}
						</p>
						<div className="flex items-center gap-1.5 flex-wrap">
							{isCloudWallpaper ? (
								<span className="inline-flex items-center gap-1 text-2xs font-medium text-fg-muted bg-fill px-2 py-0.5 rounded-xl cursor-default">
									<Icon name="save" size={11} />
									<span>همگام‌سازی شده با سرور</span>
								</span>
							) : (
								<Tooltip
									content="فقط روی همین مرورگر ذخیره شده و با اکانتت همگام‌سازی نمی‌شه"
									position="top"
								>
									<span className="inline-flex items-center gap-1 text-2xs font-medium text-fg-muted bg-fill px-2 py-0.5 rounded-xl cursor-default">
										ذخیره محلی
									</span>
								</Tooltip>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1.5 shrink-0">
					<Button
						onClick={onFileSelect}
						size="sm"
						rounded="xl"
						variant="outline"
						loading={isUploading}
					>
						<Icon name="edit" size={14} />
						<span>تغییر</span>
					</Button>

					<Button
						onClick={onRemove}
						size="sm"
						rounded="xl"
						variant="ghost"
						color="danger"
						loading={isRemoving}
						title="حذف پس‌زمینه"
					>
						<Icon name="trash" size={15} />
					</Button>
				</div>
			</div>
		</div>
	)
}
