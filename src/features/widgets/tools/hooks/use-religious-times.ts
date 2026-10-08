import { t } from '@/common/i18n'
import { useEffect } from 'react'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { useAuth } from '@/context/auth.context'
import type { IconName } from '@/icons'
import { useReligiousTime } from '@/services/date/get-religious-time.hook'

const DEFAULT_CITY = {
	name: t('widgets.tools.religious.cityTehran'),
	lat: 35.696111,
	lon: 51.423056,
}

interface PrayerTime {
	title: string
	value?: string
	icon: IconName
}

export function useReligiousTimes(currentDate: WidgetifyDate) {
	const { isAuthenticated, user } = useAuth()
	const hasCity = Boolean(user?.city?.id)

	const { data, isLoading, isError, refetch } = useReligiousTime(
		{
			day: currentDate.jDate(),
			month: currentDate.jMonth() + 1,
			lat: hasCity ? undefined : DEFAULT_CITY.lat,
			lon: hasCity ? undefined : DEFAULT_CITY.lon,
		},
		true
	)

	useEffect(() => {
		if (isAuthenticated && user?.city?.id) {
			refetch()
		}
	}, [user?.city?.id, isAuthenticated, refetch])

	const times: PrayerTime[] = [
		{
			title: t('widgets.tools.religious.fajr'),
			value: data?.azan_sobh,
			icon: 'clock',
		},
		{
			title: t('widgets.tools.religious.sunrise'),
			value: data?.tolu_aftab,
			icon: 'sunrise',
		},
		{
			title: t('widgets.tools.religious.dhuhr'),
			value: data?.azan_zohr,
			icon: 'sun',
		},
		{
			title: t('widgets.tools.religious.sunset'),
			value: data?.ghorub_aftab,
			icon: 'sunset',
		},
		{
			title: t('widgets.tools.religious.maghrib'),
			value: data?.azan_maghreb,
			icon: 'clock',
		},
		{
			title: t('widgets.tools.religious.midnight'),
			value: data?.nimeshab,
			icon: 'moon',
		},
	]

	return {
		times,
		cityName: user?.city?.name || DEFAULT_CITY.name,
		isLoading,
		isError,
		refetch,
	}
}
