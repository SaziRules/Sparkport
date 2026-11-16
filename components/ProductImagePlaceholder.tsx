import Image from 'next/image';

interface Props {
  name: string;
  /** Visual density. `md` for grid cards, `sm` for list rows/related, `xs` for tiny thumbnails, `lg` for hero. */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Light-hearted fallback for products that ship without a photo.
 * Branded teal backdrop (/images/med.jpg) with a playful headline.
 * No product name is shown — surrounding card already handles that.
 */
export default function ProductImagePlaceholder({ name, size = 'md', className = '' }: Props) {
  const text = {
    xs: { eyebrow: 'hidden',        headline: 'text-xs',   caption: 'hidden' },
    sm: { eyebrow: 'text-[8px]',    headline: 'text-xl',   caption: 'text-[8px]' },
    md: { eyebrow: 'text-[10px]',   headline: 'text-3xl',  caption: 'text-[9px]' },
    lg: { eyebrow: 'text-xs',       headline: 'text-6xl',  caption: 'text-xs' },
  }[size];

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      role="img"
      aria-label={`${name} — no image available`}
    >
      {/* Backdrop — object-position cropped so the image's own "MEDICAL" wordmark (bottom-left) is off-frame. */}
      <div className="absolute inset-0" style={{ transform: 'scale(1.25)', transformOrigin: 'center top' }}>
        <Image
          src="/images/med.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover object-[75%_20%]"
          aria-hidden="true"
        />
      </div>

      {/* Dark wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(24,67,99,0.95) 0%, rgba(24,67,99,0.7) 45%, rgba(24,67,99,0.35) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
        {size !== 'xs' && (
          <p className={`${text.eyebrow} font-bold uppercase tracking-[0.4em] text-[#7fd4e0] mb-1.5`}>
            Oops
          </p>
        )}
        <p
          className={`${text.headline} uppercase text-white leading-[0.95] drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]`}
          style={{ fontFamily: 'var(--font-display), "Arial Black", sans-serif', letterSpacing: '-0.01em' }}
        >
          {size === 'xs' ? 'Shy' : 'Camera Shy'}
        </p>
        {size !== 'xs' && (
          <p className={`${text.caption} font-semibold uppercase tracking-[0.3em] text-white/70 mt-3`}>
            But still a crowd favourite
          </p>
        )}
      </div>
    </div>
  );
}
