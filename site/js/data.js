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
  // Public read-only feed for the Acacia live panel (Railway service `publicFeed` in the
  // acacia project). Empty -> the panel is left out and the page shows text only.
  acaciaFeed: "https://publicfeed-production.up.railway.app/v1/acacia",
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
    video: {"src": "assets/projects/frc-2022/curated/montage.mp4", "poster": "assets/projects/frc-2022/curated/montage-poster.jpg", "w": 720, "h": 720},
    cover: "assets/projects/frc-2022/curated/bento-cover.webp",
    gallery: [
      {"src": "assets/projects/frc-2022/curated/still-robot.jpg", "w": 736, "h": 880},
      {"src": "assets/projects/frc-2022/curated/still-drive-test.jpg", "w": 870, "h": 870},
      {"video": "assets/projects/frc-2022/curated/clip-intake-test.mp4", "poster": "assets/projects/frc-2022/curated/clip-intake-test-poster.jpg", "w": 720, "h": 720},
      {"src": "assets/projects/frc-2022/curated/still-intake.jpg", "w": 512, "h": 860},
      {"src": "assets/projects/frc-2022/curated/still-field.jpg", "w": 1560, "h": 668},
      {"src": "assets/projects/frc-2022/curated/still-award.jpg", "w": 1600, "h": 1000},
    ],
  },
  {
    slug: "frc-2023",
    title: "FIRST Robotics 2023",
    year: "2023",
    tags: ["Charged Up", "Team 8840"],
    featured: true,
    video: {"src": "assets/projects/frc-2023/curated/bay-robotics-hero.mp4", "poster": "assets/projects/frc-2023/curated/bay-robotics-hero-poster.jpg", "w": 1280, "h": 720},
    cover: "assets/projects/frc-2023/curated/bento-cover.webp",
    gallery: [
      {"src": "assets/projects/frc-2023/curated/team-shirts.jpg", "w": 1600, "h": 1200},
      {"src": "assets/projects/frc-2023/curated/match-field.jpg", "w": 1280, "h": 720},
      {"video": "assets/projects/frc-2023/curated/scoring-practice.mp4", "poster": "assets/projects/frc-2023/curated/scoring-practice-poster.jpg", "w": 864, "h": 1080},
      {"src": "assets/projects/frc-2023/curated/robot-driver.jpg", "w": 900, "h": 1600},
      {"src": "assets/projects/frc-2023/curated/swerve-chassis.jpg", "w": 1200, "h": 1600},
      {"video": "assets/projects/frc-2023/curated/swerve-drivebase.mp4", "poster": "assets/projects/frc-2023/curated/swerve-drivebase-poster.jpg", "w": 864, "h": 1080},
      {"src": "assets/projects/frc-2023/curated/practice-field.jpg", "w": 1280, "h": 1600},
      {"src": "assets/projects/frc-2023/curated/pit-arm.jpg", "w": 1280, "h": 720},
      {"video": "assets/projects/frc-2023/curated/machining.mp4", "poster": "assets/projects/frc-2023/curated/machining-poster.jpg", "w": 864, "h": 1080},
      {"src": "assets/projects/frc-2023/curated/team-arm.jpg", "w": 1200, "h": 1600},
    ],
  },
  {
    slug: "frc-2024",
    title: "FIRST Robotics 2024",
    year: "2024",
    tags: ["Crescendo", "Team 8840"],
    video: {"src": "assets/projects/frc-2024/curated/montage.mp4", "poster": "assets/projects/frc-2024/curated/montage-poster.jpg", "w": 960, "h": 960},
    split: true,
    cover: "assets/projects/frc-2024/curated/bento-cover.webp",
    gallery: [
      {"src": "assets/projects/frc-2024/curated/endgame-climb.jpg", "w": 1600, "h": 900},
      {"src": "assets/projects/frc-2024/curated/team-awards.jpg", "w": 1600, "h": 1200},
      {"video": "assets/projects/frc-2024/curated/climb-test.mp4", "poster": "assets/projects/frc-2024/curated/climb-test-poster.jpg", "w": 960, "h": 960},
      {"video": "assets/projects/frc-2024/curated/shooter-test.mp4", "poster": "assets/projects/frc-2024/curated/shooter-test-poster.jpg", "w": 960, "h": 960},
      {"src": "assets/projects/frc-2024/curated/houston-pit.jpg", "w": 848, "h": 480},
      {"src": "assets/projects/frc-2024/curated/houston-arena.jpg", "w": 1600, "h": 1200},
      {"src": "assets/projects/frc-2024/curated/einstein-setup.jpg", "w": 900, "h": 1600},
    ],
  },
  {
    slug: "drone-guide",
    title: "Drone Guide",
    year: null,
    tags: [],
    cover: "assets/projects/drone-guide/ai-3.jpg",
    hero: [
      {"src": "assets/projects/drone-guide/ai-2.jpg", "w": 2000, "h": 1332},
      {"src": "assets/projects/drone-guide/ai-1.jpg", "w": 2000, "h": 1332},
      {"src": "assets/projects/drone-guide/ai-3.jpg", "w": 2000, "h": 1332},
    ],
  },
  {
    slug: "unsw-water-pump",
    title: "UNSW Water Pump",
    year: null,
    tags: ["UNSW"],
    cover: "assets/projects/unsw-water-pump/cover.jpg",
  },
  {
    slug: "tradie-tech",
    title: "Tradie Tech",
    year: "2026",
    tags: ["Software"],
    logo: "assets/projects/tradie-tech/logo.svg",
    cover: "assets/projects/tradie-tech/backer-poster.jpg",
    tileVideo: "assets/projects/tradie-tech/backer.mp4",
    description: ["A web app for tradespeople, built in a design sprint around one job: turning a customer's phone call into a booked job with one tap."],
  },
  {
    slug: "tri-filter",
    title: "Tri-Filter",
    year: null,
    tags: [],
    cover: "assets/projects/tri-filter/black-3q.jpg",
    gallery: [
      {"src": "assets/projects/tri-filter/black-3q.jpg", "w": 1537, "h": 1023},
    ],
  },
  {
    slug: "acacia-financial",
    title: "Acacia Financial",
    year: "2026",
    tags: ["Software", "Live"],
    live: true,
    cover: "assets/projects/acacia-financial/cover.jpg?v=3",
    description: [
      "Acacia is a bot that trades real money on Kalshi, a US exchange where people buy and sell yes-or-no contracts. It trades one question, asked every 15 minutes: will Bitcoin finish the window above a set price? A winning contract pays $1. A losing one pays nothing.",
      "Every second the bot reads the market and the price Kalshi settles on, works out the chance that each side wins, and buys only when the market asks less than that chance is worth. It sizes each bet from its own bankroll, then waits for the window to settle and books the result.",
      "To build it I wrote a recorder that saves every change to the market, so I could replay a month of trading and test each idea before it touched money. The pricing rests on probability and statistics. The bot itself is Python, reads live data over websockets and sends orders within tens of milliseconds. It runs on Railway, keeps its records in cloud storage, and stops itself when a feed goes quiet or losses pile up.",
    ],
    tools: "Python, asyncio, SQLite, Parquet, Railway",
  },
  {
    slug: "d-sentry",
    title: "D-Sentry",
    year: "2026",
    tags: ["Mechanical", "Electronics"],
    description: ["A pan-and-tilt rig driven by stepper motors through planetary gearboxes, with flywheel motors run from an L298N driver and an Arduino CNC shield."],
    cover: "assets/projects/d-sentry/ai-1.jpg",
    hero: [
      {"src": "assets/projects/d-sentry/ai-2.jpg", "w": 2000, "h": 1501},
      {"src": "assets/projects/d-sentry/ai-1.jpg", "w": 2000, "h": 1501},
      {"src": "assets/projects/d-sentry/ai-3.jpg", "w": 2000, "h": 1501},
    ],
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
