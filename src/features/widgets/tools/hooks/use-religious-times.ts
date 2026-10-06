import { useEffect } from 'react'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { useAuth } from '@/context/auth.context'
import type { IconName } from '@/icons'
import { useReligiousTime } from '@/services/date/get-religious-time.hook'

const DEFAULT_CITY = { name: 'تهران', lat: 35.696111, lon: 51.423056 }

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
		{ title: 'اذان صبح', value: data?.azan_sobh, icon: 'clock' },
		{
			title: 'طلوع آفتاب',
			value: data?.tolu_aftab,
			icon: 'sunrise',
		},
		{ title: 'اذان ظهر', value: data?.azan_zohr, icon: 'sun' },
		{
			title: 'غروب آفتاب',
			value: data?.ghorub_aftab,
			icon: 'sunset',
		},
		{
			title: 'اذان مغرب',
			value: data?.azan_maghreb,
			icon: 'clock',
		},
		{
			title: 'نیمه‌شب شرعی',
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
