import { moodOptions } from '@/common/constants/moods'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { MoodImage } from '@/components/mood-image'
import { Tooltip } from '@/components/ui'

interface MoodBadgeProps {
	mood: string
	size?: 'sm' | 'md'
}

export function MoodBadge({ mood, size = 'md' }: MoodBadgeProps) {
	const option = moodOptions.find((item) => item.value === mood)
	if (!option) return null

	const label = t('friends.card.mood', { mood: t(option.labelKey) })

	return (
		<Tooltip
			content={label}
			className={cn(
				'absolute',
				size === 'md' ? '-bottom-0.5 -end-0.5' : '-bottom-1 -end-1'
			)}
		>
			<span
				role="img"
				aria-label={label}
				className={cn(
					'grid rounded-full place-items-center bg-surface-2',
					size === 'md' ? 'size-7' : 'size-5'
				)}
			>
				<MoodImage
					mood={mood}
					className={size === 'md' ? 'size-5' : 'size-3.5'}
				/>
			</span>
		</Tooltip>
	)
}
