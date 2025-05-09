import { getTextColor, useTheme } from '@/context/theme.context'

export function EventsEmptyState() {
	const { theme } = useTheme()

	return (
		<div className={'flex-1 flex flex-col items-center justify-center rounded-lg p-5'}>
			<div className={'p-3 rounded-full mb-3 text-2xl'}>🗓️</div>
			<p className={`text-center ${getTextColor(theme)}`}>
				مناسبتی برای نمایش وجود ندارد.
			</p>
		</div>
	)
}
