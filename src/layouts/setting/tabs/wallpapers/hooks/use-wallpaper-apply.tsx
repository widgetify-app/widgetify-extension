import { useEffect } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/wallpaper.interface'
import { getRandomWallpaper } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'
import { safeAwait } from '@/services/api'

const GRADIENT_DIRECTION_MAP: Record<string, string> = {
	'to-r': 'to right',
	'to-l': 'to left',
	'to-t': 'to top',
	'to-b': 'to bottom',
	'to-tr': 'to top right',
	'to-tl': 'to top left',
	'to-br': 'to bottom right',
	'to-bl': 'to bottom left',
}

function applyWallpaper(wallpaper: StoredWallpaper) {
	const existingVideo = document.getElementById('background-video')
	if (existingVideo) existingVideo.remove()

	if (wallpaper.type === 'IMAGE') {
		document.body.style.backgroundImage = `url(${wallpaper.src})`
		document.body.style.backgroundPosition = 'center'
		document.body.style.backgroundRepeat = 'no-repeat'
		document.body.style.backgroundSize = 'cover'
		document.body.style.backgroundColor = ''
	} else if (wallpaper.type === 'GRADIENT' && wallpaper.gradient) {
		const { from, to, direction } = wallpaper.gradient
		const cssDirection = GRADIENT_DIRECTION_MAP[direction] ?? direction

		document.body.style.backgroundImage = `linear-gradient(${cssDirection}, ${from}, ${to})`
		document.body.style.backgroundColor = ''
		document.body.style.backdropFilter = ''
	} else if (wallpaper.type === 'VIDEO') {
		document.body.style.backgroundColor = '#000'
		document.body.style.backgroundImage = ''
		document.body.style.backdropFilter = ''

		const video = document.createElement('video')
		video.id = 'background-video'
		video.src = wallpaper.src
		video.autoplay = true
		video.loop = true
		video.muted = true
		video.playsInline = true
		video.preload = 'auto'

		Object.assign(video.style, {
			position: 'fixed',
			right: '0',
			bottom: '0',
			minWidth: '100%',
			minHeight: '100%',
			width: 'auto',
			height: 'auto',
			zIndex: '-1',
			objectFit: 'cover',
		})

		video.onerror = () => {
			document.body.style.backgroundColor = '#000'
		}
		video.onloadeddata = () => {
			video.play().catch((e) => console.warn('Play failed:', e))
		}
		video.onplaying = () => {
			document.body.style.backgroundColor = 'transparent'
		}

		document.body.prepend(video)

		if (video.readyState >= 2) {
			video.play().catch((e) => console.warn('Immediate play failed:', e))
		}
	}
}

const DEFAULT_GRADIENT: StoredWallpaper = {
	id: 'gradient-a1c4fd-c2e9fb',
	type: 'GRADIENT',
	src: '',
	gradient: {
		from: '#a1c4fd',
		to: '#c2e9fb',
		direction: 'to-r',
	},
}

export function useWallpaperApply() {
	useEffect(() => {
		async function loadWallpaper() {
			const wallpaper: StoredWallpaper | null = await getFromStorage('wallpaper')

			if (wallpaper) {
				applyWallpaper(wallpaper)
				return
			}

			const [error, randomWallpaper] = await safeAwait<any, Wallpaper>(
				getRandomWallpaper()
			)
			if (error || !randomWallpaper) {
				applyWallpaper(DEFAULT_GRADIENT)
				setToStorage('wallpaper', DEFAULT_GRADIENT)
				return
			}

			const defWallpaper: StoredWallpaper = {
				id: randomWallpaper.id,
				type: randomWallpaper.type,
				src: randomWallpaper.src,
				gradient: randomWallpaper.gradient,
			}
			applyWallpaper(defWallpaper)
			setToStorage('wallpaper', defWallpaper)
		}

		loadWallpaper()

		const unsubscribe = listenEvent(
			'wallpaper_change',
			(wallpaper: StoredWallpaper) => {
				if (wallpaper) {
					applyWallpaper(wallpaper)
				}
			}
		)

		return () => {
			unsubscribe()
		}
	}, [])
}
