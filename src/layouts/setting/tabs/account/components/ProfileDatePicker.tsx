import jalaliMoment from 'jalali-moment'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { SelectBox } from '@/components/selectbox/selectbox'

interface JalaliDatePickerProps {
	id: string
	label: string
	value: string
	onChange: (jalaliDate: string) => void
	disabled?: boolean
	className?: string
}

const JALALI_MONTHS = [
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

const JALALI_YEARS = Array.from({ length: 100 }, (_, i) => 1300 + i) // 1300 تا 1399

function getJalaliDaysInMonth(year: number, month: number): number {
	if (month <= 6) return 31
	if (month <= 11) return 30
	const isLeapYear = jalaliMoment.jIsLeapYear(year)
	return isLeapYear ? 30 : 29
}

export default function JalaliDatePicker({
	id,
	label,
	value,
	onChange,
	className = '',
	disabled,
}: JalaliDatePickerProps) {
	const [year, setYear] = useState<string>('')
	const [month, setMonth] = useState<string>('')
	const [day, setDay] = useState<string>('')

	useEffect(() => {
		if (!value) {
			setYear('')
			setMonth('')
			setDay('')
			return
		}

		const jalaliMomentDate = jalaliMoment(value, 'jYYYY-jMM-jDD')
		if (jalaliMomentDate.isValid()) {
			const yearValue = jalaliMomentDate.jYear().toString()
			const monthValue = (jalaliMomentDate.jMonth() + 1).toString()
			const dayValue = jalaliMomentDate.jDate().toString()

			setYear(yearValue)
			setMonth(monthValue)
			setDay(dayValue)
		} else {
			toast.error('تاریخ نامعتبر است')
		}
	}, [value])

	const updateDate = (newYear: string, newMonth: string, newDay: string) => {
		if (disabled) return
		if (!newYear || !newMonth || !newDay) {
			onChange('')
			return
		}

		const jalaliDate = jalaliMoment()
			.jYear(parseInt(newYear, 10))
			.jMonth(parseInt(newMonth, 10) - 1)
			.jDate(parseInt(newDay, 10))

		if (jalaliDate.isValid()) {
			const formattedDate = jalaliDate.format('jYYYY-jMM-jDD')
			onChange(formattedDate)
		} else {
			onChange('')
		}
	}

	const handleYearChange = (selectedYear: string) => {
		setYear(selectedYear)

		if (selectedYear && month && day) {
			const maxDays = getJalaliDaysInMonth(
				parseInt(selectedYear, 10),
				parseInt(month, 10)
			)
			const currentDay = parseInt(day, 10)

			if (currentDay > maxDays) {
				setDay('1')
				updateDate(selectedYear, month, '1')
			} else {
				updateDate(selectedYear, month, day)
			}
		}
	}

	const handleMonthChange = (selectedMonth: string) => {
		setMonth(selectedMonth)

		if (year && selectedMonth && day) {
			const maxDays = getJalaliDaysInMonth(
				parseInt(year, 10),
				parseInt(selectedMonth, 10)
			)
			const currentDay = parseInt(day, 10)

			if (currentDay > maxDays) {
				setDay('1')
				updateDate(year, selectedMonth, '1')
			} else {
				updateDate(year, selectedMonth, day)
			}
		}
	}

	const handleDayChange = (selectedDay: string) => {
		setDay(selectedDay)
		updateDate(year, month, selectedDay)
	}

	const availableDays =
		year && month
			? getJalaliDaysInMonth(Number.parseInt(year, 10), Number.parseInt(month, 10))
			: 31

	const yearOptions = [
		{ value: '', label: 'انتخاب سال' },
		...JALALI_YEARS.map((y) => ({ value: y.toString(), label: y.toString() })),
	]

	const monthOptions = [
		{ value: '', label: 'انتخاب ماه' },
		...JALALI_MONTHS.map((monthName, index) => ({
			value: (index + 1).toString(),
			label: monthName,
		})),
	]

	const dayOptions = [
		{ value: '', label: 'انتخاب روز' },
		...Array.from({ length: availableDays }, (_, i) => ({
			value: (i + 1).toString(),
			label: (i + 1).toString(),
		})),
	]

	return (
		<div className={`space-y-2 ${className}`}>
			<label htmlFor={id} className="block text-sm font-medium text-content">
				{label}
			</label>

			<div className="grid grid-cols-3 gap-2">
				<SelectBox
					options={yearOptions}
					value={year}
					onChange={handleYearChange}
					className="w-full !border !border-content h-8"
					optionClassName="text-sm"
					disabled={disabled}
				/>

				<SelectBox
					options={monthOptions}
					value={month}
					onChange={handleMonthChange}
					className="w-full !border !border-content h-8"
					optionClassName="text-sm"
					disabled={disabled}
				/>

				<SelectBox
					options={dayOptions}
					value={day}
					onChange={handleDayChange}
					className={`w-full !border !border-content h-8 ${
						!year || !month ? 'opacity-50' : ''
					}`}
					disabled={disabled}
					optionClassName="text-sm"
				/>
			</div>
		</div>
	)
}
