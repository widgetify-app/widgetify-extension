import type React from 'react'
import { type TopUsersType, useGetTopUsers } from '@/services/pomodoro/get-top-users.hook'
import { TopUserItem } from './components/top-user-item'
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
			<div aria-hidden="true" className="flex flex-col gap-0.5">
				{Array.from({ length: 4 }, (_, i) => (
					<div
						key={`top-user-skeleton-${i}`}
						className="flex items-center gap-2.5 px-2 min-h-9.5"
					>
						<div className="w-4 h-2.5 rounded-sm skeleton" />
						<div className="rounded-full size-6.5 skeleton" />
						<div className="w-1/3 h-2.5 rounded-sm skeleton" />
					</div>
				))}
			</div>
		)
	}

	if (error) {
		return (
			<WidgetError
				message="نتونستیم فهرست برترین‌ها رو بیاریم"
				onRetry={() => refetch()}
			/>
		)
	}

	if (!data?.tops || data.tops.length === 0) {
		return <WidgetEmpty art="users" title="هنوز کسی در این فهرست نیست" />
	}

	return (
		<div className="flex flex-col flex-1 min-h-0 gap-0.5 overflow-y-auto scrollbar-none">
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
