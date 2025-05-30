import type { Wallpaper } from '@/common/wallpaper.interface'
import { useRef } from 'react'
import { WallpaperItem } from '../item.wallpaper'

interface WallpaperGalleryProps {
	isLoading: boolean
	error: unknown
	wallpapers: Wallpaper[]
	selectedBackground: Wallpaper | null
	onSelectBackground: (wallpaper: Wallpaper) => void
}

export function WallpaperGallery({
	isLoading,
	error,
	wallpapers,
	selectedBackground,
	onSelectBackground,
}: WallpaperGalleryProps) {
	const galleryRef = useRef<HTMLDivElement>(null)

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-6">
				<div className="w-8 h-8 rounded-full border-3 border-t-blue-500 border-blue-500/30 animate-spin"></div>
				<p className={'mt-3 text-sm text-muted'}>در حال بارگذاری...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div
				className={'flex flex-col items-center justify-center p-4 text-center rounded-lg'}
			>
				<div className={'flex items-center justify-center w-10 h-10 mb-3 rounded-full'}>
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h4 className="text-base font-medium text-red-400">خطا در بارگذاری</h4>
			</div>
		)
	}

	return (
		<div className="space-y-3">
			<div
				ref={galleryRef}
				className={
					'p-2 overflow-x-hidden overflow-y-auto h-96 custom-scrollbar rounded-lg bg-content'
				}
				style={{ WebkitOverflowScrolling: 'touch' }}
			>
				<div>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
						{wallpapers.map((wallpaper) => (
							<div key={wallpaper.id} className="transform-gpu">
								<WallpaperItem
									wallpaper={wallpaper}
									selectedBackground={selectedBackground}
									setSelectedBackground={onSelectBackground}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
