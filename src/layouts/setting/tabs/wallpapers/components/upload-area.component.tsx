import { useRef } from 'react'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { Button } from '@/components/button/button'
import { useWallpaperUpload } from '../hooks/use-wallpaper-upload'
import { MediaPreview } from './media-preview.component'
import { Icon } from '@/src/icons'

const MAX_SIZE = 2
const MAX_FILE_SIZE = MAX_SIZE * 1024 * 1024

interface UploadAreaProps {
	customWallpaper: Wallpaper | null
	onWallpaperChange: (newWallpaper: Wallpaper) => void
}

export function UploadArea({ customWallpaper, onWallpaperChange }: UploadAreaProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { processFile } = useWallpaperUpload({
		onWallpaperChange,
		max_size: MAX_SIZE,
		max_file_size: MAX_FILE_SIZE,
	})

	const handleFileSelect = () => {
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

	if (!customWallpaper) {
		return (
			<div
				className={
					'relative w-full rounded-2xl border border-dashed border-base-content/20 overflow-hidden bg-content hover:opacity-100 transition-all duration-300 text-base-content/80 hover:text-base-content hover:border-base-content/40'
				}
			>
				<button
					className="flex flex-col items-center justify-center w-full gap-2 p-2 cursor-pointer"
					onClick={handleFileSelect}
				>
					<div className="flex items-center gap-2">
						<Icon name="uploadImage" size={18} />
						<p className={'text-sm font-medium'}>آپلود از سیستم</p>
					</div>
					<span className="text-xs text-muted">
						(حداکثر حجم فایل : {MAX_SIZE} مگابایت)
					</span>
				</button>
				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept="image/*"
					onChange={handleFileChange}
				/>
			</div>
		)
	}

	return (
		<div
			className={
				'relative overflow-hidden  rounded-2xl backdrop-blur-sm shadow-sm border border-content bg-content'
			}
		>
			<div className="flex items-center p-2.5">
				<div className="relative w-16 h-12 overflow-hidden rounded-md shadow-sm shrink-0">
					<MediaPreview customWallpaper={customWallpaper} />
					<div className="absolute inset-0 bg-linear-to-r from-transparent to-black/30"></div>

					<div className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-medium text-white rounded-sm backdrop-blur-md bg-blue-500/80">
						{customWallpaper.type === 'IMAGE' ? 'تصویر' : 'ویدیو'}
					</div>
				</div>

				<div className="flex-1 mx-3">
					<p className={'text-sm font-medium text-content'}>تصویر زمینه فعال</p>
					<p className={'text-xs text-muted truncate max-w-50'}>
						{customWallpaper.name || 'بدون نام'}
					</p>
				</div>

				<div className="flex gap-2">
					<Button
						onClick={() => handleFileSelect()}
						size="sm"
						className="rounded-2xl"
					>
						<Icon name="edit" size={14} />
						<span>تغییر</span>
					</Button>
				</div>
			</div>
			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				accept="image/*"
				onChange={handleFileChange}
			/>
		</div>
	)
}
