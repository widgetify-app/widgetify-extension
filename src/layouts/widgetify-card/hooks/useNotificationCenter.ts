import { useGeneralSetting } from '@/context/general-setting.context'
import { useGetNotificationCenterData } from '@/services/hooks/extension/getNotificationCenterData.hook'
import { useEffect, useState } from 'react'

export interface NotificationCenterData {
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

export const useNotificationCenter = (): NotificationCenterData => {
	const { selected_timezone: timezone } = useGeneralSetting()
	const { data: notificationCenterData } = useGetNotificationCenterData({
		enabled: true,
		timezone: timezone.value,
	})

	const [data, setData] = useState<NotificationCenterData>({
		birthdays: [],
		notifications: [],
		emailMessages: [],
	})

	useEffect(() => {
		if (notificationCenterData?.data) {
			const { birthdays, notifications, emailMessages } =
				notificationCenterData.data

			const transformedBirthdays = birthdays.map(
				(birthday: any, index: number) => ({
					id: `birthday-${index}`,
					name: birthday.name,
					date: birthday.date,
					avatar: birthday.avatar,
				})
			)
			const transformedNotifications = notifications.map((notification: any) => ({
				content: notification.content,
				timestamp: notification.timestamp
					? new Date(notification.timestamp)
					: null,
			}))

			const transformedEmailMessages =
				emailMessages?.map((email: any) => ({
					id: email.id,
					threadId: email.threadId,
					subject: email.subject,
					sender: email.sender,
					snippet: email.snippet,
				})) || []

			setData((prev: NotificationCenterData) => ({
				...prev,
				birthdays: transformedBirthdays,
				notifications: transformedNotifications,
				emailMessages: transformedEmailMessages,
			}))
		}
	}, [notificationCenterData])

	return data
}
