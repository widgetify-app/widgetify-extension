import { useDate } from '@/context/date.context'

export function GregorianDate() {
	const { today } = useDate()

	const textColor = 'text-content drop-shadow-md'
	const date = today.locale('en')
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<span className={`text-base !leading-none ${textColor}`}>
				{date.format('dddd')}
			</span>
			<div
				className={`text-7xl font-bold mt-2 leading-[1] h-[0.3em] flex items-center ${textColor}`}
			>
				{date.format('DD')}
			</div>
			<div className="flex flex-col">
				<span
					className={`text-lg font-medium transition-all duration-200 ${textColor}`}
				>
					{date.format('MMMM')}
				</span>
				<div className={`text-sm opacity-90 ${textColor} px-0.5`} dir="ltr">
					<span>{date.format('YYYY')}</span>
				</div>
			</div>
		</div>
	)
}
