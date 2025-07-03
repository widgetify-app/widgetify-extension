import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper } from '@/common/wallpaper.interface'
import { UpdateReleaseNotesModal } from '@/components/UpdateReleaseNotesModal'
import { WidgetSettingsModal } from '@/components/WidgetSettingsModal'
import { ExtensionInstalledModal } from '@/components/extension-installed-modal'
import { useAppearanceSetting } from '@/context/appearance.context'
import { BookmarkProvider } from '@/context/bookmark.context'
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
import { WigiPadWidget } from '@/layouts/widgets/wigiPad/wigiPad.layout'
import { getRandomWallpaper } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

const layoutPositions: Record<string, string> = {
	center: 'justify-center',
	top: 'justify-start mt-1',
}

function ContentSection() {
	const { contentAlignment } = useAppearanceSetting()
	const { getSortedWidgets } = useWidgetVisibility()
	const sortedWidgets = getSortedWidgets()

	const layoutItems = sortedWidgets
	const bottomCount = layoutItems.length

	let bottomLayoutClasses =
		'grid w-full grid-cols-1 gap-2 transition-all duration-300 md:grid-cols-2 lg:grid-cols-4 md:gap-4'
	if (bottomCount === 2) {
		bottomLayoutClasses =
			'flex flex-col flex-wrap w-full gap-2 lg:flex-nowrap md:flex-row md:gap-4 justify-between transition-all duration-300 items-center'
	}

	return (
		<DateProvider>
			<TodoProvider>
				<div
					className={`flex flex-col items-center ${layoutPositions[contentAlignment]} flex-1 w-full gap-4 px-2 md:px-4 py-2`}
				>
					<div className="flex flex-col w-full gap-4 lg:flex-row lg:gap-2">
						<div className="order-3 w-full lg:w-1/4 lg:order-1 h-widget">
							<WidgetifyLayout />
						</div>

						<div
							className={
								'order-1 w-full lg:w-2/4 lg:order-2 lg:px-2 space-y-4'
							}
						>
							<SearchLayout />
							<BookmarkProvider>
								<div className="h-widget">
									<BookmarksComponent />
								</div>
							</BookmarkProvider>
						</div>

						<div className="order-2 w-full lg:w-1/4 lg:order-3 h-widget">
							<WigiPadWidget />
						</div>
					</div>
					<div className={bottomLayoutClasses}>
						{layoutItems.map((widget) => {
							if (bottomCount === 2) {
								return (
									<div
										key={widget.id}
										className="flex-shrink-0 w-full lg:w-3/12 h-widget"
									>
										{widget.node}
									</div>
								)
							}
							return (
								<div key={widget.id} className="h-widget">
									{widget.node}
								</div>
							)
						})}
					</div>
				</div>
			</TodoProvider>
		</DateProvider>
	)
}

export function HomePage() {
	const [showWelcomeModal, setShowWelcomeModal] = useState(false)
	const [showReleaseNotes, setShowReleaseNotes] = useState(false)
	const [showWidgetSettings, setShowWidgetSettings] = useState(false)
	const currentVersion = browser.runtime.getManifest().version
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
			}
		)

		async function loadWallpaper() {
			const wallpaper = await getFromStorage('wallpaper')
			if (wallpaper) {
				changeWallpaper(wallpaper)
			} else {
				const randomWallpaper = await getRandomWallpaper()
				if (randomWallpaper) {
					const defWallpaper: StoredWallpaper = {
						id: randomWallpaper.id,
						type: randomWallpaper.type,
						src: randomWallpaper.src,
						isRetouchEnabled: false,
						gradient: randomWallpaper.gradient,
					}
					changeWallpaper(defWallpaper)
					setToStorage('wallpaper', defWallpaper)
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
			handleOpenWidgetSettings
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
		<div className="w-full min-h-screen px-2 mx-auto md:px-4 lg:px-0 max-w-[1080px] flex flex-col h-[100vh] overflow-y-auto">
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
