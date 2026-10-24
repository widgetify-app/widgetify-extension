import { moodOptions } from '@/common/constants/moods'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { MoodImage } from '@/components/mood-image'
import { AvatarComponent, Button, VipBadge } from '@/components/ui'
import { Icon, type IconName } from '@/icons'
import { type FriendCard, useGetFriendCard } from '@/services/friends/friend-service.hook'
import {
	birthdayParts,
	friendsSincePeriod,
	memberSinceYear,
	mutualSummary,
} from '../../utils/profile-card'
import { ProfileCardActions, ProfileCardMenu } from './profile-card-actions'

export interface FriendLookTarget {
	friend: NonNullable<FriendCard['friend']>
	name: string
}

interface ProfileCardProps {
	username: string
	onOpenLook: (target: FriendLookTarget) => void
}

export function ProfileCard({ username, onOpenLook }: ProfileCardProps) {
	const { data, isLoading, isError, refetch } = useGetFriendCard(username, true)

	if (isLoading) {
		return (
			<div className="flex flex-col" aria-busy="true">
				<div className="h-21 skeleton" />
				<div className="flex flex-col gap-2 px-4 pt-3 pb-4">
					<div className="w-1/2 h-4 rounded-sm skeleton" />
					<div className="w-1/3 h-3 rounded-sm skeleton" />
					<div className="w-full h-8 mt-2 rounded-xl skeleton" />
				</div>
			</div>
		)
	}

	if (isError || !data) {
		return (
			<div className="flex flex-col items-center gap-2 px-4 py-6 text-sm text-fg-muted">
				<p>{t('friends.card.loadFailed')}</p>
				<Button size="xs" rounded="lg" onClick={() => refetch()}>
					{t('friends.card.retry')}
				</Button>
			</div>
		)
	}

	return <ProfileCardView card={data} onOpenLook={onOpenLook} />
}

function ProfileCardView({
	card,
	onOpenLook,
}: {
	card: FriendCard
	onOpenLook: (target: FriendLookTarget) => void
}) {
	const { user, about, mutual, friend } = card
	const status = friend?.status ?? null
	const hasLook = Boolean(friend && (friend.wallpaper || friend.theme || friend.font))
	const sharedInterests = about.interests.filter((interest) => interest.shared)

	return (
		<article
			aria-label={t('friends.card.aria', { name: user.name })}
			className="flex flex-col"
		>
			<div className="relative h-21 bg-brand-fill">
				<div className="absolute flex gap-1.5 top-2 end-2">
					{friend && hasLook && (
						<button
							type="button"
							aria-label={t('friends.card.look')}
							onClick={() => onOpenLook({ friend, name: user.name })}
							className="grid rounded-full cursor-pointer size-8 place-items-center bg-scrim-soft text-image-fg transition-ui hover:bg-scrim focus-visible:focus-ring"
						>
							<Icon name="brush" size={16} />
						</button>
					)}
					<ProfileCardMenu card={card} />
				</div>
			</div>

			<div className="relative flex items-end gap-2.5 px-4 -mt-9">
				<span className="relative shrink-0">
					<AvatarComponent
						url={user.avatar}
						placeholder={user.name}
						size="xl"
						isPro={Boolean(friend?.isPro)}
						className="border-4 rounded-full border-surface-2"
					/>
					{friend?.mood && <MoodBadge mood={friend.mood} />}
				</span>
				{status && (
					<span
						className={cn(
							'mb-2 min-w-0 truncate rounded-2xl px-3 py-1.5 text-xs text-image-fg',
							!status.color && 'bg-brand'
						)}
						style={
							status.color ? { backgroundColor: status.color } : undefined
						}
					>
						{status.content}
					</span>
				)}
			</div>

			<div className="flex flex-col gap-3 px-4 pt-2.5 pb-4">
				<div className="min-w-0">
					<div className="flex items-center gap-1.5">
						<span className="text-base font-bold truncate text-fg-strong">
							{user.name}
						</span>
						{friend?.isPro && <VipBadge size="xs" text={t('ui.vip.pro')} />}
					</div>
					<div dir="ltr" className="text-xs truncate text-fg-faint text-end">
						@{user.username}
					</div>
				</div>

				{(about.occupation || sharedInterests.length > 0) && (
					<ul className="flex flex-wrap gap-1.5">
						{about.occupation && (
							<li className="px-2.5 py-0.5 text-2xs border rounded-full text-fg bg-fill border-line">
								{about.occupation}
							</li>
						)}
						{sharedInterests.map((interest) => (
							<li
								key={interest.title}
								className="px-2.5 py-0.5 text-2xs rounded-full border text-brand bg-brand-fill border-brand-fill"
							>
								{interest.title}
							</li>
						))}
					</ul>
				)}

				{mutual.count > 0 && <MutualFriends mutual={mutual} />}

				{friend && <FriendDetails friend={friend} />}

				<ProfileCardActions card={card} />
			</div>
		</article>
	)
}

