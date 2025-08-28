import type React from 'react'
import { useGetTopUsers } from '@/services/hooks/pomodoro/getTopUsers.hook'
import { TopUserItem } from './top-user-item'

export const TopUsersTab: React.FC = () => {
	const { data, isLoading, error } = useGetTopUsers()
	const [activeProfileId, setActiveProfileId] = useState<string | null>(null)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-4">
				<div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="p-4 font-bold text-center text-error bg-error/20 rounded-2xl">
				خطا در بارگذاری داده‌ها
			</div>
		)
	}

	if (!data?.tops || data.tops.length === 0) {
		return (
			<div className="p-4 font-bold text-center text-primary bg-primary/20 rounded-2xl">
				لیست کاربران خالی است
			</div>
		)
	}

	return (
		<div className="h-56 space-y-1 overflow-y-auto">
			{data.tops.map((user, index) => (
				<TopUserItem
					user={user}
					index={index}
					key={user.avatar}
					activeProfileId={activeProfileId}
					setActiveProfileId={setActiveProfileId}
				/>
			))}
		</div>
	)
}
