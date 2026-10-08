import { t } from '@/common/i18n'
import { Fragment, type ReactNode, useEffect, useId, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { Motion as motion } from '@/common/motion'
import { cn } from '@/common/utils/cn'
import { ScrollRow } from '@/components/ui'
import { useAuth } from '@/context/auth.context'

interface TabChild {
	label: string
	value: string
	icon: ReactNode
	element: ReactNode
	description?: string
	actions?: ReactNode
	isNew?: boolean
	needAuth?: boolean
}

export interface TabItem {
	parentName?: string
	needAuth?: boolean
	children?: TabChild[]
}

interface TabAction {
	label: string
	icon: ReactNode
	onClick: () => void
}

interface TabManagerProps {
	tabOwner: 'setting' | 'user' | 'widgets-settings' | 'market'
	tabs: TabItem[]
	defaultTab?: string
	selectedTab?: string | null
	onTabChange?: (tabValue: string) => void
	actions?: TabAction[]
}

export const TabManager = ({
	tabs,
	defaultTab,
	selectedTab,
	onTabChange,
	tabOwner,
	actions = [],
}: TabManagerProps) => {
	const { isAuthenticated } = useAuth()
	const [activeTab, setActiveTab] = useState(defaultTab || '')
	const headingId = useId()

	useEffect(() => {
		if (selectedTab) {
			setActiveTab(selectedTab)
			Analytics.event(`${tabOwner}_select_tab_${selectedTab}`)
		}
	}, [selectedTab])

	useEffect(() => {
		Analytics.event(`${tabOwner}_tab_change_${activeTab}`)
	}, [activeTab])

	const handleTabChange = (tabValue: string) => {
		setActiveTab(tabValue)
		if (onTabChange) {
			onTabChange(tabValue)
		}
	}

	const groups = tabs
		.filter((group) => !group.needAuth || isAuthenticated)
		.map((group) => ({
			...group,
			children: (group.children ?? []).filter(
				(child) => !child.needAuth || isAuthenticated
			),
		}))
		.filter((group) => group.children.length > 0)

	const allTabs = tabs.flatMap((group) => group.children ?? [])
	const active =
		allTabs.find((tab) => tab.value === activeTab) ??
		allTabs.find((tab) => tab.value === defaultTab) ??
		allTabs[0]

	return (
		<div className="flex gap-4 h-[calc(100dvh-6rem)] md:h-[min(80vh,850px,calc(100dvh-8rem))] max-md:flex-col">
			<nav
				aria-label={t('setting.tabManager.sectionsAria')}
				className="flex-col hidden w-48 gap-4 overflow-y-auto md:flex shrink-0 scrollbar-none"
			>
				{groups.map((group) => (
					<div key={group.parentName ?? group.children[0].value}>
						{group.parentName && (
							<div className="flex items-center gap-2 px-3.5 pb-1.5">
								<span className="text-xs font-medium text-fg-faint shrink-0">
									{group.parentName}
								</span>
								<span
									aria-hidden="true"
									className="flex-1 h-px bg-surface-3"
								/>
							</div>
						)}
						<ul className="flex flex-col gap-1">
							{group.children.map((tab) => (
								<li key={tab.value}>
									<NavItem
										icon={tab.icon}
										label={tab.label}
										isNew={tab.isNew}
										isActive={tab.value === active?.value}
										onClick={() => handleTabChange(tab.value)}
									/>
								</li>
							))}
						</ul>
					</div>
				))}

				{actions.length > 0 && (
					<ul className="flex flex-col gap-1 pt-3 mt-auto border-t border-surface-3">
						{actions.map((action) => (
							<li key={action.label}>
								<NavItem
									icon={action.icon}
									label={action.label}
									onClick={action.onClick}
								/>
							</li>
						))}
					</ul>
				)}
			</nav>

			<nav
				aria-label={t('setting.tabManager.sectionsAria')}
				className="md:hidden shrink-0"
			>
				<ScrollRow>
					{groups.map((group, index) => (
						<Fragment key={group.parentName ?? group.children[0].value}>
							{index > 0 && <RowDivider />}
							{group.children.map((tab) => (
								<NavItem
									key={tab.value}
									compact
									icon={tab.icon}
									label={tab.label}
									isNew={tab.isNew}
									isActive={tab.value === active?.value}
									onClick={() => handleTabChange(tab.value)}
								/>
							))}
						</Fragment>
					))}
					{actions.length > 0 && <RowDivider />}
					{actions.map((action) => (
						<NavItem
							key={action.label}
							compact
							icon={action.icon}
							label={action.label}
							onClick={action.onClick}
						/>
					))}
				</ScrollRow>
			</nav>

			{active && (
				<section
					aria-labelledby={headingId}
					className="flex flex-col flex-1 min-w-0 min-h-0"
				>
					<header className="flex items-start justify-between gap-3 pb-3 mb-3 border-b shrink-0 border-surface-3">
						<div className="min-w-0">
							<h2
								id={headingId}
								className="text-lg font-bold text-fg-strong"
							>
								{active.label}
							</h2>
							{active.description && (
								<p className="text-xs text-fg-muted">
									{active.description}
								</p>
							)}
						</div>
						{active.actions && (
							<div className="flex items-center gap-2 shrink-0">
								{active.actions}
							</div>
						)}
					</header>

					<div className="flex-1 min-h-0 overflow-hidden">
						<motion.div
							key={active.value}
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2 }}
							className="h-full pb-2 overflow-x-hidden overflow-y-auto pe-1"
						>
							{active.element}
						</motion.div>
					</div>
				</section>
			)}
		</div>
	)
}

interface NavItemProps {
	icon: ReactNode
	label: string
	onClick: () => void
	isActive?: boolean
	isNew?: boolean
	compact?: boolean
}

function NavItem({ icon, label, onClick, isActive, isNew, compact }: NavItemProps) {
	const buttonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (compact && isActive) {
			buttonRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
		}
	}, [compact, isActive])

	return (
		<button
			ref={buttonRef}
			type="button"
			onClick={onClick}
			aria-current={isActive ? 'page' : undefined}
			className={cn(
				'relative flex items-center gap-2.5 rounded-full text-sm cursor-pointer whitespace-nowrap transition-ui active:scale-98 focus-visible:focus-ring',
				compact ? 'px-3 py-2 shrink-0' : 'w-full px-3.5 py-2.5',
				isActive
					? 'font-semibold bg-brand-fill text-brand'
					: 'text-fg-muted hover:bg-surface-3'
			)}
		>
			<span className="relative grid shrink-0 place-items-center">
				{icon}
				{isNew && (
					<span className="absolute left-0 w-2 h-2 rounded-full -bottom-1 bg-danger animate-ping" />
				)}
			</span>
			<span className="flex-1 text-start">{label}</span>
		</button>
	)
}

function RowDivider() {
	return <span aria-hidden="true" className="w-px my-2 shrink-0 bg-surface-3" />
}
