import Image from "next/image";
import photoA from "../../../public/images/teams/pexels-6804081.jpg";
import photoB from "../../../public/images/teams/pexels-6804071.jpg";
import photoC from "../../../public/images/teams/pexels-7988742.jpg";

const PHOTOS = [photoA, photoB, photoC];

/**
 * Photographic backdrop for the closing panel: software teams at work, in a
 * slow crossfade with a gentle zoom (see .team-photo in globals.css). A blue
 * veil (blue on top, deeper navy below) keeps paper text above 6:1 on any
 * part of any photo. Decorative: aria-hidden, empty alt. With reduced motion
 * only the first photo is shown, still.
 *
 * Photos: Pexels (free to use, no attribution required), stored locally.
 */
export function TeamPhotos() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      {PHOTOS.map((photo, index) => (
        <div className="team-photo absolute inset-0" key={index}>
          <Image
            alt=""
            className="object-cover"
            fill
            placeholder="blur"
            quality={70}
            sizes="100vw"
            src={photo}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-alva-blue)_82%,transparent)_0%,color-mix(in_srgb,var(--color-alva-navy)_90%,transparent)_100%)]" />
    </div>
  );
}
