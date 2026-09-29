import { cva } from 'class-variance-authority'

export const alertVariants = cva(
	'flex items-start gap-2 px-3 py-2.5 text-xs leading-body text-right border rounded-xl',
	{
		variants: {
			tone: {
				danger: 'bg-danger-fill border-danger-fill-2 text-danger',
				warning: 'bg-warning-fill border-warning-fill-2 text-warning',
				info: 'bg-info-fill border-info-fill-2 text-info',
			},
		},
	}
)
