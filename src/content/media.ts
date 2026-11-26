import type {StaticImageData} from "next/image";
import mm1 from "../../public/images/cards/marketMeaning-1-9WbOh_pKouQ.jpg";
import mm2 from "../../public/images/cards/marketMeaning-2-M35xxKGb_tA.jpg";
import mm3 from "../../public/images/cards/marketMeaning-3-564b23YHayc.jpg";
import mm4 from "../../public/images/cards/marketMeaning-4-zIPj4oVYWnY.jpg";
import wp1 from "../../public/images/cards/whyPartner-1-KHQJf0Gq3RA.jpg";
import wp2 from "../../public/images/cards/whyPartner-2-d0_1CoAsDR0.jpg";
import wp3 from "../../public/images/cards/whyPartner-3-4kjtbC-wMHs.jpg";
import wp4 from "../../public/images/cards/whyPartner-4-Qx7A7SChpnI.jpg";

/**
 * Photos for the expanding cards, one per item and in the same order as the
 * copy, stored locally like the closing-panel photos (TeamPhotos). They are
 * decorative (the card text carries the meaning), so they render with an
 * empty alt. null keeps the brand-gradient fallback.
 *
 * Photos: Unsplash (Unsplash License), downloads registered through the API.
 *  whyPartner    1 Praise Judah (@pjayth3kreator) · 2 Jakub Żerdzicki (@jakubzerdzicki)
 *                3 Rodrigo Rodrigues (@wolfart32) · 4 Cherrydeck (@cherrydeck)
 *  marketMeaning 1 I'M ZION · 2 Creatopy · 3 MD Duran · 4 Alexis AMZ DA CRUZ
 *                (startup and tech-team scenes: the companies Alva works with)
 */
export const CARD_IMAGES: Record<"whyPartner" | "marketMeaning", (StaticImageData | null)[]> = {
  whyPartner: [wp1, wp2, wp3, wp4],
  marketMeaning: [mm1, mm2, mm3, mm4]
};
