import { t } from '@/common/i18n'
import { useState } from 'react'
import Analytics from '@/analytics'
import { SettingRow, SettingsGroup, ToggleSwitch } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { SearchAutocompleteSwitch } from './components/search-autocomplete-switch'
import { HiddenModeSwitch } from './components/hidden-mode-switch'
import { getFaviconConsent, setFaviconConsent } from '@/common/storage'

export function PrivacySettings() {
	const {
		analyticsEnabled,
		setAnalyticsEnabled,
		browserBookmarksEnabled,
		setBrowserBookmarksEnabled,
		browserTabsEnabled,
		setBrowserTabsEnabled,
	} = useGeneralSetting()

	const [allowFavicon, setAllowFaviconState] = useState(getFaviconConsent)

	const handleToggleAnalytics = () => {
		setAnalyticsEnabled(!analyticsEnabled)
	}

	const handleToggleFavicon = () => {
		Analytics.event('favicon_consent_toggled')
		const nextValue = !allowFavicon
		setAllowFaviconState(nextValue)
		setFaviconConsent(nextValue)
	}

	return (
		<div className="flex flex-col gap-5">
			<SettingsGroup title={t('setting.privacy.groupData')}>
				<SettingRow
					label={t('setting.privacy.analyticsTitle')}
					hint={t('setting.privacy.analyticsHint')}
				>
					<ToggleSwitch
						label={t('setting.privacy.analyticsLabel')}
						enabled={analyticsEnabled}
						onToggle={handleToggleAnalytics}
					/>
				</SettingRow>
				{import.meta.env.FIREFOX && (
					<SettingRow
						label={t('setting.privacy.bookmarkIconsLabel')}
						hint={t('setting.privacy.bookmarkIconsHint')}
					>
						<ToggleSwitch
							label={t('setting.privacy.bookmarkIconsLabel')}
							enabled={allowFavicon}
							onToggle={handleToggleFavicon}
						/>
					</SettingRow>
				)}
				<SearchAutocompleteSwitch />
			</SettingsGroup>
			<SettingsGroup title={t('setting.privacy.groupBrowser')}>
				<SettingRow
					label={t('setting.privacy.bookmarksAccessLabel')}
					hint={t('setting.privacy.bookmarksAccessHint')}
				>
					<ToggleSwitch
						label={t('setting.privacy.bookmarksAccessLabel')}
						enabled={browserBookmarksEnabled}
						onToggle={() =>
							setBrowserBookmarksEnabled(!browserBookmarksEnabled)
						}
					/>
				</SettingRow>
				<SettingRow
					label={t('setting.privacy.tabsAccessLabel')}
					hint={t('setting.privacy.tabsAccessHint')}
				>
					<ToggleSwitch
						label={t('setting.privacy.tabsAccessLabel')}
						enabled={browserTabsEnabled}
						onToggle={() => setBrowserTabsEnabled(!browserTabsEnabled)}
					/>
				</SettingRow>
			</SettingsGroup>
			<SettingsGroup title={t('setting.privacy.groupVisibility')}>
				<HiddenModeSwitch />
			</SettingsGroup>
		</div>
	)
}
