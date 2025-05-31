import CustomCheckbox from '@/components/checkbox'
import { SectionPanel } from '@/components/section-panel'
import {
  getDescriptionTextStyle,
  getHeadingTextStyle,
  useTheme,
} from '@/context/theme.context'

interface PrivacySettingsProps {
  analyticsEnabled: boolean
  setAnalyticsEnabled: (enabled: boolean) => void
}

export function PrivacySettings({
  analyticsEnabled,
  setAnalyticsEnabled,
}: PrivacySettingsProps) {
  const { theme } = useTheme()

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
          <p className={`font-medium ${getHeadingTextStyle(theme)}`}>
            گوگل آنالیتیکس
          </p>
          <p className={`text-sm font-light ${getDescriptionTextStyle(theme)}`}>
            با فعال کردن این گزینه، آمار استفاده از برنامه برای بهبود عملکرد
            جمع‌آوری می‌شود. هیچ اطلاعات شخصی ارسال نخواهد شد
          </p>
        </div>
      </div>
    </SectionPanel>
  )
}
