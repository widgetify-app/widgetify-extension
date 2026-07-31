import { useState } from 'react'
import jalaliMoment from 'jalali-moment'
import hijriMoment from 'moment-hijri'
import { Icon } from '@/src/icons'
import {
	type CalendarType,
	type ConvertedDates,
	convertDate,
	getCurrentDay,
	getCurrentMonth,
	getCurrentYear,
	getDaysInMonth,
	getMonthNames,
	getYearRange,
} from './date-converter.util'
import { ScrollWheel } from './scroll-wheel'
import { Button } from '@/components/button/button'
import type React from 'react'

const calendarOptions: { value: CalendarType; label: string; icon: string }[] = [
	{ value: 'gregorian', label: 'میلادی', icon: 'globeAsia' },
	{ value: 'shamsi', label: 'شمسی', icon: 'calendar' },
	{ value: 'hijri', label: 'قمری', icon: 'moon' },
]

export const DateConverterView: React.FC = () => {
	const [source, setSource] = useState<CalendarType>('shamsi')
	const years = getYearRange(source)
	const monthNames = getMonthNames(source)

	const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear(source))
	const [selectedMonth, setSelectedMonth] = useState<number>(getCurrentMonth(source))
	const [selectedDay, setSelectedDay] = useState<number>(getCurrentDay(source))

	const [converted, setConverted] = useState<ConvertedDates | null>(null)

	const maxDay = getDaysInMonth(source, selectedYear, selectedMonth)
	const dayItems = Array.from({ length: maxDay }, (_, i) => i + 1)
	const validDay = Math.min(selectedDay, maxDay)

	const handleSourceChange = (newSource: CalendarType) => {
		setSource(newSource)
		setConverted(null)
		setSelectedYear(getCurrentYear(newSource))
		setSelectedMonth(getCurrentMonth(newSource))
		setSelectedDay(getCurrentDay(newSource))
	}

	const handleDayChange = (value: string | number) => {
		setSelectedDay(Number(value))
	}

	const handleMonthChange = (value: string | number) => {
		const monthIndex = monthNames.indexOf(value as string) + 1
		setSelectedMonth(monthIndex)
		const newMaxDay = getDaysInMonth(source, selectedYear, monthIndex)
		if (selectedDay > newMaxDay) {
			setSelectedDay(newMaxDay)
		}
	}

	const handleYearChange = (value: string | number) => {
		setSelectedYear(Number(value))
		const newMaxDay = getDaysInMonth(source, Number(value), selectedMonth)
		if (selectedDay > newMaxDay) {
			setSelectedDay(newMaxDay)
		}
	}

	const handleReset = () => {
		setSelectedYear(getCurrentYear(source))
		setSelectedMonth(getCurrentMonth(source))
		setSelectedDay(getCurrentDay(source))
		setConverted(null)
	}

	const handleConvert = () => {
		const monthIndex = selectedMonth
		const monthStr = monthIndex.toString().padStart(2, '0')
		const dayStr = validDay.toString().padStart(2, '0')

		let dateStr: string
		let locale: string
		let format: string

		switch (source) {
			case 'shamsi':
				dateStr = `${selectedYear}/${monthStr}/${dayStr}`
				locale = 'fa'
				format = 'jYYYY/jM/jD'
				break
			case 'gregorian':
				dateStr = `${selectedYear}/${monthStr}/${dayStr}`
				locale = 'en'
				format = 'YYYY/M/D'
				break
			case 'hijri':
				dateStr = `${selectedYear}-${monthStr}-${dayStr}`
				locale = 'en'
				format = 'iYYYY-iM-iD'
				break
			default:
				return
		}

		const date =
			source === 'hijri'
				? (hijriMoment(dateStr, format) as unknown as jalaliMoment.Moment)
				: jalaliMoment(dateStr, format).locale(locale)
		const result = convertDate(source, date)
		setConverted(result)
	}

	const monthItems = monthNames
	const yearItems = years.map(String)
	const dayItemsDisplay = dayItems.map(String)

	return (
		<div className="relative flex flex-col flex-1 gap-1.5 p-1.5">
			<div className="flex items-center w-full gap-1 p-0.5 transition-all duration-200 ease-in-out bg-muted rounded-xl">
				{calendarOptions.map((option) => (
					<button
						key={option.value}
						onClick={() => handleSourceChange(option.value)}
						className={`flex cursor-pointer items-center justify-center gap-1 flex-1 text-xs rounded-lg transition-all duration-200 px-2 py-1 whitespace-nowrap
							${
								source === option.value
									? 'bg-background text-content shadow-xs'
									: 'text-base-content/60 hover:text-base-content'
							}`}
					>
						<Icon name={option.icon as any} size={12} />
						<span>{option.label}</span>
					</button>
				))}
			</div>

			<div className="flex gap-3">
				<div className="flex flex-col items-center gap-1 flex-1">
					<span className="text-[10px] text-muted">روز</span>
					<ScrollWheel
						items={dayItemsDisplay}
						value={String(validDay)}
						onChange={handleDayChange}
					/>
				</div>
				<div className="flex flex-col items-center gap-1 flex-1">
					<span className="text-[10px] text-muted">ماه</span>
					<ScrollWheel
						items={monthItems}
						value={monthNames[selectedMonth - 1]}
						onChange={handleMonthChange}
					/>
				</div>
				<div className="flex flex-col items-center gap-1 flex-1">
					<span className="text-[10px] text-muted">سال</span>
					<ScrollWheel
						items={yearItems}
						value={String(selectedYear)}
						onChange={handleYearChange}
					/>
				</div>
			</div>

			<div className="flex gap-2 items-center">
				<Button
					onClick={handleConvert}
					size="sm"
					isPrimary
					className="flex-[2] rounded-2xl"
				>
					تبدیل
				</Button>
				<Button onClick={handleReset} size="sm" className="flex-1 rounded-2xl">
					بازنشانی
				</Button>
			</div>

			{converted && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl p-2">
					<div className="relative w-full max-w-xs bg-base-200 rounded-xl border border-base-300 shadow-lg p-4">
						<button
							onClick={() => setConverted(null)}
							className="absolute top-2 left-2 rounded-full p-1 text-base-content/60 hover:text-base-content hover:bg-base-300 transition-colors"
							aria-label="بستن"
						>
							<Icon name="close" size={16} />
						</button>
						<div className="flex flex-col gap-2 pt-2">
							{source !== 'shamsi' && (
								<div className="flex items-center gap-2 text-sm">
									<Icon name="calendar" size={14} />
									<span className="text-muted">شمسی:</span>
									<span className="font-medium text-content">
										{converted.shamsi}
									</span>
								</div>
							)}
							{source !== 'gregorian' && (
								<div className="flex items-center gap-2 text-sm">
									<Icon name="globeAsia" size={14} />
									<span className="text-muted">میلادی:</span>
									<span className="font-medium text-content">
										{converted.gregorian}
									</span>
								</div>
							)}
							{source !== 'hijri' && (
								<div className="flex items-center gap-2 text-sm">
									<Icon name="moon" size={14} />
									<span className="text-muted">قمری:</span>
									<span className="font-medium text-content">
										{converted.hijri}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
