import CustomCheckbox from '../../../../../components/checkbox'
import { SectionPanel } from '../../../../../components/section-panel'

interface PrivacySettingsProps {
	analyticsEnabled: boolean
	setAnalyticsEnabled: (enabled: boolean) => void
}

export function PrivacySettings({
	analyticsEnabled,
	setAnalyticsEnabled,
}: PrivacySettingsProps) {
	return (
		<SectionPanel title="حریم خصوصی" delay={0.1}>
			<div className="flex items-start gap-3">
				<CustomCheckbox
					checked={analyticsEnabled}
					onChange={() => setAnalyticsEnabled(!analyticsEnabled)}
				/>
				<div
					onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
					className="cursor-pointer"
				>
					<p className="font-medium text-gray-200">گوگل آنالیتیکس</p>
					<p className="text-sm font-light text-gray-400">
						با فعال کردن این گزینه، آمار استفاده از برنامه برای بهبود عملکرد جمع‌آوری
						می‌شود. هیچ اطلاعات شخصی ارسال نخواهد شد
					</p>
				</div>
			</div>
		</SectionPanel>
	)
}
