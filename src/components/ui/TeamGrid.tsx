import type {Locale, Profile} from "@/content/types";
import {showEdgarProfile} from "@/lib/flags";
import {cn} from "@/lib/cn";
import {ProfileCard} from "./ProfileCard";

type Props = {
  profiles: Profile[];
  /** Overridable for tests; defaults to NEXT_PUBLIC_SHOW_EDGAR_PROFILE. */
  showEdgar?: boolean;
  /** Spanish pages tag English terms inside the bios (WCAG 3.1.2). */
  locale?: Locale;
};

/**
 * Lays out the team profiles and applies the Edgar Hintze feature flag.
 * Flag off: only Emilio's card, centered. Flag on: two cards of equal size.
 */
export function TeamGrid({
  profiles,
  showEdgar = showEdgarProfile,
  locale
}: Props) {
  const visible = showEdgar
    ? profiles
    : profiles.filter((profile) => profile.id !== "edgar");

  return (
    <div
      className={cn(
        "grid gap-6 lg:gap-8",
        visible.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-2xl"
      )}
      data-m="stagger"
    >
      {visible.map((profile) => (
        <ProfileCard key={profile.id} locale={locale} profile={profile} />
      ))}
    </div>
  );
}
