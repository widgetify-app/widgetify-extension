import { useTheme } from '../../../../context/theme.context'
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
	const { theme } = useTheme()

	const getButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-600/30 hover:bg-blue-600/40 text-blue-800 border-white/20'
			case 'dark':
				return 'bg-blue-700/40 hover:bg-blue-700/60 text-white border-white/10'
			default: // glass
				return 'bg-blue-700/40 hover:bg-blue-700/60 text-white border-white/10'
		}
	}

	const getInputStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/60 text-gray-800 border-gray-300/30 focus:ring-blue-500'
			case 'dark':
				return 'bg-gray-800/30 text-white border-white/10 focus:ring-blue-500'
			default: // glass
				return 'bg-gray-800/30 text-white border-white/10 focus:ring-blue-500'
		}
	}

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

	const getToggleContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-100/60 border-blue-300/30'
			case 'dark':
				return 'bg-blue-900/10 border-white/10'
			default: // glass
				return 'bg-blue-900/10 border-white/10'
		}
	}

	const getToggleTrackStyle = (enabled: boolean) => {
		if (enabled) {
			return theme === 'light' ? 'bg-blue-500' : 'bg-blue-600'
		}
		return theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
	}

	const getHintTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'
			default:
				return 'text-gray-400'
		}
	}

	const getLabelStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			default:
				return 'text-white'
		}
	}

	return (
		<div className="space-y-6">
			{/* Forecast Count */}
			<div className="flex flex-col space-y-2">
				<div className="flex items-center justify-between">
					<label
						htmlFor="forecastCount"
						className={`flex items-center text-sm font-medium ${getLabelStyle()}`}
					>
						<span>تعداد پیش‌بینی</span>
					</label>
					<div className="flex items-center">
						<button
							onClick={() =>
								updateSettings('forecastCount', Math.max(1, forecastCount - 1))
							}
							className={`flex items-center justify-center w-8 h-8 text-lg border-l cursor-pointer ${getButtonStyle()} rounded-r-md`}
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
							className={`w-16 h-8 px-2 text-center border-x ${getInputStyle()} focus:outline-none`}
						/>
						<button
							onClick={() =>
								updateSettings('forecastCount', Math.min(10, forecastCount + 1))
							}
							className={`flex items-center justify-center w-8 h-8 text-lg border-r cursor-pointer ${getButtonStyle()} rounded-l-md`}
						>
							+
						</button>
					</div>
				</div>
			</div>

			{/* Temperature Unit */}
			<div className="flex flex-col space-y-2">
				<div className="flex items-center justify-between">
					<label htmlFor="tempUnit" className={`text-sm font-medium ${getLabelStyle()}`}>
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
				<div className={`text-xs font-light text-right ${getHintTextStyle()}`}>
					{temperatureUnit === 'metric' &&
						'واحد سلسیوس در بیشتر کشورهای جهان استفاده می‌شود'}
					{temperatureUnit === 'imperial' &&
						'واحد فارنهایت بیشتر در آمریکا استفاده می‌شود'}
					{temperatureUnit === 'standard' && 'واحد کلوین در محاسبات علمی استفاده می‌شود'}
				</div>
			</div>

			{/* AI Toggle */}
			<div
				className={`flex items-center justify-between p-4 border rounded-lg backdrop-blur-sm ${getToggleContainerStyle()}`}
			>
				<div className="flex flex-col">
					<label htmlFor="useAI" className={`text-sm font-medium ${getLabelStyle()}`}>
						استفاده از هوش مصنوعی
					</label>
					<span className={`text-xs font-light ${getHintTextStyle()}`}>
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
						className={`relative w-14 h-7 rounded-full transition-colors ${getToggleTrackStyle(useAI)}`}
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
