import { useEffect, useMemo, useRef, useState } from 'react'
import { FiCheck, FiChevronDown, FiSearch, FiX } from 'react-icons/fi'
import { useTheme } from '../../context/theme.context'

interface Option {
	value: string
	label: string
	labelEn?: string
}

interface OptionsGroup {
	label: string
	options: Option[]
}

interface ValueOption {
	value: string
	label: string
}

interface MultiSelectDropdownProps {
	options: Option[] | OptionsGroup[]
	values: ValueOption[]
	limit?: number
	onChange: (values: ValueOption[]) => void
	placeholder?: string
}

export const MultiSelectDropdown = ({
	options,
	values = [],
	limit,
	onChange,
	placeholder = 'انتخاب کنید...',
}: MultiSelectDropdownProps) => {
	const { theme } = useTheme()
	const [isOpen, setIsOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const dropdownRef = useRef<HTMLDivElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)

	const flatOptions = useMemo(() => {
		if (Array.isArray(options) && options.length > 0) {
			if ('options' in options[0]) {
				return (options as OptionsGroup[]).flatMap((group) => group.options)
			}
		}
		return options as Option[]
	}, [options])

	const filteredOptions = useMemo(() => {
		if (!searchTerm) {
			if (Array.isArray(options) && options.length > 0 && 'options' in options[0]) {
				return options as OptionsGroup[]
			}
			return options
		}

		const searchTermLower = searchTerm.toLowerCase()

		if (Array.isArray(options) && options.length > 0 && 'options' in options[0]) {
			return (options as OptionsGroup[])
				.map((group) => ({
					...group,
					options: group.options.filter(
						(option) =>
							option.label.toLowerCase().includes(searchTermLower) ||
							option.labelEn?.toLowerCase().includes(searchTermLower),
					),
				}))
				.filter((group) => group.options.length > 0)
		}

		return (options as Option[]).filter(
			(option) =>
				option.label.toLowerCase().includes(searchTermLower) ||
				option.labelEn?.toLowerCase().includes(searchTermLower),
		)
	}, [options, searchTerm])

	const isOptionSelected = (optionValue: string) => {
		return values.some((v) => v.value === optionValue)
	}

	const handleSelect = (option: Option) => {
		const isSelected = isOptionSelected(option.value)
		let newValues: ValueOption[]

		if (isSelected) {
			newValues = values.filter((val) => val.value !== option.value)
		} else {
			if (limit && values.length >= limit) {
				return
			}
			newValues = [...values, { value: option.value, label: option.label }]
		}

		onChange(newValues)
	}

	const handleRemoveOption = (value: string) => {
		onChange(values.filter((val) => val.value !== value))
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		if (isOpen && searchInputRef.current) {
			setTimeout(() => searchInputRef.current?.focus(), 100)
		}
	}, [isOpen])

	const getStyles = () => {
		switch (theme) {
			case 'light':
				return {
					container: 'bg-white border-gray-200 shadow-sm',
					dropdown: 'bg-white border-gray-200 shadow-lg',
					selectedBadge: 'bg-blue-50 text-blue-600 border-blue-100',
					groupHeading: 'text-gray-500 bg-gray-50',
					option: 'hover:bg-gray-50',
					selectedOption: 'bg-blue-50 text-blue-700',
					inputText: 'text-gray-700 placeholder-gray-400',
					searchIcon: 'text-gray-400',
					checkIcon: 'text-blue-500',
				}
			case 'dark':
				return {
					container: 'bg-gray-800 border-gray-700 shadow-md',
					dropdown: 'bg-gray-800 border-gray-700 shadow-lg',
					selectedBadge: 'bg-blue-900/50 text-blue-300 border-blue-800/60',
					groupHeading: 'text-gray-300 bg-gray-700/50',
					option: 'hover:bg-gray-700 text-gray-300',
					selectedOption: 'bg-blue-900/30 text-blue-300',
					inputText: 'text-gray-200 placeholder-gray-500',
					searchIcon: 'text-gray-500',
					checkIcon: 'text-blue-400',
				}
			default:
				return {
					container: 'bg-black/20 border-gray-700/30 backdrop-blur-sm shadow-md',
					dropdown: 'bg-black/30 border-gray-700/30 backdrop-blur-md shadow-lg',
					selectedBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
					groupHeading: 'text-gray-300 bg-white/5',
					option: 'hover:bg-white/10 text-gray-400',
					selectedOption: 'bg-blue-500/20 text-blue-300',
					inputText: 'text-gray-200 placeholder-gray-500',
					searchIcon: 'text-gray-500',
					checkIcon: 'text-blue-400',
				}
		}
	}

	const styles = getStyles()

	return (
		<div ref={dropdownRef} className="relative w-full">
			{/* Main input container */}
			<div
				className={`flex flex-wrap items-center gap-2 min-h-10 p-2 border rounded-lg cursor-pointer transition-colors ${styles.container}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				{/* Selected items badges */}
				{values.length > 0 ? (
					<div className="flex flex-wrap gap-1.5">
						{values.map((option) => (
							<div
								key={option.value}
								className={`flex items-center gap-1 px-2 py-0.5 text-sm rounded-md border ${styles.selectedBadge}`}
								onClick={(e) => {
									e.stopPropagation()
									handleRemoveOption(option.value)
								}}
							>
								<span>{option.label}</span>
								<FiX size={14} className="cursor-pointer hover:opacity-80" />
							</div>
						))}
					</div>
				) : (
					<div className={`text-sm ${styles.inputText}`}>{placeholder}</div>
				)}

				<div className="flex-grow" />
				<FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</div>

			{/* Dropdown */}
			{isOpen && (
				<div
					className={`absolute z-50 mt-1 w-full max-h-64 overflow-hidden rounded-lg border ${styles.dropdown}`}
				>
					{/* Search input */}
					<div className="flex items-center p-2 border-b border-gray-200 dark:border-gray-700">
						<FiSearch className={`mx-2 ${styles.searchIcon}`} />
						<input
							ref={searchInputRef}
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="جستجو..."
							className={`w-full p-1 outline-none bg-transparent ${styles.inputText}`}
							onClick={(e) => e.stopPropagation()}
						/>
						{searchTerm && (
							<button
								className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
								onClick={(e) => {
									e.stopPropagation()
									setSearchTerm('')
								}}
							>
								<FiX size={14} />
							</button>
						)}
					</div>

					{/* Options list */}
					<div className="overflow-y-auto max-h-48">
						{Array.isArray(filteredOptions) &&
							filteredOptions.length > 0 &&
							('options' in filteredOptions[0]
								? (filteredOptions as OptionsGroup[]).map((group) => (
										<div key={group.label}>
											<div
												className={`sticky top-0 p-2 text-xs font-semibold ${styles.groupHeading}`}
											>
												{group.label}
											</div>
											{group.options.map((option) => (
												<div
													key={option.value}
													className={`flex items-center justify-between p-3 cursor-pointer transition ${
														isOptionSelected(option.value)
															? styles.selectedOption
															: styles.option
													}`}
													onClick={(e) => {
														e.stopPropagation()
														handleSelect(option)
													}}
												>
													<div className="flex justify-between w-full">
														<span>{option.label}</span>
														{option.labelEn && (
															<span className="text-xs opacity-60">{option.labelEn}</span>
														)}
													</div>
													{isOptionSelected(option.value) && (
														<FiCheck className={styles.checkIcon} />
													)}
												</div>
											))}
										</div>
									))
								: (filteredOptions as Option[]).map((option) => (
										<div
											key={option.value}
											className={`flex items-center justify-between p-3 cursor-pointer transition ${
												isOptionSelected(option.value)
													? styles.selectedOption
													: styles.option
											}`}
											onClick={(e) => {
												e.stopPropagation()
												handleSelect(option)
											}}
										>
											<div className="flex justify-between w-full">
												<span>{option.label}</span>
												{option.labelEn && (
													<span className="text-xs opacity-60">{option.labelEn}</span>
												)}
											</div>
											{isOptionSelected(option.value) && (
												<FiCheck className={styles.checkIcon} />
											)}
										</div>
									)))}

						{/* No results */}
						{(!Array.isArray(filteredOptions) || filteredOptions.length === 0) && (
							<div className="p-4 text-center text-gray-500 dark:text-gray-400">
								موردی یافت نشد
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
