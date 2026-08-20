import { useEffect, useRef, useState } from 'react'
import { useDate } from '@/context/date.context'
import { toPersianDigits } from '@/common/utils/persian-digits'

const FLIP_DURATION = 400

interface FlipUnitProps {
	value: string
}

function FlipUnit({ value }: FlipUnitProps) {
	const [current, setCurrent] = useState(value)
	const [previous, setPrevious] = useState(value)
	const [flipping, setFlipping] = useState<'top' | 'bottom' | null>(null)
	const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

	useEffect(() => {
		if (value === current) return

		timeoutsRef.current.forEach(clearTimeout)
		timeoutsRef.current = []

		setPrevious(current)
		setFlipping('top')

		const t1 = setTimeout(() => {
			setCurrent(value)
			setFlipping('bottom')
		}, FLIP_DURATION / 2)

		const t2 = setTimeout(() => {
			setFlipping(null)
		}, FLIP_DURATION)

		timeoutsRef.current = [t1, t2]

		return () => timeoutsRef.current.forEach(clearTimeout)
	}, [value])

	const CARD_H = 38
	const GAP = 2

	return (
		<div
			className="relative select-none"
			style={{
				width: 88,
				height: CARD_H * 2 + GAP,
				perspective: 400,
			}}
		>
			{/* ── TOP CARD ── */}
			<div
				className="absolute inset-x-0 top-0 overflow-hidden flex items-end justify-center bg-content rounded-t-xl border-b border-base-content/15"
				style={{ height: CARD_H }}
			>
				<span className="translate-y-1/2 text-4xl font-black leading-none tracking-widest text-content">
					{current}
				</span>
				<div className="absolute inset-0 bg-base-content/5" />
			</div>

			<div
				className="absolute inset-x-0 bottom-0 overflow-hidden flex items-start justify-center bg-content rounded-b-xl"
				style={{ height: CARD_H }}
			>
				<span className="-translate-y-1/2 text-4xl font-black leading-none tracking-widest text-content">
					{flipping === 'bottom' ? value : current}
				</span>
				<div className="absolute inset-0 bg-base-content/10" />
			</div>

			{flipping && (
				<div
					className="absolute inset-x-0 top-0 z-20 overflow-hidden origin-bottom rounded-t-xl"
					style={{
						height: CARD_H,
						transformStyle: 'preserve-3d',
						animation:
							flipping === 'top'
								? `flip-leaf ${FLIP_DURATION / 2}ms ease-in forwards`
								: undefined,
						transform:
							flipping === 'bottom' ? 'rotateX(-90deg)' : 'rotateX(0deg)',
					}}
				>
					<div
						className="absolute inset-0 flex items-end justify-center bg-content border-b border-base-content/15"
						style={{ backfaceVisibility: 'hidden' }}
					>
						<span className="translate-y-1/2 text-4xl font-black leading-none tracking-widest text-content">
							{flipping === 'top' ? previous : current}
						</span>
						<div className="absolute inset-0 bg-base-content/5" />
					</div>
				</div>
			)}

			<div
				className="absolute -left-0.5 bg-base-300 border border-base-content/20 z-40 rounded-r-sm"
				style={{ top: CARD_H - 5, height: GAP + 10, width: 6 }}
			/>
			<div
				className="absolute -right-0.5 bg-base-300 border border-base-content/20 z-40 rounded-l-sm"
				style={{ top: CARD_H - 5, height: GAP + 10, width: 6 }}
			/>
		</div>
	)
}

export function ClockFlip() {
	const { today } = useDate()
	const time = today.toDate()

	const rawH = time.getHours().toString().padStart(2, '0')
	const rawM = time.getMinutes().toString().padStart(2, '0')

	const hours = toPersianDigits(rawH)
	const minutes = toPersianDigits(rawM)

	return (
		<>
			<style>{`
				@keyframes flip-leaf {
					0%   { transform: rotateX(0deg); }
					100% { transform: rotateX(-90deg); }
				}
			`}</style>
			<div className="w-full h-full flex items-center justify-center gap-2 p-2 select-none overflow-hidden">
				<div dir="ltr" className="flex items-center gap-2">
					<FlipUnit value={hours} />
					<div className="flex flex-col gap-2 opacity-60">
						<div className="w-1.5 h-1.5 rounded-full bg-content" />
						<div className="w-1.5 h-1.5 rounded-full bg-content" />
					</div>
					<FlipUnit value={minutes} />
				</div>
			</div>
		</>
	)
}
