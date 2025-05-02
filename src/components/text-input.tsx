import { getInputStyle, useTheme } from '@/context/theme.context'
import { useCallback, useEffect, useRef, useState } from 'react'

interface TextInputProps {
	id?: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	onFocus?: () => void
	theme?: string
	disabled?: boolean
	name?: string
	type?: string
	direction?: 'rtl' | 'ltr' | ''
	className?: string
	ref?: React.RefObject<HTMLInputElement | null>
	debounce?: boolean
	debounceTime?: number
	maxLength?: number
}

export function TextInput({
	onChange,
	value,
	placeholder,
	onFocus,
	theme: propTheme,
	disabled = false,
	name,
	id,
	type = 'text',
	direction = '',
	className = '',
	ref,
	debounce = false,
	debounceTime = 150,
	maxLength = 1000,
}: TextInputProps) {
	const { theme: contextTheme } = useTheme()
	const theme = propTheme || contextTheme
	const [localValue, setLocalValue] = useState(value)
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		setLocalValue(value)
	}, [value])

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value
			setLocalValue(newValue)

			if (!debounce) {
				onChange(newValue)
				return
			}

			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current)
			}

			debounceTimerRef.current = setTimeout(
				() => {
					onChange(newValue)
				},
				type === 'color' ? 50 : debounceTime,
			)
		},
		[onChange, debounce, type, debounceTime],
	)

	return (
		<input
			ref={ref}
			id={id}
			type={type}
			name={name}
			value={localValue}
			disabled={disabled}
			onFocus={onFocus}
			dir={direction}
			placeholder={placeholder || ''}
			className={`w-full text-[14px] rounded-xl p-3 outline-none border 
                    transition-all duration-200 font-light ${getInputStyle(theme)} ${className}`}
			onChange={handleChange}
			maxLength={maxLength}
		/>
	)
}
