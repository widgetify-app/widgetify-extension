import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper } from '@/common/wallpaper.interface'
import { UpdateReleaseNotesModal } from '@/components/UpdateReleaseNotesModal'
import { WidgetSettingsModal } from '@/components/WidgetSettingsModal'
import { ExtensionInstalledModal } from '@/components/extension-installed-modal'
import { CurrencyProvider } from '@/context/currency.context'
import {
	GeneralSettingProvider,
	useGeneralSetting,
} from '@/context/general-setting.context'
import { WeatherProvider } from '@/context/weather.context'
import {
	WidgetVisibilityProvider,
	useWidgetVisibility,
} from '@/context/widget-visibility.context'
import { ArzLiveLayout } from '@/layouts/arzLive/arzLive.layout'
import CalendarLayout from '@/layouts/calendar/calendar'
import { NavbarLayout } from '@/layouts/navbar/navbar.layout'
import { NewsLayout } from '@/layouts/news/news.layout'
import { SearchLayout } from '@/layouts/search/search'
import { WeatherLayout } from '@/layouts/weather/weather.layout'
import { WidgetifyLayout } from '@/layouts/widgetify-card/widgetify.layout'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Browser from 'webextension-polyfill'
import Analytics from '../analytics'

const layoutPositions: Record<string, string> = {
	center: 'justify-center',
	top: 'justify-start  mt-10',
}

function ContentSection() {
	const { contentAlignment, fontFamily } = useGeneralSetting()
	const { visibility } = useWidgetVisibility()

	useEffect(() => {
		if (fontFamily) {
			document.body.style.fontFamily = `"${fontFamily}", sans-serif`
		}
	}, [fontFamily])

	return (
		<div
			className={`flex flex-col items-center ${layoutPositions[contentAlignment]} flex-1 w-full gap-3 p-2 md:p-4`}
		>
			<div className="flex flex-col w-full gap-3 lg:flex-row lg:gap-4">
				<div className="order-3 w-full lg:w-1/4 lg:order-1">
					{visibility.widgetify ? (
						<WidgetifyLayout />
					) : visibility.news ? (
						<NewsLayout />
					) : null}
				</div>

				<div className={'order-1 w-full lg:w-2/4 lg:order-2'}>
					<SearchLayout />
				</div>

				<div className="order-2 w-full lg:w-1/4 lg:order-3">
					{visibility.arzLive && (
						<CurrencyProvider>
							<ArzLiveLayout />
						</CurrencyProvider>
					)}
				</div>
			</div>

			<div className="flex flex-col flex-wrap w-full gap-3 lg:flex-nowrap md:flex-row md:gap-4">
				<div className={`w-full ${!visibility.weather ? 'lg:w-full' : 'lg:w-8/12'}`}>
					{visibility.calendar && <CalendarLayout />}
				</div>
				<div className={`w-full ${!visibility.calendar ? 'lg:w-full' : 'lg:w-4/12'}`}>
					{visibility.weather && <WeatherLayout />}
				</div>
			</div>
		</div>
	)
}

export function HomePage() {
	const [showWelcomeModal, setShowWelcomeModal] = useState(false)
	const [showReleaseNotes, setShowReleaseNotes] = useState(false)
	const [showWidgetSettings, setShowWidgetSettings] = useState(false)
	const currentVersion = Browser.runtime.getManifest().version
	useEffect(() => {
		async function displayModalIfNeeded() {
			const shouldShowWelcome = await getFromStorage('showWelcomeModal')
			if (shouldShowWelcome) {
				setShowWelcomeModal(true)
				await setToStorage('showWelcomeModal', false)
				return
			}

			const lastVersion = await getFromStorage('lastVersion')
			if (lastVersion !== currentVersion) {
				setShowReleaseNotes(true)
				await setToStorage('lastVersion', currentVersion)
			}
		}

		displayModalIfNeeded()

		Analytics.pageView('Home', '/')
	}, [])

	const handleGetStarted = () => {
		setShowWelcomeModal(false)
		window.dispatchEvent(new Event('openSettings'))
	}

	useEffect(() => {
		const wallpaperChangedEvent = listenEvent(
			'wallpaperChanged',
			(wallpaper: StoredWallpaper) => {
				if (wallpaper) {
					changeWallpaper(wallpaper)
					setToStorage('wallpaper', wallpaper)
				}
			},
		)

		async function loadWallpaper() {
			const wallpaper = await getFromStorage('wallpaper')
			if (wallpaper) {
				changeWallpaper(wallpaper)
			} else {
				//todo: get default wallpaper from server
			}
		}

		loadWallpaper()
		return () => {
			wallpaperChangedEvent()
		}
	}, [])

	useEffect(() => {
		const handleOpenWidgetSettings = () => {
			setShowWidgetSettings(true)
		}

		const openWidgetSettingsEvent = listenEvent(
			'openWidgetSettings',
			handleOpenWidgetSettings,
		)

		return () => {
			openWidgetSettingsEvent()
		}
	}, [])

	function changeWallpaper(wallpaper: StoredWallpaper) {
		const existingVideo = document.getElementById('background-video')
		if (existingVideo) {
			existingVideo.remove()
		}

		if (wallpaper.type === 'IMAGE') {
			const gradient = wallpaper.isRetouchEnabled
				? 'linear-gradient(rgb(53 53 53 / 42%), rgb(0 0 0 / 16%), '
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
		<div className="w-full min-h-screen px-2 mx-auto md:px-4 lg:px-0 max-w-[1080px] flex flex-col gap-4">
			<GeneralSettingProvider>
				<WeatherProvider>
					<WidgetVisibilityProvider>
						<NavbarLayout />
						<ContentSection />
						<WidgetSettingsModal
							isOpen={showWidgetSettings}
							onClose={() => setShowWidgetSettings(false)}
						/>
					</WidgetVisibilityProvider>
				</WeatherProvider>
			</GeneralSettingProvider>
			<Toaster />
			<ExtensionInstalledModal
				show={showWelcomeModal}
				onClose={() => setShowWelcomeModal(false)}
				onGetStarted={handleGetStarted}
			/>

			<UpdateReleaseNotesModal
				isOpen={showReleaseNotes}
				onClose={() => setShowReleaseNotes(false)}
				currentVersion={currentVersion}
			/>
		</div>
	)
}
