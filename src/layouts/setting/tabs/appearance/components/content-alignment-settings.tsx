import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'

interface ContentAlignmentSettingsProps {
	contentAlignment: 'center' | 'top'
	setContentAlignment: (alignment: 'center' | 'top') => void
}

export function ContentAlignmentSettings({
	contentAlignment,
	setContentAlignment,
}: ContentAlignmentSettingsProps) {
	const { theme, themeUtils } = useTheme()

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
				return 'border-gray-700 bg-neutral-800/80 hover:bg-neutral-700/60'
			default: // glass
				return 'border-gray-700 bg-white/5 hover:bg-white/10'
		}
	}

	const getBorderStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-400 border-dashed'
			case 'dark':
				return 'border-gray-600 border-dashed'
			default: // glass
				return 'border-gray-600 border-dashed'
		}
	}

	const getPreviewLineStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-400/60'
			case 'dark':
				return 'bg-gray-500/60'
			default: // glass
				return 'bg-gray-500/40'
		}
	}

	return (
		<SectionPanel title="تنظیمات چیدمان" delay={0.3}>
			<div className="space-y-3">
				<p className={themeUtils.getDescriptionTextStyle()}>موقعیت عمودی محتوا</p>
				<div className="flex gap-3">
					<button
						onClick={() => setContentAlignment('center')}
						className={`flex-1 p-3 rounded-lg transition border cursor-pointer ${
							contentAlignment === 'center'
								? getActiveButtonStyle()
								: getInactiveButtonStyle()
						}`}
					>
						<div className="flex flex-col items-center">
							<div
								className={`flex items-center justify-center w-full h-10 mb-2 border rounded ${getBorderStyle()}`}
							>
								<div className={`w-2/3 h-2 rounded ${getPreviewLineStyle()}`} />
							</div>
							<span className={`text-sm font-medium ${themeUtils.getTextColor()}`}>
								وسط
							</span>
						</div>
					</button>
					<button
						onClick={() => setContentAlignment('top')}
						className={`flex-1 p-3 rounded-lg transition border cursor-pointer ${
							contentAlignment === 'top'
								? getActiveButtonStyle()
								: getInactiveButtonStyle()
						}`}
					>
						<div className="flex flex-col items-center">
							<div
								className={`flex items-start justify-center w-full h-10 pt-1 mb-2 border rounded ${getBorderStyle()}`}
							>
								<div className={`w-2/3 h-2 rounded ${getPreviewLineStyle()}`} />
							</div>
							<span className={`text-sm font-medium ${themeUtils.getTextColor()}`}>
								بالا
							</span>
						</div>
					</button>
				</div>
			</div>
		</SectionPanel>
	)
}
