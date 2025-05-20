export enum PetType {
	DOG = 'dog',
	CHICKEN = 'chicken',
}

export enum PetColor {
	WHITE = 'white',
	BROWN = 'brown',
	BLACK = 'black',
	AKITA = 'akita',
}

export enum PetSize {
	SMALL = 'small',
	MEDIUM = 'medium',
	LARGE = 'large',
}

export enum PetSpeed {
	STILL = 0,
	VERY_SLOW = 0.5,
	SLOW = 1,
	NORMAL = 1.8,
	FAST = 2.5,
	VERY_FAST = 3.5,
}

export enum PetState {
	IDLE = 'idle',
	WALK_LEFT = 'walk-left',
	WALK_RIGHT = 'walk-right',
	RUN_LEFT = 'run-left',
	RUN_RIGHT = 'run-right',
	SITTING = 'sit',
	STANDING = 'stand',
	CLIMBING = 'climb',
	SWIPE = 'swipe',
	CHASE = 'chase',
}

export enum PetBehavior {
	ROAMING = 'roaming',
	RESTING = 'resting',
	CLIMBING = 'climbing',
	CHASING = 'chasing',
}

export interface Position {
	x: number
	y: number
}

export interface CollectibleItem {
	id: number
	x: number
	y: number
	collected: boolean
	dropping: boolean
}

export interface PetAnimations {
	idle: string
	walk: string
	run: string
	swipe?: string
	climb?: string
	sit?: string
	stand?: string
}

export interface PetDimensions {
	size: number
	walkSpeed: number
	runSpeed: number
	climbSpeed: number
	maxHeight: number
}

export interface PetDurations {
	walk: { min: number; max: number }
	run: { min: number; max: number }
	rest: { min: number; max: number }
	climb: { min: number; max: number }
}

export interface PetAssets {
	collectibleIcon: React.ElementType
	collectibleSize: number
	collectibleFallSpeed: number
	collectibleColor?: string
}
