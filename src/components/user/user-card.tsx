import { TbUsersPlus } from 'react-icons/tb'
import { useAuth } from '@/context/auth.context'
import { useSendFriendRequest } from '@/services/hooks/friends/friendService.hook'
import { translateError } from '@/utils/translate-error'
import { AvatarComponent } from '../avatar.component'
import { Button } from '../button/button'
import type { UserCardUser } from './user-card-portal'
import { showToast } from '@/common/toast'

interface UserCardProps {
	user: UserCardUser
	className?: string
}

export function UserCard({ user, className = '' }: UserCardProps) {
	const { isAuthenticated } = useAuth()
	const { mutate: sendFriendRequest, isPending: isSending } = useSendFriendRequest()

	const showManageFriend = !user.isSelf && isAuthenticated && user.username

	function onAddClick() {
		if (!user.username) return

		sendFriendRequest(
			{ username: user.username },
			{
				onSuccess: () => {
					showToast('درخواست دوستی با موفقیت ارسال شد', 'success')
				},
				onError: (err) => {
					const message = translateError(err)
					if (typeof message === 'string') {
						showToast(message, 'error')
					} else {
						showToast(message.username as string, 'error')
					}
				},
			}
		)
	}

	return (
		<div className={`${className}`}>
			<div
				className={
					'flex flex-col overflow-hidden border border-gray-700 rounded-lg shadow-xl bg-widget widget-wrapper'
				}
			>
				<div className="w-full h-16 bg-gray-900"></div>

				<div className="px-4 pb-4">
					<div className="relative mb-3 -mt-8">
						<div className="flex justify-between w-full">
							<AvatarComponent
								url={user.avatar}
								placeholder={user.username || ''}
								size="xl"
								className="w-16 h-16 overflow-hidden border-2 border-gray-800 rounded-full"
							/>
							{showManageFriend ? (
								<div className={'w-24 top-9 absolute -right-3'} dir="rtl">
									<div className="flex justify-start">
										{!user.friendshipStatus && (
											<Button
												size="xs"
												rounded="md"
												className="flex items-center  !text-[10px]  text-gray-100"
												isPrimary={true}
												loading={isSending}
												loadingText="در حال ارسال..."
												onClick={() => onAddClick()}
											>
												<TbUsersPlus size={14} />
												درخواست
											</Button>
										)}

										{user.friendshipStatus === 'PENDING' && (
											<p
												className={
													'text-sm text-content opacity-70 bg-content bg-glass rounded-2xl px-1'
												}
											>
												ارسال شده
											</p>
										)}
									</div>
								</div>
							) : null}
						</div>
					</div>

					<div className="mb-4">
						<p className={'text-xl font-bold text-content'}>{user.name}</p>
						<div className={'text-sm font-bold text-muted'}>
							@{user.username}
						</div>

						{user.extras?.activity && (
							<div className="flex items-center mt-2 text-sm text-gray-300">
								<span className={'text-content opacity-85'}>
									{user.extras.activity}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
