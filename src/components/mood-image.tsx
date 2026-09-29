import { moodEmptyImage, moodOptions } from '@/common/constants/moods'
import { cn } from '@/common/utils/cn'

interface MoodImageProps {
	mood?: string
	className?: string
}

export function MoodImage({ mood, className }: MoodImageProps) {
	const src =
		moodOptions.find((option) => option.value === mood)?.image ?? moodEmptyImage

	return (
		<img
			src={src}
			alt=""
			aria-hidden="true"
			draggable={false}
			className={cn('inline-block w-[1em] h-[1em]', className)}
		/>
	)
}
