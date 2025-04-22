import { useTheme } from '@/context/theme.context'
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

	const getInputStyle = () => {
		switch (theme) {
			case 'light':
				return `
                    bg-white/90 text-gray-800 border-gray-300/30
                    placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    hover:bg-white disabled:bg-gray-100 disabled:text-gray-500
                `
			case 'dark':
				return `
                    bg-neutral-800/80 text-gray-200 border-gray-700/40
                    placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    hover:bg-neutral-800/90 disabled:bg-gray-800/50 disabled:text-gray-500
                `
			default: // glass
				return `
                    bg-white/5 text-gray-200 border-white/10
                    placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    hover:bg-white/10 disabled:bg-white/3 disabled:text-gray-500
                `
		}
	}

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
                    transition-all duration-200 font-light ${getInputStyle()} ${className}`}
			onChange={handleChange}
		/>
	)
}
