import { useState } from 'react'
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
		const nextValue = !allowFavicon
		setAllowFaviconState(nextValue)
		setFaviconConsent(nextValue)
	}

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-fill">
				<div className="flex-1 space-y-1">
					<h3 className="text-sm font-medium text-fg">
						آمار و عملکرد افزونه (Analytics)
					</h3>
					<p className="text-xs font-normal leading-relaxed text-fg-muted">
						آمار فنی و گزارش خطاهای ناشناس رو می‌فرستیم تا افزونه رو بهتر کنیم.
						هیچ اطلاعات شخصی یا یادداشتی فرستاده نمی‌شه
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
							آیکون بوکمارک‌ها رو از سرویس گوگل می‌گیریم و برای این کار فقط
							دامنه‌ی سایت فرستاده می‌شه
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
						بوکمارک‌های مرورگرت توی ویجت جستجو نشون داده می‌شن و جایی ذخیره یا
						فرستاده نمی‌شن
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
					<h3 className="text-sm font-medium text-fg">دسترسی به تب‌ها</h3>
					<p className="text-xs font-normal leading-relaxed text-fg-muted">
						تا بتونی همه‌ی بوکمارک‌های یه پوشه رو یه‌جا توی تب‌های مرورگر باز کنی
					</p>
				</div>
				<div className="shrink-0 pt-0.5">
					<ToggleSwitch
						label="دسترسی به تب‌ها"
						enabled={browserTabsEnabled}
						onToggle={() => setBrowserTabsEnabled(!browserTabsEnabled)}
					/>
				</div>
			</div>
			<SearchAutocompleteSwitch />
		</div>
	)
}
