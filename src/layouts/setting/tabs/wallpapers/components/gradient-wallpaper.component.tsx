import { useEffect, useState } from 'react'
import type { GradientColors, Wallpaper } from '@/common/wallpaper.interface'
import { SectionPanel } from '@/components/section-panel'

interface GradientWallpaperProps {
	onSelectGradient: (gradient: Wallpaper) => void
	selectedGradient?: Wallpaper
}

const predefinedGradients: { from: string; to: string; name: string }[] = [
	{ from: '#ff9a9e', to: '#fad0c4', name: 'صورتی ملایم' },
	{ from: '#a1c4fd', to: '#c2e9fb', name: 'آبی آسمانی' },
	{ from: '#d4fc79', to: '#96e6a1', name: 'سبز بهاری' },
	{ from: '#ffecd2', to: '#fcb69f', name: 'نارنجی پاییزی' },
	{ from: '#84fab0', to: '#8fd3f4', name: 'فیروزه‌ای' },
	{ from: '#cfd9df', to: '#e2ebf0', name: 'خاکستری روشن' },
	{ from: '#a6c0fe', to: '#f68084', name: 'آبی به صورتی' },
	{ from: '#fbc2eb', to: '#a6c1ee', name: 'بنفش ملایم' },
]

export function GradientWallpaper({
	onSelectGradient,
	selectedGradient,
}: GradientWallpaperProps) {
	const [direction, setDirection] = useState<GradientColors['direction']>('to-r')

	useEffect(() => {
		if (
			selectedGradient?.type === 'GRADIENT' &&
			selectedGradient.gradient?.direction
		) {
			setDirection(selectedGradient.gradient.direction)
		}
	}, [selectedGradient])

	const getTailwindDirectionToCss = (direction: string): string => {
		const directionMap: Record<string, string> = {
			'to-r': 'to right',
			'to-l': 'to left',
			'to-t': 'to top',
			'to-b': 'to bottom',
			'to-tr': 'to top right',
			'to-tl': 'to top left',
			'to-br': 'to bottom right',
			'to-bl': 'to bottom left',
		}
		return directionMap[direction] || 'to right'
	}

	const createGradientId = (from: string, to: string): string => {
		return `gradient-${from.replace('#', '')}-${to.replace('#', '')}`
	}

	const createGradientWallpaper = (
		from: string,
		to: string,
		name: string
	): Wallpaper => {
		return {
			id: createGradientId(from, to),
			name: name,
			type: 'GRADIENT',
			src: '',
			previewSrc: '',
			gradient: {
				from,
				to,
				direction,
			},
		}
	}

	const handlePredefinedGradientSelect = (from: string, to: string, name: string) => {
		const gradient = createGradientWallpaper(from, to, name)
		onSelectGradient(gradient)
	}

	const isSelected = (from: string, to: string) => {
		if (!selectedGradient) return false

		const gradientId = createGradientId(from, to)
		return selectedGradient.id === gradientId
	}

	return (
		<div className="space-y-4">
			<SectionPanel title="گرادیان‌های پیش‌فرض">
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{predefinedGradients.map((gradient, index) => (
						<div
							key={index}
							className={`rounded-lg h-24 cursor-pointer overflow-hidden relative
              ${isSelected(gradient.from, gradient.to) ? 'ring-2 ring-blue-500' : ''}
            `}
							onClick={() =>
								handlePredefinedGradientSelect(
									gradient.from,
									gradient.to,
									gradient.name
								)
							}
						>
							<div
								className={'absolute inset-0'}
								style={{
									backgroundImage: `linear-gradient(${getTailwindDirectionToCss(direction)}, ${gradient.from}, ${gradient.to})`,
								}}
							></div>
							<div className="absolute bottom-0 left-0 right-0 p-1 text-xs text-center text-white bg-black/30">
								{gradient.name}
							</div>
						</div>
					))}
				</div>
			</SectionPanel>
		</div>
	)
}
