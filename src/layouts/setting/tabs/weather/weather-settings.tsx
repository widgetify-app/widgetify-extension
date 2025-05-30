import { ToggleSwitch } from '@/components/toggle-switch.component'
import type { TemperatureUnit } from '@/services/hooks/weather/weather.interface'

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
	const getSelectedUnitStyle = () => {
		return 'bg-blue-600 text-white'
	}

	const getUnselectedUnitStyle = () => {
		return 'bg-base-200'
	}

	return (
		<div className="space-y-6">
			{/* Forecast Count */}
			<div className="flex flex-col space-y-2">
				<div className="flex items-center justify-between">
					<label
						htmlFor="forecastCount"
						className={'flex items-center text-sm font-medium text-content'}
					>
						<span>تعداد پیش‌بینی</span>
					</label>
					<div className="flex items-center">
						<select
							id="forecastCount"
							value={forecastCount}
							onChange={(e) =>
								updateSettings('forecastCount', Number.parseInt(e.target.value) || 4)
							}
							className="shadow select bg-base-content/10 focus:outline-none focus:border-none"
						>
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
								<option key={num} value={num} className="text-content bg-base-200">
									{num}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Temperature Unit */}
			<div className="flex flex-col space-y-2">
				<div className="flex items-center justify-between">
					<label htmlFor="tempUnit" className={'text-sm font-medium text-content'}>
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
								className={`px-3 py-1.5 min-w-[40px] text-sm font-medium transition cursor-pointer ${
									temperatureUnit === option.value
										? getSelectedUnitStyle()
										: getUnselectedUnitStyle()
								}`}
								onClick={() => updateSettings('temperatureUnit', option.value)}
							>
								<span className="ml-1">{option.persianName}</span>
								<span>({option.label})</span>
							</button>
						))}
					</div>
				</div>
				<div className={'text-xs font-light text-right text-muted'}>
					{temperatureUnit === 'metric' &&
						'واحد سلسیوس در بیشتر کشورهای جهان استفاده می‌شود'}
					{temperatureUnit === 'imperial' &&
						'واحد فارنهایت بیشتر در آمریکا استفاده می‌شود'}
					{temperatureUnit === 'standard' && 'واحد کلوین در محاسبات علمی استفاده می‌شود'}
				</div>
			</div>

			{/* AI Toggle */}
			<div className="flex items-center justify-between">
				<div>
					<p className={'text-sm text-content'}>استفاده از هوش مصنوعی</p>
					<p className={'text-xs font-light text-muted'}>
						توصیف شرایط آب و هوا و پیشنهاد پلی لیست مناسب با کمک هوش مصنوعی
					</p>
				</div>
				<ToggleSwitch
					enabled={useAI}
					onToggle={() => updateSettings('useAI', !useAI)}
					key={'sync-toggle'}
				/>
			</div>
		</div>
	)
}
