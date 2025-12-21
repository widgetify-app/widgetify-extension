import { Button } from '@/components/button/button'
import { ClickableTooltip } from '@/components/clickableTooltip'
import { useRef, useState, useEffect } from 'react'
import { FiCheck } from 'react-icons/fi'
import {
	LuBriefcase,
	LuCalendarDays,
	LuChevronDown,
	LuChevronRight,
} from 'react-icons/lu'

const PERSIAN_MONTHS = [
	'فروردین',
	'اردیبهشت',
	'خرداد',
	'تیر',
	'مرداد',
	'شهریور',
	'مهر',
	'آبان',
	'آذر',
	'دی',
	'بهمن',
	'اسفند',
]

const MONTH_DAYS = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]

interface JalaliDatePickerProps {
	id?: string
	label?: string
	value: string
	onChange: (value: string) => void
	enable: boolean
}

export default function JalaliDatePicker({
	id,
	label,
	value,
	onChange,
	enable,
}: JalaliDatePickerProps) {
	const currentYear = 1403
	const [isOpen, setIsOpen] = useState(false)
	const triggerRef = useRef<any>(null)

	const [tempDate, setTempDate] = useState({ year: 1380, month: 1, day: 1 })

	const parseValue = (val: string) => {
		if (!val) return { year: 1380, month: 1, day: 1 }

		const parts = val.includes('-') ? val.split('-') : val.split('/')
		return {
			year: parseInt(parts[0], 10) || 1380,
			month: parseInt(parts[1], 10) || 1,
			day: parseInt(parts[2], 10) || 1,
		}
	}

	useEffect(() => {
		if (isOpen) {
			const parsed = parseValue(value)
			setTempDate(parsed)
		}
	}, [isOpen, value])

	const getDaysInMonth = (m: number, y: number) => {
		if (m === 12) {
			const isLeap = ((y % 33) * 8 + 13) % 33 < 8
			return isLeap ? 30 : 29
		}
		return MONTH_DAYS[m - 1]
	}

	const handleYearChange = (y: number) => {
		const maxDay = getDaysInMonth(tempDate.month, y)
		const validDay = Math.min(tempDate.day, maxDay)
		setTempDate({ ...tempDate, year: y, day: validDay })
	}

	const handleMonthChange = (m: number) => {
		const maxDay = getDaysInMonth(m, tempDate.year)
		const validDay = Math.min(tempDate.day, maxDay)
		setTempDate({ ...tempDate, month: m, day: validDay })
	}

	const handleDayChange = (d: number) => {
		setTempDate({ ...tempDate, day: d })
	}

	const handleConfirm = () => {
		const formattedDate = `${tempDate.year}-${tempDate.month.toString().padStart(2, '0')}-${tempDate.day.toString().padStart(2, '0')}`
		onChange(formattedDate)
		setIsOpen(false)
	}

	const handleCancel = () => {
		setIsOpen(false)
	}

	const onClickToOpen = () => {
		if (!enable) {
			return
		}

		setIsOpen(true)
	}

	return (
		<>
			<button
				ref={enable ? triggerRef : null}
				type="button"
				onClick={() => onClickToOpen()}
				className="flex items-center justify-between w-full p-3 text-right transition-colors hover:bg-content"
			>
				<div
					className={`flex items-center justify-between w-full h-12 p-3 transition-colors border  border-content rounded-xl  ${!enable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50! cursor-pointer'}`}
				>
					<div className="flex items-center gap-3">
						<LuCalendarDays size={14} className="text-primary" />
						<span className={value ? 'text-content' : 'text-muted'}>
							{value || 'انتخاب تاریخ'}
						</span>
					</div>
					<LuChevronRight size={18} className="text-muted" />
				</div>
			</button>

			<ClickableTooltip
				triggerRef={triggerRef}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				content={
					<div className="min-w-52">
						<div className="flex gap-3 mb-5">
							<ScrollWheel
								label="روز"
								value={tempDate.day}
								max={getDaysInMonth(tempDate.month, tempDate.year)}
								onChange={handleDayChange}
								type="number"
							/>
							<ScrollWheel
								label="ماه"
								value={tempDate.month}
								max={12}
								onChange={handleMonthChange}
								type="month"
							/>
							<ScrollWheel
								label="سال"
								value={tempDate.year}
								max={80}
								onChange={handleYearChange}
								type="year"
								startYear={currentYear - 10}
							/>
						</div>

						<div className="flex gap-2">
							<Button
								onClick={handleConfirm}
								size="sm"
								className={`flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-white`}
							>
								<FiCheck size={16} className="ml-1" />
								تایید{' '}
							</Button>
							<Button
								onClick={handleCancel}
								size="sm"
								className="w-20 rounded-2xl border-muted hover:bg-muted/50 text-content"
							>
								لغو
							</Button>
						</div>
					</div>
				}
				position="bottom"
				offset={8}
				contentClassName="p-4 border shadow-xl bg-glass bg-content border-base-300/20 rounded-2xl max-w-none"
				closeOnClickOutside={true}
			/>
		</>
	)
}

