import { memo, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@/layouts/widgets/calendar/utils'

const FLIP_DURATION = 400

/** Half-card height; scales with the widget cell via container query units. */
const flipSizeVars = {
	'--flip-h': 'min(16cqw, 40cqh)',
} as CSSProperties

interface FlipUnitProps {
	value: string
}

const FlipUnit = memo(function FlipUnit({ value }: FlipUnitProps) {
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

	return (
		<div
			className="relative select-none"
			style={{
				width: 'calc(var(--flip-h) * 2.3)',
				height: 'calc(var(--flip-h) * 2 + 2px)',
				perspective: 'calc(var(--flip-h) * 16)',
			}}
		>
			<div
				className="absolute inset-x-0 top-0 flex items-end justify-center overflow-hidden border-b bg-content bg-glass border-base-content/15"
				style={{
					height: 'var(--flip-h)',
					borderRadius:
						'calc(var(--flip-h) * 0.18) calc(var(--flip-h) * 0.18) 0 0',
				}}
			>
				<span
					className="font-black leading-none text-content"
					style={{
						transform: 'translateY(50%)',
						fontSize: 'calc(var(--flip-h) * 0.92)',
					}}
				>
					{current}
				</span>
			</div>

			<div
				className="absolute inset-x-0 bottom-0 flex items-start justify-center overflow-hidden bg-content bg-glass"
				style={{
					height: 'var(--flip-h)',
					borderRadius:
						'0 0 calc(var(--flip-h) * 0.18) calc(var(--flip-h) * 0.18)',
				}}
			>
				<span
					className="font-black leading-none text-content"
					style={{
						transform: 'translateY(-50%)',
						fontSize: 'calc(var(--flip-h) * 0.92)',
					}}
				>
					{flipping === 'bottom' ? previous : current}
				</span>
			</div>

			{flipping === 'top' && (
				<div
					className="absolute inset-x-0 top-0 z-20 overflow-hidden origin-bottom"
					style={{
						height: 'var(--flip-h)',
						transformStyle: 'preserve-3d',
						willChange: 'transform',
						borderRadius:
							'calc(var(--flip-h) * 0.18) calc(var(--flip-h) * 0.18) 0 0',
						animation: `flip-fold-down ${FLIP_DURATION / 2}ms ease-in forwards`,
					}}
				>
					<div
						className="absolute inset-0 flex items-end justify-center border-b bg-content border-base-content/15"
						style={{ backfaceVisibility: 'hidden' }}
					>
						<span
							className="font-black leading-none text-content"
							style={{
								transform: 'translateY(50%)',
								fontSize: 'calc(var(--flip-h) * 0.92)',
							}}
						>
							{previous}
						</span>
						<div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-content/20" />
					</div>
				</div>
			)}

			{flipping === 'bottom' && (
				<div
					className="absolute inset-x-0 bottom-0 z-20 overflow-hidden origin-top"
					style={{
						height: 'var(--flip-h)',
						transformStyle: 'preserve-3d',
						willChange: 'transform',
						borderRadius:
							'0 0 calc(var(--flip-h) * 0.18) calc(var(--flip-h) * 0.18)',
						animation: `flip-drop-down ${FLIP_DURATION / 2}ms ease-out forwards`,
					}}
				>
					<div
						className="absolute inset-0 flex items-start justify-center bg-content"
						style={{ backfaceVisibility: 'hidden' }}
					>
						<span
							className="font-black leading-none text-content"
							style={{
								transform: 'translateY(-50%)',
								fontSize: 'calc(var(--flip-h) * 0.92)',
							}}
						>
							{value}
						</span>
						<div className="absolute inset-0 bg-gradient-to-b from-base-content/25 to-transparent" />
					</div>
				</div>
			)}

			<div
				className="absolute inset-x-0 z-30 bg-base-content/10"
				style={{ top: 'var(--flip-h)', height: 1, transform: 'translateY(-50%)' }}
			/>
			<div
				className="absolute z-40 border bg-base-300 border-base-content/20"
				style={{
					top: 'var(--flip-h)',
					left: 'calc(var(--flip-h) * -0.07)',
					width: 'calc(var(--flip-h) * 0.15)',
					height: 'calc(var(--flip-h) * 0.3)',
					transform: 'translateY(-50%)',
					borderRadius:
						'0 calc(var(--flip-h) * 0.06) calc(var(--flip-h) * 0.06) 0',
				}}
			/>
			<div
				className="absolute z-40 border bg-base-300 border-base-content/20"
				style={{
					top: 'var(--flip-h)',
					right: 'calc(var(--flip-h) * -0.07)',
					width: 'calc(var(--flip-h) * 0.15)',
					height: 'calc(var(--flip-h) * 0.3)',
					transform: 'translateY(-50%)',
					borderRadius:
						'calc(var(--flip-h) * 0.06) 0 0 calc(var(--flip-h) * 0.06)',
				}}
			/>
		</div>
	)
})

export function ClockFlip() {
	const { selected_timezone: timezone } = useGeneralSetting()
	const [now, setNow] = useState(() => getCurrentDate(timezone.value).toDate())

	useEffect(() => {
		const updateTime = () => {
			const next = getCurrentDate(timezone.value).toDate()
			setNow((prev) =>
				prev.getHours() === next.getHours() &&
				prev.getMinutes() === next.getMinutes()
					? prev
					: next
			)
		}

		updateTime()

		let timer: ReturnType<typeof setTimeout>
		const scheduleNextMinuteTick = () => {
			// Tick shortly after each minute boundary so the flip only runs when
			// the displayed value actually changes (a 1s interval re-rendered the
			// whole widget 60x per minute for the same visual output).
			const delay = 60_000 - (Date.now() % 60_000) + 100
			timer = setTimeout(() => {
				updateTime()
				scheduleNextMinuteTick()
			}, delay)
		}
		scheduleNextMinuteTick()

		return () => clearTimeout(timer)
	}, [timezone?.value])

	const hours = now.getHours().toString().padStart(2, '0')
	const minutes = now.getMinutes().toString().padStart(2, '0')

	return (
		<div
			dir="ltr"
			className="flex items-center justify-center w-full h-full overflow-hidden select-none"
			style={flipSizeVars}
		>
			<div
				className="flex items-center"
				style={{ gap: 'calc(var(--flip-h) * 0.24)' }}
			>
				<FlipUnit value={hours} />
				<div
					className="flex flex-col opacity-60"
					style={{ gap: 'calc(var(--flip-h) * 0.3)' }}
				>
					<span
						className="rounded-full bg-content"
						style={{
							width: 'calc(var(--flip-h) * 0.13)',
							height: 'calc(var(--flip-h) * 0.13)',
						}}
					/>
					<span
						className="rounded-full bg-content"
						style={{
							width: 'calc(var(--flip-h) * 0.13)',
							height: 'calc(var(--flip-h) * 0.13)',
						}}
					/>
				</div>
				<FlipUnit value={minutes} />
			</div>
		</div>
	)
}
