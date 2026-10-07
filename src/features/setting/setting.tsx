import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { Modal } from '@/components/ui'
import { type TabItem, TabManager } from './components/tab-manager'
import { UpdateReleaseNotesModal } from '@/features/release-notes/release-notes'
import { StoreTryOnProvider } from '@/features/market/store-try-on.context'
import { AboutUsTab } from './about-us/about-us'
import { AppearanceSettingTab } from './appearance/appearance'
import { GeneralSettingTab } from './general/general'
import { PrivacySettings } from './privacy/privacy'
import { ShortcutsTab } from './shortcuts/shortcuts'
import { WallpaperSetting } from './wallpapers/wallpapers'
import { AccountTab } from './account/account'
import { AllFriendsTab } from './components/friends-tab'
import { RewardsTab } from './account/rewards/rewards'
import { ConnectionPlatformsTab } from './components/connections-tab'
import { VipTab } from './vip/vip'
import { Icon } from '@/icons'

interface SettingModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab: string | null
	onTabChange?: (tab: string) => void
}
const tabs: TabItem[] = [
	{
		parentName: 'حساب کاربری',
		children: [
			{
				label: 'پروفایل من',
				value: 'profile',
				icon: <Icon name="user" size={20} />,
				element: <AccountTab />,
			},
			{
				label: 'ویجتیفای پرو',
				value: 'vip',
				icon: <Icon name="diamond" size={20} />,
				element: <VipTab />,
			},
			{
				label: 'پلتفرم‌ها',
				value: 'platforms',
				needAuth: true,
				icon: <Icon name="platforms" size={20} />,
				element: <ConnectionPlatformsTab />,
			},
			{
				label: 'ماموریت‌ها و پاداش',
				value: 'tasks',
				needAuth: true,
				icon: <Icon name="gift" size={20} />,
				element: <RewardsTab />,
			},
			{
				label: 'دوستان',
				value: 'friends',
				needAuth: true,
				icon: <Icon name="friends" size={20} />,
				element: <AllFriendsTab />,
			},
		],
	},
	{
		parentName: 'تنظیمات',
		children: [
			{
				label: 'عمومی',
				value: 'general',
				icon: <Icon name="settings" size={16} />,
				element: <GeneralSettingTab />,
			},

			{
				label: 'حریم خصوصی',
				value: 'access',
				icon: <Icon name="shieldEllipsis" size={20} />,
				element: <PrivacySettings key="privacy" />,
			},
			{
				label: 'ظاهری',
				value: 'appearance',
				icon: <Icon name="theme" size={20} />,
				element: <AppearanceSettingTab />,
			},
			{
				label: 'تصویر زمینه‌ها',
				value: 'wallpapers',
				icon: <Icon name="wallpapers" size={20} />,
				element: <WallpaperSetting />,
			},
			{
				label: 'میانبرها',
				value: 'shortcuts',
				icon: <Icon name="shortcuts" size={20} />,
				element: <ShortcutsTab />,
			},
		],
	},
	{
		parentName: 'ویجتیفای',
		children: [
			{
				label: 'درباره ما',
				value: 'about',
				icon: <Icon name="info" size={20} />,
				element: <AboutUsTab />,
			},
		],
	},
]
export const SettingModal = ({
	isOpen,
	onClose,
	selectedTab,
	onTabChange,
}: SettingModalProps) => {
	const [isUpdateModalOpen, setUpdateModalOpen] = useState(false)
	const [isSteppedAside, setIsSteppedAside] = useState(false)

	function openWidgetSettings() {
		callEvent('openAddCustomWidgetModal', { returnToSettings: true })
		Analytics.event('open_widgets_settings_from_settings_modal')
	}

	useEffect(() => {
		if (isOpen) {
			Analytics.event('open_settings_modal', {
				selected_tab: selectedTab,
			})
		}
	}, [isOpen])

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			stepAside={isSteppedAside}
			size="2xl"
			title="تنظیمات"
		>
			<StoreTryOnProvider onStepAside={setIsSteppedAside} onClose={onClose}>
				<TabManager
					tabOwner="setting"
					tabs={tabs}
					defaultTab="general"
					selectedTab={selectedTab}
					onTabChange={onTabChange}
					direction="rtl"
				>
					<div className="flex flex-row gap-1 sm:flex-col">
						<button
							type="button"
							className={`relative items-center  flex gap-3 px-4 py-3 rounded-full transition-ui duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] text-fg-muted hover:bg-surface-3 w-42`}
							onClick={() => openWidgetSettings()}
						>
							<Icon
								name="outlineSquares2X2"
								size={20}
								className="text-fg-muted"
							/>
							<span className="text-sm font-light">مدیریت ویجت‌ها</span>
						</button>
						<button
							type="button"
							className={`relative  items-center flex gap-3 px-4 py-3 rounded-full transition-ui duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] text-fg-muted hover:bg-surface-3 w-42`}
							onClick={() => setUpdateModalOpen(true)}
						>
							<Icon name="lastUpdate" size={20} />
							<span className="text-sm font-light">تغییرات اخیر</span>
						</button>
					</div>
				</TabManager>
			</StoreTryOnProvider>

			<UpdateReleaseNotesModal
				isOpen={isUpdateModalOpen}
				onClose={() => setUpdateModalOpen(false)}
				counterValue={null}
			/>
		</Modal>
	)
}
