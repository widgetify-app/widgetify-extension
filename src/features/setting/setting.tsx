import { t } from '@/common/i18n'
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
import { VipPlanStatus, VipTab } from './vip/vip'
import { Icon } from '@/icons'

interface SettingModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab: string | null
	onTabChange?: (tab: string) => void
}
const tabs: TabItem[] = [
	{
		parentName: t('setting.tab.accountGroup'),
		children: [
			{
				label: t('setting.tab.profile'),
				value: 'profile',
				description: t('setting.tab.profileHint'),
				icon: <Icon name="user" size={20} />,
				element: <AccountTab />,
			},
			{
				label: t('setting.tab.vip'),
				value: 'vip',
				description: t('setting.tab.vipHint'),
				icon: <Icon name="diamond" size={20} />,
				element: <VipTab />,
				actions: <VipPlanStatus />,
			},
			{
				label: t('setting.tab.platforms'),
				value: 'platforms',
				description: t('setting.tab.platformsHint'),
				needAuth: true,
				icon: <Icon name="platforms" size={20} />,
				element: <ConnectionPlatformsTab />,
			},
			{
				label: t('setting.tab.rewards'),
				value: 'tasks',
				description: t('setting.tab.rewardsHint'),
				needAuth: true,
				icon: <Icon name="gift" size={20} />,
				element: <RewardsTab />,
			},
			{
				label: t('setting.tab.friends'),
				value: 'friends',
				description: t('setting.tab.friendsHint'),
				needAuth: true,
				icon: <Icon name="friends" size={20} />,
				element: <AllFriendsTab />,
				actions: <FriendsActions />,
			},
		],
	},
	{
		parentName: t('setting.tab.settingsGroup'),
		children: [
			{
				label: t('setting.tab.general'),
				value: 'general',
				description: t('setting.tab.generalHint'),
				icon: <Icon name="settings" size={20} />,
				element: <GeneralSettingTab />,
			},
			{
				label: t('setting.tab.privacy'),
				value: 'access',
				description: t('setting.tab.privacyHint'),
				icon: <Icon name="shieldEllipsis" size={20} />,
				element: <PrivacySettings key="privacy" />,
			},
			{
				label: t('setting.tab.appearance'),
				value: 'appearance',
				description: t('setting.tab.appearanceHint'),
				icon: <Icon name="theme" size={20} />,
				element: <AppearanceSettingTab />,
			},
			{
				label: t('setting.tab.wallpapers'),
				value: 'wallpapers',
				description: t('setting.tab.wallpapersHint'),
				icon: <Icon name="wallpapers" size={20} />,
				element: <WallpaperSetting />,
			},
			{
				label: t('setting.tab.shortcuts'),
				value: 'shortcuts',
				description: t('setting.tab.shortcutsHint'),
				icon: <Icon name="shortcuts" size={20} />,
				element: <ShortcutsTab />,
			},
		],
	},
	{
		parentName: t('setting.about.brandName'),
		children: [
			{
				label: t('setting.tab.about'),
				value: 'about',
				description: t('setting.tab.aboutHint'),
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
			title={t('setting.tab.settingsGroup')}
			closeLabel={t('ui.common.close')}
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
							label: t('setting.tab.widgetsManage'),
							icon: <Icon name="outlineSquares2X2" size={20} />,
							onClick: openWidgetSettings,
						},
						{
							label: t('setting.tab.changelog'),
							icon: <Icon name="lastUpdate" size={20} />,
							onClick: () => {
								Analytics.event('release_notes_opened')
								setUpdateModalOpen(true)
							},
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
