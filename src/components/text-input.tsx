import { useCallback, useEffect, useRef, memo } from 'react'

enum TextInputSize {
	XS = 'xs',
	SM = 'sm',
	MD = 'md',
	LG = 'lg',
	XL = 'xl',
}

interface TextInputProps {
	id?: string
	value?: string
	defaultValue?: string
	onChange: (value: string) => void
	placeholder?: string
	onFocus?: () => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	disabled?: boolean
	name?: string
	type?: string
	direction?: 'rtl' | 'ltr' | 'auto' | ''
	className?: string
	ref?: React.RefObject<HTMLInputElement | null>
	debounce?: boolean
	debounceTime?: number
	maxLength?: number
	size?: TextInputSize
	min?: number
	max?: number
	autoComplete?: 'on' | 'off'
}

const sizes: Record<TextInputSize, string> = {
	[TextInputSize.XS]: 'input-xs',
	[TextInputSize.SM]: 'input-sm',
	[TextInputSize.MD]: 'input-md',
	[TextInputSize.LG]: 'input-lg',
	[TextInputSize.XL]: 'input-xl',
}

export const TextInput = memo(function TextInput({
	onChange,
	value,
	defaultValue,
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
	min,
	max,
	autoComplete = 'off',
}: TextInputProps) {
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
	const isControlled = value !== undefined

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value

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

	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current)
			}
		}
	}, [])

	const inputProps = {
		ref,
		id,
		type,
		name,
		disabled,
		onFocus,
		onKeyDown,
		dir: direction,
		placeholder: placeholder || '',
		className: `input bg-content w-full text-[14px] ${sizes[size]} rounded-xl !outline-none transition-all duration-300 focus:ring-1 focus:ring-blue-500/20 focus:border-primary font-light ${className}`,
		onChange: handleChange,
		maxLength,
		autoComplete,
		min,
		max,
	}

	if (isControlled) {
		return <input {...inputProps} value={value} />
	}

	return <input {...inputProps} defaultValue={defaultValue} />
})

TextInput.displayName = 'TextInput'
