import type { WidgetSize } from '../layout-engine/types'
import { WidgetContainer } from '../widget-container'
import { useWeatherSettings } from './hooks/use-weather-settings'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/get-weather-by-lat-lon.hook'
import { WeatherError } from './components/weather-error'
import { WeatherCompactSquare } from './variants/weather-1x1'
import { WeatherCompactRow } from './variants/weather-2x1'
import { Weather2x2 } from './variants/weather-2x2'
import { Weather2x3 } from './variants/weather-2x3'

interface WeatherLayoutProps {
	size?: WidgetSize
}

export function WeatherLayout({ size = { w: 2, h: 3 } }: WeatherLayoutProps = {}) {
	const settings = useWeatherSettings()
	const { data, isError, refetch } = useGetWeatherByLatLon(true)

	const fetchedWeather = data || null

	if (isError && !fetchedWeather) {
		return (
			<WidgetContainer>
				<WeatherError
					compact={size.w === 1 && size.h === 1}
					onRetry={() => refetch()}
				/>
			</WidgetContainer>
		)
	}

	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer>
				<WeatherCompactSquare
					fetchedWeather={fetchedWeather}
					temperatureUnit={settings.temperatureUnit}
				/>
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer>
				<WeatherCompactRow
					fetchedWeather={fetchedWeather}
					temperatureUnit={settings.temperatureUnit}
				/>
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 2) {
		return (
			<WidgetContainer background={false}>
				<Weather2x2
					fetchedWeather={fetchedWeather}
					temperatureUnit={settings.temperatureUnit}
				/>
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer>
			<Weather2x3 fetchedWeather={fetchedWeather} settings={settings} />
		</WidgetContainer>
	)
}
