import type { ReactNode } from 'react'
import { Portal } from '../portal/Portal'
import { useDropdown } from './useDropdown'
import { useState, useLayoutEffect, useRef } from 'react'

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
	id?: string
	placeholder?: string
	onClose?: () => void
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
	id,
	onClose,
}: DropdownProps) {
	const { isOpen, toggle, close, dropdownRef, dropdownContentRef } = useDropdown()
	const [isReady, setIsReady] = useState(false)
	const [dropdownPosition, setDropdownPosition] = useState({ top: '0px', left: '0px' })
	const positionCalculatedRef = useRef(false)

	const handleOptionClick = (option: DropdownOption) => {
		if (option.disabled) return
		option.onClick?.()
		onOptionSelect?.(option)
		if (!option.value || option.value !== 'keep-open') {
			close()
		}
	}

	useLayoutEffect(() => {
		if (!isOpen) {
			setIsReady(false)
			positionCalculatedRef.current = false
			onClose?.()
		}
	}, [isOpen, onClose])

	useLayoutEffect(() => {
		if (!isOpen || !dropdownRef.current || !dropdownContentRef.current) {
			return
		}

		if (positionCalculatedRef.current) return

		const calculatePosition = () => {
			const triggerEl = dropdownRef.current
			const contentEl = dropdownContentRef.current
			if (!triggerEl || !contentEl) return

			const triggerRect = triggerEl.getBoundingClientRect()
			const contentRect = contentEl.getBoundingClientRect()
			const viewportWidth = window.innerWidth
			const viewportHeight = window.innerHeight

			let dropdownWidth =
				width === 'auto'
					? Math.min(contentRect.width || 250, viewportWidth - 32)
					: width === 'full'
						? Math.min(400, viewportWidth - 32)
						: parseInt(width as string, 10) || 250

			const dropdownHeight = contentRect.height || parseInt(maxHeight, 10) || 300

			let top: number, left: number

			switch (position) {
				case 'bottom-left':
				case 'top-left':
					left = triggerRect.left
					break
				case 'bottom-right':
				case 'top-right':
					left = triggerRect.right - dropdownWidth
					break
				case 'bottom-center':
					left = triggerRect.left + triggerRect.width / 2 - dropdownWidth / 2
					break
				default:
					left = triggerRect.left
			}

			if (position.startsWith('bottom')) {
				top = triggerRect.bottom + 4
				if (top + dropdownHeight > viewportHeight - 16) {
					top = triggerRect.top - dropdownHeight - 4
				}
			} else {
				top = triggerRect.top - dropdownHeight - 4
				if (top < 16) {
					top = triggerRect.bottom + 4
				}
			}

			const padding = 16
			left = Math.max(
				padding,
				Math.min(left, viewportWidth - dropdownWidth - padding)
			)
			top = Math.max(
				padding,
				Math.min(top, viewportHeight - dropdownHeight - padding)
			)

			setDropdownPosition({
				top: `${Math.max(0, top)}px`,
				left: `${Math.max(0, left)}px`,
			})

			positionCalculatedRef.current = true
			setIsReady(true)
		}

		const rafId = requestAnimationFrame(() => {
			calculatePosition()
		})

		const handleUpdate = () => {
			positionCalculatedRef.current = false
			requestAnimationFrame(calculatePosition)
		}

		window.addEventListener('resize', handleUpdate)
		window.addEventListener('scroll', handleUpdate, true)

		const resizeObserver = new ResizeObserver(() => {
			positionCalculatedRef.current = false
			requestAnimationFrame(calculatePosition)
		})

		let element: HTMLElement | null = dropdownRef.current
		while (element) {
			resizeObserver.observe(element)
			element = element.parentElement
		}
		if (dropdownContentRef.current) {
			resizeObserver.observe(dropdownContentRef.current)
		}

		return () => {
			cancelAnimationFrame(rafId)
			window.removeEventListener('resize', handleUpdate)
			window.removeEventListener('scroll', handleUpdate, true)
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
					<div id={id} className="fixed inset-0 z-[9998] pointer-events-none">
						<div
							ref={dropdownContentRef}
							className={`fixed z-9999 shadow-xl overflow-hidden rounded-2xl bg-transparent! transition-opacity duration-100 ${isReady ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} bg-glass ${dropdownClassName}`}
							style={{
								maxHeight,
								width:
									width === 'auto'
										? 'auto'
										: width === 'full'
											? '100%'
											: width,
								minWidth: width === 'auto' ? '150px' : undefined,
								top: dropdownPosition.top,
								left: dropdownPosition.left,
								visibility: isReady ? 'visible' : 'hidden',
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
