import React from 'react'
import { motion, type HTMLMotionProps, type SVGMotionProps } from 'framer-motion'
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

function createMotionComponent<T extends keyof typeof motion, P extends object>(
	Component: React.ComponentType<P>
) {
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
	div: createMotionComponent<'div', HTMLMotionProps<'div'>>(motion.div),

	span: createMotionComponent<'span', HTMLMotionProps<'span'>>(motion.span),

	button: createMotionComponent<'button', HTMLMotionProps<'button'>>(motion.button),

	img: createMotionComponent<'img', HTMLMotionProps<'img'>>(motion.img),

	ul: createMotionComponent<'ul', HTMLMotionProps<'ul'>>(motion.ul),

	li: createMotionComponent<'li', HTMLMotionProps<'li'>>(motion.li),

	svg: createMotionComponent<'svg', SVGMotionProps<SVGSVGElement>>(motion.svg),

	path: createMotionComponent<'path', SVGMotionProps<SVGPathElement>>(motion.path),
}

import { AnimatePresence } from 'framer-motion'

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