interface ScrollWheelProps {
	label: string
	value: number
	max: number
	onChange: (value: number) => void
	type: 'number' | 'month' | 'year'
	startYear?: number
}

function ScrollWheel({ label, value, max, onChange, type, startYear }: ScrollWheelProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const scrollTimeoutRef = useRef<NodeJS.Timeout>(null)
	const ITEM_HEIGHT = 40

	const items =
		type === 'number'
			? Array.from({ length: max }, (_, i) => i + 1)
			: type === 'month'
				? PERSIAN_MONTHS
				: Array.from({ length: max }, (_, i) => (startYear || 1403) - i)

	useEffect(() => {
		if (!containerRef.current) return

		let index = 0
		if (type === 'number') {
			index = value - 1
		} else if (type === 'month') {
			index = value - 1
		} else if (type === 'year') {
			// @ts-expect-error
			index = items.indexOf(value)
		}

		containerRef.current.scrollTop = index * ITEM_HEIGHT
	}, [value, type, items])

	const handleScroll = () => {
		if (!containerRef.current) return

		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current)
		}

		scrollTimeoutRef.current = setTimeout(() => {
			if (!containerRef.current) return

			const scrollTop = containerRef.current.scrollTop
			const index = Math.round(scrollTop / ITEM_HEIGHT)
			const clampedIndex = Math.max(0, Math.min(index, items.length - 1))

			let newValue: number
			if (type === 'number' || type === 'month') {
				newValue = clampedIndex + 1
			} else {
				newValue = items[clampedIndex] as number
			}

			onChange(newValue)

			containerRef.current.scrollTo({
				top: clampedIndex * ITEM_HEIGHT,
				behavior: 'smooth',
			})
		}, 150)
	}

	const handleItemClick = (index: number) => {
		let newValue: number
		if (type === 'number' || type === 'month') {
			newValue = index + 1
		} else {
			newValue = items[index] as number
		}
		onChange(newValue)
	}

	return (
		<div className="relative w-full h-40 overflow-hidden rounded-xl bg-base-200/30">
			<div className="absolute inset-x-0 z-10 h-10 -translate-y-1 pointer-events-none top-1/2 border-y-2 border-primary/30 bg-primary/5" />

			<div
				ref={containerRef}
				onScroll={handleScroll}
				className="h-full overflow-y-scroll scrollbar-none"
				onClick={(e) => e.stopPropagation()}
			>
				<div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
				{items.map((item, index) => {
					let isActive = false
					if (type === 'number' || type === 'month') {
						isActive = index + 1 === value
					} else {
						isActive = item === value
					}

					return (
						<div
							key={index}
							onClick={() => handleItemClick(index)}
							className="flex items-center justify-center transition-all cursor-pointer"
							style={{ height: `${ITEM_HEIGHT}px` }}
						>
							<span
								className={`text-sm font-bold transition-all ${
									isActive
										? 'text-primary scale-110'
										: 'text-muted scale-90 opacity-40'
								}`}
							>
								{item}
							</span>
						</div>
					)
				})}
				<div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
			</div>

			<div className="absolute inset-x-0 top-0 h-16 pointer-events-none bg-linear-to-b from-base-200 to-transparent" />
			<div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-linear-to-t from-base-200 to-transparent" />
		</div>
	)
}
