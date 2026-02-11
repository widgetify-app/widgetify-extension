import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { SelectCity } from '../../../general/components/select-city'

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

				<div className="flex gap-2">
					<Button
						size="sm"
						type="submit"
						isPrimary={true}
						onClick={() => onClickSave()}
						className="text-sm shadow-xs flex-2 rounded-xl shadow-primary/20"
					>
						ذخیره
					</Button>
					<Button
						size="sm"
						type="button"
						onClick={onCancel}
						className="flex-1 text-sm font-medium border-none rounded-2xl bg-content"
					>
						انصراف
					</Button>
				</div>
			</div>
		</Modal>
	)
}
