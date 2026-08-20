import { SectionPanel } from '@/components/ui'
import { useAppearanceSetting } from '@/context/appearance.context'
import { UIModeSelector } from '@/components/ui-mode-selector/ui-mode-selector'

export function UISelector() {
	const { setUI, ui } = useAppearanceSetting()

	return (
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

				<UIModeSelector value={ui} onChange={setUI} />
			</div>
		</SectionPanel>
	)
}
