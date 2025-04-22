import CustomCheckbox from '@/components/checkbox'
import { useTheme } from '@/context/theme.context'

interface Props {
	isEnabled: boolean
	onToggle: () => void
	title: string
	description?: string
}

export function CheckBoxWithDescription({
	isEnabled,
	onToggle,
	title,
	description,
}: Props) {
	const { theme, themeUtils } = useTheme()

	const getContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70 hover:bg-gray-200/70'
			case 'dark':
				return 'bg-neutral-800/80 hover:bg-neutral-700/70'
			default: // glass
				return 'bg-white/5 hover:bg-white/8'
		}
	}

	return (
		<div
			className={`flex items-start gap-3 p-4 transition-all duration-200 cursor-pointer rounded-xl backdrop-blur-sm hover:scale-[1.01] active:scale-[0.99] ${getContainerStyle()}`}
			onClick={onToggle}
		>
			<CustomCheckbox checked={isEnabled} onChange={onToggle} theme={theme} />
			<div className="flex-1">
				<p className={`font-medium ${themeUtils.getHeadingTextStyle()}`}>{title}</p>
				{description ? (
					<p className={`text-sm font-light ${themeUtils.getDescriptionTextStyle()}`}>
						{description}
					</p>
				) : null}
			</div>
		</div>
	)
}
