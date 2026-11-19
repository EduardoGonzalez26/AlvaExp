import type {Locale, Profile} from "@/content/types";
import {LocalizedText} from "./LocalizedText";

type Props = {
  profile: Profile;
  /** Spanish pages tag English terms inside the bios (WCAG 3.1.2). */
  locale?: Locale;
};

/**
 * Team profile card: name and approved bio only. By editorial rule there is
 * no descriptor under the name and no link, button or icon to a personal
 * profile. About uses long bios, so the bio can hold several paragraphs.
 *
 * Visual: a blue card with the sage tab peeking behind it, as in the decks.
 * On hover the brand gradient fills it from top to bottom.
 */
export function ProfileCard({profile, locale}: Props) {
  const paragraphs = Array.isArray(profile.bio) ? profile.bio : [profile.bio];

  return (
    <div className="relative h-full pt-3">
      <div
        aria-hidden="true"
        className="absolute inset-x-4 top-0 h-8 rounded-t-xl bg-alva-sage md:right-1/3"
      />
      <article
        data-surface="dark"
        className="group fill-down relative flex h-full flex-col rounded-xl bg-alva-blue p-[clamp(1.75rem,3.5vw,3rem)] text-alva-paper"
      >
        <h3 className="text-profile-name">{profile.name}</h3>
        <div
          aria-hidden="true"
          className="mt-5 h-px w-16 bg-alva-stone transition-[width] duration-(--duration-fill) ease-(--ease-brand) group-hover:w-full"
        />
        <div className="mt-6 grid gap-5">
          {paragraphs.map((paragraph) => (
            <p className="text-body text-pretty" key={paragraph}>
              {locale ? (
                <LocalizedText locale={locale} text={paragraph} />
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
