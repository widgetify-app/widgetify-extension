import { Spinner } from '@/components/ui'

export function UploadLoading() {
	return (
		<div className="grid border-2 border-dashed aspect-video place-items-center rounded-2xl border-line bg-fill">
			<Spinner aria-hidden="true" />
		</div>
	)
}
