import Image from "next/image";

interface LogoProps {
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Theme-aware Harmonia Progrès logo.
 *
 * Renders both variants and switches them with the `dark:` variant so the
 * right contrast is used on light vs dark surfaces:
 * - white logo (`logo-transparent-dark.png`) on dark surfaces (dark theme)
 * - dark logo (`logo-transparent-light.png`) on light surfaces (light theme)
 *
 * Do NOT use inside always-dark sections (e.g. the hero): there the white
 * variant must stay fixed.
 */
export function Logo({
  alt = "Harmonia Progrès",
  className = "",
  width = 160,
  height = 44,
  priority,
}: LogoProps) {
  return (
    <>
      <Image
        src="/images/logo/logo-transparent-dark.png"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`${className} hidden dark:block`}
      />
      <Image
        src="/images/logo/logo-transparent-light.png"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`${className} block dark:hidden`}
      />
    </>
  );
}
