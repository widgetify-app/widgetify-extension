import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { AvatarComponent, Button } from '@/components/ui'
import { Icon } from '@/icons'
import {
	type AttachmentReaction,
	useGetActivityReactions,
} from '@/services/friends/friend-service.hook'
import { useRemoveActivity } from '@/services/user/user-service.hook'
import { MakeSkeletonFriendItem } from '../friend-item-skeleton'
import { ActivityBubble } from './activity-bubble'
import { GetContentFromReactions, RenderReactionContent } from './activity-reaction'

interface ActivityDetailsProps {
	avatar: string
	activity: { id: string; content: string }
	reactions: AttachmentReaction[]
	onDeleted: () => void
}

export function ActivityDetails({
	avatar,
	activity,
	reactions,
	onDeleted,
}: ActivityDetailsProps) {
	const { mutateAsync: removeAsync, isPending: isRemoving } = useRemoveActivity()
	const { data: fetchedReactions, isPending } = useGetActivityReactions(
		activity.id,
		true
	)
	const reactors = fetchedReactions?.reactions ?? []

	const handleDelete = async () => {
		try {
			await removeAsync({ id: activity.id })
			showToast(t('friends.activity.deleted'), 'success')
			onDeleted()
		} catch {
			showToast(t('friends.activity.deleteFailed'), 'error')
		}
	}

	return (
		<div className="flex flex-col items-center gap-5">
			<div className="flex flex-col items-center w-full pb-1">
				<ActivityBubble size="lg">
					<p className="text-fg wrap-break-word" dir="auto">
						{activity.content}
					</p>
				</ActivityBubble>
				<div className="mt-3 rounded-full ring-2 ring-surface-3">
					<AvatarComponent url={avatar} placeholder="" size="xl" />
				</div>
			</div>

			<div className="flex flex-col w-full gap-2">
				<p className="text-xs font-semibold text-fg-muted">
					{t('friends.activity.reactions', { count: reactors.length })}
				</p>
				{isPending ? (
					<div className="flex flex-col gap-1 h-28">
						{MakeSkeletonFriendItem(3)}
					</div>
				) : reactors.length > 0 ? (
					<div className="flex flex-col gap-1 pr-1 overflow-y-auto max-h-40">
						{reactors.map((reactor, index) => (
							<div
								key={`${reactor.username}-${index}`}
								className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-fill"
							>
								<AvatarComponent
									url={reactor.avatar}
									placeholder={reactor.name}
									size="xs"
								/>
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium truncate text-fg">
										{reactor.name}
									</p>
									<p
										className="truncate text-3xs text-fg-faint"
										dir="ltr"
									>
										@{reactor.username}
									</p>
								</div>
								<span className="grid text-sm rounded-full size-6 place-items-center bg-brand-fill">
									{RenderReactionContent(
										GetContentFromReactions(
											reactor.reaction,
											reactions
										)?.content || ''
									)}
								</span>
							</div>
						))}
					</div>
				) : (
					<p className="py-4 text-sm text-center text-fg-muted">
						{t('friends.activity.noReactions')}
					</p>
				)}
			</div>

			<Button
				type="button"
				size="sm"
				color="danger"
				rounded="2xl"
				fullWidth
				loading={isRemoving}
				disabled={isRemoving}
				icon={<Icon name="trash" size={14} />}
				onClick={handleDelete}
			>
				{t('friends.activity.delete')}
			</Button>
		</div>
	)
}
