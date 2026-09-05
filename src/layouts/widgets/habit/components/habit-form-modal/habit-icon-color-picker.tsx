import React, { useCallback, useState } from 'react'
import { HABIT_EMOJI_CATEGORIES } from './habit-form.constants'
import { HABIT_COLOR_PRESETS } from '@/common/constant/habit-options'
import { Chip, ColorPicker } from '@/components/ui'
import { cn } from '@/common/utils/cn'

interface HabitIconColorPickerProps {
	selectedEmoji: string
	selectedColor: string
	onSelectEmoji: (emoji: string) => void
	onSelectColor: (color: string) => void
}

interface EmojiItemProps {
	emoji: string
	isSelected: boolean
	onSelect: (emoji: string) => void
}

const EmojiItem = React.memo<EmojiItemProps>(({ emoji, isSelected, onSelect }) => {
	const handleClick = useCallback(() => {
		onSelect(emoji)
	}, [emoji, onSelect])

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				'w-7.5 h-7.5 flex items-center justify-center rounded-xl text-base transition-colors cursor-pointer select-none',
				isSelected
					? 'bg-primary text-white shadow-xs'
					: 'bg-transparent text-content hover:bg-base-200/60'
			)}
		>
			{emoji}
		</button>
	)
})
EmojiItem.displayName = 'EmojiItem'

interface ColorSwatchProps {
	color: string
	isSelected: boolean
	onSelect: (color: string) => void
}

const ColorSwatch = React.memo<ColorSwatchProps>(({ color, isSelected, onSelect }) => {
	const handleClick = useCallback(() => {
		onSelect(color)
	}, [color, onSelect])

	return (
		<button
			type="button"
			onClick={handleClick}
			className="relative flex items-center justify-center w-6 h-6 transition-transform rounded-full cursor-pointer hover:scale-110"
			style={{ backgroundColor: color }}
		>
			{isSelected && (
				<span
					className="absolute border-2 rounded-full -inset-1"
					style={{ borderColor: color }}
				/>
			)}
		</button>
	)
})
ColorSwatch.displayName = 'ColorSwatch'

export const HabitIconColorPicker: React.FC<HabitIconColorPickerProps> = React.memo(
	({ selectedEmoji, selectedColor, onSelectEmoji, onSelectColor }) => {
		const [activeCategory, setActiveCategory] = useState<string>('health')

		const currentCategory = HABIT_EMOJI_CATEGORIES.find(
			(c) => c.id === activeCategory
		)

		return (
			<div className="grid items-stretch grid-cols-12 gap-3">
				<div className="flex flex-col col-span-8 p-3 overflow-hidden border rounded-2xl border-base-content/15 bg-base-200/30">
					<div className="flex items-center justify-between mb-2">
						<span className="text-xs font-bold text-content">شکلک</span>
						<div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
							{HABIT_EMOJI_CATEGORIES.map((cat) => (
								<Chip
									onClick={() => setActiveCategory(cat.id)}
									key={cat.id}
									selected={activeCategory === cat.id}
									className="py-1! px-1.5! border-none text-[11px]"
								>
									{cat.label}
								</Chip>
							))}
						</div>
					</div>

					<div className="grid grid-cols-7 gap-1 pt-1 justify-items-center">
						{currentCategory?.emojis.map((emoji) => (
							<EmojiItem
								key={emoji}
								emoji={emoji}
								isSelected={selectedEmoji === emoji}
								onSelect={onSelectEmoji}
							/>
						))}
					</div>
				</div>

				<div className="flex flex-col justify-between col-span-4 p-3 border rounded-2xl border-base-content/15 bg-base-200/30">
					<div className="flex items-center justify-between mb-2">
						<span className="text-xs font-bold text-content">رنگ</span>
						<div className="flex items-center">
							<ColorPicker color={selectedColor} onChange={onSelectColor} />
						</div>
					</div>

					<div className="grid grid-cols-4 gap-2 my-auto place-items-center">
						{HABIT_COLOR_PRESETS.map((color) => (
							<ColorSwatch
								key={color}
								color={color}
								isSelected={
									selectedColor.toLowerCase() === color.toLowerCase()
								}
								onSelect={onSelectColor}
							/>
						))}
					</div>
				</div>
				</div>
			)
		},
	)

HabitIconColorPicker.displayName = 'HabitIconColorPicker'
