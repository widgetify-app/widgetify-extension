import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'
import type { StoredWallpaper } from '../common/wallpaper.interface'
import { StoreProvider } from '../context/store.context'
import { NavbarLayout } from '../layouts/navbar/navbar.layout'

interface Props {
	children: JSX.Element
}

export function PageWrapper(props: Props) {
	useEffect(() => {
		window.addEventListener('wallpaperChanged', (eventData: any) => {
			const wallpaper: StoredWallpaper = eventData.detail
			if (wallpaper) {
				changeWallpaper(wallpaper)
				setToStorage(StoreKey.Wallpaper, wallpaper)
			}
		})

		async function loadWallpaper() {
			const wallpaper = await getFromStorage<StoredWallpaper>(StoreKey.Wallpaper)
			if (wallpaper) {
				changeWallpaper(wallpaper)
			}
		}

		loadWallpaper()
		return () => {
			window.removeEventListener('wallpaperChanged', () => {})
		}
	}, [])

	function changeWallpaper(wallpaper: StoredWallpaper) {
		const existingVideo = document.getElementById('background-video')
		if (existingVideo) {
			existingVideo.remove()
		}

		if (wallpaper.type === 'IMAGE') {
			// Set background image for image type
			const gradient = wallpaper.isRetouchEnabled
				? 'linear-gradient(rgb(53 53 53 / 42%), rgb(0 0 0 / 16%)), '
				: ''
			document.body.style.backgroundImage = `${gradient}url(${wallpaper.src})`
			// Reset any video-specific styles
			document.body.style.backgroundColor = ''
		} else if (wallpaper.type === 'VIDEO') {
			// Clear background image
			document.body.style.backgroundImage = ''
			// Set a background color instead
			document.body.style.backgroundColor = '#000'

			// Create video element
			const video = document.createElement('video')
			video.id = 'background-video'
			video.src = wallpaper.src
			video.autoplay = true
			video.loop = true
			video.muted = true
			video.playsInline = true

			// Style video element to fill the background
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

			// Apply retouch filter if enabled
			if (wallpaper.isRetouchEnabled) {
				video.style.filter = 'brightness(0.7)'
			}

			// Add video element to the body
			document.body.prepend(video)
		}
	}

	return (
		<div className={'h-screen max-w-[1080px]  mx-auto px-2 md:px-0'}>
			<StoreProvider>
				<NavbarLayout />
				{props.children}
				<Toaster />
			</StoreProvider>
		</div>
	)
}
// <div className={'h-screen overflow-y-auto px-14 lg:px-0 pb-10 pt-5 xl:px-[38rem]'}>
