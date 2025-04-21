import { useTheme } from '@/context/theme.context'
import { memo } from 'react'

interface CustomCheckboxProps {
	checked: boolean
	onChange: (checked: boolean) => void
	label?: string
	theme?: string
	disabled?: boolean
	fontSize?: 'font-light' | 'font-normal' | 'font-bold'
}

const CustomCheckbox = ({
	checked,
	onChange,
	label,
	theme: propTheme,
	disabled = false,
	fontSize = 'font-normal',
}: CustomCheckboxProps) => {
	const { theme: contextTheme } = useTheme()

	const theme = propTheme || contextTheme || 'glass'

	const getCheckboxStyle = () => {
		if (checked) {
			return 'bg-blue-500 border-blue-500'
		}

		switch (theme) {
			case 'light':
				return 'bg-white border-gray-300 hover:border-gray-400'
			case 'dark':
				return 'bg-gray-700 border-gray-600 hover:border-gray-500'
			default: // glass
				return 'bg-white/5 border-white/20 hover:border-white/30'
		}
	}

	const getLabelStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			case 'dark':
				return 'text-gray-200'
			default: // glass
				return 'text-gray-300'
		}
	}

	return (
		<label className="relative flex items-center transition-transform cursor-pointer group active:scale-95">
			<div className="relative">
				<input
					type="checkbox"
					className="sr-only peer"
					checked={checked}
					onChange={(e) => !disabled && onChange(e.target.checked)}
					disabled={disabled}
				/>
				<div
					className={`w-5 h-5 border rounded-md flex items-center justify-center transition-colors duration-200 ${getCheckboxStyle()}`}
				>
					<svg
						className={`transition-all duration-150 ${checked ? 'scale-100' : 'scale-0'}`}
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
					>
						<path
							className={`transition-all duration-200 ${checked ? 'stroke-dashoffset-0' : 'stroke-dashoffset-full'}`}
							d="M2.5 6L5 8.5L9.5 4"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeDasharray="1"
							strokeDashoffset={checked ? '0' : '1'}
						/>
					</svg>
				</div>
			</div>
			{label && (
				<span className={`ml-2 mr-2 ${fontSize} text-sm ${getLabelStyle()}`}>
					{label}
				</span>
			)}
		</label>
	)
}

export default memo(CustomCheckbox)
