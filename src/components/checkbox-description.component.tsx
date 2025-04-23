import CustomCheckbox from '@/components/checkbox'
import {
	getCardBackground,
	getDescriptionTextStyle,
	getHeadingTextStyle,
	useTheme,
} from '@/context/theme.context'

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
	const { theme } = useTheme()

	return (
		<div
			className={`flex items-start gap-3 p-4 transition-all duration-200 cursor-pointer rounded-xl backdrop-blur-sm hover:scale-[1.01] active:scale-[0.99] ${getCardBackground(theme)}`}
			onClick={onToggle}
		>
			<CustomCheckbox checked={isEnabled} onChange={onToggle} />
			<div className="flex-1">
				<p className={`font-medium ${getHeadingTextStyle(theme)}`}>{title}</p>
				{description ? (
					<p className={`text-sm font-light ${getDescriptionTextStyle(theme)}`}>
						{description}
					</p>
				) : null}
			</div>
		</div>
	)
}
