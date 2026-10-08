import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { WidgetControlTone } from '@/features/widgets/components/widget-menu-button'
import { PRIORITY_OPTIONS } from '../constants'
import type { NotePriority } from '../types'

interface NoteColorPickerProps {
	value: NotePriority | undefined
	onChange: (value: NotePriority | undefined) => void
	tone?: WidgetControlTone
}

export function NoteColorPicker({
	value,
	onChange,
	tone = 'default',
}: NoteColorPickerProps) {
	const swatches = [
		{
			value: undefined as NotePriority | undefined,
			ariaLabel: t('widgets.notes.color.default'),
			bgColor: 'bg-fill-3',
		},
		...PRIORITY_OPTIONS.map((option) => ({
			value: option.value as NotePriority | undefined,
			ariaLabel: t(option.ariaLabelKey),
			bgColor: option.bgColor,
		})),
	]

	return (
		<div className="flex items-center gap-2">
			{swatches.map((swatch) => {
				const isSelected = value === swatch.value
				return (
					<button
						key={swatch.ariaLabel}
						type="button"
						onClick={() => onChange(swatch.value)}
						aria-label={swatch.ariaLabel}
						aria-pressed={isSelected}
						className={cn(
							'grid rounded-full cursor-pointer place-items-center size-4 transition-ui focus-visible:focus-ring',
							swatch.bgColor,
							tone === 'onColor' && 'ring-1 ring-current',
							!isSelected && 'hover:scale-110'
						)}
					>
						{isSelected && <Icon name="check" size={10} aria-hidden="true" />}
					</button>
				)
			})}
		</div>
	)
}
