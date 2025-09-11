import { SectionPanel } from '@/components/section-panel'
import { ClockSetting } from './clock-display/clock-setting'
import { WigiPadDateSettingsModal } from './date-display/date-setting'

export function WigiPadSetting() {
	return (
		<div className="w-full max-w-xl mx-auto">
			<SectionPanel title="مدیریت تاریخ" size="sm">
				<WigiPadDateSettingsModal />
			</SectionPanel>
			<SectionPanel title="مدیریت ساعت" size="sm">
				<ClockSetting />
			</SectionPanel>
		</div>
	)
}
