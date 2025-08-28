import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'

interface JalaliDateProps {
	today: WidgetifyDate
	textColor: string
}

export function JalaliDate({ today, textColor }: JalaliDateProps) {
	return (
		<>
			<span className={`text-base !leading-none ${textColor}`}>
				{today.locale('fa').format('dddd')}
			</span>
			<div
				className={`text-7xl !leading-none font-sans font-bold transition-all duration-300 transform ${textColor}`}
			>
				{today.jDate()}
			</div>
			<div
				className={`text-lg font-medium transition-all duration-200 ${textColor}`}
			>
				{today.locale('fa').format('MMMM YYYY')}
			</div>
		</>
	)
}
