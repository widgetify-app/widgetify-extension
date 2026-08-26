import { WigiArzLayout } from '@/layouts/widgets/wigi-arz/wigi_arz.layout'

export function ArzSimplify() {
	return (
		<div className="relative overflow-y-auto h-full scrollbar-none">
			<WigiArzLayout inComboWidget enableBackground={false} />
		</div>
	)
}
