/* =========================================================================
   ALL SITE CONTENT LIVES HERE. Edit this file; the pages read from it.

   Every project and skill takes the same optional fields:
     year, tags[]          shown as small labels
     cover                 image used on the overview tile (falls back to the video poster)
     video                 { src, poster, w, h }  the main clip (plays inline, muted, looping)
                           or { type: "youtube", id: "..." }
     description[]         paragraphs. Leave out until written; nothing is shown in its place.
     role, tools, team     short strings for the facts list
     gallery[]             photos { src, w, h, caption? } and clips { video, poster, w, h, caption? }
     related[]             (skills) project slugs to link to
     featured              (projects) a double-width tile on the overview
   w and h are the pixel size of the file; they stop the page jumping while media loads.

   NOTE (2026-11-24): the FIRST Robotics media was sorted by what is visible in the footage
   (game pieces, the "March 5, 2024" post date, team number 8840 on the bumpers). Check that
   each clip sits under the right year, and that the skills pages borrow sensible clips.
   ========================================================================= */

window.SITE = {
  name: "Jacob Wilson",
  kicker: "Engineering · UTS, Sydney",
  email: "thejacobzwilson@gmail.com",
  github: "https://github.com/",          // TODO: your GitHub profile URL
  linkedin: "https://www.linkedin.com/",  // TODO: your LinkedIn profile URL
  headshot: "assets/headshot.jpg",        // missing file -> neutral placeholder
  // Home-page clips, played in order behind the Projects tile.
  heroClips: [
    {"src": "assets/projects/frc-2023/cube.mp4", "poster": "assets/projects/frc-2023/cube-1.jpg", "w": 1280, "h": 720},
    {"src": "assets/hero/workshop.mp4", "poster": "assets/hero/workshop-1.jpg", "w": 1280, "h": 720},
    {"src": "assets/projects/frc-2023/intake.mp4", "poster": "assets/projects/frc-2023/intake-1.jpg", "w": 916, "h": 522},
  ],
};

window.PROJECTS = [
  {
    slug: "frc-2022",
    title: "FIRST Robotics 2022",
    year: "2022",
    tags: ["Rapid React", "Team 8840"],
    video: {"src": "assets/projects/frc-2022/intake.mp4", "poster": "assets/projects/frc-2022/intake-2.jpg", "w": 524, "h": 912},
    cover: "assets/projects/frc-2022/build-3.jpg",
    gallery: [
      {"video": "assets/projects/frc-2022/build.mp4", "poster": "assets/projects/frc-2022/build-2.jpg", "w": 916, "h": 912},
      {"src": "assets/projects/frc-2022/build-1.jpg", "w": 916, "h": 912},
      {"src": "assets/projects/frc-2022/build-3.jpg", "w": 916, "h": 912},
      {"video": "assets/projects/frc-2022/drivetrain.mp4", "poster": "assets/projects/frc-2022/drivetrain-1.jpg", "w": 916, "h": 912},
      {"src": "assets/projects/frc-2022/intake-1.jpg", "w": 524, "h": 912},
      {"src": "assets/projects/frc-2022/intake-3.jpg", "w": 524, "h": 912},
    ],
  },
  {
    slug: "frc-2023",
    title: "FIRST Robotics 2023",
    year: "2023",
    tags: ["Charged Up", "Team 8840"],
    featured: true,
    video: {"src": "assets/projects/frc-2023/scoring.mp4", "poster": "assets/projects/frc-2023/scoring-3.jpg", "w": 740, "h": 912},
    cover: "assets/projects/frc-2023/cube-2.jpg",
    gallery: [
      {"video": "assets/projects/frc-2023/intake.mp4", "poster": "assets/projects/frc-2023/intake-1.jpg", "w": 916, "h": 522},
      {"video": "assets/projects/frc-2023/cube.mp4", "poster": "assets/projects/frc-2023/cube-1.jpg", "w": 1280, "h": 720},
      {"video": "assets/projects/frc-2023/arm.mp4", "poster": "assets/projects/frc-2023/arm-2.jpg", "w": 720, "h": 1280},
      {"src": "assets/projects/frc-2023/scoring-1.jpg", "w": 740, "h": 912},
      {"src": "assets/projects/frc-2023/scoring-2.jpg", "w": 740, "h": 912},
      {"src": "assets/projects/frc-2023/scoring-4.jpg", "w": 740, "h": 912},
      {"video": "assets/projects/frc-2023/arm-2.mp4", "poster": "assets/projects/frc-2023/arm-2-2.jpg", "w": 720, "h": 1280},
      {"video": "assets/projects/frc-2023/outreach.mp4", "poster": "assets/projects/frc-2023/outreach-2.jpg", "w": 896, "h": 482},
      {"src": "assets/projects/frc-2023/intake-2.jpg", "w": 842, "h": 522},
      {"src": "assets/projects/frc-2023/intake-3.jpg", "w": 916, "h": 522},
      {"video": "assets/projects/frc-2023/arm-3.mp4", "poster": "assets/projects/frc-2023/arm-3-1.jpg", "w": 720, "h": 1280},
    ],
  },
  {
    slug: "drone-guide",
    title: "Drone Guide",
    year: null,
    tags: [],
  },
  {
    slug: "frc-2024",
    title: "FIRST Robotics 2024",
    year: "2024",
    tags: ["Crescendo", "Team 8840"],
    video: {"src": "assets/projects/frc-2024/drive.mp4", "poster": "assets/projects/frc-2024/drive-2.jpg", "w": 740, "h": 912},
    cover: "assets/projects/frc-2024/drive-2.jpg",
    gallery: [
      {"src": "assets/projects/frc-2024/drive-1.jpg", "w": 740, "h": 912},
      {"src": "assets/projects/frc-2024/drive-3.jpg", "w": 740, "h": 912},
    ],
  },
  {
    slug: "unsw-water-pump",
    title: "UNSW Water Pump",
    year: null,
    tags: ["UNSW"],
  },
  {
    slug: "tradie-tech",
    title: "Tradie Tech",
    year: "2026",
    tags: ["Software"],
    description: ["A web app for tradespeople, built in a design sprint around one job: turning a customer's phone call into a booked job with one tap."],
  },
  {
    slug: "tri-filter",
    title: "Tri-Filter",
    year: null,
    tags: [],
  },
  {
    slug: "acacia-financial",
    title: "Acacia Financial",
    year: "2026",
    tags: ["Software"],
    description: ["A market-data collector and automated trading system for short-dated prediction markets, with its own passkey sign-in service and live dashboards."],
  },
  {
    slug: "d-sentry",
    title: "D-Sentry",
    year: "2026",
    tags: ["Mechanical", "Electronics"],
    description: ["A pan-and-tilt rig driven by stepper motors through planetary gearboxes, with flywheel motors run from an L298N driver and an Arduino CNC shield."],
  },
];

