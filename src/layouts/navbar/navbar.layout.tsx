import { type JSX, useCallback, useEffect, useState } from 'react'
import { HiX } from 'react-icons/hi'
import { FiChevronDown } from 'react-icons/fi'
import { HiHome } from 'react-icons/hi'
import { AiOutlineDrag } from 'react-icons/ai'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent, callEvent } from '@/common/utils/call-event'
import { SettingModal } from '../setting/setting-modal'
import { SettingsDropdown } from './components/settingsDropdown'
import { FriendsList } from './friends-list/friends'
import { ProfileNav } from './profile/profile'
import { SyncButton } from './sync/sync'
import { useAppearanceSetting } from '@/context/appearance.context'
import { MarketButton } from './market/market-button'
import Analytics from '@/analytics'
import { HiRectangleGroup } from 'react-icons/hi2'

const WIDGETIFY_URLS = {
	website: 'https://widgetify.ir',
} as const

const tabs = [
	{
		id: 'explorer',
		icon: <HiRectangleGroup size={22} />,
		hasBadge: true,
	},
	{
		id: 'home',
		icon: <HiHome size={22} />,
	},
]
export function NavbarTabs() {
	const [activeTab, setActiveTab] = useState<string | null>('home')

	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
		if (tab === 'home') callEvent('closeJumpPage')
		else callEvent('openJumpPage')
	}

	return (
		<div className="flex items-center gap-0.5">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => handleTabClick(tab.id)}
					className="relative p-2 cursor-pointer group nav-btn"
				>
					<span
						className={`
            relative z-10 transition-all duration-300 block
            ${activeTab === tab.id ? 'text-primary scale-110' : 'nav-btn text-white/20 hover:text-white/40'}
        `}
					>
						{tab.icon}

						{tab.hasBadge && (
							<span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
								<span
									className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 ${activeTab === tab.id ? 'block' : 'hidden'}`}
								></span>
								<span
									className={`relative inline-flex rounded-full h-2 w-2 border border-black/50 ${activeTab === tab.id ? 'bg-primary' : 'bg-primary/80'}`}
								></span>
							</span>
						)}
					</span>

					{activeTab === tab.id && (
						<div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(var(--primary-rgb),0.8)]">
							<div className="absolute inset-0 bg-primary blur-[2px]" />
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
					className="fixed z-50 bottom-0 left-1/2 -translate-x-1/2 px-10 py-2.5 bg-white/[0.05] backdrop-blur-[40px] backdrop-saturate-[180%] border-t border-x border-white/10 rounded-t-3xl shadow-[0_-0px_30px_rgba(0,0,0,0.3)] transition-all hover:bg-white/[0.08]"
				>
					<div className="w-10 h-1 rounded-full bg-white/30" />
				</button>
			)}

			<div
				className={`fixed z-50 -translate-x-1/2 left-1/2 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
					isVisible
						? 'bottom-4 opacity-100 scale-100'
						: '-bottom-32 opacity-0 scale-95 pointer-events-none'
				}`}
			>
				<div
					className="absolute w-full h-10 bg-transparent -bottom-16"
					id="chrome-footer"
				></div>
				<nav className="relative flex items-center gap-1 p-1.5 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-[2.5rem]">
					<button
						onClick={() => onToggleNavbar()}
						className="relative z-10 p-2 transition-colors cursor-pointer nav-btn text-white/20 hover:text-white/40"
					>
						<FiChevronDown size={18} />
					</button>

					<div className="relative z-10 w-[1px] h-6 bg-white/[0.08]" />

					<div className="relative z-10 flex items-center gap-0.5">
						<ProfileNav />
						<SyncButton />
						<FriendsList />
					</div>

					<div className="relative z-10 w-[1px] h-6 bg-white/[0.08]" />

					<div className="relative z-10 flex items-center gap-0.5">
						<MarketButton />

						<SettingsDropdown setShowSettings={setShowSettings} />
					</div>

					<div className="relative z-10 w-[1px] h-6 bg-white/[0.08]" />

					<div className="relative z-10 flex items-center gap-2 pr-1 ml-0.5">
						<NavbarTabs />
						<a
							href={WIDGETIFY_URLS.website}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center w-8 h-8 border rounded-full border-white/10 bg-black/20"
						>
							<img
								src={'https://cdn.widgetify.ir/extension/logo.png'}
								alt="Logo"
								className="object-contain w-5 h-5 opacity-80"
							/>
						</a>
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
