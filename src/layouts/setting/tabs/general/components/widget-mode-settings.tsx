import { useGeneralSetting } from '@/context/general-setting.context'

export function WidgetModeSettings() {
  const { widgetMode, updateSetting } = useGeneralSetting()

  const handleModeChange = (mode: 'chatBot' | 'imageCorner') => {
    updateSetting('widgetMode', mode)
  }

  return (
    <div className="w-full mb-6">
      <h3 className="text-lg font-semibold mb-3">حالت ویجت</h3>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="widgetMode"
            value="chatBot"
            checked={widgetMode === 'chatBot'}
            onChange={() => handleModeChange('chatBot')}
            className="radio radio-primary"
          />
          <span>چت بات (باباهوشو)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="widgetMode"
            value="imageCorner"
            checked={widgetMode === 'imageCorner'}
            onChange={() => handleModeChange('imageCorner')}
            className="radio radio-primary"
          />
          <span>گوشه تصویر (پت‌ها)</span>
        </label>
      </div>
    </div>
  )
}