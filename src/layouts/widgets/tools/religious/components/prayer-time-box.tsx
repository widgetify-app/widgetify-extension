import {
  getBorderColor,
  getTextColor,
  getWidgetItemBackground,
  useTheme,
} from '@/context/theme.context'
import type { IconType } from 'react-icons'

interface PrayerTimeBoxProps {
  title: string
  value?: string
  icon: IconType
  index: number
  isLoading?: boolean
  iconColorStyle: string
}

export const PrayerTimeBox = ({
  title,
  value,
  icon: Icon,
  index,
  isLoading = false,
  iconColorStyle,
}: PrayerTimeBoxProps) => {
  const { theme } = useTheme()
  return (
    <div
      className={`${getWidgetItemBackground(theme)} ${getBorderColor(theme)} border rounded-lg p-[.3rem] flex flex-col items-center transition-all duration-300`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`${iconColorStyle} mb-2`}>
        <Icon size={18} />
      </div>
      <div className={`${getTextColor(theme)} text-[0.6rem] mb-1`}>{title}</div>
      {isLoading ? (
        <div
          className={`${getTextColor(theme)} font-medium h-5 w-12 bg-current rounded opacity-30 animate-pulse`}
        />
      ) : (
        <div className={`${getTextColor(theme)} font-medium`}>{value}</div>
      )}
    </div>
  )
}
