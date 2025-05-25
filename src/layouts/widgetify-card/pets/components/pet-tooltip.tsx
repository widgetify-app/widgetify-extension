import { getCardBackground, getTextColor, useTheme } from '@/context/theme.context'

interface PetTooltipProps {
	direction: number
	content: string
	emoji?: string
	isAnimation?: boolean
}

export const PetTooltip: React.FC<PetTooltipProps> = ({
	direction,
	content,
	emoji,
	isAnimation = false,
}) => {
	const { theme } = useTheme()

	return (
		<div
			className="absolute -translate-x-1/2 -top-8 left-1/2"
			style={{
				transform: `scaleX(${direction})`,
				animation: isAnimation ? 'fadeInUp 0.3s ease-out' : undefined,
			}}
		>
			<div
				className={`relative bg-gradient-to-r  px-3 py-1.5 rounded-md text-xs whitespace-nowrap shadow-lg ${getCardBackground(theme)}`}
				style={{
					animation: isAnimation ? 'gentlePulse 2s ease-in-out infinite' : undefined,
				}}
			>
				<div className="flex items-center gap-1">
					{emoji && (
						<span
							className="inline-block"
							style={{
								animation: isAnimation
									? 'gentleRotate 1.5s ease-in-out infinite'
									: undefined,
							}}
						>
							{emoji}
						</span>
					)}
					<span className={`font-medium ${getTextColor(theme)}`}>{content}</span>
				</div>
			</div>

			{isAnimation && (
				<style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes gentlePulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                    }

                    @keyframes gentleRotate {
                        0%, 100% {
                            transform: rotate(0deg);
                        }
                        25% {
                            transform: rotate(10deg);
                        }
                        75% {
                            transform: rotate(-10deg);
                        }
                    }
                `}</style>
			)}
		</div>
	)
}
