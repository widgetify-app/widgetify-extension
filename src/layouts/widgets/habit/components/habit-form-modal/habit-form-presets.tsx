import React from 'react'
import type { HabitPresetItem } from './habit-form.constants'
import { Chip } from '@/components/ui'

interface HabitFormPresetsProps {
	presets: HabitPresetItem[]
	activePresetId: string | null
	onSelectPreset: (preset: HabitPresetItem) => void
}

export const HabitFormPresets: React.FC<HabitFormPresetsProps> = React.memo(
	({ presets, activePresetId, onSelectPreset }) => {
		return (
			<div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
				{presets.map((preset) => {
					const isSelected = activePresetId === preset.id

					return (
						<Chip
							key={preset.id}
							selected={isSelected}
							onClick={() => onSelectPreset(preset)}
							className="flex items-center gap-1.5 shrink-0 px-1.5 py-1"
						>
							<span>{preset.emoji}</span>
							<span>{preset.label}</span>
						</Chip>
					)
				})}
			</div>
		)
	}
)

HabitFormPresets.displayName = 'HabitFormPresets'
