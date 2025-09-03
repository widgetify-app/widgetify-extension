import { ItemSelector } from '@/components/item-selector'
import { SectionPanel } from '@/components/section-panel'
import type { FontFamily } from '@/context/appearance.context'

interface FontSelectorProps {
	fontFamily: FontFamily
	setFontFamily: (fontFamily: FontFamily) => void
}

export function FontSelector({ fontFamily, setFontFamily }: FontSelectorProps) {
	const availableFonts: { value: FontFamily; label: string }[] = [
		{
			value: 'Vazir',
			label: 'وزیر',
		},
		{
			value: 'Samim',
			label: 'صمیم',
		},
		{
			value: 'Pofak',
			label: 'پفـک',
		},
	]

	return (
		<SectionPanel title="فونت افزونه" delay={0.15}>
			<div className="space-y-3">
				<p className={'text-sm text-muted'}>
					فونت مورد نظر خود را برای نمایش در تمامی بخش‌های افزونه انتخاب کنید:
				</p>
				<div className="flex flex-wrap gap-2">
					{availableFonts.map((font) => (
						<ItemSelector
							isActive={fontFamily === font.value}
							onClick={() => setFontFamily(font.value)}
							key={font.value}
							label={font.label}
							description={'فرض کن این فونت‌ها ستارن!'}
							style={{ fontFamily: font.value }}
						/>
					))}
				</div>
			</div>
		</SectionPanel>
	)
}
