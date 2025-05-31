interface PetFoodProps {
  size?: number
  className?: string
  src: string
}

export const PetFood = (props: PetFoodProps) => {
  const { size, className, src } = props

  return (
    <img
      src={src}
      alt="Pet Food"
      style={{
        width: size ? `${size}px` : '100%',
        height: size ? `${size}px` : '100%',
        objectFit: 'contain',
      }}
      className={className}
    />
  )
}
