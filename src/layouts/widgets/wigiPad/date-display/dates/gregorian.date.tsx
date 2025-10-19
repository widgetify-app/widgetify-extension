import { useDate } from '@/context/date.context'

export function GregorianDate() {
	const { today } = useDate()

	const textColor = 'text-content drop-shadow-md'
	const date = today.locale('en')
	return (
		<div
			className="flex flex-col items-center justify-center gap-1"
			style={{
				fontFeatureSettings: '"ss02" 1',
			}}
		>
			<span className={`text-base !leading-none ${textColor}`}>
				{date.format('dddd')}
			</span>
			<div
				className={`flex items-center font-sans text-6xl font-bold leading-none ${textColor}`}
			>
				{date.format('DD')}
			</div>
			<div className="flex flex-col items-center justify-center gap-0.5" dir="ltr">
				<span
					className={`text-lg font-medium transition-all duration-200 ${textColor}`}
				>
					{date.format('MMMM')}
				</span>
				<span
					className={`text-lg font-medium transition-all duration-200 ${textColor}`}
				>
					{date.format('YYYY')}
				</span>
			</div>
		</div>
	)
}
