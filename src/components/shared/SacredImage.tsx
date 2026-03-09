import type { FamilyCode } from '../../types'
import { FAMILY_IMAGE_COLORS } from '../../data/familyImages'

interface SacredImageProps {
  src: string
  alt: string
  caption: string
  familyCode: FamilyCode
  size?: 'hero' | 'medium' | 'thumbnail'
  className?: string
}

const sizeClasses = {
  hero: 'max-w-[180px] sm:max-w-[280px] md:max-w-[320px] w-full',
  medium: 'max-w-[140px] sm:max-w-[180px] w-full',
  thumbnail: 'w-[60px] sm:w-[80px] md:w-[100px] shrink-0',
}

export default function SacredImage({
  src,
  alt,
  caption,
  familyCode,
  size = 'medium',
  className = '',
}: SacredImageProps) {
  const borderColor = FAMILY_IMAGE_COLORS[familyCode]
  const isThumbnail = size === 'thumbnail'

  return (
    <figure className={`flex flex-col items-center ${className}`}>
      <div
        className={`
          relative overflow-hidden rounded-lg bg-stone-900/80
          ${sizeClasses[size]}
          ${isThumbnail ? 'aspect-[3/4]' : ''}
        `}
        style={{
          boxShadow: `0 0 24px ${borderColor}40, 0 4px 12px rgba(0,0,0,0.4)`,
          border: `1px solid ${borderColor}50`,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-contain"
          style={{ maxHeight: isThumbnail ? undefined : '400px' }}
        />
      </div>
      <figcaption className="mt-2 text-xs sm:text-sm text-stone-500 italic text-center max-w-[200px]">
        {caption}
      </figcaption>
    </figure>
  )
}
