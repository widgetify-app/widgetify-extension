import React from 'react'

interface HabitFormHeaderProps {
	isEdit: boolean
	onClose: () => void
}

export const HabitFormHeader: React.FC<HabitFormHeaderProps> = React.memo(
	({ isEdit, onClose }) => {
		return (
			<div className="flex items-center justify-between pb-1">
				<div className="flex flex-col text-right">
					<h3 className="text-base font-bold text-ds-fg">
						{isEdit ? 'ویرایش عادت' : 'عادت جدید'}
					</h3>
					<p className="text-xs text-ds-fg-muted mt-0.5">
						از یک الگو شروع کن یا خودت بساز
					</p>
				</div>

				<button
					type="button"
					onClick={onClose}
					className="flex items-center justify-center w-8 h-8 transition-ui cursor-pointer rounded-xl bg-ds-fill hover:bg-ds-fill-2 text-ds-fg-muted hover:text-ds-fg-strong"
					aria-label="بستن"
				>
					✕
				</button>
			</div>
		)
	}
)

HabitFormHeader.displayName = 'HabitFormHeader'
