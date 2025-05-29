import { ItemSelector } from '@/components/item-selector'
import { SectionPanel } from '@/components/section-panel'
interface ContentAlignmentSettingsProps {
	contentAlignment: 'center' | 'top'
	setContentAlignment: (alignment: 'center' | 'top') => void
}

export function ContentAlignmentSettings({
	contentAlignment,
	setContentAlignment,
}: ContentAlignmentSettingsProps) {
	return (
		<SectionPanel title="تنظیمات چیدمان" delay={0.3}>
			<div className="space-y-3">
				<p className="text-muted">موقعیت عمودی محتوا</p>
				<div className="flex gap-3">
					<ItemSelector
						isActive={contentAlignment === 'center'}
						onClick={() => setContentAlignment('center')}
						label="وسط"
						key="center"
						className="w-1/2"
						defaultActive="center"
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
