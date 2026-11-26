import type {BusinessStage, InquiryType} from "@/lib/contact/types";

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
  /** One paragraph on Home, several on About. */
  bio: string | string[];
};

/** Source registry identifiers (section 9 of the brief). Never rendered as text. */
export type SourceId = "D1" | "D2" | "D3" | "D11";

export type TitledItem = {title: string; body: string};

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
    /** Accessible name of the phase track shown in the hero. */
    phasesLabel: string;
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

export type WhyLatinAmericaContent = {
  meta: PageMeta;
  hero: {
    title: string;
    paragraphs: string[];
    /** Headline figures shown in the hero; sourced as scale.sourceNote. */
    stats: {value: string; label: string}[];
  };
  scale: {
    heading: string;
    paragraphs: string[];
    sourceIds: SourceId[];
    sourceNote: string;
  };
  marketMeaning: {
    heading: string;
    items: TitledItem[];
  };
  investment: {
    heading: string;
    paragraphs: string[];
    sourceIds: SourceId[];
    sourceNote: string;
  };
  connectivity: {
    heading: string;
    /** The data sentence that carries the source marker. */
    stat: string;
    body: string;
    sourceIds: SourceId[];
    sourceNote: string;
  };
  examples: {
    heading: string;
    /** Editorial disclaimer published above the examples. */
    label: string;
    items: TitledItem[];
  };
  finalCta: {
    heading: string;
    body: string;
    cta: LinkContent;
  };
};

export type AboutContent = {
  meta: PageMeta;
  hero: {
    title: string;
    paragraphs: string[];
    /** Two-circle diagram in the hero: your business, Alva, and what they share. */
    diagram: {business: string; alva: string; shared: string};
  };
  together: {
    heading: string;
    items: TitledItem[];
  };
  partnership: {
    heading: string;
    body: string;
  };
  team: {
    heading: string;
    profiles: Profile[];
  };
  working: {
    heading: string;
    body: string;
    cta: LinkContent;
  };
};

/**
 * Published copy for the contact form. Field labels, options and hints are
 * verbatim from section 7 of the brief; UI microcopy (field errors, loading
 * labels, character counter) lives in messages/*.json instead.
 */
export type ContactFormContent = {
  heading: string;
  introduction: string;
  submit: string;
  success: string;
  error: string;
  /** The three parts render as one sentence with a localized Privacy Notice link. */
  privacyAcknowledgement: {
    before: string;
    linkLabel: string;
    after: string;
  };
  fields: {
    inquiryType: {
      label: string;
      options: Record<InquiryType, string>;
    };
    fullName: string;
    email: string;
    company: string;
    markets: {
      label: string;
      hint: string;
    };
    description: {
      label: string;
      hints: Record<InquiryType, string>;
    };
    website: string;
    role: string;
    country: string;
    stage: {
      label: string;
      options: Record<BusinessStage, string>;
    };
    referralSource: string;
  };
};

export type StartAConversationContent = {
  meta: PageMeta;
  hero: {
    title: string;
    paragraphs: string[];
  };
  form: ContactFormContent;
  next: {
    heading: string;
    body: string;
  };
  referral: {
    heading: string;
    body: string;
  };
};

export type SiteContent = {
  home: HomeContent;
  howWeWork: HowWeWorkContent;
  whyLatinAmerica: WhyLatinAmericaContent;
  about: AboutContent;
  startAConversation: StartAConversationContent;
};
