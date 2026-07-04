import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import Modal from '@/components/modal'
import { type TabItem, TabManager } from '@/components/tab-manager'
import { UpdateReleaseNotesModal } from '@/components/UpdateReleaseNotesModal'
import { AboutUsTab } from './tabs/about-us/about-us'
import { AppearanceSettingTab } from './tabs/appearance/appearance'
import { GeneralSettingTab } from './tabs/general/general'
import { PrivacySettings } from './tabs/privacy/privacy-settings'
import { ShortcutsTab } from './tabs/shortcuts/shortcuts'
import { WallpaperSetting } from './tabs/wallpapers/wallpapers'
import { AccountTab } from './tabs/account/account'
import { AllFriendsTab, RewardsTab } from './tabs/account/tabs'
import { ConnectionPlatformsTab } from './tabs/account/tabs/connection/connectionsTab'
import { Icon } from '@/src/icons'

interface SettingModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab: string | null
}
const tabs: TabItem[] = [
	{
		parentName: 'حساب کاربری',
		needAuth: true,
		children: [
			{
				label: 'پروفایل من',
				value: 'profile',
				icon: <Icon name="user" size={20} />,
				element: <AccountTab />,
			},
			{
				label: 'پلتفرم‌ها',
				value: 'platforms',
				icon: <Icon name="platforms" size={20} />,
				element: <ConnectionPlatformsTab />,
			},
			{
				label: 'ماموریت‌ها و پاداش',
				value: 'tasks',
				icon: <Icon name="gift" size={20} />,
				element: <RewardsTab />,
			},
			{
				label: 'دوستان',
				value: 'friends',
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
				icon: <Icon name="settings" size={18} />,
				element: <GeneralSettingTab />,
			},

			{
				label: 'حریم خصوصی',
				value: 'access',
				icon: <Icon name="outlinePrivacyTip" size={20} />,
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
export const SettingModal = ({ isOpen, onClose, selectedTab }: SettingModalProps) => {
	const [isUpdateModalOpen, setUpdateModalOpen] = useState(false)

	function openWidgetSettings() {
		onClose()
		Analytics.event('open_widgets_settings_from_settings_modal')
		callEvent('openWidgetsSettings')
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
			size="xl"
			title="تنظیمات"
			direction="rtl"
		>
			<TabManager
				tabOwner="setting"
				tabs={tabs}
				defaultTab="general"
				selectedTab={selectedTab}
				direction="rtl"
			>
				<div className="flex flex-row gap-1 sm:flex-col">
					<button
						className={`relative items-center  flex gap-3 px-4 py-3 rounded-full transition-all duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] text-muted hover:bg-base-300 w-42`}
						onClick={() => openWidgetSettings()}
					>
						<Icon name="appsPlus" size={20} className="text-muted" />
						<span className="text-sm font-light">مدیریت ویجت ها</span>
					</button>
					<button
						className={`relative  items-center flex gap-3 px-4 py-3 rounded-full transition-all duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] text-muted hover:bg-base-300 w-42`}
						onClick={() => setUpdateModalOpen(true)}
					>
						<Icon name="lastUpdate" size={20} />
						<span className="text-sm font-light">تغییرات اخیر</span>
					</button>
				</div>
			</TabManager>

			<UpdateReleaseNotesModal
				isOpen={isUpdateModalOpen}
				onClose={() => setUpdateModalOpen(false)}
				counterValue={null}
			/>
		</Modal>
	)
}
