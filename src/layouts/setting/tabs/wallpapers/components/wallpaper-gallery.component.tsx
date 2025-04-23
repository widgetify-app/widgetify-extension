import type { Wallpaper } from '@/common/wallpaper.interface'
import { getDescriptionTextStyle, useTheme } from '@/context/theme.context'
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
	const { theme } = useTheme()
	const galleryRef = useRef<HTMLDivElement>(null)

	const getGalleryStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/30'
			case 'dark':
				return 'bg-gray-900/30'
			default: // glass
				return ''
		}
	}

	const getErrorContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-red-500/10'
			default:
				return 'bg-red-500/10'
		}
	}

	const getErrorIconStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-red-500/10 text-red-500'

			default:
				return 'bg-red-500/20 text-red-400'
		}
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-6">
				<div className="w-8 h-8 rounded-full border-3 border-t-blue-500 border-blue-500/30 animate-spin"></div>
				<p className={`mt-3 text-sm ${getDescriptionTextStyle(theme)}`}>
					در حال بارگذاری...
				</p>
			</div>
		)
	}

	if (error) {
		return (
			<div
				className={`flex flex-col items-center justify-center p-4 text-center rounded-lg ${getErrorContainerStyle()}`}
			>
				<div
					className={`flex items-center justify-center w-10 h-10 mb-3 rounded-full ${getErrorIconStyle()}`}
				>
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
				<p className={`mt-1 text-xs ${getDescriptionTextStyle(theme)}`}>
					لطفا مجددا تلاش کنید
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-3">
			<div
				ref={galleryRef}
				className={`p-2 overflow-x-hidden overflow-y-auto h-96 custom-scrollbar rounded-lg ${getGalleryStyle()}`}
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
