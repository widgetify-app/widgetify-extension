import { useCallback, useEffect, useRef, useState } from 'react'
import { TextInput } from '../text-input'

enum DropdownSize {
	XS = 'xs',
	SM = 'sm',
	MD = 'md',
	LG = 'lg',
	XL = 'xl',
}

interface DropdownOption {
	label: React.ReactNode
	value: string | number
	disabled?: boolean
}

interface DropdownProps {
	id?: string
	value: string | number | (string | number)[]
	onChange: (value: string | number | (string | number)[]) => void
	options: DropdownOption[]
	placeholder?: string
	disabled?: boolean
	name?: string
	className?: string
	size?: DropdownSize
	searchable?: boolean
	clearable?: boolean
	multiple?: boolean
	maxHeight?: string
	onFocus?: () => void
	onBlur?: () => void
	onSearch?: (searchTerm: string) => void
	searchTerm?: string
}

export function Dropdown({
	id,
	value,
	onChange,
	options,
	placeholder = 'Select an option...',
	disabled = false,
	name,
	className = '',
	size = DropdownSize.MD,
	searchable = false,
	clearable = false,
	multiple = false,
	maxHeight = '200px',
	onFocus,
	onBlur,
	onSearch,
	searchTerm,
}: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedValues, setSelectedValues] = useState<(string | number)[]>(() => {
		if (multiple) {
			return Array.isArray(value) ? value : []
		}
		return value !== '' && value !== null && value !== undefined
			? [value as string | number]
			: []
	})

	const dropdownRef = useRef<HTMLDivElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)

	const sizes: Record<DropdownSize, string> = {
		[DropdownSize.XS]: 'h-8 text-xs px-2',
		[DropdownSize.SM]: 'h-9 text-sm px-3',
		[DropdownSize.MD]: 'h-10 text-[14px] px-4',
		[DropdownSize.LG]: 'h-11 text-base px-4',
		[DropdownSize.XL]: 'h-12 text-lg px-5',
	}

	const filteredOptions = options

	// Get selected option(s) for display
	const getSelectedDisplay = useCallback(() => {
		if (multiple) {
			const selected = options.filter((option) =>
				selectedValues.includes(option.value)
			)
			if (selected.length === 0) return placeholder
			if (selected.length === 1) return selected[0].label
			return `${selected.length} ایتم انتخاب شده`
		} else {
			const selected = options.find((option) => option.value === value)
			return selected ? selected.label : placeholder
		}
	}, [value, selectedValues, options, placeholder, multiple])

	// Handle option selection
	const handleOptionSelect = useCallback(
		(optionValue: string | number) => {
			if (multiple) {
				const newValues = selectedValues.includes(optionValue)
					? selectedValues.filter((v) => v !== optionValue)
					: [...selectedValues, optionValue]
				setSelectedValues(newValues)
				onChange(newValues)
			} else {
				onChange(optionValue)
				setIsOpen(false)
			}
		},
		[multiple, selectedValues, onChange]
	)

	// Handle clear selection
	const handleClear = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			if (multiple) {
				setSelectedValues([])
				onChange([])
			} else {
				onChange('')
			}
		},
		[multiple, onChange]
	)

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Focus search input when dropdown opens
	useEffect(() => {
		if (isOpen && searchable && searchInputRef.current) {
			searchInputRef.current.focus()
		}
	}, [isOpen, searchable])

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case 'Escape':
					setIsOpen(false)
					break
				case 'Enter':
				case ' ':
					if (!isOpen) {
						e.preventDefault()
						setIsOpen(true)
					}
					break
				case 'ArrowDown':
					e.preventDefault()
					if (!isOpen) {
						setIsOpen(true)
					}
					break
			}
		},
		[isOpen]
	)

	const toggleDropdown = useCallback(() => {
		if (!disabled) {
			setIsOpen((prev) => {
				const newState = !prev
				if (newState && onFocus) {
					onFocus()
				} else if (!newState && onBlur) {
					onBlur()
				}
				return newState
			})
		}
	}, [disabled, onFocus, onBlur])

	const hasValue = multiple
		? selectedValues.length > 0
		: value !== '' && value !== null && value !== undefined

	return (
		<div ref={dropdownRef} className={`relative w-full ${className}`}>
			{/* Dropdown Trigger */}
			<button
				id={id}
				name={name}
				type="button"
				disabled={disabled}
				onClick={toggleDropdown}
				onKeyDown={handleKeyDown}
				className={`
					bg-content w-full ${sizes[size]} rounded-xl 
					!outline-none transition-all duration-300 
					focus:ring-1 focus:ring-blue-500/20 focus:border-primary
					border border-content
					font-light text-left flex items-center justify-between
					${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
					${isOpen ? 'border-primary ring-1 ring-blue-500/20' : ''}
				`}
			>
				<span className={`${hasValue ? 'text-content' : 'text-muted'}`}>
					{getSelectedDisplay()}
				</span>

				<div className="flex items-center gap-1">
					{clearable && hasValue && !disabled && (
						<button
							type="button"
							onClick={handleClear}
							className="p-1 transition-colors rounded-full hover:bg-base-content/10"
						>
							<svg
								className="w-3 h-3 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}

					<svg
						className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute z-50 w-full mt-1 border shadow-lg border-content bg-widget bg-glass rounded-xl">
					{/* Search Input */}
					{searchable && (
						<div className="p-2 border-b border-content">
							<TextInput
								value={searchTerm || ''}
								onChange={(value) => (onSearch ? onSearch(value) : null)}
								placeholder="جستجو"
								className="w-full px-3 py-2 text-sm"
							/>
						</div>
					)}

					{/* Options List */}
					<div className="py-1 overflow-y-auto" style={{ maxHeight }}>
						{/* {filteredOptions.length === 0 ? ( */}
						{filteredOptions.length === 0 ? (
							<div className="px-4 py-3 text-sm text-center text-content">
								{searchable && searchTerm
									? 'No results found'
									: 'No options available'}
							</div>
						) : (
							filteredOptions.map((option) => {
								const isSelected = multiple
									? selectedValues.includes(option.value)
									: value === option.value

								return (
									<button
										key={option.value}
										type="button"
										disabled={option.disabled}
										onClick={() => handleOptionSelect(option.value)}
										className={`
											w-full px-4 py-2 text-left text-sm transition-colors duration-150
											flex items-center justify-between
											${
												option.disabled
													? 'opacity-50 cursor-not-allowed'
													: 'cursor-pointer hover:bg-primary/50'
											}
											${
												isSelected
													? 'bg-primary/80'
													: 'text-content'
											}
										`}
									>
										{option.label}
										{isSelected && (
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</button>
								)
							})
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export { DropdownSize }
export type { DropdownProps, DropdownOption }
