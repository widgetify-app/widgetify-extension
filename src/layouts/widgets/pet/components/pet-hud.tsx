import { FaHeart } from 'react-icons/fa6'

interface Prop {
	level: number
}
export const PetHud: React.FC<Prop> = ({ level }) => {
	return (
		<div className="absolute left-0 z-10 bottom-5 opacity-90">
			<div className="flex items-center gap-1">
				<div className="flex items-center gap-0.5">
					{[...Array(5)].map((_, i) => (
						<FaHeart
							key={i}
							size={8}
							className={`${
								i < Math.ceil(level / 20)
									? 'text-red-500'
									: 'text-gray-400'
							} transition-colors duration-300`}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
