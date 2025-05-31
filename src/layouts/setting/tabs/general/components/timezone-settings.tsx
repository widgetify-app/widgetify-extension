import { SectionPanel } from '@/components/section-panel'
import {
  getBorderColor,
  getContainerBackground,
  getDescriptionTextStyle,
  getInputStyle,
  getTextColor,
  useTheme,
} from '@/context/theme.context'
import { useTimezones } from '@/services/hooks/timezone/getTimezones.hook'
import { FiClock } from 'react-icons/fi'

interface TimezoneSettingsProps {
  timezone: string
  setTimezone: (timezone: string) => void
}

export function TimezoneSettings({
  timezone,
  setTimezone,
}: TimezoneSettingsProps) {
  const { theme } = useTheme()
  const { data: timezones, loading, error } = useTimezones()

  const handleSelectTimezone = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimezone(e.target.value)
  }

  return (
    <SectionPanel title="منطقه‌ی زمانی" delay={0.1}>
      <div className="space-y-3">
        <p className={`text-sm ${getDescriptionTextStyle(theme)}`}>
          منطقه‌ی زمانی مورد نظر خود را انتخاب کنید.
        </p>

        <div className="relative">
          <div className="flex items-center gap-2">
            <FiClock className="absolute z-10 text-blue-500 left-3" />
            {loading ? (
              <div className="flex justify-center w-full p-3">
                <div className="w-6 h-6 border-2 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
              </div>
            ) : error ? (
              <div className="w-full p-3 text-center text-red-500">
                خطا در دریافت اطلاعات مناطق زمانی
              </div>
            ) : (
              <select
                value={timezone}
                onChange={handleSelectTimezone}
                className={`w-full py-3 pl-10 pr-4 rounded-lg appearance-none ${getBorderColor(
                  theme,
                )} border ${getInputStyle(theme)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {!timezone && <option value="">انتخاب منطقه زمانی...</option>}
                {timezones?.map((tz) => (
                  <option
                    key={tz.value}
                    value={tz.value}
                    className={`${getContainerBackground(theme)} ${getTextColor(theme)} opacity-55`}
                  >
                    {tz.label} ({tz.offset})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </SectionPanel>
  )
}
