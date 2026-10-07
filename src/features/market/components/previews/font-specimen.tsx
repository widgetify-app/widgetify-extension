import { cn } from '@/common/utils/cn'

interface FontSpecimenProps {
	family: string
	size?: 'sm' | 'lg'
}

export function FontSpecimen({ family, size = 'sm' }: FontSpecimenProps) {
	return (
		<span
			aria-hidden="true"
			className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center text-fg-strong"
			style={{ fontFamily: `"${family}", Vazir` }}
		>
			<span className={cn('leading-tight', size === 'lg' ? 'text-3xl' : 'text-xl')}>
				دریاچه‌ای از آرامش
			</span>
			<span
				className={cn(
					'text-fg-muted tabular-nums',
					size === 'lg' ? 'text-base' : 'text-xs'
				)}
			>
				آ ب پ ت ث ۱۲۳۴۵۶
			</span>
		</span>
	)
}
