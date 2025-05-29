import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper } from '@/common/wallpaper.interface'
import { UpdateReleaseNotesModal } from '@/components/UpdateReleaseNotesModal'
import { WidgetSettingsModal } from '@/components/WidgetSettingsModal'
import { ExtensionInstalledModal } from '@/components/extension-installed-modal'
import { useAppearanceSetting } from '@/context/appearance.context'
import { BookmarkProvider } from '@/context/bookmark.context'
import { CurrencyProvider } from '@/context/currency.context'
import { DateProvider } from '@/context/date.context'
import { GeneralSettingProvider } from '@/context/general-setting.context'
import { TodoProvider } from '@/context/todo.context'
import { WeatherProvider } from '@/context/weather.context'
import {
	WidgetVisibilityProvider,
	useWidgetVisibility,
} from '@/context/widget-visibility.context'
import { BookmarksComponent } from '@/layouts/bookmark/bookmarks'
import { NavbarLayout } from '@/layouts/navbar/navbar.layout'
import { SearchLayout } from '@/layouts/search/search'
import { WidgetifyLayout } from '@/layouts/widgetify-card/widgetify.layout'
import CalendarLayout from '@/layouts/widgets/calendar/calendar'
import { ComboWidget } from '@/layouts/widgets/comboWidget/combo-widget.layout'
import { NewsLayout } from '@/layouts/widgets/news/news.layout'
import { NotesLayout } from '@/layouts/widgets/notes/notes.layout'
import { TodosLayout } from '@/layouts/widgets/todos/todos'
import { ToolsLayout } from '@/layouts/widgets/tools/tools.layout'
import { WeatherLayout } from '@/layouts/widgets/weather/weather.layout'
import { WigiArzLayout } from '@/layouts/widgets/wigiArz/wigi_arz.layout'
import { YouTubeLayout } from '@/layouts/widgets/youtube/youtube.layout'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Browser from 'webextension-polyfill'
import Analytics from '../analytics'

const layoutPositions: Record<string, string> = {
	center: 'justify-center',
	top: 'justify-start mt-2',
}

function ContentSection() {
	const { contentAlignment } = useAppearanceSetting()
	const { visibility } = useWidgetVisibility()

	return (
		<TodoProvider>
			<div
				className={`flex flex-col items-center ${layoutPositions[contentAlignment]} flex-1 w-full gap-3 px-2 md:px-4 pb-2`}
			>
				<div className="flex flex-col w-full gap-3 lg:flex-row lg:gap-4">
					<div className="order-3 w-full lg:w-1/4 lg:order-1">
						<WidgetifyLayout />
					</div>

					<div className={'order-1 w-full lg:w-2/4 lg:order-2'}>
						<SearchLayout />
						<BookmarkProvider>
							<BookmarksComponent />
						</BookmarkProvider>
					</div>

					<div className="order-2 w-full lg:w-1/4 lg:order-3">
						{visibility.comboWidget ? (
							<CurrencyProvider>
								<ComboWidget />
							</CurrencyProvider>
						) : visibility.arzLive ? (
							<CurrencyProvider>
								<WigiArzLayout inComboWidget={false} />
							</CurrencyProvider>
						) : (
							visibility.news && (
								<NewsLayout
									enableBackground={true}
									enableHeader={true}
									inComboWidget={false}
								/>
							)
						)}
					</div>
				</div>
				<div
					className={
						'flex flex-col flex-wrap w-full gap-2 lg:flex-nowrap md:flex-row md:gap-3 justify-between transition-all duration-300 items-center'
					}
				>
					<DateProvider>
						{visibility.calendar && (
							<div className={'w-full lg:w-3/12 transition-all duration-300'}>
								<CalendarLayout />
							</div>
						)}
						{visibility.tools && (
							<div className={'w-full lg:w-3/12 transition-all duration-300'}>
								<ToolsLayout />
							</div>
						)}
						{visibility.todos && (
							<div className={'w-full lg:w-3/12 transition-all duration-300'}>
								<TodosLayout />
							</div>
						)}{' '}
						{visibility.notes && (
							<div className={'w-full lg:w-3/12 transition-all duration-300'}>
								<NotesLayout />
							</div>
						)}
						{visibility.youtube && (
							<div className={'w-full lg:w-3/12 transition-all duration-300'}>
								<YouTubeLayout />
							</div>
						)}
					</DateProvider>
					{visibility.weather && (
						<div
							className={
								'w-full md:max-w-64 lg:w-3/12 self-end transition-all duration-300'
							}
						>
							<WeatherLayout />
						</div>
					)}
				</div>
			</div>
		</TodoProvider>
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
			}
		}

		displayModalIfNeeded()

		Analytics.pageView('Home', '/')
	}, [])

	const handleGetStarted = () => {
		setShowWelcomeModal(false)
		window.location.reload()
	}

	const onCloseReleaseNotes = async () => {
		await setToStorage('lastVersion', currentVersion)
		setShowReleaseNotes(false)
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
				const defaultGradient: StoredWallpaper = {
					id: 'gradient-a1c4fd-c2e9fb',
					type: 'GRADIENT',
					src: '',
					isRetouchEnabled: false,
					gradient: {
						from: '#a1c4fd',
						to: '#c2e9fb',
						direction: 'to-r',
					},
				}
				changeWallpaper(defaultGradient)
				setToStorage('wallpaper', defaultGradient)
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
				? 'linear-gradient(rgb(53 53 53 / 42%), rgb(0 0 0 / 16%)), '
				: ''

			document.body.style.backgroundImage = `${gradient}url(${wallpaper.src})`
			document.body.style.backgroundPosition = 'center'
			document.body.style.backgroundRepeat = 'no-repeat'
			document.body.style.backgroundSize = 'cover'
			document.body.style.backgroundColor = ''
		} else if (wallpaper.type === 'GRADIENT' && wallpaper.gradient) {
			const { from, to, direction } = wallpaper.gradient
			const cssDirection = direction
				.replace('to-r', 'to right')
				.replace('to-l', 'to left')
				.replace('to-t', 'to top')
				.replace('to-b', 'to bottom')
				.replace('to-tr', 'to top right')
				.replace('to-tl', 'to top left')
				.replace('to-br', 'to bottom right')
				.replace('to-bl', 'to bottom left')

			document.body.style.backgroundImage = `linear-gradient(${cssDirection}, ${from}, ${to})`
			document.body.style.backgroundColor = ''
			document.body.style.backdropFilter = ''
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
			<Toaster
				toastOptions={{
					error: {
						style: {
							backgroundColor: '#f8d7da',
							color: '#721c24',
						},
					},
					success: {
						style: {
							backgroundColor: '#d4edda',
							color: '#155724',
						},
					},
				}}
			/>
			<ExtensionInstalledModal
				show={showWelcomeModal}
				onClose={() => setShowWelcomeModal(false)}
				onGetStarted={handleGetStarted}
			/>

			<UpdateReleaseNotesModal
				isOpen={showReleaseNotes}
				onClose={() => onCloseReleaseNotes()}
			/>
		</div>
	)
}
