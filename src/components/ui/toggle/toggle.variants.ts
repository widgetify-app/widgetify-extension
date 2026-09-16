import { cva } from 'class-variance-authority'

export const toggleTrackVariants = cva(
	[
		'w-10',
		'h-6',
		'relative',
		'rounded-full',
		'transition-colors',
		'duration-200',
		'focus-visible:focus-ring',
	],
	{
		variants: {
			enabled: {
				true: ['bg-primary'],
				false: ['bg-raised'],
			},
			interactive: {
				true: ['cursor-pointer', 'active:scale-95'],
				false: ['cursor-not-allowed', 'opacity-(--disabled-opacity)'],
			},
		},
		defaultVariants: {
			enabled: false,
			interactive: true,
		},
	}
)

export const toggleThumbVariants = cva(
	[
		'absolute',
		'w-4',
		'h-4',
		'top-1',
		'left-1',
		'rounded-full',
		'bg-knob',
		'elevation-sm',
		'transition-transform',
		'duration-300',
		'ease-out',
	],
	{
		variants: {
			enabled: {
				true: ['translate-x-0'],
				false: ['translate-x-4'],
			},
			loading: {
				true: ['animate-bounce'],
				false: [],
			},
		},
		defaultVariants: {
			enabled: false,
			loading: false,
		},
	}
)

export type ToggleTrackVariant = typeof toggleTrackVariants
