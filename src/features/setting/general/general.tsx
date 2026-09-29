import { Badge, SectionPanel, ToggleSwitch } from '@/components/ui'
import { SelectCity } from '@/components/select-city'
import { TimezoneSettings } from './components/timezone-settings'
import { useGeneralSetting } from '@/context/general-setting.context'
import Analytics from '@/analytics'

export function GeneralSettingTab() {
	const { isOptimalMode, updateSetting } = useGeneralSetting()

	const toggleOptimal = () => {
		updateSetting('isOptimalMode', !isOptimalMode)
		Analytics.event('toggle_optimalMode')
	}

	return (
		<div className="w-full max-w-xl mx-auto">
			<SelectCity key={'selectCity'} />
			<TimezoneSettings key="timezone" />
			<SectionPanel
				title={
					<div className="flex items-center">
						<p>حالت بهینه</p>
						<Badge className="mr-2">جدید</Badge>
					</div>
				}
				size="sm"
			>
				<div className="flex">
					<p className="flex-1 ml-1 text-sm font-light leading-relaxed text-fg-muted">
						برای کاهش مصرف منابع، انیمیشن‌ها، حیوان خانگی، ثانیه‌شمار ساعت و
						برخی افکت‌های بصری غیرفعال می‌شوند.
					</p>
					<ToggleSwitch
						enabled={isOptimalMode}
						onToggle={() => toggleOptimal()}
					/>
				</div>
			</SectionPanel>
		</div>
	)
}
