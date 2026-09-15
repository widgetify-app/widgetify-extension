import type React from 'react'
import { CurrentWeatherBox } from '../components/current-weather-box'
import { Forecast } from '../components/forecast'
import type { FetchedWeather, WeatherSettings } from '../weather.interface'

interface Weather2x3Props {
	fetchedWeather: FetchedWeather | null
	settings: WeatherSettings
}

export const Weather2x3: React.FC<Weather2x3Props> = ({ fetchedWeather, settings }) => {
	const forecast = fetchedWeather?.forecast?.slice(0, settings.forecastCount) || []

	return (
		<section className="flex flex-col w-full h-full gap-2 py-1">
			<CurrentWeatherBox
				fetchedWeather={fetchedWeather}
				temperatureUnit={settings.temperatureUnit}
			/>

			<div className="px-1 rounded-2xl py-0.5">
				<Forecast
					temperatureUnit={settings.temperatureUnit}
					forecast={forecast}
				/>
			</div>
		</section>
	)
}
