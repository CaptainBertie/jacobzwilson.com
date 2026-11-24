# Engineering student project write-ups and portfolio examples

Method note: about 20 tool calls (searches return model-written summaries; fetches were summarised by a small model). Quotes and facts below are only what those results stated. Several pages could not be read directly (Reddit threads, BU PDF, UNLV). The example-site section is thinner than requested (see Gaps).

## 1. What structure do the best project pages follow, and what do practising engineers say they want?

### Takeaway
Hiring managers screen the portfolio first and check three things: what YOU did, process (iterations, challenges) rather than renders, and self-initiated work beyond coursework. The recurring skeleton is problem, constraints, approach and why, iterations, test/validation results with numbers, lessons learned, and your role.

### Cited Findings
- Hiring manager (Reddit) says postings warn that applicants without a portfolio won't be considered; roughly half arrive with none and are deleted immediately. Their team opens the portfolio BEFORE the resume to see whether projects match the open role. Single-source anecdote, via a Reddit mirror. — [r/EngineeringStudents comment via mirror](https://nyc1.lr.ggtyler.dev/r/EngineeringStudents/comments/1inyajj/some_unsolicited_advice_as_someone_reviewing/mcql315/?context=3) (as reported by search summary; page itself would not fetch)
- Trossen Robotics (hiring for Mechanical Design Engineers) wants: CAD screenshots, photos/videos of builds, detailed write-ups with your specific contribution in team efforts, the challenges and iterations, and personal projects outside coursework. Looks for passion, self-directed challenging projects, ownership, and design thinking through iteration. A simple PDF or GitHub is acceptable: "The most important thing is to showcase your projects." — [Trossen portfolio guidelines](https://www.trossenrobotics.com/portfolio-guidelines)
- Trossen also says do not apply until the portfolio is ready. — same source
- Robotics-specific project template (The Construct, a vendor with a commercial interest): Problem, Solution, Technical details (tools, sensors, languages), Testing (optional), Results (metrics, graphs, videos), Lessons learned (what went wrong, what you'd change). Explain why you made design choices, not just what it does. Embed a demo video instead of linking a bare repo. Name Docker, Git workflow, tests. 3-5 well-documented projects. — [The Construct](https://www.theconstruct.ai/?p=47806)
- Vista Projects (consultancy blog) per-project format: descriptive title, timeframe, your explicit role; objective; technical approach and why; tools and how used; deliverables (drawings, test results); quantified outcomes, using ranges for proprietary figures. 3-7 projects, start with the three strongest, about 2-3 hours of documentation each; fewer well-documented beats many superficial. 150-250 word intro. — [Vista Projects](https://www.vistaprojects.com/mechanical-engineering-portfolio-examples/)
- Wix guide: 5-10 projects; for each, the problem, your process, outcome, your role and methods; supporting design files, code snippets, reports, sketches, data viz, images/video; favour measurable impact. — [Wix](https://www.wix.com/blog/how-to-make-an-engineering-portfolio)
- Hiring-manager-sourced points from a search summary of several guides: "We want to see what work YOU worked on"; a polished render alone is insufficient; pair design with proof it works (e.g. tolerance analysis plus a custom test rig); quantified outcomes (cost, weight, cycle time, tolerance, reliability); a Google Drive of STEP files called "a portfolio" is the most egregious failure. This is a summary of several vendor blogs, so treat as lower confidence. — [SolidProfessor](https://solidprofessor.com/blog/get-hired-mechanical-engineer/), [Vista Projects](https://www.vistaprojects.com/mechanical-engineering-portfolio-examples/)
- SolidProfessor: choose projects that tell a clear story (idea, development, testing, making it work) and tailor one core portfolio per role. — [SolidProfessor](https://solidprofessor.com/blog/get-hired-mechanical-engineer/)
- Academic template with a strong spine: Cornell ECE 4760/5730 final-project webpage (50% of course grade) requires: Introduction (one-sentence "sound bite" plus summary); High-level design (rationale, background math, logical structure, tradeoffs, relevant patents/IP); Program/hardware design (tricky parts, reproducibility, credited borrowed code, FAILED ATTEMPTS); Results (test data, speed, accuracy, safety, usability); Conclusions (results vs expectations); appendices (commented code, schematics, team task list, references); videos hosted externally and embedded; keep image sizes small. — [Hunter Adams, Cornell](https://vanhunteradams.com/DE1/Final_Project/Final_Project.html)
- Machine-design case-study convention: product proposal, trade study, configuration, detailed design, prototype tests, then lessons on goals and manufacturing tradeoffs; analysis before iteration (analytical load path then FEA, with mesh convergence stopping when stress change <~5%), ending with a validated prototype. Summarised from search of a pump-platform case study; unverified directly. — [pump platform case study](https://rohanjoshi3.github.io/pump-platform/)

### Inferences
- A good page = the Cornell rubric (intro sound bite, design rationale and tradeoffs, failed attempts, results with data) plus the Trossen "my role" and iteration emphasis. The Cornell rubric explicitly demanding "failed attempts" is a rare institutional endorsement of showing failure.
- The "one-sentence sound bite" up top suits a 10-second screen by a hiring manager who opens the portfolio first.

### Gaps
- Could not read r/EngineeringResumes wiki portfolio section or the linked Google Docs/Overleaf portfolio template (mirrors only show pointers). No direct Hacker News threads found. No firsthand company careers-page text from SpaceX, Tesla, Apple, Boston Dynamics, or FSAE alumni found. No UTS/UNSW/MIT/Stanford/Olin faculty portfolio guide retrieved (BU "Key Factors of Engineering Portfolios" PDF at [BU](https://www.bu.edu/eng/files/2022/07/Key-Factors-of-Engineering-Portfolios.pdf) is image/compressed and unreadable by the tool; UNLV page redirected away).
- The "86% of hiring managers open a portfolio link" figure circulates but I could not trace its original study; do not use it.

## 2. How should hardware work be shown (mechanical / mechatronics / electrical vs software)?

### Takeaway
Show the artifact working (embedded video), the design reasoning (CAD, annotated views, iteration history), and the proof (test data, analysis validated by a physical test); for electronics, make the design files openable without paid tools.

### Cited Findings
- Photos or videos of finished builds, CAD screenshots, iteration discussion. — [Trossen](https://www.trossenrobotics.com/portfolio-guidelines)
- A working video demo embedded on the page is "far more convincing than a static image"; also hardware photos, system architecture diagrams, data/simulation screenshots (e.g. RViz). — [The Construct](https://www.theconstruct.ai/?p=47806)
- High-resolution CAD drawings and renderings, multiple views, annotated; include FEA/CFD with validation, product design with iteration history. — [Vista Projects](https://www.vistaprojects.com/mechanical-engineering-portfolio-examples/)
- Electrical: show real design files (schematics/PCB), not just photos and prose; host them in a free browser-based PCB tool (article names Flux) so reviewers need no licence; avoid emailing ZIPs or using formats others cannot open; plus write-up or video walkthrough and open-source contributions. The article quotes no hiring managers and is promotional for Flux. — [Built In](https://builtin.com/hardware/hardware-engineering-portfolio)
- Robotics portfolios that show end-effector designs, robot cell layouts and safety integration are described as increasingly valued (search-summary claim, weak source). — via [search summary](https://www.wix.com/blog/how-to-make-an-engineering-portfolio)
- Software: link to a repo with a clear professional README; architecture diagram; embedded demo; name tooling (tests, Docker, CI); keep open-source work on its own page. — [The Construct](https://www.theconstruct.ai/?p=47806). A Reddit commenter says every repo linked from their portfolio/resume has a well-documented README. — [r/EngineeringResumes mirror](https://cal1.lr.ggtyler.dev/r/EngineeringResumes/wiki) (via search summary)
- Interactive in-browser demo (e.g. 2D inverse-kinematics arm) at the top of a student site was noted as a good way to show a project. — via search summary of [engineeringportfolio sites](https://jameshou.vercel.app/engineering) (not individually confirmed)

### Inferences
- For this user's mix (Arduino/PlatformIO builds, 3D-printed mechanisms, CAD gears, trading bots, data pipelines, Android app): hardware pages need photo + video + CAD + a measured result (e.g. gear backlash measured vs designed, torque/speed); software pages need architecture diagram + measured outcome (latency, uptime, P&L with caveats, test coverage) + README.
- Gear CAD and trading bots are both easier to prove with a chart or measurement than a screenshot.

### Gaps
- No source found on exploded views or BOM specifically; no source found on mechatronics-vs-software portfolio differences beyond the above.
- Per-project proof levels for trading bots (how to show results without publishing proprietary strategy) not found.

## 3. How many projects, ordering, coursework vs self-initiated vs team, confidentiality

### Takeaway
Sources converge on 3-7 deeply documented projects (3-5 for robotics), strongest first, tailored to the target role, with personal projects valued over pure coursework, explicit role statements on team work, and omission when in doubt on confidential work.

### Cited Findings
- 3 to 5 projects covering a range of skills. — [The Construct](https://www.theconstruct.ai/?p=47806)
- 3 to 7 projects; start with three strongest; fewer well-documented beat many superficial. — [Vista Projects](https://www.vistaprojects.com/mechanical-engineering-portfolio-examples/)
- 5 to 10 projects, quality over quantity. — [Wix](https://www.wix.com/blog/how-to-make-an-engineering-portfolio)
- Rearrange/edit so the most relevant work is front and centre for the job. — [SolidProfessor](https://solidprofessor.com/blog/get-hired-mechanical-engineer/)
- Personal projects alongside coursework; explain your role in team projects. — [Trossen](https://www.trossenrobotics.com/portfolio-guidelines)
- Confidentiality: remove client names, generalise ("industrial facility"), emphasise methodology over proprietary specs, get written permission from supervisor/HR and keep it, use qualified ranges; academic and personal projects avoid employment confidentiality issues; "if you're unsure whether a project is safe to include, leave it out". — [Vista Projects](https://www.vistaprojects.com/mechanical-engineering-portfolio-examples/)
- Course rules can allow publication: Cornell ECE 4760 asks teams to include an explicit sentence approving or declining inclusion on the course website (5 points lost if omitted). — [Hunter Adams, Cornell](https://vanhunteradams.com/DE1/Final_Project/Final_Project.html)
- A commenter on Tamer Shaheen's (Waterloo ME grad, mechanical design engineer) video: "hard to build a portfolio when the designs you make are proprietary or not allowed to be shared" (the question is raised; I did not find his answer). — [mirror via search](https://www.espinoinsurance.com/video/2PWHkn3gqXp/How-Mechanical-Engineers-Can-Get-Into-Tech.html)

### Inferences
- For UTS (Australia) students: check the subject outline and ask the coordinator before posting group or assessed work; the Cornell approval-sentence model is a good pattern to ask for. No UTS-specific policy was found.
- Academic-integrity risk is mainly posting solutions to future-reusable assessments; mitigate by posting design reasoning and results, not answer keys, and by waiting until after the subject ends. This is my reasoning, not sourced.

### Gaps
- No sources found for UTS/UNSW academic-integrity policy on publishing coursework.

## 4. Showing engineering judgement and process (failure, iteration, numbers)

### Takeaway
Document why you chose, what failed, and what you measured; hiring managers read this as evidence of judgement rather than the finished object.

### Cited Findings
- Cornell rubric requires "failed attempts", tradeoffs, test data (speed, accuracy, safety, usability), and results vs expectations. — [Hunter Adams, Cornell](https://vanhunteradams.com/DE1/Final_Project/Final_Project.html)
- Lessons learned: "what went wrong and what you would change". — [The Construct](https://www.theconstruct.ai/?p=47806)
- Document iterations, not just final results. — [Trossen](https://www.trossenrobotics.com/portfolio-guidelines)
- Tolerance analysis plus custom test rig as design-and-prove example; quantified outcomes. — search summary of [SolidProfessor](https://solidprofessor.com/blog/get-hired-mechanical-engineer/)
- Mesh-convergence check (<~5% stress change) before trusting FEA is the kind of verification detail a case study shows. — [pump platform case study](https://rohanjoshi3.github.io/pump-platform/) (via search summary)

### Inferences
- Each project should state one number and one failure; e.g. "backlash 0.2 mm vs 0.1 mm target; cause: print tolerance; fix: ..." is stronger than adjectives.

### Gaps
- No quantified study of what hiring managers prefer; all advice is anecdotal or vendor.

## 5. Real, live example sites (verification status stated honestly)

### Takeaway
I found fewer verified, outstanding examples than the brief asked for. The list below is what I could confirm loads; most are student sites with visible weaknesses, which are noted because the weaknesses are instructive. Do not treat these as curated "best of" sites. A follow-up pass should hunt for stronger examples.

### Cited Findings (fetched; load confirmed by fetch tool)
- Cornell ECE 4760/5730 final-project index (a gallery of structured student write-ups; Fall 2025 45 projects, Spring 2025 41, Fall 2023 44, Fall 2022 39, plus 1999-2021 archive and YouTube playlist). Good: consistent rubric (see section 1), course-curated. Examples listed include 3D Audio Localization, Vision-guided Ball Catcher, ScopeBoy (handheld mixed-domain oscilloscope), Pico Pasture cow-herding simulation (relative paths under the index; I did not open them). — [ECE 4760 projects](https://ece4760.github.io/Projects/Projects.html)
- Cornell ECE 5725 Spring 2024 "Ping Pong Ball Balance": the About page loads but has only bios; the substantive Report page was not opened. Lesson: put the substance on the first page. — [page](https://courses.ece.cornell.edu/ece5990/ECE5725_Spring2024_Projects/01%20Friday%20May%2010/06%20Ping%20Pong%20Ball%20Balance/public/about/index.html)
- Peera Tienthong (robotics software, ROS/Nav2/Open-RMF/Jenkins CI) — cited by The Construct. Loads. Good: consistent card per project with GIF and repo link, wide technical range, internship context. Weak: no dedicated project pages, no diagrams or metrics, one video, placeholder nav, typos. A cautionary example of repo-link-only presentation. — [ptientho.github.io](https://ptientho.github.io/)
- James Hou engineering page (high-school; VEX robotics, ESP32 weather station). Loads. Good: consistent cards with tech tags, concrete metrics (12 stations over 6-mile radius; national VEX ranking among 6,800+ teams), external proof. Weak: copy-paste errors (wrong caption, "2026-2026"), thin descriptions, role stated for only one project. Scope is high school, not a model for a university applicant. — [jameshou.vercel.app/engineering](https://jameshou.vercel.app/engineering)
- Jared Fenster (Waterloo Mechatronics; nine hardware projects: robot arms, harmonic drive, vertical launcher, omnidirectional robot, IK visualiser). Loads (landing page only; project pages not checked). Good: visual-first thumbnail grid, hardware breadth, clear contact. Weak on landing: no captions or metrics. — [jaredfenster.github.io](https://jaredfenster.github.io)
- Matthew James Toven (Wix-cited; mechanical engineer, inventor, roboticist; gallery mixes work and personal inventions; Wix praises its balance of personality and professionalism). Not fetched by me; listed from the Wix article only. — [mtoven.com](https://www.mtoven.com/) via [Wix](https://www.wix.com/blog/how-to-make-an-engineering-portfolio)
- Miguel Solis Segura, cited by The Construct, FAILED: https://miguelsolissegura.com/ now shows a parked/for-sale domain page. Do not use; also a warning to keep your own domain alive. — [attempted fetch](https://miguelsolissegura.com/)

### Cited Findings (surfaced in search only; NOT opened or verified)
Waterloo Mechatronics student sites and others returned by search: [Tiger Ye's portfolio PDF](https://tigerqye.github.io/assets/Portfolio.pdf), [Noah Yacowar](https://noah-yacowar.github.io/Portfolio-Website), [Ishaan Salian](https://ishaansalian.github.io/Portfolio), [Rudra Sarker](https://awesome.ecosyste.ms/projects/github.com%2Frudra496%2Fsite), [Marc (PENS mechatronics)](https://marcelldt.me.student.pens.ac.id/), [Northwestern McCormick robotics featured project portfolios](https://www.mccormick.northwestern.edu/robotics/curriculum/featured-project-portfolios.html), [Waterloo 2021 mechatronics capstone sites](https://www.eng.uwaterloo.ca/2021-capstone-design/mechatronics/participants-4), [yuandy Google Sites vehicle-dynamics portfolio](https://sites.google.com/view/yuandy-project-portfolio/home). Their quality is unknown; do not cite as "excellent" without opening them.

### Inferences
- The most reliable "excellent" template source found is institutional (Cornell's structured write-ups), not individual portfolios. An 8-15 verified-strong list was NOT achieved.
- Common weaknesses seen across fetched student sites: no dedicated project pages, no metrics, role not stated, typos/copy-paste errors, placeholder links. Fixing these alone would put a site ahead of the sampled ones.

### Gaps
- Missing: verified, genuinely outstanding early-career sites across mechanical/mechatronics/electrical and software (e.g. open-source-style engineering blogs, Olin/MIT/Stanford student sites, FSAE alumni sites). Search tool returned summaries only and many mirror sites; a follow-up should visit candidate sites directly (screenshots) before endorsing.
- No Tamer Shaheen video transcript, no company careers pages on portfolio expectations, no UTS/UNSW guide.
