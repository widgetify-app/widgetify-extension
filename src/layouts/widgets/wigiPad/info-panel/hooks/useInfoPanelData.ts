import { useEffect, useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useGetWigiPadData } from '@/services/hooks/extension/getWigiPadData.hook'

export interface InfoPanelData {
	birthdays: Array<{
		id: string
		name: string
		date: string
		avatar?: string
	}>
	notifications: Array<{
		content: string
		timestamp: Date | null
	}>
	emailMessages: Array<{
		id: string
		threadId: string
		subject: string
		sender: string
		snippet: string
	}>
}

export const useInfoPanelData = (): InfoPanelData => {
	const { selected_timezone: timezone } = useGeneralSetting()
	const { data: wigiPadData } = useGetWigiPadData({
		enabled: true,
		timezone: timezone.value,
	})

	const [data, setData] = useState<InfoPanelData>({
		birthdays: [],
		notifications: [],
		emailMessages: [],
	})

	useEffect(() => {
		if (wigiPadData) {
			const { birthdays, notifications } = wigiPadData

			const transformedBirthdays = birthdays.map((birthday, index) => ({
				id: `birthday-${index}`,
				name: birthday.name,
				date: birthday.date,
				avatar: birthday.avatar,
			}))
			const transformedNotifications = notifications.map((notification) => ({
				content: notification.content,
				timestamp: notification.timestamp
					? new Date(notification.timestamp)
					: null,
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
