import { t } from '@/common/i18n'
import { useState } from 'react'
import Analytics from '@/analytics'
import { ToggleSwitch } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { SearchAutocompleteSwitch } from './components/search-autocomplete-switch'
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
		<div className="flex flex-col gap-1">
			<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-fill">
				<div className="flex-1 space-y-1">
					<h3 className="text-sm font-medium text-fg">
						{t('setting.privacy.analyticsTitle')}
					</h3>
					<p className="text-xs font-normal leading-relaxed text-fg-muted">
						{t('setting.privacy.analyticsHint')}
					</p>
				</div>
				<div className="shrink-0 pt-0.5">
					<ToggleSwitch
						label={t('setting.privacy.analyticsLabel')}
						enabled={analyticsEnabled}
						onToggle={handleToggleAnalytics}
					/>
				</div>
			</div>

			{import.meta.env.FIREFOX && (
				<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-fill">
					<div className="flex-1 space-y-1">
						<h3 className="text-sm font-medium text-fg">
							{t('setting.privacy.bookmarkIconsLabel')}
						</h3>
						<p className="text-xs font-normal leading-relaxed text-fg-muted">
							{t('setting.privacy.bookmarkIconsHint')}
						</p>
					</div>
					<div className="shrink-0 pt-0.5">
						<ToggleSwitch
							label={t('setting.privacy.bookmarkIconsLabel')}
							enabled={allowFavicon}
							onToggle={handleToggleFavicon}
						/>
					</div>
				</div>
			)}

			<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-fill">
				<div className="flex-1 space-y-1">
					<h3 className="text-sm font-medium text-fg">
						{t('setting.privacy.bookmarksAccessLabel')}
					</h3>
					<p className="text-xs font-normal leading-relaxed text-fg-muted">
						{t('setting.privacy.bookmarksAccessHint')}
					</p>
				</div>
				<div className="shrink-0 pt-0.5">
					<ToggleSwitch
						label={t('setting.privacy.bookmarksAccessLabel')}
						enabled={browserBookmarksEnabled}
						onToggle={() =>
							setBrowserBookmarksEnabled(!browserBookmarksEnabled)
						}
					/>
				</div>
			</div>

			<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-fill">
				<div className="flex-1 space-y-1">
					<h3 className="text-sm font-medium text-fg">
						{t('setting.privacy.tabsAccessLabel')}
					</h3>
					<p className="text-xs font-normal leading-relaxed text-fg-muted">
						{t('setting.privacy.tabsAccessHint')}
					</p>
				</div>
				<div className="shrink-0 pt-0.5">
					<ToggleSwitch
						label={t('setting.privacy.tabsAccessLabel')}
						enabled={browserTabsEnabled}
						onToggle={() => setBrowserTabsEnabled(!browserTabsEnabled)}
					/>
				</div>
			</div>
			<SearchAutocompleteSwitch />
		</div>
	)
}
