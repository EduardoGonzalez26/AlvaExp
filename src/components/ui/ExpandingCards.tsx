import Image, {type StaticImageData} from "next/image";
import type {Locale, TitledItem} from "@/content/types";
import {LocalizedText} from "./LocalizedText";

type Props = {
  items: TitledItem[];
  /** One photo path per item (see CARD_IMAGES); null keeps the brand fallback. */
  images?: (StaticImageData | null)[];
  /** Spanish pages tag English terms inside the copy (WCAG 3.1.2). */
  locale?: Locale;
};

/**
 * Titled items as a row of photo cards. With a mouse from 1024 px the hovered
 * (or keyboard-focused) card expands and reveals its text while the others
 * narrow; on touch and small screens they form a grid with all text shown.
 * The layout and transitions live in .expander (globals.css).
 */
export function ExpandingCards({items, images = [], locale}: Props) {
  const text = (value: string) =>
    locale ? <LocalizedText locale={locale} text={value} /> : value;

  return (
    <ul className="expander" data-m="stagger">
      {items.map((item, index) => {
        const image = images[index] ?? null;

        return (
          <li
            className="flex flex-col justify-between bg-alva-navy p-(--pad) text-alva-paper outline-offset-4 focus-visible:outline-2 focus-visible:outline-alva-green"
            key={item.title}
            tabIndex={0}
          >
            <div aria-hidden="true" className="absolute inset-0 -z-10">
              {image ? (
                <Image
                  alt=""
                  className="expander-media object-cover"
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 60vw, (min-width: 640px) 50vw, 100vw"
                  src={image}
                />
              ) : (
                <div className="expander-media absolute inset-0 bg-brand-gradient">
                  <div className="absolute inset-0 bg-lattice" />
                </div>
              )}
              {/* Keeps the text legible over any photo. */}
              <div className="absolute inset-0 bg-linear-to-t from-alva-navy/95 via-alva-navy/55 to-alva-navy/10" />
              <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-alva-navy/60 to-transparent" />
            </div>

            <div aria-hidden="true" className="flex items-center gap-3 font-mono text-eyebrow text-alva-stone">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-alva-stone/60" />
            </div>

            <div>
              <h3 className="expander-title max-w-[24ch] text-card-title text-balance">
                {text(item.title)}
              </h3>
              <div className="expander-reveal">
                <div className="overflow-hidden">
                  <p className="expander-body pt-4 text-body text-pretty text-alva-paper/90">
                    {text(item.body)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
