import { describe, expect, it } from 'bun:test'
import { getWeatherMetrics } from '../utils/weather-metrics'

describe('getWeatherMetrics', () => {
	it('lists wind, humidity and cloud in that order', () => {
		expect(getWeatherMetrics({}).map((metric) => metric.label)).toEqual([
			'باد',
			'رطوبت',
			'ابر',
		])
	})

	it('rounds the wind speed', () => {
		const [wind] = getWeatherMetrics({ wind_speed: 3.6 })
		expect(wind.value).toBe('4 m/s')
	})

	it('shows zero for a missing reading instead of NaN', () => {
		expect(getWeatherMetrics(undefined).map((metric) => metric.value)).toEqual([
			'0 m/s',
			'0%',
			'0%',
		])
	})

	it('keeps humidity and cloud as whole percentages', () => {
		const [, humidity, cloud] = getWeatherMetrics({ humidity: 41, clouds: 75 })
		expect(humidity.value).toBe('41%')
		expect(cloud.value).toBe('75%')
	})
})
