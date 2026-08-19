import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { WeatherSettings } from '@/layouts/widgets/weather/weather.interface'
import { WidgetContainer } from '../widget-container'
import { Forecast } from './forecast/forecast'
import { CurrentWeatherBox } from './current/current-box.weather'
import { WeatherCompactSquare } from './variants/weather-1x1'
import { WeatherCompactRow } from './variants/weather-2x1'
import { WeatherWideBanner } from './variants/weather-4x1'
import { WeatherWideFull } from './variants/weather-4x2'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/get-weather-by-lat-lon'
import type { WidgetSize } from '../layout-engine/types'

interface WeatherLayoutProps {
	size?: WidgetSize
}

export function WeatherLayout({ size = { w: 2, h: 2 } }: WeatherLayoutProps = {}) {
	const [weatherSettings, setWeatherSettings] = useState<WeatherSettings | null>(null)
	const { data } = useGetWeatherByLatLon(true)

	useEffect(() => {
		async function load() {
			const weatherSettingFromStorage = await getFromStorage('weatherSettings')

			if (weatherSettingFromStorage) {
				setWeatherSettings(weatherSettingFromStorage)
			} else {
				setWeatherSettings({
					useAI: true,
					forecastCount: 4,
					temperatureUnit: 'metric',
					enableShowName: true,
				})
			}
		}

		const event = listenEvent('weatherSettingsChanged', (data) => {
			setWeatherSettings(data)
		})

		load()

		return () => {
			event()
		}
	}, [])

	if (!weatherSettings) return null

	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer>
				<WeatherCompactSquare
					fetchedWeather={data || null}
					temperatureUnit={weatherSettings.temperatureUnit}
				/>
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer>
				<WeatherCompactRow
					fetchedWeather={data || null}
					temperatureUnit={weatherSettings.temperatureUnit}
				/>
			</WidgetContainer>
		)
	}

	if (size.w >= 4 && size.h === 1) {
		return (
			<WidgetContainer>
				<WeatherWideBanner
					fetchedWeather={data || null}
					temperatureUnit={weatherSettings.temperatureUnit}
				/>
			</WidgetContainer>
		)
	}

	if (size.w >= 4 && size.h >= 2) {
		return (
			<WidgetContainer>
				<WeatherWideFull
					fetchedWeather={data || null}
					temperatureUnit={weatherSettings.temperatureUnit}
				/>
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer>
			<div className="flex flex-col w-full h-full gap-2 py-1">
				<CurrentWeatherBox
					fetchedWeather={data || null}
					temperatureUnit={weatherSettings.temperatureUnit}
				/>

				<div className="flex justify-between gap-0.5 px-1 rounded-2xl bg-base-200/40">
					<Forecast
						temperatureUnit={weatherSettings.temperatureUnit}
						forecast={data?.forecast || []}
					/>
				</div>
			</div>
		</WidgetContainer>
	)
}
