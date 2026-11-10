import {existsSync} from "node:fs";
import path from "node:path";
import Image from "next/image";
import {BRAND_ASSETS, BRAND_NAME} from "@/content/brand";
import {cn} from "@/lib/cn";

/**
 * Logo slot. If an approved logo exists at /public/brand/logo.svg it is used
 * automatically (rebuild after adding it); until then the component renders
 * the typographic wordmark "Alva". No symbol is invented.
 */
const hasLogoFile = existsSync(
  path.join(process.cwd(), "public", BRAND_ASSETS.logo)
);

type Props = {
  className?: string;
};

export function BrandLogo({className}: Props) {
  if (hasLogoFile) {
    return (
      <Image
        alt={BRAND_NAME}
        className={cn("h-7 w-auto", className)}
        height={32}
        src={BRAND_ASSETS.logo}
        unoptimized
        width={120}
      />
    );
  }

  return (
    <span
      className={cn(
        "text-[1.75rem] leading-none font-medium tracking-[-0.045em]",
        className
      )}
    >
      {BRAND_NAME}
    </span>
  );
}
