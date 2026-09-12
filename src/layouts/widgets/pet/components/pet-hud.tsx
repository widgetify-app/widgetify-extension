import { FaHeart } from 'react-icons/fa6'

interface Prop {
	level: number
}
export const PetHud: React.FC<Prop> = ({ level }) => {
	return (
		<div className="z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">
			<div className="flex items-center gap-1">
				<div className="flex items-center gap-0.5">
					{[...Array(5)].map((_, i) => (
						<FaHeart
							key={i}
							size={8}
							className={`${
								i < Math.ceil(level / 20)
									? 'text-error'
									: 'text-neutral-content/60'
							} transition-colors duration-300`}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
