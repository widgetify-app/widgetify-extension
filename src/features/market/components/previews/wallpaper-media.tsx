import { useRef } from 'react'
import type { Wallpaper } from '@/common/types/wallpaper.interface'
import { cn } from '@/common/utils/cn'

const FILL = 'absolute inset-0 object-cover w-full h-full'

export function WallpaperMedia({ wallpaper }: { wallpaper: Wallpaper }) {
	const videoRef = useRef<HTMLVideoElement>(null)

	if (wallpaper.type !== 'VIDEO') {
		return (
			<img
				src={wallpaper.previewSrc}
				alt=""
				loading="lazy"
				className={cn(FILL, 'transition-ui duration-300 group-hover:scale-105')}
			/>
		)
	}

	const play = () => {
		videoRef.current?.play().catch(() => {})
	}

	const stop = () => {
		const video = videoRef.current
		if (!video) return
		video.pause()
		video.currentTime = 0
	}

	return (
		<video
			ref={videoRef}
			src={wallpaper.previewVideoSrc || wallpaper.src}
			poster={wallpaper.previewSrc}
			muted
			loop
			playsInline
			preload="none"
			onMouseEnter={play}
			onMouseLeave={stop}
			className={FILL}
		/>
	)
}
