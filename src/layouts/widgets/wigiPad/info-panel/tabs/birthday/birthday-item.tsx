import type { InfoPanelData } from '../../hooks/useInfoPanelData'

interface BirthdayItemProps {
	birthday: InfoPanelData['birthdays'][number]
}

export function BirthdayItem({ birthday }: BirthdayItemProps) {
	return (
		<div className="flex items-center gap-3 p-2 transition-colors rounded-lg bg-base-200 hover:bg-base-300">
			<div className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-primary text-primary-content">
				{birthday.avatar ? (
					<img
						src={birthday.avatar}
						alt={birthday.name}
						className="object-cover w-full h-full rounded-full"
					/>
				) : (
					birthday.name.charAt(0)
				)}
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate text-base-content">{birthday.name}</p>
			</div>
			<div className="text-lg">🎂</div>
		</div>
	)
}
