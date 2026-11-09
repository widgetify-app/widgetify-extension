import { cn } from '@/common/utils/cn'
import {
	type BodyColor,
	type BodyRun,
	parseNotificationBody,
} from '@/common/utils/notification-body'

const COLOR_CLASS: Record<BodyColor, string> = {
	red: 'text-danger',
	green: 'text-success',
	blue: 'text-info',
	orange: 'text-warning',
	purple: 'text-brand',
	gray: 'text-fg-muted',
}

function Run({ run }: { run: BodyRun }) {
	const className = cn(
		run.bold && 'font-bold',
		run.italic && 'italic',
		run.underline && 'underline',
		run.color && COLOR_CLASS[run.color]
	)

	if (run.href) {
		return (
			<a
				href={run.href}
				target="_blank"
				rel="noopener noreferrer"
				className={cn('underline text-brand break-all', className)}
			>
				{run.text}
			</a>
		)
	}

	return <span className={className}>{run.text}</span>
}

function Runs({ runs }: { runs: BodyRun[] }) {
	return runs.map((run, index) => <Run key={index} run={run} />)
}

interface RichBodyProps {
	text: string
	className?: string
}

export function RichBody({ text, className }: RichBodyProps) {
	return (
		<div className={cn('whitespace-pre-wrap wrap-break-word', className)}>
			{parseNotificationBody(text).map((block, index) =>
				block.kind === 'paragraph' ? (
					<p key={index}>
						<Runs runs={block.runs} />
					</p>
				) : block.ordered ? (
					<ol key={index} className="list-decimal ps-5">
						{block.items.map((item, itemIndex) => (
							<li key={itemIndex}>
								<Runs runs={item} />
							</li>
						))}
					</ol>
				) : (
					<ul key={index} className="list-disc ps-5">
						{block.items.map((item, itemIndex) => (
							<li key={itemIndex}>
								<Runs runs={item} />
							</li>
						))}
					</ul>
				)
			)}
		</div>
	)
}
