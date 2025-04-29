import { ToggleSwitch } from '@/components/toggle-switch.component'
import {
	getButtonStyles,
	getInputStyle,
	getTextColor,
	useTheme,
} from '@/context/theme.context'
import type { TemperatureUnit } from '@/services/getMethodHooks/weather/weather.interface'

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
	const { theme } = useTheme()

	const getSelectedUnitStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-600 text-white'

			default:
				return 'bg-blue-700 text-white'
		}
	}

	const getUnselectedUnitStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200/70 text-gray-700 hover:bg-gray-300/70'
			case 'dark':
				return 'bg-gray-800/30 text-gray-200 hover:bg-gray-700/50'
			default: // glass
				return 'bg-gray-800/30 text-gray-200 hover:bg-gray-700/50'
		}
	}

	return (
		<div className="space-y-6">
			{/* Forecast Count */}
			<div className="flex flex-col space-y-2">
				<div className="flex items-center justify-between">
					<label
						htmlFor="forecastCount"
						className={`flex items-center text-sm font-medium ${getTextColor(theme)}`}
					>
						<span>تعداد پیش‌بینی</span>
					</label>
					<div className="flex items-center">
						<button
							onClick={() =>
								updateSettings('forecastCount', Math.max(1, forecastCount - 1))
							}
							className={`flex items-center justify-center w-8 h-8 text-lg cursor-pointer ${getButtonStyles(theme, true, false)} rounded`}
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
							className={`w-16 h-8 px-2 text-center border-x ${getInputStyle(theme)} focus:outline-none`}
						/>
						<button
							onClick={() =>
								updateSettings('forecastCount', Math.min(10, forecastCount + 1))
							}
							className={`flex items-center justify-center w-8 h-8 text-lg cursor-pointer ${getButtonStyles(theme, true, false)} rounded`}
						>
							+
						</button>
					</div>
				</div>
			</div>

			{/* Temperature Unit */}
			<div className="flex flex-col space-y-2">
				<div className="flex items-center justify-between">
					<label
						htmlFor="tempUnit"
						className={`text-sm font-medium ${getTextColor(theme)}`}
					>
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
				<div
					className={`text-xs font-light text-right ${getTextColor(theme)} opacity-70`}
				>
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
					<p className={`text-sm ${getTextColor(theme)}`}>استفاده از هوش مصنوعی</p>
					<p className={`text-xs font-light ${getTextColor(theme)} opacity-70`}>
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
