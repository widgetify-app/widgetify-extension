import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

interface Thumb {
	sky: string
	sun: string
	hill: string
	isPro: boolean
}

const PALETTE: Omit<Thumb, 'isPro'>[] = [
	{ sky: '#ffe3c2', sun: '#ff9b54', hill: '#e07a5f' },
	{ sky: '#cdeafe', sun: '#ffffff', hill: '#4f9d69' },
	{ sky: '#22264b', sun: '#f5e6a8', hill: '#3b3f7a' },
	{ sky: '#fad4e4', sun: '#ffffff', hill: '#d16ba5' },
	{ sky: '#d8f3ee', sun: '#ffd166', hill: '#2a9d8f' },
	{ sky: '#e9e5ff', sun: '#ffffff', hill: '#7d74f0' },
	{ sky: '#1f3b2e', sun: '#e9f5db', hill: '#4c956c' },
	{ sky: '#fff4d6', sun: '#f4a261', hill: '#264653' },
]

const TOP_ROW: Thumb[] = PALETTE.map((colors, index) => ({
	...colors,
	isPro: [1, 2, 4, 6].includes(index),
}))

const BOTTOM_ROW: Thumb[] = [4, 2, 7, 1, 5, 0, 6, 3].map((from, index) => ({
	...PALETTE[from],
	isPro: index % 2 === 0,
}))

const MASK_CLASS =
	'[mask-image:linear-gradient(90deg,transparent_0,black_14%,black_86%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0,black_14%,black_86%,transparent_100%)]'

function Row({ thumbs, reverse }: { thumbs: Thumb[]; reverse?: boolean }) {
	return (
		<div dir="ltr" className="overflow-hidden">
			<div
				className={cn(
					'flex w-max',
					reverse ? 'animate-pro-marquee-reverse' : 'animate-pro-marquee'
				)}
			>
				{[...thumbs, ...thumbs].map((thumb, index) => (
					<span
						key={index}
						style={{ background: thumb.sky }}
						className="relative overflow-hidden shadow-md shrink-0 w-21.5 h-14.5 mr-2.5 rounded-xl"
					>
						<span
							style={{ background: thumb.sun }}
							className="absolute rounded-full top-2.25 right-3 size-3.25"
						/>
						<span
							style={{ background: thumb.hill }}
							className="absolute rounded-full -left-3.5 -right-3.5 -bottom-6 h-11.5"
						/>
						{thumb.isPro && (
							<span className="absolute grid rounded-full top-1.5 left-1.5 size-5 place-items-center bg-image-fg text-vip">
								<Icon name="diamond" size={10} />
							</span>
						)}
					</span>
				))}
			</div>
		</div>
	)
}

export function GalleryDemo() {
	return (
		<div
			className={cn(
				'absolute inset-0 flex flex-col justify-center gap-2.5',
				MASK_CLASS
			)}
		>
			<Row thumbs={TOP_ROW} />
			<Row thumbs={BOTTOM_ROW} reverse />
		</div>
	)
}
