export type LayoutSyncStatus = 'idle' | 'saving' | 'saved' | 'failed'

type LayoutOnLoad = 'push-local' | 'take-server' | 'keep-local' | 'seed-server'

interface LayoutOnLoadInput {
	hasUnsyncedEdit: boolean
	hasLocalEdit: boolean
	serverWidgetCount: number
}

export function chooseLayoutOnLoad({
	hasUnsyncedEdit,
	hasLocalEdit,
	serverWidgetCount,
}: LayoutOnLoadInput): LayoutOnLoad {
	if (hasUnsyncedEdit) return 'push-local'
	if (serverWidgetCount === 0) return 'seed-server'
	if (hasLocalEdit) return 'keep-local'
	return 'take-server'
}
