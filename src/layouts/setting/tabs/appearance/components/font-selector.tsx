import { ItemSelector } from '@/components/item-selector'
import { SectionPanel } from '@/components/section-panel'
import type { FontFamily } from '@/context/appearance.context'
import { getDescriptionTextStyle, useTheme } from '@/context/theme.context'

interface FontSelectorProps {
	fontFamily: FontFamily
	setFontFamily: (fontFamily: FontFamily) => void
}

export function FontSelector({ fontFamily, setFontFamily }: FontSelectorProps) {
	const { theme } = useTheme()

	const availableFonts: { value: FontFamily; label: string; sampleText: string }[] = [
		{
			value: 'Vazir',
			label: 'وزیر',
			sampleText: 'نمونه متن با فونت وزیر',
		},
		{
			value: 'Samim',
			label: 'صمیم',
			sampleText: 'نمونه متن با فونت صمیم',
		},
	]

	return (
		<SectionPanel title="فونت برنامه" delay={0.15}>
			<div className="space-y-3">
				<p className={`text-sm ${getDescriptionTextStyle(theme)}`}>
					فونت مورد نظر خود را برای نمایش در تمامی بخش‌های برنامه انتخاب کنید:
				</p>
				<div className="flex flex-wrap gap-2">
					{availableFonts.map((font) => (
						<ItemSelector
							isActive={fontFamily === font.value}
							onClick={() => setFontFamily(font.value)}
							key={font.value}
							label={font.label}
							description={font.sampleText}
							defaultActive={'Vazir'}
						/>
					))}
				</div>
			</div>
		</SectionPanel>
	)
}
