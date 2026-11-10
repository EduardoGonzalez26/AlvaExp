import type {Profile} from "@/content/types";

type Props = {
  profile: Profile;
};

/**
 * Team profile card: name and approved bio only. By editorial rule there is
 * no descriptor under the name and no link, button or icon to a personal
 * profile.
 */
export function ProfileCard({profile}: Props) {
  return (
    <article className="flex h-full flex-col border border-alva-stone bg-alva-paper p-[clamp(1.75rem,3.5vw,3rem)]">
      <div aria-hidden="true" className="mb-6 h-0.5 w-10 bg-alva-green" />
      <h3 className="text-profile-name">{profile.name}</h3>
      <p className="mt-5 text-body text-pretty">{profile.bio}</p>
    </article>
  );
}
