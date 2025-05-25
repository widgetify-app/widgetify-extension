interface Prop {
	level: number
	isHungry: boolean
	petName: string
}
export const PetHud: React.FC<Prop> = ({ level, isHungry, petName }) => {
	return (
		<div className="flex items-center h-full gap-2">
			{isHungry ? (
				<div className="flex items-center">
					<span className="text-[10px] font-bold text-red-500 animate-pulse">🍽️</span>
				</div>
			) : (
				<div className="flex items-center">
					<span className="text-[10px] text-emerald-500">💚</span>
				</div>
			)}
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between mb-0.5">
					{petName}
					<span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 tracking-wider">
						{level}%
					</span>
				</div>
				<div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-full h-1.5 shadow-inner overflow-hidden">
					<div
						className={`h-1.5 rounded-full transition-all duration-700 ease-out shadow-sm ${
							level >= 60
								? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-green-500/30'
								: level >= 30
									? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-yellow-500/30'
									: 'bg-gradient-to-r from-red-400 to-rose-500 shadow-red-500/30 animate-pulse'
						}`}
						style={{
							width: `${level}%`,
							boxShadow:
								level < 30
									? '0 0 8px rgba(239, 68, 68, 0.4)'
									: level < 60
										? '0 0 6px rgba(245, 158, 11, 0.3)'
										: '0 0 6px rgba(16, 185, 129, 0.3)',
						}}
					/>
				</div>
			</div>
		</div>
		// </div>
	)
}
