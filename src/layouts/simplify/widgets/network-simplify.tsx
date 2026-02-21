import { NetworkLayout } from '@/layouts/widgets/network/network.layout'

export function NetworkSimplify() {
	return (
		<div className="overflow-y-auto h-82 scrollbar-none">
			{/* <div className="w-full h-4">
					<MdSettings />
				</div> */}
			<NetworkLayout inComboWidget enableBackground={false} />
		</div>
	)
}
