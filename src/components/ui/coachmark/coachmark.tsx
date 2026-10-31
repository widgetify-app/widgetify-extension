import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'

interface CoachmarkProps {
	title: string
	description: string
	image?: string
	step?: { current: number; count: number }
	children?: ReactNode
	actions: ReactNode
	className?: string
}

export function Coachmark({
	title,
	description,
	image,
	step,
	children,
	actions,
	className,
}: CoachmarkProps) {
	return (
		<section
			aria-label={title}
			className={cn(
				'relative flex flex-col gap-2.5 p-3 border shadow-xl w-82 max-w-full rounded-2xl border-line bg-surface',
				className
			)}
		>
			<span
				aria-hidden="true"
				className="absolute w-3 h-3 rotate-45 border-t border-l -top-1.75 start-10 border-line bg-surface"
			/>
			{image && (
				<img
					src={image}
					alt=""
					className="object-cover w-full aspect-5/2 rounded-xl"
				/>
			)}
			<div>
				<h2 className="text-sm font-bold text-fg-strong">{title}</h2>
				<p className="mt-0.5 text-xs leading-relaxed text-fg-muted">
					{description}
				</p>
			</div>
			<div className="flex items-center gap-1.5">
				{step && step.count > 1 && (
					<span aria-hidden="true" className="flex gap-1">
						{Array.from({ length: step.count }, (_, index) => (
							<span
								key={index}
								className={cn(
									'h-1.5 rounded-full',
									index === step.current
										? 'w-4 bg-brand'
										: 'w-1.5 bg-fill-2'
								)}
							/>
						))}
					</span>
				)}
				{children}
				<span className="flex-1" />
				{actions}
			</div>
		</section>
	)
}
