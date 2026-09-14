import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/common/utils/cn'
import { type TextInputSize, textInputVariants } from './input.variants'

export interface TextInputProps {
	id?: string
	value?: string
	defaultValue?: string
	onChange: (value: string) => void
	placeholder?: string
	onFocus?: () => void
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	disabled?: boolean
	name?: string
	type?: string
	direction?: 'rtl' | 'ltr' | 'auto'
	className?: string
	ref?: React.RefObject<HTMLInputElement | null>
	debounce?: boolean
	debounceTime?: number
	maxLength?: number
	size?: TextInputSize
	invalid?: boolean
	min?: number
	max?: number
	autoComplete?: 'on' | 'off'
}

export const TextInput = memo(function TextInput({
	onChange,
	value,
	defaultValue,
	placeholder,
	onFocus,
	onBlur,
	onKeyDown,
	disabled = false,
	name,
	id,
	type = 'text',
	direction,
	className,
	ref,
	debounce = false,
	debounceTime = 150,
	maxLength = 1000,
	size = 'md',
	invalid = false,
	min,
	max,
	autoComplete = 'off',
}: TextInputProps) {
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
	const isControlled = value !== undefined
	const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '')

	useEffect(() => {
		if (value !== undefined) {
			setInternalValue(value)
		}
	}, [value])

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value
			setInternalValue(newValue)

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
					debounceTimerRef.current = null
				},
				type === 'color' ? 50 : debounceTime
			)
		},
		[onChange, debounce, type, debounceTime]
	)

	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLInputElement>) => {
			if (debounce && debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current)
				debounceTimerRef.current = null
				onChange(internalValue)
			}
			onBlur?.(e)
		},
		[debounce, internalValue, onBlur, onChange]
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
		onBlur: handleBlur,
		onKeyDown,
		dir: direction,
		placeholder: placeholder || '',
		className: cn(textInputVariants({ size, invalid }), className),
		onChange: handleChange,
		maxLength,
		autoComplete,
		min,
		max,
	}

	if (isControlled) {
		return <input {...inputProps} value={internalValue} />
	}

	return <input {...inputProps} defaultValue={defaultValue} />
})

TextInput.displayName = 'TextInput'
