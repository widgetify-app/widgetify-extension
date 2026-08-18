import { Button } from '@/components/ui'

interface Prop {
	handleConfirm: any
	handleCancel: any
	isPending: boolean
}
export function FooterButtons({ handleCancel, handleConfirm, isPending }: Prop) {
	return (
		<div className="flex gap-2">
			<Button
				size="sm"
				type="submit"
				disabled={isPending}
				variant={'primary'}
				rounded={'2xl'}
				onClick={() => handleConfirm()}
				className="text-sm flex-2 h-10"
			>
				{isPending ? 'در حال ذخیره...' : 'ذخیره'}
			</Button>
			<Button
				size="sm"
				type="button"
				onClick={() => handleCancel()}
				variant={'default'}
				rounded={'2xl'}
				className="flex-1 h-10"
			>
				انصراف
			</Button>
		</div>
	)
}
