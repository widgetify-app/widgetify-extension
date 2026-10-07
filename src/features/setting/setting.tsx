import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { Modal } from '@/components/ui'
import { type TabItem, TabManager } from './components/tab-manager'
import { FriendsActions } from '@/features/friends/friends'
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
				description: 'اطلاعات حسابت رو ببین و هر وقت خواستی عوضش کن',
				icon: <Icon name="user" size={20} />,
				element: <AccountTab />,
			},
			{
				label: 'ویجتیفای پرو',
				value: 'vip',
				description: 'تجربه‌ای سریع‌تر، زیباتر و بدون هیچ مرزی در چیدمان ابزارها',
				icon: <Icon name="diamond" size={20} />,
				element: <VipTab />,
			},
			{
				label: 'پلتفرم‌ها',
				value: 'platforms',
				description:
					'پلتفرم‌های دیگه رو به ویجتیفای وصل کن و هر وقت خواستی قطعشون کن',
				needAuth: true,
				icon: <Icon name="platforms" size={20} />,
				element: <ConnectionPlatformsTab />,
			},
			{
				label: 'ماموریت‌ها و پاداش',
				value: 'tasks',
				description: 'ماموریت‌ها رو انجام بده و ویج‌کوین جایزه بگیر',
				needAuth: true,
				icon: <Icon name="gift" size={20} />,
				element: <RewardsTab />,
			},
			{
				label: 'دوستان',
				value: 'friends',
				description: 'دوستات رو اضافه کن و درخواست‌هاشون رو جواب بده',
				needAuth: true,
				icon: <Icon name="friends" size={20} />,
				element: <AllFriendsTab />,
				actions: <FriendsActions />,
			},
		],
	},
	{
		parentName: 'تنظیمات',
		children: [
			{
				label: 'عمومی',
				value: 'general',
				description: 'شهر، منطقه‌ی زمانی و سبکی ویجتیفای',
				icon: <Icon name="settings" size={20} />,
				element: <GeneralSettingTab />,
			},
			{
				label: 'حریم خصوصی',
				value: 'access',
				description: 'خودت انتخاب کن ویجتیفای به چی دسترسی داشته باشه',
				icon: <Icon name="shieldEllipsis" size={20} />,
				element: <PrivacySettings key="privacy" />,
			},
			{
				label: 'ظاهری',
				value: 'appearance',
				description: 'تم، فونت و عنوان تب رو به سلیقه‌ی خودت عوض کن',
				icon: <Icon name="theme" size={20} />,
				element: <AppearanceSettingTab />,
			},
			{
				label: 'تصویر زمینه‌ها',
				value: 'wallpapers',
				description:
					'یکی رو انتخاب کن تا همون لحظه پشت صفحه بشینه، یا عکس خودت رو بذار',
				icon: <Icon name="wallpapers" size={20} />,
				element: <WallpaperSetting />,
			},
			{
				label: 'میانبرها',
				value: 'shortcuts',
				description: 'با این میانبرها کارت توی ویجتیفای سریع‌تر پیش می‌ره',
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
				description: 'ویجتیفای رو بشناس و از راه‌های ارتباطی باهامون حرف بزن',
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
					actions={[
						{
							label: 'مدیریت ویجت‌ها',
							icon: <Icon name="outlineSquares2X2" size={20} />,
							onClick: openWidgetSettings,
						},
						{
							label: 'تغییرات اخیر',
							icon: <Icon name="lastUpdate" size={20} />,
							onClick: () => setUpdateModalOpen(true),
						},
					]}
				/>
			</StoreTryOnProvider>

			<UpdateReleaseNotesModal
				isOpen={isUpdateModalOpen}
				onClose={() => setUpdateModalOpen(false)}
				counterValue={null}
			/>
		</Modal>
	)
}
