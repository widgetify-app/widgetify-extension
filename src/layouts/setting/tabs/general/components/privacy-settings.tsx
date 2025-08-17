import { SectionPanel } from '@/components/section-panel'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import { useGeneralSetting } from '@/context/general-setting.context'

export function PrivacySettings() {
	const {
		analyticsEnabled,
		setAnalyticsEnabled,
		browserBookmarksEnabled,
		setBrowserBookmarksEnabled,
	} = useGeneralSetting()

	return (
		<SectionPanel title="حریم خصوصی" delay={0.1}>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex-1 space-y-2">
						<h3 className="font-medium text-content">
							ردیابی استفاده از برنامه (Analytics)
						</h3>
						<p className="text-sm font-light leading-relaxed text-muted">
							با فعال کردن این گزینه، آمار استفاده از برنامه برای بهبود
							عملکرد جمع‌آوری می‌شود. هیچ اطلاعات شخصی ارسال نخواهد شد
						</p>
					</div>
					<div className="flex-shrink-0 ml-4">
						<ToggleSwitch
							enabled={analyticsEnabled}
							onToggle={() => setAnalyticsEnabled(!analyticsEnabled)}
						/>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex-1 space-y-2">
						<h3 className="font-medium text-content">
							دسترسی به بوکمارک های مرورگر
						</h3>
						<p className="text-sm font-light leading-relaxed text-muted">
							با فعال‌سازی این گزینه، برنامه فقط برای نمایش بوکمارک‌های مرورگر
							شما دسترسی خواهد داشت. هیچ اطلاعاتی ذخیره یا ارسال نمی‌شود و
							بوکمارک‌ها صرفاً در محیط برنامه نمایش داده می‌شوند.
						</p>
					</div>
					<div className="flex-shrink-0 ml-4">
						<ToggleSwitch
							enabled={browserBookmarksEnabled}
							onToggle={() =>
								setBrowserBookmarksEnabled(!browserBookmarksEnabled)
							}
						/>
					</div>
				</div>
			</div>
		</SectionPanel>
	)
}
