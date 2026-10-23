import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { AvatarComponent, Button, VipBadge } from '@/components/ui'
import { type FriendCard, useGetFriendCard } from '@/services/friends/friend-service.hook'
import {
	birthdayParts,
	friendsSincePeriod,
	memberSinceYear,
	mutualSummary,
} from '../../utils/profile-card'
import { ProfileCardActions } from './profile-card-actions'

interface ProfileCardProps {
	username: string
}

export function ProfileCard({ username }: ProfileCardProps) {
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

	return <ProfileCardView card={data} />
}

function ProfileCardView({ card }: { card: FriendCard }) {
	const { user, about, mutual, friend } = card
	const wallpaper = friend?.wallpaper ?? null
	const status = friend?.status ?? null

	return (
		<article
			aria-label={t('friends.card.aria', { name: user.name })}
			className="flex flex-col"
		>
			<div className="relative overflow-hidden h-21 bg-brand-fill">
				{wallpaper && (
					<img
						src={wallpaper.previewUrl}
						alt={t('friends.card.wallpaperAlt', { name: user.name })}
						className="absolute inset-0 object-cover size-full"
					/>
				)}
			</div>

			<div className="relative flex items-end gap-2.5 px-4 -mt-9">
				<AvatarComponent
					url={user.avatar}
					placeholder={user.name}
					size="xl"
					className="border-4 rounded-full border-surface-2"
				/>
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

				{(about.occupation || about.interests.length > 0) && (
					<ul className="flex flex-wrap gap-1.5">
						{about.occupation && (
							<li className="px-2.5 py-0.5 text-2xs border rounded-full text-fg bg-fill border-line">
								{about.occupation}
							</li>
						)}
						{about.interests.map((interest) => (
							<li
								key={interest.title}
								className={cn(
									'px-2.5 py-0.5 text-2xs rounded-full border',
									interest.shared
										? 'text-brand bg-brand-fill border-brand-fill'
										: 'text-fg-muted bg-fill border-line'
								)}
							>
								{interest.shared && '✓ '}
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

function FriendDetails({ friend }: { friend: NonNullable<FriendCard['friend']> }) {
	const now = new Date()
	const since = friend.friendsSince
		? friendsSincePeriod(friend.friendsSince, now)
		: null
	const birthday = friend.birthday ? birthdayParts(friend.birthday, now) : null

	const items = [
		since &&
			(since.unit === 'new'
				? t('friends.card.sinceNew')
				: since.unit === 'months'
					? t('friends.card.sinceMonths', { count: since.count })
					: t('friends.card.sinceYears', { count: since.count })),
		friend.city && `📍 ${friend.city}`,
		birthday &&
			(birthday.isToday
				? `🎂 ${t('friends.card.birthdayToday')}`
				: `🎂 ${t('friends.card.birthday', { day: birthday.day, month: birthday.monthName })}`),
		t('friends.card.memberSince', { year: memberSinceYear(friend.memberSince) }),
		friend.collectionCount > 0 &&
			t('friends.card.collection', { count: friend.collectionCount }),
	].filter(Boolean)

	return (
		<ul className="flex flex-wrap text-xs gap-x-3 gap-y-1 text-fg-muted">
			{items.map((item) => (
				<li key={item as string}>{item}</li>
			))}
		</ul>
	)
}
