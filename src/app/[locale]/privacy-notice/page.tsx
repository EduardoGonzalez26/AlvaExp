import {
  generatePlaceholderMetadata,
  PlaceholderPage
} from "@/components/ui/PlaceholderPage";

/**
 * TEMPORARY (Phase 1): shows only the page name and a neutral notice, is
 * `noindex` and is excluded from the sitemap. Phase 2 replaces this file.
 */
type Props = {
  params: Promise<{locale: string}>;
};

export function generateMetadata(props: Props) {
  return generatePlaceholderMetadata(props, "privacyNotice");
}

export default function PrivacyNoticePage(props: Props) {
  return <PlaceholderPage name="privacyNotice" params={props.params} />;
}
