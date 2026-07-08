/* ============================================================
   Curated stock photography (Unsplash), grouped by purpose.
   These are placeholders to be swapped for ESGen's own photography.
   Referenced by URL with a plain <img> (static export, unoptimized).
   Alt text is descriptive and contains no em dashes.
   ============================================================ */

export type Img = { src: string; alt: string };

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const images = {
  // hero / architecture
  heroBuilding: { src: U("photo-1486406146926-c627a92ad1ab"), alt: "A modern glass office building under a clear sky" },
  // office / team
  office: { src: U("photo-1497366754035-f200968a6e72"), alt: "A bright modern open plan office" },
  officeAlt: { src: U("photo-1524758631624-e2822e304c36"), alt: "A calm modern office interior" },
  conference: { src: U("photo-1497366811353-6870744d04b2"), alt: "A modern office meeting space" },
  team: { src: U("photo-1522071820081-009f0129c71c"), alt: "A team working together around a laptop" },
  meeting: { src: U("photo-1600880292203-757bb62b4baf"), alt: "Colleagues collaborating in a business meeting" },
  workspace: { src: U("photo-1497215728101-856f4ea42174"), alt: "A tidy modern workspace with a laptop" },
  workspaceAlt: { src: U("photo-1581091226825-a6a2a5aee158"), alt: "A person working on a laptop at a desk" },
  // industry / sustainability / nature
  industry: { src: U("photo-1518709268805-4e9042af9f23"), alt: "Industrial technology hardware lit in low light" },
  solar: { src: U("photo-1509391366360-2e959784a276"), alt: "Rows of solar panels under a bright sky" },
  wind: { src: U("photo-1466611653911-95081537e5b7"), alt: "Wind turbines on green hills generating clean energy" },
  forest: { src: U("photo-1441974231531-c6227db76b6e"), alt: "Sunlight through a green forest canopy" },
  landscape: { src: U("photo-1470071459604-3b5ec3a7fe05"), alt: "A misty green mountain landscape" },
  // dashboard / data
  dashboard: { src: U("photo-1551288049-bebda4e38f71"), alt: "An analytics dashboard shown on a laptop screen" },
  analytics: { src: U("photo-1460925895917-afdab827c52f"), alt: "Business analytics charts on a laptop" },
} satisfies Record<string, Img>;

/** Pick a contextual hero photo for a section (collection key). */
export function heroImageFor(key: string): Img {
  switch (key) {
    case "industries":
      return images.industry;
    case "solutions":
    case "partners":
      return images.meeting;
    case "platform":
    case "features":
    case "integrations":
    case "trust":
      return images.dashboard;
    case "compliance":
      return images.heroBuilding;
    case "company":
    case "careers":
      return images.office;
    case "customers":
      return images.team;
    case "knowledge":
    case "resources":
    case "docs":
      return images.workspace;
    default:
      return images.officeAlt;
  }
}
