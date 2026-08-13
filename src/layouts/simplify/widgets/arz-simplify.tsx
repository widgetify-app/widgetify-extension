import { WigiArzLayout } from '@/layouts/widgets/wigi-arz/wigi_arz.layout'

export function ArzSimplify() {
	return (
		<div className="relative overflow-y-auto h-82 scrollbar-none">
			<WigiArzLayout inComboWidget enableBackground={false} />
		</div>
	)
}
