import { ToggleSwitch } from '@/components/toggle-switch.component'
import { SelectCity } from './components/select-city'
import { TimezoneSettings } from './components/timezone-settings'
import { useGeneralSetting } from '@/context/general-setting.context'
import { SectionPanel } from '@/components/section-panel'

export function GeneralSettingTab() {
	const { isOptimalMode, updateSetting } = useGeneralSetting()
	return (
		<div className="w-full max-w-xl mx-auto">
			<SelectCity key={'selectCity'} />
			<TimezoneSettings key="timezone" />
			<SectionPanel
				title={
					<div className="flex items-center">
						<p>حالت بهینه</p>
						<span className="mr-2 text-white badge badge-error badge-xs outline-2 outline-error/20">
							جدید
						</span>
					</div>
				}
				size="sm"
			>
				<div className="flex">
					<p className="flex-1 text-sm font-light leading-relaxed text-muted">
						برای کاهش مصرف منابع، انیمیشن‌ها، حیوان خانگی، ثانیه‌شمار ساعت و
						برخی افکت‌های بصری غیرفعال می‌شوند.
					</p>
					<ToggleSwitch
						enabled={isOptimalMode}
						onToggle={() => updateSetting('isOptimalMode', !isOptimalMode)}
					/>
				</div>
			</SectionPanel>
		</div>
	)
}
