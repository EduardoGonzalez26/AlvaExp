export type Locale = "en" | "es";

/** Internal (locale independent) route keys. Localized slugs live in i18n/routing.ts. */
export type RouteHref =
  | "/"
  | "/how-we-work"
  | "/why-latin-america"
  | "/about"
  | "/start-a-conversation"
  | "/privacy-notice"
  | "/cookie-policy";

export type PageMeta = {
  title: string;
  description: string;
};

/**
 * A call to action or link from the brief ("Label → Destination").
 * `label` is the visible text, `href` is the destination page.
 */
export type LinkContent = {
  label: string;
  href: RouteHref;
};

export type Profile = {
  id: "emilio" | "edgar";
  name: string;
  bio: string;
};

/** Source registry identifiers (section 9 of the brief). Never rendered as text. */
export type SourceId = "D1" | "D2" | "D3" | "D11";

type TitledItem = {title: string; body: string};

export type HomeContent = {
  meta: PageMeta;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    paragraphs: string[];
    formula: string;
    primaryCta: LinkContent;
    secondaryCta: LinkContent;
  };
  sharedVision: {
    heading: string;
    paragraphs: string[];
  };
  whyPartner: {
    heading: string;
    items: TitledItem[];
  };
  region: {
    heading: string;
    paragraphs: string[];
    /** Rendered verbatim; the markers for `sourceIds` follow it. */
    stat: string;
    sourceIds: SourceId[];
    sourceNote: string;
    link: LinkContent;
  };
  approach: {
    heading: string;
    items: TitledItem[];
    link: LinkContent;
  };
  relationships: {
    heading: string;
    paragraphs: string[];
  };
  team: {
    heading: string;
    profiles: Profile[];
    link: LinkContent;
  };
  finalCta: {
    heading: string;
    body: string;
    cta: LinkContent;
  };
};

export type PhaseId = "validate" | "build" | "scale";

export type StepContent = {
  number: string;
  name: string;
  paragraphs: string[];
};

export type PhaseContent = {
  id: PhaseId;
  /** Verbatim heading, for example "VALIDATE: Understand the opportunity". */
  heading: string;
  steps: StepContent[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type HowWeWorkContent = {
  meta: PageMeta;
  hero: {
    title: string;
    paragraphs: string[];
  };
  phases: PhaseContent[];
  connected: {
    heading: string;
    paragraphs: string[];
  };
  faq: {
    heading: string;
    items: FaqItem[];
  };
  finalCta: LinkContent;
};

export type SiteContent = {
  home: HomeContent;
  howWeWork: HowWeWorkContent;
};
