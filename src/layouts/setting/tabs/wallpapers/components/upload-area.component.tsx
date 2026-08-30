import { useRef, useState } from 'react'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { useWallpaperUpload } from '../hooks/use-wallpaper-upload'
import { MediaPreview } from './media-preview.component'
import { Icon } from '@/src/icons'
import { Button, IconLoading, Tooltip, VipBadge } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { useRemoveCustomWallpaper } from '@/services/hooks/wallpapers/upload-custom-wallpaper.hook'
import { safeAwait } from '@/services/api'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { cn } from '@/common/utils/cn'

interface UploadAreaProps {
	customWallpaper: Wallpaper | null
	onWallpaperChange: (newWallpaper: Wallpaper) => void
	onWallpaperRemove?: () => void | Promise<void>
}

export function UploadArea({
	customWallpaper,
	onWallpaperChange,
	onWallpaperRemove,
}: UploadAreaProps) {
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { mutateAsync: removeCustomWallpaper, isPending: isRemoving } =
		useRemoveCustomWallpaper()

	const {
		processFile,
		isUploading,
		isLoadingConfig,
		isVip,
		vipMaxSize,
		freeMaxSize,
	} = useWallpaperUpload({
		onWallpaperChange,
	})

	const handleFileSelect = () => {
		if (isUploading || isRemoving || isLoadingConfig) return
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			processFile(file)
			e.target.value = ''
		}
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (!isDragging) setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
		const file = e.dataTransfer.files?.[0]
		if (file) {
			processFile(file)
		}
	}

	const handleRemove = async () => {
		if (isUploading || isRemoving) return
		if (isVip && customWallpaper?.src?.startsWith('http')) {
			const [error] = await safeAwait(removeCustomWallpaper())
			if (error) {
				showToast(translateError(error) as string, 'error')
				return
			}
		}
		if (onWallpaperRemove) {
			await onWallpaperRemove()
		}
		showToast('تصویر زمینه حذف شد', 'info')
	}

	if (isLoadingConfig) {
		return (
			<div className="relative flex items-center justify-center p-6 border shadow-xs rounded-2xl border-content bg-content">
				<div className="flex items-center gap-2 text-muted">
					<IconLoading className="w-5 h-5 text-primary" />
					<span className="text-xs font-medium">در حال دریافت تنظیمات...</span>
				</div>
			</div>
		)
	}

	if (!customWallpaper) {
		return (
			<div
				onDragOver={handleDragOver}
				onDragEnter={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					'relative p-3 overflow-hidden transition-all border shadow-xs rounded-2xl border-content bg-content',
					isDragging && 'border-primary bg-primary/5'
				)}
			>
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center min-w-0 gap-3">
						<div
							onClick={handleFileSelect}
							className={cn(
								'relative flex items-center justify-center w-24 h-16 overflow-hidden rounded-xl border border-dashed cursor-pointer shrink-0 transition-all group bg-base-200',
								isDragging
									? 'border-primary bg-primary/10 text-primary'
									: 'border-base-content/20 hover:border-primary/50 text-muted hover:text-content'
							)}
						>
							{isUploading ? (
								<IconLoading className="w-5 h-5 text-primary" />
							) : (
								<div className="flex flex-col items-center justify-center gap-0.5">
									<Icon
										name="uploadImage"
										size={18}
										className="transition-transform group-hover:scale-110"
									/>
									<span className="text-[10px] font-medium">
										{isDragging ? 'رهاش کن' : 'آپلود'}
									</span>
								</div>
							)}
						</div>

						<div className="flex flex-col min-w-0 gap-1">
							<p className="text-sm font-bold truncate text-content">
								{isDragging
									? 'فایل رو همین‌جا رها کن'
									: isVip
										? 'انتخاب عکس یا ویدیوی دلخواه'
										: 'انتخاب عکس دلخواه'}
							</p>
							<div className="flex items-center gap-1.5 flex-wrap">
								{isVip ? (
									<>
										<Tooltip
											content={`عکس، گیف و ویدیو تا سقف ${vipMaxSize} مگابایت`}
											position="top"
										>
											<span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted bg-base-content/5 px-2 py-0.5 rounded-xl cursor-default">
												<span>تا {vipMaxSize} مگابایت</span>
											</span>
										</Tooltip>
										<Tooltip
											content="روی سرور ذخیره می‌شه و با اکانتت همه‌جا همگام‌سازی می‌مونه"
											position="top"
										>
											<span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted bg-base-content/5 px-2 py-0.5 rounded-xl cursor-default">
												<span>همگام سازی با اکانت</span>
											</span>
										</Tooltip>
									</>
								) : (
									<>
										<Tooltip
											content={`عکس تا ${freeMaxSize} مگابایت روی همین مرورگرت ذخیره می‌شه`}
											position="top"
										>
											<span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted bg-base-content/5 px-2 py-0.5 rounded-xl cursor-default">
												فقط عکس (تا {freeMaxSize} مگابایت)
											</span>
										</Tooltip>
										<Tooltip
											content={`با پرو می‌تونی عکس، گیف و فیلم تا ${vipMaxSize} مگابایت بذاری و همه‌جا همگام‌سازی داشته باشی`}
											position="top"
										>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation()
													callEvent('openSettings', 'vip')
												}}
												className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-xl hover:bg-indigo-500/20 active:scale-95 transition-all cursor-pointer"
											>
												<Icon name="crown" size={11} />
												<span>ارتقا به پرو</span>
											</button>
										</Tooltip>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-1.5 shrink-0">
						<Button
							onClick={handleFileSelect}
							size="sm"
							rounded="xl"
							variant="outline"
							loading={isUploading}
						>
							<Icon name="uploadImage" size={14} />
							<span>انتخاب فایل</span>
						</Button>
					</div>
				</div>

				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept={isVip ? 'image/*,video/mp4,video/webm' : 'image/*'}
					onChange={handleFileChange}
				/>
			</div>
		)
	}

	const isCloudWallpaper = Boolean(customWallpaper.src?.startsWith('http'))

	return (
		<div className="relative p-3 overflow-hidden transition-all border shadow-xs rounded-2xl border-content bg-content">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center min-w-0 gap-3">
					<div className="relative w-24 h-16 overflow-hidden shadow-xs rounded-xl shrink-0 bg-base-200">
						<MediaPreview customWallpaper={customWallpaper} />
						<div className="absolute inset-0 bg-black/20"></div>

						<span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-md bg-primary/90 backdrop-blur-xs shadow-xs">
							{customWallpaper.type === 'IMAGE' ? 'عکس' : 'ویدیو'}
						</span>

						{isCloudWallpaper && (
							<div className="absolute top-1.5 left-1.5">
								<VipBadge variant="indigo" iconOnly size="xs" />
							</div>
						)}
					</div>

					<div className="flex flex-col min-w-0 gap-1">
						<p className="text-sm font-bold truncate text-content">
							{customWallpaper.type === 'IMAGE'
								? 'پس‌زمینه فعلی'
								: 'ویدیو پس‌زمینه فعلی'}
						</p>
						<div className="flex items-center gap-1.5 flex-wrap">
							{isCloudWallpaper ? (
								<Tooltip
									content="روی سرور ذخیره شده و با اکانتت همگام‌سازی می‌شه"
									position="top"
								>
									<span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-xl cursor-default">
										<Icon name="save" size={11} />
										<span>سینک‌شده</span>
									</span>
								</Tooltip>
							) : (
								<Tooltip
									content="فقط روی همین مرورگر ذخیره شده و با اکانتت همگام‌سازی نمی‌شه"
									position="top"
								>
									<span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted bg-base-content/5 px-2 py-0.5 rounded-xl cursor-default">
										ذخیره محلی
									</span>
								</Tooltip>
							)}
							<span className="text-[11px] text-muted truncate max-w-40">
								{customWallpaper.name || 'عکس دلخواه'}
							</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1.5 shrink-0">
					<Button
						onClick={handleFileSelect}
						size="sm"
						rounded="xl"
						variant="outline"
						loading={isUploading}
					>
						<Icon name="edit" size={14} />
						<span>تغییر</span>
					</Button>

					<Button
						onClick={handleRemove}
						size="sm"
						rounded="xl"
						variant="ghost"
						className="text-error hover:bg-error/10"
						loading={isRemoving}
						title="حذف پس‌زمینه"
					>
						<Icon name="trash" size={15} />
					</Button>
				</div>
			</div>

			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				accept={isVip ? 'image/*,video/mp4,video/webm' : 'image/*'}
				onChange={handleFileChange}
			/>
		</div>
	)
}
