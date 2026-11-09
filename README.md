# Business English Role-Play Materials

A quiet, readable collection of business meeting role-plays for a student and an English teacher. Built with Astro, TypeScript, and CSS. All pages are generated as static HTML; a small vanilla JavaScript module handles role selection and sharing. There is no database, sign-in, server API, or client-side framework.

**Live site:** [Business English](https://english-lesson.gil-inc.dev/) · **Share with your teacher:** [Lesson 1 — Teacher view](https://english-lesson.gil-inc.dev/lessons/01-employee-satisfaction/?role=teacher)

## Lesson 1

**Improving Employee Satisfaction Without Increasing Costs**

A consultant and an HR manager explore declining morale at a fictional company with 200 employees. The student discovers background information through questions, discusses a realistic improvement, and agrees on next steps.

The default 20-minute session includes 2 minutes of preparation, an 8-minute meeting, 5 minutes of communication review, a 4-minute summary exercise, and a 1-minute wrap-up. The teacher guide includes 5- and 10-minute meeting alternatives.

The lesson page puts three activities first: the meeting, communication review, and a 60-second summary. Core material is always visible within the selected role. Student view shows the brief, meeting goals, five practice phrases, reflection questions, and summary steps. Teacher view shows the role, quick start, suggested opening, information to reveal when asked, discussion guide, and feedback prompts. The scenario and summary framework are shared.

Folds are reserved for optional material: teaching approach and timing, extra challenges and example outcomes, the summary checklist, and alternative ways to say each practice phrase. The five main phrases remain visible so the student can practice without opening extra sections. They are flexible conversation tools, not a script or suggested answers to the scenario.

## Views and sharing

Choose **Student** or **Teacher** in the header. The selected view applies across the site. Use **Copy student link** or **Copy teacher link** to share the current page in that view. The copied URL includes the role and leaves out the current section fragment. If the browser denies clipboard access, a selected, read-only URL appears for manual copying.

Lesson 1 links:

- [Student view](https://english-lesson.gil-inc.dev/lessons/01-employee-satisfaction/?role=student)
- [Teacher view](https://english-lesson.gil-inc.dev/lessons/01-employee-satisfaction/?role=teacher)

A valid `?role=student` or `?role=teacher` overrides the saved preference. Without a valid role query, the site uses a valid saved Cookie, then defaults to Student. Choosing a view updates the URL and saves the preference in `business_english_role` for one year (`Max-Age=31536000`, `Path=/`, `SameSite=Lax`, and `Secure` on HTTPS). Links within the site also carry the selected role, so navigation still works if Cookies are blocked.

Role selection separates the reading experience, not access permissions. Both roles are public and require no login. JavaScript is needed for switching, preference saving, and link copying; with JavaScript disabled, the site shows Student view and native disclosure controls still work.

## Run locally

Use Node.js 22.23.4 or later (Node 24 LTS recommended) and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro, normally `http://127.0.0.1:4321/`. Lesson 1 is at `/lessons/01-employee-satisfaction/`.

```sh
npm run check       # Validate content and check Astro/TypeScript
npm test            # Check role resolution, Cookie settings, and sharing URLs
npm run build       # Generate static pages in dist/
npm run preview     # Preview the built site
npm run deploy:check # Build and validate deployment without uploading
```

Some Astro versions keep development servers running in the background. Use `npx astro dev status` to inspect an instance and `npx astro dev stop` to stop it. Otherwise use Ctrl+C in the server terminal.

## Edit a lesson

Edit `src/content/lessons/01-employee-satisfaction.yaml`. This file is the single source of lesson content. It contains:

| Field | Purpose |
| --- | --- |
| `number`, `title`, `topic`, `description`, `duration` | Lesson listing and page metadata |
| `introduction`, `schedule`, `skills` | Expandable lesson format and practice focus |
| `overview` | Main topic headline, context, objective, roles, and expected outcome |
| `student` | Visible initial facts, meeting goals, and practice phrases, without teacher-only information |
| `student.phrases` | Introduction, practice instructions, and five phrase groups with a main phrase, purpose, and optional alternatives |
| `teacher` | Role, quick start, meeting principles, pacing, and information to disclose |
| `discussion` | Opening, questions, objections, unexpected developments, and possible outcomes |
| `review` | Visible focus, reflection questions, and role-specific feedback guidance |
| `summary` | Visible focus, four-part framework and practice steps, plus an optional checklist |
| `wrapUp` | One habit to take into the next real meeting |

Use plain English text, not HTML or Markdown formatting, in YAML fields. Use `>-` for paragraphs that span multiple source lines and quote text when YAML punctuation would otherwise change its meaning. The schema in `src/content.config.ts` validates required fields and nonempty lists at build time. Keep the four summary stages in this order: issue, recommendation, reason, next steps.

For practice phrases, use `student.phrases.introduction` and `practice` for the short explanation and exercise. Each item in `groups` has a `title`, `phrase`, and `purpose`; its `alternatives` list contains `phrase` and `note` pairs. Keep each main phrase short and broadly useful. Use the optional alternatives to explain differences in tone or emphasis without revealing teacher-only facts.

All company facts are fictional. Keep detailed evidence, departmental concerns, previous initiatives, and example solutions inside `teacher` or `discussion`. Never duplicate them in a student's initial brief, page description, or visible overview. Reveal information in response to a related question, not only an exact scripted question.

The lesson format uses the same 20-minute structure and 5–10-minute meeting range across lessons. When changing the timing convention itself, update the lesson template and content together.

## Add a lesson

1. Copy the complete Lesson 1 YAML to a new file, for example `src/content/lessons/02-unhappy-customer.yaml`.
2. Update the metadata and every scenario-specific field. For example:

   ```yaml
   number: 2
   title: Handling an Unhappy Customer
   topic: Customer relationships
   description: Understand a customer's concern and agree on a practical next step.
   duration: 20 minutes
   ```

   This is a metadata example, not a complete lesson file; preserve and update all required sections from the copied lesson.
3. Keep `overview.headline`, `review.focus`, and `summary.focus` short. Core instructions stay visible; use expandable content only for optional guidance and phrase alternatives.
4. Give the teacher a small set of consistent facts, cues for revealing them, at least one objection, and feasible outcomes. Do not require specialist knowledge.
5. Run `npm run check` and `npm run build`, then preview the page and test its folds.
6. Run `npm run deploy` when ready to publish.

The filename becomes the lesson URL. The example above generates `/lessons/02-unhappy-customer/` and appears automatically on the home page, ordered by `number`. Use unique numbers and lowercase, hyphenated filenames. Renaming a file changes its URL; keep existing filenames stable when updating shared lessons. No page or navigation edits are needed for new lessons.

Only Lesson 1 is included in the initial release. There are no placeholder lessons.

## Print

Use the browser's **Print** command. A4 and US Letter are supported using the browser's standard scale. Navigation is removed and text uses a compact print layout.

- Choose Student or Teacher in the header before printing. The active role's core material is always included.
- A student copy includes the brief, main practice phrases, reflection questions, and summary steps. A teacher copy includes the role, quick start, opening, information cards, discussion guide, and feedback prompts.
- Open any optional sections you want to include, such as phrase alternatives, extra challenges, or the summary checklist. Closed optional sections are omitted.
- Disable browser headers and footers for a cleaner handout. Background graphics are optional.

The optional folds use native HTML `details` and `summary`, including keyboard access. Printing includes the active view's core content and any open optional sections. Optional folds start closed when opening the page anew.

## Deploy to Cloudflare Workers Static Assets

The site uses the project-local Wrangler CLI to upload Astro's static build. The `cf` beta currently cannot build Astro 6 and later, so the build and upload remain separate. See the [Cloudflare CLI compatibility notes](https://developers.cloudflare.com/cf/get-started/first-worker/) and [static site routing documentation](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/).

```sh
npx wrangler login       # Only if not already authenticated
npx wrangler whoami     # Confirm the intended account
npm run deploy:check
npm run deploy
```

`wrangler.jsonc` is the deployment configuration. It names the Worker `english-materials`, serves `dist/`, uses compatibility date `2026-11-09`, and serves the generated `404.html` with HTTP 404 for unknown URLs. There is no Worker entry point or server code. The `routes` entry attaches only `english-lesson.gil-inc.dev` as a Worker Custom Domain. Cloudflare manages its DNS record and HTTPS certificate. The existing website and email configuration on `gil-inc.dev` are not changed. The original [workers.dev URL](https://english-materials.gsakamoto582-workers.workers.dev/) remains available as an additional entry point.

Before the first deployment in another account, check that the configured Worker name is unused. Change `name` if it belongs to an unrelated site. Future deployments with the same name update this site. For accounts with multiple memberships, set `CLOUDFLARE_ACCOUNT_ID` to the intended account's ID before running the command. Do not commit tokens or local credentials.

Share `/lessons/01-employee-satisfaction/?role=teacher` with the teacher, or use the header's copy button in Teacher view. It requires no login. The custom domain is tracked in `wrangler.jsonc` and the site URL in `astro.config.mjs`. Automatic Git deployments are not configured.

## Verification checklist

- `npm test`, `npm run check`, `npm run build`, and the Wrangler dry run pass.
- The home page lists the complete lessons and each direct lesson URL loads.
- At desktop and 375px width, headings, lists, roles, and folds fit without horizontal scrolling.
- Keyboard users can reach and toggle every disclosure; the skip link reaches the main content.
- A fresh visit defaults to Student; a valid role query overrides the saved preference, and choosing a role survives reloads and navigation.
- Teacher evidence, example solutions, and feedback guidance stay out of Student view, including when printing.
- Core briefs, role-specific review guidance, summary steps, and the five main student practice phrases are visible without opening a fold.
- The copy button shares the selected role; denied clipboard access shows a selectable fallback URL.
- Review instructions prioritize clarity and concise communication; the summary includes a second attempt after feedback.
- A4 and Letter print previews include the active role's core content and only the optional sections opened for that copy.
- The public home page, lesson URL, stylesheet, favicon, and an unknown URL respond correctly after deployment.

## Project structure

```text
src/content/lessons/      One YAML file per lesson
src/content.config.ts    Build-time lesson validation
src/pages/               Home, reusable lesson template, and 404
src/components/          Reusable schedule
src/layouts/             Shared HTML, header, and footer
src/scripts/             Reading-role selection, Cookie preference, and sharing
src/styles/global.css    Typography, responsive layout, folds, and print styles
public/                  Static favicon
wrangler.jsonc           Cloudflare deployment configuration
```
