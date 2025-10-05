import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { TbApps, TbBrandPagekit } from 'react-icons/tb'
import Joyride, { type Step } from 'react-joyride'
import Analytics from '@/analytics'
import { ConfigKey } from '@/common/constant/config.key'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper } from '@/common/wallpaper.interface'
import { ExtensionInstalledModal } from '@/components/extension-installed-modal'
import Tooltip from '@/components/toolTip'
import { UpdateReleaseNotesModal } from '@/components/UpdateReleaseNotesModal'
import { DateProvider } from '@/context/date.context'
import { GeneralSettingProvider } from '@/context/general-setting.context'
import { TodoProvider } from '@/context/todo.context'
import {
	WidgetKeys,
	WidgetVisibilityProvider,
	widgetItems,
} from '@/context/widget-visibility.context'
import { NavbarLayout } from '@/layouts/navbar/navbar.layout'
import type { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { WidgetSettingsModal } from '@/layouts/widgets-settings/widget-settings-modal'
import { getRandomWallpaper } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'
import { ContentSection } from './home/content-section'
import { WidgetsSection } from './home/widgets-section'

const steps: Step[] = [
	{
		target: 'body',
		content:
			'به ویجتی‌فای خوش آمدید! بیایید با هم قسمت‌های مختلف برنامه را بررسی کنیم تا با امکانات آن آشنا شوید.',
		disableBeacon: true,
	},
	{
		target: '#settings-button',
		content:
			'از این دکمه می‌توانید به تنظیمات عمومی برنامه دسترسی پیدا کنید و آن‌ها را سفارشی‌سازی کنید.',
	},
	{
		target: '#widget-settings-button',
		content:
			'این دکمه به شما اجازه می‌دهد ویجت‌ها را مدیریت کنید: ویجت جدید اضافه کنید، ویجت‌های موجود را ویرایش یا حذف کنید و تنظیمات هر ویجت را تغییر دهید.',
	},
	{
		target: '#profile-and-friends-list',
		content:
			'از این بخش می‌توانید به پروفایل شخصی خود و لیست دوستان دسترسی پیدا کنید و آن‌ها را مدیریت کنید.',
	},
	{
		target: '#bookmarks',
		content:
			'این بخش به شما امکان می‌دهد بوکمارک‌ها را مدیریت کنید: بوکمارک جدید اضافه کنید، بوکمارک‌های موجود را ویرایش یا حذف کنید و تنظیمات هر بوکمارک را تغییر دهید.',
	},
	{
		target: '#widgets',
		content:
			'این محیط اصلی ویجت‌ها است. شما می‌توانید بدون محدودیت از ویجت‌ها استفاده کنید، اما برای جلوگیری از شلوغی بیش از حد، پیشنهاد می‌کنیم حداکثر ۴ ویجت را همزمان فعال نگه دارید.',
	},
]

export function HomePage() {
	const [showWelcomeModal, setShowWelcomeModal] = useState(false)
	const [showReleaseNotes, setShowReleaseNotes] = useState(false)
	const [page, _setPage] = useState<'home' | 'wigi-page'>('home')
	const [showWidgetSettings, setShowWidgetSettings] = useState(false)
	const [tab, setTab] = useState<string | null>(null)
	const [showTour, setShowTour] = useState(false)

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

		displayModalIfNeeded()
		loadWallpaper()

		const wallpaperChangedEvent = listenEvent(
			'wallpaperChanged',
			(wallpaper: StoredWallpaper) => {
				if (wallpaper) {
					changeWallpaper(wallpaper)
					setToStorage('wallpaper', wallpaper)
				}
			}
		)

		const openWidgetsSettingsEvent = listenEvent(
			'openWidgetsSettings',
			(data: { tab: WidgetTabKeys | null }) => {
				setShowWidgetSettings(true)
				if (data.tab) setTab(data.tab)
			}
		)

		Analytics.pageView('Home', '/')

		return () => {
			wallpaperChangedEvent()
			openWidgetsSettingsEvent()
		}
	}, [])

	const handleGetStarted = async () => {
		const [hasSeenTour] = await Promise.all([
			getFromStorage('hasSeenTour'),
			setToStorage('showWelcomeModal', false),
		])
		setShowWelcomeModal(false)
		if (!hasSeenTour) {
			setShowTour(true)
		}
	}

	const onCloseReleaseNotes = async () => {
		await setToStorage('lastVersion', ConfigKey.VERSION_NAME)
		setShowReleaseNotes(false)
	}

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

	function onDoneTour(data: any) {
		if (data.status === 'finished' || data.status === 'skipped') {
			setToStorage('hasSeenTour', true)
			setShowTour(false)
			Analytics.event(`tour_${data.status}`)
		}
	}

	return (
		<div className="w-full min-h-screen px-2 mx-auto md:px-4 lg:px-0 max-w-[1080px] flex flex-col h-[100vh] overflow-y-auto">
			<GeneralSettingProvider>
				<WidgetVisibilityProvider>
					<div data-tour="navbar">
						<NavbarLayout />
					</div>
					{/* <div data-tour="content">
						<ContentSection />
					</div> */}
					{page === 'home' && (
						<div data-tour="content">
							<ContentSection />
						</div>
					)}
					{page === 'wigi-page' && <WidgetsSection />}
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
			<Joyride
				steps={steps}
				run={showTour}
				continuous
				showProgress
				showSkipButton
				locale={{
					next: 'بعدی',
					back: 'قبلی',
					skip: 'رد کردن',
					last: 'پایان',
					close: 'بستن',
					nextLabelWithProgress: 'بعدی {step}/{steps}',
				}}
				callback={onDoneTour}
				styles={{
					options: {
						primaryColor: '#3b82f6',
					},
				}}
			/>
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
					duration: 5000,
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
