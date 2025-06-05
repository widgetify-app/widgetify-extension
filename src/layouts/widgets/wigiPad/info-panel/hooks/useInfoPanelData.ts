import { useDate } from '@/context/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { combineAndSortEvents } from '@/layouts/widgets/tools/events/utils'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { useGetWigiPadData } from '@/services/hooks/extension/getWigiPadData.hook'
import { useEffect, useState } from 'react'

export interface InfoPanelData {
	birthdays: Array<{
		id: string
		name: string
		date: string
		avatar?: string
	}>
	notifications: Array<{
		content: string // can be HTML
		timestamp: Date | null
	}>
}

export const useInfoPanelData = (): InfoPanelData => {
	const { timezone } = useGeneralSetting()
	const { data: wigiPadData } = useGetWigiPadData({ enabled: true, timezone })

	const [data, setData] = useState<InfoPanelData>({
		birthdays: [],
		notifications: [],
	})

	useEffect(() => {
		if (wigiPadData?.data) {
			const { birthdays, notifications } = wigiPadData.data

			const transformedBirthdays = birthdays.map((birthday, index) => ({
				id: `birthday-${index}`,
				name: birthday.name,
				date: birthday.date,
				avatar: birthday.avatar,
			}))
			const transformedNotifications = notifications.map((notification) => ({
				content: notification.content,
				timestamp: notification.timestamp ? new Date(notification.timestamp) : null,
			}))

			setData((prev) => ({
				...prev,
				birthdays: transformedBirthdays,
				notifications: transformedNotifications,
			}))
		}
	}, [wigiPadData])

	return data
}
