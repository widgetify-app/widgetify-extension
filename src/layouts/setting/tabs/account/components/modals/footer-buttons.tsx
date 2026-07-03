import { Button } from '@/components/button/button'

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
				isPrimary={true}
				onClick={() => handleConfirm()}
				className="text-sm shadow-xs flex-2 rounded-xl shadow-primary/20"
			>
				{isPending ? 'در حال ذخیره...' : 'ذخیره'}
			</Button>
			<Button
				size="sm"
				type="button"
				onClick={() => handleCancel()}
				className="flex-1 text-sm font-medium border-none rounded-2xl bg-content"
			>
				انصراف
			</Button>
		</div>
	)
}
