import { useEffect, useRef } from 'react'
import { Motion } from '@/common/motion'

const STEP_PERCENT = 35
const STEP_SECONDS = 0.14
const STEP_EASE = [0.22, 1, 0.36, 1] as const

interface CountingNumberProps {
	value: number
	text: string
}

export function CountingNumber({ value, text }: CountingNumberProps) {
	const previous = useRef<number | null>(null)
	const hasShown = previous.current !== null
	const shift = value >= (previous.current ?? value) ? STEP_PERCENT : -STEP_PERCENT
	const characters = Array.from(text)

	useEffect(() => {
		previous.current = value
	}, [value])

	return (
		<span dir="ltr" className="inline-flex tabular-nums">
			<span className="sr-only">{text}</span>
			{characters.map((character, place) => {
				const fromEnd = characters.length - place

				return (
					<Motion.span
						key={`${fromEnd}-${character}`}
						aria-hidden="true"
						className="inline-block"
						initial={hasShown ? { y: `${shift}%`, opacity: 0 } : false}
						animate={{ y: '0%', opacity: 1 }}
						transition={{ duration: STEP_SECONDS, ease: STEP_EASE }}
					>
						{character}
					</Motion.span>
				)
			})}
		</span>
	)
}
