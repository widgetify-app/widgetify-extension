import { t } from '@/common/i18n'
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
				{t('market.preview.font.samplePhrase')}
			</span>
			<span
				className={cn(
					'text-fg-muted tabular-nums',
					size === 'lg' ? 'text-base' : 'text-xs'
				)}
			>
				{t('market.preview.font.alphabetSample')}
			</span>
		</span>
	)
}
