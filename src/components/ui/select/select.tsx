import { useEffect, useId, useRef, useState } from 'react'
import { Motion, Presence } from '@/common/motion'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { Portal } from '../portal/portal'
import {
	type AnchoredPlacement,
	isAnchorInViewport,
	resolveAnchoredPlacement,
} from '../utils/anchored-position'

const PANEL_OFFSET = 6
const TYPE_AHEAD_RESET_MS = 600

const triggerClass =
	'flex items-center justify-between gap-2 w-fit min-w-[5.5rem] max-w-full px-2.5 py-1.5 rounded-xl cursor-pointer select-none text-[10px] text-content bg-raised border border-subtle transition-ui hover:bg-muted focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-(--disabled-opacity)'

const panelClass =
	'fixed z-[9999] flex flex-col gap-0.5 p-1.5 overflow-y-auto rounded-2xl elevation-2xl bg-content bg-glass border border-subtle scrollbar-thin scrollbar-thumb'

const optionClass =
	'flex items-center justify-between w-full gap-2 px-2.5 py-1.5 text-[11px] text-right rounded-xl cursor-pointer transition-ui text-content disabled:cursor-not-allowed disabled:opacity-(--disabled-opacity)'

export interface SelectBoxProps {
	options: Array<{ value: string; label: string; disabled?: boolean }>
	optionalText?: string
	onChange?: (value: any) => void
	value?: string
	className?: string
	optionClassName?: string
	disabled?: boolean
}

