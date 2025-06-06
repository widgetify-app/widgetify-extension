import { useCallback, useEffect, useRef, useState } from 'react'

enum TextInputSize {
	XS = 'xs',
	SM = 'sm',
	MD = 'md',
	LG = 'lg',
	XL = 'xl',
}
interface TextInputProps {
	id?: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	onFocus?: () => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	disabled?: boolean
	name?: string
	type?: string
	direction?: 'rtl' | 'ltr' | ''
	className?: string
	ref?: React.RefObject<HTMLInputElement | null>
	debounce?: boolean
	debounceTime?: number
	maxLength?: number
	size?: TextInputSize
}

export function TextInput({
	onChange,
	value,
	placeholder,
	onFocus,
	onKeyDown,
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
	size = TextInputSize.MD,
}: TextInputProps) {
	const sizes: Record<TextInputSize, string> = {
		[TextInputSize.XS]: 'input-xs',
		[TextInputSize.SM]: 'input-sm',
		[TextInputSize.MD]: 'input-md',
		[TextInputSize.LG]: 'input-lg',
		[TextInputSize.XL]: 'input-xl',
	}
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
				type === 'color' ? 50 : debounceTime
			)
		},
		[onChange, debounce, type, debounceTime]
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
			onKeyDown={onKeyDown}
			dir={direction}
			placeholder={placeholder || ''}
			className={`input bg-content w-full text-[14px] ${sizes[size]} rounded-xl !outline-none transition-all duration-300 focus:ring-1 focus:ring-blue-500/20
			   focus:border-primary
               font-light ${className}`}
			onChange={handleChange}
			maxLength={maxLength}
			autoComplete="off"
		/>
	)
}
