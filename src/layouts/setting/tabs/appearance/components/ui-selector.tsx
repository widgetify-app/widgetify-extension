import { useState } from 'react'
import { SectionPanel } from '@/components/ui'
import { type UI, useAppearanceSetting } from '@/context/appearance.context'
import { UIModeSelector } from '@/components/ui-mode-selector/ui-mode-selector'
import { WidgetHelpModal } from '@/layouts/widgets-manager'

export function UISelector() {
	const { setUI, ui } = useAppearanceSetting()
	const [showGuideModal, setShowGuideModal] = useState(false)

	const handleUIChange = async (selectedUI: UI) => {
		setUI(selectedUI)
	}

	return (
		<>
			<SectionPanel title={<p>نوع صفحه</p>} size="sm">
				<div className="space-y-3">
					<UIModeSelector value={ui} onChange={handleUIChange} />
				</div>
			</SectionPanel>

			<WidgetHelpModal
				isOpen={showGuideModal}
				onClose={() => setShowGuideModal(false)}
			/>
		</>
	)
}