export function SelectBox({
	options,
	optionalText,
	value,
	onChange,
	className,
	optionClassName,
	disabled,
}: SelectBoxProps) {
	const listboxId = useId()
	const triggerRef = useRef<HTMLButtonElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const typeAheadRef = useRef({ query: '', at: 0 })

	const [isOpen, setIsOpen] = useState(false)
	const [placement, setPlacement] = useState<AnchoredPlacement | null>(null)
	const [activeIndex, setActiveIndex] = useState(-1)

	const selectedIndex = options.findIndex((option) => option.value === value)
	const selectedLabel = options[selectedIndex]?.label ?? optionalText ?? ''
	const isPlaced = placement?.anchor === triggerRef.current

	const open = () => {
		if (disabled) return
		setActiveIndex(selectedIndex === -1 ? 0 : selectedIndex)
		setIsOpen(true)
	}

	const close = () => {
		setIsOpen(false)
		triggerRef.current?.focus()
	}

	const pick = (index: number) => {
		const option = options[index]
		if (!option || option.disabled) return
		onChange?.(option.value)
		close()
	}

	const moveTo = (index: number) => {
		if (options.length === 0) return
		const wrapped = (index + options.length) % options.length
		setActiveIndex(wrapped)
	}

	useEffect(() => {
		if (!isOpen) return

		const reposition = () => {
			if (!triggerRef.current || !panelRef.current) return

			const anchor = triggerRef.current.getBoundingClientRect()
			const viewport = { width: window.innerWidth, height: window.innerHeight }

			if (!isAnchorInViewport(anchor, viewport)) {
				setIsOpen(false)
				return
			}

			setPlacement({
				anchor: triggerRef.current,
				...resolveAnchoredPlacement(
					anchor,
					{
						width: panelRef.current.offsetWidth,
						height: panelRef.current.offsetHeight,
					},
					viewport,
					'bottom',
					PANEL_OFFSET,
					true
				),
			})
		}

		reposition()
		window.addEventListener('resize', reposition)
		window.addEventListener('scroll', reposition, true)

		return () => {
			window.removeEventListener('resize', reposition)
			window.removeEventListener('scroll', reposition, true)
		}
	}, [isOpen, options.length])

	useEffect(() => {
		if (!isOpen) return

		const handlePointerDown = (event: MouseEvent) => {
			const target = event.target as Node
			if (triggerRef.current?.contains(target)) return
			if (panelRef.current?.contains(target)) return
			setIsOpen(false)
		}

		document.addEventListener('mousedown', handlePointerDown)
		return () => document.removeEventListener('mousedown', handlePointerDown)
	}, [isOpen])

	useEffect(() => {
		if (!isOpen || activeIndex < 0) return
		panelRef.current
			?.querySelector(`[data-index="${activeIndex}"]`)
			?.scrollIntoView({ block: 'nearest' })
	}, [isOpen, activeIndex])

	const jumpToTyped = (char: string) => {
		const now = Date.now()
		const buffer =
			now - typeAheadRef.current.at > TYPE_AHEAD_RESET_MS
				? char
				: typeAheadRef.current.query + char

		typeAheadRef.current = { query: buffer, at: now }

		const match = options.findIndex(
			(option) => !option.disabled && option.label.toLowerCase().startsWith(buffer)
		)
		if (match !== -1) setActiveIndex(match)
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (disabled) return

		if (!isOpen) {
			if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
				event.preventDefault()
				open()
			}
			return
		}

		switch (event.key) {
			case 'Escape':
				event.preventDefault()
				event.stopPropagation()
				close()
				break
			case 'Tab':
				setIsOpen(false)
				break
			case 'ArrowDown':
				event.preventDefault()
				moveTo(activeIndex + 1)
				break
			case 'ArrowUp':
				event.preventDefault()
				moveTo(activeIndex - 1)
				break
			case 'Home':
				event.preventDefault()
				moveTo(0)
				break
			case 'End':
				event.preventDefault()
				moveTo(options.length - 1)
				break
			case 'Enter':
			case ' ':
				event.preventDefault()
				pick(activeIndex)
				break
			default:
				if (event.key.length === 1) {
					jumpToTyped(event.key.toLowerCase())
				}
		}
	}

	return (
		<>
			<button
				type="button"
				ref={triggerRef}
				disabled={disabled}
				role="combobox"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={listboxId}
				aria-activedescendant={
					isOpen && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
				}
				onClick={() => (isOpen ? setIsOpen(false) : open())}
				onKeyDown={handleKeyDown}
				className={cn(triggerClass, className)}
			>
				<span className="truncate">{selectedLabel}</span>
				<Icon
					name={isOpen ? 'chevronUp' : 'chevronDown'}
					size={12}
					className="shrink-0 text-muted"
					aria-hidden="true"
				/>
			</button>

			<Portal topLayer>
				<Presence>
					{isOpen && (
						<Motion.div
							ref={panelRef}
							id={listboxId}
							role="listbox"
							aria-label={optionalText}
							initial={{ opacity: 0, y: -4 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -4 }}
							transition={{ duration: 0.12, ease: 'easeOut' }}
							style={{
								left: placement?.x ?? 0,
								top: placement?.y ?? 0,
								minWidth: triggerRef.current?.offsetWidth,
								maxHeight: 240,
								visibility: isPlaced ? 'visible' : 'hidden',
								pointerEvents: 'auto',
							}}
							className={panelClass}
						>
							{options.map((option, index) => {
								const isSelected = option.value === value

								return (
									<button
										key={option.value}
										type="button"
										id={`${listboxId}-${index}`}
										data-index={index}
										role="option"
										tabIndex={-1}
										aria-selected={isSelected}
										disabled={option.disabled}
										onMouseEnter={() => setActiveIndex(index)}
										onClick={() => pick(index)}
										className={cn(
											optionClass,
											index === activeIndex &&
												'bg-muted',
											isSelected && 'font-bold text-primary',
											optionClassName
										)}
									>
										<span className="truncate">{option.label}</span>
										{isSelected && (
											<Icon
												name="check"
												size={11}
												className="shrink-0"
												aria-hidden="true"
											/>
										)}
									</button>
								)
							})}
						</Motion.div>
					)}
				</Presence>
			</Portal>
		</>
	)
}
