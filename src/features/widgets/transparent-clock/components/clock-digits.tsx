import type React from 'react'

const DIGIT_SLOT_WIDTH = '0.62em'

interface ClockDigitsProps {
	value: string
}

export const ClockDigits: React.FC<ClockDigitsProps> = ({ value }) => {
	return (
		<>
			{value.split('').map((digit, index) => (
				<span
					key={`${index}-${digit}`}
					style={{
						display: 'inline-block',
						width: DIGIT_SLOT_WIDTH,
						textAlign: 'center',
					}}
				>
					{digit}
				</span>
			))}
		</>
	)
}
