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
					<h3 className="text-base font-bold text-content">
						{isEdit ? 'ویرایش عادت' : 'عادت جدید'}
					</h3>
					<p className="text-xs text-muted mt-0.5">
						از یک الگو شروع کن یا خودت بساز
					</p>
				</div>

				<button
					type="button"
					onClick={onClose}
					className="flex items-center justify-center w-8 h-8 transition-all cursor-pointer rounded-xl bg-base-200/80 hover:bg-base-300 text-muted hover:text-content"
					aria-label="بستن"
				>
					✕
				</button>
			</div>
		)
	}
)

HabitFormHeader.displayName = 'HabitFormHeader'
