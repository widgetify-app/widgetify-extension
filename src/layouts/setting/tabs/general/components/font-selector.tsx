import { SectionPanel } from '../../../../../components/section-panel'
import type { FontFamily } from '../../../../../context/general-setting.context'

interface FontSelectorProps {
	fontFamily: FontFamily
	setFontFamily: (fontFamily: FontFamily) => void
}

export function FontSelector({ fontFamily, setFontFamily }: FontSelectorProps) {
	const availableFonts: { value: FontFamily; label: string; sampleText: string }[] = [
		{
			value: 'Vazir',
			label: 'وزیر',
			sampleText: 'نمونه متن با فونت وزیر',
		},
		{
			value: 'digiHamishe',
			label: 'دیجی همیشه',
			sampleText: 'نمونه متن با فونت دیجی همیشه',
		},
		{
			value: 'digiLalezarPlus',
			label: 'دیجی لاله‌زار پلاس',
			sampleText: 'بهار زندگی',
		},
	]

	return (
		<SectionPanel title="فونت برنامه" delay={0.15}>
			<div className="space-y-3">
				<p className="text-sm text-gray-400">
					فونت مورد نظر خود را برای نمایش در تمامی بخش‌های برنامه انتخاب کنید:
				</p>
				<div className="flex flex-wrap gap-2">
					{availableFonts.map((font) => (
						<button
							key={font.value}
							onClick={() => setFontFamily(font.value)}
							className={`flex flex-col items-center w-auto p-3 transition border rounded-lg ${
								fontFamily === font.value
									? 'border-blue-500 bg-blue-500/10'
									: 'border-gray-700 bg-white/5 hover:bg-white/10'
							}`}
							style={{ fontFamily: font.value }}
						>
							<div className="flex items-center justify-center mb-2">
								<div
									className={`w-4 h-4 rounded-full border ${
										fontFamily === font.value
											? 'border-blue-500 bg-blue-500'
											: 'border-gray-600'
									}`}
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
								<span className="mr-1.5 text-sm font-medium text-gray-300">
									{font.label}
								</span>
							</div>
							<p
								className="text-sm text-gray-400 max-w-[120px] text-center"
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
