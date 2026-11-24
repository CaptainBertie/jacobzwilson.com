# Build gaps: site builders, media, 3D, link previews, domains, authoring, design, resume, mobile

Research date: 2026-11-17. Many findings come from search-result summaries, not full-page reads; flagged where so. Items I could not source are in Gaps, not stated as fact.

## 1. Site builders vs hand-built (cost, domain, lock-in) and hirer signals

### Takeaway
Every hosted builder needs a paid plan for a custom domain, and published prices vary by source, so a student should check vendor pricing pages. I found no credible evidence that the build method itself signals anything to hirers; the evidence that exists concerns generic or low-quality content.

### Cited Findings
- Framer: free tier on a Framer subdomain; Basic quoted as $10, $15 and $19/month depending on source (conflict, unresolved) — [Search summary of dev.to, framerwebsites.com et al.](https://framerwebsites.com/blog/framer-pricing-explained)
- Webflow: Starter is free on webflow.io with no custom domain; reviewers say CMS and Business plans were merged into one Premium plan at about $25/month annual (third-party claim) — [superframeworks.com](https://superframeworks.com/articles/best-website-builders)
- Squarespace: no permanent free plan; sources quote Basic at $16 or $25/month (conflict); domain included only on annual billing — [uithings.com](https://uithings.com/best-website-builders)
- Wix: free plan with Wix branding; Light about $17/month annual (third-party) — [dupple.com](https://dupple.com/learn/best-website-builders)
- Across reviews, a custom domain needs a paid plan on all four; reviewers favour Framer for design-heavy portfolios and Squarespace for gallery-style/photo work — [toolradar.com](https://toolradar.com/guides/best-portfolio-website-builders)
- Astro content collections: Markdown/MDX/JSON/YAML via `glob()`/`file()` loaders, Zod-validated frontmatter, build-time static output — [Astro docs](https://docs.astro.build/en/guides/content-collections/)
- Hirer survey data (all vendor/blog sources, treat as weak): Hays Australia reportedly found 62% of hiring managers say they can spot AI-written application material and 78% say it hurts the impression; a 100+ UX hiring-manager survey (via LinkedIn post) ranked very low visual quality (55%), confusing navigation (48%), obvious AI overuse (43%), overly dense content (42%) as portfolio red flags; FlexJobs figure (via a builder-affiliated blog) says 86% of employers will visit a portfolio link — [Search summary: webpronews, theinterviewguys, onrec](https://blog.theinterviewguys.com/?p=10630)
- Commentators conclude recruiters react to generic content, not AI use itself; Canva/Sago found 90% of hirers accept gen-AI in applications — [tech.co](https://tech.co/news/half-job-seekers-using-ai)

### Inferences
- Lock-in: builder sites generally can't export the design; a coded Astro/HTML site on Cloudflare Pages/GitHub Pages is portable and free (hosting covered earlier). Lock-in claim is my inference, not sourced.
- Hardware roles: builders with gallery/media (Squarespace, Framer) are plausible; the hirer signal is project clarity, not tool. Inference only.

### Gaps
- No study comparing hirer reaction to builder vs coded sites, software vs hardware. None found.
- Exact current prices (conflicting); need vendor pricing pages (not fetched).
- Notion / Google Sites specifics not researched.
- Speed comparisons (Lighthouse/CrUX) between builders and static sites not found.

## 2. Video: self-hosted vs embeds, facades, autoplay loops

### Takeaway
Use `<video autoplay muted loop playsinline>` with WebM+MP4 sources instead of GIFs, and a click-to-load facade (lite-youtube-embed) for YouTube/Vimeo.

### Cited Findings
- GIF replacement markup: `autoplay muted loop playsinline`; `playsinline` required for iOS autoplay; serve WebM then MP4 sources, much smaller than GIF at similar quality — [web.dev lazy-loading video](https://web.dev/articles/lazy-loading-video)
- `preload` defaults to `metadata`; use `preload="none"` plus a `poster`; don't lazy-load a video that is the LCP element; `fetchpriority` can't yet be set on posters, so preload the poster image — [web.dev](https://web.dev/articles/lazy-loading-video)
- Native `loading="lazy"` on `<video>` is described there as supported where available (page may be dated; verify) — [web.dev](https://web.dev/articles/lazy-loading-video)
- Embeds: many include over 100 KB of JS, up to 2 MB; lazy-loading a YouTube iframe can save about 500 KB initially; set explicit width/height to avoid layout shift — [web.dev embed best practices](https://web.dev/articles/embed-best-practices)
- lite-youtube-embed claims about 224x faster than a normal embed (vendor/author claim); uses youtube-nocookie.com by default; on iPhone/iPad Safari it preloads the iframe, losing some benefit; page shows no deprecation notice — [lite-youtube-embed repo](https://github.com/paulirish/lite-youtube-embed)
- Vimeo facades exist (lite-vimeo-embed) but no numbers given — [web.dev](https://web.dev/articles/embed-best-practices)

### Inferences
- A 10–20 s muted loop clip per project is the lowest-cost way to show hardware in action; long demos belong on YouTube behind a facade.

### Gaps
- Recommended bitrates/resolutions/size caps (e.g. H.264 CRF, 720p, MB targets) not found in a citable source.
- Vimeo free-plan embed limits not researched.

## 3. Images: AVIF/WebP, srcset, lazy loading

### Takeaway
WebP/AVIF are supported in all modern browsers; beyond that I found no citable numbers.

### Cited Findings
- WebP and AVIF compress better than JPEG/PNG and are supported in all modern browsers; images can be LCP candidates so encoding matters; try several JPEG quality levels — [web.dev choose image format](https://web.dev/articles/choose-the-right-image-format)
- Uncompressed 100x100 CSS px image at 1x/2x/3x = 40 KB/160 KB/360 KB (illustrates why DPR-aware srcset matters) — same source
- HTTP Archive Web Almanac 2025 Media chapter URL returned 404; not read.

### Gaps
- AVIF-vs-WebP percentage savings, srcset/sizes syntax, `loading="lazy"` and `fetchpriority="high"` guidance: the fetched page did not cover them. Not sourced here.
- Astro `<Image>`/sharp pipeline not researched.

## 4. 3D: CAD to glTF/GLB, model-viewer, alternatives

### Takeaway
Onshape and SolidWorks export glTF/GLB natively; Fusion still needs a plugin or an OBJ/FBX-to-Blender route. model-viewer displays GLB.

### Cited Findings
- Onshape: glTF export since Oct 2019; custom export resolution (2021); changelog for release 1.217 (2026-06-26) lists new GLB export for parts and assemblies (read via search summary of changelog pages, not the English page) — [Onshape changelog](https://www.onshape.com/it/changelog/); [2019 note](https://www.onshape.com/en/resource-center/what-is-new/whats-new-in-onshape-october-1-2019)
- SolidWorks: File > Save As > Extended Reality (*.glb / *.gltf), with options for views/cameras; documented in 2025 help; a 2026 training page claims support continues (secondary) — [SolidWorks 2025 help](https://help.solidworks.com/2025/English/SolidWorks/sldworks/t_export_using_extended_reality.htm)
- Fusion: no native glTF/GLB export found; third-party plugins (ProtoTech, Windows-only; SimLab, listed Fusion 2013–2023); users report plugins drop appearances/decals; common workaround is OBJ/FBX then Blender — [ProtoTech](https://prototechsolutions.com/3d-products/fusion-360/gltf-exporter/); [SimLab](https://simlab-soft.com/3d-plugins/Fusion360/GLTF_Exporter_For_Fusion-main.aspx); [Autodesk forum](https://forums.autodesk.com/t5/fusion-design-validate-document/exporting-fusion-files-to-glb-format/m-p/11389465)
- model-viewer (Google, Apache-2.0) supports glTF/GLB, Draco/meshopt/KTX2 compression, posters, reveal/lazy attributes, USDZ for AR; the fetched page gave no numeric size guidance — [modelviewer.dev docs](https://modelviewer.dev/docs/index.html)
- Sketchfab free Basic: 10 uploads/month, 100 MB per model, models public; Pro $15/month (50 uploads, 200 MB); embedding allowed on free, branding removal is Premium; store moving to Fab, viewer stays (figures via search summary, checked Oct 2026) — [Sketchfab plans](https://sketchfab.com/plans?ref=header); [Sketchfab on Fab](https://sketchfab.com/blogs/community/introducing-new-plans-pricing/)
- Onshape export to Sketchfab guide exists — [Sketchfab help](https://help.sketchfab.com/en/articles/16152761-onshape)

### Inferences
- A Fusion user can still publish 3D via Sketchfab upload of OBJ/STEP-derived formats or Blender-converted GLB.

### Gaps
- File-size targets for GLB (commonly cited few MB) not found in a citable source.
- Fusion public share link/embed behaviour not verified.
- Onshape public-document link as a viewer not verified.

## 5. Link previews (LinkedIn)

### Takeaway
LinkedIn wants og:title, og:image, og:description, og:url; image at least 1200x627, about 1.91:1, up to 5 MB.

### Cited Findings
- Required tags og:title, og:image, og:description, og:url; max 5 MB; minimum 1200x627; recommended ratio 1.91:1; images under 401 px wide show as small thumbnails; blocked/protected image paths can prevent display — [LinkedIn Help](https://www.linkedin.com/help/linkedin/answer/a521928)

### Gaps
- Post Inspector usage/cache steps: the fetched help page didn't cover them (tool is at linkedin.com/post-inspector, from my memory, unverified). Cache duration unsourced.

## 6. Domain choice and email

### Takeaway
.id.au is for individuals with an Australian connection and a name match, non-commercial; wholesale is A$9.50/year ex GST.

### Cited Findings
- auDA wholesale price for any .au licence A$9.50/year ex GST from 1 Oct 2026, 1–5 year terms — [auDA](https://auda.org.au/registrar-resources/wholesale-au-domain-pricing)
- Retail .id.au examples (aggregator, inconsistent): Porkbun about $6.94 first year (promo), Regery $12.99, Easyspace $18 — [domainoffer.net](https://domainoffer.net/tld/id.au)
- .id.au: natural persons only, Australian connection, name must match/relate to registrant, hobby names removed, not for commercial use; renewal re-confirms eligibility; check auDA Licensing Rules section 2.4.8 — [Domain Central](https://clients.domaincentral.com.au/knowledgebase/89/.id.au-Eligibility-and-Allocation.html); [Mondaq](https://www.mondaq.com/australia/it-and-internet/1037702/new-auda-domain-name-rules-effective-on-12-april-2021)
- Custom-domain email: Cloudflare Email Routing forwards inbound free; guides disagree whether it can send (Gmail "send as" vs needing SMTP like Brevo); Gmail SMTP may sign DKIM as gmail.com — [dev.to guide](https://dev.to/jaygooby/use-a-basic-gmail-account-to-send-mail-as-with-a-domain-that-uses-cloudflare-email-routing-89b); [rajatdhoot](https://rajatdhoot.substack.com/p/free-custom-email-domains-with-cloudflare)

### Gaps
- .com and .dev retail prices not found; .au eligibility prior pass covered auDA rules in part.
- Cloudflare official docs on sending not read.

## 7. Authoring workflow (Markdown/MDX vs headless CMS)

### Takeaway
Astro content collections cover a one-person site without a CMS; CMS loaders exist if wanted.

### Cited Findings
- Astro: collections with glob/file loaders, MDX, Zod schemas, references; community loaders for Contentful, Sanity, Storyblok, Strapi, DatoCMS; live (request-time) collections lack MDX and image optimisation — [Astro docs](https://docs.astro.build/en/guides/content-collections/)

### Inferences
- For one author, files in git avoid CMS accounts and lock-in. Inference.

### Gaps
- No practitioner comparison of Markdown vs headless CMS for solo portfolios found.

## 8. Visual design guidance

### Takeaway
Only weak, vendor-adjacent evidence found: low visual quality, confusing navigation and generic/AI-looking content are cited hirer red flags.

### Cited Findings
- See Section 1 hiring survey figures (UX hiring manager red flags; Hays; CV-Library: 81% of ~500 recruiters say AI made CVs more standardised) — [onrec.com](https://onrec.com/news/news-archive/ai-is-standardising-cvs-and-reshaping-hiring-decisions-according-to-research)

### Gaps
- Typography, animation restraint, prefers-reduced-motion and dark-mode guidance from MDN/web.dev/practitioners: not searched. No hirer commentary specific to engineering portfolios found.

## 9. Resume PDF

### Takeaway
Name the file with your name and role, leave off street address, and strip PDF metadata; advice is from career/privacy blogs.

### Cited Findings
- File name: personal name plus job title, avoid "resume.pdf"; no address/phone in file name — [VisualCV](https://visualcv.com/blog/how-to-name-your-resume-file)
- Leave off home address; use city/state; phone advice mixed (a forwarding number such as Google Voice suggested); clear PDF metadata; use a separate job-search email — [Total Defense](https://www.totaldefense.com/security-blog/remove-your-home-address-from-your-resume-to-protect-your-privacy-while-job-hunting/); [GCF Global](https://edu.gcfglobal.org/en/resumewriting/create-a-cybersafe-resume/1); [Resume Contact Information Guide 2026](https://resumegeni.com/blog/resume-contact-information-guide)

### Gaps
- Linked PDF vs HTML resume page (ATS/accessibility/SEO): no sourced evidence found.
- Australian-specific norms (date of birth, visa status) not found.

## 10. Mobile share of LinkedIn/recruiter traffic

### Takeaway
No current official figure found; older LinkedIn data shows mobile at 38% (2013) to about 60% (Q3 2016) of unique visiting members.

### Cited Findings
- LinkedIn playbook: 38% of unique monthly visiting members via mobile apps, 30% of unique job viewers (circa 2013–15, old) — [LinkedIn mobile recruiting playbook](https://business.linkedin.com/content/dam/business/talent-solutions/global/en_US/c/pdfs/linkedin-mobile-recruiting-playbook-en-us.pdf)
- TechCrunch 2013: 38% of unique visits from mobile, up from 8% in Q1 2011 — [TechCrunch](https://techcrunch.com/2013/10/23/linkedin-mobile/)
- Statista citing LinkedIn: 60% of unique visitors via mobile Q3 2016 — [Statista](https://www.statista.com/statistics/425224/linkedin-mobile-unique-visitors-share)
- 2026 third-party claims conflict (about 57% of total traffic mobile; 74% app; SimilarWeb web-only 31% mobile) with no clear methodology — [dev.to](https://dev.to/atul9015/linkedin-mobile-usage-statistics-2026-1mpf); [sqmagazine](https://sqmagazine.co.uk/linkedin-mobile-vs-desktop-statistics)

### Inferences
- Because a LinkedIn link preview is often opened in the phone app, the site should be built mobile-first; recruiter-specific (desktop vs mobile) data is absent.

### Gaps
- No 2023–2026 primary data on recruiter device split.
