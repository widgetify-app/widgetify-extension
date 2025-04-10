import { SectionPanel } from '@/components/section-panel'
import type { FontFamily } from '@/context/general-setting.context'
import { useTheme } from '@/context/theme.context'

interface FontSelectorProps {
	fontFamily: FontFamily
	setFontFamily: (fontFamily: FontFamily) => void
}

export function FontSelector({ fontFamily, setFontFamily }: FontSelectorProps) {
	const { theme, themeUtils } = useTheme()

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

	const getActiveButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-blue-500 bg-blue-500/10'
			case 'dark':
				return 'border-blue-500 bg-blue-500/20'
			default: // glass
				return 'border-blue-500 bg-blue-500/10'
		}
	}

	const getInactiveButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-300 bg-gray-100/50 hover:bg-gray-200/60'
			case 'dark':
				return 'border-gray-700 bg-gray-700/40 hover:bg-gray-700/60'
			default: // glass
				return 'border-gray-700 bg-white/5 hover:bg-white/10'
		}
	}

	const getRadioBorderStyle = (isSelected: boolean) => {
		if (isSelected) {
			return 'border-blue-500 bg-blue-500'
		}

		switch (theme) {
			case 'light':
				return 'border-gray-400'
			default:
				return 'border-gray-600'
		}
	}

	return (
		<SectionPanel title="فونت برنامه" delay={0.15}>
			<div className="space-y-3">
				<p className={`text-sm ${themeUtils.getDescriptionTextStyle()}`}>
					فونت مورد نظر خود را برای نمایش در تمامی بخش‌های برنامه انتخاب کنید:
				</p>
				<div className="flex flex-wrap gap-2">
					{availableFonts.map((font) => (
						<button
							key={font.value}
							onClick={() => setFontFamily(font.value)}
							className={`flex cursor-pointer flex-col items-center w-auto p-3 transition border rounded-lg ${
								fontFamily === font.value
									? getActiveButtonStyle()
									: getInactiveButtonStyle()
							}`}
							style={{ fontFamily: font.value }}
						>
							<div className="flex items-center justify-center mb-2">
								<div
									className={`w-4 h-4 rounded-full border ${getRadioBorderStyle(fontFamily === font.value)}`}
								>
									{fontFamily === font.value && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-full h-full p-0.5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={3}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									)}
								</div>
								<span
									className={`mr-1.5 text-sm font-medium ${themeUtils.getTextColor()}`}
								>
									{font.label}
								</span>
							</div>
							<p
								className={`text-sm ${themeUtils.getDescriptionTextStyle()} max-w-[120px] text-center`}
								style={{ fontFamily: font.value }}
							>
								{font.sampleText}
							</p>
						</button>
					))}
				</div>
			</div>
		</SectionPanel>
	)
}
