import type React from 'react'
import {
	parseRichText,
	type RichTextListItem,
	type RichTextListStyle,
	type RichTextRun,
} from '@/features/widgets/utils/rich-text'
import { cn } from '@/common/utils/cn'

const URL_PATTERN = /(https?:\/\/[^\s]+)/gi

const LIST_CLASSES: Record<RichTextListStyle, string> = {
	bullet: 'list-disc ps-4',
	number: 'list-decimal ps-4',
	check: 'list-none',
}

function Linkified({ text }: { text: string }) {
	return text.split(URL_PATTERN).map((part, index) =>
		index % 2 === 1 ? (
			<a
				key={index}
				href={part}
				target="_blank"
				rel="noopener noreferrer"
				className="text-brand underline break-all"
			>
				{part}
			</a>
		) : (
			part
		)
	)
}

function Runs({ runs }: { runs: RichTextRun[] }) {
	return runs.map((run, index) => {
		const content = <Linkified text={run.text} />
		if (run.bold && run.italic) {
			return (
				<strong key={index} className="italic">
					{content}
				</strong>
			)
		}
		if (run.bold) return <strong key={index}>{content}</strong>
		if (run.italic) return <em key={index}>{content}</em>
		return <span key={index}>{content}</span>
	})
}

interface ListItemProps {
	item: RichTextListItem
	checkPosition: number | null
	disabled: boolean
	onToggleItem?: (position: number) => void
}

function ListItem({ item, checkPosition, disabled, onToggleItem }: ListItemProps) {
	const content = (
		<span
			className={cn(
				checkPosition !== null && 'min-w-0 flex-1',
				item.checked && 'line-through text-fg-faint'
			)}
		>
			<Runs runs={item.runs} />
		</span>
	)
	if (checkPosition === null) return <li dir="auto">{content}</li>
	return (
		<li dir="auto">
			<label className="flex items-start gap-1.5 cursor-pointer">
				<input
					type="checkbox"
					checked={item.checked}
					disabled={disabled || !onToggleItem}
					onChange={() => onToggleItem?.(checkPosition)}
					className="mt-1 cursor-pointer accent-brand shrink-0"
				/>
				{content}
			</label>
		</li>
	)
}

interface RichTextProps {
	text: string
	disabled?: boolean
	onToggleItem?: (position: number) => void
}

export function RichText({ text, disabled = false, onToggleItem }: RichTextProps) {
	let checkCount = 0
	return (
		<div className="flex flex-col gap-1.5">
			{parseRichText(text).map((block, index) => {
				if (block.kind === 'paragraph') {
					return (
						<p key={index} dir="auto" className="whitespace-pre-wrap">
							<Runs runs={block.runs} />
						</p>
					)
				}
				const ListTag: React.ElementType = block.style === 'number' ? 'ol' : 'ul'
				return (
					<ListTag
						key={index}
						className={cn('space-y-0.5', LIST_CLASSES[block.style])}
					>
						{block.items.map((item, itemIndex) => (
							<ListItem
								key={itemIndex}
								item={item}
								checkPosition={
									block.style === 'check' ? checkCount++ : null
								}
								disabled={disabled}
								onToggleItem={onToggleItem}
							/>
						))}
					</ListTag>
				)
			})}
		</div>
	)
}
