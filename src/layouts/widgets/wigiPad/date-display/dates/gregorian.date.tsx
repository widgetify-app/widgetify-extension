import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'

interface JalaliDateProps {
	today: WidgetifyDate
	textColor: string
}

export function GregorianDate({ today, textColor }: JalaliDateProps) {
	return (
		<div className="relative">
			<span className={`text-base !leading-none ${textColor}`}>
				{today.locale('en').format('dddd')}
			</span>
			<div
				className={`text-7xl !leading-none font-sans font-bold transition-all duration-300 transform ${textColor}`}
			>
				{today.format('DD')}
			</div>
			<div
				className={`text-lg font-medium transition-all duration-200 ${textColor}`}
			>
				{today.locale('en').format('MMMM YYYY')}
			</div>
		</div>
	)
}
