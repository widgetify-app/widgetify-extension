import type React from 'react'
import { type TopUsersType, useGetTopUsers } from '@/services/pomodoro/get-top-users.hook'
import { TopUserItem } from './components/top-user-item'
import { Spinner } from '@/components/ui'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetError } from '@/features/widgets/components/widget-error'

interface TopUsersTabProps {
	type: TopUsersType
}
export const TopUsersTab: React.FC<TopUsersTabProps> = ({ type }) => {
	const { data, isLoading, error, refetch } = useGetTopUsers(type)
	const [activeProfileId, setActiveProfileId] = useState<string | null>(null)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-4">
				<Spinner size="xl" />
			</div>
		)
	}

	if (error) {
		return (
			<WidgetError message="فهرست برترین‌ها دریافت نشد" onRetry={() => refetch()} />
		)
	}

	if (!data?.tops || data.tops.length === 0) {
		return <WidgetEmpty art="users" title="هنوز کسی در این فهرست نیست" />
	}

	return (
		<div className="flex-1 min-h-0 px-1 pb-1 space-y-1 overflow-y-auto">
			{data.tops.map((user, index) => (
				<TopUserItem
					user={user}
					rank={user.rank || index + 1}
					key={user.avatar}
					activeProfileId={activeProfileId}
					setActiveProfileId={setActiveProfileId}
				/>
			))}
		</div>
	)
}
