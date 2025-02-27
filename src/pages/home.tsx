import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'
import type { StoredWallpaper } from '../common/wallpaper.interface'
import { CurrencyProvider } from '../context/currency.context'
import { WeatherProvider } from '../context/weather.context'
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

		if (wallpaper.type === 'IMAGE') {
			const gradient = wallpaper.isRetouchEnabled
				? 'linear-gradient(rgb(53 53 53 / 42%), rgb(0 0 0 / 16%)), '
				: ''

			document.body.style.backgroundImage = `${gradient}url(${wallpaper.src})`

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

			if (activeFilters.length > 0) {
				video.style.filter = activeFilters.join(' ')
			}

			document.body.prepend(video)
		}
	}
	return (
		<div className="w-full min-h-screen px-2 mx-auto md:px-4 lg:px-0 max-w-[1080px] flex flex-col">
			<NavbarLayout />
			<div className="flex flex-col items-center justify-center flex-1 w-full gap-3 p-2 md:p-4">
				{/* Top Section */}
				<div className="flex flex-col w-full gap-3 lg:flex-row lg:gap-4">
					<div className="order-3 w-full lg:w-1/4 lg:order-1">
						<WidgetifyLayout />
					</div>

					<div className="order-1 w-full lg:w-2/4 lg:order-2">
						<SearchLayout />
					</div>

					<div className="order-2 w-full lg:w-1/4 lg:order-3">
						<CurrencyProvider>
							<ArzLiveLayout />
						</CurrencyProvider>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex flex-col w-full gap-3 md:flex-row md:gap-4">
					<div className="w-full md:w-2/3">
						<CalendarLayout />
					</div>
					<div className="w-full md:w-1/3">
						<WeatherProvider>
							<WeatherLayout />
						</WeatherProvider>
					</div>
				</div>
			</div>
			<Toaster />
		</div>
	)
}
