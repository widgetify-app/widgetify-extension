import { t } from '@/common/i18n'
import React from 'react'
import { Icon } from '@/icons'

interface HabitFormHeaderProps {
	isEdit: boolean
	onClose: () => void
}

export const HabitFormHeader: React.FC<HabitFormHeaderProps> = React.memo(
	({ isEdit, onClose }) => {
		return (
			<div className="flex items-center justify-between pb-1">
				<div className="flex flex-col text-right">
					<h3 className="text-base font-bold text-fg">
						{isEdit
							? t('widgets.habit.form.editTitle')
							: t('widgets.habit.empty.cta')}
					</h3>
					{!isEdit && (
						<p className="text-xs text-fg-muted mt-0.5">
							{t('widgets.habit.form.createHint')}
						</p>
					)}
				</div>

				<button
					type="button"
					onClick={onClose}
					className="flex items-center justify-center w-8 h-8 transition-ui cursor-pointer rounded-xl bg-fill hover:bg-fill-2 text-fg-muted hover:text-fg-strong focus-visible:focus-ring"
					aria-label={t('ui.common.close')}
				>
					<Icon name="close" size={16} aria-hidden="true" />
				</button>
			</div>
		)
	}
)

HabitFormHeader.displayName = 'HabitFormHeader'
