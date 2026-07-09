import { site } from "@/lib/nav";

export type LegalDoc = { slug: string; title: string; intro: string; sections: { h: string; p: string[] }[] };

export const LEGAL_UPDATED = "8 July 2026";

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    intro: `This policy explains how ${site.name} handles personal data collected through this website and our services.`,
    sections: [
      { h: "Who we are", p: [`${site.name} (Company No. ${site.companyNumber}), registered in England and Wales. You can contact us at ${site.email}.`] },
      { h: "What we collect", p: ["We collect information you provide through forms, such as your name, work email, company, and message. We also collect basic technical information needed to operate the website securely."] },
      { h: "How we use it", p: ["We use your information to respond to enquiries, arrange demonstrations, provide our services, and improve the website. We do not sell personal data."] },
      { h: "Lawful basis", p: ["We process personal data where we have a legitimate interest in responding to your enquiry, where you have given consent, or where processing is necessary to provide a service you have requested."] },
      { h: "Retention", p: ["We keep personal data only for as long as needed for the purposes described here, or as required to meet legal obligations."] },
      { h: "Your rights", p: [`Under UK data protection law you have rights over your personal data, including access, correction, and deletion. To exercise them, contact us at ${site.email}.`] },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    intro: `These terms apply to your use of the ${site.name} website.`,
    sections: [
      { h: "Use of the website", p: ["You may use this website for lawful purposes and in line with these terms. The content is provided for general information about our services."] },
      { h: "No warranty", p: ["Information on this website is provided in good faith. We do not guarantee that it is complete or up to date, and it should not be relied on as legal, financial, or professional advice."] },
      { h: "Intellectual property", p: [`The content and branding on this website belong to ${site.name} unless stated otherwise.`] },
      { h: "Contact", p: [`Questions about these terms can be sent to ${site.email}.`] },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    intro: "This policy explains how this website uses cookies and similar technologies.",
    sections: [
      { h: "What cookies are", p: ["Cookies are small files stored on your device that help websites function and understand how they are used."] },
      { h: "How we use them", p: ["We use cookies that are necessary for the website to work, and, where applicable, cookies that help us understand how the site is used so we can improve it."] },
      { h: "Managing cookies", p: ["You can control cookies through your browser settings. Blocking some cookies may affect how parts of the website work."] },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    intro: `${site.name} aims to make this website usable for as many people as possible.`,
    sections: [
      { h: "Our approach", p: ["We aim to follow good accessibility practice, including clear structure, readable contrast, keyboard support, and respect for reduced-motion preferences."] },
      { h: "Ongoing work", p: ["Accessibility is an ongoing effort, and we continue to improve the site over time."] },
      { h: "Feedback", p: [`If you experience any difficulty using this website, please contact us at ${site.email} and we will do our best to help.`] },
    ],
  },
  {
    slug: "gdpr",
    title: "Data Protection",
    intro: `This page summarises how ${site.name} approaches data protection.`,
    sections: [
      { h: "Our commitment", p: ["We handle personal data in line with UK data protection law, and we aim to be clear about what we collect and why."] },
      { h: "Your rights", p: ["You have rights over your personal data, including access, correction, deletion, and the right to object to certain processing."] },
      { h: "Contact", p: [`To make a data protection request or ask a question, contact us at ${site.email}.`] },
      { h: "More detail", p: ["For more detail on how we handle personal data, please see our Privacy Policy."] },
    ],
  },
];

export function getLegal(slug: string) {
  return legalDocs.find((d) => d.slug === slug);
}
