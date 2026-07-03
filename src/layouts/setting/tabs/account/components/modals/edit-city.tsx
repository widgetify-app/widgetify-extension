import Modal from '@/components/modal'
import { SelectCity } from '../../../general/components/select-city'
import { FooterButtons } from './footer-buttons'

interface Prop {
	show: boolean
	onClose: (type: 'success' | 'cancel') => void
	currentValue?: string
}
export function ChangeCityModal({ show, onClose }: Prop) {
	const onCloseHandler = () => {
		onClose('cancel')
	}

	const onClickSave = async () => {
		onClose('success')
	}

	const onCancel = () => {
		onClose('cancel')
	}

	return (
		<Modal
			isOpen={show}
			onClose={onCloseHandler}
			direction="rtl"
			showCloseButton={false}
		>
			<div className="flex flex-col justify-between h-40 gap-4">
				<div className="flex flex-col gap-2">
					<SelectCity size="xs" />
				</div>

				<FooterButtons
					isPending={false}
					handleCancel={onCancel}
					handleConfirm={onClickSave}
				/>
			</div>
		</Modal>
	)
}
