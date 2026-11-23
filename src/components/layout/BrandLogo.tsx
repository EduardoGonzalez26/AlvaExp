import Image from "next/image";
import {BRAND_ASSETS, BRAND_NAME} from "@/content/brand";
import {cn} from "@/lib/cn";

/**
 * Approved wordmark. `light` is the blue/green logo for paper and stone
 * surfaces; `dark` is the white logo for blue surfaces. Both assets are
 * canonical files in /public/brand.
 *
 * The declared width/height match the real ~3.48:1 ratio. They let the browser
 * reserve the correct space before the SVG loads, so the header, footer and CTA
 * panel do not shift. Display height is set in CSS; width follows the ratio.
 */
const LOGO_SOURCES = {
  light: BRAND_ASSETS.logo,
  dark: BRAND_ASSETS.logoDark
} as const;

const LOGO_SIZES = {
  default: "h-7",
  large: "h-8",
  xl: "h-10 sm:h-12",
  watermark: "h-[22vw] max-h-72"
} as const;

const LOGO_WIDTH = 348;
const LOGO_HEIGHT = 100;

type Props = {
  variant?: keyof typeof LOGO_SOURCES;
  /** `default` for the header, `large` for the closing CTA panel, `xl` for the footer. */
  size?: keyof typeof LOGO_SIZES;
  /** Above-the-fold logo (header): load eagerly with high priority. */
  priority?: boolean;
  className?: string;
};

export function BrandLogo({
  variant = "light",
  size = "default",
  priority = false,
  className
}: Props) {
  return (
    <Image
      alt={BRAND_NAME}
      className={cn("w-auto", LOGO_SIZES[size], className)}
      height={LOGO_HEIGHT}
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      src={LOGO_SOURCES[variant]}
      unoptimized
      width={LOGO_WIDTH}
    />
  );
}
