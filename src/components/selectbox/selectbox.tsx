export interface SelectBoxProps {
	options: Array<{ value: string; label: string; disabled?: boolean }>
	optionalText?: string
	onChange?: (value: any) => void
	value?: string
}

export function SelectBox({ options, value, onChange }: SelectBoxProps) {
	return (
		<select
			value={value}
			onChange={(e) => onChange?.(e.target.value)}
			className={
				'select select-xs text-[10px] w-[5.5rem] !px-2.5 rounded-xl !outline-none !border-none !shadow-none text-muted bg-base-300 cursor-pointer'
			}
			style={{
				backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
				backgroundPosition: 'left 0.5rem center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: '1.3em 1.3em',
				paddingLeft: '3rem',
			}}
		>
			{options.map((opt) => (
				<option
					key={opt.value}
					value={opt.value}
					disabled={opt.disabled}
					className="text-content"
				>
					{opt.label}
				</option>
			))}
		</select>
	)
}
