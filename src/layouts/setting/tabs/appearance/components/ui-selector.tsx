import { useState } from 'react'
import { Button, SectionPanel } from '@/components/ui'
import { UI, useAppearanceSetting } from '@/context/appearance.context'
import { UIModeSelector } from '@/components/ui-mode-selector/ui-mode-selector'
import { WidgetHelpModal } from '@/layouts/widgets-manager'
import { Icon } from '@/src/icons'

export function UISelector() {
	const { setUI, ui } = useAppearanceSetting()
	const [showGuideModal, setShowGuideModal] = useState(false)

	const handleUIChange = async (selectedUI: UI) => {
		setUI(selectedUI)
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
				<div className="space-y-3">
					<p className="text-xs text-muted">
						سبک نمایش و نحوه تعامل ویجت‌ها در صفحه اصلی را انتخاب کنید
					</p>

					<UIModeSelector value={ui} onChange={handleUIChange} />

					{ui === UI.CUSTOM && (
						<div className="flex items-center justify-between p-3 rounded-2xl bg-base-200/60 border border-base-content/10">
							<div className="flex items-center gap-2">
								<Icon name="help" size={15} className="text-primary" />
								<span className="text-xs text-content font-medium">
									راهنمای مدیریت و چیدمان ویجت‌ها
								</span>
							</div>
							<Button
								type="button"
								variant="default"
								size="xs"
								rounded="xl"
								onClick={() => setShowGuideModal(true)}
								className="text-xs text-primary hover:bg-primary/10 border-primary/20"
							>
								مشاهده آموزش
							</Button>
						</div>
					)}
				</div>
			</SectionPanel>

			<WidgetHelpModal
				isOpen={showGuideModal}
				onClose={() => setShowGuideModal(false)}
			/>
		</>
	)
}
