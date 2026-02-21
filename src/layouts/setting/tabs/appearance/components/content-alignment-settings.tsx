import { ItemSelector } from '@/components/item-selector'
import { SectionPanel } from '@/components/section-panel'
import { useAppearanceSetting } from '@/context/appearance.context'

export function ContentAlignmentSettings() {
	const { contentAlignment, setContentAlignment, ui } = useAppearanceSetting()
	if (ui === 'SIMPLE') return null
	return (
		<SectionPanel title="تنظیمات چیدمان" delay={0.3} size="sm">
			<div className={`space-y-3`}>
				<p className="text-xs text-muted">موقعیت عمودی محتوا</p>
				<div className="flex gap-3">
					<ItemSelector
						isActive={contentAlignment === 'center'}
						onClick={() => setContentAlignment('center')}
						label="وسط"
						key="center"
						className="w-1/2"
						description="چیدمان محتوا در وسط صفحه قرار می‌گیرد."
					/>
					<ItemSelector
						isActive={contentAlignment === 'top'}
						onClick={() => setContentAlignment('top')}
						label="بالا"
						key="top"
						className="w-1/2"
						description="چیدمان محتوا در بالا صفحه قرار می‌گیرد."
					/>
				</div>
			</div>
		</SectionPanel>
	)
}
