import { useEffect, useState } from 'react'
import { getCoverUrl, getFallbackCover } from '../utils/helpers'

export default function CoverImage({ coverId, title, className = '', size = 'M' }) {
  const [src, setSrc] = useState(() => getCoverUrl(coverId, size) || getFallbackCover())

  useEffect(() => {
    setSrc(getCoverUrl(coverId, size) || getFallbackCover())
  }, [coverId, size])

  return (
    <img
      src={src}
      alt={`${title} kitap kapağı`}
      loading="lazy"
      onError={() => setSrc(getFallbackCover())}
      className={`bg-sand object-cover ${className}`}
    />
  )
}
