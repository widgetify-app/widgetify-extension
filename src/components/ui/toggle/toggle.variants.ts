import { cva } from 'class-variance-authority'

export const toggleTrackVariants = cva(
	['w-10', 'h-6', 'relative', 'rounded-full', 'transition-colors', 'duration-200'],
	{
		variants: {
			enabled: {
				true: ['bg-primary'],
				false: ['bg-base-300'],
			},
			interactive: {
				true: ['cursor-pointer', 'active:scale-95'],
				false: ['cursor-not-allowed', 'opacity-70'],
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
		'bg-white',
		'shadow-sm',
		'transition-transform',
		'duration-300',
		'ease-out',
	],
	{
		variants: {
			// The track is LTR-fixed (a switch is not a directional control), so
			// these translate values are intentionally not logical properties.
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
