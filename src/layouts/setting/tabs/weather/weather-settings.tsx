import { FaInfoCircle } from 'react-icons/fa'
import type { TemperatureUnit } from '../../../../services/getMethodHooks/weather/weather.interface'

interface WeatherSettingsProps {
	forecastCount: number
	temperatureUnit: TemperatureUnit
	useAI: boolean
	updateSettings: (key: string, value: any) => void
}

export function WeatherSettings({
	forecastCount,
	temperatureUnit,
	useAI,
	updateSettings,
}: WeatherSettingsProps) {
	return (
		<div className="space-y-6">
			{/* Forecast Count */}
			<div className="flex flex-col space-y-2">
				<div className="flex items-center justify-between">
					<label
						htmlFor="forecastCount"
						className="flex items-center text-sm font-medium text-white"
					>
						<span>تعداد پیش‌بینی</span>
					</label>
					<div className="flex items-center">
						<button
							onClick={() =>
								updateSettings('forecastCount', Math.max(1, forecastCount - 1))
							}
							className="flex items-center justify-center w-8 h-8 text-lg text-white border-l bg-blue-700/40 hover:bg-blue-700/60 rounded-r-md border-white/10"
						>
							−
						</button>
						<input
							id="forecastCount"
							type="number"
							min={1}
							max={10}
							value={forecastCount}
							onChange={(e) =>
								updateSettings('forecastCount', Number.parseInt(e.target.value) || 4)
							}
							className="w-16 h-8 px-2 text-center text-white border-x bg-gray-800/30 border-white/10 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						/>
						<button
							onClick={() =>
								updateSettings('forecastCount', Math.min(10, forecastCount + 1))
							}
							className="flex items-center justify-center w-8 h-8 text-lg text-white border-r bg-blue-700/40 hover:bg-blue-700/60 rounded-l-md border-white/10"
						>
							+
						</button>
					</div>
				</div>
			</div>

			{/* Temperature Unit */}
			<div className="flex flex-col space-y-2">
				<div className="flex items-center justify-between">
					<label htmlFor="tempUnit" className="text-sm font-medium text-white">
						واحد دما
					</label>
					<div className="flex overflow-hidden border rounded-md border-white/10">
						{[
							{ value: 'metric', label: '°C', persianName: 'سلسیوس' },
							{ value: 'imperial', label: '°F', persianName: 'فارنهایت' },
							{ value: 'standard', label: 'K', persianName: 'کلوین' },
						].map((option) => (
							<button
								key={option.value}
								className={`px-3 py-1.5 min-w-[40px] text-sm font-medium transition ${
									temperatureUnit === option.value
										? 'bg-blue-700 text-white'
										: 'bg-gray-800/30 text-gray-200 hover:bg-gray-700/50'
								}`}
								onClick={() => updateSettings('temperatureUnit', option.value)}
							>
								<span className="ml-1">{option.persianName}</span>
								<span>({option.label})</span>
							</button>
						))}
					</div>
				</div>
				<div className="text-xs font-light text-right text-gray-400">
					{temperatureUnit === 'metric' &&
						'واحد سلسیوس در بیشتر کشورهای جهان استفاده می‌شود'}
					{temperatureUnit === 'imperial' &&
						'واحد فارنهایت بیشتر در آمریکا استفاده می‌شود'}
					{temperatureUnit === 'standard' && 'واحد کلوین در محاسبات علمی استفاده می‌شود'}
				</div>
			</div>

			{/* AI Toggle */}
			<div className="flex items-center justify-between p-4 border rounded-lg bg-blue-900/10 backdrop-blur-sm border-white/10">
				<div className="flex flex-col">
					<label htmlFor="useAI" className="text-sm font-medium text-white">
						استفاده از هوش مصنوعی
					</label>
					<span className="text-xs font-light text-gray-400">
						توصیف شرایط آب و هوا با زبانی طبیعی با کمک هوش مصنوعی
					</span>
				</div>
				<label className="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						id="useAI"
						className="sr-only"
						checked={useAI}
						onChange={() => updateSettings('useAI', !useAI)}
					/>
					<div
						className={`relative w-14 h-7 rounded-full transition-colors ${
							useAI ? 'bg-blue-600' : 'bg-gray-700'
						}`}
					>
						<div
							className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
								useAI ? 'left-8' : 'left-1'
							}`}
						></div>
					</div>
				</label>
			</div>
		</div>
	)
}
