import { useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { playAlarm } from '@/common/utils/play-alarm'
import { translateError } from '@/common/utils/translate-error'
import { AvatarComponent, Button, Chip, ScrollRow } from '@/components/ui'
import { Icon } from '@/icons'
import { useSetActivity } from '@/services/user/user-service.hook'
import { ActivityBubble } from './activity-bubble'

const MAX_ACTIVITY_LENGTH = 40

type ActivityHours = 24 | 4 | 1

const DURATIONS = [
	{ hours: 1, label: 'friends.activity.duration1Hour' },
	{ hours: 4, label: 'friends.activity.duration4Hours' },
	{ hours: 24, label: 'friends.activity.duration1Day' },
] as const

interface ActivityComposerProps {
	avatar: string
	templates: string[]
	onPublished: () => void
	onShowRules: () => void
}

export function ActivityComposer({
	avatar,
	templates,
	onPublished,
	onShowRules,
}: ActivityComposerProps) {
	const [activity, setActivity] = useState('')
	const [hours, setHours] = useState<ActivityHours>(24)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const { mutateAsync, isPending } = useSetActivity()

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	useEffect(() => {
		const input = inputRef.current
		if (!input) return
		input.style.height = 'auto'
		input.style.height = `${input.scrollHeight}px`
	}, [activity])

	const handleSave = async () => {
		if (isPending) return
		if (!activity.trim()) {
			showToast(t('friends.activity.writeFirst'), 'error')
			return
		}

		try {
			await mutateAsync({ content: activity, time: hours })
			Analytics.event('friends_activity_posted')
			playAlarm('done_todo')
			callEvent('closeAllDropdowns')
			onPublished()
		} catch (error) {
			const translated = translateError(error)
			if (typeof translated === 'string') {
				showToast(translated, 'error')
				return
			}
			showToast(translated[Object.keys(translated)[0]], 'error')
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
			return
		}
		event.preventDefault()
		handleSave()
	}

	return (
		<div className="flex flex-col items-center gap-5">
			<div className="flex flex-col items-center w-full pb-1">
				<ActivityBubble size="lg">
					<textarea
						ref={inputRef}
						value={activity}
						onChange={(e) =>
							setActivity(e.target.value.slice(0, MAX_ACTIVITY_LENGTH))
						}
						onKeyDown={handleKeyDown}
						aria-label={t('friends.activity.textLabel')}
						placeholder={t('friends.activity.placeholder')}
						maxLength={MAX_ACTIVITY_LENGTH}
						rows={1}
						dir={activity ? 'auto' : 'rtl'}
						className="block w-full text-base leading-control text-center bg-transparent outline-none resize-none text-fg placeholder:text-fg-ghost"
					/>
				</ActivityBubble>
				<div className="mt-3 rounded-full ring-2 ring-surface-3">
					<AvatarComponent url={avatar} placeholder="" size="xl" />
				</div>
				<p className="mt-2 text-2xs text-fg-faint">
					{t('friends.activity.counter', {
						count: activity.length.toLocaleString('fa-IR'),
						max: MAX_ACTIVITY_LENGTH.toLocaleString('fa-IR'),
					})}
				</p>
			</div>

			{templates.length > 0 && (
				<div className="flex flex-col w-full gap-1.5">
					<p className="text-2xs font-semibold text-fg-muted">
						{t('friends.activity.suggestions')}
					</p>
					<ScrollRow>
						{templates.map((text) => (
							<Chip
								key={text}
								size="sm"
								dir="auto"
								className="shrink-0"
								selected={activity === text}
								onClick={() => setActivity(text)}
							>
								{text}
							</Chip>
						))}
					</ScrollRow>
				</div>
			)}

			<div className="flex flex-col w-full gap-1.5">
				<p className="text-2xs font-semibold text-fg-muted">
					{t('friends.activity.durationLabel')}
				</p>
				<div className="flex gap-1.5">
					{DURATIONS.map((duration) => (
						<Chip
							key={duration.hours}
							size="sm"
							selected={hours === duration.hours}
							onClick={() => setHours(duration.hours)}
						>
							{t(duration.label)}
						</Chip>
					))}
				</div>
			</div>

			<div className="flex items-center justify-between w-full gap-3 pt-1">
				<button
					type="button"
					onClick={onShowRules}
					className="flex items-center gap-1.5 text-xs font-medium rounded-lg cursor-pointer text-fg-muted transition-ui hover:text-fg-strong focus-visible:focus-ring"
				>
					<Icon name="users" size={14} aria-hidden="true" />
					{t('friends.activity.audience')}
					<Icon name="chevronLeft" size={12} aria-hidden="true" />
				</button>
				<Button
					type="button"
					size="sm"
					color="brand"
					rounded="2xl"
					className="px-6"
					loading={isPending}
					disabled={isPending || !activity.trim()}
					onClick={handleSave}
				>
					{t('friends.activity.publish')}
				</Button>
			</div>
		</div>
	)
}
