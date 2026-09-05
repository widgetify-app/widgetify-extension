import React from 'react'
import { Button } from '@/components/ui'

interface HabitFormActionsProps {
	isEdit: boolean
	isPending: boolean
	onClose: () => void
	onSubmit: () => void
}

export const HabitFormActions: React.FC<HabitFormActionsProps> = React.memo(
	({ isEdit, isPending, onClose, onSubmit }) => {
		return (
			<div className="flex items-center gap-1.5 pt-2 px-1">
				<Button
					type="button"
					variant="default"
					size="md"
					rounded="2xl"
					onClick={onClose}
					disabled={isPending}
					className="w-1/4 text-xs font-bold h-11 bg-base-200/80 hover:bg-base-300 text-content"
				>
					انصراف
				</Button>

				<Button
					type="button"
					variant="primary"
					size="md"
					rounded="2xl"
					onClick={onSubmit}
					disabled={isPending}
					className="flex-1 w-full text-xs font-bold shadow-md h-11 shadow-primary/20"
				>
					{isPending
						? 'در حال ذخیره...'
						: isEdit
							? 'ذخیره تغییرات'
							: 'افزودن عادت'}
				</Button>
			</div>
		)
	}
)

HabitFormActions.displayName = 'HabitFormActions'
