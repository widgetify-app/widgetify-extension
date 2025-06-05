interface Birthday {
	id: string
	name: string
	date: string
	avatar?: string
}

interface BirthdayItemProps {
	birthday: Birthday
}

export function BirthdayItem({ birthday }: BirthdayItemProps) {
	return (
		<div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
			<div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
				{birthday.avatar ? (
					<img
						src={birthday.avatar}
						alt={birthday.name}
						className="w-full h-full rounded-full object-cover"
					/>
				) : (
					birthday.name.charAt(0)
				)}
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-base-content truncate">{birthday.name}</p>
				<p className="text-xs text-base-content opacity-60">{birthday.date}</p>
			</div>
			<div className="text-lg">🎂</div>
		</div>
	)
}
