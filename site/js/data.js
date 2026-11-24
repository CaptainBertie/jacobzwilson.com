/* =========================================================================
   ALL SITE CONTENT LIVES HERE. Edit this file; the pages read from it.

   Media: drop files in site/assets/... and reference them by path.
   - video:   { type: "file", src: "assets/projects/d-sentry/demo.mp4", poster: "assets/projects/d-sentry/poster.jpg" }
              { type: "youtube", id: "dQw4w9WgXcQ" }
              null  -> no video block is shown
   - gallery: [{ src: "assets/projects/d-sentry/01.jpg", caption: "Pan gearbox, first print" }, ...]
              []    -> placeholder figures are shown until you add photos
   - description: array of paragraphs. null -> a DRAFT placeholder is shown.
   - layout:  "cinema" | "split" | "bento" | "story" | "classic"  (the drawing's page layout)
   - role, tools: optional strings shown in the facts panel
   - sections (story layout): [{ heading: "The problem", text: "..." }, ...]
   ========================================================================= */

window.SITE = {
  name: "Jacob Wilson",
  kicker: "Engineering student · UTS, Sydney",
  email: "thejacobzwilson@gmail.com",
  github: "https://github.com/",          // TODO: your GitHub profile URL
  linkedin: "https://www.linkedin.com/",  // TODO: your LinkedIn profile URL
  headshot: "assets/headshot.jpg",        // missing file -> placeholder
  heroVideo: null,                        // e.g. { src: "assets/hero.mp4", poster: "assets/hero.jpg" }
};

window.PROJECTS = [
  { slug: "frc-2022", layout: "cinema", title: "FIRST Robotics 2022", year: "2022", tags: ["Team build", "FRC"],
    video: null, description: null, gallery: [] },
  { slug: "frc-2023", layout: "bento", title: "FIRST Robotics 2023", year: "2023", tags: ["Team build", "FRC"],
    video: null, description: null, gallery: [] },
  { slug: "drone-guide", layout: "split", title: "Drone Guide", year: null, tags: [],
    video: null, description: null, gallery: [] },
  { slug: "frc-2024", layout: "story", title: "FIRST Robotics 2024", year: "2024", tags: ["Team build", "FRC"],
    video: null, description: null, gallery: [] },
  { slug: "unsw-water-pump", layout: "split", title: "UNSW Water Pump", year: null, tags: ["UNSW"],
    video: null, description: null, gallery: [] },
  { slug: "tradie-tech", layout: "cinema", title: "Tradie Tech", year: "2026", tags: ["Software", "Product"],
    video: null,
    description: [
      "A web app for tradespeople, built in a design sprint around one job: turning a customer's phone call into a booked job with one tap.",
    ],
    gallery: [] },
  { slug: "tri-filter", layout: "bento", title: "Tri-Filter", year: null, tags: [],
    video: null, description: null, gallery: [] },
  { slug: "acacia-financial", layout: "story", title: "Acacia Financial", year: "2026", tags: ["Software", "Data"],
    video: null,
    description: [
      "A market-data collector and automated trading system for short-dated prediction markets, with its own passkey sign-in service and live dashboards.",
    ],
    gallery: [] },
  { slug: "d-sentry", layout: "split", title: "D-Sentry", year: "2026", tags: ["Mechanical", "Electronics"],
    video: null,
    description: [
      "A pan-and-tilt rig driven by stepper motors through planetary gearboxes, with flywheel motors run from an L298N driver and an Arduino CNC shield.",
    ],
    gallery: [] },
];

/* related: project slugs that show this skill (rendered as links to the project drawing) */
window.SKILLS = [
  { slug: "leadership", title: "Leadership", tags: [], description: null, related: [], gallery: [] },
  { slug: "mechanical", title: "Mechanical", tags: [], description: null, related: ["d-sentry"], gallery: [] },
  { slug: "manufacturing", title: "Manufacturing", tags: [], description: null, related: [], gallery: [] },
  { slug: "software", title: "Software", tags: [], description: null, related: ["acacia-financial", "tradie-tech"], gallery: [] },
  { slug: "wiring", title: "Wiring", tags: [], description: null, related: ["d-sentry"], gallery: [] },
];

/* Timeline, oldest first. kind: "move" | "school" | "uni" | "milestone" */
window.HISTORY = [
  { when: "TBC", kind: "move",      title: "Moved",                  from: "?", to: "?",      note: "" },
  { when: "TBC", kind: "school",    title: "High school",            place: "School name",   note: "" },
  { when: "TBC", kind: "move",      title: "Moved",                  from: "?", to: "?",      note: "" },
  { when: "TBC", kind: "milestone", title: "Graduation",             place: "",              note: "" },
  { when: "TBC", kind: "uni",       title: "UNSW",                   place: "Sydney",        note: "" },
  { when: "TBC", kind: "uni",       title: "UTS",                    place: "Sydney",        note: "" },
];
