import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { TbBrandPagekit } from 'react-icons/tb'
import Analytics from '@/analytics'
import { ConfigKey } from '@/common/constant/config.key'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper } from '@/common/wallpaper.interface'
import { ExtensionInstalledModal } from '@/components/extension-installed-modal'
import Tooltip from '@/components/toolTip'
import { UpdateReleaseNotesModal } from '@/components/UpdateReleaseNotesModal'
import { useAppearanceSetting } from '@/context/appearance.context'
import { BookmarkProvider } from '@/context/bookmark.context'
import { DateProvider } from '@/context/date.context'
import { GeneralSettingProvider } from '@/context/general-setting.context'
import { TodoProvider } from '@/context/todo.context'
import {
	useWidgetVisibility,
	WidgetVisibilityProvider,
} from '@/context/widget-visibility.context'
import { BookmarksComponent } from '@/layouts/bookmark/bookmarks'
import { NavbarLayout } from '@/layouts/navbar/navbar.layout'
import { SearchLayout } from '@/layouts/search/search'
import { WidgetifyLayout } from '@/layouts/widgetify-card/widgetify.layout'
import { WigiPadWidget } from '@/layouts/widgets/wigiPad/wigiPad.layout'
import type { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { WidgetSettingsModal } from '@/layouts/widgets-settings/widget-settings-modal'
import { getRandomWallpaper } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'

const layoutPositions: Record<string, string> = {
	center: 'justify-center',
	top: 'justify-start',
}

function ContentSection() {
	const { contentAlignment } = useAppearanceSetting()
	const { getSortedWidgets } = useWidgetVisibility()
	const sortedWidgets = getSortedWidgets().slice(0, 4)

	const totalWidgetCount = sortedWidgets.length

	let layoutClasses =
		'grid w-full grid-cols-1 gap-2 transition-all duration-300 md:grid-cols-2 lg:grid-cols-4 md:gap-4'
	if (totalWidgetCount === 2) {
		layoutClasses =
			'flex flex-col flex-wrap w-full gap-2 lg:flex-nowrap md:flex-row md:gap-4 justify-between transition-all duration-300 items-center'
	}

	return (
		<DateProvider>
			<TodoProvider>
				<div
					className={`flex flex-col  items-center ${layoutPositions[contentAlignment]} flex-1 w-full gap-4 px-2 md:px-4 py-2`}
				>
					<div className="flex flex-col w-full gap-4 lg:flex-row lg:gap-2">
						<div className="order-3 w-full lg:w-1/4 lg:order-1 h-widget">
							<WidgetifyLayout />
						</div>

						<div
							className={
								'order-1 w-full lg:w-2/4 lg:order-2 lg:px-2 space-y-3'
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
					<div className={layoutClasses}>
						{sortedWidgets.map((widget) => {
							if (totalWidgetCount === 2) {
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
function WigiPage() {
	const [activeTab, setActiveTab] = useState('')
	const contentRef = useRef<HTMLDivElement>(null)
	const { getSortedWidgets } = useWidgetVisibility()

	const sortedWidgets = getSortedWidgets()

	let layoutClasses =
		'grid w-full grid-cols-1 gap-2 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3 md:gap-4'
	const tabs: any[] = [
		{
			label: 'ویجت ها',
			value: 'widgets',
			icon: null,
			element: (
				<>
					<div className={layoutClasses}>
						{sortedWidgets.map((widget) => {
							return (
								<div key={widget.id} className="h-widget">
									{widget.node}
								</div>
							)
						})}
					</div>
				</>
			),
		},
		{
			label: 'سایت های پیشنهادی',
			value: 'test',
		},
		{
			label: 'آمار من',
			value: 'test',
		},
		{
			label: 'رقابت',
			value: 'test',
		},
		{
			label: 'خبرنامه',
			value: 'test',
		},
	]

	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [activeTab])

	const getTabButtonStyle = (isActive: boolean) => {
		return isActive ? 'text-primary bg-primary/10' : 'text-muted hover:bg-base-300'
	}

	const getTabIconStyle = (isActive: boolean) => {
		return isActive ? 'text-primary' : 'text-muted'
	}

	const handleTabChange = (tabValue: string) => {
		setActiveTab(tabValue)
	}

	return (
		<DateProvider>
			<TodoProvider>
				<div className="flex flex-col md:flex-row h-full gap-0.5 p-2 overflow-hidden">
					<div className="flex w-full h-12 gap-2 p-1 overflow-x-auto rounded-2xl bg-widget widget-wrapper md:flex-col md:w-48 shrink-0 md:overflow-y-auto tab-content-container md:h-72 md:p-2">
						{tabs.map(({ label, value, icon }) => (
							<button
								key={value}
								onClick={() => handleTabChange(value)}
								className={`relative flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] ${getTabButtonStyle(activeTab === value)}`}
							>
								<span className={getTabIconStyle(activeTab === value)}>
									{icon}
								</span>
								<span className="text-sm">{label}</span>
							</button>
						))}
					</div>{' '}
					<div
						className="relative flex-1 overflow-x-hidden overflow-y-auto rounded-lg"
						ref={contentRef}
					>
						{tabs.map(({ value, element }) => (
							<div
								key={value}
								className={`absolute inset-0 px-2 rounded-lg transition-all duration-200 ease-in-out  ${
									activeTab === value
										? 'opacity-100 translate-x-0 z-10'
										: 'opacity-0 translate-x-5 z-0 pointer-events-none'
								}`}
							>
								{activeTab === value && element}
							</div>
						))}
					</div>
				</div>
			</TodoProvider>
		</DateProvider>
	)
}

export function HomePage() {
	const [showWelcomeModal, setShowWelcomeModal] = useState(false)
	const [showReleaseNotes, setShowReleaseNotes] = useState(false)
	const [page, _setPage] = useState<'home' | 'wigi-page'>('home')
	const [showWidgetSettings, setShowWidgetSettings] = useState(false)
	const [tab, setTab] = useState<string | null>(null)
	useEffect(() => {
		async function displayModalIfNeeded() {
			const shouldShowWelcome = await getFromStorage('showWelcomeModal')

			if (shouldShowWelcome || shouldShowWelcome === null) {
				setShowWelcomeModal(true)
				return
			}

			const lastVersion = await getFromStorage('lastVersion')
			if (lastVersion !== ConfigKey.VERSION_NAME) {
				setShowReleaseNotes(true)
			}
		}

		displayModalIfNeeded()

		Analytics.pageView('Home', '/')
	}, [])

	const handleGetStarted = async () => {
		await setToStorage('showWelcomeModal', false)
		setShowWelcomeModal(false)
	}

	const onCloseReleaseNotes = async () => {
		await setToStorage('lastVersion', ConfigKey.VERSION_NAME)
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
		const openWidgetsSettingsEvent = listenEvent(
			'openWidgetsSettings',
			(data: { tab: WidgetTabKeys | null }) => {
				setShowWidgetSettings(true)
				if (data.tab) setTab(data.tab)
			}
		)

		return () => {
			openWidgetsSettingsEvent()
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
		<div className="w-full min-h-screen px-2 mx-auto md:px-4 lg:px-0 max-w-[1080px] flex flex-col h-[100vh] overflow-y-auto scrollbar-none">
			<GeneralSettingProvider>
				<WidgetVisibilityProvider>
					<NavbarLayout />
					{page === 'home' && <ContentSection />}
					{page === 'wigi-page' && <WigiPage />}
					<WidgetSettingsModal
						isOpen={showWidgetSettings}
						onClose={() => {
							setShowWidgetSettings(false)
							setTab(null)
						}}
						selectedTab={tab}
					/>
				</WidgetVisibilityProvider>
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
				onClose={() => handleGetStarted}
				onGetStarted={handleGetStarted}
			/>

			<UpdateReleaseNotesModal
				isOpen={showReleaseNotes}
				onClose={() => onCloseReleaseNotes()}
				counterValue={10}
			/>
			<div
				className="fixed z-50 hidden p-1 transition-all transform rounded-full opacity-50 cursor-pointer bottom-1 right-1 bg-widget widget-wrapper text-muted md:flex hover:opacity-80"
				onClick={() => {
					_setPage(page === 'home' ? 'wigi-page' : 'home')
				}}
			>
				<Tooltip content="ویجی پیج">
					<TbBrandPagekit size={20} />
				</Tooltip>
			</div>
		</div>
	)
}
