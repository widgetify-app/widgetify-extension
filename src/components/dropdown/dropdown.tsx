import type { ReactNode } from 'react'
import { Portal } from '../portal/Portal'
import { useDropdown } from './useDropdown'
import { useEffect, useState } from 'react'

export interface DropdownOption {
	id: string
	label: ReactNode
	value?: any
	onClick?: () => void
	disabled?: boolean
}

export interface DropdownProps {
	trigger: ReactNode
	options?: DropdownOption[]
	children?: ReactNode
	className?: string
	dropdownClassName?: string
	position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'bottom-center'
	width?: 'auto' | 'full' | string
	maxHeight?: string
	onOptionSelect?: (option: DropdownOption) => void
	disabled?: boolean
	placeholder?: string
}

export function Dropdown({
	trigger,
	options = [],
	children,
	className = '',
	dropdownClassName = '',
	position = 'bottom-left',
	width = 'auto',
	maxHeight = '300px',
	onOptionSelect,
	disabled = false,
	placeholder,
}: DropdownProps) {
	const { isOpen, toggle, close, dropdownRef, dropdownContentRef } = useDropdown()
	const [dropdownPosition, setDropdownPosition] = useState({ top: '0px', left: '0px' })

	const handleOptionClick = (option: DropdownOption) => {
		if (option.disabled) return

		option.onClick?.()
		onOptionSelect?.(option)

		if (!option.value || option.value !== 'keep-open') {
			close()
		}
	}

	useEffect(() => {
		if (!isOpen || !dropdownRef.current) return

		const calculatePosition = () => {
			if (!dropdownRef.current) return

			const rect = dropdownRef.current.getBoundingClientRect()
			const viewportHeight = window.innerHeight
			const viewportWidth = window.innerWidth

			const dropdownWidth =
				width === 'auto'
					? 250
					: width === 'full'
						? Math.min(400, viewportWidth - 32)
						: parseInt(width as string, 10) || 250

			const dropdownHeight = dropdownContentRef.current
				? dropdownContentRef.current.offsetHeight
				: parseInt(maxHeight, 10) || 300

			let top: number
			let left: number

			switch (position) {
				case 'bottom-left':
				case 'top-left':
					left = rect.left
					break
				case 'bottom-right':
				case 'top-right':
					left = rect.right - dropdownWidth
					break
				case 'bottom-center':
					left = rect.left + rect.width / 2 - dropdownWidth / 2
					break
				default:
					left = rect.left
			}

			if (position.startsWith('bottom')) {
				top = rect.bottom + 4
				if (top + dropdownHeight > viewportHeight - 16) {
					top = rect.top - dropdownHeight - 4
				}
			} else {
				top = rect.top - dropdownHeight - 4
				if (top < 16) {
					top = rect.bottom + 4
				}
			}

			const padding = 16
			if (left < padding) left = padding
			if (left + dropdownWidth > viewportWidth - padding) {
				left = viewportWidth - dropdownWidth - padding
			}

			if (top < padding) top = padding
			if (top + dropdownHeight > viewportHeight - padding) {
				top = viewportHeight - dropdownHeight - padding
			}

			setDropdownPosition({
				top: `${Math.max(0, top)}px`,
				left: `${Math.max(0, left)}px`,
			})
		}

		// محاسبه اولیه با تاخیر کوچک
		const initialTimeout = setTimeout(calculatePosition, 10)

		// Event listeners
		window.addEventListener('resize', calculatePosition)
		window.addEventListener('scroll', calculatePosition, true)

		// ResizeObserver برای track کردن تغییرات سایز
		const resizeObserver = new ResizeObserver(() => {
			// استفاده از requestAnimationFrame فقط برای این callback
			// تا smooth باشد اما loop نداشته باشیم
			requestAnimationFrame(calculatePosition)
		})

		// Track trigger و همه parent هاش
		let element: HTMLElement | null = dropdownRef.current
		while (element) {
			resizeObserver.observe(element)
			element = element.parentElement
		}

		// Track خود dropdown هم
		if (dropdownContentRef.current) {
			resizeObserver.observe(dropdownContentRef.current)
		}

		return () => {
			clearTimeout(initialTimeout)
			window.removeEventListener('resize', calculatePosition)
			window.removeEventListener('scroll', calculatePosition, true)
			resizeObserver.disconnect()
		}
	}, [isOpen, position, width, maxHeight])

	const dropdownContent = children || (
		<>
			{options.length === 0 && placeholder && (
				<div className="px-3 py-2 text-sm italic text-muted">{placeholder}</div>
			)}
			{options.map((option) => (
				<button
					key={option.id}
					onClick={() => handleOptionClick(option)}
					disabled={option.disabled}
					className={`
						w-full text-left px-3 py-2 text-sm transition-colors
						hover:bg-primary/10 hover:text-primary
						disabled:opacity-50 disabled:cursor-not-allowed
						disabled:hover:bg-transparent disabled:hover:text-muted
						focus:outline-none focus:bg-primary/10 focus:text-primary
					`}
				>
					{option.label}
				</button>
			))}
		</>
	)

	return (
		<div ref={dropdownRef} className={`relative inline-block ${className}`}>
			<div
				onClick={disabled ? undefined : toggle}
				className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
			>
				{trigger}
			</div>

			{isOpen && !disabled && (
				<Portal>
					<div className="fixed inset-0 z-[9998] pointer-events-none">
						<div
							ref={dropdownContentRef}
							className={`
								fixed z-[9999] border border-content rounded-xl
								bg-content shadow-xl
								overflow-hidden pointer-events-auto
								animate-in fade-in-0 zoom-in-95 duration-100 bg-glass
								${dropdownClassName}
							`}
							style={{
								maxHeight,
								width:
									width === 'auto'
										? 'auto'
										: width === 'full'
											? '100%'
											: width,
								minWidth: width === 'auto' ? '150px' : undefined,
								...dropdownPosition,
							}}
						>
							<div className="max-h-full overflow-y-auto">
								{dropdownContent}
							</div>
						</div>
					</div>
				</Portal>
			)}
		</div>
	)
}

export interface SimpleDropdownProps extends Omit<DropdownProps, 'options' | 'trigger'> {
	triggerText: string
	triggerIcon?: ReactNode
	options: (string | { label: string; value: any; disabled?: boolean })[]
	onSelect?: (value: any) => void
}

export function SimpleDropdown({
	triggerText,
	triggerIcon,
	options,
	onSelect,
	...dropdownProps
}: SimpleDropdownProps) {
	const formattedOptions: DropdownOption[] = options.map((option, index) => {
		if (typeof option === 'string') {
			return {
				id: `option-${index}`,
				label: option,
				value: option,
			}
		}
		return {
			id: `option-${index}`,
			label: option.label,
			value: option.value,
			disabled: option.disabled,
		}
	})

	const trigger = (
		<div className="flex items-center gap-2 px-3 py-2 transition-colors border rounded-lg bg-content border-border hover:bg-primary/5">
			{triggerIcon}
			<span>{triggerText}</span>
		</div>
	)

	return (
		<Dropdown
			{...dropdownProps}
			trigger={trigger}
			options={formattedOptions}
			onOptionSelect={(option) => onSelect?.(option.value)}
		/>
	)
}
