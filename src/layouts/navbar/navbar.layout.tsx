import { type JSX, use, useCallback, useEffect, useState } from 'react'
import { HiX } from 'react-icons/hi'
import { FiChevronDown } from 'react-icons/fi'
import { AiOutlineDrag, AiOutlineGlobal } from 'react-icons/ai'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { SettingModal } from '../setting/setting-modal'
import { SettingsDropdown } from './components/settingsDropdown'
import { FriendsList } from './friends-list/friends'
import { ProfileNav } from './profile/profile'
import { SyncButton } from './sync/sync'
import { useAppearanceSetting } from '@/context/appearance.context'
import { MarketButton } from './market/market-button'
import Analytics from '@/analytics'
import { HiGlobeAlt } from 'react-icons/hi2'
import { usePage } from '@/context/page.context'
import { useAuth } from '@/context/auth.context'
import { TbSmartHome } from 'react-icons/tb'
import { BlurModeButton } from '@/components/blur-mode/blur-mode.button'
import { UserProfile } from '@/services/hooks/user/userService.hook'
import Tooltip from '@/components/toolTip'

const WIDGETIFY_URLS = {
	website: 'https://widgetify.ir',
} as const

const tabs = [
	{
		id: 'home',
		icon: <TbSmartHome size={22} />,
	},
	{
		id: 'explorer',
		icon: <HiGlobeAlt size={22} />,
		hasBadge: false,
	},
]
export function NavbarTabs() {
	const { page, setPage } = usePage()

	const handleTabClick = (tab: any) => {
		setPage(tab)
		Analytics.event(`navbar_tab_${tab}_click`)
	}

	return (
		<div className="flex items-center gap-4">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => handleTabClick(tab.id)}
					className="relative p-2 cursor-pointer group nav-btn"
				>
					<span
						className={`
            relative z-10 transition-all duration-300 block
            ${page === tab.id ? 'text-primary scale-110' : 'nav-btn text-white/20 hover:text-white/40'}
        `}
					>
						{tab.icon}

						{tab.hasBadge && (
							<span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
								<span
									className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 ${page === tab.id ? 'block' : 'hidden'}`}
								></span>
								<span
									className={`relative inline-flex rounded-full h-2 w-2 border border-black/50 ${page === tab.id ? 'bg-primary' : 'bg-primary/80'}`}
								></span>
							</span>
						)}
					</span>

					{page === tab.id && (
						<div className="absolute bottom-0 left-0 w-4 mx-auto right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(var(--primary-rgb),0.8)]">
							{/* <div className="absolute inset-0 bg-primary blur-[2px]" /> */}
						</div>
					)}
				</button>
			))}
		</div>
	)
}

export function NavbarLayout(): JSX.Element {
	const { canReOrderWidget, toggleCanReOrderWidget } = useAppearanceSetting()
	const [showSettings, setShowSettings] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const { user } = useAuth()
	const [tab, setTab] = useState<string | null>(null)

	const handleOpenSettings = useCallback(
		(tabName: 'account' | 'wallpapers' | 'general' | null) => {
			if (tabName) setTab(tabName)
			setShowSettings(true)
		},
		[]
	)

	const onToggleNavbar = () => {
		setIsVisible((prev) => !prev)
		setToStorage('navbarVisible', !isVisible)
		Analytics.event(`navbar_${isVisible ? 'closed' : 'opened'}`)
	}

	const settingsModalCloseHandler = () => setShowSettings(false)

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

	return (
		<>
			{canReOrderWidget && (
				<div className="fixed z-[100] transform -translate-x-1/2 top-4 left-1/2 w-max">
					<div className="px-4 py-2 border shadow-2xl shadow-warning bg-warning border-warning rounded-2xl">
						<div className="flex items-center gap-3 text-xs font-bold text-warning-content">
							<AiOutlineDrag
								size={16}
								className="animate-bounce text-warning"
							/>
							<span>حالت جابجایی فعال، ویجت هارو جابجا کنید</span>
							<button
								onClick={() => toggleCanReOrderWidget()}
								className="transition-colors hover:text-red-400"
							>
								<HiX size={16} />
							</button>
						</div>
					</div>
				</div>
			)}

			{!isVisible && (
				<button
					onClick={() => onToggleNavbar()}
					className="fixed z-50 bottom-0 left-1/2 -translate-x-1/2 w-28 py-2.5 bg-content bg-glass border-t border-x border-white/10 rounded-t-3xl shadow-[0_-0px_30px_rgba(0,0,0,0.3)] transition-all hover:bg-white/[0.08] cursor-pointer group"
				>
					<div className="w-10 h-1 mx-auto transition-all duration-200 rounded-full bg-base-content/50 group-hover:w-12" />
				</button>
			)}

			<div
				className={`fixed z-50  -translate-x-1/2 left-1/2 w-[93%] max-w-[1080px]  transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
					isVisible
						? 'bottom-2 opacity-100 scale-100'
						: '-bottom-32 opacity-0 scale-95 pointer-events-none'
				}`}
			>
				<div
					className="absolute w-full h-10 bg-transparent -bottom-16"
					id="chrome-footer"
				></div>

				<nav className="relative flex items-center p-1.5 justify-between gap-1  bg-base-200 bg-glass rounded-2xl h-14">
					<div className="relative z-10 flex items-center gap-2 pr-1 ml-0.5 flex-1">
						<a
							href={WIDGETIFY_URLS.website}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center border rounded-full border-white/10 bg-black/20"
						>
							<img
								src={'https://cdn.widgetify.ir/extension/logo.png'}
								alt="Logo"
								className="object-contain w-8 h-8"
							/>
						</a>
						<p className="text-sm font-semibold text-content">
							{getUserLabel(user)}
						</p>
					</div>

					<div className="">
						<NavbarTabs />
					</div>

					<div className="flex items-center justify-end flex-1 gap-2">
						<Tooltip content="بستن نوار">
							<button
								onClick={() => onToggleNavbar()}
								className="p-2 transition-all cursor-pointer nav-btn text-white/40 hover:text-white active:scale-90"
							>
								<FiChevronDown size={15} />
							</button>
						</Tooltip>
						<BlurModeButton />
						<SyncButton />
						<SettingsDropdown setShowSettings={setShowSettings} />
						<FriendsList />
						<MarketButton />
						<ProfileNav />
					</div>
				</nav>
			</div>

			<SettingModal
				isOpen={showSettings}
				onClose={settingsModalCloseHandler}
				selectedTab={tab}
			/>
		</>
	)
}

function getUserLabel(user: UserProfile | null) {
	if (!user) return 'ویجتیفای'

	return `	سلام ${user.name}!`
}
