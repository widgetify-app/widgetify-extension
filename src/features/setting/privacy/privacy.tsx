import { useState } from 'react'
import { SectionPanel, ToggleSwitch } from '@/components/ui'
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
		const nextValue = !allowFavicon
		setAllowFaviconState(nextValue)
		setFaviconConsent(nextValue)
	}

	return (
		<div className="w-full max-w-xl mx-auto space-y-4">
			<SectionPanel title="حریم خصوصی و دسترسی‌ها" delay={0.1}>
				<div className="space-y-1">
					<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-fill">
						<div className="flex-1 space-y-1">
							<h3 className="text-sm font-medium text-fg">
								آمار و عملکرد افزونه (Analytics)
							</h3>
							<p className="text-xs font-normal leading-relaxed text-fg-muted">
								جمع‌آوری آمار فنی و گزارش خطاهای ناشناس برای بهبود عملکرد
								افزونه بدون ارسال هیچ‌گونه اطلاعات شخصی یا یادداشت‌ها
							</p>
						</div>
						<div className="shrink-0 pt-0.5">
							<ToggleSwitch
								label="آمار و عملکرد افزونه"
								enabled={analyticsEnabled}
								onToggle={handleToggleAnalytics}
							/>
						</div>
					</div>

					{import.meta.env.FIREFOX && (
						<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-fill">
							<div className="flex-1 space-y-1">
								<h3 className="text-sm font-medium text-fg">
									نمایش آیکون‌های بوکمارک‌ها
								</h3>
								<p className="text-xs font-normal leading-relaxed text-fg-muted">
									دریافت فاوآیکون بوکمارک‌ها از سرویس امن گوگل با ارسال
									دامنه سایت‌ها برای نمایش بصری بهتر
								</p>
							</div>
							<div className="shrink-0 pt-0.5">
								<ToggleSwitch
									label="نمایش آیکون‌های بوکمارک‌ها"
									enabled={allowFavicon}
									onToggle={handleToggleFavicon}
								/>
							</div>
						</div>
					)}

					<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-fill">
						<div className="flex-1 space-y-1">
							<h3 className="text-sm font-medium text-fg">
								دسترسی به بوکمارک‌های مرورگر
							</h3>
							<p className="text-xs font-normal leading-relaxed text-fg-muted">
								نمایش بوکمارک‌های ذخیره‌شده مرورگر در ویجت سرچ‌باکس، ذخیره یا
								ارسال نمیشن
							</p>
						</div>
						<div className="shrink-0 pt-0.5">
							<ToggleSwitch
								label="دسترسی به بوکمارک‌های مرورگر"
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
								دسترسی به تب‌ها
							</h3>
							<p className="text-xs font-normal leading-relaxed text-fg-muted">
								امکان باز کردن و مدیریت گروهی بوکمارک‌های داخل پوشه‌ها در
								تب‌های مرورگر
							</p>
						</div>
						<div className="shrink-0 pt-0.5">
							<ToggleSwitch
								label="دسترسی به تب‌ها"
								enabled={browserTabsEnabled}
								onToggle={() =>
									setBrowserTabsEnabled(!browserTabsEnabled)
								}
							/>
						</div>
					</div>
					<SearchAutocompleteSwitch />
				</div>
			</SectionPanel>
		</div>
	)
}
