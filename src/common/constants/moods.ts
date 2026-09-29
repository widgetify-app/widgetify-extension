import empty from '@/assets/images/moods/empty.webp'
import excited from '@/assets/images/moods/excited.webp'
import happy from '@/assets/images/moods/happy.webp'
import normal from '@/assets/images/moods/normal.webp'
import sad from '@/assets/images/moods/sad.webp'

export const moodEmptyImage = empty

export const moodOptions = [
	{
		value: 'sad',
		image: sad,
		label: 'ناراحتم',
		activeClass: 'bg-danger text-on-danger',
		borderClass: 'border-[rgba(var(--color-error-rgb),0.5)]',
	},
	{
		value: 'normal',
		image: normal,
		label: 'خستم',
		activeClass: 'bg-warning text-on-warning',
		borderClass: 'border-[rgba(var(--color-warning-rgb),0.5)]',
	},
	{
		value: 'happy',
		image: happy,
		label: 'اوکی‌ام',
		activeClass: 'bg-secondary text-on-secondary',
		borderClass: 'border-[rgba(var(--color-secondary-rgb),0.5)]',
	},
	{
		value: 'excited',
		image: excited,
		label: 'سرحالم',
		activeClass: 'bg-success text-on-success',
		borderClass: 'border-[rgba(var(--color-success-rgb),0.5)]',
	},
]