function MutualFriends({ mutual }: { mutual: FriendCard['mutual'] }) {
	const summary = mutualSummary(
		mutual.count,
		mutual.preview.map((person) => person.name)
	)
	const names = summary.names.join(t('friends.card.namesSeparator'))

	return (
		<div className="flex items-center gap-2 text-xs text-fg-muted">
			<span className="flex shrink-0">
				{mutual.preview.map((person, index) => (
					<AvatarComponent
						key={person.username}
						url={person.avatar}
						placeholder={person.name}
						size="xs"
						className={cn(
							'rounded-full border-2 border-surface-2',
							index > 0 && '-ms-2'
						)}
					/>
				))}
			</span>
			<span className="min-w-0">
				{t('friends.card.mutual', {
					count: mutual.count,
					names:
						summary.others > 0
							? t('friends.card.mutualOthers', {
									names,
									others: summary.others,
								})
							: names,
				})}
			</span>
		</div>
	)
}

interface FriendDetail {
	icon: IconName
	text: string
}

function FriendDetails({ friend }: { friend: NonNullable<FriendCard['friend']> }) {
	const now = new Date()
	const since = friend.friendsSince
		? friendsSincePeriod(friend.friendsSince, now)
		: null
	const birthday = friend.birthday ? birthdayParts(friend.birthday, now) : null

	const items = [
		since && {
			icon: 'users',
			text:
				since.unit === 'new'
					? t('friends.card.sinceNew')
					: since.unit === 'months'
						? t('friends.card.sinceMonths', { count: since.count })
						: t('friends.card.sinceYears', { count: since.count }),
		},
		friend.city && { icon: 'location', text: friend.city },
		birthday && {
			icon: 'gift',
			text: birthday.isToday
				? t('friends.card.birthdayToday')
				: t('friends.card.birthday', {
						day: birthday.day,
						month: birthday.monthName,
					}),
		},
		{
			icon: 'calendar',
			text: t('friends.card.memberSince', {
				year: memberSinceYear(friend.memberSince),
			}),
		},
	].filter((item): item is FriendDetail => Boolean(item))

	return (
		<ul className="grid grid-cols-2 px-3 py-2.5 text-xs gap-x-3 gap-y-2 rounded-xl bg-fill text-fg-muted">
			{items.map((item) => (
				<li key={item.text} className="flex items-center min-w-0 gap-1.5">
					<Icon name={item.icon} size={12} className="shrink-0 text-fg-faint" />
					<span className="truncate">{item.text}</span>
				</li>
			))}
		</ul>
	)
}

function MoodBadge({ mood }: { mood: string }) {
	const option = moodOptions.find((item) => item.value === mood)
	if (!option) return null

	return (
		<span
			role="img"
			aria-label={t('friends.card.mood', { mood: t(option.labelKey) })}
			className="absolute grid rounded-full -bottom-0.5 -end-0.5 size-7 place-items-center bg-surface-2"
		>
			<MoodImage mood={mood} className="size-5" />
		</span>
	)
}
