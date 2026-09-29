import {
	type JSX,
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { FriendsListNavbar } from './components/friends-navbar'
import { LayoutDropdown } from './components/layout-dropdown'
import { ProfileNav } from './profile/profile'
import { NotificationNavbar } from './notifications/notifications'
import { MarketModalListener } from './components/market-modal-listener'
import { NavIconButton } from './components/nav-icon-button'
import Analytics from '@/analytics'
import { Page, usePage } from '@/context/page.context'
import { useAuth } from '@/context/auth.context'
import { useAppearance } from '@/context/appearance.context'
import { BlurModeButton } from './components/blur-mode-button'
import type { UserProfile } from '@/services/user/user-service.hook'
import { NewBadge } from '@/components/ui'
import { useSyncAccount } from './hooks/use-sync-account'
import { getCurrentDate } from '@/common/utils/date-events'
import { useBirthdayConfetti } from './hooks/use-birthday-confetti'
import { Icon } from '@/icons'
import { GetUserFirstName } from './utils/get-firstname'
import { useGetNotifications } from '@/services/extension/get-notifications.hook'

const WIDGETIFY_URLS = {
	website: 'https://widgetify.ir',
} as const

const LOGO_URL = browser.runtime.getURL('/icons/icon128.png')

const SettingModal = lazy(() =>
	import('@/features/setting/setting').then((module) => ({
		default: module.SettingModal,
	}))
)

const tabs = [
	{
		id: Page.Home,
		icon: <Icon name="outlineHome" size={22} />,
		activeIcon: <Icon name="home" size={22} />,
		label: 'ویجتیفای',
	},

	{
		id: Page.Explorer,
		icon: <Icon name="outlineCompass" size={22} />,
		activeIcon: <Icon name="compass" size={22} />,
		label: 'کاوش',
	},
	{
		id: Page.MiniApps,
		icon: <Icon name="outlineSquares2X2" size={22} />,
		activeIcon: <Icon name="squares2X2" size={22} />,
		label: 'برنامک‌ها',
	},
]

function NavbarTabs() {
	const { page, setPage } = usePage()
	useSyncAccount()
	const handleTabClick = (tab: Page) => {
		setPage(tab)
		Analytics.event(`navbar_tab_${tab}_click`)
	}

	return (
		<nav aria-label="صفحه‌های اصلی">
			<ul className="flex items-center gap-2 sm:gap-4">
				{tabs.map((tab) => {
					const isActive = page === tab.id

					return (
						<li key={tab.id}>
							<button
								type="button"
								aria-label={tab.label}
								aria-current={isActive ? 'page' : undefined}
								title={tab.label}
								onClick={() => handleTabClick(tab.id)}
								className="relative p-1.5 sm:p-2 cursor-pointer group"
							>
								<span
									className={`relative z-10 transition-ui duration-300 block text-lg sm:text-xl ${isActive ? 'text-brand scale-110' : 'text-nav-idle hover:text-nav-idle-hover'}`}
								>
									{isActive ? tab.activeIcon : tab.icon}
								</span>

								{isActive && (
									<div
										aria-hidden="true"
										className="absolute bottom-0 left-0 w-4 mx-auto right-0 h-1 bg-brand rounded-t-full shadow-[0_-4px_12px_rgba(var(--color-primary-rgb),0.8)]"
									></div>
								)}
							</button>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

export function NavbarLayout(): JSX.Element {
	const [showSettings, setShowSettings] = useState(false)
	const [hasOpenedSettings, setHasOpenedSettings] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const { user } = useAuth()
	const { canvasMode } = useAppearance()
	const isEditingCanvas = canvasMode === 'edit'
	const showNavbar = isVisible && !isEditingCanvas
	const showHandle = !isVisible && !isEditingCanvas
	const [tab, setTab] = useState<string | null>(null)
	const handleOpenSettings = useCallback((tabName: string | null) => {
		setTab(tabName)
		setShowSettings(true)
		setHasOpenedSettings(true)
	}, [])

	const { data: notificationsData } = useGetNotifications()

	const hasCloseableNotifications = useMemo(() => {
		const cardItems = notificationsData?.widgetifyCard || []
		return cardItems.some((item) => item.closeable)
	}, [notificationsData])

	const onToggleNavbar = () => {
		if (isVisible) {
			callEvent('close_friends_bottomSheet')
		}
		setIsVisible((prev) => !prev)
		setToStorage('navbarVisible', !isVisible)
		Analytics.event(`navbar_${isVisible ? 'closed' : 'opened'}`)
	}

	const settingsModalCloseHandler = () => {
		setShowSettings(false)
		setTab(null)
	}

	useEffect(() => {
		const load = async () => {
			const storedVisibility = await getFromStorage('navbarVisible')
			if (typeof storedVisibility === 'boolean') {
				setIsVisible(storedVisibility)
			} else {
				setIsVisible(true)
			}
		}

		load()
		const openSettingEvent = listenEvent('openSettings', handleOpenSettings)
		return () => openSettingEvent()
	}, [handleOpenSettings])

	useBirthdayConfetti(user?.isBirthdayToday || false)
	return (
		<>
			<button
				type="button"
				onClick={() => onToggleNavbar()}
				aria-label="باز کردن نوار"
				inert={!showHandle}
				className={`fixed z-float bottom-0 left-1/2 -translate-x-1/2 w-28 py-2.5 bg-glass-surface-2 border-t border-x border-line rounded-t-widget shadow-[0_-0px_30px_rgba(0,0,0,0.3)] transition-ui duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-glass-surface-3 cursor-pointer group ${
					showHandle
						? 'translate-y-0 opacity-100'
						: 'translate-y-full opacity-0 pointer-events-none'
				}`}
			>
				<div className="w-10 h-1 mx-auto transition-[width] duration-200 rounded-full bg-fill-3 group-hover:w-12" />
				{hasCloseableNotifications && <NewBadge className="-top-1 left-3" />}
			</button>

			<div
				inert={!showNavbar}
				className={`fixed z-nav  -translate-x-1/2 left-1/2 w-full px-2 md:px-8 lg:px-4 max-w-[1080px] transition-[bottom,scale] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
					${
						showNavbar
							? 'bottom-2 scale-100'
							: '-bottom-32 scale-95 pointer-events-none'
					}`}
			>
				<div
					className="absolute w-full h-10 bg-transparent -bottom-16"
					id="chrome-footer"
				></div>

				<div className="relative flex items-center p-1.5 sm:p-2 justify-between gap-1 sm:gap-2 bg-glass-surface-2 rounded-2xl sm:rounded-widget h-12 sm:h-14">
					<div className="relative z-10 flex items-center gap-1.5 sm:gap-2 pr-1 ml-0.5 flex-1">
						<a
							href={WIDGETIFY_URLS.website}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center border rounded-full border-image-line bg-scrim-soft outline-2 outline-surface-3"
						>
							<img
								src={LOGO_URL}
								alt="ویجتیفای"
								width={32}
								height={32}
								decoding="async"
								className="object-contain w-7 h-7 sm:w-8 sm:h-8"
							/>
						</a>
						<p className="hidden text-xs font-semibold sm:block sm:text-sm text-fg">
							{getUserLabel(user)}
						</p>
					</div>

					<NavbarTabs />

					<div className="flex items-center justify-end flex-1 gap-1 sm:gap-2">
						<NavIconButton
							icon="chevronDown"
							label="بستن نوار"
							onClick={() => onToggleNavbar()}
						/>
						<NotificationNavbar />
						<BlurModeButton />
						<FriendsListNavbar />
						<LayoutDropdown />
						<ProfileNav />
					</div>
				</div>
			</div>

			<MarketModalListener />

			{hasOpenedSettings && (
				<Suspense fallback={null}>
					<SettingModal
						isOpen={showSettings}
						onClose={settingsModalCloseHandler}
						selectedTab={tab}
						onTabChange={setTab}
					/>
				</Suspense>
			)}
		</>
	)
}

function getUserLabel(user: UserProfile | null) {
	if (!user) return 'ویجتیفای'
	const firstName = GetUserFirstName(user.name)
	if (user.isBirthdayToday) {
		return `🎂  تولدت مبارک ${firstName}`
	}

	const hour = getCurrentDate(user.timeZone).hours()

	let greeting = 'سلام'

	if (hour >= 5 && hour < 12) {
		greeting = 'صبح بخیر'
	} else if (hour >= 12 && hour < 17) {
		greeting = 'ظهر بخیر'
	} else if (hour >= 17 && hour < 21) {
		greeting = 'عصر بخیر'
	}

	return `${greeting} ${firstName}`
}
