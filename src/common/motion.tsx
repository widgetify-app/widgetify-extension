import React, { type ReactNode } from 'react'
import {
	AnimatePresence,
	MotionConfig,
	motion,
	type HTMLMotionProps,
	type SVGMotionProps,
} from 'framer-motion'
import { useGeneralSetting } from '@/context/general-setting.context'

function cleanMotionProps<T extends object>(props: T): T {
	const {
		initial,
		animate,
		exit,
		variants,
		transition,
		whileHover,
		whileTap,
		whileDrag,
		whileFocus,
		whileInView,
		layout,
		layoutId,
		drag,
		dragConstraints,
		dragElastic,
		dragMomentum,
		onAnimationStart,
		onAnimationComplete,
		...rest
	} = props as any

	return {
		...rest,
		initial: false,
		transition: { duration: 0 },
	} as T
}

function createMotionComponent<P extends object>(Component: React.ComponentType<P>) {
	return React.forwardRef<any, P>((props, ref) => {
		const { isOptimalMode } = useGeneralSetting()

		return (
			<Component
				ref={ref}
				{...((isOptimalMode ? cleanMotionProps(props) : props) as P)}
			/>
		)
	})
}

export const Motion = {
	div: createMotionComponent<HTMLMotionProps<'div'>>(motion.div),

	span: createMotionComponent<HTMLMotionProps<'span'>>(motion.span),

	button: createMotionComponent<HTMLMotionProps<'button'>>(motion.button),

	img: createMotionComponent<HTMLMotionProps<'img'>>(motion.img),

	ul: createMotionComponent<HTMLMotionProps<'ul'>>(motion.ul),

	li: createMotionComponent<HTMLMotionProps<'li'>>(motion.li),

	svg: createMotionComponent<SVGMotionProps<SVGSVGElement>>(motion.svg),

	path: createMotionComponent<SVGMotionProps<SVGPathElement>>(motion.path),
}

export function Presence({
	children,
	...props
}: React.ComponentProps<typeof AnimatePresence>) {
	const { isOptimalMode } = useGeneralSetting()

	if (isOptimalMode) {
		return <>{children}</>
	}

	return <AnimatePresence {...props}>{children}</AnimatePresence>
}

export function MotionPreferences({ children }: { children: ReactNode }) {
	const { isOptimalMode } = useGeneralSetting()

	return (
		<MotionConfig reducedMotion={isOptimalMode ? 'always' : 'never'}>
			{children}
		</MotionConfig>
	)
}
