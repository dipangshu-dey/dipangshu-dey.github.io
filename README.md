# Dipangshu Dey – Cybersecurity Portfolio

A premium dark-themed, completely **static** portfolio (HTML + CSS + JavaScript + JSON).
No backend, no database, no admin login, no paid services. It is built for **GitHub Pages**.

Everything you see on the page is read from the files in `data/`. To update the site you edit a
JSON file and/or drop an image into `assets/`, then push to GitHub. You never touch the code.

---

## Contents

1. [What's in the folder](#1-whats-in-the-folder)
2. [Run it on your computer](#2-run-it-on-your-computer)
3. [Publish on GitHub Pages](#3-publish-on-github-pages)
4. [How to update things (the 15 common tasks)](#4-how-to-update-things)
5. [JSON reference with examples](#5-json-reference-with-examples)
6. [Image tips](#6-image-tips)
7. [Troubleshooting](#7-troubleshooting)
8. [What is real and what is placeholder](#8-what-is-real-and-what-is-placeholder)

---

## 1. What's in the folder

```
portfolio/
├── index.html            Page structure and fixed section headings
├── style.css             Design (colours are the variables at the top)
├── script.js             Loads data/*.json and builds the page
├── .nojekyll             Tells GitHub Pages to serve files as-is
│
├── data/                 ← YOUR CONTENT lives here
│   ├── profile.json        name, intro, photo, email, social links, resume, About text
│   ├── education.json      degrees and logos
│   ├── skills.json         skill categories and skills
│   ├── projects.json       projects
│   ├── labs.json           SOC home-lab activities
│   ├── experience.json     internships / jobs
│   ├── certificates.json   certifications and courses
│   ├── ctf.json            CTF and practical challenges
│   └── gallery.json        optional image galleries / collages
│
└── assets/               ← YOUR IMAGES AND PDFs live here
    ├── images/
    │   ├── profile/        profile.jpg goes here
    │   ├── education/      university / college logos
    │   ├── logos/          dd-logo.svg, favicon.svg
    │   └── gallery/        gallery images
    ├── certificates/       certificate images and PDFs
    ├── projects/           one folder per project (cover + screenshots)
    ├── soc-labs/           lab screenshots
    └── resume/             resume.pdf goes here
```

All paths are **relative** (no leading `/`), so the site works as a GitHub *project* page
(`https://username.github.io/repo-name/`) as well as a *user* page (`https://username.github.io/`).

**Statistics are automatic.** The four numbers under the hero are counted from your data
(projects, lab entries, CTF entries, certifications). They can never drift from what is actually shown,
and nothing is typed in by hand.

**Hide without deleting.** Any entry in any JSON file accepts `"visible": false` to hide it.

---

## 2. Run it on your computer

Browsers block `fetch()` for files opened straight from disk, so use a tiny local server:

```bash
cd portfolio
python3 -m http.server 8000
```

Open <http://localhost:8000>. (Node alternative: `npx serve`.)
Edit a file, refresh the browser, and you see the change.

---

## 3. Publish on GitHub Pages

1. Create a **public** repository on GitHub, e.g. `portfolio` (or `dipangshu-dey.github.io` for a root URL).
2. Upload everything from this folder to the repository root (so `index.html` is at the top level).
   - Web: *Add file → Upload files* and drag in the contents (include the `.nojekyll` file and the `data` and `assets` folders).
   - Or with git:
     ```bash
     cd portfolio
     git init
     git add .
     git commit -m "Initial portfolio"
     git branch -M main
     git remote add origin https://github.com/dipangshu-dey/portfolio.git
     git push -u origin main
     ```
3. In the repository go to **Settings → Pages**.
   Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute your site is live at `https://dipangshu-dey.github.io/portfolio/`
   (or `https://dipangshu-dey.github.io/` if the repo is named `dipangshu-dey.github.io`).

**Every later update:** change files, commit, push. GitHub Pages republishes automatically
(usually within a minute or two). If you don't see a change, hard-refresh (Ctrl/Cmd + Shift + R).

Capitalisation matters on GitHub Pages: `Profile.JPG` and `profile.jpg` are different files.

---

## 4. How to update things

### 1. Replace my profile photograph
Save your photo as **`assets/images/profile/profile.jpg`** (replace the file, keep the name).
Portrait orientation (4:5, e.g. 800×1000 px) looks best; the site crops to fit.
Using a different file name or `.png`/`.webp`? Change `"photo"` in `data/profile.json`.
Until the file exists, a neutral silhouette is shown.

### 2. Replace the DD logo
Replace **`assets/images/logos/dd-logo.svg`** (navbar and intro) and **`assets/images/logos/favicon.svg`** (browser tab) with your own files of the same names.
A transparent PNG also works: upload `dd-logo.png`, then change the two `dd-logo.svg` references in `index.html`.

### 3. Add a college or university logo
Put the logo in `assets/images/education/` and set its path in `data/education.json`:
`"logo": "assets/images/education/nfsu-logo.png"`.
The two expected file names are already configured:
`nfsu-logo.png` and `mes-vasant-joshi-college-logo.png`. Until you add them, a neat text badge (NFSU / MES VJC) is shown.
Get logos from the institution's official website or an authorised publication, and keep to their usage rules.

### 4. Add a new education entry
Add another block to `data/education.json` (see [example](#educationjson)). Newest first.

### 5. Add certificate images
1. Save the image in `assets/certificates/`, e.g. `assets/certificates/google-cybersecurity.jpg`.
2. Add an entry to `data/certificates.json` with `"image": "assets/certificates/google-cybersecurity.jpg"`
   and `"category": "certification"` or `"course"`.

### 6. Add PDF certificates
Save the PDF in `assets/certificates/` and use `"pdf": "assets/certificates/file.pdf"`.
You can give both `image` (shown as the thumbnail) and `pdf` (offered as *PDF* / *Download*).
A PDF-only entry shows a PDF tile and opens in the viewer.

### 7. Add CTF achievements
Add an entry to `data/ctf.json` (platform, date, description, optional image/PDF/verify link).
These appear under **CTF & Practical Challenges** and are counted in the stats.

### 8. Add project screenshots
Create a folder per project, e.g. `assets/projects/bittrace-v2/`, add `cover.png` and screenshots, then list them in `data/projects.json`:
```json
"cover": "assets/projects/bittrace-v2/cover.png",
"screenshots": [
  "assets/projects/bittrace-v2/dashboard.png",
  { "src": "assets/projects/bittrace-v2/graph.png", "caption": "Transaction flow graph" }
]
```

### 9. Add a new project
Copy any block in `data/projects.json`, change its `id` (unique, lowercase, no spaces) and the text.
Only add `github` / `demo` URLs that really exist; empty values simply hide the buttons.

### 10. Add SOC lab screenshots and entries
Save screenshots in `assets/soc-labs/` and add an entry to `entries` in `data/labs.json` (see [example](#labsjson)).
**Only add labs you have actually completed.** While `entries` is empty the site shows an honest "coming soon" note.

### 11. Update skills
Edit `data/skills.json`. Add, remove or rename skills, or add a whole new category.
To make a skill card clickable, give it any of: `description`, `evidence`, `screenshots`, `links`.
Icon names you can use are listed in [Image tips](#6-image-tips). To use a real tool logo instead, add `"logo": "assets/images/logos/wazuh.png"`.
There are no percentage bars, on purpose.

### 12. Replace my resume PDF
Save it as **`assets/resume/resume.pdf`** (replace the file).
The Resume section, hero "Download Resume" button and "View Resume" button all switch on automatically.
If the file is missing, the site shows *Resume coming soon* and a disabled button, never a broken link.
Optionally set `"updated": "2026-11"` under `resume` in `data/profile.json` to show *Last updated*.
Different file name? Change `resume.file` in `profile.json`.

### 13. Update social media links and email
In `data/profile.json` change `github`, `linkedin` and `email`.
Leave `email` as `""` to hide email everywhere; set it to `"you@example.com"` and the email icon, email card and **Contact Me** button (a `mailto:` link) appear.

### 14. Edit descriptions and other text
- Name, headline, intro, typing words, About paragraphs and interests, resume blurb, contact text, page title/description: `data/profile.json`
- Section titles ("Security projects", "Technical skills", …): `index.html` (search for the text, change it between the tags)
- Colours: variables at the top of `style.css` (`--purple`, `--blue`, `--bg`, …)

### 15. Publish changes through GitHub
Edit on GitHub.com (pencil icon on a file → *Commit changes*) or locally with `git add . && git commit -m "Add certificate" && git push`.
Pages rebuilds on its own.

**Tip:** paste your JSON into <https://jsonlint.com> if the page ever shows nothing. A single missing comma breaks a file.

---

## 5. JSON reference with examples

Dates can be `"2026-03"` (shown as *Mar 2026*), `"2026-03-14"` or plain text.
Order in the file = order on the page, so put the newest item first.

### profile.json
Already filled in. The important keys: `name`, `badge`, `headline`, `intro`, `typing` (list), `photo`, `email`, `github`, `linkedin`, `resume.file`, `about.paragraphs`, `about.interests`.

### education.json
```json
{
  "degree": "MSc Cyber Security",
  "institution": "National Forensic Sciences University (NFSU), Goa Campus",
  "location": "Goa, India",
  "duration": "2025 – 2027",
  "status": "Pursuing",
  "cgpa": "7.49",
  "cgpaLabel": "Current CGPA",
  "logo": "assets/images/education/nfsu-logo.png",
  "logoText": "NFSU",
  "notes": "",
  "photos": ["assets/images/education/campus-1.jpg"],
  "visible": true
}
```

### skills.json
```json
{ "categories": [
  { "name": "Security Tools", "icon": "shield", "skills": [
    { "name": "Wazuh", "subtitle": "Open-source SIEM / XDR", "icon": "shield",
      "description": "What it is / how I use it.",
      "evidence": "Deployed a single-node Wazuh lab and wrote custom rules.",
      "screenshots": ["assets/soc-labs/wazuh-dashboard.png"],
      "links": [ { "label": "Related lab", "url": "https://github.com/dipangshu-dey/repo" } ],
      "visible": true }
  ] }
] }
```

### projects.json
```json
{
  "id": "my-new-project",
  "name": "My New Project",
  "subtitle": "One-line tagline",
  "icon": "shield",
  "status": "In progress",
  "description": "Short summary shown on the card.",
  "details": "Longer explanation shown in the project window (optional).",
  "features": ["Feature one", "Feature two"],
  "tech": ["Python", "Flask"],
  "cover": "assets/projects/my-new-project/cover.png",
  "screenshots": ["assets/projects/my-new-project/1.png"],
  "github": "https://github.com/dipangshu-dey/my-new-project",
  "demo": "",
  "visible": true
}
```
Each project gets its own link: `…/#project=my-new-project`. Share that to open it directly.

### labs.json
```json
{
  "focusAreas": ["Wazuh SIEM", "Sysmon"],
  "entries": [
    {
      "title": "Detecting suspicious PowerShell with Sysmon + Wazuh",
      "category": "Sysmon",
      "tools": ["Sysmon", "Wazuh", "PowerShell"],
      "date": "2026-09-14",
      "description": "What the lab was and the setup.",
      "commands": ["Get-WinEvent -LogName 'Microsoft-Windows-Sysmon/Operational' -MaxEvents 20"],
      "screenshots": [ { "src": "assets/soc-labs/sysmon-1.png", "caption": "Process creation event" } ],
      "findings": ["What you observed"],
      "learned": ["What you learned"],
      "visible": true
    }
  ]
}
```
`focusAreas` is shown only while `entries` is empty, and is labelled as areas you are *working toward*.

### experience.json
```json
{
  "role": "Cybersecurity Internship",
  "organization": "Cyber Crime Police Station, Ribandar, Goa Police",
  "location": "Ribandar, Goa",
  "start": "6 July 2026",
  "end": "26 July 2026",
  "description": "A short, accurate summary you are comfortable sharing publicly.",
  "responsibilities": ["Only things you actually did"],
  "learnings": ["What you learned"],
  "photos": [],
  "visible": true
}
```
Be careful with anything related to real cases or confidential police work. Only publish what you are permitted to.

### certificates.json  (certifications and courses)
```json
{
  "title": "Google Cybersecurity Professional Certificate",
  "issuer": "Coursera / Google",
  "category": "course",
  "date": "2026-02",
  "credentialId": "ABC123",
  "description": "Optional one-liner.",
  "image": "assets/certificates/google-cybersecurity.jpg",
  "pdf": "assets/certificates/google-cybersecurity.pdf",
  "verifyUrl": "https://www.coursera.org/account/accomplishments/verify/XXXX",
  "visible": true
}
```
`category` is `"certification"` (professional / security certifications) or `"course"` (courses and training).

### ctf.json
```json
{
  "title": "Pre-Security Learning Path",
  "platform": "TryHackMe",
  "date": "2026-05",
  "description": "What it covered.",
  "image": "assets/certificates/thm-presecurity.png",
  "pdf": "",
  "verifyUrl": "https://tryhackme.com/certificate/THM-XXXX",
  "visible": true
}
```

### gallery.json  (optional; the Gallery section and nav link only appear when this has collections)
```json
{ "collections": [
  {
    "title": "Internship moments",
    "description": "Optional text",
    "layout": "collage",
    "gap": 12,
    "border": true,
    "images": [
      { "src": "assets/images/gallery/a.jpg", "caption": "First day", "size": "big", "focus": "center top" },
      { "src": "assets/images/gallery/b.jpg", "caption": "At the lab" }
    ]
  }
] }
```
- `layout`: `grid`, `masonry`, `collage`, `carousel`, `slideshow` or `featured`.
- Collage extras: per-image `"size": "big" | "wide" | "tall"`, `"focus"` (crop position, any CSS `object-position`), collection-level `gap` (0–40) and `border`.
- Every image opens in the lightbox (zoom, drag, keyboard arrows, swipe, download).

---

## 6. Image tips

- Formats: JPG, PNG, WebP (and PDF for documents). Prefer **WebP or JPG**.
- Keep images under ~300 KB where you can: certificates around 1600 px wide, screenshots around 1600 px, project covers 1280×720, profile photo 800×1000. Free tools: squoosh.app or any "compress image" site.
- Images load lazily and fall back to a neutral placeholder if a file name is wrong, which is a good hint to check the path and capitalisation.
- Icon names for `"icon"` fields: `shield lock terminal code database globe network activity search bug scale file-text graduation-cap briefcase award flag target monitor layers alert fingerprint bar-chart cpu book image`.

---

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| Blank page or "Content could not be loaded" | Open through a server (section 2), or check the `data/` folder was uploaded. Validate JSON at jsonlint.com. |
| An image shows the grey placeholder | Wrong path or file name case. Compare the JSON path with the real file path exactly. |
| Changes don't appear on GitHub Pages | Wait 1–2 min, then hard refresh. Check *Actions* tab for a failed deployment. |
| Resume says "coming soon" | `assets/resume/resume.pdf` is missing, or `resume.file` in `profile.json` points elsewhere. |
| Intro animation doesn't replay | It shows once per browser per week by design. Clear site data or use a private window to see it again. |
| Animations feel too much | The site already disables them for visitors with "reduce motion" turned on in their OS. |

---

## 8. What is real and what is placeholder

**Real, from you:** name, education (MSc NFSU Goa 2025–2027 with CGPA 7.49; BCA 2022–2025 with CGPA 6.39), the internship at Cyber Crime Police Station, Ribandar (6–26 July 2026), the three projects with the features and tech you listed, skill names, GitHub and LinkedIn links.

**Placeholders to replace (nothing fake is displayed as real):**
- Profile photo: silhouette until `profile.jpg` exists.
- NFSU and college logos: text badges until you add the logo files (official logos were not bundled because they must come from the institutions).
- Project covers and screenshots: styled cover tiles until you add images.
- Resume: "Resume coming soon" until `resume.pdf` exists.
- Email: hidden until you set `email`.
- Project GitHub / demo links: hidden until you add real URLs.
- SOC labs, certificates, CTF entries: empty-state messages (and zero counts) until you add real entries.
- Internship description: "will be added soon" until you write it.

There is **no contact form** (a static site has no server to receive it). Contact is via LinkedIn, GitHub and a `mailto:` link.


## Newly added personal content

- LinkedIn profile updated to `https://www.linkedin.com/in/dipangshu-dey-251a80264`.
- Four certificates added to `data/certificates.json` and `assets/certificates/`:
  - ThunderCipher Certified VAPT Practitioner (TC-VAPT)
  - Google Cybersecurity Professional Certificate
  - Certified Network Security Practitioner (CNSP), with Merit
  - Certified Blue Team Practitioner (CBTP), with Merit
- Education cards now point to replaceable institution wordmark SVGs in `assets/images/education/`.

**Logo note:** The included education SVGs are clean text-based placeholders, not official institution emblems. Replace them with official logo files if you have approved copies.


## Latest requested updates

- The welcome intro now appears on every fresh page load (it still respects reduced-motion settings).
- Education cards use the exact NFSU and M.E.S. Vasant Joshi College logo images supplied by the owner:
  - `assets/images/education/nfsu-official-logo.png`
  - `assets/images/education/mes-vasant-joshi-official-logo.jpg`
- The SecureAuthProject card has been removed.
- The BitTrace project title is now **BitTrace — Bitcoin Transaction Forensics and Investigation System**.
- The two remaining project covers and titles link to their in-page project detail views.
- GitHub Profile links are provided on both project cards and in a separate GitHub call-to-action card. These link to the supplied GitHub profile, not to an unprovided project repository URL. Replace them with individual repository URLs once those are available.


## Profile photo, BitTrace logo and project repository links

- Profile photograph: `assets/images/profile/dipangshu-profile.jpg`
- BitTrace project logo/cover: `assets/projects/bittrace-v2/bittrace-logo.png`
- BitTrace repository: `https://github.com/dipangshu-dey/BitTrace`
- PhishGuard X repository: `https://github.com/dipangshu-dey/PhishGuard-X`

The **View Project** buttons now open each project's own GitHub repository. **Project Details** opens the portfolio's internal detail modal. The project detail modal also links to that project's own repository.


## Blogs & Security Write-ups

A new **Blogs & Write-ups** section is available in the main navigation. It supports:
- TryHackMe / Hack The Box machine-solving walkthroughs
- CTF challenge write-ups
- Vulnerability assessment and penetration-testing reports
- SOC investigations and incident analysis
- Malware analysis and security research
- Technical tutorials and learning notes

The section includes keyword search, category filtering, article detail views, publication date, tags, cover images, code blocks, screenshots, PDF attachments and reference links.

### How to add a blog post

1. Put article screenshots in `assets/blogs/images/`.
2. Put PDF reports in `assets/blogs/reports/`.
3. Open `data/blogs.json`.
4. Add a new object inside the `posts` array.
5. Save and push the updated files to GitHub.

Example post:

```json
{
  "id": "tryhackme-example-machine",
  "title": "TryHackMe – Example Machine Write-up",
  "description": "A walkthrough documenting enumeration, analysis, findings and lessons learned.",
  "category": "TryHackMe",
  "date": "2026-11-16",
  "readTime": "8 min read",
  "tags": ["Linux", "Enumeration", "Privilege Escalation"],
  "cover": "assets/blogs/images/example-cover.png",
  "visible": true,
  "blocks": [
    { "type": "heading", "level": 2, "text": "1. Introduction" },
    { "type": "paragraph", "text": "Describe the machine, scope and objective of this write-up." },
    { "type": "heading", "level": 2, "text": "2. Enumeration" },
    { "type": "paragraph", "text": "Document the steps you performed and the observations you made." },
    { "type": "code", "language": "bash", "caption": "Example command", "code": "nmap -sV -sC TARGET" },
    { "type": "image", "src": "assets/blogs/images/enumeration.png", "alt": "Enumeration result", "caption": "Enumeration screenshot" },
    { "type": "list", "items": ["Finding one", "Finding two", "Lesson learned"] },
    { "type": "pdf", "src": "assets/blogs/reports/example-report.pdf", "label": "View full PDF report" }
  ],
  "attachments": [
    { "label": "Download report PDF", "url": "assets/blogs/reports/example-report.pdf" }
  ],
  "references": [
    { "label": "Official room or challenge page", "url": "https://example.com" }
  ]
}
```

Supported article block types: `heading`, `paragraph`, `list`, `code`, `image`, `pdf`, and `link`.

**Publishing note:** This is a static GitHub Pages site. Blog posts are added by editing `data/blogs.json` and uploading the related assets to the repository. There is no admin dashboard or server-side editor.


## Newly added CTF participation certificates

Three CTF participation certificates have been added under **Certifications → CTF & Practical Challenges**:
- Trisec CTF 2026 — NFSU Goa Campus (22 January 2026)
- SecLeaf Q4 Operations CTF (31 October 2026; Lone_warrior, Rank 134)
- LUN4R CTF 2026 Qualifiers — ROOT RIET (20 September 2026)

Certificate images are stored in `assets/certificates/ctf/` and entries are maintained in `data/ctf.json`.


## Homepage stats clarification

The homepage now shows separate counts for:
- Certifications: entries in `data/certificates.json` with category `certification`.
- Courses & Training: entries in `data/certificates.json` with category `course`.
- CTF & Practical Challenges: entries in `data/ctf.json`.
- Projects: featured projects in `data/projects.json`.

The Projects section heading and homepage statistic are both labelled simply **Projects**.


## Profile photo and certificate preview update

- Updated the homepage profile photo using the latest supplied JPEG.
- Added JPEG previews for the Google Cybersecurity Professional Certificate, CNSP and CBTP certificates.
- Kept the original PDF files and their download links. Certificate cards now preview the JPEG images instead of embedding the PDFs in an iframe, while the separate PDF action remains available for viewing/downloading the original document.
