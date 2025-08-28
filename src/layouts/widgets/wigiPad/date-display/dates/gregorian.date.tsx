import { useDate } from '@/context/date.context'

export function GregorianDate() {
	const { today } = useDate()
	const isDayTime = today.hour() >= 6 && today.hour() < 18

	const textColor = isDayTime
		? 'text-content drop-shadow-md'
		: 'text-primary drop-shadow-sm'

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
