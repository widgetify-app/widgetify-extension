import type { NotificationItem } from '@/services/hooks/extension/getWigiPadData.hook'

interface NotificationItemProps extends NotificationItem {}

interface Prop {
	link: string | undefined
	className: string
	children: React.ReactNode
}
function Wrapper({ link, children, className }: Prop) {
	if (link) {
		return (
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				className={className}
			>
				{children}
			</a>
		)
	}

	return <div className={className}>{children}</div>
}

export function NotificationCardItem({
	title,
	subTitle,
	description,
	link,
	icon,
}: NotificationItemProps) {
	return (
		<Wrapper
			link={link}
			className={`flex gap-2 p-2 transition-all duration-300 border rounded-lg ${link && 'cursor-pointer'} bg-base-300/70 hover:bg-base-300 border-base-300/70 active:scale-98`}
		>
			{icon && (
				<div className="pt-0.5">
					<img src={icon} alt="Gmail" className="w-4 h-4" />
				</div>
			)}

			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between">
					<h4 className="text-[13px] font-medium truncate text-content">
						{title}
					</h4>
				</div>
				<p className="mt-0.5 text-xs text-muted font-bold">{subTitle}</p>
				<p className="mt-1 text-xs font-light line-clamp-2 opacity-80">
					{description}
				</p>
			</div>
		</Wrapper>
	)
}
