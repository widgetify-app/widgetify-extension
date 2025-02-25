import { useEffect } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'
import type { StoredWallpaper } from '../common/wallpaper.interface'
import { StoreProvider } from '../context/store.context'
import { ArzLiveLayout } from '../layouts/arzLive/arzLive.layout'
import CalendarLayout from '../layouts/calendar/calendar'
import { NavbarLayout } from '../layouts/navbar/navbar.layout'
import { SearchLayout } from '../layouts/search/search'
import { WeatherLayout } from '../layouts/weather/weather.layout'
import { WidgetifyLayout } from '../layouts/widgetify-card/widgetify.layout'

export function HomePage() {
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

		const blurAmount = wallpaper.blurAmount !== undefined ? wallpaper.blurAmount : 0

		if (wallpaper.type === 'IMAGE') {
			const gradient = wallpaper.isRetouchEnabled
				? 'linear-gradient(rgb(53 53 53 / 42%), rgb(0 0 0 / 16%)), '
				: ''

			document.body.style.backgroundImage = `${gradient}url(${wallpaper.src})`

			if (blurAmount > 0) {
				document.body.style.backdropFilter = `blur(${blurAmount}px)`
			} else {
				document.body.style.backdropFilter = ''
			}

			document.body.style.backgroundColor = ''
		} else if (wallpaper.type === 'VIDEO') {
			document.body.style.backgroundImage = ''
			document.body.style.backdropFilter = ''

			document.body.style.backgroundColor = '#000'

			const video = document.createElement('video')
			video.id = 'background-video'
			video.src = wallpaper.src
			video.autoplay = true
			video.loop = true
			video.muted = true
			video.playsInline = true

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

			const activeFilters = []

			if (wallpaper.isRetouchEnabled) {
				activeFilters.push('brightness(0.7)')
			}

			if (blurAmount > 0) {
				activeFilters.push(`blur(${blurAmount}px)`)
			}

			if (activeFilters.length > 0) {
				video.style.filter = activeFilters.join(' ')
			}

			document.body.prepend(video)
		}
	}
	return (
		<StoreProvider>
			<div className={'max-w-[1080px] mx-auto px-2 md:px-0 min-h-screen flex flex-col'}>
				<NavbarLayout />
				<div className="flex flex-col items-center justify-center flex-1 w-full gap-2 p-4">
					{/* Top Section */}
					<div className="flex flex-col gap-4 pr-4 lg:flex-row">
						<div className="order-1 md:basis-128 lg:order-2 lg:flex-1">
							<SearchLayout />
						</div>

						<div className="order-3 md:basis-64 lg:order-1 lg:w-96">
							<WidgetifyLayout />
						</div>

						<div className="order-2 md:basis-64 lg:order-3 lg:w-96">
							<ArzLiveLayout />
						</div>
					</div>

					{/* Main Content */}
					<div className="flex flex-col gap-4 md:flex-row">
						<div className="md:w-2/3">
							<CalendarLayout />
						</div>
						<div className="md:w-1/3">
							<WeatherLayout />
						</div>
					</div>
				</div>
			</div>
		</StoreProvider>
	)
}
//     backdrop-blur-md bg-neutral-900/70 rounded-xl
