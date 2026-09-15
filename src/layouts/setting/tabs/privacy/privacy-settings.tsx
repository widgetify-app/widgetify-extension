import { useState } from 'react'
import { SectionPanel, ToggleSwitch } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { SearchAutocompleteSwitch } from './components/search-autocomplete.switch'

export function PrivacySettings() {
	const {
		analyticsEnabled,
		setAnalyticsEnabled,
		browserBookmarksEnabled,
		setBrowserBookmarksEnabled,
		browserTabsEnabled,
		setBrowserTabsEnabled,
	} = useGeneralSetting()

	const [allowFavicon, setAllowFaviconState] = useState(() => {
		return localStorage.getItem('wxt_local:allowFaviconService') === 'true'
	})

	const handleToggleAnalytics = () => {
		setAnalyticsEnabled(!analyticsEnabled)
	}

	const handleToggleFavicon = () => {
		const nextValue = !allowFavicon
		setAllowFaviconState(nextValue)
		localStorage.setItem('wxt_local:allowFaviconService', String(nextValue))
	}

	return (
		<div className="w-full max-w-xl mx-auto space-y-4">
			<SectionPanel title="حریم خصوصی و دسترسی‌ها" delay={0.1}>
				<div className="space-y-1">
					<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-base-200/40">
						<div className="flex-1 space-y-1">
							<h3 className="text-sm font-medium text-content">
								آمار و عملکرد افزونه (Analytics)
							</h3>
							<p className="text-xs font-normal leading-relaxed text-muted">
								جمع‌آوری آمار فنی و گزارش خطاهای ناشناس برای بهبود عملکرد
								افزونه بدون ارسال هیچ‌گونه اطلاعات شخصی یا یادداشت‌ها
							</p>
						</div>
						<div className="shrink-0 pt-0.5">
							<ToggleSwitch
								enabled={analyticsEnabled}
								onToggle={handleToggleAnalytics}
							/>
						</div>
					</div>

					{import.meta.env.FIREFOX && (
						<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-base-200/40">
							<div className="flex-1 space-y-1">
								<h3 className="text-sm font-medium text-content">
									نمایش آیکون‌های بوکمارک‌ها
								</h3>
								<p className="text-xs font-normal leading-relaxed text-muted">
									دریافت فاوآیکون بوکمارک‌ها از سرویس امن گوگل با ارسال
									دامنه سایت‌ها برای نمایش بصری بهتر
								</p>
							</div>
							<div className="shrink-0 pt-0.5">
								<ToggleSwitch
									enabled={allowFavicon}
									onToggle={handleToggleFavicon}
								/>
							</div>
						</div>
					)}

					<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-base-200/40">
						<div className="flex-1 space-y-1">
							<h3 className="text-sm font-medium text-content">
								دسترسی به بوکمارک‌های مرورگر
							</h3>
							<p className="text-xs font-normal leading-relaxed text-muted">
								نمایش بوکمارک‌های ذخیره‌شده مرورگر در ویجت سرچ‌باکس، ذخیره یا
								ارسال نمیشن
							</p>
						</div>
						<div className="shrink-0 pt-0.5">
							<ToggleSwitch
								enabled={browserBookmarksEnabled}
								onToggle={() =>
									setBrowserBookmarksEnabled(!browserBookmarksEnabled)
								}
							/>
						</div>
					</div>

					<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-base-200/40">
						<div className="flex-1 space-y-1">
							<h3 className="text-sm font-medium text-content">
								دسترسی به تب‌ها
							</h3>
							<p className="text-xs font-normal leading-relaxed text-muted">
								امکان باز کردن و مدیریت گروهی بوکمارک‌های داخل پوشه‌ها در
								تب‌های مرورگر
							</p>
						</div>
						<div className="shrink-0 pt-0.5">
							<ToggleSwitch
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
