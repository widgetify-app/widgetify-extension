import Analytics from '@/analytics'
import type { WidgetSize } from '../utils/layout-engine/types'
import { WidgetContainer } from '../components/widget-container'
import { WidgetCenteredHeader, WidgetHeader } from '../components/widget-header'
import { formatUpdatedAt } from '../utils/updated-at'
import { useWidgetSettingsSummary } from '../widget-menu.context'
import { useWeatherSettings } from './hooks/use-weather-settings'
import { useGetWeatherByLatLon } from '@/services/weather/get-weather-by-lat-lon.hook'
import { cleanCityName } from './utils/clean-city-name'
import { WeatherCompactSquare } from './variants/weather-1x1'
import { WeatherCompactRow } from './variants/weather-2x1'
import { Weather2x2 } from './variants/weather-2x2'
import { Weather2x3 } from './variants/weather-2x3'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { t } from '@/common/i18n'

interface WeatherLayoutProps {
	size?: WidgetSize
}

export function WeatherLayout({ size = { w: 2, h: 3 } }: WeatherLayoutProps = {}) {
	const settings = useWeatherSettings()
	const { data, dataUpdatedAt, isError, refetch } = useGetWeatherByLatLon(true)

	const fetchedWeather = data || null
	const cityName = cleanCityName(fetchedWeather?.city?.fa)
	useWidgetSettingsSummary(
		cityName ? t('widgets.weather.citySummary', { city: cityName }) : null
	)

	const isSquare = size.w === 1 && size.h === 1
	const frame = isSquare
		? 'px-3 py-2.5'
		: size.h === 1
			? 'px-3 py-2.5 gap-1.5'
			: 'p-3 gap-2'

	if (isError && !fetchedWeather) {
		return (
			<WidgetContainer contentClassName={frame}>
				{isSquare ? (
					<WidgetCenteredHeader title={t('widgets.weather.title')} />
				) : (
					<WidgetHeader title={t('widgets.weather.title')} />
				)}
				<div className="flex-1 min-h-0">
					<WidgetError
						message={t('widgets.weather.loadError')}
						compact={size.h === 1}
						onRetry={() => {
							Analytics.event('weather_retry_clicked')
							refetch()
						}}
					/>
				</div>
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer contentClassName={frame}>
			{isSquare ? (
				<WeatherCompactSquare
					fetchedWeather={fetchedWeather}
					temperatureUnit={settings.temperatureUnit}
				/>
			) : size.w === 2 && size.h === 1 ? (
				<WeatherCompactRow
					fetchedWeather={fetchedWeather}
					temperatureUnit={settings.temperatureUnit}
				/>
			) : size.w === 2 && size.h === 2 ? (
				<Weather2x2
					fetchedWeather={fetchedWeather}
					temperatureUnit={settings.temperatureUnit}
				/>
			) : (
				<Weather2x3
					fetchedWeather={fetchedWeather}
					temperatureUnit={settings.temperatureUnit}
					updatedLabel={formatUpdatedAt(dataUpdatedAt)}
				/>
			)}
		</WidgetContainer>
	)
}
