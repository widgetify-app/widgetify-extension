import { useEffect } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/wallpaper.interface'
import { getRandomWallpaper } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'
import { safeAwait } from '@/services/api'
import { SwEventType } from '@/common/types/sw-events'

function pinWallpaperForOffline(wallpaper: StoredWallpaper): Promise<void> {
	if (wallpaper.type !== 'IMAGE' && wallpaper.type !== 'VIDEO') return Promise.resolve()
	if (!/^https?:\/\//.test(wallpaper.src)) return Promise.resolve()

	return browser.runtime
		.sendMessage({
			type: SwEventType.SetActiveWallpaper,
			src: wallpaper.src,
			wallpaperType: wallpaper.type,
		})
		.then(() => undefined)
		.catch(() => undefined)
}

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

let applyToken = 0

const RETRY_LIMIT = 4
const RETRY_BASE_MS = 500

function setImageStyles() {
	document.body.style.backgroundPosition = 'center'
	document.body.style.backgroundRepeat = 'no-repeat'
	document.body.style.backgroundSize = 'cover'
	document.body.style.backgroundColor = ''
}

// A background-image whose request failed is never retried by the browser, and
// re-assigning the same url() is a no-op. Clear it for one frame to force a
// fresh evaluation once the bytes are actually available.
function forceReapplyImage(src: string, token: number) {
	if (token !== applyToken) return
	document.body.style.backgroundImage = 'none'
	requestAnimationFrame(() => {
		if (token !== applyToken) return
		setImageStyles()
		document.body.style.backgroundImage = `url("${src}")`
	})
}

// background-image emits no load/error events, so probe the URL out-of-band. If
// the first paint missed (cold worker, or a cache emptied by an update), wait
// for the worker to pin the wallpaper, then retry and re-apply once loadable.
function verifyImage(src: string, pinned: Promise<void>, token: number, attempt: number) {
	const probe = new Image()
	probe.onload = () => {
		if (attempt > 0) forceReapplyImage(src, token)
	}
	probe.onerror = () => {
		if (token !== applyToken || attempt >= RETRY_LIMIT) return
		const retry = () => verifyImage(src, pinned, token, attempt + 1)
		if (attempt === 0) {
			pinned.then(() => window.setTimeout(retry, RETRY_BASE_MS))
		} else {
			window.setTimeout(retry, RETRY_BASE_MS * (attempt + 1))
		}
	}
	probe.src = src
}

function applyWallpaper(wallpaper: StoredWallpaper) {
	const token = ++applyToken
	const pinned = pinWallpaperForOffline(wallpaper)

	const existingVideo = document.getElementById('background-video')
	if (existingVideo) existingVideo.remove()

	if (wallpaper.type === 'IMAGE') {
		setImageStyles()
		document.body.style.backgroundImage = `url("${wallpaper.src}")`
		verifyImage(wallpaper.src, pinned, token, 0)
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

		let videoRetries = 0
		video.onerror = () => {
			document.body.style.backgroundColor = '#000'
			// Retry driven by the error event (not a one-shot check) so it also
			// recovers when the error arrives after pinning has resolved.
			if (token !== applyToken || videoRetries >= RETRY_LIMIT) return
			videoRetries++
			const delay = RETRY_BASE_MS * videoRetries
			pinned.then(() =>
				window.setTimeout(() => {
					if (token === applyToken && video.isConnected) video.load()
				}, delay)
			)
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

		// Back online: re-pin and re-apply so a wallpaper that couldn't be fetched
		// while offline (e.g. right after an update cleared its cache) recovers on
		// its own instead of staying black until the user re-selects one.
		const handleOnline = async () => {
			const wallpaper: StoredWallpaper | null = await getFromStorage('wallpaper')
			if (wallpaper) applyWallpaper(wallpaper)
		}
		window.addEventListener('online', handleOnline)

		return () => {
			unsubscribe()
			window.removeEventListener('online', handleOnline)
		}
	}, [])
}
