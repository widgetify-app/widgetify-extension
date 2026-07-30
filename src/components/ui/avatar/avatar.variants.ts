import { cva } from 'class-variance-authority'

export const avatarVariants = cva(
	['rounded-full', 'overflow-hidden', 'flex', 'items-center', 'justify-center'],
	{
		variants: {
			size: {
				xs: ['w-6', 'h-6', 'text-xs'],
				sm: ['w-8', 'h-8', 'text-sm'],
				md: ['w-10', 'h-10', 'text-base'],
				lg: ['w-12', 'h-12', 'text-lg'],
				xl: ['w-16', 'h-16', 'text-xl'],
			},
		},
		defaultVariants: {
			size: 'md',
		},
	}
)

export type AvatarVariant = typeof avatarVariants
