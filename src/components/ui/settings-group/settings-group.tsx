import type { ReactNode } from 'react'

interface SettingsGroupProps {
	title: string
	children: ReactNode
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
	return (
		<section className="flex flex-col gap-2">
			<h3 className="px-1 text-xs font-bold text-fg-muted">{title}</h3>
			<div className="flex flex-col p-1 border rounded-2xl bg-surface-2 border-surface-3">
				{children}
			</div>
		</section>
	)
}

interface SettingRowProps {
	label: string
	hint?: string
	children: ReactNode
}

export function SettingRow({ label, hint, children }: SettingRowProps) {
	return (
		<div className="flex items-center gap-3 px-3 py-3 min-h-14">
			<div className="flex flex-col flex-1 min-w-0 gap-0.5">
				<p className="text-sm font-medium text-fg-strong leading-control">
					{label}
				</p>
				{hint && (
					<p className="text-xs font-light leading-relaxed text-fg-muted">
						{hint}
					</p>
				)}
			</div>
			{children}
		</div>
	)
}