window.SKILLS = [
  {
    slug: "leadership",
    title: "Leadership",
    related: ["frc-2023", "frc-2024"],
    cover: "assets/projects/frc-2023/outreach-2.jpg",
    gallery: [
      {"video": "assets/projects/frc-2023/outreach.mp4", "poster": "assets/projects/frc-2023/outreach-2.jpg", "w": 896, "h": 482},
      {"video": "assets/skills/workshop.mp4", "poster": "assets/skills/workshop-2.jpg", "w": 916, "h": 522},
      {"src": "assets/skills/workshop-1.jpg", "w": 916, "h": 522},
      {"src": "assets/skills/workshop-3.jpg", "w": 916, "h": 522},
    ],
  },
  {
    slug: "mechanical",
    title: "Mechanical",
    related: ["frc-2023", "d-sentry"],
    cover: "assets/projects/frc-2023/arm-2.jpg",
    video: {"src": "assets/projects/frc-2023/arm.mp4", "poster": "assets/projects/frc-2023/arm-2.jpg", "w": 720, "h": 1280},
    gallery: [
      {"video": "assets/projects/frc-2023/arm-2.mp4", "poster": "assets/projects/frc-2023/arm-2-2.jpg", "w": 720, "h": 1280},
      {"video": "assets/projects/frc-2023/cube.mp4", "poster": "assets/projects/frc-2023/cube-1.jpg", "w": 1280, "h": 720},
    ],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    related: ["frc-2022", "frc-2023"],
    cover: "assets/skills/mill-2-3.jpg",
    video: {"src": "assets/skills/mill.mp4", "poster": "assets/skills/mill-2.jpg", "w": 720, "h": 1280},
    gallery: [
      {"video": "assets/skills/mill-2.mp4", "poster": "assets/skills/mill-2-2.jpg", "w": 916, "h": 912},
      {"video": "assets/skills/cnc-router.mp4", "poster": "assets/skills/cnc-router-2.jpg", "w": 720, "h": 1280},
      {"src": "assets/skills/mill-1.jpg", "w": 720, "h": 1280},
      {"src": "assets/skills/mill-3.jpg", "w": 720, "h": 1280},
      {"src": "assets/skills/cnc-router-1.jpg", "w": 720, "h": 1280},
      {"src": "assets/skills/cnc-router-3.jpg", "w": 720, "h": 1280},
    ],
  },
  {
    slug: "software",
    title: "Software",
    related: ["acacia-financial", "tradie-tech"],
  },
  {
    slug: "wiring",
    title: "Wiring",
    related: ["frc-2022", "d-sentry"],
    cover: "assets/projects/frc-2022/build-3.jpg",
    gallery: [
      {"video": "assets/projects/frc-2022/build.mp4", "poster": "assets/projects/frc-2022/build-3.jpg", "w": 916, "h": 912},
      {"src": "assets/projects/frc-2022/build-1.jpg", "w": 916, "h": 912},
      {"src": "assets/projects/frc-2022/build-3.jpg", "w": 916, "h": 912},
    ],
  },
];

/* Timeline, oldest first. kind: "move" (uses from/to) | "school" | "uni" | "milestone" */
window.HISTORY = [
  { when: "TBC", kind: "move",      from: "?", to: "?",       note: "" },
  { when: "TBC", kind: "school",    title: "High school",     place: "", note: "" },
  { when: "TBC", kind: "move",      from: "?", to: "?",       note: "" },
  { when: "TBC", kind: "milestone", title: "Graduation",      place: "", note: "" },
  { when: "TBC", kind: "uni",       title: "UNSW",            place: "Sydney", note: "" },
  { when: "TBC", kind: "uni",       title: "UTS",             place: "Sydney", note: "" },
];
