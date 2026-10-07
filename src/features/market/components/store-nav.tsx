import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { STORE_NAV } from '../constants'
import type { StoreView } from '../types'
import { WalletCard } from './wallet-card'

interface StoreNavProps {
	view: StoreView
	hasNew: StoreView[]
	onChange: (view: StoreView) => void
}

export function StoreNav({ view, hasNew, onChange }: StoreNavProps) {
	return (
		<nav
			aria-label="بخش‌های فروشگاه"
			className="flex flex-col justify-between gap-3 w-44 shrink-0 max-md:w-full max-md:flex-row max-md:items-center"
		>
			<ul className="flex flex-col gap-1 max-md:flex-row max-md:min-w-0 max-md:overflow-x-auto max-md:scrollbar-none">
				{STORE_NAV.map((item) => {
					const isActive = view === item.view
					return (
						<li key={item.view} className="shrink-0">
							<button
								type="button"
								onClick={() => onChange(item.view)}
								aria-current={isActive ? 'page' : undefined}
								className={cn(
									'relative flex items-center w-full gap-2.5 px-3.5 py-2.5 rounded-full text-sm cursor-pointer transition-ui active:scale-98 focus-visible:focus-ring',
									isActive
										? 'font-semibold bg-brand-fill text-brand'
										: 'text-fg-muted hover:bg-surface-3'
								)}
							>
								<Icon name={item.icon} size={20} />
								<span className="flex-1 text-start whitespace-nowrap">
									{item.label}
								</span>
								{hasNew.includes(item.view) && !isActive && (
									<span
										role="img"
										aria-label="تازه"
										className="rounded-full size-1.5 bg-danger"
									/>
								)}
							</button>
						</li>
					)
				})}
			</ul>
			<WalletCard selected={view === 'wallet'} onOpen={() => onChange('wallet')} />
		</nav>
	)
}
