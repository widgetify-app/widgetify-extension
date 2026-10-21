import { t } from '@/common/i18n'
import { Button, Portal, Spinner } from '@/components/ui'
import { Icon } from '@/icons'
import { useLayoutSync } from '../widgets.context'

const STATUS_TEXT = {
	saving: 'widgets.canvas.sync.saving',
	saved: 'widgets.canvas.sync.saved',
	failed: 'widgets.canvas.sync.failed',
} as const

export function LayoutSyncIndicator() {
	const layoutSync = useLayoutSync()
	if (!layoutSync || layoutSync.status === 'idle') return null

	const { status, retry } = layoutSync

	return (
		<Portal>
			<section
				aria-label={t('widgets.canvas.sync.aria')}
				aria-live="polite"
				className="fixed z-nav flex items-center gap-3 px-4 py-2 -translate-x-1/2 border shadow-xl bottom-20 left-1/2 rounded-widget bg-glass-surface-2 border-surface-3 max-w-[calc(100vw-2rem)]"
			>
				{status === 'saving' && <Spinner size="sm" />}
				{status === 'saved' && (
					<Icon name="check" size={16} className="text-success" />
				)}
				{status === 'failed' && (
					<Icon name="close" size={16} className="text-danger" />
				)}
				<span className="text-sm font-medium text-fg-strong whitespace-nowrap">
					{t(STATUS_TEXT[status])}
				</span>
				{status === 'failed' && (
					<Button
						size="sm"
						variant="ghost"
						className="shrink-0"
						onClick={retry}
					>
						{t('widgets.canvas.sync.retry')}
					</Button>
				)}
			</section>
		</Portal>
	)
}
