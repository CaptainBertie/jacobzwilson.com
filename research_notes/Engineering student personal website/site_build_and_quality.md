# Technical build and engineering quality of an engineering student's personal portfolio site (as of Nov 2026)

Research depth note: about 18 tool calls. Primary sources were fetched for Core Web Vitals, WCAG 2.2, Google ProfilePage, Google AI features, Cloudflare Pages limits, GitHub Pages limits, Vercel fair use, and auDA eligibility. Many other items rest on secondary SEO/vendor blogs and are flagged as such. Several questions (site-builder comparison, resume PDF, OG cards, dark mode, recruiter mobile share) were NOT answered with sources; see Gaps.

## 1. Build approach in 2026: hand-built vs site builders, and what the method signals

### Takeaway
I found no authoritative source comparing Framer/Webflow/Squarespace/Notion/Google Sites against Next.js/Astro for students, and no hirer data on whether the build method signals anything. The only usable evidence: hirer commentary says the content (proof of real work) matters more than polish, and hardware-role advice says a simple PDF or GitHub-hosted page is acceptable.

### Cited Findings
- A mechanical-design guide says a portfolio "can be a simple PDF or a GitHub-hosted page" and that showing projects matters most; a mechanical-engineer hiring post says his team opens the portfolio before the résumé to check project fit — [Trossen Robotics portfolio guidelines](https://www.trossenrobotics.com/portfolio-guidelines); [Trossen Robotics, how not to get a job as a mechanical engineer](https://www.trossenrobotics.com/post/how-not-to-get-a-job-as-a-mechanical-engineer) (vendor/career blog, opinion).
- One practitioner source argues that a portfolio's design can measure visual flair more than the algorithmic depth needed for systems engineering — [domalberto.edu.br page](https://ava.ead.domalberto.edu.br/personal-website-software-engineer) (low-quality aggregator; opinion).
- Templifica suggests a clean starting point often works best for technical portfolios — [Templifica](https://templifica.com/blog/developer-portfolio-templates-creating-a-job-winning-portfolio) (vendor blog).
- Recruiters want a quick career summary; engineering managers want to see how the candidate thinks and case-study depth — [LinkedIn post (Shahmeer)](https://pk.linkedin.com/in/shahmeerzd) (single individual, weak).
- Hosting constraints that affect build choice: Cloudflare Pages free plan allows 500 builds/month, 20,000 files per site, 25 MiB max per asset, 100 custom domains per project; docs suggest R2 for larger files — [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/).
- GitHub Pages: published site max 1 GB, soft 100 GB/month bandwidth, soft 10 builds/hour; not allowed as free hosting for running a business/e-commerce/commercial SaaS — [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

### Inferences
- A 25 MiB per-file cap on Cloudflare Pages means large videos and big glTF files should live elsewhere (R2 or a video host), a concrete constraint for a media-heavy portfolio.
- Because hardware hirers accept PDF/GitHub pages, a hand-built framework is not required for hardware roles; the build method signal matters mainly for software roles, but I have no source proving this.

### Gaps
- No source on Framer/Webflow/Squarespace/Notion/Google Sites trade-offs (pricing, export, performance, custom domain). Not searched specifically.
- No evidence on whether hirers read the build method (framework vs builder) as a signal.
- Netlify free-tier terms: sources disagreed (credit-based vs 100 GB) and the official page was not reached.

## 2. Performance: Core Web Vitals, bounce, images, video, 3D

### Takeaway
Core Web Vitals "good" thresholds are LCP 2.5 s, INP 200 ms, CLS 0.1 at the 75th percentile, unchanged as of 2026. For 3D, model-viewer supports lazy loading, a poster image, and Draco/Meshopt compression; load the model only on interaction.

### Cited Findings
- Thresholds: LCP within 2.5 s, INP 200 ms or less, CLS 0.1 or less, measured at the 75th percentile of page loads, separately for mobile and desktop; the page must meet all three — [web.dev Core Web Vitals](https://web.dev/articles/vitals) (page last updated Oct 31, 2024; INP became stable in 2024).
- "Poor" bounds: LCP over 4.0 s, INP over 500 ms, CLS over 0.25. A November 2026 roundup reports the metrics and thresholds are unchanged and no new metric announced — [corewebvitals.io](https://corewebvitals.io/core-web-vitals); [mean.ceo Nov 2026](https://blog.mean.ceo/core-web-vitals-news-november-2026/) (secondary SEO blogs).
- January 2026 CrUX analysis: 55.7% of sites pass all three globally — [shno.co statistics](https://www.shno.co/marketing-statistics/core-web-vitals-statistics) (secondary).
- Bounce: "the probability of bounce increases 32% as page load time goes from 1 second to 3 seconds" (Google/SOASTA 2017 research; commonly cited as mobile visitors; other cited figures are 90% for 1 to 5 s and 123% for 1 to 10 s) — [Think with Google](https://thinkwithgoogle.com/data/page-load-time-statistics) (OLD, 2017; the 90%/123% figures come via secondary summaries).
- Web Almanac 2025: median mobile home page weight reported as 2,362 KB (from 845 KB in 2015), with 697 KB of JavaScript; median mobile image weight reported as 911 KB; images are the LCP element on about 76% of mobile pages — [Web Almanac 2025 page weight](https://almanac.httparchive.org/en/2025/page-weight) (primary page, but numbers retrieved via [captaindns summary](https://www.captaindns.com/en/blog/median-web-page-weight-2025) and [voxbooster](https://voxbooster.com/blog/website-performance-statistics-2026/); verify against the chapter).
- model-viewer: `loading` attribute accepts auto/lazy/eager; a `poster` is shown until the model loads — [modelviewer.dev loading examples](https://modelviewer.dev/examples/loading/). Cloud Four says 3D models are large so delay download until the user interacts; flags a bug where lazy-loading breaks the progress bar — [Cloud Four](https://cloudfour.com/thinks/how-to-embed-3d-models-on-the-web/).
- model-viewer supports Draco and Meshopt; Draco decoder loads on demand from a Google CDN by default and must be configured before the first element is created; Draco decoder is 100KB+ so only worthwhile if savings exceed that; Draco compresses geometry only (not textures); Meshopt is better for animated meshes — [modelviewer.dev](https://modelviewer.dev/examples/loading/); [Needle glTF progressive docs](https://engine.needle.tools/docs/gltf-progressive/); [polyvia3d guide](https://polyvia3d.pages.dev/guides/embed-3d-model-website-glb) (vendor guide).
- A vendor guide claims a 3.2 MB compressed GLB scored 94 Lighthouse mobile with poster + lazy loading vs 71 without — [polyvia3d](https://polyvia3d.pages.dev/guides/embed-3d-model-website-glb) (anecdotal, unverified).

### Inferences
- A 25 MiB Cloudflare Pages per-file limit plus a 3-5 MB glTF budget are compatible; raw CAD exports (often tens of MB) will need decimation and compression before publishing.
- Since images are the LCP element on roughly three quarters of mobile pages, the hero image of each project page is the first thing to optimise.

### Gaps
- No sourced guidance on self-hosted video vs YouTube/Vimeo embeds (facade/lite-embed pattern, autoplay-muted loops, bitrates).
- No CAD-specific source (STEP/IGES to glTF tessellation, scale, Fusion/SolidWorks export paths).
- No sourced guidance on image formats (AVIF/WebP, srcset) in this pass.

## 3. Accessibility and mobile

### Takeaway
WCAG 2.2 added nine criteria and removed 4.1.1 Parsing; the new AA ones relevant to a portfolio are focus not obscured, dragging alternatives, and 24x24 px minimum target size. I found no current data on what share of recruiter views occur on phones.

### Cited Findings
- WCAG 2.2 new criteria: 2.4.11 Focus Not Obscured (Minimum) AA; 2.4.12 (Enhanced) AAA; 2.4.13 Focus Appearance AAA; 2.5.7 Dragging Movements AA; 2.5.8 Target Size (Minimum) AA, at least 24 by 24 CSS px (with exceptions such as spacing); 3.2.6 Consistent Help A; 3.3.7 Redundant Entry A; 3.3.8 Accessible Authentication (Minimum) AA; 3.3.9 (Enhanced) AAA. 4.1.1 Parsing removed — [W3C WAI: What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).
- 2.5.7 Dragging Movements is relevant to 3D viewers or carousels that require drag; a single-pointer alternative is needed — same W3C source.
- Mobile share of recruiter views: only old data found. LinkedIn 2013: about 33% of members visit from mobile and over 30% of job views come from mobile; Jobvite 2014: 93% of recruiters review a candidate's social profile — [LinkedIn 2013](https://blog.linkedin.com/2013/10/16/the-mobile-job-hunt-is-on-with-linkedin-recruiter-mobile-are-you-prepared-slideshow); [Jobvite 2014 survey](https://www.shrm.org/content/dam/en/shrm/topics-tools/news/technology/Jobvite_SocialRecruiting_Survey2014.pdf) (OLD, 2013-2014; not recruiter-profile-view share).

### Inferences
- Interactive 3D viewers that depend on click-drag should offer keyboard controls (model-viewer has camera-controls) and non-drag alternatives to satisfy 2.5.7; this is my inference, not sourced.

### Gaps
- No current (2024-2026) statistic on the share of recruiter site/profile views on phones. Not found.
- No sourced contrast ratios (4.5:1/3:1), alt-text, reduced-motion (`prefers-reduced-motion`) guidance fetched in this pass; they are standard WCAG items but uncited here.

## 4. Discoverability: SEO, structured data, link previews, domains, AI crawlers

### Takeaway
Google says no special optimisation or schema is needed for AI Overviews/AI Mode; use ProfilePage with a Person mainEntity if desired. For a Sydney student: .com.au is for commercial entities; individuals with Australian presence can hold a direct .au name, and .id.au for individuals. Allow AI search crawlers and optionally block training crawlers in robots.txt.

### Cited Findings
- Google ProfilePage structured data: required `mainEntity` (Person or Organization) and `name`; recommended `dateCreated`, `dateModified`, `alternateName`, `description`, `image`, `sameAs`, `identifier`; a blog "About Me" page is a valid example; page's primary focus must be a single person — [Google ProfilePage docs](https://developers.google.com/search/docs/appearance/structured-data/profile-page).
- Google on AI features: "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary"; no special schema needed; page must be indexed and eligible to show with a snippet; Google-Extended controls AI training/grounding in some other systems; nosnippet/max-snippet/noindex control display — [Google AI features docs](https://developers.google.com/search/docs/appearance/ai-features) (undated page).
- AI crawlers: training and search crawlers are separate (GPTBot vs OAI-SearchBot; ClaudeBot vs Claude-SearchBot vs Claude-User). Common personal-site setup: allow OAI-SearchBot, Claude-SearchBot, ChatGPT-User, PerplexityBot; disallow GPTBot, ClaudeBot, Google-Extended. Anthropic-AI token reported retired in 2024. Sources disagree on whether ChatGPT-User obeys robots.txt. Some firewalls block AI user agents at network level regardless of robots.txt — [brandswarm DEV guide](https://dev.to/brandswarm/robotstxt-for-ai-search-the-2026-cheat-sheet-gptbot-claudebot-and-the-rest-16a); [anagram.ai 2026](https://www.anagram.ai/blog/ai-crawler-user-agent-list-2026-14-bots-and-robotstxt-tokens-to-know); [dev.to orzmar](https://dev.to/orzmar/your-robotstxt-says-gptbot-is-welcome-your-server-says-403-9f2) (SEO/vendor blogs; verify against OpenAI and Anthropic crawler docs).
- auDA: every .au licence requires Australian presence; ".au direct" names are open to everyone meeting the Australian presence requirement, no ABN/ACN needed, "Australian citizens or residents are eligible to hold any .au direct name"; physical address not taken into account — [auDA com.au/net.au rules page](https://auda.org.au/au-domain-names/domain-name-help/comau-and-netau-rules-eligibility-and-allocation).
- .com.au and .net.au: registrant must have Australian presence and be a commercial entity (ABN, ACN, or Australian trade mark; name must relate to the business) — same auDA page.
- A 2019 auDA policy paper says an individual can register in .id.au only unless running a business (OLD; pre-direct-registration) — [auDA 2019 paper](https://files.auda.org.au/documents/Final-Paper-Reform-of-Existing-Policies-Implementation-of-Direct-Registration-Mar2019.pdf). Registrar sources say .id.au is for Australian citizens or permanent residents, and direct .au has been available since March 2022 — [sprintlaw](https://sprintlaw.com.au/articles/au-registration-requirements-who-can-register-a-au-domain/) (law-firm marketing; secondary).
- Registrant is responsible for staying eligible during the licence period — auDA search result summary; see [auDA licensing documents](https://files.auda.org.au/documents/Domain-Name-Eligibility-and-Allocation-Policy-Rules-July-2024.pdf) (not opened).

### Inferences
- If the student holds citizenship or permanent residency, a personal .au name should be eligible; if on a student visa, eligibility is unconfirmed (the fetched auDA page does not address visas). A .com.au is not appropriate for a personal non-business site without an ABN.
- Because Google says no special schema is required, Person/ProfilePage JSON-LD is a low-cost nicety (name disambiguation, sameAs links to LinkedIn/GitHub), not a ranking lever.

### Gaps
- Visa-holder eligibility for .au direct/.id.au: not confirmed; section 2.4 of auDA's Licensing Rules not read. The 2026 Product Guide PDF was unreadable via fetch.
- No source fetched on Open Graph / LinkedIn Post Inspector requirements (og:image size, caching), or on .dev/.com TLD pros and cons (.dev requires HTTPS via HSTS preload; uncited).
- No evidence on ranking for a personal name specifically.

## 5. Content maintainability, analytics, hosting costs

### Takeaway
Cloudflare Pages has the most permissive free tier; Vercel Hobby is non-commercial with a 100 GB transfer guideline; GitHub Pages is free with a 1 GB size cap. Privacy-friendly analytics options exist (GoatCounter, Plausible, Cloudflare), but pricing evidence is secondary.

### Cited Findings
- Vercel Hobby typical monthly guideline: first 100 GB Fast Data Transfer, 1,000,000 function invocations, 5K image transformations/month — [Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) (page updated 2026-11-12). Secondary sources say Hobby bars commercial use — [DEV comparison](https://dev.to/libme/vercel-vs-netlify-vs-cloudflare-pages-where-your-side-project-should-actually-live-1j30) (the "Never fair use" list on the fetched page was not shown; verify at Vercel terms).
- Cloudflare Pages free: no bandwidth limit mentioned on the official limits page; secondary sources say unlimited static bandwidth, with Functions request limits — [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/); [DEV comparison](https://dev.to/_6638a39c349d7e9c85ee20/vercel-vs-netlify-vs-cloudflare-pages-2026-best-hosting-for-developers-22ma).
- Analytics: Plausible paid (about $9/month for 10k pageviews, per aggregators), cookieless; GoatCounter free for non-commercial hosted use or self-hosted, cookieless; Cloudflare Web Analytics free — [toolradar GoatCounter vs Plausible](https://toolradar.com/compare/goatcounter-vs-plausible); [dasroot 2026](https://dasroot.net/posts/2026/03/privacy-preserving-analytics-plausible-umami-goatcounter/) (secondary comparison sites; conflicting prices; verify on vendor pages).

### Inferences
- A student site with a few MB of images will sit far below Vercel's 100 GB and GitHub's 100 GB soft bandwidth caps; hosting cost is realistically $0 apart from the domain.

### Gaps
- Nothing sourced on Markdown/MDX vs CMS workflows (Astro content collections, Decap, etc.) or on keeping sites updated.
- Domain registration price for .au/.com not sourced.

## 6. Visual design: restraint, typography, dark mode, AI-generated sameness

### Takeaway
Commentary (mostly blogs) converges on: clean, simple, evidence-led; hirers are filtering AI-generated sameness and want proof of real work. No hard data and no source on typography or dark mode.

### Cited Findings
- A piece opens with a hiring manager reviewing 80 portfolios that all look the same — [pickuma on DEV](https://dev.to/pickuma/portfolio-strategy-for-2026-surviving-the-ai-generated-noise-filter-4oj3) (blog, anecdote).
- Robert Half survey (March 2026): 65% of US HR leaders say a surge in applications makes it harder to verify candidate skills — via [The Interview Guys](https://blog.theinterviewguys.com/?p=11490) (not confirmed against Robert Half's release).
- Hiring managers now want a "paper trail" showing what the developer built vs what AI generated — [The New Stack](https://thenewstack.io/how-ai-changes-developer-portfolios/) (via search summary; page itself returned 403 when fetched).
- Case studies let hiring managers verify claims; a vague AI prompt yields a generic template — [The Interview Guys](https://blog.theinterviewguys.com/?p=11490); [JobWizard](https://jobwizard.ai/blog/portfolio-website-for-job-applications) (blogs).
- Hardware-role advice: 3-7 well-documented projects, multiple CAD views, a clear statement of own role, include calculations and material rationale; quality over quantity — [Vista Projects](https://www.vistaprojects.com/?p=68918); [NYU Tandon](https://engineering.nyu.edu/life-tandon/experiential-learning-center/building-portfolio); [Apollo Technical](https://www.apollotechnical.com/?p=55136) (career blogs/university advice).
- Warning: several statistics circulating on these pages (93%, 78%, 72%, 74%) have no traceable primary source — [dhaval-prajapati blog](https://dhaval-prajapati.onrender.com/blog/free-developer-portfolio-with-ai-2026); do not reuse.

### Inferences
- The strongest differentiator against templated-looking AI sites is specific, verifiable detail (own photos, own CAD, measured results, a clear "what I did" statement), which also suits hardware roles.

### Gaps
- No sourced guidance on typography, dark mode (prefers-color-scheme), or animation restraint, and no named designer/hiring-manager quotes beyond blogs.

## 7. Résumé PDF, contact forms vs email, spam, privacy

### Takeaway
Layered spam protection (honeypot first, Turnstile if needed) is the consensus; a form avoids exposing the email address in HTML. Nothing sourced on résumé PDF handling.

### Cited Findings
- Honeypot hidden field is the cheapest first filter (vendor claim of roughly 80% simple bots), weaker against JS-capable bots and AI agents in real browsers — [splitforms](https://splitforms.com/blog/stop-contact-form-spam) (vendor).
- Cloudflare Turnstile is free with unlimited widgets/verifications but adds a third-party script; recommended after measuring spam that gets past simpler layers — [Formspree Turnstile announcement](https://formspree.io/blog/announcing-turnstile-integration/); [Andrew Bottoni, June 2026](https://andrewbottoni-site.pages.dev/blog/contact-form-no-third-parties) (personal blog).
- A contact form avoids exposing the address in HTML — [formester](https://www.formester.com/blog/how-to-protect-user-data-and-prevent-spam-in-web-forms/) (vendor).

### Inferences
- A plain mailto link is simplest and avoids a third-party script; a form is only worth adding if spam scraping of the address becomes a problem (my judgement, unsourced).

### Gaps
- No source on mailto obfuscation effectiveness, Formspree/Formspark free-tier limits, résumé PDF practices (file size, naming, ATS, metadata/privacy stripping, hosting a public phone/address), or Australian Privacy Act implications of publishing personal data.
