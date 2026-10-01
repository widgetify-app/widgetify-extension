import type React from 'react'

export enum PetTypes {
	DOG = 'dog',
	CHICKEN = 'chicken',
	CRAB = 'crab',
	FROG = 'frog',
	CAT = 'cat',
	OWL = 'owl',
	SHEEP = 'sheep',
	HEDGEHOG = 'hedgehog',
}

type PetSpecies =
	| 'dog'
	| 'chicken'
	| 'crab'
	| 'frog'
	| 'cat'
	| 'owl'
	| 'sheep'
	| 'hedgehog'

export type PetBackgroundId = 'none' | 'forest' | 'autumn' | 'beach' | (string & {})

export interface PetMeta {
	petType?: PetTypes
	petName?: string
	background?: PetBackgroundId
	backgroundMeta?: {
		image?: string | null
		groundOffsetPx?: number
	}
}

export interface PetBackground {
	id: PetBackgroundId
	label: string
	image: string | null
	groundOffsetPx: number
}

export interface PetHungerState {
	level: number
	lastHungerTick: number | null
}

interface PetOption {
	name: string
	type: PetSpecies
	hungryState: PetHungerState
}

export interface PetSettings {
	petType: PetTypes | null
	background: PetBackgroundId
	backgroundMeta?: {
		image?: string | null
		groundOffsetPx?: number
	}
	petOptions: Record<PetTypes, PetOption>
}

export enum PetSpeed {
	SLOW = 1,
	NORMAL = 1.8,
	FAST = 2.5,
	VERY_FAST = 3.5,
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
	sit?: string
	fly?: string
}

export interface PetFlight {
	cruiseMin: number
	cruiseMax: number
	bobAmplitude: number
	bobPeriodMs: number
	climbRate: number
	landRate: number
	diveRate: number
	diveSlope: number
}

interface PetRange {
	min: number
	max: number
}

export interface PetHop {
	distance: PetRange
	height: PetRange
	durationMs: number
	crouchMs: PetRange
}

export interface PetDimensions {
	size: number
	width: number
	walkSpeed: number
	runSpeed: number
	maxHeight: number
	flight?: PetFlight
	hop?: PetHop
	sidestep?: boolean
}

export type PetState =
	| 'sit-idle'
	| 'lie'
	| 'walk-right'
	| 'walk-left'
	| 'run-right'
	| 'run-left'
	| 'chase'
	| 'eat'

export interface PetSequence {
	next: Partial<Record<PetState, PetState[]>>
}

export interface PetAssets {
	collectibleIcon: React.ReactNode
	collectibleSize: number
	collectibleFallSpeed: number
}

export interface PetLogicProps {
	name: string
	animations: PetAnimations
	dimensions: PetDimensions
	sequence: PetSequence
	assets: PetAssets
	onCollectibleCollection: (collectedItemId: number) => void
	onLevelDownHungryState: () => void
	isHungry: boolean
}

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		pets: PetSettings
	}
}

declare module '@/common/utils/call-event' {
	interface EventName {
		updatedPetSettings: {
			instanceId?: string
			petName?: string
			petType: PetTypes
			background?: PetBackgroundId
		}
	}
}
