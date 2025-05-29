import { memo } from 'react'

interface CustomCheckboxProps {
	checked: boolean
	onChange: (checked: boolean) => void
	label?: string
	disabled?: boolean
	fontSize?: 'font-light' | 'font-normal' | 'font-bold'
}

const CustomCheckbox = ({
	checked,
	onChange,
	label,
	disabled = false,
	fontSize = 'font-normal',
}: CustomCheckboxProps) => {
	const getCheckboxStyle = () => {
		if (checked) {
			return 'bg-blue-500 border-blue-500'
		}

		return 'border-content'
	}

	return (
		<label className="relative flex items-center transition-transform cursor-pointer group active:scale-95">
			<div className="relative">
				<input
					type="checkbox"
					className={'sr-only'}
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
				<span className={`ml-2 mr-2 ${fontSize} text-sm text-content`}>{label}</span>
			)}
		</label>
	)
}

export default memo(CustomCheckbox)
