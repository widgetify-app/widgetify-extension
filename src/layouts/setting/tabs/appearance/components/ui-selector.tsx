import { useState } from 'react'
import { SectionPanel } from '@/components/ui'
import { UI, useAppearanceSetting } from '@/context/appearance.context'
import { UIModeSelector } from '@/components/ui-mode-selector/ui-mode-selector'
import { getFromStorage, setToStorage } from '@/common/storage'
import { CustomUIGuideModal } from './custom-ui-guide-modal'
import Analytics from '@/analytics'

export function UISelector() {
	const { setUI, ui } = useAppearanceSetting()
	const [showGuideModal, setShowGuideModal] = useState(false)

	const handleUIChange = async (selectedUI: UI) => {
		setUI(selectedUI)

		if (selectedUI === UI.CUSTOM) {
			const hasSeen = await getFromStorage('hasSeenCustomUIGuide')
			if (!hasSeen) {
				setShowGuideModal(true)
				await setToStorage('hasSeenCustomUIGuide', true)
				Analytics.event('show_custom_ui_guide')
			}
		}
	}

	return (
		<>
			<SectionPanel
				title={
					<div className="flex items-center">
						<p>رابط کاربری</p>
						<span className="mr-1 text-white badge badge-error badge-xs outline-2 outline-error/20">
							جدید
						</span>
					</div>
				}
				size="sm"
			>
				<div className="space-y-4">
					<p className="text-xs text-muted">
						سبک نمایش و نحوه تعامل ویجت‌ها در صفحه اصلی را انتخاب کنید
					</p>

					<UIModeSelector value={ui} onChange={handleUIChange} />
				</div>
			</SectionPanel>

			<CustomUIGuideModal
				isOpen={showGuideModal}
				onClose={() => setShowGuideModal(false)}
			/>
		</>
	)
}
